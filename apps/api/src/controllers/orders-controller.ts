import { Request, Response, NextFunction } from 'express';
import { MidtransClient } from 'midtrans-node-client';
import { prisma } from '../configs/prisma.js';
import { v4 as uuid } from 'uuid';
import cloudinary from '../configs/cloudinary.js';
import fs from 'node:fs/promises';
import { OrderStatus, PaymentMethodType, typeOfChange } from '@prisma/client';
import { Product } from '../types/express.js';

const snap = new MidtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

/* -------------------------------------------------------------------------- */
/*                                  COSTUMER                                  */
/* -------------------------------------------------------------------------- */
export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
  paymentMethodType: PaymentMethodType,
) => {
  try {
    const userId = req.user?.id;
    const storeId = req.params.id;

    if (!storeId) {
      res.status(400).json({ error: 'Store ID is required' });
      return;
    }

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const BuyerCustomer = await prisma.user.findUnique({
      where: { id: userId, role: 'CUSTOMERS' },
    });

    if (!BuyerCustomer) {
      res.status(404).json({ error: 'BuyerCustomer not found' });
      return;
    }

    const cartBuyerCustomer = await prisma.cart.findUnique({
      where: { userId: userId },
    });

    if (!cartBuyerCustomer) {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }

    const hasilBelanjaan = await prisma.cartItem.findMany({
      where: { cartId: cartBuyerCustomer.id },
      include: {
        storeProduct: {
          include: { product: true },
        },
      },
    });

    if (hasilBelanjaan.length === 0) {
      res.status(400).json({ error: 'No items in the cart' });
      return;
    }

    const totalHasilBelanjaan = hasilBelanjaan.reduce((acc, item) => {
      return acc + item.total;
    }, 0);

    if (totalHasilBelanjaan === 0) {
      res.status(400).json({ error: 'No items in the cart' });
      return;
    }

    // Select courier details
    const {
      courierName,
      code,
      serviceType,
      description,
      shippingCost,
      estimatedTime,
    } = req.body;

    if (
      !courierName ||
      !serviceType ||
      !shippingCost ||
      !code ||
      !description ||
      !estimatedTime
    ) {
      res
        .status(400)
        .json({ error: 'Courier name, service, and cost are required' });
      return;
    }

    // Find shipping address
    const shippingAddress = await prisma.address.findFirst({
      where: { userId: userId, isActive: true },
    });

    if (!shippingAddress) {
      res.status(400).json({ error: 'No primary shipping address found' });
      return;
    }

    // Create slug
    const createSlug = (input: string): string => {
      const randomNumber = Math.floor(Math.random() * 1000);
      const formattedRandomNumber = randomNumber.toString().padStart(3, '0');
      const fullInput = `${input}-${formattedRandomNumber}`;
      return fullInput.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    };

    const orderId = uuid();

    const newOrder = await prisma.order.create({
      data: {
        id: +orderId,
        userId: userId,
        storeId: +storeId,
        shippingAddressId: shippingAddress.id,
        totalAmount: totalHasilBelanjaan + shippingCost,
        slug: createSlug('ORDER'),
        paymentMethodType: paymentMethodType,
        status: OrderStatus.WAITING_FOR_PAYMENT,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await prisma.orderItem.createMany({
      data: hasilBelanjaan.map((item) => ({
        orderId: newOrder.id,
        storeProductId: item.storeProductId,
        productId: item.storeProduct.productId,
        price: Number(item.price),
        quantity: item.quantity,
        total: Number(item.total),
      })),
    });

    for (const item of hasilBelanjaan) {
      const storeProductId = item.storeProductId;
      const quantityPurchased = item.quantity;

      await prisma.storeProduct.update({
        where: { id: storeProductId },
        data: {
          stock: {
            decrement: quantityPurchased,
          },
        },
      });
    }

    await prisma.cartItem.deleteMany({
      where: { cartId: cartBuyerCustomer.id },
    });

    const extractFirstNumber = (str: string): number | null => {
      const match = str.match(/\d+/);
      return match ? parseInt(match[0], 10) : null;
    };
    let firstNumberEstimatedTime = extractFirstNumber(estimatedTime);
    if (firstNumberEstimatedTime === null) {
      console.warn('No valid number found in estimatedTime:', estimatedTime);
      firstNumberEstimatedTime = 0;
    }

    await prisma.shippingCost.create({
      data: {
        courierName: courierName,
        code: code,
        serviceType: serviceType,
        description: description,
        shippingCost: shippingCost,
        estimatedTime: firstNumberEstimatedTime,
      },
    });

    return newOrder;
  } catch (error) {
    console.error('Error during order creation:', error);
    next(error);
  }
};

export const payWithBankTransfer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newOrder = await createOrder(
      req,
      res,
      next,
      PaymentMethodType.BANK_TRANSFER,
    );

    if (!newOrder) {
      res.status(400).json({ error: 'Order creation failed' });
      return;
    }

    res.status(201).json({ ok: true, data: { order: newOrder } });
  } catch (error) {
    console.error('Error during bank transfer payment:', error);
    next(error);
  }
};

export const payWithMidTrans = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newOrder = await createOrder(
      req,
      res,
      next,
      PaymentMethodType.MIDTRANS,
    );

    if (!newOrder) {
      res.status(400).json({ error: 'Order creation failed' });
      return;
    }

    const customer = await prisma.user.findUnique({
      where: { id: newOrder.userId },
    });

    if (!customer) {
      res.status(400).json({ error: 'User not found' });
      return;
    }

    const orderItems = await prisma.orderItem.findMany({
      where: { orderId: newOrder.id },
      include: { storeProduct: { include: { product: true } } },
    });

    if (!orderItems) {
      res.status(400).json({ error: 'Order items not found' });
      return;
    }

    const item_details = orderItems.map((item) => ({
      id: item.productId!,
      name: item.storeProduct.product.name,
      price: (item.storeProduct.product as Product).price,
      quantity: item.quantity,
    }));

    const parameter = {
      transaction_details: {
        order_id: newOrder.id.toString(),
        gross_amount: newOrder.totalAmount,
      },
      item_details,
      customer_details: {
        first_name: customer.name,
        email: customer.email,
      },
      callbacks: {
        finish: 'http://localhost:3000',
      },
    };

    const transaction = await snap.createTransaction(parameter);

    res.status(201).json({ ok: true, data: { order: newOrder, transaction } });
  } catch (error) {
    console.error('Error during Midtrans payment:', error);
    next(error);
  }
};

export const uploadPaymentProof = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orderSlug } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // --------------------------------------------------------------------------

    // FIND ORDER
    const orderUser = await prisma.order.findFirst({
      where: {
        userId: userId,
        slug: orderSlug,
      },
    });

    if (!orderUser) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    // --------------------------------------------------------------------------
    let paymentProofUrl = null;

    if (req.file?.path) {
      try {
        const cloudinaryData = await cloudinary.uploader.upload(req.file.path, {
          folder: 'order_transfers',
        });
        paymentProofUrl = cloudinaryData.secure_url;
        await fs.unlink(req.file.path);
      } catch (uploadError) {
        console.error('Error uploading image to Cloudinary:', uploadError);
        res.status(500).json({ error: 'Failed to upload payment proof image' });
        return;
      }
    } else {
      res.status(400).json({ error: 'No payment proof image provided' });
      return;
    }

    await prisma.order.update({
      where: { id: orderUser.id },
      data: {
        paymentProof: paymentProofUrl,
        status: OrderStatus.PENDING_PAYMENT,
      },
    });

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const cancelOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orderSlug } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const orderCostumer = await prisma.order.findFirst({
      where: {
        slug: orderSlug,
      },
    });

    if (!orderCostumer) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const allowedStatuses: OrderStatus[] = [
      OrderStatus.WAITING_FOR_PAYMENT,
      OrderStatus.PENDING_PAYMENT,
      OrderStatus.PAYMENT_DECLINED,
    ];

    if (!allowedStatuses.includes(orderCostumer.status)) {
      res
        .status(400)
        .json({ error: 'Order cannot be cancelled in the current status' });
      return;
    }

    await prisma.order.update({
      where: { id: orderCostumer.id },
      data: {
        status: OrderStatus.CANCELLED,
      },
    });

    const BelanjaanCostumer = await prisma.orderItem.findMany({
      where: {
        orderId: orderCostumer.id,
      },
    });

    if (!BelanjaanCostumer) {
      res.status(404).json({ error: 'Belanjaan not found' });
      return;
    }

    for (const item of BelanjaanCostumer) {
      await prisma.storeProduct.update({
        where: { id: item.storeProductId },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });
    }

    await prisma.orderItem.deleteMany({
      where: {
        orderId: orderCostumer.id,
      },
    });

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const orderConfirmed = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orderSlug } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const orderCostumer = await prisma.order.findFirst({
      where: {
        slug: orderSlug,
      },
    });

    if (!orderCostumer) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    await prisma.order.update({
      where: { id: orderCostumer.id },
      data: {
        status: OrderStatus.COMPLETED,
      },
    });
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getAllOrderCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: true,
      },
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
/* -------------------------------------------------------------------------- */
/*                                 STOREADMIN & SUPERADMIN                                */
/* -------------------------------------------------------------------------- */

export const getAllOrdersStatusPending = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        status: OrderStatus.PENDING_PAYMENT,
      },
      include: {
        user: true,
      },
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const seePaymentProof = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orderSlug } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const orderCostumer = await prisma.order.findFirst({
      where: {
        slug: orderSlug,
      },
      select: {
        paymentProof: true,
      },
    });

    if (!orderCostumer) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res
      .status(200)
      .json({ ok: true, data: { paymentProof: orderCostumer.paymentProof } });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const acceptPaymentProof = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orderSlug } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const orderCostumer = await prisma.order.findFirst({
      where: {
        slug: orderSlug,
      },
    });

    if (!orderCostumer) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    await prisma.order.update({
      where: { id: orderCostumer.id },
      data: {
        status: OrderStatus.PAID,
      },
    });

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const rejectPaymentProof = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orderSlug } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const orderCostumer = await prisma.order.findFirst({
      where: {
        slug: orderSlug,
      },
    });

    if (!orderCostumer) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    await prisma.order.update({
      where: { id: orderCostumer.id },
      data: {
        status: OrderStatus.PAYMENT_DECLINED,
      },
    });

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const processOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orderSlug } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const orderCostumer = await prisma.order.findFirst({
      where: {
        slug: orderSlug,
      },
      include: {
        orderItems: {
          include: {
            storeProduct: {
              include: {
                product: {
                  include: {
                    CategoryProduct: {
                      include: {
                        Category: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!orderCostumer) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    // Persiapkan data untuk createMany
    const productChangesData = orderCostumer.orderItems.map((item) => ({
      orderId: orderCostumer.id,
      userId: userId,
      productId: item.storeProduct.product.id,
      stock: item.quantity,
      lastStock: item.storeProduct.stock,
      typeOfChange: typeOfChange.PEMBELIAN,
    }));

    // Insert data perubahan produk
    await prisma.productChangeData.createMany({
      data: productChangesData,
    });

    // Update status order menjadi PROCESSING
    await prisma.order.update({
      where: { id: orderCostumer.id },
      data: {
        status: 'PROCESSING',
      },
    });

    res.status(200).json({ message: 'Order processed successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const sentOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orderSlug } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const orderCostumer = await prisma.order.findFirst({
      where: {
        slug: orderSlug,
      },
    });

    if (!orderCostumer) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const shippedOrder = await prisma.order.update({
      where: { id: orderCostumer.id },
      data: {
        status: OrderStatus.SHIPPED,
        shippingAt: new Date(),
      },
    });

    if (!shippedOrder) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getAllOrderHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { month, year, storeId } = req.query;

    const parsedMonth = parseInt(month as string, 10);
    const parsedYear = parseInt(year as string, 10);

    if (isNaN(parsedMonth) || isNaN(parsedYear)) {
      res.status(400).json({ error: 'Month and Year must be valid numbers' });
      return;
    }

    const startDate = new Date(parsedYear, parsedMonth - 1, 1);
    const endDate = new Date(parsedYear, parsedMonth, 0, 23, 59, 59, 999);

    const orders = await prisma.order.findMany({
      where: {
        ...(storeId ? { storeId: Number(storeId) } : {}),
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
        store: {
          select: { id: true, name: true },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const formatted = orders.map((order) => ({
      orderId: order.id,
      user: order.user.name,
      status: order.status,
      tanggal: order.createdAt.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      store: order.store.name,
      slug: order.slug,
    }));

    res.status(200).json({ ok: true, data: formatted });
  } catch (error) {
    console.error('Error getting order history:', error);
    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/*                            FOR CUSTOMER & ADMIN                            */
/* -------------------------------------------------------------------------- */
export const getOrderDetail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { slug } = req.params;

    const order = await prisma.order.findFirst({
      where: { slug },
      include: {
        user: { select: { name: true } },
        store: { select: { name: true } },
        orderItems: {
          include: {
            storeProduct: {
              include: {
                product: {
                  include: {
                    ProductImages: { select: { imageUrl: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const formattedItems = order.orderItems.map((item) => {
      const product = item.storeProduct.product;
      const image = product.ProductImages[0]?.imageUrl || null;

      return {
        name: product.name,
        pricePerItem: item.price,
        quantity: item.quantity,
        total: item.total,
        image,
      };
    });

    const totalFromItems = order.orderItems.reduce((acc, item) => {
      return acc + item.total;
    }, 0);

    res.status(200).json({
      ok: true,
      data: {
        customerName: order.user.name,
        storeName: order.store.name,
        status: order.status,
        totalAmount: order.totalAmount,
        totalCalculated: totalFromItems,
        items: formattedItems,
      },
    });
  } catch (error) {
    console.error('Error getting order detail:', error);
    next(error);
  }
};

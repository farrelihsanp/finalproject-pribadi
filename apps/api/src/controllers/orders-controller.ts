import { Request, Response, NextFunction } from 'express';
import { MidtransClient } from 'midtrans-node-client';
import { prisma } from '../configs/prisma.js';
import { v4 as uuid } from 'uuid';
import cloudinary from '../configs/cloudinary.js';
import fs from 'node:fs/promises';
import { OrderStatus, PaymentMethodType } from '@prisma/client';

const snap = new MidtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

// CreateOrder Controller
export const CreateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
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
      include: { product: true },
    });

    if (hasilBelanjaan.length === 0) {
      res.status(400).json({ error: 'No items in the cart' });
      return;
    }

    const totalHasilBelanjaan = hasilBelanjaan.reduce(
      (accumulator, currentItem) => {
        return accumulator + currentItem.total;
      },
      0,
    );

    if (totalHasilBelanjaan === 0) {
      res.status(400).json({ error: 'No items in the cart' });
      return;
    }

    /* -------------------------------------------------------------------------- */
    /*                                 PILIH KURIR                                */
    /* -------------------------------------------------------------------------- */

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

    await prisma.shippingCost.create({
      data: {
        cartId: cartBuyerCustomer.id,
        courierName: courierName,
        code: code,
        serviceType: serviceType,
        description: description,
        shippingCost: shippingCost,
        estimatedTime: estimatedTime,
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                              SHIPPING ADDRESS                              */
    /* -------------------------------------------------------------------------- */
    const shippingAddress = await prisma.address.findFirst({
      where: { userId: userId, isActive: true },
    });

    if (!shippingAddress) {
      res.status(400).json({ error: 'No primary shipping address found' });
      return;
    }

    // -------------------------------------------------------------------------- */
    /*                                   CART ITEMS                               */
    /* -------------------------------------------------------------------------- */
    const cartItems = hasilBelanjaan.map((item) => ({
      productId: item.productId,
      productName: item.product.name,
      price: Number(item.product.price),
      quantity: item.quantity,
      total: Number(item.total),
    }));

    const orderId = uuid();

    const createSlug = (input: string): string => {
      const randomNumber = Math.floor(Math.random() * 1000);
      const formattedRandomNumber = randomNumber.toString().padStart(3, '0');
      const fullInput = `${input}-${formattedRandomNumber}`;
      return fullInput.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    };

    const newOrder = await prisma.order.create({
      data: {
        id: +orderId,
        userId: userId,
        storeId: +storeId,
        shippingAddressId: shippingAddress.id,
        shippingCost: shippingCost,
        totalAmount: totalHasilBelanjaan + shippingCost,
        slug: createSlug('ORDER'),
        paymentMethodType: PaymentMethodType.UNSET,
        status: OrderStatus.PENDING_PAYMENT,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await prisma.orderItem.createMany({
      data: cartItems.map((item) => ({
        orderId: newOrder.id,
        productId: item.productId,
        price: item.price,
        quantity: item.quantity,
        total: item.total,
      })),
    });

    await prisma.cartItem.deleteMany({
      where: { cartId: cartBuyerCustomer.id },
    });

    res.status(201).json({ ok: true, data: { order: newOrder } });
  } catch (error) {
    console.error('Error during order creation:', error);
    next(error);
  }
};

// Midtrans Controller
export const CreateOrderMidtrans = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Create the order using the CreateOrder function
    const orderResponse = await CreateOrder(req, res, next);
    if (!orderResponse.ok) {
      return res.status(orderResponse.status).json(orderResponse);
    }

    const newOrder = orderResponse.data.order;

    // -------------------------------------------------------------------------- */
    /*                                   PAYMENT                                   */
    /* -------------------------------------------------------------------------- */
    const item_details = newOrder.orderItems.map((item) => ({
      id: item.productId,
      name: item.productName,
      price: item.price,
      quantity: item.quantity,
    }));

    const parameter = {
      transaction_details: {
        order_id: newOrder.id.toString(),
        gross_amount: newOrder.totalAmount,
      },
      item_details: item_details,
      customer_details: {
        full_name: newOrder.user.name,
        email: newOrder.user.email,
      },
      callbacks: {
        finish: 'http://localhost:3000',
      },
    };

    const transaction = await snap.createTransaction(parameter);

    // Update the order with payment method type
    await prisma.order.update({
      where: { id: newOrder.id },
      data: {
        paymentMethodType: PaymentMethodType.MIDTRANS,
      },
    });

    res.status(201).json({ ok: true, data: { order: newOrder, transaction } });
  } catch (error) {
    console.error('Error during Midtrans payment:', error);
    next(error);
  }
};

// Bank Transfer Controller
export const CreateOrderTransfer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Create the order using the CreateOrder function
    const orderResponse = await CreateOrder(req, res, next);
    if (!orderResponse.ok) {
      return res.status(orderResponse.status).json(orderResponse);
    }

    const newOrder = orderResponse.data.order;

    // -------------------------------------------------------------------------- */
    /*                                   PAYMENT                                   */
    /* -------------------------------------------------------------------------- */
    let cloudinaryData;
    const defaultImageUrl =
      'https://res.cloudinary.com/dm1cnsldc/image/upload/v1739728940/event/images/s6x3zkhiibcahfndhmxe.jpg';

    if (req.file) {
      try {
        cloudinaryData = await cloudinary.uploader.upload(req.file.path, {
          folder: 'order_transfers',
        });
        await fs.unlink(req.file.path);
      } catch (uploadError) {
        console.error('Error uploading image to Cloudinary:', uploadError);
        cloudinaryData = { secure_url: defaultImageUrl }; // Use default image on error
      }
    } else {
      cloudinaryData = { secure_url: defaultImageUrl }; // Use default image if no file
    }

    // Update the order with payment proof and payment method type
    await prisma.order.update({
      where: { id: newOrder.id },
      data: {
        paymentProof: cloudinaryData.secure_url,
        paymentMethodType: PaymentMethodType.BANK_TRANSFER,
      },
    });

    res.status(201).json({ ok: true, data: { order: newOrder } });
  } catch (error) {
    console.error('Error during bank transfer payment:', error);
    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/*                                 BACKUP CODE                                */
/* -------------------------------------------------------------------------- */

// import { Request, Response, NextFunction } from 'express';
// import { MidtransClient } from 'midtrans-node-client';
// import { prisma } from '../configs/prisma.js';
// import { v4 as uuid } from 'uuid';
// import cloudinary from '../configs/cloudinary.js';
// import fs from 'node:fs/promises';
// import { OrderStatus, PaymentMethodType } from '@prisma/client';

// const snap = new MidtransClient.Snap({
//   isProduction: false,
//   serverKey: process.env.MIDTRANS_SERVER_KEY,
// });

// export const CreateOrderMidtrans = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const userId = req.user?.id;
//     const storeId = req.params.id;

//     if (!storeId) {
//       res.status(400).json({ error: 'Store ID is required' });
//       return;
//     }

//     if (!userId) {
//       res.status(401).json({ error: 'Unauthorized' });
//       return;
//     }

//     const BuyerCustomer = await prisma.user.findUnique({
//       where: { id: userId, role: 'CUSTOMERS' },
//     });

//     if (!BuyerCustomer) {
//       res.status(404).json({ error: 'BuyerCustomer not found' });
//       return;
//     }

//     const cartBuyerCustomer = await prisma.cart.findUnique({
//       where: { userId: userId },
//     });

//     if (!cartBuyerCustomer) {
//       res.status(404).json({ error: 'Cart not found' });
//       return;
//     }

//     const hasilBelanjaan = await prisma.cartItem.findMany({
//       where: { cartId: cartBuyerCustomer.id },
//       include: { product: true },
//     });

//     if (hasilBelanjaan.length === 0) {
//       res.status(400).json({ error: 'No items in the cart' });
//       return;
//     }

//     const totalHasilBelanjaan = hasilBelanjaan.reduce(
//       (accumulator, currentItem) => {
//         return accumulator + currentItem.total;
//       },
//       0,
//     );

//     if (totalHasilBelanjaan === 0) {
//       res.status(400).json({ error: 'No items in the cart' });
//       return;
//     }

//     /* -------------------------------------------------------------------------- */
//     /*                                 PILIH KURIR                                */
//     /* -------------------------------------------------------------------------- */

//     const {
//       courierName,
//       code,
//       serviceType,
//       description,
//       shippingCost,
//       estimatedTime,
//     } = req.body;

//     if (
//       !courierName ||
//       !serviceType ||
//       !shippingCost ||
//       !code ||
//       !description ||
//       !estimatedTime
//     ) {
//       res
//         .status(400)
//         .json({ error: 'Courier name, service, and cost are required' });
//       return;
//     }

//     await prisma.shippingCost.create({
//       data: {
//         cartId: cartBuyerCustomer.id,
//         courierName: courierName,
//         code: code,
//         serviceType: serviceType,
//         description: description,
//         shippingCost: shippingCost,
//         estimatedTime: estimatedTime,
//       },
//     });

//     /* -------------------------------------------------------------------------- */
//     /*                              SHIPPING ADDRRESS                              */
//     /* -------------------------------------------------------------------------- */
//     const shippingAddress = await prisma.address.findFirst({
//       where: { userId: userId, isActive: true },
//     });

//     if (!shippingAddress) {
//       res.status(400).json({ error: 'No primary shipping address found' });
//       return;
//     }

//     // -------------------------------------------------------------------------- */
//     /*                                   PAYMENT                                   */
//     /* -------------------------------------------------------------------------- */
//     const cartItems = hasilBelanjaan.map((item) => ({
//       productId: item.productId,
//       productName: item.product.name,
//       price: Number(item.product.price),
//       quantity: item.quantity,
//       orderId: newOrder.id,
//       total: Number(item.total),
//     }));

//     const item_details = cartItems.map((item) => ({
//       id: item.productId,
//       name: item.productName,
//       price: item.price,
//       quantity: item.quantity,
//     }));

//     const orderId = uuid();

//     const parameter = {
//       transaction_details: {
//         order_id: orderId,
//         gross_amount: totalHasilBelanjaan + shippingCost,
//       },
//       item_details: item_details,
//       customer_details: {
//         full_name: BuyerCustomer.name,
//         email: BuyerCustomer.email,
//       },
//       callbacks: {
//         finish: 'http://localhost:3000',
//       },
//     };

//     const transaction = await snap.createTransaction(parameter);

//     /* -------------------------------------------------------------------------- */
//     /*                                CREATE ORDER                                */
//     /* -------------------------------------------------------------------------- */

//     const createSlug = (input: string): string => {
//       const randomNumber = Math.floor(Math.random() * 1000);
//       const formattedRandomNumber = randomNumber.toString().padStart(3, '0');
//       const fullInput = `${input}-${formattedRandomNumber}`;
//       return fullInput.toLowerCase().replace(/[^a-z0-9]+/g, '-');
//     };

//     const newOrder = await prisma.order.create({
//       data: {
//         id: +orderId,
//         userId: userId,
//         storeId: +storeId,
//         shippingAddressId: shippingAddress.id,
//         shippingCost: shippingCost,
//         totalAmount: totalHasilBelanjaan + shippingCost,
//         slug: createSlug('ORDER'),
//         paymentMethodType: PaymentMethodType.MIDTRANS,
//         status: OrderStatus.PENDING_PAYMENT,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     });

//     await prisma.orderItem.createMany({
//       data: {
//         orderId: newOrder.id,
//         productId: +cartItems.map((item) => item.productId),
//         price: +cartItems.map((item) => item.price),
//         quantity: +cartItems.map((item) => item.quantity),
//         total: +cartItems.map((item) => item.total),
//       },
//     });

//     await prisma.cartItem.deleteMany({
//       where: { cartId: cartBuyerCustomer.id },
//     });

//     res.status(201).json({ ok: true, data: { order: newOrder, transaction } });
//   } catch (error) {
//     console.error('Error during checkout:', error);
//     next(error);
//   }
// };

// export const CreateOrderTransfer = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const userId = req.user?.id;
//     const storeId = req.params.id;

//     if (!storeId) {
//       res.status(400).json({ error: 'Store ID is required' });
//       return;
//     }

//     if (!userId) {
//       res.status(401).json({ error: 'Unauthorized' });
//       return;
//     }

//     const BuyerCustomer = await prisma.user.findUnique({
//       where: { id: userId, role: 'CUSTOMERS' },
//     });

//     if (!BuyerCustomer) {
//       res.status(404).json({ error: 'BuyerCustomer not found' });
//       return;
//     }

//     const cartBuyerCustomer = await prisma.cart.findUnique({
//       where: { userId: userId },
//     });

//     if (!cartBuyerCustomer) {
//       res.status(404).json({ error: 'Cart not found' });
//       return;
//     }

//     const hasilBelanjaan = await prisma.cartItem.findMany({
//       where: { cartId: cartBuyerCustomer.id },
//       include: { product: true },
//     });

//     if (hasilBelanjaan.length === 0) {
//       res.status(400).json({ error: 'No items in the cart' });
//       return;
//     }

//     const totalHasilBelanjaan = hasilBelanjaan.reduce(
//       (accumulator, currentItem) => {
//         return accumulator + currentItem.total;
//       },
//       0,
//     );

//     if (totalHasilBelanjaan === 0) {
//       res.status(400).json({ error: 'No items in the cart' });
//       return;
//     }

//     /* -------------------------------------------------------------------------- */
//     /*                                 PILIH KURIR                                */
//     /* -------------------------------------------------------------------------- */

//     const {
//       courierName,
//       code,
//       serviceType,
//       description,
//       shippingCost,
//       estimatedTime,
//     } = req.body;

//     if (
//       !courierName ||
//       !serviceType ||
//       !shippingCost ||
//       !code ||
//       !description ||
//       !estimatedTime
//     ) {
//       res
//         .status(400)
//         .json({ error: 'Courier name, service, and cost are required' });
//       return;
//     }

//     await prisma.shippingCost.create({
//       data: {
//         cartId: cartBuyerCustomer.id,
//         courierName: courierName,
//         code: code,
//         serviceType: serviceType,
//         description: description,
//         shippingCost: shippingCost,
//         estimatedTime: estimatedTime,
//       },
//     });

//     /* -------------------------------------------------------------------------- */
//     /*                              SHIPPING ADDRRESS                              */
//     /* -------------------------------------------------------------------------- */
//     const shippingAddress = await prisma.address.findFirst({
//       where: { userId: userId, isActive: true },
//     });

//     if (!shippingAddress) {
//       res.status(400).json({ error: 'No primary shipping address found' });
//       return;
//     }

//     // -------------------------------------------------------------------------- */
//     /*                                   PAYMENT                                   */
//     /* -------------------------------------------------------------------------- */
//     const cartItems = hasilBelanjaan.map((item) => ({
//       productId: item.productId,
//       productName: item.product.name,
//       price: Number(item.product.price),
//       quantity: item.quantity,
//       orderId: newOrder.id,
//       total: Number(item.total),
//     }));

//     /* -------------------------------------------------------------------------- */
//     /*                                CREATE ORDER                                */
//     /* -------------------------------------------------------------------------- */

//     let cloudinaryData;
//     const defaultImageUrl =
//       'https://res.cloudinary.com/dm1cnsldc/image/upload/v1739728940/event/images/s6x3zkhiibcahfndhmxe.jpg';

//     if (req.file) {
//       try {
//         cloudinaryData = await cloudinary.uploader.upload(req.file.path, {
//           folder: 'order_transfers',
//         });
//         await fs.unlink(req.file.path);
//       } catch (uploadError) {
//         console.error('Error uploading image to Cloudinary:', uploadError);
//         cloudinaryData = { secure_url: defaultImageUrl }; // Use default image on error
//       }
//     } else {
//       cloudinaryData = { secure_url: defaultImageUrl }; // Use default image if no file
//     }

//     const createSlug = (input: string): string => {
//       const randomNumber = Math.floor(Math.random() * 1000);
//       const formattedRandomNumber = randomNumber.toString().padStart(3, '0');
//       const fullInput = `${input}-${formattedRandomNumber}`;
//       return fullInput.toLowerCase().replace(/[^a-z0-9]+/g, '-');
//     };

//     const orderId = uuid();
//     const newOrder = await prisma.order.create({
//       data: {
//         id: +orderId,
//         userId: userId,
//         storeId: +storeId,
//         shippingAddressId: shippingAddress.id,
//         shippingCost: shippingCost,
//         totalAmount: totalHasilBelanjaan + shippingCost,
//         slug: createSlug('ORDER'),
//         paymentProof: cloudinaryData.secure_url,
//         // ---
//         paymentMethodType: PaymentMethodType.BANK_TRANSFER,
//         status: OrderStatus.PENDING_PAYMENT,
//         // ---
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     });

//     await prisma.orderItem.createMany({
//       data: {
//         orderId: newOrder.id,
//         productId: +cartItems.map((item) => item.productId),
//         price: +cartItems.map((item) => item.price),
//         quantity: +cartItems.map((item) => item.quantity),
//         total: +cartItems.map((item) => item.total),
//       },
//     });

//     await prisma.cartItem.deleteMany({
//       where: { cartId: cartBuyerCustomer.id },
//     });

//     res.status(201).json({ ok: true, data: { order: newOrder } });
//   } catch (error) {
//     console.error('Error during checkout:', error);
//     next(error);
//   }
// };

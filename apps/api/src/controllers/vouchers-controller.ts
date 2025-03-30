import { NextFunction, Request, Response } from 'express';
import { prisma } from '../configs/prisma.js';
import cloudinary from '../configs/cloudinary.js';
import fs from 'node:fs/promises';
import { VoucherType } from '@prisma/client';

export const createVoucher = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const storeId = req.params.id;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    const {
      name,
      description,
      code,
      voucherType,
      value,
      discountRate,
      startDate,
      endDate,
      stock,
      isActive,
      minPurchase,
      maxPriceReduction,
      productIds,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !code ||
      !voucherType ||
      !discountRate ||
      !startDate ||
      !endDate ||
      !productIds ||
      !stock
    ) {
      res.status(400).json({ error: 'All required fields are required' });
      return;
    }

    // Validate productIds against the storeId
    const productsInStore = await prisma.product.findMany({
      where: {
        storeId: Number(storeId),
        id: { in: productIds.map(Number) },
      },
    });

    const validProductIds = productsInStore.map((product) => product.id);

    if (validProductIds.length !== productIds.length) {
      res.status(400).json({
        error: 'Some product IDs do not belong to the specified store',
      });
      return;
    }

    let cloudinaryData;
    const defaultImageUrl =
      'https://res.cloudinary.com/dm1cnsldc/image/upload/v1739728940/event/images/s6x3zkhiibcahfndhmxe.jpg';

    if (req.file) {
      try {
        cloudinaryData = await cloudinary.uploader.upload(req.file.path, {
          folder: 'vouchers',
        });
        await fs.unlink(req.file.path);
      } catch (uploadError) {
        console.error('Error uploading image to Cloudinary:', uploadError);
        cloudinaryData = { secure_url: defaultImageUrl }; // Use default image on error
      }
    } else {
      cloudinaryData = { secure_url: defaultImageUrl }; // Use default image if no file
    }

    const newVoucher = await prisma.voucher.create({
      data: {
        userId: Number(userId),
        storeId: Number(storeId),
        name,
        description,
        code,
        voucherType: voucherType as VoucherType,
        value: Number(value),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        stock: Number(stock),
        isActive,
        minPurchase: Number(minPurchase) || null,
        maxPriceReduction: Number(maxPriceReduction) || null,
        voucherImage: cloudinaryData.secure_url,
        VoucherProduct: {
          create: validProductIds.map((productId: number) => ({
            productId: Number(productId),
          })),
        },
      },
    });

    res.status(201).json({
      ok: true,
      message: 'Voucher created successfully',
      data: newVoucher,
    });
  } catch (error) {
    console.error('Error creating voucher:', error);
    next(error);
  }
};

// Update an existing voucher
export const updateVoucher = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const voucherId = Number(req.params.id);
    const storeId = req.params.id;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    const voucher = await prisma.voucher.findUnique({
      where: { id: voucherId },
      include: { VoucherProduct: true },
    });

    if (!voucher) {
      res.status(404).json({ error: 'Voucher not found' });
      return;
    }

    // Authorization check: Ensure the user is the owner of the voucher or has admin privileges
    if (
      voucher.userId !== userId &&
      req.user?.role !== 'SUPERADMIN' &&
      req.user?.role !== 'STOREADMIN'
    ) {
      res
        .status(403)
        .json({ error: 'You are not authorized to update this voucher' });
      return;
    }

    const {
      name,
      description,
      code,
      voucherType,
      value,
      discountRate,
      startDate,
      endDate,
      stock,
      isActive,
      minPurchase,
      maxPriceReduction,
      productIds,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !code ||
      !voucherType ||
      !discountRate ||
      !startDate ||
      !endDate ||
      !productIds ||
      !stock
    ) {
      res.status(400).json({ error: 'All required fields are required' });
      return;
    }

    // Validate productIds against the storeId
    const productsInStore = await prisma.product.findMany({
      where: {
        storeId: +storeId,
        id: { in: productIds.map(Number) },
      },
    });

    const validProductIds = productsInStore.map((product) => product.id);

    if (validProductIds.length !== productIds.length) {
      res.status(400).json({
        error: 'Some product IDs do not belong to the specified store',
      });
      return;
    }

    let cloudinaryData;
    const defaultImageUrl =
      'https://res.cloudinary.com/dm1cnsldc/image/upload/v1739728940/event/images/s6x3zkhiibcahfndhmxe.jpg';

    if (req.file) {
      try {
        cloudinaryData = await cloudinary.uploader.upload(req.file.path, {
          folder: 'vouchers',
        });
        await fs.unlink(req.file.path);
      } catch (uploadError) {
        console.error('Error uploading image to Cloudinary:', uploadError);
        cloudinaryData = { secure_url: defaultImageUrl }; // Use default image on error
      }
    } else {
      cloudinaryData = { secure_url: voucher.voucherImage }; // Use existing image if no file
    }

    // Prepare data for update
    const updateData = {
      name,
      description,
      code,
      voucherType: voucherType,
      value: Number(value),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      stock: Number(stock),
      isActive,
      minPurchase: Number(minPurchase) || null,
      maxPriceReduction: Number(maxPriceReduction) || null,
      voucherImage: cloudinaryData.secure_url,
      VoucherProduct: {
        deleteMany: {}, // Delete existing VoucherProduct entries
        create: validProductIds.map((productId: number) => ({
          productId: Number(productId),
        })),
      },
    };

    // Update the voucher
    const updatedVoucher = await prisma.voucher.update({
      where: { id: voucherId },
      data: updateData,
    });

    res.status(200).json({
      ok: true,
      message: 'Voucher updated successfully',
      data: updatedVoucher,
    });
  } catch (error) {
    console.error('Error updating voucher:', error);
    next(error);
  }
};

// Delete a voucher
export const deleteVoucher = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }
    const { voucherIds } = req.body;

    if (!voucherIds) {
      res.status(400).json({ error: 'Voucher IDs are required' });
      return;
    }

    const voucherToDelete = await prisma.voucher.findUnique({
      where: { id: Number(voucherIds) },
    });

    if (!voucherToDelete) {
      res.status(404).json({ error: 'Voucher not found' });
      return;
    }

    await prisma.voucher.delete({
      where: { id: Number(voucherIds) },
    });

    res.status(204).json({ ok: true, message: 'Voucher deleted successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Get a voucher by ID
export const getVoucherById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: 'Voucher ID is required' });
      return;
    }

    const voucher = await prisma.voucher.findUnique({
      where: { id: Number(id) },
    });

    if (!voucher) {
      res.status(404).json({ error: 'Voucher not found' });
      return;
    }

    res.status(200).json(voucher);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Get all vouchers
export const getAllVouchersUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    const vouchers = await prisma.voucher.findMany({
      where: { userId: Number(userId) },
    });

    if (!vouchers) {
      res.status(404).json({ error: 'Vouchers not found' });
      return;
    }
    res.status(200).json({
      ok: true,
      message: 'Vouchers found successfully',
      data: vouchers,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Apply a voucher to an order BELUM
export const applyVoucherToCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const orderId = req.params.id;
    const { voucherId } = req.body;

    if (!voucherId) {
      res.status(400).json({ error: 'Voucher ID is required' });
      return;
    }

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!orderId) {
      res.status(400).json({ error: 'Order ID is required' });
      return;
    }

    /* -------------------------------------------------------------------------- */
    /*                                  CART USER                                 */
    /* -------------------------------------------------------------------------- */
    const cartUser = await prisma.cart.findFirst({
      where: {
        userId: userId,
      },
      include: {
        cartItems: true,
      },
    });

    if (!cartUser) {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }

    /* -------------------------------------------------------------------------- */
    /*                               VOUCHER USERNYA                              */
    /* -------------------------------------------------------------------------- */
    const voucherSelectedToApply = await prisma.voucher.findFirst({
      where: {
        id: Number(voucherId),
      },
    });

    if (!voucherSelectedToApply) {
      res.status(404).json({ error: 'Voucher not found' });
      return;
    }

    const totalAmount = cartUser.cartItems.reduce(
      (total, item) => total + item.total,
      0,
    );

    if (!totalAmount) {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }

    /* -------------------------------------------------------------------------- */
    /*               KETENTUAN VOUCHER AMOUNT                                     */
    /* -------------------------------------------------------------------------- */
    if (voucherSelectedToApply.voucherType === 'AMOUNT') {
      if (voucherSelectedToApply.minPurchase) {
        if (totalAmount < voucherSelectedToApply.minPurchase) {
          res.status(400).json({
            error: 'Voucher amount exceeds minimum purchase amount',
          });
          return;
        }
      }

      const voucherAmount = voucherSelectedToApply.value;
      const finalAmountAfterVoucher = totalAmount - voucherAmount;

      if (totalAmount < voucherAmount) {
        res.status(400).json({ error: 'Voucher amount exceeds total amount' });
        return;
      }

      if (finalAmountAfterVoucher < 0) {
        res.status(400).json({ error: 'Voucher amount exceeds total amount' });
        return;
      }
    }

    /* -------------------------------------------------------------------------- */
    /*                           KETENTUAN VOUCHER PERSEN                          */
    /* -------------------------------------------------------------------------- */
    if (voucherSelectedToApply.voucherType === 'PERCENTAGE') {
      const voucherAmount = voucherSelectedToApply.value;
      const finalAmountAfterVoucher =
        (totalAmount * (100 - voucherAmount)) / 100;

      const maxPriceReduction = voucherSelectedToApply.maxPriceReduction;

      if (maxPriceReduction) {
        if (finalAmountAfterVoucher > maxPriceReduction) {
          const finalAmountAfterVoucher = maxPriceReduction;

          if (!finalAmountAfterVoucher) {
            res.status(400).json({
              error: 'Voucher amount exceeds maximum price reduction',
            });
            return;
          }

          res.status(400).json({
            error: 'Voucher amount exceeds maximum price reduction',
          });
          return;
        }
      }

      if (totalAmount < voucherAmount) {
        res.status(400).json({ error: 'Voucher amount exceeds total amount' });
        return;
      }

      if (finalAmountAfterVoucher < 0) {
        res.status(400).json({ error: 'Voucher amount exceeds total amount' });
        return;
      }
    }

    res.status(200).json({
      ok: true,
      message: 'Voucher applied successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const manageVoucherStock = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, stock } = req.body;

    if (!id || stock === undefined) {
      res.status(400).json({ error: 'Voucher ID and stock are required' });
      return;
    }

    const voucher = await prisma.voucher.findUnique({
      where: { id: Number(id) },
    });

    if (!voucher) {
      res.status(404).json({ error: 'Voucher not found' });
      return;
    }

    const updatedVoucher = await prisma.voucher.update({
      where: { id: Number(id) },
      data: {
        stock,
      },
    });

    res.status(200).json({
      ok: true,
      message: 'Voucher stock updated successfully',
      data: updatedVoucher,
    });
  } catch (error) {
    console.error('Error managing voucher stock:', error);
    next(error);
  }
};

export const claimVoucher = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    const { claimVoucher } = req.body;

    const voucher = await prisma.voucher.findUnique({
      where: { code: claimVoucher },
    });

    if (!voucher) {
      res.status(404).json({ error: 'Voucher not found' });
      return;
    }

    if (voucher.stock <= 0) {
      res.status(400).json({ error: 'Voucher is out of stock' });
      return;
    }

    // Check if the voucher has already been claimed by the user
    const existingClaim = await prisma.voucherUser.findFirst({
      where: {
        voucherId: voucher.id,
        customerId: userId,
      },
    });

    if (existingClaim) {
      res
        .status(400)
        .json({ error: 'Voucher has already been claimed by this user' });
      return;
    }

    await prisma.voucher.update({
      where: { id: voucher.id },
      data: {
        stock: voucher.stock - 1,
      },
    });

    const claimCostumers = await prisma.voucherUser.create({
      data: {
        voucherId: voucher.id,
        customerId: userId,
      },
      include: { voucher: true },
    });

    res.status(200).json({
      ok: true,
      message: 'Voucher claimed successfully',
      data: claimCostumers,
    });
  } catch (error) {
    console.error('Error claiming voucher:', error);
    next(error);
  }
};

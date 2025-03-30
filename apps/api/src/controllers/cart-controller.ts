import { NextFunction, Request, Response } from 'express';
import { prisma } from '../configs/prisma.js';

// Add to Cart
export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId, quantity } = req.body;
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

    if (!productId || !quantity) {
      res.status(400).json({ error: 'Product ID and quantity are required' });
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id: productId, storeId: Number(storeId) },
    });

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    if (product.stock < quantity) {
      res.status(400).json({ error: 'Not enough stock available' });
      return;
    }

    const cartUser = await prisma.cart.findFirst({
      where: { userId: userId },
    });

    if (!cartUser) {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }

    let cartItem = await prisma.cartItem.findFirst({
      where: { cartId: cartUser.id },
    });

    const totalPrice = Number(product.price) * quantity;

    if (cartItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: {
          quantity: cartItem.quantity + quantity,
          total: cartItem.total + totalPrice,
        },
      });
    } else {
      // Create a new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          productId: product.id,
          quantity: quantity,
          total: totalPrice,
          cartId: cartUser.id,
          price: Number(product.price),
        },
      });
    }

    res.status(200).json({
      ok: true,
      message: 'Product added to cart successfully',
      data: cartItem,
    });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    next(error);
  }
};

export const increaseQuantityProduct = async (
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

    const { cartItemId, quantity } = req.body;

    if (!cartItemId || !quantity) {
      res.status(400).json({ error: 'Cart item ID and quantity are required' });
      return;
    }

    const product = await prisma.product.findFirst({
      where: { storeId: Number(storeId) },
    });

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    if (product.stock < quantity) {
      res.status(400).json({ error: 'Not enough stock available' });
      return;
    }

    const dataUpdated = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: { increment: 1 } },
    });

    if (dataUpdated) {
      await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { total: Number(product.price) * dataUpdated.quantity },
      });
    }

    res.status(200).json({ message: 'Update quantity successfully' });
  } catch (error) {
    console.error('Error updating quantity:', error);
    next(error);
  }
};

export const decreaseQuantityProduct = async (
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

    const { cartItemId, quantity } = req.body;

    if (!cartItemId || !quantity) {
      res.status(400).json({ error: 'Cart item ID and quantity are required' });
      return;
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem) {
      res.status(404).json({ error: 'Cart item not found' });
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id: cartItem.productId },
    });

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const newQuantity = cartItem.quantity - quantity;

    if (newQuantity < 0) {
      res.status(400).json({ error: 'Quantity cannot be negative' });
      return;
    }

    if (newQuantity === 0) {
      res.status(400).json({ message: 'Cannot Decrease quantity because 0' });
      return;
    }

    const dataUpdated = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: newQuantity },
    });

    if (dataUpdated) {
      await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { total: Number(product.price) * dataUpdated.quantity },
      });
    }

    res.status(200).json({ message: 'Update quantity successfully' });
  } catch (error) {
    console.error('Error updating quantity:', error);
    next(error);
  }
};

export const deleteCartItem = async (
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

    const { cartItemIds } = req.body;

    if (!cartItemIds) {
      res.status(400).json({ error: 'Cart item IDs are required' });
      return;
    }

    await prisma.cartItem.delete({
      where: { id: cartItemIds },
    });

    res.status(200).json({ message: 'Delete Cart item successfully' });
  } catch (error) {
    console.error('Error removing cart item:', error);
    next(error);
  }
};

export const getAllAddressesUser = async (
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

    const addresses = await prisma.address.findMany({
      where: { userId: Number(userId) },
    });

    res.status(200).json({
      ok: true,
      message: 'Addresses retrieved successfully',
      data: addresses,
    });
  } catch (error) {
    console.error('Error retrieving addresses:', error);
    next(error);
  }
};

export const setShippingAddress = async (
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

    const { addressIds } = req.body;

    if (!addressIds) {
      res.status(400).json({ error: 'Address ID is required' });
      return;
    }

    await prisma.address.updateMany({
      where: { userId: userId, isActive: true },
      data: { isActive: false },
    });

    await prisma.address.update({
      where: { id: Number(addressIds), userId: userId },
      data: { isActive: true },
    });

    res.status(200).json({ message: 'Set shipping address successfully' });
  } catch (error) {
    console.error('Error setting shipping address:', error);
    next(error);
  }
};

export const getTotalAmountCart = async (
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

    const cart = await prisma.cart.findUnique({
      where: { userId: userId },
      include: {
        cartItems: true,
      },
    });

    if (!cart) {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }

    const totalAmount = cart.cartItems.reduce(
      (total, item) => total + item.total,
      0,
    );

    if (!totalAmount) {
      res.status(404).json({ error: 'Total amount not found' });
      return;
    }

    res.status(200).json({
      ok: true,
      message: 'Total amount retrieved successfully',
      data: cart,
    });
  } catch (error) {
    console.error('Error retrieving total amount:', error);
    next(error);
  }
};

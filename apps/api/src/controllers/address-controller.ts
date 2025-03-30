// controllers/addressController.ts
import { NextFunction, Request, Response } from 'express';
import { prisma } from '../configs/prisma.js';
import { Address } from '../types/express.d.js';

// Menambahkan alamat baru
export const addAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const { street, city, postalCode, number, country } = req.body;

  // Validate required fields
  if (!street || !city || !postalCode || !country || !number) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const existingAddresses = await prisma.address.findMany({
      where: { userId: Number(userId) },
    });

    const isDifferent = (existingAddress: Address) => {
      return (
        existingAddress.street !== street ||
        existingAddress.city !== city ||
        existingAddress.number !== number ||
        existingAddress.postalCode !== postalCode ||
        existingAddress.country !== country
      );
    };

    const isDuplicate = existingAddresses.every(isDifferent);

    if (!isDuplicate) {
      res.status(409).json({ error: 'Duplicate address entry' });
      return;
    }

    const newAddress = await prisma.address.create({
      data: {
        userId: Number(userId),
        street,
        city,
        postalCode: Number(postalCode),
        number: Number(postalCode),
        country,
      },
    });

    res.status(201).json({
      ok: true,
      message: 'Address added successfully',
      data: newAddress,
    });
  } catch (error) {
    console.error('Error adding address:', error);
    next(error);
  }
};

// Memperbarui alamat yang ada
export const updateAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const { street, city, postalCode, number, country, isPrimary } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const address = await prisma.address.findUnique({
      where: { id: Number(id) },
    });

    if (!address) {
      res.status(404).json({ message: 'Address not found.' });
      return;
    }

    // Validate required fields
    if (!street || !city || !postalCode || !country || !number) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Check for duplicate addresses
    const existingAddresses = await prisma.address.findMany({
      where: { userId: Number(userId) },
    });

    const isDifferent = (existingAddress: Address) => {
      return (
        existingAddress.street !== street ||
        existingAddress.city !== city ||
        existingAddress.number !== number ||
        existingAddress.postalCode !== postalCode ||
        existingAddress.country !== country ||
        existingAddress.isPrimary !== isPrimary
      );
    };

    const isDuplicate = existingAddresses.every(isDifferent);

    if (!isDuplicate) {
      res.status(409).json({ error: 'Duplicate address entry' });
      return;
    }

    // Update the address
    const updatedAddress = await prisma.address.update({
      where: { id: Number(address.id) },
      data: {
        street,
        city,
        postalCode: Number(postalCode),
        number: Number(number),
        country,
        isPrimary,
      },
    });

    res.status(200).json({
      ok: true,
      message: 'Address updated successfully',
      data: updatedAddress,
    });
  } catch (error) {
    console.error('Error updating address:', error);
    next(error);
  }
};

// Menghapus alamat
export const deleteAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  try {
    await prisma.address.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ ok: true, message: 'Address deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Mengambil semua alamat pengguna
export const getAllAddresses = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const addresses = await prisma.address.findMany({
      where: { userId: Number(userId) },
    });
    res.status(200).json({
      ok: true,
      message: 'Addresses retrieved successfully',
      data: addresses,
    });
  } catch (error) {
    next(error);
  }
};

// Menetapkan alamat utama
export const setPrimaryAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { addressIds } = req.body;

    if (!addressIds) {
      res.status(400).json({ message: 'Address ID is required' });
      return;
    }

    await prisma.address.updateMany({
      where: { userId: userId, isPrimary: true },
      data: { isPrimary: false },
    });

    await prisma.address.update({
      where: { id: Number(addressIds) },
      data: { isPrimary: true },
    });
    // PERTANYAAN - INI BENER ENGGA?

    res.status(200).json({
      ok: true,
      message: 'Primary address updated successfully',
    });
  } catch (error) {
    console.error('Error setting primary address:', error);
    next(error);
  }
};

import { NextFunction, Request, Response } from 'express';
import { prisma } from '../configs/prisma.js';
import { genSalt, hash } from 'bcryptjs';
import { createUserSchema, updateUserSchema } from '../schemas/auth-schemas.js';

// Create Admin
export const createAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password, role, username } = req.body;

    // Validate input
    const parsedInput = createUserSchema.parse({
      name,
      email,
      password,
      role,
      username,
    });

    // Hash password
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    // Create admin
    const newAdmin = await prisma.user.create({
      data: {
        name: parsedInput.name,
        email: parsedInput.email,
        password: hashedPassword,
        role: parsedInput.role,
        username: parsedInput.username,
        referralNumber: 'ADMIN123',
        referralCount: 0,
        profileImage: '',
        provider: 'CREDENTIALS',
      },
    });
    res.status(201).json(newAdmin);
  } catch (error) {
    next(error);
  }
};

// Update Admin
export const updateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    // Validate input
    const parsedInput = updateUserSchema.parse({ name, email, role });

    // Update admin
    const updatedAdmin = await prisma.user.update({
      where: { id: Number(id) },
      data: parsedInput,
    });
    res.status(200).json(updatedAdmin);
  } catch (error) {
    next(error); // Pass error to the next middleware
  }
};

// Delete Admin
export const deleteAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    // Delete admin
    await prisma.user.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    next(error); // Pass error to the next middleware
  }
};

// Get All Admins
export const getAllAdmins = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const admins = await prisma.user.findMany({
      where: { role: 'STOREADMIN' }, // Corrected typo from 'STOREDMIN' to 'STOREADMIN'
    });
    res.status(200).json(admins);
  } catch (error) {
    next(error); // Pass error to the next middleware
  }
};

export const getAdminById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    // Validate input: Ensure ID is a positive integer
    const adminId = parseInt(id, 10);
    if (isNaN(adminId) || adminId <= 0) {
      res
        .status(400)
        .json({ error: 'Invalid ID. ID must be a positive integer.' });
      return;
    }

    // Fetch admin by ID
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    });

    // Check if admin exists
    if (!admin) {
      res.status(404).json({ error: 'Admin not found.' });
      return;
    }

    // Return admin data
    res.status(200).json(admin);
  } catch (error) {
    next(error); // Pass error to the next middleware
  }
};

import { z } from 'zod';
import { Role } from '@prisma/client';

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name must be at most 50 characters long')
    .regex(/^[A-Za-z\s]+$/, 'Name can only contain letters and spaces'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(30, 'Username must be at least 30 characters long')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscore',
    ),
  email: z.string().email('Invalid email format'),

  role: z.nativeEnum(Role).optional(),
  referralCode: z.string().optional(),
});

export const loginSchema = z.object({
  emailOrUsername: z.string().min(1, 'Email or username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

// -------
// Zod Validation Schemas
export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(Role),
  username: z.string().min(1), // Add this line
  referralNumber: z.string(), // Add this line
});

export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  role: z.nativeEnum(Role).optional(),
});

export const manageUserDataSchema = z.object({
  action: z.enum(['create', 'update', 'delete']),
  data: z.union([createUserSchema, updateUserSchema.partial()]),
});

// ------
export const confirmPasswordResetSchema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
});

// password: z.string().min(6)

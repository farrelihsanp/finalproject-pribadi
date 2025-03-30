import { Request, Response, NextFunction } from 'express';
import { prisma } from '../configs/prisma.js';

export const getAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.delete({ where: { id: Number(id) } });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

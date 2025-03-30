// controllers/addressController.ts
import { NextFunction, Request, Response } from 'express';
import { prisma } from '../configs/prisma.js';

export const getAllDelivery = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const delivery = await prisma.delivery.findMany();
    res.status(200).json(delivery);
  } catch (error) {
    next(error);
  }
};

export const getDeliveryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    const delivery = await prisma.delivery.findUnique({
      where: { id: Number(id) },
    });
    res.status(200).json(delivery);
  } catch (error) {
    next(error);
  }
};

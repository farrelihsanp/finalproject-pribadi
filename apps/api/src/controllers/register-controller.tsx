import { prisma } from '../configs/prisma.js';
import { Request, Response, NextFunction } from 'express';

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name, username, password, email, role, referralNumber } = req.body;

    if (!name || !username || !password || !email || !role || !referralNumber) {
      res.status(400).json({ message: 'ada yang belum ke isi' });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      res
        .status(400)
        .json({ message: 'Email or username has already been used' });
      return;
    }

    res.status(200).json({ message: 'berhasil registrasi' });
  } catch (error) {
    next(error);
  }
}

import { NextFunction, Request, Response } from 'express';
import { prisma } from '../configs/prisma.js';
import path from 'node:path';
import fs from 'node:fs';
import cloudinary from '../configs/cloudinary.js';
import slugifyModule from 'slugify';
const slugify = slugifyModule.default;

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, excerpt, description } = req.body;
    const image = req.file;

    if (!name || !excerpt || !description || !image) {
      res
        .status(400)
        .json({ message: 'Semua field wajib diisi, termasuk gambar.' });
      return;
    }

    const filePath = path.resolve(image.path);

    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'categories',
    });

    fs.unlinkSync(filePath);

    // Simpan ke database
    const category = await prisma.category.create({
      data: {
        name,
        excerpt,
        description,
        slug: slugify(name, { lower: true }),
        image: result.secure_url,
      },
    });

    res.status(201).json({ message: 'Kategori berhasil dibuat.', category });
  } catch (error) {
    console.error('Error createCategory:', error);
    res.status(500).json({ message: 'Gagal membuat kategori.', error });
  }
};

export const getAllCategories = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json({
      ok: true,
      message: 'Categories retrieved successfully',
      data: categories,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const { name, excerpt, description } = req.body;

  try {
    const category = await prisma.category.update({
      where: { id: Number(id) },
      data: {
        name,
        excerpt,
        description,
        slug: slugify(name, { lower: true }),
      },
    });
    res
      .status(200)
      .json({ message: 'Category updated successfully', category });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

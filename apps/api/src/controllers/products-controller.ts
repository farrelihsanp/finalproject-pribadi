import { NextFunction, Request, Response } from 'express';
import { prisma } from '../configs/prisma.js';
import cloudinary from '../configs/cloudinary.js';
import fs from 'node:fs/promises';

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, excerpt, description, price, stock, categoryIds, isCheap } =
      req.body;

    const storeId = Number(req.params.id);

    if (!name || !excerpt || !description || !price || !stock || !categoryIds) {
      res.status(400).json({ error: 'All required fields are required' });
      return;
    }

    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      res.status(400).json({ error: 'categoryIds must be a non-empty array' });
      return;
    }

    const validCategoryIds = await prisma.category.findMany({
      select: { id: true },
    });

    const validCategoryIdsSet = new Set(validCategoryIds.map((cat) => cat.id));

    const invalidCategoryIds = categoryIds.filter(
      (categoryId) => !validCategoryIdsSet.has(Number(categoryId)),
    );

    if (invalidCategoryIds.length > 0) {
      res.status(400).json({
        error: `Invalid categoryIds: ${invalidCategoryIds.join(', ')}`,
      });
      return;
    }

    const productImages = [];
    const failedUploads = [];

    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        try {
          const cloudinaryData = await cloudinary.uploader.upload(file.path, {
            folder: 'product_images',
            timeout: 120000,
          });
          productImages.push({ imageUrl: cloudinaryData.secure_url });
        } catch (uploadError) {
          console.error('Cloudinary upload error:', uploadError);
          failedUploads.push(file.path);
        }
      }
    }

    if (failedUploads.length > 0) {
      res.status(500).json({
        error: `Failed to upload ${failedUploads.length} images`,
        failedUploads: failedUploads,
      });
      return;
    }

    const createSlug = (input: string): string => {
      return input.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    };

    const slug = createSlug(name);

    const newProduct = await prisma.product.create({
      data: {
        storeId: +storeId,
        name,
        excerpt,
        description,
        price: parseFloat(price),
        slug,
        stock: Number(stock),
        isCheap,
        date: new Date(),
        CategoryProduct: {
          create: categoryIds.map((categoryId) => ({
            categoryId: Number(categoryId),
          })),
        },
        ProductImages: {
          create: productImages,
        },
      },
    });

    if (!newProduct) {
      res.status(500).json({ error: 'Failed to create product' });
      return;
    }

    await prisma.product.updateMany({
      where: {
        storeId: storeId,
        price: { lte: 50000 },
      },
      data: {
        isCheap: true,
      },
    });

    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        try {
          await fs.unlink(file.path);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      }
    }

    res.status(201).json({
      ok: true,
      message: 'Product created successfully',
    });
  } catch (error) {
    console.error('Error creating product:', error);
    next(error);
  }
};

// Delete a product
export const deleteProductByStoreAndProductId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { storeId, productId } = req.params;

  try {
    await prisma.product.delete({
      where: {
        storeId: Number(storeId),
        id: Number(productId),
      },
    });
    res.status(204).json({ ok: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Get a product by ID
export const getDetailProductByIdByStoreId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { storeId, productId } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(productId), storeId: Number(storeId) },
    });

    if (!product) {
      res
        .status(404)
        .json({ error: 'Product not found in the specified store' });
      return;
    }

    res.status(200).json({
      ok: true,
      message: 'Product retrieved successfully',
      data: product,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getAllProductsByStoreId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    const products = await prisma.product.findMany({
      where: { storeId: Number(id) },
      include: {
        ProductImages: true,
      },
    });
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    next(error); // Pass the error to the next middleware for centralized error handling
  }
};

export const getAllCategoriesByStoreId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    const categories = await prisma.category.findMany({
      where: { storeId: Number(id) },
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    next(error); // Pass the error to the next middleware for centralized error handling
  }
};

export const getAllProductsByCategoryByStoreId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { storeId, categoryId } = req.params; // Changed to destructure both storeId and categoryId
  try {
    const productsByCategoryByStore = await prisma.product.findMany({
      where: {
        storeId: Number(storeId), // Ensure storeId is a number
        CategoryProduct: {
          some: {
            categoryId: Number(categoryId), // Ensure categoryId is a number
          },
        },
      },
      include: {
        ProductImages: true, // Include product images if needed
      },
    });

    // Check if products were found
    if (productsByCategoryByStore.length === 0) {
      res
        .status(404)
        .json({ error: 'No products found for this store and category' });
      return;
    }

    res.status(200).json({
      ok: true,
      message: 'Products retrieved successfully',
      data: productsByCategoryByStore,
    });
  } catch (error) {
    console.error(error);
    next(error); // Pass the error to the next middleware for centralized error handling
  }
};

export const getCheapProductsByStoreId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    const cheapProducts = await prisma.product.findMany({
      where: { storeId: Number(id), isCheap: true },
    });
    res.status(200).json({
      ok: true,
      message: 'Products retrieved successfully',
      data: cheapProducts,
    });
  } catch (error) {
    console.error(error);
    next(error); // Pass the error to the next middleware for centralized error handling
  }
};

import express from 'express';
import {
  createProduct,
  deleteProductByStoreAndProductId,
  getDetailProductByIdByStoreId,
  getAllProductsByStoreId,
  getAllCategoriesByStoreId,
  getAllProductsByCategoryByStoreId,
  getCheapProductsByStoreId,
} from '../controllers/products-controller.js';

import { uploadMany } from '../middlewares/upload-many-middleware.js';
import { verifyToken, roleGuard } from '../middlewares/auth-middleware.js';

const router = express.Router();

// Create a new product
router
  .route('/create-product/:id')
  .post(
    uploadMany.array('productImages', 5),
    verifyToken,
    roleGuard(['SUPERADMIN']),
    createProduct,
  );

// Delete a product
router
  .route('/delete-product/:storeId/:productId')
  .delete(
    verifyToken,
    roleGuard(['SUPERADMIN']),
    deleteProductByStoreAndProductId,
  );

// Get a product by ID
router
  .route('/detail-product/:storeId/:productId')
  .get(
    verifyToken,
    roleGuard(['CUSTOMERS', 'SUPERADMIN', 'STOREADMIN']),
    getDetailProductByIdByStoreId,
  );

// Get all products by store
router
  .route('/products-store/:id')
  .get(
    verifyToken,
    roleGuard(['CUSTOMERS', 'SUPERADMIN', 'STOREADMIN']),
    getAllProductsByStoreId,
  );

// get all categories by store
router
  .route('/categories-store/:id')
  .get(
    roleGuard(['SUPERADMIN', 'STOREADMIN', 'CUSTOMERS']),
    getAllCategoriesByStoreId,
  );

// get all products by category
router
  .route('/productsBycategories/:storeId/:categoryId')
  .get(
    verifyToken,
    roleGuard(['CUSTOMERS', 'SUPERADMIN', 'STOREADMIN']),
    getAllProductsByCategoryByStoreId,
  );

// get all cheap products
router
  .route('/cheap-products-store/:id')
  .get(
    verifyToken,
    roleGuard(['CUSTOMERS', 'SUPERADMIN', 'STOREADMIN']),
    getCheapProductsByStoreId,
  );

export default router;

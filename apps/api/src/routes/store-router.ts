// routes/storeRoutes.ts
import express from 'express';
import {
  createStore,
  updateStore,
  deleteStore,
  getStoreById,
  getAllStores,
  // getNearestStore,
} from '../controllers/store-controller.js';

import { upload } from '../middlewares/upload-middleware.js';
import { verifyToken } from '../middlewares/auth-middleware.js';
import { roleGuard } from '../middlewares/auth-middleware.js';

const router = express.Router();

// Middleware for protected routes
const protectedRoute = [verifyToken, roleGuard(['SUPERADMIN'])];

// Create a new store
router.post('/', upload.single('storeImage'), ...protectedRoute, createStore);

// Update an existing store
router.put('/:id', upload.single('storeImage'), ...protectedRoute, updateStore);

// Delete a store
router.delete('/:id', ...protectedRoute, deleteStore);

// Get a store by ID
router.get('/:id', ...protectedRoute, getStoreById);

// Get all stores
router.get('/', ...protectedRoute, getAllStores);

// Get nearest store based on user's location
// router.post('/nearest', getNearestStore);

export default router;

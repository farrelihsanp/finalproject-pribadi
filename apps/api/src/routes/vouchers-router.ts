// routes/voucherRoutes.ts
import express from 'express';
import {
  createVoucher,
  updateVoucher,
  deleteVoucher,
  getVoucherById,
  getAllVouchersUser,
  applyVoucherToCart,
  manageVoucherStock,
  claimVoucher,
} from '../controllers/vouchers-controller.js';

import { upload } from '../middlewares/upload-middleware.js';
import { verifyToken, roleGuard } from '../middlewares/auth-middleware.js';

const router = express.Router();

// Create a new voucher
router.post(
  '/create-voucher/:id',
  verifyToken,
  roleGuard(['STOREADMIN']),
  upload.single('voucherImage'),
  createVoucher,
);

// Update an existing voucher
router.put(
  '/update-voucher/:id',
  verifyToken,
  roleGuard(['STOREADMIN']),
  upload.single('voucherImage'),
  updateVoucher,
);

// Get all vouchers
router.get(
  '/my-voucher',
  verifyToken, // Middleware to verify the token
  roleGuard(['STOREADMIN', 'CUSTOMERS']), // Middleware to check user roles
  getAllVouchersUser, // Controller to handle the request
);

// Get a voucher by ID
router.get(
  '/my-voucher/:id',
  verifyToken,
  roleGuard(['STOREADMIN, CUSTOMERS']),
  getVoucherById,
);

// Delete a voucher
router.delete(
  '/delete-voucher/:id',
  verifyToken,
  roleGuard(['STOREADMIN']),
  deleteVoucher,
);

// Apply a voucher to an order
router.post(
  '/apply',
  verifyToken,
  roleGuard(['CUSTOMERS']),
  applyVoucherToCart,
);

// Manage voucher stock
router.post(
  '/manage-stock',
  verifyToken,
  roleGuard(['STOREADMIN']),
  manageVoucherStock,
);

router.post(
  '/claim-voucher',
  verifyToken,
  roleGuard(['CUSTOMERS']),
  claimVoucher,
);

export default router;

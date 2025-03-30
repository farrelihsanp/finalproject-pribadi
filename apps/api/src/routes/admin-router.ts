import express from 'express';
import {
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getAllAdmins,
  getAdminById,
} from '../controllers/admin-controller.js';

import { verifyToken, roleGuard } from '../middlewares/auth-middleware.js';

const router = express.Router();

// Route for creating an admin
router.post('/admins', verifyToken, roleGuard(['SUPERADMINS']), createAdmin);

// Route for getting all admins
router.get('/admins', verifyToken, roleGuard(['SUPERADMINS']), getAllAdmins);

// Route for updating an admin by ID
router.put('/admins/:id', verifyToken, roleGuard(['SUPERADMINS']), updateAdmin);

// Route for deleting an admin by ID
router.delete(
  '/admins/:id',
  verifyToken,
  roleGuard(['SUPERADMINS']),
  deleteAdmin,
);

// Route for getting an admin by ID
router.get(
  '/admins/:id',
  verifyToken,
  roleGuard(['SUPERADMINS']),
  getAdminById,
);

export default router;

import express from 'express';
import {
  getAllUsers,
  getUserById,
  deleteUser,
} from '../controllers/user-controller.js';

const router = express.Router();

import { verifyToken, roleGuard } from '../middlewares/auth-middleware.js';

router
  .route('/users')
  .get(verifyToken, roleGuard(['SUPERADMINS']), getAllUsers);

router
  .route('/users/:id')
  .get(verifyToken, roleGuard(['SUPERADMINS']), getUserById)
  .delete(verifyToken, roleGuard(['SUPERADMINS']), deleteUser);

export default router;

import express from 'express';
import {
  confirmEmail,
  checkEmailStatus,
} from '../controllers/confirm-email-controller.js';
import { verifyToken } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.route('/email').get(confirmEmail);
router.route('/status').get(verifyToken, checkEmailStatus);

export default router;

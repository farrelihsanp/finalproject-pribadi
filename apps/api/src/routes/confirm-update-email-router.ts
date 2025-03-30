import express from 'express';
import { verifyToken } from '../middlewares/auth-middleware.js';
import {
  confirmUpdateEmail,
  checkUpdateEmailStatus,
} from '../controllers/confirm-update-email-controller.js';

const router = express.Router();

router.route('/update-email').get(confirmUpdateEmail);
router.route('/status').get(verifyToken, checkUpdateEmailStatus);

export default router;

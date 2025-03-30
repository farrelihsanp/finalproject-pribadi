import express from 'express';
import { confirmPasswordReset } from '../controllers/confirm-reset-password.js';

const router = express.Router();

router.route('/reset-password').get(confirmPasswordReset);

export default router;

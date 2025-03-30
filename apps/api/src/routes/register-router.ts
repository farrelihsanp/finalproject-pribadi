import { Router } from 'express';
import {
  register,
  completeRegister,
} from '../controllers/register-controller.js';
import { upload } from '../middlewares/upload-middleware.js';

const router = Router();

import { verifyToken } from '../middlewares/auth-middleware.js';

router.route('/register').post(upload.single('profileImage'), register);

router.route('/fill-data').post(verifyToken, completeRegister);

export default router;

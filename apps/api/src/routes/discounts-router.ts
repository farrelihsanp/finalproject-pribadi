import express from 'express';

import {
  createDiscount,
  getDiscountReport,
} from '../controllers/discounts-controller.js';

// import { verifyToken } from '../middlewares/auth-middleware.js';
// import { roleGuard } from '../middlewares/auth-middleware.js';

const router = express.Router();

// create discount
router.post('/', createDiscount);

// get discount report
router.get('/report', getDiscountReport);

export default router;

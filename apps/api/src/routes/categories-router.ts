import express from 'express';
import {
  getAllCategories,
  createCategory,
  updateCategory,
} from '../controllers/category-controller.js';

import { upload } from '../middlewares/upload-middleware.js';

const router = express.Router();

router.post('/categories', upload.single('image'), createCategory);

router.route('/all-categories').get(getAllCategories);

router
  .route('/update-category/:id')
  .put(upload.single('image'), updateCategory);

export default router;

import express from 'express'
import { createCategory, getCategories, addSubCategory } from './category.controller.js'
import authMiddleware from '../../middlewares/auth.middleware.js';
import roleMiddleware from '../../middlewares/role.middleware.js';

const router = express.Router();
//Admin only//
router.post('/',authMiddleware,roleMiddleware('admin'),createCategory);
router.post('/:categoryId/subcategories',authMiddleware,roleMiddleware('admin'),addSubCategory);

router.get('/',getCategories);

export default router;


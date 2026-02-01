import express from 'express'
import { createCategory, getCategories, getCategoryBySlug, addSubCategory } from './category.controller.js'
import authMiddleware from '../../middlewares/auth.middleware.js';
import roleMiddleware from '../../middlewares/role.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);

// Admin only routes
router.post('/', authMiddleware, roleMiddleware('admin'), createCategory);
router.post('/:categoryId/subcategories', authMiddleware, roleMiddleware('admin'), addSubCategory);

export default router;
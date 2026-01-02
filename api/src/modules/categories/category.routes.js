import express from 'express'
import { createCategory, getCategories } from './category.controller.js'
import authMiddleware from '../../middlewares/auth.middleware.js';
import roleMiddleware from '../../middlewares/role.middleware.js';

const router = express.Router();
//Admin only//
router.post('/',authMiddleware,roleMiddleware('admin'),createCategory);

router.get('/',getCategories);

export default router;


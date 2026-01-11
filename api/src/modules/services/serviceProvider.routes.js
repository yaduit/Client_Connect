import express from 'express';
import { registerServiceProvider, getProviderById } from './serviceProvider.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import roleMiddleware from '../../middlewares/role.middleware.js';

const router = express.Router();
router.get('/:id', getProviderById);
router.post('/register', authMiddleware,roleMiddleware('provider'),registerServiceProvider);

export default router;
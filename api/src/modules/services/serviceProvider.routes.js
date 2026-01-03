import express from 'express';
import { registerServiceProvider } from './serviceProvider.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import roleMiddleware from '../../middlewares/role.middleware.js';

const router = express.Router();

router.post('/register', authMiddleware,roleMiddleware('provider'),registerServiceProvider);

export default router;
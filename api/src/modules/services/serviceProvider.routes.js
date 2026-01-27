import express from 'express';
import { registerServiceProvider, getProviderById, getMyProvider } from './serviceProvider.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = express.Router();
router.get( "/me", authMiddleware, getMyProvider);
router.get('/:id', getProviderById);
router.post('/register', authMiddleware,registerServiceProvider);

export default router;
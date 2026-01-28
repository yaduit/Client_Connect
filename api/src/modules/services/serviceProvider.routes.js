import express from 'express';
import { registerServiceProvider, getProviderById, getMyProvider, updateMyProvider, toggleProviderStatus } from './serviceProvider.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = express.Router();
router.get( "/me", authMiddleware, getMyProvider);
router.get('/:id', getProviderById);
router.post('/register', authMiddleware,registerServiceProvider);
router.patch("/me",authMiddleware, updateMyProvider);
router.patch("/me/status", authMiddleware, toggleProviderStatus);

export default router;
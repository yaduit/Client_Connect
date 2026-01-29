import express from 'express';
import {
  registerServiceProvider,
  getProviderById,
  getMyProvider,
  updateMyProvider,
  toggleProviderStatus,
  uploadServiceImages,
  deleteServiceImage
} from './serviceProvider.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import upload from '../../middlewares/imageUpload.middleware.js';

const router = express.Router();

// ============ PUBLIC ROUTES ============

/**
 * GET /api/providers/:id
 * Get provider details by ID (public access)
 */
router.get('/:id', getProviderById);

// ============ PRIVATE ROUTES (Authentication Required) ============

/**
 * GET /api/providers/me
 * Get current user's provider profile
 */
router.get('/me', authMiddleware, getMyProvider);

/**
 * POST /api/providers/register
 * Register a new service provider
 */
router.post('/register', authMiddleware, registerServiceProvider);

/**
 * PATCH /api/providers/me
 * Update provider profile (businessName, description, location)
 */
router.patch('/me', authMiddleware, updateMyProvider);

/**
 * PATCH /api/providers/me/status
 * Toggle provider active status
 */
router.patch('/me/status', authMiddleware, toggleProviderStatus);

// ============ IMAGE ROUTES ============

/**
 * POST /api/providers/me/images
 * Upload 1-4 service images
 * Middleware: upload.array('images', 4) - max 4 files
 */
router.post('/me/images', authMiddleware, upload.array('images', 4), uploadServiceImages);

/**
 * DELETE /api/providers/me/images/:publicId
 * Delete a service image by publicId
 */
router.delete('/me/images/:publicId', authMiddleware, deleteServiceImage);

export default router;
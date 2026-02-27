import express from 'express';
import {
  registerProvider,
  getProviderById,
  getMyProvider,
  updateProvider,
  toggleProviderStatus,
  uploadProviderImages,
  deleteProviderImage,
  getRelatedProviders,
  deactivateProvider,
  activateProvider
} from './serviceProvider.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import upload from '../../middlewares/imageUpload.middleware.js';

const router = express.Router();

/**
 * POST /api/providers/register
 * Register a new service provider (requires authentication)
 */
router.post('/register', authMiddleware, registerProvider);

/**
 * GET /api/providers/me
 * Get current user's provider profile (requires authentication)
 */
router.get('/me', authMiddleware, getMyProvider);

/**
 * PATCH /api/providers/me
 * Update provider profile (requires authentication)
 */
router.patch('/me', authMiddleware, updateProvider);

/**
 * PATCH /api/providers/me/status
 * Toggle provider status active/inactive (requires authentication)
 */
router.patch('/me/status', authMiddleware, toggleProviderStatus);

/**
 * POST /api/providers/me/images
 * Upload provider images (requires authentication)
 */
router.post('/me/images', authMiddleware, upload.array('images', 6), uploadProviderImages);

/**
 * DELETE /api/providers/me/images/:publicId
 * Delete provider image (requires authentication)
 */
router.delete('/me/images/:publicId', authMiddleware, deleteProviderImage);

/**
 * PUT /api/providers/deactivate
 * Deactivate provider (legacy endpoint, requires authentication)
 */
router.put('/deactivate', authMiddleware, deactivateProvider);

/**
 * PUT /api/providers/activate
 * Activate provider (legacy endpoint, requires authentication)
 */
router.put('/activate', authMiddleware, activateProvider);

/**
 * GET /api/providers/related
 * Get related providers by category and proximity (public endpoint)
 * Query params: categoryId (required), excludeId (optional), lat (optional), lng (optional), limit (optional)
 */
router.get('/related', getRelatedProviders);

/**
 * GET /api/providers/:id
 * Get provider by ID or slug (public endpoint)
 */
router.get('/:id', getProviderById);

export default router;
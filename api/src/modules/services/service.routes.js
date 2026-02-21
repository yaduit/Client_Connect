import express from 'express';
import {
  createService,
  getMyServices,
  getServiceById,
  updateService,
  deleteService,
  uploadServiceImages,
  deleteServiceImage
} from './service.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import upload from '../../middlewares/imageUpload.middleware.js';

const router = express.Router();

/**
 * POST /api/services
 * Create a new service (requires authentication)
 */
router.post('/', authMiddleware, createService);

/**
 * GET /api/services/me
 * Get current user's services (requires authentication)
 */
router.get('/me', authMiddleware, getMyServices);

/**
 * GET /api/services/:id
 * Get service details by ID
 */
router.get('/:id', getServiceById);

/**
 * PATCH /api/services/:id
 * Update service details (requires authentication)
 */
router.patch('/:id', authMiddleware, updateService);

/**
 * DELETE /api/services/:id
 * Delete a service (requires authentication)
 */
router.delete('/:id', authMiddleware, deleteService);

/**
 * POST /api/services/:id/images
 * Upload service images (requires authentication)
 */
router.post('/:id/images', authMiddleware, upload.array('images', 4), uploadServiceImages);

/**
 * DELETE /api/services/:id/images/:publicId
 * Delete service image (requires authentication)
 */
router.delete('/:id/images/:publicId', authMiddleware, deleteServiceImage);

export default router;

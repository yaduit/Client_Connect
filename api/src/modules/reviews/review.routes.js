import express from 'express';
import {
  createReview,
  getProviderReviews,
  getMyReviews,
  updateReview,
  deleteReview,
  getAllReviewsAdmin,
  approveReview,
  rejectReview
} from './review.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import roleMiddleware from '../../middlewares/role.middleware.js';

const router = express.Router();

// Public routes
router.get('/providers/:providerId/reviews', getProviderReviews);

// User routes (requires authentication)
router.post('/', authMiddleware, createReview);
router.get('/me', authMiddleware, getMyReviews);
router.patch('/:reviewId', authMiddleware, updateReview);
router.delete('/:reviewId', authMiddleware, deleteReview);

// Admin routes
router.get('/admin/all', authMiddleware, roleMiddleware('admin'), getAllReviewsAdmin);
router.patch('/:reviewId/approve', authMiddleware, roleMiddleware('admin'), approveReview);
router.patch('/:reviewId/reject', authMiddleware, roleMiddleware('admin'), rejectReview);

export default router;

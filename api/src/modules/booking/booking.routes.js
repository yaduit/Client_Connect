import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  getBookingsByStatus
} from './booking.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = express.Router();

// ============ PROTECTED ROUTES (Authentication Required) ============

/**
 * POST /api/bookings
 * Create a new booking (seeker)
 */
router.post('/', authMiddleware, createBooking);

/**
 * GET /api/bookings/me
 * Get provider's upcoming bookings
 */
router.get('/me', authMiddleware, getMyBookings);

/**
 * GET /api/bookings?status=pending|confirmed|completed|cancelled
 * Get bookings filtered by status (provider)
 */
router.get('/', authMiddleware, getBookingsByStatus);

/**
 * GET /api/bookings/:id
 * Get specific booking details
 */
router.get('/:id', authMiddleware, getBookingById);

/**
 * PATCH /api/bookings/:id/status
 * Update booking status (provider only)
 * Body: { status: 'confirmed' | 'completed' | 'cancelled', reason?: string }
 */
router.patch('/:id/status', authMiddleware, updateBookingStatus);

export default router;
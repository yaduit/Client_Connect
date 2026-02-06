import express from 'express';
import authMiddleware from '../../middlewares/auth.middleware.js';
import {
  createRequest,
  getRequestsForProvider,
  acceptRequest,
  rejectRequest
} from './contactRequest.controller.js';

const router = express.Router();

// ============ SEEKER ROUTES ============

/**
 * @route   POST /api/contact-requests
 * @desc    Create a new contact request
 * @access  Private (Seeker only)
 */
router.post('/', authMiddleware, createRequest);

// ============ PROVIDER ROUTES ============

/**
 * @route   GET /api/contact-requests/provider
 * @desc    Get all contact requests for logged-in provider
 * @access  Private (Provider only)
 */
router.get('/provider', authMiddleware, getRequestsForProvider);

/**
 * @route   PATCH /api/contact-requests/:id/accept
 * @desc    Accept a contact request
 * @access  Private (Provider only)
 */
router.patch('/:id/accept', authMiddleware, acceptRequest);

/**
 * @route   PATCH /api/contact-requests/:id/reject
 * @desc    Reject a contact request
 * @access  Private (Provider only)
 */
router.patch('/:id/reject', authMiddleware, rejectRequest);

export default router;
import bookingModel from './booking.model.js';
import serviceModel from '../services/serviceProvider.model.js';
import userModel from '../users/user.model.js';

/**
 * Create a new booking
 * @route POST /api/bookings
 * @access Private (seeker)
 * @requires req.user.id from auth middleware
 * 
 * @body {
 *   serviceId: ObjectId,
 *   bookingDate: Date,
 *   bookingTime: String,
 *   duration: Number,
 *   notes: String (optional)
 * }
 */
export const createBooking = async (req, res) => {
  try {
    const seekerId = req.user.id;

    if (!seekerId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { serviceId, bookingDate, bookingTime, duration, notes } = req.body;

    // ============ VALIDATION ============

    // Required fields
    if (!serviceId || !bookingDate || !bookingTime || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: serviceId, bookingDate, bookingTime, duration'
      });
    }

    // Validate date is in future
    const selectedDate = new Date(bookingDate);
    if (selectedDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Booking date must be in the future'
      });
    }

    // Validate duration
    if (duration < 15 || duration > 480) {
      return res.status(400).json({
        success: false,
        message: 'Duration must be between 15 minutes and 8 hours'
      });
    }

    // ============ FETCH SERVICE ============

    const service = await serviceModel.findById(serviceId).populate('providerId');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    if (!service.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Service is not active'
      });
    }

    // ============ FETCH SEEKER INFO ============

    const seeker = await userModel.findById(seekerId);

    if (!seeker) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // ============ CALCULATE TOTAL ============

    const servicePrice = service.price || 0;
    const platformFee = 49; // Default platform fee
    const totalAmount = servicePrice + platformFee;

    // ============ CREATE BOOKING ============

    const booking = await bookingModel.create({
      serviceId,
      providerId: service.providerId._id,
      seekerId,
      seekerName: seeker.name,
      seekerEmail: seeker.email,
      seekerPhone: seeker.phone || '',
      bookingDate: selectedDate,
      bookingTime,
      duration,
      notes: notes || '',
      servicePrice,
      platformFee,
      totalAmount,
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          changedBy: 'seeker',
          changedAt: new Date()
        }
      ]
    });

    // ============ POPULATE AND RETURN ============

    const populatedBooking = await booking.populate('serviceId', 'title').populate('seekerId', 'name email');

    return res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: populatedBooking
    });

  } catch (error) {
    console.error('Error in createBooking:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get provider's upcoming bookings
 * @route GET /api/bookings/me
 * @access Private (provider)
 * @requires req.user.id from auth middleware
 */
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Find provider by userId
    const provider = await require('../services/serviceProvider.model.js').default.findOne({ userId });

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    // Get upcoming bookings (next 30 days, not cancelled)
    const bookings = await bookingModel.findUpcomingForProvider(provider._id);

    return res.status(200).json({
      success: true,
      bookings,
      total: bookings.length
    });

  } catch (error) {
    console.error('Error in getMyBookings:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get booking by ID (with auth check)
 * @route GET /api/bookings/:id
 * @access Private (provider or seeker involved)
 */
export const getBookingById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const booking = await bookingModel
      .findById(id)
      .populate('serviceId', 'title price')
      .populate('seekerId', 'name email phone')
      .populate('providerId', 'businessName');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is provider or seeker in this booking
    if (booking.seekerId._id.toString() !== userId && booking.providerId._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this booking'
      });
    }

    return res.status(200).json({
      success: true,
      booking
    });

  } catch (error) {
    console.error('Error in getBookingById:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Update booking status (provider action)
 * @route PATCH /api/bookings/:id/status
 * @access Private (provider only)
 * @requires req.user.id from auth middleware
 * 
 * @body {
 *   status: 'confirmed' | 'completed' | 'cancelled',
 *   reason: String (optional, for cancellation)
 * }
 */
export const updateBookingStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // ============ VALIDATION ============

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const validStatuses = ['confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    // ============ GET BOOKING ============

    const booking = await bookingModel.findById(id).populate('providerId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // ============ AUTH CHECK ============

    // Only provider can update status
    if (booking.providerId._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only the provider can update booking status'
      });
    }

    // ============ VALIDATE STATUS TRANSITION ============

    const currentStatus = booking.status;

    // pending can go to: confirmed, cancelled
    if (currentStatus === 'pending' && !['confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Pending booking can only be confirmed or cancelled'
      });
    }

    // confirmed can go to: completed, cancelled
    if (currentStatus === 'confirmed' && !['completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Confirmed booking can only be completed or cancelled'
      });
    }

    // completed cannot be changed
    if (currentStatus === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Completed booking cannot be changed'
      });
    }

    // cancelled cannot be changed
    if (currentStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cancelled booking cannot be changed'
      });
    }

    // ============ UPDATE STATUS ============

    booking.status = status;
    booking.statusHistory.push({
      status,
      changedBy: 'provider',
      changedAt: new Date(),
      reason: reason || null
    });

    booking.providerResponse = {
      respondedAt: new Date(),
      message: reason || null
    };

    await booking.save();

    // ============ RETURN UPDATED BOOKING ============

    const updatedBooking = await bookingModel
      .findById(id)
      .populate('serviceId', 'title')
      .populate('seekerId', 'name email');

    return res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      booking: updatedBooking
    });

  } catch (error) {
    console.error('Error in updateBookingStatus:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get bookings by status (for provider)
 * @route GET /api/bookings?status=pending|confirmed|completed|cancelled
 * @access Private (provider)
 */
export const getBookingsByStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status query parameter is required'
      });
    }

    // Find provider
    const provider = await require('../services/serviceProvider.model.js').default.findOne({ userId });

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    // Get bookings by status
    const bookings = await bookingModel.findByProviderAndStatus(provider._id, status);

    return res.status(200).json({
      success: true,
      status,
      bookings,
      total: bookings.length
    });

  } catch (error) {
    console.error('Error in getBookingsByStatus:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
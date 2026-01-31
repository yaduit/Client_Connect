import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    // Service reference
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'service',
      required: true
    },

    // Provider reference
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'serviceProvider',
      required: true
    },

    // Seeker reference
    seekerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },

    // Seeker info (denormalized for quick access)
    seekerName: {
      type: String,
      required: true,
      trim: true
    },

    seekerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    seekerPhone: {
      type: String,
      required: true,
      trim: true
    },

    // Booking details
    bookingDate: {
      type: Date,
      required: true
    },

    bookingTime: {
      type: String, // Format: "10:30 AM" or "14:30"
      required: true,
      trim: true
    },

    duration: {
      type: Number, // in minutes
      required: true,
      min: 15,
      max: 480 // Max 8 hours
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 500
    },

    // Pricing info (snapshot at time of booking)
    servicePrice: {
      type: Number,
      required: true,
      min: 0
    },

    platformFee: {
      type: Number,
      default: 49, // Platform fee in paisa/cents
      min: 0
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },

    // Status workflow
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending'
    },

    // Status change timestamps
    statusHistory: [
      {
        status: String,
        changedBy: {
          type: String,
          enum: ['seeker', 'provider', 'system']
        },
        changedAt: {
          type: Date,
          default: Date.now
        },
        reason: String // Optional: reason for cancellation, etc.
      }
    ],

    // Provider's response
    providerResponse: {
      respondedAt: Date,
      message: String
    }
  },
  {
    timestamps: true,
    collection: 'bookings'
  }
);

// ============ INDEXES ============

// Find bookings by provider (for dashboard)
bookingSchema.index({ providerId: 1, status: 1, bookingDate: -1 });

// Find bookings by seeker
bookingSchema.index({ seekerId: 1, status: 1, bookingDate: -1 });

// Find bookings by service
bookingSchema.index({ serviceId: 1, status: 1 });

// Find upcoming bookings (for notifications/reminders)
bookingSchema.index({ bookingDate: 1, status: 1 });

// ============ INSTANCE METHODS ============

/**
 * Update booking status with history tracking
 */
bookingSchema.methods.updateStatus = function (newStatus, changedBy, reason = null) {
  if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(newStatus)) {
    throw new Error('Invalid status');
  }

  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    changedBy,
    changedAt: new Date(),
    reason
  });

  return this.save();
};

/**
 * Record provider response
 */
bookingSchema.methods.recordProviderResponse = function (message = null) {
  this.providerResponse = {
    respondedAt: new Date(),
    message
  };
  return this.save();
};

// ============ STATIC METHODS ============

/**
 * Find upcoming bookings for a provider
 * @param {ObjectId} providerId
 * @param {Number} daysAhead - How many days to look ahead (default 30)
 */
bookingSchema.statics.findUpcomingForProvider = function (providerId, daysAhead = 30) {
  const now = new Date();
  const futureDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

  return this.find({
    providerId,
    bookingDate: {
      $gte: now,
      $lte: futureDate
    },
    status: { $ne: 'cancelled' }
  })
    .populate('serviceId', 'title price')
    .populate('seekerId', 'name email')
    .sort({ bookingDate: 1, bookingTime: 1 });
};

/**
 * Find bookings by status for a provider
 */
bookingSchema.statics.findByProviderAndStatus = function (providerId, status) {
  return this.find({
    providerId,
    status
  })
    .populate('serviceId', 'title')
    .populate('seekerId', 'name')
    .sort({ createdAt: -1 });
};

/**
 * Calculate total amount (service price + platform fee)
 */
bookingSchema.statics.calculateTotal = function (servicePrice, platformFee = 49) {
  return servicePrice + platformFee;
};

export default mongoose.model('booking', bookingSchema);
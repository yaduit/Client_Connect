import mongoose from 'mongoose';

const contactRequestSchema = new mongoose.Schema({
  // Seeker (requester)
  seekerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },

  // Provider (recipient)
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'serviceProvider',
    required: true
  },

  // Request details
  message: {
    type: String,
    trim: true,
    maxlength: 500
  },

  // Contact details from seeker
  contactDetails: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    }
  },

  // Status flow
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },

  // Response metadata
  respondedAt: {
    type: Date
  }

}, {
  timestamps: true,
  collection: 'contactrequests'
});

// ============ INDEXES ============

// Provider's incoming requests
contactRequestSchema.index({ providerId: 1, status: 1, createdAt: -1 });

// Seeker's sent requests
contactRequestSchema.index({ seekerId: 1, createdAt: -1 });

// Prevent duplicate pending requests
contactRequestSchema.index(
  { seekerId: 1, providerId: 1, status: 1 },
  { 
    unique: true,
    partialFilterExpression: { status: 'pending' }
  }
);

// ============ INSTANCE METHODS ============

/**
 * Accept the contact request
 */
contactRequestSchema.methods.accept = function () {
  this.status = 'accepted';
  this.respondedAt = new Date();
  return this.save();
};

/**
 * Reject the contact request
 */
contactRequestSchema.methods.reject = function () {
  this.status = 'rejected';
  this.respondedAt = new Date();
  return this.save();
};

// ============ STATIC METHODS ============

/**
 * Check if seeker has pending request to provider
 */
contactRequestSchema.statics.hasPendingRequest = async function (seekerId, providerId) {
  const existing = await this.findOne({
    seekerId,
    providerId,
    status: 'pending'
  });
  return !!existing;
};

/**
 * Get pending requests for a provider
 */
contactRequestSchema.statics.getPendingForProvider = function (providerId) {
  return this.find({
    providerId,
    status: 'pending'
  })
    .populate('seekerId', 'name email')
    .sort({ createdAt: -1 });
};

/**
 * Get all requests for a provider (with pagination)
 */
contactRequestSchema.statics.getForProvider = function (providerId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  
  return this.find({ providerId })
    .populate('seekerId', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

export default mongoose.model('contactRequest', contactRequestSchema);
import mongoose from 'mongoose';

const serviceProviderSchema = new mongoose.Schema({
  // User reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true
  },

  // Basic info
  businessName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100
  },

  description: {
    type: String,
    trim: true,
    maxlength: 500
  },

  // Category info
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    required: true
  },

  subCategorySlug: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },

  // Location
  location: {
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    geo: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        validate: {
          validator: (v) => v.length === 2,
          message: 'Coordinates must be [longitude, latitude]'
        }
      }
    }
  },

  // Service images
  images: [
    {
      url: {
        type: String,
        required: true,
        trim: true
      },
      publicId: {
        type: String,
        required: true,
        trim: true
      }
    }
  ],

  // Status
  isActive: {
    type: Boolean,
    default: true
  },

  isPremium: {
    type: Boolean,
    default: false
  },

  // Public URL slug
  slug: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },

  // Metrics
  totalViews: {
    type: Number,
    default: 0,
    min: 0
  },

  totalInquiries: {
    type: Number,
    default: 0,
    min: 0
  },

  totalBookings: {
    type: Number,
    default: 0,
    min: 0
  },

  // Performance metrics
  ratingAverage: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },

  totalReviews: {
    type: Number,
    default: 0,
    min: 0
  },

  avgResponseTime: {
    type: Number,
    default: 24, // hours
    min: 0
  },

  completionRate: {
    type: Number,
    default: 100, // percentage
    min: 0,
    max: 100
  }
}, {
  timestamps: true,
  collection: 'serviceproviders'
});

// ============ INDEXES ============

// Geospatial index for location-based queries
serviceProviderSchema.index({ 'location.geo': '2dsphere' });



// Category search
serviceProviderSchema.index({ categoryId: 1, subCategorySlug: 1 });

// Status filtering
serviceProviderSchema.index({ isActive: 1 });

// Sorting by rating
serviceProviderSchema.index({ ratingAverage: -1, totalReviews: -1 });

// ============ INSTANCE METHODS ============

/**
 * Increment total views count
 */
serviceProviderSchema.methods.incrementViews = function () {
  this.totalViews += 1;
  return this.save();
};

/**
 * Increment total inquiries count
 */
serviceProviderSchema.methods.incrementInquiries = function () {
  this.totalInquiries += 1;
  return this.save();
};

/**
 * Increment total bookings count
 */
serviceProviderSchema.methods.incrementBookings = function () {
  this.totalBookings += 1;
  return this.save();
};

/**
 * Update rating and review count
 */
serviceProviderSchema.methods.updateRating = function (newRating, totalReviews) {
  this.ratingAverage = newRating;
  this.totalReviews = totalReviews;
  return this.save();
};

// ============ STATIC METHODS ============

/**
 * Find providers near a location
 * @param {Array} coordinates [longitude, latitude]
 * @param {Number} maxDistance Distance in meters (default 50km)
 */
serviceProviderSchema.statics.findNearby = function (coordinates, maxDistance = 50000) {
  return this.find({
    isActive: true,
    'location.geo': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates
        },
        $maxDistance: maxDistance
      }
    }
  });
};

/**
 * Find providers by category and location
 */
serviceProviderSchema.statics.findByCategoryNearby = function (
  categoryId,
  coordinates,
  maxDistance = 50000
) {
  return this.find({
    isActive: true,
    categoryId,
    'location.geo': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates
        },
        $maxDistance: maxDistance
      }
    }
  }).sort({ ratingAverage: -1, totalReviews: -1 });
};

/**
 * Find top-rated providers
 */
serviceProviderSchema.statics.findTopRated = function (limit = 10) {
  return this.find({ isActive: true })
    .sort({ ratingAverage: -1, totalReviews: -1 })
    .limit(limit);
};

/**
 * Find providers by category
 */
serviceProviderSchema.statics.findByCategory = function (categoryId) {
  return this.find({
    isActive: true,
    categoryId
  }).sort({ ratingAverage: -1 });
};

export default mongoose.model('serviceProvider', serviceProviderSchema);
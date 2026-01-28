import mongoose from 'mongoose';

const serviceProviderSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    categoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    subCategorySlug:{
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    businessName:{
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        trim: true,
    },
    
    // Images array for service photos
    images: [
      {
        type: String,
        trim: true
      }
    ],
    
    location:{
        city: String,
        state: String,
        geo:{
            type:{
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates:{
                type: [Number],
                required: true,
                validate:{
                    validator: v => v.length === 2,
                    message: 'Coordinates must be [lng,lat]'
                }
            }
        }
    },
    isActive:{
        type: Boolean,
        default: true
    },
    
    // Premium account status
    isPremium: {
        type: Boolean,
        default: false
    },
    
    ratingAverage:{
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    totalReviews:{
        type: Number,
        default: 0
    },
    
    // Service metrics
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
    avgResponseTime: {
        type: Number,
        default: 24,
        min: 0
    },
    completionRate: {
        type: Number,
        default: 100,
        min: 0,
        max: 100
    },
    
    // Auto-generated URL slug
    slug: {
        type: String,
        unique: true,
        sparse: true,
        lowercase: true,
        trim: true
    }
    
},{timestamps: true});

// ============ INDEXES ============

// Geospatial index for location-based queries
serviceProviderSchema.index({ 'location.geo': '2dsphere' });

// Compound index for category and subcategory lookups
serviceProviderSchema.index({
  categoryId: 1,
  subCategorySlug: 1,
});

// Index for user lookups
serviceProviderSchema.index({ userId: 1 });

// Index for filtering active providers
serviceProviderSchema.index({ isActive: 1 });

// Compound index for sorting by rating
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
          coordinates: coordinates
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
    categoryId: categoryId,
    'location.geo': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        $maxDistance: maxDistance
      }
    }
  }).sort({ ratingAverage: -1 });
};

/**
 * Find top-rated providers
 */
serviceProviderSchema.statics.findTopRated = function (limit = 10) {
  return this.find({ isActive: true })
    .sort({ ratingAverage: -1, totalReviews: -1 })
    .limit(limit);
};

export default mongoose.model('serviceProvider', serviceProviderSchema);
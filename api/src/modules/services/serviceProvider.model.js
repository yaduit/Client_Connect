import mongoose from 'mongoose';

// NOTE: previous versions of this schema defined `unique: true` on
// slug and userId *and* created indexes separately, which caused
// mongoose warnings about duplicate schema indexes.  We now define
// the unique indexes explicitly below and remove the inline `unique`
// flags.  When upgrading ensure you drop any existing duplicate
// indexes from the `serviceproviders` collection (e.g.
// `db.serviceproviders.dropIndex('slug_1')` in the mongo shell) so
// that mongoose can recreate them cleanly.  

const serviceProviderSchema = new mongoose.Schema({
  // User reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    // unique index defined explicitly below to avoid duplicate warnings
  },

  // Business Information
  businessName: {
    type: String,
    required: true,
    trim: true
  },

  slug: {
    type: String,
    trim: true
    // unique index defined explicitly below to avoid duplicate warnings
  },

  description: {
    type: String,
    trim: true,
    default: ''
  },

  // Category
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    required: true
  },

  subCategorySlug: {
    type: String,
    trim: true
  },

  // Location with Geospatial Support
  location: {
    address: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    zipCode: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      default: 'USA'
    },
    // GeoJSON Point for geospatial queries
    geo: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        // no default; coordinates must be provided by the application
      }
    }
  },

  // Images
  images: [
    {
      url: String,
      publicId: String
    }
  ],

  // Contact Information
  phone: {
    type: String,
    trim: true
  },

  email: {
    type: String,
    trim: true,
    lowercase: true
  },

  website: {
    type: String,
    trim: true
  },

  // Ratings & Reviews
  ratingAverage: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },

  totalReviews: {
    type: Number,
    default: 0
  },

  // Stats
  totalViews: {
    type: Number,
    default: 0
  },

  totalInquiries: {
    type: Number,
    default: 0
  },

  totalBookings: {
    type: Number,
    default: 0
  },

  // Status
  isActive: {
    type: Boolean,
    default: true
  },

  isPremium: {
    type: Boolean,
    default: false
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  // Business Hours
  businessHours: {
    monday: { open: String, close: String, isOpen: Boolean },
    tuesday: { open: String, close: String, isOpen: Boolean },
    wednesday: { open: String, close: String, isOpen: Boolean },
    thursday: { open: String, close: String, isOpen: Boolean },
    friday: { open: String, close: String, isOpen: Boolean },
    saturday: { open: String, close: String, isOpen: Boolean },
    sunday: { open: String, close: String, isOpen: Boolean }
  }
}, { 
  timestamps: true 
});

// Create 2dsphere index for geospatial queries
serviceProviderSchema.index({ 'location.geo': '2dsphere' });

// Unique indexes (explicit to avoid duplicates when using `unique:true` in field definitions)
serviceProviderSchema.index({ userId: 1 }, { unique: true });
serviceProviderSchema.index({ slug: 1 }, { unique: true });

// Additional indexes for performance
serviceProviderSchema.index({ categoryId: 1, isActive: 1 });
serviceProviderSchema.index({ ratingAverage: -1 });

// Pre-save hook to generate slug
serviceProviderSchema.pre('save', function(next) {
  if (this.isModified('businessName') && !this.slug) {
    this.slug = this.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + this._id.toString().slice(-6);
  }
  next();
});

export default mongoose.model('serviceProvider', serviceProviderSchema);
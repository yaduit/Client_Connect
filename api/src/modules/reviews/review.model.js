import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  // Provider being reviewed
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'serviceProvider',
    required: true
  },

  // User submitting the review
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },

  // Review content
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 100
  },

  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 1000
  },

  // Moderation
  isApproved: {
    type: Boolean,
    default: false
  },

  isRejected: {
    type: Boolean,
    default: false
  },

  rejectionReason: {
    type: String,
    trim: true
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for better query performance
reviewSchema.index({ providerId: 1, userId: 1 }, { unique: true });
reviewSchema.index({ providerId: 1, isApproved: 1 });

export default mongoose.model('review', reviewSchema);

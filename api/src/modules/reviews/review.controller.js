import Review from './review.model.js';
import ServiceProvider from '../services/serviceProvider.model.js';
import User from '../users/user.model.js';

/**
 * Create a new review
 * POST /reviews
 */
export const createReview = async (req, res) => {
  try {
    const { providerId, rating, title, description } = req.body;
    const userId = req.user._id;

    // Validation
    if (!providerId || !rating || !title || !description) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if provider exists
    const provider = await ServiceProvider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Check if user already reviewed this provider
    const existingReview = await Review.findOne({ providerId, userId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this provider. You can only edit your existing review' });
    }

    // Create new review
    const review = new Review({
      providerId,
      userId,
      rating,
      title,
      description
    });

    await review.save();

    // Update provider's rating and review count
    const allReviews = await Review.find({ providerId, isApproved: true });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    await ServiceProvider.findByIdAndUpdate(providerId, {
      ratingAverage: Math.round(avgRating * 10) / 10,
      totalReviews: allReviews.length
    });

    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      message: 'Failed to create review',
      error: error.message
    });
  }
};

/**
 * Get all reviews for a provider (only approved)
 * GET /providers/:providerId/reviews
 */
export const getProviderReviews = async (req, res) => {
  try {
    const { providerId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Check if provider exists
    const provider = await ServiceProvider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    const reviews = await Review.find({ providerId, isApproved: true })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ providerId, isApproved: true });

    res.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

/**
 * Get all reviews by the logged-in user
 * GET /reviews/me
 */
export const getMyReviews = async (req, res) => {
  try {
    const userId = req.user._id;

    const reviews = await Review.find({ userId })
      .populate('providerId', 'businessName location')
      .sort({ createdAt: -1 });

    res.json({ reviews });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

/**
 * Update a review
 * PATCH /reviews/:reviewId
 */
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, description } = req.body;
    const userId = req.user._id;

    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is the review author
    if (review.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized to update this review' });
    }

    // Update review
    if (rating) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
      }
      review.rating = rating;
    }
    if (title) review.title = title;
    if (description) review.description = description;

    await review.save();

    // Recalculate provider's rating
    const providerId = review.providerId;
    const allReviews = await Review.find({ providerId, isApproved: true });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    await ServiceProvider.findByIdAndUpdate(providerId, {
      ratingAverage: Math.round(avgRating * 10) / 10,
      totalReviews: allReviews.length
    });

    res.json({
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      message: 'Failed to update review',
      error: error.message
    });
  }
};

/**
 * Delete a review
 * DELETE /reviews/:reviewId
 */
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is the review author
    if (review.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this review' });
    }

    const providerId = review.providerId;

    // Delete the review
    await Review.findByIdAndDelete(reviewId);

    // Recalculate provider's rating
    const allReviews = await Review.find({ providerId, isApproved: true });
    
    if (allReviews.length > 0) {
      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      await ServiceProvider.findByIdAndUpdate(providerId, {
        ratingAverage: Math.round(avgRating * 10) / 10,
        totalReviews: allReviews.length
      });
    } else {
      await ServiceProvider.findByIdAndUpdate(providerId, {
        ratingAverage: 0,
        totalReviews: 0
      });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      message: 'Failed to delete review',
      error: error.message
    });
  }
};

/**
 * Get all reviews (admin only)
 * GET /reviews/admin/all
 */
export const getAllReviewsAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status } = req.query; // pending, approved, rejected

    let filter = {};
    if (status === 'pending') {
      filter = { isApproved: false, isRejected: false };
    } else if (status === 'approved') {
      filter = { isApproved: true, isRejected: false };
    } else if (status === 'rejected') {
      filter = { isRejected: true };
    }

    const reviews = await Review.find(filter)
      .populate('userId', 'name email')
      .populate('providerId', 'businessName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments(filter);

    res.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching reviews for admin:', error);
    res.status(500).json({
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

/**
 * Approve a review (admin only)
 * PATCH /reviews/:reviewId/approve
 */
export const approveReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { isApproved: true, isRejected: false },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Recalculate provider's rating
    const providerId = review.providerId;
    const allReviews = await Review.find({ providerId, isApproved: true });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    await ServiceProvider.findByIdAndUpdate(providerId, {
      ratingAverage: Math.round(avgRating * 10) / 10,
      totalReviews: allReviews.length
    });

    res.json({
      message: 'Review approved successfully',
      review
    });
  } catch (error) {
    console.error('Error approving review:', error);
    res.status(500).json({
      message: 'Failed to approve review',
      error: error.message
    });
  }
};

/**
 * Reject a review (admin only)
 * PATCH /reviews/:reviewId/reject
 */
export const rejectReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reason } = req.body;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { isRejected: true, rejectionReason: reason },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({
      message: 'Review rejected successfully',
      review
    });
  } catch (error) {
    console.error('Error rejecting review:', error);
    res.status(500).json({
      message: 'Failed to reject review',
      error: error.message
    });
  }
};

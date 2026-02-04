/**
 * Review Controller
 * Handles review management
 */

const Review = require('../models/Review');
const { ApiError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Get all reviews (public - approved only by default)
 */
const getAllReviews = async (req, res, next) => {
  try {
    const filters = {
      versionId: req.query.versionId,
      approved: req.query.approved === 'false' ? false : (req.query.approved === 'true' ? true : (req.user ? undefined : true)),
      featured: req.query.featured === 'true' ? true : undefined,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10
    };

    const result = await Review.getAll(filters);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new review (authenticated users only)
 */
const createReview = async (req, res, next) => {
  try {
    const { version_id, reviewer_name, review_text } = req.body;

    // Require authentication
    if (!req.user) {
      throw new ApiError(401, 'Authentication required to submit a review');
    }

    const review = await Review.create({
      version_id,
      user_id: req.user.id,
      reviewer_name: reviewer_name || req.user.username,
      review_text
    });

    logger.info('New review submitted', { reviewId: review.id, versionId: version_id, userId: req.user.id });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully. It will be visible after moderation.',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user's reviews
 */
const getUserReviews = async (req, res, next) => {
  try {
    const reviews = await Review.getByUserId(req.user.id);

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user's own review
 */
const updateUserReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { review_text, reviewer_name } = req.body;

    const review = await Review.updateByUser(id, req.user.id, {
      review_text,
      reviewer_name
    });

    if (!review) {
      throw new ApiError(404, 'Review not found or you do not have permission to edit it');
    }

    logger.info('Review updated by user', { reviewId: id, userId: req.user.id });

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user's own review
 */
const deleteUserReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await Review.deleteByUser(id, req.user.id);

    if (!deleted) {
      throw new ApiError(404, 'Review not found or you do not have permission to delete it');
    }

    logger.info('Review deleted by user', { reviewId: id, userId: req.user.id });

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Approve review (admin/moderator)
 */
const approveReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const review = await Review.update(id, { is_approved: true });
    
    if (!review) {
      throw new ApiError(404, 'Review not found');
    }

    logger.info('Review approved', { reviewId: id, userId: req.user.id });

    res.json({
      success: true,
      message: 'Review approved',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Feature review (admin)
 */
const featureReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_featured } = req.body;
    
    const review = await Review.update(id, { is_featured });
    
    if (!review) {
      throw new ApiError(404, 'Review not found');
    }

    logger.info('Review featured status updated', { reviewId: id, isFeatured: is_featured });

    res.json({
      success: true,
      message: `Review ${is_featured ? 'featured' : 'unfeatured'}`,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete review (admin)
 */
const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    await Review.softDelete(id);

    logger.info('Review deleted', { reviewId: id, userId: req.user.id });

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllReviews,
  createReview,
  getUserReviews,
  updateUserReview,
  deleteUserReview,
  approveReview,
  featureReview,
  deleteReview
};

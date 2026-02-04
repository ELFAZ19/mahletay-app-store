/**
 * Rating Controller
 * Handles star ratings for versions
 */

const Rating = require('../models/Rating');
const { ApiError } = require('../middleware/errorHandler');
const { RATING } = require('../config/constants');

/**
 * Submit or update rating (public)
 */
const submitRating = async (req, res, next) => {
  try {
    const { version_id, rating } = req.body;

    // Validate rating
    if (rating < RATING.MIN || rating > RATING.MAX) {
      throw new ApiError(400, `Rating must be between ${RATING.MIN} and ${RATING.MAX}`);
    }

    const result = await Rating.upsert({
      version_id,
      rating,
      ip_address: req.ip
    });

    res.status(201).json({
      success: true,
      message: 'Rating submitted successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get rating statistics for a version (public)
 */
const getRatingStats = async (req, res, next) => {
  try {
    const { versionId } = req.params;
    
    const stats = await Rating.getStats(versionId);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Check if user has rated a version (public)
 */
const checkUserRating = async (req, res, next) => {
  try {
    const { versionId } = req.params;
    const ipAddress = req.ip;
    
    const hasRated = await Rating.hasRated(versionId, ipAddress);

    res.json({
      success: true,
      data: { hasRated }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitRating,
  getRatingStats,
  checkUserRating
};

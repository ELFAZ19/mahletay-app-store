/**
 * Feedback Controller
 * Handles user feedback submissions
 */

const Feedback = require('../models/Feedback');
const { ApiError } = require('../middleware/errorHandler');
const { FEEDBACK_TYPES, FEEDBACK_STATUS } = require('../config/constants');
const logger = require('../utils/logger');

/**
 * Get all feedback (admin/moderator)
 */
const getAllFeedback = async (req, res, next) => {
  try {
    const filters = {
      type: req.query.type,
      status: req.query.status,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10
    };

    const result = await Feedback.getAll(filters);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit feedback (authenticated users only)
 */
const submitFeedback = async (req, res, next) => {
  try {
    const { type, name, email, message } = req.body;

    // Require authentication
    if (!req.user) {
      throw new ApiError(401, 'Authentication required to submit feedback');
    }

    // Validate feedback type
    if (!Object.values(FEEDBACK_TYPES).includes(type)) {
      throw new ApiError(400, 'Invalid feedback type');
    }

    const feedback = await Feedback.create({
      user_id: req.user.id,
      type,
      name: name || req.user.username,
      email: email || req.user.email,
      message
    });

    logger.info('New feedback submitted', { feedbackId: feedback.id, type, userId: req.user.id });

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback. We will review it soon.',
      data: feedback
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user's feedback
 */
const getUserFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.getByUserId(req.user.id);

    res.json({
      success: true,
      data: feedback
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user's own feedback
 */
const updateUserFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type, message } = req.body;

    // Validate type if provided
    if (type && !Object.values(FEEDBACK_TYPES).includes(type)) {
      throw new ApiError(400, 'Invalid feedback type');
    }

    const feedback = await Feedback.updateByUser(id, req.user.id, {
      type,
      message
    });

    if (!feedback) {
      throw new ApiError(404, 'Feedback not found or you do not have permission to edit it');
    }

    logger.info('Feedback updated by user', { feedbackId: id, userId: req.user.id });

    res.json({
      success: true,
      message: 'Feedback updated successfully',
      data: feedback
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user's own feedback
 */
const deleteUserFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await Feedback.deleteByUser(id, req.user.id);

    if (!deleted) {
      throw new ApiError(404, 'Feedback not found or you do not have permission to delete it');
    }

    logger.info('Feedback deleted by user', { feedbackId: id, userId: req.user.id });

    res.json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Respond to feedback (admin/moderator)
 */
const respondToFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { admin_response, status } = req.body;

    // Validate status
    if (status && !Object.values(FEEDBACK_STATUS).includes(status)) {
      throw new ApiError(400, 'Invalid status');
    }

    const feedback = await Feedback.respond(id, {
      admin_response,
      responded_by: req.user.id,
      status: status || FEEDBACK_STATUS.REVIEWED
    });

    if (!feedback) {
      throw new ApiError(404, 'Feedback not found');
    }

    logger.info('Feedback responded to', { feedbackId: id, userId: req.user.id });

    res.json({
      success: true,
      message: 'Response submitted successfully',
      data: feedback
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get feedback statistics (admin)
 */
const getFeedbackStats = async (req, res, next) => {
  try {
    const stats = await Feedback.getStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllFeedback,
  submitFeedback,
  getUserFeedback,
  updateUserFeedback,
  deleteUserFeedback,
  respondToFeedback,
  getFeedbackStats
};

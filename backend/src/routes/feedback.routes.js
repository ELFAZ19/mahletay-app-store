/**
 * Feedback Routes
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const feedbackController = require('../controllers/feedbackController');
const { authenticateToken, isAdminOrModerator } = require('../middleware/auth');

// Validation middleware for feedback submission
const feedbackValidation = [
  body('type').isIn(['bug', 'suggestion', 'blessing']).withMessage('Valid feedback type is required'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('message').trim().notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters')
];

// Validation for response
const responseValidation = [
  body('admin_response').trim().notEmpty().withMessage('Response is required'),
  body('status').optional().isIn(['pending', 'reviewed', 'resolved']).withMessage('Invalid status')
];

/**
 * Public routes
 */

/**
 * @route   POST /api/feedback
 * @desc    Submit feedback
 * @access  Authenticated
 */
router.post('/', authenticateToken, feedbackValidation, feedbackController.submitFeedback);

/**
 * User-specific routes
 */

/**
 * @route   GET /api/feedback/my-feedback
 * @desc    Get current user's feedback
 * @access  Authenticated
 */
router.get('/my-feedback', authenticateToken, feedbackController.getUserFeedback);

/**
 * @route   PATCH /api/feedback/my-feedback/:id
 * @desc    Update user's own feedback
 * @access  Authenticated
 */
router.patch('/my-feedback/:id', authenticateToken, feedbackValidation, feedbackController.updateUserFeedback);

/**
 * @route   DELETE /api/feedback/my-feedback/:id
 * @desc    Delete user's own feedback
 * @access  Authenticated
 */
router.delete('/my-feedback/:id', authenticateToken, feedbackController.deleteUserFeedback);

/**
 * Admin/Moderator routes
 */

/**
 * @route   GET /api/feedback
 * @desc    Get all feedback
 * @access  Admin/Moderator
 */
router.get('/', authenticateToken, isAdminOrModerator, feedbackController.getAllFeedback);

/**
 * @route   POST /api/feedback/:id/respond
 * @desc    Respond to feedback
 * @access  Admin/Moderator
 */
router.post('/:id/respond', authenticateToken, isAdminOrModerator, responseValidation, feedbackController.respondToFeedback);

/**
 * @route   GET /api/feedback/stats
 * @desc    Get feedback statistics
 * @access  Admin
 */
router.get('/stats', authenticateToken, isAdminOrModerator, feedbackController.getFeedbackStats);

module.exports = router;

/**
 * Review Routes
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const reviewController = require('../controllers/reviewController');
const { authenticateToken, isAdminOrModerator } = require('../middleware/auth');

// Validation middleware for review creation
const reviewValidation = [
  body('version_id').isInt().withMessage('Valid version ID is required'),
  body('reviewer_name').trim().notEmpty().withMessage('Reviewer name is required'),
  body('review_text').trim().notEmpty().withMessage('Review text is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Review must be between 10 and 1000 characters')
];

/**
 * Public routes
 */

/**
 * @route   GET /api/reviews
 * @desc    Get all approved reviews
 * @access  Public
 */
router.get('/', reviewController.getAllReviews);

/**
 * @route   POST /api/reviews
 * @desc    Submit new review
 * @access  Authenticated
 */
router.post('/', authenticateToken, reviewValidation, reviewController.createReview);

/**
 * User-specific routes
 */

/**
 * @route   GET /api/reviews/my-reviews
 * @desc    Get current user's reviews
 * @access  Authenticated
 */
router.get('/my-reviews', authenticateToken, reviewController.getUserReviews);

/**
 * @route   PATCH /api/reviews/my-reviews/:id
 * @desc    Update user's own review
 * @access  Authenticated
 */
router.patch('/my-reviews/:id', authenticateToken, reviewValidation, reviewController.updateUserReview);

/**
 * @route   DELETE /api/reviews/my-reviews/:id
 * @desc    Delete user's own review
 * @access  Authenticated
 */
router.delete('/my-reviews/:id', authenticateToken, reviewController.deleteUserReview);

/**
 * Moderator/Admin routes
 */

/**
 * @route   PATCH /api/reviews/:id/approve
 * @desc    Approve review
 * @access  Moderator/Admin
 */
router.patch('/:id/approve', authenticateToken, isAdminOrModerator, reviewController.approveReview);

/**
 * @route   PATCH /api/reviews/:id/feature
 * @desc    Feature/unfeature review
 * @access  Admin
 */
router.patch('/:id/feature', authenticateToken, isAdminOrModerator, reviewController.featureReview);

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Delete review
 * @access  Moderator/Admin
 */
router.delete('/:id', authenticateToken, isAdminOrModerator, reviewController.deleteReview);

module.exports = router;

/**
 * Rating Routes
 */

const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const ratingController = require('../controllers/ratingController');

// Validation middleware for rating submission
const ratingValidation = [
  body('version_id').isInt().withMessage('Valid version ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
];

/**
 * @route   POST /api/ratings
 * @desc    Submit or update rating
 * @access  Public
 */
router.post('/', ratingValidation, ratingController.submitRating);

/**
 * @route   GET /api/ratings/:versionId/stats
 * @desc    Get rating statistics for a version
 * @access  Public
 */
router.get('/:versionId/stats', ratingController.getRatingStats);

/**
 * @route   GET /api/ratings/:versionId/check
 * @desc    Check if user has rated a version
 * @access  Public
 */
router.get('/:versionId/check', ratingController.checkUserRating);

module.exports = router;

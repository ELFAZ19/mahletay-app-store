/**
 * Analytics Routes
 */

const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateToken, isAdminOrModerator } = require('../middleware/auth');

/**
 * @route   GET /api/analytics/dashboard
 * @desc    Get dashboard analytics
 * @access  Admin/Moderator
 */
router.get('/dashboard', authenticateToken, isAdminOrModerator, analyticsController.getDashboardAnalytics);

module.exports = router;

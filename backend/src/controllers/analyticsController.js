/**
 * Analytics Controller
 * Provides dashboard analytics for admin
 */

const Download = require('../models/Download');
const Feedback = require('../models/Feedback');
const Review = require('../models/Review');
const AppVersion = require('../models/AppVersion');
const db = require('../config/database');

/**
 * Get dashboard analytics (admin)
 */
const getDashboardAnalytics = async (req, res, next) => {
  try {
    // Total downloads
    const totalDownloads = await Download.getTotalDownloads();

    // Download stats by version
    const downloadsByVersion = await Download.getStats('30days');

    // Feedback stats
    const feedbackStats = await Feedback.getStats();

    // Total reviews
    const [reviewCount] = await db.query(
      'SELECT COUNT(*) as total, SUM(CASE WHEN is_approved = true THEN 1 ELSE 0 END) as approved FROM reviews WHERE deleted_at IS NULL'
    );

    // Latest version stats
    const latestVersion = await AppVersion.getLatest();
    let latestVersionStats = null;
    if (latestVersion) {
      latestVersionStats = await AppVersion.getStats(latestVersion.id);
    }

    // Recent activity
   const [recentDownloads] = await db.query(
      'SELECT COUNT(*) as count FROM downloads WHERE downloaded_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
    );

    const [recentFeedback] = await db.query(
      'SELECT COUNT(*) as count FROM feedback WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
    );

    res.json({
      success: true,
      data: {
        overview: {
          totalDownloads,
          totalReviews: reviewCount[0].total,
          approvedReviews: reviewCount[0].approved,
          pendingReviews: reviewCount[0].total - reviewCount[0].approved,
          recentDownloads: recentDownloads[0].count,
          recentFeedback: recentFeedback[0].count
        },
        latestVersion: latestVersion ? {
          ...latestVersion,
          stats: latestVersionStats
        } : null,
        downloadsByVersion,
        feedbackStats
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardAnalytics
};

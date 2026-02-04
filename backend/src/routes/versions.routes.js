/**
 * Version Routes
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const versionController = require('../controllers/versionController');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const { upload } = require('../config/upload');
const { uploadLimiter } = require('../middleware/rateLimiter');

// Validation middleware for version creation
const versionValidation = [
  body('version_number').notEmpty().withMessage('Version number is required'),
  body('version_name').notEmpty().withMessage('Version name is required'),
  body('changelog').optional(),
  body('release_date').optional().isDate().withMessage('Valid date required')
];

/**
 * Public routes
 */

/**
 * @route   GET /api/versions
 * @desc    Get all versions
 * @access  Public
 */
router.get('/', versionController.getAllVersions);

/**
 * @route   GET /api/versions/latest
 * @desc    Get latest active version
 * @access  Public
 */
router.get('/latest', versionController.getLatestVersion);

/**
 * @route   GET /api/versions/:id
 * @desc    Get version by ID
 * @access  Public
 */
router.get('/:id', versionController.getVersionById);

/**
 * @route   GET /api/versions/:id/download
 * @desc    Download APK file
 * @access  Public
 */
router.get('/:id/download', versionController.downloadAPK);

/**
 * Admin routes
 */

/**
 * @route   POST /api/versions
 * @desc    Create new version
 * @access  Admin
 */
router.post(
  '/',
  authenticateToken,
  isAdmin,
  uploadLimiter,
  (req, res, next) => {
    req.uploadType = 'apk';
    next();
  },
  upload.single('apk'),
  versionValidation,
  versionController.createVersion
);

/**
 * @route   PATCH /api/versions/:id
 * @desc    Update version
 * @access  Admin
 */
router.patch('/:id', authenticateToken, isAdmin, versionController.updateVersion);

/**
 * @route   DELETE /api/versions/:id
 * @desc    Delete version
 * @access  Admin
 */
router.delete('/:id', authenticateToken, isAdmin, versionController.deleteVersion);

module.exports = router;

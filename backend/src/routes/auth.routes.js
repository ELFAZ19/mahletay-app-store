/**
 * Authentication Routes
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// Validation middleware for login
const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Validation middleware for registration
const registerValidation = [
  body('username').trim().isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', authLimiter, registerValidation, authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Admin/Moderator/User login
 * @access  Public
 */
router.post('/login', authLimiter, loginValidation, authController.login);

/**
 * @route   POST /api/auth/verify
 * @desc    Verify JWT token
 * @access  Private
 */
router.post('/verify', authenticateToken, authController.verifyToken);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout (optional for logging)
 * @access  Private
 */
router.post('/logout', authenticateToken, authController.logout);

module.exports = router;

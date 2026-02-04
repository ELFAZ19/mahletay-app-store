/**
 * Authentication Middleware
 * JWT verification and role-based access control
 */

const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const { ROLES } = require('../config/constants');
const logger = require('../utils/logger');

/**
 * Verify JWT token
 */
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    jwt.verify(token, jwtConfig.secret, (err, user) => {
      if (err) {
        logger.warn('Token verification failed', { error: err.message });
        return res.status(403).json({ 
          success: false, 
          message: 'Invalid or expired token' 
        });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    logger.error('Authentication error', { error: error.message });
    res.status(500).json({ 
      success: false, 
      message: 'Authentication error' 
    });
  }
};

/**
 * Check if user has admin role
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === ROLES.ADMIN) {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }
};

/**
 * Check if user has admin or moderator role
 */
const isAdminOrModerator = (req, res, next) => {
  if (req.user && (req.user.role === ROLES.ADMIN || req.user.role === ROLES.MODERATOR)) {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      message: 'Moderator or Admin access required' 
    });
  }
};

module.exports = {
  authenticateToken,
  isAdmin,
  isAdminOrModerator
};

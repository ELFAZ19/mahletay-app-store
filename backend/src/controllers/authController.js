/**
 * Authentication Controller
 * Handles user login, logout, and token management
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const jwtConfig = require('../config/jwt');
const logger = require('../utils/logger');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Admin login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Verify password
    const isValidPassword = await User.verifyPassword(password, user.password_hash);
    
    if (!isValidPassword) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    // Update last login
    await User.updateLastLogin(user.id);

    logger.info('User logged in', { userId: user.id, email: user.email });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify token (optional endpoint to check if token is still valid)
 */
const verifyToken = async (req, res, next) => {
  try {
    // If middleware passed, token is valid
    res.json({
      success: true,
      message: 'Token is valid',
      data: { user: req.user }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Register new user
 */
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new ApiError(400, 'Email already registered');
    }

    // Check if username already exists
    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      throw new ApiError(400, 'Username already taken');
    }

    // Create new user with 'user' role
    const newUser = await User.create({
      username,
      email,
      password,
      role: 'user'
    });

    // Generate JWT token for automatic login
    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email,
        username: newUser.username,
        role: newUser.role 
      },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    logger.info('New user registered', { userId: newUser.id, email: newUser.email });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout (optional - mainly for logging purposes as JWT is stateless)
 */
const logout = async (req, res, next) => {
  try {
    logger.info('User logged out', { userId: req.user.id });
    
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  register,
  verifyToken,
  logout
};

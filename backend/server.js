/**
 * Express Server
 * Main application entry point
 */

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const logger = require('./src/utils/logger');
const { errorHandler, notFound } = require('./src/middleware/errorHandler');
const { apiLimiter } = require('./src/middleware/rateLimiter');

// Import routes
const authRoutes = require('./src/routes/auth.routes');
const versionRoutes = require('./src/routes/versions.routes');
const reviewRoutes = require('./src/routes/reviews.routes');
const ratingRoutes = require('./src/routes/ratings.routes');
const feedbackRoutes = require('./src/routes/feedback.routes');
const analyticsRoutes = require('./src/routes/analytics.routes');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ===========================================
// Middleware
// ===========================================

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Allow downloads
}));

// CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate limiting for API routes
app.use('/api', apiLimiter);

// Logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

// ===========================================
// Routes
// ===========================================

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Orthodox Hymn API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/versions', versionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/analytics', analyticsRoutes);

// ===========================================
// Error Handling
// ===========================================

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// ===========================================
// Server Start
// ===========================================

app.listen(PORT, () => {
  console.log(`
  ╔═════════════════════════════════════════════════════════════════════╗
  ║   mahletay app store API Server                                     ║
  ║   Port: ${PORT}                                                        ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}                                          ║
  ║   Status: ✅ Runnin                                                 ║
  ╚═════════════════════════════════════════════════════════════════════╝
  `);
  logger.info('Server started successfully', { port: PORT });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection', { error: err.message, stack: err.stack });
  console.error('UNHANDLED REJECTION! Shutting down...');
  process.exit(1);
});

module.exports = app;

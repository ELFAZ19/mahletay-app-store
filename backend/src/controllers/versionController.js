/**
 * Version Controller
 * Handles app version management
 */

const AppVersion = require('../models/AppVersion');
const Download = require('../models/Download');
const { ApiError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
const path = require('path');
const fs = require('fs').promises;

/**
 * Get all versions (public)
 */
const getAllVersions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const activeOnly = req.query.activeOnly === 'true';

    const result = await AppVersion.getAll(page, limit, activeOnly);

    // Add stats to each version
    for (let version of result.versions) {
      const stats = await AppVersion.getStats(version.id);
      version.stats = stats;
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get latest version (public)
 */
const getLatestVersion = async (req, res, next) => {
  try {
    const version = await AppVersion.getLatest();
    
    if (!version) {
      throw new ApiError(404, 'No active version found');
    }

    const stats = await AppVersion.getStats(version.id);
    version.stats = stats;

    res.json({
      success: true,
      data: version
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get version by ID (public)
 */
const getVersionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const version = await AppVersion.findById(id);
    
    if (!version) {
      throw new ApiError(404, 'Version not found');
    }

    const stats = await AppVersion.getStats(version.id);
    version.stats = stats;

    res.json({
      success: true,
      data: version
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Download APK (public)
 */
const downloadAPK = async (req, res, next) => {
  try {
    const { id } = req.params;
    const version = await AppVersion.findById(id);
    
    if (!version) {
      throw new ApiError(404, 'Version not found');
    }

    // Log download
    await Download.logDownload({
      version_id: version.id,
      ip_address: req.ip,
      user_agent: req.get('User-Agent')
    });

    // Send file
    const filePath = path.join(__dirname, '../..', version.file_path);
    res.download(filePath, `orthodox-hymn-${version.version_number}.apk`);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new version (admin)
 */
const createVersion = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(400, 'APK file is required');
    }

    const { version_number, version_name, changelog, release_date } = req.body;

    // Create version record
    const version = await AppVersion.create({
      version_number,
      version_name,
      changelog,
      file_path: req.file.path.replace(/\\/g, '/'),
      file_size: req.file.size,
      release_date: release_date || new Date().toISOString().split('T')[0]
    });

    logger.info('New version created', { versionId: version.id, versionNumber: version_number });

    res.status(201).json({
      success: true,
      message: 'Version created successfully',
      data: version
    });
  } catch (error) {
    // Clean up uploaded file if version creation fails
    if (req.file) {
      await fs.unlink(req.file.path).catch(err => logger.error('Failed to delete file', err));
    }
    next(error);
  }
};

/**
 * Update version (admin)
 */
const updateVersion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const version = await AppVersion.update(id, updates);
    
    if (!version) {
      throw new ApiError(404, 'Version not found');
    }

    logger.info('Version updated', { versionId: id });

    res.json({
      success: true,
      message: 'Version updated successfully',
      data: version
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete version (admin)
 */
const deleteVersion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const version = await AppVersion.findById(id);
    
    if (!version) {
      throw new ApiError(404, 'Version not found');
    }

    // Delete file
    const filePath = path.join(__dirname, '../..', version.file_path);
    await fs.unlink(filePath).catch(err => logger.warn('Failed to delete file', err));

    // Delete from database
    await AppVersion.delete(id);

    logger.info('Version deleted', { versionId: id });

    res.json({
      success: true,
      message: 'Version deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllVersions,
  getLatestVersion,
  getVersionById,
  downloadAPK,
  createVersion,
  updateVersion,
  deleteVersion
};

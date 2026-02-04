/**
 * AppVersion Model
 * Database operations for app_versions table
 */

const db = require('../config/database');

class AppVersion {
  /**
   * Get all versions with pagination
   */
  static async getAll(page = 1, limit = 10, activeOnly = false) {
    try {
      const offset = (page - 1) * limit;
      let query = 'SELECT * FROM app_versions';
      const params = [];

      if (activeOnly) {
        query += ' WHERE is_active = true';
      }

      query += ' ORDER BY release_date DESC, created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [rows] = await db.query(query, params);
      
      // Get total count
      const countQuery = activeOnly 
        ? 'SELECT COUNT(*) as total FROM app_versions WHERE is_active = true'
        : 'SELECT COUNT(*) as total FROM app_versions';
      const [countResult] = await db.query(countQuery);
      
      return {
        versions: rows,
        pagination: {
          page,
          limit,
          total: countResult[0].total,
          totalPages: Math.ceil(countResult[0].total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get latest version
   */
  static async getLatest() {
    try {
      const [rows] = await db.query(
        'SELECT * FROM app_versions WHERE is_active = true ORDER BY release_date DESC, created_at DESC LIMIT 1'
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get version by ID
   */
  static async findById(id) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM app_versions WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create new version
   */
  static async create(versionData) {
    try {
      const { version_number, version_name, changelog, file_path, file_size, release_date } = versionData;
      
      const [result] = await db.query(
        'INSERT INTO app_versions (version_number, version_name, changelog, file_path, file_size, release_date) VALUES (?, ?, ?, ?, ?, ?)',
        [version_number, version_name, changelog, file_path, file_size, release_date]
      );

      return { id: result.insertId, ...versionData };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update version
   */
  static async update(id, updates) {
    try {
      const fields = [];
      const values = [];

      Object.keys(updates).forEach(key => {
        if (updates[key] !== undefined) {
          fields.push(`${key} = ?`);
          values.push(updates[key]);
        }
      });

      if (fields.length === 0) return null;

      values.push(id);
      const query = `UPDATE app_versions SET ${fields.join(', ')} WHERE id = ?`;
      
      await db.query(query, values);
      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete version
   */
  static async delete(id) {
    try {
      await db.query('DELETE FROM app_versions WHERE id = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get version stats (ratings and downloads)
   */
  static async getStats(versionId) {
    try {
      // Get average rating
      const [ratingRows] = await db.query(
        'SELECT AVG(rating) as avg_rating, COUNT(*) as rating_count FROM ratings WHERE version_id = ?',
        [versionId]
      );

      // Get download count
      const [downloadRows] = await db.query(
        'SELECT COUNT(*) as download_count FROM downloads WHERE version_id = ?',
        [versionId]
      );

      return {
        avgRating: parseFloat(ratingRows[0].avg_rating) || 0,
        ratingCount: ratingRows[0].rating_count,
        downloadCount: downloadRows[0].download_count
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AppVersion;

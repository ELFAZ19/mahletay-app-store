/**
 * Review Model
 * Database operations for reviews table
 */

const db = require('../config/database');

class Review {
  /**
   * Get all reviews with filters
   */
  static async getAll(filters = {}) {
    try {
      const { versionId, approved, featured, page = 1, limit = 10 } = filters;
      const offset = (page - 1) * limit;
      
      let query = 'SELECT * FROM reviews WHERE deleted_at IS NULL';
      const params = [];

      if (versionId) {
        query += ' AND version_id = ?';
        params.push(versionId);
      }

      if (approved !== undefined) {
        query += ' AND is_approved = ?';
        params.push(approved);
      }

      if (featured !== undefined) {
        query += ' AND is_featured = ?';
        params.push(featured);
      }

      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [rows] = await db.query(query, params);

      // Get total count
      let countQuery = 'SELECT COUNT(*) as total FROM reviews WHERE deleted_at IS NULL';
      const countParams = [];
      
      if (versionId) {
        countQuery += ' AND version_id = ?';
        countParams.push(versionId);
      }
      if (approved !== undefined) {
        countQuery += ' AND is_approved = ?';
        countParams.push(approved);
      }

      const [countResult] = await db.query(countQuery, countParams);

      return {
        reviews: rows,
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
   * Create new review
   */
  static async create(reviewData) {
    try {
      const { version_id, reviewer_name, review_text, user_id } = reviewData;
      
      const [result] = await db.query(
        'INSERT INTO reviews (version_id, user_id, reviewer_name, review_text) VALUES (?, ?, ?, ?)',
        [version_id, user_id, reviewer_name, review_text]
      );

      return { id: result.insertId, ...reviewData, is_approved: false };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get reviews by user ID
   */
  static async getByUserId(userId) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM reviews WHERE user_id = ? AND deleted_at IS NULL ORDER BY created_at DESC',
        [userId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update review by user (with ownership check)
   */
  static async updateByUser(id, userId, updates) {
    try {
      // First check ownership
      const review = await this.findById(id);
      if (!review || review.user_id !== userId) {
        return null;
      }

      const fields = [];
      const values = [];

      // Only allow updating specific fields
      const allowedFields = ['review_text', 'reviewer_name'];
      Object.keys(updates).forEach(key => {
        if (allowedFields.includes(key) && updates[key] !== undefined) {
          fields.push(`${key} = ?`);
          values.push(updates[key]);
        }
      });

      if (fields.length === 0) return review;

      values.push(id);
      const query = `UPDATE reviews SET ${fields.join(', ')} WHERE id = ?`;
      
      await db.query(query, values);
      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete review by user (with ownership check)
   */
  static async deleteByUser(id, userId) {
    try {
      // First check ownership
      const review = await this.findById(id);
      if (!review || review.user_id !== userId) {
        return false;
      }

      await db.query(
        'UPDATE reviews SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update review (approve, feature, etc.)
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
      const query = `UPDATE reviews SET ${fields.join(', ')} WHERE id = ?`;
      
      await db.query(query, values);
      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find review by ID
   */
  static async findById(id) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM reviews WHERE id = ? AND deleted_at IS NULL',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Soft delete review
   */
  static async softDelete(id) {
    try {
      await db.query(
        'UPDATE reviews SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
      );
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Review;

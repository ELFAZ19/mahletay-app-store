/**
 * Feedback Model
 * Database operations for feedback table
 */

const db = require('../config/database');

class Feedback {
  /**
   * Get all feedback with filters
   */
  static async getAll(filters = {}) {
    try {
      const { type, status, page = 1, limit = 10 } = filters;
      const offset = (page - 1) * limit;
      
      let query = 'SELECT * FROM feedback WHERE 1=1';
      const params = [];

      if (type) {
        query += ' AND type = ?';
        params.push(type);
      }

      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }

      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [rows] = await db.query(query, params);

      // Get total count
      let countQuery = 'SELECT COUNT(*) as total FROM feedback WHERE 1=1';
      const countParams = [];
      
      if (type) {
        countQuery += ' AND type = ?';
        countParams.push(type);
      }
      if (status) {
        countQuery += ' AND status = ?';
        countParams.push(status);
      }

      const [countResult] = await db.query(countQuery, countParams);

      return {
        feedback: rows,
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
   * Create new feedback
   */
  static async create(feedbackData) {
    try {
      const { type, name, email, message, user_id } = feedbackData;
      
      const [result] = await db.query(
        'INSERT INTO feedback (user_id, type, name, email, message) VALUES (?, ?, ?, ?, ?)',
        [user_id, type, name, email, message]
      );

      return { id: result.insertId, ...feedbackData, status: 'pending' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get feedback by user ID
   */
  static async getByUserId(userId) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM feedback WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update feedback by user (with ownership check)
   */
  static async updateByUser(id, userId, updates) {
    try {
      // First check ownership
      const feedback = await this.findById(id);
      if (!feedback || feedback.user_id !== userId) {
        return null;
      }

      const fields = [];
      const values = [];

      // Only allow updating specific fields
      const allowedFields = ['type', 'message'];
      Object.keys(updates).forEach(key => {
        if (allowedFields.includes(key) && updates[key] !== undefined) {
          fields.push(`${key} = ?`);
          values.push(updates[key]);
        }
      });

      if (fields.length === 0) return feedback;

      values.push(id);
      const query = `UPDATE feedback SET ${fields.join(', ')} WHERE id = ?`;
      
      await db.query(query, values);
      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete feedback by user (with ownership check)
   */
  static async deleteByUser(id, userId) {
    try {
      // First check ownership
      const feedback = await this.findById(id);
      if (!feedback || feedback.user_id !== userId) {
        return false;
      }

      await db.query(
        'DELETE FROM feedback WHERE id = ?',
        [id]
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update feedback status and add response
   */
  static async respond(id, responseData) {
    try {
      const { admin_response, responded_by, status } = responseData;
      
      await db.query(
        'UPDATE feedback SET admin_response = ?, responded_by = ?, status = ?, responded_at = CURRENT_TIMESTAMP WHERE id = ?',
        [admin_response, responded_by, status, id]
      );

      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find feedback by ID
   */
  static async findById(id) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM feedback WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get feedback statistics
   */
  static async getStats() {
    try {
      const [rows] = await db.query(`
        SELECT 
          type,
          status,
          COUNT(*) as count
        FROM feedback
        GROUP BY type, status
      `);

      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Feedback;

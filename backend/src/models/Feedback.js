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
      const { type, name, email, message } = feedbackData;
      
      const [result] = await db.query(
        'INSERT INTO feedback (type, name, email, message) VALUES (?, ?, ?, ?)',
        [type, name, email, message]
      );

      return { id: result.insertId, ...feedbackData, status: 'pending' };
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

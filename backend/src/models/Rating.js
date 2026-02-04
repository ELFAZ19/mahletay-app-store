/**
 * Rating Model
 * Database operations for ratings table
 */

const db = require('../config/database');

class Rating {
  /**
   * Create or update rating
   */
  static async upsert(ratingData) {
    try {
      const { version_id, rating, ip_address } = ratingData;

      // Try to insert, on duplicate key update
      const query = `
        INSERT INTO ratings (version_id, rating, ip_address) 
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE rating = ?
      `;

      const [result] = await db.query(query, [version_id, rating, ip_address, rating]);
      
      return {
        id: result.insertId || null,
        version_id,
        rating,
        success: true
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get rating statistics for a version
   */
  static async getStats(versionId) {
    try {
      const [rows] = await db.query(
        `SELECT 
          AVG(rating) as average,
          COUNT(*) as total,
          SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
          SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
          SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
          SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
          SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
        FROM ratings 
        WHERE version_id = ?`,
        [versionId]
      );

      const stats = rows[0];
      return {
        average: parseFloat(stats.average) || 0,
        total: stats.total,
        distribution: {
          5: stats.five_star,
          4: stats.four_star,
          3: stats.three_star,
          2: stats.two_star,
          1: stats.one_star
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if IP has already rated a version
   */
  static async hasRated(versionId, ipAddress) {
    try {
      const [rows] = await db.query(
        'SELECT id FROM ratings WHERE version_id = ? AND ip_address = ?',
        [versionId, ipAddress]
      );
      return rows.length > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Rating;

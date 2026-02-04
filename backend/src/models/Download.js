/**
 * Download Model
 * Database operations for downloads table
 */

const db = require('../config/database');

class Download {
  /**
   * Log a download
   */
  static async logDownload(downloadData) {
    try {
      const { version_id, ip_address, user_agent } = downloadData;
      
      const [result] = await db.query(
        'INSERT INTO downloads (version_id, ip_address, user_agent) VALUES (?, ?, ?)',
        [version_id, ip_address, user_agent]
      );

      return { id: result.insertId };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get download statistics
   */
  static async getStats(timeRange = '30days') {
    try {
      let dateCond = '';
      
      switch(timeRange) {
        case '7days':
          dateCond = 'AND downloaded_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
          break;
        case '30days':
          dateCond = 'AND downloaded_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
          break;
        case '90days':
          dateCond = 'AND downloaded_at >= DATE_SUB(NOW(), INTERVAL 90 DAY)';
          break;
        default:
          dateCond = '';
      }

      const [rows] = await db.query(`
        SELECT 
          v.version_number,
          v.version_name,
          COUNT(d.id) as download_count
        FROM app_versions v
        LEFT JOIN downloads d ON v.id = d.version_id ${dateCond}
        GROUP BY v.id, v.version_number, v.version_name
        ORDER BY download_count DESC
      `);

      return rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get total downloads
   */
  static async getTotalDownloads() {
    try {
      const [rows] = await db.query('SELECT COUNT(*) as total FROM downloads');
      return rows[0].total;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Download;

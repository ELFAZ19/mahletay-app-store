/**
 * User Model
 * Database operations for users table
 */

const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  /**
   * Find user by email
   */
  static async findByEmail(email) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find user by ID
   */
  static async findById(id) {
    try {
      const [rows] = await db.query(
        'SELECT id, username, email, role, created_at, last_login FROM users WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create new user
   */
  static async create(userData) {
    try {
      const { username, email, password, role = 'moderator' } = userData;
      const passwordHash = await bcrypt.hash(password, 12);

      const [result] = await db.query(
        'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [username, email, passwordHash, role]
      );

      return { id: result.insertId, username, email, role };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verify password
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Update last login
   */
  static async updateLastLogin(userId) {
    try {
      await db.query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
        [userId]
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all users (admin only)
   */
  static async getAll() {
    try {
      const [rows] = await db.query(
        'SELECT id, username, email, role, created_at, last_login FROM users ORDER BY created_at DESC'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;

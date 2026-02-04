-- Quick fix: Add 'user' role to existing users table
USE mahletay_app_store;

-- Modify the role column to include 'user'
ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'moderator', 'user') DEFAULT 'user';

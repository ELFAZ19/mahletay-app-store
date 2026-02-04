-- Migration: Add user_id to reviews and feedback tables
-- Date: 2026-02-04
-- Description: Add user association to reviews and feedback for authenticated submissions

USE mahletay_app_store;

-- Add user_id column to reviews table
ALTER TABLE reviews 
ADD COLUMN user_id INT NULL AFTER version_id,
ADD INDEX idx_user_id (user_id),
ADD CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

-- Add user_id column to feedback table  
ALTER TABLE feedback
ADD COLUMN user_id INT NULL AFTER id,
ADD INDEX idx_user_id (user_id),
ADD CONSTRAINT fk_feedback_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

-- Note: user_id is nullable to support existing anonymous entries
-- New submissions will require user_id (enforced at application level)

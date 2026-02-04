-- Migration: Add missing updated_at column to reviews table
-- Run this if you get "Unknown column 'updated_at'" error

USE mahletay_app_store;

-- Add updated_at column if it doesn't exist
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
AFTER created_at;

-- Verify the column was added
DESCRIBE reviews;

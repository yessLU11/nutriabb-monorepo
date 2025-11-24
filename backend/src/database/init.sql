-- Nutriabb MVP Database Initialization Script
-- This script initializes the complete database schema with tables and indexes

-- Enable UUID extension if needed for future use
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Execute schema creation
\i schema.sql

-- Execute index creation
\i indexes.sql

-- Insert some basic data for testing (optional)
-- This can be uncommented for development/testing purposes
/*
INSERT INTO users (email, password_hash) VALUES 
('test@example.com', '$2b$10$example.hash.for.testing.purposes.only');

INSERT INTO profiles (user_id, age, gender, height, weight, activity_level) VALUES 
(1, 25, 'male', 180.00, 75.00, 'moderate');
*/
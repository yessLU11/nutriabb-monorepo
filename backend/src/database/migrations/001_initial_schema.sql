-- Migration 001: Initial Schema
-- Created: 2025-02-10
-- Description: Creates the initial database schema for Nutriabb MVP

-- Create migrations tracking table if it doesn't exist
CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    migration_name VARCHAR(255) UNIQUE NOT NULL,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table - Core user authentication data
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Profiles table - User personal information for nutrition calculations
CREATE TABLE IF NOT EXISTS profiles (
    profile_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    age INTEGER NOT NULL CHECK (age > 0 AND age <= 120),
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
    height DECIMAL(5,2) NOT NULL CHECK (height > 0 AND height <= 300), -- cm
    weight DECIMAL(5,2) NOT NULL CHECK (weight > 0 AND weight <= 500), -- kg
    activity_level VARCHAR(20) NOT NULL CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id) -- Each user can have only one profile
);

-- Glucose logs table - For future glucose tracking functionality
CREATE TABLE IF NOT EXISTS glucose_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    glucose_level DECIMAL(5,2) CHECK (glucose_level > 0 AND glucose_level <= 1000), -- mg/dL
    measured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Ingredients table - For future recipe and nutrition tracking
CREATE TABLE IF NOT EXISTS ingredients (
    ingredient_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    calories_per_100g DECIMAL(6,2) CHECK (calories_per_100g >= 0),
    protein_per_100g DECIMAL(5,2) DEFAULT 0 CHECK (protein_per_100g >= 0),
    carbs_per_100g DECIMAL(5,2) DEFAULT 0 CHECK (carbs_per_100g >= 0),
    fat_per_100g DECIMAL(5,2) DEFAULT 0 CHECK (fat_per_100g >= 0),
    fiber_per_100g DECIMAL(5,2) DEFAULT 0 CHECK (fiber_per_100g >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recipes table - For future recipe management functionality
CREATE TABLE IF NOT EXISTS recipes (
    recipe_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    servings INTEGER DEFAULT 1 CHECK (servings > 0),
    prep_time_minutes INTEGER CHECK (prep_time_minutes >= 0),
    cook_time_minutes INTEGER CHECK (cook_time_minutes >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_registration_date ON users(registration_date);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_glucose_logs_user_id ON glucose_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_glucose_logs_measured_at ON glucose_logs(measured_at);
CREATE INDEX IF NOT EXISTS idx_glucose_logs_user_date ON glucose_logs(user_id, measured_at);
CREATE INDEX IF NOT EXISTS idx_ingredients_name ON ingredients(name);
CREATE INDEX IF NOT EXISTS idx_ingredients_created_at ON ingredients(created_at);
CREATE INDEX IF NOT EXISTS idx_recipes_name ON recipes(name);
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at);

-- Record this migration as executed
INSERT INTO migrations (migration_name) VALUES ('001_initial_schema')
ON CONFLICT (migration_name) DO NOTHING;
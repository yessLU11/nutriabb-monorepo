-- Nutriabb MVP Database Schema
-- This file contains the complete database schema for the Nutriabb application

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS glucose_logs CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS ingredients CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table - Core user authentication data
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Profiles table - User personal information for nutrition calculations
CREATE TABLE profiles (
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
CREATE TABLE glucose_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    glucose_level DECIMAL(5,2) CHECK (glucose_level > 0 AND glucose_level <= 1000), -- mg/dL
    measured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Ingredients table - For future recipe and nutrition tracking
CREATE TABLE ingredients (
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
CREATE TABLE recipes (
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
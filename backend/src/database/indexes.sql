-- Nutriabb MVP Database Indexes
-- This file contains indexes for improved query performance

-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_registration_date ON users(registration_date);

-- Profiles table indexes
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_created_at ON profiles(created_at);

-- Glucose logs table indexes
CREATE INDEX idx_glucose_logs_user_id ON glucose_logs(user_id);
CREATE INDEX idx_glucose_logs_measured_at ON glucose_logs(measured_at);
CREATE INDEX idx_glucose_logs_user_date ON glucose_logs(user_id, measured_at);

-- Ingredients table indexes
CREATE INDEX idx_ingredients_name ON ingredients(name);
CREATE INDEX idx_ingredients_created_at ON ingredients(created_at);

-- Recipes table indexes
CREATE INDEX idx_recipes_name ON recipes(name);
CREATE INDEX idx_recipes_created_at ON recipes(created_at);
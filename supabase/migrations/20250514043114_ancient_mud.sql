/*
  # Drop users table and related objects

  1. Changes
    - Drop all policies on users table
    - Drop trigger on auth.users
    - Drop trigger function
    - Drop users table
*/

-- First, drop all policies
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Drop trigger from auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop trigger function
DROP FUNCTION IF EXISTS handle_new_user();

-- Drop the users table (this will also drop any constraints)
DROP TABLE IF EXISTS users CASCADE;
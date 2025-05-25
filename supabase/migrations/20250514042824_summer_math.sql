/*
  # Update users table schema and policies

  1. Changes
    - Drop existing policies
    - Update users table schema
    - Create new policies with proper column references
    - Update trigger function
*/

-- First, drop existing policies
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Drop existing constraints if they exist
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'users_email_unique'
  ) THEN
    ALTER TABLE users DROP CONSTRAINT users_email_unique;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'users_name_unique'
  ) THEN
    ALTER TABLE users DROP CONSTRAINT users_name_unique;
  END IF;
END $$;

-- Update users table
ALTER TABLE users
  ALTER COLUMN id SET DATA TYPE uuid,
  ALTER COLUMN id SET NOT NULL,
  ALTER COLUMN email SET NOT NULL,
  ALTER COLUMN name SET NOT NULL,
  ALTER COLUMN first_login SET DEFAULT true,
  ALTER COLUMN created_at SET DEFAULT now(),
  ALTER COLUMN updated_at SET DEFAULT now();

-- Add check constraint for email format
ALTER TABLE users
  ADD CONSTRAINT users_email_format_check 
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Add unique constraint on email
ALTER TABLE users
  ADD CONSTRAINT users_email_unique 
  UNIQUE (email);

-- Create new policies with proper column references
CREATE POLICY "Users can read own data" ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Update trigger function for handling new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO users (id, email, name, first_login)
  VALUES (
    new.id,
    new.email,
    split_part(new.email, '@', 1),
    true
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
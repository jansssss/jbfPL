/*
  # Add UNIQUE constraints to users table

  1. Changes
    - Add UNIQUE constraint on email column in users table
    - Add UNIQUE constraint on name column in users table

  2. Notes
    - Using DO block to check if constraints already exist before adding
    - This ensures idempotency of the migration
*/

DO $$ 
BEGIN
  -- Add UNIQUE constraint for email if not exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'users_email_unique'
  ) THEN
    ALTER TABLE users
    ADD CONSTRAINT users_email_unique 
    UNIQUE (email);
  END IF;

  -- Add UNIQUE constraint for name if not exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'users_name_unique'
  ) THEN
    ALTER TABLE users
    ADD CONSTRAINT users_name_unique 
    UNIQUE (name);
  END IF;
END $$;
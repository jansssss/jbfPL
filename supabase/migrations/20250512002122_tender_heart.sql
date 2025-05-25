/*
  # Add unique constraints for conflict handling

  1. Changes
    - Add unique constraint on projects table for name and applicant_id combination
    - Add unique constraint on users table for email
*/

-- Add unique constraint to projects table
ALTER TABLE projects
ADD CONSTRAINT projects_name_applicant_unique 
UNIQUE (name, applicant_id);

-- Add unique constraint to users table (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'users_email_unique'
  ) THEN
    ALTER TABLE users
    ADD CONSTRAINT users_email_unique 
    UNIQUE (email);
  END IF;
END $$;
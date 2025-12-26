-- Add INSERT policy for profiles table
-- This allows users to create their own profile when signing up

-- Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (email = auth.email());

-- Fix UPDATE policy to also allow updates by email
-- The current policy only checks id = auth.uid(), but profiles use random UUIDs
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid()::text = id::text OR email = auth.email());


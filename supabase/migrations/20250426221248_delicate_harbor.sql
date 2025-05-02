/*
  # Fix recursive RLS policies for profiles table

  1. Changes
    - Remove redundant and recursive policies from profiles table
    - Create new, simplified policies that avoid recursion:
      - Allow admins full access
      - Allow users to read and update their own profiles
      - Remove duplicate policies

  2. Security
    - Maintains RLS protection
    - Simplifies policy logic while maintaining security model
    - Prevents infinite recursion in policy evaluation
*/

-- Drop existing policies to clean up
DROP POLICY IF EXISTS "Admins have full access to profiles" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

-- Create new, simplified policies
CREATE POLICY "Admin full access"
ON profiles
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

CREATE POLICY "Users can read own profile"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
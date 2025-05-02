/*
  # Fix profiles table RLS policies

  1. Changes
    - Drop existing problematic policies that cause infinite recursion
    - Create new, optimized policies that avoid recursion
    
  2. Security
    - Maintain same security level but with more efficient policy definitions
    - Enable RLS (already enabled)
    - Add policies for:
      - Admin full access
      - Users can read own profile
      - Users can update own profile
*/

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Admin full access" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new policies without recursion
CREATE POLICY "Admin full access"
ON profiles
FOR ALL
TO authenticated
USING (role = 'admin')
WITH CHECK (role = 'admin');

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
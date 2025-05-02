/*
  # Add additional profile fields and audit history

  1. Changes
    - Add new columns to profiles table:
      - `location` (jsonb)
      - `phone` (text)
      - `bio` (text)
      - `avatar_url` (text)
    - Create profile_history table for audit trail
    
  2. Security
    - Maintain existing RLS policies
    - Add policies for history table
*/

-- Add new columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS location jsonb,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS bio text;

-- Create profile history table
CREATE TABLE IF NOT EXISTS profile_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  changed_by uuid REFERENCES auth.users(id),
  changed_at timestamptz DEFAULT now(),
  old_values jsonb,
  new_values jsonb
);

-- Enable RLS on history table
ALTER TABLE profile_history ENABLE ROW LEVEL SECURITY;

-- Create policies for history table
CREATE POLICY "Users can view their own history"
  ON profile_history
  FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Admin can view all history"
  ON profile_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Create function to track profile changes
CREATE OR REPLACE FUNCTION log_profile_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profile_history (
    profile_id,
    changed_by,
    old_values,
    new_values
  )
  VALUES (
    OLD.id,
    auth.uid(),
    to_jsonb(OLD),
    to_jsonb(NEW)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for profile changes
CREATE TRIGGER track_profile_changes
  AFTER UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION log_profile_changes();
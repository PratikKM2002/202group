/*
  # Add restaurant management functionality

  1. New Tables
    - `restaurant_managers`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `restaurant_id` (uuid, references restaurants)
      - `role` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for restaurant managers
*/

-- Create restaurant_managers table
CREATE TABLE IF NOT EXISTS restaurant_managers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL DEFAULT 'manager',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, restaurant_id)
);

-- Enable RLS
ALTER TABLE restaurant_managers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own restaurant management roles"
  ON restaurant_managers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Restaurant managers can manage their restaurants"
  ON restaurants
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM restaurant_managers
      WHERE user_id = auth.uid()
      AND restaurant_id = restaurants.id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM restaurant_managers
      WHERE user_id = auth.uid()
      AND restaurant_id = restaurants.id
    )
  );

-- Add function to handle restaurant manager assignments
CREATE OR REPLACE FUNCTION handle_restaurant_manager_assignment()
RETURNS trigger AS $$
BEGIN
  -- Update the updated_at timestamp
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updating timestamps
CREATE TRIGGER update_restaurant_managers_updated_at
  BEFORE UPDATE ON restaurant_managers
  FOR EACH ROW
  EXECUTE FUNCTION handle_restaurant_manager_assignment();

-- Add indexes for performance
CREATE INDEX idx_restaurant_managers_user_id ON restaurant_managers(user_id);
CREATE INDEX idx_restaurant_managers_restaurant_id ON restaurant_managers(restaurant_id);
/*
  # Create restaurants table and related schemas

  1. New Tables
    - `restaurants`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `cuisine` (text)
      - `price_range` (int)
      - `address` (jsonb)
      - `contact_info` (jsonb)
      - `hours` (jsonb)
      - `images` (text[])
      - `manager_id` (uuid, references profiles)
      - `is_approved` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for different user roles
*/

-- Create restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  cuisine text NOT NULL,
  price_range int NOT NULL CHECK (price_range BETWEEN 1 AND 4),
  address jsonb NOT NULL,
  contact_info jsonb NOT NULL,
  hours jsonb NOT NULL,
  images text[] NOT NULL DEFAULT '{}',
  manager_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  is_approved boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view approved restaurants"
  ON restaurants
  FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Restaurant managers can view their own restaurants"
  ON restaurants
  FOR SELECT
  TO authenticated
  USING (auth.uid() = manager_id);

CREATE POLICY "Restaurant managers can update their own restaurants"
  ON restaurants
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = manager_id)
  WITH CHECK (auth.uid() = manager_id);

CREATE POLICY "Restaurant managers can delete their own restaurants"
  ON restaurants
  FOR DELETE
  TO authenticated
  USING (auth.uid() = manager_id);

CREATE POLICY "Admins have full access"
  ON restaurants
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating timestamps
CREATE TRIGGER update_restaurants_updated_at
  BEFORE UPDATE ON restaurants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
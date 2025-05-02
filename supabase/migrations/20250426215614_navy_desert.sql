/*
  # Fix User Creation Trigger

  1. Changes
    - Update handle_new_user function to handle null metadata
    - Add fallback for user name from email
    - Ensure role is properly set with fallback
  
  2. Security
    - Maintain existing RLS policies
    - Keep security definer setting
*/

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    new.id,
    COALESCE(
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    COALESCE(
      new.raw_user_meta_data->>'role',
      'customer'
    )
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY definer;
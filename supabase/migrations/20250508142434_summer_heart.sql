/*
  # Initial Schema Setup for Apartment Rental App

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `avatar_url` (text)
      - `created_at` (timestamp)
    
    - `apartments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `size` (numeric)
      - `rooms` (numeric)
      - `pets_allowed` (boolean)
      - `smoking_allowed` (boolean)
      - `has_parking` (boolean)
      - `has_balcony` (boolean)
      - `cost` (numeric)
      - `arnona` (numeric)
      - `city` (text)
      - `street` (text)
      - `neighborhood` (text)
      - `floor` (integer)
      - `has_elevator` (boolean)
      - `bomb_shelter` (text)
      - `rental_type` (text)
      - `phone_number` (text)
      - `entry_date` (date)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `apartment_images`
      - `id` (uuid, primary key)
      - `apartment_id` (uuid, references apartments)
      - `url` (text)
      - `created_at` (timestamp)

    - `apartment_furniture`
      - `id` (uuid, primary key)
      - `apartment_id` (uuid, references apartments)
      - `item` (text)
      - `quantity` (integer)
      - `created_at` (timestamp)

    - `apartment_likes`
      - `id` (uuid, primary key)
      - `apartment_id` (uuid, references apartments)
      - `user_id` (uuid, references users)
      - `created_at` (timestamp)

    - `open_houses`
      - `id` (uuid, primary key)
      - `apartment_id` (uuid, references apartments)
      - `date` (date)
      - `time` (time)
      - `created_at` (timestamp)

    - `open_house_registrations`
      - `id` (uuid, primary key)
      - `open_house_id` (uuid, references open_houses)
      - `user_id` (uuid, references users)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Create apartments table
CREATE TABLE apartments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  size numeric NOT NULL,
  rooms numeric NOT NULL,
  pets_allowed boolean DEFAULT false,
  smoking_allowed boolean DEFAULT false,
  has_parking boolean DEFAULT false,
  has_balcony boolean DEFAULT false,
  cost numeric NOT NULL,
  arnona numeric DEFAULT 0,
  city text NOT NULL,
  street text NOT NULL,
  neighborhood text NOT NULL,
  floor integer DEFAULT 0,
  has_elevator boolean DEFAULT false,
  bomb_shelter text CHECK (bomb_shelter IN ('apartment', 'building', '100meters', 'none')) DEFAULT 'none',
  rental_type text CHECK (rental_type IN ('room', 'apartment', 'sublet')) NOT NULL,
  phone_number text NOT NULL,
  entry_date date NOT NULL,
  status text CHECK (status IN ('active', 'closed')) DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create apartment_images table
CREATE TABLE apartment_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  apartment_id uuid REFERENCES apartments(id) ON DELETE CASCADE NOT NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create apartment_furniture table
CREATE TABLE apartment_furniture (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  apartment_id uuid REFERENCES apartments(id) ON DELETE CASCADE NOT NULL,
  item text NOT NULL,
  quantity integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Create apartment_likes table
CREATE TABLE apartment_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  apartment_id uuid REFERENCES apartments(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(apartment_id, user_id)
);

-- Create open_houses table
CREATE TABLE open_houses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  apartment_id uuid REFERENCES apartments(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create open_house_registrations table
CREATE TABLE open_house_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  open_house_id uuid REFERENCES open_houses(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(open_house_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE apartments ENABLE ROW LEVEL SECURITY;
ALTER TABLE apartment_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE apartment_furniture ENABLE ROW LEVEL SECURITY;
ALTER TABLE apartment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE open_houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE open_house_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Anyone can read apartments" ON apartments
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create apartments" ON apartments
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own apartments" ON apartments
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own apartments" ON apartments
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read apartment images" ON apartment_images
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can manage apartment images" ON apartment_images
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM apartments WHERE id = apartment_id AND user_id = auth.uid()
  ));

CREATE POLICY "Anyone can read apartment furniture" ON apartment_furniture
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can manage apartment furniture" ON apartment_furniture
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM apartments WHERE id = apartment_id AND user_id = auth.uid()
  ));

CREATE POLICY "Anyone can read apartment likes" ON apartment_likes
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can manage own likes" ON apartment_likes
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can read open houses" ON open_houses
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can manage open houses" ON open_houses
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM apartments WHERE id = apartment_id AND user_id = auth.uid()
  ));

CREATE POLICY "Anyone can read open house registrations" ON open_house_registrations
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can manage own registrations" ON open_house_registrations
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX apartments_user_id_idx ON apartments(user_id);
CREATE INDEX apartment_images_apartment_id_idx ON apartment_images(apartment_id);
CREATE INDEX apartment_furniture_apartment_id_idx ON apartment_furniture(apartment_id);
CREATE INDEX apartment_likes_apartment_id_idx ON apartment_likes(apartment_id);
CREATE INDEX apartment_likes_user_id_idx ON apartment_likes(user_id);
CREATE INDEX open_houses_apartment_id_idx ON open_houses(apartment_id);
CREATE INDEX open_house_registrations_open_house_id_idx ON open_house_registrations(open_house_id);
CREATE INDEX open_house_registrations_user_id_idx ON open_house_registrations(user_id);
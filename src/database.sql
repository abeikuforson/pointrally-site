-- Supabase Database Schema for PointRally

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  total_points INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create teams table
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  sport TEXT NOT NULL CHECK (sport IN ('NBA', 'NFL', 'MLB', 'NHL', 'MLS')),
  logo_url TEXT,
  city TEXT NOT NULL,
  primary_color TEXT NOT NULL,
  secondary_color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create user_teams table (connections between users and teams)
CREATE TABLE user_teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  points_balance INTEGER DEFAULT 0,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  last_synced_at TIMESTAMP WITH TIME ZONE,
  api_credentials JSONB,
  UNIQUE(user_id, team_id)
);

-- Create transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id),
  type TEXT NOT NULL CHECK (type IN ('earned', 'redeemed', 'transferred', 'expired')),
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create rewards table
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('tickets', 'merchandise', 'experiences', 'food', 'digital')),
  points_cost INTEGER NOT NULL,
  image_url TEXT,
  team_id UUID REFERENCES teams(id),
  availability TEXT DEFAULT 'available' CHECK (availability IN ('available', 'limited', 'soldout')),
  stock INTEGER,
  expires_at TIMESTAMP WITH TIME ZONE,
  terms TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create redemptions table
CREATE TABLE redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES rewards(id),
  points_used INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  redemption_code TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for performance
CREATE INDEX idx_user_teams_user_id ON user_teams(user_id);
CREATE INDEX idx_user_teams_team_id ON user_teams(team_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_team_id ON transactions(team_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_rewards_team_id ON rewards(team_id);
CREATE INDEX idx_rewards_points_cost ON rewards(points_cost);
CREATE INDEX idx_redemptions_user_id ON redemptions(user_id);
CREATE INDEX idx_redemptions_reward_id ON redemptions(reward_id);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Profiles are created on user signup" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- User teams policies
CREATE POLICY "Users can view their own team connections" ON user_teams
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can connect new teams" ON user_teams
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can disconnect their teams" ON user_teams
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can update their team connections" ON user_teams
  FOR UPDATE USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Redemptions policies
CREATE POLICY "Users can view their own redemptions" ON redemptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create redemptions" ON redemptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Teams table is public read
CREATE POLICY "Teams are viewable by everyone" ON teams
  FOR SELECT USING (true);

-- Rewards table is public read
CREATE POLICY "Rewards are viewable by everyone" ON rewards
  FOR SELECT USING (true);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'display_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert sample teams data
INSERT INTO teams (name, code, sport, city, primary_color, secondary_color, logo_url) VALUES
  ('Los Angeles Lakers', 'LAL', 'NBA', 'Los Angeles', '#552583', '#FDB927', 'https://example.com/lakers.png'),
  ('Los Angeles Dodgers', 'LAD', 'MLB', 'Los Angeles', '#005A9C', '#FFFFFF', 'https://example.com/dodgers.png'),
  ('Los Angeles Rams', 'LAR', 'NFL', 'Los Angeles', '#003594', '#FFD100', 'https://example.com/rams.png'),
  ('Los Angeles Clippers', 'LAC', 'NBA', 'Los Angeles', '#C8102E', '#1D428A', 'https://example.com/clippers.png'),
  ('Los Angeles FC', 'LAFC', 'MLS', 'Los Angeles', '#000000', '#C39E6D', 'https://example.com/lafc.png'),
  ('Golden State Warriors', 'GSW', 'NBA', 'San Francisco', '#1D428A', '#FFC72C', 'https://example.com/warriors.png'),
  ('San Francisco Giants', 'SF', 'MLB', 'San Francisco', '#FD5A1E', '#000000', 'https://example.com/giants.png'),
  ('San Francisco 49ers', 'SF49', 'NFL', 'San Francisco', '#AA0000', '#B3995D', 'https://example.com/49ers.png');
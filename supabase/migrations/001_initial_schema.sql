-- Initial Database Schema for Sushi World App
-- Run this migration in your Supabase SQL editor

-- User profiles (linked to Foxy customers by email)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  foxy_customer_id TEXT,
  loyalty_points INTEGER DEFAULT 0,
  points_pending_claim INTEGER DEFAULT 0,
  has_claimed_account BOOLEAN DEFAULT FALSE,
  welcome_bonus_claimed BOOLEAN DEFAULT FALSE,
  preferences JSONB DEFAULT '{}',
  push_enabled BOOLEAN DEFAULT TRUE,
  preferred_region TEXT CHECK (preferred_region IN ('BE', 'LU')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Loyalty transaction history
CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  points INTEGER NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('purchase', 'redemption', 'welcome_bonus')),
  foxy_transaction_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'credited', 'redeemed')),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Push notification tokens
CREATE TABLE IF NOT EXISTS push_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  platform TEXT CHECK (platform IN ('ios', 'android')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Generated coupons (track what we created in Foxy)
CREATE TABLE IF NOT EXISTS generated_coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  foxy_coupon_code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('welcome', 'loyalty_redemption')),
  value DECIMAL NOT NULL,
  points_cost INTEGER,
  used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_email ON loyalty_transactions(email);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_profile_id ON loyalty_transactions(profile_id);
CREATE INDEX IF NOT EXISTS idx_push_tokens_profile_id ON push_tokens(profile_id);
CREATE INDEX IF NOT EXISTS idx_generated_coupons_email ON generated_coupons(email);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_coupons ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid()::text = id::text OR email = auth.email());

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid()::text = id::text);

-- Users can view their own loyalty transactions
DROP POLICY IF EXISTS "Users can view own transactions" ON loyalty_transactions;
CREATE POLICY "Users can view own transactions"
  ON loyalty_transactions FOR SELECT
  USING (email = auth.email() OR profile_id IN (SELECT id FROM profiles WHERE id::text = auth.uid()::text));

-- Users can view their own push tokens
DROP POLICY IF EXISTS "Users can view own push tokens" ON push_tokens;
CREATE POLICY "Users can view own push tokens"
  ON push_tokens FOR SELECT
  USING (profile_id IN (SELECT id FROM profiles WHERE id::text = auth.uid()::text));

-- Users can manage their own push tokens
DROP POLICY IF EXISTS "Users can manage own push tokens" ON push_tokens;
CREATE POLICY "Users can manage own push tokens"
  ON push_tokens FOR ALL
  USING (profile_id IN (SELECT id FROM profiles WHERE id::text = auth.uid()::text));

-- Users can view their own coupons
DROP POLICY IF EXISTS "Users can view own coupons" ON generated_coupons;
CREATE POLICY "Users can view own coupons"
  ON generated_coupons FOR SELECT
  USING (email = auth.email() OR profile_id IN (SELECT id FROM profiles WHERE id::text = auth.uid()::text));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


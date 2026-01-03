-- Database Restoration Script
-- This script restores common database objects that might have been accidentally deleted
-- Run the diagnostic script first (008_diagnostic_check.sql) to identify what's broken
-- Then run this script to restore missing objects

-- ============================================================================
-- RESTORE FUNCTIONS
-- ============================================================================

-- Restore update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Restore handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (email) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Restore sync_webflow_data function (if pg_cron is available)
CREATE OR REPLACE FUNCTION sync_webflow_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  supabase_url TEXT;
  anon_key TEXT;
  response_status INT;
  response_body TEXT;
BEGIN
  -- Get Supabase URL and anon key from environment
  SELECT status, content INTO response_status, response_body
  FROM http((
    'POST',
    current_setting('app.settings.supabase_url', true) || '/functions/v1/webflow-sync',
    ARRAY[
      http_header('Authorization', 'Bearer ' || current_setting('app.settings.supabase_anon_key', true)),
      http_header('Content-Type', 'application/json')
    ],
    'application/json',
    '{}'
  )::http_request);
  
  RAISE NOTICE 'Sync completed with status: %, response: %', response_status, response_body;
END;
$$;

-- ============================================================================
-- RESTORE TRIGGERS
-- ============================================================================

-- Restore profiles updated_at trigger
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Restore menu_categories updated_at trigger
DROP TRIGGER IF EXISTS update_menu_categories_updated_at ON menu_categories;
CREATE TRIGGER update_menu_categories_updated_at 
  BEFORE UPDATE ON menu_categories
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Restore menu_items updated_at trigger
DROP TRIGGER IF EXISTS update_menu_items_updated_at ON menu_items;
CREATE TRIGGER update_menu_items_updated_at 
  BEFORE UPDATE ON menu_items
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Restore auto-create profile trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- RESTORE RLS POLICIES
-- ============================================================================

-- Profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid()::text = id::text OR email = auth.email());

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid()::text = id::text OR email = auth.email());

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (email = auth.email());

-- Loyalty transactions policies
DROP POLICY IF EXISTS "Users can view own transactions" ON loyalty_transactions;
CREATE POLICY "Users can view own transactions"
  ON loyalty_transactions FOR SELECT
  USING (email = auth.email() OR profile_id IN (SELECT id FROM profiles WHERE id::text = auth.uid()::text));

-- Push tokens policies
DROP POLICY IF EXISTS "Users can view own push tokens" ON push_tokens;
CREATE POLICY "Users can view own push tokens"
  ON push_tokens FOR SELECT
  USING (profile_id IN (SELECT id FROM profiles WHERE id::text = auth.uid()::text));

DROP POLICY IF EXISTS "Users can manage own push tokens" ON push_tokens;
CREATE POLICY "Users can manage own push tokens"
  ON push_tokens FOR ALL
  USING (profile_id IN (SELECT id FROM profiles WHERE id::text = auth.uid()::text));

-- Generated coupons policies
DROP POLICY IF EXISTS "Users can view own coupons" ON generated_coupons;
CREATE POLICY "Users can view own coupons"
  ON generated_coupons FOR SELECT
  USING (email = auth.email() OR profile_id IN (SELECT id FROM profiles WHERE id::text = auth.uid()::text));

-- Menu categories policies
DROP POLICY IF EXISTS "Public can view categories" ON menu_categories;
CREATE POLICY "Public can view categories"
  ON menu_categories FOR SELECT
  USING (true);

-- Menu items policies
DROP POLICY IF EXISTS "Public can view menu items" ON menu_items;
CREATE POLICY "Public can view menu items"
  ON menu_items FOR SELECT
  USING (true);

-- ============================================================================
-- RESTORE INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_email ON loyalty_transactions(email);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_profile_id ON loyalty_transactions(profile_id);
CREATE INDEX IF NOT EXISTS idx_push_tokens_profile_id ON push_tokens(profile_id);
CREATE INDEX IF NOT EXISTS idx_generated_coupons_email ON generated_coupons(email);
CREATE INDEX IF NOT EXISTS idx_menu_items_webflow_id ON menu_items(webflow_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_region ON menu_items(region);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_menu_categories_webflow_id ON menu_categories(webflow_id);
CREATE INDEX IF NOT EXISTS idx_menu_categories_code ON menu_categories(code);

-- ============================================================================
-- ENABLE RLS (if tables exist)
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'loyalty_transactions') THEN
    ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'push_tokens') THEN
    ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'generated_coupons') THEN
    ALTER TABLE generated_coupons ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'menu_categories') THEN
    ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'menu_items') THEN
    ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;



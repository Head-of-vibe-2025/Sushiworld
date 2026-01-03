-- Cleanup Script: Remove Referral System Migration
-- This removes all objects created by the accidental referral system migration
-- The migration was meant for a different app that uses a 'users' table
-- This app uses 'profiles' table instead

-- ============================================================================
-- DROP FUNCTIONS (in reverse order of dependencies)
-- ============================================================================

-- Drop validate_and_reward_referral function
DROP FUNCTION IF EXISTS validate_and_reward_referral(UUID, TEXT);
DROP FUNCTION IF EXISTS validate_and_reward_referral(UUID);

-- Drop get_or_create_referral_code function
DROP FUNCTION IF EXISTS get_or_create_referral_code(UUID);

-- Drop generate_referral_code function
DROP FUNCTION IF EXISTS generate_referral_code();

-- ============================================================================
-- DROP RLS POLICIES (only if tables exist)
-- ============================================================================

-- Drop referral policies (only if table exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'referrals'
  ) THEN
    DROP POLICY IF EXISTS "System can update referrals" ON referrals;
    DROP POLICY IF EXISTS "Users can insert referrals" ON referrals;
    DROP POLICY IF EXISTS "Users can read own referrals" ON referrals;
  END IF;
END $$;

-- Drop referral_codes policies (only if table exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'referral_codes'
  ) THEN
    DROP POLICY IF EXISTS "Users can insert own referral code" ON referral_codes;
    DROP POLICY IF EXISTS "Users can read own referral code" ON referral_codes;
  END IF;
END $$;

-- ============================================================================
-- DROP TABLES (in reverse order of dependencies)
-- ============================================================================

-- Drop referrals table (references referral_codes and users)
DROP TABLE IF EXISTS referrals CASCADE;

-- Drop referral_codes table (references users)
DROP TABLE IF EXISTS referral_codes CASCADE;

-- ============================================================================
-- REMOVE COLUMNS FROM users TABLE (if it exists)
-- Note: This app uses 'profiles' table, not 'users' table
-- If the ALTER TABLE users failed, these columns don't exist
-- ============================================================================

-- Only try to remove columns if users table exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'users'
  ) THEN
    -- Remove subscription columns if they exist
    ALTER TABLE users DROP COLUMN IF EXISTS subscription_expires_at;
    ALTER TABLE users DROP COLUMN IF EXISTS free_months_earned;
    RAISE NOTICE 'Removed subscription columns from users table (if they existed)';
  ELSE
    RAISE NOTICE 'users table does not exist - no columns to remove';
  END IF;
END $$;

-- ============================================================================
-- DROP INDEXES (if they still exist after table drops)
-- ============================================================================

DROP INDEX IF EXISTS idx_referrals_code;
DROP INDEX IF EXISTS idx_referrals_status;
DROP INDEX IF EXISTS idx_referrals_referred_user_id;
DROP INDEX IF EXISTS idx_referrals_referrer_id;
DROP INDEX IF EXISTS idx_referral_codes_code;
DROP INDEX IF EXISTS idx_referral_codes_user_id;

-- ============================================================================
-- VERIFICATION: Check what was removed
-- ============================================================================

DO $$
DECLARE
  remaining_objects TEXT[] := ARRAY[]::TEXT[];
  obj_name TEXT;
BEGIN
  -- Check for remaining referral tables
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'referral_codes') THEN
    remaining_objects := array_append(remaining_objects, 'referral_codes table');
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'referrals') THEN
    remaining_objects := array_append(remaining_objects, 'referrals table');
  END IF;
  
  -- Check for remaining functions
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'generate_referral_code') THEN
    remaining_objects := array_append(remaining_objects, 'generate_referral_code function');
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'get_or_create_referral_code') THEN
    remaining_objects := array_append(remaining_objects, 'get_or_create_referral_code function');
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'validate_and_reward_referral') THEN
    remaining_objects := array_append(remaining_objects, 'validate_and_reward_referral function');
  END IF;
  
  IF array_length(remaining_objects, 1) > 0 THEN
    RAISE WARNING 'Some objects still remain: %', array_to_string(remaining_objects, ', ');
  ELSE
    RAISE NOTICE '✓ All referral system objects have been removed';
  END IF;
END $$;

-- Final summary
SELECT '=== CLEANUP COMPLETE ===' AS status;
SELECT 'All referral system objects have been removed' AS message;
SELECT 'Your original database schema should be intact' AS note;


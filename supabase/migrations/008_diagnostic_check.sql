-- Diagnostic Check Script
-- Run this to check if all database objects are intact
-- This will help identify what might have been broken

-- Check if all tables exist
DO $$
DECLARE
  missing_tables TEXT[] := ARRAY[]::TEXT[];
  tbl_name TEXT;
  required_tables TEXT[] := ARRAY[
    'profiles',
    'loyalty_transactions',
    'push_tokens',
    'generated_coupons',
    'menu_categories',
    'menu_items'
  ];
BEGIN
  FOREACH tbl_name IN ARRAY required_tables
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.tables t
      WHERE t.table_schema = 'public' 
      AND t.table_name = tbl_name
    ) THEN
      missing_tables := array_append(missing_tables, tbl_name);
    END IF;
  END LOOP;
  
  IF array_length(missing_tables, 1) > 0 THEN
    RAISE WARNING 'Missing tables: %', array_to_string(missing_tables, ', ');
  ELSE
    RAISE NOTICE '✓ All required tables exist';
  END IF;
END $$;

-- Check if all functions exist
DO $$
DECLARE
  missing_functions TEXT[] := ARRAY[]::TEXT[];
  func_name TEXT;
  required_functions TEXT[] := ARRAY[
    'update_updated_at_column',
    'handle_new_user',
    'sync_webflow_data'
  ];
BEGIN
  FOREACH func_name IN ARRAY required_functions
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE n.nspname = 'public' 
      AND p.proname = func_name
    ) THEN
      missing_functions := array_append(missing_functions, func_name);
    END IF;
  END LOOP;
  
  IF array_length(missing_functions, 1) > 0 THEN
    RAISE WARNING 'Missing functions: %', array_to_string(missing_functions, ', ');
  ELSE
    RAISE NOTICE '✓ All required functions exist';
  END IF;
END $$;

-- Check if all triggers exist
DO $$
DECLARE
  missing_triggers TEXT[] := ARRAY[]::TEXT[];
  trigger_name TEXT;
  required_triggers TEXT[] := ARRAY[
    'update_profiles_updated_at',
    'update_menu_categories_updated_at',
    'update_menu_items_updated_at',
    'on_auth_user_created'
  ];
BEGIN
  FOREACH trigger_name IN ARRAY required_triggers
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_trigger t
      JOIN pg_class c ON t.tgrelid = c.oid
      WHERE t.tgname = trigger_name
    ) THEN
      missing_triggers := array_append(missing_triggers, trigger_name);
    END IF;
  END LOOP;
  
  IF array_length(missing_triggers, 1) > 0 THEN
    RAISE WARNING 'Missing triggers: %', array_to_string(missing_triggers, ', ');
  ELSE
    RAISE NOTICE '✓ All required triggers exist';
  END IF;
END $$;

-- Check if RLS is enabled on all tables
DO $$
DECLARE
  missing_rls TEXT[] := ARRAY[]::TEXT[];
  tbl_name TEXT;
  required_tables TEXT[] := ARRAY[
    'profiles',
    'loyalty_transactions',
    'push_tokens',
    'generated_coupons',
    'menu_categories',
    'menu_items'
  ];
BEGIN
  FOREACH tbl_name IN ARRAY required_tables
  LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.tables t
      WHERE t.table_schema = 'public' 
      AND t.table_name = tbl_name
    ) THEN
      IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON c.relnamespace = n.oid
        WHERE n.nspname = 'public'
        AND c.relname = tbl_name
        AND c.relrowsecurity = true
      ) THEN
        missing_rls := array_append(missing_rls, tbl_name);
      END IF;
    END IF;
  END LOOP;
  
  IF array_length(missing_rls, 1) > 0 THEN
    RAISE WARNING 'RLS not enabled on tables: %', array_to_string(missing_rls, ', ');
  ELSE
    RAISE NOTICE '✓ RLS is enabled on all required tables';
  END IF;
END $$;

-- Check critical RLS policies
DO $$
DECLARE
  missing_policies TEXT[] := ARRAY[]::TEXT[];
  policy_name TEXT;
  required_policies TEXT[] := ARRAY[
    'Users can view own profile',
    'Users can update own profile',
    'Users can insert own profile',
    'Users can view own transactions',
    'Public can view categories',
    'Public can view menu items'
  ];
BEGIN
  FOREACH policy_name IN ARRAY required_policies
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE policyname = policy_name
    ) THEN
      missing_policies := array_append(missing_policies, policy_name);
    END IF;
  END LOOP;
  
  IF array_length(missing_policies, 1) > 0 THEN
    RAISE WARNING 'Missing RLS policies: %', array_to_string(missing_policies, ', ');
  ELSE
    RAISE NOTICE '✓ All critical RLS policies exist';
  END IF;
END $$;

-- Check critical indexes
DO $$
DECLARE
  missing_indexes TEXT[] := ARRAY[]::TEXT[];
  index_name TEXT;
  required_indexes TEXT[] := ARRAY[
    'idx_profiles_email',
    'idx_loyalty_transactions_email',
    'idx_menu_items_webflow_id',
    'idx_menu_categories_webflow_id'
  ];
BEGIN
  FOREACH index_name IN ARRAY required_indexes
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_indexes 
      WHERE indexname = index_name
    ) THEN
      missing_indexes := array_append(missing_indexes, index_name);
    END IF;
  END LOOP;
  
  IF array_length(missing_indexes, 1) > 0 THEN
    RAISE WARNING 'Missing indexes: %', array_to_string(missing_indexes, ', ');
  ELSE
    RAISE NOTICE '✓ All critical indexes exist';
  END IF;
END $$;

-- Check table columns for profiles table (most critical)
DO $$
DECLARE
  missing_columns TEXT[] := ARRAY[]::TEXT[];
  col_name TEXT;
  required_columns TEXT[] := ARRAY[
    'id',
    'email',
    'foxy_customer_id',
    'loyalty_points',
    'points_pending_claim',
    'has_claimed_account',
    'welcome_bonus_claimed',
    'preferences',
    'push_enabled',
    'preferred_region',
    'created_at',
    'updated_at'
  ];
BEGIN
  FOREACH col_name IN ARRAY required_columns
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'profiles'
      AND column_name = col_name
    ) THEN
      missing_columns := array_append(missing_columns, col_name);
    END IF;
  END LOOP;
  
  IF array_length(missing_columns, 1) > 0 THEN
    RAISE WARNING 'Missing columns in profiles table: %', array_to_string(missing_columns, ', ');
  ELSE
    RAISE NOTICE '✓ All required columns exist in profiles table';
  END IF;
END $$;

-- Summary: List all tables, functions, and triggers in one result set
SELECT 
  'Tables' AS object_type,
  t.table_name AS object_name,
  'public' AS schema_name,
  NULL::TEXT AS table_name
FROM information_schema.tables t
WHERE t.table_schema = 'public' 
  AND t.table_type = 'BASE TABLE'

UNION ALL

SELECT 
  'Functions' AS object_type,
  p.proname AS object_name,
  n.nspname AS schema_name,
  NULL::TEXT AS table_name
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'

UNION ALL

SELECT 
  'Triggers' AS object_type,
  t.tgname AS object_name,
  n.nspname AS schema_name,
  c.relname AS table_name
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public'
  AND NOT t.tgisinternal

ORDER BY object_type, object_name;

-- Expected vs Actual Check
SELECT 
  'EXPECTED OBJECTS CHECK' AS check_type,
  'Tables' AS category,
  'profiles, loyalty_transactions, push_tokens, generated_coupons, menu_categories, menu_items' AS expected,
  COUNT(*)::TEXT AS found
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
  AND table_name IN ('profiles', 'loyalty_transactions', 'push_tokens', 'generated_coupons', 'menu_categories', 'menu_items')

UNION ALL

SELECT 
  'EXPECTED OBJECTS CHECK' AS check_type,
  'Functions' AS category,
  'update_updated_at_column, handle_new_user, sync_webflow_data' AS expected,
  COUNT(*)::TEXT AS found
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname IN ('update_updated_at_column', 'handle_new_user', 'sync_webflow_data')

UNION ALL

SELECT 
  'EXPECTED OBJECTS CHECK' AS check_type,
  'Triggers' AS category,
  'update_profiles_updated_at, update_menu_categories_updated_at, update_menu_items_updated_at, on_auth_user_created' AS expected,
  COUNT(*)::TEXT AS found
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE (n.nspname = 'public' OR n.nspname = 'auth')
  AND NOT t.tgisinternal
  AND t.tgname IN ('update_profiles_updated_at', 'update_menu_categories_updated_at', 'update_menu_items_updated_at', 'on_auth_user_created');


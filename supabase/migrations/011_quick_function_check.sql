-- Quick Function Check
-- This will show if your critical functions exist

SELECT 
  'update_updated_at_column' AS function_name,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE n.nspname = 'public' AND p.proname = 'update_updated_at_column'
    ) THEN '✓ EXISTS'
    ELSE '✗ MISSING'
  END AS status
UNION ALL
SELECT 
  'handle_new_user' AS function_name,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE n.nspname = 'public' AND p.proname = 'handle_new_user'
    ) THEN '✓ EXISTS'
    ELSE '✗ MISSING'
  END AS status
UNION ALL
SELECT 
  'sync_webflow_data' AS function_name,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE n.nspname = 'public' AND p.proname = 'sync_webflow_data'
    ) THEN '✓ EXISTS'
    ELSE '✗ MISSING (Optional - only if using pg_cron)'
  END AS status;



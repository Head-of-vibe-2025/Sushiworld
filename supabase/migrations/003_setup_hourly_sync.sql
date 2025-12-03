-- Setup Hourly Webflow Sync
-- This migration sets up a scheduled job to sync Webflow data every hour

-- Enable pg_cron extension (if available)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Function to call the Edge Function
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
  -- Note: In production, these should be stored securely
  -- For now, we'll use http extension to call the function
  
  -- Call the webflow-sync Edge Function
  -- This requires the http extension to be enabled
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
  
  -- Log the result (optional)
  RAISE NOTICE 'Sync completed with status: %, response: %', response_status, response_body;
END;
$$;

-- Schedule the job to run every hour
-- Note: This requires pg_cron extension and proper configuration
-- If pg_cron is not available, use an external cron service instead
SELECT cron.schedule(
  'webflow-hourly-sync',
  '0 * * * *', -- Every hour at minute 0
  $$SELECT sync_webflow_data();$$
);


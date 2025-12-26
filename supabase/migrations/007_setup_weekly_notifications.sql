-- Setup Weekly Push Notifications Cron Job
-- This migration sets up a cron job to send weekly push notifications
-- The job runs every Thursday at 5:00 PM UTC

-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Drop existing job if it exists
SELECT cron.unschedule('weekly-push-notifications');

-- Schedule the weekly notification job
-- Runs every Thursday at 5:00 PM UTC (adjust timezone as needed)
-- The function calls the Supabase Edge Function endpoint
SELECT cron.schedule(
  'weekly-push-notifications',
  '0 17 * * 4', -- Every Thursday at 5:00 PM UTC (cron format: minute hour day month weekday)
  $$
  SELECT
    net.http_post(
      url := current_setting('app.settings.supabase_url') || '/functions/v1/weekly-notifications',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.supabase_service_role_key')
      ),
      body := '{}'::jsonb
    ) AS request_id;
  $$
);

-- Note: You'll need to set these settings in your Supabase project:
-- 1. Go to Database > Settings > Custom Config
-- 2. Add:
--    app.settings.supabase_url = 'https://your-project.supabase.co'
--    app.settings.supabase_service_role_key = 'your-service-role-key'
--
-- Alternatively, you can use an external cron service (like cron-job.org, EasyCron, etc.)
-- to call: https://your-project.supabase.co/functions/v1/weekly-notifications
-- with Authorization header: Bearer your-service-role-key


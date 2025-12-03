# Webflow Sync Setup - Hourly Automatic Sync

This guide shows you how to set up automatic hourly syncing from Webflow to Supabase.

## Option 1: Using cron-job.org (Recommended - Easiest)

This is the simplest and most reliable method.

### Steps:

1. **Get your Supabase project details:**
   - Go to your Supabase Dashboard → Settings → API
   - Copy your **Project URL** (e.g., `https://lymingynfnunsrriiama.supabase.co`)
   - Copy your **anon/public key**

2. **Create the sync URL:**
   ```
   https://YOUR_PROJECT_URL.supabase.co/functions/v1/webflow-sync
   ```
   Example:
   ```
   https://lymingynfnunsrriiama.supabase.co/functions/v1/webflow-sync
   ```

3. **Set up cron-job.org:**
   - Go to https://cron-job.org (free account works)
   - Sign up or log in
   - Click "Create cronjob"
   - Fill in:
     - **Title:** Webflow Hourly Sync
     - **Address:** Your sync URL from step 2
     - **Schedule:** Every hour (or use cron expression: `0 * * * *`)
     - **Request method:** POST
     - **Request headers:**
       - Key: `Authorization`
       - Value: `Bearer YOUR_ANON_KEY`
     - **Request body:** `{}`
   - Click "Create"

4. **Test it:**
   - Click "Run now" to test
   - Check your Supabase dashboard to verify data was synced

## Option 2: Using Supabase pg_cron (Advanced)

If you have access to pg_cron extension:

1. Enable pg_cron in Supabase Dashboard:
   - Go to Database → Extensions
   - Enable "pg_cron"

2. Run the migration:
   ```sql
   -- Run supabase/migrations/003_setup_hourly_sync.sql
   ```

3. Configure settings:
   ```sql
   -- Set your Supabase URL and anon key
   ALTER DATABASE postgres SET app.settings.supabase_url = 'https://your-project.supabase.co';
   ALTER DATABASE postgres SET app.settings.supabase_anon_key = 'your-anon-key';
   ```

**Note:** This method requires the `http` extension which may not be available on all Supabase plans.

## Option 3: Using GitHub Actions (For developers)

If your code is on GitHub:

1. Create `.github/workflows/webflow-sync.yml`:
```yaml
name: Webflow Sync

on:
  schedule:
    - cron: '0 * * * *' # Every hour
  workflow_dispatch: # Manual trigger

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Webflow Sync
        run: |
          curl -X POST "${{ secrets.SUPABASE_URL }}/functions/v1/webflow-sync" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{}'
```

2. Add secrets to GitHub:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your anon key

## Verification

After setting up, verify it's working:

1. Wait for the next scheduled run (or trigger manually)
2. Check Supabase Dashboard → Edge Functions → webflow-sync → Invocations
3. You should see successful invocations every hour
4. Check your `menu_items` table to see updated timestamps

## Manual Sync

You can always trigger a manual sync:
- Via Supabase Dashboard: Edge Functions → webflow-sync → Test
- Via curl:
  ```bash
  curl -X POST "https://your-project.supabase.co/functions/v1/webflow-sync" \
    -H "Authorization: Bearer YOUR_ANON_KEY" \
    -H "Content-Type: application/json" \
    -d '{}'
  ```


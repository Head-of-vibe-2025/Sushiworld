# Database Cleanup Guide

## What Happened

You accidentally ran a SQL migration meant for a different app that uses a `users` table. This app uses a `profiles` table instead.

## Impact Assessment

### ✅ What Likely Failed (No Harm Done)
- `ALTER TABLE users ADD COLUMN ...` - This would have failed because there's no `users` table in this app
- No data was lost or modified in your existing tables

### ⚠️ What Was Created (Needs Cleanup)
The following objects were likely created and should be removed:
- `referral_codes` table
- `referrals` table  
- `generate_referral_code()` function
- `get_or_create_referral_code()` function
- `validate_and_reward_referral()` function
- RLS policies on the referral tables
- Indexes on the referral tables

## Solution

### Step 1: Run Diagnostic Check
First, verify what's actually in your database:

1. Open Supabase Dashboard → SQL Editor
2. Run: `supabase/migrations/008_diagnostic_check.sql`
3. Review the output to see what's missing or broken

### Step 2: Clean Up Referral System
Remove all the accidentally created objects:

1. In Supabase SQL Editor, run: `supabase/migrations/010_cleanup_wrong_migration.sql`
2. This will safely remove:
   - All referral-related tables
   - All referral-related functions
   - All referral-related RLS policies
   - All referral-related indexes

### Step 3: Restore Any Missing Objects (If Needed)
If the diagnostic check shows that your original database objects are missing:

1. Run: `supabase/migrations/009_restore_database.sql`
2. This will restore:
   - All original functions
   - All original triggers
   - All original RLS policies
   - All original indexes

## Verification

After cleanup, verify everything is working:

1. Check that your app can still:
   - Sign up new users
   - View profiles
   - Access loyalty transactions
   - View menu items

2. Run the diagnostic script again to confirm all original objects exist

## Files Created

- `008_diagnostic_check.sql` - Checks database health
- `009_restore_database.sql` - Restores original database objects
- `010_cleanup_wrong_migration.sql` - Removes referral system objects

## Notes

- The cleanup script is safe to run multiple times
- It uses `DROP IF EXISTS` and `CREATE OR REPLACE` so it won't break anything
- Your original data and schema should remain intact



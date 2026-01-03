# Fix: Email Confirmation Issue

## Quick Fix: Disable Email Confirmation in Supabase Dashboard

Your production Supabase instance has email confirmation enabled, which is why you can't sign in after creating an account.

### Option 1: Disable Email Confirmation (Recommended for Development/Testing)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `lymingynfnunsrriiama`
3. Navigate to **Authentication** → **Settings** → **Email Auth**
4. Find **"Enable email confirmations"** and toggle it **OFF**
5. Click **Save**

After this, new signups will automatically log users in without requiring email confirmation.

### Option 2: Manually Verify Existing Users (Quick Workaround)

If you want to verify existing users without disabling email confirmation:

1. Go to Supabase Dashboard → SQL Editor
2. Run this SQL to verify all users:

```sql
-- Verify all unverified users
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;
```

Or verify a specific user by email:

```sql
-- Verify specific user
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'your-email@example.com';
```

3. Then try signing in again with those credentials

### Option 3: Check Email in Supabase Dashboard

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Find your user account
3. Check if `email_confirmed_at` is NULL
4. You can manually set it by clicking on the user and editing

## Why This Happens

- Your local `supabase/config.toml` has `enable_confirmations = false`
- But your **production** Supabase project has email confirmation **enabled**
- The local config only affects local Supabase instances, not the hosted one
- You need to change the setting in the Supabase Dashboard for your production project

## After Fixing

Once you disable email confirmation or manually verify your user:
1. Try signing in with your existing account
2. Or create a new account - it should automatically log you in
3. You should see the logged-in version of the app immediately



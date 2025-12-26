# Debug: Password Reset Link Expired Issue

## Step-by-Step Debugging

### Step 1: Check Console Logs in Your App

When you request a password reset, check the console/logs in your app. You should see:

```
🔐 Requesting password reset for: your-email@example.com
🔗 Base callback URL: https://lymingynfnunsrriiama.supabase.co/auth/v1/callback
🔗 Full redirect URL: https://lymingynfnunsrriiama.supabase.co/auth/v1/callback?redirect_to=sushiworld://reset-password
```

**If you see localhost in these logs**, that's the problem - your environment variable is wrong.

### Step 2: Check the Actual Email Link

When you receive the password reset email:

1. **Right-click the "Reset Password" link** → Copy link address
2. **Check what the URL looks like**

**Correct format should be:**
```
https://lymingynfnunsrriiama.supabase.co/auth/v1/verify?token=...&type=recovery&redirect_to=https://lymingynfnunsrriiama.supabase.co/auth/v1/callback?redirect_to=sushiworld://reset-password
```

**Wrong format (if you see localhost):**
```
http://localhost:3000/auth/v1/verify?token=...
```

### Step 3: Verify Email Template

1. Go to Supabase Dashboard → **Authentication** → **Email Templates**
2. Click on **"Reset password"** template
3. Check that it uses `{{ .ConfirmationURL }}` or `{{ .RedirectTo }}`
4. Make sure the template is **enabled**

### Step 4: Check Environment Variables

In your app's `.env` file or environment, verify:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://lymingynfnunsrriiama.supabase.co
```

**NOT:**
```bash
EXPO_PUBLIC_SUPABASE_URL=http://localhost:3000  # WRONG!
```

### Step 5: Request a FRESH Link

1. **Wait 2 minutes** after any previous request
2. **Go to your app**
3. **Request a NEW password reset**
4. **Check your email immediately**
5. **Click the link within 5 minutes** (don't wait)

### Step 6: Test the Link

When you click the link, it should:

1. **On desktop browser:** Redirect to Supabase callback, then show JSON or redirect
2. **On mobile device:** Open your app automatically via deep link

**If it goes to `localhost` or shows expired immediately**, the redirect URL is wrong.

## Common Issues

### Issue: Link expires immediately

**Possible causes:**
- Using an old link (from before configuration changes)
- Multiple password reset requests (each new request invalidates previous ones)
- Clock/time sync issues

**Fix:** Request ONE fresh link and use it within 5 minutes.

### Issue: Link goes to localhost

**Cause:** `EXPO_PUBLIC_SUPABASE_URL` environment variable is set to localhost

**Fix:** 
1. Check your `.env` file
2. Change to: `EXPO_PUBLIC_SUPABASE_URL=https://lymingynfnunsrriiama.supabase.co`
3. Restart your app/development server
4. Request a new password reset

### Issue: Link shows expired error

**Cause:** The token is actually expired (older than 1 hour) or was invalidated

**Fix:** Request a completely new password reset link

## Quick Test

Try this exact sequence:

1. **Stop your app**
2. **Check `.env` file** - make sure `EXPO_PUBLIC_SUPABASE_URL` is correct
3. **Restart your app**
4. **Request password reset** in app
5. **Check email within 30 seconds**
6. **Click link immediately**
7. **Check what happens**

If it still doesn't work, share:
- What the console logs show (the URLs being generated)
- What the actual email link URL looks like
- What error you see when clicking

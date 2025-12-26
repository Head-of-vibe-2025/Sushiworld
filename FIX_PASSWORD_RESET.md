# Fix: Password Reset Not Working

## ⚠️ Error: "Email link is invalid or has expired" (otp_expired)

If you see a `403` error with `"otp_expired"` when clicking the password reset link, **the link has expired**.

**Password reset links expire after ~1 hour for security reasons.**

**Fix:** Request a **new password reset link** from your app. The new link will be valid for another hour.

**Note:** Even with a valid link, if you see raw JSON in the browser instead of being redirected to your app, check the Site URL and Redirect URLs configuration below.

---

## Common Issues and Solutions

### Issue 1: Site URL Set to Localhost (MOST COMMON)

If you see `localhost refused to connect` when clicking the reset link, your Site URL is set to localhost.

**Fix:**
1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `lymingynfnunsrriiama`
3. Navigate to **Authentication** → **URL Configuration**
4. Find **"Site URL"** field at the top
5. Change from `http://localhost:3000` to:
   ```
   https://lymingynfnunsrriiama.supabase.co
   ```
6. Scroll down to **"Redirect URLs"** section
7. Add this URL:
   ```
   https://lymingynfnunsrriiama.supabase.co/auth/v1/callback
   ```
8. Click **Save** (may need to save Site URL and Redirect URLs separately)

### Issue 2: Email Service Not Configured (MOST COMMON)

If you're not receiving password reset emails, **SMTP is likely not configured**.

**Quick Check:**
1. Go to Supabase Dashboard → **Authentication** → **Settings**
2. Scroll to **"SMTP Settings"**
3. If it says "Configure SMTP" or shows no SMTP details → **This is the problem!**

**Quick Fix - Set Up Gmail SMTP (5 minutes):**
1. Get Gmail App Password: https://myaccount.google.com/apppasswords
2. In Supabase → Authentication → Settings → SMTP Settings, enter:
   - Host: `smtp.gmail.com`
   - Port: `587`
   - Username: Your Gmail address
   - Password: The 16-character App Password (NOT your regular password)
   - Sender email: Your Gmail address
3. Click Save
4. Try password reset again - should work immediately!

**For more details, see:** `FIX_PASSWORD_RESET_EMAIL.md`

### Issue 3: Deep Linking Not Working

If the email link doesn't open the app:

**For iOS:**
- Make sure `app.json` has `associatedDomains` configured (it does - line 21-23)
- You may need to rebuild the app after changing deep link settings

**For Android:**
- The `intentFilters` in `app.json` should handle this (lines 31-51)
- Make sure the app is installed when testing

**For Development (Expo Go):**
- Deep links work differently in Expo Go
- Use `expo://` scheme or test on a development build

### Issue 4: Testing Password Reset Flow

**To test the full flow:**

1. **Request Password Reset:**
   - Go to "Forgot Password" screen
   - Enter your email
   - Click "Send Reset Link"

2. **Check Email:**
   - Check inbox and spam folder
   - The email should contain a link

3. **Click the Link:**
   - On mobile: Should open the app
   - On desktop: Will open in browser (not ideal, but works)

4. **Reset Password:**
   - Should navigate to "Reset Password" screen
   - Enter new password
   - Click "Reset Password"

### Quick Test (Manual Session Setup)

If deep linking isn't working, you can manually test the reset password screen:

1. Request a password reset
2. Copy the `access_token` from the email link
3. In your app, manually navigate to Reset Password screen
4. The code should detect the session automatically

### Debugging Steps

**Check Console Logs:**
- When requesting reset: Look for `🔐 Requesting password reset for:` in console
- When clicking link: Look for `Deep link received:` in console
- Check for any error messages

**Check Supabase Dashboard:**
1. Go to **Logs** → **Auth Logs**
2. Look for password reset requests
3. Check if errors occurred

**Verify Redirect URL:**
- The redirect URL used is: `https://lymingynfnunsrriiama.supabase.co/auth/v1/callback?redirect_to=sushiworld://reset-password`
- Make sure the base URL `https://lymingynfnunsrriiama.supabase.co/auth/v1/callback` is whitelisted

## Most Likely Fix

**There are TWO things you need to configure:**

### Fix 1: Update Site URL (REQUIRED)

The Site URL is currently set to `localhost:3000`, which causes the error you're seeing.

1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Find **"Site URL"** field (at the top)
3. Change it from `http://localhost:3000` to:
   ```
   https://lymingynfnunsrriiama.supabase.co
   ```
4. Click **Save**

### Fix 2: Add Redirect URLs (ALSO REQUIRED)

1. In the same page (**URL Configuration**), find **"Redirect URLs"** section
2. Add this URL:
   ```
   https://lymingynfnunsrriiama.supabase.co/auth/v1/callback
   ```
3. Click **Save**

After both changes, try password reset again - the link should now work correctly!

**Important:** Password reset links expire after ~1 hour. If you see "otp_expired" error, just request a new password reset link.

---

## 🚨 PRODUCTION REMINDER: Change Sender Email

**Before going to production, you MUST change the SMTP sender email:**

- Currently using: Your personal email (for testing only)
- Should be: Client's professional email (e.g., `noreply@sushiworld.com` or `info@sushiworld.com`)

**To change:**
1. Go to Supabase Dashboard → Authentication → Settings → SMTP Settings
2. Update "Sender email address" to the client's professional email
3. Update SMTP credentials if using a different email provider
4. Test password reset to verify it works
5. ✅ Done!

**Note:** The sender email address is visible to customers in password reset emails, so it must be professional!


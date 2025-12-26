# Password Reset Setup Guide - In-App Flow

## Problem
Password reset emails are redirecting to `about:blank` instead of opening the app. You want the entire password reset flow to happen within the app.

## Solution
The app is now configured to handle password reset links directly in the app using Universal Links (iOS) and App Links (Android). When users click the reset link in their email, it will open directly in your app.

### Step 1: Add Redirect URL to Supabase Dashboard

The app is configured to use the Supabase callback URL which will open directly in your app.

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **URL Configuration**
3. Add this URL to the **Redirect URLs** list:
   ```
   https://lymingynfnunsrriiama.supabase.co/auth/v1/callback
   ```

That's it! The app is already configured to handle this URL and open the password reset screen directly in the app.

### Step 2: Test the Flow

1. Request a password reset from the app
2. Check your email and click the reset link
3. The link should open directly in your app (not in a browser)
4. The Reset Password screen should appear automatically

### Step 4: Test

1. Request a password reset from the app
2. Check your email and click the reset link
3. The link should:
   - Open in a browser (if using hosted redirect page)
   - Redirect to the app with the reset token
   - Open the Reset Password screen in the app

## How It Works

1. User requests password reset → Supabase sends email
2. Email contains link: `https://[project].supabase.co/auth/v1/verify?token=...&redirect_to=https://[project].supabase.co/auth/v1/callback?redirect_to=sushiworld://reset-password`
3. User clicks link → Supabase verifies and redirects to callback URL with hash: `https://[project].supabase.co/auth/v1/callback?redirect_to=sushiworld://reset-password#access_token=...&type=recovery`
4. **App intercepts the URL** → Via Universal Links (iOS) / App Links (Android), the URL opens directly in your app
5. App extracts tokens from URL hash → Sets recovery session and navigates to Reset Password screen
6. User resets password → All within the app, no browser needed!

## Universal Links / App Links Configuration

The app is configured in `app.json` to handle URLs from your Supabase domain:
- **iOS**: Associated domain `applinks:lymingynfnunsrriiama.supabase.co`
- **Android**: Intent filter for `https://lymingynfnunsrriiama.supabase.co/auth/v1/callback`

**Note**: For Universal Links to work fully on iOS, you need an `apple-app-site-association` file hosted on the domain. Since you can't add this to Supabase's domain, the link may still open in Safari first, but then Safari will redirect to your app. On Android, App Links should work immediately if the app is installed.

## Troubleshooting

- **Link opens in browser instead of app**: 
  - On iOS: Universal Links require the app to be installed and the association file (which we can't add to Supabase's domain). The link will open in Safari, then Safari will offer to open in your app.
  - On Android: App Links should work immediately if the app is installed.
  - **Solution**: Consider hosting the redirect page on your own domain with proper association files for true Universal Links.

- **Still seeing `about:blank`**: 
  - Make sure `https://lymingynfnunsrriiama.supabase.co/auth/v1/callback` is added to Supabase dashboard redirect URLs
  - Rebuild the app after making changes to `app.json`

- **App doesn't open**: 
  - Check that the app scheme `sushiworld://` is properly configured in `app.json`
  - Make sure the app is installed on the device
  - On iOS, you may need to long-press the link and select "Open in Sushi World"

- **Invalid session error**: 
  - The reset link may have expired (they expire after 1 hour by default)
  - Request a new password reset

## Advanced: True Universal Links (Optional)

For the best experience where links open directly in the app without any browser interaction, you can:

1. Use your own domain (e.g., `sushiworld.com`)
2. Host the `apple-app-site-association` file (iOS) and `assetlinks.json` file (Android)
3. Update `app.json` to use your domain instead of Supabase's domain
4. Host a redirect page on your domain that redirects to the app

This requires domain ownership and web hosting, but provides the smoothest user experience.


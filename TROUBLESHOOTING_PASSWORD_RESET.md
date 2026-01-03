# Troubleshooting Password Reset Email Not Sending

## Quick Checks

### 1. Check Console Logs
When you try to reset password, check the console/logs for:
- "Requesting password reset for: [email]"
- "Redirect URL: [url]"
- Any error messages

### 2. Verify Supabase Configuration

**Check if redirect URL is whitelisted:**
1. Go to Supabase Dashboard
2. Navigate to **Authentication** > **URL Configuration**
3. Under **Redirect URLs**, make sure this is added:
   ```
   https://lymingynfnunsrriiama.supabase.co/auth/v1/callback
   ```

### 3. Check Email Service Configuration

**For Local Development (Supabase Local):**
- Check if Inbucket is running (for local email testing)
- Access Inbucket at: http://localhost:54324
- Check if emails are being received there

**For Production:**
- Go to Supabase Dashboard > **Settings** > **Auth**
- Check if email service is configured
- Verify SMTP settings if using custom SMTP

### 4. Test with Simple Redirect URL

If the callback URL doesn't work, try using the app scheme directly:

1. Temporarily update `authService.ts`:
```typescript
const redirectUrl = 'sushiworld://reset-password';
```

2. Add `sushiworld://reset-password` to Supabase redirect URLs

3. Test again

### 5. Check for Errors

The app now logs errors. Check:
- Browser console (if testing on web)
- React Native debugger
- Metro bundler logs

Common errors:
- **"Invalid redirect URL"**: URL not whitelisted in Supabase
- **"Email rate limit exceeded"**: Too many requests, wait a few minutes
- **"User not found"**: Email doesn't exist (Supabase still sends success to prevent email enumeration)

### 6. Verify Environment Variables

Make sure `.env` has:
```env
EXPO_PUBLIC_SUPABASE_URL=https://lymingynfnunsrriiama.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 7. Test Email Directly

Try using Supabase's password reset directly:
```javascript
const { error } = await supabase.auth.resetPasswordForEmail('test@example.com', {
  redirectTo: 'https://lymingynfnunsrriiama.supabase.co/auth/v1/callback'
});
```

If this works, the issue is with the redirect URL format.

## Common Issues

### Issue: "Invalid redirect URL"
**Solution**: Add the redirect URL to Supabase dashboard whitelist

### Issue: No email received
**Possible causes**:
1. Email in spam folder
2. Email service not configured
3. Rate limiting (too many requests)
4. Invalid email format

### Issue: Error in console but no alert
**Solution**: Check that error handling is working - the app now logs errors to console

## Next Steps

1. Check console logs when requesting reset
2. Verify redirect URL is whitelisted
3. Check Inbucket (local) or email service (production)
4. Try with simpler redirect URL format
5. Contact Supabase support if issue persists



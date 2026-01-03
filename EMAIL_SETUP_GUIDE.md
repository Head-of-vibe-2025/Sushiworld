# Email Setup Guide for Password Reset

## Current Status
You're using Supabase's built-in email service (FREE tier), which has rate limits and may not deliver emails reliably.

## Steps to Fix

### Option 1: Check Reset Password Template (Quick Check)

1. **Click on "Reset password" template** in the list
2. **Verify the template is enabled** (should be enabled by default)
3. **Check the template content** - make sure it's not empty or broken
4. **Verify the redirect URL in the template** matches your whitelisted URL

### Option 2: Set Up Custom SMTP (Recommended for Production)

1. **Click "Set up SMTP" button** (in the yellow warning banner)
2. **Configure SMTP settings** with your email provider:
   - **Gmail**: Use App Password (not regular password)
   - **SendGrid**: Use API key
   - **Mailgun**: Use SMTP credentials
   - **AWS SES**: Use SMTP credentials
   - **Other providers**: Use their SMTP settings

3. **SMTP Settings Needed:**
   - Host (e.g., `smtp.gmail.com`)
   - Port (usually 587 for TLS, 465 for SSL)
   - Username (your email or API key)
   - Password (App Password for Gmail, API key for others)
   - Sender email address
   - Sender name

### Option 3: Test with Built-in Service First

Before setting up SMTP, try:
1. **Click on "Reset password" template**
2. **Check if it's enabled**
3. **Try password reset again**
4. **Check spam folder** - built-in service emails often go to spam

## Common Issues with Built-in Service

- **Rate limits**: Only a few emails per hour on FREE tier
- **Deliverability**: Emails may go to spam
- **No custom domain**: Uses Supabase's domain (may be blocked)

## Quick Test

1. Click on "Reset password" template
2. Make sure it's enabled
3. Try password reset in your app
4. Check email inbox AND spam folder
5. If still not working, set up custom SMTP



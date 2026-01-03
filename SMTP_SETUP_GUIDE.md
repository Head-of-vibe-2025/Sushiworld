# SMTP Setup Guide for Supabase

## Quick Setup (Gmail - Easiest)

### Step 1: Get Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Click **Security** in the left menu
3. Enable **2-Step Verification** (if not already enabled)
4. Go to **App passwords**: https://myaccount.google.com/apppasswords
5. Select **Mail** and **Other (Custom name)**
6. Enter "Supabase" as the name
7. Click **Generate**
8. **Copy the 16-character password** (you'll need this)

### Step 2: Fill Out Supabase SMTP Form

In the Supabase SMTP settings page, fill in:

**Sender details:**
- **Sender email address**: Your Gmail address (e.g., `yourname@gmail.com`)
- **Sender name**: `Sushi World` (already filled)

**SMTP provider settings:**
- **Host**: `smtp.gmail.com`
- **Port number**: `587` (or `465` for SSL)
- **Username**: Your Gmail address (same as sender email)
- **Password**: The 16-character App Password from Step 1
- **Minimum interval per user**: `60` (already filled - this is fine)

### Step 3: Save

Click **Save** or **Enable SMTP** button at the bottom.

## Alternative: SendGrid (Recommended for Production)

If you prefer a more production-ready solution:

1. Sign up for SendGrid (free tier: 100 emails/day)
2. Go to Settings > API Keys
3. Create an API key
4. Use these settings:
   - **Host**: `smtp.sendgrid.net`
   - **Port**: `587`
   - **Username**: `apikey`
   - **Password**: Your SendGrid API key
   - **Sender email**: Your verified sender email in SendGrid

## After Setup

1. **Test it**: Try password reset in your app
2. **Check email**: Should arrive immediately (not in spam)
3. **No code changes needed**: Works automatically!

## Important Notes

- **Sender email**: Must be a real email you control
- **App Password**: NOT your regular Gmail password
- **Port 587**: Uses TLS (recommended)
- **Port 465**: Uses SSL (also works)
- **Port 25**: Don't use (often blocked)



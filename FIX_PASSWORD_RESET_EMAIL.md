# Fix: Not Receiving Password Reset Email

## Quick Diagnosis Steps

### Step 1: Check if Email Was Sent (5 seconds)

1. Go to Supabase Dashboard → **Logs** → **Auth Logs**
2. Look for recent "Password reset requested" entries
3. Check if there are any errors

**If you see errors:**
- Note the error message
- Common: "Email service not configured" or "SMTP error"

**If you see no entries:**
- Enable audit logs first (see Step 2)

### Step 2: Enable Audit Logs (if not enabled)

1. Go to **Authentication** → **Audit Logs**
2. Toggle **"Write audit logs to the database"** ON
3. Click **Save changes**
4. Try password reset again
5. Check logs again

### Step 3: Check Email Template

1. Go to **Authentication** → **Email Templates** (or just **Email**)
2. Find **"Reset password"** template
3. Click on it
4. Make sure it's **enabled**
5. Check the content - should have `{{ .ConfirmationURL }}` or similar

### Step 4: Check Spam Folder

The default Supabase email service sends from their domain, which often goes to spam:
- Check your **spam/junk folder**
- Wait 2-3 minutes (can be slow on free tier)

---

## Most Common Fix: Set Up SMTP

The **free Supabase email service is unreliable**. Setting up SMTP is the best solution.

### Option A: Gmail (Easiest - 5 minutes)

1. **Get Gmail App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Supabase"
   - Click Generate
   - **Copy the 16-character password**

2. **Configure in Supabase:**
   - Go to **Authentication** → **Settings** → **SMTP Settings**
   - Or click "Set up SMTP" if you see a banner
   - Fill in:
     ```
     Sender email: your-email@gmail.com
     Sender name: Sushi World
     Host: smtp.gmail.com
     Port: 587
     Username: your-email@gmail.com
     Password: [paste the 16-character app password]
     ```
   - Click **Save**

3. **Test:**
   - Try password reset in your app
   - Should receive email immediately

### Option B: Check Current SMTP Status

1. Go to **Authentication** → **Settings**
2. Scroll to **SMTP Settings**
3. Check if SMTP is configured
   - If it says "Configure SMTP" → SMTP is NOT set up (this is the problem!)
   - If it shows SMTP details → SMTP is configured (check credentials)

---

## Why Emails Aren't Arriving (Common Causes)

### 1. **No SMTP Configured (Most Common)**
- **Free tier**: Uses Supabase's default email service
- **Limitations**: Rate limits, goes to spam, unreliable
- **Fix**: Set up SMTP (see above)

### 2. **Rate Limits on Free Tier**
- Only ~3-5 emails per hour on free tier
- **Fix**: Wait 1 hour or upgrade/use SMTP

### 3. **Email in Spam**
- Default service emails often marked as spam
- **Fix**: Check spam folder, set up SMTP for better deliverability

### 4. **Wrong Email Address**
- Typo in email address
- **Fix**: Double-check the email you're using

### 5. **Email Template Disabled**
- Reset password template might be disabled
- **Fix**: Go to Email Templates → Reset password → Enable

---

## Quick Test Checklist

Run through this checklist:

- [ ] Checked Auth Logs for errors
- [ ] Checked spam folder (wait 2-3 minutes)
- [ ] Verified email template is enabled
- [ ] Checked if SMTP is configured
- [ ] Tried password reset again
- [ ] Verified email address is correct

---

## Still Not Working?

If emails still don't arrive after setting up SMTP:

1. **Verify SMTP credentials:**
   - Test with Gmail's test email first
   - Make sure App Password is correct (not regular password)

2. **Check SMTP settings:**
   - Port 587 (TLS) is recommended
   - Port 465 (SSL) also works
   - Don't use port 25

3. **Try a different email provider:**
   - SendGrid (free tier: 100 emails/day)
   - Mailgun (free tier: 5000 emails/month)
   - AWS SES (very cheap)

4. **Check Supabase status:**
   - Visit: https://status.supabase.com
   - See if there are email service issues

---

## Recommendation

**For development/testing:** Set up Gmail SMTP (takes 5 minutes, see Option A above)

**For production:** Use a dedicated email service like SendGrid or Mailgun for better deliverability

Once SMTP is configured, password reset emails should work immediately! 🎉



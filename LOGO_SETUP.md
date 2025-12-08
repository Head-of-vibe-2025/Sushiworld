# Logo URL Setup Guide

## Quick Answer

**You have 3 options:**

1. **Set it in `.env` file** (Recommended) - Add `EXPO_PUBLIC_LOGO_URL=your-url-here`
2. **Do nothing** - It will use a placeholder logo (works, but shows "Sushi World" text)
3. **Use Supabase public storage** - Make your storage bucket public and use that URL

## Option 1: Add to .env File (Recommended)

### Step 1: Open your `.env` file
```bash
# In your project root
code .env
# or
nano .env
# or
open .env
```

### Step 2: Add this line
```bash
EXPO_PUBLIC_LOGO_URL=https://your-logo-url.com/logo.svg
```

### Step 3: Restart your app
```bash
npm start
```

## Option 2: Use Supabase Public Storage

If your logo is in Supabase Storage:

### Step 1: Make the bucket public
1. Go to Supabase Dashboard → Storage
2. Find your `assets` bucket
3. Click on it → Settings
4. Make it **Public**

### Step 2: Get the public URL
The public URL format is:
```
https://[your-project-id].supabase.co/storage/v1/object/public/assets/SushiWorld_logo.svg
```

### Step 3: Add to .env
```bash
EXPO_PUBLIC_LOGO_URL=https://lymingynfnunsrriiama.supabase.co/storage/v1/object/public/assets/SushiWorld_logo.svg
```

**Note:** Remove the `?token=...` part - you don't need it for public buckets!

## Option 3: Do Nothing (Temporary)

If you don't set `EXPO_PUBLIC_LOGO_URL`, the app will use a placeholder:
- Shows "Sushi World" text
- Works fine for development
- Not ideal for production

## Current Status

Based on your code, the logo URL is now:
- ✅ **Secure** - No hardcoded tokens
- ✅ **Configurable** - Uses environment variable
- ✅ **Has fallback** - Uses placeholder if not set

## Quick Check

To see what URL is currently being used, check:
```typescript
// In src/utils/constants.ts
export const LOGO_URL = process.env.EXPO_PUBLIC_LOGO_URL || 'https://via.placeholder.com/200x60?text=Sushi+World';
```

## Recommendation

**For production:** Use Option 1 or 2 with a real logo URL  
**For development:** Option 3 (placeholder) is fine

---

**Need help?** If you have the logo file but don't know where to host it:
1. Upload to Supabase Storage (make bucket public)
2. Upload to a CDN (Cloudflare, AWS S3, etc.)
3. Host on your website
4. Use a service like Imgur (temporary solution)



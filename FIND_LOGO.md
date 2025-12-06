# Finding Your Logo

## Where Your Logo Is Located

Based on the previous hardcoded URL, your logo is **in Supabase Storage**:

**Location:** `assets/SushiWorld_logo.svg`  
**Project:** `lymingynfnunsrriiama`  
**Bucket:** `assets`

## How to Find It

### Option 1: Check Supabase Dashboard (Easiest)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (`lymingynfnunsrriiama`)
3. Click **Storage** in the left sidebar
4. Click on the **`assets`** bucket
5. Look for `SushiWorld_logo.svg`

### Option 2: Check the Public URL

If the bucket is public, your logo should be at:
```
https://lymingynfnunsrriiama.supabase.co/storage/v1/object/public/assets/SushiWorld_logo.svg
```

**Try opening this URL in your browser** - if it works, that's your logo!

### Option 3: Use Supabase CLI

```bash
# List files in the assets bucket
supabase storage ls assets
```

## What to Do Once You Find It

### If the Bucket is Public:
Use this URL in your `.env` file:
```bash
EXPO_PUBLIC_LOGO_URL=https://lymingynfnunsrriiama.supabase.co/storage/v1/object/public/assets/SushiWorld_logo.svg
```

### If the Bucket is Private:
You have two options:

**Option A: Make it Public (Recommended)**
1. In Supabase Dashboard → Storage → `assets` bucket
2. Click **Settings**
3. Toggle **Public bucket** to ON
4. Then use the public URL above

**Option B: Generate Signed URLs Server-Side**
- Create an Edge Function to generate signed URLs
- More complex but more secure

## Quick Test

Open this URL in your browser to see if your logo is accessible:
```
https://lymingynfnunsrriiama.supabase.co/storage/v1/object/public/assets/SushiWorld_logo.svg
```

If you see the logo → Great! Use that URL  
If you get an error → The bucket is private, make it public first


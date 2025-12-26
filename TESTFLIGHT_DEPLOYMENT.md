# TestFlight Deployment - Configuration Guide

## ✅ What Stays the Same (No Changes Needed)

### 1. **SMTP Settings** ✅
- **Configured in Supabase Dashboard** (not in code)
- **Project-level setting** - works for all environments
- **No code changes needed** - works for dev, TestFlight, and production
- **Set it once, use everywhere**

### 2. **App Code** ✅
- Uses environment variables (`process.env.EXPO_PUBLIC_SUPABASE_URL`)
- Already environment-agnostic
- No changes needed for TestFlight

### 3. **Redirect URLs** ✅
- Uses the same Supabase project URL
- Already configured to work with your Supabase domain
- No changes needed

### 4. **Deep Linking Configuration** ✅
- `app.json` already configured for Universal Links/App Links
- Uses your Supabase domain (same for all environments)
- No changes needed

## 🔄 What You Might Need to Check

### 1. **Environment Variables**
Make sure your `.env` file has the correct values:
```env
EXPO_PUBLIC_SUPABASE_URL=https://lymingynfnunsrriiama.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-key
```

**For EAS Build (TestFlight):**
- These are included in your build automatically
- No changes needed if using the same Supabase project

### 2. **Supabase Redirect URLs** (Already Done ✅)
- `https://lymingynfnunsrriiama.supabase.co/auth/v1/callback`
- This works for all environments (dev, TestFlight, production)
- **No changes needed**

### 3. **App Bundle ID / Package Name**
- Already set in `app.json`:
  - iOS: `com.sushiworld.app`
  - Android: `com.sushiworld.app`
- **No changes needed** unless you want different IDs for different environments

## 📱 TestFlight Specific Notes

### What TestFlight Is:
- **Just a distribution method** - it's Apple's beta testing platform
- **Same app, different distribution channel**
- **Doesn't change your app's configuration**

### What You Need for TestFlight:
1. **EAS Build account** (if using Expo)
2. **Apple Developer account** ($99/year)
3. **Build the app** with `eas build --platform ios`
4. **Submit to TestFlight** via App Store Connect

### Configuration:
- **Same Supabase project** ✅
- **Same SMTP settings** ✅
- **Same redirect URLs** ✅
- **Same environment variables** ✅

## 🚀 Production Deployment (Future)

When you go to production (App Store/Play Store):
- **Everything stays the same** if using the same Supabase project
- **Only change if** you create a separate Supabase project for production
  - Then you'd need to update environment variables
  - And add redirect URLs to the new project

## Summary

**Short answer: NO, you don't need to change anything for TestFlight.**

- SMTP settings: Set once in Supabase, works everywhere ✅
- Code: Already uses environment variables ✅
- Configuration: Same for all environments ✅
- TestFlight: Just a different way to distribute the same app ✅

Set up SMTP now, and it will work for development, TestFlight, and production!


# TestFlight Submission Checklist

## ⚠️ REMINDER: Temporary Company Account
This submission is for a **temporary account** for preview purposes only.

## Pre-Submission Checklist

### 1. EAS Account Setup
- [ ] EAS CLI installed: `npm install -g eas-cli`
- [ ] Logged into EAS: `eas login`
- [ ] EAS project created: `eas init` (if not already done)
- [ ] Project ID updated in `app.json` → `extra.eas.projectId`

### 2. Apple Developer Account
- [ ] Temporary company Apple Developer account active
- [ ] App Store Connect access granted
- [ ] Apple Team ID noted (for `eas.json`)
- [ ] Apple ID email noted (for `eas.json`)

### 3. App Store Connect Setup
- [ ] App created in App Store Connect
- [ ] App Store Connect App ID noted (numeric ID)
- [ ] Bundle ID matches: `com.sushiworld.app`
- [ ] App name matches: "Sushi World"

### 4. Configuration Files
- [ ] `eas.json` updated with temporary account credentials:
  - `submit.preview.ios.appleId`
  - `submit.preview.ios.ascAppId`
  - `submit.preview.ios.appleTeamId`
- [ ] `app.json` has correct bundle identifier
- [ ] `app.json` has EAS project ID (not placeholder)

### 5. Build Assets
- [ ] App icon exists: `./assets/icon.png`
- [ ] Splash screen exists: `./assets/splash.png`
- [ ] All required assets are in place

### 6. Environment Variables
- [ ] `.env` file has correct Supabase credentials (if using)
- [ ] Environment variables are set for EAS build

## Submission Steps

### Step 1: Build
```bash
eas build --platform ios --profile preview
```
- [ ] Build completed successfully
- [ ] Build is available in EAS dashboard

### Step 2: Submit
```bash
eas submit --platform ios --profile preview
```
- [ ] Submission completed successfully
- [ ] Build appears in App Store Connect → TestFlight

### Step 3: TestFlight Configuration
- [ ] Build processed in TestFlight (10-30 minutes)
- [ ] Internal testers added (if needed)
- [ ] External testers configured (if needed)
- [ ] Test information provided (if required)

## Post-Submission

### Testing
- [ ] Testers can install from TestFlight
- [ ] App launches correctly
- [ ] Core features work as expected
- [ ] Deep linking works (password reset, etc.)

### Documentation
- [ ] Account details documented in `TESTFLIGHT_ACCOUNT_NOTES.md`
- [ ] Submission steps documented
- [ ] Any issues noted for future reference

## When Moving to Final Account

Remember to:
- [ ] Update `eas.json` with final account credentials
- [ ] Update `TESTFLIGHT_ACCOUNT_NOTES.md`
- [ ] Transfer app in App Store Connect (if needed)
- [ ] Update all documentation

## Quick Commands Reference

```bash
# Login to EAS
eas login

# Initialize EAS project (if needed)
eas init

# Build for TestFlight
eas build --platform ios --profile preview

# Submit to TestFlight
eas submit --platform ios --profile preview

# Check build status
eas build:list

# View build logs
eas build:view [build-id]
```

## Support

If you encounter issues:
1. Check EAS build logs
2. Check App Store Connect for processing errors
3. Review `TESTFLIGHT_SUBMISSION_STEPS.md` for detailed troubleshooting
4. Check Expo/EAS documentation

## Notes

- **Account Type:** Temporary company account (preview only)
- **Bundle ID:** `com.sushiworld.app`
- **App Name:** Sushi World
- **Version:** 1.0.0
- **Profile Used:** `preview`


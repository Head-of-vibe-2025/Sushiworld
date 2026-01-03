# TestFlight Submission Steps

## ⚠️ Current Account: Temporary Company Account (Preview Only)

This is a **temporary account** for preview purposes. When you decide on the final account, we'll update the configuration.

## Prerequisites

1. **Apple Developer Account** (temporary company account)
   - Must have App Store Connect access
   - Must have Team ID

2. **EAS CLI** installed and configured
   ```bash
   npm install -g eas-cli
   eas login
   ```

3. **App Store Connect App Created**
   - Go to App Store Connect
   - Create new app (if not already created)
   - Note the App ID (numeric ID)

## Step 1: Update eas.json with Your Account Details

Edit `eas.json` and update the `submit.preview.ios` section:

```json
"submit": {
  "preview": {
    "ios": {
      "appleId": "your-temporary-company-email@example.com",
      "ascAppId": "1234567890",  // Your App Store Connect App ID
      "appleTeamId": "ABCD1234EF"  // Your Apple Team ID
    }
  }
}
```

**Where to find these:**
- `appleId`: Your Apple ID email (the one you use for App Store Connect)
- `ascAppId`: Found in App Store Connect → Your App → App Information → Apple ID
- `appleTeamId`: Found in App Store Connect → Users and Access → Team ID

## Step 2: Build the iOS App

Build for TestFlight using the preview profile:

```bash
eas build --platform ios --profile preview
```

This will:
- Create a production-ready iOS build
- Upload it to EAS servers
- Provide you with a download link

**Note:** The first build may take 15-30 minutes. Subsequent builds are usually faster.

## Step 3: Submit to TestFlight

### Option A: Automatic Submission (Recommended)

```bash
eas submit --platform ios --profile preview
```

This will:
- Automatically submit the latest build to TestFlight
- Use credentials from `eas.json`
- Handle the upload process

### Option B: Manual Submission

1. Download the `.ipa` file from EAS build dashboard
2. Go to App Store Connect → TestFlight
3. Upload the `.ipa` manually
4. Wait for processing (usually 10-30 minutes)

## Step 4: Configure TestFlight

Once the build is processed:

1. **Add Test Information** (if required):
   - What to test
   - Test notes
   - Screenshots (optional)

2. **Add Internal Testers**:
   - Go to TestFlight → Internal Testing
   - Add testers by email
   - They'll receive an email invitation

3. **Add External Testers** (optional):
   - Go to TestFlight → External Testing
   - Create a group
   - Add testers
   - Submit for Beta App Review (first time only)

## Step 5: Testers Install the App

Testers will:
1. Receive an email invitation
2. Install TestFlight app from App Store
3. Accept the invitation
4. Install your app from TestFlight

## Troubleshooting

### Build Fails
- Check that your Apple Developer account is active
- Verify bundle identifier matches App Store Connect
- Check EAS build logs for specific errors

### Submission Fails
- Verify credentials in `eas.json`
- Check that App Store Connect app exists
- Ensure you have proper permissions on the account

### TestFlight Processing Fails
- Check email for specific errors
- Verify app doesn't violate TestFlight guidelines
- Check that all required information is provided

## Next Steps (When Moving to Final Account)

When you're ready to use the final account:

1. **Update `eas.json`:**
   - Change `submit.preview.ios` credentials to final account
   - Or create a new profile for final account

2. **Transfer App** (if needed):
   - App Store Connect → App Information → Transfer App
   - Follow Apple's transfer process

3. **Update Documentation:**
   - Update this file with final account details
   - Remove temporary account notes

## Current Configuration

- **Profile:** `preview` (for TestFlight)
- **Account Type:** Temporary company account
- **Purpose:** Preview/testing only
- **Bundle ID:** `com.sushiworld.app`
- **App Name:** Sushi World

## Notes

- This is a **temporary account** - remember to update when final account is decided
- All app functionality works the same regardless of account
- TestFlight builds are valid for 90 days
- You can have multiple builds in TestFlight simultaneously


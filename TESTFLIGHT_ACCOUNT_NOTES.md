# TestFlight Account Information

## ⚠️ IMPORTANT: Temporary TestFlight Account

**Current Status:** Using temporary company account for preview/testing purposes

### Account Details
- **Account Type:** Temporary/Preview
- **Purpose:** Preview the app before final account decision
- **Note:** This is NOT the final production account
- **Apple ID:** sandrasanzgonzalez@gmail.com
- **App Store Connect App ID:** 6757152788
- **Apple Team ID:** 6AFC3WG4MY
- **Bundle ID:** com.sushiworld.app
- **SKU:** com.sushiworld.app

### When Moving to Final Account
When you decide on the final account, you'll need to:

1. **Update `eas.json` submit configuration:**
   - Update `appleId` with final account email
   - Update `ascAppId` with final App Store Connect App ID
   - Update `appleTeamId` with final Apple Team ID

2. **Update App Store Connect:**
   - Transfer app to final account (if needed)
   - Update team members and permissions

3. **Update Bundle Identifier (if needed):**
   - If using different bundle ID for final account
   - Update `app.json` → `ios.bundleIdentifier`
   - Update `app.json` → `android.package`

### Current Configuration
- **Bundle ID:** `com.sushiworld.app`
- **App Name:** Sushi World
- **Version:** 1.0.0

### Submission Steps for Temporary Account

1. **Build for TestFlight:**
   ```bash
   eas build --platform ios --profile preview
   ```

2. **Submit to TestFlight:**
   ```bash
   eas submit --platform ios --profile preview
   ```

3. **Or manually:**
   - Download the `.ipa` from EAS build
   - Upload via App Store Connect → TestFlight

### Notes
- This configuration is for preview/testing only
- Final account details will be updated when decided
- All app functionality remains the same regardless of account


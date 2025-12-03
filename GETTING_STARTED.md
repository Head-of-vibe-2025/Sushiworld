# Getting Started - Run Your App in Expo

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies

First, make sure you have Node.js 18+ installed, then:

```bash
npm install
```

### 2. Create Environment File

Create a `.env` file in the root directory:

```bash
# Copy this template and fill in your values
touch .env
```

Add these **minimum required** variables to `.env`:

```bash
# Supabase (Required for app to run)
EXPO_PUBLIC_SUPABASE_URL=your-supabase-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Foxy.io (Required for checkout - can add later)
EXPO_PUBLIC_FOXY_STORE_ID=102892
EXPO_PUBLIC_FOXY_SUBDOMAIN=your-foxy-subdomain
EXPO_PUBLIC_FOXY_API_BASE=https://api.foxycart.com
```

**Note**: The app will run without Foxy credentials, but checkout won't work until you add them.

### 3. Start Expo

```bash
npm start
```

This will:
- Start the Expo development server
- Show a QR code in your terminal
- Open Expo Go app options

## 📱 Viewing Your App

### Option 1: Expo Go App (Easiest - Recommended)

1. **Install Expo Go** on your phone:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Scan the QR code**:
   - **iOS**: Open Camera app → Scan QR code → Opens in Expo Go
   - **Android**: Open Expo Go app → Tap "Scan QR code"

3. The app will load on your phone!

### Option 2: iOS Simulator (Mac only)

```bash
npm run ios
```

This opens the iOS Simulator automatically.

### Option 3: Android Emulator

```bash
npm run android
```

**Note**: You need Android Studio with an emulator set up first.

### Option 4: Web Browser

```bash
npm run web
```

Opens the app in your browser (limited functionality - some native features won't work).

## 🎯 What You'll See

When the app loads, you should see:
- **Menu Screen** - Browse menu items (if Webflow is configured)
- **Cart** - Shopping cart
- **Orders** - Order history (empty until you have orders)
- **Loyalty** - Loyalty points screen
- **Profile** - User profile and settings

## ⚠️ Common Issues

### "Supabase credentials not configured"
- Make sure your `.env` file exists and has `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Restart Expo after adding environment variables: Press `r` in the terminal or stop/start with `Ctrl+C` then `npm start`

### "Network request failed"
- Check your internet connection
- Verify Supabase URL is correct
- Make sure Supabase project is active

### "Module not found" errors
- Run `npm install` again
- Clear cache: `npm start -- --clear`

### QR Code not working
- Make sure your phone and computer are on the same WiFi network
- Try using the tunnel option: Press `s` in Expo terminal → Select "tunnel"
- Or use the web version: `npm run web`

## 📋 Next Steps After App is Running

### Immediate (To see full functionality):

1. **Set up Supabase** (if not done):
   - Create Supabase project at https://supabase.com
   - Get your project URL and anon key
   - Run database migrations from `supabase/migrations/`

2. **Set up Webflow** (for menu items):
   - See [WEBFLOW_SETUP.md](./WEBFLOW_SETUP.md)
   - Or the menu will be empty until configured

### Later (For full Foxy.io integration):

3. **Set up Foxy.io**:
   - Get OAuth credentials from Foxy admin
   - Set Supabase secrets
   - Deploy Edge Functions
   - See [FOXY_SETUP.md](./FOXY_SETUP.md) for details

## 🛠️ Development Tips

### Hot Reload
- Changes to your code automatically reload in the app
- Shake your phone (or press `Cmd+D` on iOS simulator) to open developer menu

### Debugging
- Press `j` in Expo terminal to open debugger
- Use React Native Debugger or Chrome DevTools
- Check console logs in Expo terminal

### Restart App
- Press `r` in Expo terminal to reload
- Press `m` to toggle menu
- Press `Ctrl+C` to stop server

## 📚 More Help

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- See other setup guides:
  - [FOXY_SETUP.md](./FOXY_SETUP.md) - Foxy.io integration
  - [WEBFLOW_SETUP.md](./WEBFLOW_SETUP.md) - Webflow menu setup

---

**Ready to start?** Run `npm install` then `npm start`! 🎉


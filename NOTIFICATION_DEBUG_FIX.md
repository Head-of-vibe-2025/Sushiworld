# Notification System Debug & Fix

## 🔍 Issues Identified

### Problem 1: Local Notifications Instead of Push Notifications
- **Root Cause**: The app was using `scheduleWeeklyNotification()` which schedules **local notifications** on the device
- **Impact**: Local notifications only work when the app is open/foregrounded and are unreliable when the app is closed
- **Symptom**: Users only received notifications when opening the app, and all queued notifications would fire at once

### Problem 2: Bulk Notification Delivery
- **Root Cause**: The code was scheduling 50 notifications at once (10 cycles × 5 messages)
- **Impact**: When the app opened, all queued local notifications would fire simultaneously
- **Symptom**: Users received a "tonne of notifications all at the same time" when opening the app

### Problem 3: Missing Push Notification Flow
- **Root Cause**: Push tokens were being registered, but the app relied on local notifications instead of server-sent push notifications
- **Impact**: Notifications didn't work when the app was closed/backgrounded
- **Solution**: Use the Supabase Edge Function (`weekly-notifications`) to send push notifications via Expo Push API

## ✅ Fixes Applied

### 1. Removed Local Notification Scheduling
- **File**: `src/services/notifications/pushService.ts`
- **Change**: `scheduleWeeklyNotification()` now only cancels existing local notifications and logs a deprecation warning
- **Reason**: Push notifications are sent by the Supabase Edge Function, not scheduled locally

### 2. Updated NotificationInitializer
- **File**: `src/components/NotificationInitializer.tsx`
- **Changes**:
  - Removed call to `scheduleWeeklyNotification()`
  - Added comprehensive logging for debugging
  - Only registers push tokens when user is logged in
  - Checks `push_enabled` flag before registering

### 3. Updated SettingsScreen
- **File**: `src/screens/profile/SettingsScreen.tsx`
- **Changes**:
  - Removed local notification scheduling when toggling push preferences
  - Only updates the database `push_enabled` flag
  - Cancels local notifications when disabling (cleanup)
  - Added better logging

### 4. Enhanced Push Token Registration
- **File**: `src/services/notifications/pushService.ts`
- **Changes**:
  - Improved error handling and logging
  - Better token registration with conflict handling
  - Removed automatic local notification scheduling
  - Added detailed console logs for debugging

## 📱 How Push Notifications Now Work

1. **Token Registration** (when app opens):
   - User opens app → `NotificationInitializer` runs
   - Requests notification permissions
   - Gets Expo push token
   - Saves token to `push_tokens` table in Supabase
   - Token is linked to user's `profile_id`

2. **Notification Sending** (weekly):
   - Supabase Edge Function `weekly-notifications` runs on schedule (weekly, Thursdays at 5 PM UTC)
   - Function queries `push_tokens` table for all enabled users (`push_enabled = true`)
   - Sends push notifications via Expo Push API
   - Notifications are delivered even when app is closed

3. **Notification Reception**:
   - iOS/Android receives notification via Expo Push Notification service
   - Notification appears even if app is closed
   - When user taps notification, app opens and handles the notification

## 🔧 Configuration Required

### 1. Supabase Edge Function Schedule
The `weekly-notifications` function must be scheduled to run weekly. Check:
- **File**: `supabase/migrations/007_setup_weekly_notifications.sql`
- **Current Schedule**: Every Thursday at 5:00 PM UTC
- **Alternative**: Use external cron service (cron-job.org, EasyCron, etc.)

### 2. Environment Variables
Ensure these are set (for push token registration):
- `EXPO_PUBLIC_PROJECT_ID` (optional, defaults to project ID from app.json)
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### 3. Project ID
- **Location**: `app.json` → `extra.eas.projectId`
- **Current Value**: `428433c9-0ae1-4cfa-b10e-eff51351a99b`
- **Usage**: Used when getting Expo push token

## 🧪 Testing

### Test Push Token Registration
1. Open app and check console logs:
   ```
   🔔 Initializing push notifications...
   ✅ Push notification permissions granted
   👤 User logged in, registering push token for user: [userId]
   📱 Getting Expo push token with project ID: [projectId]
   ✅ Expo push token obtained: ExponentPushToken[...]
   ✅ Push token saved to Supabase successfully
   ```

### Test Notification Delivery
1. Manually trigger the Edge Function:
   ```bash
   curl -X POST https://your-project.supabase.co/functions/v1/weekly-notifications \
     -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"
   ```
2. Check that notification is received even when app is closed

### Verify Database
Check `push_tokens` table:
```sql
SELECT pt.*, p.push_enabled, p.email 
FROM push_tokens pt
JOIN profiles p ON pt.profile_id = p.id;
```

## 🐛 Debugging

### Check Logs
- **App Console**: Look for notification-related logs with emoji prefixes (🔔, ✅, ❌, 📱, etc.)
- **Supabase Logs**: Check Edge Function logs for `weekly-notifications` function

### Common Issues

1. **No notifications received**:
   - Check if push token is saved in database
   - Verify `push_enabled` is `true` in profiles table
   - Check if Edge Function is scheduled/running
   - Verify Expo Push API is working (test with Expo Push Notification Tool)

2. **Notifications only when app opens**:
   - This means local notifications are still being used
   - Check that `scheduleWeeklyNotification()` is NOT being called
   - Verify push tokens are registered in database
   - Ensure Edge Function is running

3. **Bulk notifications on app open**:
   - Old local notifications may still be scheduled
   - Run `pushService.cancelWeeklyNotification()` to clean up
   - Check scheduled notifications: `await Notifications.getAllScheduledNotificationsAsync()`

## 📝 Next Steps

1. ✅ Code changes complete
2. ⏳ Test push token registration (open app, check logs)
3. ⏳ Verify push tokens are in database
4. ⏳ Test Edge Function manually
5. ⏳ Verify weekly schedule is configured
6. ⏳ Test end-to-end: receive notification when app is closed

## 🔗 Related Files

- `src/services/notifications/pushService.ts` - Push notification service
- `src/components/NotificationInitializer.tsx` - Initialization component
- `src/screens/profile/SettingsScreen.tsx` - Settings toggle
- `supabase/functions/weekly-notifications/index.ts` - Edge Function that sends notifications
- `supabase/migrations/007_setup_weekly_notifications.sql` - Cron schedule setup


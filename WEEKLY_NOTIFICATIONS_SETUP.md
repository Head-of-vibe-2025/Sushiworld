# Weekly Push Notifications Setup Guide

This guide explains how to set up weekly push notifications for the Sushi World app.

## Overview

The app supports two types of weekly push notifications:

1. **Local Notifications** - Scheduled on the device, work offline
2. **Server-side Push Notifications** - Sent via Expo Push API from Supabase Edge Function

## Local Notifications (Automatic)

Local notifications are automatically scheduled when:
- User grants push notification permissions
- User has push notifications enabled in settings

**Notification Messages (5 rotating messages):**
1. "🍣 Time for Sushi!" - "Treat yourself today! Order some delicious sushi and enjoy a special meal."
2. "✨ Fresh Sushi Awaits!" - "Discover new flavors today! Browse our menu and find your perfect sushi combination."
3. "🎌 Weekly Sushi Treat" - "You deserve something special! Why not order some fresh sushi today?"
4. "🍱 Sushi Time!" - "Fresh ingredients, amazing flavors. Order now and make your day delicious!"
5. "🍣 Ready for Sushi?" - "It's been a week! Time to indulge in your favorite sushi rolls. Order now!"

**Schedule:**
- 5 different notifications are scheduled, each with a different message
- Each notification fires once per 5-week cycle, offset by 7 days
- This ensures users see a different message each week, rotating through all 5
- **Time:** 5:00 PM (local time)
- First notification: 7 days after scheduling
- Messages automatically rotate to keep notifications fresh

## Server-side Push Notifications (Optional)

For centralized control and better tracking, you can set up server-side push notifications.

### Step 1: Deploy the Edge Function

```bash
cd supabase
supabase functions deploy weekly-notifications
```

### Step 2: Set Up Cron Job

You have two options:

#### Option A: Using Supabase pg_cron (Recommended if available)

1. Run the migration:
```bash
supabase migration up
```

2. Configure Supabase settings:
   - Go to Database > Settings > Custom Config
   - Add:
     ```
     app.settings.supabase_url = 'https://your-project.supabase.co'
     app.settings.supabase_service_role_key = 'your-service-role-key'
     ```

#### Option B: Using External Cron Service (Recommended)

Use a service like [cron-job.org](https://cron-job.org) or [EasyCron](https://www.easycron.com):

1. Create a new cron job
2. Set schedule: Every Thursday at 5:00 PM (or your preferred time)
3. URL: `https://your-project.supabase.co/functions/v1/weekly-notifications`
4. Method: POST
5. Headers:
   - `Authorization: Bearer your-service-role-key`
   - `Content-Type: application/json`
6. Body: `{}`

### Step 3: Test the Function

Test manually:
```bash
curl -X POST https://your-project.supabase.co/functions/v1/weekly-notifications \
  -H "Authorization: Bearer your-service-role-key" \
  -H "Content-Type: application/json" \
  -d '{}'
```

## User Controls

Users can toggle weekly notifications in:
- **Settings Screen** > **Notifications** > **Push Notifications**

When disabled:
- Local weekly notifications are cancelled
- Server-side notifications are filtered out (users with `push_enabled = false`)

## Notification Behavior

- **Local notifications**: Work even when app is closed, no internet required
- **Server-side notifications**: Require internet, can be tracked and managed centrally
- **Both**: Can work together for redundancy

## Troubleshooting

### Notifications not appearing

1. Check if permissions are granted:
   - iOS: Settings > Sushi World > Notifications
   - Android: Settings > Apps > Sushi World > Notifications

2. Check if push is enabled in user profile:
   ```sql
   SELECT push_enabled FROM profiles WHERE id = 'user-id';
   ```

3. Verify scheduled notifications:
   - Check logs in `NotificationInitializer` component
   - Use `pushService.getScheduledNotifications()` to see scheduled notifications

### Server-side notifications not sending

1. Verify Edge Function is deployed
2. Check Supabase logs for errors
3. Verify push tokens exist:
   ```sql
   SELECT COUNT(*) FROM push_tokens;
   ```
4. Test the Edge Function manually (see Step 3 above)

## Customization

### Change Notification Messages

Edit `src/services/notifications/pushService.ts`:
```typescript
const NOTIFICATION_MESSAGES = [
  {
    title: '🍣 Time for Sushi!',
    body: 'Your custom message 1',
  },
  {
    title: '🍱 Sushi Cravings?',
    body: 'Your custom message 2',
  },
  // ... add up to 5 messages
];
```

And `supabase/functions/weekly-notifications/index.ts`:
```typescript
const NOTIFICATION_MESSAGES = [
  {
    title: '🍣 Time for Sushi!',
    body: 'Your custom message 1',
  },
  // ... same messages as above
];
```

**Note:** Keep the same messages in both files and maintain 5 messages for proper rotation.

### Change Schedule

Edit `src/services/notifications/pushService.ts`:
```typescript
trigger: {
  seconds: 7 * 24 * 60 * 60, // Change 7 to your desired days
  repeats: true,
}
```

For server-side, update the cron schedule in your cron service or migration.


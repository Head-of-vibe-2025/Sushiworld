// Expo Push Notifications Service

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from '../supabase/supabaseClient';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Weekly notification identifiers (5 different messages that rotate)
const WEEKLY_NOTIFICATION_IDS = [
  'weekly-sushi-reminder-1',
  'weekly-sushi-reminder-2',
  'weekly-sushi-reminder-3',
  'weekly-sushi-reminder-4',
  'weekly-sushi-reminder-5',
];

// 5 different notification messages that rotate each week
const NOTIFICATION_MESSAGES = [
  {
    title: '🍣 Time for Sushi!',
    body: 'Treat yourself today! Order some delicious sushi and enjoy a special meal.',
  },
  {
    title: '✨ Fresh Sushi Awaits!',
    body: 'Discover new flavors today! Browse our menu and find your perfect sushi combination.',
  },
  {
    title: '🎌 Weekly Sushi Treat',
    body: 'You deserve something special! Why not order some fresh sushi today?',
  },
  {
    title: '🍱 Sushi Time!',
    body: 'Fresh ingredients, amazing flavors. Order now and make your day delicious!',
  },
  {
    title: '🍣 Ready for Sushi?',
    body: 'It\'s been a week! Time to indulge in your favorite sushi rolls. Order now!',
  },
];

/**
 * Get the week number of the year (1-53)
 */
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export const pushService = {
  async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  },

  async registerForPushNotifications(userId?: string): Promise<string | null> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      console.warn('Push notification permissions not granted');
      return null;
    }

    try {
      // Project ID from app.json: extra.eas.projectId = "428433c9-0ae1-4cfa-b10e-eff51351a99b"
      // Can also be set via EXPO_PUBLIC_PROJECT_ID environment variable
      const projectId = process.env.EXPO_PUBLIC_PROJECT_ID || '428433c9-0ae1-4cfa-b10e-eff51351a99b';
      
      console.log('📱 Getting Expo push token with project ID:', projectId);
      
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      const token = tokenData.data;
      console.log('✅ Expo push token obtained:', token.substring(0, 20) + '...');

      // Save token to Supabase if user is logged in
      if (userId) {
        const { error: tokenError } = await supabase.from('push_tokens').upsert({
          profile_id: userId,
          token,
          platform: Platform.OS === 'ios' ? 'ios' : 'android',
        }, {
          onConflict: 'token'
        });

        if (tokenError) {
          console.error('❌ Error saving push token to Supabase:', tokenError);
        } else {
          console.log('✅ Push token saved to Supabase successfully');
        }
      } else {
        console.warn('⚠️ No userId provided, push token not saved to database');
      }

      // NOTE: We do NOT schedule local notifications here
      // Push notifications are sent by the Supabase Edge Function (weekly-notifications)
      // which runs on a schedule and sends notifications via Expo Push API
      // Local notifications are unreliable when the app is closed

      return token;
    } catch (error) {
      console.error('❌ Error registering for push notifications:', error);
      return null;
    }
  },

  async unregisterPushToken(token: string) {
    await supabase.from('push_tokens').delete().eq('token', token);
  },

  /**
   * Schedule weekly notifications with rotating messages
   * 
   * ⚠️ DEPRECATED: This function schedules LOCAL notifications which are unreliable
   * when the app is closed. Use push notifications instead via the Supabase Edge Function.
   * 
   * This function is kept for backward compatibility but should not be called.
   * Push notifications are sent by the weekly-notifications Supabase Edge Function
   * which runs on a schedule and sends notifications via Expo Push API.
   */
  async scheduleWeeklyNotification(): Promise<void> {
    console.warn('⚠️ scheduleWeeklyNotification() is deprecated and should not be used');
    console.warn('📝 Push notifications are sent by the Supabase Edge Function (weekly-notifications)');
    console.warn('📝 Make sure the weekly-notifications function is scheduled to run weekly');
    
    // Cancel any existing local notifications to prevent bulk delivery
    try {
      const allScheduled = await Notifications.getAllScheduledNotificationsAsync();
      const weeklyNotifications = allScheduled.filter(notif => 
        WEEKLY_NOTIFICATION_IDS.some(id => notif.identifier.startsWith(id))
      );
      
      for (const notif of weeklyNotifications) {
        await Notifications.cancelScheduledNotificationAsync(notif.identifier);
      }
      
      if (weeklyNotifications.length > 0) {
        console.log(`🧹 Cancelled ${weeklyNotifications.length} old local notifications`);
      }
    } catch (error) {
      console.error('Error cancelling old notifications:', error);
    }
    
    // Do not schedule new local notifications
    // Push notifications are handled by the Supabase Edge Function
  },

  /**
   * Cancel all weekly notifications (local notifications only)
   * 
   * This cancels any existing LOCAL notifications that may have been scheduled.
   * Push notifications are controlled by the Supabase Edge Function and the push_enabled flag.
   */
  async cancelWeeklyNotification(): Promise<void> {
    try {
      console.log('🧹 Cancelling any existing local notifications...');
      
      // Cancel all scheduled notifications and find weekly ones
      const allScheduled = await Notifications.getAllScheduledNotificationsAsync();
      const weeklyNotifications = allScheduled.filter(notif => 
        WEEKLY_NOTIFICATION_IDS.some(id => notif.identifier.startsWith(id))
      );
      
      for (const notif of weeklyNotifications) {
        await Notifications.cancelScheduledNotificationAsync(notif.identifier);
      }
      
      if (weeklyNotifications.length > 0) {
        console.log(`✅ Cancelled ${weeklyNotifications.length} local notifications`);
      } else {
        console.log('ℹ️ No local notifications to cancel');
      }
      
      console.log('📝 Push notifications are controlled by the Supabase Edge Function');
    } catch (error) {
      console.error('❌ Error cancelling weekly notifications:', error);
    }
  },

  /**
   * Get all scheduled notifications
   */
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return await Notifications.getAllScheduledNotificationsAsync();
  },
};


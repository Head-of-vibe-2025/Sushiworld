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
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
      });

      const token = tokenData.data;

      // Save token to Supabase if user is logged in
      if (userId) {
        await supabase.from('push_tokens').upsert({
          profile_id: userId,
          token,
          platform: Platform.OS === 'ios' ? 'ios' : 'android',
        });
      }

      // Schedule weekly notification after successful registration
      await this.scheduleWeeklyNotification();

      return token;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  },

  async unregisterPushToken(token: string) {
    await supabase.from('push_tokens').delete().eq('token', token);
  },

  /**
   * Schedule weekly notifications with rotating messages
   * Schedules 5 different notifications that rotate each week
   * Each notification repeats every 35 days (5 weeks), offset by 7 days from each other
   */
  async scheduleWeeklyNotification(): Promise<void> {
    try {
      // Cancel any existing weekly notifications first
      for (const id of WEEKLY_NOTIFICATION_IDS) {
        await Notifications.cancelScheduledNotificationAsync(id);
      }

      const now = new Date();
      const baseTime = new Date(now);
      baseTime.setHours(17, 0, 0, 0); // 5:00 PM

      // Schedule 5 notifications using a rotating pattern
      // Strategy: Each notification fires every 35 days (5 weeks), but they're offset by 7 days
      // This creates a weekly rotation: Week 1 = msg 0, Week 2 = msg 1, etc.
      // We'll schedule enough instances to cover ~1 year (52 weeks = ~10 cycles)
      const cyclesToSchedule = 10; // 10 cycles of 5 weeks = 50 weeks
      
      for (let i = 0; i < 5; i++) {
        const message = NOTIFICATION_MESSAGES[i];
        
        // Calculate when this notification should first fire
        // Notification 0: fires in 7 days, then every 35 days
        // Notification 1: fires in 14 days, then every 35 days
        // etc.
        const firstFireDays = 7 + (i * 7);
        const firstFireSeconds = firstFireDays * 24 * 60 * 60;
        const repeatIntervalSeconds = 35 * 24 * 60 * 60; // 35 days = 5 weeks
        
        // Schedule all instances for this notification (one per cycle)
        for (let cycle = 0; cycle < cyclesToSchedule; cycle++) {
          const fireDate = new Date(now.getTime() + (firstFireSeconds + (cycle * repeatIntervalSeconds)) * 1000);
          
          await Notifications.scheduleNotificationAsync({
            identifier: `${WEEKLY_NOTIFICATION_IDS[i]}-${cycle}`,
            content: {
              title: message.title,
              body: message.body,
              sound: true,
              priority: Notifications.AndroidNotificationPriority.HIGH,
              data: {
                type: 'weekly_reminder',
                action: 'open_menu',
                messageIndex: i,
              },
            },
            trigger: {
              date: fireDate,
            },
          });
        }

        const firstFireDate = new Date(now.getTime() + firstFireSeconds * 1000);
        console.log(`Scheduled notification ${i + 1}/5: "${message.title}" - ${cyclesToSchedule} instances, first in ${firstFireDays} days (${firstFireDate.toISOString()}), then every 35 days`);
      }

      console.log('All 5 weekly notifications scheduled. Messages will rotate each week.');
    } catch (error) {
      console.error('Error scheduling weekly notifications:', error);
    }
  },

  /**
   * Cancel all weekly notifications
   */
  async cancelWeeklyNotification(): Promise<void> {
    try {
      // Cancel all scheduled notifications and find weekly ones
      const allScheduled = await Notifications.getAllScheduledNotificationsAsync();
      const weeklyNotifications = allScheduled.filter(notif => 
        WEEKLY_NOTIFICATION_IDS.some(id => notif.identifier.startsWith(id))
      );
      
      for (const notif of weeklyNotifications) {
        await Notifications.cancelScheduledNotificationAsync(notif.identifier);
      }
      
      console.log(`Cancelled ${weeklyNotifications.length} weekly notifications`);
    } catch (error) {
      console.error('Error cancelling weekly notifications:', error);
    }
  },

  /**
   * Get all scheduled notifications
   */
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return await Notifications.getAllScheduledNotificationsAsync();
  },
};


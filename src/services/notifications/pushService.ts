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

      return token;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  },

  async unregisterPushToken(token: string) {
    await supabase.from('push_tokens').delete().eq('token', token);
  },
};


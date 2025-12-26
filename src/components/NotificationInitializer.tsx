// Notification Initializer Component
// Handles initialization of push notifications and weekly scheduling

import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { pushService } from '../services/notifications/pushService';
import { useNotificationHandler } from '../services/notifications/notificationHandler';
import { supabase } from '../services/supabase/supabaseClient';

export const NotificationInitializer: React.FC = () => {
  const { user } = useAuth();
  
  // Set up notification handlers
  useNotificationHandler();

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        // Request permissions and register for push notifications
        const hasPermission = await pushService.requestPermissions();
        
        if (!hasPermission) {
          console.log('Push notification permissions not granted');
          return;
        }

        // Register for push notifications if user is logged in
        if (user) {
          const token = await pushService.registerForPushNotifications(user.id);
          
          if (token) {
            console.log('Push notifications registered successfully');
            
            // Check if user has push notifications enabled in their profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('push_enabled')
              .eq('id', user.id)
              .single();

            // Schedule weekly notification if push is enabled (default is true)
            if (profile?.push_enabled !== false) {
              await pushService.scheduleWeeklyNotification();
            }
          }
        } else {
          // Even if not logged in, we can still schedule local notifications
          await pushService.scheduleWeeklyNotification();
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    };

    initializeNotifications();
  }, [user]);

  return null; // This component doesn't render anything
};


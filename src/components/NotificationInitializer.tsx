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
        console.log('🔔 Initializing push notifications...');
        
        // Request permissions and register for push notifications
        const hasPermission = await pushService.requestPermissions();
        
        if (!hasPermission) {
          console.warn('⚠️ Push notification permissions not granted');
          return;
        }

        console.log('✅ Push notification permissions granted');

        // Register for push notifications if user is logged in
        if (user) {
          console.log('👤 User logged in, registering push token for user:', user.id);
          
          // Check if user has push notifications enabled in their profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('push_enabled')
            .eq('id', user.id)
            .single();

          if (profileError) {
            console.error('❌ Error fetching user profile:', profileError);
          }

          // Only register if push is enabled (default is true)
          if (profile?.push_enabled !== false) {
            const token = await pushService.registerForPushNotifications(user.id);
            
            if (token) {
              console.log('✅ Push notifications registered successfully');
              console.log('📱 Notifications will be sent via Supabase Edge Function (weekly-notifications)');
              console.log('📝 Make sure the weekly-notifications function is scheduled to run weekly');
            } else {
              console.warn('⚠️ Failed to obtain push token');
            }
          } else {
            console.log('ℹ️ Push notifications disabled for this user');
          }
        } else {
          console.log('ℹ️ User not logged in, skipping push token registration');
          console.log('📝 Push tokens require a user account to be saved');
        }
      } catch (error) {
        console.error('❌ Error initializing notifications:', error);
      }
    };

    initializeNotifications();
  }, [user]);

  return null; // This component doesn't render anything
};


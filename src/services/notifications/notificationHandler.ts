// Notification Handler

import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';

export const useNotificationHandler = () => {
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    // Handle notifications received while app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
        // Notification will be displayed automatically based on handler configuration
      }
    );

    // Handle user tapping on notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification tapped:', response);
        const data = response.notification.request.content.data;
        
        // Handle navigation based on notification type
        if (data?.type === 'weekly_reminder' && data?.action === 'open_menu') {
          // Navigation will be handled by the app's deep linking or navigation system
          // For now, we log the action - you can implement navigation using a navigation ref
          console.log('User wants to open menu from notification');
          
          // TODO: Implement navigation to Menu screen
          // This could be done using a navigation ref or deep linking
          // Example: navigationRef.current?.navigate('Menu');
        }
      }
    );

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);
};


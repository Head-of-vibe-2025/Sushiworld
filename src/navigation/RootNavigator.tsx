// Root Navigator

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Linking, Animated } from 'react-native';
import * as LinkingExpo from 'expo-linking';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AuthStack from './AuthStack';
import AppTabs from './AppTabs';
import type { NavigationParamList } from '../types/app.types';
import { LOGO_URL } from '../utils/constants';
import { getColors } from '../theme/designTokens';
import { supabase } from '../services/supabase/supabaseClient';

const Stack = createNativeStackNavigator<NavigationParamList>();

function LoadingScreen() {
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Create pulsing animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => {
      pulse.stop();
    };
  }, [pulseAnim]);

  return (
    <View style={[styles.loadingContainer, { backgroundColor: colors.background.primary }]}>
      <Animated.View style={[styles.logoContainer, { transform: [{ scale: pulseAnim }] }]}>
        <Image
          source={{ uri: LOGO_URL }}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

export default function RootNavigator() {
  const { user, loading } = useAuth();
  const navigationRef = React.useRef<any>(null);

  // Configure deep linking
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
  const linking = {
    prefixes: [
      'sushiworld://',
      LinkingExpo.createURL('/'),
      // Add Supabase callback URL for password reset
      ...(supabaseUrl ? [`${supabaseUrl}/auth/v1/callback`] : []),
    ],
    config: {
      screens: {
        Auth: {
          screens: {
            ResetPassword: 'reset-password',
            ForgotPassword: 'forgot-password',
            Login: 'login',
            Signup: 'signup',
          },
        },
      },
    },
    async getInitialURL() {
      // Check if app was opened from a deep link
      const url = await LinkingExpo.getInitialURL();
      if (url != null) {
        return url;
      }

      // Check if app was opened from a notification
      const response = await Linking.getInitialURL();
      return response;
    },
    subscribe(listener: (url: string) => void) {
      // Listen to incoming links from deep linking
      const onReceiveURL = ({ url }: { url: string }) => {
        listener(url);
      };

      // Listen to URL events
      const subscription = Linking.addEventListener('url', onReceiveURL);

      return () => {
        subscription.remove();
      };
    },
  };

  useEffect(() => {
    // Handle deep links for password reset
    const handleDeepLink = async (event: { url: string }) => {
      const url = event.url;
      console.log('Deep link received:', url);
      
      // Check if it's a password reset link (app scheme or web URL)
      const isResetPassword = url.includes('reset-password') || 
                              url.includes('type=recovery') || 
                              url.includes('#access_token=') ||
                              url.includes('/auth/v1/callback');
      
      if (isResetPassword) {
        try {
          // Handle Supabase callback URLs (web URLs that open in app via Universal Links/App Links)
          // Format: https://[project].supabase.co/auth/v1/callback?redirect_to=sushiworld://reset-password#access_token=...
          if (url.startsWith('http://') || url.startsWith('https://')) {
            const urlObj = new URL(url);
            const hash = urlObj.hash.substring(1); // Remove # symbol
            
            // Extract hash fragments (access_token, refresh_token, type)
            if (hash) {
              const hashParams = new URLSearchParams(hash);
              const accessToken = hashParams.get('access_token');
              const refreshToken = hashParams.get('refresh_token');
              const type = hashParams.get('type');
              
              if (accessToken && type === 'recovery') {
                // Set the session using the tokens from URL
                const { data, error } = await supabase.auth.setSession({
                  access_token: accessToken,
                  refresh_token: refreshToken || '',
                });
                
                if (data.session && !error) {
                  console.log('Recovery session set successfully from web URL');
                  // Navigate to reset password screen
                  setTimeout(() => {
                    navigationRef.current?.navigate('Auth', { screen: 'ResetPassword' });
                  }, 500);
                  return;
                } else {
                  console.error('Error setting recovery session:', error);
                }
              }
            }
          }
          
          // Handle app scheme URLs (sushiworld://reset-password#access_token=...)
          const hashMatch = url.match(/#(.+)/);
          if (hashMatch) {
            const hashParams = new URLSearchParams(hashMatch[1]);
            const accessToken = hashParams.get('access_token');
            const refreshToken = hashParams.get('refresh_token');
            const type = hashParams.get('type');
            
            if (accessToken && type === 'recovery') {
              // Set the session using the tokens from URL
              const { data, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || '',
              });
              
              if (data.session && !error) {
                console.log('Recovery session set successfully from app scheme');
                // Navigate to reset password screen
                setTimeout(() => {
                  navigationRef.current?.navigate('Auth', { screen: 'ResetPassword' });
                }, 500);
              } else {
                console.error('Error setting recovery session:', error);
              }
            }
          } else if (url.includes('reset-password')) {
            // If no hash but URL contains reset-password, still navigate
            // (session might be set via other means)
            setTimeout(() => {
              navigationRef.current?.navigate('Auth', { screen: 'ResetPassword' });
            }, 500);
          }
        } catch (error) {
          console.error('Error handling deep link:', error);
        }
      }
    };

    // Check if app was opened via deep link on mount
    LinkingExpo.getInitialURL().then((url) => {
      if (url && (url.includes('reset-password') || url.includes('type=recovery') || url.includes('#access_token=') || url.includes('/auth/v1/callback'))) {
        handleDeepLink({ url });
      }
    });

    // Listen for deep links while app is running using React Native Linking
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, []);

  // Auto-navigate when auth state changes
  useEffect(() => {
    if (!loading && navigationRef.current && user) {
      // User is authenticated, reset navigation to Root to clear any Auth stack
      // Use a small delay to ensure auth state is fully propagated
      const timer = setTimeout(() => {
        navigationRef.current?.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Root' }],
          })
        );
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [user, loading]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Allow guests to browse - show AppTabs by default */}
        <Stack.Screen name="Root" component={AppTabs} />
        {/* Auth stack for login/signup */}
        <Stack.Screen name="Auth" component={AuthStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
  },
});


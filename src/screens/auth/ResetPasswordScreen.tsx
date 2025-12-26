// Reset Password Screen

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { authService } from '../../services/supabase/authService';
import { supabase } from '../../services/supabase/supabaseClient';
import { Button } from '../../components/design-system';
import { getColors, getBorders } from '../../theme/designTokens';
// Using the same logo URL as MenuScreen
const SUSHIWORLD_LOGO_URL = 'https://lymingynfnunsrriiama.supabase.co/storage/v1/object/public/assets/logo.png';
import type { NavigationParamList } from '../../types/app.types';

type ResetPasswordScreenNavigationProp = NativeStackNavigationProp<NavigationParamList, 'ResetPassword'>;
type ResetPasswordScreenRouteProp = RouteProp<NavigationParamList, 'ResetPassword'>;

export default function ResetPasswordScreen() {
  const navigation = useNavigation<ResetPasswordScreenNavigationProp>();
  const route = useRoute<ResetPasswordScreenRouteProp>();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const borders = getBorders(isDark);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);

  useEffect(() => {
    // Check if user has a valid recovery session from password reset link
    const checkSession = async () => {
      try {
        // First, try to get the initial URL to extract token if app was opened from deep link
        const { Linking } = await import('react-native');
        const initialUrl = await Linking.getInitialURL();
        
        if (initialUrl && (initialUrl.includes('#access_token=') || initialUrl.includes('type=recovery'))) {
          // Extract hash fragments from URL
          const hashMatch = initialUrl.match(/#(.+)/);
          if (hashMatch) {
            const hashParams = new URLSearchParams(hashMatch[1]);
            const accessToken = hashParams.get('access_token');
            const refreshToken = hashParams.get('refresh_token');
            const type = hashParams.get('type');
            
            if (accessToken && type === 'recovery') {
              // Set the session manually using the tokens from URL
              const { data, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || '',
              });
              
              if (data.session && !error) {
                setIsValidSession(true);
                return;
              }
            }
          }
        }
        
        // If no URL token, check if session already exists
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Check if this is a recovery session by checking the user metadata
          // Recovery sessions typically have specific metadata
          setIsValidSession(true);
        } else {
          // Wait a moment and check again (in case Supabase is still processing)
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const { data: { session: retrySession } } = await supabase.auth.getSession();
          
          if (retrySession) {
            setIsValidSession(true);
          } else {
            console.warn('No recovery session found. User may need to request a new reset link.');
            // Don't block the UI - let them try, they'll get an error if invalid
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };

    checkSession();
  }, [navigation]);

  const handleResetPassword = async () => {
    if (!isValidSession) {
      Alert.alert('Error', 'Invalid or expired reset link. Please request a new password reset.');
      return;
    }

    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please enter and confirm your new password');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await authService.updatePassword(password);
      Alert.alert(
        'Success',
        'Your password has been reset successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Sign out to clear the recovery session and force re-login
              supabase.auth.signOut().then(() => {
                navigation.navigate('Login');
              });
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 10 }]}
        onPress={handleBack}
        activeOpacity={0.7}
      >
        <Text style={[styles.backIcon, { color: colors.text.primary }]}>←</Text>
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: SUSHIWORLD_LOGO_URL }}
            style={styles.logo}
            resizeMode="contain"
            onError={(error) => {
              console.log('Logo error:', error);
            }}
            onLoad={() => {
              console.log('Logo loaded');
            }}
          />
        </View>
        <Text style={[styles.title, { color: colors.text.primary }]}>Set New Password</Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          Enter your new password below.
        </Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.background.card, borderColor: borders.input.borderColor, color: colors.text.primary }]}
          placeholder="New Password"
          placeholderTextColor={colors.text.tertiary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoFocus
        />
        <TextInput
          style={[styles.input, { backgroundColor: colors.background.card, borderColor: borders.input.borderColor, color: colors.text.primary }]}
          placeholder="Confirm New Password"
          placeholderTextColor={colors.text.tertiary}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <Button
          title={loading ? 'Resetting...' : 'Reset Password'}
          onPress={handleResetPassword}
          variant="primary"
          loading={loading}
          disabled={loading}
          fullWidth
          style={styles.button}
        />
        <TouchableOpacity
          onPress={handleBack}
          style={styles.linkButton}
        >
          <Text style={[styles.linkText, { color: colors.accent.pink }]}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  backIcon: {
    fontSize: 28,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    marginTop: 10,
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
  },
});


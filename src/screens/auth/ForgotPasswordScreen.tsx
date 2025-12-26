// Forgot Password Screen

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { authService } from '../../services/supabase/authService';
import { Button } from '../../components/design-system';
import { getColors, getBorders } from '../../theme/designTokens';
// Using the same logo URL as MenuScreen
const SUSHIWORLD_LOGO_URL = 'https://lymingynfnunsrriiama.supabase.co/storage/v1/object/public/assets/logo.png';
import type { NavigationParamList } from '../../types/app.types';

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<NavigationParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const borders = getBorders(isDark);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPasswordForEmail(email);
      Alert.alert(
        'Check Your Email',
        'If an account exists with this email address, you will receive a password reset link. Please check your inbox and spam folder.\n\nNote: For security, we don\'t reveal whether an account exists.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error: any) {
      console.error('Password reset error in ForgotPasswordScreen:', error);
      const errorMessage = error?.message || error?.toString() || 'Failed to send reset email';
      Alert.alert('Error', errorMessage);
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
        <Text style={[styles.title, { color: colors.text.primary }]}>Reset Password</Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          Enter your email address and we'll send you a link to reset your password.
        </Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.background.card, borderColor: borders.input.borderColor, color: colors.text.primary }]}
          placeholder="Email"
          placeholderTextColor={colors.text.tertiary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoFocus
        />
        <Button
          title={loading ? 'Sending...' : 'Send Reset Link'}
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


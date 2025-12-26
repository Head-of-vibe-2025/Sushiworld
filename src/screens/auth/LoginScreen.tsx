// Login Screen

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

type LoginScreenNavigationProp = NativeStackNavigationProp<NavigationParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const borders = getBorders(isDark);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      await authService.signIn({ email, password });
      // Navigation handled by RootNavigator based on auth state
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    const parent = navigation.getParent();
    if (parent) {
      parent.goBack();
    } else {
      (navigation as any).navigate('Root');
    }
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
        <Text style={[styles.title, { color: colors.text.primary }]}>Welcome Back</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.background.card, borderColor: borders.input.borderColor, color: colors.text.primary }]}
          placeholder="Email"
          placeholderTextColor={colors.text.tertiary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={[styles.input, { backgroundColor: colors.background.card, borderColor: borders.input.borderColor, color: colors.text.primary }]}
          placeholder="Password"
          placeholderTextColor={colors.text.tertiary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          style={styles.forgotPasswordButton}
        >
          <Text style={[styles.forgotPasswordText, { color: colors.accent.pink }]}>Forgot Password?</Text>
        </TouchableOpacity>
        <Button
          title={loading ? 'Signing in...' : 'Sign In'}
          onPress={handleLogin}
          variant="primary"
          loading={loading}
          disabled={loading}
          fullWidth
          style={styles.button}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('Signup')}
          style={styles.linkButton}
        >
          <Text style={[styles.linkText, { color: colors.accent.pink }]}>Don't have an account? Sign up</Text>
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
    marginBottom: 30,
    textAlign: 'center',
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
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
  },
});


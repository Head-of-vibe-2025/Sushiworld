// Signup Screen

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { authService } from '../../services/supabase/authService';
import { useRegion } from '../../context/RegionContext';
import { Button } from '../../components/design-system';
// Using the same logo URL as MenuScreen
const SUSHIWORLD_LOGO_URL = 'https://lymingynfnunsrriiama.supabase.co/storage/v1/object/public/assets/logo.png';
import type { NavigationParamList } from '../../types/app.types';

type SignupScreenNavigationProp = NativeStackNavigationProp<NavigationParamList, 'Signup'>;

export default function SignupScreen() {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const { region } = useRegion();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
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
      await authService.signUp({ email, password, preferredRegion: region });
      // Navigation handled by RootNavigator based on auth state
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message || 'Could not create account');
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
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 10 }]}
        onPress={handleBack}
        activeOpacity={0.7}
      >
        <Text style={styles.backIcon}>←</Text>
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
        <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button
        title={loading ? 'Creating account...' : 'Sign Up'}
        onPress={handleSignup}
        variant="primary"
        loading={loading}
        disabled={loading}
        fullWidth
        style={styles.button}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={styles.linkButton}
      >
        <Text style={styles.linkText}>Already have an account? Sign in</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  backIcon: {
    fontSize: 28,
    color: '#000',
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
    borderColor: '#ddd',
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
    color: '#EA3886',
    fontSize: 14,
  },
});


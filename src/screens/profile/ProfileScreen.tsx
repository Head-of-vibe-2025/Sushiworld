// Profile Screen

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { useRegion } from '../../context/RegionContext';
import { Button } from '../../components/design-system';
// Using the same logo URL as MenuScreen
const SUSHIWORLD_LOGO_URL = 'https://lymingynfnunsrriiama.supabase.co/storage/v1/object/public/assets/logo.png';
import type { NavigationParamList } from '../../types/app.types';

type ProfileScreenNavigationProp = NativeStackNavigationProp<NavigationParamList, 'Profile'>;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, signOut } = useAuth();
  const { region, setRegion } = useRegion();

  const handleSignOut = async () => {
    await signOut();
  };

  // If user is not authenticated, show sign-in prompt
  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: SUSHIWORLD_LOGO_URL }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Create an Account</Text>
          <Text style={styles.subtitle}>
            Sign in or create an account to manage your profile and preferences
          </Text>
          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <Button
                title="Create Account"
                onPress={() => {
                  (navigation as any).navigate('Auth', { screen: 'Signup' });
                }}
                variant="primary"
                fullWidth
                size="medium"
              />
            </View>
            <View>
              <Button
                title="Sign In"
                onPress={() => {
                  (navigation as any).navigate('Auth', { screen: 'Login' });
                }}
                variant="secondary"
                fullWidth
                size="medium"
              />
            </View>
          </View>
        </View>
      </View>
    );
  }

  // Authenticated user view
  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <Text style={styles.email}>{user?.email || 'Guest'}</Text>
        <Text style={styles.region}>
          Region: {region === 'BE' ? 'Belgium' : 'Luxembourg'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('Preferences')}
      >
        <Text style={styles.menuItemText}>Preferences</Text>
        <Text style={styles.menuItemArrow}>→</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('Settings')}
      >
        <Text style={styles.menuItemText}>Settings</Text>
        <Text style={styles.menuItemArrow}>→</Text>
      </TouchableOpacity>

      <Button
        title="Sign Out"
        onPress={handleSignOut}
        variant="secondary"
        fullWidth
        style={styles.signOutButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F6F6F6',
  },
  profileCard: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  email: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  region: {
    fontSize: 16,
    color: '#666',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    fontSize: 18,
  },
  menuItemArrow: {
    fontSize: 18,
    color: '#999',
  },
  signOutButton: {
    marginTop: 30,
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
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: '100%',
  },
  buttonWrapper: {
    width: '100%',
    marginBottom: 16,
  },
});


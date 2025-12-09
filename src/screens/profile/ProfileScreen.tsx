// Profile Screen

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { useRegion } from '../../context/RegionContext';
import { Button } from '../../components/design-system';
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
        <View style={styles.guestCard}>
          <Text style={styles.guestTitle}>Welcome, Guest!</Text>
          <Text style={styles.guestText}>
            Create an account to:
          </Text>
          <View style={styles.benefitsList}>
            <Text style={styles.benefitItem}>• View your order history</Text>
            <Text style={styles.benefitItem}>• Earn and redeem loyalty points</Text>
            <Text style={styles.benefitItem}>• Claim pending points from previous orders</Text>
            <Text style={styles.benefitItem}>• Save your preferences</Text>
          </View>
          <Button
            title="Create Account"
            onPress={() => {
              (navigation as any).navigate('Auth', { screen: 'Signup' });
            }}
            variant="primary"
            fullWidth
            size="large"
            style={styles.authButton}
          />
          <Button
            title="Sign In"
            onPress={() => {
              (navigation as any).navigate('Auth', { screen: 'Login' });
            }}
            variant="secondary"
            fullWidth
            size="large"
            style={styles.authButton}
          />
          <TouchableOpacity
            onPress={() => {
              (navigation as any).navigate('Menu');
            }}
            style={styles.continueButton}
          >
            <Text style={styles.continueText}>Continue browsing</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.regionCard}>
          <Text style={styles.regionLabel}>Region</Text>
          <Text style={styles.regionValue}>
            {region === 'BE' ? 'Belgium' : 'Luxembourg'}
          </Text>
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
  guestCard: {
    backgroundColor: '#f8f8f8',
    padding: 30,
    borderRadius: 16,
    marginBottom: 30,
  },
  guestTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  guestText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  benefitsList: {
    marginBottom: 30,
    paddingLeft: 10,
  },
  benefitItem: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    lineHeight: 24,
  },
  authButton: {
    marginBottom: 12,
  },
  regionCard: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  regionLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  regionValue: {
    fontSize: 16,
    color: '#666',
  },
  continueButton: {
    marginTop: 10,
    padding: 10,
  },
  continueText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});


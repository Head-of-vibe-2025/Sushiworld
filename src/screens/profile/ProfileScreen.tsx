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

      {user && (
        <Button
          title="Sign Out"
          onPress={handleSignOut}
          variant="secondary"
          fullWidth
          style={styles.signOutButton}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
});


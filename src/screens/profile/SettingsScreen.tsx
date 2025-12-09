// Settings Screen

import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import type { NavigationParamList } from '../../types/app.types';

type SettingsScreenNavigationProp = NativeStackNavigationProp<NavigationParamList, 'Settings'>;

export default function SettingsScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [pushEnabled, setPushEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.settingRow}>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Text style={styles.settingDescription}>
              Receive order updates and promotions
            </Text>
          </View>
          <Switch
            value={pushEnabled}
            onValueChange={setPushEnabled}
            trackColor={{ false: '#ccc', true: '#FF6B6B' }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Developer</Text>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('DesignSystemPreview')}
        >
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemLabel}>Design System Preview</Text>
            <Text style={styles.menuItemDescription}>
              View all design system components
            </Text>
          </View>
          <Text style={styles.menuItemArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F6F6F6',
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#000',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemContent: {
    flex: 1,
    marginRight: 15,
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
  },
  menuItemArrow: {
    fontSize: 18,
    color: '#999',
  },
});


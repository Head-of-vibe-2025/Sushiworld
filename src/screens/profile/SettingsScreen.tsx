// Settings Screen

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { spacing, getColors, borderRadius, typography } from '../../theme/designTokens';
import { supabase } from '../../services/supabase/supabaseClient';
import { pushService } from '../../services/notifications/pushService';
import type { NavigationParamList } from '../../types/app.types';

type SettingsScreenNavigationProp = NativeStackNavigationProp<NavigationParamList, 'Settings'>;

export default function SettingsScreen() {
  const { user } = useAuth();
  const { themeMode, isDark, setThemeMode } = useTheme();
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  
  const colors = getColors(isDark);

  // Load push notification preference from profile
  useEffect(() => {
    const loadPushPreference = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('push_enabled')
          .eq('id', user.id)
          .single();

        if (profile) {
          setPushEnabled(profile.push_enabled !== false); // Default to true if null
        }
      } catch (error) {
        console.error('Error loading push preference:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPushPreference();
  }, [user]);

  const handleThemeChange = async (value: boolean) => {
    if (value) {
      await setThemeMode('dark');
    } else {
      await setThemeMode('light');
    }
  };

  const handlePushNotificationChange = async (value: boolean) => {
    setPushEnabled(value);

    if (!user) {
      console.warn('⚠️ Cannot update push notification preference: user not logged in');
      setPushEnabled(!value); // Revert on error
      return;
    }

    try {
      // Update profile preference in database
      const { error } = await supabase
        .from('profiles')
        .update({ push_enabled: value })
        .eq('id', user.id);

      if (error) {
        console.error('❌ Error updating push preference:', error);
        setPushEnabled(!value); // Revert on error
        return;
      }

      console.log(`✅ Push notification preference updated to: ${value}`);
      console.log('📝 Push notifications are sent by the Supabase Edge Function (weekly-notifications)');
      console.log('📝 Changing this preference affects whether you receive push notifications from the server');
      
      // Cancel any existing local notifications when disabling
      // (Push notifications are controlled by the server based on push_enabled flag)
      if (!value) {
        await pushService.cancelWeeklyNotification();
      }
    } catch (error) {
      console.error('❌ Error updating push notifications:', error);
      setPushEnabled(!value); // Revert on error
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <BlurView
        intensity={80}
        tint={isDark ? 'dark' : 'light'}
        style={[styles.header, { paddingTop: insets.top + spacing.screenPadding }]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backIcon, { color: colors.text.primary }]}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
      </BlurView>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.titleSpacer} />
        <Text style={[styles.screenTitle, { color: colors.text.primary }]}>Settings</Text>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Appearance</Text>
          <View style={[styles.settingRow, { borderBottomWidth: 1, borderBottomColor: colors.border.light, paddingBottom: spacing.base, marginBottom: spacing.base }]}>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: colors.text.primary }]}>Dark Mode</Text>
              <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                Use dark theme for the app
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={handleThemeChange}
              trackColor={{ false: '#ccc', true: '#EA3886' }}
              thumbColor={isDark ? '#fff' : '#fff'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Notifications</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: colors.text.primary }]}>Push Notifications</Text>
              <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                Receive order updates and promotions
              </Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={handlePushNotificationChange}
              disabled={loading}
              trackColor={{ false: '#ccc', true: '#EA3886' }}
              thumbColor={pushEnabled ? '#fff' : '#fff'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Developer</Text>
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border.light }]}
            onPress={() => navigation.navigate('DesignSystemPreview')}
          >
            <View style={styles.menuItemContent}>
              <Text style={[styles.menuItemLabel, { color: colors.text.primary }]}>Design System Preview</Text>
              <Text style={[styles.menuItemDescription, { color: colors.text.secondary }]}>
                View all design system components
              </Text>
            </View>
            <Text style={[styles.menuItemArrow, { color: colors.text.tertiary }]}>→</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.base,
    zIndex: 1000,
  },
  backButton: {
    padding: 8,
    width: 40,
  },
  backIcon: {
    fontSize: 24,
  },
  headerSpacer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    overflow: 'visible',
  },
  content: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xl,
  },
  titleSpacer: {
    height: 100,
  },
  screenTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 34,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.base,
    fontFamily: typography.fontFamily.semibold,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.base,
  },
  settingContent: {
    flex: 1,
    marginRight: spacing.base,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    fontFamily: typography.fontFamily.semibold,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
  },
  menuItemContent: {
    flex: 1,
    marginRight: spacing.base,
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: typography.fontFamily.semibold,
  },
  menuItemDescription: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
  },
  menuItemArrow: {
    fontSize: 18,
  },
});


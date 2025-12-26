// Profile Screen

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useRegion } from '../../context/RegionContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../../components/design-system';
import { spacing, getColors, typography, borderRadius, getShadows } from '../../theme/designTokens';
// Using the same logo URL as MenuScreen
const SUSHIWORLD_LOGO_URL = 'https://lymingynfnunsrriiama.supabase.co/storage/v1/object/public/assets/logo.png';
import type { NavigationParamList } from '../../types/app.types';

type ProfileScreenNavigationProp = NativeStackNavigationProp<NavigationParamList, 'Profile'>;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, signOut } = useAuth();
  const { region, setRegion } = useRegion();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  
  const colors = getColors(isDark);
  const shadows = getShadows(isDark);

  const handleSignOut = async () => {
    await signOut();
  };

  // If user is not authenticated, show sign-in prompt
  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <View style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: SUSHIWORLD_LOGO_URL }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.authTitle, { color: colors.text.primary }]}>Create an Account</Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
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
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.content, { paddingTop: insets.top + spacing.screenPadding }]}>
          <Text style={[styles.title, { color: colors.text.primary }]}>Profile</Text>
          
          <View style={[styles.profileCard, { backgroundColor: colors.background.card }, shadows.sm]}>
            <View style={styles.profileInfo}>
              <Text style={[styles.emailLabel, { color: colors.text.secondary }]}>Email</Text>
              <Text style={[styles.email, { color: colors.text.primary }]}>{user?.email || 'Guest'}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border.light }]} />
            <View style={styles.profileInfo}>
              <Text style={[styles.regionLabel, { color: colors.text.secondary }]}>Region</Text>
              <Text style={[styles.region, { color: colors.text.primary }]}>
                {region === 'BE' ? 'Belgium' : 'Luxembourg'}
              </Text>
            </View>
          </View>

          <View style={styles.menuSection}>
            <TouchableOpacity
              style={[styles.menuItem, { backgroundColor: colors.background.card }, shadows.sm]}
              onPress={() => navigation.navigate('Orders')}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemContent}>
                <Text style={[styles.menuItemText, { color: colors.text.primary }]}>Order History</Text>
                <Text style={[styles.menuItemDescription, { color: colors.text.secondary }]}>
                  View your past orders
                </Text>
              </View>
              <Text style={[styles.menuItemArrow, { color: colors.text.tertiary }]}>→</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuItem, { backgroundColor: colors.background.card }, shadows.sm]}
              onPress={() => navigation.navigate('Settings')}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemContent}>
                <Text style={[styles.menuItemText, { color: colors.text.primary }]}>Settings</Text>
                <Text style={[styles.menuItemDescription, { color: colors.text.secondary }]}>
                  App settings and preferences
                </Text>
              </View>
              <Text style={[styles.menuItemArrow, { color: colors.text.tertiary }]}>→</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.signOutContainer}>
            <Button
              title="Sign Out"
              onPress={handleSignOut}
              variant="secondary"
              fullWidth
              size="large"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xl,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 34,
    marginBottom: spacing.xl,
  },
  profileCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  profileInfo: {
    marginBottom: spacing.base,
  },
  emailLabel: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    fontWeight: '500',
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  email: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semibold,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: spacing.base,
  },
  regionLabel: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    fontWeight: '500',
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  region: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semibold,
    fontWeight: '600',
  },
  menuSection: {
    marginBottom: spacing.xl,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    padding: spacing.base + 4,
    marginBottom: spacing.base,
  },
  menuItemContent: {
    flex: 1,
    marginRight: spacing.base,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semibold,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  menuItemDescription: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    fontWeight: '400',
  },
  menuItemArrow: {
    fontSize: 20,
    fontFamily: typography.fontFamily.regular,
  },
  signOutContainer: {
    marginTop: spacing.base,
    marginBottom: spacing.xl,
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
  authTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: typography.fontFamily.bold,
  },
  subtitle: {
    fontSize: 16,
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


// Bookings Screen

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { spacing, getColors, typography } from '../../theme/designTokens';

export default function BookingsScreen() {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.content, { paddingTop: insets.top + spacing.screenPadding }]}>
        <Text style={[styles.title, { color: colors.text.primary }]}>Bookings</Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>Coming soon</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 34,
    marginBottom: spacing.base,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.regular,
  },
});


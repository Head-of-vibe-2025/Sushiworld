// Loyalty Screen

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useLoyalty } from '../../hooks/useLoyalty';
import { formatPoints } from '../../utils/formatting';
import { spacing, getColors, typography } from '../../theme/designTokens';

export default function LoyaltyScreen() {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const { profile, loading } = useLoyalty();
  const points = profile?.loyalty_points || 0;

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <View style={[styles.content, { paddingTop: insets.top + spacing.screenPadding }]}>
          <Text style={[styles.title, { color: colors.text.primary }]}>Rewards</Text>
          <View style={styles.pointsContainer}>
            <Text style={[styles.pointsValue, { color: colors.text.primary }]}>...</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.content, { paddingTop: insets.top + spacing.screenPadding }]}>
        <Text style={[styles.title, { color: colors.text.primary }]}>Rewards</Text>
        <View style={styles.pointsContainer}>
          <Text style={[styles.pointsValue, { color: colors.text.primary }]}>{formatPoints(points)}</Text>
        </View>
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
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 34,
    marginBottom: spacing.xl,
  },
  pointsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsValue: {
    fontSize: 48,
    fontWeight: 'bold',
  },
});


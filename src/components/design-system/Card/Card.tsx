// Card Component - Base card with variants
// Based on UI Principles JSON

import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { getColors, borderRadius, getShadows, spacing, getBorders } from '../../../theme/designTokens';

export interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
  testID?: string;
}

export default function Card({
  children,
  onPress,
  style,
  variant = 'default',
  testID,
}: CardProps) {
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const shadows = getShadows(isDark);
  const borders = getBorders(isDark);
  
  const cardStyles = [
    styles.card,
    { backgroundColor: colors.background.card },
    variant === 'elevated' && shadows.md,
    variant === 'outlined' && borders.card,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyles}
        onPress={onPress}
        activeOpacity={0.9}
        testID={testID}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyles} testID={testID}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.productCard,
    padding: spacing.cardPadding,
  },
});


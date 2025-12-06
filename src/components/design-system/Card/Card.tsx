// Card Component - Base card with variants
// Based on UI Principles JSON

import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { colors, borderRadius, shadows, spacing, borders } from '../../../theme/designTokens';

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
  const cardStyles = [
    styles.card,
    variant === 'elevated' && styles.elevated,
    variant === 'outlined' && styles.outlined,
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
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.productCard,
    padding: spacing.cardPadding,
  },
  elevated: {
    ...shadows.md,
  },
  outlined: {
    ...borders.card,
  },
});


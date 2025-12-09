// QuantitySelector Component
// Based on UI Principles JSON

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, borderRadius, spacing, typography, touchTarget } from '../../../theme/designTokens';

export interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
  size?: 'small' | 'medium';
  testID?: string;
}

export default function QuantitySelector({
  quantity,
  onIncrement,
  onDecrement,
  min = 0,
  max,
  size = 'medium',
  testID,
}: QuantitySelectorProps) {
  const canDecrement = quantity > min;
  const canIncrement = max === undefined || quantity < max;

  const containerStyles = [
    styles.container,
    size === 'small' && styles.small,
  ];

  return (
    <View style={containerStyles} testID={testID}>
      <TouchableOpacity
        style={[styles.button, !canDecrement && styles.buttonDisabled]}
        onPress={onDecrement}
        disabled={!canDecrement}
        activeOpacity={0.7}
        testID={`${testID}-decrement`}
      >
        <Text style={[styles.buttonText, !canDecrement && styles.buttonTextDisabled]}>−</Text>
      </TouchableOpacity>
      <View style={styles.quantityContainer}>
        <Text style={styles.quantity}>{quantity}</Text>
      </View>
      <TouchableOpacity
        style={[styles.button, !canIncrement && styles.buttonDisabled]}
        onPress={onIncrement}
        disabled={!canIncrement}
        activeOpacity={0.7}
        testID={`${testID}-increment`}
      >
        <Text style={[styles.buttonText, !canIncrement && styles.buttonTextDisabled]}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.quantitySelector,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    gap: spacing.md,
    minWidth: 120,
    height: 36,
  },
  small: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    minWidth: 100,
    height: 32,
  },
  button: {
    minWidth: touchTarget.minimum,
    minHeight: touchTarget.minimum,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  buttonText: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
    lineHeight: typography.fontSizes.xl,
  },
  buttonTextDisabled: {
    color: colors.text.tertiary,
  },
  quantityContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.bodyText.fontSize,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
  },
});


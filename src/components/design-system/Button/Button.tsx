// Button Component - Primary and Secondary variants
// Based on UI Principles JSON

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { colors, borderRadius, typography, spacing, touchTarget } from '../../../theme/designTokens';

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  testID?: string;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'right',
  fullWidth = false,
  testID,
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isDisabled = disabled || loading;

  const buttonStyles = [
    styles.button,
    isPrimary ? styles.primary : styles.secondary,
    size === 'small' && styles.small,
    size === 'large' && styles.large,
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
  ];

  const textStyles = [
    styles.text,
    isPrimary ? styles.primaryText : styles.secondaryText,
    size === 'small' && styles.smallText,
    size === 'large' && styles.largeText,
    isDisabled && styles.disabledText,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isPrimary ? colors.text.inverse : colors.text.primary}
        />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text style={textStyles}>{title}</Text>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: touchTarget.recommended,
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: colors.primary.black,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary.black,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  small: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: touchTarget.minimum,
  },
  large: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
    minHeight: 56,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: typography.buttonText.fontSize,
    fontWeight: typography.buttonText.fontWeight,
    lineHeight: typography.buttonText.fontSize * typography.buttonText.lineHeight,
  },
  primaryText: {
    color: colors.text.inverse,
  },
  secondaryText: {
    color: colors.text.primary,
  },
  smallText: {
    fontSize: typography.fontSizes.sm,
  },
  largeText: {
    fontSize: typography.fontSizes.lg,
  },
  disabledText: {
    opacity: 0.6,
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
});


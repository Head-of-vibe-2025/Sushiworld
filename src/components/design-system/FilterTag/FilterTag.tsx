// FilterTag Component
// Based on UI Principles JSON

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, borderRadius, spacing, typography } from '../../../theme/designTokens';

export interface FilterTagProps {
  label: string;
  onPress?: () => void;
  onClose?: () => void;
  active?: boolean;
  showClose?: boolean;
  testID?: string;
}

export default function FilterTag({
  label,
  onPress,
  onClose,
  active = false,
  showClose = false,
  testID,
}: FilterTagProps) {
  const containerStyles = [
    styles.container,
    active && styles.active,
  ];

  const textStyles = [
    styles.text,
    active && styles.activeText,
  ];

  if (onClose || showClose) {
    return (
      <View style={containerStyles}>
        <Text style={textStyles}>{label}</Text>
        {showClose && (
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={containerStyles}
      onPress={onPress}
      activeOpacity={0.7}
      testID={testID}
    >
      <Text style={textStyles}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.filterTag,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  active: {
    backgroundColor: colors.primary.black,
    borderColor: colors.primary.black,
  },
  text: {
    fontSize: typography.bodyText.fontSize,
    fontWeight: typography.fontWeights.medium,
    color: colors.text.primary,
  },
  activeText: {
    color: colors.text.inverse,
  },
  closeButton: {
    marginLeft: spacing.xs,
    padding: spacing.xs,
  },
  closeText: {
    fontSize: typography.fontSizes.xl,
    color: colors.text.secondary,
    lineHeight: typography.fontSizes.xl,
  },
});


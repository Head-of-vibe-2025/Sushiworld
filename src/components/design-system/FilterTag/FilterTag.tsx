// FilterTag Component
// Based on UI Principles JSON

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { getColors, getBorders, borderRadius, spacing, typography } from '../../../theme/designTokens';

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
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const borders = getBorders(isDark);
  
  const containerStyles = [
    styles.container,
    { backgroundColor: colors.background.secondary, borderColor: borders.card.borderColor },
    active && { backgroundColor: colors.accent.pink, borderColor: colors.accent.pink },
  ];

  const textStyles = [
    styles.text,
    { color: colors.text.primary },
    active && { color: colors.text.inverse },
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
            <Text style={[styles.closeText, { color: active ? colors.text.inverse : colors.text.secondary }]}>×</Text>
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
    borderRadius: borderRadius.filterTag,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderWidth: 1,
  },
  text: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.bodyText.fontSize,
    fontWeight: typography.fontWeights.medium,
  },
  closeButton: {
    marginLeft: spacing.xs,
    padding: spacing.xs,
  },
  closeText: {
    fontSize: typography.fontSizes.xl,
    lineHeight: typography.fontSizes.xl,
  },
});


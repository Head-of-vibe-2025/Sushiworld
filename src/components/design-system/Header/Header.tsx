// Header Component
// Based on UI Principles JSON

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography, iconSizes } from '../../../theme/designTokens';

export interface HeaderProps {
  title?: string;
  onBackPress?: () => void;
  rightAction?: {
    icon?: React.ReactNode;
    onPress: () => void;
  };
  showBorder?: boolean;
  testID?: string;
}

export default function Header({
  title,
  onBackPress,
  rightAction,
  showBorder = false,
  testID,
}: HeaderProps) {
  return (
    <View style={[styles.container, showBorder && styles.bordered]} testID={testID}>
      <View style={styles.left}>
        {onBackPress && (
          <TouchableOpacity
            onPress={onBackPress}
            style={styles.iconButton}
            activeOpacity={0.7}
            testID={`${testID}-back`}
          >
            {/* Back arrow icon - you can replace with actual icon component */}
            <View style={styles.backIcon} />
          </TouchableOpacity>
        )}
      </View>
      {title && (
        <View style={styles.center}>
          <Text style={styles.title}>{title}</Text>
        </View>
      )}
      <View style={styles.right}>
        {rightAction && (
          <TouchableOpacity
            onPress={rightAction.onPress}
            style={styles.iconButton}
            activeOpacity={0.7}
            testID={`${testID}-right`}
          >
            {rightAction.icon || <View style={styles.menuIcon} />}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.primary,
  },
  bordered: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  left: {
    width: 40,
    alignItems: 'flex-start',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
  },
  iconButton: {
    width: iconSizes.lg,
    height: iconSizes.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: iconSizes.md,
    height: iconSizes.md,
    backgroundColor: colors.text.primary,
    transform: [{ rotate: '45deg' }],
  },
  menuIcon: {
    width: iconSizes.md,
    height: iconSizes.md,
    backgroundColor: colors.text.primary,
  },
});


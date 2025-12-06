// SearchBar Component
// Based on UI Principles JSON

import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, borderRadius, spacing, typography, iconSizes, shadows } from '../../../theme/designTokens';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  testID?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search your item',
  onFilterPress,
  testID,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.tertiary}
          testID={testID}
        />
        <View style={styles.iconContainer}>
          {/* Magnifying glass icon - you can replace with actual icon component */}
          <View style={styles.searchIcon} />
        </View>
      </View>
      {onFilterPress && (
        <TouchableOpacity
          style={styles.filterButton}
          onPress={onFilterPress}
          activeOpacity={0.7}
        >
          {/* Filter icon - you can replace with actual icon component */}
          <View style={styles.filterIcon} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius['2xl'],
    paddingHorizontal: spacing.base,
    height: 44,
    ...shadows.md,
    borderWidth: 0,
  },
  input: {
    flex: 1,
    fontSize: typography.bodyText.fontSize,
    fontWeight: typography.bodyText.fontWeight,
    color: colors.text.primary,
    padding: 0,
  },
  iconContainer: {
    marginLeft: spacing.sm,
  },
  searchIcon: {
    width: iconSizes.md,
    height: iconSizes.md,
    backgroundColor: colors.text.secondary,
    borderRadius: borderRadius.full,
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: colors.primary.black,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  filterIcon: {
    width: iconSizes.md,
    height: iconSizes.md,
    backgroundColor: colors.text.inverse,
  },
});


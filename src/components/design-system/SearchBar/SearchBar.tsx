// SearchBar Component
// Based on UI Principles JSON

import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors, borderRadius, spacing, typography, iconSizes, shadows } from '../../../theme/designTokens';

// Magnifier Icon Component
const MagnifierIcon = ({ color = '#8E93A6', size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11.5" cy="11.5" r="9.5" stroke={color} strokeWidth="2" />
    <Path d="M18.5 18.5L22 22" stroke="#1C274C" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

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
          <MagnifierIcon color="#8E93A6" size={20} />
        </View>
      </View>
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
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: spacing.base,
    height: 44,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 15,
  },
  input: {
    flex: 1,
    fontFamily: typography.bodyText.fontFamily,
    fontSize: typography.bodyText.fontSize,
    fontWeight: typography.bodyText.fontWeight,
    color: colors.text.primary,
    padding: 0,
  },
  iconContainer: {
    marginLeft: spacing.sm,
  },
});


// SectionHeader Component
// Based on UI Principles JSON

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../../theme/designTokens';

export interface SectionHeaderProps {
  title: string;
  style?: object;
  testID?: string;
}

export default function SectionHeader({ title, style, testID }: SectionHeaderProps) {
  return (
    <View style={[styles.container, style]} testID={testID}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.sectionSpacing,
    marginBottom: spacing.base,
    paddingHorizontal: spacing.screenPadding,
  },
  title: {
    fontFamily: typography.sectionHeader.fontFamily,
    fontSize: typography.sectionHeader.fontSize,
    fontWeight: typography.sectionHeader.fontWeight,
    lineHeight: typography.sectionHeader.fontSize * typography.sectionHeader.lineHeight,
    color: colors.text.primary,
  },
});


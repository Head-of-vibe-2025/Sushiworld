// OrderSummary Component
// Based on UI Principles JSON

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, borders } from '../../../theme/designTokens';

export interface OrderSummaryItem {
  label: string;
  value: string;
}

export interface OrderSummaryProps {
  items: OrderSummaryItem[];
  showSeparator?: boolean;
  testID?: string;
}

export default function OrderSummary({
  items,
  showSeparator = true,
  testID,
}: OrderSummaryProps) {
  return (
    <View style={styles.container} testID={testID}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <View style={styles.row}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
          {showSeparator && index < items.length - 1 && (
            <View style={styles.separator} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.screenPadding,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  label: {
    fontSize: typography.bodyText.fontSize,
    fontWeight: typography.fontWeights.regular,
    color: colors.text.primary,
  },
  value: {
    fontSize: typography.bodyText.fontSize,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
  },
  separator: {
    ...borders.separator,
    marginVertical: spacing.base,
  },
});


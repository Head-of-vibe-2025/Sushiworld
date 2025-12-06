// Rating Component
// Based on UI Principles JSON

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, iconSizes } from '../../../theme/designTokens';

export interface RatingProps {
  value: number;
  size?: 'small' | 'medium';
  showValue?: boolean;
  testID?: string;
}

export default function Rating({ value, size = 'medium', showValue = true, testID }: RatingProps) {
  const starSize = size === 'small' ? iconSizes.sm : iconSizes.md;
  const fontSize = size === 'small' ? typography.fontSizes.sm : typography.fontSizes.base;

  // Simple star representation - you can replace with actual star icon component
  const renderStar = (filled: boolean, index: number) => (
    <View
      key={index}
      style={[
        styles.star,
        { width: starSize, height: starSize },
        filled && styles.starFilled,
      ]}
    />
  );

  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.starsContainer}>
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            return renderStar(true, index);
          } else if (index === fullStars && hasHalfStar) {
            return renderStar(false, index); // Half star - you can implement proper half star
          } else {
            return renderStar(false, index);
          }
        })}
      </View>
      {showValue && (
        <Text style={[styles.value, { fontSize }]}>{value.toFixed(1)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    backgroundColor: colors.border.light,
    borderRadius: 2,
  },
  starFilled: {
    backgroundColor: '#FFD700', // Gold color for filled stars
  },
  value: {
    fontWeight: typography.fontWeights.medium,
    color: colors.text.primary,
  },
});


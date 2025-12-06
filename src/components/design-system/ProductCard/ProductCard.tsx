// ProductCard Component
// Based on UI Principles JSON

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, borderRadius, shadows, spacing, typography } from '../../../theme/designTokens';
import Rating from '../Rating';

export interface ProductCardProps {
  imageUri: string;
  name: string;
  price: string;
  rating?: number;
  onPress: () => void;
  testID?: string;
}

export default function ProductCard({
  imageUri,
  name,
  price,
  rating,
  onPress,
  testID,
}: ProductCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
      testID={testID}
    >
      <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>
        {rating !== undefined && (
          <View style={styles.ratingContainer}>
            <Rating value={rating} size="small" />
          </View>
        )}
        <Text style={styles.price}>{price}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.productCard,
    padding: spacing.cardPadding,
    ...shadows.md,
    marginBottom: spacing.md,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: borderRadius.productImage,
    marginBottom: spacing.elementGap,
  },
  content: {
    gap: spacing.sm,
  },
  name: {
    fontSize: typography.productName.fontSize,
    fontWeight: typography.productName.fontWeight,
    lineHeight: typography.productName.fontSize * typography.productName.lineHeight,
    color: colors.text.primary,
  },
  ratingContainer: {
    marginTop: spacing.xs,
  },
  price: {
    fontSize: typography.price.fontSize,
    fontWeight: typography.price.fontWeight,
    lineHeight: typography.price.fontSize * typography.price.lineHeight,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
});


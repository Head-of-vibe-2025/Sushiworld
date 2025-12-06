// CartItem Component
// Based on UI Principles JSON

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, borderRadius, spacing, typography, imageSizes } from '../../../theme/designTokens';
import QuantitySelector from '../QuantitySelector';
import { Price } from '../Typography';

export interface CartItemProps {
  imageUri: string;
  name: string;
  price: string;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  testID?: string;
}

export default function CartItem({
  imageUri,
  name,
  price,
  quantity,
  onQuantityChange,
  testID,
}: CartItemProps) {
  return (
    <View style={styles.container} testID={testID}>
      <Image
        source={{ uri: imageUri }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Price>{price}</Price>
      </View>
      <QuantitySelector
        quantity={quantity}
        onIncrement={() => onQuantityChange(quantity + 1)}
        onDecrement={() => onQuantityChange(Math.max(0, quantity - 1))}
        size="small"
        testID={`${testID}-quantity`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.cardPadding,
    gap: spacing.md,
  },
  thumbnail: {
    width: imageSizes.thumbnail,
    height: imageSizes.thumbnail,
    borderRadius: borderRadius.thumbnail,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    fontSize: typography.productName.fontSize,
    fontWeight: typography.productName.fontWeight,
    color: colors.text.primary,
  },
});


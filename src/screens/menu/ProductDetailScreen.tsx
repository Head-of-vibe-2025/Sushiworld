// Product Detail Screen

import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useCart } from '../../context/CartContext';
import { useMenuItem } from '../../hooks/useFoxyProducts';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Button } from '../../components/design-system';
import { formatPrice } from '../../utils/formatting';
import { spacing, colors, typography } from '../../theme/designTokens';
import type { NavigationParamList } from '../../types/app.types';

type ProductDetailScreenRouteProp = RouteProp<NavigationParamList, 'ProductDetail'>;
type ProductDetailScreenNavigationProp = NativeStackNavigationProp<NavigationParamList, 'ProductDetail'>;

export default function ProductDetailScreen() {
  const route = useRoute<ProductDetailScreenRouteProp>();
  const navigation = useNavigation<ProductDetailScreenNavigationProp>();
  const { addItem, items, updateQuantity } = useCart();
  const { productId } = route.params;
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, error } = useMenuItem(productId);
  
  const cartItem = items.find(i => i.id === productId);
  const currentQuantity = cartItem?.quantity || 0;

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    if (!product) return;

    for (let i = 0; i < quantity; i++) {
      if (currentQuantity === 0 && i === 0) {
        addItem({
          id: product.id,
          name: product.name,
          code: product.code,
          price: product.price,
          image: product.image,
        });
      } else {
        updateQuantity(product.id, (currentQuantity || 0) + i + 1);
      }
    }
    
    Alert.alert('Added to Cart', `${quantity} ${product.name}(s) added to your cart`);
  };

  const totalPrice = product ? product.price * quantity : 0;

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <LoadingSpinner />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load product</Text>
        <Text style={styles.errorSubtext}>{error?.message || 'Product not found'}</Text>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          variant="secondary"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.imageCard}>
          <View style={styles.imageContainer}>
            {product.image && (
              <Image source={{ uri: product.image }} style={styles.image} />
            )}
          </View>
          <View style={styles.quantitySection}>
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleDecrease}
              >
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>
              <View style={styles.quantityDisplay}>
                <Text style={styles.quantityText}>{quantity}</Text>
              </View>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleIncrease}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.totalPriceLabel}>Total Price</Text>
              <Text style={styles.totalPrice}>{formatPrice(totalPrice)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.scrollIndicator}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{product.name}</Text>
          </View>
          {product.description && (
            <Text style={styles.description}>{product.description}</Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Add to Cart"
          onPress={handleAddToCart}
          variant="primary"
          fullWidth
          size="large"
          icon={<Text style={styles.addIcon}>+</Text>}
          iconPosition="right"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.base,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#000',
  },
  scrollView: {
    flex: 1,
  },
  imageCard: {
    backgroundColor: 'white',
    borderRadius: 35,
    marginHorizontal: spacing.screenPadding,
    marginTop: spacing.base,
    marginBottom: spacing.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 15,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    gap: spacing.base,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 9999,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontFamily: typography.fontFamily.regular,
    color: '#000',
    fontSize: 24,
    fontWeight: '400',
  },
  quantityDisplay: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: spacing.sm,
  },
  quantityText: {
    fontFamily: typography.fontFamily.bold,
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  totalPriceLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  totalPrice: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  scrollIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ccc',
  },
  dotActive: {
    backgroundColor: '#000',
    width: 20,
  },
  content: {
    padding: spacing.screenPadding,
    paddingBottom: 100,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  name: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingIcon: {
    fontSize: 16,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  description: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.screenPadding,
    paddingBottom: 40,
    backgroundColor: '#F6F6F6',
  },
  addIcon: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF6B6B',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
});


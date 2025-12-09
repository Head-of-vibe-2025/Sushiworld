// Cart Screen

import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCart } from '../../context/CartContext';
import { Button } from '../../components/design-system';
import { formatPrice } from '../../utils/formatting';
import { spacing, colors } from '../../theme/designTokens';
import type { NavigationParamList } from '../../types/app.types';

type CartScreenNavigationProp = NativeStackNavigationProp<NavigationParamList, 'Cart'>;

export default function CartScreen() {
  const navigation = useNavigation<CartScreenNavigationProp>();
  const { items, removeItem, updateQuantity, getTotal } = useCart();

  const renderItem = ({ item }: { item: typeof items[0] }) => (
    <View style={styles.cartItem}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.itemThumbnail} />
      )}
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
      </View>
      <View style={styles.quantityControls}>
        <TouchableOpacity
          onPress={() => updateQuantity(item.id, item.quantity - 1)}
          style={styles.quantityButton}
        >
          <Text style={styles.quantityButtonText}>−</Text>
        </TouchableOpacity>
        <View style={styles.quantityDisplay}>
          <Text style={styles.quantity}>{item.quantity}</Text>
        </View>
        <TouchableOpacity
          onPress={() => updateQuantity(item.id, item.quantity + 1)}
          style={styles.quantityButton}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Your cart is empty</Text>
      </View>
    );
  }

  const subtotal = getTotal();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.cartListTitle}>My Cart List</Text>
        
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          scrollEnabled={false}
        />

        <View style={styles.promoSection}>
          <Text style={styles.promoIcon}>🏷️</Text>
          <Text style={styles.promoText}>Do You have any promo code?</Text>
        </View>

        <View style={styles.orderSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.totalAmount}>{formatPrice(subtotal)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Checkout"
          onPress={() => navigation.navigate('Checkout')}
          variant="primary"
          fullWidth
          size="large"
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  profileButton: {
    padding: 8,
  },
  profileIcon: {
    fontSize: 24,
    color: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
  },
  cartListTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: spacing.base,
  },
  list: {
    paddingBottom: spacing.base,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.base,
    gap: spacing.base,
  },
  itemThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: 'cover',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  quantityDisplay: {
    width: 40,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  promoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.base,
    marginTop: spacing.base,
  },
  promoIcon: {
    fontSize: 20,
  },
  promoText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  orderSummary: {
    marginTop: spacing.base,
    paddingTop: spacing.base,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  footer: {
    padding: spacing.screenPadding,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#F6F6F6',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
});


// Cart Screen

import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatting';
import { spacing, colors, borderRadius } from '../../theme/designTokens';
import type { NavigationParamList } from '../../types/app.types';

type CartScreenNavigationProp = NativeStackNavigationProp<NavigationParamList, 'Cart'>;

export default function CartScreen() {
  const navigation = useNavigation<CartScreenNavigationProp>();
  const { items, removeItem, updateQuantity, getTotal } = useCart();

  const renderItem = ({ item }: { item: typeof items[0] }) => (
    <View style={styles.cartItemCard}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.itemThumbnail} />
      )}
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
      </View>
      <View style={styles.quantitySelector}>
        <TouchableOpacity
          onPress={() => updateQuantity(item.id, item.quantity + 1)}
          style={styles.quantityButtonTop}
          activeOpacity={0.7}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
        <View style={styles.quantityDisplay}>
          <Text style={styles.quantity}>{item.quantity}</Text>
        </View>
        <TouchableOpacity
          onPress={() => updateQuantity(item.id, item.quantity - 1)}
          style={styles.quantityButtonBottom}
          activeOpacity={0.7}
        >
          <Text style={styles.quantityButtonText}>−</Text>
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
          <View style={styles.avatarContainer}>
            <View style={styles.avatar} />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.cartListTitle}>My Cart List</Text>
        
        <View style={styles.itemsContainer}>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          />
        </View>

        <TouchableOpacity style={styles.promoSection}>
          <Text style={styles.promoIcon}>%</Text>
          <Text style={styles.promoText}>Do You have any promo code?</Text>
        </TouchableOpacity>

        <View style={styles.orderSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
          </View>
          <View style={styles.dashedLine} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.totalAmount}>{formatPrice(subtotal)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => navigation.navigate('Checkout')}
          activeOpacity={0.8}
        >
          <Text style={styles.checkoutButtonText}>Go to checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.base,
    backgroundColor: colors.primary.white,
  },
  backButton: {
    padding: 8,
    width: 40,
  },
  backIcon: {
    fontSize: 24,
    color: colors.text.primary,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    fontFamily: 'Poppins_700Bold',
  },
  profileButton: {
    padding: 8,
    width: 40,
    alignItems: 'flex-end',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.searchBar,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accent.pink,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xl,
  },
  cartListTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    fontFamily: 'Poppins_700Bold',
    marginBottom: spacing.xl,
  },
  itemsContainer: {
    marginBottom: spacing.base,
  },
  cartItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.base,
  },
  itemSeparator: {
    height: spacing.base,
  },
  itemThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 40,
    resizeMode: 'cover',
    backgroundColor: colors.background.searchBar,
  },
  itemInfo: {
    flex: 1,
    marginLeft: spacing.base,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    fontFamily: 'Poppins_600SemiBold',
  },
  quantitySelector: {
    width: 32,
    height: 96,
    backgroundColor: colors.primary.black,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 0,
    marginLeft: spacing.sm,
  },
  quantityButtonTop: {
    width: '100%',
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 2,
  },
  quantityButtonBottom: {
    width: '100%',
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 2,
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.inverse,
    fontFamily: 'Poppins_600SemiBold',
    lineHeight: 18,
  },
  quantityDisplay: {
    width: '100%',
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0,
  },
  quantity: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.inverse,
    fontFamily: 'Poppins_700Bold',
    lineHeight: 20,
  },
  promoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginTop: spacing.base,
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  promoIcon: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    width: 24,
    textAlign: 'center',
  },
  promoText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    fontFamily: 'Poppins_500Medium',
    flex: 1,
  },
  orderSummary: {
    marginTop: spacing.base,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dashedLine: {
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    borderStyle: 'dashed',
    marginVertical: spacing.sm,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.secondary,
    fontFamily: 'Poppins_500Medium',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    fontFamily: 'Poppins_600SemiBold',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    fontFamily: 'Poppins_700Bold',
  },
  footer: {
    padding: spacing.screenPadding,
    paddingBottom: 40,
    backgroundColor: colors.primary.white,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  checkoutButton: {
    backgroundColor: colors.primary.black,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.base + 4,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.inverse,
    fontFamily: 'Poppins_600SemiBold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary.white,
  },
  emptyText: {
    fontSize: 18,
    color: colors.text.secondary,
    fontFamily: 'Poppins_500Medium',
  },
});


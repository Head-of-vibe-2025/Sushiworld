// Cart Screen

import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatting';
import { spacing, colors, borderRadius, typography, shadows } from '../../theme/designTokens';
import type { NavigationParamList } from '../../types/app.types';

type CartScreenNavigationProp = NativeStackNavigationProp<NavigationParamList, 'Cart'>;

export default function CartScreen() {
  const navigation = useNavigation<CartScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const { items, removeItem, updateQuantity, getTotal } = useCart();

  const renderItem = ({ item }: { item: typeof items[0] }) => (
    <View style={styles.cartItemCard}>
      {item.image && (
        <View style={styles.imageWrapper}>
          <View style={styles.imageShadowContainer}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.image }} style={styles.itemThumbnail} />
            </View>
          </View>
        </View>
      )}
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
      </View>
      <View style={styles.quantitySelector}>
        <TouchableOpacity
          onPress={() => updateQuantity(item.id, item.quantity - 1)}
          style={styles.quantityButton}
          activeOpacity={0.7}
        >
          <Text style={styles.quantityButtonText}>−</Text>
        </TouchableOpacity>
        <View style={styles.quantityDisplay}>
          <Text style={styles.quantity}>{item.quantity}</Text>
        </View>
        <TouchableOpacity
          onPress={() => updateQuantity(item.id, item.quantity + 1)}
          style={styles.quantityButton}
          activeOpacity={0.7}
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
      <BlurView
        intensity={80}
        tint="light"
        style={[styles.header, { paddingTop: insets.top + spacing.screenPadding }]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
      </BlurView>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.titleSpacer} />
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
    backgroundColor: colors.background.primary,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.base,
    zIndex: 1000,
  },
  backButton: {
    padding: 8,
    width: 40,
  },
  backIcon: {
    fontSize: 24,
    color: colors.text.primary,
  },
  headerSpacer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    overflow: 'visible',
  },
  content: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xl,
  },
  titleSpacer: {
    height: 100,
  },
  cartListTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    letterSpacing: -0.5,
    lineHeight: 34,
    marginBottom: spacing.xl,
  },
  itemsContainer: {
    marginBottom: spacing.base,
  },
  cartItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  itemSeparator: {
    height: spacing.base,
  },
  imageWrapper: {
    marginLeft: -10,
    paddingLeft: 10,
  },
  imageShadowContainer: {
    width: 100,
    height: 100,
    borderRadius: borderRadius['2xl'],
    backgroundColor: colors.primary.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginRight: spacing.base,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
  },
  itemThumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    fontFamily: typography.fontFamily.medium,
  },
  quantitySelector: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 24,
    fontWeight: '400',
    color: colors.text.primary,
    fontFamily: typography.fontFamily.regular,
  },
  quantityDisplay: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.primary.black,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  quantity: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.inverse,
    fontFamily: typography.fontFamily.bold,
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
    backgroundColor: colors.background.primary,
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
    backgroundColor: colors.background.primary,
  },
  emptyText: {
    fontSize: 18,
    color: colors.text.secondary,
    fontFamily: 'Poppins_500Medium',
  },
});


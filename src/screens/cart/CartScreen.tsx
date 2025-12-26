// Cart Screen

import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatting';
import { spacing, getColors, borderRadius, typography, getShadows } from '../../theme/designTokens';
import type { NavigationParamList } from '../../types/app.types';

type CartScreenNavigationProp = NativeStackNavigationProp<NavigationParamList, 'Cart'>;

export default function CartScreen() {
  const navigation = useNavigation<CartScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const shadows = getShadows(isDark);
  const { items, removeItem, updateQuantity, getTotal } = useCart();

  const renderItem = ({ item }: { item: typeof items[0] }) => (
    <View style={styles.cartItemCard}>
      {item.image && (
        <View style={styles.imageWrapper}>
          <View style={[styles.imageShadowContainer, { backgroundColor: colors.background.card }, shadows.md]}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.image }} style={styles.itemThumbnail} />
            </View>
          </View>
        </View>
      )}
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: colors.text.primary }]}>{item.name}</Text>
        <Text style={[styles.itemPrice, { color: colors.text.secondary }]}>{formatPrice(item.price)}</Text>
      </View>
      <View style={styles.quantitySelector}>
        <TouchableOpacity
          onPress={() => updateQuantity(item.id, item.quantity - 1)}
          style={styles.quantityButton}
          activeOpacity={0.7}
        >
          <Text style={[styles.quantityButtonText, { color: colors.text.primary }]}>−</Text>
        </TouchableOpacity>
        <View style={[styles.quantityDisplay, { backgroundColor: isDark ? colors.primary.white : colors.primary.black }]}>
          <Text style={[styles.quantity, { color: isDark ? colors.primary.black : colors.text.inverse }]}>{item.quantity}</Text>
        </View>
        <TouchableOpacity
          onPress={() => updateQuantity(item.id, item.quantity + 1)}
          style={styles.quantityButton}
          activeOpacity={0.7}
        >
          <Text style={[styles.quantityButtonText, { color: colors.text.primary }]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (items.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <BlurView
          intensity={80}
          tint={isDark ? 'dark' : 'light'}
          style={[styles.header, { paddingTop: insets.top + spacing.screenPadding }]}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.backIcon, { color: colors.text.primary }]}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerSpacer} />
        </BlurView>

        <View style={[styles.emptyContainer, { backgroundColor: colors.background.primary }]}>
          <Text style={[styles.emptyText, { color: colors.text.secondary }]}>Your cart is empty</Text>
          <TouchableOpacity
            style={[styles.browseButton, { backgroundColor: isDark ? colors.primary.white : colors.primary.black }]}
            onPress={() => navigation.navigate('Menu')}
            activeOpacity={0.8}
          >
            <Text style={[styles.browseButtonText, { color: isDark ? colors.primary.black : colors.text.inverse }]}>Browse Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const subtotal = getTotal();

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <BlurView
        intensity={80}
        tint={isDark ? 'dark' : 'light'}
        style={[styles.header, { paddingTop: insets.top + spacing.screenPadding }]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backIcon, { color: colors.text.primary }]}>←</Text>
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
        <Text style={[styles.cartListTitle, { color: colors.text.primary }]}>My Cart List</Text>
        
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
            <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>Subtotal</Text>
            <Text style={[styles.summaryValue, { color: colors.text.primary }]}>{formatPrice(subtotal)}</Text>
          </View>
          <View style={[styles.dashedLine, { borderTopColor: colors.border.light }]} />
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>Total</Text>
            <Text style={[styles.totalAmount, { color: colors.text.primary }]}>{formatPrice(subtotal)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background.primary }]}>
        <TouchableOpacity
          style={[styles.checkoutButton, { backgroundColor: isDark ? colors.primary.white : colors.primary.black }]}
          onPress={() => navigation.navigate('Checkout')}
          activeOpacity={0.8}
        >
          <Text style={[styles.checkoutButtonText, { color: isDark ? colors.primary.black : colors.text.inverse }]}>Go to checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
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
    fontFamily: typography.fontFamily.regular,
  },
  quantityDisplay: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  quantity: {
    fontSize: 18,
    fontWeight: '700',
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
    borderStyle: 'dashed',
    marginVertical: spacing.sm,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Poppins_500Medium',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold',
  },
  footer: {
    padding: spacing.screenPadding,
    paddingBottom: 40,
  },
  checkoutButton: {
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
    fontFamily: 'Poppins_600SemiBold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Poppins_500Medium',
    marginBottom: spacing.xl,
  },
  browseButton: {
    borderRadius: borderRadius.full,
    paddingVertical: spacing.base + 4,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    minWidth: 200,
  },
  browseButtonText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
});


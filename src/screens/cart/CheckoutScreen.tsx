// Checkout Screen

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as WebBrowser from 'expo-web-browser';
import { useCart } from '../../context/CartContext';
import { useRegion } from '../../context/RegionContext';
import { useAuth } from '../../context/AuthContext';
import { buildFoxyCheckoutUrl, buildCheckoutParamsFromCart } from '../../services/foxy/foxyCheckout';
import { formatPrice } from '../../utils/formatting';
import { isValidEmail } from '../../utils/validation';
import { spacing, colors, borderRadius, typography } from '../../theme/designTokens';
import type { NavigationParamList } from '../../types/app.types';

type CheckoutScreenNavigationProp = NativeStackNavigationProp<NavigationParamList, 'Checkout'>;

export default function CheckoutScreen() {
  const navigation = useNavigation<CheckoutScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const { items, getTotal, clearCart } = useCart();
  const { region } = useRegion();
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    // Validate email format only if email is provided (but allow empty email for guest checkout)
    if (email && !isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address or leave it empty to continue as guest');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      // Debug: Log cart items before building URL
      console.log('🛒 Cart items before checkout:', items);
      console.log('💰 Cart total:', getTotal());
      
      // Only pass email if it's provided and valid
      const customerEmail = email && isValidEmail(email) ? email : undefined;
      const checkoutParams = buildCheckoutParamsFromCart(items, customerEmail);
      console.log('📋 Checkout params:', checkoutParams);
      
      const checkoutUrl = buildFoxyCheckoutUrl(region, checkoutParams);
      console.log('🌐 Final checkout URL:', checkoutUrl);

      const result = await WebBrowser.openBrowserAsync(checkoutUrl);

      if (result.type === 'dismiss') {
        // User closed the browser - check if order was completed
        // In production, this would be handled by webhook
        Alert.alert(
          'Order Placed',
          'Your order has been received. You will receive a confirmation email shortly.',
          [
            {
              text: 'OK',
              onPress: () => {
                clearCart();
                navigation.goBack();
              },
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not open checkout');
    } finally {
      setLoading(false);
    }
  };

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
        <Text style={styles.pageTitle}>Order Summary</Text>
        
        <View style={styles.summary}>
          {items.map((item) => (
            <View key={item.id} style={styles.summaryRow}>
              <Text style={styles.summaryItem}>
                {item.name} x{item.quantity}
              </Text>
              <Text style={styles.summaryPrice}>
                {formatPrice(item.price * item.quantity)}
              </Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalAmount}>{formatPrice(getTotal())}</Text>
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email Address (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="your@email.com (optional)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={colors.text.tertiary}
          />
          <Text style={styles.hint}>
            Optional: Add your email for order updates, or continue as guest. Create an account after checkout to earn loyalty points!
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.checkoutButton, loading && styles.checkoutButtonDisabled]}
          onPress={handleCheckout}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.checkoutButtonText}>
            {loading ? 'Processing...' : 'Continue to Payment'}
          </Text>
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
    paddingBottom: spacing.xs,
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
  titleSpacer: {
    height: 70,
  },
  pageTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    letterSpacing: -0.5,
    lineHeight: 34,
    marginBottom: spacing.xl,
  },
  content: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xl,
  },
  summary: {
    marginBottom: spacing.xl,
    marginTop: 0,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    marginTop: 0,
  },
  summaryItem: {
    fontSize: typography.fontSizes.base,
    color: colors.text.secondary,
    fontFamily: typography.fontFamily.regular,
    flex: 1,
  },
  summaryPrice: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
    fontFamily: typography.fontFamily.semibold,
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.base,
  },
  totalLabel: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
    fontFamily: typography.fontFamily.bold,
  },
  totalAmount: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: typography.fontWeights.bold,
    color: '#EA3886',
    fontFamily: typography.fontFamily.bold,
  },
  form: {
    marginTop: spacing.xl,
    marginBottom: spacing.base,
  },
  label: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing.base,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    fontSize: typography.fontSizes.base,
    backgroundColor: colors.background.searchBar,
    color: colors.text.primary,
    fontFamily: typography.fontFamily.regular,
    marginBottom: spacing.sm,
  },
  hint: {
    fontSize: typography.fontSizes.sm,
    color: colors.text.secondary,
    fontFamily: typography.fontFamily.regular,
    lineHeight: typography.lineHeights.relaxed * typography.fontSizes.sm,
  },
  footer: {
    padding: spacing.screenPadding,
    paddingBottom: 40,
    backgroundColor: colors.primary.white,
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
  checkoutButtonDisabled: {
    opacity: 0.6,
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.inverse,
    fontFamily: 'Poppins_600SemiBold',
  },
});


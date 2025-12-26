// Checkout Screen

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useRegion } from '../../context/RegionContext';
import { useAuth } from '../../context/AuthContext';
import { buildFoxyCheckoutUrl, buildCheckoutParamsFromCart } from '../../services/foxy/foxyCheckout';
import { formatPrice } from '../../utils/formatting';
import { isValidEmail } from '../../utils/validation';
import { spacing, getColors, getBorders, borderRadius, typography } from '../../theme/designTokens';
import type { NavigationParamList } from '../../types/app.types';

type CheckoutScreenNavigationProp = NativeStackNavigationProp<NavigationParamList, 'Checkout'>;

export default function CheckoutScreen() {
  const navigation = useNavigation<CheckoutScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const borders = getBorders(isDark);
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

      // Navigate to custom WebView screen instead of opening external browser
      // This avoids the double navigation issue (Safari controls + FoxyCart UI)
      navigation.navigate('FoxyCheckout', { checkoutUrl });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not open checkout');
    } finally {
      setLoading(false);
    }
  };

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
        <Text style={[styles.pageTitle, { color: colors.text.primary }]}>Order Summary</Text>
        
        <View style={styles.summary}>
          {items.map((item) => (
            <View key={item.id} style={styles.summaryRow}>
              <Text style={[styles.summaryItem, { color: colors.text.secondary }]}>
                {item.name} x{item.quantity}
              </Text>
              <Text style={[styles.summaryPrice, { color: colors.text.primary }]}>
                {formatPrice(item.price * item.quantity)}
              </Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.text.primary }]}>Total:</Text>
            <Text style={[styles.totalAmount, { color: colors.accent.pink }]}>{formatPrice(getTotal())}</Text>
          </View>
        </View>

        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.text.primary }]}>Email Address (Optional)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background.searchBar, borderColor: borders.input.borderColor, color: colors.text.primary }]}
            placeholder="your@email.com (optional)"
            placeholderTextColor={colors.text.tertiary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text style={[styles.hint, { color: colors.text.secondary }]}>
            Optional: Add your email for order updates, or continue as guest. Create an account after checkout to earn loyalty points!
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background.card }]}>
        <TouchableOpacity
          style={[styles.checkoutButton, { backgroundColor: isDark ? colors.primary.white : colors.primary.black }, loading && styles.checkoutButtonDisabled]}
          onPress={handleCheckout}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={[styles.checkoutButtonText, { color: isDark ? colors.primary.black : colors.text.inverse }]}>
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
    fontFamily: typography.fontFamily.regular,
    flex: 1,
  },
  summaryPrice: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.semibold,
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
    fontFamily: typography.fontFamily.bold,
  },
  totalAmount: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: typography.fontWeights.bold,
    fontFamily: typography.fontFamily.bold,
  },
  form: {
    marginTop: spacing.xl,
    marginBottom: spacing.base,
  },
  label: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing.base,
  },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    fontSize: typography.fontSizes.base,
    fontFamily: typography.fontFamily.regular,
    marginBottom: spacing.sm,
  },
  hint: {
    fontSize: typography.fontSizes.sm,
    fontFamily: typography.fontFamily.regular,
    lineHeight: typography.lineHeights.relaxed * typography.fontSizes.sm,
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
  checkoutButtonDisabled: {
    opacity: 0.6,
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
});


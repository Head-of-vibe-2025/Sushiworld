// Checkout Screen

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, ScrollView } from 'react-native';
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
import { profileService } from '../../services/supabase/profileService';
import type { NavigationParamList } from '../../types/app.types';

type CheckoutScreenNavigationProp = NativeStackNavigationProp<NavigationParamList, 'Checkout'>;

interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export default function CheckoutScreen() {
  const navigation = useNavigation<CheckoutScreenNavigationProp>();
  const { items, getTotal, clearCart } = useCart();
  const { region } = useRegion();
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState<Address>({
    street: '',
    city: '',
    postalCode: '',
    country: region === 'BE' ? 'Belgium' : 'Luxembourg',
  });
  const [loading, setLoading] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);

  // Load address for logged-in users
  useEffect(() => {
    const loadUserAddress = async () => {
      if (user?.email) {
        setLoadingAddress(true);
        try {
          const profile = await profileService.getProfile(user.email);
          if (profile?.preferences?.address) {
            setAddress(profile.preferences.address as Address);
          }
        } catch (error) {
          console.error('Error loading address:', error);
        } finally {
          setLoadingAddress(false);
        }
      }
    };

    loadUserAddress();
  }, [user]);

  const handleCheckout = async () => {
    // Validate email format only if email is provided (but allow empty email for guest checkout)
    if (email && !isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address or leave it empty to continue as guest');
      return;
    }

    // Validate address fields
    if (!address.street.trim() || !address.city.trim() || !address.postalCode.trim()) {
      Alert.alert('Error', 'Please fill in all address fields');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }

    // Save address for logged-in users
    if (user?.email) {
      try {
        const profile = await profileService.getProfile(user.email);
        if (profile) {
          await profileService.updateProfile(profile.id, {
            preferences: {
              ...profile.preferences,
              address: address,
            },
          });
        }
      } catch (error) {
        console.error('Error saving address:', error);
        // Continue with checkout even if saving address fails
      }
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
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Summary</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
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
          <Text style={styles.label}>Delivery Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Street address"
            value={address.street}
            onChangeText={(text) => setAddress({ ...address, street: text })}
            placeholderTextColor={colors.text.tertiary}
            editable={!loadingAddress}
          />
          <View style={styles.addressRow}>
            <TextInput
              style={[styles.input, styles.inputHalf, styles.inputLeft, { marginBottom: 0 }]}
              placeholder="City"
              value={address.city}
              onChangeText={(text) => setAddress({ ...address, city: text })}
              placeholderTextColor={colors.text.tertiary}
              editable={!loadingAddress}
            />
            <TextInput
              style={[styles.input, styles.inputHalf, styles.inputRight, { marginBottom: 0 }]}
              placeholder="Postal code"
              value={address.postalCode}
              onChangeText={(text) => setAddress({ ...address, postalCode: text })}
              keyboardType="numeric"
              placeholderTextColor={colors.text.tertiary}
              editable={!loadingAddress}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Country"
            value={address.country}
            onChangeText={(text) => setAddress({ ...address, country: text })}
            placeholderTextColor={colors.text.tertiary}
            editable={!loadingAddress}
          />
          {user && (
            <Text style={styles.hint}>
              Your address has been saved from your profile. You can update it above.
            </Text>
          )}
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
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    fontFamily: typography.fontFamily.bold,
    flex: 1,
    textAlign: 'left',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xl,
  },
  summary: {
    marginTop: spacing.base,
    marginBottom: spacing.xl,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
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
    color: '#FF6B35', // Red/orange color as shown in image
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
  addressRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  inputHalf: {
    flex: 1,
  },
  inputLeft: {
    marginRight: spacing.xs,
  },
  inputRight: {
    marginLeft: spacing.xs,
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
    borderRadius: borderRadius.lg,
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
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.inverse,
    fontFamily: typography.fontFamily.semibold,
  },
});


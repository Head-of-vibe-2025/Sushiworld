// Checkout Screen

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useCart } from '../../context/CartContext';
import { useRegion } from '../../context/RegionContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/design-system';
import { buildFoxyCheckoutUrl, buildCheckoutParamsFromCart } from '../../services/foxy/foxyCheckout';
import { formatPrice } from '../../utils/formatting';
import { isValidEmail } from '../../utils/validation';

export default function CheckoutScreen() {
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
                // Navigate back
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
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
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
        />
        <Text style={styles.hint}>
          {user 
            ? 'You can proceed without email or update it above'
            : 'Optional: Add your email for order updates, or continue as guest. Create an account after checkout to earn loyalty points!'
          }
        </Text>
      </View>

      <Button
        title="Continue to Payment"
        onPress={handleCheckout}
        variant="primary"
        loading={loading}
        disabled={loading}
        fullWidth
        size="large"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F6F6F6',
  },
  summary: {
    marginBottom: 30,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryItem: {
    fontSize: 16,
    color: '#666',
  },
  summaryPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  form: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 10,
  },
  hint: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});


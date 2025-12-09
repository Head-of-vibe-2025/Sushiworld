// Order Detail Screen

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { formatPrice, formatDateTime } from '../../utils/formatting';
import type { NavigationParamList } from '../../types/app.types';

type OrderDetailScreenRouteProp = RouteProp<NavigationParamList, 'OrderDetail'>;

export default function OrderDetailScreen() {
  const route = useRoute<OrderDetailScreenRouteProp>();
  const { orderId } = route.params;

  // Placeholder order - will be fetched from Foxy API
  const order = {
    id: orderId,
    date: '2024-01-15T12:00:00Z',
    total: 45.50,
    status: 'completed',
    items: [
      { name: 'Salmon Nigiri', quantity: 2, price: 4.50 },
      { name: 'Tuna Roll', quantity: 1, price: 8.00 },
      { name: 'Miso Soup', quantity: 1, price: 3.50 },
    ],
    subtotal: 16.00,
    shipping: 5.00,
    tax: 4.00,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.orderId}>Order #{order.id}</Text>
        <Text style={styles.date}>{formatDateTime(order.date)}</Text>
        <Text style={styles.status}>{order.status}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items</Text>
        {order.items.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemName}>
              {item.name} x{item.quantity}
            </Text>
            <Text style={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal:</Text>
          <Text style={styles.totalValue}>{formatPrice(order.subtotal)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Shipping:</Text>
          <Text style={styles.totalValue}>{formatPrice(order.shipping)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tax:</Text>
          <Text style={styles.totalValue}>{formatPrice(order.tax)}</Text>
        </View>
        <View style={[styles.totalRow, styles.finalTotal]}>
          <Text style={styles.finalTotalLabel}>Total:</Text>
          <Text style={styles.finalTotalValue}>{formatPrice(order.total)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F6F6F6',
  },
  header: {
    marginBottom: 30,
  },
  orderId: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  status: {
    fontSize: 16,
    color: '#4ECDC4',
    textTransform: 'capitalize',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    color: '#666',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  finalTotal: {
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  finalTotalLabel: {
    fontSize: 20,
    fontWeight: '600',
  },
  finalTotalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
});


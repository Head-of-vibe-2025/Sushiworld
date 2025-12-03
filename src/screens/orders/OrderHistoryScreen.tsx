// Order History Screen

import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, formatDate } from '../../utils/formatting';
import type { NavigationParamList } from '../../types/app.types';

type OrderHistoryScreenNavigationProp = NativeStackNavigationProp<NavigationParamList, 'Orders'>;

export default function OrderHistoryScreen() {
  const navigation = useNavigation<OrderHistoryScreenNavigationProp>();
  const { user } = useAuth();

  // Placeholder orders - will be fetched from Foxy API
  const orders = [
    {
      id: '1',
      date: '2024-01-15T12:00:00Z',
      total: 45.50,
      status: 'completed',
      items: ['Salmon Nigiri', 'Tuna Roll'],
    },
    {
      id: '2',
      date: '2024-01-10T18:30:00Z',
      total: 32.00,
      status: 'completed',
      items: ['Dragon Roll', 'Miso Soup'],
    },
  ];

  const renderOrder = ({ item }: { item: typeof orders[0] }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderDate}>{formatDate(item.date)}</Text>
        <Text style={styles.orderStatus}>{item.status}</Text>
      </View>
      <Text style={styles.orderItems}>{item.items.join(', ')}</Text>
      <Text style={styles.orderTotal}>{formatPrice(item.total)}</Text>
    </TouchableOpacity>
  );

  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No orders yet</Text>
        <Text style={styles.emptySubtext}>Your order history will appear here</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    padding: 15,
  },
  orderCard: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderDate: {
    fontSize: 16,
    fontWeight: '600',
  },
  orderStatus: {
    fontSize: 14,
    color: '#4ECDC4',
    textTransform: 'capitalize',
  },
  orderItems: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
  },
});


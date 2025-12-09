// Points History Screen

import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { formatPoints, formatDate } from '../../utils/formatting';

export default function PointsHistoryScreen() {
  // Placeholder data - will be fetched from Supabase
  const transactions = [
    {
      id: '1',
      points: 450,
      source: 'purchase',
      description: 'Order #12345',
      date: '2024-01-15T12:00:00Z',
      status: 'credited',
    },
    {
      id: '2',
      points: -1000,
      source: 'redemption',
      description: 'Redeemed for €10 coupon',
      date: '2024-01-10T10:00:00Z',
      status: 'redeemed',
    },
    {
      id: '3',
      points: 1000,
      source: 'welcome_bonus',
      description: 'Welcome bonus',
      date: '2024-01-01T00:00:00Z',
      status: 'credited',
    },
  ];

  const renderTransaction = ({ item }: { item: typeof transactions[0] }) => {
    const isPositive = item.points > 0;
    return (
      <View style={styles.transactionCard}>
        <View style={styles.transactionHeader}>
          <Text style={styles.transactionDescription}>{item.description}</Text>
          <Text style={[styles.transactionPoints, isPositive && styles.positive]}>
            {isPositive ? '+' : ''}{formatPoints(item.points)}
          </Text>
        </View>
        <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
        <Text style={styles.transactionSource}>{item.source}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  list: {
    padding: 15,
  },
  transactionCard: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  transactionPoints: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  positive: {
    color: '#4ECDC4',
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  transactionSource: {
    fontSize: 12,
    color: '#999',
    textTransform: 'capitalize',
  },
});


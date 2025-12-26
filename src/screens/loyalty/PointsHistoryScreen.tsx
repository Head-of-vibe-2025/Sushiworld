// Points History Screen

import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { formatPoints, formatDate } from '../../utils/formatting';
import { getColors } from '../../theme/designTokens';

export default function PointsHistoryScreen() {
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  
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
      <View style={[styles.transactionCard, { backgroundColor: colors.background.card }]}>
        <View style={styles.transactionHeader}>
          <Text style={[styles.transactionDescription, { color: colors.text.primary }]}>{item.description}</Text>
          <Text style={[styles.transactionPoints, { color: isPositive ? colors.accent.green : colors.accent.pink }]}>
            {isPositive ? '+' : ''}{formatPoints(item.points)}
          </Text>
        </View>
        <Text style={[styles.transactionDate, { color: colors.text.secondary }]}>{formatDate(item.date)}</Text>
        <Text style={[styles.transactionSource, { color: colors.text.tertiary }]}>{item.source}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
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
  },
  list: {
    padding: 15,
  },
  transactionCard: {
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
  },
  transactionDate: {
    fontSize: 14,
    marginBottom: 5,
  },
  transactionSource: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
});


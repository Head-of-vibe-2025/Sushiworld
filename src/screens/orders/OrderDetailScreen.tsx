// Order Detail Screen

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../context/ThemeContext';
import { formatPrice, formatDateTime } from '../../utils/formatting';
import { spacing, getColors, typography } from '../../theme/designTokens';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Button } from '../../components/design-system';
import type { NavigationParamList } from '../../types/app.types';

type OrderDetailScreenRouteProp = RouteProp<NavigationParamList, 'OrderDetail'>;
type OrderDetailScreenNavigationProp = NativeStackNavigationProp<NavigationParamList, 'OrderDetail'>;

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
}

export default function OrderDetailScreen() {
  const route = useRoute<OrderDetailScreenRouteProp>();
  const navigation = useNavigation<OrderDetailScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const { orderId } = route.params;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Validate orderId
    if (!orderId || orderId.trim() === '') {
      setError(new Error('Invalid order ID'));
      setLoading(false);
      return;
    }

    // Simulate API call - TODO: Replace with actual Foxy API call
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Placeholder order - will be fetched from Foxy API
        // In production, this would be: const order = await getOrderById(orderId);
        const fetchedOrder: Order = {
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

        // Validate order data
        if (!fetchedOrder || !fetchedOrder.id) {
          throw new Error('Order not found');
        }

        setOrder(fetchedOrder);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load order'));
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Loading state
  if (loading) {
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
        <View style={[styles.centerContainer, { backgroundColor: colors.background.primary }]}>
          <LoadingSpinner />
        </View>
      </View>
    );
  }

  // Error state
  if (error || !order) {
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
        <View style={[styles.centerContainer, { backgroundColor: colors.background.primary }]}>
          <Text style={[styles.errorText, { color: colors.accent.pink }]}>Failed to load order</Text>
          <Text style={[styles.errorSubtext, { color: colors.text.secondary }]}>
            {error?.message || 'Order not found'}
          </Text>
          <View style={styles.errorButtonContainer}>
            <Button
              title="Go Back"
              onPress={() => navigation.goBack()}
              variant="secondary"
              size="medium"
            />
          </View>
        </View>
      </View>
    );
  }

  // Success state - render order details
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
        
        <View style={styles.orderHeader}>
          <Text style={[styles.orderId, { color: colors.text.primary }]}>Order #{order.id}</Text>
          <Text style={[styles.date, { color: colors.text.secondary }]}>{formatDateTime(order.date)}</Text>
          <View style={styles.statusContainer}>
            <Text style={[styles.status, { color: colors.accent.green }]}>{order.status}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Items</Text>
          {order.items && order.items.length > 0 ? (
            order.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={[styles.itemName, { color: colors.text.secondary }]}>
                  {item.name} x{item.quantity}
                </Text>
                <Text style={[styles.itemPrice, { color: colors.text.primary }]}>{formatPrice(item.price * item.quantity)}</Text>
              </View>
            ))
          ) : (
            <Text style={[styles.emptyItemsText, { color: colors.text.secondary }]}>No items found</Text>
          )}
        </View>

        <View style={styles.summarySection}>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.text.secondary }]}>Subtotal</Text>
            <Text style={[styles.totalValue, { color: colors.text.primary }]}>{formatPrice(order.subtotal || 0)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.text.secondary }]}>Shipping</Text>
            <Text style={[styles.totalValue, { color: colors.text.primary }]}>{formatPrice(order.shipping || 0)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.text.secondary }]}>Tax</Text>
            <Text style={[styles.totalValue, { color: colors.text.primary }]}>{formatPrice(order.tax || 0)}</Text>
          </View>
          <View style={[styles.dashedLine, { borderTopColor: colors.border.light }]} />
          <View style={[styles.totalRow, styles.finalTotal]}>
            <Text style={[styles.finalTotalLabel, { color: colors.text.primary }]}>Total</Text>
            <Text style={[styles.finalTotalValue, { color: colors.text.primary }]}>{formatPrice(order.total || 0)}</Text>
          </View>
        </View>
      </ScrollView>
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
  orderHeader: {
    marginBottom: spacing.xl,
  },
  orderId: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 34,
    marginBottom: spacing.sm,
  },
  date: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    marginBottom: spacing.base,
  },
  statusContainer: {
    alignSelf: 'flex-start',
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: typography.fontFamily.semibold,
    textTransform: 'capitalize',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.base,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
    paddingVertical: spacing.sm,
  },
  itemName: {
    fontSize: 16,
    fontFamily: typography.fontFamily.regular,
    flex: 1,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: typography.fontFamily.semibold,
  },
  summarySection: {
    marginTop: spacing.base,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: typography.fontFamily.medium,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: typography.fontFamily.semibold,
  },
  dashedLine: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    marginVertical: spacing.sm,
  },
  finalTotal: {
    marginTop: spacing.sm,
  },
  finalTotalLabel: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: typography.fontFamily.bold,
  },
  finalTotalValue: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: typography.fontFamily.bold,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.screenPadding,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: typography.fontFamily.semibold,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  errorButtonContainer: {
    marginTop: spacing.base,
  },
  emptyItemsText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    fontStyle: 'italic',
    paddingVertical: spacing.base,
  },
});


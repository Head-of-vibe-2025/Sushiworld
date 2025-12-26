// Order History Screen

import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/design-system';
import { formatPrice, formatDate } from '../../utils/formatting';
import { spacing, getColors, borderRadius, typography, getShadows } from '../../theme/designTokens';
// Using the same logo URL as MenuScreen
const SUSHIWORLD_LOGO_URL = 'https://lymingynfnunsrriiama.supabase.co/storage/v1/object/public/assets/logo.png';
import type { NavigationParamList } from '../../types/app.types';

type OrderHistoryScreenNavigationProp = NativeStackNavigationProp<NavigationParamList, 'Orders'>;

export default function OrderHistoryScreen() {
  const navigation = useNavigation<OrderHistoryScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const shadows = getShadows(isDark);
  const { user } = useAuth();

  // If user is not authenticated, show sign-in prompt
  if (!user) {
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

        <View style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: SUSHIWORLD_LOGO_URL }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.title, { color: colors.text.primary }]}>Order History</Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Sign in or create an account to view your order history
          </Text>
          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <Button
                title="Create Account"
                onPress={() => {
                  (navigation as any).navigate('Auth', { screen: 'Signup' });
                }}
                variant="primary"
                fullWidth
                size="medium"
              />
            </View>
            <View>
              <Button
                title="Sign In"
                onPress={() => {
                  (navigation as any).navigate('Auth', { screen: 'Login' });
                }}
                variant="secondary"
                fullWidth
                size="medium"
              />
            </View>
          </View>
        </View>
      </View>
    );
  }

  // Placeholder orders - will be fetched from Foxy API
  // Adding image URLs for demonstration - in real app, these would come from order items
  // Using images similar to what would appear first in the menu catalogue
  const orders = [
    {
      id: '1',
      date: '2024-01-15T12:00:00Z',
      total: 45.50,
      status: 'completed',
      items: ['Salmon Nigiri', 'Tuna Roll'],
      image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&h=400&fit=crop',
    },
    {
      id: '2',
      date: '2024-01-10T18:30:00Z',
      total: 32.00,
      status: 'completed',
      items: ['Dragon Roll', 'Miso Soup'],
      image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=400&fit=crop',
    },
  ];

  const renderOrder = ({ item }: { item: typeof orders[0] }) => (
    <TouchableOpacity
      style={styles.orderItemCard}
      onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
      activeOpacity={0.7}
    >
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
        <Text style={[styles.orderDate, { color: colors.text.primary }]}>{formatDate(item.date)}</Text>
        <Text style={[styles.orderItems, { color: colors.text.secondary }]} numberOfLines={2}>
          {item.items.join(', ')}
        </Text>
        <Text style={[styles.orderTotal, { color: colors.text.secondary }]}>{formatPrice(item.total)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (orders.length === 0) {
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
          <Text style={[styles.emptyText, { color: colors.text.secondary }]}>No orders yet</Text>
          <Text style={[styles.emptySubtext, { color: colors.text.tertiary }]}>Your order history will appear here</Text>
        </View>
      </View>
    );
  }

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
        <Text style={[styles.orderListTitle, { color: colors.text.primary }]}>Order History</Text>
        
        <View style={styles.itemsContainer}>
          <FlatList
            data={orders}
            renderItem={renderOrder}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          />
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
    height: 80,
  },
  orderListTitle: {
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
  orderItemCard: {
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
  orderDate: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 4,
  },
  orderItems: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: typography.fontFamily.medium,
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: typography.fontFamily.medium,
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
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    padding: spacing.screenPadding,
    justifyContent: 'center',
    paddingTop: 120,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl * 2,
  },
  logo: {
    width: 120,
    height: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: spacing.base,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing['3xl'],
    lineHeight: 24,
    paddingHorizontal: spacing.sm,
    fontFamily: typography.fontFamily.regular,
  },
  buttonContainer: {
    width: '100%',
  },
  buttonWrapper: {
    width: '100%',
    marginBottom: spacing.base,
  },
});


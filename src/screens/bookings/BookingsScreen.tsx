// Bookings Screen - Display all restaurants with booking and details options

import React from 'react';
import { View, Text, StyleSheet, FlatList, Linking, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../context/ThemeContext';
import { spacing, getColors, typography } from '../../theme/designTokens';
import { RestaurantCard } from '../../components/design-system';
import { restaurants } from '../../data/restaurants';
import type { NavigationParamList } from '../../types/app.types';
import type { Restaurant } from '../../types/restaurant.types';

type BookingsScreenNavigationProp = NativeStackNavigationProp<NavigationParamList, 'Bookings'>;

export default function BookingsScreen() {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const navigation = useNavigation<BookingsScreenNavigationProp>();

  const handleViewDetails = (restaurant: Restaurant) => {
    navigation.navigate('RestaurantDetail', { restaurantId: restaurant.id });
  };

  const handleBook = (restaurant: Restaurant) => {
    if (restaurant.bookingUrl) {
      navigation.navigate('BookingWebView', {
        bookingUrl: restaurant.bookingUrl,
        restaurantName: restaurant.name,
      });
    } else {
      Alert.alert(
        'Booking',
        `Booking link not available for ${restaurant.name}. Please call ${restaurant.phone} to make a reservation.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Call',
            onPress: () => {
              const phoneNumber = restaurant.phone.replace(/[^\d+]/g, '');
              Linking.openURL(`tel:${phoneNumber}`).catch(() => {
                Alert.alert('Error', 'Unable to make phone call');
              });
            },
          },
        ]
      );
    }
  };

  const renderRestaurant = ({ item }: { item: Restaurant }) => {
    return (
      <RestaurantCard
        restaurant={item}
        onViewDetails={() => handleViewDetails(item)}
        onBook={() => handleBook(item)}
        testID={`restaurant-${item.id}`}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.screenPadding }]}>
        <Text style={[styles.title, { color: colors.text.primary }]}>Restaurants</Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''} available
        </Text>
      </View>
      
      <FlatList
        data={restaurants}
        renderItem={renderRestaurant}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + spacing.screenPadding + 80 }]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.lg,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSizes['4xl'],
    fontWeight: typography.fontWeights.bold,
    letterSpacing: -0.5,
    lineHeight: typography.fontSizes['4xl'] * typography.lineHeights.tight,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSizes.base,
    fontFamily: typography.fontFamily.regular,
    lineHeight: typography.fontSizes.base * typography.lineHeights.normal,
  },
  listContent: {
    paddingHorizontal: spacing.screenPadding,
  },
});

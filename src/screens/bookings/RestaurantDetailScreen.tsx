// Restaurant Detail Screen - Show restaurant information and booking link

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { spacing, getColors, typography, getBorders } from '../../theme/designTokens';
import { Button, Card } from '../../components/design-system';
import { getRestaurantById } from '../../data/restaurants';
import type { NavigationParamList } from '../../types/app.types';

type RestaurantDetailScreenRouteProp = RouteProp<NavigationParamList, 'RestaurantDetail'>;
type RestaurantDetailScreenNavigationProp = NativeStackNavigationProp<NavigationParamList, 'RestaurantDetail'>;

// Back Arrow Icon
const BackArrowIcon = ({ color, size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18L9 12L15 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Location Pin Icon
const LocationIcon = ({ color, size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
      fill={color}
    />
  </Svg>
);

// Phone Icon
const PhoneIcon = ({ color, size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"
      fill={color}
    />
  </Svg>
);

// Clock Icon
const ClockIcon = ({ color, size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 13H7V11H12V6H13V13Z"
      fill={color}
    />
  </Svg>
);

// Delivery Icon
const DeliveryIcon = ({ color, size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 8H17V4H3C1.9 4 1 4.9 1 6V18C1 19.1 1.9 20 3 20H17C18.1 20 19 19.1 19 18V10H20C20.55 10 21 9.55 21 9V9C21 8.45 20.55 8 20 8ZM17 18H3V6H17V18ZM19 3.5C19 2.67 19.67 2 20.5 2C21.33 2 22 2.67 22 3.5C22 4.33 21.33 5 20.5 5C19.67 5 19 4.33 19 3.5Z"
      fill={color}
    />
  </Svg>
);

export default function RestaurantDetailScreen() {
  const route = useRoute<RestaurantDetailScreenRouteProp>();
  const navigation = useNavigation<RestaurantDetailScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const borders = getBorders(isDark);
  const { restaurantId } = route.params;

  const restaurant = getRestaurantById(restaurantId);

  const handleBack = () => {
    navigation.goBack();
  };

  const handlePhonePress = () => {
    if (restaurant) {
      const phoneNumber = restaurant.phone.replace(/[^\d+]/g, '');
      Linking.openURL(`tel:${phoneNumber}`).catch(() => {
        Alert.alert('Error', 'Unable to make phone call');
      });
    }
  };

  const handleBookingPress = () => {
    if (restaurant?.bookingUrl) {
      navigation.navigate('BookingWebView', {
        bookingUrl: restaurant.bookingUrl,
        restaurantName: restaurant.name,
      });
    } else {
      Alert.alert('Booking', 'Booking link not available for this restaurant. Please call to make a reservation.');
    }
  };

  if (!restaurant) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <View style={[styles.header, { paddingTop: insets.top + spacing.screenPadding }]}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <BackArrowIcon color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: colors.text.primary }]}>Restaurant not found</Text>
        </View>
      </View>
    );
  }

  const fullAddress = `${restaurant.address.street}, ${restaurant.address.postalCode} ${restaurant.address.city}${restaurant.address.country ? `, ${restaurant.address.country}` : ''}`;

  const days = [
    { key: 'monday', label: 'Lundi' },
    { key: 'tuesday', label: 'Mardi' },
    { key: 'wednesday', label: 'Mercredi' },
    { key: 'thursday', label: 'Jeudi' },
    { key: 'friday', label: 'Vendredi' },
    { key: 'saturday', label: 'Samedi' },
    { key: 'sunday', label: 'Dimanche' },
  ] as const;

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.screenPadding }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <BackArrowIcon color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]} numberOfLines={1}>
          {restaurant.name}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.screenPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Contact Information */}
        <Card variant="elevated" style={styles.section}>
          <View style={styles.infoRow}>
            <LocationIcon color={colors.text.secondary} size={20} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Address</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>{fullAddress}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border.light }]} />

          <TouchableOpacity style={styles.infoRow} onPress={handlePhonePress}>
            <PhoneIcon color={colors.text.secondary} size={20} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Phone</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>{restaurant.phone}</Text>
            </View>
          </TouchableOpacity>
        </Card>

        {/* Opening Hours */}
        <Card variant="elevated" style={styles.section}>
          <View style={styles.sectionHeader}>
            <ClockIcon color={colors.text.primary} size={20} />
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Opening Hours</Text>
          </View>
          <View style={styles.hoursContainer}>
            {days.map((day) => (
              <View key={day.key} style={styles.hourRow}>
                <Text style={[styles.dayLabel, { color: colors.text.secondary }]}>{day.label}</Text>
                <Text style={[styles.hourValue, { color: colors.text.primary }]}>
                  {restaurant.openingHours[day.key]}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Delivery Information */}
        {restaurant.deliveryInfo && (
          <Card variant="elevated" style={styles.section}>
            <View style={styles.sectionHeader}>
              <DeliveryIcon color={colors.text.primary} size={20} />
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Delivery</Text>
            </View>
            {restaurant.deliveryInfo.radius && (
              <Text style={[styles.deliveryText, { color: colors.text.secondary }]}>
                Livraison dans un rayon de {restaurant.deliveryInfo.radius}
              </Text>
            )}
            {restaurant.deliveryInfo.postalCodes && (
              <View style={styles.postalCodesContainer}>
                <Text style={[styles.deliveryText, { color: colors.text.secondary, marginBottom: spacing.sm }]}>
                  Postal codes:
                </Text>
                <Text style={[styles.postalCodes, { color: colors.text.secondary }]}>
                  {restaurant.deliveryInfo.postalCodes.join(', ')}
                </Text>
              </View>
            )}
            {restaurant.deliveryInfo.restrictions && restaurant.deliveryInfo.restrictions.length > 0 && (
              <View style={styles.restrictionsContainer}>
                {restaurant.deliveryInfo.restrictions.map((restriction, index) => (
                  <Text key={index} style={[styles.restrictionText, { color: colors.accent.pink }]}>
                    {restriction}
                  </Text>
                ))}
              </View>
            )}
          </Card>
        )}

        {/* Associated Locations */}
        {restaurant.associatedLocations && restaurant.associatedLocations.length > 0 && (
          <Card variant="elevated" style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary, marginBottom: spacing.sm }]}>
              Service Areas
            </Text>
            <Text style={[styles.locationsText, { color: colors.text.secondary }]}>
              {restaurant.associatedLocations.join(' - ')}
            </Text>
          </Card>
        )}

        {/* Booking Button */}
        <Button
          title="Make a Booking"
          onPress={handleBookingPress}
          variant="primary"
          size="large"
          fullWidth
          style={styles.bookingButton}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.md,
  },
  backButton: {
    padding: spacing.sm,
    marginLeft: -spacing.sm,
  },
  headerTitle: {
    flex: 1,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSizes['2xl'],
    fontWeight: typography.fontWeights.bold,
    textAlign: 'center',
    marginHorizontal: spacing.md,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.screenPadding,
    gap: spacing.lg,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
  },
  errorText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSizes.xl,
  },
  section: {
    marginBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSizes.sm,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSizes.base,
    lineHeight: typography.fontSizes.base * typography.lineHeights.normal,
  },
  divider: {
    height: 1,
    marginVertical: spacing.md,
  },
  hoursContainer: {
    gap: spacing.sm,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  dayLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSizes.base,
    flex: 1,
  },
  hourValue: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSizes.base,
    textAlign: 'right',
  },
  deliveryText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSizes.base,
    lineHeight: typography.fontSizes.base * typography.lineHeights.normal,
  },
  postalCodesContainer: {
    marginTop: spacing.sm,
  },
  postalCodes: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSizes.sm,
    lineHeight: typography.fontSizes.sm * typography.lineHeights.relaxed,
  },
  restrictionsContainer: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  restrictionText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSizes.sm,
    fontStyle: 'italic',
  },
  locationsText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSizes.base,
    lineHeight: typography.fontSizes.base * typography.lineHeights.relaxed,
  },
  bookingButton: {
    marginTop: spacing.md,
  },
});


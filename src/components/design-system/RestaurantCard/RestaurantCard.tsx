// RestaurantCard Component
// Card component matching the design with image at top, rating, and details button

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../../context/ThemeContext';
import { getColors, borderRadius, spacing, typography } from '../../../theme/designTokens';
import { Card } from '../';
import type { Restaurant } from '../../../types/restaurant.types';

export interface RestaurantCardProps {
  restaurant: Restaurant;
  onViewDetails: () => void;
  onBook?: () => void;
  testID?: string;
}

// Clock Icon
const ClockIcon = ({ color, size = 16 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 13H7V11H12V6H13V13Z"
      fill={color}
    />
  </Svg>
);

// Heart Icon (Favorite)
const HeartIcon = ({ 
  color, 
  size = 24, 
  filled = false 
}: { 
  color?: string; 
  size?: number; 
  filled?: boolean;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
      fill={filled ? color : 'none'}
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default function RestaurantCard({
  restaurant,
  onViewDetails,
  onBook,
  testID,
}: RestaurantCardProps) {
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Get today's opening hours and status
  const getTodayHours = () => {
    const today = new Date().getDay();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayKey = days[today] as keyof typeof restaurant.openingHours;
    const hours = restaurant.openingHours[dayKey];
    
    if (hours === 'Fermé' || hours === 'Closed') {
      return { text: 'Closed', isOpen: false };
    }
    
    // Parse hours to determine if currently open
    // Simple check - if it contains time ranges, show "Open Until X"
    const match = hours.match(/(\d{1,2}):(\d{2})/g);
    if (match && match.length > 0) {
      const lastTime = match[match.length - 1];
      return { text: `Open Until ${lastTime}`, isOpen: true };
    }
    
    return { text: hours, isOpen: true };
  };

  const todayStatus = getTodayHours();

  // Default placeholder image if restaurant image fails to load
  const defaultImage = 'https://via.placeholder.com/400x200/4A5568/FFFFFF?text=Sushi+Restaurant';

  return (
    <TouchableOpacity
      onPress={onViewDetails}
      activeOpacity={0.9}
      testID={testID}
    >
      <Card variant="elevated" style={styles.card}>
        {/* Restaurant Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ 
              uri: imageError ? defaultImage : (restaurant.image || defaultImage)
            }}
            style={styles.image}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />

          {/* Favorite Button */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => setIsFavorite(!isFavorite)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <HeartIcon 
              color={isFavorite ? colors.accent.pink : colors.text.inverse} 
              size={24}
              filled={isFavorite}
            />
          </TouchableOpacity>
        </View>

        {/* Restaurant Info */}
        <View style={styles.content}>
          {/* Restaurant Name */}
          <Text style={[styles.name, { color: colors.text.primary }]} numberOfLines={1}>
            {restaurant.name}
          </Text>

          {/* Opening Hours */}
          <View style={styles.infoRow}>
            <ClockIcon color={colors.text.secondary} size={16} />
            <Text style={[styles.infoText, { color: colors.text.secondary }]}>
              {todayStatus.text}
            </Text>
          </View>

          {/* Action Button */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.bookButton, { backgroundColor: colors.primary.black }]}
              onPress={onBook || (() => {})}
              activeOpacity={0.8}
            >
              <Text style={[styles.buttonText, { color: colors.text.inverse }]}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    padding: 0,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    padding: spacing.xs,
  },
  content: {
    padding: spacing.cardPadding,
    gap: spacing.sm,
  },
  name: {
    fontFamily: typography.productName.fontFamily,
    fontSize: typography.productName.fontSize,
    fontWeight: typography.productName.fontWeight,
    lineHeight: typography.productName.fontSize * typography.productName.lineHeight,
    marginBottom: spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoText: {
    fontFamily: typography.bodyText.fontFamily,
    fontSize: typography.fontSizes.sm,
    lineHeight: typography.fontSizes.sm * typography.lineHeights.normal,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  bookButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semibold,
  },
});

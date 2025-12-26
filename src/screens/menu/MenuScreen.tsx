// Menu Screen - Modern UI Design

import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import Svg, { Path, Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCart } from '../../context/CartContext';
import { useRegion } from '../../context/RegionContext';
import { useTheme } from '../../context/ThemeContext';
import { useMenuItems, useCategories } from '../../hooks/useFoxyProducts';
import LoadingSpinner from '../../components/LoadingSpinner';
import { SearchBar, FilterTag } from '../../components/design-system';
import { formatPrice } from '../../utils/formatting';
import { spacing, getColors, typography } from '../../theme/designTokens';
import type { NavigationParamList } from '../../types/app.types';
import type { WebflowMenuItem } from '../../types/webflow.types';

import { LOGO_URL } from '../../utils/constants';

type MenuScreenNavigationProp = NativeStackNavigationProp<NavigationParamList, 'Menu'>;

const SUSHIWORLD_LOGO_URL = 'https://lymingynfnunsrriiama.supabase.co/storage/v1/object/public/assets/logo.png';

// Bag 6 Icon Component (for cart button) - now theme-aware
const Bag6Icon = ({ color, size = 32 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3.79418 14.9709C4.33135 17.6567 4.59993 18.9996 5.4874 19.8646C5.65142 20.0244 5.82888 20.1699 6.0178 20.2994C7.03998 21 8.4095 21 11.1485 21H12.8515C15.5905 21 16.96 21 17.9822 20.2994C18.1711 20.1699 18.3486 20.0244 18.5126 19.8646C19.4001 18.9996 19.6687 17.6567 20.2058 14.9709C20.977 11.1149 21.3626 9.18686 20.475 7.82067C20.3142 7.5733 20.1266 7.34447 19.9156 7.13836C18.75 6 16.7838 6 12.8515 6H11.1485C7.21616 6 5.24998 6 4.0844 7.13836C3.87336 7.34447 3.68576 7.5733 3.52504 7.82067C2.63738 9.18686 3.02298 11.1149 3.79418 14.9709Z"
      stroke={color}
      strokeWidth="2"
    />
    <Circle opacity="0.5" cx="15" cy="10" r="1" fill={color} />
    <Circle opacity="0.5" cx="9" cy="10" r="1" fill={color} />
    <Path
      d="M9 6V5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5V6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// Heart Icon Component (for liked products)
const HeartIcon = ({ 
  color = '#1C274C', 
  size = 26, 
  isLiked = false 
}: { 
  color?: string; 
  size?: number; 
  isLiked?: boolean;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8.96173 18.9106L9.58082 18.1253L8.96173 18.9106ZM12 5.50039L11.2795 6.19386C11.468 6.38972 11.7282 6.50039 12 6.50039C12.2718 6.50039 12.532 6.38972 12.7205 6.19386L12 5.50039ZM15.0383 18.9106L15.6574 19.696L15.0383 18.9106ZM8.96173 18.9106L9.58082 18.1253C8.05033 16.9188 6.42071 15.7723 5.12521 14.3135C3.864 12.8934 3 11.2562 3 9.13685H2H1C1 11.8804 2.14571 13.9704 3.62979 15.6416C5.07958 17.2741 6.93083 18.583 8.34265 19.696L8.96173 18.9106ZM2 9.13685H3C3 7.07952 4.16214 5.36721 5.72829 4.65132C7.2314 3.96425 9.28552 4.12217 11.2795 6.19386L12 5.50039L12.7205 4.80692C10.2146 2.20343 7.26876 1.74813 4.89683 2.83234C2.58794 3.88775 1 6.33125 1 9.13685H2ZM8.96173 18.9106L8.34265 19.696C8.85258 20.098 9.41592 20.5397 9.99069 20.8755C10.5651 21.2112 11.2461 21.4998 12 21.4998V20.4998V19.4998C11.7539 19.4998 11.4349 19.403 10.9997 19.1487C10.565 18.8947 10.1091 18.5418 9.58082 18.1253L8.96173 18.9106ZM15.0383 18.9106L15.6574 19.696C17.0692 18.583 18.9204 17.2741 20.3702 15.6416C21.8543 13.9704 23 11.8804 23 9.13685H22H21C21 11.2562 20.136 12.8934 18.8748 14.3135C17.5793 15.7723 15.9497 16.9188 14.4192 18.1253L15.0383 18.9106ZM22 9.13685H23C23 6.33125 21.4121 3.88775 19.1032 2.83234C16.7312 1.74813 13.7854 2.20343 11.2795 4.80692L12 5.50039L12.7205 6.19386C14.7145 4.12217 16.7686 3.96425 18.2717 4.65132C19.8379 5.36721 21 7.07952 21 9.13685H22ZM15.0383 18.9106L14.4192 18.1253C13.8909 18.5418 13.435 18.8947 13.0003 19.1487C12.5651 19.403 12.2461 19.4998 12 19.4998V20.4998V21.4998C12.7539 21.4998 13.4349 21.2112 14.0093 20.8755C14.5841 20.5397 15.1474 20.0979 15.6574 19.696L15.0383 18.9106Z"
      fill={isLiked ? color : 'none'}
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default function MenuScreen() {
  console.log('🔄 MenuScreen RENDERED - Modern UI Version');
  const navigation = useNavigation<MenuScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const { getItemCount, items, addItem, updateQuantity } = useCart();
  const { region } = useRegion();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: menuItems, isLoading: itemsLoading, error } = useMenuItems(selectedCategory);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());

  const filteredMenuItems = menuItems?.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleFilterToggle = (categoryId: string) => {
    setActiveFilters(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
    setSelectedCategory(categoryId === selectedCategory ? undefined : categoryId);
  };

  const handleRemoveFilter = (categoryId: string) => {
    setActiveFilters(prev => prev.filter(id => id !== categoryId));
    if (selectedCategory === categoryId) {
      setSelectedCategory(undefined);
    }
  };

  const renderCategory = ({ item }: { item: { id: string; name: string } }) => (
    <FilterTag
      label={item.name}
      active={selectedCategory === item.id}
      onPress={() => handleFilterToggle(item.id)}
    />
  );

  const renderHeader = () => (
    <>
      <View style={[styles.headerContent, { backgroundColor: colors.background.primary }]}>
        <View style={styles.titleContainer}>
          <Text style={[styles.titleLine1, { color: colors.text.primary }]}>Sushi lover?</Text>
          <Text style={[styles.titleLine2, { color: colors.text.primary }]}>Order & Eat.</Text>
        </View>
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search your item"
            onFilterPress={() => {}}
          />
        </View>
      </View>

      {activeFilters.length > 0 && (
        <View style={[styles.activeFiltersContainer, { backgroundColor: colors.background.primary }]}>
          <Text style={[styles.discoverFoodText, { color: colors.text.primary }]}>Discover food</Text>
          <FlatList
            horizontal
            data={activeFilters.map(id => categories?.find(c => c.id === id)).filter((item): item is NonNullable<typeof item> => Boolean(item))}
            renderItem={({ item }) => (
              <FilterTag
                label={`${item.name} X`}
                showClose
                onClose={() => handleRemoveFilter(item.id)}
                active
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.activeFiltersList}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}

      {categories && categories.length > 0 && !activeFilters.length && (
        <View style={[styles.categoryContainer, { backgroundColor: colors.background.primary }]}>
          <Text style={[styles.discoverFoodText, { color: colors.text.primary }]}>Discover food</Text>
          <FlatList
            horizontal
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.categoryList}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}
    </>
  );

  const renderMenuItem = ({ item }: { item: WebflowMenuItem }) => {
    const cartItem = items.find(i => i.id === item.id);
    const quantity = cartItem?.quantity || 0;
    const isLiked = likedProducts.has(item.id);
    
    const handleDecrease = () => {
      if (quantity > 0) {
        updateQuantity(item.id, quantity - 1);
      }
    };

    const handleIncrease = () => {
      if (quantity === 0) {
        addItem({
          id: item.id,
          name: item.name,
          code: item.code,
          price: item.price,
          image: item.image,
        });
      } else {
        updateQuantity(item.id, quantity + 1);
      }
    };

    const handleToggleLike = () => {
      setLikedProducts(prev => {
        const newSet = new Set(prev);
        if (newSet.has(item.id)) {
          newSet.delete(item.id);
        } else {
          newSet.add(item.id);
        }
        return newSet;
      });
    };
    
    return (
      <TouchableOpacity
        style={[styles.productCard, { backgroundColor: colors.background.card }]}
        onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
        activeOpacity={0.9}
      >
        <View style={styles.productImageContainer}>
          {item.image ? (
            <Image 
              source={{ uri: item.image }} 
              style={styles.productImage}
              onError={() => console.log(`Failed to load image for ${item.name}`)}
            />
          ) : (
            <View style={[styles.placeholderImage, { backgroundColor: colors.border.light }]}>
              <Text style={[styles.placeholderText, { color: colors.text.tertiary }]}>No Image</Text>
            </View>
          )}
        </View>
        <View style={styles.productInfo}>
          <Text style={[styles.productName, { color: colors.text.primary }]}>{item.name}</Text>
          <Text style={[styles.productPrice, { color: colors.text.secondary }]}>{formatPrice(item.price)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (categoriesLoading || itemsLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background.primary }]}>
        <LoadingSpinner />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background.primary }]}>
        <Text style={[styles.errorText, { color: colors.accent.pink }]}>Failed to load menu</Text>
        <Text style={[styles.errorSubtext, { color: colors.text.secondary }]}>
          {error instanceof Error ? error.message : String(error)}
        </Text>
      </View>
    );
  }

  const stickyHeaderHeight = insets.top + spacing.screenPadding + 40 + spacing.base; // safe area + padding + logo + bottom padding
  const headerTopOffset = insets.top + spacing.screenPadding + 40 - spacing.base; // safe area + padding + logo height - more reduced spacing

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <BlurView
        intensity={80}
        tint={isDark ? 'dark' : 'light'}
        style={[styles.stickyHeader, { paddingTop: insets.top + spacing.screenPadding, backgroundColor: isDark ? 'rgba(31, 31, 31, 0.4)' : 'rgba(246, 246, 246, 0.4)' }]}
      >
        <TouchableOpacity
          style={styles.logoButton}
          onPress={() => {}}
        >
          <Image
            source={{ uri: SUSHIWORLD_LOGO_URL }}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <Bag6Icon color={colors.text.primary} size={32} />
          {getItemCount() > 0 && (
            <View style={[styles.cartBadge, { backgroundColor: colors.accent.pink }]}>
              <Text style={[styles.cartBadgeText, { color: colors.text.inverse }]}>
                {getItemCount() > 99 ? '99+' : getItemCount().toString()}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </BlurView>
      <FlatList
        data={filteredMenuItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={[styles.productsList, { paddingTop: headerTopOffset }]}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentInsetAdjustmentBehavior="automatic"
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
              {searchQuery ? 'No items found' : 'No items available'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.base,
    zIndex: 1000,
  },
  headerContent: {
    paddingTop: 0,
    paddingBottom: spacing.base,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.base,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  logoButton: {
    padding: spacing.sm,
  },
  logo: {
    width: 40,
    height: 40,
  },
  titleContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  titleLine1: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 34,
    marginBottom: spacing.xs,
  },
  titleLine2: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 24,
    fontWeight: '400',
    letterSpacing: -0.5,
    lineHeight: 29,
  },
  cartButton: {
    position: 'relative',
    padding: spacing.sm,
    marginTop: spacing.xs,
  },
  cartIcon: {
    fontSize: 24,
  },
  cartBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  cartBadgeText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 11,
    fontWeight: '700',
  },
  searchContainer: {
    marginTop: spacing.base,
  },
  discoverFoodText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  categoryContainer: {
    paddingVertical: spacing.md,
  },
  categoryList: {
    gap: spacing.sm,
    alignItems: 'center',
  },
  activeFiltersContainer: {
    paddingVertical: spacing.md,
  },
  activeFiltersList: {
    gap: spacing.sm,
    alignItems: 'center',
  },
  productsList: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: 100,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: spacing.base,
  },
  productCard: {
    width: '48%',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: spacing.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 25,
  },
  productImageContainer: {
    position: 'relative',
    width: '100%',
    height: 160,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 12,
    fontWeight: '400',
  },
  productInfo: {
    padding: spacing.base,
    alignItems: 'center',
  },
  productName: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  productPrice: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '400',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
  },
});



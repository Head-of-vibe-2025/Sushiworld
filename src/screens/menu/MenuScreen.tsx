// Menu Screen - Modern UI Design

import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCart } from '../../context/CartContext';
import { useRegion } from '../../context/RegionContext';
import { useMenuItems, useCategories } from '../../hooks/useFoxyProducts';
import LoadingSpinner from '../../components/LoadingSpinner';
import { SearchBar } from '../../components/design-system';
import { formatPrice } from '../../utils/formatting';
import { spacing } from '../../theme/designTokens';
import type { NavigationParamList } from '../../types/app.types';
import type { WebflowMenuItem } from '../../types/webflow.types';

import { LOGO_URL } from '../../utils/constants';

type MenuScreenNavigationProp = NativeStackNavigationProp<NavigationParamList, 'Menu'>;

export default function MenuScreen() {
  console.log('🔄 MenuScreen RENDERED - Modern UI Version');
  const navigation = useNavigation<MenuScreenNavigationProp>();
  const { getItemCount, items, addItem, updateQuantity } = useCart();
  const { region } = useRegion();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: menuItems, isLoading: itemsLoading, error } = useMenuItems(selectedCategory);

  const filteredMenuItems = menuItems?.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const renderCategory = ({ item }: { item: { id: string; name: string } }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === item.id && styles.categoryChipActive,
      ]}
      onPress={() => setSelectedCategory(item.id === selectedCategory ? undefined : item.id)}
    >
      <Text
        style={[
          styles.categoryChipText,
          selectedCategory === item.id && styles.categoryChipTextActive,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderMenuItem = ({ item }: { item: WebflowMenuItem }) => {
    const cartItem = items.find(i => i.id === item.id);
    const quantity = cartItem?.quantity || 0;
    
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
    
    return (
      <View style={styles.menuCard}>
        <TouchableOpacity
          style={styles.menuCardContent}
          onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
          activeOpacity={0.7}
        >
          {item.image && (
            <Image source={{ uri: item.image }} style={styles.menuImage} />
          )}
          <View style={styles.menuInfo}>
            <Text style={styles.menuName}>{item.name}</Text>
            <Text style={styles.menuPrice}>{formatPrice(item.price)}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.quantityControls}>
          {quantity > 0 ? (
            <>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleDecrease}
                activeOpacity={0.7}
              >
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>
              <View style={styles.quantityDisplay}>
                <Text style={styles.quantityText}>{quantity}</Text>
              </View>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleIncrease}
                activeOpacity={0.7}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleIncrease}
              activeOpacity={0.7}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (categoriesLoading || itemsLoading) {
    return (
      <View style={styles.centerContainer}>
        <LoadingSpinner />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load menu</Text>
        <Text style={styles.errorSubtext}>{error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.leftSection}>
            <TouchableOpacity
              style={styles.menuIconButton}
              onPress={() => {}}
            >
              <View style={styles.menuIconGrid}>
                <View style={styles.menuIconDot} />
                <View style={styles.menuIconDot} />
                <View style={styles.menuIconDot} />
                <View style={styles.menuIconDot} />
              </View>
            </TouchableOpacity>
            <Image
              source={{ uri: LOGO_URL }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.titleLine1}>Sushi lover?</Text>
            <Text style={styles.titleLine2}>Order and eat!</Text>
          </View>
          <TouchableOpacity
            style={styles.cartIconButton}
            onPress={() => navigation.navigate('Cart')}
          >
            {getItemCount() > 0 && (
              <View style={styles.cartBadgeSmall}>
                <Text style={styles.cartBadgeSmallText}>{getItemCount()}</Text>
              </View>
            )}
            <Text style={styles.cartIcon}>🛒</Text>
          </TouchableOpacity>
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

      {categories && categories.length > 0 && (
        <View style={styles.categoryContainer}>
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

      <FlatList
        data={filteredMenuItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        numColumns={1}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
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
    backgroundColor: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.base,
    backgroundColor: '#FFFFFF',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  leftSection: {
    alignItems: 'flex-start',
    marginRight: spacing.md,
  },
  menuIconButton: {
    padding: 8,
    marginBottom: 8,
  },
  menuIconGrid: {
    width: 24,
    height: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuIconDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000',
  },
  logo: {
    width: 80,
    height: 30,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  titleLine1: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  titleLine2: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    letterSpacing: -0.5,
  },
  cartIconButton: {
    position: 'relative',
    padding: 8,
    marginLeft: spacing.md,
  },
  cartIcon: {
    fontSize: 24,
  },
  cartBadgeSmall: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    zIndex: 1,
  },
  cartBadgeSmallText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  searchContainer: {
    marginTop: 0,
  },
  categoryContainer: {
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  categoryList: {
    paddingHorizontal: 15,
    gap: 10,
    alignItems: 'center',
  },
  categoryChip: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryChipActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  list: {
    paddingTop: 20,
    paddingBottom: 100,
    backgroundColor: '#FFFFFF',
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuCardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    resizeMode: 'cover',
    marginRight: 12,
  },
  menuInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  menuName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    color: '#1a1a1a',
    letterSpacing: -0.3,
  },
  menuPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: -0.3,
  },
  quantityControls: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 12,
    justifyContent: 'center',
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 3,
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 22,
  },
  quantityDisplay: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 3,
  },
  quantityText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 26,
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#999',
    fontWeight: '400',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF6B6B',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#999',
  },
});


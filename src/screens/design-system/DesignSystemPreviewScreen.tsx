// Design System Preview Screen
// Showcase all design system components

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { NavigationParamList } from '../../types/app.types';

// Design System Components
import {
  Button,
  Card,
  ProductCard,
  CartItem,
  SearchBar,
  FilterTag,
  QuantitySelector,
  Rating,
  Header,
  SectionHeader,
  Typography,
  OrderSummary,
  NavigationBar,
  ScreenTitle,
  ProductName,
  Price,
  BodyText,
} from '../../components/design-system';
import { colors, spacing } from '../../theme/designTokens';

type DesignSystemPreviewScreenNavigationProp = NativeStackNavigationProp<
  NavigationParamList,
  'DesignSystemPreview'
>;

export default function DesignSystemPreviewScreen() {
  const navigation = useNavigation<DesignSystemPreviewScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cartQuantity, setCartQuantity] = useState(2);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const sampleImageUri = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400';

  return (
    <View style={styles.container}>
      <Header
        title="Design System Preview"
        onBackPress={() => navigation.goBack()}
        testID="preview-header"
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Typography Section */}
        <SectionHeader title="Typography" />
        <Card variant="outlined" style={styles.sectionCard}>
          <ScreenTitle>Screen Title</ScreenTitle>
          <View style={styles.spacer} />
          <ProductName>Product Name</ProductName>
          <View style={styles.spacer} />
          <BodyText>Body text - Regular paragraph text that is readable and clear.</BodyText>
          <View style={styles.spacer} />
          <BodyText color="secondary">Secondary text - Less prominent information.</BodyText>
          <View style={styles.spacer} />
          <Price>$24.99</Price>
        </Card>

        {/* Buttons Section */}
        <SectionHeader title="Buttons" />
        <Card variant="outlined" style={styles.sectionCard}>
          <Button
            title="Primary Button"
            onPress={() => Alert.alert('Pressed', 'Primary button pressed')}
            variant="primary"
            style={styles.buttonSpacing}
          />
          <Button
            title="Secondary Button"
            onPress={() => Alert.alert('Pressed', 'Secondary button pressed')}
            variant="secondary"
            style={styles.buttonSpacing}
          />
          <Button
            title="Small Button"
            onPress={() => {}}
            size="small"
            style={styles.buttonSpacing}
          />
          <Button
            title="Large Button"
            onPress={() => {}}
            size="large"
            style={styles.buttonSpacing}
          />
          <Button
            title="Full Width"
            onPress={() => {}}
            fullWidth
            style={styles.buttonSpacing}
          />
          <Button
            title="Loading..."
            onPress={() => {}}
            loading
            style={styles.buttonSpacing}
          />
          <Button
            title="Disabled"
            onPress={() => {}}
            disabled
            style={styles.buttonSpacing}
          />
        </Card>

        {/* Search Bar Section */}
        <SectionHeader title="Search Bar" />
        <Card variant="outlined" style={styles.sectionCard}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search your item"
            onFilterPress={() => Alert.alert('Filter', 'Filter pressed')}
          />
          <BodyText color="secondary" style={styles.hintText}>
            Search query: {searchQuery || '(empty)'}
          </BodyText>
        </Card>

        {/* Filter Tags Section */}
        <SectionHeader title="Filter Tags" />
        <Card variant="outlined" style={styles.sectionCard}>
          <View style={styles.tagsContainer}>
            <FilterTag
              label="Vanilla flavour"
              active={selectedTag === 'vanilla'}
              onPress={() => setSelectedTag(selectedTag === 'vanilla' ? null : 'vanilla')}
            />
            <FilterTag
              label="Chocolate flavour"
              active={selectedTag === 'chocolate'}
              onPress={() => setSelectedTag(selectedTag === 'chocolate' ? null : 'chocolate')}
            />
            <FilterTag
              label="Strawberry"
              active={selectedTag === 'strawberry'}
              onPress={() => setSelectedTag(selectedTag === 'strawberry' ? null : 'strawberry')}
            />
            <FilterTag
              label="With Close"
              showClose
              onClose={() => Alert.alert('Closed', 'Tag closed')}
            />
          </View>
        </Card>

        {/* Rating Section */}
        <SectionHeader title="Rating" />
        <Card variant="outlined" style={styles.sectionCard}>
          <Rating value={5.0} size="medium" />
          <View style={styles.spacer} />
          <Rating value={4.5} size="medium" />
          <View style={styles.spacer} />
          <Rating value={3.0} size="small" />
          <View style={styles.spacer} />
          <Rating value={4.8} size="medium" showValue={false} />
        </Card>

        {/* Quantity Selector Section */}
        <SectionHeader title="Quantity Selector" />
        <Card variant="outlined" style={styles.sectionCard}>
          <View style={styles.quantityRow}>
            <BodyText>Medium size:</BodyText>
            <QuantitySelector
              quantity={quantity}
              onIncrement={() => setQuantity(quantity + 1)}
              onDecrement={() => setQuantity(Math.max(0, quantity - 1))}
              min={0}
              max={10}
            />
          </View>
          <View style={styles.spacer} />
          <View style={styles.quantityRow}>
            <BodyText>Small size:</BodyText>
            <QuantitySelector
              quantity={cartQuantity}
              onIncrement={() => setCartQuantity(cartQuantity + 1)}
              onDecrement={() => setCartQuantity(Math.max(0, cartQuantity - 1))}
              min={0}
              size="small"
            />
          </View>
        </Card>

        {/* Cards Section */}
        <SectionHeader title="Cards" />
        <Card variant="default" style={styles.sectionCard}>
          <BodyText>Default Card - No shadow, no border</BodyText>
        </Card>
        <View style={styles.spacer} />
        <Card variant="elevated" style={styles.sectionCard}>
          <BodyText>Elevated Card - With shadow</BodyText>
        </Card>
        <View style={styles.spacer} />
        <Card variant="outlined" style={styles.sectionCard}>
          <BodyText>Outlined Card - With border</BodyText>
        </Card>
        <View style={styles.spacer} />
        <Card
          variant="elevated"
          onPress={() => Alert.alert('Card Pressed', 'This card is tappable')}
          style={styles.sectionCard}
        >
          <BodyText>Tappable Card - Press me!</BodyText>
        </Card>

        {/* Product Card Section */}
        <SectionHeader title="Product Card" />
        <View style={styles.productGrid}>
          <ProductCard
            imageUri={sampleImageUri}
            name="Scoops Ice Cream"
            price="Starting From $5"
            rating={5.0}
            onPress={() => Alert.alert('Product', 'Scoops Ice Cream pressed')}
          />
          <ProductCard
            imageUri={sampleImageUri}
            name="Popsicles"
            price="Starting From $10"
            rating={4.5}
            onPress={() => Alert.alert('Product', 'Popsicles pressed')}
          />
        </View>

        {/* Cart Item Section */}
        <SectionHeader title="Cart Item" />
        <Card variant="outlined" style={styles.sectionCard}>
          <CartItem
            imageUri={sampleImageUri}
            name="Scoops"
            price="$12.50"
            quantity={cartQuantity}
            onQuantityChange={setCartQuantity}
            testID="cart-item-1"
          />
          <View style={styles.separator} />
          <CartItem
            imageUri={sampleImageUri}
            name="Popsicles"
            price="$12.50"
            quantity={1}
            onQuantityChange={(qty) => console.log('Quantity changed:', qty)}
            testID="cart-item-2"
          />
        </Card>

        {/* Order Summary Section */}
        <SectionHeader title="Order Summary" />
        <Card variant="outlined" style={styles.sectionCard}>
          <OrderSummary
            items={[
              { label: 'Subtotal', value: '$25.00' },
              { label: 'Total', value: '$25.00' },
            ]}
            showSeparator
          />
        </Card>

        {/* Navigation Bar Section */}
        <SectionHeader title="Navigation Bar" />
        <Card variant="outlined" style={styles.sectionCard}>
          <BodyText color="secondary" style={styles.hintText}>
            (This is a preview - actual navigation bar appears at bottom)
          </BodyText>
          <View style={styles.navBarPreview}>
            <NavigationBar
              items={[
                {
                  id: 'home',
                  icon: <View style={styles.iconPlaceholder} />,
                  onPress: () => Alert.alert('Nav', 'Home pressed'),
                },
                {
                  id: 'cart',
                  icon: <View style={styles.iconPlaceholder} />,
                  onPress: () => Alert.alert('Nav', 'Cart pressed'),
                },
                {
                  id: 'profile',
                  icon: <View style={styles.iconPlaceholder} />,
                  onPress: () => Alert.alert('Nav', 'Profile pressed'),
                },
              ]}
              activeItemId="home"
            />
          </View>
        </Card>

        {/* Spacing for bottom padding */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.screenPadding,
    paddingBottom: spacing['4xl'],
  },
  sectionCard: {
    marginBottom: spacing.base,
  },
  spacer: {
    height: spacing.base,
  },
  buttonSpacing: {
    marginBottom: spacing.md,
  },
  hintText: {
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  productGrid: {
    flexDirection: 'row',
    gap: spacing.productGridGap,
    marginBottom: spacing.base,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: spacing.md,
  },
  navBarPreview: {
    marginTop: spacing.md,
    borderRadius: 8,
    overflow: 'hidden',
  },
  iconPlaceholder: {
    width: 24,
    height: 24,
    backgroundColor: colors.text.inverse,
    borderRadius: 2,
  },
  bottomSpacer: {
    height: spacing['4xl'],
  },
});


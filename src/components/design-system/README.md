# Design System Components

This directory contains all reusable UI components based on the design principles defined in `ui-principles.json`.

## Design Tokens

All design tokens are centralized in `src/theme/designTokens.ts`:
- **Spacing**: Consistent spacing scale (4px to 48px)
- **Colors**: Primary, accent, background, text, and border colors
- **Border Radius**: Rounded corner values (0px to 9999px)
- **Typography**: Font sizes, weights, and line heights
- **Shadows**: Elevation and glow effects
- **Borders**: Border styles and colors

## Components

### Button
Primary and secondary button variants with loading states and icons.

```tsx
import { Button } from './design-system';

<Button
  title="Add to Cart"
  onPress={handlePress}
  variant="primary"
  size="large"
  fullWidth
  icon={<PlusIcon />}
  iconPosition="right"
/>
```

### Card
Base card component with elevated and outlined variants.

```tsx
import { Card } from './design-system';

<Card variant="elevated" onPress={handlePress}>
  <Text>Card content</Text>
</Card>
```

### ProductCard
Product card with image, name, price, and optional rating.

```tsx
import { ProductCard } from './design-system';

<ProductCard
  imageUri="https://..."
  name="Scoops Ice Cream"
  price="$12.00"
  rating={4.5}
  onPress={handlePress}
/>
```

### CartItem
Cart item with thumbnail, name, price, and quantity selector.

```tsx
import { CartItem } from './design-system';

<CartItem
  imageUri="https://..."
  name="Scoops"
  price="$12.50"
  quantity={2}
  onQuantityChange={handleQuantityChange}
/>
```

### SearchBar
Search input with filter button.

```tsx
import { SearchBar } from './design-system';

<SearchBar
  value={searchQuery}
  onChangeText={setSearchQuery}
  placeholder="Search your item"
  onFilterPress={handleFilter}
/>
```

### FilterTag
Filter tag with active state and optional close button.

```tsx
import { FilterTag } from './design-system';

<FilterTag
  label="Vanilla flavour"
  active={isActive}
  onPress={handlePress}
  showClose
  onClose={handleClose}
/>
```

### QuantitySelector
Quantity selector with increment/decrement buttons.

```tsx
import { QuantitySelector } from './design-system';

<QuantitySelector
  quantity={quantity}
  onIncrement={handleIncrement}
  onDecrement={handleDecrement}
  min={0}
  max={10}
  size="medium"
/>
```

### Rating
Star rating display with optional numeric value.

```tsx
import { Rating } from './design-system';

<Rating value={4.5} size="medium" showValue />
```

### Header
Screen header with back button, title, and optional right action.

```tsx
import { Header } from './design-system';

<Header
  title="Cart"
  onBackPress={handleBack}
  rightAction={{
    icon: <MenuIcon />,
    onPress: handleMenu,
  }}
  showBorder
/>
```

### SectionHeader
Section title with consistent styling.

```tsx
import { SectionHeader } from './design-system';

<SectionHeader title="We Recommend" />
```

### Typography
Typography components for consistent text styling.

```tsx
import {
  ScreenTitle,
  SectionHeader,
  ProductName,
  ProductDescription,
  Price,
  BodyText,
} from './design-system';

<ScreenTitle>Welcome</ScreenTitle>
<ProductName>Ice Cream</ProductName>
<Price>$12.00</Price>
<BodyText color="secondary">Description text</BodyText>
```

### OrderSummary
Order summary with items and separators.

```tsx
import { OrderSummary } from './design-system';

<OrderSummary
  items={[
    { label: 'Subtotal', value: '$25.00' },
    { label: 'Total', value: '$25.00' },
  ]}
  showSeparator
/>
```

### NavigationBar
Bottom navigation bar with icons.

```tsx
import { NavigationBar } from './design-system';

<NavigationBar
  items={[
    { id: 'home', icon: <HomeIcon />, onPress: () => {} },
    { id: 'cart', icon: <CartIcon />, onPress: () => {} },
  ]}
  activeItemId="home"
/>
```

## Usage

All components can be imported from the central export:

```tsx
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
} from './components/design-system';
```

## Design Principles

All components follow these principles from `ui-principles.json`:
- **Minimal color palette**: Black and white with minimal accent colors
- **Consistent spacing**: Using the spacing scale throughout
- **Clear visual hierarchy**: Typography and spacing create clear hierarchy
- **Card-based design**: Content organized in cards
- **Touch-friendly**: Minimum 44px touch targets
- **Accessibility**: High contrast, readable fonts, clear labels

## Notes

- Icon components (search, filter, star, etc.) use placeholder views. Replace with actual icon components from your icon library (e.g., `@expo/vector-icons`, `react-native-vector-icons`).
- All components use React Native's `StyleSheet` for styling to match the existing codebase pattern.
- Components are fully typed with TypeScript interfaces.


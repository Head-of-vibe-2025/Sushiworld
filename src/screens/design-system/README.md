# Design System Preview Screen

This screen showcases all the design system components in action. It's perfect for:
- **Development**: See all components in one place
- **Testing**: Verify component behavior and styling
- **Documentation**: Visual reference for component usage
- **Design Review**: Check component consistency

## How to Access

### Option 1: From Settings Screen
Add a button in your Settings screen to navigate to the preview:

```tsx
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { NavigationParamList } from '../../types/app.types';

type SettingsScreenNavigationProp = NativeStackNavigationProp<NavigationParamList, 'Settings'>;

// In your Settings screen component:
const navigation = useNavigation<SettingsScreenNavigationProp>();

<TouchableOpacity onPress={() => navigation.navigate('DesignSystemPreview')}>
  <Text>View Design System Preview</Text>
</TouchableOpacity>
```

### Option 2: Direct Navigation
You can navigate directly from anywhere in the app:

```tsx
navigation.navigate('DesignSystemPreview');
```

### Option 3: Development Menu
Add it to a developer menu or debug screen.

## What's Included

The preview screen showcases:

1. **Typography** - All text variants (ScreenTitle, ProductName, BodyText, Price, etc.)
2. **Buttons** - Primary, secondary, sizes, states (loading, disabled)
3. **Search Bar** - With filter button
4. **Filter Tags** - Active/inactive states, with close button
5. **Rating** - Star ratings with numeric values
6. **Quantity Selector** - Small and medium sizes
7. **Cards** - Default, elevated, outlined variants
8. **Product Cards** - With images, ratings, and prices
9. **Cart Items** - With quantity selectors
10. **Order Summary** - With separators
11. **Navigation Bar** - Preview of bottom navigation

## Interactive Features

- All buttons show alerts when pressed
- Search bar updates in real-time
- Filter tags toggle active state
- Quantity selectors are fully functional
- Cart items can change quantities

## Notes

- The preview uses sample images from Unsplash
- All components are fully interactive
- The screen is scrollable to view all components
- Components use the actual design tokens from `designTokens.ts`


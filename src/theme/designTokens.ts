// Design Tokens - Based on UI Principles JSON
// All design system values extracted from ui-principles.json

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  // Specific spacing values
  productGridGap: 12,
  cardPadding: 12,
  sectionSpacing: 24,
  screenPadding: 16,
  elementGap: 8,
  cartItemSpacing: 16,
  headerHeight: 56,
  navigationBarHeight: 64,
} as const;

// Base color definitions (theme-agnostic)
const baseColors = {
  primary: {
    black: '#000000',
    white: '#FFFFFF',
  },
  accent: {
    green: '#4ADE80',
    pink: '#EA3886',
  },
} as const;

// Light theme colors
const lightColors = {
  primary: baseColors.primary,
  accent: baseColors.accent,
  background: {
    primary: '#F6F6F6', // App background color
    secondary: '#F9FAFB',
    card: '#FFFFFF',
    navigation: '#FFFFFF', // White navigation bar
    searchBar: '#F5F5F5', // Light gray for search bar
  },
  text: {
    primary: '#000000', // Pure black text
    secondary: '#666666', // Medium gray
    tertiary: '#999999', // Light gray
    inverse: '#FFFFFF',
    link: '#000000',
  },
  border: {
    light: '#E0E0E0',
    medium: '#D1D5DB',
    dark: '#000000',
  },
  shadow: {
    color: 'rgba(0, 0, 0, 0.05)', // Very subtle shadows
    glowGreen: 'rgba(74, 222, 128, 0.2)',
    glowPink: 'rgba(234, 56, 134, 0.2)',
  },
} as const;

// Dark theme colors
const darkColors = {
  primary: baseColors.primary,
  accent: baseColors.accent,
  background: {
    primary: '#121212', // Dark app background
    secondary: '#1E1E1E',
    card: '#1F1F1F', // Dark card background
    navigation: '#1F1F1F', // Dark navigation bar
    searchBar: '#2A2A2A', // Dark gray for search bar
  },
  text: {
    primary: '#FFFFFF', // White text
    secondary: '#B0B0B0', // Light gray
    tertiary: '#808080', // Medium gray
    inverse: '#000000',
    link: '#FFFFFF',
  },
  border: {
    light: '#333333',
    medium: '#404040',
    dark: '#FFFFFF',
  },
  shadow: {
    color: 'rgba(0, 0, 0, 0.3)', // Darker shadows for dark mode
    glowGreen: 'rgba(74, 222, 128, 0.3)',
    glowPink: 'rgba(234, 56, 134, 0.3)',
  },
} as const;

// Export function to get colors based on theme
export const getColors = (isDark: boolean) => {
  return isDark ? darkColors : lightColors;
};

// Export default light colors for backward compatibility
export const colors = lightColors;

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
  // Specific border radius values
  productCard: 16, // Slightly more rounded
  productImage: 12,
  thumbnail: 9999, // 50% for circular
  button: 8,
  searchBar: 12,
  filterTag: 20, // Rounded pill shape
  quantitySelector: 8,
} as const;

export const typography = {
  fontFamily: {
    regular: 'Poppins_400Regular',
    medium: 'Poppins_500Medium',
    semibold: 'Poppins_600SemiBold',
    bold: 'Poppins_700Bold',
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
  },
  fontWeights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  // Specific typography styles
  screenTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 1.2,
  },
  sectionHeader: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    fontWeight: '700' as const,
    lineHeight: 1.3,
  },
  productName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 1.4,
  },
  productDescription: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 1.6,
  },
  price: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 1.5,
  },
  bodyText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 1.5,
  },
  buttonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 1.5,
  },
} as const;

// Export function to get shadows based on theme
export const getShadows = (isDark: boolean) => {
  const shadowColor = isDark ? '#000' : '#000';
  return {
    none: {},
    sm: {
      shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0.3 : 0.03,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.4 : 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    lg: {
      shadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.5 : 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    glowGreen: {
      shadowColor: baseColors.accent.green,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 5,
    },
    glowPink: {
      shadowColor: baseColors.accent.pink,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 5,
    },
  } as const;
};

// Export default light shadows for backward compatibility
export const shadows = getShadows(false);

// Export function to get borders based on theme
export const getBorders = (isDark: boolean) => {
  const themeColors = getColors(isDark);
  return {
    none: {
      borderWidth: 0,
    },
    card: {
      borderWidth: 1,
      borderColor: themeColors.border.light,
    },
    input: {
      borderWidth: 1,
      borderColor: themeColors.border.medium,
    },
    separator: {
      borderWidth: 1,
      borderColor: themeColors.border.medium,
      borderStyle: 'dashed' as const,
    },
  } as const;
};

// Export default light borders for backward compatibility
export const borders = getBorders(false);

export const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

export const imageSizes = {
  thumbnail: 48,
  productCard: 160,
  productDetail: 300,
} as const;

export const touchTarget = {
  minimum: 44,
  recommended: 48,
} as const;


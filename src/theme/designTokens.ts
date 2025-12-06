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

export const colors = {
  primary: {
    black: '#000000',
    white: '#FFFFFF',
  },
  accent: {
    green: '#4ADE80',
    pink: '#F472B6',
  },
  background: {
    primary: '#F6F6F6',
    secondary: '#F9FAFB',
    card: '#FFFFFF',
    navigation: '#000000',
  },
  text: {
    primary: '#000000',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    inverse: '#FFFFFF',
    link: '#EA3886',
  },
  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    dark: '#000000',
  },
  shadow: {
    color: 'rgba(0, 0, 0, 0.1)',
    glowGreen: 'rgba(74, 222, 128, 0.2)',
    glowPink: 'rgba(244, 114, 182, 0.2)',
  },
} as const;

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
  // Specific border radius values
  productCard: 12,
  productImage: 12,
  thumbnail: 9999, // 50% for circular
  button: 8,
  searchBar: 12,
  filterTag: 20,
  quantitySelector: 8,
} as const;

export const typography = {
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
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 1.2,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '700' as const,
    lineHeight: 1.3,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 1.4,
  },
  productDescription: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 1.6,
  },
  price: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 1.5,
  },
  bodyText: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 1.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 1.5,
  },
} as const;

export const shadows = {
  none: {},
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  glowGreen: {
    shadowColor: colors.accent.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  glowPink: {
    shadowColor: colors.accent.pink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
} as const;

export const borders = {
  none: {
    borderWidth: 0,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  separator: {
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderStyle: 'dashed' as const,
  },
} as const;

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


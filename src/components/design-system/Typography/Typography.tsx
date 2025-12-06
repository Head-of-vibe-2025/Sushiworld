// Typography Components
// Based on UI Principles JSON

import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import { colors, typography } from '../../../theme/designTokens';

export interface TypographyProps extends TextProps {
  variant?: 'screenTitle' | 'sectionHeader' | 'productName' | 'productDescription' | 'price' | 'bodyText' | 'link';
  color?: 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'link';
  testID?: string;
}

export function Typography({
  variant = 'bodyText',
  color = 'primary',
  style,
  children,
  testID,
  ...props
}: TypographyProps) {
  const variantStyles = {
    screenTitle: styles.screenTitle,
    sectionHeader: styles.sectionHeader,
    productName: styles.productName,
    productDescription: styles.productDescription,
    price: styles.price,
    bodyText: styles.bodyText,
    link: styles.link,
  };

  const colorStyles = {
    primary: { color: colors.text.primary },
    secondary: { color: colors.text.secondary },
    tertiary: { color: colors.text.tertiary },
    inverse: { color: colors.text.inverse },
    link: { color: colors.text.link },
  };

  return (
    <Text
      style={[variantStyles[variant], colorStyles[color], style]}
      testID={testID}
      {...props}
    >
      {children}
    </Text>
  );
}

// Convenience components
export function ScreenTitle(props: Omit<TypographyProps, 'variant'>) {
  return <Typography variant="screenTitle" {...props} />;
}

export function SectionHeader(props: Omit<TypographyProps, 'variant'>) {
  return <Typography variant="sectionHeader" {...props} />;
}

export function ProductName(props: Omit<TypographyProps, 'variant'>) {
  return <Typography variant="productName" {...props} />;
}

export function ProductDescription(props: Omit<TypographyProps, 'variant'>) {
  return <Typography variant="productDescription" {...props} />;
}

export function Price(props: Omit<TypographyProps, 'variant'>) {
  return <Typography variant="price" {...props} />;
}

export function BodyText(props: Omit<TypographyProps, 'variant'>) {
  return <Typography variant="bodyText" {...props} />;
}

export function Link(props: Omit<TypographyProps, 'variant' | 'color'>) {
  return <Typography variant="link" color="link" {...props} />;
}

const styles = StyleSheet.create({
  screenTitle: {
    fontSize: typography.screenTitle.fontSize,
    fontWeight: typography.screenTitle.fontWeight,
    lineHeight: typography.screenTitle.fontSize * typography.screenTitle.lineHeight,
  },
  sectionHeader: {
    fontSize: typography.sectionHeader.fontSize,
    fontWeight: typography.sectionHeader.fontWeight,
    lineHeight: typography.sectionHeader.fontSize * typography.sectionHeader.lineHeight,
  },
  productName: {
    fontSize: typography.productName.fontSize,
    fontWeight: typography.productName.fontWeight,
    lineHeight: typography.productName.fontSize * typography.productName.lineHeight,
  },
  productDescription: {
    fontSize: typography.productDescription.fontSize,
    fontWeight: typography.productDescription.fontWeight,
    lineHeight: typography.productDescription.fontSize * typography.productDescription.lineHeight,
  },
  price: {
    fontSize: typography.price.fontSize,
    fontWeight: typography.price.fontWeight,
    lineHeight: typography.price.fontSize * typography.price.lineHeight,
  },
  bodyText: {
    fontSize: typography.bodyText.fontSize,
    fontWeight: typography.bodyText.fontWeight,
    lineHeight: typography.bodyText.fontSize * typography.bodyText.lineHeight,
  },
  link: {
    fontSize: typography.bodyText.fontSize,
    fontWeight: typography.bodyText.fontWeight,
    lineHeight: typography.bodyText.fontSize * typography.bodyText.lineHeight,
    color: colors.text.link,
  },
});


// NavigationBar Component
// Based on UI Principles JSON

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, iconSizes } from '../../../theme/designTokens';

export interface NavigationItem {
  id: string;
  icon: React.ReactNode;
  onPress: () => void;
}

export interface NavigationBarProps {
  items: NavigationItem[];
  activeItemId?: string;
  testID?: string;
}

export default function NavigationBar({
  items,
  activeItemId,
  testID,
}: NavigationBarProps) {
  return (
    <View style={styles.container} testID={testID}>
      {items.map((item) => {
        const isActive = item.id === activeItemId;
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.item}
            onPress={item.onPress}
            activeOpacity={0.7}
            testID={`${testID}-${item.id}`}
          >
            <View
              style={[
                styles.iconContainer,
                isActive && styles.iconContainerActive,
              ]}
            >
              {item.icon}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: colors.background.navigation,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: iconSizes.lg,
    height: iconSizes.lg,
    opacity: 0.6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerActive: {
    opacity: 1.0,
  },
});


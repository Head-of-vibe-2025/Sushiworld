// Loading Spinner Component

import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../theme/designTokens';

export default function LoadingSpinner() {
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  
  return (
    <View style={styles.container} testID="loading-spinner">
      <ActivityIndicator size="large" color={colors.accent.pink} testID="activity-indicator" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


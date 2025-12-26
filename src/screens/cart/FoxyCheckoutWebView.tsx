// Foxy Checkout WebView Screen
// Custom in-app browser to avoid double navigation issues

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { spacing, getColors, borderRadius, typography } from '../../theme/designTokens';
import type { NavigationParamList } from '../../types/app.types';

type FoxyCheckoutWebViewNavigationProp = NativeStackNavigationProp<NavigationParamList, 'FoxyCheckout'>;
type FoxyCheckoutWebViewRouteProp = RouteProp<NavigationParamList, 'FoxyCheckout'>;

export default function FoxyCheckoutWebView() {
  const navigation = useNavigation<FoxyCheckoutWebViewNavigationProp>();
  const route = useRoute<FoxyCheckoutWebViewRouteProp>();
  const checkoutUrl = route.params.checkoutUrl;
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const webViewRef = React.useRef<WebView>(null);

  const handleNavigationStateChange = (navState: any) => {
    setCanGoBack(navState.canGoBack);
    setLoading(navState.loading);
    
    // Check if we're on a success/completion page
    const url = navState.url.toLowerCase();
    if (url.includes('/receipt') || url.includes('/success') || url.includes('/complete')) {
      // Order completed successfully
      setTimeout(() => {
        Alert.alert(
          'Order Placed',
          'Your order has been received. You will receive a confirmation email shortly.',
          [
            {
              text: 'OK',
              onPress: () => {
                clearCart();
                navigation.goBack();
              },
            },
          ]
        );
      }, 500);
    }
  };

  const handleClose = () => {
    Alert.alert(
      'Cancel Checkout?',
      'Are you sure you want to cancel? Your cart will be preserved.',
      [
        {
          text: 'Continue Shopping',
          style: 'cancel',
          onPress: () => navigation.goBack(),
        },
        {
          text: 'Stay on Checkout',
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Custom Header */}
      <View style={[styles.header, { 
        paddingTop: insets.top + spacing.sm,
        backgroundColor: colors.background.card,
        borderBottomColor: colors.border?.primary || colors.background.secondary,
      }]}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.closeIcon, { color: colors.text.primary }]}>✕</Text>
        </TouchableOpacity>
        
        {canGoBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => webViewRef.current?.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.backIcon, { color: colors.accent.pink }]}>← Back</Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.headerSpacer} />
      </View>

      {/* WebView */}
      <WebView
        ref={webViewRef}
        source={{ uri: checkoutUrl }}
        style={styles.webview}
        onNavigationStateChange={handleNavigationStateChange}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error: ', nativeEvent);
          Alert.alert('Error', 'Failed to load checkout page. Please try again.');
          setLoading(false);
        }}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accent.pink} />
          </View>
        )}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        sharedCookiesEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        // Hide scrollbars for cleaner look
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        // Prevent zoom on mobile
        scalesPageToFit={true}
        bounces={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    zIndex: 1000,
  },
  closeButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  closeIcon: {
    fontSize: 24,
    fontWeight: '300',
  },
  backButton: {
    padding: spacing.xs,
  },
  backIcon: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semibold,
  },
  headerSpacer: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
    zIndex: 999,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});


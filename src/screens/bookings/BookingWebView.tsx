// Booking WebView Screen
// In-app browser for restaurant bookings

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../context/ThemeContext';
import { spacing, getColors, typography } from '../../theme/designTokens';
import type { NavigationParamList } from '../../types/app.types';

type BookingWebViewNavigationProp = NativeStackNavigationProp<NavigationParamList, 'BookingWebView'>;
type BookingWebViewRouteProp = RouteProp<NavigationParamList, 'BookingWebView'>;

export default function BookingWebView() {
  const navigation = useNavigation<BookingWebViewNavigationProp>();
  const route = useRoute<BookingWebViewRouteProp>();
  const bookingUrl = route.params.bookingUrl;
  const restaurantName = route.params.restaurantName;
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const webViewRef = React.useRef<WebView>(null);

  const handleNavigationStateChange = (navState: any) => {
    setCanGoBack(navState.canGoBack);
    setLoading(navState.loading);
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Custom Header */}
      <View style={[styles.header, { 
        paddingTop: insets.top + spacing.sm,
        backgroundColor: colors.background.card,
        borderBottomColor: colors.border?.light || colors.background.secondary,
      }]}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.closeIcon, { color: colors.text.primary }]}>✕</Text>
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text.primary }]} numberOfLines={1}>
            {restaurantName}
          </Text>
        </View>
        
        {canGoBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => webViewRef.current?.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.backIcon, { color: colors.accent.pink }]}>←</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* WebView */}
      <WebView
        ref={webViewRef}
        source={{ uri: bookingUrl }}
        style={styles.webview}
        onNavigationStateChange={handleNavigationStateChange}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error: ', nativeEvent);
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
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
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
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.semibold,
  },
  backButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  backIcon: {
    fontSize: 20,
    fontFamily: typography.fontFamily.semibold,
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


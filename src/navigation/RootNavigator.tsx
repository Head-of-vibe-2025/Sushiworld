// Root Navigator

import React from 'react';
import { View, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import AppTabs from './AppTabs';
import type { NavigationParamList } from '../types/app.types';
import { LOGO_URL } from '../utils/constants';

const Stack = createNativeStackNavigator<NavigationParamList>();

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <Image
        source={{ uri: LOGO_URL }}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#FF6B6B" style={styles.spinner} />
    </View>
  );
}

export default function RootNavigator() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Allow guests to browse - show AppTabs by default */}
        <Stack.Screen name="Root" component={AppTabs} />
        {/* Auth stack for login/signup */}
        <Stack.Screen name="Auth" component={AuthStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  spinner: {
    marginTop: 16,
  },
});


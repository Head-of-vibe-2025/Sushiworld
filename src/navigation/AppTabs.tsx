// App Tabs Navigator (Bottom Tab Navigation)

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MenuScreen from '../screens/menu/MenuScreen';
import ProductDetailScreen from '../screens/menu/ProductDetailScreen';
import CartScreen from '../screens/cart/CartScreen';
import CheckoutScreen from '../screens/cart/CheckoutScreen';
import OrderHistoryScreen from '../screens/orders/OrderHistoryScreen';
import OrderDetailScreen from '../screens/orders/OrderDetailScreen';
import LoyaltyScreen from '../screens/loyalty/LoyaltyScreen';
import RedeemPointsScreen from '../screens/loyalty/RedeemPointsScreen';
import PointsHistoryScreen from '../screens/loyalty/PointsHistoryScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import PreferencesScreen from '../screens/profile/PreferencesScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import type { NavigationParamList } from '../types/app.types';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<NavigationParamList>();

// Menu Stack
function MenuStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Menu"
        component={MenuScreen}
        options={{ title: 'Menu' }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Product Details' }}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: 'Cart' }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ title: 'Checkout' }}
      />
    </Stack.Navigator>
  );
}

// Orders Stack
function OrdersStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Orders"
        component={OrderHistoryScreen}
        options={{ title: 'Order History' }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{ title: 'Order Details' }}
      />
    </Stack.Navigator>
  );
}

// Loyalty Stack
function LoyaltyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Loyalty"
        component={LoyaltyScreen}
        options={{ title: 'Loyalty' }}
      />
      <Stack.Screen
        name="RedeemPoints"
        component={RedeemPointsScreen}
        options={{ title: 'Redeem Points' }}
      />
      <Stack.Screen
        name="PointsHistory"
        component={PointsHistoryScreen}
        options={{ title: 'Points History' }}
      />
    </Stack.Navigator>
  );
}

// Profile Stack
function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen
        name="Preferences"
        component={PreferencesScreen}
        options={{ title: 'Preferences' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
}

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tab.Screen
        name="MenuTab"
        component={MenuStack}
        options={{
          title: 'Menu',
          tabBarIcon: ({ color }) => null, // Add icons later
        }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersStack}
        options={{
          title: 'Orders',
          tabBarIcon: ({ color }) => null,
        }}
      />
      <Tab.Screen
        name="LoyaltyTab"
        component={LoyaltyStack}
        options={{
          title: 'Loyalty',
          tabBarIcon: ({ color }) => null,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => null,
        }}
      />
    </Tab.Navigator>
  );
}


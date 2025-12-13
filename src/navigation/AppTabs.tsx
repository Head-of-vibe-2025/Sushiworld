// App Tabs Navigator (Bottom Tab Navigation)

import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';
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
import DesignSystemPreviewScreen from '../screens/design-system/DesignSystemPreviewScreen';
import type { NavigationParamList } from '../types/app.types';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<NavigationParamList>();

// Menu Stack
function MenuStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Menu"
        component={MenuScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: '' }}
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
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Orders"
        component={OrderHistoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// Loyalty Stack
function LoyaltyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Loyalty"
        component={LoyaltyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RedeemPoints"
        component={RedeemPointsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PointsHistory"
        component={PointsHistoryScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// Profile Stack
function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Preferences"
        component={PreferencesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DesignSystemPreview"
        component={DesignSystemPreviewScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// Home Icon Component
const HomeIcon = ({ color = '#FFFFFF' }: { color?: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z"
      stroke={color}
      strokeWidth="2"
    />
    <Path
      d="M15 18H9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// Bag (Cart) Icon Component
const BagIcon = ({ color = '#FFFFFF' }: { color?: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 11C15.5523 11 16 10.5523 16 10C16 9.44771 15.5523 9 15 9C14.4477 9 14 9.44771 14 10C14 10.5523 14.4477 11 15 11Z"
      fill={color}
    />
    <Path
      d="M10 10C10 10.5523 9.55228 11 9 11C8.44771 11 8 10.5523 8 10C8 9.44771 8.44771 9 9 9C9.55228 9 10 9.44771 10 10Z"
      fill={color}
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.25 5.27567V5C8.25 2.92893 9.92893 1.25 12 1.25C14.0711 1.25 15.75 2.92893 15.75 5V5.27567C16.4084 5.29605 16.9947 5.33261 17.5149 5.39818C18.7162 5.54961 19.6886 5.8682 20.4397 6.6018C20.6903 6.84656 20.9131 7.1183 21.1039 7.41205C21.676 8.29247 21.7977 9.30842 21.7106 10.516C21.6254 11.6979 21.3286 13.1818 20.952 15.0648L20.9328 15.1604C20.6715 16.4673 20.4635 17.5074 20.2061 18.3256C19.941 19.1683 19.6025 19.8497 19.0361 20.4017C18.8414 20.5915 18.6306 20.7643 18.4063 20.918C17.754 21.3651 17.0194 21.5634 16.1411 21.6581C15.2883 21.75 14.2276 21.75 12.8948 21.75H11.1053C9.77249 21.75 8.71181 21.75 7.85904 21.6581C6.98068 21.5634 6.24614 21.3651 5.59385 20.918C5.3695 20.7643 5.15877 20.5915 4.96399 20.4017C4.39766 19.8497 4.05914 19.1683 3.79405 18.3256C3.53667 17.5074 3.32867 16.4673 3.06729 15.1604L3.04822 15.065C2.67158 13.1819 2.37478 11.698 2.28954 10.516C2.20244 9.30842 2.32415 8.29247 2.89619 7.41205C3.08705 7.1183 3.30982 6.84656 3.56044 6.6018C4.31157 5.8682 5.28392 5.54961 6.48518 5.39818C7.00535 5.33261 7.59162 5.29605 8.25 5.27567ZM9.75 5C9.75 3.75736 10.7574 2.75 12 2.75C13.2426 2.75 14.25 3.75736 14.25 5V5.2522C13.8258 5.24999 13.378 5.25 12.9055 5.25H11.0946C10.6221 5.25 10.1743 5.24999 9.75 5.2522V5ZM4.60849 7.67491C5.02293 7.27015 5.61646 7.01956 6.67278 6.88641C7.74368 6.75141 9.1623 6.75 11.1486 6.75H12.8515C14.8378 6.75 16.2564 6.75141 17.3273 6.88641C18.3837 7.01956 18.9772 7.27015 19.3916 7.67491C19.5631 7.84238 19.7155 8.02831 19.8461 8.2293C20.1617 8.71507 20.2911 9.34622 20.2145 10.4081C20.1368 11.4847 19.86 12.8761 19.4705 14.8238C19.1987 16.1827 19.0055 17.1434 18.7752 17.8755C18.5498 18.5919 18.3103 19.0145 17.9892 19.3275C17.8559 19.4573 17.7118 19.5755 17.5582 19.6808C17.1884 19.9343 16.7271 20.0863 15.9803 20.1667C15.2173 20.249 14.2374 20.25 12.8515 20.25H11.1486C9.76271 20.25 8.78285 20.249 8.01978 20.1667C7.27307 20.0863 6.81176 19.9343 6.44188 19.6808C6.28838 19.5755 6.1442 19.4573 6.01093 19.3275C5.68979 19.0145 5.45028 18.5919 5.22492 17.8755C4.99463 17.1434 4.80147 16.1828 4.52967 14.8238C4.14013 12.8761 3.8633 11.4847 3.78565 10.4081C3.70906 9.34622 3.83838 8.71507 4.15401 8.2293C4.2846 8.02831 4.43702 7.84238 4.60849 7.67491Z"
      fill={color}
    />
  </Svg>
);

// User Rounded Icon Component
const UserIcon = ({ color = '#FFFFFF' }: { color?: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="6" r="4" stroke={color} strokeWidth="2" />
    <Ellipse cx="12" cy="17" rx="7" ry="4" stroke={color} strokeWidth="2" />
  </Svg>
);

// Checklist Minimalistic Icon Component (for Orders)
const ChecklistIcon = ({ color = '#FFFFFF' }: { color?: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z"
      stroke={color}
      strokeWidth="2"
    />
    <Path
      d="M6 15.8L7.14286 17L10 14"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6 8.8L7.14286 10L10 7"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13 9L18 9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M13 16L18 16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// Sticker Smile Square Icon Component (for Loyalty/Chat)
const SmileIcon = ({ color = '#FFFFFF' }: { color?: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 16C9.85038 16.6303 10.8846 17 12 17C13.1154 17 14.1496 16.6303 15 16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Ellipse cx="15" cy="10.5" rx="1" ry="1.5" fill={color} />
    <Ellipse cx="9" cy="10.5" rx="1" ry="1.5" fill={color} />
    <Path
      d="M15 22H12C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12V15M15 22C18.866 22 22 18.866 22 15M15 22C15 20.1387 15 19.2081 15.2447 18.4549C15.7393 16.9327 16.9327 15.7393 18.4549 15.2447C19.2081 15 20.1387 15 22 15"
      stroke={color}
      strokeWidth="2"
    />
  </Svg>
);

// Icon component wrapper for active state (white circle)
const IconWrapper = ({ focused, children }: { focused: boolean; children: React.ReactNode }) => {
  if (focused) {
    return (
      <View style={styles.activeIconContainer}>
        {children}
      </View>
    );
  }
  return <View>{children}</View>;
};

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#FFFFFF',
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          borderRadius: 35, // Fully rounded (half of height)
          marginHorizontal: 30,
          marginBottom: 15,
          position: 'absolute',
        },
        tabBarLabelStyle: {
          display: 'none', // Hide labels to match the design
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
      }}
    >
      <Tab.Screen
        name="MenuTab"
        component={MenuStack}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Menu';
          return {
            title: '',
            tabBarStyle: {
              ...(routeName === 'ProductDetail' || routeName === 'Cart' || routeName === 'Checkout'
                ? { display: 'none' }
                : {
                    backgroundColor: '#000000',
                    borderTopWidth: 0,
                    height: 70,
                    paddingBottom: 10,
                    paddingTop: 10,
                    borderRadius: 35,
                    marginHorizontal: 30,
                    marginBottom: 15,
                    position: 'absolute',
                  }),
            },
            tabBarIcon: ({ focused }) => (
              <IconWrapper focused={focused}>
                <HomeIcon color={focused ? '#000000' : '#FFFFFF'} />
              </IconWrapper>
            ),
          };
        }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersStack}
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <IconWrapper focused={focused}>
              <ChecklistIcon color={focused ? '#000000' : '#FFFFFF'} />
            </IconWrapper>
          ),
        }}
      />
      <Tab.Screen
        name="LoyaltyTab"
        component={LoyaltyStack}
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <IconWrapper focused={focused}>
              <SmileIcon color={focused ? '#000000' : '#FFFFFF'} />
            </IconWrapper>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <IconWrapper focused={focused}>
              <UserIcon color={focused ? '#000000' : '#FFFFFF'} />
            </IconWrapper>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  activeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});


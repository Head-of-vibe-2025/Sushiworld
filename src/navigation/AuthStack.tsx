// Auth Stack Navigator

import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import type { NavigationParamList } from '../types/app.types';

const Stack = createNativeStackNavigator<NavigationParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#FF6B6B' },
        headerTintColor: '#fff',
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={({ navigation }) => ({
          title: 'Sign In',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                // Navigate back to Root stack
                const parent = navigation.getParent();
                if (parent) {
                  parent.goBack();
                } else {
                  (navigation as any).navigate('Root');
                }
              }}
              style={{ marginLeft: 10, padding: 10 }}
            >
              <Text style={{ color: '#fff', fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={({ navigation }) => ({
          title: 'Create Account',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                // Navigate back to Root stack
                const parent = navigation.getParent();
                if (parent) {
                  parent.goBack();
                } else {
                  (navigation as any).navigate('Root');
                }
              }}
              style={{ marginLeft: 10, padding: 10 }}
            >
              <Text style={{ color: '#fff', fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
}


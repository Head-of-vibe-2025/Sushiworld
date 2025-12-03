// Jest setup file for React Native Testing Library
// Note: @testing-library/react-native v12.4+ includes matchers by default

// Set up global mocks that Expo expects (before any modules load)
if (typeof global !== 'undefined') {
  global.__ExpoImportMetaRegistry = global.__ExpoImportMetaRegistry || {};
  if (!global.TextDecoderStream) {
    global.TextDecoderStream = class TextDecoderStream {};
  }
  if (!global.TextEncoderStream) {
    global.TextEncoderStream = class TextEncoderStream {};
  }
  if (!global.structuredClone) {
    global.structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj));
  }
}

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Expo modules
jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  scheduleNotificationAsync: jest.fn(() => Promise.resolve('notification-id')),
  cancelScheduledNotificationAsync: jest.fn(() => Promise.resolve()),
  getAllScheduledNotificationsAsync: jest.fn(() => Promise.resolve([])),
  setNotificationHandler: jest.fn(),
  addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
}));

jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      extra: {},
    },
  },
}));

jest.mock('expo-web-browser', () => ({
  openBrowserAsync: jest.fn(() => Promise.resolve({ type: 'dismiss' })),
}));

// Silence console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};


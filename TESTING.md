# Testing Guide

This document provides a comprehensive guide for automated testing in the Sushi World mobile app.

## 📋 Table of Contents

- [Overview](#overview)
- [Setup](#setup)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Writing Tests](#writing-tests)
- [Best Practices](#best-practices)
- [CI/CD Integration](#cicd-integration)

## Overview

The app uses **Jest** as the test runner and **React Native Testing Library** for component testing. This setup provides:

- ✅ Unit tests for utilities and functions
- ✅ Component tests with React Native Testing Library
- ✅ Context provider tests
- ✅ Hook tests
- ✅ Mocked Expo modules and native modules

## Setup

### Dependencies

The following testing dependencies are installed:

- `jest` - Test runner
- `jest-expo` - Expo-specific Jest preset
- `@testing-library/react-native` - React Native component testing
- `react-test-renderer` - React component rendering for tests
- `@types/jest` - TypeScript types for Jest

### Configuration Files

- **`jest.config.js`** - Main Jest configuration
- **`jest.setup.js`** - Test setup and mocks

## Running Tests

### Basic Commands

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode (single run, coverage, limited workers)
npm run test:ci
```

### Running Specific Tests

```bash
# Run tests matching a pattern
npm test -- validation

# Run tests in a specific file
npm test -- validation.test.ts

# Run tests in watch mode for a specific file
npm run test:watch -- validation.test.ts
```

## Test Structure

Tests should be placed in `__tests__` directories next to the files they test, or use the `.test.ts`/`.test.tsx` suffix.

```
src/
├── utils/
│   ├── validation.ts
│   └── __tests__/
│       └── validation.test.ts
├── components/
│   ├── LoadingSpinner.tsx
│   └── __tests__/
│       └── LoadingSpinner.test.tsx
└── context/
    ├── CartContext.tsx
    └── __tests__/
        └── CartContext.test.tsx
```

## Writing Tests

### Utility Function Tests

Example: Testing validation utilities

```typescript
import { isValidEmail, isValidPhone } from '../validation';

describe('validation utilities', () => {
  describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
    });
  });
});
```

### Component Tests

Example: Testing a React Native component

```typescript
import React from 'react';
import { render } from '@testing-library/react-native';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render correctly', () => {
    const { getByTestId } = render(<LoadingSpinner />);
    expect(getByTestId('loading-spinner')).toBeTruthy();
  });
});
```

**Important**: Add `testID` props to components for easier testing:

```typescript
<View testID="loading-spinner">
  <ActivityIndicator testID="activity-indicator" />
</View>
```

### Context Provider Tests

Example: Testing a React Context

```typescript
import { renderHook, act } from '@testing-library/react-native';
import { CartProvider, useCart } from '../CartContext';

const wrapper = ({ children }) => (
  <CartProvider>{children}</CartProvider>
);

describe('CartContext', () => {
  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockItem);
    });

    expect(result.current.items).toHaveLength(1);
  });
});
```

### Hook Tests

For custom hooks, use `renderHook` from React Native Testing Library:

```typescript
import { renderHook } from '@testing-library/react-native';
import { useLoyalty } from '../useLoyalty';

describe('useLoyalty', () => {
  it('should fetch loyalty data', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useLoyalty());
    
    await waitForNextUpdate();
    
    expect(result.current.loading).toBe(false);
    expect(result.current.profile).toBeDefined();
  });
});
```

### Mocking

#### Mocking AsyncStorage

AsyncStorage is automatically mocked in `jest.setup.js`. You can clear it between tests:

```typescript
beforeEach(() => {
  AsyncStorage.clear();
});
```

#### Mocking Expo Modules

Expo modules are mocked in `jest.setup.js`. To add custom mocks:

```typescript
jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
}));
```

#### Mocking Services

Mock API services to avoid real network calls:

```typescript
jest.mock('../services/supabase/loyaltyService', () => ({
  loyaltyService: {
    getProfile: jest.fn(() => Promise.resolve({ points: 100 })),
  },
}));
```

## Best Practices

### 1. Test Organization

- Group related tests using `describe` blocks
- Use descriptive test names that explain what is being tested
- Follow the Arrange-Act-Assert pattern

### 2. Test Coverage

Aim for good coverage of:
- ✅ Utility functions (100% coverage recommended)
- ✅ Business logic
- ✅ Context providers
- ✅ Custom hooks
- ✅ Critical user flows

### 3. Testing User Interactions

Use `@testing-library/user-event` for simulating user interactions:

```typescript
import { render, fireEvent } from '@testing-library/react-native';

it('should handle button press', () => {
  const { getByText } = render(<MyComponent />);
  const button = getByText('Submit');
  
  fireEvent.press(button);
  
  // Assert expected behavior
});
```

### 4. Async Testing

Handle async operations properly:

```typescript
it('should handle async operations', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useAsyncHook());
  
  await waitForNextUpdate();
  
  expect(result.current.data).toBeDefined();
});
```

### 5. Cleanup

Always clean up mocks and state between tests:

```typescript
beforeEach(() => {
  jest.clearAllMocks();
  AsyncStorage.clear();
});
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
```

### Coverage Thresholds

You can add coverage thresholds to `jest.config.js`:

```javascript
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70,
  },
},
```

## Example Test Files

The following example test files are included:

1. **`src/utils/__tests__/validation.test.ts`** - Utility function tests
2. **`src/utils/__tests__/formatting.test.ts`** - Formatting function tests
3. **`src/components/__tests__/LoadingSpinner.test.tsx`** - Component tests
4. **`src/context/__tests__/CartContext.test.tsx`** - Context provider tests

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Troubleshooting

### Tests not running

- Ensure all dependencies are installed: `npm install`
- Check that `jest.config.js` is in the root directory
- Verify test file naming matches the pattern in `jest.config.js`

### Mock issues

- Check that mocks are defined in `jest.setup.js` or at the top of your test file
- Ensure mocks are cleared between tests with `jest.clearAllMocks()`

### AsyncStorage issues

- AsyncStorage is automatically mocked, but you may need to clear it: `AsyncStorage.clear()`

### Expo module issues

- All Expo modules are mocked in `jest.setup.js`
- Add custom mocks if needed for specific modules

### Expo SDK 54 Winter Runtime Issues

If you encounter errors related to `expo/src/winter/runtime.native`, this is a known issue with Expo SDK 54. The test setup includes workarounds, but if issues persist:

1. **For utility tests** (validation, formatting): These should work without issues as they don't import Expo modules directly.

2. **For component/hook tests**: If you encounter runtime errors, you may need to:
   - Mock Expo modules at the top of your test file
   - Use `jest.mock()` to mock specific Expo imports
   - Consider testing components in isolation without Expo dependencies

3. **Workaround**: Test utility functions and business logic separately from components that heavily use Expo modules.

Example of mocking Expo in a test file:

```typescript
// At the top of your test file
jest.mock('expo-constants', () => ({
  default: { expoConfig: { extra: {} } },
}));
```


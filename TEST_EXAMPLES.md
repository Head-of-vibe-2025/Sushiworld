# Test Examples Guide

This document provides examples of well-written tests for different parts of the Sushi World app. Use these as templates when writing new tests.

## 📋 Test Files Created

### ✅ Service Tests

#### `loyaltyService.test.ts`
Tests for the loyalty service that interacts with Supabase:
- ✅ `getProfile` - Fetching user profile by email
- ✅ `getProfileById` - Fetching profile by ID
- ✅ `getLoyaltyTransactions` - Fetching transaction history
- ✅ `updatePreferences` - Updating user preferences
- ✅ Error handling for all methods

**Key Patterns:**
- Mocking Supabase client methods
- Testing both success and error cases
- Handling "not found" scenarios (PGRST116 error code)

#### `authService.test.ts`
Tests for authentication service:
- ✅ `signUp` - User registration with account claiming
- ✅ `signIn` - User login
- ✅ `signOut` - User logout
- ✅ `getCurrentUser` - Get authenticated user
- ✅ `claimAccount` - Claim pending points and welcome bonus

**Key Patterns:**
- Mocking Supabase auth methods
- Testing email sanitization
- Testing account claiming logic
- Testing welcome bonus application

### ✅ Hook Tests

#### `useLoyalty.test.tsx`
Tests for the `useLoyalty` custom hook:
- ✅ Fetching profile when user is authenticated
- ✅ Not fetching when user is not authenticated
- ✅ Error handling
- ✅ Reacting to user changes

**Key Patterns:**
- Using `renderHook` from React Native Testing Library
- Mocking context providers
- Testing async behavior with `waitFor`
- Testing hook dependencies

### ✅ Context Tests

#### `RegionContext.test.tsx`
Tests for region context provider:
- ✅ Default region (BE)
- ✅ Loading region from AsyncStorage
- ✅ Setting and persisting region
- ✅ Handling invalid values
- ✅ Error handling for AsyncStorage failures

**Key Patterns:**
- Testing AsyncStorage integration
- Testing state persistence
- Testing error boundaries
- Testing provider isolation

#### `AuthContext.test.tsx`
Tests for authentication context:
- ✅ Initial loading state
- ✅ Loading user from session
- ✅ Handling session errors
- ✅ Listening to auth state changes
- ✅ Sign out functionality
- ✅ Cleanup on unmount

**Key Patterns:**
- Mocking Supabase auth methods
- Testing subscription cleanup
- Testing auth state changes
- Testing error handling

## 🎯 Best Practices Demonstrated

### 1. **Proper Mocking**

```typescript
// Mock external dependencies
jest.mock('../supabaseClient', () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      signUp: jest.fn(),
    },
  },
}));
```

### 2. **Test Organization**

```typescript
describe('ServiceName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('methodName', () => {
    it('should do something specific', async () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### 3. **Async Testing**

```typescript
it('should handle async operations', async () => {
  const { result } = renderHook(() => useHook(), { wrapper });
  
  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });
  
  expect(result.current.data).toBeDefined();
});
```

### 4. **Error Handling Tests**

```typescript
it('should throw error when operation fails', async () => {
  mockService.method.mockRejectedValue(new Error('Failed'));
  
  await expect(service.method()).rejects.toThrow('Failed');
});
```

### 5. **Context Provider Testing**

```typescript
const wrapper = ({ children }) => (
  <Provider>{children}</Provider>
);

const { result } = renderHook(() => useContext(), { wrapper });
```

## 📝 Writing New Tests

### For Services

1. Mock the external dependencies (Supabase, APIs, etc.)
2. Test success cases
3. Test error cases
4. Test edge cases (null, empty, invalid inputs)
5. Verify correct method calls and parameters

### For Hooks

1. Create a wrapper with required providers
2. Test initial state
3. Test async operations with `waitFor`
4. Test dependency changes
5. Test error states

### For Contexts

1. Test initial state
2. Test state updates
3. Test persistence (if applicable)
4. Test error handling
5. Test provider isolation (error when used outside)

### For Components

1. Render the component
2. Test rendering with different props
3. Test user interactions
4. Test conditional rendering
5. Test accessibility

## 🚀 Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- loyaltyService.test.ts

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

## 📊 Current Test Coverage

- ✅ **Services**: `loyaltyService`, `authService`
- ✅ **Hooks**: `useLoyalty`
- ✅ **Contexts**: `CartContext`, `RegionContext`, `AuthContext`
- ✅ **Components**: `LoadingSpinner`
- ✅ **Utils**: `validation`, `formatting`

## 🎓 Next Steps

Consider adding tests for:
- [ ] `useFoxyProducts` hook
- [ ] `useOrderHistory` hook
- [ ] Screen components (MenuScreen, CartScreen, etc.)
- [ ] Navigation components
- [ ] Foxy API service
- [ ] Webflow service
- [ ] Notification services

## 💡 Tips

1. **Start with critical paths**: Test business logic first
2. **Test behavior, not implementation**: Focus on what the code does, not how
3. **Keep tests simple**: One assertion per test when possible
4. **Use descriptive names**: Test names should explain what they test
5. **Mock external dependencies**: Don't make real API calls in tests
6. **Test edge cases**: Null, empty, invalid inputs
7. **Clean up**: Use `beforeEach` to reset mocks

## 📚 Resources

- [Jest Documentation](https://jestjs.io/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)


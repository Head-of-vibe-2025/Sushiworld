import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { RegionProvider, useRegion } from '../RegionContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <RegionProvider>{children}</RegionProvider>
);

describe('RegionContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.clear();
  });

  it('should provide default region (BE)', () => {
    const { result } = renderHook(() => useRegion(), { wrapper });

    expect(result.current.region).toBe('BE');
  });

  it('should load region from AsyncStorage on mount', async () => {
    await AsyncStorage.setItem('@sushi_world_region', 'LU');

    const { result } = renderHook(() => useRegion(), { wrapper });

    await waitFor(() => {
      expect(result.current.region).toBe('LU');
    });
  });

  it('should set and persist region', async () => {
    const { result } = renderHook(() => useRegion(), { wrapper });

    act(() => {
      result.current.setRegion('LU');
    });

    expect(result.current.region).toBe('LU');

    // Verify it's saved to AsyncStorage
    const stored = await AsyncStorage.getItem('@sushi_world_region');
    expect(stored).toBe('LU');
  });

  it('should ignore invalid region values from storage', async () => {
    await AsyncStorage.setItem('@sushi_world_region', 'INVALID');

    const { result } = renderHook(() => useRegion(), { wrapper });

    // Should default to BE since 'INVALID' is not a valid region
    await waitFor(() => {
      expect(result.current.region).toBe('BE');
    });
  });

  it('should handle AsyncStorage errors gracefully', async () => {
    // Mock AsyncStorage.getItem to throw an error
    jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('Storage error'));

    const { result } = renderHook(() => useRegion(), { wrapper });

    // Should still provide default region
    expect(result.current.region).toBe('BE');
  });

  it('should handle AsyncStorage setItem errors gracefully', async () => {
    // Mock AsyncStorage.setItem to throw an error
    jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('Storage error'));

    const { result } = renderHook(() => useRegion(), { wrapper });

    act(() => {
      result.current.setRegion('LU');
    });

    // Region should still be updated in state even if storage fails
    expect(result.current.region).toBe('LU');
  });

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useRegion());
    }).toThrow('useRegion must be used within a RegionProvider');

    consoleSpy.mockRestore();
  });
});


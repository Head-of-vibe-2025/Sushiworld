import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../AuthContext';
import { supabase } from '../../services/supabase/supabaseClient';
import type { User } from '@supabase/supabase-js';

// Mock Supabase client
jest.mock('../../services/supabase/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  const mockUser: User = {
    id: 'user-1',
    email: 'test@example.com',
    created_at: '2024-01-01T00:00:00Z',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
  };

  const mockSession = {
    user: mockUser,
    access_token: 'token',
    refresh_token: 'refresh',
    expires_in: 3600,
    expires_at: Date.now() / 1000 + 3600,
    token_type: 'bearer',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide initial loading state', () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null, user: null },
      error: null,
    });

    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.loading).toBe(true);
  });

  it('should load user from session on mount', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession, user: mockUser },
      error: null,
    });

    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
  });

  it('should handle session errors gracefully', async () => {
    mockSupabase.auth.getSession.mockRejectedValue(new Error('Session error'));

    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
  });

  it('should listen to auth state changes', async () => {
    const unsubscribeMock = jest.fn();
    const onAuthStateChangeCallback = jest.fn();

    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null, user: null },
      error: null,
    });

    mockSupabase.auth.onAuthStateChange.mockImplementation((callback) => {
      // Store callback for later use
      onAuthStateChangeCallback.mockImplementation(callback);
      return {
        data: { subscription: { unsubscribe: unsubscribeMock } },
      };
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Simulate auth state change
    act(() => {
      onAuthStateChangeCallback('SIGNED_IN', mockSession);
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });
  });

  it('should sign out user', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession, user: mockUser },
      error: null,
    });

    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    });

    mockSupabase.auth.signOut.mockResolvedValue({
      error: null,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.signOut();
    });

    expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
  });

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');

    consoleSpy.mockRestore();
  });

  it('should cleanup subscription on unmount', () => {
    const unsubscribeMock = jest.fn();

    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null, user: null },
      error: null,
    });

    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: unsubscribeMock } },
    });

    const { unmount } = renderHook(() => useAuth(), { wrapper });

    unmount();

    expect(unsubscribeMock).toHaveBeenCalled();
  });
});


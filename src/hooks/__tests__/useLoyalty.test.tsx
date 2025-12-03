import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { useLoyalty } from '../useLoyalty';
import { AuthProvider } from '../../context/AuthContext';
import { loyaltyService } from '../../services/supabase/loyaltyService';
import type { Profile } from '../../types/supabase.types';

// Mock dependencies
jest.mock('../../services/supabase/loyaltyService');
jest.mock('../../context/AuthContext', () => ({
  ...jest.requireActual('../../context/AuthContext'),
  useAuth: jest.fn(),
}));

const mockLoyaltyService = loyaltyService as jest.Mocked<typeof loyaltyService>;
const { useAuth } = require('../../context/AuthContext');

const mockProfile: Profile = {
  id: 'profile-1',
  email: 'test@example.com',
  loyalty_points: 500,
  points_pending_claim: 0,
  welcome_bonus_claimed: true,
  has_claimed_account: true,
  preferred_region: 'BE',
  preferences: {},
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useLoyalty', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch profile when user is authenticated', async () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
    };

    useAuth.mockReturnValue({ user: mockUser });
    mockLoyaltyService.getProfile.mockResolvedValue(mockProfile);

    const { result } = renderHook(() => useLoyalty(), { wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.profile).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockLoyaltyService.getProfile).toHaveBeenCalledWith('test@example.com');
    expect(result.current.profile).toEqual(mockProfile);
    expect(result.current.error).toBeNull();
  });

  it('should not fetch profile when user is not authenticated', async () => {
    useAuth.mockReturnValue({ user: null });

    const { result } = renderHook(() => useLoyalty(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockLoyaltyService.getProfile).not.toHaveBeenCalled();
    expect(result.current.profile).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should handle errors when fetching profile fails', async () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
    };
    const mockError = new Error('Failed to fetch profile');

    useAuth.mockReturnValue({ user: mockUser });
    mockLoyaltyService.getProfile.mockRejectedValue(mockError);

    const { result } = renderHook(() => useLoyalty(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.profile).toBeNull();
    expect(result.current.error).toEqual(mockError);
  });

  it('should handle user email changes', async () => {
    const mockUser1 = {
      id: 'user-1',
      email: 'test1@example.com',
    };
    const mockUser2 = {
      id: 'user-2',
      email: 'test2@example.com',
    };

    useAuth.mockReturnValue({ user: mockUser1 });
    mockLoyaltyService.getProfile.mockResolvedValue(mockProfile);

    const { result, rerender } = renderHook(() => useLoyalty(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockLoyaltyService.getProfile).toHaveBeenCalledWith('test1@example.com');

    // Change user
    useAuth.mockReturnValue({ user: mockUser2 });
    rerender();

    await waitFor(() => {
      expect(mockLoyaltyService.getProfile).toHaveBeenCalledWith('test2@example.com');
    });
  });

  it('should return null profile when user has no email', async () => {
    const mockUser = {
      id: 'user-1',
      email: undefined,
    };

    useAuth.mockReturnValue({ user: mockUser });

    const { result } = renderHook(() => useLoyalty(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockLoyaltyService.getProfile).not.toHaveBeenCalled();
    expect(result.current.profile).toBeNull();
  });
});


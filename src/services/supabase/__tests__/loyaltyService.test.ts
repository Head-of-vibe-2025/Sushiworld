import { loyaltyService } from '../loyaltyService';
import { supabase } from '../supabaseClient';
import type { Profile, LoyaltyTransaction } from '../../../types/supabase.types';

// Mock Supabase client
jest.mock('../supabaseClient', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('loyaltyService', () => {
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

  const mockTransaction: LoyaltyTransaction = {
    id: 'tx-1',
    email: 'test@example.com',
    points: 100,
    transaction_type: 'earned',
    order_id: 'order-1',
    created_at: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should return profile when found', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: mockProfile,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      const result = await loyaltyService.getProfile('test@example.com');

      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('email', 'test@example.com');
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(mockProfile);
    });

    it('should return null when profile not found', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'Not found' },
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      const result = await loyaltyService.getProfile('notfound@example.com');

      expect(result).toBeNull();
    });

    it('should throw error for other database errors', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: { code: 'PGRST500', message: 'Database error' },
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      await expect(
        loyaltyService.getProfile('test@example.com')
      ).rejects.toEqual({ code: 'PGRST500', message: 'Database error' });
    });
  });

  describe('getProfileById', () => {
    it('should return profile by ID', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: mockProfile,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      const result = await loyaltyService.getProfileById('profile-1');

      expect(mockEq).toHaveBeenCalledWith('id', 'profile-1');
      expect(result).toEqual(mockProfile);
    });
  });

  describe('getLoyaltyTransactions', () => {
    it('should return loyalty transactions ordered by date', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockResolvedValue({
        data: [mockTransaction],
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        order: mockOrder,
      });

      const result = await loyaltyService.getLoyaltyTransactions('test@example.com');

      expect(mockEq).toHaveBeenCalledWith('email', 'test@example.com');
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(result).toEqual([mockTransaction]);
    });

    it('should throw error if query fails', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Query failed' },
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        order: mockOrder,
      });

      await expect(
        loyaltyService.getLoyaltyTransactions('test@example.com')
      ).rejects.toEqual({ message: 'Query failed' });
    });
  });

  describe('updatePreferences', () => {
    it('should update user preferences', async () => {
      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockResolvedValue({
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
      });

      const preferences = { notifications: true, language: 'en' };
      await loyaltyService.updatePreferences('profile-1', preferences);

      expect(mockUpdate).toHaveBeenCalledWith({ preferences });
      expect(mockEq).toHaveBeenCalledWith('id', 'profile-1');
    });

    it('should throw error if update fails', async () => {
      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockResolvedValue({
        error: { message: 'Update failed' },
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
      });

      await expect(
        loyaltyService.updatePreferences('profile-1', {})
      ).rejects.toEqual({ message: 'Update failed' });
    });
  });
});


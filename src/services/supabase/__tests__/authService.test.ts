import { authService } from '../authService';
import { supabase } from '../supabaseClient';
import { LOYALTY_CONFIG } from '../../../utils/constants';

// Mock Supabase client
jest.mock('../supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
    },
    from: jest.fn(),
  },
}));

// Mock validation utility
jest.mock('../../../utils/validation', () => ({
  sanitizeEmail: jest.fn((email: string) => email.trim().toLowerCase()),
}));

describe('authService', () => {
  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    created_at: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should sign up user and claim account', async () => {
      // Setup mocks for claimAccount first (called after signUp)
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: { code: 'PGRST116' }, // Not found - new profile
      });

      const mockInsert = jest.fn().mockResolvedValue({
        error: null,
      });

      // Setup auth.signUp mock
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: mockUser, session: null },
        error: null,
      });

      // Setup from() mocks for claimAccount
      (supabase.from as jest.Mock)
        .mockReturnValueOnce({
          select: mockSelect,
          eq: mockEq,
          single: mockSingle,
        })
        .mockReturnValueOnce({
          insert: mockInsert,
        });

      const result = await authService.signUp({
        email: '  Test@Example.COM  ',
        password: 'password123',
        preferredRegion: 'BE',
      });

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result).toBeDefined();
      expect(result.user).toEqual(mockUser);
    });

    it('should throw error if signup fails', async () => {
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Signup failed' },
      });

      await expect(
        authService.signUp({
          email: 'test@example.com',
          password: 'password123',
        })
      ).rejects.toEqual({ message: 'Signup failed' });
    });
  });

  describe('signIn', () => {
    it('should sign in user with sanitized email', async () => {
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: mockUser, session: {} },
        error: null,
      });

      const result = await authService.signIn({
        email: '  Test@Example.COM  ',
        password: 'password123',
      });

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.user).toEqual(mockUser);
    });

    it('should throw error if signin fails', async () => {
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' },
      });

      await expect(
        authService.signIn({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toEqual({ message: 'Invalid credentials' });
    });
  });

  describe('signOut', () => {
    it('should sign out user', async () => {
      (supabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: null,
      });

      await authService.signOut();

      expect(supabase.auth.signOut).toHaveBeenCalled();
    });

    it('should throw error if signout fails', async () => {
      (supabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: { message: 'Signout failed' },
      });

      await expect(authService.signOut()).rejects.toEqual({
        message: 'Signout failed',
      });
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
      });

      const result = await authService.getCurrentUser();

      expect(result).toEqual(mockUser);
    });
  });

  describe('claimAccount', () => {
    it('should create new profile with welcome bonus', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: { code: 'PGRST116' }, // Not found
      });

      const mockInsert = jest.fn().mockResolvedValue({
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValueOnce({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      }).mockReturnValueOnce({
        insert: mockInsert,
      });

      await authService.claimAccount('test@example.com', 'BE');

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          has_claimed_account: true,
          loyalty_points: LOYALTY_CONFIG.WELCOME_BONUS_POINTS,
          welcome_bonus_claimed: true,
          preferred_region: 'BE',
        })
      );
    });

    it('should update existing profile and claim pending points', async () => {
      const existingProfile = {
        id: 'profile-1',
        email: 'test@example.com',
        loyalty_points: 500,
        points_pending_claim: 200,
        welcome_bonus_claimed: false,
      };

      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: existingProfile,
        error: null,
      });

      const mockUpdate = jest.fn().mockReturnThis();
      const mockUpdateEq = jest.fn().mockResolvedValue({
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValueOnce({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      }).mockReturnValueOnce({
        update: mockUpdate,
        eq: mockUpdateEq,
      });

      await authService.claimAccount('test@example.com');

      const expectedPoints =
        existingProfile.loyalty_points +
        existingProfile.points_pending_claim +
        LOYALTY_CONFIG.WELCOME_BONUS_POINTS;

      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          has_claimed_account: true,
          loyalty_points: expectedPoints,
          points_pending_claim: 0,
          welcome_bonus_claimed: true,
        })
      );
    });
  });
});


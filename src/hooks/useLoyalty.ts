// Hook for fetching loyalty points
// TODO: Implement with React Query when Supabase integration is ready

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { loyaltyService } from '../services/supabase/loyaltyService';
import type { Profile } from '../types/supabase.types';

export const useLoyalty = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await loyaltyService.getProfile(user.email);
        setProfile(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  return { profile, loading, error };
};


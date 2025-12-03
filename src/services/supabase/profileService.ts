// Supabase Profile Service

import { supabase } from './supabaseClient';
import type { Profile } from '../../types/supabase.types';

export const profileService = {
  async getProfile(email: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data as Profile;
  },

  async updateProfile(profileId: string, updates: Partial<Profile>) {
    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', profileId);

    if (error) throw error;
  },
};


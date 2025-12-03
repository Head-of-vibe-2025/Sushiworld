// Supabase Loyalty Service

import { supabase } from './supabaseClient';
import type { Profile, LoyaltyTransaction } from '../../types/supabase.types';

export const loyaltyService = {
  async getProfile(email: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return data as Profile;
  },

  async getProfileById(profileId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data as Profile;
  },

  async getLoyaltyTransactions(email: string): Promise<LoyaltyTransaction[]> {
    const { data, error } = await supabase
      .from('loyalty_transactions')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as LoyaltyTransaction[];
  },

  async updatePreferences(profileId: string, preferences: Record<string, any>) {
    const { error } = await supabase
      .from('profiles')
      .update({ preferences })
      .eq('id', profileId);

    if (error) throw error;
  },
};


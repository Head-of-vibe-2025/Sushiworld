// Supabase Authentication Service

import { supabase } from './supabaseClient';
import { sanitizeEmail } from '../../utils/validation';
import { LOYALTY_CONFIG } from '../../utils/constants';

export interface SignUpData {
  email: string;
  password: string;
  preferredRegion?: 'BE' | 'LU';
}

export interface SignInData {
  email: string;
  password: string;
}

export const authService = {
  async signUp({ email, password, preferredRegion }: SignUpData) {
    const sanitizedEmail = sanitizeEmail(email);
    
    const { data, error } = await supabase.auth.signUp({
      email: sanitizedEmail,
      password,
    });

    if (error) throw error;

    // Create profile and claim pending points
    if (data.user) {
      await this.claimAccount(sanitizedEmail, preferredRegion);
    }

    return data;
  },

  async signIn({ email, password }: SignInData) {
    const sanitizedEmail = sanitizeEmail(email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: sanitizedEmail,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async claimAccount(email: string, preferredRegion?: 'BE' | 'LU') {
    // This will be called when user creates account
    // Merges pending points and awards welcome bonus
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    const pointsPendingClaim = data?.points_pending_claim || 0;
    const welcomeBonusClaimed = data?.welcome_bonus_claimed || false;

    const updates: any = {
      has_claimed_account: true,
      loyalty_points: (data?.loyalty_points || 0) + pointsPendingClaim,
      points_pending_claim: 0,
    };

    if (!welcomeBonusClaimed) {
      updates.loyalty_points = updates.loyalty_points + LOYALTY_CONFIG.WELCOME_BONUS_POINTS;
      updates.welcome_bonus_claimed = true;
    }

    if (preferredRegion) {
      updates.preferred_region = preferredRegion;
    }

    if (data) {
      // Update existing profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('email', email);

      if (updateError) throw updateError;
    } else {
      // Create new profile
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          email,
          ...updates,
        });

      if (insertError) throw insertError;
    }
  },
};


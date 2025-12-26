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
    // Profile is automatically created by database trigger
    // When email confirmation is disabled, signUp returns a session immediately
    if (data.user) {
      // Check if email confirmation is required (email_confirmed_at will be null)
      const needsEmailConfirmation = data.user.email_confirmed_at === null || data.user.email_confirmed_at === undefined;
      
      // Use session from signUp response if available, otherwise wait for it
      let session = data.session;
      
      if (!session) {
        // Wait for session to be established (should happen quickly when email confirmation is disabled)
        let retries = 15;
        while (retries > 0 && !session) {
          await new Promise(resolve => setTimeout(resolve, 200));
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          if (currentSession) {
            session = currentSession;
            break;
          }
          retries--;
        }
      }
      
      if (session) {
        await this.claimAccount(sanitizedEmail, preferredRegion);
      } else if (needsEmailConfirmation) {
        // Email confirmation is required - user needs to confirm their email first
        // For development: Disable email confirmation in Supabase Dashboard → Authentication → Settings → Email Auth
        throw new Error('Account created! Email confirmation is required. Check your email or disable email confirmation in Supabase Dashboard (see FIX_EMAIL_CONFIRMATION.md)');
      } else {
        // If no session after retries, try signing in to establish session
        // This can happen if email confirmation is enabled on the production Supabase instance
        console.warn('No session available after signup, attempting to sign in to establish session...');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: sanitizedEmail,
          password,
        });
        
        if (signInError) {
          // Check if the error is due to email not being confirmed
          const errorMessage = signInError.message || '';
          const errorCode = signInError.status || '';
          
          // Check for email confirmation required errors
          if (errorMessage.toLowerCase().includes('email not confirmed') || 
              errorMessage.toLowerCase().includes('email_not_confirmed') ||
              errorMessage.toLowerCase().includes('email needs to be confirmed') ||
              errorMessage.toLowerCase().includes('email_not_verified') ||
              errorMessage.toLowerCase().includes('confirm your email') ||
              errorCode === 401) {
            throw new Error('Account created! Email confirmation required. Check your email or disable email confirmation in Supabase Dashboard (see FIX_EMAIL_CONFIRMATION.md for instructions)');
          }
          // Log the actual error for debugging
          console.error('Sign-in error after signup:', {
            message: signInError.message,
            status: signInError.status,
            error: signInError
          });
          throw new Error(`Account created but could not sign in: ${errorMessage}. Please try signing in manually.`);
        }
        
        if (!signInData?.session) {
          throw new Error('Account created but session could not be established. Please try signing in manually.');
        }
        
        // Session established via sign in, proceed with claim
        await this.claimAccount(sanitizedEmail, preferredRegion);
      }
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

  async resetPasswordForEmail(email: string) {
    const sanitizedEmail = sanitizeEmail(email);
    
    // Use Supabase callback URL that will open directly in the app via Universal Links/App Links
    // The app is configured to handle URLs from the Supabase domain
    // When the email link is clicked, it will open in the app (not browser) if app is installed
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error('EXPO_PUBLIC_SUPABASE_URL is not configured');
    }
    
    // Use the callback URL that will redirect to the app via deep link
    // The flow: Email link → Supabase /verify → /callback with tokens → redirects to app scheme
    // This works in browsers because they can follow the callback URL, which then redirects to app
    
    const appScheme = 'sushiworld://reset-password';
    // Build callback URL with app scheme as redirect_to
    // Format: https://[project].supabase.co/auth/v1/callback?redirect_to=sushiworld://reset-password
    const callbackUrl = `${supabaseUrl}/auth/v1/callback?redirect_to=${encodeURIComponent(appScheme)}`;
    
    console.log('🔐 Requesting password reset for:', sanitizedEmail);
    console.log('🔗 Callback URL:', callbackUrl);
    
    const { data, error } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
      redirectTo: callbackUrl,
    });

    if (error) {
      console.error('❌ Password reset error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      throw error;
    }
    
    // Log the full response to see what Supabase returns
    console.log('📦 Supabase response data:', JSON.stringify(data, null, 2));
    
    // Note: Supabase returns success even if user doesn't exist (to prevent email enumeration)
    // But if user exists and email service is configured, email should be sent
    console.log('✅ Password reset request completed');
    console.log('📧 If user exists, check:');
    console.log('   1. Email inbox (and spam folder)');
    console.log('   2. Supabase Dashboard > Settings > Auth > Email');
    console.log('   3. Supabase Dashboard > Logs > Auth Logs');
  },

  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  },

  async claimAccount(email: string, preferredRegion?: 'BE' | 'LU') {
    // This will be called when user creates account
    // Profile is now automatically created by database trigger, so we just update it
    // Merges pending points and awards welcome bonus
    
    // Wait a bit for the trigger to create the profile
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Try to get the profile - use maybeSingle() to avoid errors if it doesn't exist yet
    let profile = null;
    let retries = 3;
    
    while (retries > 0 && !profile) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        // If it's not a "not found" error, throw it
        throw error;
      }

      if (data) {
        profile = data;
        break;
      }

      // Profile not found yet, wait and retry
      retries--;
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    if (!profile) {
      // Profile still doesn't exist after retries - this shouldn't happen with the trigger
      // But we'll handle it gracefully by just logging and continuing
      console.warn('Profile not found after signup, trigger may have failed');
      return;
    }

    const pointsPendingClaim = profile.points_pending_claim || 0;
    const welcomeBonusClaimed = profile.welcome_bonus_claimed || false;

    const updates: any = {
      has_claimed_account: true,
      loyalty_points: (profile.loyalty_points || 0) + pointsPendingClaim,
      points_pending_claim: 0,
    };

    if (!welcomeBonusClaimed) {
      updates.loyalty_points = updates.loyalty_points + LOYALTY_CONFIG.WELCOME_BONUS_POINTS;
      updates.welcome_bonus_claimed = true;
    }

    if (preferredRegion) {
      updates.preferred_region = preferredRegion;
    }

    // Update existing profile (should always exist now due to trigger)
    const { error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('email', email);

    if (updateError) throw updateError;
  },
};


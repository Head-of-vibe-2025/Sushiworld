// Supabase Client Setup

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  const missing = [];
  if (!supabaseUrl) missing.push('EXPO_PUBLIC_SUPABASE_URL');
  if (!supabaseAnonKey) missing.push('EXPO_PUBLIC_SUPABASE_ANON_KEY');
  
  const errorMsg = `❌ Missing required environment variables: ${missing.join(', ')}\n` +
    `Please set these in your .env file. See .env.example for reference.`;
  
  if (__DEV__) {
    console.error(errorMsg);
    // In development, use placeholders but warn
    console.warn('⚠️ Using placeholder values. App may not work correctly.');
  } else {
    // In production, log error but don't throw to prevent app crash
    // The app will still try to work, but auth features won't function
    console.error(errorMsg);
    console.error('⚠️ App will continue but authentication features may not work.');
  }
}

// Use placeholders only in development if values are missing
const finalSupabaseUrl = supabaseUrl || 'https://placeholder.supabase.co';
const finalSupabaseAnonKey = supabaseAnonKey || 'placeholder-key';

export const supabase = createClient<Database>(finalSupabaseUrl, finalSupabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true, // Enable to detect session from URL hash fragments
    flowType: 'pkce', // Use PKCE flow for better security
  },
});


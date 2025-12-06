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
    // In production, throw error to prevent app from running with invalid config
    throw new Error(errorMsg);
  }
}

// Use placeholders only in development if values are missing
const finalSupabaseUrl = supabaseUrl || 'https://placeholder.supabase.co';
const finalSupabaseAnonKey = supabaseAnonKey || 'placeholder-key';

export const supabase = createClient<Database>(finalSupabaseUrl, finalSupabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});


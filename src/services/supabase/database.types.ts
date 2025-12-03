// Auto-generated Supabase types (placeholder - will be generated from Supabase CLI)
// Run: npx supabase gen types typescript --project-id your-project-id > src/services/supabase/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          foxy_customer_id: string | null
          loyalty_points: number
          points_pending_claim: number
          has_claimed_account: boolean
          welcome_bonus_claimed: boolean
          preferences: Json
          push_enabled: boolean
          preferred_region: 'BE' | 'LU' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          foxy_customer_id?: string | null
          loyalty_points?: number
          points_pending_claim?: number
          has_claimed_account?: boolean
          welcome_bonus_claimed?: boolean
          preferences?: Json
          push_enabled?: boolean
          preferred_region?: 'BE' | 'LU' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          foxy_customer_id?: string | null
          loyalty_points?: number
          points_pending_claim?: number
          has_claimed_account?: boolean
          welcome_bonus_claimed?: boolean
          preferences?: Json
          push_enabled?: boolean
          preferred_region?: 'BE' | 'LU' | null
          created_at?: string
          updated_at?: string
        }
      }
      loyalty_transactions: {
        Row: {
          id: string
          profile_id: string | null
          email: string
          points: number
          source: 'purchase' | 'redemption' | 'welcome_bonus'
          foxy_transaction_id: string | null
          status: 'pending' | 'credited' | 'redeemed'
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          profile_id?: string | null
          email: string
          points: number
          source: 'purchase' | 'redemption' | 'welcome_bonus'
          foxy_transaction_id?: string | null
          status?: 'pending' | 'credited' | 'redeemed'
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string | null
          email?: string
          points?: number
          source?: 'purchase' | 'redemption' | 'welcome_bonus'
          foxy_transaction_id?: string | null
          status?: 'pending' | 'credited' | 'redeemed'
          description?: string | null
          created_at?: string
        }
      }
      push_tokens: {
        Row: {
          id: string
          profile_id: string | null
          token: string
          platform: 'ios' | 'android'
          created_at: string
        }
        Insert: {
          id?: string
          profile_id?: string | null
          token: string
          platform: 'ios' | 'android'
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string | null
          token?: string
          platform?: 'ios' | 'android'
          created_at?: string
        }
      }
      generated_coupons: {
        Row: {
          id: string
          profile_id: string | null
          email: string
          foxy_coupon_code: string
          type: 'welcome' | 'loyalty_redemption'
          value: number
          points_cost: number | null
          used: boolean
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          profile_id?: string | null
          email: string
          foxy_coupon_code: string
          type: 'welcome' | 'loyalty_redemption'
          value: number
          points_cost?: number | null
          used?: boolean
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string | null
          email?: string
          foxy_coupon_code?: string
          type?: 'welcome' | 'loyalty_redemption'
          value?: number
          points_cost?: number | null
          used?: boolean
          expires_at?: string | null
          created_at?: string
        }
      }
    }
  }
}


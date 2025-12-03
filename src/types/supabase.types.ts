// Supabase Database Types

export interface Profile {
  id: string;
  email: string;
  foxy_customer_id?: string;
  loyalty_points: number;
  points_pending_claim: number;
  has_claimed_account: boolean;
  welcome_bonus_claimed: boolean;
  preferences: Record<string, any>;
  push_enabled: boolean;
  preferred_region?: 'BE' | 'LU';
  created_at: string;
  updated_at: string;
}

export interface LoyaltyTransaction {
  id: string;
  profile_id?: string;
  email: string;
  points: number;
  source: 'purchase' | 'redemption' | 'welcome_bonus';
  foxy_transaction_id?: string;
  status: 'pending' | 'credited' | 'redeemed';
  description?: string;
  created_at: string;
}

export interface PushToken {
  id: string;
  profile_id?: string;
  token: string;
  platform: 'ios' | 'android';
  created_at: string;
}

export interface GeneratedCoupon {
  id: string;
  profile_id?: string;
  email: string;
  foxy_coupon_code: string;
  type: 'welcome' | 'loyalty_redemption';
  value: number;
  points_cost?: number;
  used: boolean;
  expires_at?: string;
  created_at: string;
}

export interface MenuCategory {
  id: string;
  webflow_id: string;
  name: string;
  code: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  webflow_id: string;
  name: string;
  code: string;
  price: number;
  description?: string;
  image_url?: string;
  category_id?: string;
  category_webflow_id?: string;
  region: 'BE' | 'LU' | 'BOTH';
  is_available: boolean;
  sku_id?: string;
  created_at: string;
  updated_at: string;
}


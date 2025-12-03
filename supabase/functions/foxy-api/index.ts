// Supabase Edge Function: Foxy.io API Proxy
// This function handles all Foxy.io API calls server-side to keep credentials secure

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Foxy API Base URL - configurable via environment variable
// Can be https://api.foxy.io (newer) or https://api.foxycart.com (legacy)
const FOXY_API_BASE = Deno.env.get('FOXY_API_BASE') || 'https://api.foxy.io';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Cache for access token to avoid unnecessary requests
let tokenCache: { token: string; expiresAt: number } | null = null;

/**
 * Get OAuth access token from Foxy.io
 * Uses client credentials flow
 */
async function getAccessToken(): Promise<string> {
  // Check cache first
  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.token;
  }

  const clientId = Deno.env.get('FOXY_CLIENT_ID');
  const clientSecret = Deno.env.get('FOXY_CLIENT_SECRET');

  if (!clientId || !clientSecret) {
    throw new Error('FOXY_CLIENT_ID and FOXY_CLIENT_SECRET must be set');
  }

  const response = await fetch(`${FOXY_API_BASE}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get Foxy access token: ${response.status} ${errorText}`);
  }

  const data: TokenResponse = await response.json();
  
  // Cache token (expire 5 minutes before actual expiry for safety)
  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 300) * 1000,
  };

  return data.access_token;
}

/**
 * Make authenticated request to Foxy.io API
 */
async function foxyRequest(
  accessToken: string,
  endpoint: string,
  storeId: string,
  options: RequestInit = {}
): Promise<any> {
  const url = `${FOXY_API_BASE}/stores/${storeId}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Foxy API error (${response.status}): ${errorText}`);
  }

  return response.json();
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, storeId, ...params } = await req.json();

    if (!action) {
      throw new Error('Action is required');
    }

    if (!storeId) {
      throw new Error('Store ID is required');
    }

    const accessToken = await getAccessToken();
    let result;

    switch (action) {
      case 'getTransactions': {
        // Get transactions for a customer
        const email = params.email;
        if (!email) {
          throw new Error('Email is required for getTransactions');
        }
        
        result = await foxyRequest(
          accessToken,
          `/transactions?customer_email=${encodeURIComponent(email)}`,
          storeId
        );
        break;
      }

      case 'getTransaction': {
        // Get a specific transaction by ID
        const transactionId = params.transactionId;
        if (!transactionId) {
          throw new Error('Transaction ID is required');
        }
        
        result = await foxyRequest(
          accessToken,
          `/transactions/${transactionId}`,
          storeId
        );
        break;
      }

      case 'getCustomer': {
        // Get customer by email
        const email = params.email;
        if (!email) {
          throw new Error('Email is required for getCustomer');
        }
        
        result = await foxyRequest(
          accessToken,
          `/customers?email=${encodeURIComponent(email)}`,
          storeId
        );
        break;
      }

      case 'createCoupon': {
        // Create a coupon (for loyalty redemption)
        const couponData = params.couponData;
        if (!couponData) {
          throw new Error('Coupon data is required');
        }

        result = await foxyRequest(
          accessToken,
          '/coupons',
          storeId,
          {
            method: 'POST',
            body: JSON.stringify(couponData),
          }
        );
        break;
      }

      case 'getCoupon': {
        // Get coupon by code
        const code = params.code;
        if (!code) {
          throw new Error('Coupon code is required');
        }
        
        result = await foxyRequest(
          accessToken,
          `/coupons?code=${encodeURIComponent(code)}`,
          storeId
        );
        break;
      }

      case 'getItems': {
        // Get products/items (if using Foxy for products)
        const categoryId = params.categoryId;
        const endpoint = categoryId 
          ? `/items?item_category_id=${categoryId}`
          : '/items';
        
        result = await foxyRequest(accessToken, endpoint, storeId);
        break;
      }

      case 'getCategories': {
        // Get product categories (if using Foxy for products)
        result = await foxyRequest(accessToken, '/item_categories', storeId);
        break;
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Foxy API error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});


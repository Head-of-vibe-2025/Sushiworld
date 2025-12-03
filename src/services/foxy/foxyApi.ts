// Foxy.io API Client
// All API calls are proxied through Supabase Edge Functions to keep credentials secure

import { supabase } from '../supabase/supabaseClient';
import { STORE_IDS } from '../../utils/constants';
import type { FoxyProduct, FoxyCategory, FoxyTransaction, FoxyCustomer } from '../../types/foxy.types';

/**
 * Call Foxy API via Supabase Edge Function
 */
async function callFoxyApi(action: string, storeId: string, params: any = {}): Promise<any> {
  const { data, error } = await supabase.functions.invoke('foxy-api', {
    body: {
      action,
      storeId,
      ...params,
    },
  });

  if (error) {
    throw new Error(`Foxy API error: ${error.message}`);
  }

  return data;
}

/**
 * Get product categories from Foxy.io
 */
export async function getCategories(region: 'BE' | 'LU'): Promise<FoxyCategory[]> {
  const storeId = STORE_IDS[region];
  if (!storeId) {
    throw new Error(`Store ID not configured for region: ${region}`);
  }

  try {
    const data = await callFoxyApi('getCategories', storeId);
    return data?._embedded?.['fx:item_categories'] || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Get products from Foxy.io (optionally filtered by category)
 */
export async function getProducts(
  region: 'BE' | 'LU',
  categoryId?: string
): Promise<FoxyProduct[]> {
  const storeId = STORE_IDS[region];
  if (!storeId) {
    throw new Error(`Store ID not configured for region: ${region}`);
  }

  try {
    const data = await callFoxyApi('getItems', storeId, { categoryId });
    return data?._embedded?.['fx:items'] || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Get customer by email from Foxy.io
 */
export async function getCustomerByEmail(
  email: string,
  region: 'BE' | 'LU'
): Promise<FoxyCustomer | null> {
  const storeId = STORE_IDS[region];
  if (!storeId) {
    throw new Error(`Store ID not configured for region: ${region}`);
  }

  try {
    const data = await callFoxyApi('getCustomer', storeId, { email });
    const customers = data?._embedded?.['fx:customers'] || [];
    return customers[0] || null;
  } catch (error) {
    console.error('Error fetching customer:', error);
    return null;
  }
}

/**
 * Get transactions (orders) for a customer from Foxy.io
 */
export async function getTransactions(
  email: string,
  region: 'BE' | 'LU'
): Promise<FoxyTransaction[]> {
  const storeId = STORE_IDS[region];
  if (!storeId) {
    throw new Error(`Store ID not configured for region: ${region}`);
  }

  try {
    const data = await callFoxyApi('getTransactions', storeId, { email });
    return data?._embedded?.['fx:transactions'] || [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

/**
 * Get a specific transaction by ID
 */
export async function getTransaction(
  transactionId: string,
  region: 'BE' | 'LU'
): Promise<FoxyTransaction | null> {
  const storeId = STORE_IDS[region];
  if (!storeId) {
    throw new Error(`Store ID not configured for region: ${region}`);
  }

  try {
    const data = await callFoxyApi('getTransaction', storeId, { transactionId });
    return data || null;
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return null;
  }
}

/**
 * Create a coupon in Foxy.io (for loyalty points redemption)
 */
export async function createCoupon(
  couponData: {
    name: string;
    code: string;
    type: 'flat' | 'percentage';
    amount: number;
    max_uses?: number;
    customer_email_restriction?: string;
    expires_at?: string;
  },
  region: 'BE' | 'LU'
): Promise<any> {
  const storeId = STORE_IDS[region];
  if (!storeId) {
    throw new Error(`Store ID not configured for region: ${region}`);
  }

  try {
    const data = await callFoxyApi('createCoupon', storeId, { couponData });
    return data;
  } catch (error) {
    console.error('Error creating coupon:', error);
    throw error;
  }
}

/**
 * Get coupon by code
 */
export async function getCoupon(
  code: string,
  region: 'BE' | 'LU'
): Promise<any | null> {
  const storeId = STORE_IDS[region];
  if (!storeId) {
    throw new Error(`Store ID not configured for region: ${region}`);
  }

  try {
    const data = await callFoxyApi('getCoupon', storeId, { code });
    const coupons = data?._embedded?.['fx:coupons'] || [];
    return coupons[0] || null;
  } catch (error) {
    console.error('Error fetching coupon:', error);
    return null;
  }
}

// Legacy class-based API for backward compatibility
export class FoxyApiClient {
  private storeId: string;
  private region: 'BE' | 'LU';

  constructor(storeId: string, region: 'BE' | 'LU') {
    this.storeId = storeId;
    this.region = region;
  }

  async getCategories(): Promise<FoxyCategory[]> {
    return getCategories(this.region);
  }

  async getProducts(categoryId?: string): Promise<FoxyProduct[]> {
    return getProducts(this.region, categoryId);
  }

  async getCustomerByEmail(email: string): Promise<FoxyCustomer | null> {
    return getCustomerByEmail(email, this.region);
  }

  async getTransactions(email: string): Promise<FoxyTransaction[]> {
    return getTransactions(email, this.region);
  }
}

export const createFoxyClient = (region: 'BE' | 'LU') => {
  const storeId = STORE_IDS[region];
  return new FoxyApiClient(storeId, region);
};


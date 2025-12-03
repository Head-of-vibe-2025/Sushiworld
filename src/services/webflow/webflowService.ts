// Webflow Menu Service
// Fetches menu data from Supabase Edge Function (which proxies Webflow API)

import type { WebflowMenuItem, WebflowCategory } from '../../types/webflow.types';
import type { Region } from '../../types/app.types';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

class WebflowService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${SUPABASE_URL}/functions/v1/webflow-menu`;
  }

  private async request(endpoint: string, params?: Record<string, string>) {
    const url = new URL(endpoint);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async getMenuItems(region: Region, categoryId?: string): Promise<WebflowMenuItem[]> {
    const params: Record<string, string> = { region };
    if (categoryId) {
      params.categoryId = categoryId;
    }
    return this.request(this.baseUrl, params);
  }

  async getMenuItem(itemId: string): Promise<WebflowMenuItem> {
    return this.request(this.baseUrl, { itemId });
  }

  async getCategories(): Promise<WebflowCategory[]> {
    // Fetch categories from Supabase Edge Function
    const url = new URL(this.baseUrl);
    url.searchParams.append('categories', 'true');
    
    return this.request(url.toString());
  }
}

export const webflowService = new WebflowService();


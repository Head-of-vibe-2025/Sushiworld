// App Constants

export const REGIONS = {
  BE: 'BE' as const,
  LU: 'LU' as const,
} as const;

export const LOYALTY_CONFIG = {
  POINTS_PERCENTAGE: 0.1, // 10% of order value
  WELCOME_BONUS_POINTS: 1000, // €10 = 1000 points (€1 = 100 points)
  POINTS_PER_EURO: 100, // 1 euro = 100 points
  MIN_REDEMPTION_POINTS: 500, // Minimum 500 points (€5) to redeem
} as const;

// Foxy API Base URL - can be api.foxy.io (newer) or api.foxycart.com (legacy)
export const FOXY_API_BASE = process.env.EXPO_PUBLIC_FOXY_API_BASE || 'https://api.foxy.io';

// Belgium-only configuration
export const FOXY_STORE_ID = process.env.EXPO_PUBLIC_FOXY_STORE_ID || process.env.EXPO_PUBLIC_FOXY_STORE_ID_BE || '';
export const FOXY_SUBDOMAIN = process.env.EXPO_PUBLIC_FOXY_SUBDOMAIN || process.env.EXPO_PUBLIC_FOXY_SUBDOMAIN_BE || 'sushiworld-be';

// Legacy support - keeping for backward compatibility
export const STORE_IDS = {
  BE: FOXY_STORE_ID,
  LU: '', // Not used - Belgium only
} as const;

export const FOXY_SUBDOMAINS = {
  BE: FOXY_SUBDOMAIN,
  LU: '', // Not used - Belgium only
} as const;

// Logo URL - should be public or use environment variable
// If using Supabase Storage, use a public URL or generate signed URLs server-side
export const LOGO_URL = process.env.EXPO_PUBLIC_LOGO_URL || 'https://via.placeholder.com/200x60?text=Sushi+World';


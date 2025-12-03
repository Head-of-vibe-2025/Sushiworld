# Foxy.io Integration Setup Guide

This guide will walk you through connecting your Sushi World app to Foxy.io for e-commerce functionality.

## Overview

Your app uses Foxy.io for:
- **Product catalog** (though currently using Webflow)
- **Checkout processing** (redirects to Foxy hosted checkout)
- **Order management** (transaction history)
- **Customer management** (linking Foxy customers to Supabase profiles)
- **Coupon creation** (for loyalty points redemption)

## Prerequisites

1. A Foxy.io account with admin access
2. At least one Foxy store configured (Belgium and/or Luxembourg)
3. Supabase project with Edge Functions enabled

## Step 1: Get Foxy.io Store Information

### Store ID

1. Log in to your Foxy.io admin panel
2. Navigate to **Stores** → Select your Belgium store
3. The Store ID is in the URL: `https://admin.foxy.io/stores/{STORE_ID}` or `https://api.foxycart.com/stores/{STORE_ID}`
   - Example: If URL is `https://api.foxycart.com/stores/102892`, your Store ID is `102892`
4. Copy the Store ID

### Store Subdomain

1. In your Foxy store settings, go to **Store Settings** → **Cart & Checkout**
2. Find your **Cart Subdomain** (e.g., `sushiworld-be.foxycart.com`)
3. Copy the subdomain name (e.g., `sushiworld-be`)

## Step 2: Create OAuth Client (for API Access)

Foxy.io uses OAuth 2.0 for API authentication. You'll need to create an OAuth client:

1. In Foxy admin, go to **Integrations** → **OAuth Clients**
2. Click **Create OAuth Client**
3. Configure:
   - **Name**: "Sushi World Mobile App"
   - **Redirect URI**: `https://your-supabase-project.supabase.co/functions/v1/foxy-callback` (or your callback URL)
   - **Scopes**: Select the scopes you need:
     - `store_transaction_read` - Read transactions/orders
     - `store_transaction_write` - Create transactions (if needed)
     - `store_customer_read` - Read customer data
     - `store_customer_write` - Create/update customers
     - `store_coupon_read` - Read coupons
     - `store_coupon_write` - Create coupons (for loyalty redemption)
     - `store_item_read` - Read products (if using Foxy products)
4. Save and copy:
   - **Client ID**
   - **Client Secret** (save this securely - you won't see it again!)

## Step 3: Configure Environment Variables

Add these to your `.env` file:

```bash
# Foxy.io Store ID
# Example: If your store URL is https://api.foxycart.com/stores/102892, then store ID is 102892
EXPO_PUBLIC_FOXY_STORE_ID=102892
# Or use the BE-specific variable for backward compatibility:
# EXPO_PUBLIC_FOXY_STORE_ID_BE=102892

# Foxy.io Cart Subdomain
EXPO_PUBLIC_FOXY_SUBDOMAIN=sushiworld-be
# Or use the BE-specific variable for backward compatibility:
# EXPO_PUBLIC_FOXY_SUBDOMAIN_BE=sushiworld-be

# Foxy API Base URL (optional - defaults to https://api.foxy.io)
# Use https://api.foxycart.com if you're using the legacy FoxyCart API
EXPO_PUBLIC_FOXY_API_BASE=https://api.foxycart.com

# Foxy.io OAuth (for server-side API calls)
FOXY_CLIENT_ID=your-oauth-client-id
FOXY_CLIENT_SECRET=your-oauth-client-secret
```

**Important**: 
- `EXPO_PUBLIC_*` variables are exposed to the client (safe for store IDs and subdomains)
- `FOXY_CLIENT_SECRET` should **NEVER** be exposed to the client - only use in Supabase Edge Functions

## Step 4: Set Up Supabase Secrets

For server-side API calls, store Foxy credentials as Supabase secrets:

```bash
# Set secrets in Supabase
supabase secrets set FOXY_CLIENT_ID=your-oauth-client-id
supabase secrets set FOXY_CLIENT_SECRET=your-oauth-client-secret

# Optional: Set API base URL if using legacy FoxyCart API
supabase secrets set FOXY_API_BASE=https://api.foxycart.com
```

**Note**: If your store URL uses `api.foxycart.com` (like `https://api.foxycart.com/stores/102892`), set `FOXY_API_BASE` to `https://api.foxycart.com`. Otherwise, the default `https://api.foxy.io` will be used.

Or via Supabase Dashboard:
1. Go to **Project Settings** → **Edge Functions** → **Secrets**
2. Add each secret:
   - `FOXY_CLIENT_ID`
   - `FOXY_CLIENT_SECRET`

## Step 5: Implement Foxy API Client (Server-Side)

Most Foxy API calls should be done server-side via Supabase Edge Functions. Here's how to implement:

### Create a Foxy API Edge Function

Create `supabase/functions/foxy-api/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const FOXY_API_BASE = 'https://api.foxy.io';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Get OAuth access token
async function getAccessToken(): Promise<string> {
  const clientId = Deno.env.get('FOXY_CLIENT_ID')!;
  const clientSecret = Deno.env.get('FOXY_CLIENT_SECRET')!;

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
    throw new Error('Failed to get Foxy access token');
  }

  const data = await response.json();
  return data.access_token;
}

// Make authenticated Foxy API request
async function foxyRequest(accessToken: string, endpoint: string, storeId: string) {
  const url = `${FOXY_API_BASE}/stores/${storeId}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Foxy API error: ${response.statusText}`);
  }

  return response.json();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, storeId, ...params } = await req.json();
    const accessToken = await getAccessToken();

    let result;

    switch (action) {
      case 'getTransactions':
        result = await foxyRequest(
          accessToken,
          `/transactions?customer_email=${params.email}`,
          storeId
        );
        break;

      case 'getCustomer':
        result = await foxyRequest(
          accessToken,
          `/customers?email=${params.email}`,
          storeId
        );
        break;

      case 'createCoupon':
        result = await fetch(`${FOXY_API_BASE}/stores/${storeId}/coupons`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params.couponData),
        }).then(r => r.json());
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

Deploy the function:
```bash
supabase functions deploy foxy-api
```

## Step 6: Configure Webhook

Your webhook handler is already set up at `supabase/functions/foxy-webhook/index.ts`.

1. Deploy the webhook function:
   ```bash
   supabase functions deploy foxy-webhook
   ```

2. Get your webhook URL:
   ```
   https://your-project.supabase.co/functions/v1/foxy-webhook
   ```

3. In Foxy admin, go to **Store Settings** → **Webhooks**
4. Create a new webhook:
   - **Event**: `transaction/created` (or `transaction/updated`)
   - **URL**: Your Supabase Edge Function URL
   - **Method**: `POST`
   - **Format**: `JSON`

5. (Optional) Set up webhook signature verification for security

## Step 7: Update Client-Side Code

Update `src/services/foxy/foxyApi.ts` to call your Supabase Edge Function:

```typescript
import { supabase } from '../supabase/supabaseClient';
import { STORE_IDS } from '../../utils/constants';
import type { FoxyTransaction, FoxyCustomer } from '../../types/foxy.types';

export const getTransactions = async (
  email: string,
  region: 'BE' | 'LU'
): Promise<FoxyTransaction[]> => {
  const storeId = STORE_IDS[region];
  
  const { data, error } = await supabase.functions.invoke('foxy-api', {
    body: {
      action: 'getTransactions',
      storeId,
      email,
    },
  });

  if (error) throw error;
  return data?._embedded?.['fx:transactions'] || [];
};

export const getCustomer = async (
  email: string,
  region: 'BE' | 'LU'
): Promise<FoxyCustomer | null> => {
  const storeId = STORE_IDS[region];
  
  const { data, error } = await supabase.functions.invoke('foxy-api', {
    body: {
      action: 'getCustomer',
      storeId,
      email,
    },
  });

  if (error) throw error;
  const customers = data?._embedded?.['fx:customers'] || [];
  return customers[0] || null;
};
```

## Step 8: Test the Integration

### Test Checkout Flow

1. Add items to cart in your app
2. Proceed to checkout
3. Verify redirect to Foxy checkout works
4. Complete a test order
5. Check that webhook receives the order

### Test API Calls

1. Use the Supabase Edge Function to fetch transactions
2. Verify customer data retrieval
3. Test coupon creation (for loyalty redemption)

## API Endpoints Reference

Foxy.io API documentation: https://api.foxy.io/docs

Key endpoints:
- `GET /stores/{store_id}/transactions` - Get transactions
- `GET /stores/{store_id}/customers` - Get customers
- `POST /stores/{store_id}/coupons` - Create coupon
- `GET /stores/{store_id}/items` - Get products (if using Foxy products)

## Troubleshooting

### OAuth Token Issues
- Verify `FOXY_CLIENT_ID` and `FOXY_CLIENT_SECRET` are correct
- Check that OAuth client has required scopes
- Ensure client credentials grant type is enabled

### Webhook Not Receiving Orders
- Verify webhook URL is correct in Foxy admin
- Check Supabase Edge Function logs
- Ensure webhook is enabled for the correct event type

### API Calls Failing
- Verify store IDs are correct
- Check that access token is being generated
- Review Supabase Edge Function logs for errors

## Security Best Practices

1. **Never expose OAuth secrets** to the client
2. **Always use Supabase Edge Functions** for Foxy API calls
3. **Verify webhook signatures** (implement in webhook handler)
4. **Use HTTPS** for all webhook URLs
5. **Limit OAuth scopes** to only what's needed

## Next Steps

After connecting to Foxy.io:

1. ✅ Implement order history fetching
2. ✅ Add customer sync between Foxy and Supabase
3. ✅ Implement coupon creation for loyalty redemption
4. ✅ Add webhook signature verification
5. ✅ Set up error handling and retry logic

---

For more information, see:
- [Foxy.io API Documentation](https://api.foxy.io/docs)
- [Foxy.io OAuth Guide](https://wiki.foxycart.com/oauth)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)


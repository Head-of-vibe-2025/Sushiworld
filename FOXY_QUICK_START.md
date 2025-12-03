# Foxy.io Quick Start Guide

## Quick Setup Checklist

### 1. Get Foxy Credentials (5 minutes)

- [ ] Log into Foxy.io admin panel
- [ ] Get Store IDs for BE and LU stores (from store URLs)
- [ ] Get Cart Subdomains (from store settings)
- [ ] Create OAuth Client (Integrations → OAuth Clients)
  - [ ] Copy Client ID
  - [ ] Copy Client Secret (save securely!)

### 2. Configure Environment Variables (2 minutes)

Add to `.env`:
```bash
# Store ID (from URL like https://api.foxycart.com/stores/102892)
EXPO_PUBLIC_FOXY_STORE_ID=102892
# Or use the BE-specific variable for backward compatibility
# EXPO_PUBLIC_FOXY_STORE_ID_BE=102892

# Cart subdomain
EXPO_PUBLIC_FOXY_SUBDOMAIN=your-subdomain
# Or use the BE-specific variable for backward compatibility
# EXPO_PUBLIC_FOXY_SUBDOMAIN_BE=your-subdomain

# Optional: API base URL (if using api.foxycart.com instead of api.foxy.io)
EXPO_PUBLIC_FOXY_API_BASE=https://api.foxycart.com
```

### 3. Set Supabase Secrets (2 minutes)

```bash
supabase secrets set FOXY_CLIENT_ID=your-client-id
supabase secrets set FOXY_CLIENT_SECRET=your-client-secret
```

### 4. Deploy Edge Functions (3 minutes)

```bash
# Deploy Foxy API proxy
supabase functions deploy foxy-api

# Deploy webhook handler
supabase functions deploy foxy-webhook
```

### 5. Configure Webhook in Foxy (2 minutes)

- [ ] Go to Foxy admin → Store Settings → Webhooks
- [ ] Add webhook URL: `https://your-project.supabase.co/functions/v1/foxy-webhook`
- [ ] Event: `transaction/created`
- [ ] Method: `POST`

## Testing

### Test Checkout
1. Add items to cart
2. Go to checkout
3. Should redirect to Foxy checkout page

### Test API
```typescript
import { getTransactions } from './services/foxy/foxyApi';

const transactions = await getTransactions('user@example.com', 'BE');
console.log(transactions);
```

## Common Issues

**"Store ID not configured"**
→ Check `.env` file has `EXPO_PUBLIC_FOXY_STORE_ID_BE` and `EXPO_PUBLIC_FOXY_STORE_ID_LU`

**"Failed to get Foxy access token"**
→ Verify Supabase secrets are set correctly: `FOXY_CLIENT_ID` and `FOXY_CLIENT_SECRET`

**Webhook not receiving orders**
→ Check webhook URL in Foxy admin matches your Supabase function URL
→ Check Supabase Edge Function logs for errors

## Next Steps

See [FOXY_SETUP.md](./FOXY_SETUP.md) for detailed documentation.


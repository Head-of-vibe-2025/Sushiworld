# Webflow Integration Setup Guide

This guide will help you set up the Webflow CMS integration for your Sushi World app menu.

## 📋 Prerequisites

- Webflow account with API access
- Supabase project set up
- Webflow site with menu items collection

## 🔧 Step 1: Get Webflow API Credentials

1. Go to your Webflow account settings
2. Navigate to **Integrations** → **API Access**
3. Generate a new API token
4. Copy the token (starts with something like `e0a3f697bf66...`)

## 🗂️ Step 2: Set Up Webflow Collections

Your Webflow site should have a collection for menu items with these fields:

### Menu Items Collection
- **name** (Text) - Item name
- **slug** (Text) - URL-friendly identifier
- **price** (Number) - Item price
- **description** (Rich Text or Plain Text) - Item description
- **main-image** (Image) - Item photo
- **category** (Reference or Text) - Category identifier
- **region** (Option) - Values: "BE", "LU", or "BOTH"
- **is-available** (Switch) - Whether item is currently available

### Optional: Categories Collection
If you want separate category management:
- **name** (Text) - Category name
- **slug** (Text) - URL-friendly identifier
- **description** (Text) - Category description

## 🔑 Step 3: Get Collection IDs

1. In Webflow, go to your site's Collections
2. Click on your menu collection
3. The collection ID is in the URL: `webflow.com/design/your-site?collectionId=COLLECTION_ID`
4. Copy the collection IDs for:
   - Menu items collection
   - Categories collection (if separate)

## 🚀 Step 4: Get Site ID via API

Run this command to get your site ID:

```bash
curl -X GET "https://api.webflow.com/v2/sites" \
  -H "Authorization: Bearer YOUR_WEBFLOW_API_TOKEN" \
  -H "accept-version: 1.0.0"
```

Copy the `id` field from the response.

## 🔐 Step 5: Configure Supabase Secrets

Set the Webflow credentials as Supabase secrets (NOT in your .env file):

```bash
# Navigate to your project directory
cd /path/to/sushi-app

# Set Webflow API token
supabase secrets set WEBFLOW_API_TOKEN="your-webflow-token-here"

# Set Site ID
supabase secrets set WEBFLOW_SITE_ID="your-site-id-here"

# Set Menu Collection ID
supabase secrets set WEBFLOW_MENU_COLLECTION_ID="your-menu-collection-id"

# Optional: Set Category Collection ID (if you have a separate collection)
supabase secrets set WEBFLOW_CATEGORY_COLLECTION_ID="your-category-collection-id"
```

## 📦 Step 6: Deploy the Edge Function

Deploy the Webflow menu Edge Function to Supabase:

```bash
supabase functions deploy webflow-menu
```

## 🧪 Step 7: Test the Integration

Test that the Edge Function works:

```bash
curl -X GET "https://YOUR_PROJECT.supabase.co/functions/v1/webflow-menu?region=BE" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY"
```

You should see a JSON response with your menu items.

## 📱 Step 8: Configure App Environment Variables

Create a `.env` file in your project root (copy from `.env.example`):

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Foxy.io Configuration
EXPO_PUBLIC_FOXY_STORE_ID_BE=your-belgium-store-id
EXPO_PUBLIC_FOXY_STORE_ID_LU=your-luxembourg-store-id
EXPO_PUBLIC_FOXY_SUBDOMAIN_BE=sushiworld-be
EXPO_PUBLIC_FOXY_SUBDOMAIN_LU=sushiworld-lu
```

## 🎯 Step 9: Run the App

```bash
npm start
```

Your app should now fetch menu items from Webflow!

## 🔄 How It Works

1. **Mobile App** → Calls Supabase Edge Function
2. **Edge Function** → Fetches data from Webflow API (with secure token)
3. **Webflow API** → Returns menu items
4. **Edge Function** → Maps and filters data
5. **Mobile App** → Displays menu items

## 🛠️ Troubleshooting

### "Webflow configuration missing" error
- Check that you've set all required Supabase secrets
- Verify the secrets are deployed: `supabase secrets list`

### "Failed to load menu" error
- Check the Edge Function logs: `supabase functions logs webflow-menu`
- Verify your Webflow API token is valid
- Ensure collection IDs are correct

### No items showing
- Check that items in Webflow have `is-available` set to true
- Verify the `region` field matches "BE", "LU", or "BOTH"
- Check Edge Function response in browser dev tools

### Images not loading
- Ensure the `main-image` field in Webflow is populated
- Check that image URLs are publicly accessible

## 📝 Field Mapping

| Webflow Field | App Field | Type | Required |
|---------------|-----------|------|----------|
| name | name | string | Yes |
| slug | code | string | Yes |
| price | price | number | Yes |
| description | description | string | No |
| main-image | image | string (URL) | No |
| category | categoryId | string | No |
| region | region | string | No |
| is-available | isAvailable | boolean | No |

## 🔒 Security Notes

- **Never** commit your Webflow API token to git
- **Never** expose the token in your mobile app code
- Always use Supabase secrets for sensitive credentials
- The Edge Function acts as a secure proxy

## 📚 Additional Resources

- [Webflow API Documentation](https://developers.webflow.com/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [React Query Documentation](https://tanstack.com/query/latest)

---

**Need help?** Check the Edge Function logs or Webflow API response for debugging.


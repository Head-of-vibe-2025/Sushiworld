# Quick Start Guide - Webflow Integration

Get your Sushi World app running with Webflow menu data in 10 minutes.

## ⚡ Prerequisites

- Node.js 18+ installed
- Expo CLI installed (`npm install -g expo-cli`)
- Supabase CLI installed (`npm install -g supabase`)
- Webflow account with API access

## 🚀 Quick Setup (10 minutes)

### Step 1: Install Dependencies (2 min)
```bash
cd "/Users/sandrasanzgonzalez/Documents/Sushi App"
npm install
```

### Step 2: Get Webflow Credentials (3 min)

1. Go to Webflow → Account Settings → Integrations → API Access
2. Generate API token → Copy it
3. Get your site ID:
   ```bash
   curl -X GET "https://api.webflow.com/v2/sites" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "accept-version: 1.0.0"
   ```
4. Copy the `id` from the response
5. In Webflow, go to your menu collection → Copy collection ID from URL

### Step 3: Configure Supabase (3 min)

```bash
# Set Webflow secrets
supabase secrets set WEBFLOW_API_TOKEN="your-webflow-token-here"
supabase secrets set WEBFLOW_SITE_ID="your-site-id-here"
supabase secrets set WEBFLOW_MENU_COLLECTION_ID="your-menu-collection-id"

# Deploy Edge Function
supabase functions deploy webflow-menu
```

### Step 4: Configure App (1 min)

Create `.env` file:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 5: Run App (1 min)
```bash
npm start
```

Scan QR code with Expo Go app → Menu should load from Webflow! 🎉

## 🧪 Quick Test

Test the API directly:
```bash
curl "https://YOUR_PROJECT.supabase.co/functions/v1/webflow-menu?region=BE" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY"
```

Should return JSON with your menu items.

## 📋 Webflow Collection Setup

Your Webflow collection needs these fields:

**Required:**
- `name` (Text) - "Salmon Nigiri"
- `slug` (Text) - "salmon-nigiri"
- `price` (Number) - 4.50

**Optional:**
- `description` (Text) - "Fresh salmon on rice"
- `main-image` (Image) - Product photo
- `category` (Text) - "Nigiri"
- `region` (Option) - "BE", "LU", or "BOTH"
- `is-available` (Switch) - true/false

## 🐛 Troubleshooting

### "Webflow configuration missing"
→ Check Supabase secrets: `supabase secrets list`

### "Failed to load menu"
→ Check Edge Function logs: `supabase functions logs webflow-menu`

### No items showing
→ Check `is-available` is true in Webflow

### Images not loading
→ Verify `main-image` field is populated in Webflow

## 📚 Full Documentation

- [WEBFLOW_SETUP.md](./WEBFLOW_SETUP.md) - Detailed setup
- [WEBFLOW_FIELDS.md](./WEBFLOW_FIELDS.md) - Field structure
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - What we built

## 💡 Pro Tips

1. **Test with sample data first** - Add 2-3 items in Webflow to test
2. **Check the logs** - Edge Function logs show API responses
3. **Cache is 5 minutes** - Wait or restart app to see changes
4. **Use BOTH for region** - Items show in all regions

## ✅ Success Checklist

- [ ] Dependencies installed
- [ ] Webflow API token obtained
- [ ] Supabase secrets configured
- [ ] Edge Function deployed
- [ ] App `.env` configured
- [ ] App runs without errors
- [ ] Menu items load from Webflow
- [ ] Images display correctly

## 🎯 What's Next?

1. Add more menu items in Webflow
2. Organize items into categories
3. Add product images
4. Test region filtering (BE/LU)
5. Test on physical device

---

**Ready to go!** Your menu now updates automatically when you change content in Webflow. No app deployment needed! 🚀


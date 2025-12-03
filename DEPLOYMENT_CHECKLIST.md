# Webflow Integration - Deployment Checklist

Use this checklist to ensure your Webflow integration is properly deployed.

## 📋 Pre-Deployment

### Webflow Setup
- [ ] Webflow API token generated
- [ ] Site ID obtained
- [ ] Menu collection created with correct fields
- [ ] Test items added to collection
- [ ] Items have `is-available` set to true
- [ ] Images uploaded and optimized
- [ ] Site published

### Supabase Setup
- [ ] Supabase project created
- [ ] Supabase CLI installed
- [ ] Logged into Supabase CLI (`supabase login`)
- [ ] Project linked (`supabase link --project-ref your-ref`)

### Local Development
- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created with Supabase credentials

## 🚀 Deployment Steps

### 1. Set Supabase Secrets
```bash
# Required secrets
supabase secrets set WEBFLOW_API_TOKEN="your-token-here"
supabase secrets set WEBFLOW_SITE_ID="your-site-id"
supabase secrets set WEBFLOW_MENU_COLLECTION_ID="your-collection-id"

# Optional (if using separate category collection)
supabase secrets set WEBFLOW_CATEGORY_COLLECTION_ID="your-category-id"
```

- [ ] WEBFLOW_API_TOKEN set
- [ ] WEBFLOW_SITE_ID set
- [ ] WEBFLOW_MENU_COLLECTION_ID set
- [ ] Secrets verified (`supabase secrets list`)

### 2. Deploy Edge Function
```bash
supabase functions deploy webflow-menu
```

- [ ] Edge Function deployed successfully
- [ ] No deployment errors
- [ ] Function URL noted

### 3. Test Edge Function
```bash
curl "https://YOUR_PROJECT.supabase.co/functions/v1/webflow-menu?region=BE" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY"
```

- [ ] Edge Function responds with 200 OK
- [ ] Returns valid JSON
- [ ] Contains menu items from Webflow
- [ ] Images URLs are present
- [ ] Prices are correct

### 4. Configure Mobile App
```bash
# Create .env file
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

- [ ] `.env` file created
- [ ] SUPABASE_URL set correctly
- [ ] SUPABASE_ANON_KEY set correctly
- [ ] `.env` added to `.gitignore`

### 5. Test Mobile App
```bash
npm start
```

- [ ] App starts without errors
- [ ] Menu screen loads
- [ ] Menu items display
- [ ] Images load correctly
- [ ] Prices display correctly
- [ ] Category filtering works
- [ ] Product detail page works
- [ ] Add to cart works

## ✅ Post-Deployment Verification

### Functionality Tests
- [ ] Menu loads on first open
- [ ] Region filtering works (BE/LU)
- [ ] Category filtering works
- [ ] Product images display
- [ ] Product details load
- [ ] Add to cart functions
- [ ] Cart persists items
- [ ] Loading states show correctly
- [ ] Error states display properly

### Performance Tests
- [ ] Initial load < 3 seconds
- [ ] Cached load is instant
- [ ] Images load progressively
- [ ] No memory leaks
- [ ] Smooth scrolling

### Cross-Platform Tests
- [ ] Works on iOS
- [ ] Works on Android
- [ ] Works on Expo Go
- [ ] Works on physical devices

### Network Tests
- [ ] Works on WiFi
- [ ] Works on 4G/5G
- [ ] Handles slow network gracefully
- [ ] Shows error on no network
- [ ] Retries failed requests

### Content Tests
- [ ] All menu items visible
- [ ] Correct prices displayed
- [ ] Images match items
- [ ] Descriptions accurate
- [ ] Categories correct
- [ ] Region filtering accurate

## 🔍 Monitoring

### Check Logs
```bash
# View Edge Function logs
supabase functions logs webflow-menu

# Filter for errors
supabase functions logs webflow-menu --level error
```

- [ ] No errors in logs
- [ ] Response times acceptable
- [ ] No failed requests

### Monitor Usage
- [ ] Check Supabase dashboard for function invocations
- [ ] Monitor Webflow API usage
- [ ] Check for rate limiting issues

## 🐛 Troubleshooting

### Common Issues

**"Webflow configuration missing"**
- Check: `supabase secrets list`
- Fix: Set missing secrets

**"Failed to load menu"**
- Check: Edge Function logs
- Check: Webflow API token validity
- Check: Collection IDs are correct

**No items showing**
- Check: `is-available` is true in Webflow
- Check: Items are published
- Check: Region filter matches

**Images not loading**
- Check: Images uploaded in Webflow
- Check: Image URLs are public
- Check: Network connectivity

## 📊 Success Metrics

After deployment, verify:
- [ ] 95%+ successful API calls
- [ ] < 2s average load time
- [ ] 0 critical errors
- [ ] All menu items accessible
- [ ] Images load successfully

## 🔐 Security Checklist

- [ ] Webflow API token not in git
- [ ] Webflow API token not in mobile app
- [ ] `.env` file in `.gitignore`
- [ ] Supabase secrets set (not env vars)
- [ ] Edge Function uses service role key
- [ ] Mobile app uses anon key only

## 📝 Documentation

- [ ] Team knows how to update menu in Webflow
- [ ] Setup guide accessible (WEBFLOW_SETUP.md)
- [ ] Field structure documented (WEBFLOW_FIELDS.md)
- [ ] Troubleshooting guide available

## 🎉 Go Live Checklist

Final checks before going live:
- [ ] All tests passing
- [ ] No errors in logs
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Documentation complete
- [ ] Team trained
- [ ] Backup plan ready
- [ ] Monitoring in place

## 📞 Support Contacts

- **Webflow Support**: https://support.webflow.com
- **Supabase Support**: https://supabase.com/support
- **Project Documentation**: See WEBFLOW_SETUP.md

---

## ✨ Deployment Complete!

Once all items are checked, your Webflow integration is live! 🚀

Menu updates in Webflow will automatically appear in the app within 5 minutes.

**Next Steps:**
1. Monitor logs for first 24 hours
2. Gather user feedback
3. Optimize based on usage patterns
4. Plan additional features

---

**Date Deployed**: _________________

**Deployed By**: _________________

**Notes**: _________________


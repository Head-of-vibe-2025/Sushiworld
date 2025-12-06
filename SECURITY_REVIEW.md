# Security Review Report

**Date:** December 2024  
**Status:** ⚠️ Issues Found - Action Required

## 🔴 Critical Issues

### 1. **Hardcoded Supabase Storage Token** (CRITICAL)

**Location:**
- `src/screens/menu/MenuScreen.tsx` (line 17)
- `src/navigation/RootNavigator.tsx` (line 14)

**Issue:**
```typescript
const LOGO_URL = 'https://lymingynfnunsrriiama.supabase.co/storage/v1/object/sign/assets/SushiWorld_logo.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iNTJjNDU5ZS03ZTlmLTRiMWItOWU5OC05ZDVkNjU1YmIzYmUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhc3NldHMvU3VzaGlXb3JsZF9sb2dvLnN2ZyIsImlhdCI6MTc2NDc3MzY0OSwiZXhwIjoyMDgwMTMzNjQ5fQ.dJtYtPDgvZf7pwJdil27GhnlEOLWb5fmibXHhBGpLIk';
```

**Risk:** 
- Storage tokens are exposed in source code
- Tokens can be extracted and used to access storage
- If token expires, the app will break
- Token is visible in client-side code

**Fix Required:**
- Move logo URL to environment variable or constants
- Use public storage URL without token, or
- Generate signed URLs server-side via Edge Function
- Remove hardcoded token immediately

## 🟡 Medium Priority Issues

### 2. **Missing .env.example File**

**Issue:** No `.env.example` file exists to document required environment variables.

**Risk:**
- Developers may not know what environment variables are needed
- Risk of missing configuration
- No template for setting up the project

**Fix Required:**
- Create `.env.example` with all required variables (without actual values)
- Document each variable's purpose

### 3. **Placeholder Values in Code**

**Location:** `src/services/supabase/supabaseClient.ts`

**Issue:**
```typescript
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
```

**Risk:**
- App may run with placeholder values if env vars are missing
- Could lead to confusion or security issues

**Fix Required:**
- Throw error if required env vars are missing in production
- Only use placeholders in development

### 4. **CORS Headers Too Permissive**

**Location:** Edge Functions (`supabase/functions/*`)

**Issue:**
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  ...
};
```

**Risk:**
- Allows any origin to call the API
- Could be exploited for unauthorized access

**Fix Required:**
- Restrict to specific origins in production
- Use environment variable for allowed origins
- Only use `*` in development

## ✅ Good Security Practices Found

### 1. **Secrets in Edge Functions**
✅ Foxy credentials (`FOXY_CLIENT_ID`, `FOXY_CLIENT_SECRET`) are correctly stored as Supabase secrets, not in code

### 2. **API Proxying**
✅ Foxy API calls are proxied through Supabase Edge Functions, keeping credentials server-side

### 3. **Environment Variables**
✅ Most sensitive data uses environment variables:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_FOXY_STORE_ID`
- `EXPO_PUBLIC_FOXY_SUBDOMAIN`

### 4. **.gitignore Configuration**
✅ `.env` and `.env.local` are properly ignored in `.gitignore`

### 5. **No Hardcoded API Keys**
✅ No hardcoded API keys, tokens, or secrets found in source code (except the storage token issue above)

### 6. **Supabase Anon Key Usage**
✅ Using Supabase anon key (public key) is correct - it's meant to be public but protected by Row Level Security

## 📋 Recommendations

### Immediate Actions (Critical)

1. **Remove hardcoded storage token**
   - Move logo URL to environment variable or constants
   - Use public storage bucket or generate URLs server-side

2. **Create .env.example file**
   - Document all required environment variables
   - Include descriptions for each variable

3. **Add environment validation**
   - Validate required env vars at app startup
   - Fail fast if critical vars are missing

### Short-term Actions

4. **Restrict CORS in production**
   - Use environment variable for allowed origins
   - Only allow your app's domain(s)

5. **Add security headers**
   - Implement security headers in Edge Functions
   - Add rate limiting where appropriate

6. **Review Supabase RLS policies**
   - Ensure Row Level Security is properly configured
   - Test that users can only access their own data

### Long-term Actions

7. **Implement secret rotation**
   - Set up process for rotating API keys
   - Document rotation procedures

8. **Add security monitoring**
   - Monitor for suspicious API usage
   - Set up alerts for unusual patterns

9. **Security audit**
   - Regular security reviews
   - Dependency vulnerability scanning

## 🔐 Environment Variables Checklist

Required variables (should be in `.env.example`):

```bash
# Supabase
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=

# Foxy.io (for client - store IDs only, not credentials)
EXPO_PUBLIC_FOXY_STORE_ID=
EXPO_PUBLIC_FOXY_STORE_ID_BE=
EXPO_PUBLIC_FOXY_STORE_ID_LU=
EXPO_PUBLIC_FOXY_SUBDOMAIN=
EXPO_PUBLIC_FOXY_SUBDOMAIN_BE=
EXPO_PUBLIC_FOXY_SUBDOMAIN_LU=
EXPO_PUBLIC_FOXY_API_BASE=

# Supabase Secrets (set via Supabase CLI or dashboard, NOT in .env)
# FOXY_CLIENT_ID
# FOXY_CLIENT_SECRET
# WEBFLOW_API_TOKEN
# WEBFLOW_SITE_ID
```

## 📝 Notes

- **Supabase Anon Key**: This is safe to expose in client code as it's protected by Row Level Security policies
- **Foxy Credentials**: Correctly stored as Supabase secrets, accessed only in Edge Functions
- **Webflow Credentials**: Should be stored as Supabase secrets (verify this is done)
- **Storage Tokens**: Should never be hardcoded - use public URLs or generate server-side

## ✅ Verification Steps

After fixes are applied:

1. [ ] Hardcoded storage token removed
2. [ ] `.env.example` file created
3. [ ] Environment validation added
4. [ ] CORS restricted in production
5. [ ] All secrets verified to be in environment variables or Supabase secrets
6. [ ] No credentials found in git history (if found, rotate them)
7. [ ] `.gitignore` verified to exclude `.env` files

---

**Next Review Date:** After fixes are implemented


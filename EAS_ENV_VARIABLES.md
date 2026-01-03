# EAS Environment Variables Setup

## Issue
The app is stuck on the loading screen because environment variables aren't set in the EAS build.

## Solution: Set Environment Variables in EAS

You need to set your Supabase credentials as EAS secrets. Run these commands:

```bash
# Set Supabase URL (already in eas.json, but you can also set it as a secret)
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://lymingynfnunsrriiama.supabase.co" --type string

# Set Supabase Anon Key (REQUIRED - get this from your Supabase dashboard)
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "YOUR_SUPABASE_ANON_KEY" --type string
```

## Where to Find Your Supabase Anon Key

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Select your project: `lymingynfnunsrriiama`
3. Go to **Settings** → **API**
4. Copy the **anon/public** key
5. Use that value in the command above

## Optional: Other Environment Variables

If you need other environment variables, add them too:

```bash
# Foxy Store ID (if needed)
eas secret:create --scope project --name EXPO_PUBLIC_FOXY_STORE_ID --value "YOUR_STORE_ID" --type string

# Foxy Subdomain (if needed)
eas secret:create --scope project --name EXPO_PUBLIC_FOXY_SUBDOMAIN --value "sushiworld-be" --type string

# Logo URL (if different from default)
eas secret:create --scope project --name EXPO_PUBLIC_LOGO_URL --value "YOUR_LOGO_URL" --type string
```

## Verify Secrets Are Set

```bash
eas secret:list
```

## After Setting Secrets

1. Rebuild the app:
   ```bash
   eas build --platform ios --profile preview
   ```

2. The environment variables will be available in the build

## Important Notes

- Secrets are encrypted and stored securely by EAS
- They're available during build time and in the app at runtime
- Use `EXPO_PUBLIC_` prefix for variables that should be available in the client
- Never commit secrets to git or eas.json



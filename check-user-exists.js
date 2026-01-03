// Quick script to check if user exists in Supabase
// Run with: node check-user-exists.js

require('dotenv').config();

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

async function checkUser() {
  const email = 'headofvibe.info@gmail.com';
  
  console.log(`🔍 Checking if user exists: ${email}`);
  console.log(`📡 Supabase URL: ${SUPABASE_URL}\n`);
  
  try {
    // Note: We can't directly check if user exists via API for security
    // But we can try to sign in to see if account exists
    const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Response status:', response.status);
    
    // Better: Check via Supabase Admin API or check in dashboard
    console.log('\n📋 To check if user exists:');
    console.log('1. Go to Supabase Dashboard > Authentication > Users');
    console.log('2. Search for: headofvibe.info@gmail.com');
    console.log('3. If user doesn\'t exist, create an account first');
    
    console.log('\n📧 To check email configuration:');
    console.log('1. Go to Supabase Dashboard > Settings > Auth');
    console.log('2. Check "Email" settings');
    console.log('3. For local dev, check Inbucket at http://localhost:54324');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkUser();



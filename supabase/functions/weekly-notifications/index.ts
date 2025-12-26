// Supabase Edge Function: Weekly Push Notifications
// This function sends weekly push notifications to all users with push tokens
// Should be scheduled to run once per week via pg_cron or external scheduler

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Expo Push API endpoint
const EXPO_PUSH_API_URL = 'https://exp.host/--/api/v2/push/send';

// 5 different notification messages that rotate each week
const NOTIFICATION_MESSAGES = [
  {
    title: '🍣 Time for Sushi!',
    body: 'Treat yourself today! Order some delicious sushi and enjoy a special meal.',
  },
  {
    title: '✨ Fresh Sushi Awaits!',
    body: 'Discover new flavors today! Browse our menu and find your perfect sushi combination.',
  },
  {
    title: '🎌 Weekly Sushi Treat',
    body: 'You deserve something special! Why not order some fresh sushi today?',
  },
  {
    title: '🍱 Sushi Time!',
    body: 'Fresh ingredients, amazing flavors. Order now and make your day delicious!',
  },
  {
    title: '🍣 Ready for Sushi?',
    body: 'It\'s been a week! Time to indulge in your favorite sushi rolls. Order now!',
  },
];

/**
 * Get the week number of the year (1-53)
 */
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/**
 * Get the notification message index based on current week (rotates through 5 messages)
 */
function getNotificationMessageIndex(): number {
  const weekNumber = getWeekNumber(new Date());
  return (weekNumber - 1) % NOTIFICATION_MESSAGES.length;
}

interface ExpoPushMessage {
  to: string;
  sound: string;
  title: string;
  body: string;
  priority: 'default' | 'normal' | 'high';
  data?: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all users with push tokens and push notifications enabled
    // First get all push tokens with their profile info
    const { data: tokens, error: tokensError } = await supabase
      .from('push_tokens')
      .select(`
        token,
        platform,
        profile_id,
        profiles (
          id,
          push_enabled
        )
      `);

    // Filter tokens where push_enabled is true
    const enabledTokens = tokens?.filter(
      (item: any) => item.profiles && item.profiles.push_enabled !== false
    ) || [];

    if (tokensError) {
      console.error('Error fetching push tokens:', tokensError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch push tokens', details: tokensError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!enabledTokens || enabledTokens.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No push tokens found with notifications enabled', sent: 0 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the current notification message index (rotates weekly)
    const messageIndex = getNotificationMessageIndex();
    const currentMessage = NOTIFICATION_MESSAGES[messageIndex];

    // Prepare push notification messages
    const messages: ExpoPushMessage[] = enabledTokens.map((item: any) => ({
      to: item.token,
      sound: 'default',
      title: currentMessage.title,
      body: currentMessage.body,
      priority: 'high',
      data: {
        type: 'weekly_reminder',
        action: 'open_menu',
        messageIndex: messageIndex,
      },
    }));

    // Send notifications in batches (Expo recommends max 100 per request)
    const batchSize = 100;
    let totalSent = 0;
    let totalFailed = 0;

    for (let i = 0; i < messages.length; i += batchSize) {
      const batch = messages.slice(i, i + batchSize);

      try {
        const response = await fetch(EXPO_PUSH_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip, deflate',
          },
          body: JSON.stringify(batch),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Failed to send batch ${i / batchSize + 1}:`, errorText);
          totalFailed += batch.length;
        } else {
          const result = await response.json();
          // Expo returns an array of results, check for errors
          if (Array.isArray(result.data)) {
            result.data.forEach((receipt: any) => {
              if (receipt.status === 'ok') {
                totalSent++;
              } else {
                totalFailed++;
                console.error('Failed to send notification:', receipt);
              }
            });
          }
        }
      } catch (error) {
        console.error(`Error sending batch ${i / batchSize + 1}:`, error);
        totalFailed += batch.length;
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Weekly notifications sent',
        total: messages.length,
        sent: totalSent,
        failed: totalFailed,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in weekly notifications function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});


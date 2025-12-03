// Supabase Edge Function: Foxy Webhook Handler
// This function receives webhooks from Foxy.io when orders are completed
// and automatically awards loyalty points

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Verify webhook signature (TODO: Implement Foxy webhook signature verification)
    // const signature = req.headers.get('X-Foxy-Webhook-Signature');
    // if (!verifySignature(req.body, signature)) {
    //   return new Response('Invalid signature', { status: 401, headers: corsHeaders });
    // }

    // Parse webhook payload
    const payload = await req.json();
    
    // Extract order information
    const transaction = payload._embedded?.['fx:transaction']?.[0];
    if (!transaction) {
      return new Response('Invalid payload', { status: 400, headers: corsHeaders });
    }

    const customerEmail = transaction.customer_email;
    const orderTotal = parseFloat(transaction.total_order || '0');
    const transactionId = transaction.id;

    if (!customerEmail) {
      return new Response('No customer email', { status: 400, headers: corsHeaders });
    }

    // Calculate loyalty points (10% of order value, €1 = 100 points)
    const pointsEarned = Math.floor(orderTotal * 10); // 10% = 0.1 * 100 = 10 points per euro

    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', customerEmail)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError;
    }

    if (profile) {
      // Profile exists - credit points immediately if account claimed, otherwise add to pending
      if (profile.has_claimed_account) {
        // User has account - credit points immediately
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            loyalty_points: profile.loyalty_points + pointsEarned,
            updated_at: new Date().toISOString(),
          })
          .eq('email', customerEmail);

        if (updateError) throw updateError;

        // Create transaction record
        await supabase.from('loyalty_transactions').insert({
          profile_id: profile.id,
          email: customerEmail,
          points: pointsEarned,
          source: 'purchase',
          foxy_transaction_id: transactionId,
          status: 'credited',
          description: `Order #${transactionId}`,
        });

        // TODO: Send push notification if user has push enabled
      } else {
        // Guest order - add to pending points
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            points_pending_claim: profile.points_pending_claim + pointsEarned,
            updated_at: new Date().toISOString(),
          })
          .eq('email', customerEmail);

        if (updateError) throw updateError;

        // Create transaction record with pending status
        await supabase.from('loyalty_transactions').insert({
          profile_id: profile.id,
          email: customerEmail,
          points: pointsEarned,
          source: 'purchase',
          foxy_transaction_id: transactionId,
          status: 'pending',
          description: `Order #${transactionId} (pending claim)`,
        });
      }
    } else {
      // No profile exists - create one with pending points
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          email: customerEmail,
          points_pending_claim: pointsEarned,
          has_claimed_account: false,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Create transaction record
      await supabase.from('loyalty_transactions').insert({
        profile_id: newProfile.id,
        email: customerEmail,
        points: pointsEarned,
        source: 'purchase',
        foxy_transaction_id: transactionId,
        status: 'pending',
        description: `Order #${transactionId} (pending claim)`,
      });
    }

    return new Response(
      JSON.stringify({ success: true, pointsEarned }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});


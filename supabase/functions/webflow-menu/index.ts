// Supabase Edge Function: Menu Data from Supabase
// Reads menu items and categories from Supabase (synced from Webflow)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const region = url.searchParams.get('region') || 'BE';
    const categoryId = url.searchParams.get('categoryId');
    const itemId = url.searchParams.get('itemId');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // If requesting a single item by ID
    if (itemId) {
      const { data: item, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          menu_categories (
            id,
            name,
            code
          )
        `)
        .eq('webflow_id', itemId)
        .eq('is_available', true)
        .single();

      if (error || !item) {
        return new Response(
          JSON.stringify({ error: 'Item not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const mappedItem = {
        id: item.webflow_id,
        name: item.name,
        code: item.code,
        price: Number(item.price),
        description: item.description || '',
        image: item.image_url || undefined,
        categoryId: item.category_webflow_id,
        region: item.region,
        isAvailable: item.is_available,
      };

      return new Response(
        JSON.stringify(mappedItem),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If requesting categories (with pagination to get all)
    if (url.searchParams.has('categories')) {
      const allCategories: any[] = [];
      let page = 0;
      const pageSize = 1000;
      let hasMore = true;

      while (hasMore) {
        const { data: categories, error } = await supabase
          .from('menu_categories')
          .select('*')
          .range(page * pageSize, (page + 1) * pageSize - 1)
          .order('name');

        if (error) {
          throw new Error(`Database error: ${error.message}`);
        }

        if (categories && categories.length > 0) {
          allCategories.push(...categories);
          hasMore = categories.length === pageSize;
          page++;
        } else {
          hasMore = false;
        }
      }

      const mappedCategories = allCategories.map((cat) => ({
        id: cat.webflow_id,
        name: cat.name,
        code: cat.code,
        description: cat.description || undefined,
        image: cat.image_url || undefined,
      }));

      return new Response(
        JSON.stringify(mappedCategories),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch menu items with filters (with pagination to get all items)
    const allItems: any[] = [];
    let page = 0;
    const pageSize = 1000; // Supabase default max, but we'll paginate to be safe
    let hasMore = true;

    while (hasMore) {
      let query = supabase
        .from('menu_items')
        .select(`
          *,
          menu_categories (
            id,
            name,
            code
          )
        `)
        .eq('is_available', true)
        .range(page * pageSize, (page + 1) * pageSize - 1)
        .order('name');

      // Filter by region - items that match the region or are available for BOTH
      if (region) {
        query = query.or(`region.eq.${region},region.eq.BOTH`);
      }

      // Filter by category if specified
      if (categoryId) {
        query = query.eq('category_webflow_id', categoryId);
      }

      const { data: items, error } = await query;

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      if (items && items.length > 0) {
        allItems.push(...items);
        hasMore = items.length === pageSize;
        page++;
      } else {
        hasMore = false;
      }
    }

    const items = allItems;

    // Map to app format
    const mappedItems = (items || []).map((item) => ({
      id: item.webflow_id,
      name: item.name,
      code: item.code,
      price: Number(item.price),
      description: item.description || '',
      image: item.image_url || undefined,
      categoryId: item.category_webflow_id,
      region: item.region,
      isAvailable: item.is_available,
    }));

    return new Response(
      JSON.stringify(mappedItems),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Menu API error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

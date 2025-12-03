// Supabase Edge Function: Webflow to Supabase Sync
// Syncs menu items and categories from Webflow CMS to Supabase database

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebflowItem {
  id: string;
  isArchived?: boolean;
  isDraft?: boolean;
  fieldData: {
    name?: string;
    slug?: string;
    price?: number;
    'item-price'?: number;
    description?: string;
    'default-sku'?: string;
    'main-image'?: {
      url: string;
      alt?: string;
    };
    image?: {
      url: string;
      alt?: string;
    };
    category?: string | string[];
    region?: string;
    'is-available'?: boolean;
  };
}

interface WebflowResponse {
  items: WebflowItem[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Webflow configuration
    const webflowToken = Deno.env.get('WEBFLOW_API_TOKEN');
    const menuCollectionId = Deno.env.get('WEBFLOW_MENU_COLLECTION_ID');
    const categoryCollectionId = Deno.env.get('WEBFLOW_CATEGORY_COLLECTION_ID');

    if (!webflowToken || !menuCollectionId) {
      return new Response(
        JSON.stringify({ error: 'Webflow configuration missing' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const webflowHeaders = {
      'Authorization': `Bearer ${webflowToken}`,
      'accept-version': '1.0.0',
      'Content-Type': 'application/json',
    };

    // Helper to fetch SKU image
    const fetchSkuImage = async (skuId: string): Promise<string | undefined> => {
      if (!skuId) return undefined;
      try {
        const skuCollectionId = '64c8bf13b648aab5f6969933';
        const skuResponse = await fetch(
          `https://api.webflow.com/v2/collections/${skuCollectionId}/items/${skuId}`,
          { headers: webflowHeaders }
        );
        if (skuResponse.ok) {
          const sku = await skuResponse.json();
          return sku.fieldData?.['main-image']?.url;
        }
      } catch (error) {
        console.error(`Error fetching SKU ${skuId}:`, error);
      }
      return undefined;
    };

    // Step 1: Sync Categories (if category collection exists)
    let categoryCount = 0;
    if (categoryCollectionId) {
      const categoriesResponse = await fetch(
        `https://api.webflow.com/v2/collections/${categoryCollectionId}/items?limit=100`,
        { headers: webflowHeaders }
      );

      if (categoriesResponse.ok) {
        const categoriesData: WebflowResponse = await categoriesResponse.json();
        
        for (const category of categoriesData.items) {
          const categoryData = {
            webflow_id: category.id,
            name: category.fieldData?.name || 'Unnamed Category',
            code: category.fieldData?.slug || category.id,
            description: category.fieldData?.description || null,
            image_url: category.fieldData?.['main-image']?.url || category.fieldData?.image?.url || null,
          };

          // Upsert category
          const { error } = await supabase
            .from('menu_categories')
            .upsert(categoryData, { onConflict: 'webflow_id' });

          if (error) {
            console.error(`Error syncing category ${category.id}:`, error);
          } else {
            categoryCount++;
          }
        }
        console.log(`Synced ${categoryCount} categories`);
      }
    }

    // Step 2: Sync Menu Items
    const itemsResponse = await fetch(
      `https://api.webflow.com/v2/collections/${menuCollectionId}/items?limit=100`,
      { headers: webflowHeaders }
    );

    if (!itemsResponse.ok) {
      throw new Error(`Webflow API error: ${itemsResponse.statusText}`);
    }

    const data: WebflowResponse = await itemsResponse.json();

    // Get category mapping
    const { data: categories } = await supabase
      .from('menu_categories')
      .select('id, webflow_id');

    const categoryMap = new Map(
      categories?.map(cat => [cat.webflow_id, cat.id]) || []
    );

    // Process items in batches to avoid overwhelming SKU API
    const batchSize = 10;
    let syncedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < data.items.length; i += batchSize) {
      const batch = data.items.slice(i, i + batchSize);
      
      const syncPromises = batch.map(async (item) => {
        try {
          // Handle category - can be array or string
          const categoryWebflowId = Array.isArray(item.fieldData?.category)
            ? item.fieldData.category[0]
            : item.fieldData?.category;
          
          const categoryId = categoryWebflowId
            ? categoryMap.get(categoryWebflowId) || null
            : null;

          // Fetch SKU image if available
          const skuId = item.fieldData?.['default-sku'];
          let imageUrl = item.fieldData?.['main-image']?.url || item.fieldData?.image?.url;
          
          if (skuId && !imageUrl) {
            imageUrl = await fetchSkuImage(skuId);
          }

          const menuItemData = {
            webflow_id: item.id,
            name: item.fieldData?.name || 'Unnamed Item',
            code: item.fieldData?.slug || item.id,
            price: Number(item.fieldData?.['item-price'] || item.fieldData?.price || 0),
            description: item.fieldData?.description || null,
            image_url: imageUrl || null,
            category_id: categoryId,
            category_webflow_id: categoryWebflowId || null,
            region: item.fieldData?.region || 'BOTH',
            is_available: item.fieldData?.['is-available'] !== false && !item.isArchived && !item.isDraft,
            sku_id: skuId || null,
          };

          // Upsert menu item
          const { error } = await supabase
            .from('menu_items')
            .upsert(menuItemData, { onConflict: 'webflow_id' });

          if (error) {
            console.error(`Error syncing item ${item.id}:`, error);
            errorCount++;
          } else {
            syncedCount++;
          }
        } catch (error) {
          console.error(`Error processing item ${item.id}:`, error);
          errorCount++;
        }
      });

      await Promise.all(syncPromises);
    }

    return new Response(
      JSON.stringify({
        success: true,
        categories: categoryCount,
        items: {
          synced: syncedCount,
          errors: errorCount,
          total: data.items.length,
        },
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Webflow sync error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});


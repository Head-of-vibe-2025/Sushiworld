// Foxy Checkout URL Builder

import { FOXY_SUBDOMAINS } from '../../utils/constants';
import type { FoxyCheckoutParams } from '../../types/foxy.types';
import type { CartItem } from '../../types/app.types';

export const buildFoxyCheckoutUrl = (
  region: 'BE' | 'LU',
  params: FoxyCheckoutParams
): string => {
  const subdomain = FOXY_SUBDOMAINS[region];
  const baseUrl = `https://${subdomain}.foxycart.com/cart`;

  // FoxyCart uses repeated parameters (not indexed) for multiple items
  // Format: ?name=Item1&price=10.00&code=CODE1&name=Item2&price=20.00&code=CODE2
  const queryParams: string[] = [];

  // FoxyCart URL format - try both indexed and simple format
  // For single item: ?name=Item&price=10.00&code=CODE&quantity=2
  // For multiple items: use indexed format name0, price0, code0, quantity0, name1, price1, etc.
  if (params.items.length === 1) {
    // Single item - use simple format
    const item = params.items[0];
    queryParams.push(`name=${encodeURIComponent(item.name)}`);
    queryParams.push(`price=${item.price.toFixed(2)}`);
    queryParams.push(`code=${encodeURIComponent(item.code)}`);
    if (item.quantity > 1) {
      queryParams.push(`quantity=${item.quantity}`);
    }
  } else {
    // Multiple items - use indexed format
    params.items.forEach((item, index) => {
      queryParams.push(`name${index}=${encodeURIComponent(item.name)}`);
      queryParams.push(`price${index}=${item.price.toFixed(2)}`);
      queryParams.push(`code${index}=${encodeURIComponent(item.code)}`);
      queryParams.push(`quantity${index}=${item.quantity}`);
    });
  }

  // Add customer email if provided
  if (params.customerEmail) {
    queryParams.push(`customer_email=${encodeURIComponent(params.customerEmail)}`);
  }

  // Add coupon code if provided
  if (params.couponCode) {
    queryParams.push(`coupon=${encodeURIComponent(params.couponCode)}`);
  }

  const url = `${baseUrl}?${queryParams.join('&')}`;
  console.log('🔗 Foxy Checkout URL:', url);
  console.log('📦 Items being sent:', JSON.stringify(params.items, null, 2));
  console.log('🔢 Number of items:', params.items.length);
  return url;
};

export const buildCheckoutParamsFromCart = (
  cartItems: CartItem[],
  customerEmail?: string,
  couponCode?: string
): FoxyCheckoutParams => {
  // Ensure all items have required fields
  const items = cartItems.map(item => {
    // Use item ID as fallback if code is missing (FoxyCart requires a code)
    const code = item.code || item.id || `ITEM-${item.name.replace(/\s+/g, '-').toUpperCase()}`;
    
    console.log('🛒 Cart item:', { 
      name: item.name, 
      price: item.price, 
      code, 
      quantity: item.quantity 
    });
    
    return {
      name: item.name,
      price: item.price,
      code: code,
      quantity: item.quantity,
    };
  });

  return {
    items,
    customerEmail,
    couponCode,
  };
};


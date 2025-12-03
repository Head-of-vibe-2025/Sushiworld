// Foxy Checkout URL Builder

import { FOXY_SUBDOMAINS } from '../../utils/constants';
import type { FoxyCheckoutParams, CartItem } from '../../types/foxy.types';

export const buildFoxyCheckoutUrl = (
  region: 'BE' | 'LU',
  params: FoxyCheckoutParams
): string => {
  const subdomain = FOXY_SUBDOMAINS[region];
  const baseUrl = `https://${subdomain}.foxycart.com/cart`;

  const queryParams = new URLSearchParams();

  // Add items
  params.items.forEach((item, index) => {
    queryParams.append(`name${index}`, item.name);
    queryParams.append(`price${index}`, item.price.toString());
    queryParams.append(`code${index}`, item.code);
    queryParams.append(`quantity${index}`, item.quantity.toString());
  });

  // Add customer email if provided
  if (params.customerEmail) {
    queryParams.append('customer_email', params.customerEmail);
  }

  // Add coupon code if provided
  if (params.couponCode) {
    queryParams.append('coupon', params.couponCode);
  }

  return `${baseUrl}?${queryParams.toString()}`;
};

export const buildCheckoutParamsFromCart = (
  cartItems: CartItem[],
  customerEmail?: string,
  couponCode?: string
): FoxyCheckoutParams => {
  return {
    items: cartItems.map(item => ({
      name: item.name,
      price: item.price,
      code: item.code,
      quantity: item.quantity,
    })),
    customerEmail,
    couponCode,
  };
};


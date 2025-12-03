// Foxy.io API Types

export interface FoxyProduct {
  id: string;
  name: string;
  code: string;
  price: number;
  description?: string;
  image?: string;
  item_category_id?: string;
  item_category?: FoxyCategory;
  quantity?: number;
}

export interface FoxyCategory {
  id: string;
  name: string;
  code?: string;
  description?: string;
}

export interface FoxyCustomer {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface FoxyTransaction {
  id: string;
  transaction_date: string;
  total_item_price: number;
  total_shipping: number;
  total_tax: number;
  total_order: number;
  customer_email: string;
  customer_id?: string;
  status: string;
  items?: FoxyTransactionItem[];
  payments?: FoxyPayment[];
}

export interface FoxyTransactionItem {
  id: string;
  name: string;
  code: string;
  price: number;
  quantity: number;
}

export interface FoxyPayment {
  id: string;
  type: string;
  amount: number;
  processor_response?: string;
}

export interface FoxyCoupon {
  id: string;
  name: string;
  code: string;
  type: 'flat' | 'percentage';
  amount: number;
  max_uses?: number;
  customer_email_restriction?: string;
  expires_at?: string;
}

export interface FoxyCheckoutParams {
  items: Array<{
    name: string;
    price: number;
    code: string;
    quantity: number;
  }>;
  customerEmail?: string;
  couponCode?: string;
}


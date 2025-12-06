// App-specific Types

export type Region = 'BE' | 'LU';

export interface CartItem {
  id: string;
  name: string;
  code: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface UserPreferences {
  allergies?: string[];
  dietary_restrictions?: string[];
  favorite_items?: string[];
  notifications_enabled?: boolean;
}

export interface NavigationParamList {
  Root: undefined;
  Auth: undefined;
  Menu: undefined;
  ProductDetail: { productId: string };
  Cart: undefined;
  Checkout: undefined;
  Orders: undefined;
  OrderDetail: { orderId: string };
  Loyalty: undefined;
  RedeemPoints: undefined;
  PointsHistory: undefined;
  Profile: undefined;
  Preferences: undefined;
  Settings: undefined;
  Login: undefined;
  Signup: undefined;
  GuestCheckout: undefined;
  DesignSystemPreview: undefined;
}


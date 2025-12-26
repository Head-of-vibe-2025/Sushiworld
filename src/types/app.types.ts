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
  FoxyCheckout: { checkoutUrl: string };
  Orders: undefined;
  OrderDetail: { orderId: string };
  Bookings: undefined;
  Loyalty: undefined;
  RedeemPoints: undefined;
  PointsHistory: undefined;
  Profile: undefined;
  Settings: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token?: string };
  GuestCheckout: undefined;
  DesignSystemPreview: undefined;
}


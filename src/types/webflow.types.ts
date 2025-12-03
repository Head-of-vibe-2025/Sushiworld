// Webflow API Types

export interface WebflowMenuItem {
  id: string;
  name: string;
  code: string;
  price: number;
  description?: string;
  image?: string;
  categoryId?: string;
  region?: string;
  isAvailable?: boolean;
}

export interface WebflowCategory {
  id: string;
  name: string;
  code: string;
  description?: string;
  image?: string;
}


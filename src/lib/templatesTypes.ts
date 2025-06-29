// Product type for UI
export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  rating: number; // Mocked, as Medusa doesn't have a rating system
  description: string;
  price: number;
  features: string[];
  images: {
    main: string;
    previews: string[];
  };
}

// Internal types for transformation logic
export interface ProductVariantPrice {
  id: string;
  currency_code: string;
  amount: number;
  sale_amount?: number | null;
  includes_tax?: boolean;
  [key: string]: any;
}

export interface ProductVariant {
  id: string;
  prices?: ProductVariantPrice[];
  [key: string]: any;
}

export interface ProductImage {
  id: string;
  url: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  metadata?: Record<string, unknown>;
}

export interface ProductImages {
  main: string;
  previews: string[];
}

export interface TransformedProduct extends Product {
  images: ProductImages;
  originalPrice?: number;
  discountPercentage?: number;
}

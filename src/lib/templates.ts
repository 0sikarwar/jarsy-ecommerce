import medusa from './medusa';
import type { PricedProduct } from '@medusajs/medusa-js';

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

function transformProduct(product: PricedProduct): Product {
    const price = product.variants?.[0]?.prices?.find(p => p.currency_code === 'usd');
    
    const imageUrls = product.images?.map(img => img.url) || [];
    const mainImage = product.thumbnail || imageUrls[0] || 'https://placehold.co/800x600.png';

    return {
        id: product.id!,
        slug: product.handle!,
        name: product.title!,
        category: product.collection?.title || 'Uncategorized',
        rating: 4, // Mock rating
        description: product.description || 'No description available.',
        price: price ? price.amount / 100 : 0,
        features: product.tags?.map(t => t.value) || [],
        images: {
            main: mainImage,
            previews: imageUrls.length > 0 ? imageUrls : [mainImage],
        },
    };
}

export async function getProducts(): Promise<Product[]> {
    try {
        const { products } = await medusa.products.list({ limit: 12 });
        return products.map(transformProduct);
    } catch (error) {
        console.error("Failed to fetch products from Medusa:", error);
        return [];
    }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
    try {
        const { products } = await medusa.products.list({ handle: slug, limit: 1 });
        if (!products.length) {
            return undefined;
        }
        return transformProduct(products[0]);
    } catch (error) {
        console.error(`Failed to fetch product with slug ${slug} from Medusa:`, error);
        return undefined;
    }
}

// Categories for filtering UI. In a real app, you might fetch these from Medusa as well.
export const categories = ['All', 'Sneakers', 'Boots', 'Sandals', 'Formal'];

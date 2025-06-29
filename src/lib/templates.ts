//@ts-ignore
import type { product as PricedProduct } from "@medusajs/js-sdk";
import type { Product, ProductVariantPrice, ProductVariant, ProductImage } from "./templatesTypes";
import { medusaSdk } from "./mdedusa-sdk";

function transformProduct(product: PricedProduct): Product {
  const prices: ProductVariantPrice[] | undefined = (
    product.variants as ProductVariant[] | undefined
  )?.[0]?.prices?.filter((p: ProductVariantPrice) => p.currency_code === "inr");

  let price = 0;
  let originalPrice = 0;
  let discountPercentage = 0;

  if (prices && prices.length > 0) {
      // Assuming prices are sorted by amount, with sale price being lower
      const salePriceObj = prices.find(p => p.price_list_type === 'sale');
      const defaultPriceObj = prices.find(p => p.price_list_type !== 'sale' || !p.price_list_type);

      if (salePriceObj && defaultPriceObj) {
          price = salePriceObj.amount;
          originalPrice = defaultPriceObj.amount;
      } else {
          price = prices.sort((a,b) => a.amount - b.amount)[0].amount;
          originalPrice = price;
      }
      
      if (originalPrice > price) {
          discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);
      }
  }

  const imageUrls: string[] = (product.images as ProductImage[] | undefined)?.map((img: ProductImage) => img.url) || [];
  const mainImage = product.thumbnail || imageUrls[0] || "https://placehold.co/800x600.png";
  
  // @ts-ignore
  const category = product.categories?.[0]?.name || "Uncategorized";

  const result: Product = {
    id: product.id!,
    slug: product.handle!,
    name: product.title!,
    category: category,
    collection: product.collection?.title || "General Collection",
    rating: 4,
    description: product.description || "No description available.",
    price,
    originalPrice,
    discountPercentage,
    features: product.tags?.map((t: { value: string }) => t.value) || [],
    images: {
      main: mainImage,
      previews: imageUrls.length > 0 ? imageUrls : [mainImage],
    },
  };

  return result;
}

export async function getProducts(): Promise<Product[]> {
  try {
    const { products } = await medusaSdk.store.product.list(
      {
        fields: `*variants.prices,*images,*collection,*categories`,
        region_id: "reg_01JYXR4EHCTQMY10K0HFH4Y3MF",
      },
      {
        "x-no-compression": "false",
      }
    );
    return products.map(transformProduct);
  } catch (error) {
    console.error("Failed to fetch products from Medusa:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const { products } = await medusaSdk.store.product.list({ fields: `*variants.prices,*images,*collection,*categories`, handle: slug, limit: 1 });
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
export const categories = ["All", "Sneakers", "Boots", "Sandals", "Formal"];

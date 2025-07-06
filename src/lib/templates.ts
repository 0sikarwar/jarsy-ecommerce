
//@ts-ignore
import type { product as PricedProduct } from "@medusajs/js-sdk";
import type { Product, ProductVariantPrice, ProductVariant, ProductImage, TransformedProduct } from "./templatesTypes";
import { medusaSdk } from "./mdedusa-sdk";

function transformProduct(product: PricedProduct): Product {
  const firstVariant = (product.variants as ProductVariant[] | undefined)?.[0];
  const prices: ProductVariantPrice[] | undefined = firstVariant?.prices?.filter(
    (p: ProductVariantPrice) => p.currency_code === "inr"
  );

  let price = 0;
  let originalPrice = 0;
  let discountPercentage = 0;

  if (prices && prices.length >= 2) {
    const sorted = prices.sort((a, b) => b.amount - a.amount);
    originalPrice = sorted[0].amount;
    price = sorted[1].amount;
    discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);
  } else if (prices && prices.length === 1) {
    price = originalPrice = prices[0].amount;
    discountPercentage = 0;
  }

  const imageUrls: string[] = (product.images as ProductImage[] | undefined)?.map((img: ProductImage) => img.url) || [];
  const mainImage = product.thumbnail || imageUrls[0] || "https://placehold.co/800x600.png";

  const result: TransformedProduct = {
    id: product.id!,
    slug: product.handle!,
    name: product.title!,
    variantId: firstVariant?.id!,
    category: product.categories?.[0]?.name || "Uncategorized",
    collection: product.collection?.title || "",
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
        fields: `*variants.prices,*categories`,
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
    const { products } = await medusaSdk.store.product.list({
      fields: `*variants.prices,*categories`,
      handle: slug,
      limit: 1,
    });
    if (!products.length) {
      return undefined;
    }
    return transformProduct(products[0]);
  } catch (error) {
    console.error(`Failed to fetch product with slug ${slug} from Medusa:`, error);
    return undefined;
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    const { product_categories } = await medusaSdk.store.category.list();
    return ["All", ...(product_categories?.map((cat: { name: string }) => cat.name) || [])];
  } catch (error) {
    console.error("Failed to fetch categories from Medusa:", error);
    return [];
  }
}

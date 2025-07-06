import { getProducts, getCategories } from "@/lib/templates";
import { ProductGallery } from "@/components/product-gallery";

export default async function HomePage() {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Find Your Perfect Pair</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
          Style, comfort, and quality delivered to your doorstep. Explore our curated collection of high-quality
          footwear.
        </p>
      </div>

      <main>
        <ProductGallery initialProducts={products} categories={categories} />
      </main>
    </div>
  );
}

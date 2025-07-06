
"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductBySlug } from "@/lib/templates";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { StarIcon } from "@/components/icons";
import { CheckCircle2, ShoppingCart, Loader2 } from "lucide-react";
import { AIContentGenerator } from "@/components/ai-content-generator";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/lib/templatesTypes";

type Props = {
  params: { slug: string };
};

export default function ProductDetailPage({ params }: Props) {
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const resolveParams = async () => {
      const resolvedParams = params;
      if (isMounted) setSlug(resolvedParams.slug);
    };
    resolveParams();
    return () => {
      isMounted = false;
    };
  }, [params]);

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const { addToCart, isLoading: isCartLoading } = useCart();

  useEffect(() => {
    if (!slug) return;
    const fetchProduct = async () => {
      setIsLoadingProduct(true);
      const fetchedProduct = await getProductBySlug(slug);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
      }
      setIsLoadingProduct(false);
    };

    fetchProduct();
  }, [slug]);

  if (isLoadingProduct) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
            <div>
              <h1 className="font-headline text-4xl md:text-5xl font-bold">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge variant="default">{product.category}</Badge>
                <Badge variant="outline">{product.collection}</Badge>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={i < product.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/50"}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">({product.rating}.0 rating)</span>
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
                <div className="flex flex-col items-end mb-2">
                    <div className="flex items-baseline gap-2">
                        {product.discountPercentage && product.discountPercentage > 0 && product.originalPrice && (
                            <del className="text-xl text-muted-foreground">₹{product.originalPrice}</del>
                        )}
                        <p className="text-4xl font-bold font-headline text-primary">₹{product.price}</p>
                    </div>
                    {product.discountPercentage && product.discountPercentage > 0 && (
                        <p className="text-md font-semibold text-primary">You save {product.discountPercentage}%!</p>
                    )}
                </div>
                <Button
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground w-full md:w-auto"
                    onClick={() => addToCart(product.variantId, 1)}
                    disabled={isCartLoading}
                >
                    {isCartLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ShoppingCart className="mr-2 h-5 w-5" />} Add to Cart
                </Button>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden shadow-lg">
              <CardContent className="p-0">
                <Carousel className="w-full">
                  <CarouselContent>
                    {product.images.previews.length > 0 ? (
                      product.images.previews.map((src, index) => (
                        <CarouselItem key={index}>
                          <Image
                            src={src}
                            alt={`Preview ${index + 1} for ${product.name}`}
                            width={1200}
                            height={800}
                            className="w-full h-auto object-cover rounded-lg aspect-video"
                            data-ai-hint={`${product.category} shoe`}
                          />
                        </CarouselItem>
                      ))
                    ) : (
                      <CarouselItem>
                        <Image
                          src={product.images.main}
                          alt={`Preview for ${product.name}`}
                          width={1200}
                          height={800}
                          className="w-full h-auto object-cover rounded-lg aspect-video"
                          data-ai-hint={`${product.category} shoe`}
                        />
                      </CarouselItem>
                    )}
                  </CarouselContent>
                  <CarouselPrevious className="left-4" />
                  <CarouselNext className="right-4" />
                </Carousel>
              </CardContent>
            </Card>

            <Card className="mt-8">
              <CardContent className="p-6">
                <h2 className="font-headline text-2xl font-semibold mb-4">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                {product.features.length > 0 && (
                  <>
                    <h3 className="font-headline text-xl font-semibold mt-6 mb-4">Features</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                      {product.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <AIContentGenerator product={product} />
          </div>
        </main>
      </div>
    </div>
  );
}

const ProductDetailSkeleton = () => (
  <div className="container mx-auto px-4 py-8 md:py-12 animate-pulse">
    <header className="mb-8">
      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
        <div>
          <Skeleton className="h-12 w-3/4 mb-4" />
          <div className="flex items-center gap-4 mt-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
        <div className="text-right flex-shrink-0 w-full md:w-auto">
          <Skeleton className="h-12 w-32 mb-2 ml-auto" />
          <Skeleton className="h-12 w-full md:w-48" />
        </div>
      </div>
    </header>
    <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <Skeleton className="w-full aspect-video rounded-lg" />
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-8 w-1/4 mt-6" />
            <Skeleton className="h-24 w-1/2" />
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-1">
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-10 w-full mt-4" />
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
);

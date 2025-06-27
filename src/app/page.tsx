'use client';

import { useState } from 'react';
import type { FC } from 'react';
import { products, Product } from '@/lib/templates';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/components/template-card';
import { Footprints, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const categories = ['All', 'Sneakers', 'Boots', 'Sandals', 'Formal'];

const Gallery: FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="relative text-center mb-8 md:mb-12">
        <div className="absolute top-0 right-0">
          <Button asChild variant="ghost" size="icon">
            <Link href="/account">
              <User className="h-6 w-6" />
              <span className="sr-only">Account</span>
            </Link>
          </Button>
        </div>
        <div className="inline-flex items-center justify-center mb-4">
          <Footprints className="h-8 w-8 text-primary mr-3" />
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
            Sole Central
          </h1>
          <Footprints className="h-8 w-8 text-primary ml-3" />
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Find your perfect pair from our curated collection of high-quality footwear. Style, comfort, and quality delivered to your doorstep.
        </p>
      </header>

      <main>
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full flex flex-col items-center mb-8">
          <TabsList className="grid w-full max-w-lg grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Gallery;

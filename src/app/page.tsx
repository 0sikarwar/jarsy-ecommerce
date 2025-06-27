'use client';

import { useState } from 'react';
import type { FC } from 'react';
import { products } from '@/lib/templates';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/components/template-card';

const categories = ['All', 'Sneakers', 'Boots', 'Sandals', 'Formal'];

const Gallery: FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
            Find Your Perfect Pair
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
          Style, comfort, and quality delivered to your doorstep. Explore our curated collection of high-quality footwear.
        </p>
      </div>

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

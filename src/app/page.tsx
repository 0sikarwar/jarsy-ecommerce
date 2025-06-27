'use client';

import { useState } from 'react';
import type { FC } from 'react';
import { templates, Template } from '@/lib/templates';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TemplateCard } from '@/components/template-card';
import { Sparkles } from 'lucide-react';

const categories = ['All', 'Fashion', 'Electronics', 'Home Goods', 'Beauty'];

const Gallery: FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredTemplates = activeCategory === 'All'
    ? templates
    : templates.filter(t => t.category === activeCategory);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="text-center mb-8 md:mb-12">
        <div className="inline-flex items-center justify-center mb-4">
          <Sparkles className="h-8 w-8 text-primary mr-3" />
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
            Medusa Muse
          </h1>
          <Sparkles className="h-8 w-8 text-primary ml-3" />
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover expertly crafted ecommerce templates for the Medusa platform. Find the perfect design to launch your store with style and functionality.
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
          {filteredTemplates.map(template => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Gallery;

"use client";

import { useState } from "react";
import type { FC } from "react";
import { ProductCard } from "@/components/template-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/lib/templatesTypes";

const categories = ["All", "Sneakers", "Boots", "Sandals", "Formal"];

interface ProductGalleryProps {
  initialProducts: Product[];
  categories: string[];
}

export const ProductGallery: FC<ProductGalleryProps> = ({ initialProducts, categories }) => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts =
    activeCategory === "All" ? initialProducts : initialProducts.filter((p) => p.category === activeCategory);

  return (
    <>
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full flex flex-col items-center mb-8">
        <TabsList className="grid w-[fit-content] max-w-lg grid-cols-2 sm:grid-cols-3 md:grid-cols-3">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
};

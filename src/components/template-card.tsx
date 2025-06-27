import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/templates';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StarIcon } from '@/components/icons';
import { Button } from './ui/button';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
      <CardHeader className="p-0">
        <Link href={`/templates/${product.slug}`} className="block">
          <Image
            src={product.images.main}
            alt={`Preview of ${product.name} product`}
            width={800}
            height={600}
            className="w-full h-auto object-cover aspect-[4/3]"
            data-ai-hint={`${product.category} shoe`}
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline text-xl font-bold mb-2">
            <Link href={`/templates/${product.slug}`} className="hover:text-primary transition-colors">
              {product.name}
            </Link>
          </CardTitle>
          <Badge variant="secondary">{product.category}</Badge>
        </div>
        <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center bg-secondary/50">
        <div className="flex items-center gap-1">
          <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
        </div>
        <Button asChild size="sm">
          <Link href={`/templates/${product.slug}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

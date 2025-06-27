import Link from 'next/link';
import Image from 'next/image';
import type { Template } from '@/lib/templates';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StarIcon } from '@/components/icons';
import { Button } from './ui/button';

interface TemplateCardProps {
  template: Template;
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
      <CardHeader className="p-0">
        <Link href={`/templates/${template.slug}`} className="block">
          <Image
            src={template.images.main}
            alt={`Preview of ${template.name} template`}
            width={800}
            height={600}
            className="w-full h-auto object-cover aspect-[4/3]"
            data-ai-hint={`${template.category} ecommerce`}
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline text-xl font-bold mb-2">
            <Link href={`/templates/${template.slug}`} className="hover:text-primary transition-colors">
              {template.name}
            </Link>
          </CardTitle>
          <Badge variant="secondary">{template.category}</Badge>
        </div>
        <p className="text-muted-foreground text-sm line-clamp-2">{template.description}</p>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center bg-secondary/50">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className={i < template.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'} />
          ))}
          <span className="text-sm text-muted-foreground ml-1">({template.rating}.0)</span>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link href={`/templates/${template.slug}`}>Preview</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

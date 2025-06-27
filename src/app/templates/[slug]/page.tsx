import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getTemplateBySlug, Template } from '@/lib/templates';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { StarIcon } from '@/components/icons';
import { CheckCircle2, Home } from 'lucide-react';
import { AIContentGenerator } from '@/components/ai-content-generator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const template = getTemplateBySlug(params.slug);
  if (!template) {
    return { title: 'Template Not Found' };
  }
  return {
    title: `${template.name} | Medusa Muse`,
    description: template.description,
  };
}

export default function TemplateDetailPage({ params }: Props) {
  const template = getTemplateBySlug(params.slug);

  if (!template) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="mb-8">
            <Button asChild variant="ghost" className="mb-4">
                <Link href="/"><Home className="mr-2 h-4 w-4"/> Back to Gallery</Link>
            </Button>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="font-headline text-4xl md:text-5xl font-bold">{template.name}</h1>
                    <div className="flex items-center gap-4 mt-2">
                        <Badge variant="default">{template.category}</Badge>
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <StarIcon key={i} className={i < template.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'} />
                            ))}
                            <span className="text-sm text-muted-foreground ml-1">({template.rating}.0 rating)</span>
                        </div>
                    </div>
                </div>
                 <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    Get This Template
                </Button>
            </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden shadow-lg">
                <CardContent className="p-4">
                    <Carousel className="w-full">
                        <CarouselContent>
                        {template.images.previews.map((src, index) => (
                            <CarouselItem key={index}>
                                <Image
                                    src={src}
                                    alt={`Preview ${index + 1} for ${template.name}`}
                                    width={1200}
                                    height={800}
                                    className="w-full h-auto object-cover rounded-lg aspect-video"
                                    data-ai-hint={`${template.category} screenshot`}
                                />
                            </CarouselItem>
                        ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-4" />
                        <CarouselNext className="right-4" />
                    </Carousel>
                </CardContent>
            </Card>
            
            <Card className="mt-8">
                <CardContent className="p-6">
                    <h2 className="font-headline text-2xl font-semibold mb-4">Description</h2>
                    <p className="text-muted-foreground leading-relaxed">{template.description}</p>
                    <h3 className="font-headline text-xl font-semibold mt-6 mb-4">Features</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                        {template.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                                <span className="text-foreground">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
             <AIContentGenerator templateName={template.name} />
          </div>
        </main>
      </div>
    </div>
  );
}

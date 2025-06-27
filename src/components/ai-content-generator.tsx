"use client";

import { useState } from 'react';
import { generateSuggestionsAction } from "@/app/templates/[slug]/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import type { GenerateContentSuggestionsOutput } from '@/ai/flows/generate-content-suggestions';
import type { Product } from '@/lib/templates';
import { useToast } from '@/hooks/use-toast';

interface AIContentGeneratorProps {
  product: Product;
}

export function AIContentGenerator({ product }: AIContentGeneratorProps) {
  const [result, setResult] = useState<GenerateContentSuggestionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  async function handleGenerate() {
    setIsLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("productName", product.name);
    formData.append("productCategory", product.category);

    const response = await generateSuggestionsAction(formData);

    if (response.success && response.data) {
      setResult(response.data);
    } else {
        toast({
            variant: "destructive",
            title: "Generation Failed",
            description: response.error || "An unknown error occurred.",
        });
    }

    setIsLoading(false);
  }

  return (
    <Card className="sticky top-8 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
                <Wand2 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="font-headline text-2xl">AI Content Suggestions</CardTitle>
        </div>
        <CardDescription>
          Let AI craft a new tagline and description for the '{product.name}'.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
            <Button onClick={handleGenerate} className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Content
                </>
              )}
            </Button>
        </div>

        {result && (
            <div className="mt-8 space-y-6 animate-in fade-in duration-500">
                <Card className="bg-background">
                    <CardHeader>
                        <CardTitle className="text-lg font-headline">Suggested Tagline</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg font-semibold text-primary italic">"{result.productTagline}"</p>
                    </CardContent>
                </Card>
                <Card className="bg-background">
                    <CardHeader>
                        <CardTitle className="text-lg font-headline">Suggested Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground whitespace-pre-wrap">{result.productDescription}</p>
                    </CardContent>
                </Card>
            </div>
        )}
      </CardContent>
    </Card>
  );
}

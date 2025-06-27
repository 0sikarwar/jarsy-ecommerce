"use client";

import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { generateSuggestionsAction } from "@/app/templates/[slug]/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import type { GenerateContentSuggestionsOutput } from '@/ai/flows/generate-content-suggestions';
import { useToast } from '@/hooks/use-toast';

interface AIContentGeneratorProps {
  templateName: string;
}

const formSchema = z.object({
  productName: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  productCategory: z.string().min(2, {
    message: "Category must be at least 2 characters.",
  }),
});

export function AIContentGenerator({ templateName }: AIContentGeneratorProps) {
  const [result, setResult] = useState<GenerateContentSuggestionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      productCategory: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("templateName", templateName);
    formData.append("productName", values.productName);
    formData.append("productCategory", values.productCategory);

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
          Based on the '{templateName}' template, let AI craft content for your product.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 'Astra Sneakers'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="productCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Category</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 'Footwear'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
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
          </form>
        </Form>

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

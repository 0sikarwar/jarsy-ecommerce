'use server';

/**
 * @fileOverview Generates content suggestions (product descriptions, taglines) based on the selected ecommerce template.
 *
 * - generateContentSuggestions - A function that generates content suggestions based on the selected template.
 * - GenerateContentSuggestionsInput - The input type for the generateContentSuggestions function.
 * - GenerateContentSuggestionsOutput - The return type for the generateContentSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateContentSuggestionsInputSchema = z.object({
  templateName: z.string().describe('The name of the selected ecommerce template.'),
  productName: z.string().describe('The name of the product.'),
  productCategory: z.string().describe('The category of the product.'),
});
export type GenerateContentSuggestionsInput = z.infer<typeof GenerateContentSuggestionsInputSchema>;

const GenerateContentSuggestionsOutputSchema = z.object({
  productDescription: z.string().describe('A suggested product description.'),
  productTagline: z.string().describe('A suggested product tagline.'),
});
export type GenerateContentSuggestionsOutput = z.infer<typeof GenerateContentSuggestionsOutputSchema>;

export async function generateContentSuggestions(input: GenerateContentSuggestionsInput): Promise<GenerateContentSuggestionsOutput> {
  return generateContentSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateContentSuggestionsPrompt',
  input: {schema: GenerateContentSuggestionsInputSchema},
  output: {schema: GenerateContentSuggestionsOutputSchema},
  prompt: `You are an expert in generating content for ecommerce stores.

  Based on the selected template and product information, generate a product description and a product tagline.

  Template Name: {{{templateName}}}
  Product Name: {{{productName}}}
  Product Category: {{{productCategory}}}

  Product Description:
  Product Tagline:`,
});

const generateContentSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateContentSuggestionsFlow',
    inputSchema: GenerateContentSuggestionsInputSchema,
    outputSchema: GenerateContentSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

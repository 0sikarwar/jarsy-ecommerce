'use server';

/**
 * @fileOverview Generates content suggestions (product descriptions, taglines) for shoes.
 *
 * - generateContentSuggestions - A function that generates content suggestions based on the product info.
 * - GenerateContentSuggestionsInput - The input type for the generateContentSuggestions function.
 * - GenerateContentSuggestionsOutput - The return type for the generateContentSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateContentSuggestionsInputSchema = z.object({
  productName: z.string().describe('The name of the shoe.'),
  productCategory: z.string().describe('The category of the shoe (e.g., Sneakers, Boots).'),
});
export type GenerateContentSuggestionsInput = z.infer<typeof GenerateContentSuggestionsInputSchema>;

const GenerateContentSuggestionsOutputSchema = z.object({
  productDescription: z.string().describe('A suggested product description for the shoe.'),
  productTagline: z.string().describe('A suggested product tagline for the shoe.'),
});
export type GenerateContentSuggestionsOutput = z.infer<typeof GenerateContentSuggestionsOutputSchema>;

export async function generateContentSuggestions(input: GenerateContentSuggestionsInput): Promise<GenerateContentSuggestionsOutput> {
  return generateContentSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateContentSuggestionsPrompt',
  input: {schema: GenerateContentSuggestionsInputSchema},
  output: {schema: GenerateContentSuggestionsOutputSchema},
  prompt: `You are an expert copywriter for a trendy shoe store.

  Based on the product information, generate a compelling product description and a catchy product tagline.
  Make it sound exciting and desirable for shoe lovers.

  Product Name: {{{productName}}}
  Product Category: {{{productCategory}}}`,
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

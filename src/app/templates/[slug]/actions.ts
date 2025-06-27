"use server";

import { generateContentSuggestions, GenerateContentSuggestionsInput } from '@/ai/flows/generate-content-suggestions';
import { z } from 'zod';

const ActionInputSchema = z.object({
  productName: z.string().min(2, "Product name must be at least 2 characters."),
  productCategory: z.string().min(2, "Product category must be at least 2 characters."),
});

export async function generateSuggestionsAction(formData: FormData) {
  const input = {
    productName: formData.get('productName') as string,
    productCategory: formData.get('productCategory') as string,
  };

  const validation = ActionInputSchema.safeParse(input);

  if (!validation.success) {
    return { success: false, error: "Invalid input.", fieldErrors: validation.error.flatten().fieldErrors };
  }

  try {
    const result = await generateContentSuggestions(validation.data);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'An unexpected error occurred while generating content.' };
  }
}

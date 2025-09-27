'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating theme suggestions based on a topic.
 *
 * - generateThemeSuggestion - A function that takes a topic and returns a theme suggestion.
 * - GenerateThemeSuggestionInput - The input type for the generateThemeSuggestion function.
 * - GenerateThemeSuggestionOutput - The return type for the generateThemeSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateThemeSuggestionInputSchema = z.object({
  topic: z.string().describe('The topic for the theme suggestion.'),
});
export type GenerateThemeSuggestionInput = z.infer<typeof GenerateThemeSuggestionInputSchema>;

const GenerateThemeSuggestionOutputSchema = z.object({
  backgroundColor: z.string().describe('The suggested background color in hex format.'),
  primaryColor: z.string().describe('The suggested primary color in hex format.'),
  accentColor: z.string().describe('The suggested accent color in hex format.'),
  font: z.string().describe('The suggested font from Google Fonts.'),
});
export type GenerateThemeSuggestionOutput = z.infer<typeof GenerateThemeSuggestionOutputSchema>;

export async function generateThemeSuggestion(
  input: GenerateThemeSuggestionInput
): Promise<GenerateThemeSuggestionOutput> {
  return generateThemeSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateThemeSuggestionPrompt',
  input: {schema: GenerateThemeSuggestionInputSchema},
  output: {schema: GenerateThemeSuggestionOutputSchema},
  prompt: `You are a design expert. Given a topic, suggest a color theme and a font for a portfolio website.

Topic: {{{topic}}}

Provide the theme in the following format:
- backgroundColor: A hex color code for the background.
- primaryColor: A hex color code for primary elements.
- accentColor: A hex color code for accent elements.
- font: A font name from Google Fonts that would fit the theme.
`,
});

const generateThemeSuggestionFlow = ai.defineFlow(
  {
    name: 'generateThemeSuggestionFlow',
    inputSchema: GenerateThemeSuggestionInputSchema,
    outputSchema: GenerateThemeSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

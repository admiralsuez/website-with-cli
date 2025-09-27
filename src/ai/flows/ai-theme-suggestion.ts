'use server';

/**
 * @fileOverview Provides AI-driven theme suggestions for the portfolio based on a given theme.
 *
 * - suggestTheme - A function that generates theme suggestions.
 * - ThemeSuggestionInput - The input type for the suggestTheme function.
 * - ThemeSuggestionOutput - The return type for the suggestTheme function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ThemeSuggestionInputSchema = z.object({
  theme: z.string().describe('A general theme for the portfolio, e.g., futuristic, minimalist.'),
});
export type ThemeSuggestionInput = z.infer<typeof ThemeSuggestionInputSchema>;

const ThemeSuggestionOutputSchema = z.object({
  primaryColor: z.string().describe('The suggested primary color in hex code.'),
  backgroundColor: z.string().describe('The suggested background color in hex code.'),
  accentColor: z.string().describe('The suggested accent color in hex code.'),
  font: z.string().describe('The suggested font family.'),
});
export type ThemeSuggestionOutput = z.infer<typeof ThemeSuggestionOutputSchema>;

export async function suggestTheme(input: ThemeSuggestionInput): Promise<ThemeSuggestionOutput> {
  return suggestThemeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'themeSuggestionPrompt',
  input: {schema: ThemeSuggestionInputSchema},
  output: {schema: ThemeSuggestionOutputSchema},
  prompt: `You are a UI/UX design expert. You are tasked with suggesting a color scheme and font pairing for a portfolio website based on a given theme.

  Given the following theme: {{{theme}}}

  Suggest a primary color, background color, accent color, and font that would be suitable for the portfolio.

  Please provide the primary color, background color, and accent color in hex code.
`,
});

const suggestThemeFlow = ai.defineFlow(
  {
    name: 'suggestThemeFlow',
    inputSchema: ThemeSuggestionInputSchema,
    outputSchema: ThemeSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

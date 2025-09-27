'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Theme } from '@/lib/types';
import { Separator } from './ui/separator';
import { Wand2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { suggestTheme } from '@/ai/flows/ai-theme-suggestion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const themeSchema = z.object({
  backgroundColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex code'),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex code'),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex code'),
  font: z.string().min(1, 'Font is required'),
});

type ThemeFormValues = z.infer<typeof themeSchema>;

interface ThemeFormProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export default function ThemeForm({
  currentTheme,
  onThemeChange,
}: ThemeFormProps) {
  const [aiTheme, setAiTheme] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<ThemeFormValues>({
    resolver: zodResolver(themeSchema),
    defaultValues: currentTheme,
  });

  const onSubmit = (data: ThemeFormValues) => {
    onThemeChange(data);
    toast({
      title: 'Theme Updated',
      description: 'Your new theme has been applied.',
    });
  };

  const handleSuggestTheme = async () => {
    if (!aiTheme) {
      toast({
        variant: 'destructive',
        title: 'Missing Theme',
        description: 'Please enter a theme idea to get suggestions.',
      });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await suggestTheme({ theme: aiTheme });
      form.setValue('backgroundColor', result.backgroundColor, { shouldValidate: true });
      form.setValue('primaryColor', result.primaryColor, { shouldValidate: true });
      form.setValue('accentColor', result.accentColor, { shouldValidate: true });
      form.setValue('font', result.font, { shouldValidate: true });
      toast({
        title: 'Theme Suggested!',
        description: 'New theme values have been populated in the form. Save to apply.',
      });
    } catch (error) {
      console.error('Failed to suggest theme:', error);
      toast({
        variant: 'destructive',
        title: 'Suggestion Failed',
        description: 'Could not generate a theme at this time.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Customize Theme</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="backgroundColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Background Color</FormLabel>
                      <FormControl>
                        <Input type="color" {...field} className='p-1 h-10'/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="primaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Color</FormLabel>
                      <FormControl>
                        <Input type="color" {...field} className='p-1 h-10'/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accentColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accent Color</FormLabel>
                      <FormControl>
                        <Input type="color" {...field} className='p-1 h-10'/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormDescription>
                Primary color is used for cards and containers. Accent color is for text and interactive elements.
              </FormDescription>

              <FormField
                control={form.control}
                name="font"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Font Family</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Space Grotesk" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a font name from Google Fonts. Page reload may be required.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Save Theme</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>AI Theme Suggestion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="e.g., futuristic, minimalist, retro"
              value={aiTheme}
              onChange={(e) => setAiTheme(e.target.value)}
            />
            <Button onClick={handleSuggestTheme} disabled={isGenerating}>
              <Wand2 className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-pulse' : ''}`} />
              Suggest
            </Button>
          </div>
          <FormDescription>
            Let AI suggest a color scheme and font for your portfolio based on a theme.
          </FormDescription>
        </CardContent>
      </Card>
    </div>
  );
}

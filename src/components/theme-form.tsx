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
import { useToast } from '@/hooks/use-toast';
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
    </div>
  );
}

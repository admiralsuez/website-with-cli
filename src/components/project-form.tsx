'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import type { Project } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Wand2 } from 'lucide-react';
import { useState } from 'react';
import { generateProjectDescription } from '@/ai/flows/generate-project-description';
import { useToast } from '@/hooks/use-toast';

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required.'),
  techStack: z.string().min(1, 'Tech stack is required.'),
  description: z.string().min(1, 'Description is required.'),
  liveUrl: z.string().url().optional().or(z.literal('')),
  repoUrl: z.string().url().optional().or(z.literal('')),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  project: Project | null;
  onSave: (project: Project) => void;
}

export default function ProjectForm({ project, onSave }: ProjectFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name ?? '',
      techStack: project?.techStack ?? '',
      description: project?.description ?? '',
      liveUrl: project?.liveUrl ?? '',
      repoUrl: project?.repoUrl ?? '',
    },
  });

  const onSubmit = (data: ProjectFormValues) => {
    onSave({
      id: project?.id ?? new Date().getTime().toString(),
      ...data,
    });
  };

  const handleGenerateDescription = async () => {
    const projectName = form.getValues('name');
    const techStack = form.getValues('techStack');
    if (!projectName || !techStack) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please provide a project name and tech stack to generate a description.',
      });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateProjectDescription({ projectName, techStack });
      form.setValue('description', result.description, { shouldValidate: true });
    } catch (error) {
      console.error('Failed to generate description:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'Could not generate a description at this time.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="My Awesome Project" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="techStack"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tech Stack</FormLabel>
              <FormControl>
                <Input placeholder="React, Next.js, Tailwind CSS" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <div className="relative">
                <FormControl>
                  <Textarea
                    placeholder="A brief description of the project."
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-2 right-2"
                  onClick={handleGenerateDescription}
                  disabled={isGenerating}
                >
                  <Wand2 className={`h-4 w-4 ${isGenerating ? 'animate-pulse' : ''}`} />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="liveUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Live URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="repoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repository URL</FormLabel>
              <FormControl>
                <Input placeholder="https://github.com/user/repo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          {project ? 'Save Changes' : 'Create Project'}
        </Button>
      </form>
    </Form>
  );
}

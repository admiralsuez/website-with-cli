'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import CliContainer from '@/components/cli-container';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import BlinkingCursor from '@/components/blinking-cursor';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Project, Theme } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';


export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id;
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) return;
      try {
        const [projectRes, themeRes] = await Promise.all([
          fetch(`/api/projects?id=${projectId}`),
          fetch('/api/theme'),
        ]);

        if (!projectRes.ok || !themeRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const projectData = await projectRes.json();
        const themeData = await themeRes.json();

        setProject(projectData);
        setTheme(themeData);
      } catch (error) {
        console.error(error);
        toast({
          title: 'Error',
          description: 'Could not load project data.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId, toast]);

  if (isLoading || !theme) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <BlinkingCursor />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background text-foreground">
        <p>Project not found.</p>
      </div>
    );
  }
  
  const cliPrompt = theme.prompt || 'user@cli-portfolio';

  return (
    <div className="p-4 md:p-8 flex items-center justify-center min-h-screen">
      <CliContainer>
        <main className="flex-1 p-4 md:p-6 space-y-8 overflow-y-auto">
          <div className="flex items-center gap-2">
            <span className="text-primary font-bold hidden sm:inline">
              [{cliPrompt} ~]$
            </span>
            <span className="font-headline text-lg sm:text-2xl">
              cat projects/{project.name ? project.name.toLowerCase().replace(/ /g, '_') : 'untitled'}.md
            </span>
          </div>

          <Card className="bg-card/50">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-primary text-2xl sm:text-3xl">{project.name}</CardTitle>
              <CardDescription className="font-code text-sm pt-2">
                <span className="text-foreground">TECH:</span> {project.techStack}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 flex flex-col gap-6">
              {project.mediaPath && (
                <div className="aspect-video relative overflow-hidden rounded-md border">
                  {project.mediaType === 'video' ? (
                    <video
                      src={project.mediaPath}
                      controls
                      className="w-full h-full object-cover"
                      data-ai-hint="demo video"
                    />
                  ) : (
                    <Image
                      src={project.mediaPath}
                      alt={project.name || 'Project media'}
                      fill
                      className="object-cover"
                      data-ai-hint="screenshot app"
                    />
                  )}
                </div>
              )}
              <p className="text-sm sm:text-base whitespace-pre-line">{project.description}</p>
            </CardContent>
            <CardFooter className="p-4 md:p-6 pt-0 flex flex-wrap gap-4">
              {project.repoUrl && (
                <Button asChild variant="link" className="p-0 h-auto text-foreground text-sm">
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                    [repository]
                  </a>
                </Button>
              )}
              {project.liveUrl && (
                <Button asChild variant="link" className="p-0 h-auto text-foreground text-sm">
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    [live_demo]
                  </a>
                </Button>
              )}
            </CardFooter>
          </Card>
        </main>
        
        <footer className="p-4 border-t">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <Link href="/" className="text-primary font-bold hover:underline">
              [{cliPrompt} ~]$ cd ..
            </Link>
            <BlinkingCursor />
          </div>
        </footer>
      </CliContainer>
    </div>
  );
}

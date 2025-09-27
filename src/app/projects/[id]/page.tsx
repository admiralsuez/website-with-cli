'use client';

import { useParams, useRouter } from 'next/navigation';
import { initialProjects, initialTheme } from '@/lib/initial-data';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import CliContainer from '@/components/cli-container';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import BlinkingCursor from '@/components/blinking-cursor';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Theme } from '@/lib/types';

export default function ProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id;
  const [theme] = useState<Theme>(initialTheme);

  // In a real app, you'd fetch this from a persistent store
  const project = initialProjects.find((p) => p.id === projectId);
  
  const cliPrompt = theme.prompt || 'user@cli-portfolio';

  if (!project) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background text-foreground">
        <p>Project not found.</p>
      </div>
    );
  }

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
              {project.imageUrl && (
                <div className="aspect-video relative overflow-hidden rounded-md border">
                  <Image
                    src={project.imageUrl}
                    alt={project.name || 'Project image'}
                    fill
                    className="object-cover"
                    data-ai-hint="screenshot app"
                  />
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

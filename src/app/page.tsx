'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AdminPanel from '@/components/admin-panel';
import BlinkingCursor from '@/components/blinking-cursor';
import CliContainer from '@/components/cli-container';
import Typewriter from '@/components/typewriter';
import { initialProjects, initialTheme } from '@/lib/initial-data';
import type { Project, Theme } from '@/lib/types';
import { hexToHslString } from '@/lib/colors';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import InteractiveTerminal from '@/components/interactive-terminal';
import { Cog } from 'lucide-react';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [isPanelOpen, setPanelOpen] = useState(false);
  const [isTerminalOpen, setTerminalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // New state to control the animation sequence
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [commandVisible, setCommandVisible] = useState(false);
  const [projectsVisible, setProjectsVisible] = useState(false);


  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const timer = setTimeout(() => {
        setWelcomeVisible(true);
      }, 500); // Small delay to ensure mount
      return () => clearTimeout(timer);
    }
  }, [isMounted]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme.backgroundColor) {
      root.style.setProperty('--background', hexToHslString(theme.backgroundColor));
    }
    if (theme.primaryColor) {
      const cardColor = hexToHslString(theme.primaryColor);
      root.style.setProperty('--card', cardColor);
      root.style.setProperty('--secondary', cardColor);
      root.style.setProperty('--border', cardColor);
      root.style.setProperty('--input', cardColor);
      root.style.setProperty('--muted', cardColor);
    }
    if (theme.accentColor) {
      const accentColor = hexToHslString(theme.accentColor);
      root.style.setProperty('--foreground', accentColor);
      root.style.setProperty('--primary', accentColor);
      root.style.setProperty('--primary-foreground', hexToHslString(theme.backgroundColor));
      root.style.setProperty('--accent-foreground', accentColor);
      root.style.setProperty('--card-foreground', accentColor);
      root.style.setProperty('--ring', accentColor);
      root.style.setProperty(
        '--muted-foreground',
        hexToHslString(theme.accentColor, { lightness: (l) => l * 0.8 })
      );
    }
  }, [theme]);
  
  const handleWelcomeComplete = () => {
    setTimeout(() => setCommandVisible(true), 100);
  };
  
  const handleCommandComplete = () => {
    setTimeout(() => setProjectsVisible(true), 500);
  };

  if (!isMounted) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <BlinkingCursor />
      </div>
    );
  }
  
  const cliPrompt = theme.prompt || 'user@cli-portfolio';

  return (
    <div className="p-4 md:p-8 flex items-center justify-center min-h-screen">
      <CliContainer>
        <main className="flex-1 p-4 md:p-6 space-y-8 overflow-y-auto">
          {welcomeVisible && (
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold hidden sm:inline">
                [{cliPrompt} ~]$
              </span>
              <Typewriter
                text={theme.welcomeMessage || ''}
                className="font-headline text-lg sm:text-2xl"
                onComplete={handleWelcomeComplete}
              />
            </div>
          )}

          {commandVisible && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center gap-2">
                <span className="text-primary font-bold">[{cliPrompt} ~]$</span>
                <Typewriter 
                  text={theme.loadingCommand || "ls projects"}
                  className="text-lg sm:text-xl font-bold font-headline"
                  onComplete={handleCommandComplete}
                  speed={70}
                />
              </div>
              
              {projectsVisible && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 animate-in fade-in duration-500">
                  {projects.filter(p => !p.hidden).map((project) => (
                    <Link href={`/projects/${project.id}`} key={project.id} className="no-underline">
                      <Card className="bg-card/50 hover:bg-card/90 transition-colors flex flex-col h-full">
                        <CardHeader className="p-4">
                          <CardTitle className="text-primary text-base sm:text-lg">{project.name}</CardTitle>
                          <CardDescription className="font-code text-xs pt-1">
                            <span className="text-foreground">TECH:</span> {project.techStack}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 flex-1 flex flex-col gap-4">
                          {project.imageUrl && (
                            <div className="aspect-video relative overflow-hidden rounded-md">
                              <Image 
                                src={project.imageUrl} 
                                alt={project.name || 'Project image'} 
                                fill
                                className="object-cover"
                                data-ai-hint="screenshot app"
                              />
                            </div>
                          )}
                          <p className="text-xs sm:text-sm line-clamp-3">{project.description}</p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 mt-auto flex gap-4">
                          <span className="text-foreground text-xs sm:text-sm">[view_project]</span>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>

        <footer 
          className="p-4 border-t flex items-center justify-between"
        >
          <div 
            className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer flex-1"
            onClick={() => setTerminalOpen(true)}
          >
            <span className="text-primary font-bold">
              [{cliPrompt} ~]$
            </span>
            <BlinkingCursor />
          </div>
          <Button variant="ghost" size="icon" onClick={() => setPanelOpen(true)} className="h-8 w-8">
            <Cog className="h-4 w-4" />
            <span className="sr-only">Open Admin Panel</span>
          </Button>
        </footer>
      </CliContainer>

      <AdminPanel
        isOpen={isPanelOpen}
        onOpenChange={setPanelOpen}
        projects={projects}
        setProjects={setProjects}
        currentTheme={theme}
        onThemeChange={setTheme}
      />
      <InteractiveTerminal 
        isOpen={isTerminalOpen}
        onOpenChange={setTerminalOpen}
        openAdminPanel={() => setPanelOpen(true)}
        projects={projects}
        prompt={cliPrompt}
      />
    </div>
  );
}

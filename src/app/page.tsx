'use client';

import { useState, useEffect } from 'react';
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

export default function Home() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [isPanelOpen, setPanelOpen] = useState(false);
  const [isTerminalOpen, setTerminalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
  
  if (!isMounted) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <BlinkingCursor />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <CliContainer>
        <main className="flex-1 p-6 space-y-8 overflow-y-auto">
          <div className="flex items-center gap-2">
            <span className="text-primary font-bold hidden sm:inline">
              [user@cli-portfolio ~]$
            </span>
            <Typewriter
              text=" welcome-to-my-portfolio"
              className="font-headline text-2xl"
            />
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold">[user@cli-portfolio ~]$</span>
              <h2 className="text-xl font-bold font-headline">ls -a projects</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="bg-card/50 hover:bg-card/90 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-primary">{project.name}</CardTitle>
                    <CardDescription className="font-code text-xs pt-1">
                      <span className="text-foreground">TECH:</span> {project.techStack}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{project.description}</p>
                  </CardContent>
                  <CardFooter className="flex gap-4">
                    {project.repoUrl && (
                      <Button asChild variant="link" className="p-0 h-auto text-foreground">
                        <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                          [repository]
                        </a>
                      </Button>
                    )}
                    {project.liveUrl && (
                      <Button asChild variant="link" className="p-0 h-auto text-foreground">
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          [live_demo]
                        </a>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </main>

        <footer 
          className="p-4 border-t cursor-pointer"
          onClick={() => setTerminalOpen(true)}
        >
          <div className="flex items-center gap-2 text-sm">
            <span className="text-primary font-bold">
              [user@cli-portfolio ~]$
            </span>
            <BlinkingCursor />
          </div>
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
      />
    </div>
  );
}

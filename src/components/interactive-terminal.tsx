'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from './ui/scroll-area';
import type { Project } from '@/lib/types';
import BlinkingCursor from './blinking-cursor';

interface InteractiveTerminalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  openAdminPanel: () => void;
  projects: Project[];
  prompt: string;
}

type CommandRecord = {
  command: string;
  output: React.ReactNode;
  isPassword?: boolean;
};

export default function InteractiveTerminal({
  isOpen,
  onOpenChange,
  openAdminPanel,
  projects,
  prompt,
}: InteractiveTerminalProps) {
  const [history, setHistory] = useState<CommandRecord[]>([]);
  const [input, setInput] = useState('');
  const [isAwaitingPassword, setIsAwaitingPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const initialMessage: CommandRecord = {
    command: '',
    output: 'Welcome to the interactive terminal. Type "help" for a list of commands.',
  };

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        'div[data-radix-scroll-area-viewport]'
      );
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, []);
  
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
       if (history.length === 0) {
        setHistory([initialMessage]);
      }
    } else {
      // Reset state when closed
      setIsAwaitingPassword(false);
      setInput('');
    }
  }, [isOpen, history.length]);

  useEffect(() => {
    scrollToBottom();
  }, [history, scrollToBottom]);

  
  const cliPrompt = prompt || 'user@cli-portfolio';
  const adminPassword = process.env.ADMIN_PASSWORD;

  const handlePassword = (password: string) => {
    let output: React.ReactNode;
    if (adminPassword && password === adminPassword) {
      output = 'Authentication successful. Opening admin panel...';
      openAdminPanel();
      setTimeout(() => onOpenChange(false), 1000);
    } else {
      output = 'root auth failure (this incident will be reported)';
    }
    setHistory(prev => [...prev, { command: password, output, isPassword: true }]);
    setIsAwaitingPassword(false);
    setInput('');
  };
  
  const handleCommand = (command: string) => {
    let output: React.ReactNode = null;
    const commandParts = command.toLowerCase().trim().split(' ');
    const mainCommand = commandParts[0];

    switch (mainCommand) {
      case 'help':
        output = (
          <div className="text-xs">
            <p>Available commands:</p>
            <ul className="list-disc pl-5">
              <li>help - Show this help message</li>
              <li>admin - Open the admin panel (requires password)</li>
              <li>ls [-a] - List projects (add -a to show hidden)</li>
              <li>clear - Clear the terminal history</li>
              <li>date - Display the current date</li>
              <li>echo [text] - Print text to the terminal</li>
            </ul>
          </div>
        );
        break;
      case 'admin':
        setIsAwaitingPassword(true);
        setHistory(prev => [...prev, { command, output: '' }]);
        setInput('');
        return; // Return early to prevent adding to history twice
      case 'clear':
        setHistory([initialMessage]);
        return;
      case 'date':
        output = new Date().toString();
        break;
      case 'ls':
        const showHidden = commandParts.includes('-a');
        const projectsToList = showHidden ? projects : projects.filter(p => !p.hidden);
        output = (
          <ul className="list-disc pl-5">
            {projectsToList.map(p => (
              <li key={p.id}>
                <Link 
                  href={`/projects/${p.id}`} 
                  className="hover:underline"
                  onClick={() => onOpenChange(false)}
                >
                  {p.name || 'Untitled Project'}
                </Link>
              </li>
            ))}
          </ul>
        );
        break;
      default:
        if (mainCommand === 'echo') {
          output = command.substring(5);
        } else if (command) {
          output = `command not found: ${command}`;
        }
    }
    setHistory(prev => [...prev, { command, output }]);
    setInput('');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const commandToProcess = input.trim();
    if (isAwaitingPassword) {
      handlePassword(commandToProcess);
    } else {
       if (commandToProcess === '') {
        setHistory(prev => [...prev, { command: '', output: '' }]);
       } else {
        handleCommand(commandToProcess);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[90vw] max-w-3xl h-[60vh] flex flex-col p-0"
        onInteractOutside={(e) => {
             e.preventDefault()
        }}
      >
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Interactive Terminal</DialogTitle>
        </DialogHeader>
        <div
          className="flex-1 p-4 overflow-y-auto"
          onClick={() => inputRef.current?.focus()}
        >
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="font-code text-sm space-y-2">
              {history.map((item, index) => (
                <div key={index}>
                  {item.command && (
                    <div className="flex items-center gap-2">
                        <span className="text-primary font-bold">
                        [{cliPrompt} ~]$
                        </span>
                        <span>{item.isPassword ? '*'.repeat(item.command.length) : item.command}</span>
                    </div>
                  )}
                  {item.output && (
                    <div className="text-foreground whitespace-pre-wrap">
                      {item.output}
                    </div>
                  )}
                </div>
              ))}
               <div className="flex items-center gap-2">
                <form onSubmit={handleSubmit} className="flex items-center gap-2 flex-1">
                    {isAwaitingPassword ? (
                      <>
                        <span>Enter password:</span>
                        <Input
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            type="password"
                            className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                            autoComplete="off"
                        />
                      </>
                    ) : (
                      <>
                      <span className="text-primary font-bold">
                        [{cliPrompt} ~]$
                      </span>
                      <Input
                          ref={inputRef}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          type="text"
                          className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                          autoComplete="off"
                      />
                      </>
                    )}
                </form>
              </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

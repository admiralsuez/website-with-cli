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
  isPasswordPrompt?: boolean;
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
      if (history.length === 0 || (history.length === 1 && history[0].command === '' && history[0].output === initialMessage.output)) {
        setHistory([initialMessage]);
      }
      setInput('');
    }
  }, [isOpen, history.length, initialMessage.output]);

  useEffect(() => {
    scrollToBottom();
  }, [history, scrollToBottom]);

  const lastCommand = history[history.length - 1];
  const isAwaitingPassword = lastCommand?.isPasswordPrompt;
  const cliPrompt = prompt || 'user@cli-portfolio';

  const handleCommand = (command: string) => {
    let output: React.ReactNode;
    let isPasswordPrompt = false;

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
              <li>ls - List visible projects</li>
              <li>clear - Clear the terminal history</li>
              <li>date - Display the current date</li>
              <li>echo [text] - Print text to the terminal</li>
            </ul>
          </div>
        );
        break;
      case 'admin':
        isPasswordPrompt = true;
        output = 'Enter password:';
        setHistory((prev) => [...prev, { command, output: '', isPasswordPrompt: false }, { command: '', output, isPasswordPrompt }]);
        return;
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
    setHistory((prev) => [...prev, { command, output }]);
  };
  
  const handlePassword = (password: string) => {
    let output: React.ReactNode;
    if (password === 'rooted@89') {
      output = 'Authentication successful. Opening admin panel...';
      openAdminPanel();
      setTimeout(() => onOpenChange(false), 1000);
    } else {
      output = 'root auth failure (this incident will be reported)';
    }

    setHistory((prev) => {
        const newHistory = [...prev];
        const lastEntry = newHistory[newHistory.length - 1];
        if (lastEntry) {
            lastEntry.output = (
                <>
                    {'*'.repeat(password.length)}
                    <br />
                    {output}
                </>
            );
            lastEntry.isPasswordPrompt = false; 
        }
        return newHistory;
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const commandToProcess = input.trim();
    
    if (isAwaitingPassword) {
      handlePassword(commandToProcess);
    } else {
      handleCommand(commandToProcess);
    }
    setInput('');
    setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
    }, 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[90vw] max-w-3xl h-[60vh] flex flex-col p-0"
        onInteractOutside={(e) => {
            // e.preventDefault()
        }}
      >
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Interactive Terminal</DialogTitle>
        </DialogHeader>
        <div
          className="flex-1 p-4 overflow-hidden"
          onClick={() => inputRef.current?.focus()}
        >
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="font-code text-sm">
              {history.map((item, index) => (
                <div key={index}>
                  {item.command && (
                    <div className="flex items-center gap-2">
                        <span className="text-primary font-bold">
                        [{cliPrompt} ~]$
                        </span>
                        <span>{item.command}</span>
                    </div>
                  )}
                  {item.output && (
                    <div className="text-foreground whitespace-pre-wrap">
                      {item.isPasswordPrompt ? (
                        <>
                          {'*'.repeat(input.length)}
                          <br/>
                          {item.output}
                        </>
                      ) : (
                        item.output
                      )}
                    </div>
                  )}
                </div>
              ))}
               <form onSubmit={handleSubmit} className="flex items-center gap-2">
                  {isAwaitingPassword ? (
                    <>
                      <span>Enter password: </span>
                    </>
                  ) : (
                    <span className="text-primary font-bold">
                      [{cliPrompt} ~]$
                    </span>
                  )}
                  <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      type={isAwaitingPassword ? 'password' : 'text'}
                      className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                      autoComplete="off"
                  />
               </form>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

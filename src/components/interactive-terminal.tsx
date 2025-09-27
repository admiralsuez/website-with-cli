'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { X } from 'lucide-react';

interface InteractiveTerminalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  openAdminPanel: () => void;
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
}: InteractiveTerminalProps) {
  const [history, setHistory] = useState<CommandRecord[]>([]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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
      setHistory([]);
      setInput('');
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [history, scrollToBottom]);

  const lastCommand = history[history.length - 1];
  const isAwaitingPassword = lastCommand?.isPasswordPrompt && !lastCommand.command.includes('\n');

  const handleCommand = (command: string) => {
    let output: React.ReactNode;
    let isPasswordPrompt = false;

    switch (command.toLowerCase().trim()) {
      case 'help':
        output = (
          <div className="text-xs">
            <p>Available commands:</p>
            <ul className="list-disc pl-5">
              <li>help - Show this help message</li>
              <li>admin - Open the admin panel (requires password)</li>
              <li>clear - Clear the terminal history</li>
              <li>date - Display the current date</li>
              <li>echo [text] - Print text to the terminal</li>
            </ul>
          </div>
        );
        break;
      case 'admin':
        isPasswordPrompt = true;
        output = 'Enter password: ';
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'date':
        output = new Date().toString();
        break;
      default:
        if (command.toLowerCase().startsWith('echo ')) {
          output = command.substring(5);
        } else {
          output = `command not found: ${command}`;
        }
    }
    setHistory((prev) => [...prev, { command, output, isPasswordPrompt }]);
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
            // Append password and result to the last command output
            lastEntry.output = (
                <>
                    {lastEntry.output}
                    {'*'.repeat(password.length)}
                    <br />
                    {output}
                </>
            );
            // Mark as not a password prompt anymore
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
      if (commandToProcess) {
        handleCommand(commandToProcess);
      } else {
        setHistory((prev) => [...prev, { command: '', output: '' }]);
      }
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
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="p-4 border-b flex-row justify-between items-center">
          <DialogTitle>Interactive Terminal</DialogTitle>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        <div
          className="flex-1 p-4 overflow-hidden"
          onClick={() => inputRef.current?.focus()}
        >
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="font-code text-sm">
              {history.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-bold">
                      [user@cli-portfolio ~]$
                    </span>
                    <span className='whitespace-pre-wrap'>{item.command}</span>
                  </div>
                  {item.output && (
                    <div className="text-foreground whitespace-pre-wrap">
                      {item.output}
                      {item.isPasswordPrompt && (
                        <form onSubmit={handleSubmit} className="inline-flex items-center gap-2">
                            <Input
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                type="password"
                                className="inline-block w-32 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                                autoComplete="off"
                                autoFocus
                            />
                        </form>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {!isAwaitingPassword && (
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <span className="text-primary font-bold">
                    [user@cli-portfolio ~]$
                    </span>
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    type='text'
                    className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                    autoComplete="off"
                  />
                </form>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

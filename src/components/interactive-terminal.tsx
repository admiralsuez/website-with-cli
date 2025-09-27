'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import BlinkingCursor from './blinking-cursor';
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
  isPassword?: boolean;
};

export default function InteractiveTerminal({
  isOpen,
  onOpenChange,
  openAdminPanel,
}: InteractiveTerminalProps) {
  const [history, setHistory] = useState<CommandRecord[]>([]);
  const [input, setInput] = useState('');
  const [isAwaitingPassword, setAwaitingPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        'div[data-radix-scroll-area-viewport]'
      );
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setHistory([]);
      setAwaitingPassword(false);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleCommand = (command: string) => {
    let output: React.ReactNode;

    switch (command.toLowerCase().trim()) {
      case 'help':
        output = (
          <div>
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
        setHistory((prev) => [...prev, { command, output }]);
        break;
      case 'admin':
        setAwaitingPassword(true);
        output = 'Enter password:';
        setHistory((prev) => [...prev, { command, output }]);
        return; 
      case 'clear':
        setHistory([]);
        return;
      case 'date':
        output = new Date().toString();
        setHistory((prev) => [...prev, { command, output }]);
        break;
      default:
        if (command.toLowerCase().startsWith('echo ')) {
          output = command.substring(5);
        } else {
          output = `command not found: ${command}`;
        }
        setHistory((prev) => [...prev, { command, output }]);
    }
  };
  
  const handlePassword = (password: string) => {
    let output: React.ReactNode;
    if (password === 'rooted@89') {
        output = 'Authentication successful. Opening admin panel...';
        openAdminPanel();
        onOpenChange(false);
    } else {
        output = 'root auth failure (this incident will be reported)';
    }

    setHistory(prev => {
        const lastEntry = prev[prev.length-1];
        const newHistory = [...prev.slice(0, -1)];
        newHistory.push({
            ...lastEntry,
            output: (
                <>
                    {lastEntry.output}
                    <div>{output}</div>
                </>
            ),
            isPassword: true,
        })
        return newHistory;
    });

    setAwaitingPassword(false);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAwaitingPassword) {
        handlePassword(input);
    } else {
        if (input.trim()) {
            handleCommand(input);
        } else {
            setHistory(prev => [...prev, { command: '', output: '' }]);
        }
    }
    setInput('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[90vw] max-w-3xl h-[60vh] flex flex-col p-0"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="p-4 border-b flex-row justify-between items-center">
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
                    <div className="flex items-center gap-2">
                        {!item.isPassword && <span className="text-primary font-bold">
                        [user@cli-portfolio ~]$
                        </span>}
                        {!item.isPassword && <span>{item.command}</span>}
                    </div>
                  {item.output && (
                    <div className="text-foreground whitespace-pre-wrap">
                      {item.output}
                    </div>
                  )}
                </div>
              ))}
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                {!isAwaitingPassword && <span className="text-primary font-bold">
                  [user@cli-portfolio ~]$
                </span>}
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  type={isAwaitingPassword ? 'password' : 'text'}
                  className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                />
              </form>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

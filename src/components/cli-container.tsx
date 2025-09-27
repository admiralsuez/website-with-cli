'use client';

import { cn } from '@/lib/utils';
import React from 'react';

const CliContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'flex flex-col h-[calc(100vh-4rem)] max-h-[1000px] w-full max-w-7xl mx-auto bg-background border-2 border-secondary rounded-lg shadow-2xl overflow-hidden',
        className
      )}
    >
      <div className="flex-shrink-0 h-8 bg-secondary flex items-center px-3 gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      {children}
    </div>
  );
};

export default CliContainer;

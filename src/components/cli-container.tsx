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
        'flex flex-col h-[calc(100svh-2rem)] md:h-[calc(100vh-4rem)] max-h-[1000px] w-full max-w-7xl mx-auto bg-background border-2 border-primary rounded-lg shadow-2xl overflow-hidden',
        className
      )}
    >
      {children}
    </div>
  );
};

export default CliContainer;

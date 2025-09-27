import { cn } from '@/lib/utils';

const BlinkingCursor = ({ className }: { className?: string }) => {
  return (
    <span
      className={cn(
        'inline-block w-2 h-[1em] bg-primary blinking-cursor',
        className
      )}
    ></span>
  );
};

export default BlinkingCursor;

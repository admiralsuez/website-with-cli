'use client';
import { useState, useEffect } from 'react';

type TypewriterProps = {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
};

const Typewriter = ({ text, speed = 50, className, onComplete }: TypewriterProps) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) {
        clearInterval(intervalId);
        if (onComplete) {
          onComplete();
        }
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed, onComplete]);

  return <span className={className}>{displayedText}</span>;
};

export default Typewriter;

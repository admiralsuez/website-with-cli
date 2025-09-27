'use client';
import { useState, useEffect, useRef } from 'react';

type TypewriterProps = {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
};

const Typewriter = ({ text, speed = 50, className, onComplete }: TypewriterProps) => {
  const [displayedText, setDisplayedText] = useState('');
  // Use a ref to ensure onComplete is not stale
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    // Only run if text is provided
    if (!text) {
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
        return;
    };
    
    setDisplayedText('');
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) {
        clearInterval(intervalId);
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }
    }, speed);

    return () => clearInterval(intervalId);
  // Intentionally only re-run when text or speed changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed]);

  return <span className={className}>{displayedText}</span>;
};

export default Typewriter;

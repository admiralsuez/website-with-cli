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
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!text) {
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
      return;
    }

    setDisplayedText(''); // Ensure text is cleared before starting
    let i = 0;
    const intervalId = setInterval(() => {
      // Use a functional update for setDisplayedText to ensure we have the latest state
      setDisplayedText((prev) => text.substring(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(intervalId);
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]); // Removed onCompleteRef from dependencies

  return <span className={className}>{displayedText}</span>;
};

export default Typewriter;

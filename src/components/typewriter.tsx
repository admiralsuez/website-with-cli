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

  // Always use the latest onComplete callback
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // If text is empty, complete immediately.
    if (!text) {
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
      return;
    }
    
    // Reset displayed text when `text` prop changes.
    setDisplayedText(''); 
    let i = 0;
    
    const intervalId = setInterval(() => {
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i > text.length) { // Use > to ensure the last character is rendered before clearing
        clearInterval(intervalId);
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }
    }, speed);

    // Cleanup function to clear interval on component unmount or re-render
    return () => clearInterval(intervalId);
  }, [text, speed]); 

  return <span className={className}>{displayedText}</span>;
};

export default Typewriter;

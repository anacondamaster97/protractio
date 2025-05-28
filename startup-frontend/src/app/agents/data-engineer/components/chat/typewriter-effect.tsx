import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TypewriterEffectProps {
  content: string;
  speed?: number;
  onComplete?: () => void;
}

export const TypewriterEffect = ({ 
  content, 
  speed = 30, 
  onComplete 
}: TypewriterEffectProps) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < content.length) {
      const timeout = setTimeout(() => {
        setDisplayedContent(prev => prev + content[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [content, currentIndex, speed, onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {displayedContent}
        {currentIndex < content.length && (
          <motion.span
            animate={{ opacity: [0, 1] }}
            transition={{ repeat: Infinity, duration: 0.7 }}
            className="inline-block w-0.5 h-4 bg-primary ml-0.5"
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}; 
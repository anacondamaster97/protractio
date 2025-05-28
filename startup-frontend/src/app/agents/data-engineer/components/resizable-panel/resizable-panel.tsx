import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ResizablePanelProps {
  children: React.ReactNode;
  isOpen: boolean;
  minWidth: number;
  maxWidth: number;
  defaultWidth: number;
  onResize: (width: number) => void;
  onToggle: () => void;
  className?: string;
}

export const ResizablePanel = ({
  children,
  isOpen,
  minWidth,
  maxWidth,
  defaultWidth,
  onResize,
  onToggle,
  className
}: ResizablePanelProps) => {
  const [width, setWidth] = useState(defaultWidth);
  const [isDragging, setIsDragging] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragStartXRef = useRef<number>(0);
  const initialWidthRef = useRef<number>(0);

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    initialWidthRef.current = width;
    document.body.style.cursor = 'col-resize';
  };

  useEffect(() => {
    const handleDrag = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - dragStartXRef.current;
      const newWidth = Math.max(
        minWidth,
        Math.min(maxWidth, initialWidthRef.current + deltaX)
      );
      
      setWidth(newWidth);
      onResize(newWidth);
    };

    const handleDragEnd = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleDragEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging, minWidth, maxWidth, onResize]);

  return (
    <div className="flex">
      <motion.div
        ref={panelRef}
        className={cn(
          "relative border-r border-border",
          className
        )}
        animate={{
          width: isOpen ? width : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{
          duration: 0.2,
          ease: "easeInOut"
        }}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full overflow-hidden"
            >
              {children}
              <div
                className="absolute right-0 top-0 w-1 h-full cursor-col-resize 
                           hover:bg-primary/50 transition-colors"
                onMouseDown={handleDragStart}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Always visible toggle button */}
      <div className="relative h-full">
        <button
          className="absolute top-1/2 -translate-y-1/2 
                     w-6 h-24 bg-background border border-border
                     rounded-r-md flex items-center justify-center 
                     hover:bg-accent/50 transition-colors"
          onClick={onToggle}
        >
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
    </div>
  );
}; 
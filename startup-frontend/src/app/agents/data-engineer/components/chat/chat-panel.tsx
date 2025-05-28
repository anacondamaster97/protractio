import { useState, useRef, useEffect } from 'react';
import { Command } from 'cmdk';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TypewriterEffect } from './typewriter-effect';
import { ChatMessage, FileStructure, FileReference } from '../types/index';
import { FileIcon, X } from 'lucide-react';

interface ChatPanelProps {
  files: FileStructure[];
  onSendMessage: (message: string, fileRefs: FileReference[]) => Promise<void>;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  className?: string;
}

// Add this new component for the reference button
const FileReferenceButton = ({ 
  name, 
  id, 
  onRemove 
}: { 
  name: string; 
  id: string; 
  onRemove: (id: string) => void;
}) => (
  <button
    className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 
               hover:bg-primary/20 rounded-md text-sm font-medium mx-1"
    onClick={(e) => {
      e.preventDefault();
      onRemove(id);
    }}
  >
    <FileIcon size={14} />
    {name}
    <X size={14} className="opacity-50 hover:opacity-100" />
  </button>
);

export const ChatPanel = ({ 
  files, 
  onSendMessage, 
  messages,
  setMessages,
  className 
}: ChatPanelProps) => {
  const [inputValue, setInputValue] = useState('');
  const [fileReferences, setFileReferences] = useState<FileReference[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestionAnchor, setSuggestionAnchor] = useState<{
    start: number;
    current: number;
  } | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [error, setError] = useState<string | null>(null);

  const getAllFiles = (fileStructure: FileStructure[]): FileStructure[] => {
    return fileStructure.reduce((acc: FileStructure[], item) => {
      if (item.type === 'file') {
        acc.push(item);
      }
      if (item.children) {
        acc.push(...getAllFiles(item.children));
      }
      return acc;
    }, []);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;
    setInputValue(newValue);

    // Handle @ suggestions
    if (suggestionAnchor) {
      const textAfterAnchor = newValue.slice(
        suggestionAnchor.start,
        cursorPos
      );
      
      // Close suggestions if space is typed or cursor moves before @
      if (textAfterAnchor.includes(' ') || cursorPos < suggestionAnchor.start) {
        setSuggestionAnchor(null);
      } else {
        setSuggestionAnchor({
          ...suggestionAnchor,
          current: cursorPos
        });
      }
    }

    // Open suggestions when @ is typed
    if (newValue[cursorPos - 1] === '@') {
      setSuggestionAnchor({
        start: cursorPos,
        current: cursorPos
      });
    }
  };

  const handleFileSelect = (file: FileStructure) => {
    if (!suggestionAnchor) return;

    const before = inputValue.slice(0, suggestionAnchor.start - 1); // Remove @
    const after = inputValue.slice(suggestionAnchor.current);
    const newValue = `${before}@[${file.name}]${after}`;
    
    setInputValue(newValue);
    setFileReferences(prev => [...prev, {
      path: file.path,
      name: file.name,
      displayText: `@${file.name}`,
      id: Math.random().toString(36).substr(2, 9),
    }]);
    setSuggestionAnchor(null);
    
    // Set cursor position after the inserted reference
    const newCursorPos = before.length + file.name.length + 3; // +3 for @[]
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const handleRemoveReference = (refId: string) => {
    setInputValue(prev => {
      const regex = new RegExp(`@\\[${refId}\\]`, 'g');
      return prev.replace(regex, '');
    });
    setFileReferences(prev => prev.filter(ref => ref.id !== refId));
  };

  const extractActiveReferences = (text: string): FileReference[] => {
    const regex = /@\[(.*?)\]/g;
    const matches = [...text.matchAll(regex)];
    return fileReferences.filter(ref => 
      matches.some(match => match[1] === ref.name)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        return; // Allow new line
      }
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    try {
      setIsLoading(true);
      const activeRefs = extractActiveReferences(inputValue);
      // Clean the input value - keep the brackets format
      const cleanedInput = inputValue;
      await onSendMessage(cleanedInput, activeRefs);
      setInputValue('');
      setFileReferences([]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error sending message');
    } finally {
      setIsLoading(false);
    }
  };

  // Add this new function to render the input content with buttons
  const renderInputContent = () => {
    const regex = /@\[(.*?)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(inputValue)) !== null) {
      // Add text before the reference
      if (match.index > lastIndex) {
        parts.push(inputValue.slice(lastIndex, match.index));
      }

      // Add the styled reference
      parts.push(
        <span
          key={match.index}
          className="inline-flex items-center gap-1.5 text-blue-500 font-semibold"
        >
          <FileIcon size={14} />
          {match[1]} <br />
        </span>
      );

      lastIndex = regex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < inputValue.length) {
      parts.push(inputValue.slice(lastIndex));
    }

    return parts;
  };

  const renderMessage = (message: ChatMessage) => {
    if (!message) return null;

    return (
      <div
        key={message.id}
        className={cn(
          "mb-4 p-3 rounded-lg",
          message.role === 'user' 
            ? "bg-primary/10 ml-8" 
            : "bg-muted mr-8"
        )}
      >
        <div className="text-sm text-muted-foreground mb-1">
          {message.role === 'user' ? 'You' : 'Assistant'}
        </div>
        <div className="prose dark:prose-invert">
          {message.role === 'system' && message.isTyping ? (
            <TypewriterEffect 
              content={message.content}
              onComplete={() => {
                setMessages(prev => 
                  prev.map(m => 
                    m.id === message.id 
                      ? { ...m, isTyping: false }
                      : m
                  )
                );
              }}
            />
          ) : (
            message.content
          )}
        </div>
        {message.fileReferences && message.fileReferences.length > 0 && (
          <div className="mt-2 text-sm text-muted-foreground">
            Referenced files: {message.fileReferences.map(ref => ref.name).join(', ')}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Pipeline Assistant</h2>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        {messages.map(renderMessage)}
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-border relative">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (@ to reference files)"
            className="w-full min-h-[80px] max-h-[200px] p-2 rounded-md border 
                       border-input resize-none focus:outline-none focus:ring-2 
                       focus:ring-primary bg-transparent text-transparent 
                       caret-gray-500 selection:bg-gray-200"
            rows={3}
            disabled={isLoading}
          />
          <div 
            className="absolute inset-0 p-2 pointer-events-none whitespace-pre-wrap 
                       break-words text-foreground"
            style={{ 
              fontFamily: 'inherit',
              fontSize: 'inherit',
              lineHeight: 'inherit',
            }}
          >
            {/* {!inputValue && (
              <span className="text-muted-foreground">
                Type your message... (@ to reference files)
              </span>
            )} */}
            {renderInputContent()}
          </div>
        </div>
        
        {suggestionAnchor && (
          <div className="absolute bottom-full mb-2 w-64 max-h-48 overflow-y-auto
                         bg-popover border border-border rounded-md shadow-lg">
            {getAllFiles(files)
              .filter(file => file.type === 'file')
              .map((file) => (
                <button
                  key={file.path}
                  className="w-full px-4 py-2 text-left hover:bg-accent 
                             flex items-center gap-2 group"
                  onClick={() => handleFileSelect(file)}
                >
                  <FileIcon size={14} />
                  <span className="truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto 
                                 opacity-0 group-hover:opacity-100">
                    {file.path}
                  </span>
                </button>
              ))}
          </div>
        )}

        <div className="mt-2 flex justify-end">
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputValue.trim() || isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </div>
    </div>
  );
}; 
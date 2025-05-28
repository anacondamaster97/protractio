import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { 
  ChevronRight, 
  ChevronDown, 
  FileIcon, 
  FolderIcon 
} from 'lucide-react';
import { FileStructure } from '../types';

interface FileExplorerProps {
  files: FileStructure[];
  onFileSelect: (file: FileStructure) => void;
  selectedFile?: string | null;
  className?: string;
}

export const FileExplorer = ({ 
  files, 
  onFileSelect, 
  selectedFile,
  className 
}: FileExplorerProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const toggleFolder = (path: string) => {
    try {
      const newExpanded = new Set(expandedFolders);
      if (newExpanded.has(path)) {
        newExpanded.delete(path);
      } else {
        newExpanded.add(path);
      }
      setExpandedFolders(newExpanded);
      setError(null);
    } catch (err) {
      setError('Error toggling folder');
      console.error('Error toggling folder:', err);
    }
  };

  const renderItem = (item: FileStructure, depth: number = 0) => {
    const isFolder = item.type === 'folder';
    const isExpanded = expandedFolders.has(item.path);
    const isSelected = item.path === selectedFile;

    return (
      <div key={item.path}>
        <div
          className={cn(
            "flex items-center py-1.5 px-2 text-sm select-none",
            "hover:bg-accent/50 rounded-sm cursor-pointer",
            isSelected && "bg-accent",
            "transition-colors duration-100"
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => {
            if (isFolder) {
              toggleFolder(item.path);
            } else {
              onFileSelect(item);
            }
          }}
        >
          <div className="w-4 h-4 mr-2">
            {isFolder ? (
              isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
            ) : (
              <FileIcon size={16} />
            )}
          </div>
          <span className="truncate">{item.name}</span>
        </div>
        
        {isFolder && isExpanded && item.children && (
          <div>
            {item.children.map(child => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 font-medium border-b border-border pt-5">Files</div>
      
      <ScrollArea className="flex-1">
        <div className="p-4">
          {files.map(file => renderItem(file))}
        </div>
      </ScrollArea>
    </div>
  );
}; 
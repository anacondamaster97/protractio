/**
 * File System Types
 */
export interface FileStructure {
  name: string;
  type: 'file' | 'folder';
  path: string;
  content?: string;
  children?: FileStructure[];
}

/**
 * Chat Types
 */
export interface FileReference {
  path: string;          // Full path to the file
  name: string;          // File name for display
  displayText: string;   // How it appears in chat (e.g., "@filename")
  startLine?: number;    // Optional line reference
  endLine?: number;      // Optional line reference
  id?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'system';
  content: string;
  timestamp: Date;
  fileReferences?: FileReference[];
  isTyping?: boolean;
}

export interface ChatState {
  messages: ChatMessage[];
  pendingMessage: string;
  isProcessing: boolean;
}

/**
 * UI State Types
 */
export interface PanelState {
  isOpen: boolean;
  width: number;
}

/**
 * Component Props Types
 */
export interface ChatPanelProps {
  files: FileStructure[];
  onSendMessage: (message: string, fileRefs: FileReference[]) => Promise<void>;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  className?: string;
}

export interface FileExplorerProps {
  files: FileStructure[];
  onFileSelect: (file: FileStructure) => void;
  selectedFile?: string | null;
  className?: string;
}

export interface ResizablePanelProps {
  children: React.ReactNode;
  isOpen: boolean;
  minWidth: number;
  maxWidth: number;
  defaultWidth: number;
  onResize: (width: number) => void;
  onToggle: () => void;
  className?: string;
} 

export interface DataSource {
  label: string;
  value: string;
}
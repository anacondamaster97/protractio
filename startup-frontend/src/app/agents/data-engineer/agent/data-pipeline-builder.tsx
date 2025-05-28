import { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { cn } from '@/lib/utils';
import { ChatPanel } from '../components/chat/chat-panel';
import { Button } from '@/components/ui/button';
import { Save, Play, Settings, Database, DatabaseBackup } from 'lucide-react';
import { FileExplorer } from '../components/file-explorer/file-explorer';
import { 
  FileStructure, 
  FileReference, 
  ChatMessage, 
  PanelState,
  DataSource
} from '../components/types';
import { ResizablePanel } from '../components/resizable-panel/resizable-panel';
import { useParams, useLocation, useNavigate } from 'react-router';
import AuthToken from "@/auth/auth-token";
import axios from "axios";
import { Select, SelectContent, SelectGroup,SelectLabel,  SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DataPipelineBuilderProps {
  initialFiles?: FileStructure[];
}

const initialFileStructure: FileStructure[] = [
    
  {
    name: 'Pipeline',
    type: 'folder',
    path: '/Pipeline',
    children: [
      
      {
        name: 'main.py',
        type: 'file',
        path: '/Pipeline/main.py',
        content: '# Main pipeline file'
      },
      {
        name: 'helpers.py',
        type: 'file',
        path: '/Pipeline/helpers.py',
        content: '# Helper functions'
      }
    ]
  }
];

const DataPipelineBuilder = ({ initialFiles = [] }: DataPipelineBuilderProps) => {
  // Panel States
  const { id } = useParams();
  const navigate = useNavigate();
  const { pipelineName, selectedSource, dataSources } = useLocation().state as {
    pipelineName: string;
    selectedSource: string;
    dataSources: DataSource[];
  };
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [targetSource, setTargetSource] = useState<string>("")
  const [chatPanel, setChatPanel] = useState<PanelState>({ 
    isOpen: true, 
    width: 320 
  });
  const [filePanel, setFilePanel] = useState<PanelState>({ 
    isOpen: true, 
    width: 240 
  });
  const [editorPanel, setEditorPanel] = useState<PanelState>({ 
    isOpen: true, 
    width: 0  // Calculated based on remaining space
  });
  
  // Content States
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [files, setFiles] = useState<FileStructure[]>(initialFiles.length > 0 
    ? initialFiles 
    : initialFileStructure
  );
  const [selectedFile, setSelectedFile] = useState<string | null>(
    files[0]?.path || null
  );
  const [error, setError] = useState<string | null>(null);
  const [currentFileContent, setCurrentFileContent] = useState<string>('');

  // Helper function to find file content
  const findFileContent = (files: FileStructure[], path: string): string | null => {
    for (const file of files) {
      if (file.path === path) {
        return file.content || '';
      }
      if (file.children) {
        const content = findFileContent(file.children, path);
        if (content !== null) return content;
      }
    }
    return null;
  };

  const handleSendMessage = async (content: string, fileRefs: FileReference[]) => {
    try {
      // Add user message
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date(),
        fileReferences: fileRefs
      };
      
      setMessages(prev => [...prev, userMessage]);
      setError(null);

      const response = await backendCall(userMessage, content, fileRefs);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error sending message:', err);
    }
  };

  const handleFileSelect = (file: FileStructure) => {
    try {
      if (file.type === 'file') {
        setSelectedFile(file.path);
        const content = findFileContent(files, file.path);
        setCurrentFileContent(content || '');
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error selecting file');
      console.error('Error selecting file:', err);
    }
  };

  // Handle editor content changes
  const handleEditorChange = (value: string | undefined) => {
    if (!selectedFile || !value) return;
    
    setFiles(prevFiles => {
      const updateFileContent = (files: FileStructure[]): FileStructure[] => {
        return files.map(file => {
          if (file.path === selectedFile) {
            return { ...file, content: value };
          }
          if (file.children) {
            return {
              ...file,
              children: updateFileContent(file.children)
            };
          }
          return file;
        });
      };
      
      return updateFileContent(prevFiles);
    });
    
    setCurrentFileContent(value);
  };

  // Temporary simulation of backend call
  const backendCall = async (userMessage: ChatMessage, content: string, fileRefs: FileReference[]) => {
    // Simulate network delay

    
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
        const token = await AuthToken({setError, setIsLoading});
        if (!token) {
            return;
        }
        const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/data-engineering/agent/chat`,
        { 
            messages, 
            pipelineName, 
            selectedSource,
            targetSource,
            userMessage,
            content,
            fileRefs,
            files
        },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }
        
      );
      if (!response.data?.updatedFiles && !response.data?.systemMessage) {
        throw new Error("No response from backend");
      }
      const systemMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: response.data?.content,
        timestamp: new Date(),
        isTyping: true
      };
      setMessages(prev => [...prev, systemMessage]);
      setSelectedFile(null);
      setCurrentFileContent('');
      // Update file structure if needed
      if (response.data?.updatedFiles) {
        setFiles(response.data.updatedFiles);
      }
    } catch (error) {
      console.error("Error submitting pipeline:", error);
    }
    
    
  };

  const TargetSourceComponent = () => {
    return (
      <div>
        <Select value={targetSource} onValueChange={(value) => setTargetSource(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Target Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Data Sources</SelectLabel>
              {dataSources.map((source) => (
                <SelectItem key={source.value} value={source.value}>
                  {source.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    );
  };

  const submitPipeline = async () => {
    try {
        if (messages && pipelineName && selectedSource && dataSources && targetSource) {
            const token = await AuthToken({setError, setIsLoading});
            if (!token) {
                return;
            }
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/data-engineering/agent/chat/submit`,
                { 
                    messages, 
                    pipelineName, 
                    selectedSource,
                    dataSources,
                    targetSource,
                    files
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            navigate("/app/agents/data-engineering");
        } else {
            setError("Please fill in all fields");
        }

    } catch (error) {
        console.error("Error submitting pipeline:", error);
        setError("Error submitting pipeline. Please try again.");
    }
  }

  if (!id || !pipelineName || !selectedSource || !dataSources) {
    navigate("/app/agents/data-engineering");
  }

  return (
    <div className="flex flex-col max-w-screen h-screen max-h-[90vh] overflow-hidden bg-background border border-border">
      {/* Error Banner */}
      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-2 text-sm">
          {error}
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-2" 
            onClick={() => setError(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Toolbar */}
      <div className="h-12 min-h-[48px] border-b border-border flex items-center px-4 gap-2">
        <Button variant="outline" className="text-md font-semibold mr-4 px-4 py-1 rounded-md text-black">
            <Database className="w-4 h-4 mr-2" />
            Pipeline: {pipelineName}
        </Button>
        <Button variant="outline" className="text-md font-semibold mr-4 px-4 py-1 rounded-md text-black">
            <DatabaseBackup className="w-4 h-4 mr-2" />
            Data Source: {selectedSource}
        </Button>
        
        <TargetSourceComponent />
        <div className="flex-1" />
        <div className="flex flex-row">
        <Button size="sm" variant="ghost" className="text-blue-500">
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button size="sm" variant="ghost" className="text-green-500 justify-right" onClick={submitPipeline}>
          <Play className="w-4 h-4 mr-2 text-green-500" />
          Run Pipeline
        </Button>
        
        <Button size="sm" variant="ghost">
          <Settings className="w-4 h-4" />
        </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 min-h-0">
        {/* Resizable Panels */}
        <ResizablePanel
          isOpen={chatPanel.isOpen}
          minWidth={320}
          maxWidth={600}
          defaultWidth={chatPanel.width}
          onResize={(width) => setChatPanel(prev => ({ ...prev, width }))}
          onToggle={() => setChatPanel(prev => ({ ...prev, isOpen: !prev.isOpen }))}
        >
          <ChatPanel
            files={files}
            onSendMessage={handleSendMessage}
            messages={messages}
            setMessages={setMessages}
          />
        </ResizablePanel>

        <ResizablePanel
          isOpen={filePanel.isOpen}
          minWidth={240}
          maxWidth={400}
          defaultWidth={filePanel.width}
          onResize={(width) => setFilePanel(prev => ({ ...prev, width }))}
          onToggle={() => setFilePanel(prev => ({ ...prev, isOpen: !prev.isOpen }))}
        >
          <FileExplorer
            files={files}
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
          />
        </ResizablePanel>

        {/* Editor Panel */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* File Header */}
          <div className="h-10 min-h-[40px] border-b border-border px-4 
                          flex items-center bg-muted/50">
            <span className="text-sm font-medium">
              {selectedFile ? selectedFile.replace(/^\//, '') : 'No file selected'}
            </span>
          </div>
          
          {/* Editor */}
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="python"
              theme="vs-dark"
              value={currentFileContent}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPipelineBuilder;

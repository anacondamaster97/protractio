import React, { useState, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { sql } from '@codemirror/lang-sql';
import { draculaInit } from '@uiw/codemirror-theme-dracula';
import { Button } from "@/components/ui/button" // Import Shadcn Button
import { Input } from "@/components/ui/input"   // Import Shadcn Input
import { Switch } from "@/components/ui/switch" // Import Shadcn Switch
import { supabase } from '@/supabaseClient';
import { material, materialLight } from '@uiw/codemirror-theme-material'; // Import oneDark theme
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import * as Babel from '@babel/standalone';
import { ESLint } from "eslint";
import { linter, Diagnostic } from "@codemirror/lint";
import { EditorView } from "codemirror";
import '@/App.css'; // Import your stylesheet




interface CodingEditorPageProps {
    code: string;
    isDarkTheme: boolean; // Receive the theme selection as a prop
    language?: string;
}
  
export const CodingEditorPage: React.FC<CodingEditorPageProps> = ({ code, isDarkTheme, language }) => {
    
    const [typedCode, setTypedCode] = useState<string>('');

    const getLanguage = (language: string) => {
        if (language === 'sql') {
            return sql();
        } else if (language === 'javascript') {
            return javascript();
        } else if (language === 'python') {
            return python();
        }
        return python();
    }
    
    useEffect(() => {
      setTypedCode(''); // Clear the code on each new render
      
      let currentIndex = 0;
      const chunkSize = 5; // Number of characters to add per frame
      
      const animate = () => {
        if (currentIndex < code.length) {
          const nextIndex = Math.min(currentIndex + chunkSize, code.length);
          setTypedCode(code.slice(0, nextIndex));
          currentIndex = nextIndex;
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
      
      return () => {
        currentIndex = code.length; // Stop animation on cleanup
      };
    }, [code]);
  
    return (
      <div className="">
        <CodeMirror
          value={typedCode}
          className="CodeMirror"
          extensions={[getLanguage(language || 'python')]}
          theme={isDarkTheme ? tokyoNight : materialLight}
          editable={false}
        />
      </div>
    );
};

interface StringRendererProps {
    componentString: string;
  }
  
const StringRenderer: React.FC<StringRendererProps> = ({ componentString }) => {
    const [Component, setComponent] = useState<React.ComponentType | null>(null);
  
    useEffect(() => {
      const renderComponent = async () => {
        try {
          // Transform JSX to regular JS
          const transformedCode = Babel.transform(componentString, {
            presets: ['react'],
          }).code;
  
          // Function to create the component (using a safer approach)
          const createComponent = new Function('React', `return ${transformedCode}`);
  
          // Create and set the component
          const NewComponent = createComponent(React);
          setComponent(() => NewComponent);
        } catch (error) {
          console.error('Error rendering component:', error);
          // Handle error appropriately (e.g., display an error message)
        }
      };
      
      renderComponent();
    }, [componentString]);
  
    if (!Component) {
        console.log('error')
        return <div>Loading...</div>; // Or an error message
    }
  
    return eval(componentString);
};

interface CodeEditorProps {
  apiUrl: string;
}

const CodeEditor = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(true); // State for theme


  const handlePromptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setCode(''); // Clear previous code
    const { data: { session } } = await supabase.auth.getSession();
      
    if (!session) {
        setError('No active session found');
        setIsLoading(false);
        return;
    }
    try {
       const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/agents`,
        { prompt: prompt }, // Request body
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`, // Authorization header
          },
        }
      );
      // Assuming your API responds with { code: "generated code here" }
      console.log(response.data.code);
      typeApiResponse("\n " + response.data.code);
    } catch (error) {
      console.error("Error fetching code:", error);
      setCode("Error generating code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const typeApiResponse = (fullCode: string) => {
      setCode(fullCode); // Set the full code
  }

  const handleThemeToggle = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center space-x-4 mb-4">
        <Input
          type="text"
          placeholder="Enter your code generation prompt..."
          value={prompt}
          onChange={handlePromptChange}
          className="flex-1"
        />
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Code'}
        </Button>
        {/* Theme Toggle */}
        <div className="flex items-center space-x-2">
          <Switch id="theme-toggle" checked={isDarkTheme} onCheckedChange={handleThemeToggle} />
          <label htmlFor="theme-toggle" className="text-sm font-medium">
            {isDarkTheme ? 'Dark' : 'Light'}
          </label>
        </div>
      </div>

      <div className="flex flex-row space-x-2 rounded-lg border">
        {/* Pass the selected theme to TypewriterEffect */}
        <div className='w-1/4'>
          <StringRenderer componentString={code} />
        </div>
        <div className='w-3/4'>
          <CodingEditorPage code={code} isDarkTheme={isDarkTheme} />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
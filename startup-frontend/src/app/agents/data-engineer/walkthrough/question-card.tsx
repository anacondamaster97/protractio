import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CodingEditorPage } from "@/app/example/coder";
import { supabase } from "@/supabaseClient";
import axios from "axios";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton"

interface QuestionCardProps {
  question: string;
  onAnswer: (answer: string) => void;
  onBack?: () => void;
}

export function QuestionCard({ question, onAnswer, onBack }: QuestionCardProps) {
  const [answer, setAnswer] = useState("");
  const [prompt, setPrompt] = useState("");
  const [apiResponse, setApiResponse] = useState<string>(""); // State to store API response
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(true); // State for theme

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(event.target.value);
  };


  const getApiResponse = async () => {
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
        `${import.meta.env.VITE_API_URL}/data-engineering/agent`,
        { user_prompt: prompt }, // Request body
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`, // Authorization header
          },
        }
      );
      // Assuming your API responds with { code: "generated code here" }
      console.log(response.data.code_blocks);
      typeApiResponse("\n " + response.data.code_blocks);
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
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full flex items-center justify-center relative"
    >
      <Card className="w-screen min-h-screen shadow-lg h-full">
      <CardHeader>
          <CardTitle>{question}</CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <div className="flex flex-row gap-4 h-3/4 w-full">
            <div className="flex flex-col space-y-4 h-full w-1/2">
              <div className="flex flex-col space-y-4">
                <label htmlFor="input" className="block mb-2">Prompt</label>
                <Textarea id="input" value={prompt} onChange={handleInputChange} className="h-full" />
              </div>
              <div>
                <label htmlFor="instructions" className="block mb-2">Instructions</label>
                <Textarea id="instructions" value="Fix the grammar." readOnly />
              </div>
              <Button
              className="bg-black hover:bg-zinc-800"
              onClick={() => onAnswer(apiResponse)}
              disabled={!prompt}
              >
              Continue
            </Button>
            </div>
            <div className="flex flex-col space-y-4 w-3/4 max-w-3/4">
              <div className="flex items-center justify-end space-x-2">
                {/* <Button variant="outline" size="sm">Save</Button>
                <Button variant="outline" size="sm">View code</Button> */}
                <div className="flex items-center space-x-2">
                  <Switch id="theme-toggle" checked={isDarkTheme} onCheckedChange={handleThemeToggle} />
                  <label htmlFor="theme-toggle" className="text-sm font-medium">
                    {isDarkTheme ? 'Dark' : 'Light'}
                  </label>
                </div>
                <Button variant="outline" size="sm"
                  className="bg-black text-white hover:bg-zinc-800" onClick={getApiResponse}>Get response</Button>
              </div>
              {/* Placeholder for API response */}
              <div className="border rounded-md p-4 h-full max-w-full w-full">
                {code ? <CodingEditorPage code={code} isDarkTheme={isDarkTheme} /> :
                <Skeleton className="h-full w-full" />
                }
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

{/* <Card className="w-screen h-screen shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-black">{question}</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Enter your answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full"
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
          )}
          <Button
            className="bg-black hover:bg-zinc-800"
            onClick={() => onAnswer(answer)}
            disabled={!answer}
          >
            Continue
          </Button>
        </CardFooter>
      </Card> */}
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { CodingEditorPage } from "@/app/example/coder";
import { supabase } from "@/supabaseClient";
import axios from "axios";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton"
import { useLocation } from "react-router";
import { useParams, useNavigate } from "react-router";
import AuthToken from "@/auth/auth-token";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface LLMConversation {
    role: string;
    content: string;
}

interface DataSource {
  label: string;
  value: string;
}

function DataEngineeringAgentBuildPage() {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState("");
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState<LLMConversation[]>([]);
  const [apiResponse, setApiResponse] = useState<string>(""); // State to store API response
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(true); // State for theme
  const { id } = useParams();
  const { pipelineName, selectedSource, dataSources } = useLocation().state as {
    pipelineName: string;
    selectedSource: string;
    dataSources: DataSource[];
  };
  const [open, setOpen] = useState(false)
  const [targetSource, setTargetSource] = useState<string>("")

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(event.target.value);
  };

  const submitPipeline = async () => {
    try {
        if (code && prompt && id && pipelineName && selectedSource && targetSource) {
            const token = await AuthToken({setError, setIsLoading});
            if (!token) {
                return;
            }
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/data-engineering/agent/submit`,
                { 
                    code, 
                    prompt, 
                    id, 
                    pipelineName, 
                    selectedSource,
                    targetSource 
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

  const getApiResponse = async () => {
    setIsLoading(true);
    setHistory([...history, { role: "user", content: prompt }]);
    if (code) {
        setHistory([...history, { role: "assistant", content: code }]);
    }
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

  if (!id) {
    navigate("/app/agents/data-engineering");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "-100%", opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full h-full flex justify-center"
      >
        <Card className="w-full max-w-8xl m-4 shadow-lg">
          <CardHeader>
            <CardTitle>{pipelineName}</CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <div className="flex flex-row gap-4 h-3/4 w-full">
              <div className="flex flex-col space-y-4 h-full w-1/2">
                <div className="flex flex-col space-y-4">
                  <label htmlFor="input" className="block mb-2">Prompt</label>
                  <Textarea id="input" value={prompt} onChange={handleInputChange} className="h-full" />
                </div>
                <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Select your target data source
            </label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full text-md justify-between border-zinc-200 dark:border-zinc-700 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  {targetSource
                    ? dataSources.find((source) => source.value === targetSource)?.label
                    : "Choose source..."}
                  <ChevronsUpDown className="w-4 h-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 border-zinc-200 dark:border-zinc-700 rounded-xl">
                <Command>
                  <CommandInput placeholder="Search sources..." className="h-11" />
                  <CommandList>
                    <CommandEmpty>No source found.</CommandEmpty>
                    <CommandGroup>
                      {dataSources.map((source) => (
                        <CommandItem
                          key={source.value}
                          value={source.value}
                          onSelect={(currentValue) => {
                            setTargetSource(currentValue === targetSource ? "" : currentValue)
                            setOpen(false)
                          }}
                          className="text-base py-3 cursor-pointer"
                        >
                          {source.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              targetSource === source.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                </div>
                <div>
                  <label htmlFor="instructions" className="block mb-2">Instructions</label>
                  <Textarea id="instructions" value="Fix the grammar." readOnly />
                </div>
                <Button
                  className="bg-black hover:bg-zinc-800"
                  onClick={() => submitPipeline()}
                  disabled={!prompt || !targetSource || !code || !id || !pipelineName || !selectedSource}
                >
                  Run pipeline
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
                    className="bg-black text-white hover:bg-zinc-800" onClick={getApiResponse} disabled={!prompt || !targetSource}>Get response</Button>
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
    </div>
  );
}

export default DataEngineeringAgentBuildPage;
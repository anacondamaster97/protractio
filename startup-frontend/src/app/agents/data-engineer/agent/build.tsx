import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Particles } from "@/components/ui/particles";
import { useNavigate } from "react-router";
import { v4 as uuidv4 } from "uuid";

const dataSources = [
  { value: "aws-rds", label: "AWS RDS" },
  { value: "snowflake", label: "Snowflake" },
  { value: "mongodb-atlas", label: "MongoDB Atlas" },
  { value: "postgresql", label: "PostgreSQL" },
];

export default function DataEngineeringAgentBuild() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [pipelineName, setPipelineName] = useState("");
  const [selectedSource, setSelectedSource] = useState("");

  const handleSubmit = () => {
    const uuid = uuidv4();
    if (pipelineName && selectedSource) {
      navigate(`/app/agents/data-engineering/build/${uuid}`, {
        state: {
          pipelineName,
          selectedSource,
          dataSources
        }
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-900 p-4">
      <Particles
        className="absolute inset-0"
        quantity={2000}
        ease={80}
        color={"#000000"}
        refresh
      />
      <Card className="w-full max-w-md border p-8 mb-8 shadow-none relative z-10">
        <CardHeader className="space-y-2 pb-8">
          <CardTitle className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Build Your Pipeline
          </CardTitle>
          <p className="text-base text-zinc-500 dark:text-zinc-400">
            Create a new data pipeline in minutes
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Give your pipeline a name
            </label>
            <Input
              placeholder="e.g., Production Analytics"
              value={pipelineName}
              onChange={(e) => setPipelineName(e.target.value)}
              className="h-12 text-lg border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 dark:focus:ring-offset-zinc-900 transition-all duration-200"
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Select your data source
            </label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full h-12 text-lg justify-between border-zinc-200 dark:border-zinc-700 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  {selectedSource
                    ? dataSources.find((source) => source.value === selectedSource)?.label
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
                            setSelectedSource(currentValue === selectedSource ? "" : currentValue)
                            setOpen(false)
                          }}
                          className="text-base py-3 cursor-pointer"
                        >
                          {source.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              selectedSource === source.value ? "opacity-100" : "opacity-0"
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
          <Button
            className="w-full h-12 text-lg font-medium bg-black hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black rounded-xl transition-all duration-200"
            onClick={handleSubmit}
            disabled={!pipelineName || !selectedSource}
          >
            Create Pipeline
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
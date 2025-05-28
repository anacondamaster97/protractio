import { MoveRight, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function CTA() {
  return (
    <div className="w-full">
      <div className="mx-auto">
        <div className="flex flex-col text-center bg-muted rounded-md p-4 lg:p-14 gap-8 items-center">
          <div>
            <Badge>AI-Powered Workflow</Badge>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
              Supercharge Your Team with AI Agents
            </h3>
            <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl">
              Transform how your marketing, data, and sales teams work. Our AI agents 
              automate repetitive tasks, analyze complex datasets, and generate 
              powerful insights - helping you focus on strategy and growth. Perfect 
              for teams looking to 10x their productivity.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <Button className="gap-4" variant="outline">
              Watch demo <PhoneCall className="w-4 h-4" />
            </Button>
            <Button className="gap-4">
              Start free trial <MoveRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { CTA };

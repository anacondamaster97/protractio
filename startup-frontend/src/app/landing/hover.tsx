import React from "react";
import { EvervaultCard, Icon } from "@/components/ui/evervault-card";

export function EvervaultCardDemo() {
  return (
    <div>
        <div className="flex flex-col justify-center items-center pt-24">
        <h1 className="text-6xl font-medium dark:text-white text-black mb-4">
          Orchestrate Autonomous Agent Networks
        </h1>
        <p className="text-sm dark:text-white/70 text-black/70 mb-16">
          Deploy intelligent multi-agent systems powered by LLMs for distributed data analysis and task automation.
        </p>
      </div>
    <div className="border border-black/[0.2] dark:border-white/[0.2] flex flex-col items-start max-w-sm mx-auto p-4 relative h-[30rem]">
      <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

      

      <EvervaultCard text="Autonomous Agents" />

      <h2 className="dark:text-white text-black mt-4 text-sm font-light">
        Leverage GenAI to create autonomous agent swarms that can process, analyze, and extract insights from complex datasets.
      </h2>
    </div>
    </div>
  );
}

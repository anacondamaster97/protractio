// components/InstructionHover.tsx

'use client';

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

interface SubItem {
  id?: number;
  title: string;
  instructions?: string;
}

interface InstructionHoverProps {
  subItem: SubItem;
  instructionMode: boolean;
}

export default function InstructionHover({ subItem, instructionMode }: InstructionHoverProps) {
  return (
    <HoverCard>
      <HoverCardTrigger className="">
        <span>{subItem.title}</span>
      </HoverCardTrigger>
      {instructionMode && (
        <HoverCardContent className="w-80 absolute top-0 left-0">
          {subItem.instructions}
        </HoverCardContent>
      )}
    </HoverCard>
  );
}
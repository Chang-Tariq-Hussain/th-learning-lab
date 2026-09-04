"use client";

import { useState } from "react";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HintPanelProps {
  hints: string[];
}

/** Progressive hints revealed one at a time, same pattern used by Reaction Kinetics' Challenge level and every GLE Challenge scenario. */
export function HintPanel({ hints }: HintPanelProps) {
  const [revealed, setRevealed] = useState(0);

  return (
    <div className="flex flex-col items-center gap-3">
      {hints.slice(0, revealed).map((hint, i) => (
        <p
          key={i}
          className="max-w-xl rounded-card border border-line bg-white/50 px-4 py-2.5 text-sm leading-relaxed text-ink-soft dark:border-line-dark dark:bg-white/[0.03] dark:text-bone-soft"
        >
          <span className="font-medium text-ink dark:text-bone">Hint {i + 1}: </span>
          {hint}
        </p>
      ))}

      {revealed < hints.length ? (
        <Button variant="ghost" size="sm" onClick={() => setRevealed((r) => r + 1)}>
          <Lightbulb className="h-3.5 w-3.5" strokeWidth={1.75} />
          {revealed === 0 ? "Show a hint" : "Show another hint"}
        </Button>
      ) : null}
    </div>
  );
}

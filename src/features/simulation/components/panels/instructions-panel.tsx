"use client";

import { useState } from "react";
import { ChevronDown, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InstructionsPanelProps {
  title?: string;
  steps: string[];
  defaultOpen?: boolean;
  className?: string;
}

/**
 * A short, collapsible "how to use this simulation" panel. Steps are
 * plain strings rendered as an ordered list — no markdown parsing, so
 * copy stays simple to write and predictable to read.
 */
export function InstructionsPanel({
  title = "How to use this simulation",
  steps,
  defaultOpen = true,
  className,
}: InstructionsPanelProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section
      className={cn(
        "rounded-card border border-dashed border-pine-500/40 bg-pine-50 dark:border-pine-300/25 dark:bg-pine-900/20",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 p-4 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-pine-700 dark:text-pine-100">
          <Lightbulb className="h-4 w-4" strokeWidth={1.75} />
          {title}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-pine-600 transition-transform dark:text-pine-200",
            open && "rotate-180"
          )}
          strokeWidth={1.75}
        />
      </button>
      {open ? (
        <ol className="flex flex-col gap-2 px-4 pb-4 pl-11 text-sm leading-relaxed text-pine-900 dark:text-pine-50 [list-style:decimal]">
          {steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}

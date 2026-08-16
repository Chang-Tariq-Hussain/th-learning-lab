"use client";

import { Eye, EyeOff, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ControlsProps {
  onReset: () => void;
  showGuides: boolean;
  onToggleGuides: () => void;
}

export function Controls({ onReset, showGuides, onToggleGuides }: ControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <Button variant="ghost" size="lg" onClick={onReset}>
        <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
        Reset Point
      </Button>
      <button
        type="button"
        onClick={onToggleGuides}
        aria-pressed={showGuides}
        className={cn(
          "flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
          showGuides
            ? "border-pine-500 bg-pine-600 text-paper dark:border-pine-300 dark:bg-pine-300 dark:text-chalkboard"
            : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone"
        )}
      >
        {showGuides ? <Eye className="h-4 w-4" strokeWidth={1.75} /> : <EyeOff className="h-4 w-4" strokeWidth={1.75} />}
        Show Coordinates
      </button>
    </div>
  );
}

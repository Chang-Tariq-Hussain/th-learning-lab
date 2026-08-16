"use client";

import { Maximize, Minimize } from "lucide-react";
import { useSimulationSurface } from "../../context/surface-context";
import { cn } from "@/lib/utils";

export function FullscreenButton({ className }: { className?: string }) {
  const { isFullscreen, toggleFullscreen } = useSimulationSurface();

  return (
    <button
      type="button"
      onClick={toggleFullscreen}
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      title={isFullscreen ? "Exit fullscreen (F)" : "Fullscreen (F)"}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-ink/[0.04] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:text-bone-soft dark:hover:bg-bone/[0.06] dark:hover:text-bone",
        className
      )}
    >
      {isFullscreen ? (
        <Minimize className="h-4 w-4" strokeWidth={1.75} />
      ) : (
        <Maximize className="h-4 w-4" strokeWidth={1.75} />
      )}
    </button>
  );
}

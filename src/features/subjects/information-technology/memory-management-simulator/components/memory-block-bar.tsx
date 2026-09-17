"use client";

import { cn } from "@/lib/utils";
import { TOTAL_RAM_MB, type MemoryBlock } from "../model";

interface MemoryBlockBarProps {
  blocks: MemoryBlock[];
  /** Optional map from processId to a display color. */
  processColors?: Record<string, string>;
  selectedBlockId?: string | null;
  onSelectBlock?: (block: MemoryBlock) => void;
  /** Total width this bar represents, in MB. Defaults to full RAM. */
  totalMb?: number;
  height?: string;
}

/**
 * A single proportional horizontal bar representing a span of RAM
 * (or any block sequence) — the shared "memory map" visual reused by
 * the Memory Map Lab, Partitioning Lab, Fragmentation Lab, and
 * Allocation Strategy Lab, so every lab renders memory the same way.
 */
export function MemoryBlockBar({
  blocks,
  processColors,
  selectedBlockId,
  onSelectBlock,
  totalMb = TOTAL_RAM_MB,
  height = "h-16",
}: MemoryBlockBarProps) {
  return (
    <div
      className={cn(
        "flex w-full overflow-hidden rounded-lg border border-line dark:border-line-dark",
        height,
      )}
      role="img"
      aria-label="Memory map"
    >
      {blocks.map((block) => {
        const widthPct = (block.size / totalMb) * 100;
        const isSelected = selectedBlockId === block.id;
        const bg =
          block.status === "os"
            ? "bg-ink/70 dark:bg-bone/40"
            : block.status === "free"
              ? "bg-transparent"
              : undefined;
        const color = block.processId ? processColors?.[block.processId] : undefined;

        return (
          <button
            key={block.id}
            type="button"
            onClick={() => onSelectBlock?.(block)}
            title={`${block.status === "os" ? "Operating System" : block.status === "free" ? "Free" : block.processId} · ${block.size} MB · starts at ${block.start} MB`}
            className={cn(
              "group relative flex min-w-[2px] flex-col items-center justify-center border-r border-paper/60 text-[10px] font-mono text-paper transition-all last:border-r-0 dark:border-chalkboard/60",
              bg,
              block.status === "free" &&
                "bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.04),rgba(0,0,0,0.04)_6px,transparent_6px,transparent_12px)] text-ink-soft dark:bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.06),rgba(255,255,255,0.06)_6px,transparent_6px,transparent_12px)] dark:text-bone-soft",
              isSelected && "ring-2 ring-inset ring-subject-it",
              onSelectBlock && "cursor-pointer hover:brightness-110",
            )}
            style={{
              width: `${widthPct}%`,
              ...(color ? { backgroundColor: color } : {}),
            }}
          >
            {widthPct > 6 && (
              <span className="truncate px-1">
                {block.status === "os" ? "OS" : block.status === "free" ? "Free" : block.processId}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

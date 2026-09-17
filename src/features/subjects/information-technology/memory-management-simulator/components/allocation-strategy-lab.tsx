"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  ALLOCATION_STRATEGY_DESCRIPTIONS,
  ALLOCATION_STRATEGY_LABELS,
  OS_RESERVED_MB,
  allocate,
  analyzeFragmentation,
  type AllocationStrategy,
  type MemoryBlock,
  type SimProcess,
} from "../model";
import { MemoryBlockBar } from "./memory-block-bar";

/** The same starting free-block layout every strategy is applied to,
 *  so the comparison is fair: three free regions of different sizes
 *  (small, large, medium) with one already-allocated process between
 *  them, mirroring a system that's been running a while. */
function buildStartingBlocks(): MemoryBlock[] {
  return [
    { id: "os", start: 0, size: OS_RESERVED_MB, status: "os" },
    { id: "free-small", start: OS_RESERVED_MB, size: 60, status: "free" },
    { id: "existing", start: OS_RESERVED_MB + 60, size: 100, status: "allocated", processId: "Existing App" },
    { id: "free-large", start: OS_RESERVED_MB + 160, size: 400, status: "free" },
    { id: "free-medium", start: OS_RESERVED_MB + 560, size: 190, status: "free" },
  ];
}

const REQUEST: SimProcess = { id: "new-request", name: "New Process", size: 100, color: "#dc2626" };

/**
 * Runs the same request (100 MB) against the same starting layout
 * under all three strategies at once, side by side, so the student
 * can directly compare which free block each strategy picks and what
 * it leaves behind — without claiming any one strategy is
 * universally best.
 */
export function AllocationStrategyLab() {
  const [selected, setSelected] = useState<AllocationStrategy>("first-fit");

  const results = useMemo(() => {
    const starting = buildStartingBlocks();
    const out: Record<AllocationStrategy, { blocks: MemoryBlock[]; fragmentation: ReturnType<typeof analyzeFragmentation> }> = {} as never;
    (Object.keys(ALLOCATION_STRATEGY_LABELS) as AllocationStrategy[]).forEach((strategy) => {
      const allocated = allocate(starting.map((b) => ({ ...b })), REQUEST, strategy) ?? starting;
      out[strategy] = { blocks: allocated, fragmentation: analyzeFragmentation(allocated) };
    });
    return out;
  }, []);

  const processColors = { "Existing App": "#64748b", "New Process": REQUEST.color };

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-ink-soft dark:text-bone-soft">
        Starting from the same memory layout — one existing process and three free regions of different sizes — a <strong className="text-ink dark:text-bone">{REQUEST.size} MB</strong> request is allocated three different ways below. Select a strategy to see it highlighted, and compare all three.
      </p>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Allocation strategy">
        {(Object.keys(ALLOCATION_STRATEGY_LABELS) as AllocationStrategy[]).map((s) => (
          <button
            key={s}
            role="tab"
            aria-selected={selected === s}
            onClick={() => setSelected(s)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              selected === s
                ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
            )}
          >
            {ALLOCATION_STRATEGY_LABELS[s]}
          </button>
        ))}
      </div>
      <p className="text-sm text-ink-soft dark:text-bone-soft">{ALLOCATION_STRATEGY_DESCRIPTIONS[selected]}</p>

      <div className="flex flex-col gap-4">
        {(Object.keys(ALLOCATION_STRATEGY_LABELS) as AllocationStrategy[]).map((s) => (
          <div
            key={s}
            className={cn(
              "rounded-card border p-4 transition-colors",
              selected === s ? "border-subject-it" : "border-line dark:border-line-dark",
            )}
          >
            <p className="mb-2 text-sm font-medium text-ink dark:text-bone">{ALLOCATION_STRATEGY_LABELS[s]}</p>
            <MemoryBlockBar blocks={results[s].blocks} processColors={processColors} height="h-12" />
            <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">
              Largest remaining free block: <span className="font-mono">{results[s].fragmentation.largestFreeBlock} MB</span> across <span className="font-mono">{results[s].fragmentation.freeBlockCount}</span> free region{results[s].fragmentation.freeBlockCount === 1 ? "" : "s"}.
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-card bg-ink/[0.03] p-4 text-sm text-ink-soft dark:bg-bone/[0.05] dark:text-bone-soft">
        No single strategy is universally best: First Fit is fast to compute, Best Fit tries to minimize leftover space per allocation (but can leave many tiny unusable slivers over time), and Worst Fit tries to keep remaining free blocks large (but can waste a big region on a small request). Real operating systems choose based on trade-offs like these, not on one strategy always winning.
      </div>
    </div>
  );
}

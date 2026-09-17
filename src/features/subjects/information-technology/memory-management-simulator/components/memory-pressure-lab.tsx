"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MEMORY_PRESSURE_NOTE,
  PROCESS_COLORS,
  USABLE_RAM_MB,
  allocate,
  analyzeFragmentation,
  createInitialBlocks,
  type MemoryBlock,
} from "../model";
import { MemoryBlockBar } from "./memory-block-bar";

const PRESSURE_PROCESS_SIZE = 130;
const PRESSURE_PROCESS_NAMES = [
  "Browser Tab", "Video Call", "Spreadsheet", "Music Player", "Photo Editor",
  "Chat App", "Background Sync", "Antivirus Scan", "Game", "File Backup",
];

/**
 * Repeatedly requests a fixed-size process's worth of memory,
 * one click at a time, so the student watches available free memory
 * shrink toward zero and sees exactly what happens the moment a
 * request can no longer be satisfied — without implementing virtual
 * memory as "the fix."
 */
export function MemoryPressureLab() {
  const [blocks, setBlocks] = useState<MemoryBlock[]>(() => createInitialBlocks());
  const [count, setCount] = useState(0);
  const [failed, setFailed] = useState(false);

  const report = analyzeFragmentation(blocks);
  const usedPct = Math.round(((USABLE_RAM_MB - report.totalFree) / USABLE_RAM_MB) * 100);

  const requestMore = () => {
    if (failed) return;
    const name = PRESSURE_PROCESS_NAMES[count % PRESSURE_PROCESS_NAMES.length]!;
    const result = allocate(blocks, { id: `pressure-${count}`, name, size: PRESSURE_PROCESS_SIZE, color: PROCESS_COLORS[count % PROCESS_COLORS.length]! }, "first-fit");
    if (!result) {
      setFailed(true);
      return;
    }
    setBlocks(result);
    setCount((c) => c + 1);
  };

  const reset = () => {
    setBlocks(createInitialBlocks());
    setCount(0);
    setFailed(false);
  };

  const processColors: Record<string, string> = {};
  blocks.forEach((b, i) => { if (b.processId) processColors[b.processId] = PROCESS_COLORS[i % PROCESS_COLORS.length]!; });

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-ink-soft dark:text-bone-soft">
        Each click starts a new {PRESSURE_PROCESS_SIZE} MB process and requests memory for it. Keep going and watch what happens as free memory runs low.
      </p>

      <div className="rounded-card border border-line bg-ink/[0.02] p-4 dark:border-line-dark dark:bg-bone/[0.03]">
        <MemoryBlockBar blocks={blocks} processColors={processColors} />
      </div>

      <div className="rounded-card border border-line p-4 dark:border-line-dark">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-ink dark:text-bone">Memory used: {usedPct}%</span>
          <span className="font-mono text-ink-soft dark:text-bone-soft">{report.totalFree} MB free of {USABLE_RAM_MB} MB usable</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink/10 dark:bg-bone/10">
          <div
            className={cn("h-full rounded-full transition-all", usedPct > 85 ? "bg-rose-500" : usedPct > 60 ? "bg-amber-500" : "bg-emerald-500")}
            style={{ width: `${usedPct}%` }}
          />
        </div>
        <div className="mt-3 flex gap-2">
          <button
            onClick={requestMore}
            disabled={failed}
            className="inline-flex h-9 items-center rounded-full bg-subject-it px-4 text-sm font-medium text-paper hover:opacity-90 disabled:opacity-40"
          >
            Start process #{count + 1} ({PRESSURE_PROCESS_SIZE} MB)
          </button>
          <button
            onClick={reset}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-sm font-medium text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
        </div>
      </div>

      {failed && (
        <div className="rounded-card border border-rose-300 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          <p className="mb-1 font-medium">Request denied — not enough memory.</p>
          <p>{count} process{count === 1 ? "" : "es"} are already running, using all the memory a new {PRESSURE_PROCESS_SIZE} MB process would need. This is memory pressure.</p>
        </div>
      )}

      <p className="text-xs text-ink-soft dark:text-bone-soft">{MEMORY_PRESSURE_NOTE}</p>
    </div>
  );
}

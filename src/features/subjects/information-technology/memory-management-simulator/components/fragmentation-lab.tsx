"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { OS_RESERVED_MB, PROCESS_COLORS, analyzeFragmentation, type MemoryBlock } from "../model";
import { MemoryBlockBar } from "./memory-block-bar";

/** A hand-built starting layout that already has External
 *  Fragmentation baked in: Process A, a free gap, Process B, a free
 *  gap, Process C, then one larger free region — three separate free
 *  blocks that individually may be too small for a new request, even
 *  though their total is large enough. */
function buildScenario(): MemoryBlock[] {
  return [
    { id: "os", start: 0, size: OS_RESERVED_MB, status: "os" },
    { id: "p-a", start: OS_RESERVED_MB, size: 120, status: "allocated", processId: "Process A" },
    { id: "gap-1", start: OS_RESERVED_MB + 120, size: 40, status: "free" },
    { id: "p-b", start: OS_RESERVED_MB + 160, size: 180, status: "allocated", processId: "Process B" },
    { id: "gap-2", start: OS_RESERVED_MB + 340, size: 60, status: "free" },
    { id: "p-c", start: OS_RESERVED_MB + 400, size: 150, status: "allocated", processId: "Process C" },
    { id: "gap-3", start: OS_RESERVED_MB + 550, size: 300, status: "free" },
  ];
}

const processColors: Record<string, string> = {
  "Process A": PROCESS_COLORS[0]!,
  "Process B": PROCESS_COLORS[1]!,
  "Process C": PROCESS_COLORS[2]!,
};

export function FragmentationLab() {
  const [blocks] = useState<MemoryBlock[]>(() => buildScenario());
  const [requestSize, setRequestSize] = useState(250);

  const report = analyzeFragmentation(blocks);
  const wouldFail = report.wouldBlockRequestOfSize(requestSize);
  const wouldSucceedOutright = requestSize <= report.largestFreeBlock;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-ink-soft dark:text-bone-soft">
        Processes A, B, and C are already allocated with small gaps of free memory left between them from earlier allocations and deallocations. This is a realistic snapshot, not something you need to build yourself.
      </p>

      <div className="rounded-card border border-line bg-ink/[0.02] p-4 dark:border-line-dark dark:bg-bone/[0.03]">
        <MemoryBlockBar blocks={blocks} processColors={processColors} />
      </div>

      <div className="grid gap-4 text-sm sm:grid-cols-3">
        <div className="rounded-md border border-line p-3 dark:border-line-dark">
          <p className="text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">Total free memory</p>
          <p className="font-mono text-lg text-ink dark:text-bone">{report.totalFree} MB</p>
        </div>
        <div className="rounded-md border border-line p-3 dark:border-line-dark">
          <p className="text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">Largest single free block</p>
          <p className="font-mono text-lg text-ink dark:text-bone">{report.largestFreeBlock} MB</p>
        </div>
        <div className="rounded-md border border-line p-3 dark:border-line-dark">
          <p className="text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">Free regions</p>
          <p className="font-mono text-lg text-ink dark:text-bone">{report.freeBlockCount}</p>
        </div>
      </div>

      <div className="rounded-card border border-line p-4 dark:border-line-dark">
        <label className="flex flex-col gap-1 text-sm text-ink dark:text-bone">
          Try a new request: {requestSize} MB
          <input type="range" min={20} max={400} step={10} value={requestSize} onChange={(e) => setRequestSize(Number(e.target.value))} className="accent-subject-it" />
        </label>
        <p className={cn("mt-3 text-sm", wouldFail ? "text-rose-600 dark:text-rose-400" : wouldSucceedOutright ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")}>
          {wouldFail
            ? `Request denied: ${requestSize} MB is less than the ${report.totalFree} MB of total free memory, but no single free region is that large (the biggest is ${report.largestFreeBlock} MB). This is external fragmentation — free space exists, but it's scattered.`
            : wouldSucceedOutright
              ? `Request would succeed: the largest free region (${report.largestFreeBlock} MB) is big enough on its own.`
              : `Request denied: ${requestSize} MB is larger than all free memory combined (${report.totalFree} MB).`}
        </p>
      </div>

      <div className="rounded-card bg-ink/[0.03] p-4 text-sm text-ink-soft dark:bg-bone/[0.05] dark:text-bone-soft">
        <p className="mb-1 font-medium text-ink dark:text-bone">External fragmentation</p>
        <p>
          Total free memory can be large enough for a request even when no single free region is — because free space is split into multiple separate blocks scattered between allocated processes. This is different from internal fragmentation (see the Partitioning Lab), which wastes space <em>inside</em> a single allocated block instead.
        </p>
      </div>
    </div>
  );
}

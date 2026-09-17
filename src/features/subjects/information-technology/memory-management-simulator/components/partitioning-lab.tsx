"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  OS_RESERVED_MB,
  PROCESS_COLORS,
  createFixedPartitions,
  internalFragmentation,
  type FixedPartition,
} from "../model";
import { MemoryBlockBar } from "./memory-block-bar";

type PartitionMode = "fixed" | "variable";

const SAMPLE_REQUESTS = [
  { name: "Text Editor", size: 80 },
  { name: "Music Player", size: 150 },
  { name: "Web Browser", size: 210 },
];

/**
 * Demonstrates the difference between fixed-size and variable-size
 * partitioning using the same three sample process requests in both
 * modes — fixed partitioning visibly wastes space inside a partition
 * (internal fragmentation) whenever a process is smaller than its
 * assigned partition; variable partitioning allocates exactly the
 * size requested, so it has none.
 */
export function PartitioningLab() {
  const [mode, setMode] = useState<PartitionMode>("fixed");
  const [partitionCount, setPartitionCount] = useState(4);
  const [assignments, setAssignments] = useState<Record<string, number | null>>({});

  const partitions: FixedPartition[] = useMemo(() => createFixedPartitions(partitionCount), [partitionCount]);

  const assignProcess = (requestIndex: number, partitionIdx: number) => {
    setAssignments((a) => {
      // Free any partition this process previously occupied.
      const next = { ...a };
      Object.keys(next).forEach((k) => {
        if (next[k] === requestIndex) next[k] = null;
      });
      next[String(partitionIdx)] = requestIndex;
      return next;
    });
  };

  const fixedBlocks = partitions.map((part, i) => {
    const requestIdx = assignments[String(i)];
    if (requestIdx == null) {
      return { id: part.id, start: part.start, size: part.size, status: "free" as const };
    }
    return { id: part.id, start: part.start, size: part.size, status: "allocated" as const, processId: SAMPLE_REQUESTS[requestIdx]!.name };
  });
  const osBlock = { id: "os", start: 0, size: OS_RESERVED_MB, status: "os" as const };

  const processColors: Record<string, string> = {};
  SAMPLE_REQUESTS.forEach((r, i) => { processColors[r.name] = PROCESS_COLORS[i % PROCESS_COLORS.length]!; });

  // Variable partitioning: pack requests back-to-back tightly, exact sizes.
  let cursor = OS_RESERVED_MB;
  const variableBlocks = [osBlock, ...SAMPLE_REQUESTS.map((r, i) => {
    const block = { id: `var-${i}`, start: cursor, size: r.size, status: "allocated" as const, processId: r.name };
    cursor += r.size;
    return block;
  })];
  const usedByVariable = cursor - OS_RESERVED_MB;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Partitioning mode">
        {(["fixed", "variable"] as PartitionMode[]).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors capitalize",
              mode === m
                ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
            )}
          >
            {m}-size partitions
          </button>
        ))}
      </div>

      {mode === "fixed" ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-ink-soft dark:text-bone-soft">
            Memory is divided into <strong className="text-ink dark:text-bone">{partitionCount} equal, predefined partitions</strong> of {partitions[0]?.size} MB each, before any process is assigned. Assign each sample process to a partition and watch how much space goes unused inside it.
          </p>
          <label className="flex max-w-xs flex-col gap-1 text-xs text-ink-soft dark:text-bone-soft">
            Number of partitions: {partitionCount}
            <input type="range" min={2} max={6} value={partitionCount} onChange={(e) => { setPartitionCount(Number(e.target.value)); setAssignments({}); }} className="accent-subject-it" />
          </label>

          <MemoryBlockBar blocks={[osBlock, ...fixedBlocks]} processColors={processColors} />

          <div className="grid gap-3 sm:grid-cols-2">
            {SAMPLE_REQUESTS.map((req, i) => (
              <div key={req.name} className="rounded-md border border-line p-3 text-sm dark:border-line-dark">
                <p className="mb-1 flex items-center gap-2 text-ink dark:text-bone">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: PROCESS_COLORS[i]! }} /> {req.name} <span className="font-mono text-xs text-ink-soft dark:text-bone-soft">needs {req.size} MB</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {partitions.map((part, pIdx) => (
                    <button
                      key={part.id}
                      onClick={() => assignProcess(i, pIdx)}
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-xs font-medium",
                        assignments[String(pIdx)] === i
                          ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                          : "border-line text-ink-soft hover:border-ink/40 dark:border-line-dark dark:text-bone-soft",
                      )}
                    >
                      Partition {pIdx + 1}
                    </button>
                  ))}
                </div>
                {Object.entries(assignments).some(([k, v]) => v === i) && (
                  <p className="mt-1.5 text-xs text-amber-700 dark:text-amber-400">
                    Internal fragmentation: {internalFragmentation(partitions[Number(Object.entries(assignments).find(([, v]) => v === i)![0])]!, req.size)} MB wasted inside its partition.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-ink-soft dark:text-bone-soft">
            Memory is allocated in exactly the size each process requests, back-to-back — no wasted space within a process&apos;s own block. (Compare this to how much space Fixed mode wastes for the same three processes.)
          </p>
          <MemoryBlockBar blocks={variableBlocks} processColors={processColors} />
          <p className="text-sm text-ink dark:text-bone">
            Total used: <span className="font-mono">{usedByVariable} MB</span> across three processes — <span className="font-mono">0 MB</span> internal fragmentation, since each block is sized exactly to its process.
          </p>
        </div>
      )}
    </div>
  );
}

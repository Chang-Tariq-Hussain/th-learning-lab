/**
 * Conceptual model for the Memory Management Simulator (the
 * "Memory Management Laboratory").
 *
 * Like Process Management and CPU Scheduling, this models a small,
 * discrete/conceptual system rather than continuous real physics, so
 * no `@/features/simulation` canvas engine is needed — a plain
 * 2D/2.5D representation of RAM as a sequence of addressable blocks
 * is clearer for this topic than any 3D scene would be (fragmentation
 * and address ranges are inherently spatial-but-flat concepts).
 *
 * This simulation is intentionally separate from, but connects to:
 *  - Process Management Simulator: Create → memory allocated,
 *    Running → memory in use, Waiting → memory stays associated,
 *    Terminated → memory released. See `PROCESS_MEMORY_EVENTS`.
 *  - CPU Scheduling Simulator: scheduling decides WHEN a process
 *    runs; this simulation covers WHERE its data lives in RAM.
 *  - CPU–RAM–Storage Data Flow: that topic shows RAM as one stop in
 *    the CPU/RAM/storage pipeline; this topic zooms into RAM itself
 *    and how the OS shares it between many processes at once.
 *
 * IMPORTANT accuracy notes, surfaced directly in the UI:
 *  - RAM is volatile working memory, not permanent storage — that
 *    distinction belongs to the File System Explorer / storage.
 *  - Not every modern process gets one simple contiguous block in
 *    every real system (many use paging/segmentation). This
 *    simulator teaches contiguous allocation deliberately, as the
 *    foundational model, and labels it as such.
 *  - Logical/virtual addresses are NOT always identical to physical
 *    addresses — the OS/memory-management hardware translates them.
 *  - Virtual memory is explicitly NOT "just extra RAM" and is not
 *    implemented here — only named as a future topic.
 */

// ---------------------------------------------------------------------------
// RAM layout
// ---------------------------------------------------------------------------

/** Total simulated RAM, in MB. Kept small and round for readability —
 *  not meant to resemble a real machine's actual RAM size. */
export const TOTAL_RAM_MB = 1000;

/** Fixed region reserved for the operating system itself, always at
 *  the start of the address space in this simplified model. */
export const OS_RESERVED_MB = 150;

export const USABLE_RAM_MB = TOTAL_RAM_MB - OS_RESERVED_MB;

export type BlockStatus = "os" | "free" | "allocated";

export interface MemoryBlock {
  id: string;
  /** Start address, in MB, from 0. */
  start: number;
  /** Size, in MB. */
  size: number;
  status: BlockStatus;
  processId?: string;
}

export interface SimProcess {
  id: string;
  name: string;
  /** Requested size, in MB. */
  size: number;
  color: string;
}

/** A fresh RAM layout: OS block, then one large free region. */
export function createInitialBlocks(): MemoryBlock[] {
  return [
    { id: "os-block", start: 0, size: OS_RESERVED_MB, status: "os" },
    { id: "free-initial", start: OS_RESERVED_MB, size: USABLE_RAM_MB, status: "free" },
  ];
}

let blockCounter = 0;
export function nextBlockId(): string {
  blockCounter += 1;
  return `block-${blockCounter}`;
}

export const PROCESS_COLORS = [
  "#2563eb", // blue
  "#16a34a", // green
  "#d97706", // amber
  "#dc2626", // red
  "#7c3aed", // violet
  "#0891b2", // cyan
];

// ---------------------------------------------------------------------------
// Allocation strategies
// ---------------------------------------------------------------------------

export type AllocationStrategy = "first-fit" | "best-fit" | "worst-fit";

export const ALLOCATION_STRATEGY_LABELS: Record<AllocationStrategy, string> = {
  "first-fit": "First Fit",
  "best-fit": "Best Fit",
  "worst-fit": "Worst Fit",
};

export const ALLOCATION_STRATEGY_DESCRIPTIONS: Record<AllocationStrategy, string> = {
  "first-fit": "Scans from the start of RAM and allocates the first free block that's big enough.",
  "best-fit": "Scans every free block and allocates the smallest one that's still big enough — minimizing leftover space in that block.",
  "worst-fit": "Scans every free block and allocates the largest one available — leaving the biggest possible leftover free chunk.",
};

/** Finds which free block a request would be allocated into under a
 *  given strategy, without mutating anything — used both to actually
 *  allocate and to let the Allocation Strategy Lab show the decision
 *  before committing to it. Returns `null` if no free block is large
 *  enough (memory pressure / allocation failure). */
export function chooseBlockForAllocation(
  blocks: MemoryBlock[],
  requestSize: number,
  strategy: AllocationStrategy,
): MemoryBlock | null {
  const candidates = blocks.filter((b) => b.status === "free" && b.size >= requestSize);
  if (candidates.length === 0) return null;

  if (strategy === "first-fit") {
    // Candidates already come out of `blocks` in address order.
    return candidates[0] ?? null;
  }
  if (strategy === "best-fit") {
    return candidates.reduce((best, b) => (b.size < best.size ? b : best));
  }
  // worst-fit
  return candidates.reduce((worst, b) => (b.size > worst.size ? b : worst));
}

/** Allocates `process` into `blocks` using `strategy`. Splits the
 *  chosen free block into an allocated piece and a (possibly
 *  zero-size, then omitted) free remainder. Pure — returns a new
 *  array, or `null` if allocation isn't possible. */
export function allocate(
  blocks: MemoryBlock[],
  process: SimProcess,
  strategy: AllocationStrategy,
): MemoryBlock[] | null {
  const target = chooseBlockForAllocation(blocks, process.size, strategy);
  if (!target) return null;

  const allocatedBlock: MemoryBlock = {
    id: nextBlockId(),
    start: target.start,
    size: process.size,
    status: "allocated",
    processId: process.id,
  };

  const remainderSize = target.size - process.size;
  const newPieces: MemoryBlock[] =
    remainderSize > 0
      ? [allocatedBlock, { id: nextBlockId(), start: target.start + process.size, size: remainderSize, status: "free" }]
      : [allocatedBlock];

  return blocks.flatMap((b) => (b.id === target.id ? newPieces : [b]));
}

/** Frees the block belonging to `processId`, then coalesces
 *  (merges) it with any immediately adjacent free blocks — standard
 *  OS behavior, and still leaves genuine external fragmentation
 *  behind whenever the freed block sits between two still-allocated
 *  neighbors. Pure — returns a new array. */
export function deallocate(blocks: MemoryBlock[], processId: string): MemoryBlock[] {
  const sorted = [...blocks].sort((a, b) => a.start - b.start);
  const idx = sorted.findIndex((b) => b.processId === processId);
  if (idx === -1) return blocks;

  const freed: MemoryBlock = { ...sorted[idx]!, status: "free", processId: undefined };
  const merged: MemoryBlock[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i === idx) {
      const prev = merged[merged.length - 1];
      if (prev && prev.status === "free") {
        prev.size += freed.size;
      } else {
        merged.push(freed);
      }
      continue;
    }
    const block = sorted[i]!;
    const prev = merged[merged.length - 1];
    if (block.status === "free" && prev && prev.status === "free" && i === idx + 1) {
      prev.size += block.size;
    } else {
      merged.push({ ...block });
    }
  }
  return merged;
}

// ---------------------------------------------------------------------------
// Fragmentation
// ---------------------------------------------------------------------------

export interface FragmentationReport {
  totalFree: number;
  largestFreeBlock: number;
  freeBlockCount: number;
  /** True when total free memory could satisfy a request, but no
   *  single free block is large enough — the defining symptom of
   *  external fragmentation. */
  wouldBlockRequestOfSize: (size: number) => boolean;
}

export function analyzeFragmentation(blocks: MemoryBlock[]): FragmentationReport {
  const freeBlocks = blocks.filter((b) => b.status === "free");
  const totalFree = freeBlocks.reduce((sum, b) => sum + b.size, 0);
  const largestFreeBlock = freeBlocks.reduce((max, b) => Math.max(max, b.size), 0);
  return {
    totalFree,
    largestFreeBlock,
    freeBlockCount: freeBlocks.length,
    wouldBlockRequestOfSize: (size: number) => size <= totalFree && size > largestFreeBlock,
  };
}

// ---------------------------------------------------------------------------
// Fixed partitioning (for the internal-fragmentation demonstration)
// ---------------------------------------------------------------------------

export interface FixedPartition {
  id: string;
  start: number;
  size: number;
  processId?: string;
}

/** Splits the usable RAM into `count` equal fixed-size partitions —
 *  a simplified educational model of fixed partitioning, not a
 *  reproduction of any specific real OS's partition table. */
export function createFixedPartitions(count: number): FixedPartition[] {
  const size = Math.floor(USABLE_RAM_MB / count);
  return Array.from({ length: count }, (_, i) => ({
    id: `partition-${i}`,
    start: OS_RESERVED_MB + i * size,
    size,
  }));
}

export function internalFragmentation(partition: FixedPartition, processSize: number): number {
  return Math.max(0, partition.size - processSize);
}

// ---------------------------------------------------------------------------
// Addressing (logical/virtual vs physical) — conceptual only
// ---------------------------------------------------------------------------

/** Translates a process-relative ("logical") address into an
 *  absolute physical RAM address, given the physical base address of
 *  the block that process is loaded into. This is the simplest
 *  possible base-register translation — real memory-management units
 *  use more elaborate schemes (segmentation, paging), which this
 *  simulator deliberately does not attempt to model. */
export function logicalToPhysical(logicalAddress: number, physicalBase: number): number {
  return physicalBase + logicalAddress;
}

export const ADDRESSING_DISCLAIMER =
  "Simplified conceptual model: one process, one contiguous block, translated with a single base address. Real memory-management hardware often uses paging or segmentation instead, which this simulator does not attempt to reproduce.";

// ---------------------------------------------------------------------------
// Process <-> memory lifecycle connection
// ---------------------------------------------------------------------------

export type ProcessLifecycleForMemory = "new" | "running" | "waiting" | "terminated";

export interface ProcessMemoryEvent {
  state: ProcessLifecycleForMemory;
  stateLabel: string;
  memoryEvent: string;
  description: string;
}

export const PROCESS_MEMORY_EVENTS: ProcessMemoryEvent[] = [
  {
    state: "new",
    stateLabel: "Create Process",
    memoryEvent: "Memory allocated",
    description: "As part of creating the process, the OS's memory manager finds space and allocates it — exactly what the Memory Map Lab's \"Allocate\" step does.",
  },
  {
    state: "running",
    stateLabel: "Process Running",
    memoryEvent: "Uses allocated memory",
    description: "While running, the process reads and writes within the memory range it was allocated — it cannot go outside that range.",
  },
  {
    state: "waiting",
    stateLabel: "Process Waiting",
    memoryEvent: "Memory remains associated",
    description: "Even while blocked on I/O and not using the CPU, the process keeps its allocated memory — waiting does not mean losing its data.",
  },
  {
    state: "terminated",
    stateLabel: "Process Terminated",
    memoryEvent: "Memory released",
    description: "When the process ends, the OS reclaims its memory — the Memory Map Lab's \"Deallocate\" step — freeing that space for other processes.",
  },
];

// ---------------------------------------------------------------------------
// Memory pressure
// ---------------------------------------------------------------------------

export const MEMORY_PRESSURE_NOTE =
  "As more processes request memory, available free memory shrinks. Eventually a new request may not be satisfiable — this is memory pressure. A later lesson will explain how virtual memory can extend the apparent memory space; this simulator does not implement that system.";

export const MEMORY_MANAGEMENT_DISCLAIMER =
  "Simplified educational model. Real operating systems manage memory with more detail and nuance than shown here — including paging, segmentation, and virtual memory — and specifics vary between systems.";

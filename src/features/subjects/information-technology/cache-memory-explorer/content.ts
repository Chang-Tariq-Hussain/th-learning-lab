import type { DetailLevel, Mapping, Policy } from "./model";

/**
 * Static, authored copy for the Cache Memory Explorer. Kept apart from
 * `model.ts` so the simulation engine stays free of prose.
 *
 * Wording rule for everything below: cache size, latency, line size,
 * associativity and policy all vary by processor. Copy therefore uses
 * relative language ("generally", "on many designs") and never states
 * a real-world figure as a universal fact. Every number that appears
 * in the lab is labelled as a simulation value.
 */

// ---------------------------------------------------------------------------
// Disclaimers & cross-links
// ---------------------------------------------------------------------------

export const MODEL_DISCLAIMER =
  "This is a conceptual, simplified model of a memory hierarchy, not a reproduction of any specific Intel, AMD, or ARM processor. Real cache sizes, latencies, line sizes, associativity, and policies vary by architecture.";

export const TIMING_DISCLAIMER =
  "All latencies are simulation values in abstract units, not real nanoseconds. In this model each level that is checked adds its own lookup time; real hardware overlaps and pipelines these steps.";

export const READS_ONLY_NOTE =
  "This lab models reads only. Writes, dirty lines, and write policies are left out to keep the focus on hits, misses, and locality.";

export const SIMPLIFIED_LOOKUP_NOTE =
  "Simplified hierarchy model: real CPUs don’t necessarily check each level one after another in exactly this sequence, and details differ between designs.";

export const CPU_LINK = {
  href: "/dashboard/information-technology/cpu-architecture-instruction-cycle",
  label: "CPU Architecture & Instruction Cycle",
  description:
    "That lab shows what happens inside the CPU while it executes an instruction. This one shows the memory system the CPU relies on to get instructions and data quickly.",
};

export const DATA_FLOW_LINK = {
  href: "/dashboard/information-technology/cpu-ram-storage-data-flow",
  label: "CPU–RAM–Storage Data Flow",
  description:
    "Next stop: how data travels between the CPU, RAM, and storage when a computer opens an app or saves a file. It includes a short cache hit/miss demo you can now read with much more depth.",
};

export const COMPONENTS_LINK = {
  href: "/dashboard/information-technology/computer-components-explorer",
  label: "Computer Components & Hardware Explorer",
  description: "See where the CPU and RAM physically sit on the motherboard.",
};

// ---------------------------------------------------------------------------
// Memory hierarchy nodes
// ---------------------------------------------------------------------------

export type HierarchyNodeId = "cpu" | "l1" | "l2" | "l3" | "ram" | "storage";

export interface HierarchyNodeInfo {
  id: HierarchyNodeId;
  name: string;
  blurb: string;
  detail: string;
  size: string;
  speed: string;
  simLatency: number | null;
  latencyNote: string;
  keyPoints: string[];
  minLevel: DetailLevel;
}

export const HIERARCHY_NODES: Record<HierarchyNodeId, HierarchyNodeInfo> = {
  cpu: {
    id: "cpu",
    name: "CPU & registers",
    blurb: "Executes instructions. Registers inside it hold the few values it is working on right now.",
    detail:
      "Registers are the fastest storage in a computer and also the smallest: a handful of values the CPU is using this very moment. Everything else in the hierarchy exists to keep those registers fed with data and instructions without making the CPU wait.",
    size: "Smallest — a handful of values",
    speed: "Fastest",
    simLatency: null,
    latencyNote: "Registers are inside the CPU, so the lab doesn’t charge any lookup time for them.",
    keyPoints: [
      "Registers hold the values an instruction is operating on.",
      "The CPU asks the memory system for anything that isn’t already in a register.",
      "The CPU itself doesn’t decide what’s cached — hardware manages that automatically.",
    ],
    minLevel: "beginner",
  },
  l1: {
    id: "l1",
    name: "L1 cache",
    blurb: "The smallest and fastest cache, closest to the CPU. The first place the CPU looks.",
    detail:
      "L1 is small on purpose: a small memory is easier to make very fast and to search quickly. It keeps copies of data and instructions the CPU used recently. Many processors split L1 into a separate instruction cache and data cache, though organizations vary by architecture.",
    size: "Very small",
    speed: "Very fast",
    simLatency: 1,
    latencyNote: "Simulation value: 1 unit.",
    keyPoints: [
      "Checked first, so hits here are the cheapest accesses in the whole hierarchy.",
      "Small capacity means lines are evicted often.",
      "Holds copies — the originals stay in RAM.",
    ],
    minLevel: "beginner",
  },
  l2: {
    id: "l2",
    name: "L2 cache",
    blurb: "Usually larger than L1 and generally slower, but still much closer than RAM.",
    detail:
      "L2 catches many of the requests that miss in L1. On many designs each core has its own L2; on others it is shared. In this simplified model it is simply the next level down, larger than L1 and slower to search.",
    size: "Small to medium",
    speed: "Fast",
    simLatency: 4,
    latencyNote: "Simulation value: 4 units.",
    keyPoints: [
      "Usually larger than L1, and generally slower.",
      "Only checked after L1 misses in this model.",
      "Still far closer to the CPU than main memory.",
    ],
    minLevel: "intermediate",
  },
  l3: {
    id: "l3",
    name: "L3 cache",
    blurb: "Generally larger than L2 and slower than L1/L2. Often shared between cores.",
    detail:
      "L3 is a common design on modern processors, not a universal rule: some processors have no L3, and others have more than three cache levels. Where it exists, it is often shared among several cores, which makes it a useful meeting point for data one core has used and another might want.",
    size: "Larger",
    speed: "Moderately fast",
    simLatency: 12,
    latencyNote: "Simulation value: 12 units.",
    keyPoints: [
      "Often shared among CPU cores on many modern processors, but architecture varies.",
      "Not every processor has an L3.",
      "Slower than L1/L2, yet still much faster than RAM.",
    ],
    minLevel: "intermediate",
  },
  ram: {
    id: "ram",
    name: "RAM",
    blurb: "Main memory. Much larger than any cache, and much slower to reach.",
    detail:
      "RAM holds the original instructions and data of every running program. Caches hold copies of small parts of it. RAM is volatile: its contents are lost when power is removed.",
    size: "Large",
    speed: "Much slower than cache",
    simLatency: 50,
    latencyNote: "Simulation value: 50 units.",
    keyPoints: [
      "Holds the original data — caches only keep copies.",
      "Far larger than any cache, which is exactly why it is slower to reach.",
      "A trip to RAM is the expensive event a cache tries to avoid.",
    ],
    minLevel: "beginner",
  },
  storage: {
    id: "storage",
    name: "Storage",
    blurb: "SSDs and hard drives. Persistent, far larger, and far slower than RAM.",
    detail:
      "Storage keeps data with the power off. It sits at the bottom of the memory hierarchy, and the same idea repeats there: RAM keeps working copies of the parts of storage that programs are using now. Storage isn’t part of the CPU cache system, so this lab doesn’t simulate it.",
    size: "Largest",
    speed: "Far slower again",
    simLatency: null,
    latencyNote: "Off the scale of this lab — orders of magnitude slower than RAM, and not simulated.",
    keyPoints: [
      "Persistent: data survives power-off.",
      "Not simulated in this lab — it lives below RAM.",
      "See CPU–RAM–Storage Data Flow for how data moves between RAM and storage.",
    ],
    minLevel: "beginner",
  },
};

export const WHY_CACHE_EXISTS =
  "A CPU can work through instructions much faster than main memory can deliver data. Without a cache, it would spend much of its time waiting. A cache is a small, fast memory placed close to the CPU that keeps copies of instructions and data the CPU has used recently, or is likely to want soon.";

export const NOT_JUST_FAST_RAM =
  "Cache isn’t simply “a faster version of RAM.” It holds copies of data that live in RAM, it is managed automatically by hardware rather than by your program, and it only pays off because programs tend to reuse data and to touch nearby data — a habit called locality.";

export const TRADEOFFS: { title: string; body: string }[] = [
  {
    title: "Closer to the CPU means lower latency",
    body: "Shorter distances and simpler lookups mean a request can be answered sooner.",
  },
  {
    title: "Smaller memory is easier to make very fast",
    body: "There is less to search and less wiring to cross, so a small memory can respond quickly.",
  },
  {
    title: "Larger memory is generally farther away and slower",
    body: "Holding more data means more to search and a longer path, so capacity and speed pull in opposite directions.",
  },
  {
    title: "Making a large memory extremely fast costs a lot",
    body: "Cost and complexity rise steeply, which is why computers use a hierarchy instead of one giant fast memory.",
  },
];

export const REAL_COMPUTER_NOTES: string[] = [
  "Modern processors often have multiple cores, and each core commonly has its own small, private caches.",
  "Larger caches further down are often shared between several cores — but which levels are private and which are shared varies by design.",
  "The number of cache levels, their sizes, and their speeds differ between processors; some have two levels, some have three or more.",
  "Cache lines hold a fixed group of bytes. 64 bytes is common on many current designs, but the size isn’t universal.",
  "Associativity (how many places a block may go) and replacement policies differ, and real policies are often approximations of LRU rather than exact LRU.",
  "Many CPUs use separate instruction and data caches at some levels, and unified caches at others.",
  "Real hardware also prefetches data it expects you’ll need and overlaps many memory operations in time — neither is simulated here.",
];

// ---------------------------------------------------------------------------
// Sample data for the Hierarchy inspector (illustrative only)
// ---------------------------------------------------------------------------

export interface SampleEntry {
  address: number;
  data: number;
}

/** The L1 sample from the brief. Illustrative values, not from any real CPU. */
export const L1_SAMPLE: SampleEntry[] = [
  { address: 0x1000, data: 42 },
  { address: 0x1004, data: 17 },
  { address: 0x1008, data: 91 },
  { address: 0x100c, data: 33 },
];
export const L2_EXTRA: SampleEntry[] = [
  { address: 0x2000, data: 58 },
  { address: 0x2004, data: 64 },
  { address: 0x2008, data: 7 },
  { address: 0x200c, data: 25 },
];
export const L3_EXTRA: SampleEntry[] = [
  { address: 0x3000, data: 23 },
  { address: 0x3004, data: 76 },
  { address: 0x3008, data: 49 },
  { address: 0x300c, data: 88 },
];

export interface SampleLookup {
  address: number;
  /** The level that answers in the illustrative sample. */
  answeredBy: "l1" | "l2" | "l3" | "ram";
}

export const SAMPLE_LOOKUPS: SampleLookup[] = [
  { address: 0x1000, answeredBy: "l1" },
  { address: 0x2000, answeredBy: "l2" },
  { address: 0x3000, answeredBy: "l3" },
  { address: 0x9000, answeredBy: "ram" },
];

export function entryExplanation(entry: SampleEntry, holder: string): string {
  return `${holder} holds a copy of the value at address 0x${entry.address.toString(16).toUpperCase()}. RAM still has the original. If the CPU asks for that address, ${holder} can answer without going to RAM.`;
}

// ---------------------------------------------------------------------------
// Guided experiments
// ---------------------------------------------------------------------------

export interface RunSpec {
  label: string;
  pattern: string;
  lines: number;
  lineSize: number;
  policy: Policy;
  mapping: Mapping;
}

export interface ExperimentDef {
  id: string;
  number: number;
  title: string;
  goal: string;
  minLevel: DetailLevel;
  runs: RunSpec[];
  observe: string;
}

const run = (label: string, pattern: string, lines: number, lineSize = 1, policy: Policy = "lru", mapping: Mapping = "full"): RunSpec => ({
  label,
  pattern,
  lines,
  lineSize,
  policy,
  mapping,
});

export const EXPERIMENTS: ExperimentDef[] = [
  {
    id: "exp-hit",
    number: 1,
    title: "Cache hit",
    goal: "Access the same address over and over.",
    minLevel: "beginner",
    runs: [run("Same address, eight times", "42 42 42 42 42 42 42 42", 4)],
    observe:
      "Only the first access misses. After that the data is already in the cache, so every repeat is a hit. Reusing recently used data is what makes a cache worthwhile.",
  },
  {
    id: "exp-sequential",
    number: 2,
    title: "Sequential access",
    goal: "Walk through neighbouring addresses, with and without cache lines.",
    minLevel: "intermediate",
    runs: [
      run("1-word entries", "100 101 102 103 104 105", 4, 1),
      run("4-word cache lines", "100 101 102 103 104 105", 4, 4),
    ],
    observe:
      "With 1-word entries every access is a miss. With 4-word lines, one miss brings in the neighbours too, so the next accesses hit. That’s spatial locality at work.",
  },
  {
    id: "exp-random",
    number: 3,
    title: "Random access",
    goal: "Compare a tight loop with widely separated addresses.",
    minLevel: "beginner",
    runs: [
      run("Tight loop", "10 11 12 13 10 11 12 13", 4),
      run("Widely separated", "10 50 90 130 170 210 250 290", 4),
    ],
    observe:
      "Widely separated addresses share nothing and are never reused, so the cache has nothing to work with and every access misses. Cache performance depends heavily on the access pattern, not just the cache.",
  },
  {
    id: "exp-small",
    number: 4,
    title: "Small cache",
    goal: "Shrink the cache below the size of the data being reused.",
    minLevel: "beginner",
    runs: [run("2 lines", "1 2 3 4 1 2 3 4 1 2 3 4", 2), run("4 lines", "1 2 3 4 1 2 3 4 1 2 3 4", 4)],
    observe:
      "Four blocks are reused, but two lines can’t hold them, so each block is evicted just before it is needed again — every access misses. Give the cache room for all four and only the first pass misses.",
  },
  {
    id: "exp-large",
    number: 5,
    title: "Larger cache",
    goal: "Grow the cache until the whole working set fits.",
    minLevel: "beginner",
    runs: [run("4 lines", "1 2 3 4 5 6 1 2 3 4 5 6", 4), run("8 lines", "1 2 3 4 5 6 1 2 3 4 5 6", 8)],
    observe:
      "Six blocks don’t fit in four lines, so the second pass misses again. With eight lines the whole set fits and the second pass hits. A bigger cache helps only until the working set fits — after that, extra size buys nothing.",
  },
  {
    id: "exp-policy",
    number: 6,
    title: "Replacement policies",
    goal: "Run the same pattern under FIFO and LRU.",
    minLevel: "technical",
    runs: [
      run("FIFO", "A B C A B D A", 3, 1, "fifo"),
      run("LRU", "A B C A B D A", 3, 1, "lru"),
    ],
    observe:
      "When D arrives and the cache is full, FIFO evicts A because it arrived first — even though A was just used. LRU evicts C, which hasn’t been used for longest, and A is still there for the last access. Neither policy wins on every pattern.",
  },
  {
    id: "exp-linesize",
    number: 7,
    title: "Cache line size",
    goal: "Scan 16 consecutive addresses with three different line sizes.",
    minLevel: "intermediate",
    runs: [
      run("1-word lines", "0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15", 8, 1),
      run("4-word lines", "0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15", 8, 4),
      run("8-word lines", "0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15", 8, 8),
    ],
    observe:
      "Longer lines turn more of a sequential scan into hits, because each miss brings in more neighbours. The trade-off, which this scan can’t show, is that a longer line also drags in words you may never use, and holds fewer distinct lines for a given cache size.",
  },
];

export const CUSTOM_EXPERIMENT: ExperimentDef = {
  id: "exp-custom",
  number: 0,
  title: "Sandbox",
  goal: "Type your own access patterns and compare two caches.",
  minLevel: "beginner",
  runs: [run("Run A", "10 20 30 10 20 30", 4), run("Run B", "10 20 30 10 20 30", 2)],
  observe: "Change the pattern or the cache in either run and compare how hits, misses, and evictions respond.",
};

// ---------------------------------------------------------------------------
// Locality lab
// ---------------------------------------------------------------------------

export const TEMPORAL_SEQUENCES = [
  { id: "reuse", label: "A B A A B A", pattern: "A B A A B A", note: "Two blocks, each reused soon after it was first used." },
  { id: "noreuse", label: "A B C D E F", pattern: "A B C D E F", note: "Six different blocks — nothing is ever reused." },
];

// ---------------------------------------------------------------------------
// CPU & caches lab — a two-load, one-add mini program
// ---------------------------------------------------------------------------

export interface MiniInstruction {
  address: number;
  text: string;
  /** Data address read by the instruction, if any. */
  dataAddress: number | null;
  note: string;
}

export const MINI_PROGRAM: MiniInstruction[] = [
  { address: 100, text: "LOAD R1, [600]", dataAddress: 600, note: "Needs the instruction at 100 and the data at 600." },
  { address: 101, text: "LOAD R2, [601]", dataAddress: 601, note: "Instruction 101 and data 601 sit right next to the previous ones." },
  { address: 102, text: "ADD R1, R2", dataAddress: null, note: "Works on registers only, so it needs no data-cache access — just the instruction." },
];

// ---------------------------------------------------------------------------
// Coherence lab — purely conceptual
// ---------------------------------------------------------------------------

export interface CoherenceStep {
  id: string;
  title: string;
  ramValue: number;
  core1: number | null;
  core2: { off: number | null; on: number | null };
  note: { off: string; on: string };
  /** Core 2’s read in the last step returns a value. */
  staleRead?: boolean;
}

export const COHERENCE_STEPS: CoherenceStep[] = [
  {
    id: "start",
    title: "Start: X = 5 in RAM",
    ramValue: 5,
    core1: null,
    core2: { off: null, on: null },
    note: {
      off: "Two cores share one memory. Each has its own private cache. Neither cache holds X yet.",
      on: "Two cores share one memory. Each has its own private cache. Neither cache holds X yet.",
    },
  },
  {
    id: "core1-read",
    title: "Core 1 reads X",
    ramValue: 5,
    core1: 5,
    core2: { off: null, on: null },
    note: {
      off: "Core 1’s cache now holds a copy of X = 5.",
      on: "Core 1’s cache now holds a copy of X = 5.",
    },
  },
  {
    id: "core2-read",
    title: "Core 2 reads X",
    ramValue: 5,
    core1: 5,
    core2: { off: 5, on: 5 },
    note: {
      off: "Both caches now hold their own copy of X = 5. Two copies of the same data exist.",
      on: "Both caches now hold their own copy of X = 5. Two copies of the same data exist.",
    },
  },
  {
    id: "core1-write",
    title: "Core 1 writes X = 9",
    ramValue: 5,
    core1: 9,
    core2: { off: 5, on: null },
    note: {
      off: "Core 1 updates its own copy. Nothing tells Core 2, so Core 2 is still holding the old X = 5.",
      on: "Core 1 updates its copy, and the coherence mechanism marks Core 2’s copy as invalid so it can’t be used by mistake.",
    },
  },
  {
    id: "core2-read-again",
    title: "Core 2 reads X again",
    ramValue: 5,
    core1: 9,
    core2: { off: 5, on: 9 },
    staleRead: true,
    note: {
      off: "Core 2 hits in its own cache and reads X = 5. That is stale — Core 1 changed it to 9. The two cores now disagree about the same variable.",
      on: "Core 2’s copy was invalidated, so it misses and fetches the current value, X = 9. Both cores agree.",
    },
  },
];

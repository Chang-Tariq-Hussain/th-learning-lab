/**
 * Conceptual model for the Paging Simulator (the "Operating System
 * Paging Laboratory").
 *
 * SCOPE BOUNDARY (deliberate): the Virtual Memory Simulator already
 * answers "why does virtual memory exist and what problem does it
 * solve?" — see `../virtual-memory-simulator/model.ts`, whose
 * `PAGING_PREVIEW_NOTE` forward-points here. THIS simulator answers
 * the next question: "how does the OS actually implement
 * virtual-to-physical memory management, using pages, frames, and
 * page tables?" So this file owns pages, frames, page tables, page
 * table entries, address translation arithmetic, page faults, demand
 * paging, page replacement (FIFO / LRU / Optimal), page-size
 * trade-offs, internal fragmentation, the TLB, and per-process page
 * tables — and deliberately does NOT re-teach residency, memory
 * pressure, overcommit, or working set, which belong to the earlier
 * topic.
 *
 * TECHNICAL ACCURACY notes, surfaced directly in the UI:
 *  - A PAGE is a fixed-size block of a process's VIRTUAL address
 *    space. A FRAME is a fixed-size block of PHYSICAL memory. They
 *    are the same size, but they are not the same thing.
 *  - A PAGE TABLE is a per-process mapping from virtual pages to
 *    physical frames. It is not a copy of the data itself.
 *  - A PAGE FAULT means the requested page is not currently resident
 *    in physical memory, so the OS must handle it. It does NOT mean
 *    the program has crashed.
 *  - A TLB caches recent address TRANSLATIONS, not page contents.
 *  - The OFFSET identifies a position inside a page/frame and is
 *    normally carried through address translation unchanged.
 *  - OPTIMAL replacement requires knowledge of future references, so
 *    it is a theoretical benchmark, not an implementable online
 *    algorithm. No algorithm here is presented as universally best.
 *  - Every numeric value in this simulator is an illustrative
 *    simulation value chosen to keep the arithmetic doable by hand,
 *    not a measurement of any real machine.
 */

// ---------------------------------------------------------------------------
// Disclaimers / shared copy
// ---------------------------------------------------------------------------

export const PAGING_DISCLAIMER =
  "All addresses, page sizes, and frame counts here are deliberately tiny illustrative values chosen so the arithmetic stays doable by hand. Real systems use far larger address spaces and multi-level page tables.";

export const PAGE_VS_FRAME_NOTE =
  "A page belongs to virtual memory. A frame belongs to physical memory. They are the same size — that is exactly why any page can go in any free frame — but they are not the same thing.";

export const PAGE_FAULT_NOTE =
  "A page fault does NOT mean the program crashed. It means the requested page is not currently resident in physical memory, and the operating system must bring it in before the access can complete.";

export const TLB_NOTE =
  "The TLB caches recent address translations (page number → frame number). It does not store page contents.";

export const OPTIMAL_NOTE =
  "Optimal replacement needs to know which pages will be referenced in the future, so it cannot be implemented as an ordinary online algorithm. It is included as a theoretical benchmark to compare the others against.";

export const VIRTUAL_MEMORY_LINK_NOTE =
  "The Virtual Memory Simulator covers why virtual memory exists. This simulator covers how paging implements it.";

// ---------------------------------------------------------------------------
// Detail levels (mirrors the Virtual Memory Simulator's selector)
// ---------------------------------------------------------------------------

export type DetailLevel = "basic" | "intermediate" | "technical";

export const DETAIL_LEVEL_LABELS: Record<DetailLevel, string> = {
  basic: "Basic",
  intermediate: "Intermediate",
  technical: "Technical",
};

export const DETAIL_LEVEL_DESCRIPTIONS: Record<DetailLevel, string> = {
  basic: "Page table entries show only page, frame, and present.",
  intermediate: "Adds protection, referenced, and dirty to each entry.",
  technical: "Adds an explanation of what every page table entry field actually means.",
};

/** What each page-table-entry field means — shown only at Technical
 *  detail, so the beginner view stays uncluttered (brief §7). */
export const PTE_FIELD_GLOSSARY: { field: string; meaning: string }[] = [
  { field: "Page number", meaning: "Which page of this process's virtual address space this entry describes. It is the index into the page table, not data." },
  { field: "Frame number", meaning: "Which physical frame currently holds that page's contents. Meaningful only when the present bit is set." },
  { field: "Present / valid bit", meaning: "Whether the page is currently resident in physical memory. If it is clear, using this entry raises a page fault and the OS handles it." },
  { field: "Protection", meaning: "What kind of access is permitted for this page — for example read-only versus read/write. Shown here as a simplified concept, not real hardware permission bits." },
  { field: "Referenced / accessed", meaning: "Set when the page has been accessed. Replacement policies can use this kind of information to judge which pages are in active use." },
  { field: "Modified / dirty", meaning: "Set when the page has been written to. A dirty page has changes that must be written back before its frame can be reused; a clean page can simply be dropped." },
];

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/** Page sizes offered in the address-translation lab. Powers of two,
 *  kept tiny on purpose so page-number/offset arithmetic is mental
 *  arithmetic rather than a calculator exercise. */
export const PAGE_SIZE_OPTIONS = [4, 8, 16] as const;

export const DEFAULT_PAGE_SIZE = 4;
export const DEFAULT_PAGE_COUNT = 8;
export const DEFAULT_FRAME_COUNT = 4;

export interface PagingConfig {
  /** Bytes per page — and therefore also bytes per frame. */
  pageSizeBytes: number;
  /** Number of pages in the simulated process's virtual address space. */
  pageCount: number;
  /** Number of frames in simulated physical RAM. */
  frameCount: number;
}

export const DEFAULT_CONFIG: PagingConfig = {
  pageSizeBytes: DEFAULT_PAGE_SIZE,
  pageCount: DEFAULT_PAGE_COUNT,
  frameCount: DEFAULT_FRAME_COUNT,
};

/** log2 for exact powers of two — every page size here is one. */
export function offsetBits(pageSizeBytes: number): number {
  return Math.round(Math.log2(pageSizeBytes));
}

export function virtualAddressSpaceBytes(config: PagingConfig): number {
  return config.pageSizeBytes * config.pageCount;
}

export function physicalMemoryBytes(config: PagingConfig): number {
  return config.pageSizeBytes * config.frameCount;
}

// ---------------------------------------------------------------------------
// Page table entries
// ---------------------------------------------------------------------------

export type Protection = "read-only" | "read-write";

export interface PageTableEntry {
  page: number;
  /** Physical frame holding this page, or null when not present. */
  frame: number | null;
  /** Present/valid bit — is this page currently resident in RAM? */
  present: boolean;
  protection: Protection;
  /** Referenced/accessed concept — set when the page is touched. */
  referenced: boolean;
  /** Modified/dirty concept — set when the page is written to. */
  dirty: boolean;
  /** Logical clock tick at which this page was loaded into its frame.
   *  Drives FIFO ("which resident page arrived first?"). */
  loadedAt: number | null;
  /** Logical clock tick of this page's most recent access. Drives LRU. */
  lastUsedAt: number | null;
  /** Short label so the visualization can show that a page holds
   *  something, without pretending to simulate real program content. */
  label: string;
}

export interface MachineState {
  config: PagingConfig;
  entries: PageTableEntry[];
  /** frames[i] is the page number currently in frame i, or null if free. */
  frames: (number | null)[];
  /** Monotonic logical clock — every access advances it by one. */
  clock: number;
  accesses: number;
  faults: number;
  hits: number;
}

const PAGE_LABELS = [
  "Program code",
  "Program code",
  "Global data",
  "Global data",
  "Heap",
  "Heap",
  "Library code",
  "Stack",
  "Stack",
  "Heap",
  "Heap",
  "Library code",
];

function pageLabel(page: number): string {
  return PAGE_LABELS[page % PAGE_LABELS.length] ?? "Data";
}

/**
 * A fresh machine. `initiallyPresent` lists the pages already
 * resident when the student arrives — deliberately NOT every page,
 * because demand paging (brief §9) only makes sense if some pages
 * start out missing.
 */
export function createMachine(
  config: PagingConfig = DEFAULT_CONFIG,
  initiallyPresent: { page: number; frame: number }[] = [
    { page: 0, frame: 1 },
    { page: 1, frame: 0 },
    { page: 3, frame: 2 },
  ],
): MachineState {
  const frames: (number | null)[] = Array.from({ length: config.frameCount }, () => null);
  const entries: PageTableEntry[] = Array.from({ length: config.pageCount }, (_, page) => ({
    page,
    frame: null,
    present: false,
    // Page 0 and 1 stand in for program code, which is conventionally
    // not writable — enough to make the protection field mean
    // something without modeling real permission bits.
    protection: page <= 1 ? ("read-only" as Protection) : ("read-write" as Protection),
    referenced: false,
    dirty: false,
    loadedAt: null,
    lastUsedAt: null,
    label: pageLabel(page),
  }));

  let tick = 1;
  for (const { page, frame } of initiallyPresent) {
    if (page >= config.pageCount || frame >= config.frameCount) continue;
    const entry = entries[page];
    if (!entry) continue;
    entry.frame = frame;
    entry.present = true;
    entry.loadedAt = tick;
    entry.lastUsedAt = tick;
    frames[frame] = page;
    tick += 1;
  }

  return { config, entries, frames, clock: tick, accesses: 0, faults: 0, hits: 0 };
}

export function residentPages(state: MachineState): number[] {
  return state.frames.filter((p): p is number => p !== null);
}

export function freeFrameIndex(state: MachineState): number | null {
  const idx = state.frames.findIndex((p) => p === null);
  return idx === -1 ? null : idx;
}

// ---------------------------------------------------------------------------
// Address arithmetic
// ---------------------------------------------------------------------------

export interface AddressBreakdown {
  address: number;
  pageOrFrameNumber: number;
  offset: number;
  pageSizeBytes: number;
}

/** Virtual address → page number + offset. */
export function splitVirtualAddress(address: number, pageSizeBytes: number): AddressBreakdown {
  return {
    address,
    pageOrFrameNumber: Math.floor(address / pageSizeBytes),
    offset: address % pageSizeBytes,
    pageSizeBytes,
  };
}

/** Frame number + offset → physical address. The offset is carried
 *  through translation unchanged — that is the whole point. */
export function buildPhysicalAddress(frame: number, offset: number, pageSizeBytes: number): number {
  return frame * pageSizeBytes + offset;
}

export function maxVirtualAddress(config: PagingConfig): number {
  return virtualAddressSpaceBytes(config) - 1;
}

// ---------------------------------------------------------------------------
// Replacement policies
// ---------------------------------------------------------------------------

export type Algorithm = "fifo" | "lru" | "optimal";

export const ALGORITHM_LABELS: Record<Algorithm, string> = {
  fifo: "FIFO",
  lru: "LRU",
  optimal: "Optimal",
};

export const ALGORITHM_DESCRIPTIONS: Record<Algorithm, string> = {
  fifo: "First-In, First-Out — replace whichever resident page was loaded into RAM earliest, regardless of how recently it was used.",
  lru: "Least Recently Used — replace whichever resident page has gone unused for the longest time.",
  optimal: "Replace the resident page that will not be needed again for the longest time. This requires knowing future references, so it is a theoretical benchmark rather than an implementable online policy.",
};

/** Policies that can actually run during interactive, one-access-at-
 *  a-time exploration. Optimal is excluded on purpose: with no known
 *  future reference list there is nothing for it to look ahead at. */
export const ONLINE_ALGORITHMS: Algorithm[] = ["fifo", "lru"];

/**
 * Pick the victim page for an interactive (online) access. Returns
 * the page number to evict. `future` is optional and only used by
 * Optimal, which is why Optimal is not offered interactively.
 */
export function chooseVictim(
  state: MachineState,
  algorithm: Algorithm,
  future: number[] = [],
): number | null {
  const resident = residentPages(state);
  if (resident.length === 0) return null;

  if (algorithm === "optimal") {
    let victim = resident[0]!;
    let bestDistance = -1;
    for (const page of resident) {
      const nextUse = future.indexOf(page);
      // A page never referenced again is the ideal victim.
      if (nextUse === -1) return page;
      if (nextUse > bestDistance) {
        bestDistance = nextUse;
        victim = page;
      }
    }
    return victim;
  }

  const key = algorithm === "fifo" ? "loadedAt" : "lastUsedAt";
  let victim = resident[0]!;
  let best = Number.POSITIVE_INFINITY;
  for (const page of resident) {
    const entry = state.entries[page];
    const value = (entry?.[key] ?? 0) as number;
    if (value < best) {
      best = value;
      victim = page;
    }
  }
  return victim;
}

export function victimReason(algorithm: Algorithm, victim: number): string {
  switch (algorithm) {
    case "fifo":
      return `FIFO chooses page ${victim}: of the pages currently in RAM, it was loaded earliest.`;
    case "lru":
      return `LRU chooses page ${victim}: of the pages currently in RAM, it has gone unused for the longest time.`;
    case "optimal":
      return `Optimal chooses page ${victim}: of the pages currently in RAM, it is the one not needed again for the longest time — a choice only possible because the whole reference string is known in advance.`;
  }
}

// ---------------------------------------------------------------------------
// Interactive access: translation steps + resulting state
// ---------------------------------------------------------------------------

export type StepPhase =
  | "request"
  | "split"
  | "lookup"
  | "decision"
  | "hit"
  | "fault"
  | "storage"
  | "load"
  | "update"
  | "retry"
  | "physical";

export interface TranslationStep {
  id: string;
  phase: StepPhase;
  title: string;
  description: string;
  /** Highlight targets so the visualization can light up the right
   *  boxes without re-deriving any of this. */
  highlight: {
    page?: number;
    frame?: number;
    victimPage?: number;
    storage?: boolean;
  };
}

export interface AccessResult {
  steps: TranslationStep[];
  /** The machine state after this access completes. */
  next: MachineState;
  fault: boolean;
  virtualAddress: number;
  page: number;
  offset: number;
  /** Frame the page ends up in (after a fault is handled, if any). */
  frame: number;
  physicalAddress: number;
  victimPage: number | null;
  /** True when the fault was resolved by evicting a resident page
   *  rather than by using a free frame. */
  replaced: boolean;
}

/**
 * Run one memory access all the way through, producing both the
 * narrated step list the UI animates and the resulting machine
 * state. Pure: `state` is never mutated.
 */
export function accessVirtualAddress(
  state: MachineState,
  virtualAddress: number,
  options: { algorithm: Algorithm; write?: boolean; future?: number[] } = { algorithm: "fifo" },
): AccessResult {
  const { pageSizeBytes } = state.config;
  const { pageOrFrameNumber: page, offset } = splitVirtualAddress(virtualAddress, pageSizeBytes);
  const write = options.write ?? false;
  const entry = state.entries[page];

  const steps: TranslationStep[] = [
    {
      id: "request",
      phase: "request",
      title: "CPU requests a virtual address",
      description: `The running process asks for virtual address ${virtualAddress}. Nothing has been translated yet — this address only means something inside this process's own virtual address space.`,
      highlight: {},
    },
    {
      id: "split",
      phase: "split",
      title: "Split the address into page number and offset",
      description: `With a page size of ${pageSizeBytes} bytes: page number = ${virtualAddress} ÷ ${pageSizeBytes} = ${page}, offset = ${virtualAddress} mod ${pageSizeBytes} = ${offset}. The page number says which page; the offset says how far into that page.`,
      highlight: { page },
    },
    {
      id: "lookup",
      phase: "lookup",
      title: "Look up the page table",
      description: `The hardware uses page number ${page} as an index into this process's page table and reads entry ${page}.`,
      highlight: { page },
    },
  ];

  // A reference to a page outside the configured address space is the
  // one genuinely invalid case — worth distinguishing from a page
  // fault, since conflating the two is a common misunderstanding.
  if (!entry) {
    steps.push({
      id: "invalid",
      phase: "decision",
      title: "No such page",
      description: `Page ${page} is outside this process's ${state.config.pageCount}-page address space, so there is no page table entry to read. That is an invalid reference, which is a different thing from a page fault.`,
      highlight: {},
    });
    return {
      steps,
      next: state,
      fault: false,
      virtualAddress,
      page,
      offset,
      frame: -1,
      physicalAddress: -1,
      victimPage: null,
      replaced: false,
    };
  }

  const nextEntries = state.entries.map((e) => ({ ...e }));
  const nextFrames = [...state.frames];
  const clock = state.clock + 1;
  let victimPage: number | null = null;
  let replaced = false;
  let frame: number;
  const fault = !entry.present;

  steps.push({
    id: "decision",
    phase: "decision",
    title: "Is the present bit set?",
    description: fault
      ? `Entry ${page} has its present bit clear, so page ${page} is not currently in any frame. This access cannot complete yet.`
      : `Entry ${page} has its present bit set and names frame ${entry.frame}. The page is already resident, so no fault is needed.`,
    highlight: { page, ...(fault ? {} : { frame: entry.frame ?? undefined }) },
  });

  if (!fault) {
    frame = entry.frame!;
    steps.push({
      id: "hit",
      phase: "hit",
      title: "Frame number found",
      description: `Page ${page} maps to frame ${frame}. The page table has done its job: it turned a virtual page number into a physical frame number.`,
      highlight: { page, frame },
    });
  } else {
    steps.push({
      id: "fault",
      phase: "fault",
      title: "PAGE FAULT",
      description: `The hardware raises a page fault and hands control to the operating system. ${PAGE_FAULT_NOTE}`,
      highlight: { page },
    });
    steps.push({
      id: "storage",
      phase: "storage",
      title: "Locate the page in backing storage",
      description: `The OS finds page ${page} in backing storage, where the parts of the address space that are not currently resident are kept.`,
      highlight: { page, storage: true },
    });

    const free = nextFrames.findIndex((p) => p === null);
    if (free !== -1) {
      frame = free;
      steps.push({
        id: "load",
        phase: "load",
        title: `Load page ${page} into free frame ${frame}`,
        description: `Frame ${frame} is empty, so no page has to be evicted. This is demand paging in action: the page was brought in only at the moment it was actually needed.`,
        highlight: { page, frame, storage: true },
      });
    } else {
      replaced = true;
      victimPage = chooseVictim(state, options.algorithm, options.future ?? []);
      const victimEntry = victimPage === null ? undefined : nextEntries[victimPage];
      frame = victimEntry?.frame ?? 0;
      steps.push({
        id: "victim",
        phase: "load",
        title: "RAM is full — choose a victim",
        description: `${victimPage === null ? "No page could be chosen." : victimReason(options.algorithm, victimPage)}${victimEntry?.dirty ? ` Page ${victimPage} is dirty, so its changes must be written back to backing storage before the frame is reused.` : victimEntry ? ` Page ${victimPage} is clean, so its frame can simply be reused without writing anything back.` : ""}`,
        highlight: { page, frame, victimPage: victimPage ?? undefined },
      });
      if (victimEntry) {
        victimEntry.present = false;
        victimEntry.frame = null;
        victimEntry.loadedAt = null;
        victimEntry.referenced = false;
        victimEntry.dirty = false;
      }
      steps.push({
        id: "load",
        phase: "load",
        title: `Load page ${page} into frame ${frame}`,
        description: `Frame ${frame} has been freed, and page ${page} is read into it from backing storage.`,
        highlight: { page, frame, storage: true },
      });
    }

    steps.push({
      id: "update",
      phase: "update",
      title: "Update the page table",
      description: `Entry ${page} now records frame ${frame} and has its present bit set.${victimPage !== null ? ` Entry ${victimPage} has had its present bit cleared, because that page is no longer in RAM.` : ""}`,
      highlight: { page, frame, victimPage: victimPage ?? undefined },
    });
    steps.push({
      id: "retry",
      phase: "retry",
      title: "Retry the instruction",
      description: `The OS restarts the instruction that faulted. This time the page table lookup finds page ${page} present in frame ${frame}, so the access proceeds normally.`,
      highlight: { page, frame },
    });
  }

  const physicalAddress = buildPhysicalAddress(frame, offset, pageSizeBytes);
  steps.push({
    id: "physical",
    phase: "physical",
    title: "Combine frame number and offset",
    description: `Physical address = frame ${frame} × ${pageSizeBytes} + offset ${offset} = ${physicalAddress}. Notice the offset is exactly the same ${offset} it was in the virtual address — translation replaces the page number with a frame number and leaves the offset alone.`,
    highlight: { page, frame },
  });

  const nextEntry = nextEntries[page]!;
  nextEntry.present = true;
  nextEntry.frame = frame;
  nextEntry.referenced = true;
  if (write) nextEntry.dirty = true;
  nextEntry.lastUsedAt = clock;
  if (fault) nextEntry.loadedAt = clock;
  nextFrames[frame] = page;

  return {
    steps,
    next: {
      ...state,
      entries: nextEntries,
      frames: nextFrames,
      clock,
      accesses: state.accesses + 1,
      faults: state.faults + (fault ? 1 : 0),
      hits: state.hits + (fault ? 0 : 1),
    },
    fault,
    virtualAddress,
    page,
    offset,
    frame,
    physicalAddress,
    victimPage,
    replaced,
  };
}

// ---------------------------------------------------------------------------
// Reference string laboratory (brief §11) and algorithm comparison (§12)
// ---------------------------------------------------------------------------

export const DEFAULT_REFERENCE_STRING = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2];

export interface ReferenceStep {
  index: number;
  page: number;
  fault: boolean;
  /** Frame contents AFTER this reference is handled. */
  frames: (number | null)[];
  victim: number | null;
  note: string;
  faultsSoFar: number;
  hitsSoFar: number;
}

export interface ReferenceRun {
  algorithm: Algorithm;
  frameCount: number;
  references: number[];
  steps: ReferenceStep[];
  faults: number;
  hits: number;
  /** Faults ÷ total references, 0–1. */
  faultRate: number;
}

/**
 * Run a whole reference string under one policy. Pure and cheap —
 * the UI runs this on every parameter change rather than keeping a
 * mutable simulation object around, which is what keeps stepping
 * backwards and forwards trivial.
 */
export function runReferenceString(
  references: number[],
  frameCount: number,
  algorithm: Algorithm,
): ReferenceRun {
  const frames: (number | null)[] = Array.from({ length: frameCount }, () => null);
  const loadedAt = new Map<number, number>();
  const usedAt = new Map<number, number>();
  const steps: ReferenceStep[] = [];
  let faults = 0;
  let hits = 0;

  references.forEach((page, index) => {
    const residentIndex = frames.indexOf(page);
    let victim: number | null = null;
    let note: string;

    if (residentIndex !== -1) {
      hits += 1;
      usedAt.set(page, index);
      note = `Page ${page} is already in frame ${residentIndex} — a page hit, so nothing has to be loaded.`;
    } else {
      faults += 1;
      const free = frames.indexOf(null);
      if (free !== -1) {
        frames[free] = page;
        note = `Page ${page} is not resident, so this is a page fault. Frame ${free} is free, so page ${page} is loaded there with nothing evicted.`;
        loadedAt.set(page, index);
        usedAt.set(page, index);
      } else {
        const resident = frames.filter((p): p is number => p !== null);
        if (algorithm === "optimal") {
          const future = references.slice(index + 1);
          let best = -1;
          victim = resident[0]!;
          for (const candidate of resident) {
            const nextUse = future.indexOf(candidate);
            if (nextUse === -1) {
              victim = candidate;
              best = Number.POSITIVE_INFINITY;
              break;
            }
            if (nextUse > best) {
              best = nextUse;
              victim = candidate;
            }
          }
        } else {
          const source = algorithm === "fifo" ? loadedAt : usedAt;
          victim = resident[0]!;
          let bestTick = Number.POSITIVE_INFINITY;
          for (const candidate of resident) {
            const tick = source.get(candidate) ?? 0;
            if (tick < bestTick) {
              bestTick = tick;
              victim = candidate;
            }
          }
        }
        const victimFrame = frames.indexOf(victim);
        frames[victimFrame] = page;
        loadedAt.delete(victim);
        usedAt.delete(victim);
        loadedAt.set(page, index);
        usedAt.set(page, index);
        note = `Page ${page} is not resident and every frame is full, so this is a page fault. ${victimReason(algorithm, victim)} Page ${page} takes over frame ${victimFrame}.`;
      }
    }

    steps.push({
      index,
      page,
      fault: residentIndex === -1,
      frames: [...frames],
      victim,
      note,
      faultsSoFar: faults,
      hitsSoFar: hits,
    });
  });

  return {
    algorithm,
    frameCount,
    references,
    steps,
    faults,
    hits,
    faultRate: references.length === 0 ? 0 : faults / references.length,
  };
}

export function compareAlgorithms(references: number[], frameCount: number): ReferenceRun[] {
  return (["fifo", "lru", "optimal"] as Algorithm[]).map((algorithm) =>
    runReferenceString(references, frameCount, algorithm),
  );
}

/** Tolerant parser for the reference-string input box: accepts spaces,
 *  commas, or both, and silently drops anything that isn't a
 *  non-negative integer rather than rejecting the whole string. */
export function parseReferenceString(raw: string, maxPage = 15): number[] {
  return raw
    .split(/[\s,]+/)
    .map((token) => Number.parseInt(token, 10))
    .filter((n) => Number.isInteger(n) && n >= 0 && n <= maxPage)
    .slice(0, 24);
}

// ---------------------------------------------------------------------------
// Page size experiment (brief §13) and internal fragmentation (§14)
// ---------------------------------------------------------------------------

/** Page sizes for the trade-off experiment, in KB — a separate, more
 *  realistic-feeling scale from the byte-level sizes used for address
 *  arithmetic. */
export const PAGE_SIZE_KB_OPTIONS = [1, 2, 4, 8, 16] as const;

export interface PageSizeAnalysis {
  pageSizeKB: number;
  processSizeKB: number;
  pagesNeeded: number;
  allocatedKB: number;
  internalFragmentationKB: number;
  /** Bits of a 16-bit illustrative address used for the offset. */
  offsetBits: number;
  pageNumberBits: number;
  /** Entries a single-level page table would need to cover the whole
   *  16-bit address space at this page size. */
  pageTableEntries: number;
}

export const ILLUSTRATIVE_ADDRESS_BITS = 16;

export function analyzePageSize(pageSizeKB: number, processSizeKB: number): PageSizeAnalysis {
  const pagesNeeded = Math.ceil(processSizeKB / pageSizeKB);
  const allocatedKB = pagesNeeded * pageSizeKB;
  const bits = offsetBits(pageSizeKB * 1024);
  const pageNumberBits = ILLUSTRATIVE_ADDRESS_BITS - bits;
  return {
    pageSizeKB,
    processSizeKB,
    pagesNeeded,
    allocatedKB,
    internalFragmentationKB: allocatedKB - processSizeKB,
    offsetBits: bits,
    pageNumberBits,
    pageTableEntries: 2 ** pageNumberBits,
  };
}

export const PAGE_SIZE_TRADEOFFS = {
  smaller: [
    "More pages for the same program, so a single-level page table needs more entries.",
    "Finer-grained allocation, so the last page wastes less space.",
    "Less data moved on each page fault.",
  ],
  larger: [
    "Fewer pages for the same program, so fewer page table entries.",
    "Coarser allocation, so the last page can waste considerably more space.",
    "More data transferred every time a page is loaded, whether or not all of it is needed.",
  ],
} as const;

export const INTERNAL_FRAGMENTATION_NOTE =
  "Paging allocates whole pages. A program almost never needs an exact multiple of the page size, so the final page is usually only partly filled — and the unused remainder inside that page is internal fragmentation.";

// ---------------------------------------------------------------------------
// TLB (brief §15)
// ---------------------------------------------------------------------------

export const TLB_CAPACITY = 3;

export interface TlbEntry {
  page: number;
  frame: number;
  /** Logical tick of last use — the TLB here evicts least-recently-used. */
  usedAt: number;
}

export interface TlbState {
  entries: TlbEntry[];
  hits: number;
  misses: number;
  /** Page table lookups avoided by TLB hits — the number the whole
   *  TLB idea exists to reduce. */
  pageTableLookups: number;
  clock: number;
}

export function createTlb(): TlbState {
  return { entries: [], hits: 0, misses: 0, pageTableLookups: 0, clock: 0 };
}

export interface TlbAccessResult {
  next: TlbState;
  hit: boolean;
  frame: number | null;
  evicted: number | null;
  narrative: string[];
}

/**
 * One TLB-mediated translation. A hit returns the frame straight from
 * the cached translation; a miss falls back to the page table and
 * then caches the translation it found. The TLB never holds page
 * contents — only page→frame translations (see `TLB_NOTE`).
 */
export function tlbAccess(tlb: TlbState, page: number, entries: PageTableEntry[]): TlbAccessResult {
  const clock = tlb.clock + 1;
  const cached = tlb.entries.find((e) => e.page === page);

  if (cached) {
    return {
      next: {
        ...tlb,
        clock,
        hits: tlb.hits + 1,
        entries: tlb.entries.map((e) => (e.page === page ? { ...e, usedAt: clock } : e)),
      },
      hit: true,
      frame: cached.frame,
      evicted: null,
      narrative: [
        `The CPU checks the TLB for page ${page}.`,
        `TLB HIT: a cached translation says page ${page} → frame ${cached.frame}.`,
        "The page table was not consulted at all — that saved lookup is exactly what a TLB is for.",
      ],
    };
  }

  const entry = entries[page];
  const narrative = [
    `The CPU checks the TLB for page ${page}.`,
    `TLB MISS: no cached translation for page ${page}, so the page table has to be consulted.`,
  ];

  if (!entry || !entry.present || entry.frame === null) {
    narrative.push(
      `Page ${page} is not present in RAM, so this access raises a page fault first. Nothing is cached in the TLB until a valid translation exists.`,
    );
    return {
      next: { ...tlb, clock, misses: tlb.misses + 1, pageTableLookups: tlb.pageTableLookups + 1 },
      hit: false,
      frame: null,
      evicted: null,
      narrative,
    };
  }

  narrative.push(`The page table gives page ${page} → frame ${entry.frame}.`);

  let nextEntries = [...tlb.entries];
  let evicted: number | null = null;
  if (nextEntries.length >= TLB_CAPACITY) {
    let oldest = nextEntries[0]!;
    for (const e of nextEntries) if (e.usedAt < oldest.usedAt) oldest = e;
    evicted = oldest.page;
    nextEntries = nextEntries.filter((e) => e.page !== oldest.page);
    narrative.push(
      `The TLB only holds ${TLB_CAPACITY} translations here, so the least recently used one (page ${evicted}) is dropped to make room.`,
    );
  }
  nextEntries.push({ page, frame: entry.frame, usedAt: clock });
  narrative.push(`The translation page ${page} → frame ${entry.frame} is now cached, so the next access to page ${page} can skip the page table.`);

  return {
    next: {
      ...tlb,
      clock,
      misses: tlb.misses + 1,
      pageTableLookups: tlb.pageTableLookups + 1,
      entries: nextEntries,
    },
    hit: false,
    frame: entry.frame,
    evicted,
    narrative,
  };
}

// ---------------------------------------------------------------------------
// Multi-process isolation (brief §16)
// ---------------------------------------------------------------------------

export interface IsolationProcess {
  id: string;
  name: string;
  color: string;
  /** page → frame for this process's own page table. */
  mapping: { page: number; frame: number }[];
}

/**
 * Two processes whose page 0 and page 1 map to completely different
 * frames. Kept deliberately small: the point is that the same virtual
 * page number means different physical memory in different processes,
 * not a full security model.
 */
export const ISOLATION_PROCESSES: IsolationProcess[] = [
  {
    id: "proc-a",
    name: "Process A",
    color: "#B45309",
    mapping: [
      { page: 0, frame: 2 },
      { page: 1, frame: 5 },
    ],
  },
  {
    id: "proc-b",
    name: "Process B",
    color: "#0891b2",
    mapping: [
      { page: 0, frame: 4 },
      { page: 1, frame: 1 },
    ],
  },
];

export const ISOLATION_FRAME_COUNT = 6;

export const ISOLATION_NOTE =
  "Each process has its own page table, so page 0 means something different in each one. Process A's page 0 and Process B's page 0 are different pages of different address spaces that happen to share a number — they do not overlap in physical memory.";

/**
 * Conceptual model for the Virtual Memory Simulator (the "Virtual
 * Memory Laboratory").
 *
 * SCOPE BOUNDARY (deliberate): this simulator teaches the CONCEPT of
 * virtual memory — a process's virtual address space, residency,
 * address translation, backing storage, memory pressure, working
 * set, and process isolation — using abstract virtual regions. It
 * does NOT implement pages, frames, page tables, page-to-frame
 * mapping, page faults, page replacement (FIFO/LRU/optimal), or a
 * TLB. Those all belong to a later Paging simulation, referenced
 * here only as `PAGING_PREVIEW_NOTE`.
 *
 * This simulation is intentionally separate from, but connects to:
 *  - Memory Management Simulator: that topic covers how physical RAM
 *    is allocated/freed and fragmented across processes. This topic
 *    covers the layer above it — how a process gets a virtual
 *    address space that doesn't have to fit entirely in that RAM.
 *  - Process Management Simulator: each simulated process here has
 *    the same kind of identity (name, id) introduced there.
 *
 * IMPORTANT accuracy notes, surfaced directly in the UI:
 *  - Virtual memory is NOT "RAM pretending to be bigger" — it's a
 *    memory-management abstraction the OS and hardware maintain.
 *  - Not all virtual memory is "stored on disk" — backing storage is
 *    ONE mechanism that can support it, not a universal description.
 *  - Virtual memory does not always make programs faster, does not
 *    eliminate the need for RAM, and not every memory access
 *    requires a storage access.
 *  - A process's entire virtual address space does not need to exist
 *    physically in RAM at once.
 *  - Virtual memory alone does not provide complete security.
 *  - Not all operating systems implement virtual memory identically.
 *  - All numeric values in this simulator are illustrative simulation
 *    values, not measurements of any real system.
 */

// ---------------------------------------------------------------------------
// Virtual address space
// ---------------------------------------------------------------------------

export type RegionKind = "code" | "data" | "heap-active" | "heap-unused" | "free" | "stack";

export interface VirtualRegion {
  id: string;
  kind: RegionKind;
  label: string;
  /** Illustrative size, in GB. */
  sizeGB: number;
  /** Whether this region's contents are currently resident in physical RAM.
   *  "Free Virtual Space" (kind "free") is unmapped address range, not
   *  memory content, so it's excluded from resident/non-resident
   *  accounting entirely — see `residentGB`/`nonResidentGB`. */
  resident: boolean;
  /** Working-set flag: whether the process is actively using this
   *  region right now, independent of residency (see WORKING_SET_NOTE). */
  active: boolean;
}

export interface SimProcess {
  id: string;
  name: string;
  color: string;
  /** Illustrative total virtual address-space size, in GB. */
  virtualSizeGB: number;
  regions: VirtualRegion[];
  /** A single illustrative "shared-looking" virtual address every
   *  process uses for the Process Isolation demonstration — the same
   *  label on purpose, since the whole point is that identical
   *  virtual addresses in different processes refer to different
   *  underlying memory. */
  isolationVirtualAddress: string;
}

const REGION_KIND_LABELS: Record<RegionKind, string> = {
  code: "Program Code",
  data: "Global Data",
  "heap-active": "Heap (active)",
  "heap-unused": "Heap (reserved, unused)",
  free: "Free Virtual Space",
  stack: "Stack",
};

function region(kind: RegionKind, sizeGB: number, resident: boolean, active: boolean, idSuffix: string): VirtualRegion {
  return { id: `region-${idSuffix}-${kind}`, kind, label: REGION_KIND_LABELS[kind], sizeGB, resident, active };
}

/** A fresh copy of the starting sample processes — a function (not a
 *  constant) so every session gets independent objects it can safely
 *  mutate via state updates. Sizes are chosen so each process's
 *  regions sum exactly to its virtualSizeGB, and so their combined
 *  virtual demand (8.5 GB) comfortably exceeds PHYSICAL_RAM_GB (4 GB)
 *  — a built-in overcommit illustration (see section on Memory
 *  Pressure / Overcommit). */
export function createInitialProcesses(): SimProcess[] {
  return [
    {
      id: "process-a",
      name: "Process A",
      color: "#2563eb",
      virtualSizeGB: 4,
      isolationVirtualAddress: "0x1000",
      regions: [
        region("code", 0.3, true, true, "a"),
        region("data", 0.2, true, true, "a"),
        region("heap-active", 0.5, true, true, "a"),
        region("heap-unused", 1.5, false, false, "a"),
        region("free", 1.3, false, false, "a"),
        region("stack", 0.2, true, true, "a"),
      ],
    },
    {
      id: "process-b",
      name: "Process B",
      color: "#16a34a",
      virtualSizeGB: 2,
      isolationVirtualAddress: "0x1000",
      regions: [
        region("code", 0.15, true, true, "b"),
        region("data", 0.1, true, true, "b"),
        region("heap-active", 0.3, true, true, "b"),
        region("heap-unused", 0.6, false, false, "b"),
        region("free", 0.5, false, false, "b"),
        region("stack", 0.15, true, true, "b"),
      ],
    },
    {
      id: "process-c",
      name: "Process C",
      color: "#d97706",
      virtualSizeGB: 2.5,
      isolationVirtualAddress: "0x2400",
      regions: [
        region("code", 0.2, true, true, "c"),
        region("data", 0.15, true, true, "c"),
        region("heap-active", 0.35, true, true, "c"),
        region("heap-unused", 0.7, false, false, "c"),
        region("free", 0.9, false, false, "c"),
        region("stack", 0.2, true, true, "c"),
      ],
    },
  ];
}

/** Resident memory total for a process, in GB — excludes "free"
 *  (unmapped) regions, since those aren't memory content at all. */
export function residentGB(process: SimProcess): number {
  return process.regions.filter((r) => r.kind !== "free" && r.resident).reduce((sum, r) => sum + r.sizeGB, 0);
}

/** Non-resident memory total for a process, in GB — mapped memory
 *  content (code/data/heap/stack) that isn't currently resident. */
export function nonResidentGB(process: SimProcess): number {
  return process.regions.filter((r) => r.kind !== "free" && !r.resident).reduce((sum, r) => sum + r.sizeGB, 0);
}

// ---------------------------------------------------------------------------
// Physical RAM (illustrative capacity, not a byte-addressed block model —
// that level of detail belongs to the Memory Management Simulator)
// ---------------------------------------------------------------------------

/** Illustrative physical RAM capacity, in GB — deliberately small so
 *  memory pressure is easy to reach in the simulator, matching the
 *  brief's own "Physical RAM = 4 GB" example. */
export const PHYSICAL_RAM_GB = 4;

/** Illustrative fixed OS reservation within physical RAM. */
export const OS_RESERVED_RAM_GB = 0.4;

export function totalResidentGB(processes: SimProcess[]): number {
  return processes.reduce((sum, p) => sum + residentGB(p), 0);
}

export function freeRamGB(processes: SimProcess[]): number {
  return Math.max(0, PHYSICAL_RAM_GB - OS_RESERVED_RAM_GB - totalResidentGB(processes));
}

export function totalVirtualDemandGB(processes: SimProcess[]): number {
  return processes.reduce((sum, p) => sum + p.virtualSizeGB, 0);
}

// ---------------------------------------------------------------------------
// Address translation (simplified — no page tables)
// ---------------------------------------------------------------------------

export type AccessStepId = "generate" | "translate" | "check-residency" | "obtain-data" | "continue";

export interface AccessStep {
  id: AccessStepId;
  title: string;
  description: (resident: boolean) => string;
}

export const ACCESS_STEPS: AccessStep[] = [
  {
    id: "generate",
    title: "Process generates a virtual address",
    description: () => "The process references memory using a virtual address — a value meaningful only within its own virtual address space.",
  },
  {
    id: "translate",
    title: "Address translation mechanism is consulted",
    description: () => "The OS/hardware's memory-management mechanism looks up what this virtual address actually corresponds to. (Simplified Address Translation — real systems use more sophisticated hardware and OS mechanisms, commonly including paging, covered in a later simulation.)",
  },
  {
    id: "check-residency",
    title: "System checks residency",
    description: (resident) => resident
      ? "The required memory is currently resident in physical RAM."
      : "The required memory is NOT currently resident in physical RAM.",
  },
  {
    id: "obtain-data",
    title: "Data is accessed or obtained",
    description: (resident) => resident
      ? "Since the data is already resident, the process can access it directly in RAM."
      : "Since the data isn't resident, the system must obtain it from backing storage before the access can continue.",
  },
  {
    id: "continue",
    title: "Process continues",
    description: (resident) => resident
      ? "The access completes and the process continues running."
      : "Once the needed data is available, the process continues running.",
  },
];

// ---------------------------------------------------------------------------
// Backing storage
// ---------------------------------------------------------------------------

export const BACKING_STORAGE_NOTE =
  "When memory contents aren't currently resident in RAM, the operating system may use storage as backing for virtual memory. This doesn't mean all virtual memory is simply \"RAM stored on disk\" — virtual memory is a memory-management abstraction, and backing storage is one mechanism that can support it.";

// ---------------------------------------------------------------------------
// Memory pressure
// ---------------------------------------------------------------------------

/** How much resident memory each additional simulated process
 *  requests immediately, in GB, in the Memory Pressure lab. */
export const PRESSURE_REQUEST_GB = 0.6;

export const MEMORY_PRESSURE_DENIED_NOTE =
  "There isn't enough free physical RAM for this request right now. In a real system, the OS could move some other content out to backing storage to make room — deciding exactly what to move is the job of a page-replacement mechanism, covered in a later simulation. This simulator doesn't implement that decision.";

// ---------------------------------------------------------------------------
// Working set
// ---------------------------------------------------------------------------

export const WORKING_SET_NOTE =
  "The working set is a conceptual way to describe the memory a process is actively using during a period of execution — a subset of its full virtual address space. A region can be resident without currently being part of the active working set, and vice versa in principle.";

// ---------------------------------------------------------------------------
// Process isolation
// ---------------------------------------------------------------------------

export const ISOLATION_NOTE =
  "Two processes can each use the exact same virtual address value while that address refers to completely different underlying memory — this is one of the most important reasons virtual address spaces exist. Memory protection here is implemented through hardware/OS mechanisms tied to each process's address space; virtual memory alone is not a complete security system.";

// ---------------------------------------------------------------------------
// Overcommit
// ---------------------------------------------------------------------------

export const OVERCOMMIT_NOTE =
  "Total virtual address-space demand across all processes can exceed physical RAM capacity — that doesn't automatically mean all of it must simultaneously occupy RAM. Virtual address-space size, resident physical memory, and backing-storage availability are three distinct things. This doesn't mean arbitrary overcommit is always safe or guaranteed to work.";

// ---------------------------------------------------------------------------
// Paging preview (explicitly NOT implemented here)
// ---------------------------------------------------------------------------

export const PAGING_PREVIEW_NOTE =
  "One common implementation technique for virtual memory is paging — dividing memory into fixed-size pages and frames, tracked with page tables, with page faults and page-replacement algorithms (like FIFO or LRU) deciding what to keep resident. That mechanism is the focus of a later simulation, not this one.";

// ---------------------------------------------------------------------------
// Detail level (progressive complexity)
// ---------------------------------------------------------------------------

export type DetailLevel = "beginner" | "intermediate" | "advanced";

export const DETAIL_LEVEL_LABELS: Record<DetailLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export const DETAIL_LEVEL_DESCRIPTIONS: Record<DetailLevel, string> = {
  beginner: "Process → Virtual Memory → RAM → Storage, at a glance.",
  intermediate: "Adds virtual/physical addresses, resident/non-resident regions, memory pressure, and process isolation.",
  advanced: "Adds address translation detail, working set, and full memory statistics.",
};

export const VIRTUAL_MEMORY_DISCLAIMER =
  "Simplified Educational Model. All sizes and addresses shown are illustrative simulation values, not measurements of any real system. Real operating systems implement virtual memory with more detail and nuance than shown here, and specifics vary between systems.";

/**
 * Conceptual data model for the CPU–RAM–Storage Data Flow simulation
 * ("Computer Architecture / Instruction Execution Laboratory").
 *
 * This is still deliberately NOT a physics-style continuous simulation
 * and NOT a real CPU emulator — there's no general-purpose instruction
 * decoder here, only a small, fully scripted set of conceptual "steps"
 * per mode, each describing one piece of data/instruction/address/
 * control-signal moving between two components, or one component
 * changing state. That's intentional: the brief is explicit that this
 * is "an educational conceptual model," not a full CPU. Every register
 * value, memory address, and cache outcome below is hand-authored so
 * it always tells a coherent, technically-defensible story — never
 * computed generically from arbitrary input.
 *
 * Everything here is labeled, where it matters, as a simplified
 * teaching model rather than a literal claim about how every modern
 * CPU is built (see `ARCHITECTURE_DISCLAIMER` and each mode's own
 * `caveat` field) — real CPUs vary in cache topology, don't always use
 * three discrete parallel buses, and pipeline/overlap the fetch-
 * decode-execute cycle in ways this single-instruction-at-a-time model
 * doesn't attempt to show.
 */

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

export type ComponentId =
  | "storage"
  | "ram"
  | "l3"
  | "l2"
  | "l1"
  | "addressBus"
  | "dataBus"
  | "controlBus"
  | "pc"
  | "ir"
  | "controlUnit"
  | "r1"
  | "r2"
  | "alu";

export interface ComponentDef {
  id: ComponentId;
  label: string;
  /** Short category shown as a kicker above the label in panels. */
  group: "Storage & Memory" | "Cache" | "Buses" | "CPU";
  /** Always-available explanation shown when the component is clicked/tapped. */
  description: string;
}

export const COMPONENTS: Record<ComponentId, ComponentDef> = {
  storage: {
    id: "storage",
    label: "Storage",
    group: "Storage & Memory",
    description:
      "An SSD or hard drive. Holds the operating system, programs, and files persistently — even with the power off. Far slower to access than RAM, so the CPU never executes directly out of it; anything storage holds has to be copied into RAM first.",
  },
  ram: {
    id: "ram",
    label: "RAM (Main Memory)",
    group: "Storage & Memory",
    description:
      "Temporary working memory, organized into addressable locations (see Memory Access mode). Holds whichever program's instructions and data are currently running. Much faster than storage, much slower than cache — and everything in it is lost when the power goes off.",
  },
  l3: {
    id: "l3",
    label: "L3 Cache",
    group: "Cache",
    description:
      "The outermost, largest, and slowest layer of CPU cache — still far faster than RAM. Shared across all of a CPU's cores on many designs. Checked only after both L1 and L2 miss.",
  },
  l2: {
    id: "l2",
    label: "L2 Cache",
    group: "Cache",
    description: "A mid-sized, mid-speed cache layer between L1 and L3. Larger and slower than L1, smaller and faster than L3.",
  },
  l1: {
    id: "l1",
    label: "L1 Cache",
    group: "Cache",
    description:
      "The smallest and fastest cache layer, built directly into the CPU core. The first place the CPU looks for data or instructions it needs.",
  },
  addressBus: {
    id: "addressBus",
    label: "Address Bus",
    group: "Buses",
    description:
      "Carries the address of the memory location the CPU wants to read from or write to — never the data itself, just \"which location.\" In this teaching model it's drawn as its own pathway between the CPU and RAM.",
  },
  dataBus: {
    id: "dataBus",
    label: "Data Bus",
    group: "Buses",
    description:
      "Carries the actual data or instruction being transferred, in either direction — memory to CPU on a read, CPU to memory on a write.",
  },
  controlBus: {
    id: "controlBus",
    label: "Control Bus",
    group: "Buses",
    description:
      "Carries coordination signals rather than addresses or data — things like \"this is a read,\" \"this is a write,\" or \"memory is ready.\" It's what tells the other two buses how to interpret what's on them.",
  },
  pc: {
    id: "pc",
    label: "Program Counter (PC)",
    group: "CPU",
    description: "Holds the address of the next instruction to fetch. Advances automatically once the current instruction has been fetched.",
  },
  ir: {
    id: "ir",
    label: "Instruction Register (IR)",
    group: "CPU",
    description: "Holds the instruction currently being decoded and executed, once it's been fetched from memory/cache.",
  },
  controlUnit: {
    id: "controlUnit",
    label: "Control Unit",
    group: "CPU",
    description:
      "Reads the instruction sitting in the IR and figures out what it means — which operation, which registers, which addresses — then directs the rest of the CPU to carry it out.",
  },
  r1: {
    id: "r1",
    label: "Register R1",
    group: "CPU",
    description: "A small, extremely fast general-purpose storage slot inside the CPU, used to hold a value the ALU is actively working with.",
  },
  r2: {
    id: "r2",
    label: "Register R2",
    group: "CPU",
    description: "A second general-purpose register — same role as R1, holding another value the current instruction needs.",
  },
  alu: {
    id: "alu",
    label: "ALU (Arithmetic Logic Unit)",
    group: "CPU",
    description: "The component that actually performs an instruction's calculation or comparison — addition here — once the Control Unit has decoded what to do.",
  },
};

export const ARCHITECTURE_DISCLAIMER =
  "This is a simplified educational model. Real CPUs vary in cache layout, don't all use three separate physical buses in exactly this way, and typically overlap fetch/decode/execute across multiple instructions at once (pipelining) instead of finishing one fully before starting the next.";

// ---------------------------------------------------------------------------
// Registers
// ---------------------------------------------------------------------------

export type RegisterId = "pc" | "ir" | "r1" | "r2";

export interface RegisterSnapshot {
  pc: number;
  /** Human-readable mnemonic, or null before anything has been fetched. */
  ir: string | null;
  r1: number;
  r2: number;
}

export const INITIAL_REGISTERS: RegisterSnapshot = { pc: 1000, ir: null, r1: 0, r2: 3 };

// ---------------------------------------------------------------------------
// Addressable memory
// ---------------------------------------------------------------------------

export type MemoryCellKind = "instruction" | "data";

export interface MemoryCell {
  address: number;
  kind: MemoryCellKind;
  /** Instruction mnemonic, or current numeric value for a data cell. */
  value: string | number;
  label: string;
}

/**
 * A tiny fixed program plus the two data cells it reads/writes,
 * loaded at addresses 1000–1005. This is the same program every mode
 * (Instruction Execution, Memory Access, Full System) refers back to,
 * so a student who's stepped through one mode recognizes the same
 * addresses and values in the next.
 */
export const MEMORY_CELLS: MemoryCell[] = [
  { address: 1000, kind: "instruction", value: "LOAD R1, [1004]", label: "Load Value A into R1" },
  { address: 1001, kind: "instruction", value: "ADD R1, R2", label: "R1 = R1 + R2" },
  { address: 1002, kind: "instruction", value: "STORE [1005], R1", label: "Store R1 into Result" },
  { address: 1003, kind: "instruction", value: "HALT", label: "Stop execution" },
  { address: 1004, kind: "data", value: 5, label: "Value A" },
  { address: 1005, kind: "data", value: 0, label: "Result (not yet written)" },
];

export function getMemoryCell(address: number): MemoryCell | undefined {
  return MEMORY_CELLS.find((cell) => cell.address === address);
}

// ---------------------------------------------------------------------------
// Cache hierarchy (conceptual — relative, not literal timing numbers)
// ---------------------------------------------------------------------------

export interface CacheLevelDef {
  id: "l1" | "l2" | "l3";
  name: string;
  relativeSize: string;
  relativeSpeed: string;
}

export const CACHE_LEVELS: CacheLevelDef[] = [
  { id: "l1", name: "L1 Cache", relativeSize: "Smallest", relativeSpeed: "Fastest" },
  { id: "l2", name: "L2 Cache", relativeSize: "Medium", relativeSpeed: "Slower than L1" },
  { id: "l3", name: "L3 Cache", relativeSize: "Largest (of the three)", relativeSpeed: "Slower than L2, still far faster than RAM" },
];

// ---------------------------------------------------------------------------
// Generic step engine — shared by every mode's animation
// ---------------------------------------------------------------------------

export interface FlowStep {
  id: string;
  /** Every component this step should visually highlight as "active." */
  activeComponents: ComponentId[];
  /** When set, a labeled packet animates from -> to along the diagram. */
  from?: ComponentId;
  to?: ComponentId;
  packetLabel?: string;
  /** Which bus (if any) this step lights up, and what's traveling on it. */
  busSignal?: { bus: "addressBus" | "dataBus" | "controlBus"; value: string };
  /** Register values to display as of this step (a full snapshot, not a diff). */
  registers?: Partial<RegisterSnapshot>;
  /** What's shown in the explanation / live-region panel for this step. */
  explanation: string;
}

// ---------------------------------------------------------------------------
// Mode 2 — Instruction Execution (Fetch → Decode → Execute)
// ---------------------------------------------------------------------------

export type ExecutionStage = "fetch" | "decode" | "execute";

export interface InstructionExecution {
  address: number;
  mnemonic: string;
  /** One-paragraph plain-language summary of what this instruction does. */
  summary: string;
  steps: Record<ExecutionStage, FlowStep[]>;
}

export const INSTRUCTION_EXECUTIONS: InstructionExecution[] = [
  {
    address: 1000,
    mnemonic: "LOAD R1, [1004]",
    summary: "Copies the value stored at memory address 1004 into register R1.",
    steps: {
      fetch: [
        {
          id: "load-fetch-1",
          activeComponents: ["pc", "addressBus"],
          busSignal: { bus: "addressBus", value: "1000" },
          registers: { pc: 1000, ir: null, r1: 0, r2: 3 },
          explanation: "The Program Counter holds address 1000 — the next instruction to fetch. That address goes out on the address bus.",
        },
        {
          id: "load-fetch-2",
          activeComponents: ["l1", "ram"],
          from: "ram",
          to: "l1",
          packetLabel: "LOAD R1, [1004]",
          explanation: "The CPU checks its cache hierarchy first; assume this program was just loaded, so it isn't cached yet and the instruction comes from RAM.",
        },
        {
          id: "load-fetch-3",
          activeComponents: ["ir", "dataBus"],
          from: "l1",
          to: "ir",
          busSignal: { bus: "dataBus", value: "LOAD R1, [1004]" },
          packetLabel: "LOAD R1, [1004]",
          registers: { pc: 1001, ir: "LOAD R1, [1004]", r1: 0, r2: 3 },
          explanation: "The instruction arrives over the data bus and is placed in the Instruction Register. The Program Counter advances to 1001, ready for next time.",
        },
      ],
      decode: [
        {
          id: "load-decode-1",
          activeComponents: ["ir", "controlUnit"],
          registers: { pc: 1001, ir: "LOAD R1, [1004]", r1: 0, r2: 3 },
          explanation: "The Control Unit reads the IR: operation \"LOAD\", destination register R1, source address 1004.",
        },
      ],
      execute: [
        {
          id: "load-execute-1",
          activeComponents: ["controlUnit", "addressBus"],
          busSignal: { bus: "addressBus", value: "1004" },
          explanation: "The Control Unit requests address 1004 — address 1004 goes out on the address bus.",
        },
        {
          id: "load-execute-2",
          activeComponents: ["l1", "l2", "l3", "ram"],
          from: "ram",
          to: "l1",
          packetLabel: "5",
          explanation: "Not found in cache yet, so the value (5) is read from RAM. A copy is also kept in L1 in case it's needed again soon.",
        },
        {
          id: "load-execute-3",
          activeComponents: ["r1", "dataBus"],
          from: "l1",
          to: "r1",
          busSignal: { bus: "dataBus", value: "5" },
          packetLabel: "5",
          registers: { pc: 1001, ir: "LOAD R1, [1004]", r1: 5, r2: 3 },
          explanation: "The value 5 travels over the data bus into register R1. R1 now holds 5.",
        },
      ],
    },
  },
  {
    address: 1001,
    mnemonic: "ADD R1, R2",
    summary: "Adds register R2's value into register R1, replacing R1's old value with the sum.",
    steps: {
      fetch: [
        {
          id: "add-fetch-1",
          activeComponents: ["pc", "addressBus"],
          busSignal: { bus: "addressBus", value: "1001" },
          registers: { pc: 1001, ir: "LOAD R1, [1004]", r1: 5, r2: 3 },
          explanation: "The Program Counter now holds 1001 — the next instruction. That address goes out on the address bus.",
        },
        {
          id: "add-fetch-2",
          activeComponents: ["l1"],
          from: "l1",
          to: "ir",
          packetLabel: "ADD R1, R2",
          busSignal: { bus: "dataBus", value: "ADD R1, R2" },
          registers: { pc: 1002, ir: "ADD R1, R2", r1: 5, r2: 3 },
          explanation: "This time the instruction is already sitting in L1 from earlier in the program — a cache hit, so it arrives almost immediately. The IR updates and the PC advances to 1002.",
        },
      ],
      decode: [
        {
          id: "add-decode-1",
          activeComponents: ["ir", "controlUnit"],
          registers: { pc: 1002, ir: "ADD R1, R2", r1: 5, r2: 3 },
          explanation: "The Control Unit decodes: operation \"ADD\", operands R1 and R2, result goes back into R1.",
        },
      ],
      execute: [
        {
          id: "add-execute-1",
          activeComponents: ["r1", "r2", "alu"],
          from: "r1",
          to: "alu",
          packetLabel: "R1 = 5",
          explanation: "R1's value (5) and R2's value (3) are sent to the ALU.",
        },
        {
          id: "add-execute-2",
          activeComponents: ["alu", "r1"],
          from: "alu",
          to: "r1",
          packetLabel: "8",
          registers: { pc: 1002, ir: "ADD R1, R2", r1: 8, r2: 3 },
          explanation: "The ALU computes 5 + 3 = 8 and writes the result back into R1. R1 now holds 8; R2 is unchanged.",
        },
      ],
    },
  },
  {
    address: 1002,
    mnemonic: "STORE [1005], R1",
    summary: "Writes register R1's current value out to memory address 1005.",
    steps: {
      fetch: [
        {
          id: "store-fetch-1",
          activeComponents: ["pc", "addressBus"],
          busSignal: { bus: "addressBus", value: "1002" },
          registers: { pc: 1002, ir: "ADD R1, R2", r1: 8, r2: 3 },
          explanation: "Program Counter holds 1002. That address goes out on the address bus.",
        },
        {
          id: "store-fetch-2",
          activeComponents: ["ram", "l1"],
          from: "ram",
          to: "ir",
          packetLabel: "STORE [1005], R1",
          busSignal: { bus: "dataBus", value: "STORE [1005], R1" },
          registers: { pc: 1003, ir: "STORE [1005], R1", r1: 8, r2: 3 },
          explanation: "This instruction wasn't cached yet, so it's fetched from RAM into the IR. The Program Counter advances to 1003.",
        },
      ],
      decode: [
        {
          id: "store-decode-1",
          activeComponents: ["ir", "controlUnit"],
          registers: { pc: 1003, ir: "STORE [1005], R1", r1: 8, r2: 3 },
          explanation: "The Control Unit decodes: operation \"STORE\", source register R1, destination address 1005 — a write, not a read.",
        },
      ],
      execute: [
        {
          id: "store-execute-1",
          activeComponents: ["controlUnit", "addressBus", "controlBus"],
          busSignal: { bus: "controlBus", value: "WRITE" },
          explanation: "The Control Unit signals \"write\" on the control bus and puts destination address 1005 on the address bus.",
        },
        {
          id: "store-execute-2",
          activeComponents: ["r1", "dataBus"],
          from: "r1",
          to: "ram",
          packetLabel: "8",
          busSignal: { bus: "dataBus", value: "8" },
          explanation: "R1's value (8) travels out over the data bus toward RAM — the reverse direction from a read.",
        },
        {
          id: "store-execute-3",
          activeComponents: ["ram"],
          explanation:
            "RAM address 1005 is updated to 8. Note this is a write to RAM, not to persistent storage — the value is only saved permanently if a program later writes it to disk (see the Overview mode's \"Saving a File\" idea).",
        },
      ],
    },
  },
];

// ---------------------------------------------------------------------------
// Mode 3 — Memory Access
// ---------------------------------------------------------------------------

export type MemoryOperation = "read" | "write";

/** Builds a short, generic read/write step sequence for any memory cell —
 *  used by Memory Access mode when the student picks a cell to inspect,
 *  independent of the scripted program above. */
export function buildMemoryAccessSteps(cell: MemoryCell, operation: MemoryOperation): FlowStep[] {
  if (operation === "read") {
    return [
      {
        id: `mem-read-${cell.address}-1`,
        activeComponents: ["controlUnit", "addressBus"],
        busSignal: { bus: "addressBus", value: String(cell.address) },
        explanation: `The CPU puts address ${cell.address} on the address bus — this identifies which memory location it wants, not the data itself.`,
      },
      {
        id: `mem-read-${cell.address}-2`,
        activeComponents: ["ram"],
        explanation: `RAM locates address ${cell.address} and prepares to send back what it holds: ${cell.kind === "instruction" ? `the instruction "${cell.value}"` : `the value ${cell.value}`}.`,
      },
      {
        id: `mem-read-${cell.address}-3`,
        activeComponents: ["ram", "dataBus", "controlUnit"],
        from: "ram",
        to: "controlUnit",
        packetLabel: String(cell.value),
        busSignal: { bus: "dataBus", value: String(cell.value) },
        explanation: `The ${cell.kind === "instruction" ? "instruction" : "data"} travels back over the data bus to the CPU.`,
      },
    ];
  }
  return [
    {
      id: `mem-write-${cell.address}-1`,
      activeComponents: ["controlUnit", "addressBus", "controlBus"],
      busSignal: { bus: "controlBus", value: "WRITE" },
      explanation: `The CPU signals a write on the control bus and puts destination address ${cell.address} on the address bus.`,
    },
    {
      id: `mem-write-${cell.address}-2`,
      activeComponents: ["controlUnit", "dataBus", "ram"],
      from: "controlUnit",
      to: "ram",
      packetLabel: String(cell.value),
      busSignal: { bus: "dataBus", value: String(cell.value) },
      explanation: `The value ${cell.value} travels out over the data bus, in the opposite direction from a read.`,
    },
    {
      id: `mem-write-${cell.address}-3`,
      activeComponents: ["ram"],
      explanation: `RAM address ${cell.address} is updated. This changes RAM only — it has no effect on storage unless a program separately saves it there.`,
    },
  ];
}

// ---------------------------------------------------------------------------
// Mode 4 — Cache hit / miss
// ---------------------------------------------------------------------------

export const CACHE_DEMOS: { cold: FlowStep[]; warm: FlowStep[] } = {
  cold: [
    { id: "cold-1", activeComponents: ["l1"], explanation: "The CPU asks L1 Cache for address 2050. L1 doesn't have it — a miss." },
    { id: "cold-2", activeComponents: ["l2"], explanation: "L2 Cache is checked next. Also a miss." },
    { id: "cold-3", activeComponents: ["l3"], explanation: "L3 Cache is checked. Still a miss — this data has never been requested before." },
    {
      id: "cold-4",
      activeComponents: ["ram", "l3", "l2", "l1"],
      from: "ram",
      to: "l1",
      packetLabel: "Data found",
      explanation: "RAM has the data. It's returned to the CPU, and — because it was just used — a copy is kept in the cache levels so a future request can be answered faster.",
    },
  ],
  warm: [
    {
      id: "warm-1",
      activeComponents: ["l1"],
      from: "l1",
      to: "controlUnit",
      packetLabel: "Data found",
      explanation: "The CPU asks L1 Cache for the same address again. This time it's already cached — a hit — so the data returns almost immediately, without ever going to RAM.",
    },
  ],
};

export const LOCALITY_NOTES = {
  temporal: "Temporal locality: data that was just used is likely to be used again soon — like this repeated request.",
  spatial: "Spatial locality: data stored near an address that was just used is also likely to be needed soon, so caches typically pull in a small neighborhood of nearby addresses, not just the exact one requested.",
};

// ---------------------------------------------------------------------------
// Mode 5 — Bus Explorer
// ---------------------------------------------------------------------------

export interface BusWalkthrough {
  bus: "addressBus" | "dataBus" | "controlBus";
  title: string;
  description: string;
  example: FlowStep;
}

export const BUS_WALKTHROUGHS: BusWalkthrough[] = [
  {
    bus: "addressBus",
    title: "Address Bus",
    description: "Identifies which memory location is being accessed. Carries an address only — never the data stored there.",
    example: {
      id: "bus-address-example",
      activeComponents: ["controlUnit", "addressBus"],
      busSignal: { bus: "addressBus", value: "1004" },
      explanation: "The CPU wants the value at address 1004, so 1004 — and only 1004 — goes out on the address bus.",
    },
  },
  {
    bus: "dataBus",
    title: "Data Bus",
    description: "Carries the actual data or instruction being transferred — direction depends on whether it's a read (memory → CPU) or a write (CPU → memory).",
    example: {
      id: "bus-data-example",
      activeComponents: ["ram", "dataBus", "controlUnit"],
      from: "ram",
      to: "controlUnit",
      packetLabel: "5",
      busSignal: { bus: "dataBus", value: "5" },
      explanation: "In response to that address request, the value stored there (5) travels back over the data bus.",
    },
  },
  {
    bus: "controlBus",
    title: "Control Bus",
    description: "Carries coordination signals — read, write, and \"ready\" style signals that tell the other buses how to interpret what's on them.",
    example: {
      id: "bus-control-example",
      activeComponents: ["controlUnit", "controlBus"],
      busSignal: { bus: "controlBus", value: "READ" },
      explanation: "A \"READ\" signal on the control bus tells RAM this request is asking to retrieve data, not to overwrite it.",
    },
  },
];

// ---------------------------------------------------------------------------
// Mode 6 — Full System Simulation ("Run a Program")
// ---------------------------------------------------------------------------

export const FULL_SYSTEM_SCENARIO: FlowStep[] = [
  {
    id: "full-1",
    activeComponents: ["storage"],
    explanation: "The program sits on persistent storage before it runs — three instructions and two data values, none of it in RAM yet.",
  },
  {
    id: "full-2",
    activeComponents: ["storage", "ram"],
    from: "storage",
    to: "ram",
    packetLabel: "Program + data",
    explanation: "The operating system loads the program's instructions and data from storage into RAM addresses 1000–1005, so the CPU can access them quickly.",
  },
  {
    id: "full-3",
    activeComponents: ["pc", "addressBus"],
    busSignal: { bus: "addressBus", value: "1000" },
    registers: { pc: 1000, ir: null, r1: 0, r2: 3 },
    explanation: "The Program Counter identifies address 1000 as the first instruction to fetch.",
  },
  {
    id: "full-4",
    activeComponents: ["l1", "l2", "l3", "ram"],
    from: "ram",
    to: "l1",
    packetLabel: "LOAD R1, [1004]",
    explanation: "The CPU checks its cache hierarchy first (L1 → L2 → L3); nothing is cached yet on a fresh run, so the instruction comes from RAM.",
  },
  {
    id: "full-5",
    activeComponents: ["ir", "dataBus"],
    from: "l1",
    to: "ir",
    busSignal: { bus: "dataBus", value: "LOAD R1, [1004]" },
    packetLabel: "LOAD R1, [1004]",
    registers: { pc: 1001, ir: "LOAD R1, [1004]", r1: 0, r2: 3 },
    explanation: "The instruction enters the Instruction Register. The Program Counter advances to 1001.",
  },
  {
    id: "full-6",
    activeComponents: ["ir", "controlUnit"],
    explanation: "The Control Unit decodes it: load the value at address 1004 into R1.",
  },
  {
    id: "full-7",
    activeComponents: ["ram", "l1", "r1", "dataBus"],
    from: "ram",
    to: "r1",
    packetLabel: "5",
    busSignal: { bus: "dataBus", value: "5" },
    registers: { pc: 1001, ir: "LOAD R1, [1004]", r1: 5, r2: 3 },
    explanation: "Address 1004's value (5) is retrieved and placed in register R1, with a copy kept in L1.",
  },
  {
    id: "full-8",
    activeComponents: ["l1", "ir"],
    from: "l1",
    to: "ir",
    packetLabel: "ADD R1, R2",
    registers: { pc: 1002, ir: "ADD R1, R2", r1: 5, r2: 3 },
    explanation: "Fetch repeats for address 1001 — this time it's a cache hit in L1, so it's noticeably quicker. The Control Unit decodes an ADD of R1 and R2.",
  },
  {
    id: "full-9",
    activeComponents: ["r1", "r2", "alu"],
    from: "r2",
    to: "alu",
    packetLabel: "R1 + R2",
    explanation: "R1 (5) and R2 (3) are sent to the ALU to be added.",
  },
  {
    id: "full-10",
    activeComponents: ["alu", "r1"],
    from: "alu",
    to: "r1",
    packetLabel: "8",
    registers: { pc: 1002, ir: "ADD R1, R2", r1: 8, r2: 3 },
    explanation: "The ALU computes 8 and the result is written back into register R1.",
  },
  {
    id: "full-11",
    activeComponents: ["ram", "ir"],
    from: "ram",
    to: "ir",
    packetLabel: "STORE [1005], R1",
    registers: { pc: 1003, ir: "STORE [1005], R1", r1: 8, r2: 3 },
    explanation: "The final instruction fetches from RAM (a miss this time), decodes as: write R1 to address 1005.",
  },
  {
    id: "full-12",
    activeComponents: ["r1", "dataBus", "controlBus", "ram"],
    from: "r1",
    to: "ram",
    packetLabel: "8",
    busSignal: { bus: "dataBus", value: "8" },
    explanation: "R1's value (8) is written to RAM address 1005 — this updates working memory only, not storage yet.",
  },
  {
    id: "full-13",
    activeComponents: ["ram", "storage"],
    from: "ram",
    to: "storage",
    packetLabel: "Save result",
    explanation: "If — and only if — the application later asks to save, that result in RAM is written out to persistent storage. Until that happens, it would be lost if the computer powered off.",
  },
  {
    id: "full-14",
    activeComponents: ["storage"],
    explanation: "The result now survives even after the program closes or the computer restarts — the distinction between RAM's working copy and storage's permanent copy.",
  },
];

// ---------------------------------------------------------------------------
// Modes registry
// ---------------------------------------------------------------------------

export type ModeId = "overview" | "instruction" | "memory" | "cache" | "buses" | "full-system";

export interface ModeDef {
  id: ModeId;
  label: string;
  shortLabel: string;
  description: string;
}

export const MODES: ModeDef[] = [
  { id: "overview", label: "Overview", shortLabel: "Overview", description: "The whole architecture at a glance, plus a 3D view of the physical layout." },
  { id: "instruction", label: "Instruction Execution", shortLabel: "Execute", description: "Watch one instruction go through Fetch → Decode → Execute." },
  { id: "memory", label: "Memory Access", shortLabel: "Memory", description: "Explore addressable memory and how the CPU reads and writes it." },
  { id: "cache", label: "Cache", shortLabel: "Cache", description: "Run a cache hit and a cache miss and compare what happens." },
  { id: "buses", label: "Bus Explorer", shortLabel: "Buses", description: "See what travels on the address, data, and control buses." },
  { id: "full-system", label: "Full System Simulation", shortLabel: "Run a Program", description: "A complete guided run: storage → RAM → cache → registers → ALU → back to storage." },
];

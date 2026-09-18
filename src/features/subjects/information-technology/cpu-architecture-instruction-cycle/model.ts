/**
 * Conceptual data model + pure simulation engine for the "Virtual CPU
 * Laboratory" (CPU Architecture & Instruction Cycle).
 *
 * This topic answers "what happens INSIDE the CPU when it executes an
 * instruction?" — a different question from the existing CPU–RAM–
 * Storage Data Flow simulation, which answers "how does data move
 * BETWEEN the CPU, RAM, and storage?" (buses, cache hits/misses,
 * memory hierarchy). Nothing here repeats that topic's bus/cache
 * model; it links out to it instead (see `DATA_FLOW_LINK`). It is
 * also distinct from the Computer Components & Hardware Explorer
 * (physical parts, not internal execution) and Binary & Data
 * Representation (how values are represented, not how instructions
 * run) — see `BINARY_LINK` / `COMPONENTS_LINK`.
 *
 * Like the CPU–RAM–Storage Data Flow model, this is deliberately NOT
 * a real CPU emulator: a small, fixed instruction set, fixed-size
 * simulated instructions (one per address), and a single register
 * file are enough to make the fetch → decode → execute → write-back
 * cycle concrete without pretending to model a specific commercial
 * processor. Every simplification is called out in
 * `ARCHITECTURE_DISCLAIMER` and the relevant inline copy — see spec
 * section 38 ("Technical accuracy") this file was built against.
 */

// ---------------------------------------------------------------------------
// Instruction set
// ---------------------------------------------------------------------------

export type RegisterId = "R0" | "R1" | "R2" | "R3";
export const REGISTER_IDS: RegisterId[] = ["R0", "R1", "R2", "R3"];

export type Opcode = "LOAD" | "ADD" | "SUB" | "AND" | "OR" | "XOR" | "CMP" | "STORE" | "JUMP" | "BEQ" | "NOP";

export const OPCODES: Opcode[] = ["LOAD", "ADD", "SUB", "AND", "OR", "XOR", "CMP", "STORE", "JUMP", "BEQ", "NOP"];

export const OPCODE_INFO: Record<Opcode, { summary: string; syntax: string; category: "data" | "alu" | "branch" | "misc" }> = {
  LOAD: { summary: "Load an immediate (constant) value into a register.", syntax: "LOAD Rd, imm", category: "data" },
  ADD: { summary: "Add two registers; store the result in the first.", syntax: "ADD Rd, Rs", category: "alu" },
  SUB: { summary: "Subtract the second register from the first; store the result in the first.", syntax: "SUB Rd, Rs", category: "alu" },
  AND: { summary: "Bitwise AND of two registers; store the result in the first.", syntax: "AND Rd, Rs", category: "alu" },
  OR: { summary: "Bitwise OR of two registers; store the result in the first.", syntax: "OR Rd, Rs", category: "alu" },
  XOR: { summary: "Bitwise XOR of two registers; store the result in the first.", syntax: "XOR Rd, Rs", category: "alu" },
  CMP: { summary: "Compare two registers by subtracting them; sets flags only, no register is written.", syntax: "CMP Rd, Rs", category: "alu" },
  STORE: { summary: "Write a register's value to a simulated memory address.", syntax: "STORE Rd, addr", category: "data" },
  JUMP: { summary: "Unconditionally set the Program Counter to a new address.", syntax: "JUMP addr", category: "branch" },
  BEQ: { summary: "Branch to an address only if two registers are equal.", syntax: "BEQ Rd, Rs, addr", category: "branch" },
  NOP: { summary: "Do nothing this cycle — a placeholder instruction.", syntax: "NOP", category: "misc" },
};

export interface DecodedInstruction {
  opcode: Opcode;
  rd?: RegisterId;
  rs?: RegisterId;
  imm?: number;
  addr?: number;
}

export interface ProgramInstruction {
  address: number;
  text: string;
  decoded: DecodedInstruction;
}

export interface ParseError {
  line: number;
  text: string;
  message: string;
}

export interface CompileResult {
  instructions: ProgramInstruction[];
  errors: ParseError[];
}

export const PROGRAM_START_ADDRESS = 100;

const REG_RE = /^R[0-3]$/;

function parseRegister(token: string): RegisterId | null {
  const t = token.trim().toUpperCase();
  return REG_RE.test(t) ? (t as RegisterId) : null;
}

function parseInt10(token: string): number | null {
  const t = token.trim();
  if (!/^-?\d+$/.test(t)) return null;
  return Number.parseInt(t, 10);
}

/** Parses a small, fixed instruction set (see `OPCODE_INFO`) from plain
 *  text, one instruction per line. Pure function — no state, safe to
 *  call on every keystroke. Unparseable lines are collected as
 *  `errors` rather than thrown, so a typo never crashes the lab. */
export function compileProgram(source: string): CompileResult {
  const lines = source
    .split("\n")
    .map((l) => l.replace(/#.*$/, "").trim())
    .filter((l) => l.length > 0);

  const instructions: ProgramInstruction[] = [];
  const errors: ParseError[] = [];

  lines.forEach((line, i) => {
    const address = PROGRAM_START_ADDRESS + instructions.length;
    const match = line.match(/^([A-Za-z]+)\s*(.*)$/);
    if (!match) {
      errors.push({ line: i + 1, text: line, message: "Could not read an instruction here." });
      return;
    }
    const opRaw = (match[1] ?? "").toUpperCase();
    const rest = match[2] ?? "";
    const parts = rest.length > 0 ? rest.split(",").map((p) => p.trim()) : [];

    if (!OPCODES.includes(opRaw as Opcode)) {
      errors.push({ line: i + 1, text: line, message: `Unknown instruction "${opRaw}". Try one of: ${OPCODES.join(", ")}.` });
      return;
    }
    const opcode = opRaw as Opcode;

    const fail = (msg: string) => errors.push({ line: i + 1, text: line, message: msg });

    switch (opcode) {
      case "LOAD": {
        const rd = parts[0] ? parseRegister(parts[0]) : null;
        const imm = parts[1] ? parseInt10(parts[1]) : null;
        if (!rd || imm === null) return fail(`Expected "LOAD Rd, imm" (e.g. LOAD R1, 5).`);
        instructions.push({ address, text: line, decoded: { opcode, rd, imm } });
        return;
      }
      case "ADD":
      case "SUB":
      case "AND":
      case "OR":
      case "XOR":
      case "CMP": {
        const rd = parts[0] ? parseRegister(parts[0]) : null;
        const rs = parts[1] ? parseRegister(parts[1]) : null;
        if (!rd || !rs) return fail(`Expected "${opcode} Rd, Rs" (e.g. ${opcode} R1, R2).`);
        instructions.push({ address, text: line, decoded: { opcode, rd, rs } });
        return;
      }
      case "STORE": {
        const rd = parts[0] ? parseRegister(parts[0]) : null;
        const addr = parts[1] ? parseInt10(parts[1]) : null;
        if (!rd || addr === null) return fail(`Expected "STORE Rd, addr" (e.g. STORE R1, 200).`);
        instructions.push({ address, text: line, decoded: { opcode, rd, addr } });
        return;
      }
      case "JUMP": {
        const addr = parts[0] ? parseInt10(parts[0]) : null;
        if (addr === null) return fail(`Expected "JUMP addr" (e.g. JUMP 105).`);
        instructions.push({ address, text: line, decoded: { opcode, addr } });
        return;
      }
      case "BEQ": {
        const rd = parts[0] ? parseRegister(parts[0]) : null;
        const rs = parts[1] ? parseRegister(parts[1]) : null;
        const addr = parts[2] ? parseInt10(parts[2]) : null;
        if (!rd || !rs || addr === null) return fail(`Expected "BEQ Rd, Rs, addr" (e.g. BEQ R1, R2, 110).`);
        instructions.push({ address, text: line, decoded: { opcode, rd, rs, addr } });
        return;
      }
      case "NOP": {
        instructions.push({ address, text: line, decoded: { opcode } });
        return;
      }
    }
  });

  return { instructions, errors };
}

// ---------------------------------------------------------------------------
// Execution engine
// ---------------------------------------------------------------------------

export type CycleStage = "fetch" | "decode" | "execute" | "writeback";
export const CYCLE_STAGES: CycleStage[] = ["fetch", "decode", "execute", "writeback"];
export const STAGE_LABELS: Record<CycleStage, string> = {
  fetch: "Fetch",
  decode: "Decode",
  execute: "Execute",
  writeback: "Write Back",
};

export interface Flags {
  zero: boolean;
  negative: boolean;
  carry: boolean;
  overflow: boolean;
}

export const INITIAL_FLAGS: Flags = { zero: false, negative: false, carry: false, overflow: false };

export type Registers = Record<RegisterId, number>;
export const INITIAL_REGISTERS: Registers = { R0: 0, R1: 0, R2: 0, R3: 0 };

/** Which conceptual CPU part(s) a step should visually highlight — see
 *  `CPU_PARTS` below for the diagram this drives. */
export type CpuPartId = "controlUnit" | "alu" | "registers" | "pc" | "ir" | "flags" | "bus" | "memory" | "cache" | "clock";

export interface AluOperation {
  inputA: number;
  inputB: number;
  op: string;
  result: number;
}

export interface CycleStep {
  id: string;
  cycle: number;
  instructionIndex: number;
  stage: CycleStage;
  pcBefore: number;
  pcAfter: number;
  ir: { address: number; text: string };
  decoded: DecodedInstruction;
  registersBefore: Registers;
  registersAfter: Registers;
  flagsBefore: Flags;
  flagsAfter: Flags;
  memoryWrite?: { address: number; value: number };
  alu?: AluOperation;
  branchTaken?: boolean;
  changedRegister?: RegisterId;
  activeParts: CpuPartId[];
  explanation: string;
}

function computeAlu(op: Opcode, a: number, b: number): AluOperation {
  switch (op) {
    case "ADD":
      return { inputA: a, inputB: b, op: "ADD", result: a + b };
    case "SUB":
    case "CMP":
      return { inputA: a, inputB: b, op: "SUB", result: a - b };
    case "AND":
      return { inputA: a, inputB: b, op: "AND", result: a & b };
    case "OR":
      return { inputA: a, inputB: b, op: "OR", result: a | b };
    case "XOR":
      return { inputA: a, inputB: b, op: "XOR", result: a ^ b };
    default:
      return { inputA: a, inputB: b, op, result: a };
  }
}

function flagsFor(op: Opcode, alu: AluOperation | undefined, prev: Flags): Flags {
  if (!alu) return prev;
  const result = alu.result;
  const isArith = op === "ADD" || op === "SUB" || op === "CMP";
  return {
    zero: result === 0,
    negative: result < 0,
    carry: isArith && op !== "SUB" && op !== "CMP" ? result > 255 : false,
    overflow: isArith && (result > 127 || result < -128),
  };
}

/**
 * Runs a compiled program to completion (or `maxCycles`, guarding
 * against runaway loops in a student-written branch) and returns one
 * `CycleStep` per micro-step (fetch/decode/execute/write-back) of
 * every instruction executed — in program order, following any taken
 * branches. Treating one micro-step as one clock cycle is an explicit
 * teaching simplification (see `CLOCK_DISCLAIMER`); real CPUs do not
 * uniformly take four cycles per instruction.
 */
export function simulateProgram(instructions: ProgramInstruction[], maxCycles = 400): CycleStep[] {
  if (instructions.length === 0) return [];

  const byAddress = new Map(instructions.map((instr) => [instr.address, instr]));
  const minAddr = instructions[0]!.address;
  const maxAddr = instructions[instructions.length - 1]!.address;

  let pc = minAddr;
  let registers: Registers = { ...INITIAL_REGISTERS };
  let flags: Flags = { ...INITIAL_FLAGS };
  const memory = new Map<number, number>();
  const steps: CycleStep[] = [];
  let cycle = 0;
  let instructionIndex = 0;

  while (pc >= minAddr && pc <= maxAddr && cycle < maxCycles) {
    const instr = byAddress.get(pc);
    if (!instr) break;
    const pcBefore = pc;
    const decoded = instr.decoded;
    const registersBefore = { ...registers };
    const flagsBefore = { ...flags };

    // FETCH
    const pcAfterFetch = pc + 1;
    cycle += 1;
    steps.push({
      id: `${instr.address}-fetch`,
      cycle,
      instructionIndex,
      stage: "fetch",
      pcBefore,
      pcAfter: pcAfterFetch,
      ir: { address: instr.address, text: instr.text },
      decoded,
      registersBefore,
      registersAfter: registersBefore,
      flagsBefore,
      flagsAfter: flagsBefore,
      activeParts: ["pc", "bus", "memory", "ir"],
      explanation: `Program Counter (PC = ${pcBefore}) points at the next instruction. Memory[${pcBefore}] ("${instr.text}") is read onto the bus and loaded into the Instruction Register. PC advances to ${pcAfterFetch}.`,
    });

    // DECODE
    cycle += 1;
    steps.push({
      id: `${instr.address}-decode`,
      cycle,
      instructionIndex,
      stage: "decode",
      pcBefore: pcAfterFetch,
      pcAfter: pcAfterFetch,
      ir: { address: instr.address, text: instr.text },
      decoded,
      registersBefore,
      registersAfter: registersBefore,
      flagsBefore,
      flagsAfter: flagsBefore,
      activeParts: ["ir", "controlUnit"],
      explanation: decodeExplanation(decoded),
    });

    // EXECUTE
    let alu: AluOperation | undefined;
    let branchTaken: boolean | undefined;
    let pcAfterExecute = pcAfterFetch;
    const registersAfterExecute = { ...registersBefore };
    let flagsAfterExecute = flagsBefore;

    switch (decoded.opcode) {
      case "LOAD": {
        alu = { inputA: decoded.imm ?? 0, inputB: 0, op: "PASS", result: decoded.imm ?? 0 };
        break;
      }
      case "ADD":
      case "SUB":
      case "AND":
      case "OR":
      case "XOR":
      case "CMP": {
        const a = registersBefore[decoded.rd as RegisterId];
        const b = registersBefore[decoded.rs as RegisterId];
        alu = computeAlu(decoded.opcode, a, b);
        flagsAfterExecute = flagsFor(decoded.opcode, alu, flagsBefore);
        break;
      }
      case "STORE": {
        alu = { inputA: registersBefore[decoded.rd as RegisterId], inputB: 0, op: "PASS", result: registersBefore[decoded.rd as RegisterId] };
        break;
      }
      case "JUMP": {
        pcAfterExecute = decoded.addr ?? pcAfterFetch;
        break;
      }
      case "BEQ": {
        const a = registersBefore[decoded.rd as RegisterId];
        const b = registersBefore[decoded.rs as RegisterId];
        branchTaken = a === b;
        if (branchTaken) pcAfterExecute = decoded.addr ?? pcAfterFetch;
        break;
      }
      case "NOP":
        break;
    }

    cycle += 1;
    steps.push({
      id: `${instr.address}-execute`,
      cycle,
      instructionIndex,
      stage: "execute",
      pcBefore: pcAfterFetch,
      pcAfter: pcAfterExecute,
      ir: { address: instr.address, text: instr.text },
      decoded,
      registersBefore,
      registersAfter: registersAfterExecute,
      flagsBefore,
      flagsAfter: flagsAfterExecute,
      alu,
      branchTaken,
      activeParts:
        decoded.opcode === "JUMP" || decoded.opcode === "BEQ" ? ["controlUnit", "pc"] : ["alu", "registers", "flags"],
      explanation: executeExplanation(decoded, alu, branchTaken, pcAfterExecute),
    });

    // WRITE BACK
    let changedRegister: RegisterId | undefined;
    let memoryWrite: { address: number; value: number } | undefined;
    const registersAfterWriteback = { ...registersAfterExecute };

    if (
      (decoded.opcode === "LOAD" ||
        decoded.opcode === "ADD" ||
        decoded.opcode === "SUB" ||
        decoded.opcode === "AND" ||
        decoded.opcode === "OR" ||
        decoded.opcode === "XOR") &&
      decoded.rd &&
      alu
    ) {
      registersAfterWriteback[decoded.rd] = alu.result;
      changedRegister = decoded.rd;
    }
    if (decoded.opcode === "STORE" && decoded.addr !== undefined && decoded.rd) {
      const value = registersBefore[decoded.rd];
      memory.set(decoded.addr, value);
      memoryWrite = { address: decoded.addr, value };
    }

    registers = registersAfterWriteback;
    flags = flagsAfterExecute;
    pc = pcAfterExecute;

    cycle += 1;
    steps.push({
      id: `${instr.address}-writeback`,
      cycle,
      instructionIndex,
      stage: "writeback",
      pcBefore: pcAfterExecute,
      pcAfter: pcAfterExecute,
      ir: { address: instr.address, text: instr.text },
      decoded,
      registersBefore: registersAfterExecute,
      registersAfter: registersAfterWriteback,
      flagsBefore: flagsAfterExecute,
      flagsAfter: flagsAfterExecute,
      memoryWrite,
      changedRegister,
      activeParts: memoryWrite ? ["memory", "bus"] : changedRegister ? ["registers"] : ["controlUnit"],
      explanation: writebackExplanation(decoded, changedRegister, memoryWrite),
    });

    instructionIndex += 1;
  }

  return steps;
}

function decodeExplanation(decoded: DecodedInstruction): string {
  const { opcode } = decoded;
  const info = OPCODE_INFO[opcode];
  const opText =
    decoded.rd && decoded.rs
      ? `${decoded.rd}, ${decoded.rs}${decoded.addr !== undefined ? `, ${decoded.addr}` : ""}`
      : decoded.rd && decoded.imm !== undefined
        ? `${decoded.rd}, ${decoded.imm}`
        : decoded.rd && decoded.addr !== undefined
          ? `${decoded.rd}, ${decoded.addr}`
          : decoded.addr !== undefined
            ? `${decoded.addr}`
            : "";
  return `The Control Unit splits the Instruction Register into an opcode and its operands: Opcode = ${opcode}, Operands = ${opText || "(none)"}. ${info.summary}`;
}

function executeExplanation(decoded: DecodedInstruction, alu: AluOperation | undefined, branchTaken: boolean | undefined, pcAfter: number): string {
  switch (decoded.opcode) {
    case "LOAD":
      return `The immediate value ${decoded.imm} is passed through the ALU on its way to ${decoded.rd}.`;
    case "ADD":
    case "SUB":
    case "AND":
    case "OR":
    case "XOR":
      return `${decoded.rd} and ${decoded.rs} enter the ALU. ALU performs ${decoded.opcode}: ${alu?.inputA} ${symbolFor(decoded.opcode)} ${alu?.inputB} = ${alu?.result}.`;
    case "CMP":
      return `${decoded.rd} and ${decoded.rs} enter the ALU, which computes ${alu?.inputA} − ${alu?.inputB} = ${alu?.result} purely to set the flags — no register is written.`;
    case "STORE":
      return `The value in ${decoded.rd} (${alu?.result}) is prepared to be written to memory address ${decoded.addr}.`;
    case "JUMP":
      return `The Control Unit sets the Program Counter directly to ${decoded.addr}, so the next fetch reads from there instead of the next sequential address.`;
    case "BEQ":
      return branchTaken
        ? `${decoded.rd} equals ${decoded.rs}, so the branch is taken — PC is set to ${pcAfter}.`
        : `${decoded.rd} does not equal ${decoded.rs}, so the branch is not taken — PC continues to ${pcAfter}.`;
    case "NOP":
      return "No operation this cycle — the Control Unit simply advances.";
  }
}

function symbolFor(op: Opcode): string {
  switch (op) {
    case "ADD":
      return "+";
    case "SUB":
      return "−";
    case "AND":
      return "AND";
    case "OR":
      return "OR";
    case "XOR":
      return "XOR";
    default:
      return "";
  }
}

function writebackExplanation(decoded: DecodedInstruction, changedRegister: RegisterId | undefined, memoryWrite: { address: number; value: number } | undefined): string {
  if (memoryWrite) return `The ALU result travels back across the bus and is written to Memory[${memoryWrite.address}] = ${memoryWrite.value}.`;
  if (changedRegister) return `The ALU result is written back into ${changedRegister}.`;
  if (decoded.opcode === "CMP") return "Flags were already updated during Execute. No register or memory changes on Write Back.";
  if (decoded.opcode === "JUMP" || decoded.opcode === "BEQ") return "Control-flow instructions write no register or memory value — only the Program Counter changed, during Execute.";
  return "Nothing to write back this cycle.";
}

// ---------------------------------------------------------------------------
// CPU parts — diagram + component inspector content
// ---------------------------------------------------------------------------

export interface CpuPartDef {
  id: CpuPartId;
  label: string;
  shortLabel: string;
  purpose: string;
  detail: string;
  minLevel: DetailLevel;
}

export type DetailLevel = "beginner" | "intermediate" | "technical";
export const DETAIL_LEVELS: DetailLevel[] = ["beginner", "intermediate", "technical"];
export const DETAIL_LEVEL_LABELS: Record<DetailLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  technical: "Technical",
};
export const DETAIL_LEVEL_DESCRIPTIONS: Record<DetailLevel, string> = {
  beginner: "CPU, Registers, ALU, Control Unit, and the Fetch–Decode–Execute–Write Back cycle.",
  intermediate: "Adds the Program Counter, Instruction Register, memory addresses, flags, the clock, and branches.",
  technical: "Adds instruction encoding, opcode/operands, the pipeline concept, cache, and data paths.",
};

export const CPU_PARTS: CpuPartDef[] = [
  {
    id: "controlUnit",
    label: "Control Unit",
    shortLabel: "CU",
    purpose: "Coordinates every other part of the CPU during instruction execution.",
    detail:
      "The Control Unit doesn't do arithmetic itself — it reads the decoded opcode and generates the conceptual \"control signals\" that tell the ALU what operation to run, which registers to read or write, and when. Think of it as the CPU's conductor.",
    minLevel: "beginner",
  },
  {
    id: "alu",
    label: "Arithmetic Logic Unit (ALU)",
    shortLabel: "ALU",
    purpose: "Performs arithmetic (add, subtract) and logical (AND, OR, XOR, compare) operations.",
    detail:
      "The ALU takes two inputs, applies one operation, and produces a result plus status information (used to set the Flags register). It never decides which operation to run on its own — the Control Unit tells it what to do.",
    minLevel: "beginner",
  },
  {
    id: "registers",
    label: "Register File",
    shortLabel: "Regs",
    purpose: "A small set of very fast storage locations inside the CPU.",
    detail:
      "Registers hold the values an instruction is actively working with. They're far faster than RAM but hold far less — this lab simulates four general-purpose registers, R0–R3.",
    minLevel: "beginner",
  },
  {
    id: "pc",
    label: "Program Counter (PC)",
    shortLabel: "PC",
    purpose: "Holds the memory address of the next instruction to fetch.",
    detail:
      "The PC increments after each fetch so the CPU naturally moves through a program in order — unless a branch or jump instruction explicitly changes it, which is how loops and conditionals work at this level.",
    minLevel: "intermediate",
  },
  {
    id: "ir",
    label: "Instruction Register (IR)",
    shortLabel: "IR",
    purpose: "Holds the instruction currently being decoded and executed.",
    detail:
      "Once Fetch copies an instruction out of memory, it lives in the IR for the rest of that instruction's cycle, so Decode and Execute always know exactly which instruction they're working on.",
    minLevel: "intermediate",
  },
  {
    id: "flags",
    label: "Status / Flags Register",
    shortLabel: "Flags",
    purpose: "A small set of true/false bits describing the last ALU result.",
    detail:
      "This lab tracks four flags — Zero (result was 0), Negative (result was negative), Carry, and Overflow. Real architectures vary in exactly which flags they define and precisely when each one is set; this is a simplified, illustrative set.",
    minLevel: "intermediate",
  },
  {
    id: "bus",
    label: "CPU Bus",
    shortLabel: "Bus",
    purpose: "The conceptual pathway data travels along between components.",
    detail:
      "\"Bus\" here stands in for the electrical pathways connecting the CPU's internal parts and its connection out to memory. Real CPUs have several distinct buses and paths; this lab shows one simplified conceptual bus for clarity.",
    minLevel: "technical",
  },
  {
    id: "memory",
    label: "Memory Interface",
    shortLabel: "Mem I/F",
    purpose: "Where the CPU reads instructions from and writes data to simulated memory.",
    detail:
      "This lab's memory model is intentionally minimal — just enough to fetch instructions and run STORE — because how the CPU, RAM, and storage actually interact is the CPU–RAM–Storage Data Flow simulation's job, not this one's.",
    minLevel: "beginner",
  },
  {
    id: "cache",
    label: "Cache (conceptual)",
    shortLabel: "Cache",
    purpose: "A small, fast layer between the CPU and RAM that keeps recently/frequently used data closer to the CPU.",
    detail:
      "This lab does not simulate cache hits or misses — that belongs to a future Cache simulation. It's shown here only so the instruction cycle's connection to memory makes sense in context: CPU → Cache → (miss) → RAM.",
    minLevel: "technical",
  },
  {
    id: "clock",
    label: "CPU Clock",
    shortLabel: "Clock",
    purpose: "The signal that paces every step of instruction execution.",
    detail:
      "Clock frequency (e.g. \"3.6 GHz\") describes cycles per second, not instructions per second — one instruction does not universally take exactly one clock cycle on real CPUs, which is why this lab treats a clock cycle as one micro-step of Fetch/Decode/Execute/Write Back rather than one whole instruction.",
    minLevel: "intermediate",
  },
];

// ---------------------------------------------------------------------------
// Scenarios / preset programs
// ---------------------------------------------------------------------------

export interface Scenario {
  id: string;
  title: string;
  description: string;
  source: string;
  minLevel: DetailLevel;
}

export const SCENARIOS: Scenario[] = [
  {
    id: "addition",
    title: "Addition",
    description: "Load two values and add them — watch 5 + 7 become 12 inside the ALU.",
    source: "LOAD R1, 5\nLOAD R2, 7\nADD R1, R2",
    minLevel: "beginner",
  },
  {
    id: "subtraction",
    title: "Subtraction",
    description: "Load two values and subtract one from the other.",
    source: "LOAD R1, 10\nLOAD R2, 3\nSUB R1, R2",
    minLevel: "beginner",
  },
  {
    id: "memory-store",
    title: "Memory Store",
    description: "Compute a result, then write it out to a simulated memory address.",
    source: "LOAD R1, 5\nLOAD R2, 7\nADD R1, R2\nSTORE R1, 200",
    minLevel: "beginner",
  },
  {
    id: "branch",
    title: "Conditional Branch",
    description: "See the Program Counter jump when a branch condition is true, skipping an instruction.",
    source: "LOAD R1, 5\nLOAD R2, 5\nBEQ R1, R2, 104\nLOAD R3, 99\nLOAD R3, 1",
    minLevel: "intermediate",
  },
  {
    id: "pipeline-demo",
    title: "Pipeline Demo",
    description: "Four independent instructions — used by Advanced Mode to show pipelined overlap.",
    source: "LOAD R1, 1\nLOAD R2, 2\nADD R1, R2\nSUB R1, R2",
    minLevel: "technical",
  },
];

// ---------------------------------------------------------------------------
// Pipeline (Advanced Mode)
// ---------------------------------------------------------------------------

export interface PipelineCell {
  instructionIndex: number;
  cycle: number;
  stage: CycleStage;
}

/** Builds the classic overlapping pipeline diagram — instruction *i*
 *  occupies Fetch at cycle *i*, Decode at *i+1*, Execute at *i+2*,
 *  Write Back at *i+3* — purely to illustrate the concept of
 *  overlap. This is intentionally independent from `simulateProgram`
 *  (which models one instruction fully occupying the CPU at a time)
 *  since a real pipeline is a distinct, more advanced idea layered on
 *  top of the basic cycle, not a variation of it. */
export function buildPipelineTable(instructionCount: number): { cells: PipelineCell[]; totalCycles: number } {
  const cells: PipelineCell[] = [];
  const totalCycles = instructionCount + CYCLE_STAGES.length - 1;
  for (let i = 0; i < instructionCount; i++) {
    CYCLE_STAGES.forEach((stage, stageIndex) => {
      cells.push({ instructionIndex: i, cycle: i + stageIndex + 1, stage });
    });
  }
  return { cells, totalCycles };
}

// ---------------------------------------------------------------------------
// Cross-links & disclaimers
// ---------------------------------------------------------------------------

export const COMPONENTS_LINK = {
  href: "/dashboard/information-technology/computer-components-explorer",
  label: "Review the physical CPU chip",
  description: "That lab shows the CPU as a physical part on the motherboard. This lab shows what happens logically inside it.",
};

export const DATA_FLOW_LINK = {
  href: "/dashboard/information-technology/cpu-ram-storage-data-flow",
  label: "See how the CPU, RAM, and storage work together",
  description: "This lab focuses on execution inside the CPU. The CPU–RAM–Storage Data Flow simulation shows the buses, cache, and memory hierarchy this instruction cycle depends on.",
};

export const BINARY_LINK = {
  href: "/dashboard/information-technology/binary-data-representation",
  label: "See how these values are represented in binary",
  description: "Every register value and ALU result here is really stored as binary — this simulation shows that representation in depth.",
};

export const ARCHITECTURE_DISCLAIMER =
  "This is an educational, simplified model of a generic CPU — not a reproduction of any specific commercial processor. Real CPUs vary in their exact register counts, instruction formats, flag behavior, and internal organization.";

export const CLOCK_DISCLAIMER =
  "Clock frequency represents cycles per second, but one instruction does not universally take exactly one clock cycle on real CPUs — this lab treats one micro-step (Fetch, Decode, Execute, or Write Back) as one clock cycle purely to keep the timeline concrete.";

export const PIPELINE_DISCLAIMER =
  "This shows the basic idea that multiple instructions can occupy different pipeline stages at the same time — not a complete model of a modern CPU's pipeline (which also has to handle hazards, stalls, and out-of-order execution).";

export function binaryOf(value: number, bits = 8): string {
  const v = ((value % 2 ** bits) + 2 ** bits) % 2 ** bits;
  return v.toString(2).padStart(bits, "0");
}

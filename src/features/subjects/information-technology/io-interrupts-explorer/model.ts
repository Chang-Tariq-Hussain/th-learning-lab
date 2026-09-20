/**
 * Conceptual model for the I/O & Interrupts Explorer (the "Computer I/O
 * & Interrupt Laboratory").
 *
 * Everything here is a pure function over plain data — no React, no
 * timers, no server. The lab components own the clock (a single
 * `setInterval` per running simulation) and simply call `stepEngine`.
 *
 * IMPORTANT accuracy note, surfaced directly in the UI (see the
 * `*_DISCLAIMER` constants): this is an *educational* model. Real
 * interrupt entry/return, priority handling, masking, vector lookup,
 * memory-mapped/port-mapped I/O and DMA all vary across architectures,
 * operating systems, and interrupt controllers. Timings are simulated
 * "ticks", not real hardware performance, and addresses/vector numbers
 * are invented for teaching.
 */

// ---------------------------------------------------------------------------
// Levels
// ---------------------------------------------------------------------------

export type Level = "beginner" | "intermediate" | "technical";

export const LEVELS: { id: Level; label: string; blurb: string }[] = [
  { id: "beginner", label: "Beginner", blurb: "I/O, devices, controllers, polling, interrupts, and the ISR." },
  { id: "intermediate", label: "Intermediate", blurb: "Adds interrupt priority, multiple interrupts, CPU state, the interrupt vector, and DMA." },
  { id: "technical", label: "Technical", blurb: "Adds masking, NMI, nesting, memory-mapped and port-mapped I/O, controller registers, and DMA completion interrupts." },
];

const LEVEL_RANK: Record<Level, number> = { beginner: 0, intermediate: 1, technical: 2 };

export function levelAtLeast(level: Level, needed: Level): boolean {
  return LEVEL_RANK[level] >= LEVEL_RANK[needed];
}

// ---------------------------------------------------------------------------
// Disclaimers (shown in the UI)
// ---------------------------------------------------------------------------

export const GENERAL_DISCLAIMER =
  "This is an educational model. Real interrupt entry and return, priority handling, masking, vector lookup, and DMA vary across CPU architectures, operating systems, and interrupt controllers. Times are simulated ticks, and addresses and vector numbers are invented for teaching.";
export const ISR_DISCLAIMER =
  "Simplified educational model of interrupt entry and return. Real hardware saves and restores state differently depending on the architecture and the operating system — often part in hardware, part in software.";
export const PRIORITY_DISCLAIMER =
  "This is a simplified educational priority model. Real interrupt priority mechanisms vary across architectures and operating systems.";
export const MASK_DISCLAIMER =
  "Exact masking behavior depends on the architecture and context — many CPUs also mask interrupts automatically while an ISR runs, and controllers can mask individual sources.";
export const NMI_DISCLAIMER =
  "A non-maskable interrupt is designed for critical conditions that shouldn't be ignored through ordinary interrupt masking. It is not tied to one universal hardware event, and exact behavior depends on the architecture.";
export const NESTING_DISCLAIMER =
  "Nesting is shown conceptually. This is not a model of any real hardware interrupt controller.";
export const VECTOR_DISCLAIMER =
  "Vector numbers and ISR addresses here are simulated. Actual vector table layouts, sizes, and lookup mechanisms differ between architectures.";
export const MMIO_DISCLAIMER =
  "Simulated addresses and registers. Real memory-mapped devices define their own register layouts, and their status/control behavior varies.";
export const PORT_DISCLAIMER =
  "Some architectures provide a separate I/O address space with dedicated instructions; others rely heavily on memory-mapped I/O. Neither approach is universal.";
export const DMA_DISCLAIMER =
  "All values are simulated ticks — not real hardware performance. DMA reduces CPU involvement in moving large blocks of data, but the CPU still configures and coordinates the transfer, and real systems vary.";
export const POLLING_NOTE =
  "Polling can consume CPU time repeatedly checking whether a device needs attention — but it isn't always bad. It can be simple, predictable, and efficient when a device is almost always ready or when checks are infrequent.";

// ---------------------------------------------------------------------------
// Devices
// ---------------------------------------------------------------------------

export type DeviceId = "keyboard" | "mouse" | "timer" | "storage" | "network" | "printer";
export type IrqSource = DeviceId | "nmi";

export interface DeviceInfo {
  id: DeviceId;
  label: string;
  icon: string;
  controller: string;
  /** Short controller name for tight diagram labels. */
  controllerShort: string;
  direction: "input" | "output" | "both";
  /** Label on the "generate event" button. */
  eventButton: string;
  /** Event description shown in the log, e.g. "Key pressed". */
  eventText: string;
  /** Simulated vector number (see `VECTOR_TABLE`). */
  vector: number;
  /** Simulated ISR entry address. */
  isrAddress: number;
  /** Simplified ISR instructions — one executes per "run" tick. */
  isrCode: string[];
  /** What the ISR accomplishes, in plain language. */
  handlingText: string;
  /** Values the ISR leaves in R1/R2 — shows why saving state matters. */
  isrR1: number;
  isrR2: number;
  /** Simulated controller register names. */
  registers: { data: string; status: string; control: string };
}

export const DEVICES: Record<DeviceId, DeviceInfo> = {
  keyboard: {
    id: "keyboard",
    label: "Keyboard",
    icon: "⌨",
    controller: "Keyboard Controller",
    controllerShort: "KB Ctrl",
    direction: "input",
    eventButton: "Press Keyboard",
    eventText: "Key pressed",
    vector: 1,
    isrAddress: 0x8100,
    isrCode: ["IN R1, [KBD_DATA]", "STORE [KEY_BUF], R1", "OUT [KBD_CTRL], ACK"],
    handlingText: "Read the key code from the controller, put it in the keyboard buffer, and acknowledge the device.",
    isrR1: 0x41,
    isrR2: 0,
    registers: { data: "KBD_DATA", status: "KBD_STATUS", control: "KBD_CTRL" },
  },
  mouse: {
    id: "mouse",
    label: "Mouse",
    icon: "🖱",
    controller: "Mouse Controller",
    controllerShort: "Mouse Ctrl",
    direction: "input",
    eventButton: "Move Mouse",
    eventText: "Mouse moved",
    vector: 2,
    isrAddress: 0x8200,
    isrCode: ["IN R1, [MOUSE_DXDY]", "ADD [CURSOR], R1"],
    handlingText: "Read how far the mouse moved and update the cursor position.",
    isrR1: 0x03,
    isrR2: 0x02,
    registers: { data: "MOUSE_DXDY", status: "MOUSE_STATUS", control: "MOUSE_CTRL" },
  },
  timer: {
    id: "timer",
    label: "Timer",
    icon: "⏱",
    controller: "Timer Controller",
    controllerShort: "Timer Ctrl",
    direction: "input",
    eventButton: "Timer Tick",
    eventText: "Timer tick",
    vector: 0,
    isrAddress: 0x8000,
    isrCode: ["ADD [TICKS], 1", "CALL scheduler_check", "OUT [TMR_CTRL], ACK"],
    handlingText: "Count the tick and let the operating system check whether another process should run.",
    isrR1: 0x01,
    isrR2: 0x10,
    registers: { data: "TMR_COUNT", status: "TMR_STATUS", control: "TMR_CTRL" },
  },
  storage: {
    id: "storage",
    label: "Storage",
    icon: "💾",
    controller: "Storage Controller",
    controllerShort: "Disk Ctrl",
    direction: "both",
    eventButton: "Disk Read Complete",
    eventText: "Disk read complete",
    vector: 4,
    isrAddress: 0x8400,
    isrCode: ["IN R1, [DISK_STATUS]", "MARK block_ready", "WAKE waiting_task", "OUT [DISK_CTRL], ACK"],
    handlingText: "Check the transfer status, mark the data block ready, and wake the task that was waiting for it.",
    isrR1: 0x02,
    isrR2: 0x40,
    registers: { data: "DISK_DATA", status: "DISK_STATUS", control: "DISK_CTRL" },
  },
  network: {
    id: "network",
    label: "Network",
    icon: "🌐",
    controller: "Network Controller",
    controllerShort: "NIC Ctrl",
    direction: "both",
    eventButton: "Packet Arrives",
    eventText: "Network packet arrived",
    vector: 3,
    isrAddress: 0x8300,
    isrCode: ["IN R1, [NIC_STATUS]", "COPY pkt -> RX_BUF", "SIGNAL net_task", "OUT [NIC_CTRL], ACK"],
    handlingText: "Move the arriving packet into a receive buffer and signal the networking software.",
    isrR1: 0x10,
    isrR2: 0x20,
    registers: { data: "NIC_DATA", status: "NIC_STATUS", control: "NIC_CTRL" },
  },
  printer: {
    id: "printer",
    label: "Printer",
    icon: "🖨",
    controller: "Printer Controller",
    controllerShort: "Prn Ctrl",
    direction: "output",
    eventButton: "Printer Ready",
    eventText: "Printer ready",
    vector: 5,
    isrAddress: 0x8500,
    isrCode: ["IN R1, [PRN_STATUS]", "SEND next_chunk"],
    handlingText: "See that the printer is ready and send it the next chunk of the job.",
    isrR1: 0x01,
    isrR2: 0x08,
    registers: { data: "PRN_DATA", status: "PRN_STATUS", control: "PRN_CTRL" },
  },
};

export const DEVICE_ORDER: DeviceId[] = ["keyboard", "mouse", "timer", "storage", "network", "printer"];

/** Default priority, highest first. */
export const DEFAULT_PRIORITY: DeviceId[] = ["timer", "network", "storage", "keyboard", "mouse", "printer"];

/** Default set of devices treated as maskable-and-masked when masking is switched on. */
export const DEFAULT_MASKED: DeviceId[] = ["mouse", "printer"];

export const NMI_INFO = {
  id: "nmi" as const,
  label: "Critical Event (NMI)",
  icon: "⚠",
  vector: 7,
  isrAddress: 0x8700,
  isrCode: ["READ error_info", "RECORD critical_event", "RUN safe_recovery"],
  handlingText: "Record the critical condition and run a recovery routine — this interrupt is not blocked by ordinary masking.",
  isrR1: 0xff,
  isrR2: 0xee,
};

export function sourceLabel(src: IrqSource): string {
  return src === "nmi" ? "Critical event (NMI)" : DEVICES[src].label;
}

export function sourceIcon(src: IrqSource): string {
  return src === "nmi" ? NMI_INFO.icon : DEVICES[src].icon;
}

function isrCodeFor(src: IrqSource): string[] {
  return src === "nmi" ? NMI_INFO.isrCode : DEVICES[src].isrCode;
}
function isrAddressFor(src: IrqSource): number {
  return src === "nmi" ? NMI_INFO.isrAddress : DEVICES[src].isrAddress;
}
function isrRegsFor(src: IrqSource): { r1: number; r2: number } {
  return src === "nmi" ? { r1: NMI_INFO.isrR1, r2: NMI_INFO.isrR2 } : { r1: DEVICES[src].isrR1, r2: DEVICES[src].isrR2 };
}
export function vectorFor(src: IrqSource): number {
  return src === "nmi" ? NMI_INFO.vector : DEVICES[src].vector;
}

export function hex(n: number, width = 4): string {
  return `0x${n.toString(16).toUpperCase().padStart(width, "0")}`;
}

// ---------------------------------------------------------------------------
// Interrupt vector table (simulated)
// ---------------------------------------------------------------------------

export interface VectorEntry {
  vector: number;
  name: string;
  address: number;
  /** Which source normally raises this vector in the lab, if any. */
  source: IrqSource | "dma";
  code: string[];
  note: string;
}

export const VECTOR_TABLE: VectorEntry[] = [
  { vector: 0, name: "Timer ISR", address: 0x8000, source: "timer", code: DEVICES.timer.isrCode, note: DEVICES.timer.handlingText },
  { vector: 1, name: "Keyboard ISR", address: 0x8100, source: "keyboard", code: DEVICES.keyboard.isrCode, note: DEVICES.keyboard.handlingText },
  { vector: 2, name: "Mouse ISR", address: 0x8200, source: "mouse", code: DEVICES.mouse.isrCode, note: DEVICES.mouse.handlingText },
  { vector: 3, name: "Network ISR", address: 0x8300, source: "network", code: DEVICES.network.isrCode, note: DEVICES.network.handlingText },
  { vector: 4, name: "Storage ISR", address: 0x8400, source: "storage", code: DEVICES.storage.isrCode, note: DEVICES.storage.handlingText },
  { vector: 5, name: "Printer ISR", address: 0x8500, source: "printer", code: DEVICES.printer.isrCode, note: DEVICES.printer.handlingText },
  {
    vector: 6,
    name: "DMA Complete ISR",
    address: 0x8600,
    source: "dma",
    code: ["IN R1, [DMA_STATUS]", "MARK transfer_done", "WAKE waiting_task", "OUT [DMA_CTRL], ACK"],
    note: "Confirm the DMA transfer finished, mark the data ready, and wake whatever was waiting for it.",
  },
  { vector: 7, name: "Critical Event (NMI) ISR", address: 0x8700, source: "nmi", code: NMI_INFO.isrCode, note: NMI_INFO.handlingText },
];

// ---------------------------------------------------------------------------
// CPU + main program
// ---------------------------------------------------------------------------

export interface CpuState {
  /** Address of the NEXT instruction to fetch. */
  pc: number;
  /** The most recently executed instruction. */
  ir: string;
  r1: number;
  r2: number;
  z: 0 | 1;
  n: 0 | 1;
}

export const PROGRAM: { addr: number; text: string }[] = [
  { addr: 100, text: "LOAD R1, #12" },
  { addr: 101, text: "LOAD R2, #5" },
  { addr: 102, text: "ADD R1, R2" },
  { addr: 103, text: "STORE [0x40], R1" },
  { addr: 104, text: "SUB R1, R2" },
  { addr: 105, text: "JMP 100" },
];

export const INITIAL_CPU: CpuState = { pc: 100, ir: "—", r1: 0, r2: 0, z: 1, n: 0 };

function executeMainInstruction(cpu: CpuState): CpuState {
  const instr = (PROGRAM.find((p) => p.addr === cpu.pc) ?? PROGRAM[0]) as { addr: number; text: string };
  const next: CpuState = { ...cpu, ir: instr.text };
  const idx = PROGRAM.indexOf(instr);
  next.pc = (PROGRAM[(idx + 1) % PROGRAM.length] as { addr: number }).addr;
  if (instr.text.startsWith("LOAD R1")) next.r1 = 12;
  else if (instr.text.startsWith("LOAD R2")) next.r2 = 5;
  else if (instr.text.startsWith("ADD")) {
    next.r1 = cpu.r1 + cpu.r2;
    next.z = next.r1 === 0 ? 1 : 0;
    next.n = next.r1 < 0 ? 1 : 0;
  } else if (instr.text.startsWith("SUB")) {
    next.r1 = cpu.r1 - cpu.r2;
    next.z = next.r1 === 0 ? 1 : 0;
    next.n = next.r1 < 0 ? 1 : 0;
  }
  return next;
}

export function formatFlags(cpu: CpuState): string {
  return `Z=${cpu.z} N=${cpu.n}`;
}

// ---------------------------------------------------------------------------
// Interrupt engine
// ---------------------------------------------------------------------------

export type PriorityPolicy = "priority" | "fifo";

export interface EngineConfig {
  /** Devices, highest priority first. */
  priority: DeviceId[];
  policy: PriorityPolicy;
  maskingOn: boolean;
  masked: DeviceId[];
  nesting: boolean;
}

export const DEFAULT_CONFIG: EngineConfig = {
  priority: DEFAULT_PRIORITY,
  policy: "priority",
  maskingOn: false,
  masked: DEFAULT_MASKED,
  nesting: false,
};

export interface IrqEvent {
  id: number;
  source: IrqSource;
  data: string;
  raisedAt: number;
}

/** Signal legs: 0 = at the device, 1 = at the controller, 2 = on the bus, 3 = arrived at the CPU. */
export const SIGNAL_LEGS = 3;

export interface InFlight {
  event: IrqEvent;
  leg: number;
}

export type HandlerPhase = "identify" | "run" | "restore";

export interface Handler {
  event: IrqEvent;
  /** The phase that executes NEXT. */
  phase: HandlerPhase;
  /** Index of the next ISR instruction. */
  step: number;
  /** CPU state saved when this handler was entered. */
  saved: CpuState;
  startedAt: number;
}

export type Activity = "idle" | "main" | "saving" | "identifying" | "isr" | "restoring";

export interface CompletedIrq {
  event: IrqEvent;
  startedAt: number;
  finishedAt: number;
  /** Nesting depth at which it ran (0 = ran directly over the main program). */
  depth: number;
}

export interface Segment {
  kind: "main" | "overhead" | "isr";
  source?: IrqSource;
  start: number;
  len: number;
}

export interface Marker {
  tick: number;
  source: IrqSource;
}

export type LogTone = "event" | "isr" | "info" | "warn";

export interface LogEntry {
  id: number;
  tick: number;
  text: string;
  tone: LogTone;
}

export interface EngineState {
  tick: number;
  cpu: CpuState;
  activity: Activity;
  active: Handler | null;
  stack: Handler[];
  inFlight: InFlight[];
  pending: IrqEvent[];
  completed: CompletedIrq[];
  log: LogEntry[];
  segments: Segment[];
  markers: Marker[];
  nextId: number;
  mainTicks: number;
  isrTicks: number;
  overheadTicks: number;
}

export const MAX_IN_QUEUE = 12;
const MAX_LOG = 200;
const MAX_SEGMENTS = 90;
const MAX_MARKERS = 40;
const MAX_COMPLETED = 30;

export function initialEngine(): EngineState {
  return {
    tick: 0,
    cpu: INITIAL_CPU,
    activity: "idle",
    active: null,
    stack: [],
    inFlight: [],
    pending: [],
    completed: [],
    log: [
      { id: 0, tick: 0, text: "System ready — CPU will run the main program. Generate a device event to begin.", tone: "info" },
    ],
    segments: [],
    markers: [],
    nextId: 1,
    mainTicks: 0,
    isrTicks: 0,
    overheadTicks: 0,
  };
}

/** Simulated wall-clock timestamp: 12:00:00 plus one second per tick. */
export function formatTime(tick: number): string {
  const total = 12 * 3600 + tick;
  const h = Math.floor(total / 3600) % 24;
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

export function priorityRank(src: IrqSource, config: EngineConfig): number {
  if (src === "nmi") return -1;
  const idx = config.priority.indexOf(src);
  return idx === -1 ? config.priority.length : idx;
}

export function isDeferred(src: IrqSource, config: EngineConfig): boolean {
  return src !== "nmi" && config.maskingOn && config.masked.includes(src);
}

function eventData(src: IrqSource, id: number): string {
  switch (src) {
    case "keyboard":
      return `Key '${String.fromCharCode(65 + (id % 26))}'`;
    case "mouse":
      return `dx=${(id % 5) - 2}, dy=${((id * 3) % 5) - 2}`;
    case "timer":
      return `Tick #${id}`;
    case "storage":
      return `Block #${100 + id} (4 KB)`;
    case "network":
      return `Packet #${id} (64 B)`;
    case "printer":
      return "Ready for next chunk";
    case "nmi":
      return "Critical condition";
  }
}

function addLog(s: EngineState, text: string, tone: LogTone): LogEntry[] {
  const lastId = s.log[s.log.length - 1]?.id ?? -1;
  const entry: LogEntry = { id: lastId + 1, tick: s.tick, text, tone };
  const next = [...s.log, entry];
  return next.length > MAX_LOG ? next.slice(next.length - MAX_LOG) : next;
}

function addSegment(segments: Segment[], kind: Segment["kind"], source: IrqSource | undefined, tick: number): Segment[] {
  const last = segments[segments.length - 1];
  if (last && last.kind === kind && last.source === source && last.start + last.len === tick) {
    const copy = segments.slice(0, -1);
    copy.push({ ...last, len: last.len + 1 });
    return copy;
  }
  const next = [...segments, { kind, source, start: tick, len: 1 }];
  return next.length > MAX_SEGMENTS ? next.slice(next.length - MAX_SEGMENTS) : next;
}

/** Raise a device event — it starts travelling device → controller → bus → CPU. */
export function raiseEvent(s: EngineState, source: IrqSource): EngineState {
  const queued = s.inFlight.length + s.pending.length;
  if (queued >= MAX_IN_QUEUE) {
    return { ...s, log: addLog(s, `${sourceLabel(source)} event dropped — the simulated queue is full (${MAX_IN_QUEUE}).`, "warn") };
  }
  const id = s.nextId;
  const event: IrqEvent = { id, source, data: eventData(source, id), raisedAt: s.tick };
  const text =
    source === "nmi"
      ? "Critical event occurred — NMI signal raised"
      : `${DEVICES[source].label}: ${DEVICES[source].eventText} (${eventData(source, id)})`;
  const markers = [...s.markers, { tick: s.tick, source }];
  return {
    ...s,
    nextId: id + 1,
    inFlight: [...s.inFlight, { event, leg: 0 }],
    markers: markers.length > MAX_MARKERS ? markers.slice(markers.length - MAX_MARKERS) : markers,
    log: addLog({ ...s, nextId: id + 1 }, text, "event"),
  };
}

/** Choose the next eligible pending event according to the policy (undefined if none). */
export function pickNext(pending: IrqEvent[], config: EngineConfig): IrqEvent | undefined {
  const eligible = pending.filter((e) => !isDeferred(e.source, config));
  if (eligible.length === 0) return undefined;
  if (config.policy === "fifo") {
    return eligible.reduce((a, b) => (b.raisedAt < a.raisedAt || (b.raisedAt === a.raisedAt && b.id < a.id) ? b : a));
  }
  return eligible.reduce((a, b) => {
    const ra = priorityRank(a.source, config);
    const rb = priorityRank(b.source, config);
    if (rb < ra) return b;
    if (rb === ra && (b.raisedAt < a.raisedAt || (b.raisedAt === a.raisedAt && b.id < a.id))) return b;
    return a;
  });
}

/** An event that is allowed to interrupt the handler that's currently running. */
function pickPreempt(pending: IrqEvent[], active: Handler, config: EngineConfig): IrqEvent | undefined {
  const activeRank = priorityRank(active.event.source, config);
  const candidates = pending.filter((e) => {
    if (isDeferred(e.source, config)) return false;
    if (active.event.source === "nmi") return false;
    if (e.source === "nmi") return true; // NMI bypasses ordinary masking and nesting rules
    return config.nesting && config.policy === "priority" && priorityRank(e.source, config) < activeRank;
  });
  return pickNext(candidates, { ...config, policy: "priority" });
}

function removeById(list: IrqEvent[], id: number): IrqEvent[] {
  return list.filter((e) => e.id !== id);
}

/** Begin handling `event` — this tick is the "save CPU state" step. */
function beginHandler(s: EngineState, event: IrqEvent): EngineState {
  const depth = s.active ? s.stack.length + 1 : 0;
  const handler: Handler = { event, phase: "identify", step: 0, saved: s.cpu, startedAt: s.tick };
  const stack = s.active ? [...s.stack, s.active] : s.stack;
  const interrupted = s.active ? `${sourceLabel(s.active.event.source)} ISR` : `main program (next instruction PC=${s.cpu.pc})`;
  let next: EngineState = {
    ...s,
    active: handler,
    stack,
    pending: removeById(s.pending, event.id),
    activity: "saving",
    overheadTicks: s.overheadTicks + 1,
    segments: addSegment(s.segments, "overhead", event.source, s.tick),
  };
  const nested = depth > 0 ? " (nested — interrupts the running ISR)" : "";
  next = { ...next, log: addLog(next, `${sourceLabel(event.source)} interrupt received${nested} — CPU stops the ${interrupted}`, "isr") };
  next = { ...next, log: addLog(next, `CPU state saved (PC=${s.cpu.pc}, R1=${s.cpu.r1}, R2=${s.cpu.r2}, ${formatFlags(s.cpu)})`, "isr") };
  return next;
}

/** Advance the whole system by one tick. */
export function stepEngine(s: EngineState, config: EngineConfig): EngineState {
  let st: EngineState = { ...s, tick: s.tick + 1 };

  // 1. Signals travel toward the CPU.
  if (st.inFlight.length > 0) {
    const stillFlying: InFlight[] = [];
    let arrivedPending = st.pending;
    for (const f of st.inFlight) {
      const leg = f.leg + 1;
      if (leg >= SIGNAL_LEGS) {
        arrivedPending = [...arrivedPending, f.event];
        const deferred = isDeferred(f.event.source, config);
        st = {
          ...st,
          log: addLog(
            st,
            deferred
              ? `${sourceLabel(f.event.source)} interrupt request reached the CPU — masked, so it is deferred`
              : `${sourceLabel(f.event.source)} interrupt request reached the CPU — pending`,
            deferred ? "warn" : "event",
          ),
        };
      } else {
        stillFlying.push({ event: f.event, leg });
      }
    }
    st = { ...st, inFlight: stillFlying, pending: arrivedPending };
  }

  // 2. The CPU does one thing this tick.
  if (st.active === null) {
    const next = pickNext(st.pending, config);
    if (next) return beginHandler(st, next);
    const cpu = executeMainInstruction(st.cpu);
    return {
      ...st,
      cpu,
      activity: "main",
      mainTicks: st.mainTicks + 1,
      segments: addSegment(st.segments, "main", undefined, st.tick),
    };
  }

  // A handler is active. Higher-priority (or NMI) events may interrupt it
  // — but never during its own save/restore steps.
  const preempt = pickPreempt(st.pending, st.active, config);
  if (preempt) return beginHandler(st, preempt);

  const h = st.active;
  const src = h.event.source;
  const code = isrCodeFor(src);

  if (h.phase === "identify") {
    const vec = vectorFor(src);
    return {
      ...st,
      active: { ...h, phase: "run" },
      activity: "identifying",
      overheadTicks: st.overheadTicks + 1,
      segments: addSegment(st.segments, "overhead", src, st.tick),
      log: addLog(st, `Interrupt identified: vector ${vec} → ISR @ ${hex(isrAddressFor(src))}`, "isr"),
    };
  }

  if (h.phase === "run") {
    const regs = isrRegsFor(src);
    const instr = code[h.step] ?? "NOP";
    const cpu: CpuState = { ...st.cpu, pc: isrAddressFor(src) + h.step, ir: instr, r1: regs.r1, r2: regs.r2 };
    const done = h.step + 1 >= code.length;
    let log = st.log;
    if (h.step === 0) log = addLog(st, `${sourceLabel(src)} ISR started`, "isr");
    let next: EngineState = {
      ...st,
      cpu,
      log,
      activity: "isr",
      isrTicks: st.isrTicks + 1,
      active: { ...h, step: h.step + 1, phase: done ? "restore" : "run" },
      segments: addSegment(st.segments, "isr", src, st.tick),
    };
    if (done) {
      next = { ...next, log: addLog(next, `${sourceLabel(src)} data processed (${h.event.data}) — device acknowledged`, "isr") };
    }
    return next;
  }

  // restore
  const depth = st.stack.length;
  const resumed = st.stack[st.stack.length - 1] ?? null;
  const completed = [...st.completed, { event: h.event, startedAt: h.startedAt, finishedAt: st.tick, depth }];
  const returnText = resumed
    ? `returning to the interrupted ${sourceLabel(resumed.event.source)} ISR`
    : `returning to the main program (PC=${h.saved.pc})`;
  let next: EngineState = {
    ...st,
    cpu: h.saved,
    activity: "restoring",
    overheadTicks: st.overheadTicks + 1,
    active: resumed,
    stack: resumed ? st.stack.slice(0, -1) : st.stack,
    completed: completed.length > MAX_COMPLETED ? completed.slice(completed.length - MAX_COMPLETED) : completed,
    segments: addSegment(st.segments, "overhead", src, st.tick),
  };
  next = { ...next, log: addLog(next, `${sourceLabel(src)} ISR completed`, "isr") };
  next = { ...next, log: addLog(next, `CPU state restored — ${returnText}`, "isr") };
  return next;
}

export function clearLog(s: EngineState): EngineState {
  return { ...s, log: [] };
}

// --- Derived views ---------------------------------------------------------

export type ControllerStatus = "idle" | "data-ready" | "servicing";

export interface ControllerView {
  status: ControllerStatus;
  buffer: string | null;
  irqLine: boolean;
  control: string;
}

/** Derive one device controller's simplified state from the engine — nothing extra to store. */
export function controllerView(s: EngineState, device: DeviceId): ControllerView {
  const handlers = s.active ? [s.active, ...s.stack] : [];
  const servicing = handlers.find((h) => h.event.source === device && h.phase === "run");
  if (servicing) return { status: "servicing", buffer: servicing.event.data, irqLine: true, control: "ISR reading data" };
  const identifying = handlers.find((h) => h.event.source === device && h.phase === "identify");
  if (identifying) return { status: "data-ready", buffer: identifying.event.data, irqLine: true, control: "Waiting for ISR" };
  const pending = s.pending.find((e) => e.source === device);
  if (pending) return { status: "data-ready", buffer: pending.data, irqLine: true, control: "IRQ asserted" };
  const flying = s.inFlight.find((f) => f.event.source === device);
  if (flying) return { status: "data-ready", buffer: flying.event.data, irqLine: flying.leg >= 1, control: flying.leg >= 1 ? "IRQ asserted" : "Latching data" };
  return { status: "idle", buffer: null, irqLine: false, control: "Idle" };
}

export const ACTIVITY_LABEL: Record<Activity, string> = {
  idle: "Ready",
  main: "Running main program",
  saving: "Saving CPU state",
  identifying: "Identifying interrupt",
  isr: "Running ISR",
  restoring: "Restoring CPU state",
};

/** The full journey of one device event, in order. */
export const JOURNEY: { id: string; label: string; detail: string }[] = [
  { id: "device", label: "Device", detail: "Something happens at a device — a key is pressed, a packet arrives, a timer expires." },
  { id: "controller", label: "Controller", detail: "The device controller latches the data in its buffer and sets its status." },
  { id: "irq", label: "Interrupt request", detail: "The controller raises an interrupt request toward the CPU." },
  { id: "cpu", label: "CPU notices", detail: "The request is pending — the CPU responds at the next opportunity (after finishing its current instruction)." },
  { id: "save", label: "Save state", detail: "The CPU saves where it was (PC, registers, flags) so it can return later." },
  { id: "isr", label: "Identify & run ISR", detail: "The interrupt number locates the handler, and the ISR services the device through its controller." },
  { id: "restore", label: "Restore state", detail: "The saved PC, registers, and flags are put back." },
  { id: "return", label: "Return", detail: "The interrupted program continues as if nothing had happened." },
];

/** Which journey step is lit for the current engine state (-1 when nothing is happening). */
export function journeyIndex(s: EngineState): number {
  if (s.active) {
    if (s.activity === "saving") return 4;
    if (s.activity === "identifying" || s.activity === "isr") return 5;
    if (s.activity === "restoring") return 6;
    return 5;
  }
  if (s.pending.length > 0) return 3;
  if (s.inFlight.length > 0) return Math.max(...s.inFlight.map((f) => f.leg));
  const last = s.completed[s.completed.length - 1];
  if (last && s.tick - last.finishedAt <= 1) return 7;
  return -1;
}

// ---------------------------------------------------------------------------
// Polling vs Interrupt scenario
// ---------------------------------------------------------------------------

export type IoMethod = "polling" | "interrupt";

export interface ScenarioParams {
  totalTicks: number;
  /** Tick at which the device becomes ready. */
  readyAt: number;
  /** In polling mode, the CPU checks every N ticks (1 = continuous busy-wait). */
  pollEvery: 1 | 2 | 4;
  /** How many ticks servicing the device takes. */
  handleTicks: number;
}

export const DEFAULT_SCENARIO: ScenarioParams = { totalTicks: 24, readyAt: 10, pollEvery: 1, handleTicks: 2 };

export type ScenarioKind = "work" | "check-no" | "check-yes" | "handle" | "overhead";

export interface ScenarioTick {
  t: number;
  kind: ScenarioKind;
  deviceReady: boolean;
  note: string;
}

export interface ScenarioResult {
  ticks: ScenarioTick[];
  checks: number;
  useful: number;
  overhead: number;
  handling: number;
  /** Ticks between the device becoming ready and the handler starting. */
  responseDelay: number | null;
}

export function runScenario(method: IoMethod, p: ScenarioParams): ScenarioResult {
  const ticks: ScenarioTick[] = [];
  let checks = 0;
  let useful = 0;
  let overhead = 0;
  let handling = 0;
  let firstHandle: number | null = null;

  if (method === "polling") {
    let handled = false;
    let handleLeft = 0;
    for (let t = 1; t <= p.totalTicks; t++) {
      const ready = t >= p.readyAt;
      if (handleLeft > 0) {
        handleLeft--;
        handling++;
        if (firstHandle === null) firstHandle = t;
        ticks.push({ t, kind: "handle", deviceReady: ready, note: "CPU reads the data from the device and handles it." });
        continue;
      }
      if (!handled && (t - 1) % p.pollEvery === 0) {
        checks++;
        if (ready) {
          handled = true;
          handleLeft = p.handleTicks;
          ticks.push({ t, kind: "check-yes", deviceReady: ready, note: 'CPU: "Are you ready?"  Device: "YES."' });
        } else {
          overhead++;
          ticks.push({ t, kind: "check-no", deviceReady: ready, note: 'CPU: "Are you ready?"  Device: "No."' });
        }
        continue;
      }
      useful++;
      ticks.push({ t, kind: "work", deviceReady: ready, note: "CPU does useful main-program work." });
    }
  } else {
    // Interrupt-driven: save, identify, handle, restore after the device is ready.
    const entryStart = p.readyAt + 1;
    const handleStart = entryStart + 2;
    const restoreTick = handleStart + p.handleTicks;
    for (let t = 1; t <= p.totalTicks; t++) {
      const ready = t >= p.readyAt;
      if (t === entryStart) {
        overhead++;
        ticks.push({ t, kind: "overhead", deviceReady: ready, note: "Interrupt request arrives — CPU saves its state." });
      } else if (t === entryStart + 1) {
        overhead++;
        ticks.push({ t, kind: "overhead", deviceReady: ready, note: "CPU identifies the interrupt and finds its ISR." });
      } else if (t >= handleStart && t < restoreTick) {
        handling++;
        if (firstHandle === null) firstHandle = t;
        ticks.push({ t, kind: "handle", deviceReady: ready, note: "ISR runs — the device is handled." });
      } else if (t === restoreTick) {
        overhead++;
        ticks.push({ t, kind: "overhead", deviceReady: ready, note: "CPU restores its state and returns to the main program." });
      } else {
        useful++;
        ticks.push({
          t,
          kind: "work",
          deviceReady: ready,
          note: t === p.readyAt ? "Device becomes ready and raises an interrupt — CPU is busy with useful work." : "CPU does useful main-program work.",
        });
      }
    }
  }

  return {
    ticks,
    checks,
    useful,
    overhead,
    handling,
    responseDelay: firstHandle === null ? null : firstHandle - p.readyAt,
  };
}

// ---------------------------------------------------------------------------
// Block transfers: polling vs interrupt-driven vs DMA (simulated ticks)
// ---------------------------------------------------------------------------

export type TransferMethod = "polling" | "interrupt" | "dma";

export const TRANSFER_METHODS: { id: TransferMethod; label: string; short: string; involvement: string }[] = [
  { id: "polling", label: "Polling (CPU-driven)", short: "Polling", involvement: "High / repeated checking" },
  { id: "interrupt", label: "Interrupt-driven I/O", short: "Interrupt", involvement: "Event-based" },
  { id: "dma", label: "DMA", short: "DMA", involvement: "Low involvement during the transfer" },
];

export interface TransferParams {
  /** Size of one transfer, in words (1 word = 4 simulated bytes). */
  words: number;
  /** Simulated ticks the device takes to produce/accept each word. */
  ticksPerWord: number;
  transfers: number;
}

export const DMA_SETUP_TICKS = 3;
/** Save + identify + one handler step + restore. */
export const ISR_COST_TICKS = 4;
export const BYTES_PER_WORD = 4;

export interface TransferResult {
  method: TransferMethod;
  cpuBusy: number;
  cpuFree: number;
  totalTime: number;
  words: number;
  bytes: number;
  cpuSharePct: number;
  note: string;
}

export function computeTransfer(method: TransferMethod, p: TransferParams): TransferResult {
  const words = p.words * p.transfers;
  let cpuBusy: number;
  let cpuFree: number;
  let total: number;
  let note: string;

  if (method === "polling") {
    total = words * p.ticksPerWord;
    cpuBusy = total;
    cpuFree = 0;
    note = "The CPU checks the device and copies each word itself, so it is occupied for the whole transfer.";
  } else if (method === "interrupt") {
    const cycle = Math.max(p.ticksPerWord, ISR_COST_TICKS);
    total = words * cycle;
    cpuBusy = words * ISR_COST_TICKS;
    cpuFree = total - cpuBusy;
    note =
      p.ticksPerWord < ISR_COST_TICKS
        ? "Words arrive faster than the ISR can handle them, so the CPU spends all its time entering and leaving interrupts."
        : "The CPU works on something else between words, but every word costs a full interrupt entry, handler, and return.";
  } else {
    total = p.transfers * (DMA_SETUP_TICKS + p.words * p.ticksPerWord + ISR_COST_TICKS);
    cpuBusy = p.transfers * (DMA_SETUP_TICKS + ISR_COST_TICKS);
    cpuFree = p.transfers * p.words * p.ticksPerWord;
    note = "The CPU sets up the transfer, continues other work while the DMA controller moves the data, then handles one completion interrupt.";
  }

  return {
    method,
    cpuBusy,
    cpuFree,
    totalTime: total,
    words,
    bytes: words * BYTES_PER_WORD,
    cpuSharePct: total === 0 ? 0 : Math.round((cpuBusy / total) * 100),
    note,
  };
}

export const TRANSFER_SIZES = [1, 16, 128, 512];
export const DEVICE_SPEEDS: { ticks: number; label: string }[] = [
  { ticks: 2, label: "Fast (2 ticks/word)" },
  { ticks: 6, label: "Medium (6 ticks/word)" },
  { ticks: 12, label: "Slow (12 ticks/word)" },
];

// ---------------------------------------------------------------------------
// Memory-mapped I/O (simulated)
// ---------------------------------------------------------------------------

export interface AddressRegion {
  addr: number;
  label: string;
  kind: "ram" | "device";
  detail: string;
}

export const ADDRESS_MAP: AddressRegion[] = [
  { addr: 0x0000, label: "RAM", kind: "ram", detail: "Ordinary memory — LOAD/STORE reads and writes stored values." },
  { addr: 0x1000, label: "RAM", kind: "ram", detail: "Ordinary memory — LOAD/STORE reads and writes stored values." },
  { addr: 0x2000, label: "DEV_DATA (device register)", kind: "device", detail: "Data register — holds the value the device will send or has received." },
  { addr: 0x2004, label: "DEV_CTRL (device register)", kind: "device", detail: "Control register — bit 0 = START tells the device to begin work." },
  { addr: 0x2008, label: "DEV_STATUS (device register)", kind: "device", detail: "Status register — 0 = IDLE, 1 = BUSY, 2 = READY." },
];

export type DevStatus = "IDLE" | "BUSY" | "READY";
const STATUS_CODE: Record<DevStatus, number> = { IDLE: 0, BUSY: 1, READY: 2 };

export interface MmioState {
  ram: Record<number, number>;
  devData: number;
  devCtrl: number;
  devStatus: DevStatus;
  /** What the device has "done" so far. */
  devOutput: string[];
}

export const INITIAL_MMIO: MmioState = { ram: {}, devData: 0, devCtrl: 0, devStatus: "IDLE", devOutput: [] };

export interface MmioResult {
  state: MmioState;
  target: "ram" | "device";
  /** The visual stages the request passes through. */
  stages: string[];
  description: string;
  loaded?: number;
  /** True when this operation started the device working. */
  startedDevice: boolean;
}

export function execMmio(s: MmioState, op: "STORE" | "LOAD", addr: number, value: number): MmioResult {
  const isDevice = addr >= 0x2000;
  if (!isDevice) {
    if (op === "STORE") {
      return {
        state: { ...s, ram: { ...s.ram, [addr]: value } },
        target: "ram",
        stages: ["CPU issues STORE", `Address ${hex(addr)} on the bus`, "Address decoder selects RAM", `RAM cell ${hex(addr)} = ${value}`],
        description: `${hex(addr)} lies in the RAM region, so the value ${value} is simply stored in memory. Nothing else happens.`,
        startedDevice: false,
      };
    }
    const v = s.ram[addr] ?? 0;
    return {
      state: s,
      target: "ram",
      stages: ["CPU issues LOAD", `Address ${hex(addr)} on the bus`, "Address decoder selects RAM", `R1 ← ${v}`],
      description: `${hex(addr)} is ordinary RAM, so the load returns whatever was stored there (${v}).`,
      loaded: v,
      startedDevice: false,
    };
  }

  const stagesBase = [op === "STORE" ? "CPU issues STORE" : "CPU issues LOAD", `Address ${hex(addr)} on the bus`, "Address decoder selects the DEVICE, not RAM"];
  if (op === "STORE") {
    if (addr === 0x2000) {
      return {
        state: { ...s, devData: value },
        target: "device",
        stages: [...stagesBase, `DEV_DATA register ← ${value}`],
        description: `The write to ${hex(addr)} went to the device's data register — the device now holds ${value}. It hasn't started yet.`,
        startedDevice: false,
      };
    }
    if (addr === 0x2004) {
      const start = (value & 1) === 1 && s.devStatus === "IDLE";
      return {
        state: { ...s, devCtrl: value, devStatus: start ? "BUSY" : s.devStatus },
        target: "device",
        stages: [...stagesBase, `DEV_CTRL register ← ${value}`, start ? "Device reacts: status → BUSY" : "Device: no START requested"],
        description: start
          ? `Bit 0 (START) is set, so the device reacts to this write: it becomes BUSY and begins working on ${s.devData}. Writing an address changed real device behavior.`
          : (value & 1) === 1
            ? "START was requested, but the device is already busy, so nothing changes."
            : "START (bit 0) is not set, so the device just stores the control value and keeps idling.",
        startedDevice: start,
      };
    }
    return {
      state: s,
      target: "device",
      stages: [...stagesBase, "STATUS register is read-only — write ignored"],
      description: "A status register normally reports what the device is doing, so writes to it are typically ignored. (Exact behavior varies by device.)",
      startedDevice: false,
    };
  }

  // LOAD from a device register
  if (addr === 0x2000) {
    const consumed = s.devStatus === "READY";
    return {
      state: consumed ? { ...s, devStatus: "IDLE" } : s,
      target: "device",
      stages: [...stagesBase, `R1 ← DEV_DATA (${s.devData})`, consumed ? "Device sees the data was read: status → IDLE" : "Device unchanged"],
      description: consumed
        ? `Reading the data register returned ${s.devData} and told the device the result was collected, so it returned to IDLE.`
        : `Reading the data register returned ${s.devData}. Reading it while the device isn't READY may return stale data.`,
      loaded: s.devData,
      startedDevice: false,
    };
  }
  if (addr === 0x2004) {
    return {
      state: s,
      target: "device",
      stages: [...stagesBase, `R1 ← DEV_CTRL (${s.devCtrl})`],
      description: `Reading the control register returns the last control value written (${s.devCtrl}).`,
      loaded: s.devCtrl,
      startedDevice: false,
    };
  }
  return {
    state: s,
    target: "device",
    stages: [...stagesBase, `R1 ← DEV_STATUS (${STATUS_CODE[s.devStatus]} = ${s.devStatus})`],
    description: `Reading the status register returned ${STATUS_CODE[s.devStatus]} (${s.devStatus}). Software can use this to check whether the device is ready — the same idea as polling.`,
    loaded: STATUS_CODE[s.devStatus],
    startedDevice: false,
  };
}

/** The device finishes its work — call after a short delay once `startedDevice` was true. */
export function finishDeviceWork(s: MmioState): MmioState {
  if (s.devStatus !== "BUSY") return s;
  return { ...s, devStatus: "READY", devOutput: [...s.devOutput, `Processed value ${s.devData}`].slice(-5) };
}

// ---------------------------------------------------------------------------
// Port-mapped I/O (simulated)
// ---------------------------------------------------------------------------

export type PortInstr = "STORE [0x0010]" | "OUT 0x10" | "LOAD [0x0010]" | "IN 0x10";

export interface PortState {
  /** Memory-space cell at 0x0010 — ordinary RAM. */
  ram10: number;
  /** I/O-space port 0x10 — a device register. */
  port10: number;
}

export const INITIAL_PORTS: PortState = { ram10: 0, port10: 0 };

export interface PortResult {
  state: PortState;
  space: "memory" | "io";
  stages: string[];
  description: string;
}

export function execPortOp(s: PortState, instr: PortInstr, value: number): PortResult {
  switch (instr) {
    case "STORE [0x0010]":
      return {
        state: { ...s, ram10: value },
        space: "memory",
        stages: ["CPU issues a memory write", "Memory address space selected", "RAM cell 0x0010 ← " + value],
        description: `A memory write to 0x0010 lands in RAM. The device port with the same number is untouched — they live in different address spaces.`,
      };
    case "OUT 0x10":
      return {
        state: { ...s, port10: value },
        space: "io",
        stages: ["CPU issues OUT", "I/O address space selected", "Port 0x10 (device register) ← " + value],
        description: `OUT uses the separate I/O address space, so port 0x10 is a device register. The RAM cell at memory address 0x0010 is untouched.`,
      };
    case "LOAD [0x0010]":
      return {
        state: s,
        space: "memory",
        stages: ["CPU issues a memory read", "Memory address space selected", `R1 ← RAM[0x0010] = ${s.ram10}`],
        description: `A memory read of 0x0010 returns the RAM value (${s.ram10}).`,
      };
    case "IN 0x10":
      return {
        state: s,
        space: "io",
        stages: ["CPU issues IN", "I/O address space selected", `R1 ← Port 0x10 = ${s.port10}`],
        description: `IN reads from I/O port 0x10 — the device register (${s.port10}) — not from RAM.`,
      };
  }
}

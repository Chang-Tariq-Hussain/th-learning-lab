/**
 * Conceptual model for the Process Management Simulator (the
 * "Process Management Laboratory").
 *
 * Like `computer-boot-process`, this models a small, discrete set of
 * conceptual states and transitions rather than a continuous numeric
 * quantity — no `@/features/simulation` canvas engine needed here
 * either. This simulation is intentionally separate from, but
 * connected to, the CPU Scheduling Simulator: that one teaches HOW
 * the CPU decides which ready process runs next; this one teaches
 * WHAT a process is and how the operating system tracks and manages
 * its state and resources while that decision is being made.
 *
 * IMPORTANT accuracy notes, surfaced directly in the UI:
 *  - A process is a program IN EXECUTION, not merely "a program
 *    stored on disk" — that's just the program file, before the OS
 *    has created a running process from it.
 *  - A blocked/waiting process does NOT consume CPU time — that's
 *    the whole point of the state.
 *  - Context switching has real overhead; it is never free.
 *  - The Process Control Block shown here is a SIMPLIFIED CONCEPTUAL
 *    PCB, not an exact layout used identically by every OS.
 */

export type ProcessLifecycleState = "new" | "ready" | "running" | "waiting" | "terminated";

export const LIFECYCLE_STATES: ProcessLifecycleState[] = [
  "new",
  "ready",
  "running",
  "waiting",
  "terminated",
];

export const STATE_LABELS: Record<ProcessLifecycleState, string> = {
  new: "New",
  ready: "Ready",
  running: "Running",
  waiting: "Waiting / Blocked",
  terminated: "Terminated",
};

export interface StateInfo {
  state: ProcessLifecycleState;
  shortDescription: string;
  fullDescription: string;
  /** Does the OS ever give this state CPU time? Surfaced explicitly
   *  to head off the "a blocked process is still using the CPU"
   *  misconception. */
  usesCpu: boolean;
}

export const STATE_INFO: Record<ProcessLifecycleState, StateInfo> = {
  new: {
    state: "new",
    shortDescription: "Process is being created.",
    fullDescription:
      "The operating system is setting up everything a process needs to exist — allocating an entry for it and building its Process Control Block. It hasn't been admitted to the Ready state yet.",
    usesCpu: false,
  },
  ready: {
    state: "ready",
    shortDescription: "Prepared to run, waiting for CPU time.",
    fullDescription:
      "The process has everything it needs to run except the CPU itself. It sits in the ready queue until the scheduler picks it — this is exactly the queue the CPU Scheduling Simulator's algorithms decide the order of.",
    usesCpu: false,
  },
  running: {
    state: "running",
    shortDescription: "Currently executing on the CPU.",
    fullDescription:
      "The process's instructions are actively being executed by the CPU right now. On a single CPU core, only one process can be in this state at any instant.",
    usesCpu: true,
  },
  waiting: {
    state: "waiting",
    shortDescription: "Waiting for an event or resource, such as I/O.",
    fullDescription:
      "The process cannot continue until something outside the CPU finishes — a disk read, a network response, user input. It does NOT use any CPU time while blocked, which is exactly why the OS runs a different ready process instead of leaving the CPU idle.",
    usesCpu: false,
  },
  terminated: {
    state: "terminated",
    shortDescription: "Finished execution (or was ended).",
    fullDescription:
      "The process has completed normally or been ended some other way. The operating system cleans up the resources associated with it — its memory, open file handles, and its Process Control Block entry.",
    usesCpu: false,
  },
};

/** Which transitions the lifecycle actually allows, for "Follow a
 *  Process" — attempting anything not listed here is rejected by the
 *  UI with a short explanation of why. */
export const ALLOWED_TRANSITIONS: Record<ProcessLifecycleState, ProcessLifecycleState[]> = {
  new: ["ready"],
  ready: ["running"],
  running: ["waiting", "terminated", "ready"],
  waiting: ["ready"],
  terminated: [],
};

export const TRANSITION_EXPLANATIONS: Record<string, string> = {
  "new->ready": "The OS finishes creating the process and admits it to the ready queue.",
  "ready->running": "The scheduler selects this process and gives it the CPU.",
  "running->waiting": "The process requests something it must wait for, such as I/O, and is blocked.",
  "running->terminated": "The process finishes its work (or is ended) and the OS cleans it up.",
  "running->ready": "The scheduler preempts the process (its time slice ends) before it finished or blocked.",
  "waiting->ready": "The event or resource the process was waiting for becomes available.",
};

// ---------------------------------------------------------------------------
// Process Control Block (PCB) — simplified conceptual model
// ---------------------------------------------------------------------------

export interface ProcessControlBlock {
  pid: number;
  processState: ProcessLifecycleState;
  programCounter: string;
  cpuRegisters: string;
  schedulingInfo: string;
  memoryManagementInfo: string;
  ioStatusInfo: string;
  resourceInfo: string;
}

export interface ManagedProcess {
  id: string;
  name: string;
  activity: string;
  pcb: ProcessControlBlock;
}

/** The "Multiple Processes" snapshot the spec calls out by example:
 *  P1 running, P2 ready, P3 waiting, P4 ready. Used by both the
 *  Multiple Processes panel and the Process Inspector. */
export const SAMPLE_PROCESSES: ManagedProcess[] = [
  {
    id: "P1",
    name: "Text Editor",
    activity: "Actively executing on the CPU right now.",
    pcb: {
      pid: 101,
      processState: "running",
      programCounter: "0x4F2A",
      cpuRegisters: "AX=0x03, BX=0x1C, SP=0x7FFE",
      schedulingInfo: "Priority 3 · Time slice remaining: 2 units",
      memoryManagementInfo: "Base 0x2000, Limit 4096",
      ioStatusInfo: "No pending I/O",
      resourceInfo: "1 open file handle (document.txt)",
    },
  },
  {
    id: "P2",
    name: "Music Player",
    activity: "Ready and waiting for the scheduler to give it CPU time.",
    pcb: {
      pid: 102,
      processState: "ready",
      programCounter: "0x1A08",
      cpuRegisters: "AX=0x00, BX=0x42, SP=0x7FE2",
      schedulingInfo: "Priority 5 · Waiting in ready queue",
      memoryManagementInfo: "Base 0x5000, Limit 2048",
      ioStatusInfo: "No pending I/O",
      resourceInfo: "1 open file handle (song.mp3), audio device reserved",
    },
  },
  {
    id: "P3",
    name: "File Download",
    activity: "Blocked, waiting for network data to arrive.",
    pcb: {
      pid: 103,
      processState: "waiting",
      programCounter: "0x3C71",
      cpuRegisters: "AX=0x07, BX=0x00, SP=0x7FD8",
      schedulingInfo: "Priority 4 · Blocked, not in ready queue",
      memoryManagementInfo: "Base 0x8000, Limit 8192",
      ioStatusInfo: "Waiting on network socket read",
      resourceInfo: "1 open file handle (download.tmp), network connection open",
    },
  },
  {
    id: "P4",
    name: "Background Sync",
    activity: "Ready and waiting for the scheduler to give it CPU time.",
    pcb: {
      pid: 104,
      processState: "ready",
      programCounter: "0x0F10",
      cpuRegisters: "AX=0x01, BX=0x09, SP=0x7FC4",
      schedulingInfo: "Priority 6 · Waiting in ready queue",
      memoryManagementInfo: "Base 0xA000, Limit 1024",
      ioStatusInfo: "No pending I/O",
      resourceInfo: "No open file handles",
    },
  },
];

export const PCB_DISCLAIMER =
  "Simplified conceptual PCB. Real operating systems store more information, organized differently, and the exact fields and layout vary between systems — this shows the kind of information every OS tracks per process, not an exact memory layout.";

// ---------------------------------------------------------------------------
// Context Switch Laboratory
// ---------------------------------------------------------------------------

export interface ContextSwitchStep {
  id: string;
  title: string;
  description: string;
  /** Which process (if any) is "on the CPU" conceptually during this step. */
  onCpu: "A" | "B" | null;
  /** What the saved-context panel should show at this step. */
  savedContextNote: string;
}

export const CONTEXT_SWITCH_STEPS: ContextSwitchStep[] = [
  {
    id: "running-a",
    title: "Process A is running",
    description: "Process A executes normally on the CPU, its registers and program counter changing as it runs.",
    onCpu: "A",
    savedContextNote: "Nothing saved yet — Process A's context lives in the CPU's registers right now.",
  },
  {
    id: "interrupt",
    title: "Interrupt / scheduler decision",
    description: "A timer interrupt fires (or Process A requests I/O) — the OS decides it's time to switch to Process B.",
    onCpu: "A",
    savedContextNote: "The OS has been signaled to switch, but Process A's context hasn't moved yet.",
  },
  {
    id: "save-a",
    title: "Save Process A's context",
    description: "The CPU's current register values and program counter are copied out of the CPU and into Process A's PCB, so A can resume later exactly where it left off.",
    onCpu: null,
    savedContextNote: "Process A's registers + program counter are now stored in Process A's PCB.",
  },
  {
    id: "update-state-a",
    title: "Update Process A's state",
    description: "Process A's state field in its PCB is updated — to Ready if it was preempted, or Waiting if it requested I/O.",
    onCpu: null,
    savedContextNote: "Process A's PCB now reflects its new state, in addition to its saved context.",
  },
  {
    id: "load-b",
    title: "Load Process B's context",
    description: "Process B's previously saved registers and program counter are copied out of ITS PCB and back into the CPU.",
    onCpu: null,
    savedContextNote: "Process B's saved context is being restored into the CPU right now.",
  },
  {
    id: "resume-b",
    title: "Process B resumes execution",
    description: "Process B continues running exactly where it left off last time — it has no way of knowing it was ever paused.",
    onCpu: "B",
    savedContextNote: "Process B is now running; Process A's context stays safely saved in its PCB until it's switched back in.",
  },
];

export const CONTEXT_SWITCH_OVERHEAD_NOTE =
  "Context switching is never free: saving and loading registers/program counters, and updating scheduling data structures, all take real CPU time in which no process's actual work gets done. Operating systems try to minimize how often this happens for exactly that reason.";

// ---------------------------------------------------------------------------
// I/O Wait scenario
// ---------------------------------------------------------------------------

export type IoWaitPhase = "running" | "requested" | "blocked-other-runs" | "io-complete" | "ready-again";

export interface IoWaitStepInfo {
  phase: IoWaitPhase;
  title: string;
  description: string;
}

export const IO_WAIT_STEPS: IoWaitStepInfo[] = [
  {
    phase: "running",
    title: "Process A is running",
    description: "Process A is executing normally, using the CPU.",
  },
  {
    phase: "requested",
    title: "Process A requests I/O",
    description: "Process A needs something outside the CPU — reading a file, waiting for a network reply, or similar — and issues a request for it.",
  },
  {
    phase: "blocked-other-runs",
    title: "Process A blocks; Process B runs",
    description: "Process A moves to Waiting/Blocked and gives up the CPU. Rather than leaving the CPU idle, the scheduler gives Process B a turn — this is exactly why blocking doesn't waste CPU time.",
  },
  {
    phase: "io-complete",
    title: "Process A's I/O completes",
    description: "The disk, network, or device Process A was waiting on finishes and signals the OS that the data is ready.",
  },
  {
    phase: "ready-again",
    title: "Process A returns to Ready",
    description: "Process A moves back to Ready and rejoins the queue — it doesn't go straight back to Running; it still has to wait its turn for the scheduler to pick it.",
  },
];

// ---------------------------------------------------------------------------
// Process creation (parent -> child)
// ---------------------------------------------------------------------------

export const PROCESS_CREATION_NOTE =
  "Every operating system provides some mechanism for one running process (the parent) to create another (the child) — the exact mechanism (and how much the child initially shares with its parent) differs between operating systems, so this is shown conceptually rather than tied to one specific system's API.";

// ---------------------------------------------------------------------------
// "Identify the State" mini-experiment — short scenario -> correct state
// ---------------------------------------------------------------------------

export interface IdentifyStateScenario {
  id: string;
  description: string;
  correctState: ProcessLifecycleState;
}

export const IDENTIFY_STATE_SCENARIOS: IdentifyStateScenario[] = [
  {
    id: "identify-001",
    description: "A process is actively being executed by the CPU right now.",
    correctState: "running",
  },
  {
    id: "identify-002",
    description: "A process has everything it needs except the CPU, and is sitting in the ready queue.",
    correctState: "ready",
  },
  {
    id: "identify-003",
    description: "A process just issued a request to read a file from disk and cannot continue until that finishes.",
    correctState: "waiting",
  },
  {
    id: "identify-004",
    description: "The operating system is still building this process's Process Control Block; it hasn't been admitted to the ready queue yet.",
    correctState: "new",
  },
  {
    id: "identify-005",
    description: "A process has finished its work, and the OS is cleaning up the resources it was using.",
    correctState: "terminated",
  },
  {
    id: "identify-006",
    description: "A process's time slice just ran out under Round Robin scheduling, so the OS takes the CPU back from it and returns it to the queue.",
    correctState: "ready",
  },
  {
    id: "identify-007",
    description: "A process is waiting for a network response and is consuming zero CPU time while it waits.",
    correctState: "waiting",
  },
  {
    id: "identify-008",
    description: "The scheduler has just selected this process from the ready queue and handed it the CPU.",
    correctState: "running",
  },
];

export const PROCESS_MANAGEMENT_DISCLAIMER =
  "Simplified educational model. Real operating systems implement process states, PCBs, and context switching with more detail and more nuance than shown here, and specifics vary between systems.";

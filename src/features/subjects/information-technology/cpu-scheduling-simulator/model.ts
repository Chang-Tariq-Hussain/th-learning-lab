/**
 * Conceptual model + scheduling engine for the CPU Scheduling
 * Simulator (the "CPU Scheduling Laboratory").
 *
 * Like the other Information Technology simulations, this is a small,
 * discrete, fully client-side model rather than the numeric
 * `@/features/simulation` canvas engine — there's no continuous
 * physical quantity to animate, only processes moving between states
 * and a CPU that runs one of them at a time. Every algorithm here is
 * a SIMPLIFIED EDUCATIONAL MODEL: real operating-system schedulers
 * weigh many more factors (I/O, multiple cores, dynamic priority
 * boosts, real-time deadlines, and more) than this beginner lab
 * models. That simplification is called out directly in the UI
 * wherever it matters, not just here.
 *
 * PRIORITY CONVENTION (stated once, used everywhere): a LOWER
 * priority number means HIGHER priority — Priority 1 runs before
 * Priority 5. This matches the common Unix `nice`-style convention
 * and is surfaced explicitly in the UI so it's never ambiguous.
 */

export type SchedulingAlgorithm = "fcfs" | "sjf" | "round-robin" | "priority";

export const ALGORITHM_INFO: Record<
  SchedulingAlgorithm,
  { label: string; shortLabel: string; preemptive: boolean; summary: string }
> = {
  fcfs: {
    label: "First-Come, First-Served (FCFS)",
    shortLabel: "FCFS",
    preemptive: false,
    summary: "The process that arrives first gets the CPU first, and keeps it until it finishes.",
  },
  sjf: {
    label: "Shortest Job First (SJF)",
    shortLabel: "SJF",
    preemptive: false,
    summary: "Whichever arrived process has the shortest total burst time runs next, uninterrupted, once started.",
  },
  "round-robin": {
    label: "Round Robin",
    shortLabel: "Round Robin",
    preemptive: true,
    summary: "Every ready process gets a fixed slice of CPU time (the time quantum), in rotating order.",
  },
  priority: {
    label: "Priority Scheduling",
    shortLabel: "Priority",
    preemptive: false,
    summary: "The arrived process with the best (lowest-numbered) priority runs next, uninterrupted, once started.",
  },
};

/** A student-editable process definition — the input to every algorithm. */
export interface SimProcess {
  id: string;
  arrivalTime: number;
  burstTime: number;
  /** Lower number = higher priority. Only read by Priority Scheduling. */
  priority: number;
}

export type ProcessRuntimeState = "new" | "ready" | "running" | "completed";

/** One contiguous slice of the CPU timeline. `processId: null` means the CPU sat idle. */
export interface GanttSegment {
  processId: string | null;
  start: number;
  end: number;
}

export interface ProcessResult {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  completionTime: number;
  /** Turnaround Time = Completion Time − Arrival Time */
  turnaroundTime: number;
  /** Waiting Time = Turnaround Time − Burst Time */
  waitingTime: number;
  /** Response Time = time of first CPU access − Arrival Time */
  responseTime: number;
  /** How many separate CPU bursts this process received (>1 only under Round Robin). */
  timesScheduled: number;
}

export interface ScheduleResult {
  algorithm: SchedulingAlgorithm;
  quantum?: number;
  segments: GanttSegment[];
  processResults: ProcessResult[];
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  averageResponseTime: number;
  totalTime: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

function average(nums: number[]): number {
  if (nums.length === 0) return 0;
  return round2(nums.reduce((a, b) => a + b, 0) / nums.length);
}

/** Merges consecutive segments that ran the same process back to back
 *  (only matters for Round Robin, where a process can otherwise show
 *  as two adjacent segments if it happens to be re-picked immediately). */
function mergeSegments(segments: GanttSegment[]): GanttSegment[] {
  const merged: GanttSegment[] = [];
  for (const seg of segments) {
    const last = merged[merged.length - 1];
    if (last && last.processId === seg.processId && last.end === seg.start) {
      last.end = seg.end;
    } else {
      merged.push({ ...seg });
    }
  }
  return merged;
}

interface RunState {
  remaining: Map<string, number>;
  firstStart: Map<string, number>;
  completion: Map<string, number>;
  timesScheduled: Map<string, number>;
}

function initRunState(processes: SimProcess[]): RunState {
  return {
    remaining: new Map(processes.map((p) => [p.id, p.burstTime])),
    firstStart: new Map(),
    completion: new Map(),
    timesScheduled: new Map(processes.map((p) => [p.id, 0])),
  };
}

function buildResults(processes: SimProcess[], state: RunState): ProcessResult[] {
  return processes.map((p) => {
    const completionTime = state.completion.get(p.id) ?? p.arrivalTime + p.burstTime;
    const turnaroundTime = completionTime - p.arrivalTime;
    const waitingTime = turnaroundTime - p.burstTime;
    const responseTime = (state.firstStart.get(p.id) ?? p.arrivalTime) - p.arrivalTime;
    return {
      id: p.id,
      arrivalTime: p.arrivalTime,
      burstTime: p.burstTime,
      priority: p.priority,
      completionTime,
      turnaroundTime,
      waitingTime,
      responseTime,
      timesScheduled: state.timesScheduled.get(p.id) ?? 1,
    };
  });
}

/**
 * Shared engine for the three NON-preemptive algorithms (FCFS, SJF,
 * Priority). `pickNext` receives every process that has arrived by
 * `time` and hasn't finished yet, and must return the one that should
 * run next — the only thing that differs between the three
 * algorithms is that one selection rule.
 */
function runNonPreemptive(
  processes: SimProcess[],
  algorithm: SchedulingAlgorithm,
  pickNext: (ready: SimProcess[]) => SimProcess,
): ScheduleResult {
  const state = initRunState(processes);
  const segments: GanttSegment[] = [];
  const remainingIds = new Set(processes.map((p) => p.id));
  let time = processes.length ? Math.min(...processes.map((p) => p.arrivalTime)) : 0;

  while (remainingIds.size > 0) {
    const ready = processes.filter((p) => remainingIds.has(p.id) && p.arrivalTime <= time);
    if (ready.length === 0) {
      const nextArrival = Math.min(
        ...processes.filter((p) => remainingIds.has(p.id)).map((p) => p.arrivalTime),
      );
      if (nextArrival > time) segments.push({ processId: null, start: time, end: nextArrival });
      time = nextArrival;
      continue;
    }
    const chosen = pickNext(ready);
    if (!state.firstStart.has(chosen.id)) state.firstStart.set(chosen.id, time);
    const start = time;
    const end = time + chosen.burstTime;
    segments.push({ processId: chosen.id, start, end });
    state.timesScheduled.set(chosen.id, 1);
    state.completion.set(chosen.id, end);
    remainingIds.delete(chosen.id);
    time = end;
  }

  const processResults = buildResults(processes, state);
  return {
    algorithm,
    segments: mergeSegments(segments),
    processResults,
    averageWaitingTime: average(processResults.map((r) => r.waitingTime)),
    averageTurnaroundTime: average(processResults.map((r) => r.turnaroundTime)),
    averageResponseTime: average(processResults.map((r) => r.responseTime)),
    totalTime: time,
  };
}

export function runFcfs(processes: SimProcess[]): ScheduleResult {
  return runNonPreemptive(processes, "fcfs", (ready) =>
    [...ready].sort((a, b) => a.arrivalTime - b.arrivalTime || a.id.localeCompare(b.id))[0]!,
  );
}

export function runSjf(processes: SimProcess[]): ScheduleResult {
  return runNonPreemptive(processes, "sjf", (ready) =>
    [...ready].sort(
      (a, b) => a.burstTime - b.burstTime || a.arrivalTime - b.arrivalTime || a.id.localeCompare(b.id),
    )[0]!,
  );
}

export interface PriorityOptions {
  /** Aging: every `agingInterval` time units a process has waited
   *  since arrival, its effective priority improves by 1 (its number
   *  goes down by 1, to a floor of 1) — a simple, common technique
   *  for reducing starvation. Off by default. */
  agingEnabled?: boolean;
  agingInterval?: number;
}

export function runPriority(processes: SimProcess[], options: PriorityOptions = {}): ScheduleResult {
  const { agingEnabled = false, agingInterval = 4 } = options;
  // Effective priority depends on `time`, so this can't reuse the
  // generic `pickNext(ready)` signature directly — it's implemented
  // as its own small loop that mirrors `runNonPreemptive`.
  const state = initRunState(processes);
  const segments: GanttSegment[] = [];
  const remainingIds = new Set(processes.map((p) => p.id));
  let time = processes.length ? Math.min(...processes.map((p) => p.arrivalTime)) : 0;

  const effectivePriority = (p: SimProcess) => {
    if (!agingEnabled) return p.priority;
    const waited = Math.max(0, time - p.arrivalTime);
    return Math.max(1, p.priority - Math.floor(waited / agingInterval));
  };

  while (remainingIds.size > 0) {
    const ready = processes.filter((p) => remainingIds.has(p.id) && p.arrivalTime <= time);
    if (ready.length === 0) {
      const nextArrival = Math.min(
        ...processes.filter((p) => remainingIds.has(p.id)).map((p) => p.arrivalTime),
      );
      if (nextArrival > time) segments.push({ processId: null, start: time, end: nextArrival });
      time = nextArrival;
      continue;
    }
    const chosen = [...ready].sort(
      (a, b) =>
        effectivePriority(a) - effectivePriority(b) ||
        a.arrivalTime - b.arrivalTime ||
        a.id.localeCompare(b.id),
    )[0]!;
    if (!state.firstStart.has(chosen.id)) state.firstStart.set(chosen.id, time);
    const start = time;
    const end = time + chosen.burstTime;
    segments.push({ processId: chosen.id, start, end });
    state.timesScheduled.set(chosen.id, 1);
    state.completion.set(chosen.id, end);
    remainingIds.delete(chosen.id);
    time = end;
  }

  const processResults = buildResults(processes, state);
  return {
    algorithm: "priority",
    segments: mergeSegments(segments),
    processResults,
    averageWaitingTime: average(processResults.map((r) => r.waitingTime)),
    averageTurnaroundTime: average(processResults.map((r) => r.turnaroundTime)),
    averageResponseTime: average(processResults.map((r) => r.responseTime)),
    totalTime: time,
  };
}

/**
 * Round Robin — the one PREEMPTIVE algorithm here. A ready queue
 * (FIFO) holds every process waiting for CPU time; each turn runs the
 * process at the front for at most `quantum` time units. If it isn't
 * finished, it goes to the back of the queue. Convention used below:
 * when a slice ends, any processes that arrived DURING that slice are
 * enqueued first, then the just-run (still unfinished) process is
 * enqueued after them — a common, simple tie-breaking rule that keeps
 * a process from unfairly cutting in front of arrivals it overlapped.
 */
export function runRoundRobin(processes: SimProcess[], quantum: number): ScheduleResult {
  const q = Math.max(1, Math.floor(quantum));
  const state = initRunState(processes);
  const segments: GanttSegment[] = [];
  const sortedByArrival = [...processes].sort(
    (a, b) => a.arrivalTime - b.arrivalTime || a.id.localeCompare(b.id),
  );

  const queue: string[] = [];
  const inQueue = new Set<string>();
  let arrivalPointer = 0;
  let time = sortedByArrival.length ? sortedByArrival[0]!.arrivalTime : 0;

  const enqueueArrivalsUpTo = (t: number) => {
    while (arrivalPointer < sortedByArrival.length && sortedByArrival[arrivalPointer]!.arrivalTime <= t) {
      const p = sortedByArrival[arrivalPointer]!;
      if ((state.remaining.get(p.id) ?? 0) > 0 && !inQueue.has(p.id)) {
        queue.push(p.id);
        inQueue.add(p.id);
      }
      arrivalPointer += 1;
    }
  };

  enqueueArrivalsUpTo(time);

  let guard = 0;
  const totalBurst = processes.reduce((sum, p) => sum + p.burstTime, 0);
  const maxIterations = (processes.length + 2) * Math.max(1, Math.ceil(totalBurst / q)) + processes.length + 50;

  while ((queue.length > 0 || arrivalPointer < sortedByArrival.length) && guard < maxIterations) {
    guard += 1;
    if (queue.length === 0) {
      // CPU idle until the next arrival.
      const nextArrival = sortedByArrival[arrivalPointer]!.arrivalTime;
      if (nextArrival > time) segments.push({ processId: null, start: time, end: nextArrival });
      time = nextArrival;
      enqueueArrivalsUpTo(time);
      continue;
    }

    const currentId = queue.shift()!;
    inQueue.delete(currentId);
    const process = processes.find((p) => p.id === currentId)!;
    const remaining = state.remaining.get(currentId) ?? 0;
    const runFor = Math.min(q, remaining);

    if (!state.firstStart.has(currentId)) state.firstStart.set(currentId, time);
    const start = time;
    const end = time + runFor;
    segments.push({ processId: currentId, start, end });
    state.timesScheduled.set(currentId, (state.timesScheduled.get(currentId) ?? 0) + 1);
    state.remaining.set(currentId, remaining - runFor);
    time = end;

    // Arrivals during this slice join the queue before the process
    // we just ran (if it still has work left).
    enqueueArrivalsUpTo(time);

    const stillRemaining = state.remaining.get(currentId) ?? 0;
    if (stillRemaining > 0) {
      queue.push(currentId);
      inQueue.add(currentId);
    } else {
      state.completion.set(currentId, time);
    }
  }

  const processResults = buildResults(processes, state);
  return {
    algorithm: "round-robin",
    quantum: q,
    segments: mergeSegments(segments),
    processResults,
    averageWaitingTime: average(processResults.map((r) => r.waitingTime)),
    averageTurnaroundTime: average(processResults.map((r) => r.turnaroundTime)),
    averageResponseTime: average(processResults.map((r) => r.responseTime)),
    totalTime: time,
  };
}

export function runScheduler(
  processes: SimProcess[],
  algorithm: SchedulingAlgorithm,
  quantum: number,
  priorityOptions?: PriorityOptions,
): ScheduleResult {
  if (processes.length === 0) {
    return {
      algorithm,
      quantum: algorithm === "round-robin" ? quantum : undefined,
      segments: [],
      processResults: [],
      averageWaitingTime: 0,
      averageTurnaroundTime: 0,
      averageResponseTime: 0,
      totalTime: 0,
    };
  }
  switch (algorithm) {
    case "fcfs":
      return runFcfs(processes);
    case "sjf":
      return runSjf(processes);
    case "priority":
      return runPriority(processes, priorityOptions);
    case "round-robin":
      return runRoundRobin(processes, quantum);
  }
}

/** The state a process is conceptually in at a given simulated time,
 *  derived from a computed `ScheduleResult` rather than tracked
 *  separately — a single source of truth for both the Gantt chart and
 *  the CPU/Ready Queue visualization. */
export function processStateAt(
  process: SimProcess,
  result: ScheduleResult,
  time: number,
): ProcessRuntimeState {
  if (time < process.arrivalTime) return "new";
  const runningNow = result.segments.find(
    (s) => s.processId === process.id && time >= s.start && time < s.end,
  );
  if (runningNow) return "running";
  const finished = result.processResults.find((r) => r.id === process.id);
  if (finished && time >= finished.completionTime) return "completed";
  return "ready";
}

/** Default demonstration process set — small, readable numbers, with
 *  a mix of arrival times and burst times so every algorithm produces
 *  a visibly different schedule. */
export const DEFAULT_PROCESSES: SimProcess[] = [
  { id: "P1", arrivalTime: 0, burstTime: 5, priority: 3 },
  { id: "P2", arrivalTime: 1, burstTime: 3, priority: 1 },
  { id: "P3", arrivalTime: 2, burstTime: 8, priority: 4 },
  { id: "P4", arrivalTime: 3, burstTime: 2, priority: 2 },
];

/**
 * STARVATION preset — a low-priority process (P1) arrives first with
 * a modest burst, but a stream of higher-priority processes keeps
 * arriving right as P1 would otherwise get its turn. Under plain
 * (non-aging) Priority Scheduling, P1 waits far longer than anyone
 * else — a concrete, visible example of starvation, not just a
 * definition. Toggling aging on in the simulator fixes it.
 */
export const STARVATION_PROCESSES: SimProcess[] = [
  { id: "P1", arrivalTime: 0, burstTime: 4, priority: 5 },
  { id: "P2", arrivalTime: 1, burstTime: 3, priority: 2 },
  { id: "P3", arrivalTime: 4, burstTime: 3, priority: 1 },
  { id: "P4", arrivalTime: 8, burstTime: 3, priority: 2 },
  { id: "P5", arrivalTime: 12, burstTime: 3, priority: 1 },
];

export const DEFAULT_QUANTUM = 2;

export const SCHEDULING_DISCLAIMER =
  "Simplified educational model. Real operating-system schedulers weigh many more factors — multiple CPU cores, I/O activity, dynamic priority adjustments, real-time deadlines, and more — than these four classic algorithms show on their own.";

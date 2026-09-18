/**
 * Deadlock Simulator — pure simulation logic. Nothing here touches
 * React; every function takes a state and returns a new state or an
 * analysis result, same convention as `paging-simulator/model.ts`.
 *
 * Two related but distinct algorithms live here and are kept
 * carefully separate, per the brief's emphasis on technical accuracy:
 *
 *  - `findCycle` + `isDeadlockCertainFromCycle` — Resource Allocation
 *    Graph cycle detection. A cycle is *sufficient* for deadlock only
 *    when every resource on the cycle is single-instance. With any
 *    multi-instance resource on the cycle, a cycle does not by itself
 *    prove deadlock.
 *  - `runDetectionAlgorithm` — the general reduction algorithm (works
 *    for both single- and multi-instance resources) that actually
 *    determines which processes, if any, are deadlocked. This is the
 *    same reduction the Banker's Algorithm's safety check performs,
 *    but starting from *current* allocation/requests rather than
 *    hypothetical maximums.
 */

export interface ResourceDef {
  id: string;
  name: string;
  /** Total instances of this resource type. 1 = single-instance. */
  instances: number;
}

export interface ProcessDef {
  id: string;
  name: string;
}

/** processId -> resourceId -> count currently held. */
export type AllocationMatrix = Record<string, Record<string, number>>;
/** processId -> resourceId -> count currently requested (outstanding, unmet). */
export type RequestMatrix = Record<string, Record<string, number>>;

export interface RagState {
  processes: ProcessDef[];
  resources: ResourceDef[];
  allocation: AllocationMatrix;
  request: RequestMatrix;
}

// ---------------------------------------------------------------------------
// Construction helpers
// ---------------------------------------------------------------------------

export function cloneMatrix(m: AllocationMatrix): AllocationMatrix {
  const out: AllocationMatrix = {};
  for (const pid of Object.keys(m)) out[pid] = { ...m[pid] };
  return out;
}

export function cloneRagState(state: RagState): RagState {
  return {
    processes: state.processes.map((p) => ({ ...p })),
    resources: state.resources.map((r) => ({ ...r })),
    allocation: cloneMatrix(state.allocation),
    request: cloneMatrix(state.request),
  };
}

export function heldCount(state: RagState, processId: string, resourceId: string): number {
  return state.allocation[processId]?.[resourceId] ?? 0;
}

export function requestedCount(state: RagState, processId: string, resourceId: string): number {
  return state.request[processId]?.[resourceId] ?? 0;
}

/** Instances of a resource not currently held by anyone. */
export function availableInstances(state: RagState, resourceId: string): number {
  const resource = state.resources.find((r) => r.id === resourceId);
  if (!resource) return 0;
  let held = 0;
  for (const pid of Object.keys(state.allocation)) held += state.allocation[pid]?.[resourceId] ?? 0;
  return resource.instances - held;
}

export function isProcessWaiting(state: RagState, processId: string): boolean {
  const req = state.request[processId];
  if (!req) return false;
  return Object.values(req).some((n) => n > 0);
}

export type ProcessRuntimeState = "running" | "waiting" | "blocked";

/** Section 14 — connects a process's RAG status to a Process
 *  Management-style state label. "Blocked" is reserved for processes
 *  the detection algorithm has actually confirmed are deadlocked;
 *  a merely-waiting process (which may still get unblocked) is
 *  "waiting", not "blocked". */
export function processRuntimeState(
  state: RagState,
  processId: string,
  deadlockedIds: string[],
): ProcessRuntimeState {
  if (deadlockedIds.includes(processId)) return "blocked";
  if (isProcessWaiting(state, processId)) return "waiting";
  return "running";
}

// ---------------------------------------------------------------------------
// Mutating actions (return a new state)
// ---------------------------------------------------------------------------

export function allocate(state: RagState, processId: string, resourceId: string, count = 1): RagState {
  const next = cloneRagState(state);
  next.allocation[processId] = next.allocation[processId] ?? {};
  next.allocation[processId][resourceId] = (next.allocation[processId][resourceId] ?? 0) + count;
  return next;
}

export function release(state: RagState, processId: string, resourceId: string, count = 1): RagState {
  const next = cloneRagState(state);
  const held = next.allocation[processId]?.[resourceId] ?? 0;
  next.allocation[processId] = next.allocation[processId] ?? {};
  next.allocation[processId][resourceId] = Math.max(0, held - count);
  return next;
}

export function requestResource(state: RagState, processId: string, resourceId: string, count = 1): RagState {
  const next = cloneRagState(state);
  next.request[processId] = next.request[processId] ?? {};
  next.request[processId][resourceId] = (next.request[processId][resourceId] ?? 0) + count;
  return next;
}

/** Grants an outstanding request immediately (used when the student
 *  or the simulator decides a waiting request can now be satisfied). */
export function grantRequest(state: RagState, processId: string, resourceId: string, count = 1): RagState {
  const next = cloneRagState(state);
  const req = next.request[processId]?.[resourceId] ?? 0;
  const grant = Math.min(count, req);
  if (grant <= 0) return next;
  next.request[processId] = next.request[processId] ?? {};
  next.request[processId]![resourceId] = req - grant;
  return allocate(next, processId, resourceId, grant);
}

// ---------------------------------------------------------------------------
// Resource Allocation Graph — cycle detection
// ---------------------------------------------------------------------------

interface GraphEdge {
  from: string;
  to: string;
  kind: "assignment" | "request";
}

export function buildGraphEdges(state: RagState): GraphEdge[] {
  const edges: GraphEdge[] = [];
  for (const p of state.processes) {
    for (const r of state.resources) {
      const held = heldCount(state, p.id, r.id);
      if (held > 0) edges.push({ from: r.id, to: p.id, kind: "assignment" }); // R -> P
      const req = requestedCount(state, p.id, r.id);
      if (req > 0) edges.push({ from: p.id, to: r.id, kind: "request" }); // P -> R
    }
  }
  return edges;
}

export interface CycleResult {
  hasCycle: boolean;
  /** Node ids (process/resource ids) in one detected cycle, in order. */
  cycleNodes: string[];
  /** Resource ids that appear on the cycle. */
  cycleResourceIds: string[];
}

/** DFS-based cycle detection over the directed RAG. Returns the first
 *  cycle found (RAGs used here are small teaching examples, so "a"
 *  cycle rather than "all cycles" is sufficient). */
export function findCycle(state: RagState): CycleResult {
  const edges = buildGraphEdges(state);
  const adjacency = new Map<string, string[]>();
  for (const e of edges) {
    if (!adjacency.has(e.from)) adjacency.set(e.from, []);
    adjacency.get(e.from)!.push(e.to);
  }

  const allNodeIds = [...state.processes.map((p) => p.id), ...state.resources.map((r) => r.id)];
  const visited = new Set<string>();
  const stack: string[] = [];
  const onStack = new Set<string>();

  let found: string[] | null = null;

  function dfs(node: string) {
    if (found) return;
    visited.add(node);
    stack.push(node);
    onStack.add(node);
    for (const next of adjacency.get(node) ?? []) {
      if (found) return;
      if (onStack.has(next)) {
        const cycleStart = stack.indexOf(next);
        found = stack.slice(cycleStart).concat(next);
        return;
      }
      if (!visited.has(next)) dfs(next);
    }
    stack.pop();
    onStack.delete(node);
  }

  for (const id of allNodeIds) {
    if (!visited.has(id) && !found) dfs(id);
  }

  const cycleNodes = found ?? [];
  const resourceIdSet = new Set(state.resources.map((r) => r.id));
  const cycleResourceIds = cycleNodes.filter((id) => resourceIdSet.has(id));

  return { hasCycle: cycleNodes.length > 0, cycleNodes, cycleResourceIds };
}

/** A cycle is *sufficient proof* of deadlock only when every resource
 *  on it is single-instance. This is the distinction the brief calls
 *  out explicitly — never collapse it. */
export function isCycleSufficientForDeadlock(state: RagState, cycle: CycleResult): boolean {
  if (!cycle.hasCycle) return false;
  return cycle.cycleResourceIds.every((rid) => {
    const resource = state.resources.find((r) => r.id === rid);
    return resource ? resource.instances === 1 : false;
  });
}

// ---------------------------------------------------------------------------
// Deadlock detection algorithm (general — single AND multi instance)
// ---------------------------------------------------------------------------

export interface DetectionStepRecord {
  processId: string;
  /** Whether this process's outstanding request could be satisfied by
   *  `availableBefore`, letting it (hypothetically) finish. */
  couldFinish: boolean;
  availableBefore: Record<string, number>;
  availableAfter: Record<string, number>;
}

export interface DetectionResult {
  finishedOrder: string[];
  deadlockedProcessIds: string[];
  steps: DetectionStepRecord[];
}

/** Same reduction idea as the Banker's safety algorithm, but run
 *  against *actual* current allocation and outstanding requests
 *  rather than declared maximums — this is what an OS's detection
 *  routine does. Any process left un-finished at the end is genuinely
 *  deadlocked (or waiting on a process that is). */
export function runDetectionAlgorithm(state: RagState): DetectionResult {
  const available: Record<string, number> = {};
  for (const r of state.resources) available[r.id] = availableInstances(state, r.id);

  const finished = new Set<string>();
  const steps: DetectionStepRecord[] = [];
  const finishedOrder: string[] = [];

  let progressed = true;
  while (progressed) {
    progressed = false;
    for (const p of state.processes) {
      if (finished.has(p.id)) continue;
      const req = state.request[p.id] ?? {};
      const canFinish = state.resources.every((r) => (req[r.id] ?? 0) <= (available[r.id] ?? 0));
      if (canFinish) {
        const availableBefore = { ...available };
        for (const r of state.resources) {
          available[r.id] = (available[r.id] ?? 0) + heldCount(state, p.id, r.id);
        }
        steps.push({ processId: p.id, couldFinish: true, availableBefore, availableAfter: { ...available } });
        finished.add(p.id);
        finishedOrder.push(p.id);
        progressed = true;
      }
    }
  }

  const deadlockedProcessIds = state.processes.filter((p) => !finished.has(p.id)).map((p) => p.id);
  for (const pid of deadlockedProcessIds) {
    steps.push({ processId: pid, couldFinish: false, availableBefore: { ...available }, availableAfter: { ...available } });
  }

  return { finishedOrder, deadlockedProcessIds, steps };
}

// ---------------------------------------------------------------------------
// Banker's Algorithm
// ---------------------------------------------------------------------------

export interface BankerState {
  resources: ResourceDef[];
  processes: ProcessDef[];
  allocation: AllocationMatrix;
  max: AllocationMatrix;
}

export function computeNeed(banker: BankerState): AllocationMatrix {
  const need: AllocationMatrix = {};
  for (const p of banker.processes) {
    need[p.id] = {};
    for (const r of banker.resources) {
      const max = banker.max[p.id]?.[r.id] ?? 0;
      const alloc = banker.allocation[p.id]?.[r.id] ?? 0;
      need[p.id]![r.id] = Math.max(0, max - alloc);
    }
  }
  return need;
}

export function computeAvailable(banker: BankerState): Record<string, number> {
  const available: Record<string, number> = {};
  for (const r of banker.resources) {
    let held = 0;
    for (const p of banker.processes) held += banker.allocation[p.id]?.[r.id] ?? 0;
    available[r.id] = r.instances - held;
  }
  return available;
}

export interface SafetyStepRecord {
  processId: string;
  availableBefore: Record<string, number>;
  need: Record<string, number>;
  granted: boolean;
  availableAfter: Record<string, number>;
}

export interface SafetyResult {
  safe: boolean;
  sequence: string[];
  steps: SafetyStepRecord[];
}

/** The safety algorithm: repeatedly find a process whose Need fits
 *  within Available, "pretend" it runs to completion and releases
 *  everything it holds, and add it to the safe sequence. If every
 *  process can eventually be finished this way, the state is safe. */
export function runSafetyAlgorithm(banker: BankerState): SafetyResult {
  const need = computeNeed(banker);
  const available = computeAvailable(banker);
  const finished = new Set<string>();
  const sequence: string[] = [];
  const steps: SafetyStepRecord[] = [];

  let progressed = true;
  while (progressed) {
    progressed = false;
    for (const p of banker.processes) {
      if (finished.has(p.id)) continue;
      const fits = banker.resources.every((r) => (need[p.id]?.[r.id] ?? 0) <= (available[r.id] ?? 0));
      if (fits) {
        const availableBefore = { ...available };
        for (const r of banker.resources) available[r.id] = (available[r.id] ?? 0) + (banker.allocation[p.id]?.[r.id] ?? 0);
        steps.push({
          processId: p.id,
          availableBefore,
          need: { ...need[p.id] },
          granted: true,
          availableAfter: { ...available },
        });
        finished.add(p.id);
        sequence.push(p.id);
        progressed = true;
      }
    }
  }

  const safe = finished.size === banker.processes.length;
  return { safe, sequence, steps };
}

export interface RequestEvaluation {
  requestId: string;
  /** Request ≤ Need? */
  withinNeed: boolean;
  /** Request ≤ Available? */
  withinAvailable: boolean;
  /** Only computed when both checks above pass. */
  resultingSafety?: SafetyResult;
  decision: "granted" | "deferred-unsafe" | "denied-exceeds-need" | "denied-exceeds-available";
  reason: string;
}

/** Section 8 — the full request-handling sequence: Request ≤ Need?,
 *  Request ≤ Available?, pretend-allocate, run the safety test, then
 *  grant or defer. Never mutates `banker`; returns the evaluation plus
 *  (if the request would be granted) the hypothetical post-grant
 *  `BankerState` so the caller can decide to commit it. */
export function evaluateRequest(
  banker: BankerState,
  processId: string,
  request: Record<string, number>,
): { evaluation: RequestEvaluation; nextState?: BankerState } {
  const need = computeNeed(banker);
  const available = computeAvailable(banker);

  const withinNeed = banker.resources.every((r) => (request[r.id] ?? 0) <= (need[processId]?.[r.id] ?? 0));
  if (!withinNeed) {
    return {
      evaluation: {
        requestId: processId,
        withinNeed: false,
        withinAvailable: false,
        decision: "denied-exceeds-need",
        reason: "The request exceeds this process's declared maximum need — that would be a bug in the process, not a resource shortage.",
      },
    };
  }

  const withinAvailable = banker.resources.every((r) => (request[r.id] ?? 0) <= (available[r.id] ?? 0));
  if (!withinAvailable) {
    return {
      evaluation: {
        requestId: processId,
        withinNeed: true,
        withinAvailable: false,
        decision: "denied-exceeds-available",
        reason: "The resources are within this process's need, but not enough instances are free right now — the process must wait.",
      },
    };
  }

  // Pretend-allocate, then re-run the safety test on the hypothetical state.
  const hypothetical: BankerState = {
    resources: banker.resources,
    processes: banker.processes,
    max: banker.max,
    allocation: cloneMatrix(banker.allocation),
  };
  hypothetical.allocation[processId] = { ...hypothetical.allocation[processId] };
  for (const r of banker.resources) {
    const grant = request[r.id] ?? 0;
    if (grant > 0) hypothetical.allocation[processId][r.id] = (hypothetical.allocation[processId][r.id] ?? 0) + grant;
  }

  const resultingSafety = runSafetyAlgorithm(hypothetical);

  if (resultingSafety.safe) {
    return {
      evaluation: {
        requestId: processId,
        withinNeed: true,
        withinAvailable: true,
        resultingSafety,
        decision: "granted",
        reason: "Available and within need, and the resulting state is still safe — a completion sequence still exists, so the request is granted.",
      },
      nextState: hypothetical,
    };
  }

  return {
    evaluation: {
      requestId: processId,
      withinNeed: true,
      withinAvailable: true,
      resultingSafety,
      decision: "deferred-unsafe",
      reason: "Resources are technically available, but granting this request would leave no safe completion sequence — so it is deferred, even though it could be satisfied right now.",
    },
  };
}

// ---------------------------------------------------------------------------
// Coffman conditions experiment (Section 3)
// ---------------------------------------------------------------------------

export interface CoffmanConditions {
  mutualExclusion: boolean;
  holdAndWait: boolean;
  noPreemption: boolean;
  circularWait: boolean;
}

export const ALL_CONDITIONS_TRUE: CoffmanConditions = {
  mutualExclusion: true,
  holdAndWait: true,
  noPreemption: true,
  circularWait: true,
};

/** For the classic two-process/two-resource scenario used throughout
 *  this lab: deadlock requires all four Coffman conditions to hold
 *  simultaneously. Breaking any single one breaks the classic
 *  scenario (this does not generalize to "breaking one condition
 *  always prevents every possible deadlock" — that nuance is taught
 *  separately in the Prevention tab). */
export function coffmanDeadlockWouldOccur(conditions: CoffmanConditions): boolean {
  return conditions.mutualExclusion && conditions.holdAndWait && conditions.noPreemption && conditions.circularWait;
}

export const CONDITION_BREAK_EXPLANATIONS: Record<keyof CoffmanConditions, string> = {
  mutualExclusion:
    "If the resource could be shared simultaneously (no exclusive hold), neither process would ever need to wait for the other to release it — the wait-cycle never forms. In practice, many resources (a printer, a write lock) genuinely cannot be made shareable.",
  holdAndWait:
    "If a process had to request every resource it would ever need up front, before running, it would either get everything at once or get nothing — it could never sit holding one resource while blocked waiting for another.",
  noPreemption:
    "If a resource could be forcibly taken back from a process that holds it, the OS could break the cycle by preempting one process's resource and handing it to the other.",
  circularWait:
    "If resources must always be requested in one fixed global order, the specific back-and-forth pattern that forms a cycle becomes impossible to construct.",
};

// ---------------------------------------------------------------------------
// Preset scenarios (Section 15)
// ---------------------------------------------------------------------------

function emptyMatrix(processes: ProcessDef[]): AllocationMatrix {
  const m: AllocationMatrix = {};
  for (const p of processes) m[p.id] = {};
  return m;
}

export function makeScenario(
  processNames: string[],
  resourceDefs: { name: string; instances: number }[],
): RagState {
  const processes = processNames.map((name, i) => ({ id: `p${i + 1}`, name }));
  const resources = resourceDefs.map((r, i) => ({ id: `r${i + 1}`, name: r.name, instances: r.instances }));
  return { processes, resources, allocation: emptyMatrix(processes), request: emptyMatrix(processes) };
}

export const SCENARIO_TWO_PROCESS: RagState = (() => {
  let s = makeScenario(["P1", "P2"], [{ name: "Printer", instances: 1 }, { name: "Scanner", instances: 1 }]);
  s = allocate(s, "p1", "r1"); // P1 holds Printer
  s = allocate(s, "p2", "r2"); // P2 holds Scanner
  s = requestResource(s, "p1", "r2"); // P1 requests Scanner
  s = requestResource(s, "p2", "r1"); // P2 requests Printer
  return s;
})();

export const SCENARIO_THREE_PROCESS: RagState = (() => {
  let s = makeScenario(
    ["P1", "P2", "P3"],
    [{ name: "Database Connection", instances: 2 }, { name: "Tape Drive", instances: 1 }, { name: "Network Port", instances: 1 }],
  );
  s = allocate(s, "p1", "r1"); // P1 holds 1 DB connection
  s = allocate(s, "p2", "r2"); // P2 holds Tape Drive
  s = allocate(s, "p3", "r3"); // P3 holds Network Port
  s = requestResource(s, "p1", "r2"); // P1 wants Tape Drive
  s = requestResource(s, "p2", "r3"); // P2 wants Network Port
  s = requestResource(s, "p3", "r1"); // P3 wants a DB connection
  return s;
})();

export const BANKER_SAFE_EXAMPLE: BankerState = {
  resources: [
    { id: "r1", name: "A", instances: 10 },
    { id: "r2", name: "B", instances: 5 },
    { id: "r3", name: "C", instances: 7 },
  ],
  processes: [
    { id: "p1", name: "P1" },
    { id: "p2", name: "P2" },
    { id: "p3", name: "P3" },
    { id: "p4", name: "P4" },
    { id: "p5", name: "P5" },
  ],
  allocation: {
    p1: { r1: 0, r2: 1, r3: 0 },
    p2: { r1: 2, r2: 0, r3: 0 },
    p3: { r1: 3, r2: 0, r3: 2 },
    p4: { r1: 2, r2: 1, r3: 1 },
    p5: { r1: 0, r2: 0, r3: 2 },
  },
  max: {
    p1: { r1: 7, r2: 5, r3: 3 },
    p2: { r1: 3, r2: 2, r3: 2 },
    p3: { r1: 9, r2: 0, r3: 2 },
    p4: { r1: 2, r2: 2, r3: 2 },
    p5: { r1: 4, r2: 3, r3: 3 },
  },
};

export const SCENARIO_LABELS = {
  twoProcess: "Two processes, two resources",
  threeProcess: "Three processes, three resources",
} as const;

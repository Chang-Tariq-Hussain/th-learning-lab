import {
  LOG_LABEL,
  SCENARIOS,
  buildPlan,
  buildTables,
  routeLabel,
  type LogKind,
  type Plan,
  type PlanStep,
  type RoutingTables,
  type ScenarioId,
  type StaticRouteSeed,
} from "./model";

export { LOG_LABEL };
export type { LogKind };

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LogEntry {
  id: number;
  /** HH:MM:SS wall-clock time of the event. */
  time: string;
  kind: LogKind;
  text: string;
}

export type NoticeTone = "good" | "info" | "warn";
export interface Notice {
  tone: NoticeTone;
  text: string;
}

export type Mode = "auto" | "step";

export interface LabState {
  scenarioId: ScenarioId;
  /** The static routes currently configured. Connected routes are derived from interfaces. */
  seeds: StaticRouteSeed[];
  plan: Plan | null;
  /** Increments with every packet sent, so the diagram can start a new token instead of sliding the old one. */
  txId: number;
  /** Index of the plan step currently shown. */
  idx: number;
  playing: boolean;
  mode: Mode;
  /** Router whose table is shown. */
  viewRouter: string;
  log: LogEntry[];
  nextLogId: number;
  notice: Notice | null;
}

export type LabAction =
  | { type: "send"; src: string; dst: string; now: number }
  | { type: "next"; now: number }
  | { type: "play" }
  | { type: "pause" }
  | { type: "cancel"; now: number }
  | { type: "reset" }
  | { type: "set-scenario"; id: ScenarioId; seeds?: StaticRouteSeed[]; now: number }
  | { type: "add-route"; seed: StaticRouteSeed; now: number }
  | { type: "remove-route"; router: string; dest: string; prefix: number; now: number }
  | { type: "clear-routes"; router: string; now: number }
  | { type: "set-mode"; mode: Mode }
  | { type: "view-router"; router: string }
  | { type: "clear-log" };

const MAX_LOG = 250;

export function initialState(scenarioId: ScenarioId = "single", mode: Mode = "auto"): LabState {
  const sc = SCENARIOS[scenarioId];
  return {
    scenarioId,
    seeds: sc.seeds.map((s) => ({ ...s })),
    plan: null,
    txId: 0,
    idx: 0,
    playing: false,
    mode,
    viewRouter: sc.routers[0]!.id,
    log: [],
    nextLogId: 1,
    notice: null,
  };
}

export function tablesOf(s: Pick<LabState, "scenarioId" | "seeds">): RoutingTables {
  return buildTables(SCENARIOS[s.scenarioId], s.seeds);
}

export function isInFlight(s: Pick<LabState, "plan" | "idx">): boolean {
  return !!s.plan && s.idx < s.plan.steps.length - 1;
}

export function currentStep(s: Pick<LabState, "plan" | "idx">): PlanStep | null {
  return s.plan ? (s.plan.steps[s.idx] ?? null) : null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

export function formatClock(ms: number): string {
  const d = new Date(ms);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

function withLog(s: LabState, now: number, entries: Array<[LogKind, string]>): LabState {
  if (entries.length === 0) return s;
  const time = formatClock(now);
  let id = s.nextLogId;
  const added: LogEntry[] = entries.map(([kind, text]) => ({ id: id++, time, kind, text }));
  const log = [...s.log, ...added];
  return { ...s, log: log.length > MAX_LOG ? log.slice(log.length - MAX_LOG) : log, nextLogId: id };
}

/** Anything that changes a routing table invalidates the packet on screen (its highlighted rows would be stale). */
function dropPlan(s: LabState): LabState {
  return { ...s, plan: null, idx: 0, playing: false };
}

function focusRouter(s: LabState, step: PlanStep | null): LabState {
  return step?.router && step.router !== s.viewRouter ? { ...s, viewRouter: step.router } : s;
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

export function labReducer(s: LabState, a: LabAction): LabState {
  switch (a.type) {
    case "send": {
      if (isInFlight(s)) return s;
      const sc = SCENARIOS[s.scenarioId];
      const plan = buildPlan(sc, tablesOf(s), a.src, a.dst);
      const first = plan.steps[0]!;
      const next: LabState = { ...s, plan, txId: s.txId + 1, idx: 0, playing: s.mode === "auto", notice: null };
      return withLog(next, a.now, [first.log]);
    }
    case "next": {
      if (!s.plan || !isInFlight(s)) return s;
      const idx = s.idx + 1;
      const step = s.plan.steps[idx]!;
      const done = idx >= s.plan.steps.length - 1;
      const next = focusRouter({ ...s, idx, playing: done ? false : s.playing }, step);
      return withLog(next, a.now, [step.log]);
    }
    case "play":
      return isInFlight(s) ? { ...s, playing: true } : s;
    case "pause":
      return s.playing ? { ...s, playing: false } : s;
    case "cancel": {
      if (!isInFlight(s)) return s;
      return withLog({ ...s, plan: null, idx: 0, playing: false }, a.now, [["info", "Packet cancelled before it finished"]]);
    }
    case "reset":
      return initialState(s.scenarioId, s.mode);
    case "set-scenario": {
      const base = initialState(a.id, s.mode);
      const sc = SCENARIOS[a.id];
      const seeds = a.seeds ? a.seeds.map((x) => ({ ...x })) : base.seeds;
      return withLog({ ...base, seeds, viewRouter: sc.routers[0]!.id, log: s.log, nextLogId: s.nextLogId, txId: s.txId }, a.now, [["info", `Loaded scenario: ${sc.title}`]]);
    }
    case "add-route": {
      if (isInFlight(s)) return s;
      const { seed } = a;
      if (s.seeds.some((x) => x.router === seed.router && x.dest === seed.dest && x.prefix === seed.prefix)) return s;
      const label = routeLabel(seed);
      const next: LabState = {
        ...dropPlan(s),
        seeds: [...s.seeds, seed],
        viewRouter: seed.router,
        notice: { tone: "good", text: `Static route added on ${seed.router}: ${label} via ${seed.nextHop} out ${seed.iface}. Send a packet toward ${label} to see ${seed.router} use it.` },
      };
      return withLog(next, a.now, [["route", `${seed.router}: added static route ${label} via ${seed.nextHop} (${seed.iface})`]]);
    }
    case "remove-route": {
      if (isInFlight(s)) return s;
      const hit = s.seeds.find((x) => x.router === a.router && x.dest === a.dest && x.prefix === a.prefix);
      if (!hit) return s;
      const label = routeLabel(hit);
      const next: LabState = {
        ...dropPlan(s),
        seeds: s.seeds.filter((x) => x !== hit),
        notice: { tone: "warn", text: `Removed ${label} from ${a.router}. Packets for that network now match nothing more specific than whatever else remains in the table.` },
      };
      return withLog(next, a.now, [["route", `${a.router}: removed static route ${label}`]]);
    }
    case "clear-routes": {
      if (isInFlight(s)) return s;
      const n = s.seeds.filter((x) => x.router === a.router).length;
      const next: LabState = {
        ...dropPlan(s),
        seeds: s.seeds.filter((x) => x.router !== a.router),
        notice: n === 0 ? { tone: "info", text: `${a.router} has no static routes to clear. Connected routes cannot be removed here because they come from the interface addresses.` } : { tone: "warn", text: `Cleared ${n} static route${n === 1 ? "" : "s"} on ${a.router}. Its connected routes stay, because they come from its interface addresses.` },
      };
      return withLog(next, a.now, [["route", n === 0 ? `${a.router}: no static routes to clear` : `${a.router}: cleared ${n} static route${n === 1 ? "" : "s"}`]]);
    }
    case "set-mode":
      return s.mode === a.mode ? s : { ...s, mode: a.mode, playing: a.mode === "step" ? false : s.playing };
    case "view-router":
      return s.viewRouter === a.router ? s : { ...s, viewRouter: a.router };
    case "clear-log":
      return { ...s, log: [] };
    default:
      return s;
  }
}

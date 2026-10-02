import {
  AGING_TIMEOUT_SEC,
  LAST_STAGE,
  PORTS,
  ageEntries,
  decide,
  deviceById,
  deviceByMac,
  deviceByPort,
  dstMacFor,
  flushPort,
  formatPort,
  formatPorts,
  isBroadcastMac,
  learnMac,
  lookupMac,
  type AgingSpeed,
  type Decision,
  type DeviceId,
  type DstChoice,
  type LearnResult,
  type MacEntry,
  type PortStates,
} from "./model";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type LogKind =
  | "sent"
  | "received"
  | "learned"
  | "found"
  | "unknown"
  | "broadcast"
  | "flood"
  | "forward"
  | "deliver"
  | "expired"
  | "portdown"
  | "portup"
  | "cleared"
  | "info";

export const LOG_LABEL: Record<LogKind, string> = {
  sent: "Frame Sent",
  received: "Frame Received",
  learned: "MAC Learned",
  found: "Destination Found",
  unknown: "Destination Unknown",
  broadcast: "Broadcast",
  flood: "Flood",
  forward: "Forward",
  deliver: "Delivered",
  expired: "MAC Expired",
  portdown: "Port Disabled",
  portup: "Port Enabled",
  cleared: "Table Cleared",
  info: "Info",
};

export interface LogEntry {
  id: number;
  /** HH:MM:SS wall-clock time of the event. */
  time: string;
  kind: LogKind;
  text: string;
}

export interface Delivery {
  port: number;
  deviceId: DeviceId;
  accepted: boolean;
}

export interface Transmission {
  id: number;
  srcId: DeviceId;
  srcMac: string;
  srcPort: number;
  dstMac: string;
  intent: "unicast" | "broadcast";
  /** 1..LAST_STAGE. The frame is "in flight" while stage < LAST_STAGE. */
  stage: number;
  learn?: { result: LearnResult };
  lookup?: { found: boolean; port?: number; broadcast: boolean };
  decision?: Decision;
  deliveries?: Delivery[];
}

export type NoticeTone = "good" | "info" | "warn";
export interface Notice {
  tone: NoticeTone;
  text: string;
}

export type Mode = "auto" | "step";

export interface LabState {
  enabled: PortStates;
  table: MacEntry[];
  tx: Transmission | null;
  playing: boolean;
  mode: Mode;
  speed: AgingSpeed;
  log: LogEntry[];
  nextLogId: number;
  nextTxId: number;
  notice: Notice | null;
  /** Row to highlight in the table (set when the current frame teaches the switch something). */
  highlight: { mac: string; kind: LearnResult } | null;
}

export type LabAction =
  | { type: "send"; src: DeviceId; dst: DstChoice; now: number }
  | { type: "next"; now: number }
  | { type: "play" }
  | { type: "pause" }
  | { type: "cancel"; now: number }
  | { type: "reset" }
  | { type: "clear-table"; now: number }
  | { type: "set-port"; port: number; enabled: boolean; now: number }
  | { type: "set-speed"; speed: AgingSpeed }
  | { type: "set-mode"; mode: Mode }
  | { type: "tick"; dtSec: number; now: number }
  | { type: "skip"; seconds: number; now: number }
  | { type: "clear-log" };

const MAX_LOG = 250;

export function allPortsUp(): PortStates {
  const s: PortStates = {};
  for (const p of PORTS) s[p] = true;
  return s;
}

export function initialState(mode: Mode = "auto", speed: AgingSpeed = 1): LabState {
  return {
    enabled: allPortsUp(),
    table: [],
    tx: null,
    playing: false,
    mode,
    speed,
    log: [],
    nextLogId: 1,
    nextTxId: 1,
    notice: null,
    highlight: null,
  };
}

export function isInFlight(s: Pick<LabState, "tx">): boolean {
  return !!s.tx && s.tx.stage < LAST_STAGE;
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

function describeMac(mac: string): string {
  const d = deviceByMac(mac);
  return d ? `${mac} (${d.name})` : mac;
}

// ---------------------------------------------------------------------------
// Stage advance
// ---------------------------------------------------------------------------

function advance(s: LabState, now: number): LabState {
  const tx = s.tx;
  if (!tx || tx.stage >= LAST_STAGE) return s;
  const stage = tx.stage + 1;
  const ingress = formatPort(tx.srcPort);

  switch (stage) {
    case 2: {
      return withLog({ ...s, tx: { ...tx, stage } }, now, [["received", `Frame received on ${ingress}`]]);
    }
    case 3: {
      const { table, result } = learnMac(s.table, tx.srcMac, tx.srcPort);
      const text =
        result === "new"
          ? `Learned ${tx.srcMac} → ${ingress}`
          : result === "refreshed"
            ? `Refreshed ${tx.srcMac} → ${ingress} (already known, age reset to 0 s)`
            : `Moved ${tx.srcMac} → ${ingress}`;
      const notice: Notice =
        result === "new"
          ? { tone: "good", text: `New entry: ${describeMac(tx.srcMac)} is reachable via ${ingress}. The switch learned it from the frame's source address.` }
          : { tone: "info", text: `${describeMac(tx.srcMac)} was already in the table on ${ingress}, so no duplicate was added — only its age was reset to 0 s.` };
      return withLog({ ...s, table, notice, highlight: { mac: tx.srcMac, kind: result }, tx: { ...tx, stage, learn: { result } } }, now, [["learned", text]]);
    }
    case 4: {
      if (isBroadcastMac(tx.dstMac)) {
        return withLog({ ...s, tx: { ...tx, stage, lookup: { found: false, broadcast: true } } }, now, [
          ["broadcast", `Destination is the broadcast address ${tx.dstMac} — a broadcast is never looked up in the table`],
        ]);
      }
      const hit = lookupMac(s.table, tx.dstMac);
      if (hit) {
        return withLog({ ...s, tx: { ...tx, stage, lookup: { found: true, port: hit.port, broadcast: false } } }, now, [
          ["found", `Destination ${tx.dstMac} found → ${formatPort(hit.port)}`],
        ]);
      }
      return withLog({ ...s, tx: { ...tx, stage, lookup: { found: false, broadcast: false } } }, now, [
        ["unknown", `Destination ${tx.dstMac} not found in the MAC table`],
      ]);
    }
    case 5: {
      const decision = decide(s.table, tx.dstMac, tx.srcPort, s.enabled);
      let entry: [LogKind, string];
      if (decision.kind === "broadcast") {
        entry = ["flood", `Broadcast → flood out ${formatPorts(decision.egress)} (every port except ${ingress})`];
      } else if (decision.kind === "unknown-unicast") {
        entry = ["flood", `Unknown unicast flood out ${formatPorts(decision.egress)} (every port except ${ingress})`];
      } else if (decision.egress.length > 0) {
        entry = ["forward", `Known unicast → forward only out ${formatPort(decision.foundPort!)}`];
      } else {
        entry = ["info", `Known unicast, but ${formatPort(decision.foundPort!)} cannot send it (ingress port or link down) — frame filtered`];
      }
      return withLog({ ...s, tx: { ...tx, stage, decision } }, now, [entry]);
    }
    case 6: {
      const d = tx.decision!;
      const entries: Array<[LogKind, string]> = d.egress.map((p): [LogKind, string] => [
        "forward",
        `Frame forwarded out ${formatPort(p)} → ${deviceByPort(p)?.name ?? "device"}`,
      ]);
      if (entries.length === 0) entries.push(["info", "No port to send the frame out of — frame dropped"]);
      return withLog({ ...s, tx: { ...tx, stage } }, now, entries);
    }
    default: {
      // stage 7 — each receiving host decides whether the frame is addressed to it.
      const d = tx.decision!;
      const deliveries: Delivery[] = d.egress.flatMap((p) => {
        const dev = deviceByPort(p);
        return dev ? [{ port: p, deviceId: dev.id, accepted: isBroadcastMac(tx.dstMac) || dev.mac === tx.dstMac }] : [];
      });
      const entries: Array<[LogKind, string]> = deliveries.map((x): [LogKind, string] => [
        "deliver",
        x.accepted ? `${deviceById(x.deviceId).name} accepted the frame` : `${deviceById(x.deviceId).name} ignored the frame (not addressed to its MAC)`,
      ]);
      return withLog({ ...s, playing: false, tx: { ...tx, stage, deliveries } }, now, entries);
    }
  }
}

// ---------------------------------------------------------------------------
// Aging
// ---------------------------------------------------------------------------

function ageState(s: LabState, dtSec: number, now: number): LabState {
  const { table, expired } = ageEntries(s.table, dtSec);
  if (expired.length === 0) return table === s.table ? s : { ...s, table };
  const names = expired.map((e) => describeMac(e.mac)).join(", ");
  const notice: Notice = {
    tone: "warn",
    text: `Expired after ${AGING_TIMEOUT_SEC} s without traffic: ${names}. The switch has forgotten ${expired.length === 1 ? "it" : "them"}, so the next frame addressed to ${expired.length === 1 ? "it" : "them"} is unknown unicast and will be flooded.`,
  };
  const next: LabState = {
    ...s,
    table,
    notice,
    highlight: s.highlight && expired.some((e) => e.mac === s.highlight!.mac) ? null : s.highlight,
  };
  return withLog(next, now, expired.map((e): [LogKind, string] => [
    "expired",
    `MAC entry expired: ${e.mac} → ${formatPort(e.port)} (aged ${AGING_TIMEOUT_SEC} s)`,
  ]));
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

export function labReducer(s: LabState, a: LabAction): LabState {
  switch (a.type) {
    case "send": {
      if (isInFlight(s)) return s;
      const src = deviceById(a.src);
      if (!s.enabled[src.port]) return s;
      const dstMac = dstMacFor(a.dst);
      const broadcast = isBroadcastMac(dstMac);
      const tx: Transmission = {
        id: s.nextTxId,
        srcId: src.id,
        srcMac: src.mac,
        srcPort: src.port,
        dstMac,
        intent: broadcast ? "broadcast" : "unicast",
        stage: 1,
      };
      return withLog(
        { ...s, tx, nextTxId: s.nextTxId + 1, playing: s.mode === "auto", highlight: null },
        a.now,
        [["sent", `${src.name} sent a frame: ${src.mac} → ${dstMac}${broadcast ? " (broadcast)" : ""}`]],
      );
    }
    case "next":
      return advance(s, a.now);
    case "play":
      return isInFlight(s) ? { ...s, playing: true } : s;
    case "pause":
      return s.playing ? { ...s, playing: false } : s;
    case "cancel": {
      if (!s.tx || !isInFlight(s)) return s;
      return withLog({ ...s, tx: null, playing: false }, a.now, [["info", "Frame cancelled before it finished — anything the switch already learned stays in the table"]]);
    }
    case "reset":
      return initialState(s.mode, s.speed);
    case "clear-table": {
      if (isInFlight(s)) return s;
      const n = s.table.length;
      const next: LabState = {
        ...s,
        table: [],
        highlight: null,
        notice: { tone: "warn", text: "MAC table cleared. The switch knows nothing now, so the next frame to any destination is unknown unicast and will be flooded — and the sender is learned again." },
      };
      return withLog(next, a.now, [["cleared", n === 0 ? "MAC table cleared (it was already empty)" : `MAC table cleared (${n} ${n === 1 ? "entry" : "entries"} removed)`]]);
    }
    case "set-port": {
      if (isInFlight(s) || s.enabled[a.port] === a.enabled) return s;
      const enabled = { ...s.enabled, [a.port]: a.enabled };
      const dev = deviceByPort(a.port);
      const who = dev ? dev.name : "device";
      if (a.enabled) {
        return withLog(
          { ...s, enabled, notice: { tone: "info", text: `${formatPort(a.port)} is up again. The switch has no entry for ${who} until ${who} sends a frame.` } },
          a.now,
          [["portup", `${formatPort(a.port)} enabled — ${who} reconnected`]],
        );
      }
      const { table, removed } = flushPort(s.table, a.port);
      const next: LabState = {
        ...s,
        enabled,
        table,
        highlight: s.highlight && removed.some((e) => e.mac === s.highlight!.mac) ? null : s.highlight,
        notice: {
          tone: "warn",
          text:
            removed.length > 0
              ? `${formatPort(a.port)} went down, so the switch removed what it had learned on it (${removed.map((e) => e.mac).join(", ")}). Frames for ${who} are now unknown unicast and are flooded to the other ports — but never out of the dead port.`
              : `${formatPort(a.port)} is down. ${who} can't send or receive, and the switch won't flood frames out of this port.`,
        },
      };
      const entries: Array<[LogKind, string]> = [["portdown", `${formatPort(a.port)} disabled — ${who} disconnected`]];
      for (const e of removed) entries.push(["expired", `MAC entry removed: ${e.mac} → ${formatPort(e.port)} (link down)`]);
      return withLog(next, a.now, entries);
    }
    case "set-speed":
      return s.speed === a.speed ? s : { ...s, speed: a.speed };
    case "set-mode":
      return s.mode === a.mode ? s : { ...s, mode: a.mode, playing: a.mode === "step" ? false : s.playing };
    case "tick":
      // The aging clock pauses while a frame is being processed so the stages stay consistent.
      return isInFlight(s) ? s : ageState(s, a.dtSec, a.now);
    case "skip": {
      if (isInFlight(s) || s.table.length === 0) return s;
      const next = withLog(s, a.now, [["info", `Fast-forwarded the switch clock by ${a.seconds} s`]]);
      return ageState(next, a.seconds, a.now);
    }
    case "clear-log":
      return { ...s, log: [] };
    default:
      return s;
  }
}

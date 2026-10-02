// ---------------------------------------------------------------------------
// Switch & MAC Address Table Simulator — pure model (no React).
//
// Scope: one Layer 2 switch, five hosts, one broadcast domain (a simplified
// single-VLAN LAN). Source-MAC learning, a dynamic MAC address table with
// aging, known-unicast forwarding, unknown-unicast flooding and broadcast
// flooding. No VLANs, STP, LACP, routing or IP — those belong to other labs.
// ---------------------------------------------------------------------------

export const BROADCAST_MAC = "FF:FF:FF:FF:FF:FF";
/** A well-formed unicast MAC that no device on this LAN owns. */
export const UNKNOWN_MAC = "AA:AA:AA:AA:AA:99";

/**
 * Educational aging timeout, in simulated seconds. Real switches commonly
 * default to 300 s (5 min); that is far too long to wait in a lab.
 */
export const AGING_TIMEOUT_SEC = 60;
export const REAL_DEFAULT_AGING_SEC = 300;

export type DeviceId = "A" | "B" | "C" | "D" | "E";
export type DstChoice = DeviceId | "unknown" | "broadcast";

export interface LabDevice {
  id: DeviceId;
  name: string;
  mac: string;
  /** Switch port number (Fa0/<port>). */
  port: number;
}

export const DEVICES: LabDevice[] = (["A", "B", "C", "D", "E"] as const).map((id, i) => ({
  id,
  name: `PC-${id}`,
  mac: `AA:AA:AA:AA:AA:0${i + 1}`,
  port: i + 1,
}));

export const PORTS: number[] = DEVICES.map((d) => d.port);

export function formatPort(port: number): string {
  return `Fa0/${port}`;
}

export function formatPorts(ports: number[]): string {
  return ports.length === 0 ? "none" : ports.map(formatPort).join(", ");
}

export function deviceById(id: DeviceId): LabDevice {
  return DEVICES.find((d) => d.id === id)!;
}

export function deviceByPort(port: number): LabDevice | undefined {
  return DEVICES.find((d) => d.port === port);
}

export function deviceByMac(mac: string): LabDevice | undefined {
  return DEVICES.find((d) => d.mac === mac);
}

export function isBroadcastMac(mac: string): boolean {
  return mac.toUpperCase() === BROADCAST_MAC;
}

export function dstMacFor(choice: DstChoice): string {
  if (choice === "unknown") return UNKNOWN_MAC;
  if (choice === "broadcast") return BROADCAST_MAC;
  return deviceById(choice).mac;
}

// ---------------------------------------------------------------------------
// MAC address table
// ---------------------------------------------------------------------------

export interface MacEntry {
  mac: string;
  port: number;
  /** Seconds since this entry was last learned or refreshed (simulated time). */
  ageSec: number;
  /** Basic version: every entry is dynamic. */
  kind: "dynamic";
}

export type LearnResult = "new" | "refreshed" | "moved";

export function lookupMac(table: MacEntry[], mac: string): MacEntry | undefined {
  return table.find((e) => e.mac === mac);
}

/**
 * Source-MAC learning. Never creates a duplicate: a repeat sighting on the
 * same port only resets the entry's age; a sighting on a different port moves
 * the entry.
 */
export function learnMac(table: MacEntry[], mac: string, port: number): { table: MacEntry[]; result: LearnResult } {
  const existing = lookupMac(table, mac);
  if (!existing) {
    return { table: [...table, { mac, port, ageSec: 0, kind: "dynamic" }], result: "new" };
  }
  const result: LearnResult = existing.port === port ? "refreshed" : "moved";
  return { table: table.map((e) => (e.mac === mac ? { ...e, port, ageSec: 0 } : e)), result };
}

/** Advance simulated time and drop every entry that reached the timeout. */
export function ageEntries(table: MacEntry[], dtSec: number, timeout: number = AGING_TIMEOUT_SEC): { table: MacEntry[]; expired: MacEntry[] } {
  if (dtSec <= 0 || table.length === 0) return { table, expired: [] };
  const aged = table.map((e) => ({ ...e, ageSec: e.ageSec + dtSec }));
  return { table: aged.filter((e) => e.ageSec < timeout), expired: aged.filter((e) => e.ageSec >= timeout) };
}

/** A port going down flushes the dynamic entries learned on it (as real switches do). */
export function flushPort(table: MacEntry[], port: number): { table: MacEntry[]; removed: MacEntry[] } {
  return { table: table.filter((e) => e.port !== port), removed: table.filter((e) => e.port === port) };
}

// ---------------------------------------------------------------------------
// Forwarding decision
// ---------------------------------------------------------------------------

export type ForwardKind = "known-unicast" | "unknown-unicast" | "broadcast";
export type ForwardAction = "forward" | "flood";

export interface Decision {
  kind: ForwardKind;
  action: ForwardAction;
  /** Ports the switch sends a copy out of. Never includes the ingress port. */
  egress: number[];
  /** Table port for a known destination. */
  foundPort?: number;
}

export type PortStates = Record<number, boolean>;

/** Every enabled port except the one the frame arrived on. */
export function floodPorts(ingress: number, enabled: PortStates): number[] {
  return PORTS.filter((p) => p !== ingress && enabled[p]);
}

export function decide(table: MacEntry[], dstMac: string, ingress: number, enabled: PortStates): Decision {
  if (isBroadcastMac(dstMac)) {
    return { kind: "broadcast", action: "flood", egress: floodPorts(ingress, enabled) };
  }
  const hit = lookupMac(table, dstMac);
  if (!hit) {
    return { kind: "unknown-unicast", action: "flood", egress: floodPorts(ingress, enabled) };
  }
  // Destination on the ingress port => filter (never send a frame back out the port it came in on).
  // Destination port down => nothing to forward to (entries are flushed on link-down, so this is defensive).
  const out = hit.port !== ingress && enabled[hit.port] ? [hit.port] : [];
  return { kind: "known-unicast", action: "forward", egress: out, foundPort: hit.port };
}

export const KIND_LABEL: Record<ForwardKind, string> = {
  "known-unicast": "Known unicast",
  "unknown-unicast": "Unknown unicast",
  broadcast: "Broadcast",
};

export const OUTCOME_BANNER: Record<ForwardKind, string> = {
  "known-unicast": "KNOWN UNICAST → FORWARD TO ONE PORT",
  "unknown-unicast": "UNKNOWN UNICAST → FLOOD",
  broadcast: "BROADCAST → FLOOD",
};

// ---------------------------------------------------------------------------
// Processing stages
// ---------------------------------------------------------------------------

export interface StageInfo {
  n: number;
  short: string;
  label: string;
}

export const STAGES: StageInfo[] = [
  { n: 1, short: "Send", label: "Send Frame" },
  { n: 2, short: "Receive", label: "Receive Frame" },
  { n: 3, short: "Learn", label: "Learn Source MAC" },
  { n: 4, short: "Check", label: "Check Destination" },
  { n: 5, short: "Decide", label: "Make Forwarding Decision" },
  { n: 6, short: "Forward", label: "Forward Frame" },
  { n: 7, short: "Deliver", label: "Hosts Process Frame" },
];
export const LAST_STAGE = STAGES.length;

export type AgingSpeed = 0 | 1 | 2 | 5 | 10;
export const AGING_SPEEDS: AgingSpeed[] = [0, 1, 2, 5, 10];

// ---------------------------------------------------------------------------
// Ethernet & MAC Address Simulator — pure model (no React).
//
// Scope: MAC addresses, a simplified Ethernet frame, and a *basic* switch
// that learns source MACs and forwards/floods. No IP, ARP, VLANs, STP,
// aging timers, or multicast — those belong to later simulations.
// ---------------------------------------------------------------------------

export type { DetailLevel } from "../osi-model-explorer/model";
export { DETAIL_LEVEL_LABELS } from "../osi-model-explorer/model";

// ---------------------------------------------------------------------------
// MAC addresses
// ---------------------------------------------------------------------------

export const BROADCAST_MAC = "FF:FF:FF:FF:FF:FF";

const MAC_RE = /^([0-9A-F]{2}:){5}[0-9A-F]{2}$/;

export function normalizeMac(input: string): string {
  const hex = input.replace(/[^0-9a-fA-F]/g, "").toUpperCase();
  if (hex.length !== 12) return input.trim().toUpperCase();
  return hex.match(/.{2}/g)!.join(":");
}

export function isValidMacFormat(mac: string): boolean {
  return MAC_RE.test(mac);
}

/** Group (multicast/broadcast) bit = least-significant bit of the first octet. */
export function isGroupMac(mac: string): boolean {
  return (parseInt(mac.slice(0, 2), 16) & 0x01) === 1;
}

/** Universal/Local bit = second-least-significant bit of the first octet. */
export function isLocallyAdministered(mac: string): boolean {
  return (parseInt(mac.slice(0, 2), 16) & 0x02) === 2;
}

export function isBroadcastMac(mac: string): boolean {
  return mac.toUpperCase() === BROADCAST_MAC;
}

function hex2(n: number): string {
  return n.toString(16).toUpperCase().padStart(2, "0");
}

/**
 * Random *locally administered unicast* address (first octet 02), which is the
 * honest choice for a lab: it can never collide with a vendor-assigned one.
 * `rand` is injectable so behaviour is testable.
 */
export function generateMac(taken: Set<string>, rand: () => number = Math.random): string {
  for (let attempt = 0; attempt < 200; attempt++) {
    const octets = ["02"];
    for (let i = 0; i < 5; i++) octets.push(hex2(Math.floor(rand() * 256)));
    const mac = octets.join(":");
    if (!taken.has(mac) && !isBroadcastMac(mac)) return mac;
  }
  // Astronomically unlikely; deterministic fallback keeps uniqueness.
  let n = taken.size + 1;
  let mac = "";
  do {
    mac = `02:00:00:00:${hex2((n >> 8) & 255)}:${hex2(n & 255)}`;
    n++;
  } while (taken.has(mac));
  return mac;
}

export type MacValidation = { ok: true; mac: string } | { ok: false; reason: string };

export function validateCustomMac(input: string, ownId: string, devices: LabDevice[]): MacValidation {
  const mac = normalizeMac(input);
  if (!isValidMacFormat(mac)) return { ok: false, reason: "Use six hex pairs, like 02:4A:7C:91:3D:21." };
  if (isBroadcastMac(mac)) return { ok: false, reason: "FF:FF:FF:FF:FF:FF is the broadcast address, not a device address." };
  if (isGroupMac(mac)) return { ok: false, reason: "The first octet's lowest bit must be 0 — a set bit marks a group (multicast/broadcast) address." };
  if (devices.some((d) => d.id !== ownId && d.mac === mac)) return { ok: false, reason: "Another interface already uses that MAC address." };
  return { ok: true, mac };
}

// ---------------------------------------------------------------------------
// Devices
// ---------------------------------------------------------------------------

export type LabDeviceType = "pc" | "laptop" | "server";

export interface LabDevice {
  id: string;
  name: string;
  type: LabDeviceType;
  /** Name of the network interface this MAC belongs to. */
  interfaceName: string;
  mac: string;
  /** Switch port this device's cable plugs into. */
  port: number;
}

export const DEVICE_TYPE_LABEL: Record<LabDeviceType, string> = {
  pc: "Desktop PC",
  laptop: "Laptop",
  server: "Server",
};

interface DefaultDevice extends LabDevice {
  defaultName: string;
  defaultMac: string;
}

const DEFAULT_DEVICES: DefaultDevice[] = [
  { id: "a", name: "PC-A", defaultName: "PC-A", type: "pc", interfaceName: "eth0", mac: "02:4A:7C:91:3D:21", defaultMac: "02:4A:7C:91:3D:21", port: 1 },
  { id: "b", name: "Laptop-B", defaultName: "Laptop-B", type: "laptop", interfaceName: "eth0", mac: "02:8B:31:52:77:10", defaultMac: "02:8B:31:52:77:10", port: 2 },
  { id: "c", name: "PC-C", defaultName: "PC-C", type: "pc", interfaceName: "eth0", mac: "02:C3:5E:08:A4:6F", defaultMac: "02:C3:5E:08:A4:6F", port: 3 },
  { id: "d", name: "PC-D", defaultName: "PC-D", type: "pc", interfaceName: "eth0", mac: "02:1F:D9:63:B2:8E", defaultMac: "02:1F:D9:63:B2:8E", port: 4 },
  { id: "s", name: "Server", defaultName: "Server", type: "server", interfaceName: "eth0", mac: "02:7E:20:B5:4C:93", defaultMac: "02:7E:20:B5:4C:93", port: 5 },
];

export function createDefaultDevices(): LabDevice[] {
  return DEFAULT_DEVICES.map(({ defaultName: _n, defaultMac: _m, ...d }) => ({ ...d }));
}

export function defaultMacFor(id: string): string {
  return DEFAULT_DEVICES.find((d) => d.id === id)?.defaultMac ?? "";
}

export function defaultNameFor(id: string): string {
  return DEFAULT_DEVICES.find((d) => d.id === id)?.defaultName ?? "";
}

export function deviceById(devices: LabDevice[], id: string): LabDevice | undefined {
  return devices.find((d) => d.id === id);
}

export function deviceByMac(devices: LabDevice[], mac: string): LabDevice | undefined {
  return devices.find((d) => d.mac === mac);
}

export function deviceByPort(devices: LabDevice[], port: number): LabDevice | undefined {
  return devices.find((d) => d.port === port);
}

/** Positions inside the shared 400×360 diagram viewBox. */
export const SWITCH_POS = { x: 200, y: 172 };
export const DEVICE_POS: Record<string, { x: number; y: number }> = {
  a: { x: 62, y: 46 },
  c: { x: 338, y: 46 },
  b: { x: 62, y: 292 },
  d: { x: 338, y: 292 },
  s: { x: 200, y: 318 },
};

// ---------------------------------------------------------------------------
// Ethernet frame (educational, simplified)
// ---------------------------------------------------------------------------

export type FieldId = "dst" | "src" | "type" | "payload" | "fcs";

export const FIELD_ORDER: FieldId[] = ["dst", "src", "type", "payload", "fcs"];

export interface FieldInfo {
  id: FieldId;
  label: string;
  size: string;
  purpose: string;
  technical: string;
}

export const FIELD_INFO: Record<FieldId, FieldInfo> = {
  dst: {
    id: "dst",
    label: "Destination MAC",
    size: "6 bytes",
    purpose: "Says who the frame is meant for on this local network. Every NIC that sees the frame compares this address with its own.",
    technical:
      "It comes first so hardware can decide quickly whether to accept the frame. FF:FF:FF:FF:FF:FF means \"everyone on the LAN\". A NIC normally accepts frames addressed to its own MAC, to broadcast, and to any multicast groups it has joined.",
  },
  src: {
    id: "src",
    label: "Source MAC",
    size: "6 bytes",
    purpose: "Says which network interface sent the frame. Switches read it to learn where that interface is connected, and the receiver can use it to reply.",
    technical:
      "A source address is always a single interface's unicast address — it is never the broadcast address. This is the field a switch uses for MAC learning.",
  },
  type: {
    id: "type",
    label: "EtherType / Length",
    size: "2 bytes",
    purpose: "Tells the receiver what kind of data is inside the payload, so it knows which protocol should process it next.",
    technical:
      "In Ethernet II framing this field is an EtherType (values of 1536 / 0x0600 and above, e.g. 0x0800 IPv4, 0x0806 ARP, 0x86DD IPv6). In the older IEEE 802.3 form the same two bytes hold a payload length (1500 or less).",
  },
  payload: {
    id: "payload",
    label: "Payload",
    size: "46–1500 bytes",
    purpose: "The actual data being carried. To Ethernet it is just cargo — the frame does not care what it means.",
    technical:
      "Typical maximum is 1500 bytes (the standard MTU). Payloads shorter than 46 bytes are padded so the whole frame reaches the minimum size. Bigger data is split across several frames by higher layers.",
  },
  fcs: {
    id: "fcs",
    label: "FCS (Frame Check Sequence)",
    size: "4 bytes",
    purpose: "A check value the sender calculates from the frame. The receiver recalculates it; if the values differ, the frame was damaged and is discarded.",
    technical:
      "Ethernet's FCS is a 32-bit CRC. It can detect many transmission errors, but it only detects — it does not correct — and it is not a security feature. Detected-bad frames are silently dropped; recovery is left to higher layers.",
  },
};

export interface EthernetFrame {
  id: string;
  dst: string;
  src: string;
  etherType: string;
  payload: string;
  /** FCS as computed by the sender (hex). */
  fcs: string;
}

export const ETHER_TYPES: { value: string; label: string }[] = [
  { value: "0x0800", label: "0x0800 — IPv4 (example payload type)" },
  { value: "0x0806", label: "0x0806 — ARP (example payload type)" },
  { value: "0x86DD", label: "0x86DD — IPv6 (example payload type)" },
];

export const DEFAULT_ETHER_TYPE = "0x0800";

// CRC-32 (IEEE 802.3 polynomial, reflected) — small enough to include for real.
let crcTable: number[] | null = null;
function getCrcTable(): number[] {
  if (crcTable) return crcTable;
  const t: number[] = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t.push(c >>> 0);
  }
  crcTable = t;
  return t;
}

function macBytes(mac: string): number[] {
  return mac.split(":").map((h) => parseInt(h, 16) || 0);
}

/** CRC-32 over destination, source, type, and payload bytes → 8 hex chars. */
export function computeFcs(dst: string, src: string, etherType: string, payload: string): string {
  const table = getCrcTable();
  const typeVal = parseInt(etherType, 16) || 0;
  const payloadBytes = Array.from(new TextEncoder().encode(payload));
  const bytes = [...macBytes(dst), ...macBytes(src), (typeVal >> 8) & 255, typeVal & 255, ...payloadBytes];
  let crc = 0xffffffff;
  for (const b of bytes) crc = (table[(crc ^ b) & 255] as number) ^ (crc >>> 8);
  crc = (crc ^ 0xffffffff) >>> 0;
  return crc.toString(16).toUpperCase().padStart(8, "0");
}

export function buildFrame(id: string, dst: string, src: string, etherType: string, payload: string): EthernetFrame {
  return { id, dst, src, etherType, payload, fcs: computeFcs(dst, src, etherType, payload) };
}

/** Flip the lowest bit of the first payload character to simulate line noise. */
export function corruptPayload(payload: string): string {
  if (payload.length === 0) return "\u0001";
  const first = payload.charCodeAt(0) ^ 1;
  return String.fromCharCode(first) + payload.slice(1);
}

/** Approximate on-the-wire size for the educational frame (no preamble/SFD/IFG). */
export function frameSizeBytes(payload: string): number {
  const payloadLen = Math.min(1500, Math.max(46, new TextEncoder().encode(payload).length));
  return 6 + 6 + 2 + payloadLen + 4;
}

// ---------------------------------------------------------------------------
// Switch: MAC table + forwarding decision
// ---------------------------------------------------------------------------

export interface MacTableEntry {
  mac: string;
  port: number;
}

export type MacTable = MacTableEntry[];

export type ForwardKind = "known-unicast" | "unknown-unicast" | "broadcast" | "filtered";

export interface SwitchDecision {
  kind: ForwardKind;
  ingressPort: number;
  learn: { mac: string; port: number; status: "new" | "refreshed" | "moved"; previousPort?: number } | null;
  /** Ports the frame is sent out of. */
  egressPorts: number[];
  tableBefore: MacTable;
  tableAfter: MacTable;
}

export function lookupMac(table: MacTable, mac: string): MacTableEntry | undefined {
  return table.find((e) => e.mac === mac);
}

/**
 * The switch's whole job, in one pure function:
 *  1. LEARN   — record (source MAC → ingress port).
 *  2. LOOK UP — find the destination MAC.
 *  3. DECIDE  — forward out one port, flood (unknown unicast or broadcast),
 *               or filter (destination is on the ingress port).
 * A frame is never sent back out of the port it arrived on.
 */
export function switchProcess(table: MacTable, frame: Pick<EthernetFrame, "src" | "dst">, ingressPort: number, allPorts: number[]): SwitchDecision {
  let learn: SwitchDecision["learn"] = null;
  let tableAfter = table;

  if (!isGroupMac(frame.src)) {
    const existing = lookupMac(table, frame.src);
    if (!existing) {
      learn = { mac: frame.src, port: ingressPort, status: "new" };
      tableAfter = [...table, { mac: frame.src, port: ingressPort }];
    } else if (existing.port !== ingressPort) {
      learn = { mac: frame.src, port: ingressPort, status: "moved", previousPort: existing.port };
      tableAfter = table.map((e) => (e.mac === frame.src ? { mac: e.mac, port: ingressPort } : e));
    } else {
      learn = { mac: frame.src, port: ingressPort, status: "refreshed" };
    }
  }

  const others = allPorts.filter((p) => p !== ingressPort);
  let kind: ForwardKind;
  let egressPorts: number[];

  if (isBroadcastMac(frame.dst)) {
    kind = "broadcast";
    egressPorts = others;
  } else {
    // Lookup uses the table as it stands after learning (the source was learned first).
    const hit = lookupMac(tableAfter, frame.dst);
    if (!hit) {
      kind = "unknown-unicast";
      egressPorts = others;
    } else if (hit.port === ingressPort) {
      kind = "filtered";
      egressPorts = [];
    } else {
      kind = "known-unicast";
      egressPorts = [hit.port];
    }
  }

  return { kind, ingressPort, learn, egressPorts, tableBefore: table, tableAfter };
}

export const ALL_PORTS = [1, 2, 3, 4, 5];

export const FORWARD_KIND_LABEL: Record<ForwardKind, string> = {
  "known-unicast": "Known unicast — forwarded to one port",
  "unknown-unicast": "Unknown unicast — flooded",
  broadcast: "Broadcast — sent to all other ports",
  filtered: "Filtered — destination is on the ingress port",
};

/** A pre-filled table for demos, built from the current device addresses. */
export function fullTable(devices: LabDevice[]): MacTable {
  return devices.map((d) => ({ mac: d.mac, port: d.port }));
}

// ---------------------------------------------------------------------------
// Transmission = one frame's trip, computed up front and revealed step by step
// ---------------------------------------------------------------------------

export interface Delivery {
  deviceId: string;
  port: number;
  /** NIC accepts the frame (destination matches, or broadcast). */
  accepted: boolean;
  /** Frame also passed the FCS check. */
  fcsOk: boolean;
}

export type Location = "source" | "to-switch" | "switch" | "from-switch" | "destination";

export type LogKind = "frame" | "switch" | "learn" | "forward" | "flood" | "receive" | "discard" | "info";

export interface LogLine {
  kind: LogKind;
  text: string;
  detail?: string;
}

export interface TxStep {
  title: string;
  explain: string;
  location: Location;
  filled: FieldId[];
  log: LogLine[];
}

export interface Transmission {
  id: string;
  frame: EthernetFrame;
  /** What the receiving NIC sees on the wire (differs from `frame` if corrupted). */
  received: EthernetFrame;
  srcId: string;
  /** null = broadcast */
  dstId: string | null;
  isBroadcast: boolean;
  decision: SwitchDecision;
  deliveries: Delivery[];
  corrupted: boolean;
  steps: TxStep[];
}

export const STEP_COUNT = 10;

let txCounter = 0;

export function buildTransmission(args: {
  devices: LabDevice[];
  table: MacTable;
  srcId: string;
  dstId: string | "broadcast";
  message: string;
  etherType?: string;
  corrupt?: boolean;
}): Transmission | null {
  const { devices, table, srcId, dstId, message } = args;
  const src = deviceById(devices, srcId);
  if (!src) return null;
  const isBroadcast = dstId === "broadcast";
  const dst = isBroadcast ? undefined : deviceById(devices, dstId);
  if (!isBroadcast && (!dst || dst.id === src.id)) return null;

  const payload = message.trim() === "" ? "Hello" : message.trim().slice(0, 40);
  const etherType = args.etherType ?? DEFAULT_ETHER_TYPE;
  const dstMac = isBroadcast ? BROADCAST_MAC : dst!.mac;
  txCounter += 1;
  const frame = buildFrame(`frame-${txCounter}`, dstMac, src.mac, etherType, payload);
  const corrupted = !!args.corrupt;
  const received: EthernetFrame = corrupted ? { ...frame, payload: corruptPayload(payload) } : frame;

  const decision = switchProcess(table, frame, src.port, ALL_PORTS);

  const deliveries: Delivery[] = decision.egressPorts.map((port) => {
    const dev = deviceByPort(devices, port)!;
    const addressedToMe = isBroadcast || dev.mac === dstMac;
    const fcsOk = computeFcs(received.dst, received.src, received.etherType, received.payload) === frame.fcs;
    return { deviceId: dev.id, port, accepted: addressedToMe && fcsOk, fcsOk: addressedToMe ? fcsOk : true };
  });

  const nameOf = (id: string) => deviceById(devices, id)?.name ?? id;
  const portList = decision.egressPorts.join(", ");
  const dstLabel = isBroadcast ? "broadcast (everyone on the LAN)" : `${dst!.name}`;

  // ---- Step descriptions --------------------------------------------------
  const lookupExplain =
    decision.kind === "broadcast"
      ? `The destination is ${BROADCAST_MAC} — the broadcast address. The switch does not look it up; broadcasts are always sent out of every port except the one they arrived on.`
      : decision.kind === "known-unicast"
        ? `The switch searches its MAC table for ${dstMac} and finds it on Port ${decision.egressPorts[0]}.`
        : decision.kind === "unknown-unicast"
          ? `The switch searches its MAC table for ${dstMac} but has no entry yet. This is an unknown unicast frame, so the switch floods it out of every port except Port ${src.port}.`
          : `${dstMac} is on the same port the frame arrived on, so the switch filters (drops) it.`;

  const forwardExplain =
    decision.kind === "known-unicast"
      ? `Only Port ${decision.egressPorts[0]} gets the frame — the other devices never see it.`
      : decision.kind === "filtered"
        ? "Nothing is forwarded."
        : decision.kind === "broadcast"
          ? `A copy goes out of Ports ${portList}. Every device on the LAN receives it — that is what broadcast means.`
          : `Copies go out of Ports ${portList}. This is flooding because the destination is unknown — it is NOT a broadcast, and each NIC will still check the destination MAC.`;

  const receiveExplain =
    decision.kind === "known-unicast"
      ? `${dst!.name}'s network interface receives the frame.`
      : decision.kind === "filtered"
        ? "No device receives the frame."
        : `Each device's network interface receives a copy. Only some of them will keep it.`;

  const processExplain = corrupted
    ? "The receiving NIC recalculates the FCS, gets a different value than the one in the frame, and discards it. Nothing is passed upward."
    : decision.kind === "known-unicast"
      ? `${dst!.name} sees its own MAC in the destination field, the FCS matches, and it passes the payload up for processing.`
      : decision.kind === "broadcast"
        ? "Every receiving NIC accepts the frame because the destination is the broadcast address, checks the FCS, and passes the payload up."
        : decision.kind === "unknown-unicast"
          ? `Only ${dst!.name} accepts the frame — its MAC matches. The other NICs see a destination that is not theirs and silently discard the copy.`
          : "The frame is never delivered.";

  const learnText = decision.learn
    ? decision.learn.status === "new"
      ? `Switch learned:\n${frame.src} → Port ${decision.learn.port}`
      : decision.learn.status === "moved"
        ? `Switch updated:\n${frame.src} moved from Port ${decision.learn.previousPort} → Port ${decision.learn.port}`
        : `Switch already knows:\n${frame.src} → Port ${decision.learn.port} (entry refreshed)`
    : "";

  const learnLine: LogLine = { kind: "learn", text: learnText.split("\n")[0]!, detail: learnText.split("\n")[1] };

  const lookupLine: LogLine =
    decision.kind === "known-unicast"
      ? { kind: "switch", text: `Destination MAC found on Port ${decision.egressPorts[0]}` }
      : decision.kind === "unknown-unicast"
        ? { kind: "switch", text: "Destination MAC not in table — unknown unicast", detail: "Switch will flood the frame" }
        : decision.kind === "broadcast"
          ? { kind: "switch", text: "Destination is the broadcast address", detail: "Switch floods it to all other ports" }
          : { kind: "switch", text: "Destination is on the ingress port", detail: "Frame filtered" };

  const forwardLine: LogLine =
    decision.kind === "known-unicast"
      ? { kind: "forward", text: `Frame forwarded to Port ${decision.egressPorts[0]}` }
      : decision.kind === "filtered"
        ? { kind: "discard", text: "Frame dropped by the switch" }
        : { kind: "flood", text: `Frame flooded to Ports ${portList}`, detail: decision.kind === "broadcast" ? "Reason: broadcast" : "Reason: unknown unicast" };

  const receiveLines: LogLine[] = deliveries.map((d) => {
    const dev = nameOf(d.deviceId);
    return { kind: "receive", text: `${dev} received a copy of the frame` };
  });

  const processLines: LogLine[] = deliveries.map((d) => {
    const dev = nameOf(d.deviceId);
    if (d.accepted) return { kind: "receive", text: `${dev} accepted the frame`, detail: "Destination matches, FCS OK — payload passed up" };
    if (!d.fcsOk) return { kind: "discard", text: `${dev} discarded the frame`, detail: "FCS mismatch — frame was damaged" };
    return { kind: "discard", text: `${dev} ignored the frame`, detail: "Destination MAC is not mine" };
  });

  const steps: TxStep[] = [
    {
      title: "1. Create data",
      explain: `${src.name} has some data to send to ${dstLabel}: "${payload}".`,
      location: "source",
      filled: ["payload"],
      log: [{ kind: "info", text: `${src.name} has data to send`, detail: `"${payload}"` }],
    },
    {
      title: "2. Create Ethernet frame",
      explain: "The network interface wraps the data in an Ethernet frame. The payload is the data; the frame adds a header and a trailer around it.",
      location: "source",
      filled: ["payload", "type"],
      log: [],
    },
    {
      title: "3. Add source MAC",
      explain: `The frame header gets the sender's MAC address — ${src.name}'s interface, ${src.mac}.`,
      location: "source",
      filled: ["payload", "type", "src"],
      log: [],
    },
    {
      title: "4. Add destination MAC",
      explain: isBroadcast
        ? `For a broadcast the destination MAC is ${BROADCAST_MAC}, which means "every device on this LAN".`
        : `The header gets the intended receiver's MAC address — ${dst!.name}, ${dstMac}.`,
      location: "source",
      filled: ["payload", "type", "src", "dst"],
      log: [{ kind: "frame", text: `${src.name} created frame`, detail: `Source MAC: ${frame.src}\nDestination MAC: ${frame.dst}` }],
    },
    {
      title: "5. Send frame",
      explain: `The interface calculates the FCS trailer and transmits the frame onto the cable toward the switch.${corrupted ? " (Technical option: noise flips a bit on the way, so the payload arrives damaged.)" : ""}`,
      location: "to-switch",
      filled: ["payload", "type", "src", "dst", "fcs"],
      log: [{ kind: "info", text: `${src.name} sent the frame`, detail: `FCS: ${frame.fcs}` }],
    },
    {
      title: "6. Switch receives frame",
      explain: `The frame enters the switch on Port ${src.port}. The switch immediately learns from the SOURCE MAC: ${
        decision.learn?.status === "new"
          ? `${frame.src} is reachable through Port ${src.port}, so it adds that to its MAC table.`
          : decision.learn?.status === "moved"
            ? `${frame.src} now appears on Port ${src.port} (it was on Port ${decision.learn.previousPort}), so it updates the entry.`
            : `${frame.src} is already in the table on Port ${src.port}, so nothing new is added.`
      }`,
      location: "switch",
      filled: FIELD_ORDER,
      log: [{ kind: "switch", text: `Frame entered Switch Port ${src.port}` }, learnLine],
    },
    {
      title: "7. Switch checks MAC table",
      explain: lookupExplain,
      location: "switch",
      filled: FIELD_ORDER,
      log: [lookupLine],
    },
    {
      title: "8. Switch forwards frame",
      explain: forwardExplain,
      location: "from-switch",
      filled: FIELD_ORDER,
      log: [forwardLine],
    },
    {
      title: "9. Destination receives frame",
      explain: receiveExplain,
      location: "destination",
      filled: FIELD_ORDER,
      log: receiveLines,
    },
    {
      title: "10. Frame is processed",
      explain: processExplain,
      location: "destination",
      filled: FIELD_ORDER,
      log: processLines,
    },
  ];

  return {
    id: frame.id,
    frame,
    received,
    srcId,
    dstId: isBroadcast ? null : dst!.id,
    isBroadcast,
    decision,
    deliveries,
    corrupted,
    steps,
  };
}

/** Where is the frame right now, in words? Used by the Frame Inspector. */
export function locationLabel(tx: Transmission, stepIndex: number, devices: LabDevice[]): string {
  const src = deviceById(devices, tx.srcId)?.name ?? "sender";
  if (stepIndex < 0) return "Not sent yet";
  const step = tx.steps[Math.min(stepIndex, tx.steps.length - 1)]!;
  switch (step.location) {
    case "source":
      return `Inside ${src}'s network interface`;
    case "to-switch":
      return `On the cable from ${src} to the switch`;
    case "switch":
      return `Inside the switch (arrived on Port ${tx.decision.ingressPort})`;
    case "from-switch":
      return tx.decision.egressPorts.length === 0
        ? "Dropped inside the switch"
        : `On the cable(s) from Port${tx.decision.egressPorts.length > 1 ? "s" : ""} ${tx.decision.egressPorts.join(", ")}`;
    case "destination":
      return tx.decision.egressPorts.length === 0
        ? "Dropped inside the switch"
        : tx.decision.egressPorts.length === 1
          ? `At ${deviceByPort(devices, tx.decision.egressPorts[0]!)?.name ?? "the destination"}`
          : "At each receiving device";
  }
}

export function statusLabel(tx: Transmission, stepIndex: number): string {
  if (stepIndex < 0) return "Ready";
  if (stepIndex < 3) return "Being built";
  if (stepIndex === 3) return "Header complete";
  if (stepIndex === 4) return "In transit to the switch";
  if (stepIndex === 5) return tx.decision.learn?.status === "new" ? "Source MAC learned" : "Source MAC checked";
  if (stepIndex === 6) return FORWARD_KIND_LABEL[tx.decision.kind];
  if (stepIndex === 7) return "Being forwarded";
  if (stepIndex === 8) return "Delivered to the wire of each output port";
  const accepted = tx.deliveries.filter((d) => d.accepted).length;
  if (tx.corrupted) return "Discarded — FCS error";
  if (tx.decision.kind === "filtered") return "Filtered by the switch";
  return `Accepted by ${accepted} device${accepted === 1 ? "" : "s"}`;
}

// ---------------------------------------------------------------------------
// Guided experiments
// ---------------------------------------------------------------------------

export type TabId = "devices" | "frame" | "send" | "compare" | "table" | "forwarding" | "fcs" | "duplex" | "experiments";

export interface Experiment {
  id: string;
  title: string;
  objective: string;
  startingState: string;
  task: string;
  observation: string;
  explanation: string;
  goTo: TabId;
  goToLabel: string;
  minLevel: "beginner" | "intermediate" | "technical";
  /** Optional lab setup applied when the student clicks "Set up & open". */
  setup?: "reset-table" | "fill-table" | "reset-all";
}

export const EXPERIMENTS: Experiment[] = [
  {
    id: "exp-1",
    title: "Experiment 1 — Inspect MAC Addresses",
    objective: "Find each device's network interface and MAC address, and confirm no two are the same.",
    startingState: "Devices & MACs tab with the five default devices.",
    task: "Select each device in turn and read its interface name and MAC address. Then use Copy on one address and Generate on another.",
    observation: "Every interface has its own six-octet hexadecimal address, and Generate always produces one that no other device already uses.",
    explanation: "A MAC address identifies a network interface at the link layer. Uniqueness on the LAN is what lets a frame name exactly one receiver.",
    goTo: "devices",
    goToLabel: "Open Devices & MACs",
    minLevel: "beginner",
    setup: "reset-all",
  },
  {
    id: "exp-2",
    title: "Experiment 2 — Send a Unicast Frame",
    objective: "Send data from one device to one other device and identify who sent it and who it is for.",
    startingState: "Send Data tab, switch table empty.",
    task: "Choose PC-A as source and Laptop-B as destination, type a short message, and press Send Data. Watch the source and destination MAC fields on the frame.",
    observation: "The frame carries PC-A's MAC as the source and Laptop-B's MAC as the destination, and Laptop-B accepts it.",
    explanation: "Unicast means one sender and one intended receiver. Notice that the switch did not know Laptop-B yet, so a copy also reached other devices — but only Laptop-B's NIC accepted it. Experiment 5 explains why.",
    goTo: "send",
    goToLabel: "Open Send Data",
    minLevel: "beginner",
    setup: "reset-table",
  },
  {
    id: "exp-3",
    title: "Experiment 3 — Broadcast",
    objective: "Send a frame to the broadcast address and see who receives it.",
    startingState: "Send Data tab.",
    task: "Choose PC-A as the source and Broadcast as the destination, then press Send Data.",
    observation: "The destination MAC is FF:FF:FF:FF:FF:FF and every other device on the LAN receives and accepts the frame.",
    explanation: "Broadcast is deliberate: the destination is \"everyone in the local broadcast domain\". The switch does not need a table entry for it.",
    goTo: "send",
    goToLabel: "Open Send Data",
    minLevel: "beginner",
  },
  {
    id: "exp-4",
    title: "Experiment 4 — Teach the Switch",
    objective: "Watch the MAC table fill up as devices send frames.",
    startingState: "MAC Table tab with the table cleared.",
    task: "Press Clear table. Then send PC-A → Laptop-B, then Laptop-B → PC-A, then PC-C → Server, and watch the table after each send.",
    observation: "Each sender appears in the table, on its own port, right after it sends its first frame. A device that has never sent anything is not in the table.",
    explanation: "The switch learns from the SOURCE MAC of incoming frames. It does not need to be configured with addresses.",
    goTo: "table",
    goToLabel: "Open MAC Table",
    minLevel: "intermediate",
    setup: "reset-table",
  },
  {
    id: "exp-5",
    title: "Experiment 5 — Unknown Destination",
    objective: "Send a frame before the switch knows the destination MAC, then send again.",
    startingState: "Forwarding Experiments tab, Experiment B (empty table).",
    task: "Run Experiment B and note which ports get a copy. Then run Experiment A, where the destination is already known, and compare.",
    observation: "With an unknown destination the switch floods to every port except the ingress port; with a known destination only one port gets the frame.",
    explanation: "Unknown unicast flooding is a fallback, not a broadcast: the destination MAC is still a specific device's address, so only that device's NIC accepts the frame.",
    goTo: "forwarding",
    goToLabel: "Open Forwarding Experiments",
    minLevel: "intermediate",
  },
  {
    id: "exp-6",
    title: "Experiment 6 — Inspect an Ethernet Frame",
    objective: "Open every frame field and understand its purpose.",
    startingState: "Frame Anatomy tab.",
    task: "Click Destination MAC, Source MAC, EtherType / Length, Payload, and FCS in turn and read each explanation.",
    observation: "Each field has a single job: address the receiver, identify the sender, label the payload type, carry the data, and let the receiver check for damage.",
    explanation: "This is a simplified educational frame. Real Ethernet also has a preamble and start delimiter for the physical layer, and a gap between frames, which are not shown.",
    goTo: "frame",
    goToLabel: "Open Frame Anatomy",
    minLevel: "beginner",
  },
];

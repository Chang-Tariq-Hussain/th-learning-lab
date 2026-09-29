// ---------------------------------------------------------------------------
// ARP Simulator — pure model (no React).
//
// Scope: how a host on one IPv4 LAN learns the MAC address that goes with an
// IPv4 address (or with its default gateway) before it sends an Ethernet frame.
// Out of scope on purpose: DHCP, DNS, routing, NAT, TCP/UDP, ICMP, IPv6
// Neighbor Discovery, cache aging/retry timers, and a full switch simulation.
// ---------------------------------------------------------------------------

import { BROADCAST_MAC, buildFrame, type EthernetFrame, type LabDevice, type LogLine } from "../ethernet-mac-simulator/model";
import { ROUTER_IFACES, formatIPv4, parseIPv4, prefixToMask } from "../ip-addressing-simulator/model";

export type { DetailLevel } from "../osi-model-explorer/model";
export { DETAIL_LEVEL_LABELS } from "../osi-model-explorer/model";
export { BROADCAST_MAC };

export const ETHERTYPE_ARP = "0x0806";
export const ETHERTYPE_IPV4 = "0x0800";

// ---------------------------------------------------------------------------
// Devices
// ---------------------------------------------------------------------------

export type NodeId = "a" | "b" | "c" | "d" | "router";
export type SourceId = "a" | "b" | "c" | "d";
export const NODE_IDS: NodeId[] = ["a", "b", "c", "d", "router"];
export const SOURCE_IDS: SourceId[] = ["a", "b", "c", "d"];

export interface ArpNode {
  id: NodeId;
  name: string;
  kind: "pc" | "router";
  ip: string;
  prefix: number;
  /** Default gateway (empty on the router itself). */
  gateway: string;
  mac: string;
  /** Switch port the cable plugs into. */
  port: number;
}

const GATEWAY = ROUTER_IFACES[0]!;

/**
 * MAC addresses follow the "AA:AA:AA:AA:AA:10" style of the lab brief, with one
 * deliberate change: the first octet's lowest bit is 0 on every address. A set
 * bit there marks a group (multicast/broadcast) address, which the Ethernet &
 * MAC lab teaches can never belong to a single device — so a first octet of BB
 * or DD would contradict that lab. The router reuses its LAN 1 interface from
 * the IP Addressing lab.
 */
export function createNodes(): ArpNode[] {
  return [
    { id: "a", name: "PC-A", kind: "pc", ip: "192.168.1.10", prefix: 24, gateway: GATEWAY.ip, mac: "AA:AA:AA:AA:AA:10", port: 1 },
    { id: "b", name: "PC-B", kind: "pc", ip: "192.168.1.20", prefix: 24, gateway: GATEWAY.ip, mac: "BA:BB:BB:BB:BB:20", port: 2 },
    { id: "c", name: "PC-C", kind: "pc", ip: "192.168.1.30", prefix: 24, gateway: GATEWAY.ip, mac: "CA:CC:CC:CC:CC:30", port: 3 },
    { id: "d", name: "PC-D", kind: "pc", ip: "192.168.1.40", prefix: 24, gateway: GATEWAY.ip, mac: "DA:DD:DD:DD:DD:40", port: 4 },
    { id: "router", name: "Router", kind: "router", ip: GATEWAY.ip, prefix: GATEWAY.prefix, gateway: "", mac: GATEWAY.mac, port: 5 },
  ];
}

/** A host on another IP network, used only to show "the destination is remote". Not a device on this LAN. */
export const REMOTE_SERVER = { name: "Remote Server", ip: "192.168.2.20", prefix: 24 };
/** An address that no device in the lab owns. */
export const UNKNOWN_IP = "192.168.1.99";

export function nodeById(nodes: ArpNode[], id: string): ArpNode | undefined {
  return nodes.find((n) => n.id === id);
}

/** Adapts lab nodes to the Ethernet lab's device shape so its frame components can be reused. */
export function toLabDevices(nodes: ArpNode[]): LabDevice[] {
  return nodes.map((n) => ({ id: n.id, name: n.name, type: n.kind === "router" ? "server" : "pc", interfaceName: "eth0", mac: n.mac, port: n.port }));
}

function netOf(ip: number, mask: number): number {
  return (ip & mask) >>> 0;
}

// ---------------------------------------------------------------------------
// ARP cache
// ---------------------------------------------------------------------------

export type EntryType = "dynamic" | "static";

export interface ArpEntry {
  ip: string;
  mac: string;
  /** dynamic = learned automatically from ARP traffic; static = configured by hand. */
  type: EntryType;
}

export type Caches = Record<NodeId, ArpEntry[]>;

export function emptyCaches(): Caches {
  return { a: [], b: [], c: [], d: [], router: [] };
}

export function cloneCaches(c: Caches): Caches {
  return { a: [...c.a], b: [...c.b], c: [...c.c], d: [...c.d], router: [...c.router] };
}

export function lookupEntry(list: ArpEntry[], ip: string): ArpEntry | undefined {
  return list.find((e) => e.ip === ip);
}

/**
 * Adds or refreshes an entry. A learned (dynamic) entry never overwrites a
 * static one — a manually configured mapping wins until it is removed.
 */
export function upsertEntry(list: ArpEntry[], entry: ArpEntry): ArpEntry[] {
  const existing = lookupEntry(list, entry.ip);
  if (existing && existing.type === "static" && entry.type === "dynamic") return list;
  if (existing) return list.map((e) => (e.ip === entry.ip ? entry : e));
  return [...list, entry];
}

export function removeEntry(list: ArpEntry[], ip: string): ArpEntry[] {
  return list.filter((e) => e.ip !== ip);
}

/** "Clear cache" — removes learned entries only; static entries stay until removed by hand. */
export function clearDynamic(list: ArpEntry[]): ArpEntry[] {
  return list.filter((e) => e.type === "static");
}

export type CachePreset = "empty" | "a-knows-b" | "a-knows-gateway";

export function cachesForPreset(preset: CachePreset, nodes: ArpNode[] = createNodes()): Caches {
  const c = emptyCaches();
  const a = nodeById(nodes, "a")!;
  const b = nodeById(nodes, "b")!;
  const r = nodeById(nodes, "router")!;
  if (preset === "a-knows-b") {
    c.a = [{ ip: b.ip, mac: b.mac, type: "dynamic" }];
    c.b = [{ ip: a.ip, mac: a.mac, type: "dynamic" }];
  } else if (preset === "a-knows-gateway") {
    c.a = [{ ip: r.ip, mac: r.mac, type: "dynamic" }];
    c.router = [{ ip: a.ip, mac: a.mac, type: "dynamic" }];
  }
  return c;
}

// ---------------------------------------------------------------------------
// ARP messages
// ---------------------------------------------------------------------------

export interface ArpPacket {
  operation: "request" | "reply";
  opcode: 1 | 2;
  senderId: NodeId;
  senderName: string;
  senderIp: string;
  senderMac: string;
  targetIp: string;
  /** null = unknown (a request does not know the answer yet). */
  targetMac: string | null;
  /** Name shown for the target (best effort; a request's target is only known by IP). */
  targetName: string | null;
  hardwareType: string;
  protocolType: string;
  hwLen: number;
  protoLen: number;
}

export function buildArpRequest(sender: ArpNode, targetIp: string): ArpPacket {
  return {
    operation: "request",
    opcode: 1,
    senderId: sender.id,
    senderName: sender.name,
    senderIp: sender.ip,
    senderMac: sender.mac,
    targetIp,
    targetMac: null,
    targetName: null,
    hardwareType: "1 (Ethernet)",
    protocolType: "0x0800 (IPv4)",
    hwLen: 6,
    protoLen: 4,
  };
}

export function buildArpReply(replier: ArpNode, requester: ArpNode): ArpPacket {
  return {
    operation: "reply",
    opcode: 2,
    senderId: replier.id,
    senderName: replier.name,
    senderIp: replier.ip,
    senderMac: replier.mac,
    targetIp: requester.ip,
    targetMac: requester.mac,
    targetName: requester.name,
    hardwareType: "1 (Ethernet)",
    protocolType: "0x0800 (IPv4)",
    hwLen: 6,
    protoLen: 4,
  };
}

export type ArpFieldId = "operation" | "senderMac" | "senderIp" | "targetMac" | "targetIp" | "hardwareType" | "protocolType" | "hwLen" | "protoLen";

export interface ArpFieldInfo {
  id: ArpFieldId;
  label: string;
  /** Size in the real ARP message, shown at the Technical level. */
  size: string;
  /** Shown to Beginner students (the five essential fields). */
  essential: boolean;
  purpose: string;
  technical: string;
}

/** In the order a real ARP message lays them out. */
export const ARP_FIELDS: ArpFieldInfo[] = [
  { id: "hardwareType", label: "Hardware Type", size: "2 bytes", essential: false, purpose: "The kind of link-layer network the addresses belong to. 1 means Ethernet.", technical: "ARP is not Ethernet-only; this field lets it describe other link technologies. On an Ethernet LAN it is always 1." },
  { id: "protocolType", label: "Protocol Type", size: "2 bytes", essential: false, purpose: "The kind of network-layer address being resolved. 0x0800 means IPv4.", technical: "It reuses the same values as the Ethernet EtherType field. ARP resolves IPv4 addresses; IPv6 uses a different mechanism (Neighbor Discovery), which is not part of this lab." },
  { id: "hwLen", label: "Hardware Address Length", size: "1 byte", essential: false, purpose: "How many bytes a MAC address takes: 6 on Ethernet.", technical: "Lets a receiver know how to read the sender and target hardware address fields." },
  { id: "protoLen", label: "Protocol Address Length", size: "1 byte", essential: false, purpose: "How many bytes an IPv4 address takes: 4.", technical: "Together with the hardware address length, it fixes the total size of the ARP message: 28 bytes for IPv4 over Ethernet." },
  { id: "operation", label: "Operation", size: "2 bytes", essential: true, purpose: "Request (1) means \"who has this IP address?\". Reply (2) means \"this IP address is at this MAC address\".", technical: "Other operation codes exist for other protocols, but Request and Reply are the two used for IPv4 over Ethernet." },
  { id: "senderMac", label: "Sender MAC", size: "6 bytes", essential: true, purpose: "The MAC address of the device that built this ARP message. In a request it tells the target where to send the answer.", technical: "Receivers may also use this pair (sender IP, sender MAC) to learn or refresh a mapping in their own ARP cache." },
  { id: "senderIp", label: "Sender IP", size: "4 bytes", essential: true, purpose: "The IPv4 address of the device that built this ARP message. In a reply, this is the very address that was asked about.", technical: "The pair sender IP + sender MAC is what a reply actually delivers: \"this IP is at this MAC\"." },
  { id: "targetMac", label: "Target MAC", size: "6 bytes", essential: true, purpose: "In a request it is unknown — that is exactly what is being asked. In a reply it is the MAC address of the device that asked.", technical: "In a request this field is normally sent as 00:00:00:00:00:00 and ignored by receivers." },
  { id: "targetIp", label: "Target IP", size: "4 bytes", essential: true, purpose: "In a request, the IPv4 address whose MAC address is wanted. In a reply, the IPv4 address of the device that asked.", technical: "A receiver compares this with its own IP address to decide whether the request is for it." },
];

export function arpFieldValue(p: ArpPacket, id: ArpFieldId, technical: boolean): string {
  switch (id) {
    case "operation":
      return p.operation === "request" ? (technical ? "Request (1)" : "Request") : technical ? "Reply (2)" : "Reply";
    case "senderMac":
      return p.senderMac;
    case "senderIp":
      return p.senderIp;
    case "targetMac":
      return p.targetMac ?? (technical ? "Unknown (sent as 00:00:00:00:00:00)" : "Unknown");
    case "targetIp":
      return p.targetIp;
    case "hardwareType":
      return p.hardwareType;
    case "protocolType":
      return p.protocolType;
    case "hwLen":
      return String(p.hwLen);
    case "protoLen":
      return String(p.protoLen);
  }
}

// ---------------------------------------------------------------------------
// Destination validation
// ---------------------------------------------------------------------------

export type DestCheck = { ok: true; ip: string } | { ok: false; reason: string };

export function checkDestination(text: string, src: ArpNode): DestCheck {
  const p = parseIPv4(text);
  if (!p.ok) return { ok: false, reason: p.reason };
  const v = p.value;
  const ip = formatIPv4(v);
  if (ip === src.ip) return { ok: false, reason: `${ip} is ${src.name}'s own address. Traffic to yourself stays inside the device (loopback), so ARP is never used.` };
  const first = v >>> 24;
  if (first === 127) return { ok: false, reason: "127.x.x.x is the loopback range. It never leaves the device, so ARP is not used." };
  if (first === 0) return { ok: false, reason: "0.x.x.x is not a valid destination host address." };
  if (first >= 224) return { ok: false, reason: "Multicast and reserved addresses are not resolved with an ordinary ARP request." };
  const s = parseIPv4(src.ip);
  if (s.ok) {
    const mask = prefixToMask(src.prefix);
    const net = netOf(s.value, mask);
    if (netOf(v, mask) === net) {
      const bc = (net | (~mask >>> 0)) >>> 0;
      if (v === net) return { ok: false, reason: `${ip} is the network address of ${formatIPv4(net)}/${src.prefix}. It names the network, not a device.` };
      if (v === bc) return { ok: false, reason: `${ip} is the broadcast address of ${formatIPv4(net)}/${src.prefix}. Traffic to it goes to the broadcast MAC directly, so there is nothing to resolve.` };
    }
  }
  return { ok: true, ip };
}

// ---------------------------------------------------------------------------
// A run = one attempt to send data, as an ordered list of steps
// ---------------------------------------------------------------------------

export type Outcome = "resolved" | "hit" | "hit-wrong" | "unanswered";

/** The chain the lab keeps returning to: Destination IP → ARP Cache → ARP Request → ARP Reply → MAC → Frame → Data. */
export type ChainStage = "ip" | "cache" | "request" | "reply" | "mac" | "frame" | "data";
export const CHAIN: { id: ChainStage; label: string }[] = [
  { id: "ip", label: "Destination IP" },
  { id: "cache", label: "ARP Cache" },
  { id: "request", label: "ARP Request" },
  { id: "reply", label: "ARP Reply" },
  { id: "mac", label: "MAC Address" },
  { id: "frame", label: "Ethernet Frame" },
  { id: "data", label: "Data" },
];

export type TokenKind = "request" | "reply" | "data";

/**
 * Where a message token is drawn. Legs: 0 at the sender, 1 on the sender's
 * cable, 2 at the switch, 3 on the receiving cable(s), 4 at the receiver(s).
 */
export interface TokenViz {
  kind: TokenKind;
  from: NodeId;
  to: NodeId | "all";
  leg: 0 | 1 | 2 | 3 | 4;
  label: string;
}

export type NoteTone = "neutral" | "sky" | "amber" | "emerald" | "red";
export interface NodeNote {
  text: string;
  tone: NoteTone;
}

export type MessageRef = "request" | "reply" | "data" | null;

export interface RunStep {
  title: string;
  explain: string;
  chain: ChainStage;
  token?: TokenViz;
  notes: Partial<Record<NodeId, NodeNote>>;
  log: LogLine[];
  /** ARP cache changes that become visible when this step is reached. */
  cacheOps: { node: NodeId; entry: ArpEntry }[];
  /** Which message the inspectors should show at this step. */
  message: MessageRef;
}

export interface Run {
  id: string;
  srcId: NodeId;
  destIp: string;
  message: string;
  outcome: Outcome;
  /** true = the destination is on the sender's own network. */
  local: boolean;
  /** The address whose MAC is needed: the destination itself (local) or the default gateway (remote). */
  nextHopIp: string;
  /** Device that owns nextHopIp, if any. */
  nextHopOwnerId: NodeId | null;
  steps: RunStep[];
  arpRequest: ArpPacket | null;
  arpReply: ArpPacket | null;
  requestFrame: EthernetFrame | null;
  replyFrame: EthernetFrame | null;
  dataFrame: EthernetFrame | null;
  /** Destination IP inside the IP packet carried by the data frame (differs from the frame's MAC owner for remote traffic). */
  ipDst: string;
  /** Device whose NIC accepts the data frame, if any. */
  deliveredToId: NodeId | null;
  cachesBefore: Caches;
}

export interface RunSummary {
  srcId: NodeId;
  destIp: string;
  nextHopIp: string;
  outcome: Outcome;
  arpUsed: boolean;
  local: boolean;
}

/** Which address a sender needs a MAC for: the destination itself when it is local, otherwise the default gateway. */
export function nextHopFor(src: ArpNode, destIp: string): { nextHopIp: string; local: boolean } | null {
  const d = parseIPv4(destIp);
  const s = parseIPv4(src.ip);
  if (!d.ok || !s.ok) return null;
  const mask = prefixToMask(src.prefix);
  const local = netOf(d.value, mask) === netOf(s.value, mask);
  return { nextHopIp: local ? formatIPv4(d.value) : src.gateway, local };
}

export function cachesAfterStep(run: Run, stepIndex: number): Caches {
  const c = cloneCaches(run.cachesBefore);
  for (let i = 0; i <= stepIndex && i < run.steps.length; i++) {
    for (const op of run.steps[i]!.cacheOps) c[op.node] = upsertEntry(c[op.node], op.entry);
  }
  return c;
}

export function summarize(run: Run): RunSummary {
  return { srcId: run.srcId, destIp: run.destIp, nextHopIp: run.nextHopIp, outcome: run.outcome, arpUsed: run.outcome === "resolved" || run.outcome === "unanswered", local: run.local };
}

const TOKEN_LABEL: Record<TokenKind, string> = { request: "ARP Req", reply: "ARP Reply", data: "Data" };

let runCounter = 0;

function note(text: string, tone: NoteTone): NodeNote {
  return { text, tone };
}

export function buildRun(args: { nodes: ArpNode[]; caches: Caches; srcId: NodeId; destIp: string; message: string }): Run | null {
  const { nodes, caches, srcId } = args;
  const src = nodeById(nodes, srcId);
  const parsed = parseIPv4(args.destIp);
  if (!src || src.kind !== "pc" || !parsed.ok) return null;
  const sIp = parseIPv4(src.ip);
  if (!sIp.ok) return null;

  const destIp = formatIPv4(parsed.value);
  const message = args.message.trim() || "Hello";
  const mask = prefixToMask(src.prefix);
  const local = netOf(parsed.value, mask) === netOf(sIp.value, mask);
  const nextHopIp = local ? destIp : src.gateway;
  const owner = nodes.find((n) => n.ip === nextHopIp && n.id !== srcId) ?? null;
  const entry = lookupEntry(caches[srcId], nextHopIp);
  const cacheHasIt = !!entry;
  const others = nodes.filter((n) => n.id !== srcId);
  const netText = `${formatIPv4(netOf(sIp.value, mask))}/${src.prefix}`;
  const hopWord = local ? destIp : `${nextHopIp} (the default gateway)`;
  const hopMissWord = local ? destIp : `the gateway ${nextHopIp}`;

  const id = `run-${++runCounter}`;
  const steps: RunStep[] = [];
  const tokenFor = (kind: TokenKind, from: NodeId, to: NodeId | "all", leg: TokenViz["leg"]): TokenViz => ({ kind, from, to, leg, label: TOKEN_LABEL[kind] });
  const ipDst = destIp;

  // ---- Step: the application wants to send -------------------------------
  const knowsMacText = cacheHasIt ? "Whether it also knows the MAC address is what the ARP cache will tell it." : "It does not know the destination MAC address yet.";
  steps.push({
    title: `${src.name} decides to send data`,
    explain: local
      ? `An application on ${src.name} wants to send "${message}" to ${destIp}. ${src.name} knows the destination IP address. An Ethernet frame needs a destination MAC address, though. ${knowsMacText} ${destIp} is inside ${src.name}'s own network (${netText}), so the frame will be addressed to the destination itself.`
      : `An application on ${src.name} wants to send "${message}" to ${destIp}. ${src.name} knows the destination IP address, but ${destIp} is not inside its own network (${netText}).`,
    chain: "ip",
    notes: { [srcId]: note("sender", "sky") },
    log: [{ kind: "info", text: `${src.name} wants to send data to ${destIp}`, detail: "Destination IP: known\nDestination MAC: not known yet" }],
    cacheOps: [],
    message: null,
  });

  if (!local) {
    steps.push({
      title: "The destination is remote — use the default gateway",
      explain: `${destIp} is on another network, so ${src.name} cannot deliver the frame to it directly and must not ARP for it. The frame is sent to the default gateway, ${nextHopIp}, which is on ${src.name}'s own network. So the MAC address ${src.name} needs is the gateway's, not the remote host's.`,
      chain: "ip",
      notes: { [srcId]: note("remote destination", "amber"), router: note(`gateway ${nextHopIp}`, "sky") },
      log: [{ kind: "info", text: `${destIp} is not on ${netText}`, detail: `Next hop = default gateway ${nextHopIp}` }],
      cacheOps: [],
      message: null,
    });
  }

  // ---- Step: check the cache ---------------------------------------------
  steps.push({
    title: `${src.name} checks its ARP cache`,
    explain: `Before asking the network, ${src.name} looks for ${hopWord} in its ARP cache — the table of IP address → MAC address mappings it has already learned.`,
    chain: "cache",
    notes: { [srcId]: note("checking ARP cache", "sky") },
    log: [{ kind: "info", text: `${src.name} checking ARP cache`, detail: `Looking for ${nextHopIp}` }],
    cacheOps: [],
    message: null,
  });

  // =========================================================================
  // CACHE HIT (correct or stale)
  // =========================================================================
  if (entry) {
    const deliveredTo = others.find((n) => n.mac === entry.mac) ?? null;
    const correct = !!owner && entry.mac === owner.mac;
    const dataFrame = buildFrame(`${id}-data`, entry.mac, src.mac, ETHERTYPE_IPV4, message);

    steps.push({
      title: "Entry found — cache hit",
      explain: `The cache already holds ${entry.ip} → ${entry.mac} (${entry.type === "static" ? "a static, manually configured entry" : "a dynamic entry learned earlier"}). ${src.name} now knows the destination MAC address without asking anyone.`,
      chain: "mac",
      notes: { [srcId]: note("cache hit ✓", "emerald") },
      log: [{ kind: "learn", text: `Entry found for ${entry.ip}`, detail: `${entry.ip} → ${entry.mac} (${entry.type})` }],
      cacheOps: [],
      message: null,
    });
    steps.push({
      title: "No ARP request is needed",
      explain: `Because the mapping is already known, ${src.name} sends no ARP request: no broadcast, no waiting for a reply. This is why ARP does not happen before every packet — the cache remembers the answer.`,
      chain: "mac",
      notes: { [srcId]: note("no ARP needed", "emerald") },
      log: [{ kind: "info", text: "No ARP request required" }],
      cacheOps: [],
      message: null,
    });
    steps.push({
      title: `${src.name} creates the Ethernet frame`,
      explain: local
        ? `${src.name} builds the Ethernet frame. Destination MAC = ${entry.mac} (from the cache), source MAC = ${src.mac}. The data travels inside as an IP packet addressed to ${destIp}.`
        : `${src.name} builds the Ethernet frame. Destination MAC = ${entry.mac} (the gateway's, from the cache), source MAC = ${src.mac}. Inside, the IP packet is still addressed to the remote host ${destIp}.`,
      chain: "frame",
      token: tokenFor("data", srcId, deliveredTo?.id ?? "all", 0),
      notes: { [srcId]: note("frame ready", "sky") },
      log: [{ kind: "frame", text: "Ethernet frame created", detail: `Dst MAC ${entry.mac}\nSrc MAC ${src.mac}\nIP destination ${destIp}` }],
      cacheOps: [],
      message: "data",
    });

    if (correct && deliveredTo) {
      steps.push({
        title: local ? "Data is sent to the destination" : "Frame is sent to the gateway",
        explain: local
          ? `The switch delivers the frame to ${deliveredTo.name}, whose MAC address matches. ${deliveredTo.name} accepts it and passes the data up to the application.`
          : `The frame goes to the router, whose MAC address matches. The router accepts it. What it does next (routing the packet towards ${destIp}) is a later topic and is not simulated here.`,
        chain: "frame",
        token: tokenFor("data", srcId, deliveredTo.id, 4),
        notes: { [srcId]: note("sent", "sky"), [deliveredTo.id]: note(local ? "accepted ✓" : "accepted ✓ (would forward)", "emerald") },
        log: [{ kind: "forward", text: `Data sent to ${deliveredTo.name}`, detail: local ? undefined : `Next hop only — final destination is ${destIp}` }],
        cacheOps: [],
        message: "data",
      });
      return {
        id, srcId, destIp, message, outcome: "hit", local, nextHopIp, nextHopOwnerId: owner?.id ?? null, steps,
        arpRequest: null, arpReply: null, requestFrame: null, replyFrame: null, dataFrame, ipDst,
        deliveredToId: deliveredTo.id, cachesBefore: cloneCaches(caches),
      };
    }

    // Stale / incorrect mapping.
    const wrongName = deliveredTo ? deliveredTo.name : "no device";
    steps.push({
      title: "The frame goes to the wrong place",
      explain: deliveredTo
        ? `The cached MAC ${entry.mac} belongs to ${deliveredTo.name}, whose IP address is ${deliveredTo.ip}, not ${nextHopIp}. ${deliveredTo.name}'s network card accepts the frame because the MAC matches, but its IP layer sees a packet meant for another address and discards it.`
        : `No device on the LAN has the MAC address ${entry.mac}, so no network card accepts the frame.`,
      chain: "frame",
      token: deliveredTo ? tokenFor("data", srcId, deliveredTo.id, 4) : tokenFor("data", srcId, "all", 2),
      notes: {
        [srcId]: note("sent", "sky"),
        ...(deliveredTo ? { [deliveredTo.id]: note(`MAC matches, IP ${deliveredTo.ip} ✕`, "red") } : {}),
        ...(owner ? { [owner.id]: note("never gets it ✕", "red") } : {}),
      },
      log: [{ kind: "discard", text: `Frame delivered to ${wrongName}, but the IP address does not match`, detail: `Cache says ${nextHopIp} → ${entry.mac}` }],
      cacheOps: [],
      message: "data",
    });
    steps.push({
      title: "The mapping is wrong — the data never arrives",
      explain: `${src.name} trusted a cache entry that does not match the real owner of ${nextHopIp}${owner ? ` (${owner.name}, ${owner.mac})` : ""}. Cache entries are only as good as what put them there. The fix: remove the bad entry, then let ARP resolve the address again.`,
      chain: "mac",
      notes: { [srcId]: note("wrong mapping ✕", "red") },
      log: [{ kind: "info", text: "Incorrect IP-to-MAC mapping in the ARP cache", detail: owner ? `Real owner of ${nextHopIp}: ${owner.name} (${owner.mac})` : `No device owns ${nextHopIp}` }],
      cacheOps: [],
      message: null,
    });
    return {
      id, srcId, destIp, message, outcome: "hit-wrong", local, nextHopIp, nextHopOwnerId: owner?.id ?? null, steps,
      arpRequest: null, arpReply: null, requestFrame: null, replyFrame: null, dataFrame, ipDst,
      deliveredToId: null, cachesBefore: cloneCaches(caches),
    };
  }

  // =========================================================================
  // CACHE MISS
  // =========================================================================
  const arpRequest = buildArpRequest(src, nextHopIp);
  const requestFrame = buildFrame(`${id}-req`, BROADCAST_MAC, src.mac, ETHERTYPE_ARP, `ARP Request: who has ${nextHopIp}? Tell ${src.ip}`);
  const everyoneElse = (tone: NoteTone, text: string): Partial<Record<NodeId, NodeNote>> => Object.fromEntries(others.map((n) => [n.id, note(text, tone)]));

  steps.push({
    title: "No entry found — cache miss",
    explain: `The cache has no entry for ${hopMissWord}. Without its MAC address ${src.name} cannot build the Ethernet frame yet, so it has to ask the local network.`,
    chain: "cache",
    notes: { [srcId]: note("cache miss ✕", "amber") },
    log: [{ kind: "info", text: `No entry found for ${nextHopIp}`, detail: "Destination MAC remains unknown" }],
    cacheOps: [],
    message: null,
  });
  steps.push({
    title: `${src.name} creates an ARP Request`,
    explain: `The message asks: "Who has ${nextHopIp}? Tell ${src.ip}." It carries ${src.name}'s own IP and MAC address so the owner knows where to answer. The Target MAC field is unknown — that is what is being asked for.`,
    chain: "request",
    token: tokenFor("request", srcId, "all", 0),
    notes: { [srcId]: note("ARP Request ready", "amber") },
    log: [{ kind: "frame", text: "ARP Request created", detail: `Who has ${nextHopIp}? Tell ${src.ip}` }],
    cacheOps: [],
    message: "request",
  });
  steps.push({
    title: "The request is broadcast on the LAN",
    explain: `${src.name} does not know who owns ${nextHopIp}, so the Ethernet frame's destination MAC is the broadcast address ${BROADCAST_MAC}. The switch floods a broadcast out of every port except the one it came in on, so the request reaches every other device on this LAN.`,
    chain: "request",
    token: tokenFor("request", srcId, "all", 3),
    notes: { [srcId]: note("broadcast sent", "amber"), ...everyoneElse("amber", "receiving…") },
    log: [{ kind: "flood", text: "Broadcast sent through the Switch", detail: `Dst MAC ${BROADCAST_MAC}\nEvery other port receives a copy` }],
    cacheOps: [],
    message: "request",
  });

  if (!owner) {
    steps.push({
      title: "Every device ignores the request",
      explain: `All the devices receive the broadcast and compare the Target IP (${nextHopIp}) with their own address. Nobody on this LAN owns ${nextHopIp}, so nobody answers.`,
      chain: "request",
      token: tokenFor("request", srcId, "all", 4),
      notes: { [srcId]: note("waiting…", "amber"), ...everyoneElse("neutral", "not my IP ✕") },
      log: others.map((n) => ({ kind: "discard" as const, text: `${n.name} ignored the ARP Request`, detail: `${nextHopIp} is not ${n.ip}` })),
      cacheOps: [],
      message: "request",
    });
    steps.push({
      title: "No ARP Reply comes back",
      explain: `${src.name} waits, but no ARP reply arrives, so the destination MAC address remains unknown. In this simplified lab that ends the attempt. A real operating system would retry a few times before reporting the host as unreachable; those timers are not simulated.`,
      chain: "request",
      notes: { [srcId]: note("no reply ✕", "red") },
      log: [{ kind: "info", text: "No matching ARP Reply", detail: "Destination MAC remains unknown" }],
      cacheOps: [],
      message: null,
    });
    steps.push({
      title: "The data cannot be sent",
      explain: `Without a destination MAC address the Ethernet frame cannot be built, so the data is not sent. Common causes: a mistyped IP address, a device that is powered off or unplugged, or an address that is simply not on this network.`,
      chain: "mac",
      notes: { [srcId]: note("cannot send ✕", "red") },
      log: [{ kind: "discard", text: "No Ethernet frame created", detail: `MAC address for ${nextHopIp} could not be resolved` }],
      cacheOps: [],
      message: null,
    });
    return {
      id, srcId, destIp, message, outcome: "unanswered", local, nextHopIp, nextHopOwnerId: null, steps,
      arpRequest, arpReply: null, requestFrame, replyFrame: null, dataFrame: null, ipDst,
      deliveredToId: null, cachesBefore: cloneCaches(caches),
    };
  }

  // A device owns the address.
  const arpReply = buildArpReply(owner, src);
  const replyFrame = buildFrame(`${id}-rep`, src.mac, owner.mac, ETHERTYPE_ARP, `ARP Reply: ${owner.ip} is at ${owner.mac}`);
  const dataFrame = buildFrame(`${id}-data`, owner.mac, src.mac, ETHERTYPE_IPV4, message);
  const ignoring = others.filter((n) => n.id !== owner.id);
  const ignoringNames = ignoring.map((n) => n.name).join(", ");

  steps.push({
    title: `${owner.name} receives the request`,
    explain: `Every device reads the ARP message. ${ignoringNames} see that the Target IP is not theirs and ignore it. ${owner.name} sees that ${nextHopIp} is its own address, so it will answer.`,
    chain: "request",
    token: tokenFor("request", srcId, "all", 4),
    notes: { [srcId]: note("waiting…", "amber"), ...Object.fromEntries(ignoring.map((n) => [n.id, note("not my IP ✕", "neutral")])), [owner.id]: note("that's my IP ✓", "emerald") },
    log: [
      { kind: "receive", text: `${owner.name} received the ARP Request`, detail: `${nextHopIp} is my IP address` },
      ...ignoring.map((n) => ({ kind: "discard" as const, text: `${n.name} ignored the ARP Request`, detail: `${nextHopIp} is not ${n.ip}` })),
    ],
    cacheOps: [],
    message: "request",
  });
  steps.push({
    title: `${owner.name} creates an ARP Reply`,
    explain: `${owner.name} answers: "${owner.ip} is at ${owner.mac}." The reply is addressed only to ${src.name}: destination MAC = ${src.mac} (taken from the request's sender fields), source MAC = ${owner.mac}. A reply is normally a unicast, not a broadcast. ${owner.name} also stores ${src.name}'s IP → MAC mapping, since the request just told it.`,
    chain: "reply",
    token: tokenFor("reply", owner.id, srcId, 0),
    notes: { [owner.id]: note("ARP Reply ready", "emerald"), [srcId]: note("waiting…", "amber") },
    log: [
      { kind: "frame", text: `${owner.name} generated an ARP Reply`, detail: `${owner.ip} is at ${owner.mac}` },
      { kind: "learn", text: `${owner.name} learned ${src.ip} → ${src.mac}`, detail: "from the request's sender fields" },
    ],
    cacheOps: [{ node: owner.id, entry: { ip: src.ip, mac: src.mac, type: "dynamic" } }],
    message: "reply",
  });
  steps.push({
    title: `The reply reaches ${src.name}`,
    explain: `The switch has already seen ${src.name}'s MAC address as the source of the broadcast, so it forwards the unicast reply out of ${src.name}'s port only. The other devices do not receive it.`,
    chain: "reply",
    token: tokenFor("reply", owner.id, srcId, 4),
    notes: { [owner.id]: note("replied", "emerald"), [srcId]: note("got the reply ✓", "emerald") },
    log: [{ kind: "forward", text: `${src.name} received the ARP Reply`, detail: `Unicast to ${src.mac}` }],
    cacheOps: [],
    message: "reply",
  });
  steps.push({
    title: `${src.name} stores the mapping`,
    explain: `${src.name} adds ${nextHopIp} → ${owner.mac} to its ARP cache as a dynamic (learned) entry. Now the destination MAC address is known${local ? "" : " — and it is the gateway's MAC, not the remote host's"}.`,
    chain: "mac",
    notes: { [srcId]: note("cache updated ✓", "emerald") },
    log: [{ kind: "learn", text: "ARP cache updated", detail: `${nextHopIp} → ${owner.mac}` }],
    cacheOps: [{ node: srcId, entry: { ip: nextHopIp, mac: owner.mac, type: "dynamic" } }],
    message: null,
  });
  steps.push({
    title: `${src.name} sends the Ethernet frame`,
    explain: local
      ? `With the MAC known, ${src.name} builds the Ethernet frame: destination MAC = ${owner.mac}, source MAC = ${src.mac}, carrying the IP packet with the data. It is a unicast, so only ${owner.name} accepts it.`
      : `${src.name} builds the Ethernet frame: destination MAC = ${owner.mac} (the router), source MAC = ${src.mac}. The IP packet inside is still addressed to ${destIp}. The frame is addressed to the next hop on the local link; what the router does with the packet next is routing, which is not simulated here.`,
    chain: "frame",
    token: tokenFor("data", srcId, owner.id, 4),
    notes: { [srcId]: note("sent", "sky"), [owner.id]: note(local ? "accepted ✓" : "accepted ✓ (would forward)", "emerald") },
    log: [
      { kind: "frame", text: "Ethernet frame created", detail: `Dst MAC ${owner.mac}\nSrc MAC ${src.mac}\nIP destination ${destIp}` },
      { kind: "forward", text: `Data sent to ${owner.name}`, detail: local ? undefined : `Next hop only — final destination is ${destIp}` },
    ],
    cacheOps: [],
    message: "data",
  });

  return {
    id, srcId, destIp, message, outcome: "resolved", local, nextHopIp, nextHopOwnerId: owner.id, steps,
    arpRequest, arpReply, requestFrame, replyFrame, dataFrame, ipDst,
    deliveredToId: owner.id, cachesBefore: cloneCaches(caches),
  };
}

/** Human-readable name of an outcome, used by summaries and challenge feedback. */
export const OUTCOME_LABEL: Record<Outcome, string> = {
  resolved: "Cache miss — ARP resolved the MAC address",
  hit: "Cache hit — no ARP needed",
  "hit-wrong": "Cache hit — but the mapping is wrong",
  unanswered: "Cache miss — no ARP reply",
};

// ---------------------------------------------------------------------------
// Scenario presets
// ---------------------------------------------------------------------------

export type ScenarioId = "first" | "hit" | "unknown" | "gateway" | "gateway-hit" | "custom";

export interface ScenarioPreset {
  id: ScenarioId;
  label: string;
  blurb: string;
  destIp: string;
  cache: CachePreset | "keep";
  /** What the student should expect, shown before the run starts. */
  expect: string;
}

export const SCENARIOS: ScenarioPreset[] = [
  { id: "first", label: "First communication", blurb: "PC-A sends to 192.168.1.20 with an empty ARP cache.", destIp: "192.168.1.20", cache: "empty", expect: "Cache miss → ARP request (broadcast) → ARP reply (unicast) → cache updated → data sent." },
  { id: "hit", label: "Cache hit", blurb: "PC-A already knows PC-B and sends another message.", destIp: "192.168.1.20", cache: "a-knows-b", expect: "Cache hit → no ARP request → data sent straight away." },
  { id: "unknown", label: "Unknown IP", blurb: "PC-A asks for 192.168.1.99, which no device owns.", destIp: UNKNOWN_IP, cache: "empty", expect: "ARP request is broadcast, but nobody replies, so the MAC stays unknown and no data is sent." },
  { id: "gateway", label: "Remote destination", blurb: "PC-A sends to 192.168.2.20, on another network.", destIp: REMOTE_SERVER.ip, cache: "empty", expect: "PC-A ARPs for its default gateway (192.168.1.1), not for the remote host." },
  { id: "gateway-hit", label: "Remote, gateway cached", blurb: "Same remote destination, but PC-A already knows the gateway's MAC.", destIp: REMOTE_SERVER.ip, cache: "a-knows-gateway", expect: "Gateway found in the cache → no ARP → frame sent to the gateway's MAC." },
  { id: "custom", label: "Custom destination", blurb: "Type any destination IP and choose the sender.", destIp: "192.168.1.30", cache: "keep", expect: "The result depends on the destination and on what the cache already holds." },
];

export function scenarioById(id: ScenarioId): ScenarioPreset {
  return SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[0]!;
}

// ---------------------------------------------------------------------------
// Tabs & guided experiments
// ---------------------------------------------------------------------------

export type TabId = "resolve" | "compare" | "gateway" | "messages" | "cache" | "experiments";

export interface Experiment {
  id: string;
  title: string;
  objective: string;
  startingState: string;
  task: string;
  hint: string;
  observation: string;
  explanation: string;
  goTo: TabId;
  goToLabel: string;
  scenario: ScenarioId;
  minLevel: "beginner" | "intermediate" | "technical";
}

export const EXPERIMENTS: Experiment[] = [
  {
    id: "arp-exp-1",
    title: "Experiment 1 — First Communication",
    objective: "See every step needed before the very first frame reaches a device whose MAC address is unknown.",
    startingState: "PC-A's ARP cache is empty. PC-A will send data to 192.168.1.20.",
    task: "Press Step until the run finishes. At each step note what PC-A knows: the destination IP, then the ARP request, then the reply. Stop at the request and read the destination MAC of the frame.",
    hint: "Look at the Ethernet destination MAC of the ARP request. Is it PC-B's MAC?",
    observation: "PC-A broadcasts an ARP request to FF:FF:FF:FF:FF:FF. Only PC-B answers, with a unicast reply. PC-A stores 192.168.1.20 → PC-B's MAC and only then sends the data frame.",
    explanation: "An Ethernet frame needs a destination MAC address, but applications only supply an IP address. ARP is the step that turns one into the other on the local network.",
    goTo: "resolve",
    goToLabel: "Open Resolve an Address",
    scenario: "first",
    minLevel: "beginner",
  },
  {
    id: "arp-exp-2",
    title: "Experiment 2 — Cache Hit",
    objective: "Find out why ARP does not run before every single packet.",
    startingState: "PC-A already has 192.168.1.20 in its ARP cache, as if Experiment 1 had just finished.",
    task: "Send another message to 192.168.1.20 and count how many ARP messages are sent. Then press Send another message on the previous scenario and compare with a cache miss.",
    hint: "Check the ARP cache panel before the first step. What is already in it?",
    observation: "PC-A finds the entry, sends no ARP request, and builds the Ethernet frame straight away.",
    explanation: "The ARP cache remembers recent answers. Skipping the broadcast saves network traffic and time. (Real caches forget entries after a while, so the question is asked again later.)",
    goTo: "compare",
    goToLabel: "Open Miss vs Hit",
    scenario: "hit",
    minLevel: "beginner",
  },
  {
    id: "arp-exp-3",
    title: "Experiment 3 — Unknown IP",
    objective: "Observe what happens when no device owns the requested IP address.",
    startingState: "PC-A's cache is empty. PC-A will try to reach 192.168.1.99.",
    task: "Step through the run. Watch which devices receive the broadcast and what each one does with it. Note what is left in the ARP cache at the end.",
    hint: "Compare the Target IP of the request with the IP address of each device.",
    observation: "Every device receives the broadcast and ignores it. No reply comes back, no cache entry is created, and the data is never sent.",
    explanation: "ARP only works if some device on the local network owns the address. A mistyped address, a powered-off device, or a wrong network all look the same from PC-A's side: silence.",
    goTo: "resolve",
    goToLabel: "Open Resolve an Address",
    scenario: "unknown",
    minLevel: "beginner",
  },
  {
    id: "arp-exp-4",
    title: "Experiment 4 — Gateway ARP",
    objective: "Discover whose MAC address PC-A resolves when the destination is on another network.",
    startingState: "PC-A (192.168.1.10/24, gateway 192.168.1.1) sends to 192.168.2.20. The ARP cache is empty.",
    task: "Step through the run and read the Who has … question in the ARP request. Then compare the Ethernet destination MAC with the IP destination in the final frame.",
    hint: "Which address appears after Who has? Is it 192.168.2.20?",
    observation: "PC-A asks Who has 192.168.1.1? The router replies. The final frame has the router's MAC as destination MAC, but the IP packet inside is still addressed to 192.168.2.20.",
    explanation: "ARP resolves the next local-link destination, not the final remote host's MAC address. The remote host's MAC address is never learned by PC-A.",
    goTo: "gateway",
    goToLabel: "Open Local vs Gateway",
    scenario: "gateway",
    minLevel: "beginner",
  },
  {
    id: "arp-exp-5",
    title: "Experiment 5 — Inspect an ARP Message",
    objective: "Read the important fields of an ARP request and an ARP reply and see how they mirror each other.",
    startingState: "ARP Messages tab, showing the request and reply from Experiment 1.",
    task: "Click every field of the request, then of the reply. Which fields swap roles between them? Switch the level to Technical to reveal the extra fields.",
    hint: "Look at the Sender and Target fields side by side. Who is the sender of the reply?",
    observation: "The request asks for a MAC (Target MAC unknown). The reply fills it in: its sender is PC-B, and its target is PC-A.",
    explanation: "A reply is built from the request. Sender and target swap places, and the field that was unknown is now filled in.",
    goTo: "messages",
    goToLabel: "Open ARP Messages",
    scenario: "first",
    minLevel: "beginner",
  },
];

// ---------------------------------------------------------------------------
// Ready-made example messages for the "ARP Messages" tab (Section 14)
// ---------------------------------------------------------------------------

/** The request/reply pair from the default scenario, independent of any run in progress. */
export function exampleExchange(nodes: ArpNode[] = createNodes()): { request: ArpPacket; reply: ArpPacket; requestFrame: EthernetFrame; replyFrame: EthernetFrame } {
  const a = nodeById(nodes, "a")!;
  const b = nodeById(nodes, "b")!;
  const request = buildArpRequest(a, b.ip);
  const reply = buildArpReply(b, a);
  return {
    request,
    reply,
    requestFrame: buildFrame("ex-req", BROADCAST_MAC, a.mac, ETHERTYPE_ARP, `ARP Request: who has ${b.ip}? Tell ${a.ip}`),
    replyFrame: buildFrame("ex-rep", a.mac, b.mac, ETHERTYPE_ARP, `ARP Reply: ${b.ip} is at ${b.mac}`),
  };
}

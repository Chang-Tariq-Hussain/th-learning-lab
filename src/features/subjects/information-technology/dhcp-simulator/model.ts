// ---------------------------------------------------------------------------
// DHCP Simulator — pure model (no React).
//
// Scope: how one IPv4 LAN hands out network configuration automatically. A client with no
// usable address runs DORA (Discover, Offer, Request, ACK) against a DHCP server that owns an
// address pool, keeps a lease table, and can renew, release or run out of addresses.
//
// Out of scope on purpose: DHCP relay agents (clients on another subnet), DHCPv6, DNS itself,
// routing, NAT, real lease timers (clients here renew only when the student asks), and
// multiple competing DHCP servers. The Ethernet/ARP/IP addressing labs are reused for
// constants and helpers; nothing here re-implements them.
// ---------------------------------------------------------------------------

import { BROADCAST_MAC, type LogKind } from "../ethernet-mac-simulator/model";
import { ROUTER_IFACES, maskToPrefix, parseIPv4 } from "../ip-addressing-simulator/model";
import type { DetailLevel } from "../osi-model-explorer/model";

export type { DetailLevel } from "../osi-model-explorer/model";
export { DETAIL_LEVEL_LABELS } from "../osi-model-explorer/model";
export { BROADCAST_MAC };

// ---------------------------------------------------------------------------
// The network
// ---------------------------------------------------------------------------

export const NETWORK_ADDRESS = "192.168.1.0";
export const NETWORK_PREFIX = 24;
export const SUBNET_MASK = "255.255.255.0";
export const NETWORK_BROADCAST = "192.168.1.255";
const BASE = "192.168.1.";

export const UNSPECIFIED_IP = "0.0.0.0";
export const LIMITED_BROADCAST_IP = "255.255.255.255";
export const DHCP_SERVER_PORT = 67;
export const DHCP_CLIENT_PORT = 68;

const ROUTER_IFACE = ROUTER_IFACES[0]!;
/** The default gateway. Reused from the IP Addressing and ARP labs so all three describe one LAN. */
export const ROUTER = { name: "Router", ip: ROUTER_IFACE.ip, mac: ROUTER_IFACE.mac };
/** The DHCP server has a fixed (manually configured) address outside the pool: a server cannot use DHCP to find itself. */
export const SERVER = { name: "DHCP Server", ip: "192.168.1.2", mac: "02:D4:C9:00:00:02" };

export type ClientId = "pc1" | "pc2" | "pc3" | "pc4" | "pc5";
export const CLIENT_IDS: ClientId[] = ["pc1", "pc2", "pc3", "pc4", "pc5"];
export type NodeKey = ClientId | "server" | "router";

/**
 * Every MAC starts with AA (lowest bit of the first octet is 0), so none of them is a group
 * address: the Ethernet & MAC lab teaches that a set bit there means multicast/broadcast.
 */
export const CLIENT_META: Record<ClientId, { name: string; mac: string; index: number }> = {
  pc1: { name: "PC-01", mac: "AA:BB:CC:00:00:01", index: 1 },
  pc2: { name: "PC-02", mac: "AA:BB:CC:00:00:02", index: 2 },
  pc3: { name: "PC-03", mac: "AA:BB:CC:00:00:03", index: 3 },
  pc4: { name: "PC-04", mac: "AA:BB:CC:00:00:04", index: 4 },
  pc5: { name: "PC-05", mac: "AA:BB:CC:00:00:05", index: 5 },
};

export function nodeName(key: NodeKey): string {
  if (key === "server") return SERVER.name;
  if (key === "router") return ROUTER.name;
  return CLIENT_META[key].name;
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

export interface IpConfig {
  ip: string;
  mask: string;
  gateway: string;
  dns: string;
}

export type ConfigMode = "dhcp" | "manual";

export type ClientPhase = "unconfigured" | "discovering" | "selecting" | "requesting" | "bound" | "renewing" | "failed" | "expired" | "manual";

export interface ClientState {
  id: ClientId;
  mode: ConfigMode;
  phase: ClientPhase;
  /** The configuration the client is actually using right now, or null when it has none. */
  config: IpConfig | null;
  /** What the student typed for manual mode (kept when they switch back to DHCP). */
  manual: IpConfig;
  /** Address some operating systems assign themselves when DHCP fails. Not supplied by DHCP. */
  linkLocal: string | null;
}

export type LeaseStatus = "offered" | "leased" | "released" | "expired";

/** One row of the server's lease table. */
export interface Lease {
  ip: string;
  clientId: ClientId;
  status: LeaseStatus;
  startedAt: number;
  durationMin: number;
  expiresAt: number;
}

export interface PoolConfig {
  /** Last octet of the first and last address in the pool (the network is always 192.168.1.0/24). */
  start: number;
  end: number;
  leaseMin: number;
  /** DNS server the server hands out. Empty string means none configured. */
  dns: string;
  gateway: string;
}

export interface LabState {
  pool: PoolConfig;
  clients: Record<ClientId, ClientState>;
  leases: Lease[];
  /** Simulated minutes since the lab started. Only leases care about it. */
  clock: number;
}

export const DEFAULT_POOL: PoolConfig = { start: 100, end: 150, leaseMin: 60, dns: "8.8.8.8", gateway: ROUTER.ip };

export const LEASE_OPTIONS_MIN = [5, 30, 60, 120, 480, 1440];
export const DNS_OPTIONS: { value: string; label: string }[] = [
  { value: "8.8.8.8", label: "8.8.8.8 — Google Public DNS (educational example)" },
  { value: "1.1.1.1", label: "1.1.1.1 — Cloudflare DNS (educational example)" },
  { value: ROUTER.ip, label: `${ROUTER.ip} — the router as a DNS forwarder` },
  { value: "", label: "None configured" },
];
export const GATEWAY_OPTIONS: { value: string; label: string }[] = [
  { value: ROUTER.ip, label: `${ROUTER.ip} — the router (correct)` },
  { value: "192.168.1.254", label: "192.168.1.254 — on this LAN, but no device has it" },
  { value: "192.168.2.1", label: "192.168.2.1 — a different network" },
];

export function ipAt(lastOctet: number): string {
  return `${BASE}${lastOctet}`;
}

export function lastOctet(ip: string): number {
  return Number(ip.split(".")[3] ?? 0);
}

function defaultManual(index: number): IpConfig {
  return { ip: ipAt(20 + index), mask: SUBNET_MASK, gateway: ROUTER.ip, dns: "8.8.8.8" };
}

export function createClients(): Record<ClientId, ClientState> {
  const out = {} as Record<ClientId, ClientState>;
  for (const id of CLIENT_IDS) {
    out[id] = { id, mode: "dhcp", phase: "unconfigured", config: null, manual: defaultManual(CLIENT_META[id].index), linkLocal: null };
  }
  return out;
}

export function initialState(pool: PoolConfig = DEFAULT_POOL): LabState {
  return { pool: { ...pool }, clients: createClients(), leases: [], clock: 0 };
}

export function cloneState(s: LabState): LabState {
  return { pool: { ...s.pool }, clients: Object.fromEntries(CLIENT_IDS.map((id) => [id, { ...s.clients[id], manual: { ...s.clients[id].manual }, config: s.clients[id].config ? { ...s.clients[id].config! } : null }])) as Record<ClientId, ClientState>, leases: s.leases.map((l) => ({ ...l })), clock: s.clock };
}

// ---------------------------------------------------------------------------
// Time and formatting
// ---------------------------------------------------------------------------

export function formatDuration(min: number): string {
  if (min < 60) return `${min} min`;
  if (min < 1440) {
    const h = min / 60;
    return Number.isInteger(h) ? `${h} hour${h === 1 ? "" : "s"}` : `${min} min`;
  }
  const d = min / 1440;
  return Number.isInteger(d) ? `${d} day${d === 1 ? "" : "s"}` : `${min} min`;
}

export function formatClock(totalSeconds: number): string {
  const s = ((totalSeconds % 86400) + 86400) % 86400;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

/** The event log starts at 12:01:01, like the example in the brief. */
export const LOG_START_SECONDS = 12 * 3600 + 60 + 1;

export function dnsLabel(dns: string): string {
  return dns ? dns : "None configured";
}

// ---------------------------------------------------------------------------
// Pool logic
// ---------------------------------------------------------------------------

export function isActive(l: Lease): boolean {
  return l.status === "offered" || l.status === "leased";
}

export function poolAddresses(pool: PoolConfig): string[] {
  const out: string[] = [];
  for (let n = pool.start; n <= pool.end; n++) out.push(ipAt(n));
  return out;
}

export function poolSize(pool: PoolConfig): number {
  return Math.max(0, pool.end - pool.start + 1);
}

export function leaseFor(state: LabState, ip: string): Lease | undefined {
  return state.leases.find((l) => l.ip === ip);
}

export function activeLeaseOf(state: LabState, id: ClientId): Lease | undefined {
  return state.leases.find((l) => l.clientId === id && isActive(l));
}

/** Addresses a manually configured client is using. This lab's server checks for these before offering. */
function staticallyUsed(state: LabState): Set<string> {
  const used = new Set<string>();
  for (const id of CLIENT_IDS) {
    const c = state.clients[id];
    if (c.mode === "manual" && c.config) used.add(c.config.ip);
  }
  return used;
}

export function availableAddresses(state: LabState): string[] {
  const used = staticallyUsed(state);
  return poolAddresses(state.pool).filter((ip) => {
    const l = leaseFor(state, ip);
    return !(l && isActive(l)) && !used.has(ip);
  });
}

export interface PoolStats {
  total: number;
  available: number;
  leased: number;
  offered: number;
}

export function poolStats(state: LabState): PoolStats {
  return {
    total: poolSize(state.pool),
    available: availableAddresses(state).length,
    leased: state.leases.filter((l) => l.status === "leased").length,
    offered: state.leases.filter((l) => l.status === "offered").length,
  };
}

/**
 * Which address the server offers. Simplified on purpose: a returning client gets its previous
 * address back if that is still free (many real servers do), otherwise the lowest free address.
 */
export function pickAddress(state: LabState, id: ClientId): string | null {
  const free = availableAddresses(state);
  if (free.length === 0) return null;
  const previous = state.leases.find((l) => l.clientId === id && !isActive(l));
  if (previous && free.includes(previous.ip)) return previous.ip;
  return free[0]!;
}

export type AddressState = "available" | "offered" | "leased" | "released" | "expired" | "static";

/** State of one pool address for the address map. Released/expired addresses are free but remembered. */
export function addressState(state: LabState, ip: string): AddressState {
  if (staticallyUsed(state).has(ip)) return "static";
  const l = leaseFor(state, ip);
  if (!l) return "available";
  return l.status;
}

export function validatePool(p: PoolConfig): string[] {
  const issues: string[] = [];
  if (!Number.isInteger(p.start) || !Number.isInteger(p.end)) {
    issues.push("The first and last address must be whole numbers between 1 and 254.");
    return issues;
  }
  if (p.start < 1 || p.end > 254) issues.push("Host addresses on 192.168.1.0/24 run from .1 to .254. .0 is the network address and .255 is the broadcast address, so neither can be handed out.");
  if (p.start > p.end) issues.push("The first address must not be higher than the last address.");
  const routerLast = lastOctet(ROUTER.ip);
  const serverLast = lastOctet(SERVER.ip);
  if (p.start <= routerLast && p.end >= routerLast) issues.push(`The range includes ${ROUTER.ip}, which belongs to the router. Handing it out would create a duplicate address.`);
  if (p.start <= serverLast && p.end >= serverLast) issues.push(`The range includes ${SERVER.ip}, which belongs to the DHCP server itself.`);
  return issues;
}

// ---------------------------------------------------------------------------
// Diagnosing a client configuration
// ---------------------------------------------------------------------------

export interface Finding {
  level: "ok" | "warn" | "error";
  text: string;
}

function network(ip: number, mask: number): number {
  return (ip & mask) >>> 0;
}

/**
 * Checks a configuration the way a technician would: is the address usable, is the gateway
 * reachable, is a DNS server present. Used for manual configuration and for leased configs.
 */
export function diagnoseConfig(cfg: IpConfig, state: LabState, selfId: ClientId | null): Finding[] {
  const out: Finding[] = [];
  const ip = parseIPv4(cfg.ip);
  const mask = parseIPv4(cfg.mask);
  const gw = parseIPv4(cfg.gateway);

  if (!ip.ok) {
    out.push({ level: "error", text: `IP address: ${ip.reason}` });
  }
  let prefix: number | null = null;
  if (!mask.ok) {
    out.push({ level: "error", text: `Subnet mask: ${mask.reason}` });
  } else {
    prefix = maskToPrefix(mask.value);
    if (prefix === null) out.push({ level: "error", text: "The subnet mask must be a run of 1 bits followed by 0 bits, like 255.255.255.0." });
    else if (prefix !== NETWORK_PREFIX) out.push({ level: "warn", text: `The rest of this LAN uses ${SUBNET_MASK} (/${NETWORK_PREFIX}). A different mask changes which addresses this device believes are on its own network.` });
  }

  if (ip.ok && mask.ok && prefix !== null) {
    const lan = parseIPv4(NETWORK_ADDRESS);
    const lanNet = lan.ok ? lan.value : 0;
    const net = network(ip.value, mask.value);
    const hostBits = (~mask.value) >>> 0;
    if (prefix === NETWORK_PREFIX && net !== lanNet) {
      out.push({ level: "error", text: `${cfg.ip} is not on this LAN (${NETWORK_ADDRESS}/${NETWORK_PREFIX}). The device could not talk directly to the router or the DHCP server.` });
    } else if (prefix < 31 && (ip.value & hostBits) === 0) {
      out.push({ level: "error", text: `${cfg.ip} is the network address of its subnet. It identifies the network and cannot be given to a device.` });
    } else if (prefix < 31 && (ip.value & hostBits) === hostBits) {
      out.push({ level: "error", text: `${cfg.ip} is the broadcast address of its subnet. It cannot be given to a device.` });
    }

    const owners: { who: string; ip: string }[] = [
      { who: "the router", ip: ROUTER.ip },
      { who: "the DHCP server", ip: SERVER.ip },
    ];
    for (const id of CLIENT_IDS) {
      const other = state.clients[id];
      if (id !== selfId && other.config) owners.push({ who: CLIENT_META[id].name, ip: other.config.ip });
    }
    const clash = owners.find((o) => o.ip === cfg.ip);
    if (clash) out.push({ level: "error", text: `Address conflict: ${clash.who} already uses ${cfg.ip}. Two devices with one IP address cause intermittent, confusing failures.` });

    const lastO = lastOctet(cfg.ip);
    const inPool = net === lanNet && lastO >= state.pool.start && lastO <= state.pool.end;
    const own = selfId ? activeLeaseOf(state, selfId) : undefined;
    if (inPool && !(own && own.ip === cfg.ip)) {
      out.push({ level: "warn", text: `${cfg.ip} is inside the DHCP range (.${state.pool.start}–.${state.pool.end}). The server could hand it to another device later. Static addresses belong outside the pool, or must be excluded from it.` });
    }

    if (!gw.ok) {
      out.push({ level: "error", text: `Default gateway: ${gw.reason}` });
    } else if (network(gw.value, mask.value) !== net) {
      out.push({ level: "error", text: `The default gateway ${cfg.gateway} is not on this device's own network, so the device cannot reach it directly. A gateway must be on the local subnet.` });
    } else if (cfg.gateway === cfg.ip) {
      out.push({ level: "error", text: "The default gateway is the device's own address." });
    } else if (cfg.gateway !== ROUTER.ip) {
      out.push({ level: "error", text: `Nothing on this LAN has the address ${cfg.gateway}. ARP for the gateway would get no reply, so traffic to other networks fails.` });
    } else {
      out.push({ level: "ok", text: `The default gateway ${cfg.gateway} is the router, and it is on the local network.` });
    }
  } else if (!gw.ok && cfg.gateway.trim()) {
    out.push({ level: "error", text: `Default gateway: ${gw.reason}` });
  }

  if (!cfg.dns.trim()) {
    out.push({ level: "warn", text: "No DNS server. The device can reach other IP addresses, but it cannot turn names such as example.com into addresses." });
  } else {
    const dns = parseIPv4(cfg.dns);
    if (!dns.ok) out.push({ level: "error", text: `DNS server: ${dns.reason}` });
    else out.push({ level: "ok", text: `DNS server ${cfg.dns} is set. The client asks that server to resolve names; DHCP only told it the server's address.` });
  }
  if (out.every((f) => f.level === "ok")) out.unshift({ level: "ok", text: "This configuration is consistent." });
  return out;
}

export function hasErrors(findings: Finding[]): boolean {
  return findings.some((f) => f.level === "error");
}

// ---------------------------------------------------------------------------
// Ops: how a step changes the lab
// ---------------------------------------------------------------------------

export type Op =
  | { t: "client"; id: ClientId; patch: Partial<ClientState> }
  | { t: "lease"; lease: Lease }
  | { t: "lease-status"; ip: string; status: LeaseStatus; patch?: Partial<Lease> };

function sortLeases(list: Lease[]): Lease[] {
  return [...list].sort((a, b) => lastOctet(a.ip) - lastOctet(b.ip));
}

export function applyOps(state: LabState, ops: Op[]): LabState {
  let next = state;
  for (const op of ops) {
    if (op.t === "client") {
      next = { ...next, clients: { ...next.clients, [op.id]: { ...next.clients[op.id], ...op.patch } } };
    } else if (op.t === "lease") {
      const keep = next.leases.filter((l) => l.ip !== op.lease.ip && !(l.clientId === op.lease.clientId && !isActive(l)));
      next = { ...next, leases: sortLeases([...keep, op.lease]) };
    } else {
      next = { ...next, leases: next.leases.map((l) => (l.ip === op.ip ? { ...l, ...op.patch, status: op.status } : l)) };
    }
  }
  return next;
}

// ---------------------------------------------------------------------------
// DHCP messages
// ---------------------------------------------------------------------------

export type MsgKind = "discover" | "offer" | "request" | "ack" | "renew" | "release";
export const DORA_KINDS: MsgKind[] = ["discover", "offer", "request", "ack"];

export type FieldId =
  | "type" | "client" | "xid" | "ip" | "server" | "mask" | "gateway" | "dns" | "lease"
  | "transport" | "ipHeader" | "ethernet" | "paramList"
  | "timers" | "op" | "hwType" | "hops" | "flags" | "ciaddr" | "yiaddr" | "siaddr" | "giaddr" | "chaddr" | "cookie" | "options";

export interface MsgField {
  id: FieldId;
  label: string;
  value: string;
  level: DetailLevel;
  explain: string;
  technical?: string;
}

export interface DhcpMessage {
  kind: MsgKind;
  typeName: string;
  clientId: ClientId;
  xid: string;
  fields: MsgField[];
}

export interface MessageInfo {
  label: string;
  typeName: string;
  optionValue: number;
  who: string;
  beginner: string;
  intermediate: string;
  technical: string;
}

export const MESSAGE_INFO: Record<MsgKind, MessageInfo> = {
  discover: {
    label: "DHCP Discover",
    typeName: "DHCPDISCOVER",
    optionValue: 1,
    who: "Client → everyone (broadcast)",
    beginner: "A device with no address shouts to the whole network: \"Is there a DHCP server here? I need network settings!\" It goes to everyone because the device does not know who the server is.",
    intermediate: "Sent from 0.0.0.0 (UDP port 68) to 255.255.255.255 (UDP port 67). It carries the client's MAC address and a transaction ID, and can list the settings the client would like (subnet mask, router, DNS).",
    technical: "Ethernet destination FF:FF:FF:FF:FF:FF, IPv4 0.0.0.0 → 255.255.255.255, UDP 68 → 67. BOOTP-format message: op = 1 (BOOTREQUEST), htype = 1, hlen = 6, xid, flags, chaddr, magic cookie 0x63825363, then options: 53 = 1, 55 = parameter request list, 255 = end. Every host on the broadcast domain receives it; only DHCP servers act on it. A relay agent would forward it to a server on another subnet, which this lab does not simulate.",
  },
  offer: {
    label: "DHCP Offer",
    typeName: "DHCPOFFER",
    optionValue: 2,
    who: "Server → client",
    beginner: "The DHCP server answers: \"I can give you this address, with these settings, for this long.\" It is only a proposal. Nothing is final yet.",
    intermediate: "Sent from the server's own address (UDP port 67, to port 68). It carries the offered address (yiaddr), the server identifier, and the settings: mask, router, DNS and lease time. The server sets this address aside for a short time.",
    technical: "op = 2 (BOOTREPLY), same xid as the Discover, yiaddr = offered address, chaddr = client MAC, options: 53 = 2, 54 = server identifier, 51 = lease time, 1 = subnet mask, 3 = router, 6 = DNS. The server may broadcast the Offer or unicast it to the client's MAC and offered address; that depends on the client's BROADCAST flag and on the implementation. The client matches it by xid and chaddr because it has no IP address yet.",
  },
  request: {
    label: "DHCP Request",
    typeName: "DHCPREQUEST",
    optionValue: 3,
    who: "Client → everyone (broadcast)",
    beginner: "The client says: \"Yes, I accept the offer from that server. I would like that address.\" This is a DHCP message asking a server for settings. It is not an ARP request.",
    intermediate: "Still sent from 0.0.0.0 to 255.255.255.255, because the client has no address until the ACK. It names the server it chose (server identifier) and the address it wants (requested IP). Being a broadcast, it also tells any other server that its offer was not chosen.",
    technical: "op = 1, same xid, options: 53 = 3, 50 = requested IP address, 54 = server identifier, 55 = parameter request list. Option 54 is what marks this as a response to one particular Offer. A DHCPREQUEST is also used later, unicast, to renew a lease, but then it carries the client's current address in ciaddr instead of option 50.",
  },
  ack: {
    label: "DHCP ACK",
    typeName: "DHCPACK",
    optionValue: 5,
    who: "Server → client",
    beginner: "The server confirms: \"It's yours.\" The client now has its address, subnet mask, default gateway and DNS server, for the length of the lease.",
    intermediate: "Sent from the server (UDP 67 → 68) with the final configuration. The server records the lease. When the client has processed the ACK it can start using the address.",
    technical: "op = 2, yiaddr = assigned address, options: 53 = 5, 54, 51 = lease time, 58 = renewal time T1 (default 50% of the lease), 59 = rebinding time T2 (default 87.5%), 1, 3, 6. Many clients then probe the address with ARP to detect a conflict; if another device answers, the client sends DHCPDECLINE (type 4) and starts over.",
  },
  renew: {
    label: "DHCP Request (renew)",
    typeName: "DHCPREQUEST",
    optionValue: 3,
    who: "Client → server (unicast)",
    beginner: "Halfway through its lease, the client asks the same server: \"May I keep this address for longer?\" It already has an address, so it can talk to the server directly.",
    intermediate: "A unicast DHCPREQUEST from the client's current address to the server. If the server agrees, it answers with an ACK and the lease timer starts again.",
    technical: "At T1 (50% of the lease by default) the client unicasts DHCPREQUEST with ciaddr set to its address and no options 50/54. If that gets no answer, at T2 (87.5%) it broadcasts to any server (the REBINDING state). If the lease runs out, the client must stop using the address and start again with Discover.",
  },
  release: {
    label: "DHCP Release",
    typeName: "DHCPRELEASE",
    optionValue: 7,
    who: "Client → server (unicast)",
    beginner: "The client tells the server: \"I am done with this address, you can give it to someone else.\" This happens, for example, when a device shuts down cleanly or leaves the network.",
    intermediate: "A unicast message from the client to the server. The server does not reply. It marks the address as free again and the client stops using it.",
    technical: "DHCPRELEASE (type 7) is unicast to the server identified in option 54, with ciaddr set to the address being released. There is no acknowledgement, and it is only a courtesy: if a client vanishes without releasing, the server reclaims the address when the lease expires.",
  },
};

export function makeXid(seq: number): string {
  const v = (0x3903f326 + seq * 7919) >>> 0;
  return `0x${v.toString(16).toUpperCase().padStart(8, "0")}`;
}

export interface MessageContext {
  kind: MsgKind;
  clientId: ClientId;
  xid: string;
  ip: string | null;
  pool: PoolConfig;
}

export function buildMessage(ctx: MessageContext): DhcpMessage {
  const { kind, clientId, xid, pool } = ctx;
  const cl = CLIENT_META[clientId];
  const info = MESSAGE_INFO[kind];
  const ip = ctx.ip ?? "";
  const isReply = kind === "offer" || kind === "ack";
  const configured = kind === "renew" || kind === "release";
  const serverText = `${SERVER.name} (${SERVER.ip})`;

  const ipLabel: Record<MsgKind, string> = {
    discover: "Requested IP",
    offer: "Offered IP",
    request: "Requested IP",
    ack: "Assigned IP",
    renew: "Client IP (in use)",
    release: "Client IP (being released)",
  };
  const ipValue: Record<MsgKind, string> = {
    discover: "— none yet",
    offer: ip,
    request: ip,
    ack: ip,
    renew: ip,
    release: ip,
  };
  const ipExplain: Record<MsgKind, string> = {
    discover: "The client has no address to ask for. Some clients hint at an address they used before, but this lab's client does not.",
    offer: "The address the server proposes, taken from its pool.",
    request: "The address from the Offer that the client now asks for.",
    ack: "The address the client may now use.",
    renew: "The address the client already has and wants to keep.",
    release: "The address the client no longer needs.",
  };
  const serverValue: Record<MsgKind, string> = {
    discover: "Unknown, which is why it is broadcast",
    offer: serverText,
    request: `Chosen: ${serverText}`,
    ack: serverText,
    renew: serverText,
    release: serverText,
  };
  const serverExplain: Record<MsgKind, string> = {
    discover: "The client does not know any server yet, so it asks everyone on the LAN.",
    offer: "The DHCP server that made the offer. It identifies itself with its own IP address.",
    request: "The client names the server whose offer it accepts, so other servers know theirs was not chosen.",
    ack: "The server that confirms the lease.",
    renew: "The server that granted the lease. Now that the client knows it, it can talk to it directly.",
    release: "The server that granted the lease.",
  };
  const notIncluded = configured ? "— already configured" : kind === "discover" ? "— not sent (the client asks for it)" : "— not in this message";
  const val = (v: string) => (isReply ? v : notIncluded);

  const transport = isReply ? `UDP ${DHCP_SERVER_PORT} → ${DHCP_CLIENT_PORT}` : `UDP ${DHCP_CLIENT_PORT} → ${DHCP_SERVER_PORT}`;
  const ipHeader = isReply ? `${SERVER.ip} → ${LIMITED_BROADCAST_IP} (broadcast) or unicast to ${ip}` : configured ? `${ip} → ${SERVER.ip}` : `${UNSPECIFIED_IP} → ${LIMITED_BROADCAST_IP}`;
  const ethernet = isReply ? `${cl.mac} (unicast), or ${BROADCAST_MAC} if the client asked for a broadcast reply` : configured ? `${SERVER.mac} (unicast)` : `${BROADCAST_MAC} (broadcast)`;
  const wantsParams = kind === "discover" || kind === "request";

  const optionList: Record<MsgKind, string> = {
    discover: "53 = 1 (Discover), 55 = parameter request list, 255 = end",
    offer: "53 = 2 (Offer), 54 = server, 51 = lease, 1 = mask, 3 = router, 6 = DNS, 255 = end",
    request: "53 = 3 (Request), 50 = requested IP, 54 = server, 55 = parameter request list, 255 = end",
    ack: "53 = 5 (ACK), 54 = server, 51 = lease, 58 = T1, 59 = T2, 1 = mask, 3 = router, 6 = DNS, 255 = end",
    renew: "53 = 3 (Request), 55 = parameter request list, 255 = end",
    release: "53 = 7 (Release), 54 = server, 255 = end",
  };

  const fields: MsgField[] = [
    { id: "type", label: "Message type", value: info.typeName, level: "beginner", explain: `Which DHCP message this is: ${info.label}.`, technical: `Carried in option 53 with the value ${info.optionValue}. Values: 1 Discover, 2 Offer, 3 Request, 4 Decline, 5 ACK, 6 NAK, 7 Release, 8 Inform.` },
    { id: "client", label: "Client", value: `${cl.name} (${cl.mac})`, level: "beginner", explain: "The device asking for configuration. The server recognises it by its MAC address, because the client may not have an IP address yet.", technical: "The MAC address travels in the chaddr (client hardware address) field of the DHCP message. Some clients also send a client identifier (option 61)." },
    { id: "xid", label: "Transaction ID", value: xid, level: "beginner", explain: "A random number the client picks for this exchange. Every reply repeats it, so the client can match replies to its own request. It cannot rely on an IP address yet.", technical: "A 32-bit field (xid). All messages of one DORA exchange reuse the same value." },
    { id: "ip", label: ipLabel[kind], value: ipValue[kind], level: "beginner", explain: ipExplain[kind], technical: kind === "offer" || kind === "ack" ? "Sent in the yiaddr (\"your address\") field." : kind === "request" ? "Sent in option 50 (requested IP address)." : kind === "discover" ? "A client may include option 50 to hint at a previous address." : "Sent in the ciaddr (client address) field." },
    { id: "server", label: "Server", value: serverValue[kind], level: "beginner", explain: serverExplain[kind], technical: "Identified by option 54 (server identifier), which is normally the server's own IP address." },
    { id: "mask", label: "Subnet mask", value: val(SUBNET_MASK), level: "beginner", explain: "Tells the client which part of its address is the network part. 255.255.255.0 means the first three numbers.", technical: "Option 1. A mask of 255.255.255.0 is the same as prefix /24." },
    { id: "gateway", label: "Default gateway", value: val(pool.gateway), level: "beginner", explain: "The router the client uses to reach other networks.", technical: "Option 3 (router). A list of addresses is allowed; clients normally use the first one." },
    { id: "dns", label: "DNS server", value: val(dnsLabel(pool.dns)), level: "beginner", explain: "The address of a DNS server. DHCP only tells the client where it is. It does not resolve names itself.", technical: "Option 6 (domain name server). Name resolution is a separate protocol, DNS." },
    { id: "lease", label: "Lease duration", value: val(formatDuration(pool.leaseMin)), level: "beginner", explain: "How long the client may keep the address before it has to renew it. A lease is temporary.", technical: "Option 51, in seconds (here " + pool.leaseMin * 60 + ")." },
    { id: "transport", label: "UDP ports", value: transport, level: "intermediate", explain: "DHCP runs over UDP. Servers listen on port 67 and clients use port 68.", technical: "The client port 68 is fixed so that a client without an address can receive the reply." },
    { id: "ipHeader", label: "IP source → destination", value: ipHeader, level: "intermediate", explain: isReply ? "The server replies from its own address. Depending on the client and the server, the reply is broadcast or unicast to the client." : configured ? "The client already has an address, so this message is a normal unicast." : "A client with no address uses 0.0.0.0 as its source and sends to the limited broadcast address 255.255.255.255.", technical: isReply ? "The client's BROADCAST flag asks for a broadcast reply for clients that cannot accept a unicast before they are configured." : "255.255.255.255 is never forwarded by a router, so a Discover stays on the local network unless a relay agent forwards it." },
    { id: "ethernet", label: "Ethernet destination", value: ethernet, level: "intermediate", explain: "The MAC address the frame is delivered to. Broadcast FF:FF:FF:FF:FF:FF reaches every device on the LAN. This has nothing to do with ARP: DHCP just needs some way to get delivered.", technical: "The switch floods a broadcast frame out of every port except the one it came in on." },
    { id: "paramList", label: "Parameter request list", value: wantsParams ? "1 subnet mask, 3 router, 6 DNS server" : "— not in this message", level: "intermediate", explain: "The list of settings the client would like the server to send.", technical: "Option 55: a list of option codes. The server is not obliged to send all of them." },
    { id: "timers", label: "Renewal timers (T1 / T2)", value: kind === "ack" ? `T1 ${formatDuration(pool.leaseMin / 2)}, T2 ${formatDuration(Math.round(pool.leaseMin * 0.875))}` : "— not in this message", level: "technical", explain: "When the client should start renewing (T1) and when it should look for any server (T2).", technical: "Options 58 and 59. If omitted, the client uses 50% and 87.5% of the lease time." },
    { id: "op", label: "Operation (op)", value: isReply ? "2 (BOOTREPLY)" : "1 (BOOTREQUEST)", level: "technical", explain: "Whether this message comes from a client or from a server.", technical: "DHCP reuses the older BOOTP message format, so this field is called op." },
    { id: "hwType", label: "Hardware type / length", value: "1 (Ethernet) / 6", level: "technical", explain: "The kind of link-layer address in chaddr: 1 means Ethernet, and a MAC address is 6 bytes.", technical: "htype = 1, hlen = 6." },
    { id: "hops", label: "Hops", value: "0 (no relay agent)", level: "technical", explain: "Counts relay agents the message has passed through.", technical: "This lab has no relay agent, so it stays 0 and giaddr is 0.0.0.0." },
    { id: "flags", label: "Flags", value: "0x0000 (unicast reply allowed)", level: "technical", explain: "Bit 15 is the BROADCAST flag.", technical: "A client that cannot receive a unicast before it is configured sets 0x8000, and the server then broadcasts its reply. This lab's client leaves it clear." },
    { id: "ciaddr", label: "ciaddr", value: configured ? ip : UNSPECIFIED_IP, level: "technical", explain: "The client's current address, filled in only when it already has one (renew, release).", technical: "0.0.0.0 during the initial DORA exchange." },
    { id: "yiaddr", label: "yiaddr", value: isReply ? ip : UNSPECIFIED_IP, level: "technical", explain: "\"Your address\": the address the server gives the client.", technical: "Set in the Offer and the ACK." },
    { id: "siaddr", label: "siaddr", value: UNSPECIFIED_IP, level: "technical", explain: "The next server to use in a network boot. Not used here.", technical: "Usually 0.0.0.0 on an ordinary LAN." },
    { id: "giaddr", label: "giaddr", value: `${UNSPECIFIED_IP} (no relay)`, level: "technical", explain: "The relay agent's address, if a relay forwarded the message.", technical: "A relay agent lets one DHCP server serve clients on other subnets. Not simulated here." },
    { id: "chaddr", label: "chaddr", value: cl.mac, level: "technical", explain: "The client's hardware (MAC) address.", technical: "16 bytes are reserved; an Ethernet MAC uses the first 6." },
    { id: "cookie", label: "Magic cookie", value: "0x63825363", level: "technical", explain: "A fixed value that marks the start of the DHCP options.", technical: "Bytes 99, 130, 83, 99." },
    { id: "options", label: "Options", value: optionList[kind], level: "technical", explain: "The variable-length list of settings and message details.", technical: "Each option is a code, a length and a value; 255 marks the end." },
  ];
  return { kind, typeName: info.typeName, clientId, xid, fields };
}

const LEVEL_ORDER: DetailLevel[] = ["beginner", "intermediate", "technical"];
export function fieldVisible(field: MsgField, level: DetailLevel): boolean {
  return LEVEL_ORDER.indexOf(field.level) <= LEVEL_ORDER.indexOf(level);
}

// ---------------------------------------------------------------------------
// Runs: DORA, renew, release, and batches of them
// ---------------------------------------------------------------------------

export type NoteTone = "neutral" | "sky" | "amber" | "emerald" | "red" | "violet";
export interface NodeNote {
  text: string;
  tone: NoteTone;
}

export interface Token {
  kind: MsgKind;
  label: string;
  from: NodeKey;
  /** "all" means a broadcast that every other device on the LAN receives. */
  to: NodeKey | "all";
}

export type Stage = "discover" | "offer" | "request" | "ack" | "none" | "failed" | "renew" | "release";

export interface StepLog {
  kind: LogKind;
  text: string;
  detail?: string;
}

export interface RunStep {
  title: string;
  stage: Stage;
  clientId: ClientId;
  /** The four things the brief asks every step to explain. */
  what: string;
  who: string;
  why: string;
  changed: string;
  /** Extra detail shown at the Technical level. */
  technical?: string;
  /** A "not to be confused with" callout (DHCP Request ≠ ARP Request). */
  contrast?: string;
  token: Token | null;
  message: DhcpMessage | null;
  notes: Partial<Record<NodeKey, NodeNote>>;
  ops: Op[];
  log: StepLog[];
  tone: "normal" | "success" | "failure";
}

export type RunKind = "dora" | "renew" | "release" | "batch";

export interface RunResult {
  clientId: ClientId;
  ok: boolean;
  ip: string | null;
  kind: "dora" | "renew" | "release";
}

export interface Run {
  id: number;
  kind: RunKind;
  clientIds: ClientId[];
  steps: RunStep[];
  results: RunResult[];
  /** The lab as it was before the first step. Every step's effects are applied on top of it. */
  base: LabState;
  /** Message of each step that has one, in order. */
  messages: DhcpMessage[];
}

export function stateAfterStep(run: Run, index: number): LabState {
  let s = run.base;
  for (let i = 0; i <= index && i < run.steps.length; i++) s = applyOps(s, run.steps[i]!.ops);
  return s;
}

export function finalState(run: Run): LabState {
  return stateAfterStep(run, run.steps.length - 1);
}

function ignoredNotes(from: ClientId, receivers: NodeKey[]): Partial<Record<NodeKey, NodeNote>> {
  const out: Partial<Record<NodeKey, NodeNote>> = {};
  for (const r of receivers) if (r !== from && r !== "server") out[r] = { text: "Ignores it", tone: "neutral" };
  return out;
}

const ALL_NODES: NodeKey[] = ["server", "router", ...CLIENT_IDS];

function linkLocalFor(id: ClientId): string {
  const n = CLIENT_META[id].index;
  return `169.254.${10 + n * 7}.${40 + n * 11}`;
}

export function configFor(state: LabState, ip: string): IpConfig {
  return { ip, mask: SUBNET_MASK, gateway: state.pool.gateway, dns: state.pool.dns };
}

const ARP_CONTRAST =
  "DHCP Request ≠ ARP Request. A DHCP Request asks a DHCP server to give the client an address and settings (UDP, port 67). An ARP request asks the whole LAN \"who has this IP address?\" so that the sender can learn a MAC address. They are different protocols that solve different problems.";

/** The four DORA steps for one client, or three steps ending in "no offer" if the pool is empty. */
export function buildDora(state: LabState, clientId: ClientId, seq: number): { steps: RunStep[]; result: RunResult } {
  const name = CLIENT_META[clientId].name;
  const xid = makeXid(seq);
  const ip = pickAddress(state, clientId);
  const pool = state.pool;
  const size = poolSize(pool);
  const range = `${ipAt(pool.start)} – ${ipAt(pool.end)}`;

  const discover: RunStep = {
    title: `DISCOVER: ${name} looks for a DHCP server`,
    stage: "discover",
    clientId,
    what: `${name} has no usable IP configuration, so it broadcasts a DHCP Discover to the whole local network.`,
    who: `${name}, the DHCP client. It sends from ${UNSPECIFIED_IP} port ${DHCP_CLIENT_PORT} to ${LIMITED_BROADCAST_IP} port ${DHCP_SERVER_PORT} (UDP).`,
    why: "The client has no address, does not know its network, and does not know where a DHCP server is. A broadcast reaches every device, so any DHCP server on the LAN can answer.",
    changed: `Nothing is configured yet. ${name} is now waiting for an Offer.`,
    technical: `The Ethernet destination is ${BROADCAST_MAC}, so the switch floods the frame. The router and the other PCs receive it too, but they are not DHCP servers and ignore it.`,
    token: { kind: "discover", label: "DISCOVER", from: clientId, to: "all" },
    message: buildMessage({ kind: "discover", clientId, xid, ip: null, pool }),
    notes: { server: { text: "Receives it", tone: "emerald" }, router: { text: "Ignores it", tone: "neutral" }, ...ignoredNotes(clientId, CLIENT_IDS) },
    ops: [{ t: "client", id: clientId, patch: { phase: "discovering", config: null, linkLocal: null } }],
    log: [{ kind: "flood", text: `${name} → DHCP Discover`, detail: `broadcast · UDP ${DHCP_CLIENT_PORT} → ${DHCP_SERVER_PORT} · ${xid}` }],
    tone: "normal",
  };

  if (!ip) {
    const noOffer: RunStep = {
      title: "NO OFFER: the address pool is empty",
      stage: "failed",
      clientId,
      what: `The server receives the Discover, looks at its pool and finds no free address, so it sends no Offer.`,
      who: `${SERVER.name} (${SERVER.ip}).`,
      why: `A DHCP server can only hand out addresses from the range it was configured with. Here that range is ${range}: ${size} address${size === 1 ? "" : "es"}, and every one is leased or reserved. The server cannot invent another address.`,
      changed: `Nothing changes. ${name} receives no reply.`,
      technical: "A server does not send a NAK here: DHCPNAK rejects a Request. With an empty pool the server usually just stays silent (and may log the problem). The client keeps retrying with growing delays.",
      token: null,
      message: null,
      notes: { server: { text: "Pool is full", tone: "red" }, [clientId]: { text: "No reply", tone: "red" } },
      ops: [],
      log: [{ kind: "discard", text: `${SERVER.name}: no free address, no Offer sent`, detail: `pool ${range} has 0 available` }],
      tone: "failure",
    };
    const fallback = linkLocalFor(clientId);
    const gaveUp: RunStep = {
      title: `${name} is left without an address`,
      stage: "failed",
      clientId,
      what: `${name} waits, then retries its Discover. With nobody answering, it has no IP configuration.`,
      who: `${name}, the client.`,
      why: `Without an Offer there is nothing to Request. Some operating systems then give themselves a link-local address such as ${fallback} (APIPA, 169.254.0.0/16). That address is not from DHCP, it has no default gateway, and it only works with other devices on the same link.`,
      changed: `${name} has no DHCP configuration. (Shown here with a link-local fallback address.)`,
      technical: "The self-assigned address comes from 169.254.0.0/16 (IPv4 link-local, RFC 3927). A client that later finds a DHCP server replaces it with a proper lease.",
      token: null,
      message: null,
      notes: { [clientId]: { text: "No address", tone: "red" } },
      ops: [{ t: "client", id: clientId, patch: { phase: "failed", config: null, linkLocal: fallback } }],
      log: [{ kind: "discard", text: `${name}: DHCP failed, no address received`, detail: `link-local fallback: ${fallback}` }],
      tone: "failure",
    };
    return { steps: [discover, noOffer, gaveUp], result: { clientId, ok: false, ip: null, kind: "dora" } };
  }

  const cfg = configFor(state, ip);
  const lease: Lease = { ip, clientId, status: "offered", startedAt: state.clock, durationMin: pool.leaseMin, expiresAt: state.clock + pool.leaseMin };
  const offer: RunStep = {
    title: `OFFER: the server proposes ${ip}`,
    stage: "offer",
    clientId,
    what: `The DHCP server picks a free address from its pool and offers ${name} a complete configuration: ${ip}, mask ${cfg.mask}, gateway ${cfg.gateway}, DNS ${dnsLabel(cfg.dns)}, lease ${formatDuration(pool.leaseMin)}.`,
    who: `${SERVER.name} (${SERVER.ip}), from port ${DHCP_SERVER_PORT} to port ${DHCP_CLIENT_PORT} (UDP).`,
    why: `The server owns the pool and knows which addresses are free. It sets ${ip} aside for a short time so that it will not offer the same address to another client in the meantime.`,
    changed: `${ip} is now marked Offered in the lease table. ${name} still has no usable address: an Offer is only a proposal.`,
    technical: "The Offer may be a broadcast or a unicast to the client's MAC address and the offered IP; that depends on the client's BROADCAST flag and on the implementation. This lab draws it going to the client only. The client recognises it by the transaction ID and its own MAC address.",
    token: { kind: "offer", label: "OFFER", from: "server", to: clientId },
    message: buildMessage({ kind: "offer", clientId, xid, ip, pool }),
    notes: { server: { text: `Offers .${lastOctet(ip)}`, tone: "sky" }, [clientId]: { text: "Got offer", tone: "sky" } },
    ops: [
      { t: "lease", lease },
      { t: "client", id: clientId, patch: { phase: "selecting" } },
    ],
    log: [{ kind: "frame", text: `${SERVER.name} → DHCP Offer`, detail: `offers ${ip} to ${name} · lease ${formatDuration(pool.leaseMin)}` }],
    tone: "normal",
  };
  const request: RunStep = {
    title: `REQUEST: ${name} accepts the offer`,
    stage: "request",
    clientId,
    what: `${name} answers: "I would like ${ip} from the server ${SERVER.ip}." It is still a broadcast.`,
    who: `${name}. It still sends from ${UNSPECIFIED_IP}, because it does not own the address until the server confirms.`,
    why: `The Offer was only a proposal. The Request names the chosen server and the address. Because it is broadcast, any other DHCP server that made an offer learns that its offer was not chosen and can free that address.`,
    changed: `${name} moves to Requesting. The lease table still shows ${ip} as Offered.`,
    technical: "Option 54 (server identifier) marks this as an answer to one particular Offer, and option 50 carries the requested address.",
    contrast: ARP_CONTRAST,
    token: { kind: "request", label: "REQUEST", from: clientId, to: "all" },
    message: buildMessage({ kind: "request", clientId, xid, ip, pool }),
    notes: { server: { text: "Chosen server", tone: "emerald" }, router: { text: "Ignores it", tone: "neutral" }, ...ignoredNotes(clientId, CLIENT_IDS) },
    ops: [{ t: "client", id: clientId, patch: { phase: "requesting" } }],
    log: [{ kind: "flood", text: `${name} → DHCP Request`, detail: `requests ${ip} from ${SERVER.ip} · broadcast · ${xid}` }],
    tone: "normal",
  };
  const ack: RunStep = {
    title: `ACKNOWLEDGE: ${name} is configured`,
    stage: "ack",
    clientId,
    what: `The server confirms the lease and sends the final configuration. ${name} applies it.`,
    who: `${SERVER.name} (${SERVER.ip}), port ${DHCP_SERVER_PORT} to port ${DHCP_CLIENT_PORT}.`,
    why: `The server has checked that ${ip} is still free and records the lease. The ACK is what makes the configuration official. Until it arrives, the client must not use the address.`,
    changed: `${ip} changes from Offered to Leased for ${formatDuration(pool.leaseMin)}. ${name} now uses IP ${cfg.ip}, mask ${cfg.mask}, gateway ${cfg.gateway}, DNS ${dnsLabel(cfg.dns)}. DHCP configuration complete.`,
    technical: "Many clients now probe the new address with ARP to check that nobody else is using it. If someone answers, the client sends DHCPDECLINE and starts over. See the DHCP + ARP tab.",
    token: { kind: "ack", label: "ACK", from: "server", to: clientId },
    message: buildMessage({ kind: "ack", clientId, xid, ip, pool }),
    notes: { server: { text: "Lease recorded", tone: "emerald" }, [clientId]: { text: "Configured ✓", tone: "emerald" } },
    ops: [
      { t: "lease-status", ip, status: "leased" },
      { t: "client", id: clientId, patch: { phase: "bound", config: cfg, linkLocal: null } },
    ],
    log: [
      { kind: "frame", text: `${SERVER.name} → DHCP ACK`, detail: `lease ${ip} to ${name} for ${formatDuration(pool.leaseMin)}` },
      { kind: "learn", text: `${name} configured: ${ip}`, detail: `mask ${cfg.mask} · gateway ${cfg.gateway} · DNS ${dnsLabel(cfg.dns)}` },
    ],
    tone: "success",
  };
  return { steps: [discover, offer, request, ack], result: { clientId, ok: true, ip, kind: "dora" } };
}

/** Renewal: the client asks the server to extend the lease it already holds. */
export function buildRenew(state: LabState, clientId: ClientId, seq: number): { steps: RunStep[]; result: RunResult } | null {
  const lease = activeLeaseOf(state, clientId);
  const client = state.clients[clientId];
  if (!lease || lease.status !== "leased" || !client.config) return null;
  const name = CLIENT_META[clientId].name;
  const xid = makeXid(seq);
  const pool = state.pool;
  const cfg = configFor(state, lease.ip);
  const changedConfig = client.config.gateway !== cfg.gateway || client.config.dns !== cfg.dns;

  const req: RunStep = {
    title: `RENEW: ${name} asks to keep ${lease.ip}`,
    stage: "renew",
    clientId,
    what: `${name} sends a DHCP Request straight to the server it got the lease from, asking to keep ${lease.ip}.`,
    who: `${name}, from its own address ${lease.ip} to ${SERVER.ip} (unicast).`,
    why: "Leases are temporary. Real clients start renewing when about half of the lease has passed. Now that the client has an address and knows the server, it does not need to broadcast.",
    changed: `Nothing yet. ${name} is in the Renewing state.`,
    technical: "At T1 (50% of the lease by default) the client unicasts DHCPREQUEST. If the server does not answer, at T2 (87.5%) the client broadcasts to any server.",
    token: { kind: "renew", label: "RENEW", from: clientId, to: "server" },
    message: buildMessage({ kind: "renew", clientId, xid, ip: lease.ip, pool }),
    notes: { server: { text: "Receives it", tone: "emerald" }, [clientId]: { text: "Renewing", tone: "violet" } },
    ops: [{ t: "client", id: clientId, patch: { phase: "renewing" } }],
    log: [{ kind: "frame", text: `${name} → DHCP Request (renew)`, detail: `unicast to ${SERVER.ip} · keeps ${lease.ip}` }],
    tone: "normal",
  };
  const ack: RunStep = {
    title: `ACKNOWLEDGE: the lease is extended`,
    stage: "ack",
    clientId,
    what: `The server agrees and sends a DHCP ACK. The lease timer starts again with the server's current lease time (${formatDuration(pool.leaseMin)}).`,
    who: `${SERVER.name} (${SERVER.ip}) to ${name}.`,
    why: "The client is still a valid holder of the address, so the server extends the lease instead of giving the address to someone else.",
    changed: `${lease.ip} stays Leased to ${name}, with ${formatDuration(pool.leaseMin)} remaining.${changedConfig ? ` The ACK also carried the server's current settings, so ${name}'s gateway and DNS were updated.` : ""}`,
    technical: "A renewal ACK can carry changed options. That is how a change on the server (for example a new gateway) reaches clients that already have a lease.",
    token: { kind: "ack", label: "ACK", from: "server", to: clientId },
    message: buildMessage({ kind: "ack", clientId, xid, ip: lease.ip, pool }),
    notes: { server: { text: "Lease extended", tone: "emerald" }, [clientId]: { text: "Renewed ✓", tone: "emerald" } },
    ops: [
      { t: "lease-status", ip: lease.ip, status: "leased", patch: { startedAt: state.clock, durationMin: pool.leaseMin, expiresAt: state.clock + pool.leaseMin } },
      { t: "client", id: clientId, patch: { phase: "bound", config: cfg } },
    ],
    log: [
      { kind: "frame", text: `${SERVER.name} → DHCP ACK (renew)`, detail: `${lease.ip} extended by ${formatDuration(pool.leaseMin)}` },
      { kind: "learn", text: `${name}: lease renewed for ${lease.ip}` },
    ],
    tone: "success",
  };
  return { steps: [req, ack], result: { clientId, ok: true, ip: lease.ip, kind: "renew" } };
}

/** Release: the client gives its address back and stops using it. */
export function buildRelease(state: LabState, clientId: ClientId, seq: number): { steps: RunStep[]; result: RunResult } | null {
  const lease = activeLeaseOf(state, clientId);
  const client = state.clients[clientId];
  if (!lease || lease.status !== "leased" || !client.config) return null;
  const name = CLIENT_META[clientId].name;
  const xid = makeXid(seq);
  const pool = state.pool;

  const rel: RunStep = {
    title: `RELEASE: ${name} gives ${lease.ip} back`,
    stage: "release",
    clientId,
    what: `${name} sends a DHCP Release to the server and stops using ${lease.ip}.`,
    who: `${name}, unicast from ${lease.ip} to ${SERVER.ip}.`,
    why: "The client no longer needs the address, for example because it is shutting down or leaving the network. Releasing lets the server reuse the address straight away instead of waiting for the lease to run out.",
    changed: `${name} drops its configuration: IP Unconfigured, no mask, gateway or DNS.`,
    technical: "DHCPRELEASE is only a courtesy. The server does not reply, and a client that disappears without releasing simply keeps the address reserved until its lease expires.",
    token: { kind: "release", label: "RELEASE", from: clientId, to: "server" },
    message: buildMessage({ kind: "release", clientId, xid, ip: lease.ip, pool }),
    notes: { server: { text: "Receives it", tone: "emerald" }, [clientId]: { text: "Released", tone: "amber" } },
    ops: [{ t: "client", id: clientId, patch: { phase: "unconfigured", config: null, linkLocal: null } }],
    log: [{ kind: "frame", text: `${name} → DHCP Release`, detail: `gives back ${lease.ip}` }],
    tone: "normal",
  };
  const free: RunStep = {
    title: `The server frees ${lease.ip}`,
    stage: "none",
    clientId,
    what: `The server marks the lease as Released. ${lease.ip} is available again.`,
    who: `${SERVER.name} (${SERVER.ip}). It sends no reply to a Release.`,
    why: "The address is back in the pool, so the next client that sends a Discover can be offered it.",
    changed: `${lease.ip} changes from Leased to Released, and counts as Available again.`,
    token: null,
    message: null,
    notes: { server: { text: `.${lastOctet(lease.ip)} is free`, tone: "emerald" } },
    ops: [{ t: "lease-status", ip: lease.ip, status: "released" }],
    log: [{ kind: "switch", text: `${SERVER.name}: ${lease.ip} released and available again` }],
    tone: "success",
  };
  return { steps: [rel, free], result: { clientId, ok: true, ip: lease.ip, kind: "release" } };
}

export function canRunDora(state: LabState, id: ClientId): boolean {
  const c = state.clients[id];
  return c.mode === "dhcp" && c.phase !== "bound" && c.phase !== "renewing";
}

export function assembleRun(id: number, kind: RunKind, base: LabState, parts: { steps: RunStep[]; result: RunResult }[]): Run {
  const steps = parts.flatMap((p) => p.steps);
  return {
    id,
    kind,
    clientIds: parts.map((p) => p.result.clientId),
    steps,
    results: parts.map((p) => p.result),
    base,
    messages: steps.filter((s) => s.message).map((s) => s.message!),
  };
}

/** One DORA exchange after another for several clients. Each sees the pool as the previous one left it. */
export function buildBatchDora(base: LabState, ids: ClientId[], firstSeq: number): Run {
  let s = base;
  const parts: { steps: RunStep[]; result: RunResult }[] = [];
  ids.forEach((id, i) => {
    const part = buildDora(s, id, firstSeq + i);
    parts.push(part);
    s = applyOps(s, part.steps.flatMap((st) => st.ops));
  });
  return assembleRun(firstSeq, ids.length === 1 ? "dora" : "batch", base, parts);
}

/** Runs DORA to completion for these clients and returns the resulting lab. Used to build starting states. */
export function configureClients(state: LabState, ids: ClientId[], firstSeq = 1): LabState {
  const run = buildBatchDora(state, ids, firstSeq);
  return finalState(run);
}

// ---------------------------------------------------------------------------
// Direct actions (no message exchange)
// ---------------------------------------------------------------------------

export interface ClockEvent {
  clientId: ClientId;
  ip: string;
}

/** Moves the lab clock forward. Leases whose time has run out expire and their clients lose the configuration. */
export function advanceClock(state: LabState, minutes: number): { state: LabState; expired: ClockEvent[] } {
  const clock = state.clock + minutes;
  const expired: ClockEvent[] = [];
  const leases = state.leases.map((l) => {
    if (l.status === "leased" && l.expiresAt <= clock) {
      expired.push({ clientId: l.clientId, ip: l.ip });
      return { ...l, status: "expired" as LeaseStatus };
    }
    return l;
  });
  let next: LabState = { ...state, clock, leases };
  for (const e of expired) next = applyOps(next, [{ t: "client", id: e.clientId, patch: { phase: "expired", config: null } }]);
  return { state: next, expired };
}

export function leaseRemaining(l: Lease, clock: number): number {
  return Math.max(0, l.expiresAt - clock);
}

/** Fraction of the lease that has passed (0–1). The client would start renewing at 0.5. */
export function leaseElapsed(l: Lease, clock: number): number {
  if (l.durationMin <= 0) return 1;
  return Math.min(1, Math.max(0, (clock - l.startedAt) / l.durationMin));
}

export function applyPool(state: LabState, pool: PoolConfig): LabState {
  return { ...state, pool: { ...pool } };
}

/** Switches a client between DHCP and manual configuration. Leaving DHCP releases any lease it holds (simplified). */
export function switchMode(state: LabState, id: ClientId, mode: ConfigMode): { state: LabState; releasedIp: string | null } {
  const client = state.clients[id];
  if (client.mode === mode) return { state, releasedIp: null };
  if (mode === "manual") {
    const lease = activeLeaseOf(state, id);
    const ops: Op[] = [];
    if (lease) ops.push({ t: "lease-status", ip: lease.ip, status: "released" });
    ops.push({ t: "client", id, patch: { mode: "manual", phase: "manual", config: { ...client.manual }, linkLocal: null } });
    return { state: applyOps(state, ops), releasedIp: lease ? lease.ip : null };
  }
  return { state: applyOps(state, [{ t: "client", id, patch: { mode: "dhcp", phase: "unconfigured", config: null, linkLocal: null } }]), releasedIp: null };
}

export function setManualConfig(state: LabState, id: ClientId, cfg: IpConfig): LabState {
  const client = state.clients[id];
  const patch: Partial<ClientState> = { manual: { ...cfg } };
  if (client.mode === "manual") patch.config = { ...cfg };
  return applyOps(state, [{ t: "client", id, patch }]);
}

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

export const PHASE_LABEL: Record<ClientPhase, string> = {
  unconfigured: "No address",
  discovering: "Discovering",
  selecting: "Got an offer",
  requesting: "Requesting",
  bound: "Leased",
  renewing: "Renewing",
  failed: "No address",
  expired: "Expired",
  manual: "Static",
};

export const PHASE_LONG: Record<ClientPhase, string> = {
  unconfigured: "No usable IP configuration yet",
  discovering: "Broadcasting Discover, waiting for an Offer",
  selecting: "An Offer has arrived (not usable yet)",
  requesting: "Asked for the offered address, waiting for the ACK",
  bound: "Configured by DHCP",
  renewing: "Asking the server to extend its lease",
  failed: "DHCP failed: no server gave it an address",
  expired: "The lease ran out: the client must stop using the address",
  manual: "Configured by hand (static)",
};

export const LEASE_STATUS_LABEL: Record<LeaseStatus, string> = { offered: "Offered", leased: "Leased", released: "Released", expired: "Expired" };

export type TabId = "dora" | "messages" | "pool" | "clients" | "exhaustion" | "lease" | "static" | "arp" | "experiments";

// ---------------------------------------------------------------------------
// Guided experiments
// ---------------------------------------------------------------------------

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
  setup: () => LabState;
  /** True when the lab is in the state the experiment asks for. Checked live against the student's own work. */
  check: (state: LabState) => boolean;
  goal: string;
}

function countPhase(state: LabState, phase: ClientPhase): number {
  return CLIENT_IDS.filter((id) => state.clients[id].phase === phase).length;
}

export function withPoolSize(size: number, base: PoolConfig = DEFAULT_POOL): PoolConfig {
  return { ...base, end: base.start + Math.max(1, size) - 1 };
}

export const EXPERIMENTS: Experiment[] = [
  {
    id: "exp-dora",
    title: "1. The normal DORA process",
    objective: "See the four DHCP messages that give one device its complete configuration.",
    startingState: "Every PC is unconfigured. The server has a pool of 51 addresses (.100 to .150).",
    task: "Select PC-01 and press Start DHCP, then Next Step through Discover, Offer, Request and ACK. Read what changes at each step.",
    hint: "After the Offer, look at the lease table: the address is Offered, not Leased. It only becomes Leased after the ACK.",
    observation: "PC-01 ends with 192.168.1.100, 255.255.255.0, gateway 192.168.1.1 and DNS 8.8.8.8.",
    explanation: "DORA is a four-message conversation. Discover and Request are broadcasts from a client with no address; Offer and ACK come back from the server. The address only counts once the ACK has arrived.",
    goTo: "dora",
    goToLabel: "Get an Address",
    setup: () => initialState(),
    check: (s) => s.clients.pc1.phase === "bound",
    goal: "PC-01 has a DHCP lease.",
  },
  {
    id: "exp-multi",
    title: "2. Several clients ask for addresses",
    objective: "Watch one server give each client a different address.",
    startingState: "Every PC is unconfigured and the pool is empty of leases.",
    task: "Configure at least three PCs, one after another or with \"Configure all\". Compare the addresses in the lease table.",
    hint: "The server offers the lowest free address, so the first client gets .100, the next .101, and so on.",
    observation: "Each client gets its own address from the same pool. No two clients share one.",
    explanation: "The server's lease table is what prevents duplicates: an address that is Offered or Leased is not offered to anyone else.",
    goTo: "clients",
    goToLabel: "Multiple Clients",
    setup: () => initialState(),
    check: (s) => countPhase(s, "bound") >= 3,
    goal: "At least three PCs hold different leases.",
  },
  {
    id: "exp-exhaust",
    title: "3. The pool runs out",
    objective: "Find out what happens when there are more clients than addresses.",
    startingState: "The pool has only three addresses and five PCs are unconfigured.",
    task: "Run DHCP for all five PCs and see which ones fail. Then use the fixes offered to give the rest an address.",
    hint: "Try both fixes: making the pool larger, and releasing an address that is no longer needed.",
    observation: "Three PCs get an address. The last two get no Offer at all.",
    explanation: "DHCP cannot assign an address if its configured pool has no available address. The fix is administrative: a bigger pool, shorter leases, or releasing addresses that are not in use.",
    goTo: "exhaustion",
    goToLabel: "Pool Exhaustion",
    setup: () => initialState(withPoolSize(3)),
    check: (s) => countPhase(s, "failed") >= 1 && s.leases.filter((l) => l.status === "leased").length === 3,
    goal: "Three leases exist and at least one PC has no address.",
  },
  {
    id: "exp-release",
    title: "4. Release an address and reuse it",
    objective: "See a released address handed to a different client.",
    startingState: "The pool has three addresses. PC-01, PC-02 and PC-03 hold them all, and PC-04 has no address.",
    task: "Release PC-02's address, then run DHCP for PC-04. Which address does PC-04 receive?",
    hint: "PC-02 holds 192.168.1.101. Use the Release & Renew tab.",
    observation: "PC-04 receives 192.168.1.101, the address PC-02 gave back.",
    explanation: "A released address returns to the pool immediately. The next Discover can be offered it, even by a different client.",
    goTo: "lease",
    goToLabel: "Release & Renew",
    setup: () => {
      const s = configureClients(initialState(withPoolSize(3)), ["pc1", "pc2", "pc3"]);
      return s;
    },
    check: (s) => s.clients.pc4.config?.ip === ipAt(101) && s.clients.pc2.phase === "unconfigured",
    goal: "PC-04 holds the address PC-02 released.",
  },
  {
    id: "exp-static",
    title: "5. DHCP compared with manual configuration",
    objective: "Configure one device by hand and compare the work and the risks with DHCP.",
    startingState: "PC-01 has a DHCP lease. PC-02 is set to manual configuration with a wrong gateway.",
    task: "Fix PC-02's manual configuration until the diagnosis shows no errors. Then switch PC-03 to manual and pick an address inside the DHCP range to see the warning.",
    hint: "The gateway must be the router, 192.168.1.1.",
    observation: "DHCP gave PC-01 a consistent configuration in one exchange. Doing the same by hand meant getting four values right, and a wrong one breaks communication.",
    explanation: "Manual (static) configuration gives full control and does not depend on a server, but every value is typed by a person, and addresses can clash with the DHCP pool. DHCP centralises the work and avoids typing mistakes.",
    goTo: "static",
    goToLabel: "Static vs DHCP",
    setup: () => {
      let s = configureClients(initialState(), ["pc1"]);
      s = switchMode(s, "pc2", "manual").state;
      s = setManualConfig(s, "pc2", { ip: ipAt(60), mask: SUBNET_MASK, gateway: "192.168.1.254", dns: "8.8.8.8" });
      return s;
    },
    check: (s) => {
      const c = s.clients.pc2;
      return c.mode === "manual" && !!c.config && !hasErrors(diagnoseConfig(c.config, s, "pc2"));
    },
    goal: "PC-02's manual configuration has no errors.",
  },
  {
    id: "exp-pool",
    title: "6. Change the DHCP pool",
    objective: "Change the pool and observe which addresses clients receive.",
    startingState: "The pool is .100 to .150. No client has a lease.",
    task: "In Address Pool, change the range to .200 – .210 and apply it. Then configure PC-01 from the Get an Address tab.",
    hint: "Press Apply after editing the range. New leases come from the new range.",
    observation: "PC-01 receives 192.168.1.200, the first address of the new range.",
    explanation: "The address a client gets comes from whatever pool is configured when it asks. Existing leases are not moved when the pool changes.",
    goTo: "pool",
    goToLabel: "Address Pool",
    setup: () => initialState(),
    check: (s) => {
      const ip = s.clients.pc1.config?.ip;
      return !!ip && s.clients.pc1.phase === "bound" && lastOctet(ip) >= 200 && lastOctet(ip) <= 210;
    },
    goal: "PC-01 holds an address from .200–.210.",
  },
];

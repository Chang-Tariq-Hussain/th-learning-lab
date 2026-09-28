// ---------------------------------------------------------------------------
// IP Addressing Simulator — pure model (no React).
//
// Scope: IPv4 addresses, subnet masks / CIDR prefixes, network vs. host
// portions, network / broadcast / usable-host calculation, same-vs-different
// network, default gateway, address configuration, duplicate addresses, and
// private / public / special classification.
//
// Deliberately NOT here: subnetting design, ARP, DHCP, DNS, NAT, routing
// protocols, ICMP/ping. "Send" below is a *simplified decision* (local vs.
// remote, gateway sanity) — nothing is actually routed.
// ---------------------------------------------------------------------------

import { defaultMacFor } from "../ethernet-mac-simulator/model";
import type { DetailLevel } from "../osi-model-explorer/model";

export type { DetailLevel } from "../osi-model-explorer/model";
export { DETAIL_LEVEL_LABELS } from "../osi-model-explorer/model";

// ---------------------------------------------------------------------------
// Parsing & formatting (IPv4 is exactly 32 bits; we keep values as unsigned numbers)
// ---------------------------------------------------------------------------

export type ParseResult = { ok: true; value: number } | { ok: false; reason: string };

function fail(reason: string): { ok: false; reason: string } {
  return { ok: false, reason };
}

export function parseIPv4(input: string): ParseResult {
  const text = input.trim();
  if (!text) return fail("Enter an IPv4 address, for example 192.168.1.10.");
  if (text.includes("/")) return fail("Enter only the address here (like 192.168.1.10). The prefix length or mask goes in its own field.");
  if (/[^0-9.]/.test(text)) return fail("IPv4 addresses contain only digits and dots. Another character was found.");
  const parts = text.split(".");
  if (parts.length !== 4) return fail(`An IPv4 address has exactly 4 numbers (octets) separated by dots. Yours has ${parts.length}.`);
  const octets: number[] = [];
  for (let i = 0; i < 4; i++) {
    const p = parts[i]!;
    if (p === "") return fail(`Octet ${i + 1} is empty. Check for a doubled or trailing dot.`);
    if (p.length > 1 && p.startsWith("0")) return fail(`Octet ${i + 1} ("${p}") has a leading zero. Write it without extra zeros (10, not 010) because some systems read a leading zero as octal.`);
    const n = Number(p);
    if (n > 255) return fail(`Octet ${i + 1} is ${n}. Each octet is 8 bits, so it must be between 0 and 255.`);
    octets.push(n);
  }
  return { ok: true, value: (((octets[0]! << 24) | (octets[1]! << 16) | (octets[2]! << 8) | octets[3]!) >>> 0) };
}

export function toOctets(v: number): [number, number, number, number] {
  return [(v >>> 24) & 255, (v >>> 16) & 255, (v >>> 8) & 255, v & 255];
}

export function fromOctets(o: number[]): number {
  return (((o[0]! & 255) << 24) | ((o[1]! & 255) << 16) | ((o[2]! & 255) << 8) | (o[3]! & 255)) >>> 0;
}

export function formatIPv4(v: number): string {
  return toOctets(v).join(".");
}

export function octetBinary(n: number): string {
  return (n & 255).toString(2).padStart(8, "0");
}

export function ipBinary(v: number): string {
  return toOctets(v).map(octetBinary).join(".");
}

/** Bit at position `i` (0 = most significant) of a 32-bit value. */
export function bitAt(v: number, i: number): 0 | 1 {
  return ((v >>> (31 - i)) & 1) as 0 | 1;
}

export function setBit(v: number, i: number, on: boolean): number {
  const mask = (1 << (31 - i)) >>> 0;
  return (on ? (v | mask) : (v & ~mask)) >>> 0;
}

// ---------------------------------------------------------------------------
// Masks & prefixes
// ---------------------------------------------------------------------------

export function prefixToMask(prefix: number): number {
  if (prefix <= 0) return 0;
  if (prefix >= 32) return 0xffffffff;
  return (0xffffffff << (32 - prefix)) >>> 0;
}

/** Returns the prefix length if `mask` is a valid contiguous mask, else null. */
export function maskToPrefix(mask: number): number | null {
  let p = 0;
  while (p < 32 && bitAt(mask, p) === 1) p++;
  return prefixToMask(p) === mask >>> 0 ? p : null;
}

export type MaskParse = { ok: true; prefix: number; mask: number } | { ok: false; reason: string };

/** Accepts "/24", "24", or "255.255.255.0". */
export function parseMask(input: string): MaskParse {
  const t = input.trim();
  if (!t) return fail("Enter a subnet mask (like 255.255.255.0) or a prefix length (like /24).");
  const slash = /^\/?(\d{1,2})$/.exec(t);
  if (slash && (t.startsWith("/") || !t.includes("."))) {
    const n = Number(slash[1]);
    if (n > 32) return fail("A prefix length is between 0 and 32, because an IPv4 address has 32 bits.");
    return { ok: true, prefix: n, mask: prefixToMask(n) };
  }
  const r = parseIPv4(t);
  if (!r.ok) return fail(`Write the mask like 255.255.255.0 or as a prefix length like /24. ${r.reason}`);
  const prefix = maskToPrefix(r.value);
  if (prefix === null) {
    return fail(`${t} is not a valid subnet mask. In binary it is ${ipBinary(r.value)}, where a 1 appears after a 0. A mask is one unbroken run of 1s followed by only 0s.`);
  }
  return { ok: true, prefix, mask: r.value };
}

export const COMMON_MASKS: { prefix: number; mask: string; note: string }[] = [
  { prefix: 8, mask: "255.0.0.0", note: "First 8 bits are the network; 24 bits are left for hosts." },
  { prefix: 16, mask: "255.255.0.0", note: "First 16 bits are the network; 16 bits are left for hosts." },
  { prefix: 24, mask: "255.255.255.0", note: "First 24 bits are the network; 8 bits are left for hosts." },
  { prefix: 25, mask: "255.255.255.128", note: "The boundary falls inside the last octet: 25 network bits, 7 host bits." },
];

export function prefixLimits(level: DetailLevel): { min: number; max: number } {
  if (level === "beginner") return { min: 8, max: 30 };
  if (level === "intermediate") return { min: 1, max: 30 };
  return { min: 0, max: 32 };
}

export function levelPrefixMessage(level: DetailLevel): string {
  if (level === "beginner") return "Beginner mode covers ordinary subnets from /8 to /30. Switch to Intermediate or Technical for other lengths.";
  if (level === "intermediate") return "Intermediate mode covers /1 to /30. /31 and /32 are special cases unlocked in Technical mode.";
  return "";
}

// ---------------------------------------------------------------------------
// Subnet analysis
// ---------------------------------------------------------------------------

export type SubnetKind = "ordinary" | "point-to-point" | "single-host";

export interface SubnetInfo {
  ip: number;
  prefix: number;
  mask: number;
  wildcard: number;
  network: number;
  broadcast: number;
  firstHost: number;
  lastHost: number;
  hostBits: number;
  networkBits: number;
  /** 2^hostBits */
  totalAddresses: number;
  /** Ordinary subnets: 2^H - 2. /31 -> 2, /32 -> 1 (special cases). */
  usableHosts: number;
  /** The host bits of `ip`, read as a number. */
  hostValue: number;
  kind: SubnetKind;
}

export function analyze(ip: number, prefix: number): SubnetInfo {
  const mask = prefixToMask(prefix);
  const wildcard = (~mask) >>> 0;
  const network = (ip & mask) >>> 0;
  const broadcast = (network | wildcard) >>> 0;
  const hostBits = 32 - prefix;
  const total = 2 ** hostBits;
  let kind: SubnetKind = "ordinary";
  let firstHost = network + 1;
  let lastHost = broadcast - 1;
  let usable = total - 2;
  if (prefix === 32) {
    kind = "single-host";
    firstHost = ip;
    lastHost = ip;
    usable = 1;
  } else if (prefix === 31) {
    kind = "point-to-point";
    firstHost = network;
    lastHost = broadcast;
    usable = 2;
  }
  return {
    ip,
    prefix,
    mask,
    wildcard,
    network,
    broadcast,
    firstHost: firstHost >>> 0,
    lastHost: lastHost >>> 0,
    hostBits,
    networkBits: prefix,
    totalAddresses: total,
    usableHosts: usable,
    hostValue: (ip & wildcard) >>> 0,
    kind,
  };
}

export type AddressRole = "network" | "broadcast" | "host";

export function addressRole(info: SubnetInfo): AddressRole {
  if (info.kind !== "ordinary") return "host";
  if (info.ip === info.network) return "network";
  if (info.ip === info.broadcast) return "broadcast";
  return "host";
}

export const ROLE_LABEL: Record<AddressRole, string> = {
  network: "Network address",
  broadcast: "Broadcast address",
  host: "Host address",
};

export const ROLE_EXPLANATION: Record<AddressRole, string> = {
  network: "All host bits are 0. This value names the network itself, so it is not given to a device.",
  broadcast: "All host bits are 1. Sending to this address means \"every device on this network\", so it is not given to a single device.",
  host: "A mix of host bits that is neither all 0s nor all 1s. This kind of address can be assigned to one device's interface.",
};

/** Dotted text of the whole octets that fall on each side of the boundary (byte-aligned prefixes only). */
export function splitPortionsText(ip: number, prefix: number): { network: string; host: string; aligned: boolean } {
  const o = toOctets(ip);
  if (prefix % 8 === 0) {
    const n = prefix / 8;
    return { network: o.slice(0, n).join(".") || "(none)", host: o.slice(n).join(".") || "(none)", aligned: true };
  }
  return { network: "", host: "", aligned: false };
}

// ---------------------------------------------------------------------------
// Classification: private / public / special
// ---------------------------------------------------------------------------

export type AddressKind =
  | "private"
  | "public"
  | "loopback"
  | "unspecified"
  | "limited-broadcast"
  | "link-local"
  | "multicast"
  | "reserved"
  | "documentation"
  | "shared"
  | "this-network";

export interface AddressClass {
  kind: AddressKind;
  label: string;
  scope: "Private" | "Public" | "Special-purpose";
  range?: string;
  explanation: string;
}

interface Block {
  base: string;
  prefix: number;
}

export const PRIVATE_RANGES: { cidr: string; base: string; prefix: number; note: string }[] = [
  { cidr: "10.0.0.0/8", base: "10.0.0.0", prefix: 8, note: "One very large private block, common in big organisations." },
  { cidr: "172.16.0.0/12", base: "172.16.0.0", prefix: 12, note: "Covers 172.16.0.0 – 172.31.255.255 only (not all of 172.x.x.x)." },
  { cidr: "192.168.0.0/16", base: "192.168.0.0", prefix: 16, note: "The familiar home and small-office range." },
];

function inBlock(v: number, b: Block): boolean {
  const base = parseIPv4(b.base);
  if (!base.ok) return false;
  return ((v & prefixToMask(b.prefix)) >>> 0) === base.value;
}

const DOC_BLOCKS: Block[] = [
  { base: "192.0.2.0", prefix: 24 },
  { base: "198.51.100.0", prefix: 24 },
  { base: "203.0.113.0", prefix: 24 },
];

export function classifyIPv4(v: number): AddressClass {
  if (v === 0) {
    return { kind: "unspecified", label: "Unspecified address", scope: "Special-purpose", range: "0.0.0.0", explanation: "Means \"no address yet\" or \"any address\" depending on context (for example, a device that has not been configured). It is never assigned as a normal host address." };
  }
  if (v === 0xffffffff) {
    return { kind: "limited-broadcast", label: "Limited broadcast", scope: "Special-purpose", range: "255.255.255.255", explanation: "Addressed to every device on the local network segment, and routers do not forward it. Different from a subnet's own broadcast address." };
  }
  if (inBlock(v, { base: "0.0.0.0", prefix: 8 })) {
    return { kind: "this-network", label: "\"This network\" block", scope: "Special-purpose", range: "0.0.0.0/8", explanation: "Reserved for \"this host on this network\" uses. Not valid as a normal destination." };
  }
  if (inBlock(v, { base: "127.0.0.0", prefix: 8 })) {
    return { kind: "loopback", label: "Loopback", scope: "Special-purpose", range: "127.0.0.0/8", explanation: "Refers to the device itself (127.0.0.1 is the usual one). Traffic sent here never leaves the device." };
  }
  for (const r of PRIVATE_RANGES) {
    if (inBlock(v, r)) return { kind: "private", label: "Private", scope: "Private", range: r.cidr, explanation: `Inside ${r.cidr}, reserved for private networks. These addresses are not unique across the internet and are not routed on the public internet.` };
  }
  if (inBlock(v, { base: "169.254.0.0", prefix: 16 })) {
    return { kind: "link-local", label: "Link-local", scope: "Special-purpose", range: "169.254.0.0/16", explanation: "Used only on the directly connected link, often when a device could not get an address any other way. Routers do not forward it." };
  }
  if (inBlock(v, { base: "100.64.0.0", prefix: 10 })) {
    return { kind: "shared", label: "Shared address space", scope: "Special-purpose", range: "100.64.0.0/10", explanation: "Set aside for service-provider use. It is not one of the three private ranges and not ordinary public space either." };
  }
  for (const b of DOC_BLOCKS) {
    if (inBlock(v, b)) return { kind: "documentation", label: "Documentation", scope: "Special-purpose", range: `${b.base}/${b.prefix}`, explanation: "Reserved for examples in books and documentation. Safe to use in teaching material because it is never assigned to real networks." };
  }
  if (inBlock(v, { base: "224.0.0.0", prefix: 4 })) {
    return { kind: "multicast", label: "Multicast", scope: "Special-purpose", range: "224.0.0.0/4", explanation: "A group address: it is delivered to devices that have joined the group, not to one interface." };
  }
  if (inBlock(v, { base: "240.0.0.0", prefix: 4 })) {
    return { kind: "reserved", label: "Reserved", scope: "Special-purpose", range: "240.0.0.0/4", explanation: "Reserved for future or special use. Not assigned as an ordinary host address." };
  }
  return { kind: "public", label: "Public", scope: "Public", explanation: "Not private and not in a special-purpose block, so it can be a globally routable address on the public internet, assigned by an address registry through internet providers." };
}

export const SPECIAL_ADDRESSES: { address: string; name: string; meaning: string }[] = [
  { address: "127.0.0.1", name: "Loopback", meaning: "\"This device.\" Traffic to it never leaves the machine; used to test that the network software on the device works. The whole 127.0.0.0/8 block is loopback." },
  { address: "0.0.0.0", name: "Unspecified", meaning: "Depends on context: \"no address yet\" on an unconfigured interface, or \"any address\" when a program listens. It is not a normal host address." },
  { address: "255.255.255.255", name: "Limited broadcast", meaning: "Every device on the local network segment. Routers do not forward it, which is why it differs from a subnet's directed broadcast (like 192.168.1.255)." },
  { address: "169.254.x.x", name: "Link-local", meaning: "Self-assigned addresses valid only on the local link, used when no other address was available." },
];

// ---------------------------------------------------------------------------
// Validation of an address used as a host address
// ---------------------------------------------------------------------------

export interface HostAddressIssue {
  code: string;
  message: string;
}

export function hostAddressIssue(ip: number, prefix: number): HostAddressIssue | null {
  const cls = classifyIPv4(ip);
  if (cls.kind === "unspecified") return { code: "unspecified", message: "0.0.0.0 is the unspecified address (\"no address yet\"). A device cannot use it as its real address." };
  if (cls.kind === "limited-broadcast") return { code: "limited-broadcast", message: "255.255.255.255 is the limited broadcast address (\"everyone on this segment\"). It cannot identify a single interface." };
  if (cls.kind === "this-network") return { code: "this-network", message: "Addresses in 0.0.0.0/8 are reserved for \"this network\" uses and cannot be assigned to an interface." };
  if (cls.kind === "loopback") return { code: "loopback", message: "127.x.x.x is loopback: it means \"this device itself\" and never reaches the network. It cannot be a LAN address." };
  if (cls.kind === "multicast") return { code: "multicast", message: "224.0.0.0 – 239.255.255.255 are multicast group addresses, not addresses for a single interface." };
  if (cls.kind === "reserved") return { code: "reserved", message: "240.0.0.0 and above is reserved and is not assigned as an ordinary host address." };
  const info = analyze(ip, prefix);
  if (info.kind === "ordinary") {
    if (ip === info.network) return { code: "network-address", message: `${formatIPv4(ip)} is the network address of ${formatIPv4(info.network)}/${prefix} (all host bits are 0). It names the network, so it cannot be given to a device.` };
    if (ip === info.broadcast) return { code: "broadcast-address", message: `${formatIPv4(ip)} is the broadcast address of ${formatIPv4(info.network)}/${prefix} (all host bits are 1). It means "every device here", so it cannot be given to one device.` };
  }
  return null;
}

// ---------------------------------------------------------------------------
// Lab network: PC A/B/D — Switch 1 — Router — Switch 2 — PC C
// ---------------------------------------------------------------------------

export type HostId = "a" | "b" | "c" | "d";
export type NodeId = HostId | "sw1" | "sw2" | "router";

export interface IpHost {
  id: HostId;
  name: string;
  /** Re-used from the Ethernet & MAC Address Simulator's device list. */
  mac: string;
  /** Which switch/LAN the cable is physically plugged into. */
  lan: 1 | 2;
  ip: string;
  prefix: number;
  gateway: string;
}

export interface RouterIface {
  lan: 1 | 2;
  name: string;
  ip: string;
  prefix: number;
  mac: string;
}

export const ROUTER_IFACES: RouterIface[] = [
  { lan: 1, name: "Router (LAN 1 interface)", ip: "192.168.1.1", prefix: 24, mac: "02:5D:11:A0:00:01" },
  { lan: 2, name: "Router (LAN 2 interface)", ip: "192.168.2.1", prefix: 24, mac: "02:5D:11:A0:00:02" },
];

export function createDefaultHosts(): IpHost[] {
  return [
    { id: "a", name: "PC-A", mac: defaultMacFor("a"), lan: 1, ip: "192.168.1.10", prefix: 24, gateway: "192.168.1.1" },
    { id: "b", name: "PC-B", mac: defaultMacFor("b"), lan: 1, ip: "192.168.1.20", prefix: 24, gateway: "192.168.1.1" },
    { id: "d", name: "PC-D", mac: defaultMacFor("d"), lan: 1, ip: "192.168.1.30", prefix: 24, gateway: "192.168.1.1" },
    { id: "c", name: "PC-C", mac: defaultMacFor("c"), lan: 2, ip: "192.168.2.20", prefix: 24, gateway: "192.168.2.1" },
  ];
}

export function hostById(hosts: IpHost[], id: string): IpHost | undefined {
  return hosts.find((h) => h.id === id);
}

export const NODE_LABEL: Record<NodeId, string> = { a: "PC-A", b: "PC-B", c: "PC-C", d: "PC-D", sw1: "Switch 1", sw2: "Switch 2", router: "Router" };

// ---- Duplicates ------------------------------------------------------------

export interface Holder {
  id: string;
  name: string;
}

export interface DuplicateGroup {
  ip: string;
  holders: Holder[];
}

function normIp(s: string): string | null {
  const p = parseIPv4(s);
  return p.ok ? formatIPv4(p.value) : null;
}

export function findDuplicates(hosts: IpHost[]): DuplicateGroup[] {
  const map = new Map<string, Holder[]>();
  const add = (ip: string, h: Holder) => {
    const n = normIp(ip);
    if (!n) return;
    map.set(n, [...(map.get(n) ?? []), h]);
  };
  for (const h of hosts) add(h.ip, { id: h.id, name: h.name });
  for (const r of ROUTER_IFACES) add(r.ip, { id: `router-${r.lan}`, name: r.name });
  return [...map.entries()].filter(([, v]) => v.length > 1).map(([ip, holders]) => ({ ip, holders }));
}

export function isDuplicated(hosts: IpHost[], id: HostId): boolean {
  return findDuplicates(hosts).some((g) => g.holders.some((h) => h.id === id));
}

// ---- Configuration validation ---------------------------------------------

export interface ConfigDraft {
  ip: string;
  mask: string;
  gateway: string;
}

export interface ConfigIssue {
  field: "ip" | "mask" | "gateway";
  severity: "error" | "warning" | "note";
  message: string;
}

export interface ConfigCheck {
  /** No errors — the configuration can be applied. Warnings still allow applying. */
  ok: boolean;
  issues: ConfigIssue[];
  parsed?: { ip: string; prefix: number; gateway: string };
}

export function validateConfig(draft: ConfigDraft, hostId: HostId, hosts: IpHost[], level: DetailLevel = "technical"): ConfigCheck {
  const issues: ConfigIssue[] = [];
  const ip = parseIPv4(draft.ip);
  const mask = parseMask(draft.mask);
  if (!ip.ok) issues.push({ field: "ip", severity: "error", message: ip.reason });
  if (!mask.ok) issues.push({ field: "mask", severity: "error", message: mask.reason });
  if (mask.ok) {
    const { min, max } = prefixLimits(level);
    if (mask.prefix < min || mask.prefix > max) {
      issues.push({ field: "mask", severity: "error", message: `/${mask.prefix} is outside this level's range (/${min} to /${max}). ${levelPrefixMessage(level)}` });
    }
  }

  if (ip.ok && mask.ok) {
    const bad = hostAddressIssue(ip.value, mask.prefix);
    if (bad) issues.push({ field: "ip", severity: "error", message: bad.message });
    const dupHolders = [
      ...hosts.filter((h) => h.id !== hostId && normIp(h.ip) === formatIPv4(ip.value)).map((h) => h.name),
      ...ROUTER_IFACES.filter((r) => normIp(r.ip) === formatIPv4(ip.value)).map((r) => r.name),
    ];
    if (dupHolders.length > 0) {
      issues.push({
        field: "ip",
        severity: "warning",
        message: `Duplicate IP address: ${formatIPv4(ip.value)} is already used by ${dupHolders.join(", ")}. Two interfaces with the same address make delivery unreliable, since traffic meant for one may reach the other.`,
      });
    }
  }

  let gatewayValue = "";
  const gw = draft.gateway.trim();
  if (gw === "") {
    issues.push({ field: "gateway", severity: "note", message: "No default gateway. This device can talk to its own local network, but has no way to reach other networks." });
  } else {
    const g = parseIPv4(gw);
    if (!g.ok) {
      issues.push({ field: "gateway", severity: "error", message: g.reason });
    } else {
      gatewayValue = formatIPv4(g.value);
      if (ip.ok && mask.ok) {
        const info = analyze(ip.value, mask.prefix);
        if (((g.value & info.mask) >>> 0) !== info.network) {
          issues.push({
            field: "gateway",
            severity: "warning",
            message: `The gateway ${gatewayValue} is outside this device's own network (${formatIPv4(info.network)}/${mask.prefix}). A host can only hand traffic to a gateway it can reach directly on its local network, so most systems would reject this.`,
          });
        } else if (g.value === ip.value) {
          issues.push({ field: "gateway", severity: "warning", message: "The gateway is the device's own address. A device cannot use itself as the way out of its network." });
        } else if (info.kind === "ordinary" && (g.value === info.network || g.value === info.broadcast)) {
          issues.push({ field: "gateway", severity: "warning", message: `${gatewayValue} is the ${g.value === info.network ? "network" : "broadcast"} address of this network, so no router can be using it.` });
        }
      }
    }
  }

  const ok = !issues.some((i) => i.severity === "error");
  return ok && ip.ok && mask.ok ? { ok, issues, parsed: { ip: formatIPv4(ip.value), prefix: mask.prefix, gateway: gatewayValue } } : { ok: false, issues };
}

// ---- Same network? -------------------------------------------------------

export interface NetworkComparison {
  a: SubnetInfo;
  b: SubnetInfo;
  /** Compared using A's mask for both addresses (what A concludes). */
  sameFromA: boolean;
  /** Compared using B's mask for both addresses (what B concludes). */
  sameFromB: boolean;
  masksDiffer: boolean;
  same: boolean;
}

export function compareNetworks(ipA: number, prefixA: number, ipB: number, prefixB: number): NetworkComparison {
  const a = analyze(ipA, prefixA);
  const b = analyze(ipB, prefixB);
  const maskA = prefixToMask(prefixA);
  const maskB = prefixToMask(prefixB);
  const sameFromA = ((ipB & maskA) >>> 0) === a.network;
  const sameFromB = ((ipA & maskB) >>> 0) === b.network;
  return { a, b, sameFromA, sameFromB, masksDiffer: prefixA !== prefixB, same: sameFromA && sameFromB };
}

export const SAME_NETWORK_PRESETS: { id: string; label: string; aIp: string; aMask: string; bIp: string; bMask: string }[] = [
  { id: "same", label: "192.168.1.10 and 192.168.1.20 (/24)", aIp: "192.168.1.10", aMask: "/24", bIp: "192.168.1.20", bMask: "/24" },
  { id: "diff", label: "192.168.1.10 and 192.168.2.20 (/24)", aIp: "192.168.1.10", aMask: "/24", bIp: "192.168.2.20", bMask: "/24" },
  { id: "wide", label: "The same two addresses with a /16 mask", aIp: "192.168.1.10", aMask: "/16", bIp: "192.168.2.20", bMask: "/16" },
  { id: "split", label: "10.0.0.100 and 10.0.0.200 (/25)", aIp: "10.0.0.100", aMask: "/25", bIp: "10.0.0.200", bMask: "/25" },
];

// ---- Local vs. remote / default gateway ----------------------------------

export type Verdict =
  | "invalid-config"
  | "duplicate-ip"
  | "local-ok"
  | "local-unreachable"
  | "remote-ok"
  | "no-gateway"
  | "gateway-invalid"
  | "gateway-off-subnet"
  | "gateway-not-router"
  | "gateway-nobody"
  | "gateway-wrong-side"
  | "no-route";

export interface OneWay {
  from: string;
  to: string;
  ok: boolean;
  scope: "local" | "remote" | "unknown";
  verdict: Verdict;
  headline: string;
  /** Step-by-step reasoning, in order. */
  lines: string[];
  /** Nodes the packet reaches, in order. */
  path: NodeId[];
}

function lanSwitch(lan: 1 | 2): NodeId {
  return lan === 1 ? "sw1" : "sw2";
}

function netOf(ip: number, prefix: number): number {
  return (ip & prefixToMask(prefix)) >>> 0;
}

export function evaluateOneWay(src: IpHost, dst: IpHost, hosts: IpHost[]): OneWay {
  const base = { from: src.name, to: dst.name };
  const s = parseIPv4(src.ip);
  const d = parseIPv4(dst.ip);
  if (!s.ok || !d.ok) {
    return { ...base, ok: false, scope: "unknown", verdict: "invalid-config", headline: "An address is not valid", lines: ["One of the two addresses is not a valid IPv4 address, so no comparison is possible."], path: [src.id] };
  }
  const lines: string[] = [];
  const mask = prefixToMask(src.prefix);
  const srcNet = netOf(s.value, src.prefix);
  const dstNet = netOf(d.value, src.prefix);
  lines.push(`${src.name}'s network: ${src.ip} AND ${formatIPv4(mask)} = ${formatIPv4(srcNet)}`);
  lines.push(`Destination ${dst.ip} AND ${formatIPv4(mask)} = ${formatIPv4(dstNet)} (using ${src.name}'s mask)`);
  const local = srcNet === dstNet;

  const dups = findDuplicates(hosts);
  const dupOfDst = dups.find((g) => g.ip === formatIPv4(d.value));
  const dupOfSrc = dups.find((g) => g.ip === formatIPv4(s.value));
  if (dupOfDst || dupOfSrc) {
    const g = (dupOfDst ?? dupOfSrc)!;
    lines.push(`${g.ip} is configured on more than one interface (${g.holders.map((h) => h.name).join(", ")}).`);
    return { ...base, ok: false, scope: local ? "local" : "remote", verdict: "duplicate-ip", headline: "Duplicate IP address: delivery is unreliable", lines, path: [src.id, lanSwitch(src.lan)] };
  }

  if (local) {
    lines.push("Same network → the destination is local, so the data is delivered directly. No default gateway is involved.");
    if (src.lan !== dst.lan) {
      lines.push(`But ${dst.name} is actually cabled to a different LAN, on the far side of the router. ${src.name} believes it is local and will try to reach it directly, and that cannot work.`);
      return { ...base, ok: false, scope: "local", verdict: "local-unreachable", headline: "Believed local, but not actually on this LAN", lines, path: [src.id, lanSwitch(src.lan)] };
    }
    return { ...base, ok: true, scope: "local", verdict: "local-ok", headline: "Local destination: delivered directly", lines, path: [src.id, lanSwitch(src.lan), dst.id] };
  }

  lines.push("Different network → the destination is not on the local network. It is a remote destination, so a router is needed.");
  const gwText = src.gateway.trim();
  const partial: NodeId[] = [src.id, lanSwitch(src.lan)];
  if (gwText === "") {
    lines.push(`${src.name} has no default gateway, so it does not know where to send traffic for other networks.`);
    return { ...base, ok: false, scope: "remote", verdict: "no-gateway", headline: "Remote destination, but no default gateway is set", lines, path: partial };
  }
  const g = parseIPv4(gwText);
  if (!g.ok) {
    lines.push(`The default gateway "${gwText}" is not a valid IPv4 address. ${g.reason}`);
    return { ...base, ok: false, scope: "remote", verdict: "gateway-invalid", headline: "The default gateway is not a valid address", lines, path: partial };
  }
  if (netOf(g.value, src.prefix) !== srcNet) {
    lines.push(`The gateway ${formatIPv4(g.value)} is not on ${src.name}'s own network (${formatIPv4(srcNet)}/${src.prefix}), so ${src.name} cannot reach it directly.`);
    return { ...base, ok: false, scope: "remote", verdict: "gateway-off-subnet", headline: "The gateway is outside the local network", lines, path: partial };
  }
  const gwIface = ROUTER_IFACES.find((r) => r.ip === formatIPv4(g.value));
  if (!gwIface) {
    const other = hosts.find((h) => h.ip === formatIPv4(g.value) && h.id !== src.id);
    if (other) {
      lines.push(`The gateway ${formatIPv4(g.value)} belongs to ${other.name}, which is an ordinary PC and does not forward traffic to other networks.`);
      return { ...base, ok: false, scope: "remote", verdict: "gateway-not-router", headline: "The gateway is a PC, not a router", lines, path: partial };
    }
    lines.push(`The gateway ${formatIPv4(g.value)} is on the local network, but no device in this lab answers to that address.`);
    return { ...base, ok: false, scope: "remote", verdict: "gateway-nobody", headline: "Nothing answers at the gateway address", lines, path: partial };
  }
  if (gwIface.lan !== src.lan) {
    lines.push(`${formatIPv4(g.value)} is the router's LAN ${gwIface.lan} interface, but ${src.name} is cabled to LAN ${src.lan}, so it cannot reach that interface directly.`);
    return { ...base, ok: false, scope: "remote", verdict: "gateway-wrong-side", headline: "The gateway is on the other side of the router", lines, path: partial };
  }
  lines.push(`Gateway ${gwIface.ip} is on the local network and is the router. ${src.name} sends the data to the router.`);
  const path: NodeId[] = [src.id, lanSwitch(src.lan), "router"];
  const outIface = ROUTER_IFACES.find((r) => {
    const rip = parseIPv4(r.ip);
    return rip.ok && netOf(d.value, r.prefix) === netOf(rip.value, r.prefix);
  });
  if (!outIface) {
    lines.push(`The router only knows the networks it is directly connected to in this lab, and ${dst.ip} is in neither. (Routing is not simulated here.)`);
    return { ...base, ok: false, scope: "remote", verdict: "no-route", headline: "The router has no network for that destination", lines, path };
  }
  if (outIface.lan !== dst.lan) {
    lines.push(`The router would deliver to its LAN ${outIface.lan} network, but ${dst.name} is cabled to LAN ${dst.lan}, so it will not be found there.`);
    return { ...base, ok: false, scope: "remote", verdict: "no-route", headline: "Destination is not where its address says", lines, path };
  }
  lines.push(`The router sees ${dst.ip} belongs to its directly connected network ${formatIPv4(netOf(d.value, outIface.prefix))}/${outIface.prefix} and could forward it out of its LAN ${outIface.lan} interface. (The routing decision itself is not simulated.)`);
  return { ...base, ok: true, scope: "remote", verdict: "remote-ok", headline: "Remote destination: can reach it through the router", lines, path: [...path, lanSwitch(dst.lan), dst.id] };
}

export interface SendEvaluation {
  forward: OneWay;
  reverse: OneWay;
  ok: boolean;
  headline: string;
  summary: string;
}

/** A complete exchange needs both the request AND the reply to have a way through. */
export function evaluateSend(srcId: HostId, dstId: HostId, hosts: IpHost[]): SendEvaluation | null {
  const src = hostById(hosts, srcId);
  const dst = hostById(hosts, dstId);
  if (!src || !dst) return null;
  const forward = evaluateOneWay(src, dst, hosts);
  const reverse = evaluateOneWay(dst, src, hosts);
  const ok = forward.ok && reverse.ok;
  let headline = forward.headline;
  let summary = "";
  if (forward.ok && reverse.ok) {
    summary = forward.scope === "local" ? "Both devices treat each other as local, so they can exchange data directly." : "The request can reach the destination through the router, and the reply has a way back.";
  } else if (forward.ok && !reverse.ok) {
    headline = `The request arrives, but the reply cannot return (${reverse.headline.toLowerCase()})`;
    summary = `${dst.name} must also decide where to send its reply. ${reverse.lines.slice(-1)[0] ?? ""}`;
  } else {
    summary = "The sender cannot complete this exchange with its current settings.";
  }
  return { forward, reverse, ok, headline, summary };
}

// ---- Presets used by tabs --------------------------------------------------

export const IP_PRESETS: { ip: string; prefix: number; label: string }[] = [
  { ip: "192.168.1.25", prefix: 24, label: "192.168.1.25/24" },
  { ip: "10.4.7.9", prefix: 8, label: "10.4.7.9/8 (private)" },
  { ip: "172.20.5.130", prefix: 12, label: "172.20.5.130/12 (private)" },
  { ip: "8.8.8.8", prefix: 24, label: "8.8.8.8/24 (public)" },
  { ip: "127.0.0.1", prefix: 8, label: "127.0.0.1 (loopback)" },
  { ip: "169.254.10.5", prefix: 16, label: "169.254.10.5 (link-local)" },
  { ip: "203.0.113.9", prefix: 24, label: "203.0.113.9 (documentation)" },
  { ip: "224.0.0.5", prefix: 4, label: "224.0.0.5 (multicast)" },
];

export const CIDR_PREFIXES = [8, 16, 24, 25, 26, 27, 28, 29, 30];

// ---------------------------------------------------------------------------
// Guided experiments
// ---------------------------------------------------------------------------

export type TabId = "map" | "explorer" | "boundary" | "network" | "same" | "remote" | "config" | "private" | "cidr" | "inspector" | "experiments";

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
  minLevel: DetailLevel;
  setup?: "reset-all";
}

export const EXPERIMENTS: Experiment[] = [
  {
    id: "exp-1",
    title: "Experiment 1 — Decode an IPv4 Address",
    objective: "See that an IPv4 address is just 32 bits written as four 8-bit octets.",
    startingState: "IPv4 Explorer with 192.168.1.10 loaded in decimal and binary.",
    task: "Expand the last octet and click bits to switch them on and off. Watch which numbers add up to 10, then make the last octet 200.",
    observation: "Each bit stands for a power of two (128, 64, 32, 16, 8, 4, 2, 1). The octet's decimal value is the sum of the bits that are 1: 10 = 8 + 2.",
    explanation: "Dotted decimal is only a human-friendly way to write 32 bits. Devices work with the bits.",
    goTo: "explorer",
    goToLabel: "Open IPv4 Explorer",
    minLevel: "beginner",
  },
  {
    id: "exp-2",
    title: "Experiment 2 — Network vs. Host",
    objective: "See how the prefix length moves the boundary between network bits and host bits.",
    startingState: "Mask & Boundary tab with 192.168.1.25 and /24.",
    task: "Change the prefix from /24 to /16, then to /25 and /8. After each change, read which bits are network bits and which are host bits.",
    observation: "A larger prefix means more network bits and fewer host bits. At /24 the network portion is 192.168.1 and the host portion is 25; at /16 the network portion is only 192.168.",
    explanation: "The address does not change, only the mask's opinion of where the network part ends. The same 32 bits can belong to networks of very different sizes.",
    goTo: "boundary",
    goToLabel: "Open Mask & Boundary",
    minLevel: "beginner",
  },
  {
    id: "exp-3",
    title: "Experiment 3 — Find the Network",
    objective: "Calculate the network and broadcast addresses from an address and a mask.",
    startingState: "Find the Network tab with 192.168.1.25 and /24.",
    task: "Read the AND calculation row by row and note the network address. Then change the mask to /25 and try 192.168.1.200: does the network address change?",
    observation: "With /24 the network is 192.168.1.0 and the broadcast is 192.168.1.255. At /25, 192.168.1.200 falls in the upper half: network 192.168.1.128, broadcast 192.168.1.255.",
    explanation: "Network address = address AND mask (host bits become 0). Broadcast = the same network with all host bits set to 1.",
    goTo: "network",
    goToLabel: "Open Find the Network",
    minLevel: "beginner",
  },
  {
    id: "exp-4",
    title: "Experiment 4 — Same or Different Network?",
    objective: "Decide whether two hosts share an IP network by comparing their network addresses.",
    startingState: "Same Network? tab. Try each preset.",
    task: "Predict before revealing: are 192.168.1.10 and 192.168.1.20 on the same network? Then try 192.168.1.10 and 192.168.2.20. Finally try the /16 preset.",
    observation: "Same network address means same network. With /24 the second pair differs (192.168.1.0 vs. 192.168.2.0), but with /16 both give 192.168.0.0.",
    explanation: "\"Same network\" always depends on the mask. Comparing only the first few digits by eye is not a reliable method.",
    goTo: "same",
    goToLabel: "Open Same Network?",
    minLevel: "beginner",
  },
  {
    id: "exp-5",
    title: "Experiment 5 — Local vs. Remote",
    objective: "Use the router and default gateway to understand how a host reaches a remote network.",
    startingState: "Local vs. Remote tab, default addresses, PC-A → PC-C.",
    task: "Send PC-A → PC-B (local) and then PC-A → PC-C (remote). Then clear PC-A's default gateway and send to PC-C again. Finally set the gateway to 192.168.1.1 again.",
    observation: "PC-B is on the same network, so no gateway is used. PC-C is on a different network, so PC-A needs a working default gateway, which is the router's address on PC-A's own network.",
    explanation: "A default gateway is the device a host can use to reach destinations outside its local IP network. It is not needed for communication inside the local network.",
    goTo: "remote",
    goToLabel: "Open Local vs. Remote",
    minLevel: "beginner",
    setup: "reset-all",
  },
];

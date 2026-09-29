// ---------------------------------------------------------------------------
// Subnetting Laboratory — pure model (no React).
//
// Scope: EQUAL-SIZE subnetting of an IPv4 network. Borrowing host bits, CIDR
// prefixes, subnet masks, number of subnets, addresses per subnet, "typical"
// usable hosts (2^H − 2), network / broadcast addresses, host ranges, and
// which subnet an address belongs to.
//
// Deliberately NOT here: VLSM, ARP, DHCP, DNS, NAT, routing. Nothing is routed;
// the allocation lab only shows which subnet a device belongs to.
//
// All address maths is delegated to the IP Addressing Simulator's model
// (`analyze`, `parseIPv4`, `prefixToMask`, `compareNetworks`, ...) so there is
// exactly one implementation of network / broadcast / host-range logic.
// ---------------------------------------------------------------------------

import { analyze, compareNetworks, formatIPv4, hostAddressIssue, parseIPv4, prefixToMask, toOctets, type SubnetInfo } from "../ip-addressing-simulator/model";

// ---------------------------------------------------------------------------
// Limits & defaults
// ---------------------------------------------------------------------------

export const DEFAULT_NETWORK = "192.168.1.0";
export const DEFAULT_ORIG = 24;
export const DEFAULT_NEW = 26;
/** The original network can be /8 to /29 so that there is room to borrow. */
export const MIN_ORIG = 8;
export const MAX_ORIG = 29;
/** Ordinary equal-size subnets stop at /30 (2 usable hosts). /31 and /32 are special cases handled separately. */
export const MAX_NEW = 30;
/** At most 8 borrowed bits (256 subnets) so tables and maps stay readable. */
export const MAX_BORROW = 8;

export function clampOrig(p: number): number {
  return Math.max(MIN_ORIG, Math.min(MAX_ORIG, Math.round(p)));
}

export function maxNewFor(orig: number): number {
  return Math.min(MAX_NEW, orig + MAX_BORROW);
}

export function clampNew(orig: number, next: number): number {
  return Math.max(orig, Math.min(maxNewFor(orig), Math.round(next)));
}

const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";

/** 6 -> "⁶" */
export function sup(n: number): string {
  return String(n)
    .split("")
    .map((d) => SUP[Number(d)] ?? d)
    .join("");
}

/** 6 -> "2⁶" */
export function pow2(n: number): string {
  return `2${sup(n)}`;
}

// ---------------------------------------------------------------------------
// The split plan
// ---------------------------------------------------------------------------

export interface SubnetRow {
  /** 1-based subnet number. */
  number: number;
  /** The borrowed bits that identify this subnet, e.g. "01". Empty when nothing is borrowed. */
  idBits: string;
  network: number;
  prefix: number;
  firstHost: number;
  lastHost: number;
  broadcast: number;
  info: SubnetInfo;
}

export interface SplitPlan {
  /** The original (parent) network, e.g. 192.168.1.0/24. */
  parent: SubnetInfo;
  base: number;
  origPrefix: number;
  newPrefix: number;
  borrowed: number;
  subnetCount: number;
  hostBits: number;
  addressesPerSubnet: number;
  /** "Typical" usable hosts: 2^H − 2 (ordinary subnets, /30 or shorter). */
  usablePerSubnet: number;
  newMask: number;
  rows: SubnetRow[];
}

/** Build the equal-size split of `address`'s /orig network into /next subnets. */
export function buildPlan(address: number, orig: number, next: number): SplitPlan {
  const o = clampOrig(orig);
  const n = clampNew(o, next);
  const parent = analyze(address, o);
  const borrowed = n - o;
  const subnetCount = 2 ** borrowed;
  const hostBits = 32 - n;
  const size = 2 ** hostBits;
  const rows: SubnetRow[] = [];
  for (let i = 0; i < subnetCount; i++) {
    const network = (parent.network + i * size) >>> 0;
    const info = analyze(network, n);
    rows.push({
      number: i + 1,
      idBits: borrowed === 0 ? "" : i.toString(2).padStart(borrowed, "0"),
      network,
      prefix: n,
      firstHost: info.firstHost,
      lastHost: info.lastHost,
      broadcast: info.broadcast,
      info,
    });
  }
  return {
    parent,
    base: parent.network,
    origPrefix: o,
    newPrefix: n,
    borrowed,
    subnetCount,
    hostBits,
    addressesPerSubnet: size,
    usablePerSubnet: size - 2,
    newMask: prefixToMask(n),
    rows,
  };
}

/** The subnet of the plan that contains `ip`, or null if `ip` is outside the original network. */
export function findSubnet(plan: SplitPlan, ip: number): SubnetRow | null {
  if (ip < plan.parent.network || ip > plan.parent.broadcast) return null;
  const idx = Math.floor((ip - plan.parent.network) / plan.addressesPerSubnet);
  return plan.rows[idx] ?? null;
}

export function cidr(ip: number, prefix: number): string {
  return `${formatIPv4(ip)}/${prefix}`;
}

// ---------------------------------------------------------------------------
// Bit roles: original network / borrowed / host
// ---------------------------------------------------------------------------

export type BitRole = "N" | "B" | "H";

export function bitRoles(orig: number, next: number): BitRole[] {
  return Array.from({ length: 32 }, (_, i) => (i < orig ? "N" : i < next ? "B" : "H"));
}

/** "NNNNNNNN.NNNNNNNN.NNNNNNNN.NNHHHHHH" — borrowed bits are network bits now, so they read N. */
export function patternText(orig: number, next: number): string {
  void orig;
  const chars = Array.from({ length: 32 }, (_, i) => (i < next ? "N" : "H"));
  return [0, 1, 2, 3].map((o) => chars.slice(o * 8, o * 8 + 8).join("")).join(".");
}

/** Binary subnet mask: "11111111.11111111.11111111.11000000". */
export function maskBinary(prefix: number): string {
  const chars = Array.from({ length: 32 }, (_, i) => (i < prefix ? "1" : "0"));
  return [0, 1, 2, 3].map((o) => chars.slice(o * 8, o * 8 + 8).join("")).join(".");
}

export interface MaskExplanation {
  lines: string[];
  partialOctet: number | null;
  partialValue: number | null;
}

/** How a prefix produces a mask, in plain steps. */
export function explainMask(prefix: number): MaskExplanation {
  const octets = toOctets(prefixToMask(prefix));
  const full = Math.floor(prefix / 8);
  const rem = prefix % 8;
  const lines: string[] = [`Write ${prefix} ones, then ${32 - prefix} zeros, to fill all 32 bits.`];
  if (full > 0) lines.push(`${full} full octet${full > 1 ? "s" : ""} of eight 1s: 11111111 = 255.`);
  if (rem > 0) {
    const value = octets[full]!;
    const bits = "1".repeat(rem) + "0".repeat(8 - rem);
    const parts = Array.from({ length: rem }, (_, i) => 2 ** (7 - i));
    lines.push(`Octet ${full + 1} has ${rem} one${rem > 1 ? "s" : ""} then ${8 - rem} zero${8 - rem > 1 ? "s" : ""}: ${bits} = ${parts.join(" + ")} = ${value}.`);
  }
  const zeroOctets = 4 - full - (rem > 0 ? 1 : 0);
  if (zeroOctets > 0) lines.push(`${zeroOctets} remaining octet${zeroOctets > 1 ? "s" : ""} of all 0s: 00000000 = 0.`);
  return { lines, partialOctet: rem > 0 ? full : null, partialValue: rem > 0 ? octets[full]! : null };
}

// ---------------------------------------------------------------------------
// Reasoning steps (shown, not just answered)
// ---------------------------------------------------------------------------

export interface ReasonStep {
  label: string;
  math: string;
  note: string;
}

export function reasoningSteps(plan: SplitPlan): ReasonStep[] {
  const { origPrefix: o, newPrefix: n, borrowed, subnetCount, hostBits, addressesPerSubnet, usablePerSubnet } = plan;
  const patterns = plan.rows.slice(0, 4).map((r) => r.idBits).filter(Boolean);
  const steps: ReasonStep[] = [
    {
      label: "1. Borrowed bits",
      math: `${n} − ${o} = ${borrowed}`,
      note: borrowed === 0 ? "The prefix did not change, so no bits are borrowed: the network is not divided." : `The new prefix is ${borrowed} bit${borrowed > 1 ? "s" : ""} longer. Those bits come from the host part and become subnet bits.`,
    },
    {
      label: "2. Number of subnets",
      math: `${pow2(borrowed)} = ${subnetCount}`,
      note: borrowed === 0 ? "One bit-pattern (none) means one network." : `${borrowed} borrowed bit${borrowed > 1 ? "s" : ""} can form ${subnetCount} different patterns${patterns.length ? ` (${patterns.join(", ")}${subnetCount > patterns.length ? ", ..." : ""})`: ""}, and each pattern names one subnet.`,
    },
    {
      label: "3. Remaining host bits",
      math: `32 − ${n} = ${hostBits}`,
      note: "Bits that were not borrowed and not already network bits are still host bits.",
    },
    {
      label: "4. Addresses per subnet",
      math: `${pow2(hostBits)} = ${addressesPerSubnet.toLocaleString()}`,
      note: `Cross-check: the original network has ${pow2(32 - o)} = ${plan.parent.totalAddresses.toLocaleString()} addresses, shared between ${subnetCount} subnet${subnetCount > 1 ? "s" : ""}: ${plan.parent.totalAddresses.toLocaleString()} ÷ ${subnetCount} = ${addressesPerSubnet.toLocaleString()}.`,
    },
    {
      label: "5. Typical usable hosts",
      math: `${addressesPerSubnet.toLocaleString()} − 2 = ${usablePerSubnet.toLocaleString()}`,
      note: "In an ordinary subnet the first address is the network address and the last is the broadcast address, so neither is given to a device.",
    },
    {
      label: "6. Where each subnet starts",
      math: subnetCount === 1 ? `${formatIPv4(plan.base)}` : `${formatIPv4(plan.rows[0]!.network)}, then +${addressesPerSubnet.toLocaleString()} each time`,
      note: subnetCount === 1 ? "Only one subnet, so it starts at the original network address." : `Each subnet is ${addressesPerSubnet.toLocaleString()} addresses long, so the next one starts ${addressesPerSubnet.toLocaleString()} addresses after the previous one.`,
    },
  ];
  return steps;
}

// ---------------------------------------------------------------------------
// Working out requirements
// ---------------------------------------------------------------------------

/** Smallest b such that 2^b >= n. */
export function borrowedBitsForSubnets(n: number): number {
  let b = 0;
  while (2 ** b < n) b++;
  return b;
}

/** Smallest host-bit count H (at least 2) with 2^H − 2 >= n. */
export function hostBitsForHosts(n: number): number {
  let h = 2;
  while (2 ** h - 2 < n) h++;
  return h;
}

export function prefixForSubnets(orig: number, n: number): number {
  return orig + borrowedBitsForSubnets(n);
}

export function prefixForHosts(n: number): number {
  return 32 - hostBitsForHosts(n);
}

export function usableFor(prefix: number): number {
  return 2 ** (32 - prefix) - 2;
}

export interface AnswerFeedback {
  correct: boolean;
  message: string;
}

// ---- "How many subnets?" ---------------------------------------------------

export interface SubnetsQuestion {
  id: string;
  story: string;
  network: string;
  orig: number;
  need: number;
  mode: "exact" | "atLeast";
}

export const SUBNET_QUESTIONS: SubnetsQuestion[] = [
  { id: "sq-4", story: "Divide 192.168.1.0/24 into 4 equal subnets.", network: "192.168.1.0", orig: 24, need: 4, mode: "exact" },
  { id: "sq-2", story: "Divide 192.168.1.0/24 into 2 equal subnets.", network: "192.168.1.0", orig: 24, need: 2, mode: "exact" },
  { id: "sq-8", story: "Divide 192.168.1.0/24 into 8 equal subnets.", network: "192.168.1.0", orig: 24, need: 8, mode: "exact" },
  { id: "sq-5", story: "A school needs at least 5 equal subnets from 192.168.1.0/24. Use the fewest borrowed bits that works.", network: "192.168.1.0", orig: 24, need: 5, mode: "atLeast" },
  { id: "sq-16", story: "Divide 10.0.0.0/16 into 16 equal subnets.", network: "10.0.0.0", orig: 16, need: 16, mode: "exact" },
];

export function subnetsHints(q: SubnetsQuestion): string[] {
  return [
    `How many bits must you borrow to create ${q.need} subnet identifiers? Remember: b borrowed bits give 2^b different subnets.`,
    q.mode === "exact" ? `Find the b where 2^b is exactly ${q.need}. Try b = 1, 2, 3 ... and double each time.` : `Find the smallest b where 2^b is at least ${q.need}. Try b = 1, 2, 3 ... and double each time.`,
    `The new prefix is the original prefix plus the borrowed bits: /${q.orig} + b.`,
  ];
}

export function checkSubnetsAnswer(q: SubnetsQuestion, prefix: number): AnswerFeedback {
  if (prefix < q.orig) return { correct: false, message: `/${prefix} is shorter than the original /${q.orig}. A shorter prefix joins networks; to split one you must make the prefix longer.` };
  const b = prefix - q.orig;
  const count = 2 ** b;
  const s = count === 1 ? "subnet" : "subnets";
  if (q.mode === "exact") {
    if (count === q.need) return { correct: true, message: `Correct: /${prefix} borrows ${b} bit${b === 1 ? "" : "s"}, and ${pow2(b)} = ${count} subnets.` };
    if (count < q.need) return { correct: false, message: `/${prefix} borrows ${b} bit${b === 1 ? "" : "s"} and gives only ${pow2(b)} = ${count} ${s}. You need ${q.need}. Borrow more bits.` };
    return { correct: false, message: `/${prefix} borrows ${b} bits and gives ${pow2(b)} = ${count} subnets, more than the ${q.need} you need. Borrow fewer bits.` };
  }
  if (count < q.need) return { correct: false, message: `/${prefix} gives only ${pow2(b)} = ${count} ${s}, fewer than the ${q.need} you need. Borrow more bits.` };
  if (count / 2 >= q.need) return { correct: false, message: `/${prefix} works (${count} subnets), but it borrows more bits than necessary. Could one fewer bit still give at least ${q.need}?` };
  return { correct: true, message: `Correct: /${prefix} borrows ${b} bits and gives ${pow2(b)} = ${count} subnets, the fewest that reaches ${q.need}.` };
}

// ---- "How many hosts?" -----------------------------------------------------

export interface HostsQuestion {
  id: string;
  story: string;
  need: number;
}

export const HOST_QUESTIONS: HostsQuestion[] = [
  { id: "hq-30", story: "You need approximately 30 usable host addresses per subnet.", need: 30 },
  { id: "hq-12", story: "A lab needs 12 usable host addresses in each subnet.", need: 12 },
  { id: "hq-100", story: "Each branch office needs about 100 usable host addresses.", need: 100 },
  { id: "hq-60", story: "Each floor needs approximately 60 usable host addresses.", need: 60 },
  { id: "hq-2", story: "A link between two routers needs 2 usable host addresses.", need: 2 },
  { id: "hq-200", story: "A campus building needs about 200 usable host addresses.", need: 200 },
];

/** Prefixes offered when picking a host-driven subnet size. */
export const HOST_PREFIX_CHOICES = [24, 25, 26, 27, 28, 29, 30];

export function hostsHints(q: HostsQuestion): string[] {
  return [
    `How many host bits H give at least ${q.need} usable addresses? Usable = 2^H − 2, because the network and broadcast addresses are not given to devices.`,
    "Each extra host bit doubles the number of addresses. Start small and double until the usable count reaches your target.",
    "Once you know H, the prefix is 32 − H, because the other bits are network bits.",
  ];
}

export function checkHostsAnswer(q: HostsQuestion, prefix: number): AnswerFeedback {
  const usable = usableFor(prefix);
  if (usable < q.need) return { correct: false, message: `/${prefix} leaves ${32 - prefix} host bits: ${pow2(32 - prefix)} − 2 = ${usable} usable hosts. That is fewer than the ${q.need} you need.` };
  if (prefix < MAX_NEW && usableFor(prefix + 1) >= q.need) return { correct: false, message: `/${prefix} gives ${usable} usable hosts, which is enough, but it is larger than necessary. A longer prefix would still fit ${q.need} hosts and would leave room for more subnets.` };
  return { correct: true, message: `Correct: /${prefix} leaves ${32 - prefix} host bits: ${pow2(32 - prefix)} − 2 = ${usable} usable hosts, the smallest subnet that fits ${q.need}.` };
}

// ---- Network requirements scenarios ---------------------------------------

export interface RequirementScenario {
  id: string;
  title: string;
  story: string;
  network: string;
  orig: number;
  need: { subnets?: number; hosts?: number };
  hints: string[];
}

export const REQUIREMENT_SCENARIOS: RequirementScenario[] = [
  {
    id: "rq-depts",
    title: "Four equal departments",
    story: "An organization has one 192.168.1.0/24 network and needs 4 equal departments, each on its own subnet.",
    network: "192.168.1.0",
    orig: 24,
    need: { subnets: 4 },
    hints: ["4 subnets need how many borrowed bits?", "Add the borrowed bits to /24 for the new prefix, then count the remaining host bits.", "The second subnet starts right after the first one ends: first network + addresses per subnet."],
  },
  {
    id: "rq-60hosts",
    title: "About 60 hosts per subnet",
    story: "An organization has 192.168.10.0/24 and needs approximately 60 usable hosts per subnet. Choose the subnet size that fits and does not waste more than necessary.",
    network: "192.168.10.0",
    orig: 24,
    need: { hosts: 60 },
    hints: ["How many host bits give at least 60 usable addresses? 2^H − 2 ≥ 60.", "Prefix = 32 − H. Then subnets = 2^(prefix − 24).", "The second subnet starts one full subnet-size after the first one."],
  },
  {
    id: "rq-labs",
    title: "Eight computer labs",
    story: "A college gives each of its 8 computer labs its own subnet, carved from 172.16.5.0/24 in equal sizes.",
    network: "172.16.5.0",
    orig: 24,
    need: { subnets: 8 },
    hints: ["8 = 2^b. What is b?", "Remaining host bits = 32 − new prefix.", "The second subnet starts one subnet-size above 172.16.5.0."],
  },
  {
    id: "rq-25hosts",
    title: "Roughly 25 hosts per subnet",
    story: "A company splits 10.10.10.0/24 into equal subnets of about 25 usable hosts each.",
    network: "10.10.10.0",
    orig: 24,
    need: { hosts: 25 },
    hints: ["Try host bits until 2^H − 2 is at least 25.", "New prefix = 32 − H. Number of subnets = 2^(new prefix − 24).", "Second subnet = first network + addresses per subnet."],
  },
  {
    id: "rq-campus",
    title: "Sixteen sites from a /16",
    story: "A campus network 10.0.0.0/16 must be divided into 16 equal subnets, one per site.",
    network: "10.0.0.0",
    orig: 16,
    need: { subnets: 16 },
    hints: ["16 = 2^b. What is b?", "Original prefix is /16, not /24. Add b to /16.", "The subnet size is 2^H addresses. In dotted decimal, 2^12 = 4096 = 16 × 256, so the third octet grows by 16 per subnet."],
  },
];

export function requirementPlan(s: RequirementScenario): SplitPlan {
  const base = parseIPv4(s.network);
  const start = base.ok ? base.value : 0;
  const next = s.need.subnets !== undefined ? prefixForSubnets(s.orig, s.need.subnets) : prefixForHosts(s.need.hosts ?? 2);
  return buildPlan(start, s.orig, next);
}

export interface RequirementAnswer {
  prefix: number | null;
  subnets: string;
  usable: string;
  second: string;
}

export interface RequirementResult {
  prefix: AnswerFeedback | null;
  subnets: AnswerFeedback | null;
  usable: AnswerFeedback | null;
  second: AnswerFeedback | null;
  allCorrect: boolean;
}

function strictInt(text: string): number | null {
  const t = text.trim().replace(/,/g, "");
  return /^\d+$/.test(t) ? Number(t) : null;
}

export function checkRequirement(s: RequirementScenario, a: RequirementAnswer): RequirementResult {
  const plan = requirementPlan(s);
  const r: RequirementResult = { prefix: null, subnets: null, usable: null, second: null, allCorrect: false };

  if (a.prefix === null) r.prefix = { correct: false, message: "Choose a new prefix first." };
  else if (a.prefix === plan.newPrefix) r.prefix = { correct: true, message: `/${a.prefix} is right for this requirement.` };
  else if (s.need.hosts !== undefined) r.prefix = { correct: false, message: `/${a.prefix} gives ${usableFor(a.prefix)} usable hosts per subnet. ${usableFor(a.prefix) < s.need.hosts ? "That is not enough." : "That is more than necessary; look for the smallest subnet that still fits."}` };
  else r.prefix = { correct: false, message: `/${a.prefix} gives ${2 ** Math.max(0, a.prefix - s.orig)} subnets. Check how many bits you must borrow for ${s.need.subnets} subnets.` };

  // The remaining answers are checked against what the student's own prefix implies, so a wrong prefix does not
  // hide otherwise correct reasoning; they only count as fully correct when the prefix is right too.
  const p = a.prefix !== null && a.prefix >= s.orig && a.prefix <= MAX_NEW ? a.prefix : null;
  if (p !== null) {
    const own = buildPlan(parseIPv4(s.network).ok ? (parseIPv4(s.network) as { ok: true; value: number }).value : 0, s.orig, p);
    const n = strictInt(a.subnets);
    r.subnets = n === null ? { correct: false, message: "Enter a whole number of subnets." } : n === own.subnetCount ? { correct: true, message: `${own.subnetCount} = ${pow2(own.borrowed)}.` } : { correct: false, message: `With /${p} you borrow ${own.borrowed} bit${own.borrowed === 1 ? "" : "s"}. How many subnets is that?` };
    const u = strictInt(a.usable);
    r.usable = u === null ? { correct: false, message: "Enter a whole number of usable hosts." } : u === own.usablePerSubnet ? { correct: true, message: `${pow2(own.hostBits)} − 2 = ${own.usablePerSubnet}.` } : { correct: false, message: `With /${p} there are ${own.hostBits} host bits. Count 2^${own.hostBits} addresses and remove the network and broadcast addresses.` };
    const sec = parseIPv4(a.second);
    const expected = own.rows[1];
    if (!sec.ok) r.second = { correct: false, message: "Enter the second subnet's network address, like 192.168.1.64." };
    else if (!expected) r.second = { correct: false, message: `With /${p} there is only one subnet, so there is no second subnet.` };
    else if (sec.value === expected.network) r.second = { correct: true, message: `Correct: ${formatIPv4(expected.network)}/${p}.` };
    else r.second = { correct: false, message: `The first subnet starts at ${formatIPv4(own.rows[0]!.network)} and holds ${own.addressesPerSubnet} addresses. Where does the next one begin?` };
  } else {
    r.subnets = { correct: false, message: "Choose a valid prefix first." };
    r.usable = r.subnets;
    r.second = r.subnets;
  }

  r.allCorrect = [r.prefix, r.subnets, r.usable, r.second].every((x) => x?.correct === true);
  return r;
}

// ---------------------------------------------------------------------------
// Same subnet / different subnet
// ---------------------------------------------------------------------------

export interface SubnetComparison {
  a: SubnetInfo;
  b: SubnetInfo;
  same: boolean;
  /** 1-based subnet number within the /24 that contains A (only for prefixes /24–/30). */
  numberA: number | null;
  numberB: number | null;
  issueA: string | null;
  issueB: string | null;
}

/** Subnet number inside the /24 block that contains `ip`, for prefixes /24 to /30. */
export function subnetNumberWithin24(ip: number, prefix: number): number | null {
  if (prefix < 24 || prefix > 30) return null;
  const size = 2 ** (32 - prefix);
  return Math.floor((ip & 0xff) / size) + 1;
}

export function compareSubnets(ipA: number, ipB: number, prefix: number): SubnetComparison {
  const c = compareNetworks(ipA, prefix, ipB, prefix);
  const sameParent24 = (ipA & 0xffffff00) >>> 0 === ((ipB & 0xffffff00) >>> 0);
  return {
    a: c.a,
    b: c.b,
    same: c.same,
    numberA: subnetNumberWithin24(ipA, prefix),
    numberB: sameParent24 ? subnetNumberWithin24(ipB, prefix) : null,
    issueA: hostAddressIssue(ipA, prefix)?.message ?? null,
    issueB: hostAddressIssue(ipB, prefix)?.message ?? null,
  };
}

export const COMPARE_PRESETS: { id: string; label: string; a: string; b: string; prefix: number }[] = [
  { id: "same", label: ".20 and .50 with /26", a: "192.168.1.20", b: "192.168.1.50", prefix: 26 },
  { id: "diff", label: ".20 and .80 with /26", a: "192.168.1.20", b: "192.168.1.80", prefix: 26 },
  { id: "edge", label: ".62 and .65 with /26 (near the edge)", a: "192.168.1.62", b: "192.168.1.65", prefix: 26 },
  { id: "wide", label: ".20 and .80 with /25", a: "192.168.1.20", b: "192.168.1.80", prefix: 25 },
];

// ---------------------------------------------------------------------------
// Allocation lab (a fixed 192.168.1.0/24 → /26 plan with four departments)
// ---------------------------------------------------------------------------

export const ALLOC_LETTERS = ["A", "B", "C", "D"] as const;
export type AllocLetter = (typeof ALLOC_LETTERS)[number];

export const ALLOC_DEPARTMENTS: { letter: AllocLetter; name: string }[] = [
  { letter: "A", name: "Sales" },
  { letter: "B", name: "Engineering" },
  { letter: "C", name: "HR" },
  { letter: "D", name: "Guest" },
];

export interface AllocDevice {
  id: string;
  name: string;
  dept: AllocLetter;
}

export const ALLOC_DEVICES: AllocDevice[] = [
  { id: "sales-pc", name: "Sales PC", dept: "A" },
  { id: "sales-printer", name: "Sales Printer", dept: "A" },
  { id: "eng-laptop", name: "Engineering Laptop", dept: "B" },
  { id: "eng-server", name: "Engineering Server", dept: "B" },
  { id: "hr-pc", name: "HR PC", dept: "C" },
  { id: "hr-phone", name: "HR IP Phone", dept: "C" },
  { id: "guest-tablet", name: "Guest Tablet", dept: "D" },
  { id: "guest-phone", name: "Guest Phone", dept: "D" },
];

export function allocPlan(): SplitPlan {
  return buildPlan(0xc0a80100, 24, 26);
}

/** First usable host after the router interface (the first host address) that is not yet taken. */
export function nextFreeHost(row: SubnetRow, taken: number[]): number | null {
  for (let a = row.firstHost + 1; a <= row.lastHost; a++) {
    if (!taken.includes(a)) return a;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Diagnose-a-subnet-plan data (used by a Challenge)
// ---------------------------------------------------------------------------

export interface DiagnoseDevice {
  id: string;
  name: string;
  ip: string;
  dept: AllocLetter;
}

/** Plan: 192.168.1.0/24 split into four /26 subnets: A=.0, B=.64, C=.128, D=.192. */
export const DIAGNOSE_DEVICES: DiagnoseDevice[] = [
  { id: "d1", name: "Sales PC", ip: "192.168.1.20", dept: "A" },
  { id: "d2", name: "Sales Printer", ip: "192.168.1.70", dept: "A" },
  { id: "d3", name: "Engineering Laptop", ip: "192.168.1.100", dept: "B" },
  { id: "d4", name: "Engineering Server", ip: "192.168.1.127", dept: "B" },
  { id: "d5", name: "HR PC", ip: "192.168.1.130", dept: "C" },
  { id: "d6", name: "Guest Tablet", ip: "192.168.1.150", dept: "D" },
];

export interface DiagnoseVerdict {
  ok: boolean;
  reason: string;
}

export function diagnoseDevice(d: DiagnoseDevice): DiagnoseVerdict {
  const plan = allocPlan();
  const ip = parseIPv4(d.ip);
  if (!ip.ok) return { ok: false, reason: "Not a valid address." };
  const row = findSubnet(plan, ip.value);
  const want = plan.rows[ALLOC_LETTERS.indexOf(d.dept)]!;
  if (!row) return { ok: false, reason: "Outside the 192.168.1.0/24 network." };
  if (row.number !== want.number) return { ok: false, reason: `${d.ip} is in ${cidr(row.network, row.prefix)} (Subnet ${ALLOC_LETTERS[row.number - 1]}), but ${d.name} belongs to Department ${d.dept}'s subnet ${cidr(want.network, want.prefix)}.` };
  if (ip.value === row.network) return { ok: false, reason: `${d.ip} is the network address of ${cidr(row.network, row.prefix)}; it cannot be given to a device.` };
  if (ip.value === row.broadcast) return { ok: false, reason: `${d.ip} is the broadcast address of ${cidr(row.network, row.prefix)}; it cannot be given to a device.` };
  return { ok: true, reason: `${d.ip} is a valid host address inside ${cidr(row.network, row.prefix)}.` };
}

// ---------------------------------------------------------------------------
// Quick guide
// ---------------------------------------------------------------------------

export const GUIDE_PREFIXES = [24, 25, 26, 27, 28, 29, 30];

export interface GuideRow {
  prefix: number;
  mask: string;
  hostBits: number;
  addresses: number;
  usable: number;
  subnetsFromSlash24: number;
  borrowedFromSlash24: number;
}

export function guideRows(): GuideRow[] {
  return GUIDE_PREFIXES.map((p) => ({
    prefix: p,
    mask: formatIPv4(prefixToMask(p)),
    hostBits: 32 - p,
    addresses: 2 ** (32 - p),
    usable: 2 ** (32 - p) - 2,
    subnetsFromSlash24: 2 ** (p - 24),
    borrowedFromSlash24: p - 24,
  }));
}

export const SPECIAL_CASES: { prefix: number; title: string; text: string }[] = [
  { prefix: 31, title: "/31 — point-to-point links", text: "A /31 has 2 addresses. Under RFC 3021 both may be used as host addresses on a point-to-point link, so the usual 'minus 2' rule does not apply. It is not used for ordinary equal-size LAN subnets." },
  { prefix: 32, title: "/32 — a single address", text: "A /32 names exactly one address (for example a loopback or a host route). There is no network/host split left, so there is no range, no broadcast, and the 'minus 2' rule does not apply." },
];

// ---------------------------------------------------------------------------
// Guided experiments
// ---------------------------------------------------------------------------

export type TabId = "split" | "binary" | "table" | "subnets" | "hosts" | "requirements" | "calculator" | "allocation" | "same" | "guide" | "experiments";

export type ExperimentSetup =
  | { kind: "plan"; network: string; orig: number; next: number }
  | { kind: "hosts"; questionId: string }
  | { kind: "compare"; presetId: string };

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
  setup: ExperimentSetup;
}

export const EXPERIMENTS: Experiment[] = [
  {
    id: "exp-1",
    title: "Experiment 1 — Split a /24 into 2 subnets",
    objective: "See how borrowing one host bit doubles the number of networks and halves each one.",
    startingState: "192.168.1.0/24 with the new prefix also /24 (nothing borrowed yet).",
    task: "Change the new prefix so that the network becomes exactly 2 equal subnets. Read the two network addresses in the subnet map.",
    hint: "How many bits must you borrow so that 2^b = 2?",
    observation: "Borrowing 1 bit gives /25: two subnets, 192.168.1.0/25 and 192.168.1.128/25, each with 128 addresses (126 typical usable hosts).",
    explanation: "One borrowed bit has two values, 0 and 1. The 0 half and the 1 half of the address space become two separate networks.",
    goTo: "split",
    goToLabel: "Open Split a Network",
    setup: { kind: "plan", network: "192.168.1.0", orig: 24, next: 24 },
  },
  {
    id: "exp-2",
    title: "Experiment 2 — Split a /24 into 4 subnets",
    objective: "Connect the number of subnets to the number of borrowed bits.",
    startingState: "192.168.1.0/24 with the new prefix /25 (one bit borrowed).",
    task: "Change the new prefix until the map shows 4 equal subnets, then open Binary & Mask and find the two borrowed bits.",
    hint: "Two subnets came from 1 bit. How many bits give four patterns (00, 01, 10, 11)?",
    observation: "/26 gives 4 subnets: .0, .64, .128, .192, each with 64 addresses and 62 typical usable hosts. The borrowed bits 00, 01, 10, 11 name the four subnets.",
    explanation: "Each extra borrowed bit doubles the subnet count and halves the addresses in each subnet: 2 bits → 4 subnets of 64.",
    goTo: "split",
    goToLabel: "Open Split a Network",
    setup: { kind: "plan", network: "192.168.1.0", orig: 24, next: 25 },
  },
  {
    id: "exp-3",
    title: "Experiment 3 — Split a /24 into 8 subnets",
    objective: "Predict subnet size before looking, then check it with the subnet table.",
    startingState: "192.168.1.0/24 with the new prefix /26.",
    task: "First predict how many addresses each of 8 subnets will have (256 ÷ 8). Then set the prefix and check the Subnet Table and Map tab.",
    hint: "8 subnets need 3 borrowed bits. That leaves how many host bits?",
    observation: "/27 gives 8 subnets of 32 addresses, 30 typical usable hosts each: .0, .32, .64, .96, .128, .160, .192, .224.",
    explanation: "3 borrowed bits give 2³ = 8 subnets. The remaining 5 host bits give 2⁵ = 32 addresses. More subnets always means smaller subnets.",
    goTo: "table",
    goToLabel: "Open Subnet Table & Map",
    setup: { kind: "plan", network: "192.168.1.0", orig: 24, next: 26 },
  },
  {
    id: "exp-4",
    title: "Experiment 4 — Choose a subnet size for a host requirement",
    objective: "Work from a host requirement back to a prefix.",
    startingState: "How many hosts? mode with the requirement of about 30 usable hosts per subnet.",
    task: "Try /28, /27 and /26 and compare their typical usable hosts to the requirement. Choose the smallest subnet that still fits, then check.",
    hint: "Usable hosts = 2^H − 2. Which H gives at least 30?",
    observation: "/28 has only 14 usable hosts (too few). /27 has 30 (fits exactly). /26 has 62 (fits but is bigger than needed).",
    explanation: "Work from hosts to host bits, then to the prefix: 30 hosts → H = 5 → prefix = 32 − 5 = /27.",
    goTo: "hosts",
    goToLabel: "Open How Many Hosts?",
    setup: { kind: "hosts", questionId: "hq-30" },
  },
  {
    id: "exp-5",
    title: "Experiment 5 — Identify which subnet two devices belong to",
    objective: "Use the subnet boundary to decide whether two devices are on the same subnet.",
    startingState: "Same or Different? tab with 192.168.1.20 and 192.168.1.80, both /26.",
    task: "Predict whether they share a subnet, then reveal the calculation. Then try .20 and .50, and .62 and .65.",
    hint: "With /26 the subnets are .0–.63, .64–.127, .128–.191 and .192–.255. Which block holds each address?",
    observation: ".20 is in 192.168.1.0/26 and .80 is in 192.168.1.64/26, so they are on different subnets. .20 and .50 are both in 192.168.1.0/26. .62 and .65 are only three apart but sit on opposite sides of a boundary.",
    explanation: "Two addresses share a subnet when address AND mask gives the same network address. Being numerically close does not matter; the boundary does.",
    goTo: "same",
    goToLabel: "Open Same or Different?",
    setup: { kind: "compare", presetId: "diff" },
  },
];

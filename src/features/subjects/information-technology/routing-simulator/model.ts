// ---------------------------------------------------------------------------
// Routing Simulator — pure model (no React).
//
// Scope: basic IPv4 routing. Hosts, a default gateway, router interfaces,
// connected routes, static routes, a default route (0.0.0.0/0) and
// longest-prefix ("most specific route") selection, on one or two routers.
// No dynamic routing protocols, metrics, NAT, ARP, ICMP, VLANs or firewalls.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// IPv4 helpers
// ---------------------------------------------------------------------------

/** Parse dotted-quad IPv4 into an unsigned 32-bit number, or null if malformed. */
export function parseIp(text: string): number | null {
  const parts = text.trim().split(".");
  if (parts.length !== 4) return null;
  let n = 0;
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p)) return null;
    const v = Number(p);
    if (v > 255) return null;
    n = n * 256 + v;
  }
  return n >>> 0;
}

export function formatIp(n: number): string {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
}

export function maskOf(prefix: number): number {
  return prefix <= 0 ? 0 : prefix >= 32 ? 0xffffffff : (0xffffffff << (32 - prefix)) >>> 0;
}

export function maskText(prefix: number): string {
  return formatIp(maskOf(prefix));
}

export function networkOf(ip: number, prefix: number): number {
  return (ip & maskOf(prefix)) >>> 0;
}

export function broadcastOf(ip: number, prefix: number): number {
  return (networkOf(ip, prefix) | (~maskOf(prefix) >>> 0)) >>> 0;
}

export function sameNetwork(a: number, b: number, prefix: number): boolean {
  return networkOf(a, prefix) === networkOf(b, prefix);
}

// ---------------------------------------------------------------------------
// Topology
// ---------------------------------------------------------------------------

export type ScenarioId = "single" | "multi";

export interface Iface {
  /** e.g. "G0/0" */
  name: string;
  ip: string;
  prefix: number;
  /** The network (segment) this interface is plugged into. */
  netId: string;
}

export interface Router {
  id: string;
  name: string;
  ifaces: Iface[];
}

export interface Host {
  id: string;
  name: string;
  ip: string;
  prefix: number;
  gateway: string;
  netId: string;
}

export interface Network {
  id: string;
  /** "Network A" */
  label: string;
  /** "192.168.1.0/24" */
  cidr: string;
  /** A LAN has hosts; a link joins two routers. */
  kind: "lan" | "link";
}

export type RouteType = "connected" | "static";

export interface Route {
  /** Network address, dotted. */
  dest: string;
  prefix: number;
  /** null for a connected route (deliver directly out the interface). */
  nextHop: string | null;
  iface: string;
  type: RouteType;
}

/** A static route as the student (or a preset) writes it. */
export interface StaticRouteSeed {
  router: string;
  dest: string;
  prefix: number;
  nextHop: string;
  iface: string;
}

export interface Scenario {
  id: ScenarioId;
  title: string;
  blurb: string;
  networks: Network[];
  routers: Router[];
  hosts: Host[];
  /** Static routes present when the scenario loads. */
  seeds: StaticRouteSeed[];
}

const LAN_A: Network = { id: "netA", label: "Network A", cidr: "192.168.1.0/24", kind: "lan" };

export const SCENARIOS: Record<ScenarioId, Scenario> = {
  single: {
    id: "single",
    title: "One router, two networks",
    blurb: "R1 connects Network A and Network B. Every network it needs is directly connected, so it needs no static routes.",
    networks: [LAN_A, { id: "netB", label: "Network B", cidr: "192.168.2.0/24", kind: "lan" }],
    routers: [
      {
        id: "R1",
        name: "R1",
        ifaces: [
          { name: "G0/0", ip: "192.168.1.1", prefix: 24, netId: "netA" },
          { name: "G0/1", ip: "192.168.2.1", prefix: 24, netId: "netB" },
        ],
      },
    ],
    hosts: [
      { id: "PC-A", name: "PC-A", ip: "192.168.1.10", prefix: 24, gateway: "192.168.1.1", netId: "netA" },
      { id: "PC-C", name: "PC-C", ip: "192.168.1.20", prefix: 24, gateway: "192.168.1.1", netId: "netA" },
      { id: "PC-B", name: "PC-B", ip: "192.168.2.10", prefix: 24, gateway: "192.168.2.1", netId: "netB" },
    ],
    seeds: [],
  },
  multi: {
    id: "multi",
    title: "Two routers, three networks",
    blurb: "R1 and R2 are joined by a small link network. Each router is directly connected to only two of the three networks, so it needs a static route to reach the third.",
    networks: [LAN_A, { id: "netB", label: "Network B", cidr: "10.0.0.0/30", kind: "link" }, { id: "netC", label: "Network C", cidr: "192.168.3.0/24", kind: "lan" }],
    routers: [
      {
        id: "R1",
        name: "R1",
        ifaces: [
          { name: "G0/0", ip: "192.168.1.1", prefix: 24, netId: "netA" },
          { name: "G0/1", ip: "10.0.0.1", prefix: 30, netId: "netB" },
        ],
      },
      {
        id: "R2",
        name: "R2",
        ifaces: [
          { name: "G0/0", ip: "10.0.0.2", prefix: 30, netId: "netB" },
          { name: "G0/1", ip: "192.168.3.1", prefix: 24, netId: "netC" },
        ],
      },
    ],
    hosts: [
      { id: "PC-A", name: "PC-A", ip: "192.168.1.10", prefix: 24, gateway: "192.168.1.1", netId: "netA" },
      { id: "PC-B", name: "PC-B", ip: "192.168.3.10", prefix: 24, gateway: "192.168.3.1", netId: "netC" },
    ],
    seeds: [
      { router: "R1", dest: "192.168.3.0", prefix: 24, nextHop: "10.0.0.2", iface: "G0/1" },
      { router: "R2", dest: "192.168.1.0", prefix: 24, nextHop: "10.0.0.1", iface: "G0/0" },
    ],
  },
};

export const SCENARIO_IDS: ScenarioId[] = ["single", "multi"];

export function hostById(sc: Scenario, id: string): Host {
  return sc.hosts.find((h) => h.id === id) ?? sc.hosts[0]!;
}
export function routerById(sc: Scenario, id: string): Router {
  return sc.routers.find((r) => r.id === id) ?? sc.routers[0]!;
}
export function networkById(sc: Scenario, id: string): Network {
  return sc.networks.find((n) => n.id === id)!;
}
export function ifaceOf(router: Router, name: string): Iface | undefined {
  return router.ifaces.find((i) => i.name === name);
}
/** The interface (and its router) that owns this IP, if any. */
export function ifaceOwningIp(sc: Scenario, ip: string): { router: Router; iface: Iface } | undefined {
  for (const router of sc.routers) {
    const iface = router.ifaces.find((i) => i.ip === ip);
    if (iface) return { router, iface };
  }
  return undefined;
}
export function hostWithIp(sc: Scenario, ip: string): Host | undefined {
  return sc.hosts.find((h) => h.ip === ip);
}

// ---------------------------------------------------------------------------
// Routing tables
// ---------------------------------------------------------------------------

export type RoutingTables = Record<string, Route[]>;

export function routeLabel(r: Pick<Route, "dest" | "prefix">): string {
  return `${r.dest}/${r.prefix}`;
}

export function isDefaultRoute(r: Pick<Route, "prefix">): boolean {
  return r.prefix === 0;
}

/** Connected routes are derived from the interface addresses; nobody types them. */
export function connectedRoutes(router: Router): Route[] {
  return router.ifaces.map((i) => ({
    dest: formatIp(networkOf(parseIp(i.ip)!, i.prefix)),
    prefix: i.prefix,
    nextHop: null,
    iface: i.name,
    type: "connected" as const,
  }));
}

/** Sort for display: by network address, then by prefix length. */
export function sortRoutes(routes: Route[]): Route[] {
  return [...routes].sort((a, b) => (parseIp(a.dest)! - parseIp(b.dest)!) || a.prefix - b.prefix);
}

export function buildTables(sc: Scenario, seeds: StaticRouteSeed[]): RoutingTables {
  const tables: RoutingTables = {};
  for (const r of sc.routers) tables[r.id] = connectedRoutes(r);
  for (const s of seeds) {
    tables[s.router]?.push({ dest: s.dest, prefix: s.prefix, nextHop: s.nextHop, iface: s.iface, type: "static" });
  }
  return tables;
}

export interface RouteMatch {
  route: Route;
  /** Index in the router's route list. */
  index: number;
}

export interface LookupResult {
  /** Every route whose prefix contains the destination, longest prefix first. */
  matches: RouteMatch[];
  best: RouteMatch | null;
  /** True when the only match is the default route 0.0.0.0/0. */
  usedDefault: boolean;
}

export function routeMatches(route: Route, dst: number): boolean {
  return networkOf(dst, route.prefix) === parseIp(route.dest);
}

/** Longest-prefix match: the most specific matching route wins; 0.0.0.0/0 matches everything but loses to anything more specific. */
export function lookupRoute(routes: Route[], dst: number): LookupResult {
  const matches: RouteMatch[] = [];
  routes.forEach((route, index) => {
    if (routeMatches(route, dst)) matches.push({ route, index });
  });
  matches.sort((a, b) => b.route.prefix - a.route.prefix);
  const best = matches[0] ?? null;
  return { matches, best, usedDefault: !!best && best.route.prefix === 0 };
}

// ---------------------------------------------------------------------------
// Static route validation
// ---------------------------------------------------------------------------

export interface RouteInput {
  router: string;
  dest: string;
  prefix: string;
  nextHop: string;
  /** "auto" picks the interface from the next hop. */
  iface: string;
}

export type RouteValidation = { ok: true; seed: StaticRouteSeed } | { ok: false; error: string };

export function validateStaticRoute(sc: Scenario, tables: RoutingTables, input: RouteInput): RouteValidation {
  const router = sc.routers.find((r) => r.id === input.router);
  if (!router) return { ok: false, error: "Unknown router." };

  const dest = parseIp(input.dest);
  if (dest === null) return { ok: false, error: "Destination must be an IPv4 network address such as 192.168.3.0." };

  if (!/^\d{1,2}$/.test(input.prefix.trim())) return { ok: false, error: "Prefix length must be a whole number from 0 to 32." };
  const prefix = Number(input.prefix.trim());
  if (prefix < 0 || prefix > 32) return { ok: false, error: "Prefix length must be a whole number from 0 to 32." };

  if (networkOf(dest, prefix) !== dest) {
    return { ok: false, error: `${formatIp(dest)}/${prefix} has host bits set. The network address for that prefix is ${formatIp(networkOf(dest, prefix))}.` };
  }

  const nextHop = parseIp(input.nextHop);
  if (nextHop === null) return { ok: false, error: "Next hop must be the IPv4 address of a router on a directly connected network, such as 10.0.0.2." };

  // Which interface leads to the next hop?
  const candidates = router.ifaces.filter((i) => sameNetwork(parseIp(i.ip)!, nextHop, i.prefix));
  let iface: Iface | undefined;
  if (input.iface === "auto") {
    iface = candidates[0];
    if (!iface) return { ok: false, error: `${router.name} has no interface on the same network as ${formatIp(nextHop)}, so it cannot reach that next hop. A next hop must be on a directly connected network.` };
  } else {
    iface = ifaceOf(router, input.iface);
    if (!iface) return { ok: false, error: "Unknown interface." };
    if (!sameNetwork(parseIp(iface.ip)!, nextHop, iface.prefix)) {
      return { ok: false, error: `${formatIp(nextHop)} is not on the network of ${iface.name} (${formatIp(networkOf(parseIp(iface.ip)!, iface.prefix))}/${iface.prefix}). Pick the interface that faces the next hop.` };
    }
  }

  const ifaceIp = parseIp(iface.ip)!;
  if (nextHop === ifaceIp) return { ok: false, error: `${formatIp(nextHop)} is ${router.name}'s own address on ${iface.name}. The next hop must be a different device.` };
  if (nextHop === networkOf(ifaceIp, iface.prefix) || (iface.prefix < 31 && nextHop === broadcastOf(ifaceIp, iface.prefix))) {
    return { ok: false, error: `${formatIp(nextHop)} is the network or broadcast address of ${iface.name}'s network, not a device.` };
  }

  const existing = tables[router.id]?.find((r) => parseIp(r.dest) === dest && r.prefix === prefix);
  if (existing) {
    return {
      ok: false,
      error: existing.type === "connected" ? `${formatIp(dest)}/${prefix} is directly connected to ${router.name} already. The connected route is created automatically.` : `${router.name} already has a route to ${formatIp(dest)}/${prefix}. Remove it first to change it.`,
    };
  }

  return { ok: true, seed: { router: router.id, dest: formatIp(dest), prefix, nextHop: formatIp(nextHop), iface: iface.name } };
}

// ---------------------------------------------------------------------------
// Destination check (before sending)
// ---------------------------------------------------------------------------

export function validateDestination(src: Host, text: string): { ok: true; ip: string } | { ok: false; error: string } {
  const n = parseIp(text);
  if (n === null) return { ok: false, error: "Enter a valid IPv4 address such as 192.168.3.10." };
  const ip = formatIp(n);
  if (ip === src.ip) return { ok: false, error: `${src.name} cannot send a packet to its own address.` };
  return { ok: true, ip };
}

// ---------------------------------------------------------------------------
// Packet plan: the whole journey, computed up front from the current tables.
// Route edits are blocked while a packet is in flight, so the plan stays valid.
// ---------------------------------------------------------------------------

export type Anchor = { t: "host"; id: string } | { t: "port"; router: string; iface: string } | { t: "router"; id: string };

export type StepKind = "create" | "determine" | "to-gateway" | "receive" | "lookup" | "select" | "forward" | "drop" | "deliver";

export type Outcome = "delivered" | "dropped" | "no-host";

export type LogKind = "created" | "network" | "gateway" | "received" | "lookup" | "match" | "nomatch" | "forward" | "deliver" | "drop" | "route" | "info";

export const LOG_LABEL: Record<LogKind, string> = {
  created: "Packet Created",
  network: "Network Check",
  gateway: "Default Gateway",
  received: "Received",
  lookup: "Table Lookup",
  match: "Route Selected",
  nomatch: "No Route",
  forward: "Forward",
  deliver: "Delivered",
  drop: "Dropped",
  route: "Route Change",
  info: "Info",
};

export interface Inspect {
  device: string;
  inIface?: string;
  outIface?: string;
  nextHop?: string;
  route?: string;
  ttl: number;
  /** Short verdict shown in the inspector. */
  decision: string;
  reason?: string;
}

export interface PlanStep {
  kind: StepKind;
  /** 1..8: the stage shown in the stepper. */
  phase: number;
  at: Anchor;
  /** Diagram elements to light up from this step onward. */
  touch: string[];
  /** The router being processed, if any. */
  router?: string;
  lookup?: LookupResult;
  text: string;
  log: [LogKind, string];
  inspect: Inspect;
  /** Present on the last step only. */
  outcome?: Outcome;
}

export interface Plan {
  srcId: string;
  srcIp: string;
  dstIp: string;
  steps: PlanStep[];
  outcome: Outcome;
}

export interface Phase {
  n: number;
  label: string;
}

export const PHASES: Phase[] = [
  { n: 1, label: "Create Packet" },
  { n: 2, label: "Determine Destination Network" },
  { n: 3, label: "Send to Gateway" },
  { n: 4, label: "Router Receives Packet" },
  { n: 5, label: "Routing Table Lookup" },
  { n: 6, label: "Select Route" },
  { n: 7, label: "Forward Packet" },
  { n: 8, label: "Destination Receives Packet" },
];

export const START_TTL = 64;
/** The lab stops a looping packet after this many router hops. */
export const MAX_HOPS = 6;

const lanElems = (netId: string, hostId?: string): string[] => (hostId ? [`host:${hostId}`, `net:${netId}`] : [`net:${netId}`]);

export function buildPlan(sc: Scenario, tables: RoutingTables, srcId: string, dstText: string): Plan {
  const src = hostById(sc, srcId);
  const dstN = parseIp(dstText)!;
  const dstIp = formatIp(dstN);
  const steps: PlanStep[] = [];
  let ttl = START_TTL;

  const base = (device: string): Inspect => ({ device, ttl, decision: "—" });

  // 1. Create ---------------------------------------------------------------
  steps.push({
    kind: "create",
    phase: 1,
    at: { t: "host", id: src.id },
    touch: [`host:${src.id}`],
    text: `${src.name} (${src.ip}) creates an IP packet. The source IP is ${src.ip} and the destination IP is ${dstIp}.`,
    log: ["created", `${src.name} created a packet: ${src.ip} → ${dstIp}`],
    inspect: { ...base(src.name), decision: "CREATED" },
  });

  // 2. Same network, or not? ------------------------------------------------
  const same = sameNetwork(parseIp(src.ip)!, dstN, src.prefix);
  const srcNet = networkOf(parseIp(src.ip)!, src.prefix);
  const dstNetForSrc = networkOf(dstN, src.prefix);
  const mask = maskText(src.prefix);

  if (same) {
    steps.push({
      kind: "determine",
      phase: 2,
      at: { t: "host", id: src.id },
      touch: [],
      text: `${src.name} compares the destination with its own network: ${src.ip} AND ${mask} = ${formatIp(srcNet)}, and ${dstIp} AND ${mask} = ${formatIp(dstNetForSrc)}. They match, so the destination is on the SAME network. No router is needed for this packet.`,
      log: ["network", `Destination ${dstIp} is on the same network (${formatIp(srcNet)}/${src.prefix}) - no router needed`],
      inspect: { ...base(src.name), decision: "SAME NETWORK", reason: "Destination is on the local network, so it is delivered directly (no routing)." },
    });
    const owner = ifaceOwningIp(sc, dstIp);
    const dstHost = hostWithIp(sc, dstIp);
    if (dstHost && dstHost.netId === src.netId) {
      steps.push({
        kind: "deliver",
        phase: 8,
        at: { t: "host", id: dstHost.id },
        touch: [...lanElems(src.netId), `host:${dstHost.id}`],
        text: `${dstHost.name} (${dstHost.ip}) is on the same network, so the packet is delivered directly. It never reached a router.`,
        log: ["deliver", `${dstHost.name} received the packet directly (same network)`],
        inspect: { ...base(dstHost.name), decision: "DELIVERED", reason: "Same network: delivered directly." },
        outcome: "delivered",
      });
      return { srcId: src.id, srcIp: src.ip, dstIp, steps, outcome: "delivered" };
    }
    if (owner && owner.iface.netId === src.netId) {
      steps.push({
        kind: "deliver",
        phase: 8,
        at: { t: "port", router: owner.router.id, iface: owner.iface.name },
        touch: [...lanElems(src.netId), `port:${owner.router.id}:${owner.iface.name}`, `router:${owner.router.id}`],
        text: `${dstIp} is ${owner.router.name}'s own address on ${owner.iface.name}. The packet is addressed to the router itself, so ${owner.router.name} keeps it instead of forwarding it.`,
        log: ["deliver", `${owner.router.name} received a packet addressed to its own interface ${owner.iface.name}`],
        inspect: { ...base(owner.router.name), inIface: owner.iface.name, decision: "FOR THIS ROUTER", reason: "The destination is one of the router's own addresses." },
        outcome: "delivered",
      });
      return { srcId: src.id, srcIp: src.ip, dstIp, steps, outcome: "delivered" };
    }
    steps.push({
      kind: "deliver",
      phase: 8,
      at: { t: "host", id: src.id },
      touch: lanElems(src.netId),
      text: `${dstIp} is on the same network, but no device in this lab has that address. The packet is sent onto the local network, and nobody accepts it.`,
      log: ["drop", `No device with address ${dstIp} on ${formatIp(srcNet)}/${src.prefix}`],
      inspect: { ...base(src.name), decision: "NO SUCH HOST", reason: `No device on ${formatIp(srcNet)}/${src.prefix} has the address ${dstIp}.` },
      outcome: "no-host",
    });
    return { srcId: src.id, srcIp: src.ip, dstIp, steps, outcome: "no-host" };
  }

  // Remote destination: send to the default gateway -----------------------
  steps.push({
    kind: "determine",
    phase: 2,
    at: { t: "host", id: src.id },
    touch: [],
    text: `${src.name} compares the destination with its own network: ${src.ip} AND ${mask} = ${formatIp(srcNet)}, but ${dstIp} AND ${mask} = ${formatIp(dstNetForSrc)}. They are different, so the destination is on a REMOTE network. A host sends traffic for a remote network to its default gateway.`,
    log: ["network", `Destination ${dstIp} is on a remote network (${formatIp(dstNetForSrc)}/${src.prefix}, not ${formatIp(srcNet)}/${src.prefix})`],
    inspect: { ...base(src.name), nextHop: src.gateway, decision: "REMOTE NETWORK", reason: "Different network: send to the default gateway." },
  });

  const gw = ifaceOwningIp(sc, src.gateway)!;
  steps.push({
    kind: "to-gateway",
    phase: 3,
    at: { t: "port", router: gw.router.id, iface: gw.iface.name },
    touch: [...lanElems(src.netId), `port:${gw.router.id}:${gw.iface.name}`],
    text: `${src.name} sends the packet to its default gateway ${src.gateway}, which is ${gw.router.name}'s ${gw.iface.name} interface. The packet's destination IP stays ${dstIp}; the gateway is only the first stop.`,
    log: ["gateway", `Packet sent to default gateway ${src.gateway} (${gw.router.name} ${gw.iface.name})`],
    inspect: { ...base(src.name), outIface: "NIC", nextHop: src.gateway, decision: "SEND TO GATEWAY", reason: "Remote destination → default gateway." },
  });

  // Router loop ---------------------------------------------------------------
  let cur = { router: gw.router, iface: gw.iface };
  const visited: string[] = [];

  for (let hop = 0; hop < MAX_HOPS + 1; hop++) {
    const rt = cur.router;
    const table = tables[rt.id] ?? [];
    const inName = cur.iface.name;
    visited.push(rt.id);

    if (hop >= MAX_HOPS) {
      steps.push({
        kind: "drop",
        phase: 7,
        at: { t: "router", id: rt.id },
        touch: [],
        router: rt.id,
        text: `The packet has now crossed ${MAX_HOPS} routers and is still bouncing between ${[...new Set(visited)].join(" and ")}. This is a routing loop. Every router lowers the packet's TTL by 1, so a real packet would eventually reach 0 and be discarded. The lab stops here.`,
        log: ["drop", `Routing loop detected after ${MAX_HOPS} hops - a real packet would be discarded when its TTL reaches 0`],
        inspect: { ...base(rt.name), inIface: inName, decision: "DROP / LOOP", reason: "Routing loop: the TTL would eventually reach 0." },
        outcome: "dropped",
      });
      return { srcId: src.id, srcIp: src.ip, dstIp, steps, outcome: "dropped" };
    }

    // 4. Receive
    steps.push({
      kind: "receive",
      phase: 4,
      at: { t: "port", router: rt.id, iface: inName },
      touch: [`port:${rt.id}:${inName}`, `router:${rt.id}`],
      router: rt.id,
      text: `${rt.name} receives the packet on ${inName} (${cur.iface.ip}/${cur.iface.prefix}). It reads the destination IP address: ${dstIp}.`,
      log: ["received", `${rt.name} received the packet on ${inName}`],
      inspect: { ...base(rt.name), inIface: inName, decision: "RECEIVED" },
    });

    // For me?
    const own = rt.ifaces.find((i) => i.ip === dstIp);
    if (own) {
      steps.push({
        kind: "deliver",
        phase: 8,
        at: { t: "router", id: rt.id },
        touch: [],
        router: rt.id,
        text: `${dstIp} is ${rt.name}'s own address on ${own.name}. The packet is addressed to the router itself, so ${rt.name} keeps it instead of looking up a route.`,
        log: ["deliver", `${rt.name} received a packet addressed to its own interface ${own.name}`],
        inspect: { ...base(rt.name), inIface: inName, decision: "FOR THIS ROUTER", reason: "The destination is one of the router's own addresses." },
        outcome: "delivered",
      });
      return { srcId: src.id, srcIp: src.ip, dstIp, steps, outcome: "delivered" };
    }

    // 5. Lookup
    const lookup = lookupRoute(table, dstN);
    const nMatch = lookup.matches.length;
    steps.push({
      kind: "lookup",
      phase: 5,
      at: { t: "router", id: rt.id },
      touch: [],
      router: rt.id,
      lookup,
      text:
        nMatch === 0
          ? `${rt.name} checks its routing table for a route that contains ${dstIp}. No route matches.`
          : nMatch === 1
            ? `${rt.name} checks its routing table for a route that contains ${dstIp}. One route matches: ${routeLabel(lookup.matches[0]!.route)}.`
            : `${rt.name} checks its routing table for routes that contain ${dstIp}. ${nMatch} routes match: ${lookup.matches.map((m) => routeLabel(m.route)).join(", ")}.`,
      log: ["lookup", `${rt.name} routing table lookup for ${dstIp}: ${nMatch === 0 ? "no matching route" : `${nMatch} matching route${nMatch === 1 ? "" : "s"}`}`],
      inspect: { ...base(rt.name), inIface: inName, decision: "LOOKING UP", route: nMatch ? lookup.matches.map((m) => routeLabel(m.route)).join(", ") : undefined },
    });

    // 6. Select
    const best = lookup.best;
    if (!best) {
      steps.push({
        kind: "select",
        phase: 6,
        at: { t: "router", id: rt.id },
        touch: [],
        router: rt.id,
        lookup,
        text: `No route in ${rt.name}'s table contains ${dstIp}, and there is no default route (0.0.0.0/0). ${rt.name} does not know where to send this packet.`,
        log: ["nomatch", `${rt.name}: no matching route for ${dstIp}`],
        inspect: { ...base(rt.name), inIface: inName, decision: "NO MATCHING ROUTE", reason: "No matching route and no default route." },
      });
      steps.push({
        kind: "drop",
        phase: 7,
        at: { t: "router", id: rt.id },
        touch: [],
        router: rt.id,
        lookup,
        text: `NO ROUTE FOUND. A router cannot forward a packet toward a destination network it has no route for, unless a default route applies. ${rt.name} discards the packet.`,
        log: ["drop", `${rt.name} dropped the packet: no route to ${dstIp}`],
        inspect: { ...base(rt.name), inIface: inName, decision: "DROP / CANNOT FORWARD", reason: "No matching route" },
        outcome: "dropped",
      });
      return { srcId: src.id, srcIp: src.ip, dstIp, steps, outcome: "dropped" };
    }

    const r = best.route;
    const tie = lookup.matches.length > 1 ? (lookup.usedDefault ? "" : ` It is the most specific match (/${r.prefix} is longer than the others).`) : "";
    const selectText = lookup.usedDefault
      ? `No more specific route matches, so ${rt.name} uses the default route ${routeLabel(r)}. A default route is used when nothing more specific matches.`
      : `${rt.name} selects ${routeLabel(r)} (${r.type === "connected" ? "connected" : "static"}).${tie}`;
    steps.push({
      kind: "select",
      phase: 6,
      at: { t: "router", id: rt.id },
      touch: [],
      router: rt.id,
      lookup,
      text: selectText,
      log: ["match", lookup.usedDefault ? `${rt.name} used the default route ${routeLabel(r)}` : `${rt.name} selected ${routeLabel(r)}${lookup.matches.length > 1 ? " (most specific match)" : ""}`],
      inspect: { ...base(rt.name), inIface: inName, route: routeLabel(r), outIface: r.iface, nextHop: r.nextHop ?? undefined, decision: "ROUTE SELECTED" },
    });

    // 7. Forward
    const outIface = ifaceOf(rt, r.iface)!;
    ttl -= 1;
    const outNet = outIface.netId;
    const outPort = `port:${rt.id}:${outIface.name}`;

    if (r.nextHop === null) {
      // Connected: deliver on the outgoing network.
      const destHost = hostWithIp(sc, dstIp);
      const destRouter = ifaceOwningIp(sc, dstIp);
      steps.push({
        kind: "forward",
        phase: 7,
        at: { t: "port", router: rt.id, iface: outIface.name },
        touch: [outPort, `net:${outNet}`],
        router: rt.id,
        lookup,
        text: `${routeLabel(r)} is directly connected to ${rt.name}'s ${outIface.name}, so there is no next-hop router. ${rt.name} lowers the TTL to ${ttl} and sends the packet out ${outIface.name}, straight onto that network, toward ${dstIp}.`,
        log: ["forward", `${rt.name} forwarded the packet out ${outIface.name} (directly connected network)`],
        inspect: { ...base(rt.name), inIface: inName, outIface: outIface.name, route: routeLabel(r), nextHop: "directly connected", decision: "FORWARD" },
      });
      if (destHost && destHost.netId === outNet) {
        steps.push({
          kind: "deliver",
          phase: 8,
          at: { t: "host", id: destHost.id },
          touch: [`host:${destHost.id}`],
          text: `${destHost.name} (${destHost.ip}) receives the packet. The packet crossed ${new Set(visited).size === 1 ? "one router" : `${new Set(visited).size} routers`}, and its source and destination IP addresses never changed.`,
          log: ["deliver", `${destHost.name} received the packet`],
          inspect: { ...base(destHost.name), decision: "DELIVERED", reason: "Packet reached its destination." },
          outcome: "delivered",
        });
        return { srcId: src.id, srcIp: src.ip, dstIp, steps, outcome: "delivered" };
      }
      if (destRouter && destRouter.iface.netId === outNet && destRouter.router.id !== rt.id) {
        steps.push({
          kind: "deliver",
          phase: 8,
          at: { t: "port", router: destRouter.router.id, iface: destRouter.iface.name },
          touch: [`port:${destRouter.router.id}:${destRouter.iface.name}`, `router:${destRouter.router.id}`],
          text: `${dstIp} is ${destRouter.router.name}'s own address on ${destRouter.iface.name}, so the packet is delivered to that router.`,
          log: ["deliver", `${destRouter.router.name} received a packet addressed to its own interface ${destRouter.iface.name}`],
          inspect: { ...base(destRouter.router.name), inIface: destRouter.iface.name, decision: "FOR THIS ROUTER", reason: "The destination is one of the router's own addresses." },
          outcome: "delivered",
        });
        return { srcId: src.id, srcIp: src.ip, dstIp, steps, outcome: "delivered" };
      }
      steps.push({
        kind: "deliver",
        phase: 8,
        at: { t: "port", router: rt.id, iface: outIface.name },
        touch: [],
        text: `The packet reached ${routeLabel(r)}, but no device there has the address ${dstIp}. The route worked; there is simply no host to receive the packet.`,
        log: ["drop", `Packet reached ${routeLabel(r)} but no device has the address ${dstIp}`],
        inspect: { ...base(rt.name), outIface: outIface.name, decision: "NO SUCH HOST", reason: `The network exists but nothing there owns ${dstIp}.` },
        outcome: "no-host",
      });
      return { srcId: src.id, srcIp: src.ip, dstIp, steps, outcome: "no-host" };
    }

    // Static next hop: find the router that owns the next-hop address on this link.
    const nh = ifaceOwningIp(sc, r.nextHop);
    const nextOk = !!nh && nh.iface.netId === outNet && nh.router.id !== rt.id;
    steps.push({
      kind: "forward",
      phase: 7,
      at: { t: "port", router: rt.id, iface: outIface.name },
      touch: [outPort, `net:${outNet}`],
      router: rt.id,
      lookup,
      text: `${rt.name} lowers the TTL to ${ttl} and forwards the packet out ${outIface.name} toward the next hop ${r.nextHop}. The destination IP is still ${dstIp}; only the next hop changed.`,
      log: ["forward", `${rt.name} forwarded the packet out ${outIface.name} to next hop ${r.nextHop}`],
      inspect: { ...base(rt.name), inIface: inName, outIface: outIface.name, route: routeLabel(r), nextHop: r.nextHop, decision: "FORWARD" },
    });
    if (!nextOk) {
      steps.push({
        kind: "drop",
        phase: 7,
        at: { t: "port", router: rt.id, iface: outIface.name },
        touch: [],
        router: rt.id,
        lookup,
        text: `No router answers at the next hop ${r.nextHop}. The route points at an address nobody on that link owns, so the packet goes nowhere.`,
        log: ["drop", `Next hop ${r.nextHop} did not answer - packet lost`],
        inspect: { ...base(rt.name), outIface: outIface.name, nextHop: r.nextHop, decision: "DROP / NEXT HOP DOWN", reason: `Nothing on ${outIface.name}'s network owns ${r.nextHop}.` },
        outcome: "dropped",
      });
      return { srcId: src.id, srcIp: src.ip, dstIp, steps, outcome: "dropped" };
    }
    cur = { router: nh!.router, iface: nh!.iface };
  }

  // Unreachable: the loop above always returns. Kept for the type checker.
  return { srcId: src.id, srcIp: src.ip, dstIp, steps, outcome: "dropped" };
}

// ---------------------------------------------------------------------------
// Presets used by the experiments
// ---------------------------------------------------------------------------

export const NO_STATIC: StaticRouteSeed[] = [];

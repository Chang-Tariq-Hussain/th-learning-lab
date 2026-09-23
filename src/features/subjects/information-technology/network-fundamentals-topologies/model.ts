/**
 * Pure data model for the Network Fundamentals & Topologies
 * simulation — the first topic in the new Networking branch of
 * Information Technology.
 *
 * Deliberately introductory: this models devices, links, topologies,
 * and a simplified packet/performance layer, but never touches IP
 * addresses, MAC addresses, ARP, DHCP, DNS, or transport-layer
 * protocols. Those are reserved for later simulations in the
 * Networking branch (see the informationTechnologyNetworkingFundamentalsPath
 * learning path).
 *
 * Every numeric "bandwidth", "latency", or "throughput" value here is
 * illustrative teaching data, not a measurement of any real link —
 * components that display these values say so.
 */

// ---------------------------------------------------------------------------
// Core graph model
// ---------------------------------------------------------------------------

export type DeviceType =
  | "pc"
  | "laptop"
  | "server"
  | "printer"
  | "router"
  | "switch"
  | "ap"
  | "cloud"
  | "phone";

export interface Device {
  id: string;
  type: DeviceType;
  label: string;
  x: number;
  y: number;
}

export type LinkType = "wired" | "fiber" | "wireless";

export interface Link {
  id: string;
  a: string;
  b: string;
  type: LinkType;
}

export interface NetworkState {
  devices: Device[];
  links: Link[];
}

let idCounter = 0;
/** Deterministic-enough id generator for client-only state — no
 *  server round trip, so a simple incrementing counter is fine and
 *  keeps snapshots easy to reason about in tests. */
function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createEmptyNetwork(): NetworkState {
  return { devices: [], links: [] };
}

export const DEVICE_TYPE_ORDER: DeviceType[] = [
  "pc",
  "laptop",
  "phone",
  "server",
  "printer",
  "switch",
  "router",
  "ap",
  "cloud",
];

function labelPrefix(type: DeviceType): string {
  switch (type) {
    case "pc":
      return "PC";
    case "laptop":
      return "Laptop";
    case "server":
      return "Server";
    case "printer":
      return "Printer";
    case "router":
      return "Router";
    case "switch":
      return "Switch";
    case "ap":
      return "AP";
    case "cloud":
      return "Internet";
    case "phone":
      return "Phone";
  }
}

export function addDevice(state: NetworkState, type: DeviceType, x = 200, y = 150): NetworkState {
  const existingOfType = state.devices.filter((d) => d.type === type).length;
  const device: Device = {
    id: nextId("dev"),
    type,
    label: `${labelPrefix(type)} ${existingOfType + 1}`,
    x,
    y,
  };
  return { ...state, devices: [...state.devices, device] };
}

export function removeDevice(state: NetworkState, id: string): NetworkState {
  return {
    devices: state.devices.filter((d) => d.id !== id),
    links: state.links.filter((l) => l.a !== id && l.b !== id),
  };
}

export function moveDevice(state: NetworkState, id: string, x: number, y: number): NetworkState {
  return { ...state, devices: state.devices.map((d) => (d.id === id ? { ...d, x, y } : d)) };
}

export function renameDevice(state: NetworkState, id: string, label: string): NetworkState {
  return { ...state, devices: state.devices.map((d) => (d.id === id ? { ...d, label } : d)) };
}

export function linkExists(state: NetworkState, a: string, b: string): boolean {
  return state.links.some((l) => (l.a === a && l.b === b) || (l.a === b && l.b === a));
}

export function addLink(state: NetworkState, a: string, b: string, type: LinkType = "wired"): NetworkState {
  if (a === b || linkExists(state, a, b)) return state;
  const link: Link = { id: nextId("link"), a, b, type };
  return { ...state, links: [...state.links, link] };
}

export function removeLink(state: NetworkState, linkId: string): NetworkState {
  return { ...state, links: state.links.filter((l) => l.id !== linkId) };
}

export function removeLinkBetween(state: NetworkState, a: string, b: string): NetworkState {
  return { ...state, links: state.links.filter((l) => !((l.a === a && l.b === b) || (l.a === b && l.b === a))) };
}

export function neighbors(state: NetworkState, id: string, excludeLinkIds: Set<string> = new Set()): string[] {
  const out: string[] = [];
  for (const l of state.links) {
    if (excludeLinkIds.has(l.id)) continue;
    if (l.a === id) out.push(l.b);
    else if (l.b === id) out.push(l.a);
  }
  return out;
}

/** Breadth-first reachable set from `fromId`, optionally treating a
 *  device or a link as removed — this is how every failure/redundancy
 *  experiment answers "who can still talk to whom?" without mutating
 *  the actual network. */
export function reachableFrom(
  state: NetworkState,
  fromId: string,
  options: { excludeDeviceId?: string; excludeLinkId?: string } = {},
): Set<string> {
  const visited = new Set<string>();
  if (fromId === options.excludeDeviceId) return visited;
  const excludeLinkIds = new Set(options.excludeLinkId ? [options.excludeLinkId] : []);
  const queue = [fromId];
  visited.add(fromId);
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const n of neighbors(state, current, excludeLinkIds)) {
      if (n === options.excludeDeviceId) continue;
      if (!visited.has(n)) {
        visited.add(n);
        queue.push(n);
      }
    }
  }
  return visited;
}

/** Every connected component of the network (each a set of device
 *  ids), optionally under the same removal used by `reachableFrom`. */
export function connectedComponents(
  state: NetworkState,
  options: { excludeDeviceId?: string; excludeLinkId?: string } = {},
): string[][] {
  const remaining = state.devices.map((d) => d.id).filter((id) => id !== options.excludeDeviceId);
  const seen = new Set<string>();
  const components: string[][] = [];
  for (const id of remaining) {
    if (seen.has(id)) continue;
    const group = reachableFrom(state, id, options);
    group.forEach((g) => seen.add(g));
    components.push([...group]);
  }
  return components;
}

export interface SinglePointOfFailure {
  deviceIds: string[];
  linkIds: string[];
}

/**
 * Finds every device and link whose removal increases the number of
 * connected components among the *other* devices — i.e. a classic
 * articulation point / bridge, computed by brute force (remove one
 * element, recompute components, compare counts). Networks in this
 * lab are small (well under 20 devices), so brute force is simpler to
 * follow than a linear-time algorithm and just as correct for
 * teaching purposes.
 */
export function findSinglePointsOfFailure(state: NetworkState): SinglePointOfFailure {
  const baseline = connectedComponents(state).length;
  const deviceIds: string[] = [];
  for (const d of state.devices) {
    const withoutCount = connectedComponents(state, { excludeDeviceId: d.id }).length;
    // Removing a device also removes its own component, so compare
    // against baseline minus one (the device's own slot) rather than
    // baseline directly.
    if (withoutCount > Math.max(baseline - 1, 1) && state.devices.length - 1 > 0) {
      deviceIds.push(d.id);
    }
  }
  const linkIds: string[] = [];
  for (const l of state.links) {
    const withoutCount = connectedComponents(state, { excludeLinkId: l.id }).length;
    if (withoutCount > baseline) linkIds.push(l.id);
  }
  return { deviceIds, linkIds };
}

/** Shortest path (fewest hops) between two devices, ignoring any
 *  excluded device/link — used to route a simulated packet across
 *  whatever the student has built. Returns `null` if unreachable. */
export function shortestPath(
  state: NetworkState,
  fromId: string,
  toId: string,
  options: { excludeDeviceId?: string; excludeLinkId?: string } = {},
): string[] | null {
  if (fromId === toId) return [fromId];
  const excludeLinkIds = new Set(options.excludeLinkId ? [options.excludeLinkId] : []);
  const cameFrom = new Map<string, string>();
  const visited = new Set<string>([fromId]);
  const queue = [fromId];
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const n of neighbors(state, current, excludeLinkIds)) {
      if (n === options.excludeDeviceId || current === options.excludeDeviceId) continue;
      if (visited.has(n)) continue;
      visited.add(n);
      cameFrom.set(n, current);
      if (n === toId) {
        const path = [toId];
        let cursor = toId;
        while (cameFrom.has(cursor)) {
          cursor = cameFrom.get(cursor)!;
          path.unshift(cursor);
        }
        return path;
      }
      queue.push(n);
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Topology presets
// ---------------------------------------------------------------------------

export type TopologyKind = "bus" | "star" | "ring" | "mesh" | "tree" | "hybrid";

export const TOPOLOGY_ORDER: TopologyKind[] = ["bus", "star", "ring", "mesh", "tree", "hybrid"];

export interface TopologyInfo {
  label: string;
  structure: string;
  scalability: string;
  redundancy: string;
  failureBehavior: string;
  complexity: string;
  examples: string;
}

export const TOPOLOGY_INFO: Record<TopologyKind, TopologyInfo> = {
  bus: {
    label: "Bus",
    structure: "Every device connects to one shared backbone cable, in a line.",
    scalability: "Poor — the shared cable becomes a bottleneck as more devices join.",
    redundancy: "None — there is exactly one path between any two devices.",
    failureBehavior: "A break anywhere on the backbone can split or disable the whole segment.",
    complexity: "Very simple and cheap to cable.",
    examples: "Historically used for small early Ethernet segments; rarely built new today.",
  },
  star: {
    label: "Star",
    structure: "Every device connects individually to one central device (usually a switch).",
    scalability: "Good — adding a device only means one more cable to the center.",
    redundancy: "Low by default — every device depends on the one central device.",
    failureBehavior: "A single device link failing only isolates that device; the central device failing disables the whole star.",
    complexity: "Simple to wire and to reason about; the most common LAN topology today.",
    examples: "A typical home or office LAN, with a switch or router at the center.",
  },
  ring: {
    label: "Ring",
    structure: "Each device connects to exactly two neighbors, forming a closed loop.",
    scalability: "Moderate — adding a device means breaking and re-forming the loop.",
    redundancy: "A single break can sometimes still be routed the other way around the ring, depending on the design.",
    failureBehavior: "One broken link can disrupt the loop unless the design supports sending data the other direction.",
    complexity: "Moderate — every device also has to help pass traffic along.",
    examples: "Used historically in Token Ring LANs and in some metropolitan fiber rings.",
  },
  mesh: {
    label: "Mesh",
    structure: "Devices have multiple direct interconnections with each other.",
    scalability: "Expensive to fully scale — a full mesh needs a link between every pair of devices.",
    redundancy: "High — multiple paths usually exist between any two devices.",
    failureBehavior: "Losing one link or device often still leaves another path available.",
    complexity: "Complex and cable-heavy, especially as a full mesh.",
    examples: "Core backbone links between routers, or wireless mesh Wi-Fi systems in a large home.",
  },
  tree: {
    label: "Tree",
    structure: "A hierarchical structure — a root device connects to branch devices, which connect to leaf devices.",
    scalability: "Good — new branches can be added without disturbing the rest of the tree.",
    redundancy: "Low unless extra cross-links are added — each branch depends on its parent.",
    failureBehavior: "Losing a branch device disconnects everything below it in that branch.",
    complexity: "Moderate — mirrors how many real organizations are structured (departments, floors, buildings).",
    examples: "Enterprise LANs organized by floor or department, each with its own switch feeding a core switch.",
  },
  hybrid: {
    label: "Hybrid",
    structure: "A combination of two or more topology types, used together in one network.",
    scalability: "Depends on the combination — often chosen specifically to balance scalability and cost.",
    redundancy: "Depends on the combination — can be tuned by adding mesh-style links where they matter most.",
    failureBehavior: "Depends on which part of the hybrid design is affected.",
    complexity: "Higher — requires understanding how the combined parts interact.",
    examples: "A star-of-stars campus network, or a mesh core connecting several star-topology buildings.",
  },
};

/** Builds a ready-made NetworkState for a topology preset, replacing
 *  whatever devices/links were there before — this always starts
 *  from a clean slate so the comparison between topologies is fair. */
export function buildTopology(kind: TopologyKind, deviceCount = 5): NetworkState {
  const n = Math.max(3, Math.min(deviceCount, 8));
  switch (kind) {
    case "bus":
      return buildBus(n);
    case "star":
      return buildStar(n);
    case "ring":
      return buildRing(n);
    case "mesh":
      return buildMesh(Math.min(n, 6));
    case "tree":
      return buildTree();
    case "hybrid":
      return buildHybrid();
  }
}

function makeDevice(type: DeviceType, index: number, x: number, y: number): Device {
  return { id: nextId("dev"), type, label: `${labelPrefix(type)} ${index}`, x, y };
}

function buildBus(n: number): NetworkState {
  const devices: Device[] = [];
  const spacing = 480 / (n - 1 || 1);
  for (let i = 0; i < n; i++) {
    devices.push(makeDevice("pc", i + 1, 40 + i * spacing, 140));
  }
  const links: Link[] = [];
  for (let i = 0; i < n - 1; i++) {
    links.push({ id: nextId("link"), a: devices[i]!.id, b: devices[i + 1]!.id, type: "wired" });
  }
  return { devices, links };
}

function buildStar(n: number): NetworkState {
  const center = makeDevice("switch", 1, 260, 150);
  const devices: Device[] = [center];
  const links: Link[] = [];
  const spokes = n - 1;
  for (let i = 0; i < spokes; i++) {
    const angle = (2 * Math.PI * i) / spokes - Math.PI / 2;
    const x = 260 + Math.cos(angle) * 170;
    const y = 150 + Math.sin(angle) * 110;
    const pc = makeDevice("pc", i + 1, x, y);
    devices.push(pc);
    links.push({ id: nextId("link"), a: center.id, b: pc.id, type: "wired" });
  }
  return { devices, links };
}

function buildRing(n: number): NetworkState {
  const devices: Device[] = [];
  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    const x = 260 + Math.cos(angle) * 170;
    const y = 150 + Math.sin(angle) * 110;
    devices.push(makeDevice("pc", i + 1, x, y));
  }
  const links: Link[] = [];
  for (let i = 0; i < n; i++) {
    const next = (i + 1) % n;
    links.push({ id: nextId("link"), a: devices[i]!.id, b: devices[next]!.id, type: "wired" });
  }
  return { devices, links };
}

function buildMesh(n: number): NetworkState {
  const devices: Device[] = [];
  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    const x = 260 + Math.cos(angle) * 170;
    const y = 150 + Math.sin(angle) * 110;
    devices.push(makeDevice("pc", i + 1, x, y));
  }
  const links: Link[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      links.push({ id: nextId("link"), a: devices[i]!.id, b: devices[j]!.id, type: "wired" });
    }
  }
  return { devices, links };
}

function buildTree(): NetworkState {
  const root = makeDevice("router", 1, 260, 40);
  const branchA = makeDevice("switch", 1, 140, 140);
  const branchB = makeDevice("switch", 2, 380, 140);
  const leaves = [
    makeDevice("pc", 1, 70, 240),
    makeDevice("pc", 2, 190, 240),
    makeDevice("pc", 3, 330, 240),
    makeDevice("pc", 4, 450, 240),
  ];
  const devices = [root, branchA, branchB, ...leaves];
  const links: Link[] = [
    { id: nextId("link"), a: root.id, b: branchA.id, type: "wired" },
    { id: nextId("link"), a: root.id, b: branchB.id, type: "wired" },
    { id: nextId("link"), a: branchA.id, b: leaves[0]!.id, type: "wired" },
    { id: nextId("link"), a: branchA.id, b: leaves[1]!.id, type: "wired" },
    { id: nextId("link"), a: branchB.id, b: leaves[2]!.id, type: "wired" },
    { id: nextId("link"), a: branchB.id, b: leaves[3]!.id, type: "wired" },
  ];
  return { devices, links };
}

function buildHybrid(): NetworkState {
  // Two star clusters joined by a single backbone link — a "star of
  // stars", one of the most common real hybrid designs.
  const switchA = makeDevice("switch", 1, 140, 150);
  const switchB = makeDevice("switch", 2, 380, 150);
  const clusterA = [makeDevice("pc", 1, 40, 60), makeDevice("pc", 2, 40, 150), makeDevice("pc", 3, 40, 240)];
  const clusterB = [makeDevice("pc", 4, 480, 60), makeDevice("server", 1, 480, 150), makeDevice("printer", 1, 480, 240)];
  const devices = [switchA, switchB, ...clusterA, ...clusterB];
  const links: Link[] = [
    { id: nextId("link"), a: switchA.id, b: switchB.id, type: "fiber" },
    ...clusterA.map((d) => ({ id: nextId("link"), a: switchA.id, b: d.id, type: "wired" as LinkType })),
    ...clusterB.map((d) => ({ id: nextId("link"), a: switchB.id, b: d.id, type: "wired" as LinkType })),
  ];
  return { devices, links };
}

// ---------------------------------------------------------------------------
// Device & link reference data
// ---------------------------------------------------------------------------

export interface DeviceInfo {
  label: string;
  category: "end" | "network" | "service";
  categoryLabel: string;
  bullets: string[];
}

export const DEVICE_INFO: Record<DeviceType, DeviceInfo> = {
  pc: {
    label: "PC",
    category: "end",
    categoryLabel: "End Device",
    bullets: ["Sends and receives data", "Can connect to a network", "Can communicate with other hosts"],
  },
  laptop: {
    label: "Laptop",
    category: "end",
    categoryLabel: "End Device",
    bullets: ["A portable end device — same networking role as a PC", "Often connects wirelessly", "Can communicate with other hosts"],
  },
  phone: {
    label: "Smartphone",
    category: "end",
    categoryLabel: "End Device",
    bullets: ["A mobile end device, usually wireless", "Sends and receives data over the network", "Can act as a client for many services at once"],
  },
  printer: {
    label: "Printer",
    category: "end",
    categoryLabel: "End Device",
    bullets: ["An end device that mostly receives data", "Shared over the network so multiple hosts can use it", "Does not forward traffic for other devices"],
  },
  server: {
    label: "Server",
    category: "service",
    categoryLabel: "Network Service",
    bullets: ["Provides services or resources to clients", "Usually stays on and reachable at all times", "One server can serve many clients at once"],
  },
  switch: {
    label: "Switch",
    category: "network",
    categoryLabel: "Network Device",
    bullets: [
      "Connects devices within a local network",
      "Forwards data toward the right device rather than every device (based on hardware addresses — covered in a later simulation)",
      "Does not connect separate networks together",
    ],
  },
  router: {
    label: "Router",
    category: "network",
    categoryLabel: "Network Device",
    bullets: [
      "Connects different networks together",
      "Makes forwarding decisions between networks",
      "Often sits at the boundary between a LAN and a larger network like the internet",
    ],
  },
  ap: {
    label: "Wireless Access Point",
    category: "network",
    categoryLabel: "Network Device",
    bullets: [
      "Provides wireless network connectivity to nearby devices",
      "Bridges wireless devices onto the wired network",
      "Range and interference affect how well it works",
    ],
  },
  cloud: {
    label: "Internet / Cloud",
    category: "service",
    categoryLabel: "Network Service",
    bullets: [
      "A simplified stand-in for \"everything outside this local network\"",
      "Represents the wider internet or a remote network reached through an ISP",
      "Real traffic to it passes through a router first",
    ],
  },
};

export interface LinkTypeInfo {
  label: string;
  use: string;
  characteristics: string;
  bandwidth: string;
  latency: string;
  medium: string;
}

export const LINK_TYPE_INFO: Record<LinkType, LinkTypeInfo> = {
  wired: {
    label: "Ethernet / Wired",
    use: "Typical for desktops, servers, and fixed equipment within a building.",
    characteristics: "Stable and consistent; not affected by radio interference; needs physical cabling.",
    bandwidth: "Illustrative example: 1 Gbps on common office cabling",
    latency: "Illustrative example: well under 1 ms on a short local run",
    medium: "Copper cable (twisted pair)",
  },
  fiber: {
    label: "Fiber",
    use: "Typical for backbone links between switches, buildings, or over long distances.",
    characteristics: "Very high capacity and low signal loss over distance; more expensive to install; not affected by electrical interference.",
    bandwidth: "Illustrative example: 10 Gbps or higher on a backbone link",
    latency: "Illustrative example: very low, though real-world latency also depends on physical distance",
    medium: "Glass or plastic fiber carrying light signals",
  },
  wireless: {
    label: "Wireless",
    use: "Typical for laptops, phones, and other mobile or hard-to-wire devices.",
    characteristics: "Convenient and mobile; shared medium among nearby devices; more exposed to interference and distance/obstacle effects.",
    bandwidth: "Illustrative example: a few hundred Mbps, shared among connected devices",
    latency: "Illustrative example: somewhat higher and less consistent than a comparable wired link",
    medium: "Radio waves",
  },
};

// ---------------------------------------------------------------------------
// Network size scenarios (PAN / LAN / MAN / WAN)
// ---------------------------------------------------------------------------

export type NetworkSizeKind = "pan" | "lan" | "man" | "wan";

export interface NetworkSizeScenario {
  kind: NetworkSizeKind;
  name: string;
  fullName: string;
  description: string;
  network: NetworkState;
}

function scenarioNetwork(devices: [DeviceType, string, number, number][], linkPairs: [number, number, LinkType][]): NetworkState {
  const built = devices.map(([type, label, x, y]) => ({ id: nextId("dev"), type, label, x, y }) as Device);
  const links = linkPairs.map(([a, b, type]) => ({ id: nextId("link"), a: built[a]!.id, b: built[b]!.id, type }));
  return { devices: built, links };
}

export function makeNetworkSizeScenarios(): NetworkSizeScenario[] {
  return [
    {
      kind: "pan",
      name: "PAN",
      fullName: "Personal Area Network",
      description:
        "A network of devices belonging to one person, usually within just a few meters — often wireless and short-range.",
      network: scenarioNetwork(
        [
          ["phone", "Phone", 90, 150],
          ["laptop", "Laptop", 260, 90],
          ["pc", "Smartwatch", 260, 210],
        ],
        [
          [0, 1, "wireless"],
          [0, 2, "wireless"],
        ],
      ),
    },
    {
      kind: "lan",
      name: "LAN",
      fullName: "Local Area Network",
      description: "A network confined to one site — a home, office, or single building — usually owned and managed by one organization.",
      network: scenarioNetwork(
        [
          ["pc", "PC 1", 80, 90],
          ["pc", "PC 2", 80, 210],
          ["switch", "Switch", 240, 150],
          ["server", "Server", 400, 150],
        ],
        [
          [0, 2, "wired"],
          [1, 2, "wired"],
          [2, 3, "wired"],
        ],
      ),
    },
    {
      kind: "man",
      name: "MAN",
      fullName: "Metropolitan Area Network — conceptual",
      description: "A network spanning a city or campus scale — larger than a single-site LAN, smaller than a WAN. Often built from fiber links between several LANs.",
      network: scenarioNetwork(
        [
          ["router", "Building A LAN", 80, 150],
          ["router", "Building B LAN", 260, 90],
          ["router", "Building C LAN", 260, 210],
          ["cloud", "City Fiber Ring", 430, 150],
        ],
        [
          [0, 3, "fiber"],
          [1, 3, "fiber"],
          [2, 3, "fiber"],
        ],
      ),
    },
    {
      kind: "wan",
      name: "WAN",
      fullName: "Wide Area Network",
      description: "A network spanning a large geographic area — often connecting LANs in different cities or countries, typically over links leased from a provider.",
      network: scenarioNetwork(
        [
          ["router", "Office A", 70, 150],
          ["cloud", "ISP / Internet", 260, 150],
          ["router", "Office B", 450, 150],
        ],
        [
          [0, 1, "fiber"],
          [1, 2, "fiber"],
        ],
      ),
    },
  ];
}

// ---------------------------------------------------------------------------
// Client-server & peer-to-peer
// ---------------------------------------------------------------------------

export function buildClientServerNetwork(clientCount = 3): NetworkState {
  const server = makeDevice("server", 1, 420, 150);
  const devices: Device[] = [server];
  const links: Link[] = [];
  for (let i = 0; i < clientCount; i++) {
    const y = 150 + (i - (clientCount - 1) / 2) * 80;
    const client = makeDevice("pc", i + 1, 80, y);
    devices.push(client);
    links.push({ id: nextId("link"), a: client.id, b: server.id, type: "wired" });
  }
  return { devices, links };
}

export function buildPeerToPeerNetwork(): NetworkState {
  const devices = [
    makeDevice("pc", 1, 100, 80),
    makeDevice("pc", 2, 400, 80),
    makeDevice("pc", 3, 100, 260),
    makeDevice("pc", 4, 400, 260),
  ];
  const links: Link[] = [
    { id: nextId("link"), a: devices[0]!.id, b: devices[1]!.id, type: "wired" },
    { id: nextId("link"), a: devices[0]!.id, b: devices[2]!.id, type: "wired" },
    { id: nextId("link"), a: devices[1]!.id, b: devices[3]!.id, type: "wired" },
    { id: nextId("link"), a: devices[2]!.id, b: devices[3]!.id, type: "wired" },
    { id: nextId("link"), a: devices[0]!.id, b: devices[3]!.id, type: "wired" },
  ];
  return { devices, links };
}

// ---------------------------------------------------------------------------
// Packets, packet loss, latency
// ---------------------------------------------------------------------------

export interface PacketResult {
  path: string[] | null;
  delivered: boolean;
  lossIndex: number | null;
}

/** Rolls simulated packet loss along a computed path. `lossRatePercent`
 *  is an illustrative, student-set value — not a measurement of any
 *  real link. Returns which hop (if any) the packet was "lost" at. */
export function simulateSend(
  state: NetworkState,
  fromId: string,
  toId: string,
  lossRatePercent: number,
): PacketResult {
  const path = shortestPath(state, fromId, toId);
  if (!path) return { path: null, delivered: false, lossIndex: null };
  for (let hop = 1; hop < path.length; hop++) {
    if (Math.random() * 100 < lossRatePercent) {
      return { path, delivered: false, lossIndex: hop };
    }
  }
  return { path, delivered: true, lossIndex: null };
}

// ---------------------------------------------------------------------------
// Bandwidth, latency, throughput, congestion (simplified educational model)
// ---------------------------------------------------------------------------

export const BANDWIDTH_OPTIONS_MBPS = [10, 100, 1000, 10000];
export const LATENCY_OPTIONS_MS = [1, 20, 80, 200];
export const PACKET_LOSS_OPTIONS_PERCENT = [0, 5, 10, 25];

export interface ThroughputInputs {
  bandwidthMbps: number;
  latencyMs: number;
  packetLossPercent: number;
  loadPercent: number;
}

export interface ThroughputResult {
  bandwidthMbps: number;
  throughputMbps: number;
  utilizationPercent: number;
}

/**
 * A deliberately simplified, clearly-labeled educational model —
 * NOT a real network performance formula. Throughput is bandwidth
 * reduced by current load's share of capacity, then further reduced
 * by packet loss (lost packets must be retransmitted, so they don't
 * contribute to useful throughput), then very slightly reduced by
 * high latency (a rough stand-in for protocol overhead on
 * long round-trips). The goal is only to make the *direction* of
 * each effect intuitive, never to predict a real link's numbers.
 */
export function computeThroughput(inputs: ThroughputInputs): ThroughputResult {
  const { bandwidthMbps, latencyMs, packetLossPercent, loadPercent } = inputs;
  const loadFactor = Math.max(0, 1 - Math.max(0, loadPercent - 100) / 200);
  const lossFactor = Math.max(0, 1 - packetLossPercent / 100);
  const latencyFactor = Math.max(0.6, 1 - latencyMs / 1000);
  const demanded = bandwidthMbps * Math.min(loadPercent, 100) / 100;
  const throughputMbps = Math.max(0, demanded * lossFactor * latencyFactor * loadFactor);
  const utilizationPercent = bandwidthMbps > 0 ? Math.min(100, (throughputMbps / bandwidthMbps) * 100) : 0;
  return { bandwidthMbps, throughputMbps: Math.round(throughputMbps * 10) / 10, utilizationPercent: Math.round(utilizationPercent) };
}

export interface CongestionFlow {
  id: string;
  name: string;
  demandMbps: number;
}

export interface CongestionResult {
  totalDemandMbps: number;
  capacityMbps: number;
  congested: boolean;
  perFlowMbps: { id: string; name: string; demandMbps: number; achievedMbps: number }[];
  queueDelayMs: number;
}

/** Simplified fair-share congestion model: if total demand exceeds
 *  capacity, every flow is throttled toward an equal share and a
 *  queueing delay is reported; otherwise every flow gets what it
 *  asked for. Illustrative only — real congestion control is far more
 *  dynamic than an equal split. */
export function computeCongestion(flows: CongestionFlow[], capacityMbps: number): CongestionResult {
  const totalDemandMbps = flows.reduce((sum, f) => sum + f.demandMbps, 0);
  const congested = totalDemandMbps > capacityMbps;
  const fairShare = capacityMbps / Math.max(1, flows.length);
  const perFlowMbps = flows.map((f) => ({
    id: f.id,
    name: f.name,
    demandMbps: f.demandMbps,
    achievedMbps: congested ? Math.round(Math.min(f.demandMbps, fairShare) * 10) / 10 : f.demandMbps,
  }));
  const overloadRatio = congested ? totalDemandMbps / capacityMbps : 1;
  const queueDelayMs = congested ? Math.round((overloadRatio - 1) * 200) : 0;
  return { totalDemandMbps, capacityMbps, congested, perFlowMbps, queueDelayMs };
}

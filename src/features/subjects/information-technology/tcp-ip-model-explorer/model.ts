/**
 * Pure data model for the TCP/IP Model Explorer simulation — the third
 * topic in the Networking branch of Information Technology, following
 * Network Fundamentals & Topologies and the OSI Model Explorer.
 *
 * Teaches the commonly used four-layer TCP/IP model (Application,
 * Transport, Internet, Network Access / Link), how it maps onto OSI,
 * encapsulation/decapsulation, data-unit terminology, an introductory
 * protocol map, a conceptual request/response journey, a fixed
 * Computer → Switch → Router → Computer path, and small
 * layer-responsibility and troubleshooting exercises.
 *
 * Deliberately conceptual: no real HTTP/DNS/TCP, no MAC or IP address
 * assignment, no routing algorithm, no subnetting. Those are reserved
 * for dedicated later simulations in this branch.
 *
 * Reuses `DetailLevel` and the journey topology from the OSI model
 * rather than redefining them.
 */

import { OSI_LAYERS, PACKET_JOURNEY_LINKS, PACKET_JOURNEY_NODES, type OsiLayerNumber } from "../osi-model-explorer/model";

export { OSI_LAYERS, PACKET_JOURNEY_LINKS, PACKET_JOURNEY_NODES };
export type { OsiLayerNumber };
export type { DetailLevel } from "../osi-model-explorer/model";
export { DETAIL_LEVEL_LABELS } from "../osi-model-explorer/model";

// ---------------------------------------------------------------------------
// Layers
// ---------------------------------------------------------------------------

export type TcpIpLayerId = "application" | "transport" | "internet" | "link";

export interface TcpIpLayer {
  id: TcpIpLayerId;
  /** Conventional numbering used by many textbooks (4 = top). */
  number: 4 | 3 | 2 | 1;
  name: string;
  shortName: string;
  responsibility: string;
  protocols: string[];
  typicalData: string;
  /** How this layer relates to OSI. */
  osiRelation: string;
  /** OSI layer numbers this layer roughly corresponds to. */
  osiLayers: OsiLayerNumber[];
  example: string;
  /** Intermediate+ — a few concise bullets going one step deeper. */
  deepDive: string[];
  /** Technical — how this layer interacts with its neighbours. */
  interaction: string;
  accent: string;
}

export const TCPIP_LAYERS: TcpIpLayer[] = [
  {
    id: "application",
    number: 4,
    name: "Application",
    shortName: "Application",
    responsibility:
      "Defines how applications talk to each other over the network — the actual requests, responses, and services people use.",
    protocols: ["HTTP/HTTPS", "DNS", "DHCP"],
    typicalData: "Application data: messages such as a web request or a name lookup.",
    osiRelation: "Covers the work OSI splits into Application, Presentation, and Session (layers 7, 6, 5).",
    osiLayers: [7, 6, 5],
    example: "Your browser builds a request for a web page.",
    deepDive: [
      "Both ends must agree on a message format — that agreement is the application protocol (for example HTTP).",
      "Formatting, encryption (such as TLS), and conversation management are handled here — by the protocol, a library, or the application itself — rather than in separate layers.",
      "DNS and DHCP are application-layer protocols that support other communication (finding addresses, joining a network), even though they are network plumbing rather than user-facing apps.",
    ],
    interaction:
      "Hands data down to the Transport layer through an operating-system interface (commonly sockets), choosing which transport protocol to use. It does not deal with routing or links directly.",
    accent: "#7C3AED",
  },
  {
    id: "transport",
    number: 3,
    name: "Transport",
    shortName: "Transport",
    responsibility: "Carries data between applications (processes) on two hosts — the end-to-end conversation.",
    protocols: ["TCP", "UDP"],
    typicalData: "Segments (TCP) or datagrams (UDP), labelled with port numbers.",
    osiRelation: "Corresponds closely to OSI Transport (layer 4).",
    osiLayers: [4],
    example: "A browser and a web server exchange data over TCP; a live video call might use UDP instead.",
    deepDive: [
      "Process-to-process communication: port numbers identify which application on a host should receive the data (for example, web servers commonly use ports 80 and 443).",
      "Segmentation: a large message can be split into smaller pieces for delivery and put back together at the other end.",
      "Reliability where supported: TCP acknowledges and retransmits data; UDP does not guarantee delivery.",
      "Flow and congestion control (at a high level): TCP adjusts how fast it sends so neither the receiver nor the network is overwhelmed. A dedicated TCP vs. UDP simulation comes later.",
    ],
    interaction:
      "Receives data from Application, adds its header, and passes the result to Internet. On the receiving side it uses the port number to hand data to the right application.",
    accent: "#0EA5E9",
  },
  {
    id: "internet",
    number: 2,
    name: "Internet",
    shortName: "Internet",
    responsibility: "Addresses packets and moves them across multiple networks toward the destination host.",
    protocols: ["IP", "ICMP"],
    typicalData: "Packets (IP datagrams) carrying source and destination IP addresses.",
    osiRelation: "Corresponds closely to OSI Network (layer 3).",
    osiLayers: [3],
    example: "A packet leaves your home network and crosses several routers to reach a server elsewhere.",
    deepDive: [
      "IP addressing gives every host a logical address, separate from any one physical link.",
      "Packet delivery between networks happens hop by hop: each router forwards the packet toward the destination.",
      "Routing concept: routers decide the next hop for a packet. (Actual routing and subnetting are separate, later simulations.)",
      "IP is best-effort — it does not guarantee delivery. Reliability, when needed, comes from a higher layer such as TCP.",
    ],
    interaction:
      "Wraps each Transport segment or datagram in an IP packet, then asks the Network Access layer to deliver it across the next link. Routers read this layer's header to decide where to forward.",
    accent: "#10B981",
  },
  {
    id: "link",
    number: 1,
    name: "Network Access / Link",
    shortName: "Network Access",
    responsibility: "Delivers data across a single local network link and puts it on the physical medium.",
    protocols: ["Ethernet", "Wi-Fi"],
    typicalData: "Frames, which are transmitted as bits (electrical, optical, or radio signals).",
    osiRelation: "Covers OSI Data Link and Physical (layers 2 and 1).",
    osiLayers: [2, 1],
    example: "Your laptop sends a frame over Wi-Fi to the router.",
    deepDive: [
      "Local network communication: a frame only has to reach the next device on the same link, not the final destination.",
      "Frames wrap the packet for this one link; a new frame is built for each link along the path.",
      "Ethernet (cables) and Wi-Fi (radio) are the two everyday examples of link technologies.",
      "Physical transmission concept: the frame becomes signals — electricity, light, or radio waves — that carry the bits.",
    ],
    interaction:
      "Takes packets from Internet and delivers them one link at a time. Some textbooks split this layer into separate Link and Physical layers, giving a five-layer variant of the model.",
    accent: "#F59E0B",
  },
];

export function getTcpIpLayer(id: TcpIpLayerId): TcpIpLayer {
  const layer = TCPIP_LAYERS.find((l) => l.id === id);
  if (!layer) throw new Error(`Unknown TCP/IP layer ${id}`);
  return layer;
}

/** Which TCP/IP layer a given OSI layer maps onto (conceptual). */
export function tcpIpLayerForOsi(osi: OsiLayerNumber): TcpIpLayer {
  const layer = TCPIP_LAYERS.find((l) => l.osiLayers.includes(osi));
  if (!layer) throw new Error(`No TCP/IP layer for OSI layer ${osi}`);
  return layer;
}

export const OSI_TCPIP_MAPPING_NOTES = {
  conceptual:
    "This is a conceptual mapping. Real protocols and implementations do not always follow textbook layer boundaries perfectly, and different books draw the lines slightly differently.",
  blurry: [
    "TLS encryption is often described as an OSI Presentation-layer job, yet in practice it is part of what an application or library does on top of TCP.",
    "ICMP is treated as an Internet-layer protocol, but its messages travel inside IP packets.",
    "Ethernet and Wi-Fi each define both a frame format and physical signalling, so they span OSI layers 2 and 1 in a single technology.",
  ],
};

// ---------------------------------------------------------------------------
// Data units
// ---------------------------------------------------------------------------

export interface DataUnitRow {
  layer: string;
  unit: string;
  note: string;
}

export const DATA_UNITS: DataUnitRow[] = [
  { layer: "Application", unit: "Data", note: "The message the application creates." },
  { layer: "Transport", unit: "Segment / Datagram", note: "Segment for TCP, datagram for UDP." },
  { layer: "Internet", unit: "Packet / IP datagram", note: "Data plus an IP header." },
  { layer: "Link", unit: "Frame", note: "A packet wrapped for one local link." },
  { layer: "Physical", unit: "Bits", note: "Signals on the medium (part of Network Access)." },
];

export const DATA_UNIT_NOTE =
  "Terminology varies by protocol and context: people often say \"packet\" loosely for any unit, and some sources say \"message\" at the Application layer. These are the commonly taught names.";

// ---------------------------------------------------------------------------
// Encapsulation / decapsulation
// ---------------------------------------------------------------------------

export type HeaderId = "transport" | "internet" | "link";

export interface EncapFrame {
  phase: "encapsulating" | "transmitting" | "decapsulating";
  layer: TcpIpLayerId | null;
  pduName: string;
  headers: HeaderId[];
  side: "sender" | "wire" | "receiver";
  description: string;
  /** Shown at the Technical level only. */
  technical?: string;
}

export const ENCAP_STEP_LABELS = ["Application Data", "Transport", "Internet", "Network Access", "Transmission"];

export const ENCAP_FRAMES: EncapFrame[] = [
  {
    phase: "encapsulating", layer: "application", pduName: "Data", headers: [], side: "sender",
    description: "The application builds its message — for example a web request. Nothing is wrapped around it yet.",
  },
  {
    phase: "encapsulating", layer: "transport", pduName: "Segment / Datagram", headers: ["transport"], side: "sender",
    description: "Transport adds a header (including port numbers), forming a segment (TCP) or datagram (UDP).",
    technical: "TCP header: source/destination ports, sequence and acknowledgment numbers, flags, window size, checksum. UDP header: ports, length, checksum.",
  },
  {
    phase: "encapsulating", layer: "internet", pduName: "Packet", headers: ["transport", "internet"], side: "sender",
    description: "Internet adds an IP header with source and destination IP addresses, forming a packet.",
    technical: "IP header: source/destination IP address, time-to-live (hop limit), and a protocol field saying whether TCP, UDP, or ICMP is inside.",
  },
  {
    phase: "encapsulating", layer: "link", pduName: "Frame", headers: ["transport", "internet", "link"], side: "sender",
    description: "Network Access wraps the packet in a link header and trailer for the next local link, forming a frame.",
    technical: "An Ethernet frame carries destination/source link-layer addresses, a type field, and a trailing frame check sequence for error detection. Wi-Fi frames use a different format.",
  },
  {
    phase: "encapsulating", layer: "link", pduName: "Bits", headers: ["transport", "internet", "link"], side: "sender",
    description: "The frame is converted to bits and sent as signals — electricity, light, or radio.",
  },
  {
    phase: "transmitting", layer: null, pduName: "Bits", headers: ["transport", "internet", "link"], side: "wire",
    description: "The bits travel across the medium to the receiver.",
  },
  {
    phase: "decapsulating", layer: "link", pduName: "Bits", headers: ["transport", "internet", "link"], side: "receiver",
    description: "The receiver's Network Access layer picks up the signals and reassembles the bits into a frame.",
  },
  {
    phase: "decapsulating", layer: "link", pduName: "Packet", headers: ["transport", "internet"], side: "receiver",
    description: "The link header and trailer are checked and removed, revealing the packet.",
  },
  {
    phase: "decapsulating", layer: "internet", pduName: "Segment / Datagram", headers: ["transport"], side: "receiver",
    description: "The Internet layer reads and removes the IP header, revealing the segment or datagram.",
  },
  {
    phase: "decapsulating", layer: "transport", pduName: "Data", headers: [], side: "receiver",
    description: "Transport removes its header and uses the port number to pick the right application.",
  },
  {
    phase: "decapsulating", layer: "application", pduName: "Data", headers: [], side: "receiver",
    description: "The receiving application gets the same data the sender's application created.",
  },
];

// ---------------------------------------------------------------------------
// Protocol explorer
// ---------------------------------------------------------------------------

export interface ProtocolInfo {
  id: string;
  name: string;
  layer: TcpIpLayerId;
  purpose: string;
  example: string;
  /** Technical level only. */
  role: string;
}

export const PROTOCOLS: ProtocolInfo[] = [
  {
    id: "http", name: "HTTP/HTTPS", layer: "application",
    purpose: "Requests and delivers web pages and other web resources. HTTPS is HTTP protected by TLS encryption.",
    example: "A browser asks a web server for a page and receives it in response.",
    role: "Commonly carried over TCP. HTTP/3 runs over QUIC, which is itself built on UDP — a reminder that layer boundaries are not always textbook-perfect.",
  },
  {
    id: "dns", name: "DNS", layer: "application",
    purpose: "Translates human-friendly names into IP addresses.",
    example: "Before loading a site, a device asks, \"What is the IP address for this name?\"",
    role: "Usually uses UDP, and TCP for some larger or special exchanges. Other applications depend on it, but it is itself an application-layer protocol.",
  },
  {
    id: "dhcp", name: "DHCP", layer: "application",
    purpose: "Automatically gives a device its network settings (such as an IP address) when it joins a network.",
    example: "A phone joins Wi-Fi and is handed network settings without manual setup.",
    role: "Uses UDP. It runs before the device has a configured IP address, which is why it is more special-purpose than most application protocols.",
  },
  {
    id: "tcp", name: "TCP", layer: "transport",
    purpose: "Reliable, ordered, connection-oriented delivery between applications.",
    example: "Downloading a file, where every piece must arrive and be in order.",
    role: "Uses acknowledgments and retransmission, plus flow control and congestion control, on top of best-effort IP.",
  },
  {
    id: "udp", name: "UDP", layer: "transport",
    purpose: "Lightweight, connectionless delivery with no delivery guarantee.",
    example: "A live video call, where speed matters more than resending a lost moment.",
    role: "Adds little beyond ports and a checksum. Any reliability needed must come from the application or a protocol built on top of UDP.",
  },
  {
    id: "ip", name: "IP", layer: "internet",
    purpose: "Addresses packets and forwards them between networks on a best-effort basis.",
    example: "A packet crosses several routers on its way to a server.",
    role: "Exists as IPv4 and IPv6. Connectionless: each packet is handled independently and delivery is not guaranteed.",
  },
  {
    id: "icmp", name: "ICMP", layer: "internet",
    purpose: "Carries control and error messages about IP delivery.",
    example: "A \"destination unreachable\" message, or the echo used by a basic reachability check.",
    role: "Classified as an Internet-layer protocol, but its messages are carried inside IP packets.",
  },
  {
    id: "ethernet", name: "Ethernet", layer: "link",
    purpose: "Delivers frames between devices on a wired local network.",
    example: "A PC sends frames over a cable to a switch.",
    role: "Defines both the frame format and physical signalling for cabled links, so it spans what OSI calls layers 2 and 1.",
  },
  {
    id: "wifi", name: "Wi-Fi", layer: "link",
    purpose: "Delivers frames between devices over a wireless local network using radio.",
    example: "A laptop sends frames over the air to a wireless router.",
    role: "Uses a different frame format than Ethernet and shares a radio medium, so devices must coordinate who transmits when.",
  },
];

// ---------------------------------------------------------------------------
// Request → response journey (conceptual)
// ---------------------------------------------------------------------------

export interface JourneyStep {
  direction: "request" | "response";
  where: "client" | "network" | "server";
  layer: TcpIpLayerId | null;
  pduName: string;
  text: string;
}

export const JOURNEY_STEPS: JourneyStep[] = [
  { direction: "request", where: "client", layer: "application", pduName: "Data", text: "The client's application creates a request: \"Please send me this web page.\"" },
  { direction: "request", where: "client", layer: "transport", pduName: "Segment", text: "Transport adds its header so the request can be delivered to the right application on the server." },
  { direction: "request", where: "client", layer: "internet", pduName: "Packet", text: "Internet adds an IP header so the packet can find the server across networks." },
  { direction: "request", where: "client", layer: "link", pduName: "Frame", text: "Network Access wraps it in a frame for the first local link and transmits it as bits." },
  { direction: "request", where: "network", layer: null, pduName: "Bits / Frames", text: "The request crosses the network — switches and routers forward it toward the server." },
  { direction: "request", where: "server", layer: "link", pduName: "Frame", text: "The server's Network Access layer receives the bits and rebuilds the frame." },
  { direction: "request", where: "server", layer: "internet", pduName: "Packet", text: "Internet checks the IP header and passes the segment upward." },
  { direction: "request", where: "server", layer: "transport", pduName: "Segment", text: "Transport removes its header and delivers the data to the right application." },
  { direction: "request", where: "server", layer: "application", pduName: "Data", text: "The server application reads the request." },
  { direction: "response", where: "server", layer: "application", pduName: "Data", text: "The server application prepares its response: \"Here is the page.\"" },
  { direction: "response", where: "server", layer: "transport", pduName: "Segment", text: "Transport wraps the response for delivery back to the client's application." },
  { direction: "response", where: "server", layer: "internet", pduName: "Packet", text: "Internet addresses the packet back toward the client." },
  { direction: "response", where: "server", layer: "link", pduName: "Frame", text: "Network Access frames it for the next link and transmits it." },
  { direction: "response", where: "network", layer: null, pduName: "Bits / Frames", text: "The response crosses the network on the way back." },
  { direction: "response", where: "client", layer: "link", pduName: "Frame", text: "The client's Network Access layer receives the frame." },
  { direction: "response", where: "client", layer: "internet", pduName: "Packet", text: "Internet processes the IP header and passes the data up." },
  { direction: "response", where: "client", layer: "transport", pduName: "Segment", text: "Transport removes its header and hands the data to the browser." },
  { direction: "response", where: "client", layer: "application", pduName: "Data", text: "The client application receives the response and shows the page." },
];

export const JOURNEY_NOTE =
  "This is a conceptual animation, not a real HTTP, DNS, or TCP exchange. Real conversations involve extra steps (such as name lookup and connection setup) that later simulations cover.";

// ---------------------------------------------------------------------------
// Network path (Computer A → Switch → Router → Computer B)
// ---------------------------------------------------------------------------

/** TCP/IP layers each device type conceptually participates in. */
export const PATH_PARTICIPATION: Record<"host" | "switch" | "router", TcpIpLayerId[]> = {
  host: ["application", "transport", "internet", "link"],
  switch: ["link"],
  router: ["internet", "link"],
};

export interface PathStep {
  /** Index into PACKET_JOURNEY_NODES for a device step, else null. */
  node: number | null;
  /** For a link-in-transit step, the link's start node index. */
  linkFrom: number | null;
  activeLayers: TcpIpLayerId[];
  pduName: string;
  text: string;
}

export const PATH_STEPS: PathStep[] = [
  { node: 0, linkFrom: null, activeLayers: ["application", "transport", "internet", "link"], pduName: "Data → Frame", text: "Computer A's application creates data and every layer wraps it, ending as a frame ready for the first link." },
  { node: null, linkFrom: 0, activeLayers: [], pduName: "Frame", text: "The frame travels across the link from Computer A to the switch." },
  { node: 1, linkFrom: null, activeLayers: ["link"], pduName: "Frame", text: "The switch works at the Network Access layer: it reads the frame and forwards it. It does not open the IP packet inside." },
  { node: null, linkFrom: 1, activeLayers: [], pduName: "Frame", text: "The frame travels across the next link, from the switch to the router." },
  { node: 2, linkFrom: null, activeLayers: ["link", "internet"], pduName: "Frame → Packet → new Frame", text: "The router removes the frame, reads the IP packet at the Internet layer to choose the next hop, then wraps the packet in a new frame for the next link." },
  { node: null, linkFrom: 2, activeLayers: [], pduName: "Frame", text: "The new frame travels across the link from the router to Computer B." },
  { node: 3, linkFrom: null, activeLayers: ["link", "internet", "transport", "application"], pduName: "Frame → Data", text: "Computer B unwraps the frame, packet, and segment, and hands the data to its application." },
];

export const PATH_NOTE =
  "Conceptual and simplified: real devices can do more than this picture shows (some switches and routers inspect higher layers). This is the commonly taught association, with no routing algorithm and no address assignment.";

export const PATH_REASONING = {
  question: "At the router, which TCP/IP layers does the device need to look at to forward the data?",
  answer:
    "Internet and Network Access. It receives and sends frames (Network Access) and reads the IP header (Internet) to decide the next hop. It does not need Transport or Application to forward the packet.",
};

// ---------------------------------------------------------------------------
// "Which model?" — one communication event through both models
// ---------------------------------------------------------------------------

export const WHICH_MODEL_EVENT = "Your browser requests a web page over HTTPS";

export const WHICH_MODEL_OSI_ROWS: { osi: OsiLayerNumber; text: string }[] = [
  { osi: 7, text: "The browser builds an HTTP request." },
  { osi: 6, text: "Data is encoded and encrypted (TLS) for transmission." },
  { osi: 5, text: "The conversation between browser and server is set up and kept organized." },
  { osi: 4, text: "TCP splits the data into segments and tags them with port numbers." },
  { osi: 3, text: "IP adds addresses so packets can cross networks." },
  { osi: 2, text: "A frame is built for the local link (Ethernet or Wi-Fi)." },
  { osi: 1, text: "Bits are sent as electrical, optical, or radio signals." },
];

export const WHICH_MODEL_TCPIP_ROWS: { layer: TcpIpLayerId; text: string }[] = [
  { layer: "application", text: "The browser builds the HTTP request, with TLS encryption and conversation handling all handled at this layer." },
  { layer: "transport", text: "TCP splits the data into segments and tags them with port numbers." },
  { layer: "internet", text: "IP adds addresses so packets can cross networks." },
  { layer: "link", text: "A frame is built for the local link (Ethernet or Wi-Fi) and sent as signals." },
];

export const WHICH_MODEL_NOTE =
  "Neither view is wrong — they describe the same event at different levels of detail. OSI is handy for precise conversation and troubleshooting vocabulary; TCP/IP matches how the Internet's protocol suite is actually organized.";

// ---------------------------------------------------------------------------
// TCP/IP vs OSI design differences (Technical)
// ---------------------------------------------------------------------------

export const DESIGN_DIFFERENCES: { aspect: string; osi: string; tcpip: string }[] = [
  { aspect: "Purpose", osi: "A reference model created to describe and standardize networking in a layered way.", tcpip: "An architecture that grew alongside the protocol suite the Internet actually uses." },
  { aspect: "Layers", osi: "Seven.", tcpip: "Four (some textbooks show five by splitting Link and Physical)." },
  { aspect: "Session & presentation", osi: "Separate layers with their own responsibilities.", tcpip: "Handled inside the Application layer by protocols, libraries, or the application." },
  { aspect: "Layer boundaries", osi: "Emphasizes clean separation of layers.", tcpip: "More pragmatic — some protocols straddle boundaries." },
  { aspect: "Typical use today", osi: "Teaching and shared vocabulary (\"a Layer 2 problem\").", tcpip: "The practical model for Internet networking." },
];

// ---------------------------------------------------------------------------
// Layer responsibility experiment
// ---------------------------------------------------------------------------

export interface LayerQuestion {
  id: string;
  title?: string;
  prompt: string;
  correct: TcpIpLayerId;
  explanation: string;
}

export const LAYER_ID_ITEMS: LayerQuestion[] = [
  { id: "id-reliable", prompt: "Reliable delivery between applications.", correct: "transport", explanation: "Ensuring data arrives between applications, where supported, is Transport-layer work (TCP)." },
  { id: "id-ip-forwarding", prompt: "IP addressing and packet forwarding.", correct: "internet", explanation: "Logical addressing and forwarding packets across networks is the Internet layer's job." },
  { id: "id-local-delivery", prompt: "Ethernet or Wi-Fi local delivery.", correct: "link", explanation: "Delivery across one local link, using technologies like Ethernet and Wi-Fi, belongs to Network Access / Link." },
  { id: "id-http", prompt: "An HTTP request.", correct: "application", explanation: "HTTP is an application-layer protocol — the request is the application's message." },
  { id: "id-ports", prompt: "Port numbers identify which application on a host should receive the data.", correct: "transport", explanation: "Ports are a Transport-layer concept, separate from IP addresses." },
  { id: "id-next-hop", prompt: "A router chooses the next hop toward the destination network.", correct: "internet", explanation: "Forwarding decisions based on the IP header are Internet-layer work." },
  { id: "id-signals", prompt: "Bits are converted into radio waves or electrical signals.", correct: "link", explanation: "In TCP/IP, physical transmission is part of the Network Access / Link layer." },
  { id: "id-dns", prompt: "A DNS lookup translates a name into an IP address.", correct: "application", explanation: "DNS is an application-layer protocol, even though other applications depend on it." },
  { id: "id-tls", prompt: "A web request is encrypted with TLS.", correct: "application", explanation: "TCP/IP has no separate Presentation layer, so encryption like TLS is handled at the Application layer." },
  { id: "id-segmentation", prompt: "A large message is split into pieces and reassembled at the other end.", correct: "transport", explanation: "Segmentation and reassembly are Transport-layer functions." },
  { id: "id-icmp", prompt: "An ICMP message reports that a destination is unreachable.", correct: "internet", explanation: "ICMP is an Internet-layer protocol that reports on IP delivery." },
  { id: "id-frame-check", prompt: "A frame is checked for transmission errors on one link.", correct: "link", explanation: "Frame handling and error detection on a single link is Network Access / Link work." },
  { id: "id-dhcp", prompt: "A device automatically receives its network settings when it joins a network.", correct: "application", explanation: "DHCP is an application-layer protocol." },
  { id: "id-retransmit", prompt: "Lost data is detected and sent again.", correct: "transport", explanation: "Detecting loss and retransmitting is what TCP does at the Transport layer." },
];

export const TROUBLESHOOTING_CASES: LayerQuestion[] = [
  { id: "ts-http-unavailable", title: "HTTP service unavailable", prompt: "A browser reaches the server, but the server answers with a \"service unavailable\" error page.", correct: "application", explanation: "The network delivered the request fine; the web service itself failed to answer properly — an Application-layer problem." },
  { id: "ts-tcp-refused", title: "TCP connection problem", prompt: "A server is reachable, but a connection to one specific service is refused or keeps timing out, as if nothing is listening on its port.", correct: "transport", explanation: "A problem with one connection or port while addressing and links work points to the Transport layer." },
  { id: "ts-ip-unreachable", title: "IP connectivity problem", prompt: "A PC can talk to devices on its own local network but cannot reach anything on other networks, and its gateway setting looks wrong.", correct: "internet", explanation: "Trouble reaching other networks, tied to addressing or the gateway, is an Internet-layer problem." },
  { id: "ts-wifi-link", title: "Ethernet / Wi-Fi link problem", prompt: "A laptop shows that it is not connected to the Wi-Fi network at all, or a cable has no link light.", correct: "link", explanation: "If the local link itself is down, nothing above it can work — a Network Access / Link problem." },
  { id: "ts-dns-name", title: "Works by number, not by name", prompt: "A website loads when you type its IP address but fails when you type its name.", correct: "application", explanation: "Name resolution is DNS, an application-layer protocol — the network path itself works." },
  { id: "ts-only-remote-fails", title: "Local works, remote packets vanish", prompt: "Pinging a remote host fails with \"destination unreachable\" messages coming back from a router along the path.", correct: "internet", explanation: "Unreachable messages come from the Internet layer (ICMP), pointing to a problem forwarding packets between networks." },
  { id: "ts-tcp-stall", title: "Connection starts, then stalls", prompt: "A file download begins but repeatedly stalls as data is lost and resent; other traffic on the link seems fine.", correct: "transport", explanation: "Loss, retransmission, and rate control are Transport-layer concerns when the link and addressing are otherwise healthy." },
];

// ---------------------------------------------------------------------------
// Detail levels
// ---------------------------------------------------------------------------

export const TCPIP_LEVEL_BLURBS = {
  beginner: "The four TCP/IP layers, their basic responsibilities, simple protocol examples, and how they compare to OSI.",
  intermediate: "Adds encapsulation, data units, request/response, the network path, layer mapping across both models, and troubleshooting.",
  technical: "Adds protocol roles, layer interactions, header details, TCP/IP vs. OSI design differences, and network-path reasoning.",
} as const;

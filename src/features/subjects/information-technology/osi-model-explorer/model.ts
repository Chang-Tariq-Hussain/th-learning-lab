/**
 * Pure data model for the OSI Model Explorer simulation — the second
 * topic in the Networking branch of Information Technology, following
 * Network Fundamentals & Topologies.
 *
 * This models the seven OSI layers, the standard PDU-per-layer
 * mapping, illustrative device-to-layer associations, a simplified
 * encapsulation/decapsulation sequence, and small conceptual exercises
 * (layer identification, troubleshooting). It deliberately stays at
 * the "conceptual map" level: no IP addressing, MAC addresses, ARP,
 * DHCP, DNS, switching internals, routing, or TCP/UDP mechanics — those
 * are reserved for their own later simulations in this branch, exactly
 * as the Network Fundamentals & Topologies model keeps them out of
 * scope for the same reason.
 */

export type OsiLayerNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface OsiLayer {
  number: OsiLayerNumber;
  name: string;
  /** One-line summary of the layer's main job. */
  responsibility: string;
  /** A simple, student-friendly real-world analogy or explanation. */
  realWorld: string;
  /** "What happens here?" mode — a slightly more technical, still
   *  beginner-friendly description of the concrete activity at this
   *  layer. */
  whatHappensHere: string;
  /** Familiar example protocols/technologies. Kept intentionally short
   *  — this is an introduction, not a protocol deep-dive. */
  protocols: string[];
  /** The commonly taught PDU (protocol data unit) name at this layer.
   *  Terminology varies by protocol/source, which every place this is
   *  shown says explicitly. */
  pdu: string;
  /** An illustrative device commonly associated with this layer, where
   *  one applies. Not every layer has a single obvious device (hosts
   *  participate at multiple layers), so this is optional. */
  device?: string;
  /** Short accent color token reused across this layer's visuals —
   *  purely presentational, one of the app's existing subject-neutral
   *  Tailwind-safe hex values. */
  accent: string;
}

/**
 * The seven layers, numbered the conventional OSI way (7 = top /
 * Application down to 1 = bottom / Physical). Stored in this order so
 * "top to bottom" is simply array order.
 */
export const OSI_LAYERS: OsiLayer[] = [
  {
    number: 7,
    name: "Application",
    responsibility: "Provides the network services that user-facing software actually talks to.",
    realWorld:
      "This is the layer closest to the user — the part of a web browser, email client, or app that formats a request like \"load this page\" or \"send this message.\"",
    whatHappensHere:
      "Software constructs the actual request or message a person or program cares about — a web page request, an email, a file transfer — using an application-layer protocol both ends understand.",
    protocols: ["HTTP", "HTTPS", "DNS", "DHCP", "FTP", "SMTP"],
    pdu: "Data",
    accent: "#7C3AED",
  },
  {
    number: 6,
    name: "Presentation",
    responsibility: "Translates, formats, encrypts, and compresses data so both ends can understand it.",
    realWorld:
      "Think of it as a translator: it makes sure data leaving one system (in whatever format or encoding it uses) arrives at the other end in a form that system can actually read — including encryption for privacy.",
    whatHappensHere:
      "Data is converted between formats/encodings (such as text encoding, or converting to/from a common wire format), optionally compressed, and optionally encrypted, before being handed down.",
    protocols: ["SSL/TLS (encryption)", "JPEG", "ASCII / Unicode encoding"],
    pdu: "Data",
    accent: "#6366F1",
  },
  {
    number: 5,
    name: "Session",
    responsibility: "Opens, manages, and closes the conversation between two applications.",
    realWorld:
      "Like keeping track of a phone call — this layer keeps two applications' conversation organized, so requests and responses stay matched up, from \"hello\" to \"goodbye.\"",
    whatHappensHere:
      "A logical session between the two communicating applications is established, kept synchronized, and eventually torn down — separate from any one lower-level connection.",
    protocols: ["Session APIs (e.g. sockets session handling)", "NetBIOS"],
    pdu: "Data",
    accent: "#3B82F6",
  },
  {
    number: 4,
    name: "Transport",
    responsibility: "Manages end-to-end delivery: dividing data into manageable pieces and, for some protocols, ensuring reliable delivery.",
    realWorld:
      "This is the layer that decides whether your data absolutely must all arrive and in order (like a file download) or whether occasional loss is acceptable for speed (like a live video call).",
    whatHappensHere:
      "Data is divided and managed using a transport protocol such as TCP (connection-oriented, reliable, ordered) or UDP (connectionless, faster, no delivery guarantee), and tagged with port numbers identifying which application it's for.",
    protocols: ["TCP", "UDP"],
    pdu: "Segment (TCP) / Datagram (UDP)",
    accent: "#0EA5E9",
  },
  {
    number: 3,
    name: "Network",
    responsibility: "Provides logical addressing and moves packets across different networks toward their destination.",
    realWorld:
      "This is the postal-routing layer — it figures out the path across many interconnected networks using addresses, the same way a postal address routes a letter across cities, not just across one street.",
    whatHappensHere:
      "Logical addressing and packet forwarding occur using protocols such as IP, with routers making forwarding decisions based on destination address to move packets closer to their destination network.",
    protocols: ["IP", "ICMP"],
    pdu: "Packet",
    device: "Router",
    accent: "#10B981",
  },
  {
    number: 2,
    name: "Data Link",
    responsibility: "Handles delivery of data across a single local link, using physical (hardware) addressing.",
    realWorld:
      "This is delivery within one neighborhood — getting a frame from one device to the next device directly connected to it, the way a local mail carrier only needs a street address, not a full postal route.",
    whatHappensHere:
      "Local network delivery uses frames and link-layer addressing such as MAC addresses with Ethernet, including basic error detection for data corrupted in transit across that one link.",
    protocols: ["Ethernet", "Wi-Fi (802.11)"],
    pdu: "Frame",
    device: "Switch",
    accent: "#F59E0B",
  },
  {
    number: 1,
    name: "Physical",
    responsibility: "Transmits raw bits as physical signals over a medium.",
    realWorld:
      "This is the actual wire, fiber, or radio wave — the raw electrical, optical, or radio signal that carries the 1s and 0s from one piece of hardware to another.",
    whatHappensHere:
      "Frames are converted into raw bits and transmitted as electrical signals, light pulses, or radio waves across cabling, fiber, or wireless media.",
    protocols: ["Ethernet physical media", "Fiber optics", "Radio (Wi-Fi, Bluetooth)"],
    pdu: "Bits",
    device: "Hub",
    accent: "#EF4444",
  },
];

export function getLayer(number: OsiLayerNumber): OsiLayer {
  const layer = OSI_LAYERS.find((l) => l.number === number);
  if (!layer) throw new Error(`Unknown OSI layer ${number}`);
  return layer;
}

// ---------------------------------------------------------------------------
// Encapsulation / decapsulation
// ---------------------------------------------------------------------------

/**
 * One stage of the encapsulation journey, ordered top (Application)
 * to bottom (Physical). Each stage after the first represents "the
 * previous stage's PDU, wrapped with this layer's own header (and, at
 * Data Link, a trailer too)." Decapsulation plays the same stages in
 * reverse, removing one wrapper per step instead of adding one.
 */
export interface EncapsulationStage {
  layer: OsiLayerNumber;
  /** The PDU name once this layer has done its work. */
  pduName: string;
  /** Short label for what was just added on the way down (or, read in
   *  reverse, what's about to be removed on the way up). */
  addedLabel: string;
  /** One sentence explaining the stage, written for the downward
   *  (encapsulation) direction. */
  description: string;
}

export const ENCAPSULATION_STAGES: EncapsulationStage[] = [
  {
    layer: 7,
    pduName: "Data",
    addedLabel: "Application data created",
    description: "The application builds the actual message or request — plain Data, nothing wrapped around it yet.",
  },
  {
    layer: 4,
    pduName: "Segment",
    addedLabel: "+ Transport header",
    description: "The Transport layer adds a header (with port numbers, and sequencing for TCP) around the data, forming a Segment.",
  },
  {
    layer: 3,
    pduName: "Packet",
    addedLabel: "+ Network header",
    description: "The Network layer adds a header with source and destination logical (IP) addresses, forming a Packet.",
  },
  {
    layer: 2,
    pduName: "Frame",
    addedLabel: "+ Data Link header & trailer",
    description: "The Data Link layer wraps the packet with a header (link-layer addresses) and a trailer (error checking), forming a Frame.",
  },
  {
    layer: 1,
    pduName: "Bits",
    addedLabel: "Converted to bits",
    description: "The Physical layer converts the frame into raw bits and transmits them as signals across the medium.",
  },
];

/** Presentation and Session are folded into "Data" for the simplified
 *  encapsulation animation (matching how most introductory treatments
 *  present it), but are still explained in their own layer detail —
 *  this note is surfaced directly in the encapsulation lab's UI. */
export const ENCAPSULATION_SIMPLIFICATION_NOTE =
  "This simplified view groups Application, Presentation, and Session together as \"Data,\" since they don't add a separate, commonly-taught PDU name of their own. The exact terminology and header details also vary by protocol — this shows the commonly taught pattern, not a byte-for-byte spec.";

// ---------------------------------------------------------------------------
// Data units (PDU) table
// ---------------------------------------------------------------------------

export const PDU_TABLE: { layer: OsiLayerNumber; layerName: string; pdu: string }[] = OSI_LAYERS.map((l) => ({
  layer: l.number,
  layerName: l.name,
  pdu: l.pdu,
}));

// ---------------------------------------------------------------------------
// Layer identification challenge
// ---------------------------------------------------------------------------

export interface LayerIdItem {
  id: string;
  statement: string;
  correctLayer: OsiLayerNumber;
  explanation: string;
}

export const LAYER_ID_ITEMS: LayerIdItem[] = [
  {
    id: "id-router-forwards",
    statement: "A router forwards an IP packet toward its destination network.",
    correctLayer: 3,
    explanation: "Forwarding based on logical (IP) addressing is Network layer work.",
  },
  {
    id: "id-ethernet-frame",
    statement: "An Ethernet frame is transmitted across a local link using MAC addresses.",
    correctLayer: 2,
    explanation: "Framing and local delivery using MAC addresses is Data Link layer work.",
  },
  {
    id: "id-tcp-retransmit",
    statement: "A lost segment is detected and retransmitted to guarantee reliable delivery.",
    correctLayer: 4,
    explanation: "Reliable, ordered delivery (as TCP provides) is Transport layer work.",
  },
  {
    id: "id-https-request",
    statement: "A browser builds an HTTPS request for a web page.",
    correctLayer: 7,
    explanation: "Constructing the actual request an application cares about is Application layer work.",
  },
  {
    id: "id-signal-cable",
    statement: "An electrical signal representing bits travels down a copper Ethernet cable.",
    correctLayer: 1,
    explanation: "Raw signal transmission over a physical medium is Physical layer work.",
  },
  {
    id: "id-tls-encrypt",
    statement: "Data is encrypted with TLS before being handed to the transport connection.",
    correctLayer: 6,
    explanation: "Encryption/formatting of data for transmission is Presentation layer work.",
  },
  {
    id: "id-session-resume",
    statement: "Two applications keep their ongoing conversation synchronized across several exchanges.",
    correctLayer: 5,
    explanation: "Establishing and managing a logical session between applications is Session layer work.",
  },
  {
    id: "id-port-number",
    statement: "A port number is used to identify which application on a device a segment is meant for.",
    correctLayer: 4,
    explanation: "Port numbers are a Transport layer addressing concept, separate from IP addresses.",
  },
  {
    id: "id-switch-mac-table",
    statement: "A switch decides which physical port to forward a frame out of, based on a MAC address.",
    correctLayer: 2,
    explanation: "Forwarding by MAC address within one local network is Data Link layer work.",
  },
  {
    id: "id-dns-lookup",
    statement: "A device sends a DNS request to resolve a domain name to an IP address.",
    correctLayer: 7,
    explanation: "DNS is an application-layer protocol — the request itself is built at the Application layer.",
  },
  {
    id: "id-wifi-radio",
    statement: "A laptop's Wi-Fi adapter converts frames into radio waves to send them over the air.",
    correctLayer: 1,
    explanation: "Turning data into a transmittable signal (here, radio waves) is Physical layer work.",
  },
  {
    id: "id-icmp-ping",
    statement: "A device sends an ICMP message to test whether another device is reachable.",
    correctLayer: 3,
    explanation: "ICMP operates alongside IP at the Network layer.",
  },
];

// ---------------------------------------------------------------------------
// Troubleshooting mode
// ---------------------------------------------------------------------------

export interface TroubleshootingCase {
  id: string;
  title: string;
  symptom: string;
  correctLayer: OsiLayerNumber;
  explanation: string;
}

export const TROUBLESHOOTING_CASES: TroubleshootingCase[] = [
  {
    id: "ts-cable-unplugged",
    title: "No link light on the network adapter",
    symptom: "A PC's network adapter shows no link light at all, and the cable was recently kicked loose from the wall.",
    correctLayer: 1,
    explanation: "No signal at all, traced to the cable itself, points to the Physical layer — nothing above it can work without a working physical connection.",
  },
  {
    id: "ts-nic-driver",
    title: "Ethernet connection shows as unplugged in software, cable is fine",
    symptom: "The cable is firmly connected and tests fine, but the operating system reports the Ethernet connection as down and no frames are being sent or received.",
    correctLayer: 2,
    explanation: "With the physical medium confirmed working, a link-layer problem (like a misbehaving adapter or interface) prevents frames from being sent — Data Link layer.",
  },
  {
    id: "ts-wrong-ip-config",
    title: "Device can reach the local network but nothing beyond it",
    symptom: "A PC can talk to other devices on the same local network, but every request to a different network outright fails, and its gateway address looks wrong.",
    correctLayer: 3,
    explanation: "Trouble routing beyond the local network, tied to addressing/gateway configuration, points to the Network layer.",
  },
  {
    id: "ts-port-blocked",
    title: "A specific application can't connect, others work fine",
    symptom: "A web browser connects normally, but one specific application's connection is refused every time, and its port appears to be blocked or the service isn't listening.",
    correctLayer: 4,
    explanation: "A problem isolated to one application's connection/port, while addressing and lower layers are fine, points to the Transport layer.",
  },
  {
    id: "ts-app-service-down",
    title: "The connection succeeds, but the website shows an error page",
    symptom: "The connection to the server is established without any error, but the website itself returns a server error page instead of the expected content.",
    correctLayer: 7,
    explanation: "Once a connection is established fine and the problem is with the actual application response, it's an Application layer problem — the network delivered the request correctly.",
  },
];

// ---------------------------------------------------------------------------
// OSI vs TCP/IP (small introductory comparison only)
// ---------------------------------------------------------------------------

export interface TcpIpLayerGroup {
  name: string;
  /** Which OSI layer numbers this TCP/IP layer roughly corresponds to. */
  osiLayers: OsiLayerNumber[];
}

export const TCP_IP_LAYERS: TcpIpLayerGroup[] = [
  { name: "Application", osiLayers: [7, 6, 5] },
  { name: "Transport", osiLayers: [4] },
  { name: "Internet", osiLayers: [3] },
  { name: "Network Access", osiLayers: [2, 1] },
];

// ---------------------------------------------------------------------------
// Packet journey (Computer -> Switch -> Router -> Computer)
// ---------------------------------------------------------------------------

/** A minimal, fixed network used only to illustrate where OSI layers
 *  conceptually participate along a simple path — not a routing
 *  engine, and deliberately smaller/simpler than the full graph model
 *  in the Network Fundamentals & Topologies simulation. */
export interface JourneyNode {
  id: string;
  label: string;
  kind: "host" | "switch" | "router";
  x: number;
  y: number;
  /** OSI layers this device conceptually participates at, for the
   *  highlight shown while a packet passes through it. */
  layers: OsiLayerNumber[];
}

export const PACKET_JOURNEY_NODES: JourneyNode[] = [
  { id: "pc-a", label: "Computer A", kind: "host", x: 60, y: 150, layers: [7, 6, 5, 4, 3, 2, 1] },
  { id: "sw-a", label: "Switch", kind: "switch", x: 220, y: 150, layers: [2, 1] },
  { id: "rt", label: "Router", kind: "router", x: 380, y: 150, layers: [3, 2, 1] },
  { id: "pc-b", label: "Computer B", kind: "host", x: 540, y: 150, layers: [7, 6, 5, 4, 3, 2, 1] },
];

export const PACKET_JOURNEY_LINKS: { a: string; b: string }[] = [
  { a: "pc-a", b: "sw-a" },
  { a: "sw-a", b: "rt" },
  { a: "rt", b: "pc-b" },
];

// ---------------------------------------------------------------------------
// Beginner / Intermediate / Technical detail levels
// ---------------------------------------------------------------------------

export type DetailLevel = "beginner" | "intermediate" | "technical";

export const DETAIL_LEVEL_LABELS: Record<DetailLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  technical: "Technical",
};

export const DETAIL_LEVEL_BLURBS: Record<DetailLevel, string> = {
  beginner: "The seven layers, simple responsibilities, basic examples, and encapsulation.",
  intermediate: "Adds PDUs, protocol examples, devices, decapsulation, and troubleshooting.",
  technical: "Adds layer interaction detail, headers, the TCP/IP relationship, and harder troubleshooting scenarios.",
};

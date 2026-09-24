import type { LearningPath } from "../types";

/**
 * Networking Fundamentals learning path — the front door of the new
 * Networking branch within Information Technology, kept separate from
 * `information-technology-computer-fundamentals` and
 * `information-technology-operating-systems` (no prerequisite
 * relationship to either). Three topics exist today (Network
 * Fundamentals & Topologies, OSI Model Explorer, then TCP/IP Model
 * Explorer); later simulations (Ethernet & MAC Addresses, IP Addressing,
 * Subnetting, ARP, DHCP, DNS, Switch & MAC Address Table, Routing,
 * NAT, TCP vs UDP, Ports & Sockets, ICMP & Ping, Packet Journey) get
 * appended here in order as they're built, per the brief's intended
 * sequence — this path is guidance, not a gate, so direct access to
 * any simulation stays available regardless of progress.
 */
export const informationTechnologyNetworkingFundamentalsPath: LearningPath = {
  id: "information-technology-networking-fundamentals",
  subjectSlug: "information-technology",
  title: "Networking Fundamentals",
  description: "Build a solid visual understanding of computer networks — devices, links, topologies, and how data travels — before later topics cover addressing and protocols.",
  colorToken: "it",
  topics: [
    {
      subjectSlug: "information-technology",
      topicSlug: "network-fundamentals-topologies",
      title: "Network Fundamentals & Topologies",
      description: "What a network is, how topologies shape resilience, client-server vs. peer-to-peer, and the basics of bandwidth, latency, and throughput.",
      href: "/dashboard/information-technology/network-fundamentals-topologies",
      prerequisites: [],
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "osi-model-explorer",
      title: "OSI Model Explorer",
      description: "The seven OSI layers, encapsulation and decapsulation, PDUs, devices, protocol examples, and conceptual troubleshooting.",
      href: "/dashboard/information-technology/osi-model-explorer",
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "tcp-ip-model-explorer",
      title: "TCP/IP Model Explorer",
      description: "The four TCP/IP layers, how they map to OSI, encapsulation and data units, a request/response journey, protocol placement, and conceptual troubleshooting.",
      href: "/dashboard/information-technology/tcp-ip-model-explorer",
    },
  ],
};

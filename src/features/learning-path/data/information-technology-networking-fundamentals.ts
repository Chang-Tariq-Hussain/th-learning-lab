import type { LearningPath } from "../types";

/**
 * Networking Fundamentals learning path — the front door of the new
 * Networking branch within Information Technology, kept separate from
 * `information-technology-computer-fundamentals` and
 * `information-technology-operating-systems` (no prerequisite
 * relationship to either). Only the first topic in the branch exists
 * today; later simulations (OSI Model, TCP/IP Model, Ethernet & MAC
 * Addresses, IP Addressing, Subnetting, ARP, DHCP, DNS, Switch & MAC
 * Address Table, Routing, NAT, TCP vs UDP, Ports & Sockets, ICMP &
 * Ping, Packet Journey) get appended here in order as they're built,
 * per the brief's intended sequence — this path is guidance, not a
 * gate, so direct access to the simulation stays available regardless.
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
  ],
};

import type { TopicContent } from "../types";

/** Interactive scenario ids — must match `ARP_CHALLENGE_IDS` in the simulation's `challenges.ts`. */
const CH_RESOLVE = "arp-challenge-resolve-local";
const CH_CLEAR = "arp-challenge-clear-repeat";
const CH_FIX = "arp-challenge-fix-mapping";

export const informationTechnologyArpSimulatorContent: TopicContent = {
  subjectSlug: "information-technology",
  topicSlug: "arp-simulator",
  title: "ARP Simulator",
  subjectLabel: "Information Technology",
  topicLabel: "ARP Simulator",
  colorToken: "it",
  simulationHref: "/dashboard/information-technology/arp-simulator",

  learn: {
    objectives: [
      "Explain why a device needs ARP before it can send an Ethernet frame to an IPv4 address on its local network",
      "Describe the ARP request (broadcast) and the ARP reply (unicast), and read their main fields",
      "Explain the ARP cache and why a cache hit needs no ARP request",
      "Decide whose MAC address is resolved for a local destination and for a remote destination (the default gateway)",
    ],
    whyItMatters:
      "Applications use IP addresses, but an Ethernet frame is delivered using MAC addresses. ARP is the small step that connects the two on every IPv4 LAN, and it runs constantly without anyone noticing. Understanding it explains why the first packet to a new device is slower, why a wrong IP or a wrong cache entry breaks communication, and why traffic to another network is addressed to the router. It also prepares the ground for DHCP, DNS, switching and routing.",
    concepts: [
      {
        term: "The problem ARP solves",
        explanation:
          "A device usually knows the destination IPv4 address, but the Ethernet frame it must build needs a destination MAC address. ARP (Address Resolution Protocol) finds the MAC address that goes with an IPv4 address on the local network. The chain is: IPv4 address → ARP → MAC address → Ethernet frame.",
      },
      {
        term: "ARP request",
        explanation:
          "\"Who has 192.168.1.20? Tell 192.168.1.10.\" The sender puts its own IP and MAC address in the message and leaves the target MAC unknown. It is sent in an Ethernet frame to the broadcast MAC address FF:FF:FF:FF:FF:FF, so every device on the LAN receives it.",
      },
      {
        term: "ARP reply",
        explanation:
          "The device that owns the requested IP answers: \"192.168.1.20 is at BA:BB:BB:BB:BB:20.\" A reply is normally a unicast frame sent straight back to the requester. Every other device ignores the request because the Target IP is not theirs.",
      },
      {
        term: "ARP cache",
        explanation:
          "Each device keeps a table of IPv4 address → MAC address mappings it has already learned. Before sending an ARP request the device checks the cache. A cache hit means the MAC address is already known and no request is needed; a cache miss means ARP must ask the network. Real systems age entries out after a while.",
      },
      {
        term: "Learned and static entries",
        explanation:
          "A learned (dynamic) entry is added automatically from ARP traffic. A static entry is configured by hand and is not replaced by ARP replies. Real operating systems differ in the details of both.",
      },
      {
        term: "No owner, no reply",
        explanation:
          "If no device on the local network owns the requested IP address, nobody replies and the destination MAC stays unknown. The Ethernet frame cannot be built, so the data is not sent. Real systems retry a few times before giving up; this lab does not simulate those timers.",
      },
      {
        term: "Local destination",
        explanation:
          "If the destination IP is in the sender's own network (address AND subnet mask gives the same network address), the sender resolves the destination's own MAC address and sends the frame directly to it.",
      },
      {
        term: "Remote destination and the default gateway",
        explanation:
          "If the destination is on another network, the sender does not ARP for it. It resolves the MAC address of its default gateway (the router on its own network) and sends the frame there. The Ethernet destination MAC is the gateway's, while the IP packet inside still carries the remote host's IP address. ARP resolves the next local-link destination, not the final remote host's MAC address.",
      },
      {
        term: "ARP and IPv4",
        explanation:
          "ARP is part of IPv4 networking. IPv6 uses a different mechanism (Neighbor Discovery), which is not covered in this lab.",
      },
    ],
    keyTerms: [
      { term: "ARP", definition: "Address Resolution Protocol: finds the MAC address for an IPv4 address on the local network." },
      { term: "ARP request", definition: "A broadcast asking which device owns a given IPv4 address." },
      { term: "ARP reply", definition: "A unicast answer giving the MAC address that goes with the requested IPv4 address." },
      { term: "ARP cache", definition: "A device's table of IPv4 address → MAC address mappings." },
      { term: "Cache hit / miss", definition: "The mapping is found in the cache, or it is not." },
      { term: "Broadcast MAC address", definition: "FF:FF:FF:FF:FF:FF: the destination that means every device on the local network." },
      { term: "Default gateway", definition: "The router on the local network that a device uses to reach other networks." },
      { term: "Next hop", definition: "The next device on the local link that a frame is sent to." },
    ],
    visualAids: [],
    misconceptions: [
      {
        id: "arp-remote-host-mac",
        misconception: "To send to a remote server, my computer uses ARP to find the remote server's MAC address.",
        correction: "ARP only works on the local network. For a remote destination the sender resolves the MAC address of its default gateway, and the frame is addressed to the gateway.",
      },
      {
        id: "arp-every-packet",
        misconception: "ARP runs before every single packet.",
        correction: "ARP runs when the mapping is not in the ARP cache. Once learned, the entry is reused until it is removed or ages out.",
      },
      {
        id: "arp-reply-broadcast",
        misconception: "The ARP reply is also broadcast to everyone.",
        correction: "The request is broadcast because the sender does not know who owns the address. The reply is normally a unicast, because the owner already knows who asked.",
      },
      {
        id: "arp-ip-from-mac",
        misconception: "ARP finds the IP address for a MAC address.",
        correction: "ARP works the other way round: it starts with a known IPv4 address and finds the MAC address that goes with it.",
      },
      {
        id: "arp-ipv6",
        misconception: "ARP is used by every kind of IP network, including IPv6.",
        correction: "ARP is used with IPv4. IPv6 uses Neighbor Discovery instead.",
      },
    ],
  },

  predict: {
    intro: "Commit to a prediction for each one, then check yourself in the lab.",
    scenarios: [
      {
        id: "predict-arp-request-dst",
        scenario: "PC-A (192.168.1.10) has an empty ARP cache and sends data to PC-B (192.168.1.20).",
        question: "What is the destination MAC address of the ARP request frame?",
        options: [
          { id: "a", label: "PC-B's MAC address" },
          { id: "b", label: "FF:FF:FF:FF:FF:FF (broadcast)" },
          { id: "c", label: "00:00:00:00:00:00" },
        ],
        actualResultOptionId: "b",
        explanation: "PC-A does not know who owns 192.168.1.20, so the request goes to the broadcast address and reaches every device on the LAN. If it knew PC-B's MAC it would not need to ask.",
        hint: "Would PC-A be asking if it already knew PC-B's MAC address?",
      },
      {
        id: "predict-arp-reply-type",
        scenario: "PC-B receives the ARP request for 192.168.1.20.",
        question: "How does PC-B send the ARP reply?",
        options: [
          { id: "a", label: "As a broadcast to everyone" },
          { id: "b", label: "As a unicast to PC-A" },
          { id: "c", label: "It does not reply" },
        ],
        actualResultOptionId: "b",
        explanation: "The request carried PC-A's IP and MAC address, so PC-B can answer PC-A directly. Only PC-A receives the reply.",
      },
      {
        id: "predict-arp-cache-hit",
        scenario: "PC-A's cache already contains 192.168.1.20 → PC-B's MAC. PC-A sends another message to 192.168.1.20.",
        question: "How many ARP requests are sent?",
        options: [
          { id: "a", label: "0" },
          { id: "b", label: "1" },
          { id: "c", label: "2" },
        ],
        actualResultOptionId: "a",
        explanation: "The cache already has the mapping, so PC-A builds the Ethernet frame straight away. No ARP request is needed.",
      },
      {
        id: "predict-arp-unknown-ip",
        scenario: "PC-A sends data to 192.168.1.99. No device on the LAN has that address.",
        question: "What happens?",
        options: [
          { id: "a", label: "The router replies for it" },
          { id: "b", label: "Nobody replies, so the MAC stays unknown and the data is not sent" },
          { id: "c", label: "PC-A uses the broadcast MAC as the destination" },
        ],
        actualResultOptionId: "b",
        explanation: "Every device receives the broadcast, none owns the address, and no reply comes back. Without a destination MAC the frame cannot be built.",
      },
      {
        id: "predict-arp-gateway",
        scenario: "PC-A (192.168.1.10/24, gateway 192.168.1.1) sends data to 192.168.2.20.",
        question: "Which IP address does PC-A ask about in its ARP request?",
        options: [
          { id: "a", label: "192.168.2.20" },
          { id: "b", label: "192.168.1.1" },
          { id: "c", label: "192.168.1.255" },
        ],
        actualResultOptionId: "b",
        explanation: "192.168.2.20 is on another network, so PC-A resolves the MAC address of its default gateway, 192.168.1.1, and sends the frame to the router.",
        hint: "Is 192.168.2.20 inside PC-A's own network?",
      },
    ],
  },

  explore: {
    howToUse: [
      "Open Resolve an Address, keep First communication selected and press Step ▶ repeatedly. Watch the key chain along the top, the diagram, and PC-A's ARP cache.",
      "Press Send another message (or choose Cache hit) and compare: the request and reply steps are skipped.",
      "Choose Unknown IP and follow the request to every device. See what is missing at the end.",
      "Choose Remote destination. Read which IP address the ARP request asks about, then open the frame and compare the destination MAC with the IP destination.",
      "Open ARP Messages to compare a request and a reply field by field. Switch to Technical to reveal every header field.",
      "Open ARP Cache, pick a device, and clear or reset its cache. In Intermediate you can add a static entry too.",
    ],
    tryThis: [
      "Use Custom destination to send from PC-C to PC-D. Which devices' caches change?",
      "Send to 192.168.1.1 (the router). Is the router a local destination?",
      "Send to 10.0.0.5. Whose MAC address does the sender resolve?",
      "Clear PC-A's cache and repeat a cache-hit scenario. What changes?",
      "Look at the router's or PC-B's cache after a reply: why did it learn PC-A's mapping as well?",
    ],
  },

  explain: {
    questions: [
      {
        id: "explain-why-broadcast",
        question: "Why is the ARP request sent as a broadcast?",
        answer: "The sender knows only the IP address, not which device owns it or what its MAC address is. The broadcast MAC address FF:FF:FF:FF:FF:FF delivers the question to every device on the local network, and the owner recognises its own IP address in the Target IP field.",
      },
      {
        id: "explain-why-unicast-reply",
        question: "Why is the ARP reply normally unicast?",
        answer: "The request already told the owner the requester's IP and MAC address, so it can reply directly. A unicast keeps the answer from interrupting every other device.",
      },
      {
        id: "explain-why-cache",
        question: "Why does a device keep an ARP cache?",
        answer: "Asking the whole LAN before every packet would waste time and bandwidth. Remembering recent answers lets later packets skip the request. Real caches forget entries after a while, so wrong or outdated mappings do not last forever.",
      },
      {
        id: "explain-why-gateway",
        question: "Why does PC-A resolve the gateway's MAC address instead of the remote host's?",
        answer: "Ethernet frames only travel on the local link, and a device can only reach another device on that link. The remote host is not on it. The router is, so the frame is addressed to the router's MAC while the IP packet inside still names the remote host. The router then takes over for the next link.",
      },
      {
        id: "explain-ip-mac-both",
        question: "Why do we need both IP addresses and MAC addresses?",
        answer: "The IP address identifies a device's place in the network and stays the same from source to destination. The MAC address identifies an interface on one local link and is used to deliver the frame across that link only. ARP connects the two.",
      },
    ],
  },

  practice: { quizId: "it-arp-simulator-practice" },

  challenge: {
    intro: "Use the lab to solve realistic ARP problems. Some challenges check the caches and the runs you actually produce.",
    scenarios: [
      {
        id: CH_RESOLVE,
        title: "Resolve a local device's MAC address",
        scenario: "PC-A has just started and its ARP cache is empty.",
        objective: "Make PC-A learn the MAC address of PC-C (192.168.1.30).",
        answer: { mode: "interactive", instructions: "Send data from PC-A to PC-C and let ARP finish, then check.", verifyLabel: "Check my work" },
        hints: ["The destination is 192.168.1.30. Press Play or Step until the run ends.", "Look at PC-A's ARP cache after the run for 192.168.1.30."],
        explanation: "PC-A broadcast an ARP request for 192.168.1.30, PC-C replied with its MAC address, and PC-A stored 192.168.1.30 → PC-C's MAC as a learned entry.",
      },
      {
        id: "arp-challenge-no-reply",
        title: "Diagnose why an ARP request receives no reply",
        scenario: "PC-A sends to 192.168.1.50. The request is broadcast and every device receives it, but PC-A's cache stays empty and the data is never sent. PCs on this LAN are 192.168.1.10, .20, .30 and .40, and the router is 192.168.1.1.",
        objective: "What is the most likely reason?",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "No device on the LAN owns 192.168.1.50" },
            { id: "b", label: "The switch does not support broadcast" },
            { id: "c", label: "The ARP reply was sent as a broadcast and got lost" },
            { id: "d", label: "PC-A's own MAC address is wrong" },
          ],
          correctOptionId: "a",
        },
        hints: ["Compare the Target IP with the IP address of every device.", "A reply is sent only by the owner of the requested address."],
        explanation: "Nobody owns 192.168.1.50, so no device answers. A mistyped IP address, an unplugged or powered-off device, or a wrong network all look the same from the sender's side.",
        requiresExperiment: false,
      },
      {
        id: "arp-challenge-frame-mac",
        title: "Identify the correct destination MAC for an Ethernet frame",
        scenario: "PC-A (192.168.1.10/24, default gateway 192.168.1.1) sends data to a web server at 192.168.2.20 on another network. The router's LAN MAC is 02:5D:11:A0:00:01.",
        objective: "What is the destination MAC address of the Ethernet frame that leaves PC-A?",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "The web server's MAC address" },
            { id: "b", label: "FF:FF:FF:FF:FF:FF" },
            { id: "c", label: "02:5D:11:A0:00:01 (the router's MAC)" },
            { id: "d", label: "PC-A's own MAC address" },
          ],
          correctOptionId: "c",
        },
        hints: ["Is 192.168.2.20 inside PC-A's own network?", "Which device on PC-A's local link can carry the frame onward?"],
        explanation: "The destination is remote, so the frame goes to the default gateway. The Ethernet destination is the router's MAC address, while the IP packet inside still names 192.168.2.20.",
        requiresExperiment: false,
      },
      {
        id: CH_CLEAR,
        title: "Clear the ARP cache and repeat the communication",
        scenario: "PC-A already knows PC-B and PC-C, so sending to PC-B needs no ARP.",
        objective: "Force PC-A to ask the network for PC-B's MAC address again (192.168.1.20).",
        answer: { mode: "interactive", instructions: "Clear PC-A's cache, send to PC-B, let ARP finish, then check.", verifyLabel: "Check my work" },
        hints: ["Use Clear cache on PC-A.", "Then send data to 192.168.1.20 and let the run finish."],
        explanation: "With PC-A's cache cleared, the lookup misses, so PC-A broadcasts an ARP request, PC-B replies, and PC-A learns the mapping again.",
      },
      {
        id: "arp-challenge-when-arp",
        title: "Determine when ARP is required",
        scenario: "PC-A (192.168.1.10/24) sends four messages. Its ARP cache holds only 192.168.1.1 (the gateway) and 192.168.1.20.",
        objective: "Which message needs a new ARP request?",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "A message to 192.168.1.20" },
            { id: "b", label: "A message to 8.8.8.8 (another network)" },
            { id: "c", label: "A message to 192.168.1.40 (a local PC)" },
            { id: "d", label: "A second message to 192.168.1.1" },
          ],
          correctOptionId: "c",
        },
        hints: ["Work out the next hop for each destination: the destination itself, or the gateway.", "Then look the next hop up in the cache."],
        explanation: "192.168.1.20 and the gateway 192.168.1.1 are cached, and 8.8.8.8 is remote so its next hop is the cached gateway. Only 192.168.1.40 is local and missing from the cache, so it needs ARP.",
        requiresExperiment: false,
      },
      {
        id: "arp-challenge-gateway-mac",
        title: "Identify when the gateway's MAC should be resolved",
        scenario: "A PC with the address 10.1.1.20/24 and default gateway 10.1.1.1 wants to send data.",
        objective: "For which destination does the PC resolve the MAC address of 10.1.1.1?",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "10.1.1.55" },
            { id: "b", label: "10.1.1.255" },
            { id: "c", label: "10.1.2.55" },
            { id: "d", label: "10.1.1.1 is never resolved" },
          ],
          correctOptionId: "c",
        },
        hints: ["A /24 keeps the first three numbers as the network.", "Which destination is outside 10.1.1.0/24?"],
        explanation: "10.1.2.55 is on a different network (10.1.2.0/24), so the PC sends the frame to its default gateway and resolves 10.1.1.1. 10.1.1.55 is local; 10.1.1.255 is the broadcast address of the local network.",
        requiresExperiment: false,
      },
      {
        id: CH_FIX,
        title: "Diagnose an incorrect IP/MAC mapping",
        scenario: "PC-A's cache says 192.168.1.20 is at PC-C's MAC address. Data for PC-B keeps going to the wrong device.",
        objective: "Fix PC-A's cache so it holds PC-B's real MAC address for 192.168.1.20.",
        answer: { mode: "interactive", instructions: "Send once to see the problem, remove the bad entry, let ARP relearn the address, then check.", verifyLabel: "Check my work" },
        hints: ["Clear cache removes learned entries only. This bad entry is static.", "Remove it by hand, then send to 192.168.1.20 again."],
        explanation: "The cached mapping did not match the real owner, so PC-C's network card accepted frames that PC-B's IP layer never saw. Removing the bad entry lets ARP learn the correct one.",
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "information-technology",
      topicSlug: "ethernet-mac-simulator",
      label: "Ethernet & MAC Address Simulator",
      reason: "ARP messages travel in Ethernet frames, and the switch delivers the broadcast request and the unicast reply.",
      href: "/dashboard/information-technology/ethernet-mac-simulator",
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "ip-addressing-simulator",
      label: "IP Addressing Simulator",
      reason: "Deciding whether a destination is local or remote, and the default gateway, come from IP addressing.",
      href: "/dashboard/information-technology/ip-addressing-simulator",
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "subnetting-laboratory",
      label: "Subnetting Laboratory",
      reason: "The subnet mask decides which addresses are on the local link, and so which addresses ARP can resolve directly.",
      href: "/dashboard/information-technology/subnetting-laboratory",
    },
  ],
};

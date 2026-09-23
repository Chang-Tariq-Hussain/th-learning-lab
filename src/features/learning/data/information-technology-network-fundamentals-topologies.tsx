import type { TopicContent } from "../types";

export const informationTechnologyNetworkFundamentalsTopologiesContent: TopicContent = {
  subjectSlug: "information-technology",
  topicSlug: "network-fundamentals-topologies",
  title: "Network Fundamentals & Topologies",
  subjectLabel: "Information Technology",
  topicLabel: "Network Fundamentals & Topologies",
  colorToken: "it",
  simulationHref: "/dashboard/information-technology/network-fundamentals-topologies",

  learn: {
    objectives: [
      "Explain what a computer network is, using nodes, links, and hosts",
      "Describe LAN, WAN, PAN, and MAN, and know they're useful mental models rather than strict boundaries",
      "Compare Bus, Star, Ring, Mesh, Tree, and Hybrid topologies by scalability, redundancy, and failure behavior",
      "Identify a single point of failure in a network and explain how redundancy addresses it",
      "Distinguish bandwidth, latency, throughput, and packet loss, and explain why higher bandwidth doesn't fix the other three",
      "Compare the Client–Server and Peer-to-Peer architectures",
    ],
    whyItMatters:
      "Before learning IP addresses, MAC addresses, or routing protocols, it helps to have a solid picture of what a network physically and structurally is — devices, the links between them, and the shape those links form. That shape (the topology) quietly decides how a network behaves when something breaks, which is the same question every later networking topic in this branch builds on.",
    concepts: [
      {
        term: "Network, node, and link",
        explanation:
          "A network is a set of devices connected so they can exchange data. Each device is a node; each connection between two nodes is a link. A node that actively sends or receives data is often called a host.",
      },
      {
        term: "LAN, WAN, PAN, MAN",
        explanation:
          "Rough categories by how much area a network covers: a PAN spans a few meters around one person, a LAN spans one site (a home, office, or building), a MAN spans a city or campus, and a WAN spans a large geographic area, often connecting several LANs together. Real networks don't respect strict boundaries between these — they're useful vocabulary, not hard rules.",
      },
      {
        term: "Network topology",
        explanation:
          "The pattern formed by a network's links — Bus (one shared backbone), Star (everything through one center), Ring (a closed loop), Mesh (many direct interconnections), Tree (a hierarchy), or Hybrid (a mix). The same number of devices can be wired in very different shapes, each with different scalability and failure characteristics.",
      },
      {
        term: "Single point of failure",
        explanation:
          "A device or link whose failure disconnects part of the network. A Star topology's central switch is the classic example — every spoke depends on it. Adding redundancy (an extra path) is the usual way to remove a single point of failure.",
      },
      {
        term: "Client–Server vs. Peer-to-Peer",
        explanation:
          "Client–Server concentrates providing data or services in one or more dedicated servers, with other devices acting as clients that request from them. Peer-to-Peer lets every device act as both a client and a provider to the others, with no dedicated server.",
      },
      {
        term: "Bandwidth, latency, throughput",
        explanation:
          "Bandwidth is a connection's theoretical maximum capacity. Latency is the delay before data arrives. Throughput is the actual data rate achieved once real conditions — load, latency, and packet loss — are accounted for. They're independent: a link can have high bandwidth and still perform poorly if latency or loss is high.",
      },
      {
        term: "Packet loss and congestion",
        explanation:
          "Packet loss means some transmitted packets fail to reach their destination. Congestion happens when multiple flows demand more than a shared link's capacity, causing queueing delay and, often, more loss — a capacity problem, not a broken connection.",
      },
    ],
    keyTerms: [
      { term: "Host", definition: "A device that actively sends or receives data on the network." },
      { term: "Redundancy", definition: "An extra path added so the network survives the loss of one device or link." },
      { term: "Bandwidth", definition: "The theoretical, available capacity of a connection." },
      { term: "Throughput", definition: "The data rate actually achieved, after real-world conditions are accounted for." },
      { term: "Packet", definition: "A unit data is broken into for transmission across a network." },
    ],
    visualAids: [],
    misconceptions: [
      {
        id: "faster-internet-fixes-everything",
        misconception: "A higher-bandwidth connection automatically means lower latency and no packet loss.",
        correction:
          "Bandwidth, latency, and packet loss are independent properties of a connection. A very high-bandwidth link can still have high latency (for example, over a long physical distance) or drop packets due to interference or congestion.",
      },
      {
        id: "mesh-always-best",
        misconception: "A fully meshed network is always the best choice because it has the most redundancy.",
        correction:
          "A full mesh needs a link between every pair of devices, which becomes very expensive and complex to wire and manage as the network grows. Suitability depends on requirements, not on maximizing any single property.",
      },
      {
        id: "wireless-always-slower",
        misconception: "Wireless connections are always slower and less reliable than wired ones.",
        correction:
          "Wireless is more exposed to interference and distance effects, but modern wireless links can have high bandwidth. The right comparison depends on the specific technologies and conditions involved, not a blanket rule.",
      },
    ],
  },

  predict: {
    intro: "Before opening the labs, commit to a prediction for each of these — then go check yourself.",
    scenarios: [
      {
        id: "predict-star-failure",
        scenario: "A Star topology connects five PCs through one central switch. The central switch fails.",
        question: "What happens to the five PCs?",
        options: [
          { id: "a", label: "All five lose connectivity to each other" },
          { id: "b", label: "Only the PC closest to the switch loses connectivity" },
          { id: "c", label: "Nothing changes, since PCs don't depend on the switch" },
        ],
        actualResultOptionId: "a",
        explanation:
          "Every PC in a Star topology only connects through the central switch, so losing it disconnects everyone from everyone else — the switch is a single point of failure.",
        hint: "In a Star, how many paths exist between any two PCs?",
      },
      {
        id: "predict-mesh-failure",
        scenario: "A Mesh topology directly connects four PCs to each other. One link between two of them fails.",
        question: "What happens to communication between those two PCs?",
        options: [
          { id: "a", label: "It can usually still continue, through another PC" },
          { id: "b", label: "It's permanently lost, with no way around it" },
          { id: "c", label: "The whole network stops working" },
        ],
        actualResultOptionId: "a",
        explanation:
          "A Mesh topology's redundancy means multiple paths usually exist between any two devices, so losing one direct link often still leaves an indirect path available.",
        hint: "How many links does each PC have in a full mesh of four devices?",
      },
      {
        id: "predict-bandwidth-latency",
        scenario: "A link is upgraded from 100 Mbps to 10 Gbps, but its physical distance and latency stay the same.",
        question: "What happens to the link's latency?",
        options: [
          { id: "a", label: "It stays about the same" },
          { id: "b", label: "It drops by roughly the same factor as the bandwidth increase" },
          { id: "c", label: "It becomes zero" },
        ],
        actualResultOptionId: "a",
        explanation:
          "Bandwidth and latency are independent properties. Raising bandwidth increases how much data can move per second, but doesn't by itself change how long a signal takes to travel the link.",
        hint: "Does moving more lanes onto a highway change how far away the destination is?",
      },
      {
        id: "predict-congestion",
        scenario: "Four PCs each try to send 60 Mbps over a single shared link with 100 Mbps of capacity.",
        question: "What happens to each PC's actual achieved rate?",
        options: [
          { id: "a", label: "Each gets throttled to roughly an equal share of the 100 Mbps" },
          { id: "b", label: "The first PC to send gets its full 60 Mbps, and the rest get nothing" },
          { id: "c", label: "All four somehow get their full 60 Mbps" },
        ],
        actualResultOptionId: "a",
        explanation:
          "Total demand (240 Mbps) exceeds the link's 100 Mbps capacity, so the link is congested — every flow is throttled toward a fair share instead of any one flow getting everything or nothing.",
        hint: "Does the shared link have enough capacity for everyone's full request at once?",
      },
    ],
  },

  explore: {
    howToUse: [
      "Start on Basics to get comfortable with nodes, links, and network sizes.",
      "Use Build a Network to freely add, move, connect, and inspect devices.",
      "Switch to Topologies to auto-build Bus, Star, Ring, Mesh, Tree, and Hybrid layouts on the same canvas.",
      "Open the Failure Lab to break a device or link on whatever network is currently built, and see single points of failure highlighted.",
      "Try Client–Server vs. Peer-to-Peer, Send Data, and Performance to explore how data actually moves and performs.",
      "Work through Guided Experiments for a structured tour that links straight into the right tab for each one.",
    ],
    tryThis: [
      "Build a Star topology, then fail the central device — watch every other device lose connectivity at once.",
      "Add a redundant link across a highlighted single point of failure, then fail the original link again.",
      "Set packet loss to 25% on Send Data and send several packets — notice not every send succeeds.",
      "Raise network load past 100% on the Performance tab and watch throughput flatten out at the bandwidth ceiling.",
    ],
  },

  explain: {
    questions: [
      {
        id: "explain-why-star-common",
        question: "Why is Star the most common topology for everyday LANs despite its single point of failure?",
        answer:
          "It's simple and cheap to wire — every device needs only one cable to the center — and easy to diagnose, since one failed spoke only affects one device. The central device's importance is usually managed by making that one device reliable, rather than by avoiding the Star shape altogether.",
      },
      {
        id: "explain-why-not-always-mesh",
        question: "If Mesh has the best redundancy, why isn't every network built as a full mesh?",
        answer:
          "A full mesh needs a link between every pair of devices — the number of links grows very quickly as devices are added — which becomes expensive to cable and complex to manage. Mesh is usually reserved for places where the redundancy is worth that cost, like a core backbone.",
      },
      {
        id: "explain-throughput-ceiling",
        question: "Why can't throughput ever exceed bandwidth?",
        answer:
          "Bandwidth is the link's theoretical capacity — the hard ceiling on how much data can move per second. Throughput is what's actually achieved underneath that ceiling once real conditions like load, latency, and packet loss are factored in, so it can equal bandwidth in ideal conditions but never exceed it.",
      },
      {
        id: "explain-congestion-vs-broken",
        question: "Is a congested link the same thing as a broken link?",
        answer:
          "No. A congested link is still working — it's just being asked for more than it can deliver all at once, so flows get throttled and delay builds up. A broken link (failed device or cable) can't deliver data at all, regardless of demand.",
      },
    ],
  },

  practice: {
    quizId: "it-network-fundamentals-topologies-practice",
  },

  challenge: {
    intro: "Apply what this topic taught by working directly with the simulation.",
    scenarios: [
      {
        id: "challenge-build-lan",
        title: "Build a functioning LAN",
        scenario: "You're setting up a small office LAN.",
        objective: "On the Build tab, connect at least two PCs and one server through a single switch so every PC can reach the server.",
        tools: [{ id: "t1", label: "Add-device buttons and click-to-connect on the Build tab" }],
        answer: { mode: "interactive", instructions: "Build the network, then use the Failure Lab's connectivity readout to confirm every device can reach every other device.", verifyLabel: "Check connectivity" },
        hints: ["Every PC needs its own link to the switch.", "The server also needs a link to the switch, not directly to each PC."],
        explanation: "A switch-centered Star is the standard shape for a small LAN — every device reaches every other device through exactly one shared device.",
      },
      {
        id: "challenge-find-spof",
        title: "Identify the single point of failure",
        scenario: "Build a Star topology with five PCs around one switch.",
        objective: "Name which single device, if it failed, would disconnect every PC from every other PC.",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "The central switch" },
            { id: "b", label: "Any one of the PCs" },
            { id: "c", label: "None — the network has no single point of failure" },
          ],
          correctOptionId: "a",
        },
        hints: ["How many paths does data take between any two PCs in a Star?"],
        explanation: "Every PC only connects through the switch, so it's the network's single point of failure — confirm it in the Failure Lab's amber highlighting.",
      },
      {
        id: "challenge-add-redundancy",
        title: "Create a redundant network",
        scenario: "Take the Star topology from the previous challenge.",
        objective: "Add one redundant link so that failing the central switch no longer disconnects every PC from every other PC.",
        constraints: [{ id: "c1", label: "You may add at most one extra link." }],
        answer: { mode: "interactive", instructions: "Add a redundant link on the Failure Lab, then fail the central switch again and check the result.", verifyLabel: "Check the outcome" },
        hints: ["A single extra link between two spoke PCs won't reconnect every pair once the switch is gone — think about what the switch was doing for everyone."],
        explanation: "One extra link between two PCs only reconnects those two — it can't fully replace a failed central switch that every other PC also depended on. This challenge is meant to reveal that limit, not to \"solve\" it with one link.",
      },
      {
        id: "challenge-choose-topology",
        title: "Choose an appropriate topology",
        scenario: "A small business needs a cheap, simple LAN for eight PCs and isn't worried about the rare case where the whole office loses network access together.",
        objective: "Pick the topology that best fits these requirements.",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Star" },
            { id: "b", label: "Full Mesh" },
            { id: "c", label: "Hybrid star-of-stars across three buildings" },
          ],
          correctOptionId: "a",
        },
        hints: ["Which topology is simplest and cheapest to wire for this size, given redundancy isn't a priority here?"],
        explanation: "Star fits: cheap, simple, and its single point of failure is an acceptable trade-off given the stated requirements. Full Mesh would be needless cost here, and the hybrid option doesn't match a single small office.",
      },
      {
        id: "challenge-reduce-congestion",
        title: "Reduce congestion in a simulated network",
        scenario: "On the Performance tab's congestion demo, four PCs each want 60 Mbps over a 100 Mbps shared link.",
        objective: "Determine how many PCs could share that link and each still get their full 60 Mbps.",
        answer: { mode: "numeric", target: 1, tolerance: 0 },
        hints: ["100 Mbps of capacity, each PC wanting 60 Mbps — how many full 60 Mbps requests fit?"],
        explanation: "Only one PC's 60 Mbps request fits under 100 Mbps without throttling — two or more already exceeds capacity and triggers congestion.",
        requiresExperiment: true,
      },
      {
        id: "challenge-diagnose-packet-loss",
        title: "Diagnose packet loss",
        scenario: "On Send Data, packet loss is set to 25% and several sends in a row fail to arrive.",
        objective: "Explain what packet loss means here, and what it does not mean.",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Some packets fail to reach the destination; the link itself isn't necessarily broken" },
            { id: "b", label: "The link has completely failed and no data can get through" },
            { id: "c", label: "The destination device has crashed" },
          ],
          correctOptionId: "a",
        },
        hints: ["Do some sends in the log still show as delivered even at 25% loss?"],
        explanation: "Packet loss is probabilistic — at 25%, most packets still get through, but a meaningful fraction don't. It's a reliability problem, not necessarily a sign the link or destination is down.",
      },
      {
        id: "challenge-compare-designs",
        title: "Compare two network designs",
        scenario: "Design A is a single Star topology with one switch. Design B is a Hybrid: two Star clusters joined by one backbone link.",
        objective: "Given the requirement \"minimize how many devices lose connectivity if one switch fails,\" determine which design better meets it.",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Design B — failing one cluster's switch only isolates that cluster" },
            { id: "b", label: "Design A — fewer devices overall means less risk" },
            { id: "c", label: "They perform identically under this requirement" },
          ],
          correctOptionId: "a",
        },
        hints: ["Build both on the Topologies and Failure Lab tabs and compare what \"after failure\" reports for each."],
        explanation: "In Design B, losing one cluster's switch isolates only that cluster, leaving the other cluster's devices still connected to each other — a smaller failure domain than Design A, where the one switch affects everyone.",
        requiresExperiment: true,
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "information-technology",
      topicSlug: "cache-memory-explorer",
      label: "Cache Memory Explorer",
      reason: "Another Computer Fundamentals topic on how design trade-offs (there, speed vs. cost) shape system behavior.",
      href: "/dashboard/information-technology/cache-memory-explorer",
    },
  ],
};

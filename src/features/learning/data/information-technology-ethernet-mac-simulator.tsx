import type { TopicContent } from "../types";

export const informationTechnologyEthernetMacSimulatorContent: TopicContent = {
  subjectSlug: "information-technology",
  topicSlug: "ethernet-mac-simulator",
  title: "Ethernet & MAC Address Simulator",
  subjectLabel: "Information Technology",
  topicLabel: "Ethernet & MAC Address Simulator",
  colorToken: "it",
  simulationHref: "/dashboard/information-technology/ethernet-mac-simulator",

  learn: {
    objectives: [
      "Explain that a MAC address identifies a network interface at the link layer and is written in hexadecimal",
      "Name the fields of a simplified Ethernet frame and state the purpose of each",
      "Identify the source and destination MAC addresses in a frame and say who sent it and who it is for",
      "Distinguish unicast, broadcast, and unknown-unicast flooding",
      "Describe how a switch learns source MAC addresses and uses its MAC table to forward frames",
    ],
    whyItMatters:
      "Everything you send across a network eventually has to cross a local link, and on wired LANs that means Ethernet frames addressed with MAC addresses. Understanding local delivery — who a frame is for, and how a switch gets it there — is the foundation for the next topics in this Networking branch: IP addressing, ARP, and the detailed workings of switches.",
    concepts: [
      {
        term: "Device → interface → MAC address → frame → local network",
        explanation:
          "A device connects to the network through a network interface (NIC). The interface has a MAC address. When the device sends data across the local network, the interface wraps it in an Ethernet frame that carries MAC addresses, and the frame travels over the local network.",
      },
      {
        term: "MAC address",
        explanation:
          "A 48-bit link-layer address that identifies a network interface, written as six pairs of hexadecimal digits such as 02:4A:7C:91:3D:21. Each interface on a LAN needs a unique MAC address so a frame can name exactly one receiver.",
      },
      {
        term: "Ethernet frame",
        explanation:
          "The unit of data Ethernet delivers across a local link. This simulation uses an educational simplified frame: Destination MAC, Source MAC, EtherType / Length, Payload, and FCS. Real Ethernet adds a few physical-layer details that are not needed to understand delivery.",
      },
      {
        term: "Source and destination MAC",
        explanation:
          "The source MAC says which interface sent the frame; the destination MAC says which interface it is intended for. Together they answer two questions: who sent this, and who is it for?",
      },
      {
        term: "Unicast and broadcast",
        explanation:
          "A unicast frame is addressed to one interface. A broadcast frame is addressed to FF:FF:FF:FF:FF:FF, the Ethernet broadcast address, and is accepted by every device in the local broadcast domain.",
      },
      {
        term: "The switch and MAC learning",
        explanation:
          "A switch keeps a MAC address table that maps MAC addresses to ports. It builds the table by learning: when a frame arrives, it records the frame's source MAC and the port it arrived on. It then looks up the destination MAC to decide where to send the frame.",
      },
      {
        term: "Forwarding, flooding, and broadcast",
        explanation:
          "If the destination is in the table, the frame is forwarded out of just that port. If the destination is unknown (unknown unicast) or is the broadcast address, the switch floods the frame out of every port except the one it arrived on. Unknown-unicast flooding is a fallback; a broadcast is deliberate and accepted by everyone.",
      },
      {
        term: "FCS",
        explanation:
          "The Frame Check Sequence at the end of the frame helps the receiver detect certain errors. The receiver recalculates it and, if it does not match, discards the frame.",
      },
    ],
    keyTerms: [
      { term: "NIC / network interface", definition: "The hardware or virtual adapter that connects a device to a network and has a MAC address." },
      { term: "MAC address", definition: "A link-layer address, written in hexadecimal, that identifies a network interface." },
      { term: "Frame", definition: "The unit of data used at the link layer, with a header, payload, and trailer." },
      { term: "MAC address table", definition: "A switch's list of MAC addresses and the ports they were learned on." },
      { term: "Broadcast address", definition: "FF:FF:FF:FF:FF:FF — a destination that means every device on the local network." },
      { term: "Unknown unicast flooding", definition: "A switch sending a frame for an unlearned destination MAC out of all ports except the incoming one." },
    ],
    visualAids: [],
    misconceptions: [
      {
        id: "switch-sends-everything-everywhere",
        misconception: "A switch sends every frame to every device.",
        correction:
          "Only broadcast frames and frames for destinations the switch has not learned yet are flooded. Once the switch knows the destination's port, it forwards the frame out of that port only.",
      },
      {
        id: "flooding-is-broadcast",
        misconception: "Unknown-unicast flooding and broadcast are the same thing.",
        correction:
          "Both can put copies of a frame on many ports, but a broadcast is addressed to everyone and everyone accepts it. An unknown-unicast frame is addressed to one device; other interfaces receive a copy but discard it because the destination MAC is not theirs.",
      },
      {
        id: "switch-learns-destination",
        misconception: "A switch learns a device's location from the destination address of a frame.",
        correction:
          "Learning uses the source MAC address. A device appears in the switch's table only after it has sent a frame.",
      },
      {
        id: "mac-is-not-a-place",
        misconception: "A MAC address tells you who or where a device is on the internet.",
        correction:
          "A MAC address identifies a network interface on the local link and is used for local delivery. It says nothing about location beyond that link. (The Technical level of the simulation covers how MAC addresses can be changed.)",
      },
    ],
  },

  predict: {
    intro: "Before opening the lab, commit to a prediction for each of these — then go check yourself.",
    scenarios: [
      {
        id: "predict-learn-from",
        scenario: "A switch's MAC table is empty. PC-A sends a frame to Laptop-B.",
        question: "After the frame arrives at the switch, what has the switch learned?",
        options: [
          { id: "a", label: "PC-A's MAC address is on PC-A's port" },
          { id: "b", label: "Laptop-B's MAC address is on Laptop-B's port" },
          { id: "c", label: "Both addresses and their ports" },
        ],
        actualResultOptionId: "a",
        explanation: "The switch learns from the source MAC of arriving frames. Laptop-B has not sent anything yet.",
        hint: "Which address does the switch see attached to the frame's arrival port?",
      },
      {
        id: "predict-broadcast-accept",
        scenario: "PC-A sends a frame to FF:FF:FF:FF:FF:FF on a LAN with five devices.",
        question: "How many of the other devices accept the frame?",
        options: [
          { id: "a", label: "All four" },
          { id: "b", label: "One" },
          { id: "c", label: "None" },
        ],
        actualResultOptionId: "a",
        explanation: "A broadcast is addressed to everyone in the local broadcast domain, so every other device accepts it.",
        hint: "What does FF:FF:FF:FF:FF:FF mean?",
      },
      {
        id: "predict-unknown-accept",
        scenario: "A switch does not yet know Laptop-B's MAC address. PC-A sends a unicast frame to Laptop-B, and the switch floods it out of its other ports.",
        question: "Which devices accept the frame?",
        options: [
          { id: "a", label: "Only Laptop-B" },
          { id: "b", label: "Every device that received a copy" },
          { id: "c", label: "Nobody" },
        ],
        actualResultOptionId: "a",
        explanation: "The destination MAC is still Laptop-B's address, so only Laptop-B's interface accepts it. The others discard their copies.",
        hint: "Each interface compares the destination MAC with its own.",
      },
      {
        id: "predict-known-ports",
        scenario: "A switch already knows Laptop-B is on Port 2. PC-A sends it a frame.",
        question: "Out of how many ports does the switch send the frame?",
        options: [
          { id: "a", label: "One" },
          { id: "b", label: "All except the incoming port" },
          { id: "c", label: "All of them" },
        ],
        actualResultOptionId: "a",
        explanation: "Known unicast is forwarded only to the port in the MAC table.",
        hint: "Why would the switch send anything anywhere else?",
      },
    ],
  },

  explore: {
    howToUse: [
      "Start on Devices & MACs: select each device, read its interface and MAC address, then try Copy, Generate, and rename.",
      "Open Frame Anatomy and click every field of the simplified Ethernet frame.",
      "On Send Data, choose a source, a destination, and a message, then press Send Data — or use Send step by step and pause at every stage.",
      "On Unicast vs Broadcast, compare one sender reaching one device with one sender reaching everyone.",
      "Switch to Intermediate to unlock the MAC Table (watch the switch learn) and Forwarding Experiments (known, unknown, broadcast).",
      "Switch to Technical to add EtherType choices, the FCS lab, and a short look at collisions and full-duplex Ethernet.",
    ],
    tryThis: [
      "On Send Data, choose PC-A → Laptop-B with an empty table and watch which devices receive a copy and which accept it.",
      "Send the same frame a second time and compare how many ports get it.",
      "Send from PC-A to Broadcast and read the destination MAC on the frame.",
      "On the MAC Table tab, press Clear table and send PC-A → Laptop-B, then Laptop-B → PC-A, watching the table after each.",
      "On Devices & MACs, generate a new MAC for a device and check that it remains unique.",
    ],
  },

  explain: {
    questions: [
      {
        id: "explain-why-source-learning",
        question: "Why does a switch learn from the source MAC address rather than the destination?",
        answer:
          "The source address tells the switch which interface sent the frame, and the frame physically arrived on a particular port — so the switch can safely conclude that interface is reachable through that port. The destination address only says where the frame is going, which the switch may not know yet.",
      },
      {
        id: "explain-why-flood",
        question: "Why does a switch flood a frame when the destination is unknown?",
        answer:
          "It has no better information, and dropping the frame would mean the destination never hears from the sender. Flooding makes sure the frame reaches the destination. Once the destination sends a frame of its own, the switch learns its port and can forward later frames to it directly.",
      },
      {
        id: "explain-why-nic-ignores",
        question: "If a copy of a frame reaches a device that is not the destination, why doesn't it process it?",
        answer:
          "The network interface compares the destination MAC with its own address. If it does not match (and the frame is not a broadcast or a group the interface has joined), the interface discards the frame, so the rest of the device never sees it.",
      },
      {
        id: "explain-why-fcs",
        question: "Why does an Ethernet frame carry an FCS if it cannot fix errors?",
        answer:
          "Detecting damage is still valuable: a receiver can discard a corrupted frame instead of acting on bad data. Recovery — for example asking for the data again — is left to higher layers, keeping Ethernet simple and fast. The FCS is an error check, not a security feature.",
      },
    ],
  },

  practice: {
    quizId: "it-ethernet-mac-simulator-practice",
  },

  challenge: {
    intro: "Apply what this topic taught by working directly with the simulation.",
    scenarios: [
      {
        id: "challenge-frame-fields",
        title: "Count the frame fields",
        scenario: "You are studying the simplified Ethernet frame on the Frame Anatomy tab.",
        objective: "How many fields does the simplified frame have?",
        answer: { mode: "numeric", target: 5, tolerance: 0 },
        hints: ["Destination MAC, Source MAC, EtherType / Length, Payload, and one more at the end."],
        explanation: "Destination MAC, Source MAC, EtherType / Length, Payload, and FCS — five fields.",
        requiresExperiment: true,
      },
      {
        id: "challenge-who-sent",
        title: "Who sent it?",
        scenario: "You are inspecting a frame on the Send Data tab.",
        objective: "Which field tells you which interface sent the frame?",
        tools: [{ id: "t1", label: "Frame view and Frame inspector on Send Data" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Source MAC" },
            { id: "b", label: "Destination MAC" },
            { id: "c", label: "FCS" },
          ],
          correctOptionId: "a",
        },
        hints: ["One MAC field is labelled 'Who sent it?'"],
        explanation: "The Source MAC identifies the sending interface.",
        requiresExperiment: true,
      },
      {
        id: "challenge-broadcast-accept",
        title: "Broadcast reach",
        scenario: "On Send Data, choose PC-A as the source and Broadcast as the destination, then send.",
        objective: "How many other devices accept the frame?",
        answer: { mode: "numeric", target: 4, tolerance: 0 },
        hints: ["Watch the device labels after the frame is processed — count the ✓ marks."],
        explanation: "Laptop-B, PC-C, PC-D, and the Server all accept a broadcast — four devices.",
        requiresExperiment: true,
      },
      {
        id: "challenge-flood-copies",
        title: "Copies of an unknown-unicast frame",
        scenario: "Press Reset whole LAN on Send Data, then send PC-A → Laptop-B.",
        objective: "How many ports does the switch send the frame out of?",
        answer: { mode: "numeric", target: 4, tolerance: 0 },
        hints: ["The switch has five ports in use and does not send the frame back out of Port 1."],
        explanation: "Because Laptop-B is not in the table yet, the frame is flooded out of every port except Port 1 — four ports.",
        requiresExperiment: true,
      },
      {
        id: "challenge-flood-accept",
        title: "Who accepts a flooded unicast frame?",
        scenario: "Same experiment: PC-A → Laptop-B on an empty MAC table.",
        objective: "Which devices accept the frame?",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Only Laptop-B" },
            { id: "b", label: "Laptop-B, PC-C, PC-D, and the Server" },
            { id: "c", label: "Only the switch" },
          ],
          correctOptionId: "a",
        },
        hints: ["Look at the ✓ and ✕ marks under each device after the last step."],
        explanation: "The other devices got a copy but their interfaces ignored it: the destination MAC was not theirs.",
        requiresExperiment: true,
      },
      {
        id: "challenge-table-after-one",
        title: "What did the switch learn?",
        scenario: "On the MAC Table tab, press Clear table, then send PC-A → Laptop-B once.",
        objective: "How many entries are in the MAC table afterwards?",
        answer: { mode: "numeric", target: 1, tolerance: 0 },
        hints: ["Which of the two devices has actually sent a frame?"],
        explanation: "Only PC-A's source MAC was seen, so there is one entry. Laptop-B is learned once it sends something.",
        requiresExperiment: true,
      },
      {
        id: "challenge-table-after-reply",
        title: "After the reply",
        scenario: "Continue the same experiment: now send Laptop-B → PC-A.",
        objective: "How many entries are in the MAC table now?",
        answer: { mode: "numeric", target: 2, tolerance: 0 },
        hints: ["Each sender is learned when it sends its first frame."],
        explanation: "PC-A and Laptop-B have both sent frames, so both are in the table.",
        requiresExperiment: true,
      },
      {
        id: "challenge-known-ports",
        title: "Known destination",
        scenario: "On Forwarding Experiments, run Experiment A (known destination).",
        objective: "Through how many output ports does the switch send the frame?",
        answer: { mode: "numeric", target: 1, tolerance: 0 },
        hints: ["Step to the 'Correct output port' box."],
        explanation: "With the destination already in the table, only that device's port is used.",
        requiresExperiment: true,
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "information-technology",
      topicSlug: "tcp-ip-model-explorer",
      label: "TCP/IP Model Explorer",
      reason: "Frames live in the Network Access / Link layer of the TCP/IP model you just studied.",
      href: "/dashboard/information-technology/tcp-ip-model-explorer",
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "osi-model-explorer",
      label: "OSI Model Explorer",
      reason: "Ethernet frames and MAC addresses are the OSI Data Link layer (Layer 2).",
      href: "/dashboard/information-technology/osi-model-explorer",
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "network-fundamentals-topologies",
      label: "Network Fundamentals & Topologies",
      reason: "The star LAN around a switch in this topic is the topology you built there.",
      href: "/dashboard/information-technology/network-fundamentals-topologies",
    },
  ],
};

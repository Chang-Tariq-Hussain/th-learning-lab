import type { TopicContent } from "../types";

export const informationTechnologyOsiModelExplorerContent: TopicContent = {
  subjectSlug: "information-technology",
  topicSlug: "osi-model-explorer",
  title: "OSI Model Explorer",
  subjectLabel: "Information Technology",
  topicLabel: "OSI Model Explorer",
  colorToken: "it",
  simulationHref: "/dashboard/information-technology/osi-model-explorer",

  learn: {
    objectives: [
      "Name all seven OSI layers, in order, and state each layer's main responsibility",
      "Explain encapsulation and decapsulation, and the PDU name typically used at each layer",
      "Identify which layer a given networking activity, protocol, or device belongs to",
      "Distinguish a Data Link-layer problem from a Network-layer problem from an Application-layer problem in a simple troubleshooting scenario",
      "Describe how the four-layer TCP/IP model relates to the seven-layer OSI model",
    ],
    whyItMatters:
      "Every later topic in this Networking branch — addressing, switching, routing, TCP/UDP, DNS — is really a deep dive into one specific OSI layer. Having a solid mental map of the seven layers, what each one is responsible for, and how data actually gets wrapped and unwrapped as it moves between them makes each of those later topics click into a clear place instead of feeling like a pile of disconnected acronyms.",
    concepts: [
      {
        term: "The seven OSI layers",
        explanation:
          "Application, Presentation, Session, Transport, Network, Data Link, and Physical (top to bottom). Each layer has one main job and hands its work to the layer below it (when sending) or above it (when receiving) — a clean division of labor rather than one big block of networking code.",
      },
      {
        term: "Encapsulation",
        explanation:
          "As data travels down through the layers on the sending side, each layer wraps it with its own header (and, at Data Link, a trailer too) — Data becomes a Segment, then a Packet, then a Frame, then Bits. Each header carries the information that layer needs to do its job.",
      },
      {
        term: "Decapsulation",
        explanation:
          "The receiving side reverses the process: each layer reads and removes its own header as data travels back up, until the original Data reaches the receiving application — the exact mirror image of encapsulation.",
      },
      {
        term: "Protocol Data Unit (PDU)",
        explanation:
          "The name commonly given to \"the data unit at this layer.\" Application/Presentation/Session data is usually just called Data, Transport's is a Segment (TCP) or Datagram (UDP), Network's is a Packet, Data Link's is a Frame, and Physical's is Bits. Exact terminology varies by protocol and by source.",
      },
      {
        term: "Devices and layers",
        explanation:
          "Some devices are conceptually associated with one layer — a hub with Physical, a switch with Data Link, a router with Network — because that's the highest layer they need to inspect to do their main job. An end host (a PC or phone) participates at every layer, since it both runs applications and puts bits on the wire.",
      },
      {
        term: "OSI vs. TCP/IP",
        explanation:
          "TCP/IP is the model the real internet is actually built on, and groups the same ideas into four layers (Application, Transport, Internet, Network Access) instead of OSI's seven. They organize the same concepts differently rather than disagreeing about what networking actually involves.",
      },
    ],
    keyTerms: [
      { term: "Encapsulation", definition: "Wrapping data with a header (and sometimes a trailer) as it moves down through the layers." },
      { term: "Decapsulation", definition: "Removing each layer's header as data moves back up through the layers on the receiving side." },
      { term: "PDU", definition: "Protocol Data Unit — the name given to the data unit at a specific layer, e.g. Segment, Packet, Frame." },
      { term: "Header", definition: "Control information a layer adds to the front of the data it receives from the layer above." },
      { term: "Single point of failure", definition: "Not an OSI term — but note that many networking faults are really 'a problem at one specific layer,' which is exactly what this topic trains you to spot." },
    ],
    visualAids: [],
    misconceptions: [
      {
        id: "osi-is-literally-how-software-is-built",
        misconception: "Every real protocol and piece of networking software is built in exactly seven separate layers, matching OSI precisely.",
        correction:
          "OSI is primarily a teaching and reference model. Real-world protocol stacks (like TCP/IP) don't map onto it perfectly — some real layers blend responsibilities the OSI model separates, which is exactly why the OSI vs. TCP/IP comparison in this simulation matters.",
      },
      {
        id: "higher-layer-always-more-important",
        misconception: "Layer 7 (Application) is 'more important' than Layer 1 (Physical) because it's listed first / closest to the user.",
        correction:
          "Every layer is required for communication to work at all — a broken Physical layer breaks everything above it just as much as a broken Application layer breaks the one thing the user actually wanted to do. The layers are ordered by role, not by importance.",
      },
      {
        id: "encapsulation-adds-new-data",
        misconception: "Encapsulation means each layer creates brand-new data to send.",
        correction:
          "Encapsulation only wraps the data that's already there with a new header — it never replaces or duplicates the original Data. By the time it reaches Layer 1, the original Data is still fully intact, just wrapped in several layers of headers, the way a series of envelopes doesn't change the letter inside.",
      },
      {
        id: "switch-only-does-mac-addresses",
        misconception: "Because switches are 'Layer 2 devices,' a modern switch can never do anything involving IP addresses.",
        correction:
          "The Layer 2 association is about a switch's primary, defining job (forwarding by MAC address), not an absolute technical limit — some modern switches do have Layer 3 capabilities. This simulation teaches the commonly-taught baseline association, not an exhaustive rule for every real device.",
      },
    ],
  },

  predict: {
    intro: "Before opening the labs, commit to a prediction for each of these — then go check yourself.",
    scenarios: [
      {
        id: "predict-header-count",
        scenario: "A piece of application Data is encapsulated as it travels down from the Application layer to the Physical layer.",
        question: "By the time it becomes a Frame, how many separate headers (not counting the trailer) has it picked up?",
        options: [
          { id: "a", label: "3 — Transport, Network, and Data Link" },
          { id: "b", label: "7 — one for every OSI layer" },
          { id: "c", label: "1 — only the Data Link header matters" },
        ],
        actualResultOptionId: "a",
        explanation:
          "Application, Presentation, and Session don't add a separately-named PDU/header in the commonly-taught model — the three headers added are Transport (making a Segment), Network (making a Packet), and Data Link (making a Frame, plus a trailer).",
        hint: "Which layers actually change the PDU's name in the encapsulation sequence?",
      },
      {
        id: "predict-router-layer",
        scenario: "A router receives a frame, needs to decide which network to forward it toward next, and does so using the packet's destination IP address.",
        question: "Which OSI layer is the router's forwarding decision primarily happening at?",
        options: [
          { id: "a", label: "Network (Layer 3)" },
          { id: "b", label: "Data Link (Layer 2)" },
          { id: "c", label: "Transport (Layer 4)" },
        ],
        actualResultOptionId: "a",
        explanation:
          "Forwarding by logical (IP) address, across networks, is exactly what defines the Network layer — that's why routers are conceptually associated with Layer 3.",
        hint: "Which layer's whole job is logical addressing and forwarding between networks?",
      },
      {
        id: "predict-cable-fault",
        scenario: "A PC's Ethernet cable is unplugged from the wall.",
        question: "Which OSI layer does this fault belong to?",
        options: [
          { id: "a", label: "Physical (Layer 1)" },
          { id: "b", label: "Application (Layer 7)" },
          { id: "c", label: "Transport (Layer 4)" },
        ],
        actualResultOptionId: "a",
        explanation:
          "A missing physical connection is a Physical-layer fault — no signal can be transmitted at all, regardless of what the higher layers are trying to do.",
        hint: "Which layer is responsible for the actual physical connection and signal?",
      },
      {
        id: "predict-tcpip-transport",
        scenario: "TCP/IP's four layers are Application, Transport, Internet, and Network Access.",
        question: "Which OSI layer does TCP/IP's \"Internet\" layer most closely correspond to?",
        options: [
          { id: "a", label: "Network (Layer 3)" },
          { id: "b", label: "Data Link (Layer 2)" },
          { id: "c", label: "Transport (Layer 4)" },
        ],
        actualResultOptionId: "a",
        explanation:
          "TCP/IP's Internet layer covers logical addressing and routing — the same job OSI's Network layer describes, just under a different name in a four-layer model.",
        hint: "Which OSI layer handles logical addressing and routing between networks?",
      },
    ],
  },

  explore: {
    howToUse: [
      "Start on The 7 Layers to click through each layer's responsibility, real-world explanation, and \"What happens here?\" summary.",
      "Switch levels (Beginner / Intermediate / Technical) to reveal PDUs, devices, and protocol examples alongside each layer.",
      "Open Encapsulation to play, pause, step, and reset the animation of data being wrapped and unwrapped between two computers.",
      "Move to Intermediate or Technical to unlock Packet Journey, Identify the Layer, and Troubleshooting.",
      "Try the OSI vs. TCP/IP tab at the Technical level for a quick side-by-side comparison.",
    ],
    tryThis: [
      "On The 7 Layers, press \"Send data\" and watch which layer lights up first, and which one lights up last.",
      "On Encapsulation, use Step (not Play) to pause right after the Data Link header and trailer are added — count how many headers wrap the data at that point.",
      "On Identify the Layer, try to get through the full set of scenarios without a single incorrect guess.",
      "On Troubleshooting, notice how the case naming a specific symptom (not just \"the internet is slow\") is what lets you narrow it to one layer.",
    ],
  },

  explain: {
    questions: [
      {
        id: "explain-why-seven-layers",
        question: "Why split networking into seven layers instead of just building one big system?",
        answer:
          "Splitting responsibilities into layers means each layer can be designed, understood, and even replaced independently — a new physical medium (say, upgrading from copper to fiber) doesn't require rewriting how applications work, because Physical and Application are separate, cleanly-bounded jobs.",
      },
      {
        id: "explain-why-presentation-session-fold",
        question: "Why do Presentation and Session get folded into \"Data\" in the encapsulation animation instead of getting their own PDU name?",
        answer:
          "Unlike Transport, Network, and Data Link, Presentation and Session don't have a single, widely-taught PDU name of their own in most introductory treatments — their work (formatting/encryption, and session management) happens without producing a differently-named unit, so the simplified animation groups them with Application as \"Data.\"",
      },
      {
        id: "explain-decapsulation-order",
        question: "Why does decapsulation happen in exactly the reverse order of encapsulation?",
        answer:
          "Each layer's header is the outermost wrapper added most recently on the way down, so it has to be the first one removed on the way up — like unwrapping a series of nested envelopes starting from the outside one, which is always the last one that got added.",
      },
      {
        id: "explain-osi-vs-real-protocols",
        question: "If TCP/IP is what the real internet actually uses, why learn OSI at all?",
        answer:
          "OSI's finer-grained seven-layer breakdown is genuinely useful for isolating problems (this simulation's Troubleshooting mode leans on exactly that) and for talking precisely about where a specific protocol or device's job sits, even though the real internet's protocols are organized more like TCP/IP's four layers.",
      },
    ],
  },

  practice: {
    quizId: "it-osi-model-explorer-practice",
  },

  challenge: {
    intro: "Apply what this topic taught by working directly with the simulation.",
    scenarios: [
      {
        id: "challenge-order-the-layers",
        title: "Put the layers in order",
        scenario: "You're asked to recite the seven OSI layers from the top (closest to the user) down to the bottom (closest to the wire).",
        objective: "On The 7 Layers tab, identify which layer is directly below the Session layer.",
        tools: [{ id: "t1", label: "The 7 Layers interactive stack" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Transport" },
            { id: "b", label: "Presentation" },
            { id: "c", label: "Network" },
          ],
          correctOptionId: "a",
        },
        hints: ["The order top to bottom is Application, Presentation, Session, Transport, Network, Data Link, Physical."],
        explanation: "Transport sits directly below Session in the standard OSI ordering.",
      },
      {
        id: "challenge-pdu-at-network",
        title: "Name the PDU",
        scenario: "You're reviewing the encapsulation animation.",
        objective: "State the name commonly given to the data unit at the Network layer.",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Packet" },
            { id: "b", label: "Frame" },
            { id: "c", label: "Segment" },
          ],
          correctOptionId: "a",
        },
        hints: ["Run the Encapsulation lab and watch the label at the Network layer step."],
        explanation: "The Network layer's PDU is commonly called a Packet.",
        requiresExperiment: true,
      },
      {
        id: "challenge-count-headers",
        title: "Count the headers on a Frame",
        scenario: "By the time data has been encapsulated all the way down to a Frame, several headers have been added.",
        objective: "Use the Encapsulation lab to determine how many separate layer headers (not counting the Data Link trailer) are wrapped around the data at that point.",
        answer: { mode: "numeric", target: 3, tolerance: 0 },
        hints: ["Step through Encapsulation and pause once the PDU becomes a Frame — count the colored header blocks shown."],
        explanation: "By the Frame stage, the Transport, Network, and Data Link headers have all been added — three headers total, plus a Data Link trailer.",
        requiresExperiment: true,
      },
      {
        id: "challenge-identify-router",
        title: "Identify the router's layer",
        scenario: "On the Packet Journey tab, a packet passes through a switch and then a router on its way to Computer B.",
        objective: "Determine which OSI layer the router is primarily associated with.",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Network" },
            { id: "b", label: "Data Link" },
            { id: "c", label: "Physical" },
          ],
          correctOptionId: "a",
        },
        hints: ["Press \"Send packet\" and read the panel that appears when the router lights up."],
        explanation: "The router is associated with the Network layer, since it forwards based on logical (IP) addressing.",
        requiresExperiment: true,
      },
      {
        id: "challenge-diagnose-fault",
        title: "Diagnose a network fault",
        scenario: "A user reports that their web browser connects to a site without any error, but the page itself shows a server error message.",
        objective: "Use the Troubleshooting tab's reasoning to determine which OSI layer this fault most likely belongs to.",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Application" },
            { id: "b", label: "Physical" },
            { id: "c", label: "Data Link" },
          ],
          correctOptionId: "a",
        },
        hints: ["If the connection itself succeeded, which layers are already confirmed working?"],
        explanation: "Since the connection succeeded and only the application's response was an error, the fault sits at the Application layer — everything below it worked correctly.",
        requiresExperiment: true,
      },
      {
        id: "challenge-tcpip-mapping",
        title: "Map OSI onto TCP/IP",
        scenario: "You're explaining to a classmate how OSI relates to the model the real internet uses.",
        objective: "Determine which single TCP/IP layer covers both the OSI Data Link and Physical layers together.",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Network Access" },
            { id: "b", label: "Internet" },
            { id: "c", label: "Transport" },
          ],
          correctOptionId: "a",
        },
        hints: ["Open the OSI vs. TCP/IP tab (Technical level) and look at which OSI layers each TCP/IP layer lists."],
        explanation: "TCP/IP's Network Access layer covers both OSI's Data Link and Physical layers.",
        requiresExperiment: true,
      },
      {
        id: "challenge-scenario-layer-mix",
        title: "Untangle a mixed scenario",
        scenario: "\"A device sends a DNS request, which travels as a UDP datagram, gets routed across two networks, and arrives as an Ethernet frame over a Wi-Fi radio link.\"",
        objective: "Identify which OSI layer the phrase \"gets routed across two networks\" describes.",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Network" },
            { id: "b", label: "Transport" },
            { id: "c", label: "Application" },
          ],
          correctOptionId: "a",
        },
        hints: ["Try the same style of reasoning on the Identify the Layer tab first."],
        explanation: "Routing across networks (rather than within one local link) is Network-layer work — the same reasoning DNS (Application), UDP (Transport), and Ethernet/Wi-Fi (Data Link/Physical) apply to the rest of that sentence.",
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "information-technology",
      topicSlug: "network-fundamentals-topologies",
      label: "Network Fundamentals & Topologies",
      reason: "The first topic in the Networking branch — nodes, links, and topologies this topic's Packet Journey builds directly on.",
      href: "/dashboard/information-technology/network-fundamentals-topologies",
    },
  ],
};

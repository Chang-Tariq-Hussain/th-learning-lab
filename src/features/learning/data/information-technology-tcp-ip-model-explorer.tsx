import type { TopicContent } from "../types";

export const informationTechnologyTcpIpModelExplorerContent: TopicContent = {
  subjectSlug: "information-technology",
  topicSlug: "tcp-ip-model-explorer",
  title: "TCP/IP Model Explorer",
  subjectLabel: "Information Technology",
  topicLabel: "TCP/IP Model Explorer",
  colorToken: "it",
  simulationHref: "/dashboard/information-technology/tcp-ip-model-explorer",

  learn: {
    objectives: [
      "Name the four TCP/IP layers in order and state each layer's main responsibility",
      "Explain how the TCP/IP layers map onto the seven OSI layers, and why that mapping is only conceptual",
      "Describe encapsulation and decapsulation using TCP/IP's data units (data, segment/datagram, packet, frame, bits)",
      "Place common protocols (HTTP/HTTPS, DNS, DHCP, TCP, UDP, IP, ICMP, Ethernet, Wi-Fi) in the right layer",
      "Decide which layer is most likely responsible for a simple networking symptom",
    ],
    whyItMatters:
      "TCP/IP is the practical architecture behind Internet communication. Every later topic in this Networking branch — addressing, routing, TCP and UDP, DNS — is a closer look at one part of this four-layer picture. Understanding how the layers cooperate, and how they relate to the OSI model you just studied, gives each of those topics a clear place to land.",
    concepts: [
      {
        term: "The four TCP/IP layers",
        explanation:
          "Application, Transport, Internet, and Network Access / Link (top to bottom). Each layer has a distinct job and relies on the layer beneath it. Some textbooks split the bottom layer into Link and Physical, giving a five-layer variant; this simulation uses the commonly taught four.",
      },
      {
        term: "Application layer",
        explanation:
          "Where application protocols like HTTP/HTTPS, DNS, and DHCP work. It encompasses functions that OSI separates into Application, Presentation, and Session — formatting, encryption such as TLS, and conversation management are handled here by protocols, libraries, or the application itself.",
      },
      {
        term: "Transport layer",
        explanation:
          "Carries data between applications on two hosts. Port numbers identify the application, large data can be split into segments, and TCP adds reliability and flow control while UDP stays lightweight with no delivery guarantee. The full TCP vs. UDP story comes in a later simulation.",
      },
      {
        term: "Internet layer",
        explanation:
          "Uses IP addresses to move packets across multiple networks. Routers read the IP header to choose the next hop. IP is best-effort: it does not guarantee delivery. Detailed addressing and routing are separate later simulations.",
      },
      {
        term: "Network Access / Link layer",
        explanation:
          "Delivers frames across one local link (Ethernet, Wi-Fi) and turns them into signals on the medium. A new frame is built for every link a packet crosses.",
      },
      {
        term: "Encapsulation and decapsulation",
        explanation:
          "Going down, each layer wraps the data with its own header (the link layer also adds a trailer): data becomes a segment or datagram, then a packet, then a frame, then bits. The receiver reverses the process, removing the outermost wrapper first.",
      },
      {
        term: "TCP/IP vs. OSI",
        explanation:
          "OSI is mainly a conceptual reference model; TCP/IP is the practical protocol-suite architecture commonly used for Internet networking. The mapping between them is a useful guide, but real implementations do not always follow textbook layer boundaries perfectly.",
      },
    ],
    keyTerms: [
      { term: "Protocol", definition: "A set of rules two systems follow to communicate, such as HTTP or IP." },
      { term: "Port", definition: "A number used at the Transport layer to identify which application on a host should receive the data." },
      { term: "Segment / Datagram", definition: "The commonly used name for Transport-layer data: segment for TCP, datagram for UDP." },
      { term: "Packet", definition: "The commonly used name for Internet-layer data, which carries IP addresses." },
      { term: "Frame", definition: "The commonly used name for Link-layer data, built for one local link." },
    ],
    visualAids: [],
    misconceptions: [
      {
        id: "tcpip-is-osi-with-fewer-layers",
        misconception: "TCP/IP is just the OSI model with three layers removed.",
        correction:
          "The two models were designed for different purposes. OSI is mainly a conceptual reference model, while TCP/IP describes the practical protocol suite the Internet uses. The mapping between them is a helpful guide, not an exact translation.",
      },
      {
        id: "http-is-the-application-osi-layer",
        misconception: "HTTP, DNS, and DHCP simply are the OSI Application, Presentation, and Session layers.",
        correction:
          "TCP/IP's Application layer encompasses the functions OSI separates into three layers, but a real protocol is not neatly assigned to one OSI layer. For example, TLS encryption is often described as Presentation-layer work, yet in practice it is part of what the application or a library does.",
      },
      {
        id: "packet-means-everything",
        misconception: "\"Packet\" is the only correct name for data at every layer.",
        correction:
          "Commonly taught names are data, segment or datagram, packet, frame, and bits, but terminology varies by protocol and context, and people often say \"packet\" loosely.",
      },
      {
        id: "ip-guarantees-delivery",
        misconception: "IP guarantees that data arrives.",
        correction:
          "IP is best-effort. Reliability, when needed, comes from a higher layer such as TCP, which detects loss and retransmits.",
      },
    ],
  },

  predict: {
    intro: "Before opening the labs, commit to a prediction for each of these — then go check yourself.",
    scenarios: [
      {
        id: "predict-application-covers",
        scenario: "TCP/IP has four layers while OSI has seven.",
        question: "How many OSI layers does TCP/IP's Application layer cover?",
        options: [
          { id: "a", label: "Three — Application, Presentation, and Session" },
          { id: "b", label: "One — only Application" },
          { id: "c", label: "Two — Application and Transport" },
        ],
        actualResultOptionId: "a",
        explanation: "TCP/IP's Application layer covers the work OSI splits across layers 7, 6, and 5.",
        hint: "TCP/IP has no separate Presentation or Session layer.",
      },
      {
        id: "predict-router-layers",
        scenario: "A router receives a frame and forwards the packet inside it toward another network.",
        question: "Which TCP/IP layers does the router mainly need to work with?",
        options: [
          { id: "a", label: "Internet and Network Access" },
          { id: "b", label: "Application and Transport" },
          { id: "c", label: "Only Application" },
        ],
        actualResultOptionId: "a",
        explanation: "It receives and sends frames (Network Access) and reads the IP header (Internet) to choose the next hop.",
        hint: "What does a router read to decide where a packet goes next?",
      },
      {
        id: "predict-first-wrapper",
        scenario: "Data is being encapsulated on the sender and then decapsulated on the receiver.",
        question: "On the receiver, which wrapper is removed first?",
        options: [
          { id: "a", label: "The link header and trailer" },
          { id: "b", label: "The transport header" },
          { id: "c", label: "The IP header" },
        ],
        actualResultOptionId: "a",
        explanation: "The link header is the outermost wrapper (added last), so it is removed first.",
        hint: "Think of unwrapping nested envelopes.",
      },
      {
        id: "predict-dns-layer",
        scenario: "A device asks, \"What is the IP address for this website name?\"",
        question: "Which TCP/IP layer does the DNS protocol belong to?",
        options: [
          { id: "a", label: "Application" },
          { id: "b", label: "Internet" },
          { id: "c", label: "Transport" },
        ],
        actualResultOptionId: "a",
        explanation: "DNS is an application-layer protocol, even though other applications rely on it.",
        hint: "DNS is a service applications use, not something that moves packets.",
      },
    ],
  },

  explore: {
    howToUse: [
      "Start on The 4 Layers and click each layer to read its responsibility, protocols, typical data, OSI relationship, and example.",
      "Open OSI ↔ TCP/IP and click layers in either model to see the matching layer(s) highlight.",
      "Use Protocols to click each protocol and see its layer, purpose, and a simple example.",
      "Switch to Intermediate to unlock Encapsulation, Request → Response, Network Path, Which Model?, Layer Responsibility, and Troubleshooting.",
      "Switch to Technical to reveal header details, protocol roles, layer interactions, design differences, and network-path reasoning.",
    ],
    tryThis: [
      "On OSI ↔ TCP/IP, click Session and see which TCP/IP layer lights up.",
      "On Encapsulation, use Step to pause right after the frame is built and count the headers wrapped around the data.",
      "On Network Path, step through and watch which layers light up on the switch versus the router.",
      "On Which Model?, compare the OSI view with the TCP/IP view for the same HTTPS request and notice where TLS shows up in each.",
    ],
  },

  explain: {
    questions: [
      {
        id: "explain-why-four-layers",
        question: "Why does TCP/IP use four layers when OSI has seven?",
        answer:
          "TCP/IP grew alongside the protocols the Internet uses, so its layers group functions the way those protocols actually work. OSI was designed as a detailed reference model with cleaner separation between jobs, which is why it splits Application into three and Network Access into two.",
      },
      {
        id: "explain-why-learn-both",
        question: "If TCP/IP is what the Internet uses, why do people still use OSI terms like \"Layer 2\"?",
        answer:
          "OSI's finer breakdown gives networking professionals a shared vocabulary for pinpointing where something happens or fails. TCP/IP describes how the Internet's protocol suite is actually organized; OSI is a convenient reference for talking about it.",
      },
      {
        id: "explain-frame-per-link",
        question: "Why does a new frame get built for each link along a path?",
        answer:
          "A frame only has to get the packet across one local link to the next device. The IP packet inside carries the end-to-end addressing, so each link wraps it in a fresh frame suited to that link's technology (Ethernet or Wi-Fi, for example).",
      },
      {
        id: "explain-transport-vs-internet",
        question: "What is the difference between the Transport and Internet layers?",
        answer:
          "The Internet layer gets packets from one host to another across networks using IP addresses. The Transport layer works between applications on those hosts, using port numbers, and can add reliability such as TCP's acknowledgments and retransmission.",
      },
    ],
  },

  practice: {
    quizId: "it-tcp-ip-model-explorer-practice",
  },

  challenge: {
    intro: "Apply what this topic taught by working directly with the simulation.",
    scenarios: [
      {
        id: "challenge-layer-below-transport",
        title: "Which layer is below Transport?",
        scenario: "You are reciting the TCP/IP layers from the top down.",
        objective: "On The 4 Layers tab, identify the layer directly below Transport.",
        tools: [{ id: "t1", label: "The 4 Layers interactive stack" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Internet" },
            { id: "b", label: "Application" },
            { id: "c", label: "Network Access / Link" },
          ],
          correctOptionId: "a",
        },
        hints: ["The order is Application, Transport, Internet, Network Access / Link."],
        explanation: "Internet sits directly below Transport in the four-layer model.",
      },
      {
        id: "challenge-application-covers",
        title: "Count the OSI layers",
        scenario: "You are comparing the two models on the OSI ↔ TCP/IP tab.",
        objective: "How many OSI layers does the TCP/IP Application layer cover?",
        answer: { mode: "numeric", target: 3, tolerance: 0 },
        hints: ["Click TCP/IP Application and count the highlighted OSI layers."],
        explanation: "It covers OSI Application, Presentation, and Session — three layers.",
        requiresExperiment: true,
      },
      {
        id: "challenge-frame-headers",
        title: "Count the headers on a frame",
        scenario: "By the time data becomes a frame, several headers have been added.",
        objective: "Use the Encapsulation tab to count the separate layer headers (not counting the trailer) around the data at the Frame stage.",
        answer: { mode: "numeric", target: 3, tolerance: 0 },
        hints: ["Step through Encapsulation and stop when the label says Frame — count the colored header blocks."],
        explanation: "Transport, IP, and Link headers are present — three headers, plus a link trailer.",
        requiresExperiment: true,
      },
      {
        id: "challenge-internet-unit",
        title: "Name the data unit",
        scenario: "You are reviewing the data-unit table on the Encapsulation tab.",
        objective: "State the commonly used name for the Internet-layer data unit.",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Packet" },
            { id: "b", label: "Frame" },
            { id: "c", label: "Segment" },
          ],
          correctOptionId: "a",
        },
        hints: ["Watch the label as the IP header is added during Encapsulation."],
        explanation: "The Internet layer's data unit is commonly called a packet (IP datagram).",
        requiresExperiment: true,
      },
      {
        id: "challenge-switch-layer",
        title: "The switch's layer",
        scenario: "On the Network Path tab, data passes through a switch on its way to the router.",
        objective: "Determine which TCP/IP layer the switch mainly works at.",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Network Access / Link" },
            { id: "b", label: "Internet" },
            { id: "c", label: "Application" },
          ],
          correctOptionId: "a",
        },
        hints: ["Step to the switch and see which layer lights up."],
        explanation: "A switch is conceptually associated with the Network Access / Link layer — it reads and forwards frames.",
        requiresExperiment: true,
      },
      {
        id: "challenge-name-not-ip",
        title: "Works by number, not by name",
        scenario: "A website loads when you type its IP address but fails when you type its name.",
        objective: "Use the Troubleshooting tab's reasoning to decide which layer's protocol is the likely culprit.",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Application (DNS)" },
            { id: "b", label: "Network Access / Link" },
            { id: "c", label: "Internet" },
          ],
          correctOptionId: "a",
        },
        hints: ["If the IP address works, the path to the server is fine. What translates names?"],
        explanation: "Name resolution is DNS, an application-layer protocol. The network path itself works.",
        requiresExperiment: true,
      },
      {
        id: "challenge-tls-placement",
        title: "Where does TLS land?",
        scenario: "On the Which Model? tab, an HTTPS request is shown through both OSI and TCP/IP views.",
        objective: "Decide which TCP/IP layer handles the encryption step that OSI describes as Presentation-layer work.",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Application" },
            { id: "b", label: "Transport" },
            { id: "c", label: "Internet" },
          ],
          correctOptionId: "a",
        },
        hints: ["TCP/IP has no separate Presentation layer."],
        explanation: "TCP/IP folds Presentation-style work into the Application layer, though real protocols do not always fit textbook boundaries perfectly.",
        requiresExperiment: true,
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "information-technology",
      topicSlug: "osi-model-explorer",
      label: "OSI Model Explorer",
      reason: "The conceptual seven-layer reference model this topic maps onto.",
      href: "/dashboard/information-technology/osi-model-explorer",
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "network-fundamentals-topologies",
      label: "Network Fundamentals & Topologies",
      reason: "The devices, links, and topologies the network path in this topic builds on.",
      href: "/dashboard/information-technology/network-fundamentals-topologies",
    },
  ],
};

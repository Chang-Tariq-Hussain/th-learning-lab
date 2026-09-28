import type { TopicContent } from "../types";

/** Interactive scenario ids — must match `IP_CHALLENGE_IDS` in the simulation's `challenges.ts`. */
const CH_SAME = "ip-addressing-challenge-same-network";
const CH_GATEWAY = "ip-addressing-challenge-gateway";
const CH_DUP = "ip-addressing-challenge-duplicate";
const CH_ROUTED = "ip-addressing-challenge-two-networks";

export const informationTechnologyIpAddressingSimulatorContent: TopicContent = {
  subjectSlug: "information-technology",
  topicSlug: "ip-addressing-simulator",
  title: "IP Addressing Simulator",
  subjectLabel: "Information Technology",
  topicLabel: "IP Addressing Simulator",
  colorToken: "it",
  simulationHref: "/dashboard/information-technology/ip-addressing-simulator",

  learn: {
    objectives: [
      "Explain that an IPv4 address is 32 bits, written as four octets, and identifies a network interface",
      "Use a subnet mask or CIDR prefix to split an address into network and host portions",
      "Calculate the network address, broadcast address, and usable host range for an ordinary subnet",
      "Decide whether two addresses are on the same IP network, and whether a destination is local or remote",
      "Explain what a default gateway is for, and when it is (and is not) needed",
    ],
    whyItMatters:
      "Every device that communicates across a network needs an address, and every decision about where to send data starts by comparing addresses. Understanding how an IPv4 address is split into network and host portions is the foundation for subnetting, ARP, DHCP, and routing, the next topics in this Networking branch.",
    concepts: [
      {
        term: "IPv4 address",
        explanation:
          "A 32-bit number that identifies a network interface at the network layer. It is written as four 8-bit octets in decimal, such as 192.168.1.10, which is 11000000.10101000.00000001.00001010 in binary. Each octet is 0–255.",
      },
      {
        term: "Interface, MAC address, and IP address",
        explanation:
          "A device connects through an interface. The interface has a MAC address for local delivery on the link and is given an IP address to identify it within an IP network. A router has one interface, and so one address, on each network it connects.",
      },
      {
        term: "Subnet mask and CIDR prefix",
        explanation:
          "A mask is a run of 1s followed by 0s. The 1s mark the network bits; the 0s mark the host bits. CIDR writes the count of 1s as a prefix length: 255.255.255.0 is /24, 255.255.0.0 is /16, and 255.255.255.128 is /25.",
      },
      {
        term: "Network portion and host portion",
        explanation:
          "For 192.168.1.25/24 the network portion is 192.168.1 and the host portion is 25. The same address with /16 has network portion 192.168 and host portion 1.25. The address does not change; the mask changes where the boundary falls.",
      },
      {
        term: "Network, host, and broadcast addresses",
        explanation:
          "In an ordinary subnet, the address with all host bits 0 names the network (network address = address AND mask). The address with all host bits 1 is the broadcast address, meaning every device on that network. Everything in between can be assigned to hosts.",
      },
      {
        term: "Address capacity",
        explanation:
          "With H host bits a block has 2^H addresses. For ordinary subnets 2^H − 2 are usable, because the network and broadcast addresses are not assigned to hosts. /31 and /32 are special cases.",
      },
      {
        term: "Local vs. remote and the default gateway",
        explanation:
          "A host compares the destination to its own network using its mask. Same network: deliver directly, with no gateway involved. Different network: send to the default gateway, the router address on the host's own network, so that the router can carry the data onward.",
      },
      {
        term: "Private, public, and special addresses",
        explanation:
          "10.0.0.0/8, 172.16.0.0/12 (172.16–172.31), and 192.168.0.0/16 are reserved for private networks. Other ordinary addresses are public. Special addresses include 127.0.0.1 (loopback), 0.0.0.0 (unspecified) and 255.255.255.255 (limited broadcast).",
      },
    ],
    keyTerms: [
      { term: "Octet", definition: "One 8-bit group of an IPv4 address, with a value from 0 to 255." },
      { term: "Prefix length", definition: "The number of leading network bits, written /24, /16, and so on (CIDR)." },
      { term: "Network address", definition: "The address with all host bits 0; it identifies the network itself." },
      { term: "Broadcast address", definition: "The address with all host bits 1; it means every device on that network." },
      { term: "Default gateway", definition: "The device a host can use to reach destinations outside its local IP network." },
      { term: "Loopback", definition: "127.0.0.1 — an address that refers to the device itself." },
    ],
    visualAids: [],
    misconceptions: [
      {
        id: "class-decides-mask",
        misconception: "The first number of an address decides how big its network is (Class A, B, C).",
        correction: "Class-based addressing is historical. Today the prefix length (CIDR) decides where the network / host boundary falls, and networks can be any size.",
      },
      {
        id: "every-ip-public",
        misconception: "Every IP address is a public internet address.",
        correction: "Three ranges are reserved for private networks and several other blocks are special-purpose. Only addresses outside those are ordinary public addresses.",
      },
      {
        id: "gateway-always",
        misconception: "A device always needs a default gateway to communicate.",
        correction: "Communication inside the local network does not use a gateway. It is only needed to reach other networks.",
      },
      {
        id: "look-same-means-same",
        misconception: "Two addresses that start with the same numbers are on the same network.",
        correction: "It depends on the mask. 192.168.1.10 and 192.168.2.20 are different networks with /24 but the same network with /16.",
      },
      {
        id: "all-addresses-hosts",
        misconception: "Every address in a subnet can be given to a device.",
        correction: "In an ordinary subnet the first address (network) and the last address (broadcast) are not assigned to hosts.",
      },
    ],
  },

  predict: {
    intro: "Commit to a prediction for each, then check yourself in the simulation.",
    scenarios: [
      {
        id: "predict-ip-network-24",
        scenario: "PC-A is 192.168.1.10/24 and PC-B is 192.168.2.20/24.",
        question: "Are they on the same IP network?",
        options: [
          { id: "a", label: "Yes" },
          { id: "b", label: "No" },
        ],
        actualResultOptionId: "b",
        explanation: "With /24 the networks are 192.168.1.0 and 192.168.2.0, which differ.",
        hint: "Apply the mask: only the first three octets are the network portion.",
      },
      {
        id: "predict-ip-network-16",
        scenario: "The same two addresses, 192.168.1.10 and 192.168.2.20, but now both use /16.",
        question: "Are they on the same IP network?",
        options: [
          { id: "a", label: "Yes" },
          { id: "b", label: "No" },
        ],
        actualResultOptionId: "a",
        explanation: "With /16 only 192.168 is the network portion, so both are in 192.168.0.0/16.",
        hint: "How many octets are network bits at /16?",
      },
      {
        id: "predict-ip-broadcast",
        scenario: "A host has the address 192.168.1.25/24.",
        question: "What is the broadcast address of its network?",
        options: [
          { id: "a", label: "192.168.1.255" },
          { id: "b", label: "192.168.1.254" },
          { id: "c", label: "192.168.255.255" },
        ],
        actualResultOptionId: "a",
        explanation: "Setting all 8 host bits to 1 makes the last octet 255.",
        hint: "Which bits are host bits at /24?",
      },
      {
        id: "predict-ip-gateway",
        scenario: "PC-A (192.168.1.10/24) sends data to PC-B (192.168.1.20/24), and PC-A has no default gateway configured.",
        question: "What happens?",
        options: [
          { id: "a", label: "It works: the destination is local" },
          { id: "b", label: "It fails: no gateway" },
        ],
        actualResultOptionId: "a",
        explanation: "Same network means direct delivery. A gateway is only used for remote destinations.",
        hint: "Is PC-B on PC-A's network?",
      },
    ],
  },

  explore: {
    howToUse: [
      "Start on Network Map: select each device and read its address, mask, network address, host portion, and MAC address.",
      "Open IPv4 Explorer: expand an octet and click bits to see how they add up to the decimal value.",
      "On Mask & Boundary, change the prefix length and watch the network / host boundary move in the binary mask.",
      "On Find the Network, follow the AND calculation to the network address, then read the broadcast and usable host range.",
      "Use Same Network? to predict before you reveal; then open Local vs Remote and change PC-A's default gateway.",
      "On IP Configuration, try invalid inputs and a duplicate address. Switch to Intermediate for CIDR Prefixes and the Address Inspector.",
    ],
    tryThis: [
      "In IPv4 Explorer, make the last octet 200 by clicking bits, then read the sum shown.",
      "Set 192.168.1.25 to /16, then /25, and compare the host portion each time.",
      "Find the network address of 192.168.1.200/25 and check that it is not 192.168.1.0.",
      "In Local vs Remote, send PC-A → PC-C, clear PC-A's gateway, and send again.",
      "Give PC-B the same address as PC-A and read the duplicate warning.",
    ],
  },

  explain: {
    questions: [
      {
        id: "explain-and-mask",
        question: "Why does ANDing an address with the mask give the network address?",
        answer:
          "AND keeps a bit only when both bits are 1. The mask's 1s cover the network bits, so those bits are kept, and its 0s cover the host bits, so those bits become 0. What is left is the network portion followed by zeros, the network address.",
      },
      {
        id: "explain-minus-two",
        question: "Why are two addresses subtracted when counting usable hosts?",
        answer:
          "The all-0s host value names the network and the all-1s host value is the broadcast address to reach every device. Neither identifies a single device, so 2^H − 2 remain. /31 and /32 are special cases and behave differently.",
      },
      {
        id: "explain-gateway-local",
        question: "Why doesn't a host need its default gateway to reach a device on its own network?",
        answer:
          "Comparing the destination with its own network address using the mask shows that the destination is local, so the host delivers directly. The gateway is only the way out to other networks.",
      },
      {
        id: "explain-gateway-subnet",
        question: "Why must the default gateway be an address on the host's own network?",
        answer:
          "The host can only send directly to addresses on its local network. To use the router as the next step it must reach it directly, so the router interface it names must be on that same network.",
      },
    ],
  },

  practice: { quizId: "it-ip-addressing-simulator-practice" },

  challenge: {
    intro: "Configure and inspect real addresses in the simulation. Some challenges check the network you build.",
    scenarios: [
      {
        id: CH_SAME,
        title: "Configure two PCs on the same network",
        scenario: "PC-A is 192.168.1.10/24 and PC-B is 10.0.0.5/24, so they are on different networks.",
        objective: "Give PC-B an address so both PCs are on the same IP network, with no duplicate address.",
        answer: { mode: "interactive", instructions: "Select PC-B, edit its address and Apply, then check.", verifyLabel: "Check my configuration" },
        hints: ["Keep the mask /24 and keep the first three octets equal to PC-A's.", "The last octet must be different from PC-A's and between 2 and 254."],
        explanation: "For /24, the first three octets must match. For example, 192.168.1.20/24 gives network 192.168.1.0 for both.",
      },
      {
        id: "ip-addressing-challenge-identify-same",
        title: "Same network?",
        scenario: "Two hosts use the mask 255.255.255.128 (/25): 192.168.10.130 and 192.168.10.200.",
        objective: "Which statement is correct?",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Same network: both are in 192.168.10.128/25" },
            { id: "b", label: "Different networks: the last octets differ" },
            { id: "c", label: "Same network: both are in 192.168.10.0/24" },
          ],
          correctOptionId: "a",
        },
        hints: ["A /25 splits the last octet at 128.", "Which half do 130 and 200 fall in?"],
        explanation: "With /25 the blocks are 0–127 and 128–255. Both 130 and 200 are in 128–255, so both are in 192.168.10.128/25.",
        requiresExperiment: true,
      },
      {
        id: "ip-addressing-challenge-find-network",
        title: "Find the network address",
        scenario: "A host is configured as 172.16.37.200/20.",
        objective: "What is its network address?",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "172.16.32.0" },
            { id: "b", label: "172.16.37.0" },
            { id: "c", label: "172.16.16.0" },
            { id: "d", label: "172.16.0.0" },
          ],
          correctOptionId: "a",
        },
        hints: ["/20 means 20 network bits: 16 for the first two octets plus 4 of the third octet.", "The third octet 37 in binary is 00100101; keep only its first 4 bits."],
        explanation: "The first four bits of 37 (00100101) are 0010, and the rest become 0: 00100000 = 32. The network address is 172.16.32.0.",
        requiresExperiment: true,
      },
      {
        id: "ip-addressing-challenge-find-broadcast",
        title: "Find the broadcast address",
        scenario: "A host is configured as 10.1.1.77/28.",
        objective: "What is the last octet of the broadcast address?",
        answer: { mode: "numeric", target: 79, tolerance: 0 },
        hints: ["/28 leaves 4 host bits, so blocks hold 16 addresses.", "Which block of 16 contains 77?"],
        explanation: "The block is 64–79 (network .64, broadcast .79). The broadcast address is 10.1.1.79.",
        requiresExperiment: true,
      },
      {
        id: CH_GATEWAY,
        title: "Configure a correct default gateway",
        scenario: "PC-A (192.168.1.10/24) cannot reach PC-C on the other network. Its default gateway is set to 192.168.2.1.",
        objective: "Fix PC-A's default gateway so it can reach PC-C through the router.",
        answer: { mode: "interactive", instructions: "Change PC-A's gateway and Apply, then check.", verifyLabel: "Check my configuration" },
        hints: ["Which router address is on PC-A's own network?"],
        explanation: "The gateway must be on PC-A's network: 192.168.1.1, the router's LAN 1 interface.",
      },
      {
        id: CH_DUP,
        title: "Fix a duplicate IP",
        scenario: "PC-A and PC-B both use 192.168.1.10/24.",
        objective: "Change one PC to an unused address on the same network so both can still talk directly.",
        answer: { mode: "interactive", instructions: "Change one address and Apply, then check.", verifyLabel: "Check my configuration" },
        hints: ["Avoid .0, .255, the router's .1, and addresses already in use (.10, .30)."],
        explanation: "Each interface needs its own unique address inside the shared network, for example 192.168.1.20.",
      },
      {
        id: CH_ROUTED,
        title: "Configure two networks connected by a router",
        scenario: "PC-C sits on LAN 2 but was configured as 192.168.1.50/24, and PC-A has no default gateway.",
        objective: "Fix both PCs so they can exchange data through the router. LAN 2 is 192.168.2.0/24 with router address 192.168.2.1.",
        answer: { mode: "interactive", instructions: "Configure PC-A and PC-C and Apply each, then check.", verifyLabel: "Check my configuration" },
        hints: ["PC-C needs an address in 192.168.2.0/24 and gateway 192.168.2.1.", "PC-A needs gateway 192.168.1.1."],
        explanation: "Two networks need two different network addresses, and each host needs the router's address on its own side as its default gateway.",
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "information-technology",
      topicSlug: "ethernet-mac-simulator",
      label: "Ethernet & MAC Address Simulator",
      reason: "Each interface has a MAC address for local delivery and an IP address for network identity.",
      href: "/dashboard/information-technology/ethernet-mac-simulator",
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "tcp-ip-model-explorer",
      label: "TCP/IP Model Explorer",
      reason: "IP addressing belongs to the Internet layer of the TCP/IP model.",
      href: "/dashboard/information-technology/tcp-ip-model-explorer",
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "osi-model-explorer",
      label: "OSI Model Explorer",
      reason: "IPv4 addresses are used at the OSI Network layer (Layer 3).",
      href: "/dashboard/information-technology/osi-model-explorer",
    },
  ],
};

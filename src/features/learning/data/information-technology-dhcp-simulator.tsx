import type { TopicContent } from "../types";

/** Interactive scenario ids — must match `DHCP_CHALLENGE_IDS` in the simulation's `challenges.ts`. */
const CH_SERVER = "dhcp-challenge-configure-server";
const CH_EXHAUSTED = "dhcp-challenge-fix-exhausted";
const CH_GATEWAY = "dhcp-challenge-fix-gateway";

export const informationTechnologyDhcpSimulatorContent: TopicContent = {
  subjectSlug: "information-technology",
  topicSlug: "dhcp-simulator",
  title: "DHCP Simulator",
  subjectLabel: "Information Technology",
  topicLabel: "DHCP Simulator",
  colorToken: "it",
  simulationHref: "/dashboard/information-technology/dhcp-simulator",

  learn: {
    objectives: [
      "Explain what DHCP is and why networks use it instead of typing settings into every device",
      "Describe the four DORA messages (Discover, Offer, Request, ACK), who sends each one, and why",
      "List the configuration DHCP provides: IP address, subnet mask, default gateway, DNS server and lease time",
      "Explain address pools, leases, renewal and release, and what happens when a pool runs out",
      "Distinguish DHCP from ARP, and DHCP from DNS",
    ],
    whyItMatters:
      "Every phone, laptop and PC that joins a network needs an IP address, a subnet mask, a gateway and a DNS server before it can do anything useful. Typing those into hundreds of devices would be slow and error-prone, and two devices with the same address break each other. DHCP does it automatically in a fraction of a second, which is why you can join a new Wi-Fi network without configuring anything. Understanding DHCP also explains a common real-world fault: a device that shows an address starting with 169.254 because no DHCP server answered.",
    concepts: [
      {
        term: "The problem DHCP solves",
        explanation:
          "A device needs an IPv4 address, a subnet mask, a default gateway and usually a DNS server before it can communicate beyond its own link. DHCP (Dynamic Host Configuration Protocol) lets a server supply all of them automatically. The alternative is manual (static) configuration, where a person types every value into every device.",
      },
      {
        term: "DHCP client and DHCP server",
        explanation:
          "The client is any device asking for configuration, such as a PC or phone. The server owns a pool of addresses and a set of settings, and answers clients. In this lab the server is a separate device with its own fixed address (192.168.1.2). The router is the default gateway, but it is not the DHCP server here; in many home networks one box does both jobs, which is a common source of confusion.",
      },
      {
        term: "DHCP runs over UDP",
        explanation:
          "DHCP for IPv4 is carried in UDP. The server listens on UDP port 67 and the client uses UDP port 68. A client with no address sends from 0.0.0.0, so DHCP cannot depend on anything the client has not been given yet.",
      },
      {
        term: "DORA",
        explanation:
          "The initial exchange has four messages: Discover, Offer, Request, Acknowledge. The client Discovers a server, a server Offers a configuration, the client Requests that offer, and the server Acknowledges (ACK) it. Only after the ACK may the client use the address.",
      },
      {
        term: "DHCP Discover",
        explanation:
          "The client has no address and does not know any server, so it broadcasts: from 0.0.0.0 port 68 to 255.255.255.255 port 67, in an Ethernet frame to FF:FF:FF:FF:FF:FF. Every device on the LAN receives it, but only DHCP servers act on it. It carries the client's MAC address and a transaction ID.",
      },
      {
        term: "DHCP Offer",
        explanation:
          "A server picks a free address from its pool and proposes a complete configuration: address, mask, gateway, DNS server and lease time. It sets the address aside briefly. An Offer is only a proposal. Depending on the client's BROADCAST flag and on the implementation, it may be sent as a broadcast or as a unicast to the client, so you should not assume it is always one or the other.",
      },
      {
        term: "DHCP Request",
        explanation:
          "The client accepts an offer by asking for it: \"I would like this address from that server.\" In the initial exchange it is still a broadcast from 0.0.0.0, which also tells any other server that its offer was not chosen. A DHCP Request is not an ARP request: it asks a server for configuration, while ARP asks the LAN which MAC address owns an IP address.",
      },
      {
        term: "DHCP ACK",
        explanation:
          "The server confirms the lease and sends the final configuration. The lease is recorded, and the client applies the address, mask, gateway and DNS server. Many clients then check with ARP that nobody else is using the address; if someone is, they send a DHCP Decline and start again.",
      },
      {
        term: "Address pool",
        explanation:
          "The range of addresses the server may hand out, for example 192.168.1.100 to 192.168.1.150 on 192.168.1.0/24. The pool must not include addresses that belong to fixed devices such as the router (192.168.1.1) or the server, and it cannot include the network or broadcast address. The pool is finite.",
      },
      {
        term: "Lease",
        explanation:
          "An address is lent, not given. The lease says how long the client may use it (60 minutes in the default lab). The server keeps a lease table that records which client holds which address, so it never gives the same address to two clients at once. Lease lengths in real networks range from minutes to days.",
      },
      {
        term: "Renewing a lease",
        explanation:
          "A client that wants to keep its address asks the server to extend the lease. By default it starts at half of the lease time by sending a unicast Request to the same server; if that fails it broadcasts to any server later. In this lab renewal happens only when you press Renew, so you can also see a lease expire.",
      },
      {
        term: "Releasing a lease",
        explanation:
          "A client that no longer needs its address can send a DHCP Release. The server does not reply; it marks the address free so it can be reused at once. A client that simply disappears never releases, and the server waits for the lease to expire.",
      },
      {
        term: "Pool exhaustion",
        explanation:
          "If every address in the pool is leased or reserved, the server has nothing to offer. It cannot invent addresses, so it sends no Offer and the client is left without configuration. The fixes are administrative: enlarge the pool, shorten leases, or release addresses that are no longer used. Some operating systems then assign themselves a 169.254.x.x link-local address, which does not come from DHCP.",
      },
      {
        term: "Static (manual) configuration",
        explanation:
          "A person types the address, mask, gateway and DNS server. It works without a server and the address never changes, which is right for servers and routers that others must find. The risks are typing mistakes and duplicate addresses. A static address should sit outside the DHCP pool, or be excluded from it.",
      },
      {
        term: "DHCP is not DNS",
        explanation:
          "DHCP can tell a client the address of a DNS server. It does not resolve names itself. Turning example.com into an IP address is done by DNS, a separate protocol.",
      },
      {
        term: "DHCP is not ARP",
        explanation:
          "DHCP gives a device its IP configuration. ARP resolves an IPv4 address to a MAC address on the local network. After DHCP, a client uses ARP whenever it needs the MAC address of another local device or of its gateway. The two protocols are separate, and their message names (DHCP Request, ARP request) only look alike.",
      },
      {
        term: "DHCP relay",
        explanation:
          "Broadcasts do not cross routers, so a client on another subnet cannot reach a DHCP server directly. A relay agent on the router forwards its messages to the server. Relays exist in real networks but are not simulated in this lab; every client here is on the same LAN as the server.",
      },
    ],
    keyTerms: [
      { term: "DHCP", definition: "Dynamic Host Configuration Protocol: automatically gives a device its network configuration." },
      { term: "DORA", definition: "Discover, Offer, Request, Acknowledge: the four messages of the initial exchange." },
      { term: "DHCP client / server", definition: "The device asking for configuration, and the device that owns the pool and answers." },
      { term: "Address pool (scope)", definition: "The range of addresses a DHCP server may hand out." },
      { term: "Lease", definition: "The temporary right to use an address for a set time." },
      { term: "Lease table", definition: "The server's record of which client holds which address, and for how long." },
      { term: "Renew / Release", definition: "Asking to keep a lease longer / giving an address back early." },
      { term: "Default gateway", definition: "The router a client uses to reach other networks; supplied by DHCP." },
      { term: "UDP ports 67 and 68", definition: "The DHCP server listens on 67; the client uses 68." },
      { term: "Link-local (169.254.0.0/16)", definition: "A self-assigned fallback address some systems use when DHCP fails." },
    ],
    visualAids: [],
    misconceptions: [
      {
        id: "dhcp-is-arp",
        misconception: "A DHCP Request is the same thing as an ARP request.",
        correction: "They are different protocols. A DHCP Request asks a DHCP server for an address and settings. An ARP request asks the LAN which MAC address owns an IP address.",
      },
      {
        id: "dhcp-permanent",
        misconception: "Once DHCP gives a device an address, it belongs to that device for good.",
        correction: "A DHCP address is a lease: it lasts for a limited time and must be renewed. If the client releases it or the lease expires, the address returns to the pool.",
      },
      {
        id: "dhcp-dns",
        misconception: "DHCP turns website names into IP addresses.",
        correction: "DHCP only tells the client which DNS server to use. Name resolution is done by DNS.",
      },
      {
        id: "dhcp-router",
        misconception: "The router is always the DHCP server.",
        correction: "The router is the default gateway. Many home routers also run a DHCP server, but they are two separate roles, and the DHCP server can be another device.",
      },
      {
        id: "dhcp-infinite",
        misconception: "A DHCP server can always give out another address.",
        correction: "The server can only hand out addresses from its configured pool. When every address is in use it has none to offer.",
      },
      {
        id: "dhcp-offer-broadcast",
        misconception: "Every DHCP Offer is broadcast to the whole network.",
        correction: "The Discover is normally broadcast. An Offer may be broadcast or sent to the client directly, depending on the client's BROADCAST flag and the implementation.",
      },
    ],
  },

  predict: {
    intro: "Commit to a prediction for each one, then check yourself in the lab.",
    scenarios: [
      {
        id: "predict-dhcp-discover-dst",
        scenario: "A new PC with no IP address starts up and looks for a DHCP server.",
        question: "Where does its DHCP Discover go?",
        options: [
          { id: "a", label: "Straight to the DHCP server's IP address" },
          { id: "b", label: "To 255.255.255.255, a broadcast, from source 0.0.0.0" },
          { id: "c", label: "To the router's IP address" },
        ],
        actualResultOptionId: "b",
        explanation: "The PC has no address of its own and does not know where any server is, so it broadcasts. Every device on the LAN receives it and only a DHCP server answers.",
        hint: "Does the PC know the server's address yet?",
      },
      {
        id: "predict-dhcp-offer-final",
        scenario: "PC-01 has just received a DHCP Offer for 192.168.1.100.",
        question: "Can PC-01 start using 192.168.1.100 now?",
        options: [
          { id: "a", label: "Yes, the Offer gives it the address" },
          { id: "b", label: "No, it must send a Request and wait for the ACK" },
          { id: "c", label: "Yes, but only for DNS" },
        ],
        actualResultOptionId: "b",
        explanation: "An Offer is only a proposal. The address is confirmed by the ACK at the end of DORA.",
      },
      {
        id: "predict-dhcp-second-client",
        scenario: "PC-01 already holds 192.168.1.100. The pool is 192.168.1.100 to 192.168.1.150. PC-02 now asks for an address.",
        question: "Which address does the server offer PC-02?",
        options: [
          { id: "a", label: "192.168.1.100 again" },
          { id: "b", label: "192.168.1.101" },
          { id: "c", label: "192.168.1.1" },
        ],
        actualResultOptionId: "b",
        explanation: "The lease table shows .100 is taken, so the server offers the next free address. It never offers an address that is leased or reserved.",
      },
      {
        id: "predict-dhcp-empty-pool",
        scenario: "The pool has three addresses and three PCs already hold them. A fourth PC sends a Discover.",
        question: "What happens?",
        options: [
          { id: "a", label: "The server offers an address outside the pool" },
          { id: "b", label: "The server takes an address from one of the other PCs" },
          { id: "c", label: "No Offer is sent, and the fourth PC gets no address" },
        ],
        actualResultOptionId: "c",
        explanation: "A DHCP server can only assign addresses from its configured pool. With none free it has nothing to offer.",
        hint: "Can the server invent a new address?",
      },
      {
        id: "predict-dhcp-release",
        scenario: "PC-02 releases 192.168.1.101. The pool has no other free address. PC-04 then sends a Discover.",
        question: "What does PC-04 receive?",
        options: [
          { id: "a", label: "Nothing, the address is gone forever" },
          { id: "b", label: "An Offer for 192.168.1.101" },
          { id: "c", label: "The same configuration as PC-02, including PC-02's MAC address" },
        ],
        actualResultOptionId: "b",
        explanation: "A released address goes straight back into the pool, so it can be offered to the next client that asks, even a different one.",
      },
    ],
  },

  explore: {
    howToUse: [
      "Open Get an Address, select PC-01 and press Start DHCP. Press Next Step through Discover, Offer, Request and ACK, and read what happened, who sent it, why, and what changed.",
      "Click the message tokens in the inspector to compare the four messages. Switch the level to Intermediate or Technical to reveal ports, addresses and header fields.",
      "Open Address Pool, change the range or the gateway and DNS server, press Apply, then configure a PC and see the new values arrive.",
      "Open Multiple Clients (or press Configure all) and watch the lease table fill up with different addresses.",
      "Open Pool Exhaustion, shrink the pool to three addresses and let five PCs ask. Try each fix.",
      "Open Release & Renew. Renew a lease, release another, then advance the lab clock past a lease's end to see it expire.",
      "Open Static vs DHCP, switch a PC to manual and type a wrong gateway. Read the diagnosis, then compare with DHCP.",
      "Open DHCP + ARP to follow a packet after DHCP has done its job, and try the DHCP-or-ARP sorting quiz.",
      "Try the six Guided Experiments. Each one sets up the lab, gives you a task and checks your result.",
    ],
    tryThis: [
      "Give PC-01 an address, then release it and ask again. Which address does it get back?",
      "Set the pool to .200–.210 and configure PC-01. Which address does it receive?",
      "Choose a 5 minute lease, advance 10 minutes without renewing, and see which PCs lose their configuration.",
      "Set the gateway to 192.168.2.1 in the pool and configure a PC. Does the diagnosis complain?",
      "In manual mode, give a PC an address inside the DHCP range. What warning appears, and why?",
    ],
  },

  explain: {
    questions: [
      {
        id: "explain-why-broadcast",
        question: "Why is the DHCP Discover sent as a broadcast from 0.0.0.0?",
        answer: "The client has no IP address yet and does not know where a DHCP server is. Source 0.0.0.0 means \"I have no address\", and the broadcast destination reaches every device on the LAN, so any DHCP server can answer.",
      },
      {
        id: "explain-why-request",
        question: "Why does the client send a Request when the Offer already contains the address?",
        answer: "The Offer is only a proposal, and more than one server may have offered. The Request tells everyone which offer the client chose. That lets the chosen server commit the lease with an ACK, and lets the other servers free the addresses they had set aside.",
      },
      {
        id: "explain-why-lease",
        question: "Why does DHCP use leases instead of permanent addresses?",
        answer: "Devices come and go. If a laptop leaves the network without telling anyone, a permanent address would be lost from the pool forever. A lease makes every address come back on its own unless the client keeps renewing it.",
      },
      {
        id: "explain-exhaustion",
        question: "Why can a DHCP server run out of addresses?",
        answer: "It only hands out addresses from the range an administrator configured. When every address in that range is leased or reserved, there is nothing left to offer, however many clients ask. The fix is to enlarge the pool, shorten leases or free unused addresses.",
      },
      {
        id: "explain-dhcp-vs-arp",
        question: "How do DHCP and ARP differ, and how do they work together?",
        answer: "DHCP gives a device its IP configuration: address, mask, gateway and DNS server. ARP resolves an IPv4 address to a MAC address on the local network. Once DHCP has configured a device, the device uses ARP whenever it needs the MAC address of another local device or of its default gateway.",
      },
    ],
  },

  practice: { quizId: "it-dhcp-simulator-practice" },

  challenge: {
    intro: "Use the lab to solve realistic DHCP problems. Some challenges check the server configuration and the leases you actually produce.",
    scenarios: [
      {
        id: CH_SERVER,
        title: "Configure a DHCP server correctly",
        scenario: "A new DHCP server on 192.168.1.0/24 hands out addresses from 192.168.1.1 to 192.168.1.20, gives clients the gateway 192.168.2.1, and has no DNS server.",
        objective: "Fix the pool, gateway and DNS server so the server is configured correctly.",
        answer: { mode: "interactive", instructions: "Edit the range, gateway and DNS server, press Apply, then check.", verifyLabel: "Check my work" },
        hints: ["The router is 192.168.1.1 and the DHCP server is 192.168.1.2. Both must stay out of the pool.", "The gateway must be an address on 192.168.1.0/24 that a device really has: the router."],
        explanation: "A correct pool avoids the router's and the server's own addresses, holds enough addresses for the clients, and hands out the real gateway (192.168.1.1) and a DNS server.",
      },
      {
        id: "dhcp-challenge-why-no-address",
        title: "Identify why a client did not receive an address",
        scenario: "The DHCP pool is 192.168.1.100 to 192.168.1.104 and five PCs already hold every address. PC-06 is plugged in. Its Discover is broadcast and the server receives it, but PC-06 gets no Offer and stays unconfigured.",
        objective: "What is the most likely reason?",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "The DHCP pool has no available address left" },
            { id: "b", label: "PC-06 sent an ARP request instead of a DHCP Discover" },
            { id: "c", label: "The subnet mask on PC-06 is wrong" },
            { id: "d", label: "DHCP uses TCP, which the switch blocked" },
          ],
          correctOptionId: "a",
        },
        hints: ["The server received the Discover. What does it need in order to answer?", "Count the pool addresses and the clients that hold one."],
        explanation: "The server got the Discover but every address in its pool is leased, so it has nothing to offer and stays silent. PC-06 has no mask yet (it has no configuration at all), and DHCP uses UDP, not TCP.",
        requiresExperiment: false,
      },
      {
        id: "dhcp-challenge-which-address",
        title: "Determine which address the server can assign",
        scenario: "The pool is 192.168.1.100 to 192.168.1.105. .100 and .101 are leased, .102 was released, .103 is leased, .104 is reserved by an Offer waiting for its Request, and .105 has never been used. A brand-new PC-06 sends a Discover. In this lab the server offers the lowest free address.",
        objective: "Which address does the server offer PC-06?",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "192.168.1.100" },
            { id: "b", label: "192.168.1.102" },
            { id: "c", label: "192.168.1.104" },
            { id: "d", label: "192.168.1.105" },
          ],
          correctOptionId: "b",
        },
        hints: ["Leased and offered addresses are not available.", "A released address counts as available again."],
        explanation: ".100, .101 and .103 are leased and .104 is reserved by an outstanding Offer, so none of them can be offered. .102 was released and is free, and it is the lowest free address, so the server offers it.",
        requiresExperiment: false,
      },
      {
        id: CH_EXHAUSTED,
        title: "Fix an exhausted DHCP pool",
        scenario: "The pool holds three addresses and PC-01, PC-02 and PC-03 hold all of them. PC-04 and PC-05 cannot get an address.",
        objective: "Make both PC-04 and PC-05 receive a DHCP address.",
        answer: { mode: "interactive", instructions: "Run DHCP for PC-04, find out why it fails, free or add addresses, run DHCP again for both, then check.", verifyLabel: "Check my work" },
        hints: ["Enlarge the pool in the server configuration, or release a PC that is no longer in use.", "You need two free addresses in total, for two PCs."],
        explanation: "The pool had no free address, so the last two PCs got no Offer. Adding addresses to the pool (or releasing unused leases) gives the server something to offer.",
      },
      {
        id: "dhcp-challenge-dora-step",
        title: "Identify the correct DORA step",
        scenario: "A server log reads: 12:01:01 PC-01 → (?)   12:01:01 DHCP Server → DHCP Offer   12:01:02 PC-01 → (?)   12:01:02 DHCP Server → DHCP ACK.",
        objective: "Which two messages did PC-01 send, in order?",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "DHCP Discover, then DHCP Request" },
            { id: "b", label: "DHCP Request, then DHCP Discover" },
            { id: "c", label: "DHCP Discover, then DHCP Release" },
            { id: "d", label: "ARP request, then DHCP Request" },
          ],
          correctOptionId: "a",
        },
        hints: ["DORA: Discover, Offer, Request, ACK.", "The client speaks first and third."],
        explanation: "DORA alternates client and server: the client sends Discover, the server Offers, the client sends Request, the server Acknowledges.",
        requiresExperiment: false,
      },
      {
        id: "dhcp-challenge-dhcp-or-arp",
        title: "Distinguish DHCP from ARP",
        scenario: "PC-01 has just received 192.168.1.100 by DHCP. It now wants to send data to 192.168.1.20 on the same LAN, but it does not know that device's MAC address.",
        objective: "Which protocol finds the MAC address of 192.168.1.20?",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "DHCP, with a new Discover" },
            { id: "b", label: "ARP, with an ARP request" },
            { id: "c", label: "DNS, with a lookup" },
            { id: "d", label: "DHCP, with a Renew" },
          ],
          correctOptionId: "b",
        },
        hints: ["Which protocol maps an IPv4 address to a MAC address?", "DHCP already did its job when the address was configured."],
        explanation: "ARP resolves an IPv4 address to a MAC address on the local network. DHCP supplied PC-01's own configuration; it does not find other devices' MAC addresses.",
        requiresExperiment: false,
      },
      {
        id: CH_GATEWAY,
        title: "Diagnose an incorrect gateway configuration",
        scenario: "PC-03 leased its address, but the server hands out the gateway 192.168.2.1, which is on a different network. PC-03 cannot reach anything outside its own LAN.",
        objective: "Correct the server so it hands out the router (192.168.1.1), and make PC-03 pick up the corrected gateway.",
        answer: { mode: "interactive", instructions: "Fix the gateway in the server configuration, then make PC-03 renew or re-request, then check.", verifyLabel: "Check my work" },
        hints: ["Changing the server does not change PC-03's existing lease.", "Renew the lease, or release it and run DHCP again."],
        explanation: "A gateway must be on the client's own subnet and must really be the router. The client only learns a changed setting when it renews or asks again, which is why DHCP changes take effect gradually.",
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "information-technology",
      topicSlug: "arp-simulator",
      label: "ARP Simulator",
      reason: "After DHCP configures a device, ARP resolves IPv4 addresses to MAC addresses on the local network. They are separate protocols.",
      href: "/dashboard/information-technology/arp-simulator",
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "ip-addressing-simulator",
      label: "IP Addressing Simulator",
      reason: "DHCP supplies the IP address, subnet mask and default gateway you configured by hand there.",
      href: "/dashboard/information-technology/ip-addressing-simulator",
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "subnetting-laboratory",
      label: "Subnetting Laboratory",
      reason: "The pool lives inside one subnet, and the mask the server hands out defines the client's network.",
      href: "/dashboard/information-technology/subnetting-laboratory",
    },
  ],
};

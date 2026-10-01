import type { QuizDifficulty, QuizMeta, QuizQuestion } from "../types";

/** Builds one question and slots the correct answer at a rotating position so it is not always first. */
function q(n: number, difficulty: QuizDifficulty, concept: string, question: string, correct: string, wrong: [string, string, string], explanation: string): QuizQuestion {
  const options = [...wrong];
  options.splice(n % 4, 0, correct);
  return {
    id: `it-dhcp-quiz-${String(n).padStart(3, "0")}`,
    type: "multiple-choice",
    question,
    options,
    correctAnswer: correct,
    explanation,
    difficulty,
    subject: "information-technology",
    topic: "dhcp-simulator",
    concept,
  };
}

const questions: QuizQuestion[] = [
  q(1, "easy", "DHCP Purpose", "What is the main purpose of DHCP?", "To give devices their network configuration automatically", ["To translate domain names into IP addresses", "To map IP addresses to MAC addresses", "To forward packets between networks"], "DHCP hands out IP configuration automatically, so it does not have to be typed into every device."),
  q(2, "easy", "DHCP Purpose", "Why do networks use DHCP instead of configuring every device by hand?", "It saves work and avoids typing mistakes and duplicate addresses", ["It makes the network faster", "It encrypts the IP addresses", "It removes the need for a default gateway"], "Central configuration is quicker and more consistent than setting up every device manually."),
  q(3, "easy", "Client/Server Roles", "Which device is the DHCP client?", "The device asking for an IP configuration", ["The device that owns the address pool", "The switch", "The default gateway, always"], "The client asks for configuration. The server owns the pool and answers."),
  q(4, "easy", "Client/Server Roles", "Which device holds the pool of addresses and the lease table?", "The DHCP server", ["The DHCP client", "The Ethernet switch", "The ARP cache"], "The lease table on the server records which client holds which address."),
  q(5, "easy", "DORA", "What does DORA stand for?", "Discover, Offer, Request, Acknowledge", ["Deliver, Obtain, Renew, Assign", "Detect, Offer, Release, Accept", "Discover, Obtain, Request, Allocate"], "DORA names the four messages of the initial DHCP exchange."),
  q(6, "easy", "DHCP Discover", "Which message does a client send when it has no address and needs to find a DHCP server?", "DHCP Discover", ["DHCP Offer", "DHCP ACK", "DHCP Release"], "The Discover starts the exchange."),
  q(7, "easy", "DHCP Offer", "Who sends the DHCP Offer?", "The DHCP server", ["The DHCP client", "The router only", "The switch"], "The server proposes an address and settings from its pool."),
  q(8, "easy", "DHCP Request", "What does the client's DHCP Request do?", "Asks for the offered address from a chosen server", ["Asks who owns a particular IP address", "Releases the current address", "Asks for a DNS lookup"], "The Request accepts one offer. It is not an ARP request."),
  q(9, "easy", "DHCP ACK", "What does a DHCP ACK tell the client?", "The lease is confirmed and it may use the configuration", ["That the server has no addresses left", "That another server is closer", "That the client must broadcast again"], "The ACK makes the lease official."),
  q(10, "easy", "Configuration Provided", "Which of these can DHCP provide to a client?", "IP address, subnet mask, default gateway and DNS server", ["Only the MAC address", "Only the default gateway", "Website content"], "DHCP supplies the full IPv4 configuration, plus the lease time."),
  q(11, "medium", "DHCP Discover", "How is the initial DHCP Discover sent?", "As a broadcast from 0.0.0.0 to 255.255.255.255", ["As a unicast to the server's IP address", "As a unicast to the default gateway", "As an ARP frame"], "The client has no address and does not know a server, so it broadcasts. Every device on the LAN receives it, but only DHCP servers act on it."),
  q(12, "medium", "UDP Ports", "Which transport protocol and ports does DHCP for IPv4 use?", "UDP: server port 67, client port 68", ["TCP: server port 80, client port 443", "UDP: server port 53, client port 68", "TCP: server port 67, client port 68"], "DHCP runs over UDP. The server listens on port 67 and the client uses port 68."),
  q(13, "medium", "DHCP Offer", "Which statement about the DHCP Offer is correct?", "It may be sent as a broadcast or as a unicast, depending on the client and the implementation", ["It is always a broadcast", "It is always sent to the router", "It is sent before the Discover"], "The client's BROADCAST flag and the implementation decide. The Discover, by contrast, is normally a broadcast."),
  q(14, "medium", "Address Allocation", "Why does the server set an address aside when it sends an Offer?", "So it does not offer the same address to another client meanwhile", ["Because the client already owns it", "To reduce the lease time", "Because the address is outside the pool"], "The Offered address is reserved until the client requests it or the offer times out."),
  q(15, "medium", "DHCP Request", "Why is the initial DHCP Request still a broadcast?", "The client has no address yet, and other servers learn their offers were not chosen", ["Because DHCP servers only accept broadcasts", "Because it is an ARP message", "Because the Offer was a broadcast"], "Until the ACK, the client uses 0.0.0.0. Broadcasting also tells other servers whose offer was chosen."),
  q(16, "medium", "Address Pool", "What is a DHCP address pool?", "The range of addresses the server may hand out", ["The list of DNS servers", "The clients' MAC addresses", "The router's routing table"], "An address pool (scope) is a finite range such as .100 to .150."),
  q(17, "medium", "Address Pool", "Which range is a valid pool on 192.168.1.0/24, with the router at 192.168.1.1?", "192.168.1.100 – 192.168.1.150", ["192.168.1.0 – 192.168.1.50", "192.168.1.1 – 192.168.1.20", "192.168.1.200 – 192.168.1.300"], "A pool must not include the router, the network address or the broadcast address, and every address must exist on the subnet."),
  q(18, "medium", "Leases", "What is a DHCP lease?", "The temporary right to use an address for a set time", ["A permanent address assignment", "A copy of the DNS cache", "A message the client broadcasts"], "Leases expire unless they are renewed."),
  q(19, "medium", "Leases", "What happens to an address whose lease expires without a renewal?", "It returns to the pool and the client must stop using it", ["The client keeps it forever", "It is given to the router", "It is deleted from the network"], "Expired addresses become available again."),
  q(20, "medium", "Renewal and Release", "What is the difference between renewing and releasing a lease?", "Renewing asks to keep the address longer; releasing gives it back", ["Renewing gives it back; releasing asks to keep it", "They are the same message", "Releasing needs an ARP reply"], "Renew extends the lease; release ends it early."),
  q(21, "medium", "Gateway and DNS", "What does the DNS server address in a DHCP ACK let the client do?", "Know which server to ask when it needs to resolve names", ["Resolve names without any DNS server", "Find the MAC address of the gateway", "Increase its lease time"], "DHCP only supplies the DNS server's address. Name resolution is done by DNS."),
  q(22, "medium", "Gateway", "A client gets the gateway 192.168.1.1 from DHCP. When does the client use it?", "For destinations outside its own network", ["For every destination, including local ones", "Only to renew the lease", "Only for DNS"], "Local destinations are reached directly; the gateway is for other networks."),
  q(23, "hard", "Pool Exhaustion", "The pool has 3 addresses, all leased. A fourth client sends a Discover. What happens?", "The server has nothing to offer and sends no Offer", ["The server offers an address outside the pool", "The server takes an address from another client", "The server sends an ACK with a zero lease"], "DHCP cannot assign an address if its configured pool has no available address."),
  q(24, "hard", "Pool Exhaustion", "Which action fixes an exhausted pool?", "Enlarge the pool or release addresses that are no longer used", ["Change the client's subnet mask", "Turn off ARP", "Increase the lease time"], "A longer lease makes exhaustion worse. Capacity must be added, or unused addresses freed."),
  q(25, "hard", "Static vs DHCP", "A technician gives a printer the static address 192.168.1.120, which lies inside the DHCP pool .100–.150. What is the risk?", "The server may later lease the same address to another device, causing a conflict", ["The printer cannot use a gateway", "The lease of the printer expires early", "DHCP will encrypt the printer's traffic"], "Static addresses belong outside the pool, or must be excluded from it."),
  q(26, "hard", "Static vs DHCP", "Which device is the best candidate for a static address?", "A server that other devices must always find at the same address", ["A visitor's phone", "A laptop that moves between networks", "A tablet"], "Servers and network devices need stable addresses. Ordinary clients are better served by DHCP."),
  q(27, "hard", "DHCP vs ARP", "After DHCP has configured a PC, which protocol does it use to find the MAC address of another PC on the same LAN?", "ARP", ["DHCP", "DNS", "UDP"], "ARP resolves an IPv4 address to a MAC address on the local network."),
  q(28, "hard", "DHCP vs ARP", "Which statement correctly separates DHCP from ARP?", "DHCP supplies a device's IP configuration; ARP resolves IPv4 addresses to MAC addresses", ["DHCP resolves IPv4 addresses to MAC addresses; ARP supplies IP configuration", "They are the same protocol at different speeds", "ARP gives out addresses from a pool"], "They are separate protocols with different jobs."),
  q(29, "hard", "Troubleshooting", "A PC shows the address 169.254.12.40 and cannot reach the internet. What most likely happened?", "No DHCP server answered, so the PC assigned itself a link-local address", ["The DHCP lease is valid but the DNS server is wrong", "The PC received a static address from the router", "The PC is using ARP instead of IP"], "169.254.0.0/16 is the link-local range some systems use when DHCP fails."),
  q(30, "hard", "Troubleshooting", "A client leased an address, but the server was handing out a wrong gateway. The administrator corrects the server. When does the client normally learn the correct gateway?", "When it renews its lease or requests a new one", ["Immediately, without any message", "Never, until it is rebooted twice", "When the ARP cache is cleared"], "A server change reaches clients that already hold a lease only when they renew or ask again."),
];

export const informationTechnologyDhcpSimulatorQuiz: QuizMeta = {
  id: "it-dhcp-simulator",
  title: "DHCP Simulator Quiz",
  subjectSlug: "information-technology",
  subjectLabel: "Information Technology",
  topicLabel: "DHCP Simulator",
  colorToken: "it",
  backHref: "/dashboard/information-technology/dhcp-simulator",
  description: "Test your understanding of DHCP: its purpose, client and server roles, the DORA process, address pools and leases, gateway and DNS configuration, pool exhaustion, static versus DHCP configuration, and how DHCP differs from ARP.",
  difficulty: "medium",
  estimatedTime: 25,
  questions,
};

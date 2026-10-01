import type { QuizDifficulty, QuizMeta, QuizQuestion } from "../types";

/** Builds one question and slots the correct answer at a rotating position so it is not always first. */
function q(n: number, difficulty: QuizDifficulty, concept: string, question: string, correct: string, wrong: [string, string, string], explanation: string, hints: string[]): QuizQuestion {
  const options = [...wrong];
  options.splice(n % 4, 0, correct);
  return {
    id: `it-dhcp-practice-${String(n).padStart(3, "0")}`,
    type: "multiple-choice",
    question,
    options,
    correctAnswer: correct,
    explanation,
    difficulty,
    subject: "information-technology",
    topic: "dhcp-simulator",
    concept,
    hints,
  };
}

const questions: QuizQuestion[] = [
  q(1, "easy", "DHCP Purpose", "What does DHCP do for a device joining a network?", "Automatically gives it an IP address and other network settings", ["Translates website names into IP addresses", "Finds the MAC address of another device", "Encrypts the traffic on the network"], "DHCP supplies the IP configuration (address, mask, gateway, DNS server) automatically, so nobody has to type it in.", ["Think about what a brand-new device needs before it can communicate.", "Which protocol resolves names, and which one resolves MAC addresses?"]),
  q(2, "easy", "Client and Server Roles", "In DHCP, which device owns the pool of addresses and answers requests?", "The DHCP server", ["The DHCP client", "The switch", "The ARP cache"], "The server owns the address pool and the lease table. The client is the device that asks.", ["Which device is asking, and which one is answering?"]),
  q(3, "easy", "DORA", "Put the DORA messages in the correct order.", "Discover, Offer, Request, ACK", ["Offer, Discover, ACK, Request", "Request, Offer, Discover, ACK", "Discover, Request, Offer, ACK"], "The client Discovers, the server Offers, the client Requests, and the server Acknowledges.", ["D-O-R-A is the order.", "The client speaks first."]),
  q(4, "easy", "DHCP Discover", "Which message does a new PC with no address broadcast first?", "DHCP Discover", ["DHCP Offer", "DHCP ACK", "ARP reply"], "The client starts the exchange with a Discover, because it does not yet know any server.", ["Which message is sent by the client, and first?"]),
  q(5, "easy", "DHCP Offer", "Which message does the server send to propose an address and settings?", "DHCP Offer", ["DHCP Discover", "DHCP Request", "DHCP Release"], "The Offer carries the proposed address, mask, gateway, DNS server and lease time.", ["The server proposes; the client has not accepted yet."]),
  q(6, "easy", "DHCP ACK", "Which message makes the lease official?", "DHCP ACK", ["DHCP Discover", "DHCP Offer", "ARP request"], "Only the ACK confirms the lease. Until then the client must not use the offered address.", ["An Offer is only a proposal."]),
  q(7, "easy", "Available Address", "The pool is .100 to .103. .100 and .101 are leased. Which address can the server offer next?", "192.168.1.102", ["192.168.1.100", "192.168.1.101", "192.168.1.1"], "Leased addresses are taken. .102 is the lowest free address in the pool, and .1 is the router, outside the pool.", ["Skip every address that is already leased.", "Stay inside the pool range."]),
  q(8, "easy", "Static vs DHCP", "Which is an advantage of DHCP over manual configuration?", "Fewer typing mistakes and less work on large networks", ["The address never changes", "It works without any server", "It gives every device the same address"], "The server enters the values once and hands them out consistently. Static addresses are the ones that never change and need no server.", ["Which method needs a server?"]),
  q(9, "medium", "Pool Configuration", "Which DHCP range is configured correctly on 192.168.1.0/24 with the router at .1 and the server at .2?", "192.168.1.100 – 192.168.1.150", ["192.168.1.1 – 192.168.1.50", "192.168.1.0 – 192.168.1.255", "192.168.1.150 – 192.168.1.100"], "A valid pool avoids the router, the server, and the network and broadcast addresses, and runs from low to high.", ["Which ranges include .1, .2, .0 or .255?", "The first address must not be higher than the last."]),
  q(10, "medium", "Failed Lease", "The pool has no free address and a new PC sends a Discover. What does the PC receive?", "Nothing: the server sends no Offer", ["An Offer for an address outside the pool", "An ACK with a shorter lease", "An ARP reply"], "The server can only assign addresses from its configured pool. With none available, it has nothing to offer.", ["Can the server invent an address?"]),
  q(11, "medium", "DHCP vs ARP", "Which statement about DHCP Request and ARP request is correct?", "A DHCP Request asks a server for an address; an ARP request asks who owns an IP address", ["They are two names for the same message", "An ARP request asks a server for an address", "A DHCP Request asks for a MAC address"], "They are different protocols. DHCP configures the device; ARP resolves an IPv4 address to a MAC address.", ["One configures the device. The other maps IP to MAC."]),
  q(12, "medium", "Release", "What happens to a leased address when its client sends a DHCP Release?", "It becomes available in the pool again", ["It is deleted from the pool permanently", "It is given to the router", "The client keeps it until the server restarts"], "Releasing gives the address back so the server can offer it to another client straight away.", ["The client is giving the address back."]),
  q(13, "medium", "Lease Renewal", "What does a client that renews its lease want?", "To keep using its address for another lease period", ["To find a different DHCP server", "To learn the MAC address of the gateway", "To reduce the size of the pool"], "Renewal extends the lease on the same address, so the client does not lose it when the lease runs out.", ["A lease is temporary. What does the client do to keep it?"]),
  q(14, "hard", "Gateway Diagnosis", "A DHCP server hands out the gateway 192.168.2.1 on a 192.168.1.0/24 network. What is the problem?", "The gateway is not on the client's own network, so the client cannot reach it", ["The subnet mask is too large", "The lease is too short", "DHCP cannot supply a gateway"], "A default gateway must be reachable directly, so it has to be an address on the client's own subnet (here, the router at 192.168.1.1).", ["Is 192.168.2.1 inside 192.168.1.0/24?"]),
  q(15, "hard", "DHCP Roles", "Which device is the DHCP client in this sentence: \"The router hands PC-01 an address from its pool\"?", "PC-01", ["The router", "The switch", "Both of them"], "The device that asks for and receives the configuration is the client. The device that owns the pool and hands it out is the server.", ["Which device receives the address?"]),
];

export const informationTechnologyDhcpSimulatorPracticeQuiz: QuizMeta = {
  id: "it-dhcp-simulator-practice",
  title: "DHCP Simulator Practice",
  subjectSlug: "information-technology",
  subjectLabel: "Information Technology",
  topicLabel: "DHCP Simulator",
  colorToken: "it",
  backHref: "/dashboard/information-technology/dhcp-simulator",
  description: "Short practice tasks on DHCP messages, the DORA order, address pools and leases, failed leases, and static versus DHCP configuration.",
  difficulty: "medium",
  estimatedTime: 12,
  questions,
};

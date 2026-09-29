import type { QuizDifficulty, QuizMeta, QuizQuestion } from "../types";

/** Builds one question and slots the correct answer at a rotating position so it is not always first. */
function q(n: number, difficulty: QuizDifficulty, concept: string, question: string, correct: string, wrong: [string, string, string], explanation: string): QuizQuestion {
  const options = [...wrong];
  options.splice(n % 4, 0, correct);
  return {
    id: `it-arp-quiz-${String(n).padStart(3, "0")}`,
    type: "multiple-choice",
    question,
    options,
    correctAnswer: correct,
    explanation,
    difficulty,
    subject: "information-technology",
    topic: "arp-simulator",
    concept,
  };
}

const questions: QuizQuestion[] = [
  q(1, "easy", "ARP Purpose", "What is the main job of ARP on an IPv4 LAN?", "Find the MAC address that goes with an IPv4 address", ["Assign IP addresses to devices", "Translate website names into IP addresses", "Choose the best route to another network"], "ARP maps an IPv4 address to a link-layer (MAC) address on the local network."),
  q(2, "easy", "ARP Purpose", "Why does a device need a destination MAC address before sending an Ethernet frame?", "The frame is delivered on the local link using MAC addresses", ["IP addresses cannot be carried in Ethernet frames", "The MAC address encrypts the data", "The switch uses it to assign IP addresses"], "Ethernet delivers frames by MAC address, so the sender must know the destination MAC even when it starts with an IP address."),
  q(3, "easy", "MAC/IP Relationship", "Which statement describes what ARP links together?", "An IPv4 address and the MAC address of the interface that has it", ["A MAC address and a domain name", "An IPv4 address and a switch port only", "A MAC address and a subnet mask"], "ARP records IPv4 address → MAC address pairs."),
  q(4, "easy", "ARP Request", "What does an ARP request essentially ask?", "Who has this IPv4 address?", ["What is your default gateway?", "Which port are you plugged into?", "How fast is your link?"], "An ARP request asks which device owns a given IPv4 address and tells that device where to answer."),
  q(5, "easy", "Broadcast", "Which destination MAC address does an ARP request frame use?", "FF:FF:FF:FF:FF:FF", ["00:00:00:00:00:00", "The MAC address of the target", "The MAC address of the switch"], "The sender does not know the target's MAC yet, so the frame is sent to the broadcast address."),
  q(6, "easy", "Broadcast", "Which devices on the LAN receive an ARP request?", "All the other devices on the local network", ["Only the device that owns the IP address", "Only the router", "Only devices with an empty ARP cache"], "A broadcast frame is flooded by the switch to every port except the one it arrived on."),
  q(7, "easy", "ARP Reply", "Which device sends the ARP reply?", "The device that owns the requested IP address", ["The switch", "Every device on the LAN", "The default gateway, always"], "Only the owner of the target IP address answers."),
  q(8, "easy", "Unicast Reply", "How is an ARP reply normally sent?", "As a unicast frame to the device that asked", ["As a broadcast to everyone", "As a multicast to the router", "It is not sent in an Ethernet frame"], "The request contains the requester's MAC address, so the owner can answer directly."),
  q(9, "easy", "ARP Cache", "What is stored in an ARP cache?", "IPv4 address to MAC address mappings", ["Website names and IP addresses", "Copies of all frames received", "Passwords for the switch"], "The ARP cache is a table of learned IP → MAC mappings."),
  q(10, "easy", "Cache Hit/Miss", "A device finds the destination's IP address in its ARP cache. What is this called?", "A cache hit", ["A cache miss", "A broadcast storm", "An ARP request"], "Finding the entry is a cache hit, and no ARP request is needed."),
  q(11, "easy", "Cache Hit/Miss", "What happens on a cache miss?", "The device sends an ARP request", ["The device drops the data", "The device uses the broadcast MAC for the data", "The device asks a DNS server"], "Without the MAC address the device must ask the network with an ARP request."),
  q(12, "easy", "ARP Message Fields", "Which field of an ARP message says whether it is a request or a reply?", "Operation", ["Hardware Type", "Protocol Type", "Target MAC"], "The Operation field is 1 for a request and 2 for a reply."),
  q(13, "medium", "ARP Request", "In an ARP request, what is the Target MAC?", "Unknown, because that is what is being asked", ["The broadcast address", "The sender's own MAC address", "The switch's MAC address"], "The request asks for the target's MAC, so the field is unknown (usually sent as all zeros)."),
  q(14, "medium", "ARP Request", "PC-A (192.168.1.10) asks for 192.168.1.20. Which sender values does the request carry?", "Sender IP 192.168.1.10 and PC-A's MAC address", ["Sender IP 192.168.1.20 and PC-B's MAC address", "Sender IP 192.168.1.10 and the broadcast MAC", "Sender IP 0.0.0.0 and PC-A's MAC address"], "The sender fields describe the device that built the message."),
  q(15, "medium", "ARP Reply", "In a reply from PC-B (192.168.1.20) to PC-A, what are the Sender IP and Sender MAC?", "PC-B's IP address and PC-B's MAC address", ["PC-A's IP address and PC-A's MAC address", "PC-B's IP address and the broadcast MAC", "PC-A's IP address and PC-B's MAC address"], "The reply's sender is the owner of the address, and its sender fields are the answer."),
  q(16, "medium", "ARP Reply", "In that same reply, what is the Target IP?", "192.168.1.10, PC-A's address", ["192.168.1.20", "255.255.255.255", "192.168.1.1"], "The target of the reply is the device that asked."),
  q(17, "medium", "Unicast Reply", "Which destination MAC does the Ethernet frame carrying the reply have?", "PC-A's MAC address", ["FF:FF:FF:FF:FF:FF", "PC-B's MAC address", "The router's MAC address"], "The reply is unicast to the requester."),
  q(18, "medium", "Broadcast", "Why do the other devices ignore an ARP request that is not for them?", "The Target IP does not match their own IP address", ["Their network cards cannot receive broadcasts", "The switch filters it out for them", "They already have the answer in their cache"], "Each device compares the Target IP with its own address and answers only if they match."),
  q(19, "medium", "ARP Cache", "Which best describes a static ARP cache entry?", "An entry configured manually that ARP replies do not replace", ["An entry learned from the last ARP reply", "An entry that always points to the router", "An entry that stores the broadcast MAC address"], "Static entries are set by hand; learned (dynamic) entries come from ARP traffic. Details vary between systems."),
  q(20, "medium", "Cache Hit/Miss", "Why is ARP not performed before every packet?", "The cache remembers mappings, which avoids repeated broadcasts", ["Broadcasts are not allowed on Ethernet", "Each packet carries the MAC in its data", "ARP only works once per device"], "Reusing cached mappings saves time and network traffic."),
  q(21, "medium", "Unknown IP", "PC-A sends an ARP request for an address that no device on the LAN has. What is the result?", "No reply arrives and the destination MAC remains unknown", ["The switch answers with its own MAC", "The router always replies", "PC-A learns the broadcast MAC for it"], "Nobody owns the address, so nobody replies."),
  q(22, "medium", "Local Destination", "PC-A is 192.168.1.10/24. Which destination is local?", "192.168.1.77", ["192.168.2.77", "10.0.0.77", "172.16.1.77"], "192.168.1.77 is inside 192.168.1.0/24, so PC-A resolves the destination's own MAC."),
  q(23, "medium", "Remote Destination", "PC-A is 192.168.1.10/24. Which destination is remote?", "192.168.2.20", ["192.168.1.20", "192.168.1.200", "192.168.1.99"], "192.168.2.20 is outside 192.168.1.0/24."),
  q(24, "hard", "Default Gateway", "PC-A (192.168.1.10/24, gateway 192.168.1.1) sends to 192.168.2.20. Which address does PC-A's ARP request ask about?", "192.168.1.1", ["192.168.2.20", "192.168.2.1", "255.255.255.255"], "For remote destinations PC-A resolves its default gateway."),
  q(25, "hard", "Default Gateway", "For that same communication, what are the destination MAC and destination IP of the frame leaving PC-A?", "The router's MAC and 192.168.2.20", ["The remote host's MAC and 192.168.2.20", "The router's MAC and 192.168.1.1", "The broadcast MAC and 192.168.2.20"], "The frame is addressed to the next hop, but the IP packet keeps the final destination."),
  q(26, "hard", "Default Gateway", "What does ARP resolve when the destination is on another network?", "The MAC address of the next device on the local link: the gateway", ["The MAC address of the remote host", "The IP address of the remote host", "The MAC address of the remote network's router"], "ARP resolves the next local-link destination, not the final host's MAC address."),
  q(27, "hard", "MAC/IP Relationship", "A cache entry says 192.168.1.20 is at PC-C's MAC, but PC-B owns that address. What most likely happens to data sent to 192.168.1.20?", "PC-C's network card accepts the frame, but its IP layer discards the packet", ["PC-B receives it anyway", "The switch corrects the entry", "The frame is sent to the broadcast address instead"], "The MAC matches PC-C, but the packet's destination IP is not PC-C's, so it is discarded and PC-B never sees it."),
  q(28, "hard", "ARP Message Fields", "Which ARP fields let the protocol describe address types other than IPv4 over Ethernet?", "Hardware Type and Protocol Type", ["Sender MAC and Target MAC", "Operation and Target IP", "The Ethernet FCS"], "They identify the kind of link-layer and network-layer addresses in the message."),
  q(29, "hard", "ARP Purpose", "Which statement about ARP and IPv6 is correct?", "ARP is used with IPv4; IPv6 uses Neighbor Discovery", ["IPv6 uses ARP with longer addresses", "ARP is used for both, identically", "IPv6 does not need to resolve addresses"], "ARP is an IPv4 mechanism, and IPv6 uses a different one."),
  q(30, "hard", "Default Gateway", "PC-A (192.168.1.10/24) sends to 192.168.1.1, its own default gateway, for the first time. Is this a local or a remote destination?", "Local: the gateway is on PC-A's own network, so PC-A ARPs for it directly", ["Remote: it needs another gateway first", "Remote: gateways are never resolved with ARP", "Neither: a gateway needs no MAC address"], "192.168.1.1 is inside 192.168.1.0/24, so it is a local destination and its MAC is resolved with a normal ARP request."),
];

export const informationTechnologyArpSimulatorQuiz: QuizMeta = {
  id: "it-arp-simulator",
  title: "ARP Simulator Quiz",
  subjectSlug: "information-technology",
  subjectLabel: "Information Technology",
  topicLabel: "ARP Simulator",
  colorToken: "it",
  backHref: "/dashboard/information-technology/arp-simulator",
  description: "Test your understanding of ARP: its purpose, requests and replies, broadcast and unicast delivery, the ARP cache, cache hits and misses, local and remote destinations, the default gateway, and the fields of an ARP message.",
  difficulty: "medium",
  estimatedTime: 25,
  questions,
};

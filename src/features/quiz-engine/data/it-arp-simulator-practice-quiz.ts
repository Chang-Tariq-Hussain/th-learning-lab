import type { QuizDifficulty, QuizMeta, QuizQuestion } from "../types";

/** Builds one question and slots the correct answer at a rotating position so it is not always first. */
function q(n: number, difficulty: QuizDifficulty, concept: string, question: string, correct: string, wrong: [string, string, string], explanation: string, hints: string[]): QuizQuestion {
  const options = [...wrong];
  options.splice(n % 4, 0, correct);
  return {
    id: `it-arp-practice-${String(n).padStart(3, "0")}`,
    type: "multiple-choice",
    question,
    options,
    correctAnswer: correct,
    explanation,
    difficulty,
    subject: "information-technology",
    topic: "arp-simulator",
    concept,
    hints,
  };
}

const questions: QuizQuestion[] = [
  q(1, "easy", "MAC/IP Relationship", "Which statement describes what ARP links together?", "An IPv4 address and the MAC address of the interface that has it", ["A MAC address and a domain name", "An IPv4 address and a switch port only", "A MAC address and a subnet mask"], "ARP records IPv4 address → MAC address pairs.", ["Open Resolve an Address, choose the matching scenario, and step through it."]),
  q(2, "easy", "ARP Request", "What does an ARP request essentially ask?", "Who has this IPv4 address?", ["What is your default gateway?", "Which port are you plugged into?", "How fast is your link?"], "An ARP request asks which device owns a given IPv4 address and tells that device where to answer.", ["Open Resolve an Address, choose the matching scenario, and step through it."]),
  q(3, "easy", "Broadcast", "Which devices on the LAN receive an ARP request?", "All the other devices on the local network", ["Only the device that owns the IP address", "Only the router", "Only devices with an empty ARP cache"], "A broadcast frame is flooded by the switch to every port except the one it arrived on.", ["Open Resolve an Address, choose the matching scenario, and step through it."]),
  q(4, "easy", "ARP Reply", "Which device sends the ARP reply?", "The device that owns the requested IP address", ["The switch", "Every device on the LAN", "The default gateway, always"], "Only the owner of the target IP address answers.", ["Open Resolve an Address, choose the matching scenario, and step through it."]),
  q(5, "easy", "Unicast Reply", "How is an ARP reply normally sent?", "As a unicast frame to the device that asked", ["As a broadcast to everyone", "As a multicast to the router", "It is not sent in an Ethernet frame"], "The request contains the requester's MAC address, so the owner can answer directly.", ["Open Resolve an Address, choose the matching scenario, and step through it."]),
  q(6, "easy", "ARP Cache", "What is stored in an ARP cache?", "IPv4 address to MAC address mappings", ["Website names and IP addresses", "Copies of all frames received", "Passwords for the switch"], "The ARP cache is a table of learned IP → MAC mappings.", ["Open Resolve an Address, choose the matching scenario, and step through it."]),
  q(7, "easy", "Cache Hit/Miss", "A device finds the destination's IP address in its ARP cache. What is this called?", "A cache hit", ["A cache miss", "A broadcast storm", "An ARP request"], "Finding the entry is a cache hit, and no ARP request is needed.", ["Open Resolve an Address, choose the matching scenario, and step through it."]),
  q(8, "easy", "Cache Hit/Miss", "What happens on a cache miss?", "The device sends an ARP request", ["The device drops the data", "The device uses the broadcast MAC for the data", "The device asks a DNS server"], "Without the MAC address the device must ask the network with an ARP request.", ["Open Resolve an Address, choose the matching scenario, and step through it."]),
  q(9, "easy", "ARP Message Fields", "Which field of an ARP message says whether it is a request or a reply?", "Operation", ["Hardware Type", "Protocol Type", "Target MAC"], "The Operation field is 1 for a request and 2 for a reply.", ["Open Resolve an Address, choose the matching scenario, and step through it."]),
  q(10, "medium", "ARP Reply", "In a reply from PC-B (192.168.1.20) to PC-A, what are the Sender IP and Sender MAC?", "PC-B's IP address and PC-B's MAC address", ["PC-A's IP address and PC-A's MAC address", "PC-B's IP address and the broadcast MAC", "PC-A's IP address and PC-B's MAC address"], "The reply's sender is the owner of the address, and its sender fields are the answer.", ["Open Resolve an Address, choose the matching scenario, and step through it."]),
  q(11, "medium", "ARP Cache", "Which best describes a static ARP cache entry?", "An entry configured manually that ARP replies do not replace", ["An entry learned from the last ARP reply", "An entry that always points to the router", "An entry that stores the broadcast MAC address"], "Static entries are set by hand; learned (dynamic) entries come from ARP traffic. Details vary between systems.", ["Open Resolve an Address, choose the matching scenario, and step through it."]),
  q(12, "medium", "Cache Hit/Miss", "Why is ARP not performed before every packet?", "The cache remembers mappings, which avoids repeated broadcasts", ["Broadcasts are not allowed on Ethernet", "Each packet carries the MAC in its data", "ARP only works once per device"], "Reusing cached mappings saves time and network traffic.", ["Open Resolve an Address, choose the matching scenario, and step through it."]),
  q(13, "medium", "Local Destination", "PC-A is 192.168.1.10/24. Which destination is local?", "192.168.1.77", ["192.168.2.77", "10.0.0.77", "172.16.1.77"], "192.168.1.77 is inside 192.168.1.0/24, so PC-A resolves the destination's own MAC.", ["Open Resolve an Address, choose the matching scenario, and step through it."]),
  q(14, "hard", "Default Gateway", "PC-A (192.168.1.10/24, gateway 192.168.1.1) sends to 192.168.2.20. Which address does PC-A's ARP request ask about?", "192.168.1.1", ["192.168.2.20", "192.168.2.1", "255.255.255.255"], "For remote destinations PC-A resolves its default gateway.", ["Open Resolve an Address, choose the matching scenario, and step through it."]),
  q(15, "hard", "Default Gateway", "What does ARP resolve when the destination is on another network?", "The MAC address of the next device on the local link: the gateway", ["The MAC address of the remote host", "The IP address of the remote host", "The MAC address of the remote network's router"], "ARP resolves the next local-link destination, not the final host's MAC address.", ["Open Resolve an Address, choose the matching scenario, and step through it."]),
];

export const informationTechnologyArpSimulatorPracticeQuiz: QuizMeta = {
  id: "it-arp-simulator-practice",
  title: "ARP Simulator Practice",
  subjectSlug: "information-technology",
  subjectLabel: "Information Technology",
  topicLabel: "ARP Simulator",
  colorToken: "it",
  backHref: "/dashboard/information-technology/arp-simulator",
  description: "Short practice questions on ARP requests and replies, the ARP cache, and local versus remote destinations.",
  difficulty: "medium",
  estimatedTime: 12,
  questions,
};

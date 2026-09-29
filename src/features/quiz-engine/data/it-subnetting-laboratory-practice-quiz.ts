import type { QuizDifficulty, QuizMeta, QuizQuestion } from "../types";

/** Builds one question and slots the correct answer at a rotating position so it is not always first. */
function q(n: number, difficulty: QuizDifficulty, concept: string, question: string, correct: string, wrong: [string, string, string], explanation: string, hints: string[]): QuizQuestion {
  const options = [...wrong];
  options.splice(n % 4, 0, correct);
  return {
    id: `it-subnet-practice-${String(n).padStart(3, "0")}`,
    type: "multiple-choice",
    question,
    options,
    correctAnswer: correct,
    explanation,
    difficulty,
    subject: "information-technology",
    topic: "subnetting-laboratory",
    concept,
    hints,
  };
}

const questions: QuizQuestion[] = [
  q(1, "easy", "CIDR", "What does the /26 in 192.168.1.0/26 tell you?", "The first 26 bits are the network portion", ["There are 26 hosts in the subnet", "There are 26 subnets", "The last 26 bits are the network portion"], "A CIDR prefix counts the leading network bits. /26 means 26 network bits and 6 host bits.", ["Open Split a Network and move the new prefix: which bits change colour?"]),
  q(2, "easy", "Subnet Masks", "What is the subnet mask for /26?", "255.255.255.192", ["255.255.255.128", "255.255.255.224", "255.255.255.240"], "26 ones then 6 zeros: the last octet is 11000000 = 128 + 64 = 192.", ["Open Binary & Mask and type /26. Read the last octet in binary."]),
  q(3, "easy", "Borrowed Bits", "A network changes from 192.168.1.0/24 to /26. How many host bits were borrowed?", "2", ["1", "3", "26"], "Borrowed bits = new prefix − original prefix = 26 − 24 = 2.", ["Subtract the two prefix lengths."]),
  q(4, "easy", "Number of Subnets", "How many subnets do 3 borrowed bits create?", "8", ["3", "6", "9"], "Each borrowed bit doubles the count: 2³ = 8.", ["Three bits can form how many different patterns?"]),
  q(5, "easy", "Host Bits", "How many host bits does a /27 have?", "5", ["3", "8", "27"], "Host bits = 32 − prefix = 32 − 27 = 5.", ["An IPv4 address has 32 bits in total."]),
  q(6, "easy", "Addresses per Subnet", "How many addresses are in a /28 subnet?", "16", ["14", "32", "8"], "A /28 has 4 host bits: 2⁴ = 16 addresses (14 typical usable hosts).", ["First find the host bits, then raise 2 to that power."]),
  q(7, "medium", "Typical Usable Hosts", "How many typical usable hosts are in a /29?", "6", ["8", "4", "14"], "A /29 has 3 host bits: 2³ = 8 addresses. Subtract the network and broadcast addresses: 8 − 2 = 6.", ["Count the addresses first, then remove two."]),
  q(8, "medium", "Network Addresses", "192.168.1.0/24 is split into four /26 subnets. What is the network address of the second subnet?", "192.168.1.64", ["192.168.1.63", "192.168.1.65", "192.168.1.128"], "Each /26 has 64 addresses, so the second subnet starts 64 after the first: 192.168.1.64.", ["How many addresses does one /26 hold?"]),
  q(9, "medium", "Broadcast Addresses", "What is the broadcast address of 192.168.1.64/26?", "192.168.1.127", ["192.168.1.128", "192.168.1.126", "192.168.1.255"], "The subnet covers .64 to .127. The last address, with all host bits 1, is the broadcast address.", ["The broadcast address is the last address of the subnet."]),
  q(10, "medium", "Host Ranges", "What is the usable host range of 192.168.1.128/26?", "192.168.1.129 – 192.168.1.190", ["192.168.1.128 – 192.168.1.191", "192.168.1.129 – 192.168.1.191", "192.168.1.130 – 192.168.1.189"], "The subnet is .128 to .191. Skip the network address (.128) and the broadcast address (.191): hosts are .129 to .190.", ["First host = network + 1. Last host = broadcast − 1."]),
  q(11, "medium", "Identifying Subnets", "192.168.1.0/24 is split into /27 subnets. Which subnet contains 192.168.1.100?", "192.168.1.96/27", ["192.168.1.64/27", "192.168.1.128/27", "192.168.1.100/27"], "A /27 has 32 addresses, so subnets start at 0, 32, 64, 96, 128 ... 100 lies in the block 96–127.", ["Blocks of 32: 0, 32, 64, 96, ..."]),
  q(12, "medium", "Same or Different Subnet", "Are 192.168.1.20/26 and 192.168.1.50/26 on the same subnet?", "Yes, both are in 192.168.1.0/26", ["No, the last octets are different", "No, 20 is a network address", "Yes, but only if the mask is /24"], "Both addresses lie in .0–.63, so ANDing each with the /26 mask gives 192.168.1.0.", ["Which /26 block holds .20? Which holds .50?"]),
  q(13, "medium", "Choosing a Prefix", "Which new prefix divides a /24 into 8 equal subnets?", "/27", ["/25", "/26", "/28"], "8 = 2³, so borrow 3 bits: /24 + 3 = /27.", ["How many bits give 8 patterns?"]),
  q(14, "medium", "Hosts to Prefix", "You need at least 20 typical usable hosts per subnet. Which is the smallest subnet that fits?", "/27", ["/28", "/26", "/29"], "/28 has only 14 usable hosts. /27 has 2⁵ − 2 = 30, which fits 20.", ["Try host bits until 2^H − 2 reaches 20."]),
  q(15, "hard", "Same or Different Subnet", "Are 192.168.1.62/26 and 192.168.1.65/26 on the same subnet?", "No, they sit on opposite sides of the boundary at .64", ["Yes, they are only 3 apart", "Yes, they share the first three octets", "No, because 65 is a broadcast address"], ".62 is in 192.168.1.0/26 (.0–.63) and .65 is in 192.168.1.64/26 (.64–.127). Closeness in number does not decide subnet membership.", ["Write down the boundaries of the first two /26 blocks."]),
];

export const informationTechnologySubnettingLaboratoryPracticeQuiz: QuizMeta = {
  id: "it-subnetting-laboratory-practice",
  title: "Subnetting Laboratory Practice",
  subjectSlug: "information-technology",
  subjectLabel: "Information Technology",
  topicLabel: "Subnetting Laboratory",
  colorToken: "it",
  backHref: "/dashboard/information-technology/subnetting-laboratory",
  description: "Practice borrowing bits, CIDR prefixes, subnet masks, subnet counts, host capacity, network and broadcast addresses, host ranges, and same or different subnet checks.",
  difficulty: "easy",
  estimatedTime: 14,
  questions,
};

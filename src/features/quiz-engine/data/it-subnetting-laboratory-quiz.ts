import type { QuizDifficulty, QuizMeta, QuizQuestion } from "../types";

/** Builds one question and slots the correct answer at a rotating position so it is not always first. */
function q(n: number, difficulty: QuizDifficulty, concept: string, question: string, correct: string, wrong: [string, string, string], explanation: string): QuizQuestion {
  const options = [...wrong];
  options.splice(n % 4, 0, correct);
  return {
    id: `it-subnet-quiz-${String(n).padStart(3, "0")}`,
    type: "multiple-choice",
    question,
    options,
    correctAnswer: correct,
    explanation,
    difficulty,
    subject: "information-technology",
    topic: "subnetting-laboratory",
    concept,
  };
}

const questions: QuizQuestion[] = [
  // ---- Easy -------------------------------------------------------------
  q(1, "easy", "CIDR", "In 10.0.0.0/20, what does the 20 represent?", "The number of leading network bits", ["The number of hosts", "The number of subnets", "The number of octets in the network"], "A CIDR prefix length counts the bits, from the left, that belong to the network portion."),
  q(2, "easy", "Subnet Masks", "Which subnet mask matches /25?", "255.255.255.128", ["255.255.255.192", "255.255.255.0", "255.255.128.0"], "25 ones then 7 zeros: the last octet is 10000000 = 128."),
  q(3, "easy", "Subnet Masks", "Which prefix is written as 255.255.255.240?", "/28", ["/26", "/27", "/29"], "240 = 11110000, which has 4 ones in the last octet: 24 + 4 = 28."),
  q(4, "easy", "Borrowed Bits", "Splitting a /24 into /27 subnets borrows how many bits?", "3", ["2", "4", "5"], "Borrowed bits = new prefix − original prefix = 27 − 24 = 3."),
  q(5, "easy", "Number of Subnets", "Borrowing 4 host bits creates how many subnets?", "16", ["4", "8", "32"], "Each borrowed bit doubles the number of subnets: 2⁴ = 16."),
  q(6, "easy", "Host Bits", "How many host bits does a /30 have?", "2", ["30", "4", "6"], "Host bits = 32 − 30 = 2."),
  q(7, "easy", "Addresses per Subnet", "How many addresses are in a /26 subnet?", "64", ["62", "32", "128"], "A /26 has 6 host bits, so 2⁶ = 64 addresses."),
  q(8, "easy", "Typical Usable Hosts", "How many typical usable hosts does a /26 subnet have?", "62", ["64", "60", "126"], "64 addresses minus the network and broadcast addresses = 62."),
  q(9, "easy", "Network Addresses", "In an ordinary subnet, which address has every host bit set to 0?", "The network address", ["The broadcast address", "The first usable host", "The last usable host"], "All host bits 0 names the network itself. All host bits 1 is the broadcast address."),
  q(10, "easy", "Borrowed Bits", "What does borrowing host bits do?", "It turns host bits into network bits, creating more and smaller subnets", ["It adds more host bits and fewer subnets", "It changes the IP address of every device", "It removes the network and broadcast addresses"], "Extra network bits mean more possible network identifiers (more subnets) and fewer host bits (smaller subnets)."),

  // ---- Medium -----------------------------------------------------------
  q(11, "medium", "Choosing a Prefix", "Which new prefix divides a /24 into 4 equal subnets?", "/26", ["/25", "/27", "/28"], "4 = 2², so borrow 2 bits: 24 + 2 = /26."),
  q(12, "medium", "Number of Subnets", "What is the smallest number of borrowed bits that gives at least 6 subnets?", "3", ["2", "4", "6"], "2² = 4 is too few; 2³ = 8 is the first power of two that reaches 6."),
  q(13, "medium", "Addresses per Subnet", "192.168.1.0/24 is divided into 16 equal subnets. How many addresses does each subnet have?", "16", ["14", "32", "8"], "16 subnets need 4 borrowed bits, giving /28. A /28 has 4 host bits: 2⁴ = 16 addresses."),
  q(14, "medium", "Choosing a Prefix", "Which prefix divides 172.16.0.0/16 into 16 equal subnets?", "/20", ["/24", "/18", "/19"], "16 = 2⁴, so borrow 4 bits: 16 + 4 = /20."),
  q(15, "medium", "Broadcast Addresses", "What is the broadcast address of 192.168.1.128/27?", "192.168.1.159", ["192.168.1.160", "192.168.1.158", "192.168.1.191"], "A /27 has 32 addresses: .128 to .159. The last one is the broadcast address."),
  q(16, "medium", "Network Addresses", "192.168.1.0/24 is split into /28 subnets. What is the network address of the fourth subnet?", "192.168.1.48", ["192.168.1.64", "192.168.1.32", "192.168.1.49"], "Each /28 has 16 addresses: subnets start at .0, .16, .32, .48. The fourth begins at .48."),
  q(17, "medium", "Host Ranges", "What is the first usable host address of 192.168.1.32/27?", "192.168.1.33", ["192.168.1.32", "192.168.1.34", "192.168.1.31"], "The network address is .32, so the first usable host is .33."),
  q(18, "medium", "Host Ranges", "What is the last usable host address of 10.0.0.64/26?", "10.0.0.126", ["10.0.0.127", "10.0.0.125", "10.0.0.128"], "The subnet is .64 to .127. The broadcast address is .127, so the last host is .126."),
  q(19, "medium", "Identifying Subnets", "192.168.1.0/24 is divided into four /26 subnets. Which subnet contains 192.168.1.200?", "192.168.1.192/26", ["192.168.1.128/26", "192.168.1.64/26", "192.168.1.200/26"], "The /26 subnets begin at .0, .64, .128 and .192. The address .200 lies in .192–.255."),
  q(20, "medium", "Hosts to Prefix", "Each subnet must hold at least 100 typical usable hosts. Which is the smallest fitting subnet?", "/25", ["/26", "/27", "/28"], "/26 has only 62 usable hosts. /25 has 2⁷ − 2 = 126, which fits."),
  q(21, "medium", "Broadcast Addresses", "Why can 192.168.1.63 not be given to a device in 192.168.1.0/26?", "It is the broadcast address, with all host bits set to 1", ["It is the network address", "It is outside the subnet", "It is reserved for the router"], "The subnet covers .0–.63. The last address in an ordinary subnet is its broadcast address."),
  q(22, "medium", "Typical Usable Hosts", "With H host bits, how many typical usable hosts does an ordinary subnet have?", "2^H − 2", ["2^H", "2^H − 1", "H² − 2"], "There are 2^H addresses; the network and broadcast addresses are not given to devices."),
  q(23, "medium", "Same or Different Subnet", "Are 192.168.1.70/26 and 192.168.1.100/26 on the same subnet?", "Yes, both are in 192.168.1.64/26", ["No, the last octets differ", "No, 100 is a broadcast address", "Yes, because both are private addresses"], "The block .64–.127 contains both addresses. ANDing each with the /26 mask gives 192.168.1.64."),

  // ---- Hard -------------------------------------------------------------
  q(24, "hard", "Number of Subnets", "192.168.1.0/24 is divided into /29 subnets. How many subnets result, and how many typical usable hosts does each have?", "32 subnets, 6 usable hosts each", ["29 subnets, 8 usable hosts each", "8 subnets, 30 usable hosts each", "32 subnets, 8 usable hosts each"], "Borrowed bits = 5, so 2⁵ = 32 subnets. Host bits = 3, so 8 addresses and 8 − 2 = 6 usable hosts."),
  q(25, "hard", "Subnet Masks", "Which mask results from borrowing 3 bits from a /24 network?", "255.255.255.224", ["255.255.255.192", "255.255.255.240", "255.255.255.248"], "24 + 3 = /27. The last octet is 11100000 = 128 + 64 + 32 = 224."),
  q(26, "hard", "Broadcast Addresses", "What is the broadcast address of 172.16.32.0/20?", "172.16.47.255", ["172.16.32.255", "172.16.48.0", "172.16.63.255"], "A /20 has 12 host bits, so the third octet holds blocks of 16: 32–47. The broadcast address sets all host bits to 1: 172.16.47.255."),
  q(27, "hard", "Number of Subnets", "10.0.0.0/16 is divided into /19 subnets. How many subnets are there, and what is the network address of the second?", "8 subnets; 10.0.32.0", ["8 subnets; 10.0.8.0", "19 subnets; 10.0.19.0", "3 subnets; 10.0.32.0"], "Borrowed bits = 3, so 8 subnets. Each has 2¹³ = 8192 addresses, which is 32 steps of 256, so the third octet grows by 32: 10.0.0.0, 10.0.32.0, ..."),
  q(28, "hard", "Same or Different Subnet", "192.168.1.62/26 and 192.168.1.65/26 are only three addresses apart. Are they on the same subnet?", "No, they are on opposite sides of the boundary at .64", ["Yes, they are numerically close", "Yes, they share the first three octets", "No, because .65 is a network address"], ".62 is in 192.168.1.0/26 (.0–.63) and .65 is in 192.168.1.64/26 (.64–.127)."),
  q(29, "hard", "Subnet Identification", "Why do /26 subnets start at multiples of 64 in the last octet?", "Each /26 holds 64 addresses, so the next subnet begins 64 after the previous one", ["Because 26 is close to 64", "Because the mask is 255.255.255.64", "Because the first host must always be .64"], "A /26 has 6 host bits: 2⁶ = 64 addresses. Consecutive subnets are placed one block after another."),
  q(30, "hard", "Special Cases", "Which statement about /31 and /32 is correct?", "They are special cases where the usual 2^H − 2 rule does not apply", ["They are the most common sizes for office LANs", "A /31 has no usable addresses at all", "A /32 has a network address and a broadcast address"], "A /31 has two addresses that can both be used on a point-to-point link, and a /32 names one address. Neither follows the ordinary network + broadcast pattern."),
];

export const informationTechnologySubnettingLaboratoryQuiz: QuizMeta = {
  id: "it-subnetting-laboratory",
  title: "Subnetting Laboratory Quiz",
  subjectSlug: "information-technology",
  subjectLabel: "Information Technology",
  topicLabel: "Subnetting Laboratory",
  colorToken: "it",
  backHref: "/dashboard/information-technology/subnetting-laboratory",
  description: "Test your understanding of CIDR prefixes, subnet masks, borrowed bits, the number of subnets, host bits, addresses per subnet, network and broadcast addresses, host ranges, and subnet identification.",
  difficulty: "medium",
  estimatedTime: 25,
  questions,
};

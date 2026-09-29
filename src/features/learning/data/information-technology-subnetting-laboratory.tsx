import type { TopicContent } from "../types";

/** Interactive scenario ids — must match `SUBNET_CHALLENGE_IDS` in the simulation's `challenges.ts`. */
const CH_TWO = "subnetting-challenge-two-subnets";
const CH_FOUR = "subnetting-challenge-four-subnets";
const CH_EIGHT = "subnetting-challenge-eight-subnets";
const CH_HOSTS = "subnetting-challenge-host-requirement";
const CH_DEPTS = "subnetting-challenge-four-departments";
const CH_DIAGNOSE = "subnetting-challenge-diagnose";

export const informationTechnologySubnettingLaboratoryContent: TopicContent = {
  subjectSlug: "information-technology",
  topicSlug: "subnetting-laboratory",
  title: "Subnetting Laboratory",
  subjectLabel: "Information Technology",
  topicLabel: "Subnetting Laboratory",
  colorToken: "it",
  simulationHref: "/dashboard/information-technology/subnetting-laboratory",

  learn: {
    objectives: [
      "Explain that subnetting divides one IPv4 network into smaller networks by borrowing host bits",
      "Calculate borrowed bits, the number of subnets, host bits, addresses per subnet, and typical usable hosts",
      "Find each subnet's network address, broadcast address, and host range",
      "Choose a prefix from a required number of subnets or a required number of hosts",
      "Decide whether two addresses are on the same subnet",
    ],
    whyItMatters:
      "Organizations rarely want one huge network. Separate subnets keep departments apart, limit how far broadcasts travel, and make addressing easier to plan. Understanding how and why the prefix divides an address space is the foundation for the next topics in this branch: ARP, DHCP, and routing.",
    concepts: [
      {
        term: "Subnetting",
        explanation:
          "Dividing one IP network into several smaller networks called subnets. Every subnet has its own network address, its own broadcast address, and its own range of host addresses. In this lab all subnets are the same size (equal-size subnetting).",
      },
      {
        term: "Borrowing host bits",
        explanation:
          "A longer prefix turns some host bits into network bits. Going from /24 to /26 borrows 2 bits: the network portion grows from 24 to 26 bits, and the host portion shrinks from 8 to 6 bits. Borrowed bits = new prefix − original prefix.",
      },
      {
        term: "Number of subnets",
        explanation:
          "b borrowed bits can form 2^b different patterns, and each pattern identifies one subnet. Borrowing 2 bits gives 2² = 4 subnets: 00, 01, 10 and 11.",
      },
      {
        term: "Addresses and usable hosts",
        explanation:
          "With H host bits a subnet has 2^H addresses. In an ordinary subnet the first address (network) and last address (broadcast) are not given to devices, so the typical usable hosts are 2^H − 2. For /26: H = 6, 2⁶ = 64 addresses, 62 typical usable hosts.",
      },
      {
        term: "Subnet size and boundaries",
        explanation:
          "Each subnet is 2^H addresses long, and subnets sit one after another. With /26 the subnets start every 64 addresses: .0, .64, .128, .192. Two addresses are on the same subnet when they fall in the same block, which is when address AND mask gives the same network address.",
      },
      {
        term: "Prefix to mask",
        explanation:
          "A prefix of n means n ones followed by 32 − n zeros. /26 is 11111111.11111111.11111111.11000000, which is 255.255.255.192, because 128 + 64 = 192.",
      },
      {
        term: "Working from requirements",
        explanation:
          "For a number of subnets, find the smallest b with 2^b ≥ subnets, and add b to the original prefix. For a number of hosts, find the smallest H with 2^H − 2 ≥ hosts, and the prefix is 32 − H.",
      },
      {
        term: "Special cases: /31 and /32",
        explanation:
          "The 2^H − 2 rule is for ordinary subnets. A /31 has two addresses that can both be used on a point-to-point link, and a /32 names one single address. They are not used for equal-size LAN subnetting.",
      },
    ],
    keyTerms: [
      { term: "Subnet", definition: "A smaller network created by dividing a larger IP network." },
      { term: "Borrowed bits", definition: "Host bits that become network bits when the prefix gets longer." },
      { term: "Host bits", definition: "The bits after the prefix. They identify a device inside the subnet." },
      { term: "Network address", definition: "The first address of a subnet, with all host bits 0." },
      { term: "Broadcast address", definition: "The last address of a subnet, with all host bits 1." },
      { term: "Typical usable hosts", definition: "2^H − 2 for an ordinary subnet: all addresses except network and broadcast." },
      { term: "Equal-size subnetting", definition: "Dividing a network into subnets that all have the same prefix and size." },
    ],
    visualAids: [],
    misconceptions: [
      {
        id: "more-subnets-more-hosts",
        misconception: "Creating more subnets gives each subnet more hosts.",
        correction: "The total number of addresses is fixed. More subnets means each subnet is smaller: 2 subnets of 128, 4 of 64, 8 of 32.",
      },
      {
        id: "usable-equals-total",
        misconception: "A /26 has 64 devices' worth of addresses.",
        correction: "A /26 has 64 addresses, but the network and broadcast addresses are not given to devices, so the typical usable count is 62.",
      },
      {
        id: "close-means-same",
        misconception: "Addresses that are numerically close are on the same subnet.",
        correction: "The boundary decides. With /26, .62 and .65 are three apart but on different subnets, split at .64.",
      },
      {
        id: "class-decides",
        misconception: "The address class (A, B, C) decides how to subnet.",
        correction: "Classful addressing is historical. Today the prefix length you choose (CIDR) decides the boundary, whatever the first number is.",
      },
      {
        id: "subnet-start-anywhere",
        misconception: "A subnet can start at any address.",
        correction: "A subnet starts at a multiple of its size within the original network, because its network address must have all host bits 0.",
      },
    ],
  },

  predict: {
    intro: "Commit to a prediction for each, then check yourself in the lab.",
    scenarios: [
      {
        id: "predict-subnet-count",
        scenario: "You change 192.168.1.0/24 to /26.",
        question: "How many equal subnets do you get?",
        options: [
          { id: "a", label: "2" },
          { id: "b", label: "4" },
          { id: "c", label: "26" },
        ],
        actualResultOptionId: "b",
        explanation: "/26 borrows 26 − 24 = 2 bits, and 2² = 4 subnets.",
        hint: "How many bits are borrowed, and how many patterns do they make?",
      },
      {
        id: "predict-subnet-size",
        scenario: "192.168.1.0/24 is split into 8 equal subnets.",
        question: "How many addresses are in each subnet?",
        options: [
          { id: "a", label: "8" },
          { id: "b", label: "30" },
          { id: "c", label: "32" },
        ],
        actualResultOptionId: "c",
        explanation: "The /24 has 256 addresses. 256 ÷ 8 = 32 (a /27). The typical usable hosts would be 30.",
        hint: "Share 256 addresses equally between 8 subnets.",
      },
      {
        id: "predict-second-subnet",
        scenario: "192.168.1.0/24 is split into four /26 subnets.",
        question: "What is the network address of the second subnet?",
        options: [
          { id: "a", label: "192.168.1.26" },
          { id: "b", label: "192.168.1.64" },
          { id: "c", label: "192.168.1.128" },
        ],
        actualResultOptionId: "b",
        explanation: "Each /26 holds 64 addresses, so the second subnet starts 64 after the first.",
        hint: "How long is the first subnet?",
      },
      {
        id: "predict-same-subnet",
        scenario: "Device A is 192.168.1.20/26 and Device B is 192.168.1.80/26.",
        question: "Are they on the same subnet?",
        options: [
          { id: "a", label: "Yes" },
          { id: "b", label: "No" },
        ],
        actualResultOptionId: "b",
        explanation: ".20 is in 192.168.1.0/26 (.0–.63) and .80 is in 192.168.1.64/26 (.64–.127).",
        hint: "Where is the first /26 boundary?",
      },
    ],
  },

  explore: {
    howToUse: [
      "Start on Split a Network: keep 192.168.1.0/24 and move the new prefix from /25 up to /30. Watch the borrowed bits, the subnet map, and the numbers change.",
      "Open Binary & Mask: turn Show Binary on and off, find the amber borrowed bits, and type a mask like 255.255.255.192.",
      "Open Subnet Table & Map and click a subnet to see its network address, hosts, broadcast, and binary boundary.",
      "Use the Calculator with a different starting network, such as 10.0.0.0/16, to see the same rules on a bigger network.",
      "Try How Many Subnets?, How Many Hosts? and Requirements. Use hints before asking for a solution.",
      "Finish in the Allocation Lab and Same or Different? to see how the boundary decides which subnet an address belongs to.",
    ],
    tryThis: [
      "Split 192.168.1.0/24 into /25, /26 and /27 and note how the subnet size changes each time.",
      "Find the two borrowed bits for /26 and read the four patterns 00, 01, 10, 11.",
      "Type 255.255.255.224 into the mask box and see which prefix it is.",
      "Compare .62 and .65 with /26, then .20 and .50.",
      "Change the starting network to 10.0.0.0/16 and divide it into 16 subnets.",
    ],
  },

  explain: {
    questions: [
      {
        id: "explain-more-subnets-smaller",
        question: "Why does creating more subnets make each subnet smaller?",
        answer:
          "The original network has a fixed number of addresses. Each borrowed bit takes one bit away from the host portion, which halves the addresses in each subnet while doubling how many subnets there are. 4 subnets of 64 use the same 256 addresses as 2 subnets of 128.",
      },
      {
        id: "explain-power-of-two",
        question: "Why is the number of subnets always a power of two?",
        answer:
          "Subnets are identified by the borrowed bits, and b bits can form exactly 2^b patterns. So equal-size subnetting gives 1, 2, 4, 8, 16 ... subnets. If you need 5 subnets you must borrow enough bits for 8 and have some left unused.",
      },
      {
        id: "explain-minus-two",
        question: "Why do we subtract 2 from the address count of an ordinary subnet?",
        answer:
          "The first address (all host bits 0) names the subnet and the last address (all host bits 1) is its broadcast address. Neither is given to a single device, so 2^H − 2 are typically usable. /31 and /32 are special cases.",
      },
      {
        id: "explain-start-multiples",
        question: "Why do subnets begin at multiples of their size?",
        answer:
          "A subnet's network address has all its host bits set to 0. In the last octet that means it must be a multiple of the subnet size, for example 0, 64, 128, 192 for /26.",
      },
    ],
  },

  practice: { quizId: "it-subnetting-laboratory-practice" },

  challenge: {
    intro: "Build the answer in the lab. Some challenges check the plan you create, not just a typed number.",
    scenarios: [
      {
        id: CH_TWO,
        title: "Divide a /24 into 2 equal subnets",
        scenario: "You have 192.168.1.0/24 and need two equal-size networks.",
        objective: "Choose the new prefix that creates exactly 2 equal subnets.",
        answer: { mode: "interactive", instructions: "Set the new prefix, then check.", verifyLabel: "Check my plan" },
        hints: ["How many bits give 2 patterns?", "2¹ = 2. Add that one bit to /24."],
        explanation: "Borrow 1 bit: /25. Two subnets, 192.168.1.0/25 and 192.168.1.128/25, with 128 addresses each.",
      },
      {
        id: CH_FOUR,
        title: "Divide a /24 into 4 equal subnets",
        scenario: "You have 192.168.1.0/24 and need four equal-size networks.",
        objective: "Choose the new prefix that creates exactly 4 equal subnets.",
        answer: { mode: "interactive", instructions: "Set the new prefix, then check.", verifyLabel: "Check my plan" },
        hints: ["How many bits give 4 patterns?", "2² = 4. Add 2 to /24."],
        explanation: "Borrow 2 bits: /26. Four subnets of 64 addresses: .0, .64, .128, .192.",
      },
      {
        id: CH_EIGHT,
        title: "Divide a /24 into 8 equal subnets",
        scenario: "You have 192.168.1.0/24 and need eight equal-size networks.",
        objective: "Choose the new prefix that creates exactly 8 equal subnets.",
        answer: { mode: "interactive", instructions: "Set the new prefix, then check.", verifyLabel: "Check my plan" },
        hints: ["How many bits give 8 patterns?", "2³ = 8. Add 3 to /24."],
        explanation: "Borrow 3 bits: /27. Eight subnets of 32 addresses, each with 30 typical usable hosts.",
      },
      {
        id: "subnetting-challenge-find-subnet",
        title: "Find the subnet containing an IP",
        scenario: "192.168.1.0/24 has been divided into eight /27 subnets. A device has the address 192.168.1.150.",
        objective: "Which subnet contains 192.168.1.150?",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "192.168.1.128/27" },
            { id: "b", label: "192.168.1.96/27" },
            { id: "c", label: "192.168.1.150/27" },
            { id: "d", label: "192.168.1.160/27" },
          ],
          correctOptionId: "a",
        },
        hints: ["A /27 has 32 addresses, so subnets start at 0, 32, 64, 96, 128, 160, ...", "Which block of 32 contains 150?"],
        explanation: "The block 128–159 contains 150. Its network address is 192.168.1.128 and its broadcast address is 192.168.1.159.",
        requiresExperiment: true,
      },
      {
        id: CH_HOSTS,
        title: "Select a prefix for a host requirement",
        scenario: "You have 192.168.20.0/24. Every subnet must support at least 50 typical usable hosts, and you want as many subnets as possible.",
        objective: "Choose the new prefix that meets the requirement without being larger than necessary.",
        answer: { mode: "interactive", instructions: "Set the new prefix, then check.", verifyLabel: "Check my plan" },
        hints: ["Find H so that 2^H − 2 is at least 50.", "H = 5 gives 30, which is too few. Try H = 6."],
        explanation: "H = 6 gives 2⁶ − 2 = 62 usable hosts, so the prefix is 32 − 6 = /26. /27 would give only 30.",
      },
      {
        id: CH_DEPTS,
        title: "Design four department subnets",
        scenario: "One /24 must serve four departments that need 50, 45, 30 and 55 hosts.",
        objective: "Choose the prefix that gives at least four equal subnets big enough for the largest department, then give each department its own subnet.",
        answer: { mode: "interactive", instructions: "Set the new prefix, assign each department, then check.", verifyLabel: "Check my design" },
        hints: ["The biggest department needs 55 hosts. Which prefix has at least 55 typical usable hosts?", "You also need at least four subnets. Does the same prefix give that?"],
        explanation: "/26 gives 4 subnets with 62 usable hosts each, which covers the biggest department (55). With equal-size subnetting every department gets the same size, even the smaller ones.",
      },
      {
        id: CH_DIAGNOSE,
        title: "Diagnose incorrectly assigned addresses",
        scenario: "192.168.1.0/24 was split into four /26 subnets, one per department. Six devices were given addresses, and some are wrong.",
        objective: "Tick every device whose address is a mistake: in the wrong subnet, or a network or broadcast address.",
        answer: { mode: "interactive", instructions: "Tick the wrong devices, then check.", verifyLabel: "Check my diagnosis" },
        hints: ["List the four subnet ranges first: .0–.63, .64–.127, .128–.191, .192–.255.", "Then check each address: right subnet? Not the first or last address of it?"],
        explanation: "The Sales Printer (.70) is in Department B's subnet. The Engineering Server (.127) is the broadcast address of its subnet. The Guest Tablet (.150) is in Department C's subnet, not Department D's.",
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "information-technology",
      topicSlug: "ip-addressing-simulator",
      label: "IP Addressing Simulator",
      reason: "Subnetting builds on network and host portions, subnet masks, and network and broadcast addresses.",
      href: "/dashboard/information-technology/ip-addressing-simulator",
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "ethernet-mac-simulator",
      label: "Ethernet & MAC Address Simulator",
      reason: "A broadcast reaches every device on a local network; subnets limit how far it goes.",
      href: "/dashboard/information-technology/ethernet-mac-simulator",
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "binary-data-representation",
      label: "Binary Data Representation",
      reason: "Subnetting relies on reading and counting bits.",
      href: "/dashboard/information-technology/binary-data-representation",
    },
  ],
};

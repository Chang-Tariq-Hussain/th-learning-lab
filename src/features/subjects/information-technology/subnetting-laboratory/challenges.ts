/**
 * Ids of the *interactive* Challenge scenarios for the Subnetting Laboratory. They must match
 * `challenge.scenarios` in the Learning content. (The "find the subnet containing an IP" challenge is
 * multiple choice and needs no id here.)
 */
export const SUBNET_CHALLENGE_IDS = {
  two: "subnetting-challenge-two-subnets",
  four: "subnetting-challenge-four-subnets",
  eight: "subnetting-challenge-eight-subnets",
  hosts: "subnetting-challenge-host-requirement",
  departments: "subnetting-challenge-four-departments",
  diagnose: "subnetting-challenge-diagnose",
} as const;

export type SubnetChallengeId = (typeof SUBNET_CHALLENGE_IDS)[keyof typeof SUBNET_CHALLENGE_IDS];

export interface PrefixTask {
  network: string;
  orig: number;
  instructions: string;
  focus: string;
  expected: number;
}

/** Tasks solved by choosing the right new prefix. */
export const PREFIX_TASKS: Partial<Record<SubnetChallengeId, PrefixTask>> = {
  [SUBNET_CHALLENGE_IDS.two]: {
    network: "192.168.1.0",
    orig: 24,
    instructions: "Divide 192.168.1.0/24 into 2 equal subnets.",
    focus: "Choose the new prefix, then check the subnet map: you should see exactly 2 equal segments.",
    expected: 25,
  },
  [SUBNET_CHALLENGE_IDS.four]: {
    network: "192.168.1.0",
    orig: 24,
    instructions: "Divide 192.168.1.0/24 into 4 equal subnets.",
    focus: "How many bits do you have to borrow to name 4 subnets?",
    expected: 26,
  },
  [SUBNET_CHALLENGE_IDS.eight]: {
    network: "192.168.1.0",
    orig: 24,
    instructions: "Divide 192.168.1.0/24 into 8 equal subnets.",
    focus: "More subnets means more borrowed bits, and smaller subnets.",
    expected: 27,
  },
  [SUBNET_CHALLENGE_IDS.hosts]: {
    network: "192.168.20.0",
    orig: 24,
    instructions: "Each subnet must support at least 50 typical usable hosts. Choose the prefix that gives the most subnets while still fitting 50 hosts in each.",
    focus: "Compare the 'Typical usable hosts' of each prefix with 50. Pick the longest prefix that still has at least 50.",
    expected: 26,
  },
};

/** Departments for the design challenge, with the hosts each one needs. */
export const DEPARTMENT_NEEDS: { letter: "A" | "B" | "C" | "D"; name: string; hosts: number }[] = [
  { letter: "A", name: "Sales", hosts: 50 },
  { letter: "B", name: "Engineering", hosts: 45 },
  { letter: "C", name: "HR", hosts: 30 },
  { letter: "D", name: "Guest", hosts: 55 },
];

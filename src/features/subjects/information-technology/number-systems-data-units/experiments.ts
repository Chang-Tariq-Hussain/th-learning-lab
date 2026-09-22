import type { Level } from "./model";
import type { DecBinaryLabPreset } from "./components/dec-binary-lab";
import type { GroupingLabPreset } from "./components/grouping-lab";
import type { DataUnitsLabPreset } from "./components/data-units-lab";
import type { NetworkLabPreset } from "./components/network-lab";
import type { AddressesLabPreset } from "./components/addresses-lab";

export type TabId =
  | "bases"
  | "place-value"
  | "dec-binary"
  | "grouping"
  | "converter"
  | "bits-bytes"
  | "data-units"
  | "memory-storage"
  | "network"
  | "addresses"
  | "signed"
  | "practice"
  | "experiments";

export interface LabPreset {
  decBinary?: DecBinaryLabPreset;
  grouping?: GroupingLabPreset;
  dataUnits?: DataUnitsLabPreset;
  network?: NetworkLabPreset;
  addresses?: AddressesLabPreset;
}

export interface Experiment {
  id: string;
  title: string;
  level: Level;
  tab: TabId;
  goal: string;
  steps: string[];
  observe: string;
  check: { question: string; options: string[]; correct: number; explanation: string };
  preset: LabPreset;
}

export const EXPERIMENTS: Experiment[] = [
  {
    id: "exp-dec-to-bin",
    title: "Experiment 1 — Decimal to Binary",
    level: "beginner",
    tab: "dec-binary",
    goal: "Convert 37 to binary using repeated division, one step at a time.",
    steps: ["The lab opens on Decimal → Binary with 37 loaded.", "Press Step repeatedly (or Play) to reveal each division.", "Read the remainders from the bottom row upward to get the answer."],
    observe: "Each division's remainder becomes one bit; the last remainder computed is the most significant bit.",
    check: {
      question: "When reading off the final binary answer from the division steps, which remainder is the most significant (leftmost) bit?",
      options: ["The last remainder computed (from the final division)", "The first remainder computed", "It doesn't matter, any order works"],
      correct: 0,
      explanation: "Remainders are read from the bottom of the list (the last division) up to the top (the first division).",
    },
    preset: { decBinary: { sub: "toBinary", decimal: 37 } },
  },
  {
    id: "exp-bin-to-dec",
    title: "Experiment 2 — Binary to Decimal",
    level: "beginner",
    tab: "dec-binary",
    goal: "Toggle bits in a byte and watch the decimal result update instantly.",
    steps: ["The lab opens on Binary → Decimal with a starting byte.", "Toggle the leftmost bit off, then on again, and watch the decimal value jump by its place value.", "Try turning on every bit — the value should reach 255."],
    observe: "Each bit's place value (128, 64, 32 … 1) is added to the total exactly when that bit is 1.",
    check: {
      question: "Toggling the leftmost bit of a byte on changes the decimal value by how much?",
      options: ["128 — its place value", "1", "It depends on the other bits"],
      correct: 0,
      explanation: "Each bit position has a fixed place value; the leftmost bit of a byte is always worth 128, independent of the other bits.",
    },
    preset: { decBinary: { sub: "toDecimal", bits: "00000000" } },
  },
  {
    id: "exp-bin-to-hex",
    title: "Experiment 3 — Binary to Hex",
    level: "intermediate",
    tab: "grouping",
    goal: "Group 10101101 into sets of four bits and read off the hex digits.",
    steps: ["The lab opens on Binary ↔ Hex with 10101101 loaded.", "Notice the two groups of 4 bits, each already labeled with its value and hex digit.", "Toggle a bit inside one group and watch only that group's hex digit change."],
    observe: "Each group of 4 bits maps to exactly one hex digit — grouping is exact, with nothing left over.",
    check: {
      question: "Why does grouping binary into sets of 4 give hexadecimal digits with nothing left over?",
      options: ["Because 2⁴ = 16, exactly the number of hex digits", "Because hexadecimal only has 8 digits", "It's a coincidence for this particular number"],
      correct: 0,
      explanation: "4 bits can represent 2⁴ = 16 different values — exactly the 16 digits (0–9, A–F) hexadecimal uses.",
    },
    preset: { grouping: { sub: "hex", bits: "10101101" } },
  },
  {
    id: "exp-hex-to-dec",
    title: "Experiment 4 — Hex to Decimal",
    level: "intermediate",
    tab: "grouping",
    goal: "Use place values to convert 2A₁₆ to decimal.",
    steps: ["The lab opens on Hex → Decimal with 2A loaded.", "Read each digit's place-value row: 2 × 16¹ and A × 16⁰.", "Check the total matches 42."],
    observe: "Hexadecimal place values are powers of 16, and the letter digits A–F stand for 10–15.",
    check: {
      question: "In 2A₁₆, what does the digit A contribute to the total?",
      options: ["10 (A = 10, in the 16⁰ place, so 10 × 1 = 10)", "10 × 16 = 160", "1"],
      correct: 0,
      explanation: "A is the rightmost digit, in the 16⁰ (ones) place, and A stands for 10, so it contributes 10 × 1 = 10.",
    },
    preset: { grouping: { sub: "hex2dec" } },
  },
  {
    id: "exp-data-units",
    title: "Experiment 5 — Data Units",
    level: "beginner",
    tab: "data-units",
    goal: "Convert 4 GB down through MB and KB to bytes using the unit converter.",
    steps: ["The lab opens on the unit converter set to Decimal, 4 GB → MB.", "Read the worked steps, then change “To” to kB and note the new result.", "Finally set “To” to a base unit to see the byte count."],
    observe: "Each step down the hierarchy multiplies by 1,000 (decimal) — the same value, just counted in smaller units.",
    check: {
      question: "4 GB equals how many MB, using decimal units?",
      options: ["4,000 MB", "4,096 MB", "4,000,000 MB"],
      correct: 0,
      explanation: "1 GB = 1,000 MB in the decimal (SI) convention, so 4 GB = 4,000 MB.",
    },
    preset: { dataUnits: { from: "GB", to: "MB", value: "4" } },
  },
  {
    id: "exp-network-transfer",
    title: "Experiment 6 — Network Transfer",
    level: "intermediate",
    tab: "network",
    goal: "Calculate the approximate time to transfer 500 MB over a 100 Mbps connection.",
    steps: ["The calculator opens with 100 Mbps and a 500 MB file.", "Read the worked steps: bits→bytes, then size÷rate.", "Drag the efficiency slider down and watch the estimated time grow."],
    observe: "100 Mbps is 12.5 MB/s (divide by 8), so a 500 MB file takes about 40 seconds at 100% efficiency.",
    check: {
      question: "Why is 100 Mbps not the same as 100 MB/s?",
      options: ["Mbps counts bits; MB/s counts bytes, and 1 byte = 8 bits, so 100 Mbps ≈ 12.5 MB/s", "They're the same thing, just different abbreviations", "Mbps is always larger than MB/s by a factor of 1,000"],
      correct: 0,
      explanation: "Connection speeds are usually quoted in bits per second, but file sizes are in bytes — divide by 8 to compare them.",
    },
    preset: { network: { speedMbps: "100", fileSizeMB: "500" } },
  },
  {
    id: "exp-memory-addresses",
    title: "Experiment 7 — Memory Addresses",
    level: "intermediate",
    tab: "addresses",
    goal: "Convert the decimal address 4096 to hexadecimal and binary.",
    steps: ["The address converter opens with 4096 loaded.", "Read off the hex form (0x1000) and the binary form.", "Try a few other decimal addresses and notice how much shorter the hex form stays."],
    observe: "0x1000 is far easier to read and type than its 13-digit binary equivalent, even though it names the exact same address.",
    check: {
      question: "What is 4096 in hexadecimal?",
      options: ["0x1000", "0x4096", "0x400"],
      correct: 0,
      explanation: "4096 = 2¹², which is exactly 0x1000 in hexadecimal (a 1 followed by three zero hex digits).",
    },
    preset: { addresses: { decimal: 4096 } },
  },
];

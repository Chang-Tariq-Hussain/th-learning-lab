import type { TopicContent } from "../types";

/**
 * Number Systems & Data Units — sits between Binary & Data
 * Representation and Computer Boot Process in the Information
 * Technology > Computer Fundamentals sequence (see
 * `@/features/learning-path/data/information-technology-computer-fundamentals`).
 * Flows through the same generic `TopicExperience` every other topic
 * uses, with `NumberSystemsDataUnits` supplied as the Explore
 * simulation.
 *
 * Scope: number bases (decimal/binary/octal/hex) and converting
 * between them, plus bits/bytes/data units/storage/transfer-rate/
 * address arithmetic. Bit-level *encoding* (what a bit pattern stands
 * for, ASCII, etc.) stays in Binary & Data Representation — this
 * topic assumes that groundwork and builds number-system fluency and
 * practical IT calculations on top of it.
 */

const baseFlowSketch = (
  <svg viewBox="0 0 260 60" className="mx-auto h-16 w-full max-w-md" role="img" aria-labelledby="number-systems-sketch-title">
    <title id="number-systems-sketch-title">Decimal leads to Binary, then Octal, then Hexadecimal, then Conversions, then Bits and Bytes, then Data Units, then Practical IT Calculations.</title>
    {["Decimal", "Binary", "Octal", "Hex", "Convert", "Bits/Bytes", "Units", "IT Calcs"].map((label, i) => (
      <g key={label}>
        <circle cx={16 + i * 34} cy={26} r={9} className="fill-none stroke-subject-it" strokeWidth="2" />
        <text x={16 + i * 34} y={48} textAnchor="middle" className="fill-ink-soft font-mono text-[7px] dark:fill-bone-soft">
          {label}
        </text>
        {i < 7 && <line x1={25 + i * 34} y1={26} x2={7 + (i + 1) * 34} y2={26} strokeWidth="1.5" className="stroke-ink/30 dark:stroke-bone/30" />}
      </g>
    ))}
  </svg>
);

const placeValueSketch = (
  <svg viewBox="0 0 220 70" className="mx-auto h-20 w-full max-w-md" role="img" aria-labelledby="place-value-sketch-title">
    <title id="place-value-sketch-title">The binary number 1011 broken into four place-value columns: 8, 4, 2, and 1, contributing 8, 0, 2, and 1 respectively, summing to 11.</title>
    {[
      { bit: "1", place: "8", contrib: "8" },
      { bit: "0", place: "4", contrib: "0" },
      { bit: "1", place: "2", contrib: "2" },
      { bit: "1", place: "1", contrib: "1" },
    ].map((c, i) => (
      <g key={i} transform={`translate(${20 + i * 50}, 0)`}>
        <rect x={0} y={4} width={36} height={28} rx={5} className={c.bit === "1" ? "fill-subject-it/25 stroke-subject-it" : "fill-none stroke-ink/30 dark:stroke-bone/30"} strokeWidth="1.5" />
        <text x={18} y={23} textAnchor="middle" className="fill-ink font-mono text-[13px] font-semibold dark:fill-bone">
          {c.bit}
        </text>
        <text x={18} y={44} textAnchor="middle" className="fill-ink-soft font-mono text-[8px] dark:fill-bone-soft">
          ×{c.place}
        </text>
        <text x={18} y={58} textAnchor="middle" className="fill-ink-soft font-mono text-[8px] dark:fill-bone-soft">
          ={c.contrib}
        </text>
      </g>
    ))}
    <text x={110} y={68} textAnchor="middle" className="fill-subject-it font-mono text-[9px] font-semibold">
      1011₂ = 8+0+2+1 = 11₁₀
    </text>
  </svg>
);

export const informationTechnologyNumberSystemsDataUnitsContent: TopicContent = {
  subjectSlug: "information-technology",
  topicSlug: "number-systems-data-units",
  title: "Number Systems & Data Units",
  subjectLabel: "Information Technology",
  topicLabel: "Computer Fundamentals",
  colorToken: "it",
  simulationHref: "/dashboard/information-technology/number-systems-data-units",

  // -------------------------------------------------------------
  // LEARN — what am I learning?
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Convert values between decimal, binary, octal, and hexadecimal, and explain why each conversion works.",
      "Explain place value in any base, and how grouping bits gives octal and hexadecimal digits exactly.",
      "Distinguish decimal (KB, MB, GB) from binary (KiB, MiB, GiB) data units, and calculate storage, memory, and network transfer figures.",
      "Convert a memory address between decimal, hexadecimal, and binary, and calculate how many addresses a given number of bits can reach.",
    ],
    concepts: [
      {
        term: "Number system (base)",
        explanation:
          "A number system writes quantities using a fixed set of digits and place values that are powers of a base. Decimal (base 10) uses digits 0–9; binary (base 2) uses 0–1; octal (base 8) uses 0–7; hexadecimal (base 16) uses 0–9 and A–F. The same quantity can be written in any of them.",
      },
      {
        term: "Place value",
        explanation: "Each digit's position is worth the base raised to a power, counting from 0 at the rightmost digit. A digit's contribution to the total is its value times its place value.",
        formula: "\\text{value} = \\sum_i d_i \\times \\text{base}^i",
        formulaCaption: "Total value from digits d_i",
      },
      {
        term: "Decimal → binary (repeated division)",
        explanation: "Divide the decimal number by 2 repeatedly, recording each remainder. Reading the remainders from the last division back to the first gives the binary digits, most significant first.",
      },
      {
        term: "Binary → decimal (place-value sum)",
        explanation: "Multiply each bit by its place value (1, 2, 4, 8, 16 …) and add the results. Only bits that are 1 contribute.",
      },
      {
        term: "Binary ↔ hexadecimal (grouping by 4)",
        explanation: "Because 2⁴ = 16, every group of 4 bits maps to exactly one hex digit with nothing left over — group the bits from the right, pad the leftmost group with zeros if needed, and convert each group.",
      },
      {
        term: "Binary ↔ octal (grouping by 3)",
        explanation: "Because 2³ = 8, every group of 3 bits maps to exactly one octal digit, the same idea as hex grouping but with groups of three instead of four.",
      },
      {
        term: "Bits and bytes",
        explanation: "A bit is a single 0 or 1. Eight bits make one byte — the basic unit computers use to address and count data.",
        formula: "1\\ \\text{byte} = 8\\ \\text{bits}",
      },
      {
        term: "Decimal vs binary data units",
        explanation:
          "KB, MB, GB, and TB are decimal (SI) units — powers of 1,000. KiB, MiB, GiB, and TiB are binary (IEC) units — powers of 1,024. They are genuinely different sizes; 1 GB (1,000,000,000 bytes) is not the same as 1 GiB (1,073,741,824 bytes).",
        formula: "1\\ \\text{GB} = 1000^3\\ \\text{B}, \\quad 1\\ \\text{GiB} = 1024^3\\ \\text{B}",
      },
      {
        term: "Data transfer rate: bits vs bytes",
        explanation: "Connection speeds are usually advertised in bits per second (Mbps, Gbps), but file sizes and download progress are shown in bytes (MB/s, GB/s). Divide a bits-per-second rate by 8 to get bytes per second.",
        formula: "\\text{MB/s} \\approx \\dfrac{\\text{Mbps}}{8}",
      },
      {
        term: "Memory addresses in hexadecimal",
        explanation: "Memory addresses are usually written in hex because it is a compact, human-readable stand-in for binary — each hex digit represents exactly 4 bits, so an address that would be a long string of 0s and 1s becomes a short hex string.",
      },
      {
        term: "Addressable memory",
        explanation: "An address made of N bits can point to 2ᴺ distinct locations. More address bits mean a larger possible address space, though the address space a real system actually uses depends on its architecture.",
        formula: "\\text{addresses} = 2^{N}",
        formulaCaption: "N = number of address bits",
      },
      {
        term: "Two's complement (signed integers)",
        explanation: "Two's complement is the standard way computers represent negative numbers in binary: the leftmost bit is a sign bit worth a negative place value. To negate a value, invert every bit and add 1.",
        formula: "-2^{N-1} \\text{ to } 2^{N-1}-1",
        formulaCaption: "Range of an N-bit signed integer",
      },
    ],
    whyItMatters:
      "Number systems and data units are the vocabulary of computing: file sizes, download speeds, RAM capacity, memory addresses, IP addresses, color codes, and error codes are all expressed in decimal, hex, binary, or a data unit. Reading a spec sheet, debugging a memory dump, or understanding why a drive looks smaller than its label all come down to the ideas in this lab.",
    keyTerms: [
      { term: "Radix", definition: "Another name for the base of a number system (its \"radix\") — the number of unique digits it uses." },
      { term: "Nibble", definition: "Four bits — half a byte, and exactly the number of bits one hexadecimal digit represents." },
      { term: "SI unit", definition: "A decimal, powers-of-1,000 unit prefix (kilo, mega, giga, tera) — the everyday meaning of KB, MB, GB, TB." },
      { term: "IEC unit", definition: "A binary, powers-of-1,024 unit prefix (kibi, mebi, gibi, tebi), written KiB, MiB, GiB, TiB to distinguish it from the decimal SI meaning." },
      { term: "Two's complement", definition: "A method of representing signed integers in binary where the most significant bit carries a negative place value." },
    ],
    visualAids: [
      { id: "base-flow", caption: "The learning journey through this lab: from decimal, through the other bases, to practical IT calculations.", visual: baseFlowSketch },
      { id: "place-value", caption: "1011₂ broken into place values: 8 + 0 + 2 + 1 = 11₁₀.", visual: placeValueSketch },
    ],
    misconceptions: [
      {
        id: "kb-always-1024",
        misconception: "\"1 KB always means 1,024 bytes.\"",
        correction:
          "Only in the binary (IEC) convention, written KiB. In the decimal (SI) convention, 1 KB is 1,000 bytes. Software and hardware do not always agree on which convention they use — that's exactly why the distinction matters.",
      },
      {
        id: "mbps-equals-mbs",
        misconception: "\"100 Mbps means 100 MB/s.\"",
        correction: "Mbps counts bits per second; MB/s counts bytes per second, and one byte is 8 bits. 100 Mbps is about 12.5 MB/s, not 100 MB/s.",
      },
      {
        id: "smaller-drive",
        misconception: "\"My drive is missing storage because it shows less than the label.\"",
        correction:
          "The drive usually has exactly the labeled decimal capacity. It looks smaller in an operating system that reports size using binary units — the same byte count, displayed with a different unit convention (plus a small amount used by formatting and the file system).",
      },
      {
        id: "hex-is-different-numbers",
        misconception: "\"Hexadecimal numbers are a different kind of quantity than decimal numbers.\"",
        correction: "Hex is just another way of writing the same quantity — 2A₁₆ and 42₁₀ name the exact same value, the same way \"forty-two\" and \"42\" do.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT — commit to a guess before exploring
  // -------------------------------------------------------------
  predict: {
    intro: "Before you open the lab, predict what a few conversions and calculations will produce.",
    scenarios: [
      {
        id: "predict-dec-to-bin",
        scenario: "You convert the decimal number 13 to binary using repeated division by 2.",
        question: "What binary value do you get?",
        options: [
          { id: "a", label: "1101" },
          { id: "b", label: "1110" },
          { id: "c", label: "1011" },
          { id: "d", label: "1100" },
        ],
        actualResultOptionId: "a",
        explanation: "13 ÷ 2 = 6 r1, 6 ÷ 2 = 3 r0, 3 ÷ 2 = 1 r1, 1 ÷ 2 = 0 r1. Reading the remainders bottom to top gives 1101.",
        hint: "Divide 13 by 2 repeatedly and write down each remainder.",
      },
      {
        id: "predict-hex-grouping",
        scenario: "You group the binary value 1010 1101 into sets of 4 bits to convert it to hexadecimal.",
        question: "What hexadecimal value results?",
        options: [
          { id: "a", label: "AD" },
          { id: "b", label: "A5" },
          { id: "c", label: "DA" },
          { id: "d", label: "5D" },
        ],
        actualResultOptionId: "a",
        explanation: "1010 = A (10) and 1101 = D (13), so the hex value is AD.",
        hint: "Convert each 4-bit group separately: 1010 and 1101.",
      },
      {
        id: "predict-gb-vs-gib",
        scenario: "You compare 4 GB (decimal) to its size in GiB (binary).",
        question: "Which is larger, 4 GB or 4 GiB?",
        options: [
          { id: "a", label: "4 GiB is larger" },
          { id: "b", label: "4 GB is larger" },
          { id: "c", label: "They're exactly equal" },
        ],
        actualResultOptionId: "a",
        explanation: "A GiB (1,073,741,824 bytes) holds more bytes than a GB (1,000,000,000 bytes), so 4 GiB is the larger quantity of bytes — about 4.29 GB worth.",
        hint: "1,024 is bigger than 1,000 — so which unit's byte count grows faster?",
      },
      {
        id: "predict-network-speed",
        scenario: "A connection runs at 80 Mbps.",
        question: "Approximately what is that in MB/s?",
        options: [
          { id: "a", label: "About 10 MB/s" },
          { id: "b", label: "About 80 MB/s" },
          { id: "c", label: "About 640 MB/s" },
        ],
        actualResultOptionId: "a",
        explanation: "Divide bits per second by 8 to get bytes per second: 80 ÷ 8 = 10 MB/s.",
        hint: "There are 8 bits in a byte.",
      },
      {
        id: "predict-address-bits",
        scenario: "A system uses 16-bit memory addresses.",
        question: "How many distinct addresses can it reach?",
        options: [
          { id: "a", label: "65,536" },
          { id: "b", label: "16" },
          { id: "c", label: "32,768" },
          { id: "d", label: "1,048,576" },
        ],
        actualResultOptionId: "a",
        explanation: "N address bits reach 2ᴺ addresses. 2¹⁶ = 65,536.",
        hint: "Compute 2 raised to the power of the number of address bits.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE — using the simulation
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Start on Number Systems to see how decimal, binary, octal, and hexadecimal each represent the same value.",
      "Open Place Value and click individual digits to see exactly what each one contributes to the total.",
      "Use Decimal ↔ Binary to step through repeated division, and toggle bits to watch the decimal value update live.",
      "Move to Binary ↔ Hex/Octal to see why grouping bits by 4 or 3 gives exact hex or octal digits.",
      "Try the Universal Converter, Bits & Bytes, and Data Units tabs, then raise the level to Intermediate and Technical to unlock Memory & Storage, Transfer Rates, Memory Addresses, and Signed Integers.",
    ],
    tryThis: [
      "In Decimal ↔ Binary, convert 255 and notice every bit turns on.",
      "In Data Units, convert 1 TB to GB, then switch to binary units and convert 1 TiB to GiB — compare the results.",
      "In Memory & Storage, pick a storage preset and read why the operating system might report a smaller number than the label.",
      "In Transfer Rates, drag the efficiency slider down and watch the estimated transfer time change.",
      "In Signed Integers, enter -5 and watch the two's-complement pattern build step by step.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN — why does this happen?
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "explain-why-binary",
        question: "Why do computers use binary instead of decimal internally?",
        answer:
          "Binary has only two states (0 and 1), which map naturally onto the two-state (off/on) behavior of digital electronic circuits. Decimal would need circuits that reliably distinguish ten different voltage levels, which is far less reliable and more expensive to build.",
      },
      {
        id: "explain-why-hex-exact",
        question: "Why does grouping binary into 4s always give a clean hexadecimal digit, with nothing left over?",
        answer: "Because 2⁴ = 16, exactly the number of digits hexadecimal has (0–9 and A–F). Every possible 4-bit pattern corresponds to exactly one hex digit, so the grouping never has a remainder.",
      },
      {
        id: "explain-why-mbps-not-mbs",
        question: "Why isn't 100 Mbps the same as 100 MB/s?",
        answer:
          "Mbps measures bits per second (lowercase b); MB/s measures bytes per second (uppercase B). One byte equals 8 bits, so a rate in bits per second is always 8 times larger, numerically, than the same physical rate expressed in bytes per second.",
      },
      {
        id: "explain-why-drive-smaller",
        question: "Why can a drive labeled \"1 TB\" show up as roughly 931 GB in an operating system?",
        answer:
          "The manufacturer's \"1 TB\" label uses the decimal meaning: 1,000,000,000,000 bytes. Many operating systems display that same byte count using binary units, calling it GiB but often labeling it \"GB\" anyway. 1,000,000,000,000 bytes divided by 1,073,741,824 (bytes per GiB) is about 931 — the drive isn't missing space, it's the same bytes shown with a different unit convention (plus a little space used by formatting).",
      },
      {
        id: "explain-two-complement",
        question: "Why does inverting the bits and adding 1 produce the negative of a number in two's complement?",
        answer:
          "Inverting every bit of an N-bit number x gives (2ᴺ − 1) − x. Adding 1 gives 2ᴺ − x, which is exactly the two's-complement representation of −x modulo 2ᴺ — the pattern that, when added to x, wraps around to 0.",
      },
      {
        id: "explain-address-space",
        question: "Why does adding one more address bit double the number of reachable addresses?",
        answer: "Each additional bit doubles the number of distinct patterns available, since every existing pattern can now be extended with either a 0 or a 1. N bits give 2ᴺ patterns, so N+1 bits give 2ᴺ⁺¹ = 2 × 2ᴺ patterns.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE — points at the quiz-engine registry
  // -------------------------------------------------------------
  practice: {
    quizId: "it-number-systems-data-units-practice",
  },

  // -------------------------------------------------------------
  // CHALLENGE — realistic, harder problems
  // -------------------------------------------------------------
  challenge: {
    intro: "Eight progressively harder problems. Use the simulation to work each one out.",
    scenarios: [
      {
        id: "challenge-dec-bin",
        title: "Decimal to binary",
        scenario: "A configuration file expects a permission value of 45 written in binary.",
        objective: "Convert 45 to binary.",
        tools: [{ id: "tool-1", label: "Decimal ↔ Binary tab (repeated division)" }],
        hints: ["Divide 45 by 2 repeatedly and record each remainder.", "Read the remainders from the last division back to the first."],
        answer: { mode: "choice", options: [
          { id: "a", label: "101101" },
          { id: "b", label: "101011" },
          { id: "c", label: "110101" },
          { id: "d", label: "100101" },
        ], correctOptionId: "a" },
        explanation: "45 ÷ 2 = 22 r1, 22 ÷ 2 = 11 r0, 11 ÷ 2 = 5 r1, 5 ÷ 2 = 2 r1, 2 ÷ 2 = 1 r0, 1 ÷ 2 = 0 r1 → reading upward: 101101.",
      },
      {
        id: "challenge-bin-hex",
        title: "Binary to hexadecimal",
        scenario: "A color value is stored as the binary string 11001010.",
        objective: "Convert 11001010 to hexadecimal.",
        tools: [{ id: "tool-2", label: "Binary ↔ Hex/Octal tab (grouping by 4)" }],
        hints: ["Split the 8 bits into two groups of 4: 1100 and 1010.", "Convert each group separately, then join the digits."],
        answer: { mode: "choice", options: [
          { id: "a", label: "CA" },
          { id: "b", label: "AC" },
          { id: "c", label: "C9" },
          { id: "d", label: "DA" },
        ], correctOptionId: "a" },
        explanation: "1100 = 12 = C, 1010 = 10 = A, so 11001010₂ = CA₁₆.",
      },
      {
        id: "challenge-hex-dec",
        title: "Hexadecimal to decimal",
        scenario: "A log file shows a memory offset of 7B in hexadecimal.",
        objective: "Convert 7B (hex) to decimal.",
        tools: [{ id: "tool-3", label: "Binary ↔ Hex/Octal tab → Hex → Decimal" }],
        hints: ["7 is in the 16¹ place; B (11) is in the 16⁰ place.", "Add 7×16 and 11×1."],
        answer: { mode: "numeric", target: 123, tolerance: 0 },
        explanation: "7 × 16 + 11 × 1 = 112 + 11 = 123.",
      },
      {
        id: "challenge-bits-bytes",
        title: "Bits to bytes",
        scenario: "A network packet header is 128 bits long.",
        objective: "How many bytes is that?",
        tools: [{ id: "tool-4", label: "Bits & Bytes tab" }],
        hints: ["Divide by 8 bits per byte."],
        answer: { mode: "numeric", unit: "bytes", target: 16, tolerance: 0 },
        explanation: "128 bits ÷ 8 bits/byte = 16 bytes.",
      },
      {
        id: "challenge-storage-calc",
        title: "Storage requirements",
        scenario: "You need to back up 250 photos, each about 4 MB, to a cloud drive.",
        objective: "Approximately how many MB of storage do you need in total?",
        tools: [{ id: "tool-5", label: "Memory & Storage tab → Storage calculator" }],
        hints: ["Multiply file size by file count."],
        answer: { mode: "numeric", unit: "MB", target: 1000, tolerance: 20 },
        explanation: "250 files × 4 MB = 1,000 MB (about 1 GB).",
      },
      {
        id: "challenge-network-transfer",
        title: "Network transfer time",
        scenario: "A 250 MB update needs to download over a 50 Mbps connection.",
        objective: "Approximately how many seconds will the idealized transfer take?",
        constraints: [{ id: "constraint-1", label: "Assume 100% efficiency for this estimate." }],
        tools: [{ id: "tool-6", label: "Transfer Rates tab → Network speed calculator" }],
        hints: ["Convert 50 Mbps to MB/s by dividing by 8.", "Divide the file size by that rate."],
        answer: { mode: "numeric", unit: "seconds", target: 40, tolerance: 2 },
        explanation: "50 Mbps ÷ 8 = 6.25 MB/s. 250 MB ÷ 6.25 MB/s = 40 seconds.",
      },
      {
        id: "challenge-hex-address",
        title: "Interpret a memory address",
        scenario: "A debugger reports that a variable lives at address 0x2000.",
        objective: "What is that address in decimal?",
        tools: [{ id: "tool-7", label: "Memory Addresses tab → address converter" }],
        hints: ["0x2000 = 2 × 16³.", "16³ = 4096."],
        answer: { mode: "numeric", target: 8192, tolerance: 0 },
        explanation: "0x2000 = 2 × 16³ = 2 × 4096 = 8192.",
      },
      {
        id: "challenge-twos-complement",
        title: "Signed integer, advanced",
        scenario: "A sensor reports a temperature delta of −18 that needs to be stored as an 8-bit two's-complement value.",
        objective: "What is the 8-bit two's-complement bit pattern for −18?",
        constraints: [{ id: "constraint-2", label: "8-bit signed range is −128 to +127." }],
        tools: [{ id: "tool-8", label: "Signed Integers tab" }],
        hints: ["Write 18 in 8-bit binary: 00010010.", "Invert every bit, then add 1."],
        answer: { mode: "choice", options: [
          { id: "a", label: "11101110" },
          { id: "b", label: "11101101" },
          { id: "c", label: "00010010" },
          { id: "d", label: "11110010" },
        ], correctOptionId: "a" },
        explanation: "18 = 00010010. Inverted: 11101101. Add 1: 11101110.",
        maxAttempts: 4,
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "information-technology",
      topicSlug: "binary-data-representation",
      label: "Binary & Data Representation",
      href: "/dashboard/information-technology/binary-data-representation",
      reason: "For how bits represent values and characters at a deeper, encoding-focused level.",
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "cpu-architecture-instruction-cycle",
      label: "CPU Architecture & Instruction Cycle",
      href: "/dashboard/information-technology/cpu-architecture-instruction-cycle",
      reason: "For how registers and instruction values use the same number-system ideas.",
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "cache-memory-explorer",
      label: "Cache Memory Explorer",
      href: "/dashboard/information-technology/cache-memory-explorer",
      reason: "For hexadecimal addresses and cache-line addressing in full detail.",
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "io-interrupts-explorer",
      label: "I/O & Interrupts Explorer",
      href: "/dashboard/information-technology/io-interrupts-explorer",
      reason: "For how data transfer and device communication work once bytes are moving.",
    },
  ],
};

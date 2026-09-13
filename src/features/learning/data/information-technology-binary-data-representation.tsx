import type { TopicContent } from "../types";

/**
 * Binary & Data Representation — third stop in the Information
 * Technology > Computer Fundamentals sequence (see
 * `@/features/learning-path/data/information-technology-computer-fundamentals`).
 * Flows through the same generic `TopicExperience` every other topic
 * uses, with `BinaryDataRepresentation` (a 2D/2.5D bit-toggle lab, not
 * 3D — see that component's own comments for why) supplied as the
 * Explore simulation.
 */

const placeValueSketch = (
  <svg viewBox="0 0 260 90" className="mx-auto h-24 w-full max-w-sm" role="img" aria-labelledby="place-value-sketch-title">
    <title id="place-value-sketch-title">Eight bit columns labeled 128, 64, 32, 16, 8, 4, 2, 1 from left to right, each doubling as you move left.</title>
    {[128, 64, 32, 16, 8, 4, 2, 1].map((value, i) => (
      <g key={value}>
        <rect x={8 + i * 31} y={20} width={24} height={30} rx={4} className="fill-none stroke-subject-it" strokeWidth="2" />
        <text x={8 + i * 31 + 12} y={40} textAnchor="middle" className="fill-ink font-mono text-[9px] dark:fill-bone">
          {value}
        </text>
      </g>
    ))}
    <text x="130" y="72" textAnchor="middle" className="fill-ink-soft font-mono text-[9px] dark:fill-bone-soft">
      each place value is double the one to its right
    </text>
  </svg>
);

export const informationTechnologyBinaryDataRepresentationContent: TopicContent = {
  subjectSlug: "information-technology",
  topicSlug: "binary-data-representation",
  title: "Binary & Data Representation",
  subjectLabel: "Information Technology",
  topicLabel: "Computer Fundamentals",
  colorToken: "it",
  simulationHref: "/dashboard/information-technology/binary-data-representation",

  // -------------------------------------------------------------
  // LEARN — what am I learning?
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Explain why computers represent all data using only 0s and 1s.",
      "Convert an 8-bit binary value to its decimal equivalent, and a decimal value (0-255) to its 8-bit binary equivalent.",
      "Describe what a bit and a byte are, and how bytes are used to represent basic text characters.",
      "Read a binary pattern by reasoning about which place values are switched on.",
    ],
    concepts: [
      {
        term: "A bit is the smallest unit of data",
        explanation:
          "A bit (short for \"binary digit\") is a single 0 or 1 — the smallest piece of information a computer can store. Every larger piece of data, from a number to a photo, is built from many bits.",
      },
      {
        term: "A byte groups 8 bits together",
        explanation:
          "Computers usually work with bits in groups of 8, called a byte. One byte can represent any whole number from 0 to 255 — enough to represent one basic character, like a letter or digit.",
      },
      {
        term: "Each bit position has a place value",
        explanation:
          "Reading left to right, the 8 positions in a byte are worth 128, 64, 32, 16, 8, 4, 2, and 1 — each one exactly double the one after it. A bit's contribution to the total is its place value if it's on, and 0 if it's off.",
        formula: "\\text{decimal value} = \\sum (\\text{bit} \\times \\text{place value})",
        formulaCaption: "Add up the place values of every bit that's switched on",
      },
      {
        term: "Characters are stored as numbers, in binary",
        explanation:
          "A character-encoding standard like ASCII assigns every basic character — letters, digits, punctuation — a specific numeric code from 0 to 255. That number is then stored the same way any other byte is: in binary.",
      },
    ],
    whyItMatters:
      "Everything a computer stores or moves around — this sentence, a photo, a song, a spreadsheet — is ultimately just very long sequences of 0s and 1s underneath. Binary isn't a special encoding used only sometimes; it's the one format every kind of data gets reduced to, because electronic circuits can reliably tell apart two states (on/off) far more easily than ten finely graded ones. Understanding how a single byte works is the foundation for understanding file sizes, character encoding, and eventually how any digital information is represented at all.",
    keyTerms: [
      { term: "Bit", definition: "A single binary digit — either 0 or 1. The smallest unit of data a computer stores." },
      { term: "Byte", definition: "A group of 8 bits, treated as one unit — can represent any decimal value from 0 to 255." },
      { term: "Place value", definition: "The amount a bit position is worth if it's switched on: 128, 64, 32, 16, 8, 4, 2, or 1." },
      { term: "Binary", definition: "A base-2 number system using only the digits 0 and 1, in contrast to the base-10 decimal system." },
      { term: "ASCII", definition: "A standard that assigns each basic character a specific numeric code, later stored in binary." },
    ],
    visualAids: [
      {
        id: "place-value-sketch",
        caption: "Every bit position is exactly double the place value of the position to its right.",
        visual: placeValueSketch,
      },
    ],
    misconceptions: [
      {
        id: "misconception-binary-digits-mean-decimal-value",
        misconception: "Binary 10 means the number ten, the same way decimal 10 does.",
        correction:
          "Binary place values double (1, 2, 4, 8...) instead of following decimal's powers of 10. Binary \"10\" means one 2 plus zero 1s — decimal 2, not ten.",
      },
      {
        id: "misconception-more-digits-always-bigger",
        misconception: "A binary number with more digits is always a bigger value than one with fewer digits.",
        correction:
          "Within a fixed 8-bit byte, what matters is which specific place values are switched on, not how many digits are visually written. 00000001 (decimal 1) has the same digit count as 10000000 (decimal 128) — the position of the 1, not the count of digits, determines the value.",
      },
      {
        id: "misconception-ascii-stores-the-letter-shape",
        misconception: "When a computer stores the letter \"A\", it stores a tiny picture of the letter's shape.",
        correction:
          "The computer stores only a number — ASCII code 65 for uppercase \"A\" — as an 8-bit binary value. The actual visual shape of the letter is decided later, by whatever font is used to display it; the stored data itself is just a number.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT — what should I predict?
  // -------------------------------------------------------------
  predict: {
    intro:
      "Before checking your answer in the simulation below, predict what a bit toggle or a binary pattern actually represents — you'll only be able to verify it after locking in an answer.",
    scenarios: [
      {
        id: "it-binary-predict-001",
        scenario: "A byte currently reads 00000000, and you switch on only the leftmost bit.",
        question: "What decimal value does the byte now represent?",
        options: [
          { id: "128", label: "128" },
          { id: "1", label: "1" },
          { id: "8", label: "8" },
          { id: "255", label: "255" },
        ],
        actualResultOptionId: "128",
        explanation:
          "The leftmost bit position is worth 128 — the largest place value in an 8-bit byte. Switching on just that one bit produces 128.",
        hint: "Which place value sits in the leftmost position of an 8-bit byte?",
      },
      {
        id: "it-binary-predict-002",
        scenario: "A byte currently represents the decimal value 6 (00000110), and you switch on the rightmost bit too.",
        question: "What decimal value does the byte now represent?",
        options: [
          { id: "7", label: "7" },
          { id: "60", label: "60" },
          { id: "16", label: "16" },
          { id: "0", label: "0" },
        ],
        actualResultOptionId: "7",
        explanation:
          "The rightmost bit's place value is 1. Adding that to the existing value of 6 gives 6 + 1 = 7.",
        hint: "Turning on a bit adds exactly its own place value to the total — what's the rightmost bit worth?",
      },
      {
        id: "it-binary-predict-003",
        scenario: "You want to represent the character \"A\" (ASCII code 65) as an 8-bit binary byte.",
        question: "Which two place values, added together, make 65?",
        options: [
          { id: "64-and-1", label: "64 and 1" },
          { id: "32-and-32", label: "32 and 32" },
          { id: "128-and-1", label: "128 and negative 63" },
          { id: "8-and-8-and-8", label: "8, 8, and 8" },
        ],
        actualResultOptionId: "64-and-1",
        explanation:
          "65 = 64 + 1, so the bits worth 64 and 1 are switched on, giving the binary pattern 01000001.",
        hint: "Try the largest place value that still fits into 65 first, then see what's left over.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE — the guided experiment
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Pick a mode: Free Explore, Build a Number, Decode Binary, Character Encoding, or Challenge Mode.",
      "In Free Explore, toggle any of the 8 bits and watch the binary string and decimal value update instantly.",
      "Try typing a decimal number, or typing a binary string, into the two input boxes to set the bits directly.",
      "In Build a Number, toggle bits until your value matches the given decimal target, then check your answer.",
      "In Decode Binary, study a fixed binary pattern, predict its decimal value, then reveal to check yourself.",
      "In Character Encoding, convert a character to its binary byte, or a byte back into the matching character.",
    ],
    tryThis: [
      "In Free Explore, try to build the value 100 using the fewest number of bits switched on.",
      "In Decode Binary, before revealing, say out loud which place values you think are switched on — not just the final number.",
      "In Character Encoding, encode your own first initial and see what its ASCII byte looks like.",
      "Try Challenge Mode once, then again — notice how the difficulty and mix of question types shifts as you go.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN — why does this happen?
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "it-binary-explain-001",
        question: "Why do computers use binary instead of decimal internally?",
        answer:
          "Electronic circuits can reliably tell apart two clear states — roughly \"on\" and \"off\" — far more easily and reliably than ten finely graded voltage levels. Binary's two digits map directly onto that on/off hardware reality, which is why it became the standard rather than a design choice made for convenience.",
      },
      {
        id: "it-binary-explain-002",
        question: "Why does each bit position have a place value that's exactly double the one before it?",
        answer:
          "Binary is a base-2 number system, the same way decimal is base-10. Just as decimal place values go 1, 10, 100 (each ten times the last), binary place values go 1, 2, 4, 8... (each two times the last) — doubling is simply what base-2 place values do.",
      },
      {
        id: "it-binary-explain-003",
        question: "Why can an 8-bit byte represent exactly 256 different values, from 0 to 255?",
        answer:
          "Each of the 8 bits can independently be 0 or 1, so the total number of possible combinations is 2 multiplied by itself 8 times — 2^8, which equals 256. Counting from 0, that spans the range 0 through 255.",
      },
      {
        id: "it-binary-explain-004",
        question: "Why does a character-encoding standard like ASCII need a fixed numeric code for every character?",
        answer:
          "A computer can only ever store numbers in binary — it has no separate way to store \"the letter A\" as a concept. ASCII solves this by agreeing, as a shared standard, on exactly which number represents each character, so any computer reading that number back knows which character it means.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE — can I solve a problem using this?
  // -------------------------------------------------------------
  practice: {
    // Foreign key into the quiz-engine registry — all questions live in
    // @/features/quiz-engine/data/it-binary-data-representation-quiz.ts, none duplicated here.
    quizId: "it-binary-data-representation",
  },

  // -------------------------------------------------------------
  // CHALLENGE — realistic problems, some folding in the real-world mission
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. Some are worked out from reasoning alone; others ask you to use the simulation above to check your answer. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "it-binary-challenge-001",
        title: "The Missing Place Value",
        scenario:
          "A classmate built the decimal number 90 by switching on the bits worth 64, 16, 8, and 2, but they're not confident they included every bit needed.",
        objective: "Determine whether 64 + 16 + 8 + 2 actually equals 90, and if not, identify what's wrong.",
        requiresExperiment: true,
        tools: [{ id: "explore-toggles", label: "Bit toggles in Free Explore mode" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Correct — 64 + 16 + 8 + 2 = 90" },
            { id: "b", label: "Incorrect — those four place values only add up to 88, not 90" },
            { id: "c", label: "Incorrect — those four place values add up to 100" },
          ],
          correctOptionId: "a",
        },
        explanation: "64 + 16 + 8 + 2 = 90 — the classmate's four bits are exactly right, with no missing or extra place value.",
        hints: [
          "Add the four values one pair at a time: 64 + 16 first, then add the rest.",
          "Try switching on exactly those four bits in Free Explore mode and read the decimal readout.",
        ],
      },
      {
        id: "it-binary-challenge-002",
        title: "Odd One Out",
        scenario:
          "You're told a byte's decimal value is odd, but you haven't seen the byte itself.",
        objective: "Determine which single bit position must be switched on, based only on knowing the value is odd.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "The rightmost bit (place value 1)" },
            { id: "b", label: "The leftmost bit (place value 128)" },
            { id: "c", label: "It's impossible to know anything about an odd byte" },
          ],
          correctOptionId: "a",
        },
        explanation:
          "Every place value except the rightmost one (1) is even, so an odd total can only come from that rightmost bit being switched on — every other bit combination alone always produces an even sum.",
        hints: [
          "List the eight place values and mark which ones are even and which are odd.",
          "An odd total needs at least one odd place value contributing to it.",
        ],
      },
      {
        id: "it-binary-challenge-003",
        title: "Efficient Build",
        scenario:
          "Using Build a Number mode in the simulation above, you're given a target of 170.",
        objective: "Use the simulation to build 170, then determine the minimum number of bits that must be switched on to represent it.",
        constraints: [{ id: "c1", label: "Use the greedy \"largest place value that still fits\" method taught in Learn." }],
        tools: [{ id: "build-mode", label: "Build a Number mode" }],
        requiresExperiment: true,
        answer: {
          mode: "numeric",
          unit: "bits switched on",
          target: 4,
          tolerance: 0,
        },
        explanation:
          "170 = 128 + 32 + 8 + 2, giving the binary pattern 10101010 — exactly four bits switched on, the minimum possible for this value since no smaller set of place values sums to 170.",
        hints: [
          "Start with the largest place value, 128 — does it fit into 170?",
          "After using 128, you have 42 left. Which is the next largest place value that fits into 42?",
        ],
      },
      {
        id: "it-binary-challenge-004",
        title: "Real-World Mission: File Size Detective",
        scenario:
          "A plain text file containing exactly 10 basic characters (letters, spaces, punctuation — nothing fancy) shows a file size of 10 bytes on your computer.",
        objective: "Explain, using what this topic teaches about bytes and character encoding, why the file size in bytes exactly matches the character count.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Each basic character is stored as one byte, so the byte count matches the character count directly" },
            { id: "b", label: "File size in bytes has nothing to do with the number of characters" },
            { id: "c", label: "Each character actually requires 10 bytes, and the file just happens to look like it matches" },
            { id: "d", label: "The file size shown is always rounded to the nearest 10" },
          ],
          correctOptionId: "a",
        },
        explanation:
          "A basic ASCII-range character is stored as exactly one byte (8 bits). With 10 such characters, the file needs exactly 10 bytes — the same one-character-to-one-byte relationship this topic's Character Encoding mode demonstrates directly.",
        hints: [
          "How many bytes does encoding a single basic character take, based on what you practiced in Character Encoding mode?",
          "If one character takes one byte, what would ten characters take?",
        ],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "information-technology",
      topicSlug: "cpu-ram-storage-data-flow",
      label: "CPU–RAM–Storage Data Flow",
      href: "/dashboard/information-technology/cpu-ram-storage-data-flow",
      reason: "Builds on the same idea that everything a computer works with is data moving through its hardware — this topic zooms into what that data actually looks like underneath.",
    },
  ],
};

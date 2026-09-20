import type { QuizMeta, QuizQuestion } from "../types";
import { cacheQuestion as q } from "./it-cache-memory-explorer-builder";

/**
 * Cache Memory Explorer's dedicated 30-question bank — scoped to cache
 * itself: what it is and why it exists, the hierarchy, hits and
 * misses, hit and miss rate, locality, cache lines, eviction,
 * replacement, mapping and associativity, tag/index/offset,
 * instruction vs data caches, coherence, and performance.
 *
 * Deliberately does NOT re-ask the CPU–RAM–Storage Data Flow
 * simulation's questions (how data travels between CPU, RAM and
 * storage, and its short cache hit/miss demo), nor CPU Architecture's
 * (the fetch–decode–execute cycle). It answers "how does small, fast
 * memory help the CPU reach data quickly?".
 *
 * A separate, smaller 15-item bank (`it-cache-memory-explorer-practice`)
 * backs the Golden Learning Experience's Practice step; this bank is
 * the fuller topic quiz. No question is duplicated between them.
 *
 * Wording rule: cache sizes, latencies, line sizes, associativity and
 * policies vary by processor, so questions use the lab's simulation
 * values only where they say so. Every numeric answer was checked
 * against the simulation engine.
 *
 * 30 questions across six kinds of understanding, in this order:
 * 001-008 recall (vocabulary, definitions),
 * 009-016 conceptual (why the mechanism works the way it does),
 * 017-022 application (compute or identify from a described setup),
 * 023-026 prediction (what happens next in a given setup),
 * 027-028 interpretation (reading a described result),
 * 029-030 misconception (directly confronting a common wrong idea).
 */
const questions: QuizQuestion[] = [
  // --- Recall -------------------------------------------------------------
  q({
    id: "it-cache-quiz-001",
    difficulty: "easy",
    concept: "Cache Memory",
    question: "What is cache memory?",
    correct: "A small, fast memory that stores copies of data and instructions the CPU is likely to need again",
    wrong: [
      "The permanent storage where the operating system is installed",
      "The main memory where all running programs are kept",
      "A set of registers that hold the instruction being decoded",
    ],
    slot: 2,
    explanation: "A cache is a small, fast memory near the CPU that keeps copies of useful data and instructions. The originals still live in RAM.",
  }),
  q({
    id: "it-cache-quiz-002",
    difficulty: "easy",
    concept: "Cache Hit",
    question: "What is a cache hit?",
    correct: "The requested data is already in the cache",
    wrong: [
      "The requested data has to be fetched from RAM",
      "The CPU successfully writes data to storage",
      "Two cores hold different copies of the same data",
    ],
    slot: 0,
    explanation: "A hit means the cache already has what the CPU asked for, so the request is answered without going to a lower level.",
  }),
  q({
    id: "it-cache-quiz-003",
    difficulty: "easy",
    concept: "Cache Miss",
    question: "What is a cache miss?",
    correct: "The requested data is not in the cache and must be retrieved from a lower level",
    wrong: [
      "The cache holds the data but it is corrupted",
      "The CPU asked for an address that does not exist",
      "The requested data was found in L1",
    ],
    slot: 3,
    explanation: "On a miss the data isn’t in the cache, so it is fetched from a lower level — ultimately RAM — and a copy is stored in the cache for next time.",
  }),
  q({
    id: "it-cache-quiz-004",
    difficulty: "easy",
    concept: "Hit Rate",
    question: "How is the hit rate calculated?",
    correct: "Hits divided by total accesses",
    wrong: ["Misses divided by total accesses", "Hits divided by misses", "Total accesses divided by hits"],
    slot: 1,
    explanation: "Hit rate = hits ÷ total accesses. Misses ÷ total accesses is the miss rate, and the two add up to 100%.",
  }),
  q({
    id: "it-cache-quiz-005",
    difficulty: "easy",
    concept: "L1, L2 and L3",
    question: "In a typical multi-level cache design, which level is the smallest and fastest?",
    correct: "L1",
    wrong: ["L2", "L3", "RAM"],
    slot: 0,
    explanation: "L1 is the smallest and fastest cache level and the first place the CPU looks. L2 and L3, where present, are generally larger and slower. Exact organisation varies by processor.",
  }),
  q({
    id: "it-cache-quiz-006",
    difficulty: "easy",
    concept: "Cache Lines",
    question: "What is a cache line (or block)?",
    correct: "A group of neighbouring addresses that the cache loads and stores together",
    wrong: [
      "A wire carrying data between the CPU and the cache",
      "A single address stored entirely on its own",
      "A row of registers inside the ALU",
    ],
    slot: 3,
    explanation: "A cache stores whole lines of neighbouring addresses. When one address misses, its surrounding block is loaded together. Line sizes vary by architecture.",
  }),
  q({
    id: "it-cache-quiz-007",
    difficulty: "easy",
    concept: "Temporal Locality",
    question: "What does temporal locality mean?",
    correct: "Data that was used recently is likely to be used again soon",
    wrong: [
      "Data near recently used data is likely to be used soon",
      "Data is always used in the order it was stored",
      "Data used long ago is the most likely to be used next",
    ],
    slot: 1,
    explanation: "Temporal locality is about time: recent use predicts near-future use. A cache that keeps recent data turns repeat uses into hits.",
  }),
  q({
    id: "it-cache-quiz-008",
    difficulty: "easy",
    concept: "Spatial Locality",
    question: "What does spatial locality mean?",
    correct: "Data near recently used data is likely to be used soon",
    wrong: [
      "Data that was used recently is likely to be used again soon",
      "Data is stored in a space-saving format",
      "Data in different caches must always be identical",
    ],
    slot: 2,
    explanation: "Spatial locality is about nearness in memory. It is why caches load whole lines: the neighbours of one address are likely to be needed next.",
  }),

  // --- Conceptual ---------------------------------------------------------
  q({
    id: "it-cache-quiz-009",
    difficulty: "medium",
    concept: "Why Cache Exists",
    question: "Why do CPUs use cache memory?",
    correct: "A CPU can work much faster than main memory can supply data, so a small fast cache reduces waiting",
    wrong: [
      "RAM is too small to hold modern programs",
      "Cache lets data survive when the power is turned off",
      "Cache allows the CPU to skip decoding instructions",
    ],
    slot: 0,
    explanation: "The gap between how fast a CPU can compute and how fast RAM can deliver data would leave the CPU waiting. A small, fast cache close to the CPU answers most requests quickly.",
  }),
  q({
    id: "it-cache-quiz-010",
    difficulty: "medium",
    concept: "Speed and Size Trade-off",
    question: "Why don’t computers simply build all their memory from the fastest, cache-like technology?",
    correct: "Making a large memory that fast is very costly and complex, and larger memories tend to be slower",
    wrong: [
      "Fast memory can only store instructions, not data",
      "Fast memory forgets its contents whenever the CPU is busy",
      "The CPU can only address a very small amount of memory",
    ],
    slot: 3,
    explanation: "Speed, size and cost pull against each other. A small memory near the CPU can be very fast; making a huge one just as fast would be prohibitively expensive, so systems use a hierarchy.",
  }),
  q({
    id: "it-cache-quiz-011",
    difficulty: "medium",
    concept: "Cache Lines",
    question: "Why does a cache load a whole line when a single address misses?",
    correct: "Because nearby addresses are likely to be needed soon (spatial locality)",
    wrong: [
      "Because a cache is unable to store a single address",
      "Because RAM can only be read one program at a time",
      "Because it stops the cache from ever filling up",
    ],
    slot: 1,
    explanation: "If the CPU touches one address, its neighbours are likely next. Loading the whole line on one miss turns those following accesses into hits.",
  }),
  q({
    id: "it-cache-quiz-012",
    difficulty: "medium",
    concept: "Eviction",
    question: "Why must a full cache evict a line when a new block arrives?",
    correct: "It has a fixed number of lines, so there is no room unless one is replaced",
    wrong: [
      "Old data becomes invalid after a fixed period of time",
      "The CPU asks for the new block twice",
      "RAM refuses to send data to a full cache",
    ],
    slot: 2,
    explanation: "A cache’s capacity is limited. When every line is in use, an existing one must be replaced to hold the new block.",
  }),
  q({
    id: "it-cache-quiz-013",
    difficulty: "medium",
    concept: "Replacement Policies",
    question: "What does a cache replacement policy decide?",
    correct: "Which existing line to evict when the cache needs room",
    wrong: [
      "Which address the CPU should request next",
      "How many levels the cache has",
      "Whether the CPU is reading or writing",
    ],
    slot: 0,
    explanation: "When a full cache needs space, the replacement policy — FIFO, LRU, random, or another — chooses the victim.",
  }),
  q({
    id: "it-cache-quiz-014",
    difficulty: "medium",
    concept: "Associativity",
    question: "Why can a set-associative cache avoid conflict misses that a direct-mapped cache suffers?",
    correct: "A block may go in any line of its set, so two blocks that share a set can both stay",
    wrong: [
      "It has a much larger total capacity",
      "It never evicts any line",
      "It stores every address in every line",
    ],
    slot: 3,
    explanation: "In a direct-mapped cache each block has exactly one possible line, so two blocks wanting the same line evict each other. A set-associative cache gives them several lines in the set to share.",
  }),
  q({
    id: "it-cache-quiz-015",
    difficulty: "medium",
    concept: "Instruction vs Data Cache",
    question: "Why do many CPUs use separate instruction and data caches at some levels?",
    correct: "Instructions and data are used differently, and separate caches let fetches and data accesses proceed without competing for the same cache",
    wrong: [
      "Instructions can only ever be stored in RAM",
      "Data can never be cached",
      "A single cache cannot hold more than one kind of value",
    ],
    slot: 1,
    explanation: "Instruction fetches and data accesses have different patterns, and splitting the cache lets both happen without contending. Organisations vary by architecture, and other levels are often unified.",
  }),
  q({
    id: "it-cache-quiz-016",
    difficulty: "medium",
    concept: "Cache Coherence",
    question: "Why is cache coherence a concern in multi-core processors?",
    correct: "Several caches may hold copies of the same data, so a change by one core could leave stale copies in the others",
    wrong: [
      "Every core must share a single set of registers",
      "Cores are unable to access RAM directly",
      "Caches automatically grow as more cores are added",
    ],
    slot: 2,
    explanation: "With per-core caches, the same data can be cached in several places. If one core changes it, the others’ copies are stale unless something keeps them coherent.",
  }),

  // --- Application --------------------------------------------------------
  q({
    id: "it-cache-quiz-017",
    difficulty: "medium",
    concept: "Miss Rate",
    question: "A run reports 40 total accesses, 30 of which were hits. What is the miss rate?",
    correct: "25%",
    wrong: ["75%", "10%", "30%"],
    slot: 0,
    explanation: "There were 40 − 30 = 10 misses. Miss rate = 10 ÷ 40 = 25%. (The hit rate is 75%.)",
  }),
  q({
    id: "it-cache-quiz-018",
    difficulty: "hard",
    concept: "Average Access Time",
    question: "The hit time is 2 units, the miss penalty is 100 units, and the miss rate is 5%. Using average access time = hit time + miss rate × miss penalty, what is the average?",
    correct: "7 units",
    wrong: ["5 units", "102 units", "2.05 units"],
    slot: 1,
    explanation: "2 + 0.05 × 100 = 2 + 5 = 7 units. This is a simplified two-level model.",
  }),
  q({
    id: "it-cache-quiz-019",
    difficulty: "medium",
    concept: "Cache Latency",
    question: "In the lab’s simplified model (L1 = 1, L2 = 4, L3 = 12, RAM = 50 simulation units, and each checked level adds its lookup time), how long does a request take if L1 misses but L2 has the data?",
    correct: "5 units",
    wrong: ["4 units", "1 unit", "17 units"],
    slot: 3,
    explanation: "L1 is checked (1) and misses, then L2 is checked (4) and hits: 1 + 4 = 5 simulated units. 17 would be a hit in L3; these are simulation values, not real timings.",
  }),
  q({
    id: "it-cache-quiz-020",
    difficulty: "medium",
    concept: "Cache Latency",
    question: "With the same simulation values, how long does a request take if L1, L2 and L3 all miss and it reaches RAM?",
    correct: "67 units",
    wrong: ["50 units", "17 units", "12 units"],
    slot: 2,
    explanation: "1 + 4 + 12 + 50 = 67 simulated units, because each missed level adds its lookup time before RAM is reached. Real hardware overlaps these steps.",
  }),
  q({
    id: "it-cache-quiz-021",
    difficulty: "hard",
    concept: "Tag, Index and Offset",
    question: "A cache has 8-word lines and 4 sets. What are the block number, offset, and set index of address 300?",
    correct: "Block 37, offset 4, set 1",
    wrong: ["Block 37, offset 1, set 4", "Block 4, offset 37, set 1", "Block 37, offset 4, set 0"],
    slot: 0,
    explanation: "Block = ⌊300 ÷ 8⌋ = 37. Offset = 300 mod 8 = 4. Set index = 37 mod 4 = 1. The tag is ⌊37 ÷ 4⌋ = 9.",
  }),
  q({
    id: "it-cache-quiz-022",
    difficulty: "medium",
    concept: "Associativity",
    question: "A 2-way set-associative cache has 8 lines. How many sets does it have?",
    correct: "4",
    wrong: ["2", "8", "16"],
    slot: 1,
    explanation: "Each set holds 2 lines, so 8 lines ÷ 2 lines per set = 4 sets.",
  }),

  // --- Prediction ---------------------------------------------------------
  q({
    id: "it-cache-quiz-023",
    difficulty: "medium",
    concept: "Spatial Locality",
    question: "A cache has 4 lines of 4 words (aligned on multiples of 4) and starts empty. The CPU reads 10, 11, 12, 13, 10, 11, 12, 13. How many reads hit?",
    correct: "6",
    wrong: ["2", "4", "8"],
    slot: 3,
    explanation: "10 misses and loads 8–11; 11 hits. 12 misses and loads 12–15; 13 hits. The second pass finds both lines already cached, so four more hits. Total: 2 misses and 6 hits.",
  }),
  q({
    id: "it-cache-quiz-024",
    difficulty: "medium",
    concept: "Cache Lines",
    question: "Now the lines hold only 1 word each (still 4 lines, starting empty). The CPU reads 10, 11, 12, 13, 10, 11, 12, 13 again. How many reads hit?",
    correct: "4",
    wrong: ["0", "6", "8"],
    slot: 2,
    explanation: "With 1-word lines every first read misses (four misses), because no neighbours come along. The four different words then fit in four lines, so the second pass hits. Total: 4 misses and 4 hits — fewer hits than with 4-word lines.",
  }),
  q({
    id: "it-cache-quiz-025",
    difficulty: "hard",
    concept: "Cache Capacity",
    question: "A 2-line cache replaces the least recently used line. The CPU cycles through three blocks: 1, 2, 3, 1, 2, 3. How many of the six reads hit?",
    correct: "0",
    wrong: ["1", "3", "4"],
    slot: 0,
    explanation: "Each block is evicted just before it is needed again, because three blocks can’t fit in two lines: every read misses. A third line would let the second pass hit.",
  }),
  q({
    id: "it-cache-quiz-026",
    difficulty: "hard",
    concept: "Replacement Policies",
    question: "A 3-line cache starts empty. The CPU reads A, B, C, A, B, D, A. Which statement is correct?",
    correct: "LRU gets 3 hits and FIFO gets 2",
    wrong: ["FIFO gets 3 hits and LRU gets 2", "Both get 4 hits", "Both get 2 hits"],
    slot: 1,
    explanation: "Both miss on A, B, C, then hit on A and B. When D arrives, FIFO evicts A (the oldest arrival) and misses on the final A; LRU evicts C (least recently used) and hits. FIFO: 2 hits. LRU: 3 hits. That doesn’t mean LRU wins on every pattern.",
  }),

  // --- Interpretation -----------------------------------------------------
  q({
    id: "it-cache-quiz-027",
    difficulty: "medium",
    concept: "Hit Rate and Miss Rate",
    question: "An access run shows 100 total accesses, 82 hits and 18 misses. Which conclusion is best supported?",
    correct: "82% of accesses were answered by the cache, so only 18% paid the miss penalty",
    wrong: [
      "The cache has 82 lines",
      "18% of the cache’s contents are corrupted",
      "The CPU executed 82 instructions",
    ],
    slot: 3,
    explanation: "Hits and misses count accesses, not lines or instructions. Hit rate is 82%, so only the remaining 18% pay the extra cost of reaching a lower level.",
  }),
  q({
    id: "it-cache-quiz-028",
    difficulty: "hard",
    concept: "Cache Mapping",
    question: "A direct-mapped cache with 8 lines misses on every access while alternating between blocks 0 and 8, even though seven other lines are empty. What is the most likely explanation?",
    correct: "Blocks 0 and 8 map to the same line and keep evicting each other (conflict misses)",
    wrong: [
      "The cache is too small to hold two blocks",
      "The replacement policy is FIFO",
      "Blocks 0 and 8 have different tags, so they can never be cached",
    ],
    slot: 0,
    explanation: "0 mod 8 and 8 mod 8 are both 0, so both blocks compete for line 0 while other lines sit idle. That is a conflict miss. A set-associative or fully associative cache would keep both.",
  }),

  // --- Misconception ------------------------------------------------------
  q({
    id: "it-cache-quiz-029",
    difficulty: "medium",
    concept: "Cache vs RAM",
    question: "Which statement about cache is correct?",
    correct: "It holds copies of data that live in RAM and is managed automatically by hardware",
    wrong: [
      "It is just RAM that happens to run faster and stores the originals",
      "It is a storage device that keeps programs after shutdown",
      "Programs must copy data into it by hand before they can use it",
    ],
    slot: 2,
    explanation: "Cache isn’t simply faster RAM. It keeps copies, hardware decides what to keep, and it helps only because programs show locality.",
    misconceptionTag: "cache-is-faster-ram",
  }),
  q({
    id: "it-cache-quiz-030",
    difficulty: "medium",
    concept: "Real vs Simulated",
    question: "Which statement about real CPUs is most accurate?",
    correct: "Cache sizes, levels, line sizes, associativity and policies vary by processor; the lab’s numbers are simulation values",
    wrong: [
      "Every CPU has exactly three cache levels of the same sizes",
      "L1 always takes exactly one nanosecond",
      "All CPUs use fully associative caches with LRU",
    ],
    slot: 1,
    explanation: "The lab’s timings and sizes are illustrative. Real processors differ in almost every cache parameter, and not every CPU has an L3.",
    misconceptionTag: "cache-numbers-universal",
  }),
];

export const informationTechnologyCacheMemoryExplorerQuiz: QuizMeta = {
  id: "it-cache-memory-explorer",
  title: "Cache Memory Explorer Quiz",
  subjectSlug: "information-technology",
  subjectLabel: "Information Technology",
  topicLabel: "Cache Memory Explorer",
  colorToken: "it",
  backHref: "/dashboard/information-technology/cache-memory-explorer",
  description:
    "Thirty questions on cache memory: why it exists, the memory hierarchy, L1/L2/L3, hits and misses, hit and miss rate, locality, cache lines, eviction, replacement policies, mapping and associativity, tag/index/offset, instruction vs data caches, cache coherence, and how all of it affects performance.",
  difficulty: "medium",
  estimatedTime: 25,
  questions,
};

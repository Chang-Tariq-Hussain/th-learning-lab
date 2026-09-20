import type { QuizMeta, QuizQuestion } from "../types";
import { cacheQuestion as q } from "./it-cache-memory-explorer-builder";

/**
 * The Cache Memory Explorer's Practice bank — 15 shorter,
 * predict-then-check activities that sit behind the Golden Learning
 * Experience's PRACTICE step (`practice.quizId` in
 * `learning/data/information-technology-cache-memory-explorer.tsx`).
 *
 * Deliberately separate from `it-cache-memory-explorer-quiz.ts`, the
 * fuller 30-question topic quiz: this one leans on the lab (every item
 * carries a hint pointing at a specific tab so the student can go and
 * check rather than guess), while that one is the broader assessment.
 * Same two-`QuizMeta`-one-topic-slug precedent as the Paging and
 * Deadlock simulators; no new quiz engine. Because both banks tag
 * `topic: "cache-memory-explorer"`, the Practice Engine's topic picker
 * merges them into one 45-question option automatically.
 *
 * Coverage: cache purpose, memory hierarchy, L1/L2/L3, hit, miss, hit
 * and miss rate, temporal and spatial locality, cache lines, eviction,
 * replacement, mapping, address fields, and performance. No question is
 * duplicated from the 30-question bank. Every numeric answer was
 * checked against the simulation engine.
 */
const questions: QuizQuestion[] = [
  q({
    id: "it-cache-practice-001",
    difficulty: "easy",
    concept: "Cache Purpose",
    question: "Which best describes what a CPU cache is?",
    correct: "A small, fast memory close to the CPU that keeps copies of data it is likely to need again",
    wrong: [
      "A permanent place where files are kept when the power is off",
      "A larger, cheaper replacement for RAM",
      "A single register inside the ALU",
    ],
    slot: 1,
    explanation: "A cache holds copies of data and instructions, not the originals, and is small and close to the CPU so it can respond quickly. The originals stay in RAM.",
    hints: ["Open Memory Hierarchy and read the “Why cache exists” box."],
  }),
  q({
    id: "it-cache-practice-002",
    difficulty: "easy",
    concept: "Memory Hierarchy",
    question: "Which ordering runs from closest to the CPU to farthest away?",
    correct: "Registers, L1, L2, L3, RAM, storage",
    wrong: [
      "Registers, RAM, L1, L2, L3, storage",
      "L3, L2, L1, registers, storage, RAM",
      "Storage, RAM, L3, L2, L1, registers",
    ],
    slot: 3,
    explanation: "Layers closer to the CPU are smaller and faster; farther layers are larger and slower. The hierarchy runs registers → L1 → L2 → L3 → RAM → storage.",
    hints: ["Tap each layer in Memory Hierarchy — the diagram runs top to bottom, closest first."],
  }),
  q({
    id: "it-cache-practice-003",
    difficulty: "medium",
    concept: "L1, L2 and L3",
    question: "In the simplified model, the CPU asks for data. Which cache level is checked first, and why is it usually the smallest?",
    correct: "L1 — a small memory is easier to make very fast",
    wrong: [
      "L3 — the largest cache is the most likely to have it",
      "RAM — it holds the original data",
      "L2 — it balances speed and size",
    ],
    slot: 0,
    explanation: "L1 is checked first. Keeping it small is what lets it be so quick; larger caches sit further down. Real designs vary, but this is the common pattern.",
    hints: ["Switch to Intermediate level, open the Access Lab, and request an address. Watch which layer is checked first."],
  }),
  q({
    id: "it-cache-practice-004",
    difficulty: "easy",
    concept: "Cache Hit",
    question: "The CPU requests address 100, and address 100 is already in L1. What happens?",
    correct: "A cache hit: L1 supplies the data without going to a lower level",
    wrong: [
      "A cache miss: L1 must still check RAM to be sure it is current",
      "A cache hit, but the data is fetched from RAM",
      "An error, because the CPU can only read from RAM",
    ],
    slot: 2,
    explanation: "When the data is already in the cache, the request is answered there. That is the whole benefit of a cache: no trip to a lower level.",
    hints: ["In the Access Lab, access address 100 twice. The second result is the hit."],
  }),
  q({
    id: "it-cache-practice-005",
    difficulty: "easy",
    concept: "Cache Miss",
    question: "The cache is empty and the CPU reads address 42 for the first time. What is the outcome?",
    correct: "A miss: the data comes from RAM and a copy is stored in the cache",
    wrong: [
      "A hit, because the CPU can predict which addresses it will need",
      "A miss, but nothing is stored, so the next read misses too",
      "A hit from L3",
    ],
    slot: 0,
    explanation: "An empty cache has nothing to find, so the first access misses. The data is fetched from RAM and a copy is kept so the next request for it can hit.",
    hints: ["Press Reset cache in the Access Lab, then access address 42."],
  }),
  q({
    id: "it-cache-practice-006",
    difficulty: "medium",
    concept: "Hit Rate and Miss Rate",
    question: "After 100 accesses, the Live statistics panel shows 82 hits and 18 misses. What are the hit rate and miss rate?",
    correct: "82% hit rate and 18% miss rate",
    wrong: [
      "18% hit rate and 82% miss rate",
      "82% hit rate and 82% miss rate",
      "100% hit rate and 18% miss rate",
    ],
    slot: 3,
    explanation: "Hit rate = hits ÷ accesses = 82 ÷ 100 = 82%. Miss rate = misses ÷ accesses = 18%. The two always add up to 100%.",
    hints: ["Watch the Hit rate and Miss rate cards in the Access Lab as you make accesses. They always sum to 100%."],
  }),
  q({
    id: "it-cache-practice-007",
    difficulty: "medium",
    concept: "Spatial Locality",
    question: "A program adds up an array’s elements in order: element 0, 1, 2, 3, and so on. Which kind of locality does this mainly show?",
    correct: "Spatial locality — each access is next to the previous one",
    wrong: [
      "Temporal locality — every element is read many times",
      "Neither — array reads are unpredictable",
      "Coherence locality — the elements are shared between cores",
    ],
    slot: 2,
    explanation: "Reading consecutive elements uses neighbouring addresses, which is spatial locality. Caches exploit it by loading whole lines of neighbours together.",
    hints: ["Intermediate level → Locality & Lines → Spatial locality. Read 100 to 103 and change the line size."],
  }),
  q({
    id: "it-cache-practice-008",
    difficulty: "medium",
    concept: "Temporal Locality",
    question: "Which access pattern shows the strongest temporal locality?",
    correct: "A B A A B A",
    wrong: ["A B C D E F", "10 50 90 130 170 210", "10 11 12 13 14 15"],
    slot: 0,
    explanation: "Temporal locality means recently used data is used again soon. A B A A B A keeps returning to the same two blocks. The last option shows spatial locality instead, and the others never reuse anything.",
    hints: ["Locality & Lines → Temporal locality. Compare A B A A B A with A B C D E F."],
  }),
  q({
    id: "it-cache-practice-009",
    difficulty: "medium",
    concept: "Cache Lines",
    question: "Cache lines hold 4 words and are aligned on multiples of 4. A miss on address 201 loads which addresses into the cache?",
    correct: "200–203",
    wrong: ["201 only", "201–204", "198–201"],
    slot: 1,
    explanation: "201 ÷ 4 = 50 remainder 1, so it sits in block 50, which covers 200–203. The whole aligned line arrives together, including 200 even though it wasn’t requested.",
    hints: ["Locality & Lines → Cache lines with 4-word lines. Tap an address and see which band is copied."],
  }),
  q({
    id: "it-cache-practice-010",
    difficulty: "medium",
    concept: "Eviction",
    question: "A cache with 4 lines is completely full, and a block that isn’t cached is requested. What must happen?",
    correct: "One existing line is evicted to make room for the new block",
    wrong: [
      "The new block is discarded, so the CPU reads it from RAM every time",
      "The cache grows by one line",
      "The whole cache is emptied",
    ],
    slot: 3,
    explanation: "A cache has a fixed number of lines. When they are all in use, a line has to be replaced (evicted) to hold the new block. Which one goes depends on the replacement policy.",
    hints: ["Intermediate level → Eviction. Tap blocks until the cache is full, then tap one more."],
  }),
  q({
    id: "it-cache-practice-011",
    difficulty: "hard",
    concept: "Replacement Policies",
    question: "A 3-line cache loaded A, B, C in that order, then A was read again (a hit). Block D now arrives. Which line does each policy evict?",
    correct: "FIFO evicts A; LRU evicts B",
    wrong: ["FIFO evicts B; LRU evicts A", "Both evict A", "Both evict C"],
    slot: 1,
    explanation: "FIFO evicts the oldest arrival, A — even though A was just used. LRU evicts the least recently used: A was just read and C arrived after B, so B is the least recently used.",
    hints: ["Technical level → Replacement. Enter A B C A D with 3 lines and compare FIFO and LRU."],
  }),
  q({
    id: "it-cache-practice-012",
    difficulty: "hard",
    concept: "Cache Mapping",
    question: "A direct-mapped cache has 8 lines. Which line can memory block 21 occupy?",
    correct: "Line 5 only (21 mod 8 = 5)",
    wrong: ["Line 2 only (21 ÷ 8 = 2)", "Any of the 8 lines", "Line 21"],
    slot: 0,
    explanation: "Direct-mapped means one possible line: block number mod number of lines. 21 mod 8 = 5. The quotient (2) is not the line — it is closer to what becomes part of the tag.",
    hints: ["Technical level → Mapping. Tap block 21 and read the Direct-mapped diagram."],
  }),
  q({
    id: "it-cache-practice-013",
    difficulty: "hard",
    concept: "Address Fields",
    question: "A cache has 4-word lines and 8 sets. How many offset bits and index bits does an address use?",
    correct: "2 offset bits and 3 index bits",
    wrong: ["3 offset bits and 2 index bits", "4 offset bits and 8 index bits", "2 offset bits and 8 index bits"],
    slot: 2,
    explanation: "The offset chooses one of 4 words, which takes log₂(4) = 2 bits. The index chooses one of 8 sets, which takes log₂(8) = 3 bits. The remaining bits are the tag.",
    hints: ["Technical level → Tag / Index / Offset. Set 4-word lines and 8 sets, then read the field bar."],
  }),
  q({
    id: "it-cache-practice-014",
    difficulty: "medium",
    concept: "Performance",
    question: "The hit time is 1 unit, the miss penalty is 50 units, and the miss rate is 10%. What is the average access time?",
    correct: "6 units",
    wrong: ["5 units", "51 units", "11 units"],
    slot: 3,
    explanation: "Average access time ≈ hit time + miss rate × miss penalty = 1 + 0.10 × 50 = 6. Forgetting the hit time gives 5; ignoring the miss rate altogether gives 51.",
    hints: ["Intermediate level → Performance Lab → Set a hit rate. Choose 90% with the default latencies."],
  }),
  q({
    id: "it-cache-practice-015",
    difficulty: "hard",
    concept: "Performance",
    question: "A program keeps missing because the data it reuses is slightly bigger than the cache. Which change would most likely lower its average access time?",
    correct: "Enlarge the cache so the reused data fits",
    wrong: [
      "Read the same addresses in a random order",
      "Shave a fraction off the hit time while still missing every time",
      "Reduce the line size to 1 word",
    ],
    slot: 0,
    explanation: "When the working set is just too large, lines are evicted before they are reused, so nearly every access misses. Making room for the whole set turns those misses into hits, which cuts the average far more than a tiny hit-time change.",
    hints: ["Experiments → Experiment 5. Compare 4 lines with 8 lines on the same pattern."],
  }),
];

export const informationTechnologyCacheMemoryExplorerPracticeQuiz: QuizMeta = {
  id: "it-cache-memory-explorer-practice",
  title: "Cache Memory Explorer Practice",
  subjectSlug: "information-technology",
  subjectLabel: "Information Technology",
  topicLabel: "Cache Memory Explorer",
  colorToken: "it",
  backHref: "/dashboard/information-technology/cache-memory-explorer",
  description:
    "Fifteen predict-then-check activities covering why cache exists, the memory hierarchy, L1/L2/L3, hits and misses, hit and miss rate, locality, cache lines, eviction, replacement, mapping, address fields, and performance — each with a hint pointing at the tab where you can verify it.",
  difficulty: "medium",
  estimatedTime: 14,
  questions,
};

import type { TopicContent } from "../types";

/**
 * Ratio Challenge — Mathematics Ratio & Proportion unit's advanced
 * consolidation topic (marked `isChallenge: true` in
 * `@/features/learning-path/data/mathematics-foundations.ts`, sitting
 * after Proportion Builder, Cross Multiplication, and Real-Life
 * Ratios). Reuses the existing challenge simulation
 * (`@/features/subjects/mathematics/ratio-challenge`) exactly as-is —
 * its own five question kinds (missing value, simplify, equivalent
 * multiple-choice, equivalent drag-and-drop, word problem), each
 * randomly generated at one of three difficulty levels, with a
 * streak-based auto level-up/level-down and instant, worked feedback
 * on every answer. Because the simulation already *is* a mixed,
 * self-scaling practice engine, this topic's Learn section stays
 * deliberately brief — a review, not a re-teach of Ratio, Ratio
 * Comparison, Proportion Builder, Cross Multiplication, or Real-Life
 * Ratios, which already own those full lessons — and its own Practice
 * step points at a new, curated 30-question bank
 * (`@/features/quiz-engine/data/mathematics-ratio-challenge-quiz.ts`)
 * that deliberately mixes concepts across problems (rather than
 * duplicating any single-concept question already in the earlier
 * banks), matching the "challenge" framing. Challenge scenarios below
 * are a small, hand-picked set of harder, multi-step problems — a
 * step up from what the simulation generates on its own — rather than
 * duplicating the endless generator.
 */
export const mathematicsRatioChallengeContent: TopicContent = {
  subjectSlug: "mathematics",
  topicSlug: "ratio-challenge",
  title: "Ratio Challenge",
  subjectLabel: "Mathematics",
  topicLabel: "Ratio & Proportion",
  colorToken: "math",
  simulationHref: "/dashboard/mathematics/ratio-challenge",

  // -------------------------------------------------------------
  // LEARN (kept concise — a review, not a re-teach)
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Recall how to simplify a ratio and recognize when two ratios are equivalent.",
      "Recall how to solve a proportion for a missing value using a scale factor or cross multiplication.",
      "Recognize which strategy a ratio problem calls for from how it's phrased.",
      "Translate a real-life word problem into a ratio before solving it.",
    ],
    concepts: [
      {
        term: "Simplifying a ratio",
        explanation:
          "Divide both parts of a ratio by their greatest common factor to reach its simplest form — 12 : 8 simplifies to 3 : 2.",
      },
      {
        term: "Equivalent ratios",
        explanation:
          "Two ratios are equivalent when scaling one by some factor produces the other — 2 : 5 and 6 : 15 are equivalent because ×3 turns one into the other.",
      },
      {
        term: "Proportions and missing values",
        explanation:
          "A proportion states that two ratios are equal, a : b = c : d. If three of the four values are known, the fourth can be found by identifying the scale factor between the two sides, or by cross multiplying.",
        formula: "\\dfrac{a}{b} = \\dfrac{c}{d} \\iff a \\times d = b \\times c",
        formulaCaption: "Cross multiplication",
      },
      {
        term: "Real-life ratio reasoning",
        explanation:
          "Recipes, map scales, and mixing problems all hide a ratio inside a sentence — the first step is always identifying the two quantities being compared and the ratio that connects them, before doing any arithmetic.",
      },
    ],
    whyItMatters:
      "Real ratio problems rarely arrive labeled with the type of problem they are — mixing several problem types together, the way this challenge does, is what genuinely tests whether you can recognize which strategy a situation calls for, not just execute one memorized method on cue.",
    keyTerms: [
      { term: "Ratio", definition: "A comparison of two quantities, written a : b." },
      { term: "Equivalent ratios", definition: "Ratios that describe the same relationship after scaling." },
      { term: "Proportion", definition: "A statement that two ratios are equal, a : b = c : d." },
      { term: "Cross multiplication", definition: "Multiplying diagonally across a proportion to test or solve it: a×d vs b×c." },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Reason through each scenario before solving, then confirm your thinking in the challenge below.",
    scenarios: [
      {
        id: "mathematics-ratio-challenge-predict-001",
        scenario: "You're comparing 3 : 4 against 5 : 7.",
        question: "Which ratio is larger?",
        options: [
          { id: "first", label: "3 : 4" },
          { id: "second", label: "5 : 7" },
          { id: "equal", label: "They're equal" },
          { id: "cant-tell", label: "Cannot be determined" },
        ],
        actualResultOptionId: "first",
        explanation: "3/4 = 0.75 and 5/7 ≈ 0.714. Since 0.75 is greater, 3 : 4 is the larger ratio.",
        hint: "Try converting both ratios to decimals, or cross multiply: 3×7 vs 4×5.",
      },
      {
        id: "mathematics-ratio-challenge-predict-002",
        scenario: "You see the proportion 4 : 6 = 10 : ?",
        question: "What value is missing?",
        options: [
          { id: "fifteen", label: "15" },
          { id: "twelve", label: "12" },
          { id: "eighteen", label: "18" },
          { id: "nine", label: "9" },
        ],
        actualResultOptionId: "fifteen",
        explanation: "4 : 6 simplifies to 2 : 3. Scaling 2 : 3 so the first term is 10 means multiplying by 5, giving 10 : 15 — the missing value is 15.",
        hint: "What scale factor turns 4 into 10?",
      },
      {
        id: "mathematics-ratio-challenge-predict-003",
        scenario: "Two ratios are given: 6 : 9 and 8 : 12.",
        question: "Are these two ratios equivalent?",
        options: [
          { id: "yes", label: "Yes" },
          { id: "no", label: "No" },
          { id: "cant-tell", label: "Cannot be determined" },
        ],
        actualResultOptionId: "yes",
        explanation: "Both simplify to 2 : 3 (6:9 ÷3, 8:12 ÷4), so they describe the exact same relationship and are equivalent.",
        hint: "Simplify both ratios to their lowest terms and compare.",
      },
      {
        id: "mathematics-ratio-challenge-predict-004",
        scenario: "A recipe uses flour and sugar in a ratio of 5 : 2. A baker wants to use 20 cups of flour.",
        question: "About how much sugar will that need, roughly?",
        options: [
          { id: "eight", label: "Roughly 8 cups" },
          { id: "four", label: "Roughly 4 cups" },
          { id: "twenty", label: "Roughly 20 cups" },
          { id: "two", label: "Roughly 2 cups" },
        ],
        actualResultOptionId: "eight",
        explanation: "20 cups of flour is 4 times the base amount of 5, so sugar scales the same way: 4 × 2 = 8 cups.",
        hint: "Find the scale factor from 5 to 20 first, then apply it to 2.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Solve the generated challenge — the type varies each round: missing value, simplify, equivalent ratio (multiple choice or drag-and-drop), or a word problem.",
      "Submit your answer for instant, worked feedback, right or wrong.",
      "Answer correctly to build a streak; every three in a row raises the difficulty. Miss one and the difficulty eases back off.",
      "Use Restart at any time to reset your score and start again from Beginner.",
    ],
    tryThis: [
      "Before solving, name out loud which of the five problem types you're looking at.",
      "After missing a challenge, read the explanation and identify exactly which step went wrong before continuing.",
      "See how many levels you can climb by staying accurate rather than rushing through answers.",
      "Try to reach Advanced difficulty and stay there for a full streak of three.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "mathematics-ratio-challenge-explain-001",
        question: "Why does the challenge lower the difficulty after a wrong answer instead of just repeating the same level?",
        answer:
          "Missing a question usually means the current difficulty's numbers or problem type haven't been mastered yet. Easing back off gives another chance to build the underlying skill at a level that's actually solvable right now, rather than repeatedly failing at a level that's still too hard.",
      },
      {
        id: "mathematics-ratio-challenge-explain-002",
        question: "Why does a missing-value problem always have exactly one correct answer?",
        answer:
          "A proportion states that two ratios describe the exact same relationship. Once three of the four numbers are fixed, there's only one scale factor connecting the two sides — and only one value that keeps the relationship intact.",
      },
      {
        id: "mathematics-ratio-challenge-explain-003",
        question: "Why can two ratios with very different-looking numbers still be equivalent?",
        answer:
          "A ratio describes a relationship between two quantities, not a fixed pair of numbers. Any pair that simplifies to the same simplest form — no matter how large or different the original numbers look — describes that identical relationship.",
      },
      {
        id: "mathematics-ratio-challenge-explain-004",
        question: "Why is translating a word problem into numbers the hardest part, rather than the arithmetic itself?",
        answer:
          "Once the ratio and the known quantity are correctly identified from the sentence, solving it is the same missing-value or scaling step used everywhere else. The real skill being tested is reading past the story to find which two quantities are being compared and in what order.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "mathematics-ratio-challenge",
  },

  // -------------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------------
  challenge: {
    intro: "Harder, multi-step problems than the simulation generates on its own. Use the Ratio Challenge simulation above to practice the underlying skills, then work through these.",
    scenarios: [
      {
        id: "mathematics-ratio-challenge-challenge-001",
        title: "Simplify, Then Compare",
        scenario: "You're given two ratios: 18 : 24 and 21 : 28.",
        objective: "Simplify both ratios and determine whether they're equivalent.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "correct", label: "Yes — both simplify to 3 : 4" },
            { id: "wrong-no", label: "No — they simplify to different ratios" },
            { id: "wrong-one", label: "Only 18 : 24 can be simplified" },
          ],
          correctOptionId: "correct",
        },
        explanation: "18 : 24 simplifies to 3 : 4 (÷6), and 21 : 28 also simplifies to 3 : 4 (÷7) — both describe the same relationship.",
        hints: ["Find the greatest common factor of each pair before comparing."],
      },
      {
        id: "mathematics-ratio-challenge-challenge-002",
        title: "Two-Step Missing Value",
        scenario: "You're given the chain 2 : 5 = 6 : ? = ? : 40.",
        objective: "Find both missing values.",
        requiresExperiment: false,
        answer: { mode: "numeric", unit: "the second missing value", target: 16, tolerance: 0 },
        explanation: "2 : 5 scaled by 3 gives 6 : 15, so the first missing value is 15. Scaling 2 : 5 so the second term is 40 means multiplying by 8, giving 16 : 40 — so the second missing value is 16.",
        hints: [
          "Solve the first missing value the way you would for any single proportion.",
          "For the second, find what scale factor makes the second term of 2 : 5 equal to 40.",
        ],
      },
      {
        id: "mathematics-ratio-challenge-challenge-003",
        title: "Recipe Scale-Up",
        scenario: "A recipe for 12 cookies uses flour and butter in a ratio of 3 : 1. You want to make 60 cookies.",
        objective: "How much flour and butter (in the same units as the original ratio) will the scaled-up recipe need?",
        requiresExperiment: false,
        answer: { mode: "numeric", unit: "flour amount, in original ratio units", target: 15, tolerance: 0 },
        explanation: "Scaling 12 cookies to 60 cookies is ×5. Applying that same ×5 to the 3 : 1 ratio gives 15 : 5 — 15 parts flour to 5 parts butter.",
        hints: [
          "Find the scale factor from 12 cookies to 60 cookies first.",
          "Apply that same scale factor to both parts of the 3 : 1 ratio.",
        ],
      },
      {
        id: "mathematics-ratio-challenge-challenge-004",
        title: "Map Scale, Two Distances",
        scenario: "A map's scale is 2 cm : 15 km. Two cities are 7 cm apart on the map, and two towns are 3.5 cm apart.",
        objective: "Find the real distance between the two cities.",
        requiresExperiment: false,
        answer: { mode: "numeric", unit: "km", target: 52.5, tolerance: 0.5 },
        explanation: "The scale 2 cm : 15 km means each cm represents 7.5 km. 7 cm × 7.5 km/cm = 52.5 km.",
        hints: [
          "Find the unit rate: how many km does 1 cm represent?",
          "Multiply that unit rate by 7 cm.",
        ],
      },
      {
        id: "mathematics-ratio-challenge-challenge-005",
        title: "Which Mix Is Stronger?",
        scenario: "Mixture A uses 3 parts concentrate to 10 parts water. Mixture B uses 2 parts concentrate to 7 parts water.",
        objective: "Determine which mixture is stronger (more concentrate relative to water).",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "correct", label: "Mixture A is stronger" },
            { id: "wrong-b", label: "Mixture B is stronger" },
            { id: "wrong-equal", label: "They're equally strong" },
          ],
          correctOptionId: "correct",
        },
        explanation: "3/10 = 0.30 and 2/7 ≈ 0.286. Since 0.30 > 0.286, Mixture A has more concentrate relative to water.",
        hints: ["Convert each ratio to a decimal (concentrate ÷ water) and compare.", "Alternatively, cross multiply: 3×7 vs 10×2."],
      },
      {
        id: "mathematics-ratio-challenge-challenge-006",
        title: "Three-Part Ratio Split",
        scenario: "A prize of $180 is split between three people in the ratio 2 : 3 : 4.",
        objective: "How much does the person with the largest share receive?",
        requiresExperiment: false,
        answer: { mode: "numeric", unit: "$", target: 80, tolerance: 0 },
        explanation: "The ratio parts add to 2 + 3 + 4 = 9. Each part is worth $180 ÷ 9 = $20. The largest share is 4 parts: 4 × $20 = $80.",
        hints: [
          "Add up all the parts of the ratio first.",
          "Divide the total amount by the sum of the parts to find the value of one part.",
        ],
      },
      {
        id: "mathematics-ratio-challenge-challenge-007",
        title: "Spot the Near-Match",
        scenario: "You're given the ratio 5 : 12. A second ratio, 6 : 13, looks close in value.",
        objective: "Determine whether 6 : 13 is actually equivalent to 5 : 12, and explain why or why not.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "correct", label: "Not equivalent — 5×13 = 65 but 12×6 = 72" },
            { id: "wrong-equiv", label: "Equivalent, since both ratios are close in value" },
            { id: "wrong-cant-tell", label: "Cannot be determined without more information" },
          ],
          correctOptionId: "correct",
        },
        explanation: "Cross multiplying gives 5×13 = 65 and 12×6 = 72. Since these don't match, the ratios are close in decimal value (5/12 ≈ 0.417, 6/13 ≈ 0.462) but not actually equivalent.",
        hints: ["Being close in decimal value isn't the same as being equivalent — check with cross multiplication."],
      },
      {
        id: "mathematics-ratio-challenge-challenge-008",
        title: "Unit Rate Shopping Decision",
        scenario: "Store A sells a 12-pack of juice boxes for $9. Store B sells an 18-pack for $12.60.",
        objective: "Which store offers the better price per juice box?",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "correct", label: "Store B ($0.70 per box)" },
            { id: "wrong-a", label: "Store A ($0.75 per box)" },
            { id: "wrong-equal", label: "Both cost the same per box" },
          ],
          correctOptionId: "correct",
        },
        explanation: "Store A: $9 ÷ 12 = $0.75 per box. Store B: $12.60 ÷ 18 = $0.70 per box. Store B is the better deal.",
        hints: ["Divide each total price by its number of boxes to get a unit rate."],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "mathematics",
      topicSlug: "real-life-ratios",
      label: "Real-Life Ratios",
      href: "/dashboard/mathematics/real-life-ratios",
      reason: "Revisit the illustrated word-problem style this challenge mixes in with other question types.",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "cross-multiplication-explorer",
      label: "Cross Multiplication",
      href: "/dashboard/mathematics/cross-multiplication-explorer",
      reason: "Review the equivalence check used throughout this challenge's missing-value and equivalence problems.",
    },
  ],
};

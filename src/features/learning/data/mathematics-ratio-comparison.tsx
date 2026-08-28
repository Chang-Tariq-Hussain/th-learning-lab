import type { TopicContent } from "../types";

/**
 * Ratio Comparison, Mathematics Batch 2 topic 2 of 7. Reuses the
 * existing Ratio Comparison simulation
 * (`@/features/subjects/mathematics/ratio-comparison`) — two
 * slider-driven ratio bars that visually confirm equivalence.
 * `learn`/`explore` content is adapted from the simulation page's
 * existing `SimulationLearnMore` block, with unit-rate reasoning
 * folded into Learn per the brief. `practice.quizId` points at the
 * 30-question bank in
 * `@/features/quiz-engine/data/mathematics-ratio-comparison-quiz.ts`.
 */
export const mathematicsRatioComparisonContent: TopicContent = {
  subjectSlug: "mathematics",
  topicSlug: "ratio-comparison",
  title: "Ratio Comparison",
  subjectLabel: "Mathematics",
  topicLabel: "Ratio & Proportion",
  colorToken: "math",
  simulationHref: "/dashboard/mathematics/ratio-comparison",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Determine whether two ratios are equivalent.",
      "Explain what it means for two ratios to \"line up\" visually.",
      "Use cross multiplication or simplifying to check equivalence numerically.",
      "Use unit rate to compare two ratios or find the better value.",
    ],
    concepts: [
      {
        term: "Equivalent ratios",
        explanation:
          "Two ratios are equivalent when they represent the same comparison, even if the actual numbers are different. 1:2 and 3:6 are equivalent, since both describe \"half as much.\"",
      },
      {
        term: "Checking equivalence",
        explanation:
          "One reliable way to check is cross multiplying: for a:b and c:d, they're equivalent if a × d equals b × c. If both products match, the ratios are equal.",
        formula: "\\dfrac{a}{b} = \\dfrac{c}{d} \\iff a \\times d = b \\times c",
        formulaCaption: "Cross-multiplication test for equivalence",
      },
      {
        term: "Why the bars line up",
        explanation:
          "When two ratios are equivalent, splitting a bar according to each ratio produces the exact same proportional split — that's why matching bars visually confirms what the cross-multiplication check proves numerically.",
      },
      {
        term: "Unit rate",
        explanation:
          "Scaling a ratio so the second quantity becomes 1 turns it into a unit rate — like price per item or distance per hour — which makes two different-looking ratios directly comparable at a glance.",
        formula: "\\dfrac{a}{b} : 1",
        formulaCaption: "A ratio rewritten as a unit rate",
      },
    ],
    whyItMatters:
      "Recognizing equivalent ratios is what lets you scale a recipe up or down, compare prices per unit while shopping, or check if a map's scale matches the real distances it represents. It's the same skill whether you're comparing 2:3 to 4:6 on a screen or comparing a small batch of paint mix to a large one in real life.",
    keyTerms: [
      { term: "Equivalent ratios", definition: "Two ratios that represent the same comparison." },
      { term: "Cross multiplication", definition: "Multiplying diagonally across two ratios to test equivalence: a×d vs b×c." },
      { term: "Unit rate", definition: "A ratio scaled so the second quantity equals 1, e.g. dollars per item." },
    ],
    misconceptions: [
      {
        id: "misconception-bigger-numbers-bigger-ratio",
        misconception: "A ratio with bigger numbers is automatically a bigger ratio.",
        correction:
          "A ratio's size comes from the relationship between its two numbers, not their raw size. 2:3 is actually bigger than 5:9, even though 5 and 9 are larger numbers — always compare the relationship (as a fraction or via cross multiplication), not the digits.",
      },
      {
        id: "misconception-order-doesnt-matter-comparison",
        misconception: "Reversing a ratio's order, like turning 3:4 into 4:3, doesn't change its value.",
        correction:
          "3:4 and 4:3 are reciprocals of each other — they're only equal to their own reverse when both numbers are equal. Reversing the order generally produces a genuinely different ratio.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Commit to a prediction for each scenario, then check it against the sliders in Ratio Comparison below.",
    scenarios: [
      {
        id: "mathematics-ratio-comparison-predict-001",
        scenario: "The first ratio bar is set to 2 : 3.",
        question: "Which of these, if set as the second ratio, will make the bars line up exactly?",
        options: [
          { id: "4-6", label: "4 : 6" },
          { id: "3-4", label: "3 : 4" },
          { id: "4-5", label: "4 : 5" },
          { id: "5-6", label: "5 : 6" },
        ],
        actualResultOptionId: "4-6",
        explanation: "4 : 6 simplifies to 2 : 3, the exact same ratio, so the two bars split at the identical point and line up.",
        hint: "Which option simplifies to the same simplest form as 2 : 3?",
      },
      {
        id: "mathematics-ratio-comparison-predict-002",
        scenario: "You compare 2 : 3 and 3 : 5 as fractions.",
        question: "Which is the greater ratio?",
        options: [
          { id: "2-3", label: "2 : 3" },
          { id: "3-5", label: "3 : 5" },
          { id: "equal", label: "They are equal" },
          { id: "cant-tell", label: "Cannot be determined" },
        ],
        actualResultOptionId: "2-3",
        explanation: "2/3 ≈ 0.667 and 3/5 = 0.6. Since 0.667 is greater, 2 : 3 is the bigger ratio.",
        hint: "Try converting both ratios to decimals by dividing.",
      },
      {
        id: "mathematics-ratio-comparison-predict-003",
        scenario: "Mixture A uses 1 part concentrate to 4 parts water. Mixture B uses 2 parts concentrate to 8 parts water.",
        question: "Which mixture is stronger (has more concentrate relative to water)?",
        options: [
          { id: "same", label: "Neither — they're equally strong" },
          { id: "a-stronger", label: "Mixture A is stronger" },
          { id: "b-stronger", label: "Mixture B is stronger" },
          { id: "cant-tell", label: "Cannot be determined" },
        ],
        actualResultOptionId: "same",
        explanation: "1:4 and 2:8 both simplify to 1:4 — the two mixtures are exactly the same strength, just made in different batch sizes.",
        hint: "Do 2 and 8 share the same common factor with 1 and 4?",
      },
      {
        id: "mathematics-ratio-comparison-predict-004",
        scenario: "You want to compare $6 for 4 apples against $9 for 5 apples using unit rate.",
        question: "Which is the better value per apple?",
        options: [
          { id: "first", label: "$6 for 4 apples ($1.50 each)" },
          { id: "second", label: "$9 for 5 apples ($1.80 each)" },
          { id: "same", label: "Both cost the same per apple" },
          { id: "cant-tell", label: "Cannot be compared" },
        ],
        actualResultOptionId: "first",
        explanation: "$6 ÷ 4 = $1.50 per apple, while $9 ÷ 5 = $1.80 per apple. The first deal has the lower unit price.",
        hint: "Divide each total price by its number of apples.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Drag the sliders on the first ratio bar to set your starting comparison.",
      "Drag the sliders on the second ratio bar and watch whether the two bars line up.",
      "When they match, check the two ratios' numbers against each other to see the pattern.",
      "Try to find two ratios that look close but aren't actually equivalent.",
    ],
    tryThis: [
      "Set the first ratio to 2:3, then find a different-looking ratio that's equivalent to it.",
      "Use cross multiplication to verify your answer instead of just checking visually.",
      "Try to build two ratios that are close in value but not actually equivalent — how far off are they?",
      "Convert one of the ratios to a unit rate and use it to predict whether the bars will line up before you check.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "mathematics-ratio-comparison-explain-001",
        question: "Why does cross multiplication reliably test whether two ratios are equivalent?",
        answer:
          "Cross multiplication clears the denominators from a/b = c/d at once, turning the comparison into a×d vs b×c. If those two products match, the original fractions — and therefore the ratios — must be equal.",
      },
      {
        id: "mathematics-ratio-comparison-explain-002",
        question: "Why can two ratios with completely different numbers still be equivalent?",
        answer:
          "A ratio describes a relationship, not a fixed pair of numbers. Any pair that simplifies to the same simplest form describes that same relationship, regardless of how large or different the original numbers look.",
      },
      {
        id: "mathematics-ratio-comparison-explain-003",
        question: "Why isn't it safe to compare ratios just by looking at which numbers are bigger?",
        answer:
          "A ratio's value depends on the relationship between its two numbers, like a fraction's value — not on the size of the digits themselves. 2:3 is bigger than 5:9 even though 5 and 9 are larger numbers, because 2/3 ≈ 0.67 is greater than 5/9 ≈ 0.56.",
      },
      {
        id: "mathematics-ratio-comparison-explain-004",
        question: "Why is converting to a unit rate a useful way to compare ratios in real-life problems like shopping?",
        answer:
          "A unit rate puts every option on the same footing — price per single item, distance per single hour — so you can compare deals or speeds directly without needing to find a common multiple first.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "mathematics-ratio-comparison",
  },

  // -------------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Use the Ratio Comparison simulation above to test and verify these scenarios where it helps. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "mathematics-ratio-comparison-challenge-001",
        title: "Find the Matching Ratio",
        scenario: "The first ratio bar is fixed at 3 : 5.",
        objective: "Set the second ratio bar so it lines up exactly, using numbers other than 3 and 5.",
        constraints: [{ id: "c1", label: "The second ratio must not be 3 : 5 itself." }],
        tools: [{ id: "sliders", label: "Two ratio sliders" }],
        answer: { mode: "numeric", unit: "first number of a matching ratio (e.g. 6 for 6:10)", target: 6, tolerance: 0 },
        explanation: "Doubling both parts of 3 : 5 gives 6 : 10 — a different-looking ratio that still simplifies to 3 : 5, so its bar lines up exactly.",
        hints: [
          "Multiply both numbers in 3 : 5 by the same factor.",
          "Try doubling both parts of the ratio.",
        ],
      },
      {
        id: "mathematics-ratio-comparison-challenge-002",
        title: "Ratio Comparison Challenge: Which Is Greater?",
        scenario: "You're given two ratios: 5 : 8 and 4 : 7.",
        objective: "Determine which ratio is greater and verify your answer with cross multiplication.",
        requiresExperiment: false,
        answer: { mode: "choice", options: [{ id: "a", label: "5 : 8 is greater" }, { id: "b", label: "4 : 7 is greater" }, { id: "c", label: "They are equal" }], correctOptionId: "a" },
        explanation: "Cross multiplying: 5×7=35 and 8×4=32. Since 35 > 32, 5/8 > 4/7, so 5 : 8 is the greater ratio.",
        hints: [
          "Cross multiply: compare 5×7 with 8×4.",
          "The ratio whose cross product is larger (on the correct diagonal) is the bigger ratio.",
        ],
      },
      {
        id: "mathematics-ratio-comparison-challenge-003",
        title: "Better Value Per Item",
        scenario: "One store sells 6 pens for $12. Another sells 9 pens for $16.50.",
        objective: "Find the unit price per pen at each store and determine which is the better deal.",
        requiresExperiment: false,
        answer: { mode: "choice", options: [{ id: "a", label: "The first store ($2.00 per pen)" }, { id: "b", label: "The second store ($1.83 per pen)" }, { id: "c", label: "Both cost the same" }], correctOptionId: "b" },
        explanation: "First store: $12 ÷ 6 = $2.00 per pen. Second store: $16.50 ÷ 9 ≈ $1.83 per pen — the second store is the better deal.",
        hints: [
          "Divide each total price by its number of pens to get a unit rate.",
          "The lower price per pen is the better deal.",
        ],
      },
      {
        id: "mathematics-ratio-comparison-challenge-004",
        title: "Spot the Near-Match",
        scenario: "The first ratio is 4 : 9. You need a second ratio that looks close but is NOT actually equivalent.",
        objective: "Build a second ratio on the simulation that is close to 4 : 9 in value but doesn't line up exactly, then explain why.",
        tools: [{ id: "sliders", label: "Two ratio sliders" }],
        answer: { mode: "numeric", unit: "how far apart the bars land (as a percent, roughly)", target: 2, tolerance: 5 },
        explanation: "A ratio like 5 : 11 is close to 4 : 9 in value (4/9 ≈ 0.444, 5/11 ≈ 0.455) but not equivalent — the bars land near each other but don't line up exactly, since cross multiplying gives 4×11=44 and 9×5=45, which don't match.",
        hints: [
          "Try a ratio with numbers just one more than a multiple of 4 : 9's numbers, like 5 : 11.",
          "Use cross multiplication to confirm the two ratios are close but not equal.",
        ],
      },
    ],
  },

  relatedTopics: [],
};

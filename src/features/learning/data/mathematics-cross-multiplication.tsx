import type { TopicContent } from "../types";

/**
 * Cross Multiplication, Mathematics Batch 2 topic 4 of 7. Reuses the
 * existing Cross Multiplication Explorer simulation
 * (`@/features/subjects/mathematics/cross-multiplication-explorer`)
 * — an animated diagonal-products diagram. Per the brief, cross
 * multiplication is deliberately NOT taught as a standalone trick:
 * Learn and Explain both tie it back to "equal ratios stay equal when
 * you clear their denominators," reusing the equal-ratios framing
 * from Ratio Comparison and Proportion. `learn`/`explore` content is
 * adapted from the simulation page's `SimulationLearnMore` block.
 * `practice.quizId` points at the 30-question bank in
 * `@/features/quiz-engine/data/mathematics-cross-multiplication-quiz.ts`.
 */
export const mathematicsCrossMultiplicationContent: TopicContent = {
  subjectSlug: "mathematics",
  topicSlug: "cross-multiplication-explorer",
  title: "Cross Multiplication",
  subjectLabel: "Mathematics",
  topicLabel: "Ratio & Proportion",
  colorToken: "math",
  simulationHref: "/dashboard/mathematics/cross-multiplication-explorer",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Perform cross multiplication on two fractions to test if they're equal.",
      "Explain why multiplying diagonally works as a shortcut for comparing fractions.",
      "Use cross multiplication to solve for an unknown value in an equation of fractions.",
      "Check a cross-multiplication answer by substituting it back into the original proportion.",
    ],
    concepts: [
      {
        term: "Cross multiplication",
        explanation:
          "For two fractions set equal to each other, multiply the numerator of one by the denominator of the other, on both diagonals. If the two results match, the fractions are equal.",
        formula: "\\dfrac{a}{b} = \\dfrac{c}{d} \\;\\Rightarrow\\; a \\times d = b \\times c",
        formulaCaption: "Cross multiplication",
      },
      {
        term: "Why it works",
        explanation:
          "Cross multiplication is really just clearing the denominators from both sides of the equation at once, which turns a fraction comparison into a simple multiplication comparison — same idea, faster to compute.",
      },
      {
        term: "Solving for an unknown",
        explanation:
          "If one number in the equation is missing, cross multiplying turns the problem into a simple one-step (or two-step) equation you can solve directly for that unknown.",
      },
      {
        term: "Checking the answer",
        explanation:
          "Substituting the value you found back into the original proportion — and confirming both cross products still match — is a fast, reliable way to catch arithmetic slips.",
      },
    ],
    whyItMatters:
      "Cross multiplication is one of the fastest tools for comparing fractions or solving for a missing value in a proportion, and it shows up constantly in unit conversions, recipe scaling, and map-reading, where you're regularly setting one ratio equal to another and solving for what's missing.",
    keyTerms: [
      { term: "Cross product", definition: "The result of multiplying diagonally across two fractions set equal to each other." },
      { term: "Unknown", definition: "The missing value in a proportion, usually written as x, that cross multiplication solves for." },
    ],
    misconceptions: [
      {
        id: "misconception-cross-multiplication-magic-trick",
        misconception: "Cross multiplication is just a memorized trick with no real reason behind it.",
        correction:
          "Cross multiplication comes directly from multiplying both sides of a/b = c/d by both denominators, b and d — it's ordinary algebra, not a shortcut invented separately from the rest of what you know about equal fractions.",
      },
      {
        id: "misconception-forgetting-final-division",
        misconception: "Once you've cross multiplied, the equation is already solved.",
        correction:
          "Cross multiplying only produces a new equation, like 3x = 18 — the final step of dividing to isolate the unknown still has to happen before you have your answer.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Predict each result, then check it in the Cross Multiplication Explorer below.",
    scenarios: [
      {
        id: "mathematics-cross-multiplication-predict-001",
        scenario: "You're comparing 3/4 and 6/8 using cross multiplication.",
        question: "Will the two diagonal products match?",
        options: [
          { id: "yes", label: "Yes — both diagonal products equal 24" },
          { id: "no", label: "No — the products will be different" },
          { id: "cant-tell", label: "Cannot be determined without a calculator" },
          { id: "only-one", label: "Only one diagonal product exists" },
        ],
        actualResultOptionId: "yes",
        explanation: "3×8=24 and 4×6=24 — both diagonal products match, confirming 3/4 and 6/8 are equal.",
        hint: "Does 6/8 simplify to the same fraction as 3/4?",
      },
      {
        id: "mathematics-cross-multiplication-predict-002",
        scenario: "You set up 2/5 = x/20 in the explorer.",
        question: "What value of x will make the cross products match?",
        options: [
          { id: "8", label: "8" },
          { id: "10", label: "10" },
          { id: "4", label: "4" },
          { id: "40", label: "40" },
        ],
        actualResultOptionId: "8",
        explanation: "Cross multiplying: 2×20 = 5×x, so 40 = 5x, giving x = 8.",
        hint: "Set 2×20 equal to 5×x and solve.",
      },
      {
        id: "mathematics-cross-multiplication-predict-003",
        scenario: "You change one number in a matching pair of fractions so they're no longer exactly equal.",
        question: "What will happen to the two diagonal products?",
        options: [
          { id: "stop-matching", label: "They will stop matching" },
          { id: "still-match", label: "They will still match" },
          { id: "become-zero", label: "Both will become zero" },
          { id: "cant-tell", label: "Cannot be predicted" },
        ],
        actualResultOptionId: "stop-matching",
        explanation: "Once the fractions are no longer equal, their cross products necessarily diverge — that mismatch is exactly what signals the fractions aren't equal anymore.",
        hint: "Does the cross-multiplication test only give a match when the fractions are truly equal?",
      },
      {
        id: "mathematics-cross-multiplication-predict-004",
        scenario: "You solve x/9 = 12/27 by cross multiplying.",
        question: "What is x?",
        options: [
          { id: "4", label: "4" },
          { id: "3", label: "3" },
          { id: "12", label: "12" },
          { id: "36", label: "36" },
        ],
        actualResultOptionId: "4",
        explanation: "Cross multiplying: x×27 = 9×12, so 27x = 108, giving x = 4.",
        hint: "Set x×27 equal to 9×12 and solve for x.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Look at the two fractions shown, set equal to each other.",
      "Watch each diagonal multiplication animate one at a time.",
      "Compare the two diagonal products to confirm whether the fractions are equal.",
      "Change a number in either fraction and see how the diagonal products respond.",
    ],
    tryThis: [
      "Change one fraction so the two are no longer equal — watch how the diagonal products stop matching.",
      "Use cross multiplication by hand to solve for a missing number, then check it against the simulation.",
      "Think of a proportion problem from real life where cross multiplication would be the fastest way to solve it.",
      "Set up an unknown in the denominator instead of the numerator, and solve for it the same way.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "mathematics-cross-multiplication-explain-001",
        question: "Why does cross multiplication tell you whether two fractions are equal?",
        answer:
          "Multiplying both sides of a/b = c/d by b and d clears both denominators, leaving a×d = b×c. If those two products genuinely match, the original fractions had to be equal in the first place.",
      },
      {
        id: "mathematics-cross-multiplication-explain-002",
        question: "Why is cross multiplication not a separate trick, but the same idea as equal ratios and proportions?",
        answer:
          "A proportion already says two ratios are equal. Cross multiplication is just the algebra of that statement — clearing denominators from an equal-ratios equation — so it's the exact same relationship taught in Proportion, expressed as one multiplication step.",
      },
      {
        id: "mathematics-cross-multiplication-explain-003",
        question: "Why does solving for an unknown with cross multiplication still require one more step after multiplying?",
        answer:
          "Cross multiplying only produces a new, simpler equation like 5x = 40 — it hasn't isolated x yet. Dividing both sides by the coefficient (5, here) is the step that actually reveals the unknown's value.",
      },
      {
        id: "mathematics-cross-multiplication-explain-004",
        question: "Why does checking your answer by substituting it back in actually catch mistakes?",
        answer:
          "If an arithmetic error happened anywhere during solving, plugging the (wrong) value back into the original proportion will produce cross products that don't match — the check directly re-verifies the equal-ratios statement you started with.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "mathematics-cross-multiplication",
  },

  // -------------------------------------------------------------
  // CHALLENGE — Missing Value Challenge
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Use the Cross Multiplication Explorer above to set up and check these missing-value problems. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "mathematics-cross-multiplication-challenge-001",
        title: "Missing Value Challenge: Level 1",
        scenario: "Set up the proportion 3/5 = x/20 in the explorer.",
        objective: "Solve for x using cross multiplication.",
        tools: [{ id: "fields", label: "Editable numerator/denominator fields" }],
        answer: { mode: "numeric", target: 12, tolerance: 0 },
        explanation: "Cross multiplying: 3×20 = 5×x, so 60 = 5x, giving x = 12.",
        hints: [
          "Multiply diagonally: 3×20 on one side, 5×x on the other.",
          "Divide both sides of 60 = 5x by 5.",
        ],
      },
      {
        id: "mathematics-cross-multiplication-challenge-002",
        title: "Missing Value Challenge: Level 2",
        scenario: "Set up the proportion 7/x = 21/24 in the explorer.",
        objective: "Solve for x using cross multiplication.",
        tools: [{ id: "fields", label: "Editable numerator/denominator fields" }],
        answer: { mode: "numeric", target: 8, tolerance: 0 },
        explanation: "Cross multiplying: 7×24 = x×21, so 168 = 21x, giving x = 8.",
        hints: [
          "Multiply diagonally: 7×24 on one side, x×21 on the other.",
          "Divide both sides of 168 = 21x by 21.",
        ],
      },
      {
        id: "mathematics-cross-multiplication-challenge-003",
        title: "Fabric Proportion",
        scenario: "3 meters of fabric costs $18. Set up a proportion to find the cost of 7 meters at the same rate.",
        objective: "Solve for the cost of 7 meters using cross multiplication.",
        requiresExperiment: false,
        answer: { mode: "numeric", unit: "dollars", target: 42, tolerance: 0 },
        explanation: "3/18 = 7/x cross multiplies to 3×x = 18×7, so 3x = 126, giving x = $42.",
        hints: [
          "Set up the proportion as meters over cost on both sides: 3/18 = 7/x.",
          "Cross multiply and solve for x.",
        ],
      },
      {
        id: "mathematics-cross-multiplication-challenge-004",
        title: "Verify or Refute",
        scenario: "A student claims 8/14 and 12/21 are equal fractions.",
        objective: "Use cross multiplication in the explorer to check whether the student is correct.",
        answer: { mode: "choice", options: [{ id: "yes", label: "Correct — the fractions are equal" }, { id: "no", label: "Incorrect — the fractions are not equal" }], correctOptionId: "yes" },
        explanation: "Cross multiplying: 8×21 = 168 and 14×12 = 168. Both products match, so the student is correct — 8/14 and 12/21 are equal (both simplify to 4/7).",
        hints: [
          "Cross multiply: compare 8×21 with 14×12.",
          "If the products match, the fractions are equal.",
        ],
      },
    ],
  },

  relatedTopics: [],
};

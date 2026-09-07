import type { TopicContent } from "../types";

/**
 * Calculus Foundations — Mathematics Batch 6 (Calculus), topic 1 of 2.
 * Reuses the existing nine-level Calculus Foundations simulation
 * (`@/features/subjects/mathematics/calculus-foundations`) exactly
 * as-is — Function Machine, a draggable function graph, an
 * "Approaching a Value" stepper, two-sided limit panels for both a
 * converging example (f(x) = x² at x → 2) and a jump discontinuity,
 * a continuity toggle, a removable-discontinuity (hole) panel, a
 * calculus-connection bridge, and its own five-question mini
 * challenge — no simulation changes were needed. Every Learn,
 * Predict, Explain, and Challenge item below is grounded directly in
 * that simulation's actual worked examples from
 * `calculus-foundations/calculus-model.ts` (the same f(x) = x² at
 * x → 2 limit, the same jump piece values of 4 and 1, the same hole
 * at (2, 4)), never an invented scenario.
 *
 * `practice.quizId` points at the pre-existing `mathematics-calculus`
 * bank (`@/features/quiz-engine/data/mathematics-calculus-quiz.ts`)
 * rather than a newly authored one — that bank already has the full
 * 30 questions, already covers exactly this simulation's material
 * (functions, limits, continuity, the lead-in to tangent lines), and
 * its `backHref` already points at this topic's route. Authoring a
 * second, near-duplicate bank under a different id would just split
 * one topic's question pool in two, the same reasoning the
 * Measurement topic used in Mathematics Batch 2.
 */
export const mathematicsCalculusFoundationsContent: TopicContent = {
  subjectSlug: "mathematics",
  topicSlug: "calculus-foundations",
  title: "Calculus Foundations",
  subjectLabel: "Mathematics",
  topicLabel: "Calculus",
  colorToken: "math",
  simulationHref: "/dashboard/mathematics/calculus-foundations",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Explain what a function is and evaluate f(x) for a given input.",
      "Read a graph to find function values and identify the independent and dependent variables.",
      "Describe what it means for x to approach a value, from one side or from both.",
      "Determine whether a two-sided limit exists by comparing the left and right approach.",
      "Define continuity in terms of a graph having no breaks, jumps, or holes.",
    ],
    concepts: [
      {
        term: "Function",
        explanation:
          "A function is a machine: it takes one input, x, and produces exactly one output, f(x). The Function Machine turns this from an abstract rule into something you can watch happen — feed in a value of x and see f(x) come out.",
        formula: "f(x)",
        formulaCaption: "f of x — the output of function f at input x",
      },
      {
        term: "Independent and dependent variables",
        explanation:
          "x is the independent variable — you choose it freely. f(x) is the dependent variable — its value depends entirely on whatever x you chose. On a graph, x is read along the horizontal axis and f(x) along the vertical.",
      },
      {
        term: "Approaching a value",
        explanation:
          "\"x approaches a\" means x is stepping closer and closer to the number a, without necessarily ever landing exactly on it. The Approaching a Value level makes this literal: each click halves the remaining distance, then keeps shrinking it toward zero.",
      },
      {
        term: "Limit",
        explanation:
          "A limit describes the value a function's output settles toward as the input approaches a given point — whether or not the function is actually defined at that exact point.",
        formula: "\\lim_{x \\to a} f(x) = L",
        formulaCaption: "The limit of f(x) as x approaches a is L",
      },
      {
        term: "One-sided approach",
        explanation:
          "The left side (x approaching a from below) and the right side (x approaching a from above) can be checked separately. When both sides settle on the same value, the two-sided limit exists. When they disagree, it does not.",
      },
      {
        term: "Continuity",
        explanation:
          "A function is continuous at a point when its graph has no break there — you could trace it without lifting your pen. That happens exactly when the two-sided limit exists at that point and matches the function's actual value there.",
      },
    ],
    whyItMatters:
      "Functions, graphs, and limits are the visual language every later calculus idea gets written in. Before a derivative or an integral means anything as a formula, it starts as exactly what you're building intuition for here: watching an input approach a value and asking what the output does in response. Get comfortable with that one question, and the rest of calculus is really just new ways of asking it.",
    keyTerms: [
      { term: "Function", definition: "A rule that assigns exactly one output, f(x), to each input, x." },
      { term: "Independent variable", definition: "The input, x, chosen freely." },
      { term: "Dependent variable", definition: "The output, f(x), whose value depends on the chosen x." },
      { term: "Limit", definition: "The value a function's output approaches as its input approaches a given point." },
      { term: "Continuity", definition: "A graph with no breaks, jumps, or holes — the limit at every point matches the function's value there." },
      { term: "Removable discontinuity (hole)", definition: "A single missing point on an otherwise continuous-looking graph, where the function is undefined even though nearby values approach a clear number." },
    ],
    misconceptions: [
      {
        id: "misconception-limit-equals-value",
        misconception: "The limit of a function at a point is always the same as the function's actual value there.",
        correction:
          "The two can differ, or the function can even be undefined at that exact point — the hole example shows f(x) approaching 4 as x → 2 even though the function itself has no value at x = 2.",
      },
      {
        id: "misconception-undefined-means-no-limit",
        misconception: "If a function is undefined at a point, its limit at that point can't exist either.",
        correction:
          "A limit only asks what happens near the point, not at it. The hole in the graph is exactly a case where the function is undefined at x = 2, yet the limit still exists and equals 4, because both sides approach that same value.",
      },
      {
        id: "misconception-jump-limit-is-average",
        misconception: "When the left and right sides of a graph approach different values, the limit is somewhere in between, like their average.",
        correction:
          "A limit isn't a compromise — it only exists when both sides agree on the exact same value. When the left piece approaches 4 and the right piece approaches 1, as in the jump example, the two-sided limit simply does not exist; there's no in-between answer.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Predict each answer, then check it using Calculus Foundations below.",
    scenarios: [
      {
        id: "mathematics-calculus-foundations-predict-001",
        scenario: "In Level 3 (Approaching a Value), you watch x step closer and closer to 2 for f(x) = x², approaching only from the right.",
        question: "What value does f(x) appear to approach?",
        options: [
          { id: "four", label: "4" },
          { id: "two", label: "2" },
          { id: "zero", label: "0" },
          { id: "undefined", label: "It never settles on a value" },
        ],
        actualResultOptionId: "four",
        explanation: "f(x) = x², so as x gets closer to 2, f(x) = x² gets closer to 2² = 4.",
        hint: "Evaluate x² for x-values very close to 2, like 2.1 or 2.01.",
      },
      {
        id: "mathematics-calculus-foundations-predict-002",
        scenario: "In Level 4 (Limits), you check f(x) = x² as x approaches 2 from both the left and the right.",
        question: "Do the two sides agree, and does the two-sided limit exist?",
        options: [
          { id: "agree-exists", label: "Yes, both sides approach 4 — the limit exists" },
          { id: "disagree", label: "No, the two sides approach different values" },
          { id: "exists-but-different", label: "The limit exists, but it isn't 4" },
          { id: "cant-tell", label: "There's no way to know without more information" },
        ],
        actualResultOptionId: "agree-exists",
        explanation: "f(x) = x² is a smooth curve with no breaks near x = 2, so both the left and right approach settle on the same value, 4 — the limit exists.",
        hint: "A smooth curve with no jump at x = 2 means both directions land on the same output.",
      },
      {
        id: "mathematics-calculus-foundations-predict-003",
        scenario: "In Level 5 (Left & Right Approach), the graph has a jump at x = 2: the left piece is f(x) = x + 2 and the right piece is f(x) = x − 1.",
        question: "What does the left side approach, and what does the right side approach, as x → 2?",
        options: [
          { id: "four-one", label: "Left approaches 4, right approaches 1" },
          { id: "same-value", label: "Both sides approach the same value" },
          { id: "one-four", label: "Left approaches 1, right approaches 4" },
          { id: "undefined-both", label: "Neither side approaches any value" },
        ],
        actualResultOptionId: "four-one",
        explanation: "The left piece is x + 2, so as x → 2 it approaches 2 + 2 = 4. The right piece is x − 1, so it approaches 2 − 1 = 1. Since 4 ≠ 1, the two-sided limit does not exist here.",
        hint: "Plug x = 2 into each piece separately.",
      },
      {
        id: "mathematics-calculus-foundations-predict-004",
        scenario: "In Level 7 (Holes & Discontinuities), the function f(x) = (x² − 4)/(x − 2) is graphed. It simplifies to x + 2 everywhere except exactly at x = 2, where it's undefined.",
        question: "Does the limit as x → 2 still exist, even though the function itself is undefined at x = 2?",
        options: [
          { id: "yes-four", label: "Yes — the limit is 4" },
          { id: "no", label: "No — an undefined function means no limit" },
          { id: "yes-zero", label: "Yes — the limit is 0" },
          { id: "yes-two", label: "Yes — the limit is 2" },
        ],
        actualResultOptionId: "yes-four",
        explanation: "Away from x = 2, the function behaves exactly like x + 2, which approaches 2 + 2 = 4. The limit only cares about nearby values, so it still exists and equals 4 — the hole doesn't stop it.",
        hint: "What does x + 2 approach as x gets close to 2?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Level 1 (Functions): Pick a function and drag the x slider to watch the Function Machine turn each input into an output.",
      "Level 2 (Graphs): Drag the point directly on the graph and read off x and f(x) together.",
      "Level 3 (Approaching a Value): Click \"Move Closer\" repeatedly to step x toward the target and watch the table of (x, f(x)) pairs grow.",
      "Level 4 (Limits): Watch f(x) = x² approach the same value, 4, from both the left and the right.",
      "Level 5 (Left & Right Approach): Compare a case where the two sides disagree, so the limit doesn't exist.",
      "Level 6 (Continuity): Toggle between a continuous curve and a discontinuous one and see exactly what the difference looks like.",
      "Level 7 (Holes & Discontinuities): Explore a graph with a single missing point, and see the limit exist anyway.",
      "Use the Level Nav at the bottom to jump directly to any level, and Reset to return the current level to its starting state.",
    ],
    tryThis: [
      "In Level 1, switch to f(x) = x³ and find f(-2) using the Function Machine.",
      "In Level 2, drag the point until f(x) equals exactly 0. What x-value did you need?",
      "In Level 5, notice the open circle versus the filled circle at the jump — which one shows where the function actually is?",
      "In Level 7, compare the hole's open circle to Level 5's jump markers. How is a hole different from a jump?",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "mathematics-calculus-foundations-explain-001",
        question: "Why can a function have a limit at a point even when it's undefined exactly there?",
        answer:
          "A limit only describes what f(x) does for x-values near a point, never at the point itself. The hole example, f(x) = (x² − 4)/(x − 2), is undefined at x = 2, but for every x close to 2, it behaves just like x + 2 — so the limit still exists and equals 4, even though there's a genuine gap in the graph.",
      },
      {
        id: "mathematics-calculus-foundations-explain-002",
        question: "Why does a two-sided limit require both the left and right approach to agree?",
        answer:
          "The limit is meant to describe a single value the function is settling toward. If the left side is heading toward 4 while the right side is heading toward 1, as in the jump example, there's no single number that honestly describes both — so mathematicians define the limit as existing only when the two sides agree.",
      },
      {
        id: "mathematics-calculus-foundations-explain-003",
        question: "Why is a jump discontinuity different from a hole?",
        answer:
          "In the jump example, the two sides approach genuinely different values (4 and 1), so there's no single limit at all. In the hole example, both sides approach the same value (4) — the function just isn't defined at that one exact point. The limit exists for the hole but not for the jump, even though both graphs have a visible break.",
      },
      {
        id: "mathematics-calculus-foundations-explain-004",
        question: "Why does continuity require more than \"the graph looks unbroken\"?",
        answer:
          "Continuity at a point formally means the limit there exists and equals the function's actual value at that point. That's a stricter, checkable condition than an eyeball impression — it's exactly why the hole example, which looks almost unbroken, still counts as discontinuous: the limit is 4, but the function has no value at all at x = 2, so the two can't match.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "mathematics-calculus",
  },

  // -------------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------------
  challenge: {
    intro: "Use the Calculus Foundations simulation above — jump to the level named in each challenge — then answer below.",
    scenarios: [
      {
        id: "mathematics-calculus-foundations-challenge-001",
        title: "Function Machine: f(x) = x³",
        scenario: "In Level 1, select f(x) = x³ and set x = -2 on the slider.",
        objective: "What value does the Function Machine output?",
        tools: [{ id: "machine", label: "Function Machine with function selector and x slider" }],
        answer: { mode: "numeric", target: -8, tolerance: 0 },
        explanation: "f(x) = x³, so f(-2) = (-2)³ = -8.",
        hints: ["Cube the input: multiply -2 by itself three times.", "(-2) × (-2) × (-2) = -8."],
      },
      {
        id: "mathematics-calculus-foundations-challenge-002",
        title: "Function Machine: f(x) = 2x + 1",
        scenario: "In Level 1, select f(x) = 2x + 1 and set x = 3 on the slider.",
        objective: "What value does the Function Machine output?",
        tools: [{ id: "machine", label: "Function Machine with function selector and x slider" }],
        answer: { mode: "numeric", target: 7, tolerance: 0 },
        explanation: "f(x) = 2x + 1, so f(3) = 2(3) + 1 = 7.",
        hints: ["Multiply x by 2 first, then add 1.", "2 × 3 = 6, then 6 + 1 = 7."],
      },
      {
        id: "mathematics-calculus-foundations-challenge-003",
        title: "Limit Target: x → 2",
        scenario: "In Level 4 (Limits), watch f(x) = x² approach its target from both the left and the right.",
        objective: "What value does the graph approach from both sides as x approaches 2?",
        tools: [{ id: "two-sided", label: "Two-sided approach panel with a live left/right table" }],
        answer: { mode: "numeric", target: 4, tolerance: 0 },
        explanation: "f(x) = x², so as x approaches 2 from either side, f(x) approaches 2² = 4.",
        hints: ["Square the target value, 2."],
      },
      {
        id: "mathematics-calculus-foundations-challenge-004",
        title: "Does the Limit Exist? — The Jump",
        scenario: "In Level 5, the left piece approaches 4 and the right piece approaches 1 as x → 2.",
        objective: "What can you conclude about the two-sided limit at x = 2?",
        answer: {
          mode: "choice",
          options: [
            { id: "exists-four", label: "The limit exists and equals 4" },
            { id: "exists-one", label: "The limit exists and equals 1" },
            { id: "exists-average", label: "The limit exists and equals 2.5, the average" },
            { id: "dne", label: "The limit does not exist" },
          ],
          correctOptionId: "dne",
        },
        explanation: "Since the left and right sides approach different values (4 and 1), there's no single value the function is settling toward — the two-sided limit does not exist.",
        hints: ["A two-sided limit only exists when both sides agree on the same value."],
      },
      {
        id: "mathematics-calculus-foundations-challenge-005",
        title: "Which Graph Is Continuous?",
        scenario: "In Level 6 (Continuity), toggle between the continuous and discontinuous examples.",
        objective: "Which kind of graph can be traced without ever lifting your pen?",
        answer: {
          mode: "choice",
          options: [
            { id: "smooth", label: "A smooth curve with no breaks" },
            { id: "jump", label: "A graph with a jump" },
            { id: "hole", label: "A graph with a hole" },
            { id: "none", label: "None of these" },
          ],
          correctOptionId: "smooth",
        },
        explanation: "Continuity means no breaks, jumps, or holes — exactly the smooth curve. Both the jump and the hole require lifting your pen at the break.",
        hints: ["Think about which graph has no visible gap at all."],
      },
      {
        id: "mathematics-calculus-foundations-challenge-006",
        title: "The Hole's Hidden Value",
        scenario: "In Level 7, f(x) = (x² − 4)/(x − 2) is undefined exactly at x = 2, but its graph looks like a straight line everywhere else.",
        objective: "What value does f(x) approach as x → 2, even though the function has no value there?",
        tools: [{ id: "hole", label: "Two-sided approach panel with an open circle marking the hole" }],
        answer: { mode: "numeric", target: 4, tolerance: 0 },
        explanation: "Away from x = 2, the function simplifies to x + 2, which approaches 2 + 2 = 4 — the hole doesn't stop the limit from existing.",
        hints: ["The function behaves like x + 2 everywhere except exactly at x = 2."],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "mathematics",
      topicSlug: "derivative-explorer",
      label: "Derivative Explorer",
      href: "/dashboard/mathematics/derivative-explorer",
      reason: "See where these functions and limits lead next: the secant line rotating into a tangent line.",
    },
  ],
};

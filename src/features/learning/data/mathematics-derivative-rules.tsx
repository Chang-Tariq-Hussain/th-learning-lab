import type { TopicContent } from "../types";

/**
 * Derivative Rules — Mathematics Batch 7 (Calculus), topic 3 of 5.
 * Reuses the existing nine-level Derivative Rules simulation
 * (`@/features/subjects/mathematics/derivative-rules`) exactly
 * as-is — dedicated panels for the Constant, Power, Constant
 * Multiple, Sum & Difference, Product, and Quotient rules, a
 * multi-term step-by-step workspace, a "choose the correct rule"
 * recognition drill, and its own six-question mini practice — no
 * simulation changes were needed. Every Learn, Predict, Explain, and
 * Challenge item below is grounded directly in the simulation's own
 * fixed worked examples from `derivative-rules-model.ts` (f(x) = x³,
 * f(x) = 4x², f(x) = 3x³ + 2x² − 5x + 7, f(x) = x²(x + 1), and
 * f(x) = x²/(x + 1)), never an invented expression.
 *
 * `practice.quizId` points at a new, dedicated 30-question bank
 * (`@/features/quiz-engine/data/mathematics-derivative-rules-quiz.ts`),
 * since no bank previously covered these rules.
 */
export const mathematicsDerivativeRulesContent: TopicContent = {
  subjectSlug: "mathematics",
  topicSlug: "derivative-rules",
  title: "Derivative Rules",
  subjectLabel: "Mathematics",
  topicLabel: "Calculus",
  colorToken: "math",
  simulationHref: "/dashboard/mathematics/derivative-rules",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Apply the Constant Rule to differentiate a function that never changes.",
      "Apply the Power Rule to differentiate xⁿ by bringing the exponent down and subtracting one from it.",
      "Apply the Constant Multiple and Sum/Difference rules to differentiate multi-term expressions, one term at a time.",
      "Apply the Product Rule and Quotient Rule to expressions built from two functions multiplied or divided together.",
      "Recognize which rule an expression needs by its structure, before starting to differentiate.",
    ],
    concepts: [
      {
        term: "Constant Rule",
        explanation:
          "A constant function, f(x) = c, is a flat horizontal line — it never rises or falls, no matter what x is. Its derivative is always 0.",
        formula: "\\dfrac{d}{dx}[c] = 0",
        formulaCaption: "Constant Rule",
      },
      {
        term: "Power Rule",
        explanation:
          "For f(x) = xⁿ, bring the exponent down in front as a multiplying coefficient, then subtract 1 from the exponent. This is the same rule the tangent-line slopes in Derivative Explorer were quietly following all along — it just calculates that slope directly, without needing a limit.",
        formula: "\\dfrac{d}{dx}\\left(x^n\\right) = n x^{n-1}",
        formulaCaption: "Power Rule",
      },
      {
        term: "Constant Multiple Rule",
        explanation:
          "A constant multiplying a function stays exactly where it is — only the function itself gets differentiated.",
        formula: "\\dfrac{d}{dx}\\left[c \\cdot f(x)\\right] = c \\cdot f'(x)",
        formulaCaption: "Constant Multiple Rule",
      },
      {
        term: "Sum and Difference Rule",
        explanation:
          "For a function made of several terms added or subtracted, differentiate each term separately, then combine the results with the same plus or minus signs.",
        formula: "\\dfrac{d}{dx}\\left[f(x) \\pm g(x)\\right] = f'(x) \\pm g'(x)",
        formulaCaption: "Sum and Difference Rule",
      },
      {
        term: "Product Rule",
        explanation:
          "When two functions, u and v, are multiplied together, both get differentiated in turn: the derivative of the first times the second, plus the first times the derivative of the second.",
        formula: "(uv)' = u'v + uv'",
        formulaCaption: "Product Rule",
      },
      {
        term: "Quotient Rule",
        explanation:
          "When one function is divided by another, a similar but longer pattern applies, and the order matters: the bottom function times the derivative of the top, minus the top function times the derivative of the bottom, all over the bottom function squared.",
        formula: "\\left(\\dfrac{u}{v}\\right)' = \\dfrac{vu' - uv'}{v^2}",
        formulaCaption: "Quotient Rule",
      },
    ],
    whyItMatters:
      "These rules turn the tangent-line idea from Derivative Explorer into a fast, mechanical process — instead of imagining a secant line collapsing toward a point every time, you can just apply the matching pattern to the expression in front of you. This is exactly how derivatives get computed in practice, in fields from engineering to economics, wherever a rate of change needs to be found from a formula rather than a graph.",
    keyTerms: [
      { term: "Constant Rule", definition: "The derivative of any constant is 0." },
      { term: "Power Rule", definition: "The derivative of xⁿ is n·x^(n-1)." },
      { term: "Constant Multiple Rule", definition: "A constant factor passes through differentiation unchanged." },
      { term: "Sum/Difference Rule", definition: "Differentiate a multi-term expression term by term, then combine." },
      { term: "Product Rule", definition: "(uv)' = u'v + uv' — both factors get differentiated, in turn." },
      { term: "Quotient Rule", definition: "(u/v)' = (vu' − uv')/v² — order matters, and the denominator is squared." },
    ],
    misconceptions: [
      {
        id: "misconception-product-rule-multiply-derivatives",
        misconception: "To differentiate a product of two functions, just multiply their two derivatives together.",
        correction:
          "That's not how the Product Rule works — for f(x) = x²(x + 1), simply multiplying u' = 2x by v' = 1 would give 2x, but the correct derivative, worked out step by step in the Product Rule level, is 3x² + 2x. Each function must be paired with the other's original form, not just multiplied by the other's derivative.",
      },
      {
        id: "misconception-quotient-rule-order-doesnt-matter",
        misconception: "In the Quotient Rule, it doesn't matter which order you subtract the two pieces in.",
        correction:
          "Order matters — the Quotient Rule is specifically (vu' − uv') / v², not (uv' − vu') / v². Swapping the order flips the sign of the whole numerator, which is why the Quotient Rule level always substitutes v and u the same way every time.",
      },
      {
        id: "misconception-sum-rule-needs-simplifying-first",
        misconception: "Before you can differentiate a multi-term expression, you first need to combine or simplify all the terms.",
        correction:
          "The Sum and Difference Rule works precisely because each term can be differentiated completely on its own — the Multiple-Term Functions level shows exactly this, working through f(x) = 3x³ + 2x² − 5x + 7 term by term, with no need to combine anything first.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Before revealing the worked answer, predict which rule applies — then check yourself using Derivative Rules below.",
    scenarios: [
      {
        id: "mathematics-derivative-rules-predict-001",
        scenario: "In Level 2 (Power Rule), you're shown f(x) = x³.",
        question: "Which rule applies, and what does its derivative come out to?",
        options: [
          { id: "power-3x2", label: "Power Rule — f'(x) = 3x²" },
          { id: "constant-0", label: "Constant Rule — f'(x) = 0" },
          { id: "power-x2", label: "Power Rule — f'(x) = x²" },
          { id: "power-3x3", label: "Power Rule — f'(x) = 3x³" },
        ],
        actualResultOptionId: "power-3x2",
        explanation: "The Power Rule brings the exponent, 3, down as a coefficient and reduces the exponent by 1: f'(x) = 3x².",
        hint: "d/dx(xⁿ) = n·x^(n-1) — substitute n = 3.",
      },
      {
        id: "mathematics-derivative-rules-predict-002",
        scenario: "In Level 3 (Constant Multiple Rule), you're shown f(x) = 4x².",
        question: "Which rule applies, and what does its derivative come out to?",
        options: [
          { id: "constant-multiple-8x", label: "Constant Multiple Rule — f'(x) = 8x" },
          { id: "power-4x", label: "Power Rule alone — f'(x) = 4x" },
          { id: "constant-multiple-4x", label: "Constant Multiple Rule — f'(x) = 4x" },
          { id: "constant-0", label: "Constant Rule — f'(x) = 0" },
        ],
        actualResultOptionId: "constant-multiple-8x",
        explanation: "The 4 stays in front while the Power Rule is applied to x²: 4 · (2x) = 8x.",
        hint: "Apply the Power Rule to x² first, then multiply by the 4 that's already out front.",
      },
      {
        id: "mathematics-derivative-rules-predict-003",
        scenario: "In Level 4 (Sum & Difference Rule), you're shown the Addition example, f(x) = x² + x³.",
        question: "Which rule applies, and what does its derivative come out to?",
        options: [
          { id: "sum-2x-3x2", label: "Sum Rule — f'(x) = 2x + 3x²" },
          { id: "sum-x-x2", label: "Sum Rule — f'(x) = x + x²" },
          { id: "product-2x-3x2", label: "Product Rule — f'(x) = 2x · 3x²" },
          { id: "sum-2x3-3x2", label: "Sum Rule — f'(x) = 2x³ + 3x²" },
        ],
        actualResultOptionId: "sum-2x-3x2",
        explanation: "Differentiate each term separately: x² becomes 2x, and x³ becomes 3x². Combined: f'(x) = 2x + 3x².",
        hint: "Apply the Power Rule to each term on its own, then add the two results together.",
      },
      {
        id: "mathematics-derivative-rules-predict-004",
        scenario: "In Level 6 (Product Rule), you're shown f(x) = x²(x + 1), with u = x² and v = x + 1.",
        question: "Which rule applies, and what does its derivative come out to?",
        options: [
          { id: "product-3x2-2x", label: "Product Rule — f'(x) = 3x² + 2x" },
          { id: "product-2x", label: "Product Rule — f'(x) = 2x (multiplying the derivatives)" },
          { id: "sum-2x-1", label: "Sum Rule — f'(x) = 2x + 1" },
          { id: "product-x2", label: "Product Rule — f'(x) = x²" },
        ],
        actualResultOptionId: "product-3x2-2x",
        explanation: "(uv)' = u'v + uv' = (2x)(x + 1) + (x²)(1) = 2x² + 2x + x² = 3x² + 2x.",
        hint: "u' = 2x, v' = 1 — substitute into u'v + uv', then simplify.",
      },
      {
        id: "mathematics-derivative-rules-predict-005",
        scenario: "In Level 7 (Quotient Rule), you're shown f(x) = x²/(x + 1), with u = x² and v = x + 1.",
        question: "Which rule applies, and what does its derivative come out to?",
        options: [
          { id: "quotient-correct", label: "Quotient Rule — f'(x) = (x² + 2x)/(x + 1)²" },
          { id: "quotient-swapped", label: "Quotient Rule — f'(x) = (2x − x²)/(x + 1)²" },
          { id: "product-guess", label: "Product Rule — f'(x) = 2x(x + 1)" },
          { id: "quotient-no-square", label: "Quotient Rule — f'(x) = (x² + 2x)/(x + 1)" },
        ],
        actualResultOptionId: "quotient-correct",
        explanation: "(u/v)' = (vu' − uv')/v² = [(x+1)(2x) − (x²)(1)] / (x+1)² = (2x² + 2x − x²)/(x+1)² = (x² + 2x)/(x+1)².",
        hint: "Substitute u = x², v = x + 1, u' = 2x, v' = 1 into (vu' − uv')/v², then simplify the numerator.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Level 1 (Constant Rule): Switch between different constant values and watch the flat line only ever slide up or down, never tilt.",
      "Level 2 (Power Rule): Pick different exponents and watch the exponent visually move down to become the new coefficient.",
      "Level 3 (Constant Multiple Rule): Switch examples and see the constant stay fixed in front while the Power Rule handles the rest.",
      "Level 4 (Sum & Difference Rule): Step through Addition and Subtraction examples, one labeled step at a time — split into terms, differentiate each, then combine.",
      "Level 5 (Multiple-Term Functions): Step through a full four-term polynomial, seeing which rule applies to each term before it's differentiated.",
      "Level 6 (Product Rule): Step through identifying u and v, differentiating each, building the u'v + uv' structure, then simplifying.",
      "Level 7 (Quotient Rule): Step through the same structure for u/v, watching the vu' − uv' numerator and v² denominator get built in order.",
      "Level 8 (Choose the Correct Rule): Look at each expression's structure and pick the matching rule before calculating anything.",
      "Use the Level Nav at the bottom to jump directly to any level, and Reset to return the current level to its starting state.",
    ],
    tryThis: [
      "In Level 2, switch between all four exponents and notice the pattern: the exponent you started with becomes the new coefficient every time.",
      "In Level 4, compare the Addition and Subtraction examples — does the sign in the original expression carry through to the derivative?",
      "In Level 5, name which rule (Power, Constant Multiple, or Constant) applies to each of the four terms before revealing it.",
      "In Level 8, try to answer each expression before picking, then check yourself against the revealed rule.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "mathematics-derivative-rules-explain-001",
        question: "Why does the Power Rule work by bringing the exponent down and subtracting one from it?",
        answer:
          "It's a shortcut for exactly what the limit definition of the derivative already computes for xⁿ — this rule doesn't add new mathematics, it just packages the recurring pattern from that limit into two quick steps, so f(x) = x³ becomes f'(x) = 3x² without redoing the limit each time.",
      },
      {
        id: "mathematics-derivative-rules-explain-002",
        question: "Why can multi-term expressions be differentiated term by term with the Sum Rule?",
        answer:
          "Each term's rate of change happens independently of the others — differentiating is a linear operation. The Multiple-Term Functions level shows this directly: f(x) = 3x³ + 2x² − 5x + 7 breaks into four separate pieces, each one gets its own rule applied (Power Rule, Power Rule, Constant Multiple, Constant Rule), and the results just add together to give f'(x) = 9x² + 4x − 5.",
      },
      {
        id: "mathematics-derivative-rules-explain-003",
        question: "Why isn't the derivative of a product just the product of the two derivatives?",
        answer:
          "Both u and v are changing at the same time, so a change in the product f(x) = u(x)v(x) comes from two separate sources at once: u changing while v stays fixed, and v changing while u stays fixed. The Product Rule, u'v + uv', adds both of those contributions together — for f(x) = x²(x + 1), that's (2x)(x+1) + (x²)(1), which simplifies to 3x² + 2x, not the much simpler (and wrong) 2x you'd get from just multiplying u' by v'.",
      },
      {
        id: "mathematics-derivative-rules-explain-004",
        question: "Why does the Quotient Rule need the denominator squared, and why does the order of subtraction matter?",
        answer:
          "The vu' − uv' numerator captures the same \"both pieces are changing\" idea as the Product Rule, but division also stretches or shrinks the result depending on how large v is, so dividing by v² corrects for that. The order matters because vu' − uv' and uv' − vu' are negatives of each other — for f(x) = x²/(x+1), the correct order gives (x² + 2x)/(x+1)², while swapping it would give the wrong sign entirely.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "mathematics-derivative-rules",
  },

  // -------------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------------
  challenge: {
    intro: "Use the Derivative Rules simulation above — jump to the level named in each challenge — then answer below.",
    scenarios: [
      {
        id: "mathematics-derivative-rules-challenge-001",
        title: "Power Rule: x⁵",
        scenario: "In Level 2 (Power Rule), select the x⁵ option.",
        objective: "What is the derivative of f(x) = x⁵?",
        tools: [{ id: "power", label: "Power Rule panel with exponent selector and transform animation" }],
        answer: { mode: "choice", options: [
          { id: "5x4", label: "5x⁴" },
          { id: "x4", label: "x⁴" },
          { id: "5x5", label: "5x⁵" },
          { id: "4x5", label: "4x⁵" },
        ], correctOptionId: "5x4" },
        explanation: "Power Rule: bring the exponent 5 down as a coefficient, then subtract 1 from it: 5x⁴.",
        hints: ["d/dx(xⁿ) = n·x^(n-1) — substitute n = 5."],
      },
      {
        id: "mathematics-derivative-rules-challenge-002",
        title: "Multiple-Term Functions",
        scenario: "In Level 5, step through f(x) = 3x³ + 2x² − 5x + 7 to its final combined derivative.",
        objective: "What is f'(x)?",
        tools: [{ id: "step-by-step", label: "Four-step term-by-term breakdown" }],
        answer: { mode: "choice", options: [
          { id: "correct", label: "9x² + 4x − 5" },
          { id: "wrong-const", label: "9x² + 4x − 5 + 7" },
          { id: "wrong-exp", label: "9x³ + 4x² − 5x" },
          { id: "wrong-sign", label: "9x² − 4x + 5" },
        ], correctOptionId: "correct" },
        explanation: "3x³ → 9x², 2x² → 4x, −5x → −5, and 7 → 0 (a constant's derivative). Combined: f'(x) = 9x² + 4x − 5.",
        hints: ["Differentiate each of the four terms on its own first.", "Remember: the derivative of a plain constant, like 7, is 0."],
      },
      {
        id: "mathematics-derivative-rules-challenge-003",
        title: "Product Rule: x²(x + 1)",
        scenario: "In Level 6 (Product Rule), step through f(x) = x²(x + 1) to its simplified derivative.",
        objective: "What is f'(x), fully simplified?",
        tools: [{ id: "product", label: "u/v identification, differentiation, and u'v + uv' structure" }],
        answer: { mode: "choice", options: [
          { id: "correct", label: "3x² + 2x" },
          { id: "wrong-multiply", label: "2x (multiplying the two derivatives)" },
          { id: "wrong-unsimplified", label: "2x(x + 1) + x²" },
          { id: "wrong-sign", label: "3x² − 2x" },
        ], correctOptionId: "correct" },
        explanation: "u'v + uv' = (2x)(x+1) + (x²)(1) = 2x² + 2x + x² = 3x² + 2x.",
        hints: ["u = x², v = x + 1 — find u' and v' first.", "Substitute into u'v + uv', then combine like terms."],
      },
      {
        id: "mathematics-derivative-rules-challenge-004",
        title: "Quotient Rule: x²/(x + 1)",
        scenario: "In Level 7 (Quotient Rule), step through f(x) = x²/(x + 1) to its simplified derivative.",
        objective: "What is f'(x), fully simplified?",
        tools: [{ id: "quotient", label: "u/v identification, differentiation, and (vu' − uv')/v² structure" }],
        answer: { mode: "choice", options: [
          { id: "correct", label: "(x² + 2x)/(x + 1)²" },
          { id: "wrong-sign", label: "(2x − x²)/(x + 1)²" },
          { id: "wrong-no-square", label: "(x² + 2x)/(x + 1)" },
          { id: "wrong-multiply", label: "2x/1" },
        ], correctOptionId: "correct" },
        explanation: "(vu' − uv')/v² = [(x+1)(2x) − (x²)(1)]/(x+1)² = (2x² + 2x − x²)/(x+1)² = (x² + 2x)/(x+1)².",
        hints: ["u = x², v = x + 1 — find u' and v' first.", "Substitute carefully into (vu' − uv')/v², keeping the order exact."],
      },
      {
        id: "mathematics-derivative-rules-challenge-005",
        title: "Choose the Rule: x²(x + 1) vs x²/(x + 1)",
        scenario: "In Level 8 (Choose the Correct Rule), compare the two structurally similar expressions f(x) = x²(x + 1) and f(x) = x²/(x + 1).",
        objective: "Which rule does each one need?",
        answer: {
          mode: "choice",
          options: [
            { id: "correct", label: "x²(x + 1) needs the Product Rule; x²/(x + 1) needs the Quotient Rule" },
            { id: "swapped", label: "x²(x + 1) needs the Quotient Rule; x²/(x + 1) needs the Product Rule" },
            { id: "both-product", label: "Both need the Product Rule" },
            { id: "both-quotient", label: "Both need the Quotient Rule" },
          ],
          correctOptionId: "correct",
        },
        explanation: "Multiplication of two functions needs the Product Rule; division of one function by another needs the Quotient Rule — the operation joining u and v determines which rule applies.",
        hints: ["Look at the operation between x² and (x + 1) in each expression."],
      },
      {
        id: "mathematics-derivative-rules-challenge-006",
        title: "Constant Multiple: 5x³",
        scenario: "In Level 3 (Constant Multiple Rule), select the 5x³ example.",
        objective: "What is the derivative of f(x) = 5x³?",
        tools: [{ id: "constant-multiple", label: "Constant Multiple panel with example selector" }],
        answer: { mode: "choice", options: [
          { id: "15x2", label: "15x²" },
          { id: "5x2", label: "5x²" },
          { id: "15x3", label: "15x³" },
          { id: "3x2", label: "3x²" },
        ], correctOptionId: "15x2" },
        explanation: "The 5 stays fixed in front while the Power Rule differentiates x³ into 3x²: 5 · 3x² = 15x².",
        hints: ["Apply the Power Rule to x³ first: that gives 3x².", "Then multiply the result by the constant, 5."],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "mathematics",
      topicSlug: "derivative-explorer",
      label: "Derivative Explorer",
      href: "/dashboard/mathematics/derivative-explorer",
      reason: "Revisit why these shortcuts work: the tangent-line slope these rules calculate directly.",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "chain-rule-explorer",
      label: "Chain Rule Explorer",
      href: "/dashboard/mathematics/chain-rule-explorer",
      reason: "Learn the one case these rules don't cover on their own: a function nested inside another function.",
    },
  ],
};

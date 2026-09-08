import type { TopicContent } from "../types";

/**
 * Chain Rule Explorer — Mathematics Batch 7 (Calculus), topic 4 of 5.
 * Reuses the existing seven-level Chain Rule Explorer simulation
 * (`@/features/subjects/mathematics/chain-rule-explorer`) exactly
 * as-is — a two-stage Composition Machine, an Inner/Outer
 * click-to-highlight panel, a five-step animated Chain Rule
 * transformation, a six-step worked workspace, a Chain-Rule-vs-
 * Power-Rule comparison and recognition drill, a three-layer nested
 * example, and its own six-question mini practice — no simulation
 * changes were needed. Every Learn, Predict, Explain, and Challenge
 * item below is grounded directly in the simulation's own fixed
 * worked examples from `chain-rule-model.ts` — the three composite
 * functions (x+1)², (2x+3)⁴, and (x²+1)³; the (3x²+2)⁴ step-by-step
 * workspace; the x⁵ vs (x+2)⁵ comparison; and the three-layer nested
 * example ((x+1)²+2)³ — never an invented expression.
 *
 * `practice.quizId` points at a new, dedicated 30-question bank
 * (`@/features/quiz-engine/data/mathematics-chain-rule-quiz.ts`),
 * since no bank previously covered the Chain Rule.
 */
export const mathematicsChainRuleExplorerContent: TopicContent = {
  subjectSlug: "mathematics",
  topicSlug: "chain-rule-explorer",
  title: "Chain Rule Explorer",
  subjectLabel: "Mathematics",
  topicLabel: "Calculus",
  colorToken: "math",
  simulationHref: "/dashboard/mathematics/chain-rule-explorer",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Explain what a composite function is and identify its inner and outer functions.",
      "State the Chain Rule and explain what each part of it represents.",
      "Differentiate a composite function step by step: outer derivative times inner derivative, then substitute back in.",
      "Distinguish when a problem needs the Chain Rule versus the Power Rule alone.",
      "Apply the Chain Rule more than once for a function nested several layers deep.",
    ],
    concepts: [
      {
        term: "Composite function",
        explanation:
          "A function built by plugging one function into another. In f(g(x)), g is applied first, and its result becomes the input to f — the inner function's output becomes the outer function's input.",
        formula: "f(g(x))",
        formulaCaption: "f composed with g",
      },
      {
        term: "Inner and outer functions",
        explanation:
          "In f(g(x)), g(x) is the inner function — the first thing that happens to x. f is the outer function, applied to whatever g(x) produces. For y = (x² + 1)³, the inner function is g(x) = x² + 1 and the outer function is f(u) = u³.",
      },
      {
        term: "The Chain Rule",
        explanation:
          "To differentiate a composite function, take the derivative of the outer function (leaving the inner function alone inside it), then multiply by the derivative of the inner function.",
        formula: "\\dfrac{d}{dx}\\big[f(g(x))\\big] = f'(g(x)) \\cdot g'(x)",
        formulaCaption: "Chain Rule",
      },
      {
        term: "Chain Rule vs. Power Rule",
        explanation:
          "y = x⁵ needs only the Power Rule — the exponent applies directly to x, with no inner function hiding inside it. y = (2x + 1)⁵ needs the Chain Rule instead, because 2x + 1 sits inside the power as its own inner function.",
      },
      {
        term: "Nested functions",
        explanation:
          "The Chain Rule can be applied more than once, one layer at a time, for a function nested several functions deep — each layer's derivative multiplies into the running product, working from the outside in.",
      },
    ],
    whyItMatters:
      "The Chain Rule is essential the moment one changing quantity depends on another changing quantity, which is constantly the case in real applications — a cost function that depends on production, which itself depends on time, or a temperature that depends on altitude, which itself depends on how far a balloon has traveled. Anywhere a function is layered inside another, the Chain Rule is what lets you find the combined rate of change.",
    keyTerms: [
      { term: "Composite function", definition: "A function formed by substituting one function into another, f(g(x))." },
      { term: "Inner function", definition: "The function applied first, g(x) — its output becomes the outer function's input." },
      { term: "Outer function", definition: "The function applied second, f(u), to whatever the inner function produced." },
      { term: "Chain Rule", definition: "d/dx[f(g(x))] = f'(g(x)) · g'(x) — outer derivative times inner derivative." },
    ],
    misconceptions: [
      {
        id: "misconception-power-rule-always-enough",
        misconception: "Any expression raised to a power can be differentiated with the Power Rule alone.",
        correction:
          "The Power Rule alone only works when x itself is what's being raised to the power, like x⁵. The moment another expression sits inside the power, like (2x + 1)⁵, that inner expression is its own function with its own derivative that has to be multiplied in — exactly what the Chain Rule vs Power Rule level is designed to make visible.",
      },
      {
        id: "misconception-chain-rule-just-add-derivatives",
        misconception: "The Chain Rule works by adding the outer derivative and the inner derivative together.",
        correction:
          "The two derivatives are multiplied, not added — d/dx[f(g(x))] = f'(g(x)) · g'(x). For y = (x + 1)², that's the outer derivative 2u times the inner derivative 1, giving 2(x + 1); adding them instead would give a completely different, incorrect result.",
      },
      {
        id: "misconception-nested-functions-one-application",
        misconception: "A function nested three layers deep only needs the Chain Rule applied once.",
        correction:
          "Each layer needs its own application of the Chain Rule, working from the outside in — the Nested Functions level shows this directly for y = ((x+1)²+2)³, where the Chain Rule gets applied once for the outermost cube and again for the squared layer inside it.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Predict the inner function, the rule needed, or the result — then check yourself using Chain Rule Explorer below.",
    scenarios: [
      {
        id: "mathematics-chain-rule-explorer-predict-001",
        scenario: "In Level 2 (Inner and Outer Functions), you're shown the fixed example y = (x² + 1)³.",
        question: "Which part is the inner function?",
        options: [
          { id: "x2plus1", label: "g(x) = x² + 1" },
          { id: "u3", label: "f(u) = u³" },
          { id: "x2", label: "x²" },
          { id: "cubed", label: "The cubing itself is the inner function" },
        ],
        actualResultOptionId: "x2plus1",
        explanation: "The inner function is whatever is computed first — here, x² + 1 is calculated before the whole result is cubed, so g(x) = x² + 1 is the inner function.",
        hint: "The inner function is the first operation applied to x.",
      },
      {
        id: "mathematics-chain-rule-explorer-predict-002",
        scenario: "Compare two expressions: y = x⁵ and y = (x + 2)⁵.",
        question: "Which one requires the Chain Rule?",
        options: [
          { id: "second-only", label: "Only y = (x + 2)⁵" },
          { id: "first-only", label: "Only y = x⁵" },
          { id: "both", label: "Both of them" },
          { id: "neither", label: "Neither of them" },
        ],
        actualResultOptionId: "second-only",
        explanation: "y = x⁵ needs only the Power Rule, since the exponent applies directly to x. y = (x + 2)⁵ has x + 2 sitting inside the power as its own inner function, so it needs the Chain Rule.",
        hint: "Ask: is there another expression sitting inside the power, other than x by itself?",
      },
      {
        id: "mathematics-chain-rule-explorer-predict-003",
        scenario: "In Level 3 (Basic Chain Rule), you're shown y = (x + 1)², with outer derivative 2u and inner derivative 1.",
        question: "After multiplying and substituting u = x + 1 back in, what is the final derivative?",
        options: [
          { id: "2xplus1", label: "y' = 2(x + 1)" },
          { id: "2x", label: "y' = 2x" },
          { id: "xplus1squared", label: "y' = (x + 1)²" },
          { id: "one", label: "y' = 1" },
        ],
        actualResultOptionId: "2xplus1",
        explanation: "Outer derivative 2u times inner derivative 1 gives 2u · 1 = 2u; substituting u = x + 1 back in gives y' = 2(x + 1).",
        hint: "Multiply the outer derivative by the inner derivative first, then replace u with x + 1.",
      },
      {
        id: "mathematics-chain-rule-explorer-predict-004",
        scenario: "In Level 6 (Nested Functions), you're shown the three-layer example y = ((x + 1)² + 2)³.",
        question: "How many times does the Chain Rule need to be applied to differentiate this?",
        options: [
          { id: "twice", label: "Twice — once for the outer cube, once for the inner square" },
          { id: "once", label: "Once, for the whole expression at once" },
          { id: "three-times", label: "Three times, once per layer of the original expression" },
          { id: "not-needed", label: "It isn't needed at all here" },
        ],
        actualResultOptionId: "twice",
        explanation: "The Chain Rule is applied once for the outermost cube, and once more for the squared layer nested inside it — the innermost layer, x + 1, is simple enough not to need it again.",
        hint: "Count how many function layers actually change the input, not just how many parentheses there are.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Level 1 (Function Composition): Pick one of the three composite functions and drag the x slider to watch x flow through the inner function into u, then through the outer function into the final output.",
      "Level 2 (Inner and Outer Functions): For the fixed example y = (x² + 1)³, toggle between highlighting the inner and outer function to see exactly which piece each label refers to.",
      "Level 3 (Basic Chain Rule): Pick a composite function and step through its five-part transformation: outer derivative, inner derivative, multiply, substitute, final answer.",
      "Level 4 (Step-by-Step Chain Rule): Work through the fixed y = (3x² + 2)⁴ example, six named steps from identifying the inner function to the final simplified derivative.",
      "Level 5 (Chain Rule vs Power Rule): Switch between the Compare view, which contrasts x⁵ with (2x + 1)⁴, and the Choose the Method practice, which asks you to pick the right rule for four different expressions.",
      "Level 6 (Nested Functions): Drag the point along y = ((x + 1)² + 2)³ and watch all three layers update together, then reveal the full two-application derivative.",
      "Use the Level Nav at the bottom to jump directly to any level, and Reset to return the current level to its starting state.",
    ],
    tryThis: [
      "In Level 1, switch between all three composite functions and compare how differently u behaves for each one as you move x.",
      "In Level 3, try all three composite functions and notice how the five-step structure stays exactly the same each time, only the expressions change.",
      "In Level 5's Choose the Method practice, try to decide power vs. chain before revealing the answer for each of the four expressions.",
      "In Level 6, toggle \"Show the Derivative\" and check the displayed value against y' at your current x by hand.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "mathematics-chain-rule-explorer-explain-001",
        question: "Why do you multiply the outer derivative by the inner derivative, instead of adding them?",
        answer:
          "A composite function's rate of change compounds through both stages: how much the output changes per unit change in u (the outer derivative), times how much u changes per unit change in x (the inner derivative). Multiplying combines these two ratios correctly, the same way multiplying two conversion factors combines them — for y = (x + 1)², that's 2u times 1, giving 2(x + 1) once u is substituted back in.",
      },
      {
        id: "mathematics-chain-rule-explorer-explain-002",
        question: "Why does y = x⁵ need only the Power Rule, while y = (x + 2)⁵ needs the Chain Rule?",
        answer:
          "In y = x⁵, the exponent applies directly to x, with nothing else in between — there's no inner function to speak of, or you could say the inner function is just x itself, whose derivative is 1 and changes nothing. In y = (x + 2)⁵, the expression x + 2 sits inside the power as a genuine inner function with its own structure, so its derivative has to be accounted for separately and multiplied in.",
      },
      {
        id: "mathematics-chain-rule-explorer-explain-003",
        question: "Why does a nested function like ((x+1)²+2)³ need the Chain Rule applied more than once?",
        answer:
          "Each layer of nesting is its own composite function wrapped around the one before it — the cube is applied to (x+1)²+2 as a whole, and within that, the square is applied to x+1 as a whole. Differentiating the outermost layer alone would leave the inner layer's own rate of change unaccounted for, so the Chain Rule has to be applied again for that layer too, working from the outside in.",
      },
      {
        id: "mathematics-chain-rule-explorer-explain-004",
        question: "Why is identifying the inner and outer function the real skill, rather than the multiplication itself?",
        answer:
          "Once you've correctly identified which piece is g(x) and which piece is f(u), the rest is just applying rules you already know — differentiate f, differentiate g, multiply, substitute. The hard part is reading the structure correctly in the first place, which is exactly what the Choose the Method practice in Level 5 is designed to build, separately from the calculation itself.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "mathematics-chain-rule",
  },

  // -------------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------------
  challenge: {
    intro: "Use the Chain Rule Explorer simulation above — jump to the level named in each challenge — then answer below.",
    scenarios: [
      {
        id: "mathematics-chain-rule-explorer-challenge-001",
        title: "Identify Inner and Outer: (2x + 3)⁴",
        scenario: "In Level 1 (Function Composition), select the (2x + 3)⁴ example.",
        objective: "What are the inner and outer functions?",
        tools: [{ id: "composition", label: "Composition Machine with example selector and x slider" }],
        answer: {
          mode: "choice",
          options: [
            { id: "correct", label: "Inner: g(x) = 2x + 3, Outer: f(u) = u⁴" },
            { id: "swapped", label: "Inner: f(u) = u⁴, Outer: g(x) = 2x + 3" },
            { id: "wrong-inner", label: "Inner: g(x) = 2x, Outer: f(u) = u⁴ + 3" },
            { id: "wrong-outer", label: "Inner: g(x) = 2x + 3, Outer: f(u) = u³" },
          ],
          correctOptionId: "correct",
        },
        explanation: "The inner function is whatever is computed first, 2x + 3; the outer function, u⁴, is applied to that result.",
        hints: ["The inner function is the part computed before the exponent is applied."],
      },
      {
        id: "mathematics-chain-rule-explorer-challenge-002",
        title: "Basic Chain Rule: (2x + 3)⁴",
        scenario: "In Level 3 (Basic Chain Rule), select the (2x + 3)⁴ example and step through to the final answer.",
        objective: "What is the final derivative?",
        tools: [{ id: "chain-visual", label: "Five-step animated chain rule transformation" }],
        answer: {
          mode: "choice",
          options: [
            { id: "correct", label: "8(2x + 3)³" },
            { id: "wrong-no-outer-coeff", label: "4(2x + 3)³" },
            { id: "wrong-power-only", label: "4x³" },
            { id: "wrong-inner-only", label: "2(2x + 3)⁴" },
          ],
          correctOptionId: "correct",
        },
        explanation: "Outer derivative 4u³ times inner derivative 2 gives 8u³; substituting u = 2x + 3 back in gives 8(2x + 3)³.",
        hints: ["Outer derivative: 4u³. Inner derivative: 2. Multiply first, then substitute u back in."],
      },
      {
        id: "mathematics-chain-rule-explorer-challenge-003",
        title: "Step-by-Step Workspace: (3x² + 2)⁴",
        scenario: "In Level 4 (Step-by-Step Chain Rule), step through the fixed y = (3x² + 2)⁴ workspace to its final step.",
        objective: "What is the final simplified derivative?",
        tools: [{ id: "workspace", label: "Six-step named workspace from inner/outer identification to final answer" }],
        answer: {
          mode: "choice",
          options: [
            { id: "correct", label: "24x(3x² + 2)³" },
            { id: "wrong-no-mult", label: "4(3x² + 2)³ · 6x" },
            { id: "wrong-drop-inner", label: "4(3x² + 2)³" },
            { id: "wrong-power", label: "12x(3x² + 2)³" },
          ],
          correctOptionId: "correct",
        },
        explanation: "Outer derivative 4u³ times inner derivative 6x gives 4u³ · 6x = 24x·u³; substituting u = 3x² + 2 back in gives 24x(3x² + 2)³.",
        hints: ["Inner function u = 3x² + 2, so u' = 6x.", "Multiply the outer derivative, 4u³, by the inner derivative, 6x, then substitute u back in."],
      },
      {
        id: "mathematics-chain-rule-explorer-challenge-004",
        title: "Chain Rule vs Power Rule",
        scenario: "In Level 5's Choose the Method practice, compare y = x³ + 2x with y = (3x² + 1)⁴.",
        objective: "Which rule does each one need?",
        answer: {
          mode: "choice",
          options: [
            { id: "correct", label: "y = x³ + 2x needs only the Power Rule; y = (3x² + 1)⁴ needs the Chain Rule" },
            { id: "swapped", label: "y = x³ + 2x needs the Chain Rule; y = (3x² + 1)⁴ needs only the Power Rule" },
            { id: "both-power", label: "Both need only the Power Rule" },
            { id: "both-chain", label: "Both need the Chain Rule" },
          ],
          correctOptionId: "correct",
        },
        explanation: "Each term in x³ + 2x has x raised directly to a power, so the Power Rule (with the Sum Rule) is enough. In (3x² + 1)⁴, the power is applied to the inner expression 3x² + 1, so the Chain Rule is needed.",
        hints: ["Look for an expression other than x by itself sitting inside a power."],
      },
      {
        id: "mathematics-chain-rule-explorer-challenge-005",
        title: "Nested Functions: Two Applications",
        scenario: "In Level 6 (Nested Functions), reveal the derivative for y = ((x + 1)² + 2)³.",
        objective: "What is y'?",
        tools: [{ id: "nested", label: "Three-layer nested function display with a reveal-derivative toggle" }],
        answer: {
          mode: "choice",
          options: [
            { id: "correct", label: "y' = 3((x+1)² + 2)² · 2(x+1)" },
            { id: "wrong-once", label: "y' = 3((x+1)² + 2)²" },
            { id: "wrong-add", label: "y' = 3((x+1)² + 2)² + 2(x+1)" },
            { id: "wrong-inner-missing", label: "y' = 3((x+1)² + 2)² · 2" },
          ],
          correctOptionId: "correct",
        },
        explanation: "Applying the Chain Rule twice, once for the outer cube and once for the inner square, gives y' = 3((x+1)²+2)² · 2(x+1).",
        hints: ["The Chain Rule needs to be applied once for each of the two nested layers, not just once overall."],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "mathematics",
      topicSlug: "derivative-rules",
      label: "Derivative Rules",
      href: "/dashboard/mathematics/derivative-rules",
      reason: "Revisit the Power, Product, and Quotient rules the Chain Rule works alongside.",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "applications-of-derivatives",
      label: "Applications of Derivatives",
      href: "/dashboard/mathematics/applications-of-derivatives",
      reason: "Put every differentiation rule so far to use solving real optimization and rate problems.",
    },
  ],
};

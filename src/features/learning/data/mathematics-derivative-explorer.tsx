import type { TopicContent } from "../types";

/**
 * Derivative Explorer — Mathematics Batch 6 (Calculus), topic 2 of 2.
 * Builds directly on Calculus Foundations, reusing the existing
 * ten-level Derivative Explorer simulation
 * (`@/features/subjects/mathematics/derivative-explorer`) exactly
 * as-is — a secant line between two draggable points, a step-by-step
 * "Approaching a Point" table, a tangent line following one dragged
 * point, an average-vs-instantaneous rate comparison, the derivative
 * itself with its limit definition, a sign panel (positive/zero/
 * negative), a derivative-graph panel plotting f'(x) alongside f(x),
 * a position → velocity bridge, and its own five-question mini
 * challenge — no simulation changes were needed. Every Learn,
 * Predict, Explain, and Challenge item below is grounded in the
 * simulation's actual two functions from
 * `derivative-explorer/derivative-model.ts` — f(x) = x² (f'(x) = 2x)
 * on domain [-3, 3] and f(x) = x³ (f'(x) = 3x²) on domain [-2, 2] —
 * never a third, invented function.
 *
 * `practice.quizId` points at a new, dedicated 30-question bank
 * (`@/features/quiz-engine/data/mathematics-derivative-explorer-quiz.ts`),
 * since no pre-existing bank covers derivatives.
 */
export const mathematicsDerivativeExplorerContent: TopicContent = {
  subjectSlug: "mathematics",
  topicSlug: "derivative-explorer",
  title: "Derivative Explorer",
  subjectLabel: "Mathematics",
  topicLabel: "Calculus",
  colorToken: "math",
  simulationHref: "/dashboard/mathematics/derivative-explorer",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Calculate the average rate of change between two points as a secant slope.",
      "Explain a secant line and describe what happens as its two points move closer together.",
      "Define a tangent line as the line the secant line approaches when the gap closes completely.",
      "Define the derivative as the instantaneous rate of change at a single point.",
      "Interpret the sign of a derivative — positive, zero, or negative — in terms of the graph's behavior.",
    ],
    concepts: [
      {
        term: "Average rate of change",
        explanation:
          "Between any two points A and B on a curve, the average rate of change is how much the output changed (Δy) divided by how much the input changed (Δx). It's the slope of the straight line connecting those two points.",
        formula: "\\dfrac{\\Delta y}{\\Delta x}",
        formulaCaption: "Average rate of change between two points",
      },
      {
        term: "Secant line",
        explanation:
          "A straight line through any two distinct points on a curve. Its slope is exactly the average rate of change between those two points.",
      },
      {
        term: "Approaching a point",
        explanation:
          "Keeping point A fixed and sliding point B closer and closer to it, the secant line rotates. As the distance between A and B shrinks toward zero, the secant slope settles on one specific number — the derivative at A.",
      },
      {
        term: "Tangent line",
        explanation:
          "The line the secant line approaches once the two points merge into one. It touches the curve at exactly that single point and matches the curve's direction there.",
      },
      {
        term: "Derivative",
        explanation:
          "The slope of the tangent line at a point, written f'(x) — the instantaneous rate of change of the function right at that point, as opposed to the average rate over an interval.",
        formula: "f'(x) = \\lim_{h \\to 0} \\dfrac{f(x+h) - f(x)}{h}",
        formulaCaption: "The derivative as a limit of secant slopes",
      },
      {
        term: "Sign of the derivative",
        explanation:
          "A positive derivative means the function is increasing there; a negative derivative means it's decreasing; a derivative of exactly zero means the tangent is momentarily flat, as it is at a smooth turning point.",
      },
    ],
    whyItMatters:
      "This shift from average rate to instantaneous rate is the whole idea behind a derivative — it's how you get from a speedometer's average reading over a trip to the exact speed a car is going at one precise instant. Every derivative formula covered later is just a faster way to compute the exact same tangent-line slope this simulation lets you watch happen directly.",
    keyTerms: [
      { term: "Secant line", definition: "A line through two distinct points on a curve; its slope is the average rate of change between them." },
      { term: "Tangent line", definition: "The line a secant line approaches as its two points merge into one; its slope is the instantaneous rate of change." },
      { term: "Average rate of change", definition: "Δy divided by Δx between two points — the secant slope." },
      { term: "Instantaneous rate of change", definition: "The rate of change at a single point — the tangent slope, i.e. the derivative." },
      { term: "Derivative, f'(x)", definition: "The instantaneous rate of change of f at x; the slope of the tangent line there." },
    ],
    misconceptions: [
      {
        id: "misconception-derivative-unrelated-to-secant",
        misconception: "The derivative is a completely separate idea from the secant line, unrelated to average rate of change.",
        correction:
          "The derivative is exactly what a secant slope approaches as the two points merge into one. Watching B slide toward A and the secant slope settle on a single number, as in the Approaching a Point level, is watching the derivative get computed step by step.",
      },
      {
        id: "misconception-zero-derivative-means-zero-function",
        misconception: "A derivative of zero at some point means the function's value is zero there too.",
        correction:
          "A zero derivative only means the tangent line is momentarily flat — the graph is neither rising nor falling right at that instant. The Sign panel shows this at the bottom of a curve, where the function's height can be any value while its slope, f'(x), is exactly 0.",
      },
      {
        id: "misconception-average-rate-needs-tiny-interval",
        misconception: "You need a very small interval between the two points to calculate a valid average rate of change.",
        correction:
          "Average rate of change is defined for any two distinct points, no matter how far apart — the Secant Line level works the same way whether the points are close together or far apart. It's only the instantaneous rate, the derivative, that specifically requires the gap to shrink all the way to zero.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Predict each answer, then check it using Derivative Explorer below.",
    scenarios: [
      {
        id: "mathematics-derivative-explorer-predict-001",
        scenario: "In the Approaching a Point level, you keep point A fixed and repeatedly move point B closer to it.",
        question: "What happens to the secant line as B gets closer and closer to A?",
        options: [
          { id: "approaches-tangent", label: "It rotates and approaches the tangent line at A" },
          { id: "disappears", label: "It disappears once B is too close" },
          { id: "stays-fixed", label: "It stays exactly the same" },
          { id: "becomes-vertical", label: "It always becomes a vertical line" },
        ],
        actualResultOptionId: "approaches-tangent",
        explanation: "As B slides toward A, the secant line rotates and its slope converges on one number — the slope of the tangent line at A.",
        hint: "Think about what a secant line becomes once its two points merge into one.",
      },
      {
        id: "mathematics-derivative-explorer-predict-002",
        scenario: "For f(x) = x² (so f'(x) = 2x), you compare the average rate of change from x = 1 to x = 2 with the instantaneous rate of change at x = 1.",
        question: "Which is larger?",
        options: [
          { id: "average-larger", label: "The average rate (3) is larger than the instantaneous rate (2)" },
          { id: "instantaneous-larger", label: "The instantaneous rate is larger than the average rate" },
          { id: "equal", label: "They're exactly equal" },
          { id: "cant-compare", label: "They can't be compared" },
        ],
        actualResultOptionId: "average-larger",
        explanation: "The average rate from x = 1 to x = 2 is (4 − 1)/(2 − 1) = 3. The instantaneous rate at x = 1 is f'(1) = 2(1) = 2. Since the curve is getting steeper, the secant over that interval outpaces the tangent at the earlier point.",
        hint: "Compute (f(2) − f(1))/(2 − 1) for the average, and f'(1) for the instantaneous rate.",
      },
      {
        id: "mathematics-derivative-explorer-predict-003",
        scenario: "In the Sign panel, you drag the point across the bottom of the f(x) = x² curve, its lowest point (the vertex, at x = 0).",
        question: "What happens to the sign of the derivative as the point crosses x = 0?",
        options: [
          { id: "negative-to-positive", label: "It goes from negative, to zero exactly at the vertex, to positive" },
          { id: "stays-positive", label: "It stays positive the whole time" },
          { id: "stays-negative", label: "It stays negative the whole time" },
          { id: "positive-to-negative", label: "It goes from positive to negative" },
        ],
        actualResultOptionId: "negative-to-positive",
        explanation: "To the left of the vertex the curve is falling (negative derivative), exactly at the vertex it's momentarily flat (derivative = 0), and to the right it's rising (positive derivative).",
        hint: "f'(x) = 2x — what sign does 2x have when x is negative, zero, or positive?",
      },
      {
        id: "mathematics-derivative-explorer-predict-004",
        scenario: "In the Position → Velocity panel, an object's position is s(t) = t², so its velocity is v(t) = 2t.",
        question: "What happens to the object's velocity as time t increases from 0 to 3 seconds?",
        options: [
          { id: "increases", label: "The velocity keeps increasing" },
          { id: "constant", label: "The velocity stays constant" },
          { id: "decreases", label: "The velocity decreases" },
          { id: "zero-throughout", label: "The velocity stays at zero" },
        ],
        actualResultOptionId: "increases",
        explanation: "v(t) = 2t grows as t grows, so the object keeps speeding up — visibly matching the derivative of its position getting larger over time.",
        hint: "v(t) = 2t — what happens to 2t as t gets bigger?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Levels 1–2 (Average Rate & Secant Line): Drag point A along the curve, or use the slider to move B closer or farther from it, and read the live Δy/Δx readout.",
      "Level 3 (Approaching a Point): Click \"Move Closer\" repeatedly and watch the secant slope in the table settle toward the true derivative.",
      "Level 4 (Tangent Line): Drag the single point along the curve and watch the tangent line follow it, with its slope updating live.",
      "Level 5 (Instantaneous Rate of Change): Compare the same point shown two ways — once with a secant line, once with a tangent line.",
      "Level 6 (Derivative): Use the quick-pick x buttons, or drag the point, to see f'(x) computed at different x-values.",
      "Level 7 (Positive, Zero & Negative): Drag the point across the vertex of f(x) = x² and watch the derivative's sign flip.",
      "Level 8 (Derivative Graph): Toggle the derivative graph on to see f'(x) plotted as its own curve, alongside f(x).",
      "Switch the Function dropdown between f(x) = x² and f(x) = x³ in Levels 1–8 to compare the two.",
    ],
    tryThis: [
      "In Level 4, drag the point on f(x) = x² until the tangent slope reads exactly 6. What x-value gets you there?",
      "In Level 6, switch to f(x) = x³ and find f'(x) at each of the quick-pick x-values.",
      "In Level 8, drag the point on f(x) = x³ and watch how differently f'(x) = 3x² curves compared to f(x) = x³ itself.",
      "In Level 3, compare how quickly the secant slope settles for f(x) = x² versus f(x) = x³ at the same starting point.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "mathematics-derivative-explorer-explain-001",
        question: "Why is the derivative defined as the limit of secant slopes, rather than measured some other way?",
        answer:
          "A secant slope always measures a rate over some distance — however small. To get the rate at one exact instant, there's no way around letting that distance shrink all the way to zero, which is exactly what a limit describes. The Approaching a Point level makes this concrete: the secant slope keeps changing as B approaches A, but settles on one specific number right as the gap disappears.",
      },
      {
        id: "mathematics-derivative-explorer-explain-002",
        question: "Why does the sign of f'(x) tell you whether the function is increasing or decreasing?",
        answer:
          "The derivative is the tangent line's slope, and a line's slope describes its direction: positive means rising left to right, negative means falling. Since the tangent line matches the curve's direction at that exact point, a positive f'(x) means the function is momentarily rising there, and a negative f'(x) means it's momentarily falling.",
      },
      {
        id: "mathematics-derivative-explorer-explain-003",
        question: "Why is velocity the derivative of position?",
        answer:
          "Velocity is defined as how fast position is changing at a given instant — which is precisely the instantaneous rate of change of the position function. For s(t) = t², the derivative v(t) = 2t captures exactly how the object's speed grows as t increases, the same idea as a tangent slope, just applied to motion instead of a plain curve.",
      },
      {
        id: "mathematics-derivative-explorer-explain-004",
        question: "Why can the average rate of change over an interval be so different from the instantaneous rate at one end of it?",
        answer:
          "The average rate blends together everything that happens across the whole interval, while the instantaneous rate captures only what's happening at one exact point. For f(x) = x², the average rate from x = 1 to x = 2 is 3, but the instantaneous rate at x = 1 alone is only 2 — the curve keeps getting steeper across that interval, so the average ends up pulled higher than the rate right at the starting point.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "mathematics-derivative-explorer",
  },

  // -------------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------------
  challenge: {
    intro: "Use the Derivative Explorer simulation above — jump to the level named in each challenge — then answer below.",
    scenarios: [
      {
        id: "mathematics-derivative-explorer-challenge-001",
        title: "Tangent Target: Slope of 3 on x²",
        scenario: "In Level 4 (Tangent Line), select f(x) = x² and drag the point until the tangent slope reads 3, using a positive x-value.",
        objective: "What x-value gives a tangent slope of exactly 3?",
        tools: [{ id: "tangent", label: "Draggable point on f(x) = x² with a live tangent-slope readout" }],
        answer: { mode: "numeric", target: 1.5, tolerance: 0.1 },
        explanation: "f'(x) = 2x, so 2x = 3 gives x = 1.5.",
        hints: ["f'(x) = 2x — set 2x equal to 3 and solve for x.", "3 ÷ 2 = 1.5."],
      },
      {
        id: "mathematics-derivative-explorer-challenge-002",
        title: "Tangent Target: Slope of 12 on x³",
        scenario: "In Level 4, switch to f(x) = x³ and drag the point until the tangent slope reads 12, using a positive x-value.",
        objective: "What x-value gives a tangent slope of exactly 12?",
        tools: [{ id: "tangent", label: "Draggable point on f(x) = x³ with a live tangent-slope readout" }],
        answer: { mode: "numeric", target: 2, tolerance: 0.1 },
        explanation: "f'(x) = 3x², so 3x² = 12 gives x² = 4, and x = 2 on the positive branch.",
        hints: ["f'(x) = 3x² — set 3x² equal to 12 and solve for x².", "x² = 4, so x = 2 (taking the positive root)."],
      },
      {
        id: "mathematics-derivative-explorer-challenge-003",
        title: "Where Is the Derivative Zero?",
        scenario: "In Level 7 (Positive, Zero & Negative), drag the point along f(x) = x² and watch the derivative badge.",
        objective: "At which x-value is the derivative exactly zero?",
        answer: {
          mode: "choice",
          options: [
            { id: "neg-one", label: "x = -1" },
            { id: "zero", label: "x = 0" },
            { id: "one", label: "x = 1" },
            { id: "never", label: "The derivative is never exactly zero" },
          ],
          correctOptionId: "zero",
        },
        explanation: "f'(x) = 2x, which equals 0 only when x = 0 — exactly the vertex of the parabola, where the tangent is momentarily flat.",
        hints: ["Set f'(x) = 2x equal to 0 and solve for x."],
      },
      {
        id: "mathematics-derivative-explorer-challenge-004",
        title: "Secant Convergence at x = 1",
        scenario: "In Level 3 (Approaching a Point), select f(x) = x², keep point A at x = 1, and click \"Move Closer\" until the table's steps are exhausted.",
        objective: "What value does the secant slope in the table converge toward?",
        tools: [{ id: "approach-table", label: "Approaching a Point table of Δx and secant slope" }],
        answer: { mode: "numeric", target: 2, tolerance: 0 },
        explanation: "f'(x) = 2x, so the true derivative at x = 1 is f'(1) = 2(1) = 2 — exactly what the secant slope in the table settles toward as Δx shrinks to 0.001.",
        hints: ["The table is converging toward f'(1).", "f'(x) = 2x, so f'(1) = 2."],
      },
      {
        id: "mathematics-derivative-explorer-challenge-005",
        title: "Velocity at t = 2 Seconds",
        scenario: "In the Position → Velocity level, s(t) = t², so v(t) = 2t.",
        objective: "What is the object's velocity at t = 2 seconds?",
        tools: [{ id: "velocity", label: "Position → Velocity player with live t, position, and velocity readouts" }],
        answer: { mode: "numeric", target: 4, tolerance: 0.2 },
        explanation: "v(t) = 2t, so v(2) = 2(2) = 4.",
        hints: ["v(t) = 2t — substitute t = 2."],
      },
      {
        id: "mathematics-derivative-explorer-challenge-006",
        title: "Reading the Derivative Graph",
        scenario: "In Level 8 (Derivative Graph), select f(x) = x³ and show the derivative graph alongside it.",
        objective: "For f(x) = x³, what shape does the derivative graph f'(x) = 3x² make?",
        answer: {
          mode: "choice",
          options: [
            { id: "parabola", label: "A parabola, always at or above zero" },
            { id: "straight-line", label: "A straight line through the origin" },
            { id: "cubic", label: "Another cubic curve, matching f(x)" },
            { id: "flat-line", label: "A flat horizontal line" },
          ],
          correctOptionId: "parabola",
        },
        explanation: "f'(x) = 3x² is itself a parabola-shaped function — squaring x always gives a non-negative result, so the derivative graph never dips below zero, matching the fact that f(x) = x³ is never decreasing.",
        hints: ["f'(x) = 3x² — what family of curve does an x² expression belong to?"],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "mathematics",
      topicSlug: "calculus-foundations",
      label: "Calculus Foundations",
      href: "/dashboard/mathematics/calculus-foundations",
      reason: "Revisit the functions, graphs, and limits that the secant-to-tangent idea here is built on.",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "derivative-rules",
      label: "Derivative Rules",
      href: "/dashboard/mathematics/derivative-rules",
      reason: "Learn the shortcut formulas for computing derivatives directly, without graphing a tangent line each time.",
    },
  ],
};

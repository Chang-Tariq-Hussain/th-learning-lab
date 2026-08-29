import type { TopicContent } from "../types";

/**
 * Equation of a Straight Line, Mathematics Batch 3 topic 6 of 6
 * (Coordinate Geometry) — the final topic in the batch. Uses the new
 * Line Designer simulation
 * (`@/features/subjects/mathematics/line-designer`), built
 * specifically for this topic. The Learning Path previously mapped
 * this topic to the existing Equation Playground simulation, but that
 * turned out to be an unrelated "find the missing number in
 * a + b = c" arithmetic game with no slope/intercept graphing — see
 * the correction and full explanation in
 * `@/features/learning-path/data/mathematics-foundations.ts`. Line
 * Designer has m/b sliders, a live y = mx + b graph, a y-intercept
 * marker, and its own Match mode (drag sliders to match a target
 * dashed line), directly implementing this topic's "Line Designer"
 * challenge spec. `practice.quizId` points at a new, dedicated
 * 30-question bank
 * (`@/features/quiz-engine/data/mathematics-equation-of-line-quiz.ts`).
 */
export const mathematicsEquationOfLineContent: TopicContent = {
  subjectSlug: "mathematics",
  topicSlug: "line-designer",
  title: "Equation of a Straight Line",
  subjectLabel: "Mathematics",
  topicLabel: "Coordinate Geometry",
  colorToken: "math",
  simulationHref: "/dashboard/mathematics/line-designer",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Read the slope and y-intercept directly from an equation in the form y = mx + b.",
      "Explain how changing m or b transforms a line's graph.",
      "Write the equation of a line given its slope and a point on it.",
      "Match an equation to its graph, and a graph to its equation.",
    ],
    concepts: [
      {
        term: "Slope-intercept form",
        explanation:
          "The equation y = mx + b describes every point on a straight line. m is the slope (steepness and direction), and b is the y-intercept (where the line crosses the y-axis, at the point (0, b)).",
        formula: "y = mx + b",
        formulaCaption: "Slope-intercept form",
      },
      {
        term: "How m changes the graph",
        explanation:
          "Increasing the magnitude of m makes the line steeper; the sign of m sets its direction — positive rises left to right, negative falls. Changing m rotates the line around its y-intercept.",
      },
      {
        term: "How b changes the graph",
        explanation:
          "b only controls where the line crosses the y-axis. Changing b slides the entire line straight up or down, without changing its steepness or direction at all.",
      },
      {
        term: "Writing an equation from a slope and a point",
        explanation:
          "If you know the slope and one point (not necessarily the y-intercept), substitute the point's x and y into y = mx + b and solve for b — then write the full equation with both m and the b you found.",
      },
    ],
    whyItMatters:
      "The equation y = mx + b is one of the most reused patterns in math and science — it's how a straight-line relationship gets written down precisely, whether that's a phone plan's cost per gigabyte, a car's distance over time at constant speed, or the trend line through a scatter of data. Once you can read m and b straight off an equation, you can predict exactly how that relationship behaves without ever having to draw it.",
    keyTerms: [
      { term: "Slope-intercept form", definition: "The form y = mx + b, where m is the slope and b is the y-intercept." },
      { term: "y-intercept", definition: "The point where a line crosses the y-axis, at (0, b)." },
      { term: "Parallel lines", definition: "Lines with the same slope but different y-intercepts — they never meet." },
    ],
    misconceptions: [
      {
        id: "misconception-equation-of-line-swapped-slope-intercept",
        misconception: "It doesn't matter which number in y = mx + b is the slope and which is the y-intercept.",
        correction:
          "In y = mx + b, m is always the coefficient multiplying x (the slope), and b is always the constant term added at the end (the y-intercept). Swapping their roles — writing y = bx + m instead — describes a completely different line.",
      },
      {
        id: "misconception-equation-of-line-slope-implies-shift",
        misconception: "Changing the slope of a line also shifts it up or down.",
        correction:
          "Changing m rotates the line around its fixed y-intercept — it doesn't move where the line crosses the y-axis at all. Only changing b actually shifts the line vertically.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Predict each result, then check it by adjusting the sliders in Line Designer below.",
    scenarios: [
      {
        id: "mathematics-equation-of-line-predict-001",
        scenario: "The line is currently y = 2x + 3. You're about to increase m to 5, leaving b unchanged.",
        question: "What will happen to the line?",
        options: [
          { id: "steeper-same-intercept", label: "It gets steeper, still crossing the y-axis at the same point" },
          { id: "shifts-up", label: "It shifts straight up" },
          { id: "shifts-down", label: "It shifts straight down" },
          { id: "flattens", label: "It gets flatter" },
        ],
        actualResultOptionId: "steeper-same-intercept",
        explanation: "m controls steepness only; increasing it from 2 to 5 makes the line rise faster while it still crosses the y-axis at b = 3.",
        hint: "Which variable in y = mx + b controls steepness, and which controls vertical position?",
      },
      {
        id: "mathematics-equation-of-line-predict-002",
        scenario: "The line is currently y = 2x + 3. You're about to increase b to 8, leaving m unchanged.",
        question: "What will happen to the line?",
        options: [
          { id: "shifts-up", label: "It shifts straight up, same steepness" },
          { id: "steeper", label: "It gets steeper" },
          { id: "flatter", label: "It gets flatter" },
          { id: "rotates", label: "It rotates around the origin" },
        ],
        actualResultOptionId: "shifts-up",
        explanation: "b only moves the y-intercept; increasing it from 3 to 8 slides the whole line upward without changing its slope.",
        hint: "b controls where the line crosses the y-axis, nothing about its steepness.",
      },
      {
        id: "mathematics-equation-of-line-predict-003",
        scenario: "You're about to set m to 0.",
        question: "What will the line look like?",
        options: [
          { id: "horizontal", label: "A flat, horizontal line" },
          { id: "vertical", label: "A vertical line" },
          { id: "steep-diagonal", label: "A very steep diagonal line" },
          { id: "disappears", label: "The line disappears entirely" },
        ],
        actualResultOptionId: "horizontal",
        explanation: "With m = 0, y never changes as x changes, producing a flat horizontal line at height y = b.",
        hint: "What does a slope of exactly 0 mean for a line's shape?",
      },
      {
        id: "mathematics-equation-of-line-predict-004",
        scenario: "You compare y = 3x + 1 and y = 3x - 4.",
        question: "What is the relationship between these two lines?",
        options: [
          { id: "parallel", label: "They're parallel — same slope, different y-intercepts" },
          { id: "same-line", label: "They're actually the same line" },
          { id: "perpendicular", label: "They're perpendicular" },
          { id: "no-relationship", label: "There's no relationship between them" },
        ],
        actualResultOptionId: "parallel",
        explanation: "Both lines share slope 3, so they rise at exactly the same rate and never meet — they're parallel.",
        hint: "Compare the m value in each equation.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Move the m slider and watch the line's steepness and direction change.",
      "Move the b slider and watch the line shift up or down.",
      "Read the equation displayed above the graph as it updates live with your changes.",
      "Switch to Match mode and try to recreate a target line using just the sliders.",
    ],
    tryThis: [
      "Set m to 0 and describe what kind of line you get.",
      "Set m to a negative value and describe how the line's direction changes.",
      "Find two different (m, b) pairs that both produce lines crossing the y-axis at the same point.",
      "In Match mode, look at the dashed target line and estimate its slope and intercept before adjusting the sliders.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "mathematics-equation-of-line-explain-001",
        question: "Why does changing m rotate the line instead of moving it sideways or up and down?",
        answer:
          "The y-intercept (0, b) never changes when only m changes, since plugging x = 0 into y = mx + b always gives y = b regardless of m. With that one point fixed, changing the steepness necessarily rotates the rest of the line around it.",
      },
      {
        id: "mathematics-equation-of-line-explain-002",
        question: "Why does changing b shift the whole line instead of just moving one point on it?",
        answer:
          "Every point on the line is y = mx + b for some x — adding a fixed amount to b adds that exact same amount to y at every single x-value simultaneously, which is precisely what a uniform vertical shift means.",
      },
      {
        id: "mathematics-equation-of-line-explain-003",
        question: "Why can you find a missing y-intercept by substituting a known point into y = mx + b?",
        answer:
          "If a point genuinely lies on the line, its x and y coordinates must satisfy the equation exactly. Substituting them in turns the equation into one with only b unknown, which can then be solved directly by basic algebra.",
      },
      {
        id: "mathematics-equation-of-line-explain-004",
        question: "Why do two lines with the same slope but different y-intercepts never cross?",
        answer:
          "Two lines cross where their y-values are equal for the same x. If both lines rise at the identical rate (same m), the vertical gap between them — set entirely by the difference in their b values — never closes, so they stay the same distance apart forever.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "mathematics-equation-of-line",
  },

  // -------------------------------------------------------------
  // CHALLENGE — Line Designer
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Use the Line Designer simulation above — adjust m and b to create each target, then answer below.",
    scenarios: [
      {
        id: "mathematics-equation-of-line-challenge-001",
        title: "Line Designer: Slope 2, Intercept -3",
        scenario: "Set the sliders so the equation reads y = 2x - 3.",
        objective: "What is the y-coordinate of the point where this line crosses the y-axis?",
        tools: [{ id: "sliders", label: "m and b sliders with a live equation and graph" }],
        answer: { mode: "numeric", target: -3, tolerance: 0 },
        explanation: "The y-intercept of y = 2x - 3 is exactly b, which is -3.",
        hints: [
          "The y-intercept is the constant term in y = mx + b.",
        ],
      },
      {
        id: "mathematics-equation-of-line-challenge-002",
        title: "Line Designer: Negative Slope",
        scenario: "Set the sliders so the line falls from left to right and crosses the y-axis at 4.",
        objective: "If you set m to -2, what is the resulting equation's value of y when x = 3?",
        tools: [{ id: "sliders", label: "m and b sliders with a live equation and graph" }],
        answer: { mode: "numeric", target: -2, tolerance: 0 },
        explanation: "With m = -2 and b = 4: y = -2(3) + 4 = -6 + 4 = -2.",
        hints: [
          "Substitute x = 3 into y = mx + b using your chosen m and b.",
          "-2(3) + 4 = -2.",
        ],
      },
      {
        id: "mathematics-equation-of-line-challenge-003",
        title: "Which Equation Is Steeper?",
        scenario: "Compare y = 4x + 1 and y = -6x + 1 using the sliders.",
        objective: "Which line is steeper?",
        answer: {
          mode: "choice",
          options: [
            { id: "b", label: "y = -6x + 1" },
            { id: "a", label: "y = 4x + 1" },
            { id: "same", label: "They're equally steep" },
          ],
          correctOptionId: "b",
        },
        explanation: "Steepness depends on |m|: |-6| = 6 is greater than |4| = 4, so y = -6x + 1 is steeper (it just falls instead of rising).",
        hints: [
          "Compare the absolute values of the two slopes.",
        ],
      },
      {
        id: "mathematics-equation-of-line-challenge-004",
        title: "Line Designer: Horizontal Line",
        scenario: "Set the sliders to create a perfectly flat line at height y = -5.",
        objective: "What value of m did you need to set?",
        tools: [{ id: "sliders", label: "m and b sliders with a live equation and graph" }],
        answer: { mode: "numeric", target: 0, tolerance: 0 },
        explanation: "A horizontal line always has slope 0 — only b (here, -5) determines its height.",
        hints: [
          "What slope produces a perfectly flat line?",
        ],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "mathematics",
      topicSlug: "slope-of-a-line",
      label: "Slope of a Line",
      href: "/dashboard/mathematics/slope-of-a-line",
      reason: "Revisit how slope is calculated from two points if the m in y = mx + b feels unclear.",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "coordinate-plane-explorer",
      label: "Coordinate Plane",
      href: "/dashboard/mathematics/coordinate-plane-explorer",
      reason: "You've completed Coordinate Geometry — revisit the fundamentals any time from here.",
    },
  ],
};

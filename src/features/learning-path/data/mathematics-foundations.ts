import type { LearningPath } from "../types";

/**
 * Mathematics' full existing curriculum, organized into a sensible
 * learning progression: number sense first, then ratio & measurement
 * (which lean on fractions), then coordinate geometry (which leans on
 * ratio/slope reasoning), then statistics, then calculus last (which
 * assumes coordinate-plane and function fluency). This mirrors
 * `physics-foundations.ts`'s pattern but currently spans topics at
 * two different levels of Golden Learning Experience maturity:
 *
 * - Number Line, Even & Odd Numbers, Factors & Multiples, Fractions,
 *   and Fraction Operations ("Batch 1") have a full registered
 *   `TopicContent` (Learn through Mastery) in
 *   `@/features/learning/registry.ts`, so the engine tracks real
 *   mastery for them.
 * - Every other topic below is a real, working simulation page with
 *   no `TopicContent` registered yet. They're included on purpose —
 *   per the brief, the Learning Path should represent the *complete*
 *   curriculum, not just the topics that happen to have a full
 *   Learn/Predict/Explore/.../Mastery experience — and the engine
 *   degrades gracefully for these (`isPathTopicDone` falls back to
 *   "some progress recorded", and unlocking only ever needs
 *   `isStarted`; see `../engine.ts`).
 *
 * Three Batch 1 topics have a route slug that differs from their
 * registered content's `topicSlug` (progress is keyed by the
 * *content* slug, not the URL): Even & Odd Explorer's content slug is
 * "even-odd" (route: even-odd-explorer), Factor Finder's is
 * "factors-multiples" (route: factor-finder), and Fraction Pizza's is
 * "fractions" (route: fraction-pizza). `topicSlug` below is always
 * the content/progress slug; `href` is always the real route — see
 * each entry's comment.
 *
 * "Equation of a Straight Line" now maps to a dedicated Line Designer
 * simulation (`@/features/subjects/mathematics/line-designer`), built
 * as part of Mathematics Batch 3. It previously pointed at the
 * existing Equation Playground simulation on the assumption that
 * Equation Playground already covered graphing a line from its
 * equation — on inspection, Equation Playground turned out to be an
 * unrelated "find the missing number in a + b = c" arithmetic game
 * with no slope/intercept graphing at all, so that mapping was wrong
 * and has been corrected. Equation Playground itself is untouched and
 * still reachable at its own page (Algebra topic group in
 * `@/features/subjects/data/subjects.ts`), just no longer mapped to
 * this topic. "Limits" has no dedicated topic either — Calculus
 * Foundations' own title ("Functions, Graphs & Limits") already
 * covers it, so it isn't a separate path node.
 *
 * Two existing topics — Angle Spinner (Geometry) and Symmetry Mirror
 * (Symmetry) — aren't part of the curriculum order the brief listed,
 * but do exist as real student-facing topics, so per "include every
 * existing Mathematics topic" they're placed in a short "Geometry
 * Basics" unit between Measurement and Coordinate Geometry, the most
 * logical spot given their prerequisites (basic shape/angle sense,
 * ahead of coordinate-plane work).
 *
 * Ratio Challenge is included as an optional challenge topic, the
 * same pattern as Physics' Projectile Motion: it mixes every ratio
 * skill (missing values, simplifying, equivalence, word problems)
 * rather than teaching one new idea, so it depends on the ratio core
 * topics rather than simply following its neighbor.
 */
export const mathematicsFoundationsPath: LearningPath = {
  id: "mathematics-foundations",
  subjectSlug: "mathematics",
  title: "Mathematics Foundations",
  description:
    "The full Mathematics curriculum in one guided sequence: number sense, ratio & measurement, geometry, coordinate geometry, statistics, then calculus.",
  colorToken: "math",
  topics: [
    // --- Number Sense -------------------------------------------------
    {
      subjectSlug: "mathematics",
      topicSlug: "number-line",
      title: "Number Line",
      description: "Positive, negative, and zero on a draggable number line.",
      href: "/dashboard/mathematics/number-line",
      prerequisites: [],
    },
    {
      // Content slug is "even-odd"; route is even-odd-explorer.
      subjectSlug: "mathematics",
      topicSlug: "even-odd",
      title: "Even & Odd Numbers",
      description: "Build expressions and watch the leftover dot decide even or odd.",
      href: "/dashboard/mathematics/even-odd-explorer",
    },
    {
      // Content slug is "factors-multiples"; route is factor-finder.
      subjectSlug: "mathematics",
      topicSlug: "factors-multiples",
      title: "Factors & Multiples",
      description: "Tap out factor pairs and multiples to build a feel for both.",
      href: "/dashboard/mathematics/factor-finder",
    },
    {
      // Content slug is "fractions"; route is fraction-pizza.
      subjectSlug: "mathematics",
      topicSlug: "fractions",
      title: "Fractions",
      description: "Slice a pizza to see numerator and denominator as parts of a whole.",
      href: "/dashboard/mathematics/fraction-pizza",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "fraction-operations",
      title: "Fraction Operations",
      description: "Add, subtract, multiply, and divide fractions with a visual model for each.",
      href: "/dashboard/mathematics/fraction-operations",
    },

    // --- Ratio & Measurement -------------------------------------------
    {
      subjectSlug: "mathematics",
      topicSlug: "ratio-explorer",
      title: "Ratio",
      description: "Add blue and red circles to discover what a ratio means and see it simplify.",
      href: "/dashboard/mathematics/ratio-explorer",
      // No explicit prerequisites — defaults to depending on Fraction Operations.
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "ratio-comparison",
      title: "Ratio Comparison",
      description: "Drag sliders on two ratios and see instantly whether they're equivalent — and why.",
      href: "/dashboard/mathematics/ratio-comparison",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "proportion-builder",
      title: "Proportion",
      description: "Find the missing value in a : b = c : d, and see visually why both sides stay equal.",
      href: "/dashboard/mathematics/proportion-builder",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "cross-multiplication-explorer",
      title: "Cross Multiplication",
      description: "Watch the two diagonal multiplications animate to see why 2/3 = 4/6.",
      href: "/dashboard/mathematics/cross-multiplication-explorer",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "real-life-ratios",
      title: "Real-Life Ratios",
      description: "Solve illustrated ratio problems — paint mixing, recipes, marbles, trees, and more.",
      href: "/dashboard/mathematics/real-life-ratios",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "ratio-challenge",
      title: "Ratio Challenge",
      description: "A challenge topic: mixed ratio problems from beginner to advanced, with instant feedback.",
      href: "/dashboard/mathematics/ratio-challenge",
      isChallenge: true,
      prerequisites: [
        { subjectSlug: "mathematics", topicSlug: "proportion-builder" },
        { subjectSlug: "mathematics", topicSlug: "cross-multiplication-explorer" },
        { subjectSlug: "mathematics", topicSlug: "real-life-ratios" },
      ],
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "measurement-explorer",
      title: "Measurement",
      description: "Length, distance, and rulers — the building blocks of measurement.",
      href: "/dashboard/mathematics/measurement-explorer",
      // No explicit prerequisites — the default chain only looks at
      // core (non-challenge) topics, so this correctly depends on
      // Real-Life Ratios, not the Ratio Challenge that follows it above.
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "perimeter-area-explorer",
      title: "Perimeter & Area",
      description: "Measuring 2D shapes — how perimeter and area respond as a shape changes.",
      href: "/dashboard/mathematics/perimeter-area-explorer",
    },

    // --- Geometry Basics -------------------------------------------------
    {
      subjectSlug: "mathematics",
      topicSlug: "angle-spinner",
      title: "Angles",
      description: "Drag an arm to explore acute, right, obtuse, straight, and reflex angles.",
      href: "/dashboard/mathematics/angle-spinner",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "symmetry-mirror",
      title: "Symmetry",
      description: "Click squares on one side and watch them mirror instantly — an intro to line symmetry.",
      href: "/dashboard/mathematics/symmetry-mirror",
    },

    // --- Coordinate Geometry ---------------------------------------------
    {
      subjectSlug: "mathematics",
      topicSlug: "coordinate-plane-explorer",
      title: "Coordinate Plane",
      description: "The x and y axes, quadrants, and how a point's coordinates locate it.",
      href: "/dashboard/mathematics/coordinate-plane-explorer",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "plot-a-point",
      title: "Plotting Points",
      description: "Given a coordinate, place the point on the Cartesian plane.",
      href: "/dashboard/mathematics/plot-a-point",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "distance-between-two-points",
      title: "Distance Between Two Points",
      description: "Use the distance formula to measure the straight-line gap between two points.",
      href: "/dashboard/mathematics/distance-between-two-points",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "midpoint-of-a-line-segment",
      title: "Midpoint",
      description: "Find the point exactly halfway between two others.",
      href: "/dashboard/mathematics/midpoint-of-a-line-segment",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "slope-of-a-line",
      title: "Slope of a Line",
      description: "Drag two points and watch rise, run, and slope update together.",
      href: "/dashboard/mathematics/slope-of-a-line",
    },
    {
      // NOTE: this previously pointed at the existing Equation
      // Playground simulation, on the assumption that it already
      // covered graphing a line from its equation. On inspection
      // while building out this topic's Golden Learning Experience,
      // Equation Playground turned out to be an unrelated "find the
      // missing number in a + b = c" arithmetic game — it has no
      // slope/intercept graphing at all. Rather than build this
      // topic's GLE content on top of the wrong simulation, this now
      // points at a new, purpose-built Line Designer simulation
      // instead (`@/features/subjects/mathematics/line-designer`).
      // Equation Playground itself is untouched and still reachable
      // at its own page, just no longer mapped to this topic.
      subjectSlug: "mathematics",
      topicSlug: "line-designer",
      title: "Equation of a Straight Line",
      description: "Graph a line from its equation and see how slope and intercept shape it.",
      href: "/dashboard/mathematics/line-designer",
    },

    // --- Statistics --------------------------------------------------------
    {
      subjectSlug: "mathematics",
      topicSlug: "statistics-foundations",
      title: "Statistics Foundations",
      description: "Data, variables, and sampling — the vocabulary statistics builds on.",
      href: "/dashboard/mathematics/statistics-foundations",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "data-collection",
      title: "Data Collection & Representation",
      description: "Turn raw observations into a frequency table and a bar graph.",
      href: "/dashboard/mathematics/data-collection",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "central-tendency",
      title: "Central Tendency",
      description: "Mean, median, mode, and range — different ways to summarize a data set.",
      href: "/dashboard/mathematics/central-tendency",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "measures-of-dispersion",
      title: "Measures of Dispersion",
      description: "Variance and standard deviation — how spread out a data set really is.",
      href: "/dashboard/mathematics/measures-of-dispersion",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "graph-builder",
      title: "Graphs & Data Visualization",
      description: "Bar graphs, pie charts, and line graphs — and when to use each.",
      href: "/dashboard/mathematics/graph-builder",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "data-comparison",
      title: "Data Interpretation & Comparison",
      description: "Compare two datasets side by side and draw a real conclusion from the numbers.",
      href: "/dashboard/mathematics/data-comparison",
    },

    // --- Calculus ------------------------------------------------------------
    {
      subjectSlug: "mathematics",
      topicSlug: "calculus-foundations",
      title: "Calculus Foundations",
      description: "Functions, graphs, and limits — the ideas calculus is built from.",
      href: "/dashboard/mathematics/calculus-foundations",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "derivative-explorer",
      title: "Derivatives",
      description: "The tangent line and instantaneous rate of change, live on a graph.",
      href: "/dashboard/mathematics/derivative-explorer",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "derivative-rules",
      title: "Derivative Rules",
      description: "Power, product, and quotient rules — differentiation step by step.",
      href: "/dashboard/mathematics/derivative-rules",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "chain-rule-explorer",
      title: "Chain Rule",
      description: "Differentiating composite functions, one layer at a time.",
      href: "/dashboard/mathematics/chain-rule-explorer",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "applications-of-derivatives",
      title: "Applications of Derivatives",
      description: "Increasing, decreasing, maxima, and minima — derivatives applied to real curves.",
      href: "/dashboard/mathematics/applications-of-derivatives",
    },
  ],
};

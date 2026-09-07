import type { TopicContent } from "../types";

/**
 * Angle Spinner, Mathematics Geometry Basics topic. Reuses the
 * existing Angle Spinner simulation
 * (`@/features/subjects/mathematics/angle-spinner`) as-is — a single
 * draggable arm on a fixed vertex, a live 0-360\u00b0 readout, an info
 * card that classifies the current angle (acute/right/obtuse/
 * straight/reflex), and a snap-to-milestone celebration at exactly
 * 90\u00b0, 180\u00b0, and 360\u00b0. No simulation changes were needed — every
 * classification boundary taught below (acute < 90\u00b0, right = 90\u00b0,
 * obtuse 90\u00b0-180\u00b0, straight = 180\u00b0, reflex 180\u00b0-360\u00b0) matches
 * `angle-model.ts`'s `classifyAngle` exactly.
 *
 * `practice.quizId` points at a new, dedicated 30-question bank
 * (`@/features/quiz-engine/data/mathematics-angle-spinner-quiz.ts`).
 * The Challenge section follows the Slope Target pattern: manipulate
 * the live simulation to hit a described angle, then answer a
 * question about what you built, since the simulation has no
 * `onVerify` hook of its own.
 */
export const mathematicsAngleSpinnerContent: TopicContent = {
  subjectSlug: "mathematics",
  topicSlug: "angle-spinner",
  title: "Angle Spinner",
  subjectLabel: "Mathematics",
  topicLabel: "Geometry",
  colorToken: "math",
  simulationHref: "/dashboard/mathematics/angle-spinner",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Explain what an angle represents in terms of a vertex and two rays.",
      "Measure rotation in degrees, and recognize 90\u00b0 and 180\u00b0 as key reference points.",
      "Classify an angle as acute, right, obtuse, straight, or reflex from its degree measure.",
      "Estimate an angle's category by its appearance before checking the exact value.",
    ],
    concepts: [
      {
        term: "What an angle is",
        explanation:
          "An angle is formed wherever two rays (or \"arms\") meet at a shared endpoint. It measures the amount of turn, or rotation, between those two rays — not the length of the rays themselves.",
      },
      {
        term: "Vertex and arms",
        explanation:
          "The vertex is the fixed point where the two rays meet — in the simulation, the center point the arm spins around. The arms (or rays) are the two lines extending from the vertex; here, one arm is fixed and the other is the one you drag.",
      },
      {
        term: "Degrees and rotation",
        explanation:
          "An angle's size is measured in degrees, written with the \u00b0 symbol. A full rotation all the way around back to the start measures 360\u00b0 — every angle measure is some fraction of that full turn.",
        formula: "0^\\circ \\le \\text{angle} \\le 360^\\circ",
        formulaCaption: "One full rotation of the arm sweeps through 360\u00b0",
      },
      {
        term: "Acute angle",
        explanation: "An angle measuring less than 90\u00b0 — smaller and sharper than a right angle.",
      },
      {
        term: "Right angle",
        explanation: "An angle of exactly 90\u00b0 — a quarter turn, forming a perfect square corner.",
      },
      {
        term: "Obtuse angle",
        explanation: "An angle measuring more than 90\u00b0 but less than 180\u00b0 — wider than a right angle but not yet a straight line.",
      },
      {
        term: "Straight angle",
        explanation: "An angle of exactly 180\u00b0 — a half turn, where both arms point in exactly opposite directions and form a straight line.",
      },
      {
        term: "Reflex angle",
        explanation: "An angle measuring more than 180\u00b0 but less than 360\u00b0 — it sweeps past a straight line, continuing on toward a full turn.",
      },
    ],
    whyItMatters:
      "Recognizing angle types by sight is a skill that shows up constantly once you start looking for it — classifying triangles by their angles, reading architectural blueprints, adjusting a ramp's incline, or judging whether a picture frame is hanging level. Once acute, right, and obtuse angles are instantly recognizable without measuring, geometry problems (and plenty of everyday tasks) get much faster to reason through.",
    keyTerms: [
      { term: "Angle", definition: "The amount of rotation between two rays that share a common endpoint." },
      { term: "Vertex", definition: "The fixed point where the two rays of an angle meet." },
      { term: "Ray (arm)", definition: "One of the two lines extending from an angle's vertex." },
      { term: "Degree (\u00b0)", definition: "The unit used to measure an angle's rotation; a full turn measures 360\u00b0." },
      { term: "Acute angle", definition: "An angle measuring less than 90\u00b0." },
      { term: "Right angle", definition: "An angle measuring exactly 90\u00b0." },
      { term: "Obtuse angle", definition: "An angle measuring more than 90\u00b0 and less than 180\u00b0." },
      { term: "Straight angle", definition: "An angle measuring exactly 180\u00b0." },
      { term: "Reflex angle", definition: "An angle measuring more than 180\u00b0 and less than 360\u00b0." },
    ],
    misconceptions: [
      {
        id: "misconception-longer-arms-bigger-angle",
        misconception: "An angle drawn with longer arms is a bigger angle than one drawn with shorter arms.",
        correction:
          "An angle's size depends only on how much rotation there is between the two arms, not on how long the arms are drawn. Two angles can have arms of very different lengths and still measure exactly the same number of degrees.",
      },
      {
        id: "misconception-reflex-is-just-obtuse",
        misconception: "Any angle that looks \"wide\" or \"open\" is obtuse.",
        correction:
          "Obtuse angles stop at 180\u00b0. Once the rotation sweeps past a straight line and keeps going toward a full circle, it becomes reflex instead — a reflex angle is actually the larger, \"outside\" measurement of the same opening, always greater than 180\u00b0.",
      },
      {
        id: "misconception-right-angle-only-looks-one-way",
        misconception: "A right angle only counts if it's drawn in the standard upright \u201cL\u201d orientation.",
        correction:
          "A right angle is defined purely by its 90\u00b0 measure, not by which way it's rotated on the page. Spinning the whole angle to point in a different direction doesn't change its measure or its classification at all.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Predict each angle's category before dragging the arm to check it in Angle Spinner below.",
    scenarios: [
      {
        id: "mathematics-angle-spinner-predict-001",
        scenario: "You drag the arm to a position where it has rotated 40\u00b0 from the starting arm.",
        question: "Is this angle acute, right, obtuse, straight, or reflex?",
        options: [
          { id: "acute", label: "Acute" },
          { id: "right", label: "Right" },
          { id: "obtuse", label: "Obtuse" },
          { id: "reflex", label: "Reflex" },
        ],
        actualResultOptionId: "acute",
        explanation: "40\u00b0 is less than 90\u00b0, so it's an acute angle.",
        hint: "Is 40 less than, equal to, or greater than 90?",
      },
      {
        id: "mathematics-angle-spinner-predict-002",
        scenario: "You keep rotating the arm slowly past the point where it forms a perfect corner shape, continuing on toward 150\u00b0.",
        question: "What category is a 150\u00b0 angle?",
        options: [
          { id: "obtuse", label: "Obtuse" },
          { id: "right", label: "Right" },
          { id: "straight", label: "Straight" },
          { id: "reflex", label: "Reflex" },
        ],
        actualResultOptionId: "obtuse",
        explanation: "150\u00b0 is more than 90\u00b0 but less than 180\u00b0, which makes it obtuse.",
        hint: "Is 150 between 90 and 180?",
      },
      {
        id: "mathematics-angle-spinner-predict-003",
        scenario: "You rotate the arm until it points in exactly the opposite direction from the fixed arm, forming one continuous straight line.",
        question: "What is the degree measure and category of this angle?",
        options: [
          { id: "180-straight", label: "180\u00b0 \u2014 a straight angle" },
          { id: "90-right", label: "90\u00b0 \u2014 a right angle" },
          { id: "360-reflex", label: "360\u00b0 \u2014 a reflex angle" },
          { id: "0-acute", label: "0\u00b0 \u2014 an acute angle" },
        ],
        actualResultOptionId: "180-straight",
        explanation: "When the two arms point in exactly opposite directions, forming a straight line, the angle measures exactly 180\u00b0 \u2014 a straight angle.",
        hint: "What does the arm look like relative to the fixed arm when they form one straight line together?",
      },
      {
        id: "mathematics-angle-spinner-predict-004",
        scenario: "You keep rotating the arm past 180\u00b0, all the way to 200\u00b0.",
        question: "What category is a 200\u00b0 angle?",
        options: [
          { id: "reflex", label: "Reflex" },
          { id: "obtuse", label: "Obtuse" },
          { id: "straight", label: "Straight" },
          { id: "right", label: "Right" },
        ],
        actualResultOptionId: "reflex",
        explanation: "Any angle greater than 180\u00b0 and less than 360\u00b0 is reflex \u2014 200\u00b0 has swept past the straight-line point and kept going.",
        hint: "Is 200 greater than 180?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Drag the movable arm around the vertex and watch the degree readout update live.",
      "Read the info card's classification (acute, right, obtuse, straight, or reflex) as the angle changes.",
      "Feel for the celebration that fires when the arm snaps exactly to 90\u00b0, 180\u00b0, or a full 360\u00b0.",
      "Press Reset to return the arm to its 45\u00b0 starting position and try again.",
    ],
    tryThis: [
      "Try to stop the arm at exactly 90\u00b0 without looking at the degree number first \u2014 how close were you?",
      "Sweep the arm slowly past 180\u00b0 and notice the exact moment the classification switches from obtuse-adjacent straight to reflex.",
      "Find the halfway point between a right angle and a straight angle. What category is it in, and what is its exact degree measure?",
      "Sweep the arm all the way around to a full circle. At what degree measure does an angle stop being reflex and complete the turn?",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "mathematics-angle-spinner-explain-001",
        question: "Why do 90\u00b0 and 180\u00b0 mark the boundaries between angle categories, instead of some other numbers?",
        answer:
          "90\u00b0 is exactly a quarter of a full 360\u00b0 rotation \u2014 the point where two rays form a perfect square corner \u2014 and 180\u00b0 is exactly half a full rotation, where the two rays point in opposite directions and form a straight line. These two rotations are geometrically special (a quarter turn and a half turn), which is exactly why they're used as the dividing lines between acute/right/obtuse and obtuse/straight/reflex.",
      },
      {
        id: "mathematics-angle-spinner-explain-002",
        question: "Why does the same amount of arm rotation always produce the same angle measure, no matter which direction the whole spinner is facing?",
        answer:
          "An angle measures the rotation between two rays relative to each other, not their position on the screen or page. Spinning the entire setup \u2014 vertex, fixed arm, and moving arm together \u2014 doesn't change how far the moving arm has turned relative to the fixed one, so the degree measure and classification stay exactly the same.",
      },
      {
        id: "mathematics-angle-spinner-explain-003",
        question: "Why is a reflex angle always paired with a smaller angle on the \"other side\" of the same two rays?",
        answer:
          "Two rays meeting at a vertex actually create two angles at once \u2014 one on each side \u2014 and together those two angles always add up to a full 360\u00b0 rotation. If the angle the simulation reports has swept past 180\u00b0 into reflex territory, the angle on the other side of those same two rays is exactly 360\u00b0 minus that reflex measure, which is always under 180\u00b0.",
      },
      {
        id: "mathematics-angle-spinner-explain-004",
        question: "Why can't you rely on \"how wide it looks\" alone to classify an angle without checking the actual degree measure?",
        answer:
          "Visual width can be misleading, especially near the boundaries \u2014 an 88\u00b0 angle and a 92\u00b0 angle look almost identical, yet one is acute and the other is obtuse. Classification depends entirely on the precise degree measure crossing (or not crossing) 90\u00b0 or 180\u00b0, which is exactly why estimating first and then checking the exact number, rather than guessing from appearance alone, builds a much more reliable sense of angle size.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "mathematics-angle-spinner",
  },

  // -------------------------------------------------------------
  // CHALLENGE — Spin to the Target
  // -------------------------------------------------------------
  challenge: {
    intro: "Use Angle Spinner above \u2014 drag the arm to create each described angle, then answer below.",
    scenarios: [
      {
        id: "mathematics-angle-spinner-challenge-001",
        title: "Spin to the Target: Obtuse Range",
        scenario: "Drag the arm to create an obtuse angle between 110\u00b0 and 130\u00b0.",
        objective: "What degree measure did you land on, and confirm it falls in that range?",
        constraints: [{ id: "range", label: "Final angle must be between 110\u00b0 and 130\u00b0" }],
        tools: [{ id: "arm", label: "Draggable arm with a live degree readout and classification" }],
        answer: { mode: "numeric", target: 120, tolerance: 10 },
        explanation: "Any value from 110\u00b0 to 130\u00b0 is obtuse (it's above 90\u00b0 and below 180\u00b0) and satisfies the target.",
        hints: [
          "Obtuse angles fall strictly between 90\u00b0 and 180\u00b0.",
          "Aim for the middle of the range, around 120\u00b0, to give yourself room on both sides.",
        ],
      },
      {
        id: "mathematics-angle-spinner-challenge-002",
        title: "Spin to the Target: Exact Right Angle",
        scenario: "Drag the arm until it snaps to exactly a right angle.",
        objective: "What degree measure does a right angle always measure?",
        tools: [{ id: "arm", label: "Draggable arm that snaps to milestone angles" }],
        answer: { mode: "numeric", target: 90, tolerance: 0 },
        explanation: "A right angle measures exactly 90\u00b0 \u2014 a quarter of a full rotation.",
        hints: ["Think about a perfect square corner."],
      },
      {
        id: "mathematics-angle-spinner-challenge-003",
        title: "Spin to the Target: Reflex Angle",
        scenario: "Drag the arm to create a reflex angle of approximately 250\u00b0.",
        objective: "Confirm the classification the info card shows once you reach that measure.",
        constraints: [{ id: "range", label: "Final angle must be greater than 180\u00b0 and less than 360\u00b0" }],
        tools: [{ id: "arm", label: "Draggable arm with a live degree readout and classification" }],
        answer: {
          mode: "choice",
          options: [
            { id: "reflex", label: "Reflex" },
            { id: "obtuse", label: "Obtuse" },
            { id: "straight", label: "Straight" },
            { id: "right", label: "Right" },
          ],
          correctOptionId: "reflex",
        },
        explanation: "250\u00b0 is greater than 180\u00b0 and less than 360\u00b0, so the info card classifies it as reflex.",
        hints: ["What category covers every angle above 180\u00b0?"],
      },
      {
        id: "mathematics-angle-spinner-challenge-004",
        title: "Estimate, Then Verify",
        scenario: "Without looking at the degree readout, try to stop the arm exactly where you believe a 45\u00b0 angle would be, then check the actual reading.",
        objective: "How many degrees off was your estimate from the true 45\u00b0 mark?",
        answer: { mode: "numeric", target: 0, tolerance: 15 },
        explanation: "This challenge is about the estimating skill itself \u2014 getting within about 15\u00b0 by eye of a 45\u00b0 angle (halfway between 0\u00b0 and a right angle) shows a solid intuitive sense of angle size.",
        hints: ["45\u00b0 is exactly halfway between 0\u00b0 and a right angle (90\u00b0)."],
        requiresExperiment: true,
      },
      {
        id: "mathematics-angle-spinner-challenge-005",
        title: "Halfway Between Right and Straight",
        scenario: "Find the angle exactly halfway between a right angle and a straight angle, then create it in the simulation.",
        objective: "What is the degree measure of that halfway angle, and what category is it in?",
        tools: [{ id: "arm", label: "Draggable arm with a live degree readout and classification" }],
        answer: { mode: "numeric", target: 135, tolerance: 0 },
        explanation: "Halfway between 90\u00b0 and 180\u00b0 is (90 + 180) \u00f7 2 = 135\u00b0, which is obtuse since it's greater than 90\u00b0 and less than 180\u00b0.",
        hints: [
          "Average the two boundary values: (90 + 180) \u00f7 2.",
        ],
      },
      {
        id: "mathematics-angle-spinner-challenge-006",
        title: "The Angle on the Other Side",
        scenario: "Set the arm to create a reflex angle of exactly 300\u00b0.",
        objective: "What is the measure of the smaller angle formed on the other side of the same two rays?",
        tools: [{ id: "arm", label: "Draggable arm with a live degree readout and classification" }],
        answer: { mode: "numeric", target: 60, tolerance: 0 },
        explanation: "The two angles formed by the same pair of rays always add up to 360\u00b0. Since 360 \u2212 300 = 60, the angle on the other side measures 60\u00b0.",
        hints: [
          "The reflex angle and the angle on the other side together make a full 360\u00b0 turn.",
          "360 \u2212 300 = 60.",
        ],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "mathematics",
      topicSlug: "coordinate-plane-explorer",
      label: "Coordinate Plane",
      href: "/dashboard/mathematics/coordinate-plane-explorer",
      reason: "Angles reappear once lines and axes meet on the coordinate plane.",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "symmetry-mirror",
      label: "Symmetry",
      href: "/dashboard/mathematics/symmetry-mirror",
      reason: "Another core geometry idea \u2014 reflection \u2014 that, like angles, is about position and orientation rather than size.",
    },
  ],
};

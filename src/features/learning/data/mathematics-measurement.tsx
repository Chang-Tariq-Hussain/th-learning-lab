import type { TopicContent } from "../types";

/**
 * Measurement, Mathematics Batch 2 topic 6 of 7. Reuses the existing
 * Measurement Explorer simulation
 * (`@/features/subjects/mathematics/measurement-explorer`) — a
 * draggable virtual ruler with zero-point, unit-conversion, and
 * estimation panels. `learn`/`explore` content is adapted from the
 * simulation page's `SimulationLearnMore` block.
 * `practice.quizId` reuses the pre-existing 30-question bank at
 * `@/features/quiz-engine/data/mathematics-measurement-quiz.ts`
 * (id `mathematics-measurement`) rather than authoring a duplicate —
 * that bank already covers units, conversion, perimeter, and area
 * together; Perimeter & Area gets its own dedicated bank below for
 * topic-specific practice, per the one-quiz-per-topic convention used
 * everywhere else in this registry.
 */
export const mathematicsMeasurementContent: TopicContent = {
  subjectSlug: "mathematics",
  topicSlug: "measurement-explorer",
  title: "Measurement",
  subjectLabel: "Mathematics",
  topicLabel: "Measurement",
  colorToken: "math",
  simulationHref: "/dashboard/mathematics/measurement-explorer",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Explain why a ruler's zero point matters when taking a measurement.",
      "Convert a length between millimeters, centimeters, meters, and kilometers.",
      "Estimate a length before measuring, then compare the two.",
      "Read a ruler measurement accurately, avoiding common alignment mistakes.",
    ],
    concepts: [
      {
        term: "The zero point",
        explanation:
          "A measurement only works if you line up the ruler's zero mark with one end of the object. Starting from the edge of the ruler instead of the zero mark is a common mistake that throws off the whole reading.",
      },
      {
        term: "Unit conversions",
        explanation:
          "Length can be expressed in different units depending on the scale — millimeters and centimeters for small objects, meters for room-sized distances, kilometers for long distances. Each unit is a fixed multiple of the next.",
        formula: "1\\,m = 100\\,cm = 1000\\,mm, \\quad 1\\,km = 1000\\,m",
        formulaCaption: "Common length conversions",
      },
      {
        term: "Estimating first",
        explanation:
          "Making a rough guess before measuring builds a feel for scale, and comparing your estimate to the real measurement afterward is a fast way to sharpen that sense over time.",
      },
    ],
    whyItMatters:
      "Accurate measurement is a foundational skill behind construction, sewing, cooking, and just about any hands-on task — and lining up the zero point correctly is exactly the kind of small detail that causes real measuring mistakes. Comfort switching between units also matters the moment you're working from a recipe in one unit system or a blueprint in another.",
    keyTerms: [
      { term: "Zero point", definition: "The starting mark on a ruler that a measurement must be lined up against." },
      { term: "Unit conversion", definition: "Rewriting the same length in a different unit, using a fixed multiplying or dividing factor." },
      { term: "Estimation", definition: "A reasoned guess made before measuring, used to build a sense of scale." },
    ],
    misconceptions: [
      {
        id: "misconception-ruler-edge-is-zero",
        misconception: "The edge of a ruler is always the zero point.",
        correction:
          "Some rulers have a small gap or worn edge before the actual zero mark. Always line up the printed \"0,\" not the physical edge of the ruler, or the reading will be off.",
      },
      {
        id: "misconception-bigger-unit-bigger-number",
        misconception: "A measurement in a bigger unit is always a bigger number.",
        correction:
          "It's the opposite — the same length gives a smaller number in a bigger unit. 100 cm and 1 m are the same length, but 1 (in meters) is a much smaller number than 100 (in centimeters).",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Predict each answer, then check it against the Measurement Explorer below.",
    scenarios: [
      {
        id: "mathematics-measurement-predict-001",
        scenario: "You place a ruler against an object, but the ruler's zero mark is 1 cm past the object's left edge instead of lined up with it.",
        question: "What happens to the reading if you don't account for this?",
        options: [
          { id: "reads-short", label: "The measurement will read 1 cm shorter than the object's real length" },
          { id: "no-effect", label: "It has no effect on the reading" },
          { id: "reads-long", label: "The measurement will read 1 cm longer than the object's real length" },
          { id: "doubles", label: "The measurement will double" },
        ],
        actualResultOptionId: "reads-short",
        explanation: "If the zero mark starts 1 cm past the object's edge, the ruler skips measuring that first centimeter, making the object appear 1 cm shorter than it really is.",
        hint: "If the ruler starts measuring \"late,\" does the object seem longer or shorter than it is?",
      },
      {
        id: "mathematics-measurement-predict-002",
        scenario: "An object measures 250 cm.",
        question: "What is this length in meters?",
        options: [
          { id: "2-5", label: "2.5 m" },
          { id: "25", label: "25 m" },
          { id: "0-25", label: "0.25 m" },
          { id: "250", label: "250 m" },
        ],
        actualResultOptionId: "2-5",
        explanation: "Since 100 cm = 1 m, dividing 250 by 100 gives 2.5 m.",
        hint: "How many centimeters are in one meter?",
      },
      {
        id: "mathematics-measurement-predict-003",
        scenario: "You estimate an object is about 15 cm long before measuring it.",
        question: "If the object actually measures 18 cm, how far off was your estimate?",
        options: [
          { id: "3", label: "3 cm" },
          { id: "33", label: "33 cm" },
          { id: "15", label: "15 cm" },
          { id: "18", label: "18 cm" },
        ],
        actualResultOptionId: "3",
        explanation: "The difference between the estimate (15 cm) and the actual measurement (18 cm) is 18 − 15 = 3 cm.",
        hint: "Subtract the smaller number from the larger one.",
      },
      {
        id: "mathematics-measurement-predict-004",
        scenario: "You convert 3 km into meters.",
        question: "What is the result?",
        options: [
          { id: "3000", label: "3,000 m" },
          { id: "300", label: "300 m" },
          { id: "30000", label: "30,000 m" },
          { id: "3", label: "3 m" },
        ],
        actualResultOptionId: "3000",
        explanation: "Since 1 km = 1,000 m, multiplying 3 by 1,000 gives 3,000 m.",
        hint: "How many meters are in one kilometer?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Drag the virtual ruler until its zero point lines up with the start of the object.",
      "Read off the measurement where the object ends.",
      "Switch the display between mm, cm, m, and km and watch the same length expressed differently.",
      "Estimate an object's length before measuring, then compare your guess to the actual result.",
    ],
    tryThis: [
      "Measure an object starting from the ruler's edge instead of its zero point. How far off does your reading end up?",
      "Estimate an object's length in centimeters, then measure it and calculate how close your estimate was.",
      "Convert a measurement in centimeters into millimeters and into meters without a calculator.",
      "Pick the most appropriate unit (mm, cm, m, or km) for three very differently-sized objects, before measuring.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "mathematics-measurement-explain-001",
        question: "Why does lining up the zero point matter so much for an accurate measurement?",
        answer:
          "A ruler measures the distance from its zero mark. If the zero mark isn't aligned with the start of the object, the ruler is silently measuring from the wrong starting point, and every reading taken from it is off by that same offset.",
      },
      {
        id: "mathematics-measurement-explain-002",
        question: "Why does converting to a bigger unit make the number smaller, even though the actual length hasn't changed?",
        answer:
          "A bigger unit represents a bigger \"chunk\" of length, so it takes fewer of them to cover the same distance. The length itself is unchanged — only how many units it takes to describe it changes.",
      },
      {
        id: "mathematics-measurement-explain-003",
        question: "Why is estimating before measuring a genuinely useful habit, not just an extra step?",
        answer:
          "Estimating forces you to actively reason about scale using what you already know, and comparing that estimate to the real measurement afterward gives immediate feedback that sharpens your sense of length over time — a skill a ruler alone can't teach you.",
      },
      {
        id: "mathematics-measurement-explain-004",
        question: "Why do different situations call for different units of length?",
        answer:
          "A unit that's convenient for one scale becomes awkward at another — measuring a room in millimeters or a country in centimeters produces unwieldy numbers. Picking a unit close to the actual scale keeps the numbers easy to read and compare.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "mathematics-measurement",
  },

  // -------------------------------------------------------------
  // CHALLENGE — Measurement Lab
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Use the Measurement Explorer above to select units, measure, and construct these targets. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "mathematics-measurement-challenge-001",
        title: "Measurement Lab: Hit the Target Length",
        scenario: "The Measurement Explorer above asks you to line up the ruler so an object reads exactly 12.5 cm.",
        objective: "Position the ruler's zero point correctly and confirm the reading.",
        constraints: [{ id: "c1", label: "The ruler's zero mark must be aligned with the object's start." }],
        tools: [{ id: "ruler", label: "Draggable virtual ruler" }],
        answer: { mode: "numeric", unit: "cm", target: 12.5, tolerance: 0.2 },
        explanation: "Lining the zero mark up with the object's start and reading where it ends gives the correct measurement of 12.5 cm.",
        hints: [
          "Make sure the ruler's printed \"0,\" not its physical edge, touches the object's start.",
          "Read the mark where the object's far end lines up.",
        ],
      },
      {
        id: "mathematics-measurement-challenge-002",
        title: "Convert and Confirm",
        scenario: "An object measures 4.2 m on the ruler.",
        objective: "Convert this measurement to centimeters.",
        requiresExperiment: false,
        answer: { mode: "numeric", unit: "cm", target: 420, tolerance: 0 },
        explanation: "Since 1 m = 100 cm, multiplying 4.2 by 100 gives 420 cm.",
        hints: [
          "Multiply by 100 to convert meters to centimeters.",
          "4.2 × 100 = ?",
        ],
      },
      {
        id: "mathematics-measurement-challenge-003",
        title: "Estimate vs. Actual",
        scenario: "You estimate a hallway is about 8 m long. The actual measurement in the lab reads 950 cm.",
        objective: "Convert the actual measurement to meters and find how far off your estimate was.",
        requiresExperiment: false,
        answer: { mode: "numeric", unit: "m", target: 1.5, tolerance: 0.1 },
        explanation: "950 cm converts to 9.5 m. The estimate of 8 m was off by 9.5 − 8 = 1.5 m.",
        hints: [
          "First convert 950 cm to meters by dividing by 100.",
          "Then subtract your estimate from the actual value.",
        ],
      },
      {
        id: "mathematics-measurement-challenge-004",
        title: "Choose the Right Unit",
        scenario: "You need to measure the length of a pencil, the height of a door, and the distance between two cities.",
        objective: "For the pencil specifically, choose the most appropriate unit and state its typical measurement in that unit (a typical pencil is about 18 cm).",
        answer: { mode: "numeric", unit: "cm", target: 18, tolerance: 3 },
        explanation: "Centimeters are the most practical unit for something pencil-sized — a typical pencil measures around 18 cm.",
        hints: [
          "Millimeters would give an unnecessarily large number; meters would round to almost nothing.",
          "Think about how many centimeters long a standard pencil usually is.",
        ],
      },
    ],
  },

  relatedTopics: [],
};

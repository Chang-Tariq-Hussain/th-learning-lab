import type { TopicContent } from "../types";

/**
 * Interactive Magnet Explorer — Physics Batch 4 (Electromagnetism),
 * topic 1 of 2. Brings the existing drag-and-rotate bar magnet
 * playground (`@/features/subjects/physics/magnet-explorer`) up to
 * the same full Learn/Predict/Explore/Explain/Practice/Challenge
 * standard as the rest of Physics. The simulation already supported
 * everything this batch's brief asked for — free dragging, rotation
 * via a tip handle, a live attract/repel settle loop, per-magnet
 * field-line arcs that track position and rotation, a live
 * "what's happening" status panel, and four preset experiments
 * (opposite poles, like poles, rotate one magnet, separate) — so no
 * simulation code changes were needed; this file is purely the
 * educational wrapper the architecture is built for. Every Learn,
 * Predict, Explain, and Challenge item below is grounded in the
 * simulation's own real mechanics (`magnet-physics.ts`'s pole-pair
 * force rule, `magnet-model.ts`'s pole geometry, and the four presets
 * in `experiments.ts`) rather than an invented example.
 *
 * `practice.quizId` deliberately reuses the pre-existing
 * `physics-electromagnetism` bank (30 questions, in
 * `@/features/quiz-engine/data/physics-electromagnetism-quiz.ts`)
 * rather than authoring a new one — that bank's own doc comment
 * already states it was written to match both this simulation and
 * the Compass Explorer's, and most of its questions (poles,
 * attraction/repulsion, field lines, cutting a magnet in half) are
 * squarely this topic's own material. Compass Explorer gets its own,
 * newly-authored bank (`physics-compass-explorer`) focused on what
 * that bank doesn't already cover in depth — needle alignment,
 * investigating field direction, and Earth's field — so the two
 * topics' Practice content stays distinct rather than being read
 * twice under two different quiz ids.
 */
export const physicsMagnetExplorerContent: TopicContent = {
  subjectSlug: "physics",
  topicSlug: "magnet-explorer",
  title: "Interactive Magnet Explorer",
  subjectLabel: "Physics",
  topicLabel: "Electromagnetism",
  colorToken: "physics",
  simulationHref: "/dashboard/physics/magnet-explorer",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Identify a magnet's north and south poles, and explain that every magnet has both, no matter how small it's cut.",
      "Predict whether two magnets attract or repel from which poles face each other.",
      "Describe a magnetic field as the region around a magnet where its force can be felt, and field lines as a way to visualize it — not a physical structure.",
      "Explain how field strength and force change as two magnets move closer together or farther apart.",
      "Describe, at an introductory level, how Earth behaves approximately like a giant magnet.",
    ],
    concepts: [
      {
        term: "Magnets and poles",
        explanation:
          "A magnet is an object that produces a magnetic field and attracts certain metals. Every magnet has two ends, called poles — a north pole and a south pole — and this is true of any magnet, however large or small.",
      },
      {
        term: "Like poles repel, opposite poles attract",
        explanation:
          "Bring two north poles (or two south poles) close together and they push apart. Bring a north pole close to a south pole and they pull toward each other. This single rule explains every interaction in the playground above.",
      },
      {
        term: "Magnetic field",
        explanation:
          "A magnetic field is the region of space around a magnet where its force can act on other magnets or magnetic materials. You can't see a field directly — the field lines in the simulation are a model that makes its direction and shape visible, not physical strings running through space.",
      },
      {
        term: "Field lines as a model",
        explanation:
          "By convention, field lines are drawn leaving a magnet's north pole and curving around to enter its south pole. Where the lines are drawn closer together, the field is modeled as stronger; where they're spread farther apart, weaker. This is a useful, standard way to visualize a field — it isn't evidence that lines are physically there.",
      },
      {
        term: "Distance and field strength",
        explanation:
          "The magnetic force between two magnets grows rapidly stronger as they get closer, and fades rapidly as they move apart — which is exactly what you can feel (and see reflected in how fast the free magnet accelerates) in the playground above as you drag one magnet toward or away from the other.",
      },
      {
        term: "Earth's magnetic field",
        explanation:
          "Earth itself behaves approximately like a giant bar magnet, generated deep in its molten outer core rather than by a physical bar of metal. This is the field a compass responds to — covered in full in the Compass Explorer, which follows this topic.",
      },
    ],
    whyItMatters:
      "The same attract/repel rule you're testing on two small bar magnets scales up to power electric motors, focus the beams inside MRI machines, store data on hard drives, and hold the note on your fridge door. It's also, at planetary scale, the same rule behind Earth's own magnetic field — the thing that has pointed compass needles north for centuries and that shields the whole planet from much of the Sun's radiation.",
    keyTerms: [
      { term: "Magnet", definition: "An object that produces a magnetic field and attracts certain metals." },
      { term: "North pole / South pole", definition: "The two ends every magnet has, whatever its size — never just one." },
      { term: "Magnetic field", definition: "The region around a magnet where its force can act on other magnets or magnetic materials." },
      { term: "Field line", definition: "A modeling tool showing a field's direction and (via spacing) relative strength — conventionally drawn from north to south outside the magnet." },
      { term: "Attraction", definition: "The pull between two unlike poles (N–S)." },
      { term: "Repulsion", definition: "The push between two like poles (N–N or S–S)." },
    ],
    misconceptions: [
      {
        id: "misconception-field-lines-are-physical",
        misconception: "Magnetic field lines are real, physical lines or strings that exist in space.",
        correction:
          "Field lines are a model — a way of drawing a magnetic field's direction and relative strength so it can be visualized and reasoned about. The magnetic field itself is real and continuous throughout the surrounding space; the discrete lines drawn to represent it are a diagram convention, not physical objects.",
      },
      {
        id: "misconception-isolated-pole",
        misconception: "You can create a magnet with only one pole by cutting a bar magnet in half.",
        correction:
          "Cutting a bar magnet in half always produces two complete, smaller magnets, each with its own north and south pole — never one isolated pole on its own. No matter how many times a magnet is divided, every piece still has both poles.",
      },
      {
        id: "misconception-all-metals-attracted",
        misconception: "Magnets attract every kind of metal.",
        correction:
          "Magnets strongly attract only a specific group of materials — iron, nickel, cobalt, and their alloys (like steel). Many common metals, including aluminum, copper, and gold, aren't noticeably attracted to an ordinary magnet at all.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Predict what will happen before you try each move in the playground below — then check yourself.",
    scenarios: [
      {
        id: "physics-magnet-explorer-predict-001",
        scenario: "You're about to drag Magnet B's north pole so it faces Magnet A's north pole, close up.",
        question: "What will happen when these two north poles face each other?",
        options: [
          { id: "repel", label: "They'll push apart (repel)" },
          { id: "attract", label: "They'll pull together (attract)" },
          { id: "nothing", label: "Nothing — poles don't affect other poles of the same kind" },
        ],
        actualResultOptionId: "repel",
        explanation: "Like poles — north facing north — always repel. You'd see the free magnet pushed away as it settles.",
        hint: "Are these two poles the same kind, or opposite kinds?",
      },
      {
        id: "physics-magnet-explorer-predict-002",
        scenario: "The two magnets are currently attracting, with A's north pole facing B's south pole.",
        question: "What happens if you drag them farther apart, well outside the playground's interaction range?",
        options: [
          { id: "fades-to-none", label: "The pull fades until there's effectively no interaction" },
          { id: "gets-stronger", label: "The pull gets stronger the farther apart they are" },
          { id: "flips-to-repel", label: "They'll suddenly start repelling instead" },
        ],
        actualResultOptionId: "fades-to-none",
        explanation: "Magnetic force weakens quickly with distance. Beyond the simulation's interaction range, the pull becomes negligible and the status panel reports no interaction.",
        hint: "Does magnetic force get stronger or weaker as two magnets move apart?",
      },
      {
        id: "physics-magnet-explorer-predict-003",
        scenario: "Magnet A and Magnet B are currently attracting. You're about to rotate Magnet B by 180°, flipping which pole faces Magnet A.",
        question: "What happens when one magnet is rotated a full 180°?",
        options: [
          { id: "flips-to-repel", label: "The interaction flips — attraction becomes repulsion" },
          { id: "stays-attract", label: "Nothing changes — they keep attracting" },
          { id: "goes-neutral", label: "They stop interacting entirely" },
        ],
        actualResultOptionId: "flips-to-repel",
        explanation: "Flipping a magnet 180° swaps which of its poles faces the other magnet. If matching poles are now facing each other, attraction becomes repulsion.",
        hint: "After a 180° flip, which of Magnet B's poles is now closest to Magnet A?",
      },
      {
        id: "physics-magnet-explorer-predict-004",
        scenario: "You rotate one magnet by 90°, so it's now sideways instead of pointing at the other magnet.",
        question: "What happens to that magnet's field-line pattern?",
        options: [
          { id: "turns-with-it", label: "The field lines rotate along with the magnet, still running from its north to its south pole" },
          { id: "stays-fixed", label: "The field lines stay pointing the original direction, ignoring the rotation" },
          { id: "disappears", label: "The field lines disappear until the magnet is rotated back" },
        ],
        actualResultOptionId: "turns-with-it",
        explanation: "A magnet's field is fixed relative to the magnet itself — rotate the magnet, and its entire field pattern (and the field lines drawn to represent it) turns right along with it.",
        hint: "Is a magnet's field attached to the magnet, or to a fixed direction in the room?",
      },
      {
        id: "physics-magnet-explorer-predict-005",
        scenario: "You drag Magnet B very close to Magnet A — much closer than they started.",
        question: "What happens to the strength of the interaction between them?",
        options: [
          { id: "much-stronger", label: "It gets noticeably stronger — force grows quickly at short range" },
          { id: "same", label: "It stays about the same regardless of distance" },
          { id: "weaker", label: "It gets weaker the closer they get" },
        ],
        actualResultOptionId: "much-stronger",
        explanation: "Magnetic force grows rapidly as poles get closer together — you'll see the free magnet accelerate noticeably faster the nearer it gets, whether it's being pulled in or pushed away.",
        hint: "Think about what happens to force as distance shrinks, not grows.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Drag either magnet anywhere in the playground and watch the other one respond.",
      "Drag the small circle at a magnet's tip to rotate it — watch its field lines turn with it.",
      "Watch the \"What's happening\" panel below the playground update live as you move the magnets.",
      "Try each of the four preset experiments — Opposite poles together, Like poles together, Rotate one magnet, and Separate the magnets — and read its description before running it.",
      "Use Reset at any point to return both magnets to their starting position.",
    ],
    tryThis: [
      "Run \"Like poles together,\" then slowly rotate one magnet 180° until it becomes \"Opposite poles together.\" Watch exactly when the status panel switches from repel to attract.",
      "Run \"Separate the magnets,\" then slowly drag them back together and notice how quickly the interaction reappears once they cross into range.",
      "Run \"Rotate one magnet\" and describe, in your own words, how that magnet's field-line pattern changed compared to before.",
      "Try to find a magnet position where neither attraction nor repulsion is happening, even though the magnets are still on-screen.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "physics-magnet-explorer-explain-001",
        question: "You brought two north poles together and they pushed apart. Why?",
        answer:
          "Like magnetic poles repel. North and north are the same kind of pole, so they push each other away — the same rule that made two south poles repel, or that makes opposite poles pull together instead.",
      },
      {
        id: "physics-magnet-explorer-explain-002",
        question: "You separated the two magnets and the interaction faded away. Why doesn't it just get weaker forever without ever really disappearing?",
        answer:
          "In principle, a magnetic field does technically extend outward without a sharp cutoff, fading smoothly rather than switching off. In practice, it becomes so weak at larger distances that it's no longer noticeable or meaningful — which is what the simulation's interaction range represents: the point past which the force is close enough to zero that it's no longer treated as an active interaction.",
      },
      {
        id: "physics-magnet-explorer-explain-003",
        question: "You rotated one magnet and its field lines turned with it. Why?",
        answer:
          "A magnet's field comes from the magnet itself — it isn't a separate object sitting in a fixed spot. Rotating the magnet changes where its north and south poles point, and the field (and the lines used to represent it) rotates right along with those poles.",
      },
      {
        id: "physics-magnet-explorer-explain-004",
        question: "Moving the magnets closer together made the interaction noticeably stronger. Why?",
        answer:
          "Magnetic force between two poles grows quickly as the distance between them shrinks — the closer two poles are, the more strongly they push or pull. This is the same reason the free magnet visibly accelerates faster the nearer it gets to the other one.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "physics-electromagnetism",
  },

  // -------------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------------
  challenge: {
    intro: "Use the Magnet Explorer playground above to test your reasoning on each challenge below.",
    scenarios: [
      {
        id: "physics-magnet-explorer-challenge-001",
        title: "Arrange for Attraction",
        scenario: "Magnet A is fixed pointing its north pole to the right (toward Magnet B). Magnet B currently has its north pole also facing left, toward Magnet A.",
        objective: "Which pole configuration will make the two magnets attract?",
        tools: [{ id: "playground", label: "Magnet Explorer playground — drag and rotate Magnet B" }],
        answer: {
          mode: "choice",
          options: [
            { id: "correct", label: "Rotate Magnet B 180° so its south pole faces Magnet A's north pole" },
            { id: "wrong-a", label: "Leave Magnet B as it is" },
            { id: "wrong-b", label: "Move Magnet B farther away without rotating it" },
          ],
          correctOptionId: "correct",
          },
        explanation: "With both north poles currently facing each other, they repel. Rotating Magnet B 180° puts its south pole facing Magnet A's north pole — opposite poles, which attract.",
        hints: ["Attraction needs opposite poles facing each other. Which pole is currently facing Magnet A?"],
      },
      {
        id: "physics-magnet-explorer-challenge-002",
        title: "Identify the Configuration",
        scenario: "You run the \"Opposite poles together\" experiment, then watch the status panel report repulsion instead of attraction.",
        objective: "What's the most likely explanation, given that the experiment is supposed to bring N face to face with S?",
        requiresExperiment: true,
        answer: {
          mode: "choice",
          options: [
            { id: "correct", label: "One of the magnets was manually rotated afterward, changing which pole now faces the other" },
            { id: "wrong-a", label: "The simulation's attract/repel rule reversed itself" },
            { id: "wrong-b", label: "Distance alone can flip attraction into repulsion" },
          ],
          correctOptionId: "correct",
        },
        explanation: "Distance changes force strength, not its type, and the attract/repel rule never changes. If the status shows repel right after an \"opposite poles\" preset, the most likely cause is a rotation applied after the preset loaded, which changed which pole is actually facing the other magnet.",
        hints: ["Rule out what distance can and can't do to an interaction — can it change attract into repel?"],
      },
      {
        id: "physics-magnet-explorer-challenge-003",
        title: "Predict, Then Verify: Rotate One Magnet",
        scenario: "Starting from the \"Rotate one magnet\" preset, predict what pole is now closest to the other magnet, then run the experiment to check.",
        objective: "Before running the experiment, predict whether the two magnets will attract, repel, or show no interaction once the preset loads.",
        tools: [{ id: "playground", label: "Rotate one magnet preset button" }],
        requiresExperiment: true,
        answer: {
          mode: "choice",
          options: [
            { id: "correct", label: "It depends on exactly which poles end up closest — check the status panel to confirm" },
            { id: "wrong-a", label: "Rotating a magnet always causes repulsion" },
            { id: "wrong-b", label: "Rotating a magnet always causes attraction" },
          ],
          correctOptionId: "correct",
        },
        explanation: "Rotation alone doesn't determine attract or repel — what matters is which specific poles end up closest to each other afterward. Running the preset and reading the live status panel is the only reliable way to know, which is exactly the point of this challenge.",
        hints: ["There's no universal rule that rotation always causes one particular outcome — it depends on the resulting pole positions."],
      },
      {
        id: "physics-magnet-explorer-challenge-004",
        title: "Reading a Field-Line Pattern",
        scenario: "You're shown a magnet's field lines curving out from its left end and looping back into its right end.",
        objective: "Which end is the north pole, and which is the south pole?",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "correct", label: "Left end is north; right end is south" },
            { id: "wrong-a", label: "Left end is south; right end is north" },
            { id: "wrong-b", label: "Both ends are the same pole" },
          ],
          correctOptionId: "correct",
        },
        explanation: "By convention, field lines are drawn leaving the north pole and curving around to enter the south pole. Lines that emerge from the left and loop into the right mean the left end is north and the right end is south.",
        hints: ["Recall the convention for which pole field lines leave from, and which pole they enter."],
      },
      {
        id: "physics-magnet-explorer-challenge-005",
        title: "Model, Not Measurement",
        scenario: "A classmate says the field lines shown in the simulation prove there are a fixed, countable number of actual lines of force surrounding each magnet.",
        objective: "Is your classmate's reasoning correct?",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "correct", label: "No — field lines are a visualization convention, not a count of physically real, discrete lines" },
            { id: "wrong-a", label: "Yes — the exact number of lines is a measurable physical quantity" },
            { id: "wrong-b", label: "Yes, but only for very strong magnets" },
          ],
          correctOptionId: "correct",
        },
        explanation: "A magnetic field is continuous throughout the space around a magnet, not made of a discrete, countable set of lines. Field-line diagrams draw a chosen number of representative lines to make the field's direction and relative strength easy to see — that choice is about clarity, not a measurement of how many lines \"really\" exist.",
        hints: ["Think back to what a field line actually represents, versus what it might look like it's claiming."],
      },
      {
        id: "physics-magnet-explorer-challenge-006",
        title: "Snap a Magnet in Half",
        scenario: "Imagine cutting one of the playground's bar magnets exactly in half, perpendicular to its length.",
        objective: "How many poles do the two resulting pieces have in total?",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "correct", label: "Four — each half becomes its own complete magnet with a north and a south pole" },
            { id: "wrong-a", label: "Two — the original two poles are just now farther apart" },
            { id: "wrong-b", label: "One isolated north pole and one isolated south pole" },
          ],
          correctOptionId: "correct",
        },
        explanation: "No magnet has ever been observed with only one pole. Cutting a bar magnet produces two smaller, complete magnets, each with its own north and south pole — two pieces means four poles total, not two isolated single poles.",
        hints: ["Has anyone ever isolated a single magnetic pole on its own? What does that tell you about what happens when a magnet is cut?"],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "physics",
      topicSlug: "compass-explorer",
      label: "Interactive Compass Explorer",
      href: "/dashboard/physics/compass-explorer",
      reason: "Use a compass to investigate the direction of the magnetic field you just explored.",
    },
  ],
};

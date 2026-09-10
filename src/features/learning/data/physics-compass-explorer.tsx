import type { TopicContent } from "../types";

/**
 * Interactive Compass Explorer — Physics Batch 4 (Electromagnetism),
 * topic 2 of 2, following Magnet Explorer. Brings the existing
 * drag-a-magnet-and-a-compass playground
 * (`@/features/subjects/physics/compass-explorer`) up to the same
 * full standard. The simulation already supported everything this
 * batch's brief asked for — a draggable compass whose needle
 * continuously realigns with the field produced by a draggable,
 * rotatable magnet (`compass-field.ts`'s field-direction-and-strength
 * model), a fading field-direction wedge and live strength readout
 * around the needle itself, an explanatory status panel, and four
 * preset experiments (near the north pole, orbit the magnet, move far
 * away, flip the magnet) — so no simulation code changes were needed;
 * this file is purely the educational wrapper. Every Learn, Predict,
 * Explain, and Challenge item is grounded in the simulation's own
 * mechanics and the four existing presets, never an invented example.
 *
 * `practice.quizId` points at a newly-authored 30-question bank
 * (`physics-compass-explorer`, in `@/features/quiz-engine`) rather
 * than the pre-existing `physics-electromagnetism` bank that Magnet
 * Explorer's Practice reuses (see that topic's own doc comment) —
 * that bank already covers general pole/field material, so this one
 * is scoped to what it doesn't already cover in depth: how a compass
 * investigates field direction, reading needle behavior at different
 * positions, and Earth's own field (including the geographic-vs-
 * magnetic-north distinction), keeping the two topics' Practice
 * content genuinely distinct.
 */
export const physicsCompassExplorerContent: TopicContent = {
  subjectSlug: "physics",
  topicSlug: "compass-explorer",
  title: "Interactive Compass Explorer",
  subjectLabel: "Physics",
  topicLabel: "Electromagnetism",
  colorToken: "physics",
  simulationHref: "/dashboard/physics/compass-explorer",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Explain that a compass needle is itself a small, freely-rotating magnet, not a separate kind of object.",
      "Describe how a compass needle aligns with the local magnetic field, rather than being pulled straight toward a magnet.",
      "Use a compass to investigate a magnetic field's direction at different positions around a magnet.",
      "Explain why a compass points differently at different distances and positions relative to a magnet.",
      "Describe, at an introductory level, why compasses generally point north, and distinguish geographic north from magnetic north.",
    ],
    concepts: [
      {
        term: "A compass is a tiny magnet",
        explanation:
          "The needle inside a compass is a small, lightweight magnet, free to spin on a low-friction pivot. Like any magnet, it has its own north and south pole — it's simply small and well-balanced enough to rotate easily in response to a nearby field.",
      },
      {
        term: "Aligning with the field, not pointing at the magnet",
        explanation:
          "A compass needle doesn't swivel to point straight at a magnet the way an arrow aims at a target. It rotates to line up with the direction of the magnetic field exactly where it happens to be sitting — which is why the needle can end up pointing sideways, or even away from a nearby magnet, depending on its position.",
      },
      {
        term: "Compass as an investigation tool",
        explanation:
          "Because the needle continuously realigns with whatever field surrounds it, moving a compass to different spots and recording which way it points is a genuine way to map out a magnetic field's direction across a whole region — one reading at a time.",
      },
      {
        term: "Position and distance change the reading",
        explanation:
          "A magnetic field's direction curves through space rather than pointing the same way everywhere. Moving the compass changes what direction the local field is pointing in, so the needle's heading changes with position — and farther from a magnet, the field is weaker, so the needle responds more slowly and settles less firmly.",
      },
      {
        term: "Earth's magnetic field",
        explanation:
          "Earth behaves approximately like an enormous bar magnet, with a field generated deep in its molten outer core. A compass left on its own eventually settles to align with that planet-scale field, which is why compasses have guided travelers for centuries without needing a nearby magnet at all.",
      },
      {
        term: "Geographic north vs. magnetic north",
        explanation:
          "Geographic north is the fixed point where Earth's axis of rotation meets the surface. Magnetic north is the direction a compass needle actually points, which is close to — but not exactly at — geographic north, and which drifts gradually over years as Earth's magnetic field itself shifts. The two are related but are not identical.",
      },
    ],
    whyItMatters:
      "This is the same tool that guided sailors across open ocean centuries before satellite navigation existed — and the same underlying idea (something free to rotate settling into alignment with a magnetic field) still shows up today in magnetic compasses on phones, in MRI machines, and in sensors that detect magnetic fields for navigation and industry.",
    keyTerms: [
      { term: "Compass needle", definition: "A small, freely-rotating magnet that aligns with the local magnetic field." },
      { term: "Field direction", definition: "The direction a magnetic field points at a particular location — what a compass needle actually detects and aligns with." },
      { term: "Magnetic north", definition: "The direction a compass needle points, determined by Earth's magnetic field." },
      { term: "Geographic north", definition: "The fixed location where Earth's rotational axis meets the surface — distinct from magnetic north." },
    ],
    misconceptions: [
      {
        id: "misconception-compass-points-at-magnet",
        misconception: "A compass needle always points directly toward the nearest magnet, like an arrow aimed at a target.",
        correction:
          "A compass needle aligns with the magnetic field at its own location, and a field's direction curves through space rather than pointing straight at its source from everywhere. Depending on where the compass sits, the needle can end up pointing sideways to the magnet, or even away from it, while still correctly showing the field's local direction.",
      },
      {
        id: "misconception-random-needle",
        misconception: "A compass needle's direction is essentially random or unpredictable.",
        correction:
          "A compass needle's direction is fully determined by the surrounding magnetic field at that exact position — moving the magnet, rotating it, or moving the compass all produce a specific, physically consistent change in the field, and the needle reliably follows it. It only looks unpredictable if the underlying field itself hasn't been mapped out yet.",
      },
      {
        id: "misconception-geographic-magnetic-north-identical",
        misconception: "Magnetic north and geographic north are the exact same location.",
        correction:
          "They're close but not identical. Geographic north is the fixed point where Earth's rotational axis meets the surface; magnetic north is the direction defined by Earth's magnetic field, which sits some distance away and drifts gradually over time. For most everyday navigation the difference is small, but it isn't zero.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Before you move the magnet or the compass, predict what the needle will do — then check yourself in the playground below.",
    scenarios: [
      {
        id: "physics-compass-explorer-predict-001",
        scenario: "You're about to place the compass close to the magnet's north pole.",
        question: "What direction will the compass point here, relative to the magnet?",
        options: [
          { id: "aligns-with-field", label: "It will align with the field direction at that spot, not necessarily point straight at the magnet" },
          { id: "points-at-magnet", label: "It will point directly at the magnet's center" },
          { id: "spins-randomly", label: "It will spin without settling on a direction" },
        ],
        actualResultOptionId: "aligns-with-field",
        explanation: "The needle settles along the local field direction at that position — near the north pole, that direction points away from the magnet along the field line leaving that pole, not straight into the magnet's body.",
        hint: "Does a compass point at a magnet, or align with the field at its own location?",
      },
      {
        id: "physics-compass-explorer-predict-002",
        scenario: "The compass currently sits at a fixed spot near the magnet's north pole, pointing a certain way. You're about to drag it around to the magnet's south side.",
        question: "What happens to the needle's direction as the compass moves from the north side to the south side?",
        options: [
          { id: "rotates-through", label: "It gradually rotates as it follows the curving field, ending up pointing a different way near the south pole" },
          { id: "stays-same", label: "It stays pointing exactly the same way the whole trip" },
          { id: "instantly-flips", label: "It instantly flips 180° the moment it crosses the midpoint" },
        ],
        actualResultOptionId: "rotates-through",
        explanation: "Since the field curves smoothly around the magnet, the needle rotates smoothly too, tracking the field's changing direction continuously rather than staying fixed or snapping suddenly.",
        hint: "Field lines curve gradually around a magnet — does the needle's direction change gradually too, or all at once?",
      },
      {
        id: "physics-compass-explorer-predict-003",
        scenario: "You're about to drag the magnet itself to a new position on the playground, with the compass staying where it is.",
        question: "What will happen to the needle?",
        options: [
          { id: "reorients", label: "It will reorient to the new field direction at its own (unchanged) position" },
          { id: "stays-same", label: "It won't change, since only the compass' own position matters" },
          { id: "follows-magnet", label: "It will physically move to follow the magnet across the playground" },
        ],
        actualResultOptionId: "reorients",
        explanation: "Moving the magnet changes the field everywhere around it, including at the compass's fixed location — so the needle rotates to match the new field direction there, even though the compass itself doesn't move.",
        hint: "The compass's position hasn't changed — but has the field at that position changed?",
      },
      {
        id: "physics-compass-explorer-predict-004",
        scenario: "You're about to drag the compass to a spot much farther from the magnet than before.",
        question: "How will the compass behave differently at that greater distance?",
        options: [
          { id: "weaker-response", label: "It will respond more weakly and settle less firmly, since the field is weaker there" },
          { id: "same", label: "It will behave exactly the same, since direction doesn't depend on distance" },
          { id: "stronger-response", label: "It will respond more strongly, since it has farther to swing" },
        ],
        actualResultOptionId: "weaker-response",
        explanation: "Magnetic field strength fades with distance. Farther from the magnet, the field pulling the needle into alignment is weaker, so the needle's response is gentler and its final direction is held less firmly.",
        hint: "Recall how field strength changes with distance from a magnet — does that affect how firmly the needle aligns?",
      },
      {
        id: "physics-compass-explorer-predict-005",
        scenario: "The magnet is about to be rotated 180°, flipping which end is its north pole, while the compass stays exactly where it is.",
        question: "What happens to the needle at that fixed compass position?",
        options: [
          { id: "flips", label: "It rotates roughly 180° to align with the now-reversed field direction" },
          { id: "no-change", label: "Nothing changes, since the compass didn't move" },
          { id: "stops-responding", label: "It stops responding to the magnet entirely" },
        ],
        actualResultOptionId: "flips",
        explanation: "Flipping the magnet reverses the field direction at every point around it, including at the compass's location — so the needle rotates to match, ending up pointing roughly the opposite way from before.",
        hint: "If the magnet's poles swap ends, does the field direction at a fixed nearby point stay the same or reverse?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Drag the compass to different spots around the magnet and watch its needle settle into a new direction each time.",
      "Drag the magnet itself and watch the needle (at its own fixed position) track the change in real time.",
      "Watch the fading wedge and strength readout around the needle — they show how firmly the field is pulling it into alignment at that spot.",
      "Try each of the four preset experiments — Near the north pole, Orbit the magnet, Move far away, and Flip the magnet — and read its description before running it.",
      "Use Reset at any point to return the magnet and compass to their starting positions.",
    ],
    tryThis: [
      "Run \"Orbit the magnet\" and describe, in your own words, how the needle's direction changes as the compass moves around.",
      "Place the compass at several positions in a rough circle around the magnet and record which way it points at each one — that's the same method used to map a real field.",
      "Run \"Move far away\" and compare how firmly the needle settles compared to when it's close to the magnet.",
      "Run \"Flip the magnet\" with the compass sitting still, and watch how much the needle's direction changes without the compass moving at all.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "physics-compass-explorer-explain-001",
        question: "You moved the compass to a new spot and the needle rotated to a completely different direction, even though the magnet never moved. Why?",
        answer:
          "A magnetic field's direction is different at different points in space — it curves around a magnet rather than pointing the same way everywhere. Since the compass's needle aligns with the field exactly where it's sitting, moving the compass to a new position exposes it to a different field direction, so it settles differently.",
      },
      {
        id: "physics-compass-explorer-explain-002",
        question: "You rotated the magnet and the still-stationary needle changed direction. Why does moving the magnet affect a compass that never moved?",
        answer:
          "The needle isn't reacting to the compass's own position changing — it's reacting to the field at that position changing. Rotating the magnet reverses or reshapes the field everywhere around it, including at the compass's fixed spot, so the needle rotates to match that new field even though it stayed put.",
      },
      {
        id: "physics-compass-explorer-explain-003",
        question: "You moved the compass far from the magnet and the needle settled more weakly and slowly than when it was close. Why?",
        answer:
          "Magnetic field strength fades quickly with distance. Farther from the magnet, there's simply less field there to pull the needle into alignment, so it responds more gently and holds its direction less firmly than it does close to the magnet, where the field is strong.",
      },
      {
        id: "physics-compass-explorer-explain-004",
        question: "A compass left alone, far from any bar magnet, still settles in a consistent direction. Why, if there's no nearby magnet?",
        answer:
          "Even with no bar magnet nearby, the compass is still sitting inside Earth's own magnetic field, which behaves approximately like an enormous magnet. The needle aligns with that planet-scale field instead — which is exactly what makes a compass useful for navigation in the first place, without needing another magnet anywhere close by.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "physics-compass-explorer",
  },

  // -------------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------------
  challenge: {
    intro: "Use the Compass Explorer playground above to test each challenge below before answering.",
    scenarios: [
      {
        id: "physics-compass-explorer-challenge-001",
        title: "Place the Compass for a Target Direction",
        scenario: "Run the \"Near the north pole\" preset and observe which way the needle points there.",
        objective: "Based on that reading, where would you expect the needle to point roughly the opposite way?",
        tools: [{ id: "playground", label: "Compass Explorer playground" }],
        requiresExperiment: true,
        answer: {
          mode: "choice",
          options: [
            { id: "correct", label: "Near the magnet's south pole, on the opposite side" },
            { id: "wrong-a", label: "Directly on top of the magnet's center" },
            { id: "wrong-b", label: "Nowhere — the needle points the same way everywhere" },
          ],
          correctOptionId: "correct",
        },
        explanation: "Field lines run from north to south, curving around the magnet. Near the south pole, on the far side, the field direction is roughly reversed compared to near the north pole — so the needle there points roughly the opposite way.",
        hints: ["Field direction near the south pole is roughly opposite to the direction near the north pole — try it and compare."],
      },
      {
        id: "physics-compass-explorer-challenge-002",
        title: "Diagnose an Unexpected Reading",
        scenario: "You expected the compass to point straight at the magnet, but instead it points off at an angle to one side.",
        objective: "What's the most likely explanation?",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "correct", label: "The compass is correctly aligning with the local field direction, which isn't the same as pointing straight at the magnet" },
            { id: "wrong-a", label: "The compass is malfunctioning" },
            { id: "wrong-b", label: "The magnet has stopped producing a field" },
          ],
          correctOptionId: "correct",
        },
        explanation: "A compass needle aligns with the field's direction at its own location, and that direction curves around a magnet rather than pointing straight at it from every position. An angled reading is expected behavior, not a malfunction.",
        hints: ["Revisit what a compass needle actually aligns with — the magnet's position, or the field's direction where the compass sits?"],
      },
      {
        id: "physics-compass-explorer-challenge-003",
        title: "Predict Before Orbiting",
        scenario: "Before running \"Orbit the magnet,\" predict how many times the needle will complete a full rotation as the compass travels once all the way around the magnet.",
        objective: "Will the needle end up pointing the same way it started once the compass returns to its starting position?",
        tools: [{ id: "playground", label: "Orbit the magnet preset" }],
        requiresExperiment: true,
        answer: {
          mode: "choice",
          options: [
            { id: "correct", label: "Yes — since the compass returns to the exact same spot, the field there is unchanged, so the needle returns to its original direction" },
            { id: "wrong-a", label: "No — the needle ends up pointing in a completely new, unrelated direction" },
            { id: "wrong-b", label: "The needle stops responding once it has orbited once" },
          ],
          correctOptionId: "correct",
        },
        explanation: "The needle's direction depends entirely on the field at the compass's current position. Once the compass has gone all the way around and returned to its starting spot, it's back in the exact same field it started in, so the needle returns to its original heading too.",
        hints: ["The needle only depends on the compass's current position — what happens once that position is the same as where it started?"],
      },
      {
        id: "physics-compass-explorer-challenge-004",
        title: "Compare Two Positions",
        scenario: "Place the compass close to the magnet, note the needle's direction, then move it much farther away without changing angle around the magnet.",
        objective: "Besides direction possibly changing slightly, what's the clearest difference you'd expect between the two readings?",
        requiresExperiment: true,
        answer: {
          mode: "choice",
          options: [
            { id: "correct", label: "The needle responds and settles far less firmly at the greater distance, since the field there is weaker" },
            { id: "wrong-a", label: "There's no difference at all between the two readings" },
            { id: "wrong-b", label: "The needle spins continuously at the greater distance" },
          ],
          correctOptionId: "correct",
        },
        explanation: "Field strength fades with distance, so farther from the magnet the needle has less field pulling it into alignment — it settles more gently and less firmly, even if the general direction is similar.",
        hints: ["What does the fading wedge and strength readout around the needle tell you as the compass moves farther away?"],
      },
      {
        id: "physics-compass-explorer-challenge-005",
        title: "Explain a Compass with No Magnet Nearby",
        scenario: "Imagine dragging the magnet completely off the playground, far enough that the compass is essentially field-free from it.",
        objective: "In a real classroom, would a compass just spin with no direction if there's no bar magnet nearby?",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "correct", label: "No — it would still align with Earth's own magnetic field, since Earth behaves approximately like a giant magnet" },
            { id: "wrong-a", label: "Yes — with no nearby magnet, there's no field of any kind to respond to" },
            { id: "wrong-b", label: "It would point randomly and never settle" },
          ],
          correctOptionId: "correct",
        },
        explanation: "A real compass is never truly field-free, because Earth itself behaves approximately like an enormous magnet. Even far from any bar magnet, a real compass needle settles into alignment with Earth's field — which is exactly why compasses work for navigation in the first place.",
        hints: ["Is a bar magnet the only source of magnetic field a compass could ever respond to?"],
      },
      {
        id: "physics-compass-explorer-challenge-006",
        title: "Geographic North vs. Magnetic North",
        scenario: "A friend says a compass points to exactly the same spot as the geographic North Pole shown on a globe.",
        objective: "Is your friend's claim accurate?",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "correct", label: "Not exactly — magnetic north is close to geographic north but is a distinct location that also drifts over time" },
            { id: "wrong-a", label: "Yes, they are exactly the same fixed point" },
            { id: "wrong-b", label: "No, they're typically thousands of kilometers apart" },
          ],
          correctOptionId: "correct",
        },
        explanation: "Geographic north is the fixed point where Earth's rotational axis meets the surface. Magnetic north — the direction a compass actually points — is close to it but not identical, and gradually shifts over years as Earth's magnetic field itself changes.",
        hints: ["Recall the distinction between what defines geographic north and what defines magnetic north."],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "physics",
      topicSlug: "magnet-explorer",
      label: "Interactive Magnet Explorer",
      href: "/dashboard/physics/magnet-explorer",
      reason: "Revisit poles, attraction, and repulsion — the field this compass is responding to.",
    },
  ],
};

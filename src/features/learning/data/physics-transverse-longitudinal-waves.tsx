import type { TopicContent } from "../types";

/**
 * Transverse vs Longitudinal Waves — Physics Batch 2 (Wave Motion
 * Foundations, topic 2 of 2). Reuses the existing
 * `TransverseLongitudinalWaves` simulation
 * (`@/features/subjects/physics/transverse-longitudinal-waves`)
 * exactly as-is: it already has a mode toggle, direction indicators
 * for both propagation and particle motion, a "watch one particle"
 * mode, particle paths, a side-by-side comparison panel, and its own
 * concept-check quiz — so no simulation code changes were needed.
 * Builds directly on the crest/trough/amplitude/wavelength vocabulary
 * from Basic Wave Motion (the previous topic in this Wave Motion
 * group) rather than re-teaching it.
 */

const transverseSketch = (
  <svg viewBox="0 0 260 120" className="mx-auto h-28 w-full max-w-xs" role="img" aria-labelledby="transverse-sketch-title">
    <title id="transverse-sketch-title">Transverse wave: particles move up and down, perpendicular to the wave&apos;s sideways travel.</title>
    <line x1="10" y1="60" x2="250" y2="60" strokeWidth="1.5" strokeDasharray="6 5" className="stroke-ink/25 dark:stroke-bone/25" />
    <path
      d="M10 60 C 30 25, 50 25, 70 60 C 90 95, 110 95, 130 60 C 150 25, 170 25, 190 60 C 210 95, 230 95, 250 60"
      fill="none"
      strokeWidth="2.5"
      className="stroke-subject-physics"
    />
    <circle cx="70" cy="60" r="4.5" className="fill-ink dark:fill-bone" />
    <line x1="70" y1="60" x2="70" y2="30" strokeWidth="2" className="stroke-amber-500" />
    <text x="76" y="42" className="fill-amber-600 font-mono text-[9px] font-semibold dark:fill-amber-400">particle ↕</text>
    <line x1="14" y1="12" x2="46" y2="12" strokeWidth="2" className="stroke-subject-physics" />
    <path d="M46 12 l-6 -4 M46 12 l-6 4" strokeWidth="2" className="stroke-subject-physics" fill="none" />
    <text x="30" y="6" textAnchor="middle" className="fill-subject-physics font-mono text-[8px] font-semibold">wave travels →</text>
  </svg>
);

const longitudinalSketch = (
  <svg viewBox="0 0 260 120" className="mx-auto h-28 w-full max-w-xs" role="img" aria-labelledby="longitudinal-sketch-title">
    <title id="longitudinal-sketch-title">Longitudinal wave: particles bunch into compressions and spread into rarefactions along the direction of travel.</title>
    {Array.from({ length: 24 }, (_, i) => {
      const base = 12 + i * 10;
      const cluster = Math.sin((i / 24) * Math.PI * 2.5);
      const x = base + cluster * 6;
      return <circle key={i} cx={x} cy={60} r={3.5} className="fill-ink/70 dark:fill-bone/70" />;
    })}
    <text x="55" y="20" textAnchor="middle" className="fill-ink font-mono text-[8px] font-semibold dark:fill-bone">compression</text>
    <text x="55" y="100" textAnchor="middle" className="fill-ink-soft font-mono text-[8px] dark:fill-bone-soft">(bunched together)</text>
    <text x="175" y="20" textAnchor="middle" className="fill-ink font-mono text-[8px] font-semibold dark:fill-bone">rarefaction</text>
    <text x="175" y="100" textAnchor="middle" className="fill-ink-soft font-mono text-[8px] dark:fill-bone-soft">(spread apart)</text>
    <line x1="14" y1="112" x2="46" y2="112" strokeWidth="2" className="stroke-subject-physics" />
    <path d="M46 112 l-6 -4 M46 112 l-6 4" strokeWidth="2" className="stroke-subject-physics" fill="none" />
    <text x="30" y="108" textAnchor="middle" className="fill-subject-physics font-mono text-[8px] font-semibold">wave travels →</text>
  </svg>
);

export const physicsTransverseLongitudinalWavesContent: TopicContent = {
  subjectSlug: "physics",
  topicSlug: "transverse-longitudinal-waves",
  title: "Transverse vs Longitudinal Waves",
  subjectLabel: "Physics",
  topicLabel: "Wave Motion",
  colorToken: "physics",
  simulationHref: "/dashboard/physics/transverse-longitudinal-waves",

  // -------------------------------------------------------------
  // LEARN — what am I learning?
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Distinguish transverse waves from longitudinal waves by the direction particles oscillate relative to the wave's direction of travel.",
      "Identify the direction of particle motion and the direction of propagation for a given wave.",
      "Define compression and rarefaction in a longitudinal wave.",
      "Name a real-world example of each wave type.",
      "Explain what stays the same and what's different between the two wave types.",
    ],
    concepts: [
      {
        term: "Transverse waves",
        explanation:
          "Waves where the medium's particles oscillate perpendicular to the direction the wave travels — up and down, while the wave itself moves sideways. A wave on a rope you shake up and down behaves this way, and so (as a simplified model) does light.",
      },
      {
        term: "Longitudinal waves",
        explanation:
          "Waves where the medium's particles oscillate parallel to the direction the wave travels — back and forth along the same line the wave is moving, rather than perpendicular to it. Sound waves in air behave this way.",
      },
      {
        term: "Compression",
        explanation:
          "In a longitudinal wave, a compression is a region where particles are bunched relatively close together — a moment of locally higher particle density along the direction of travel.",
      },
      {
        term: "Rarefaction",
        explanation:
          "In a longitudinal wave, a rarefaction is a region where particles are spread relatively farther apart — a moment of locally lower particle density. Compressions and rarefactions take the place that crests and troughs occupy in a transverse wave.",
      },
      {
        term: "Direction of propagation vs. direction of particle motion",
        explanation:
          "Every wave has two directions worth tracking separately: the direction the wave pattern itself travels (propagation), and the direction any one particle in the medium actually moves (oscillation). For a transverse wave those two directions are at right angles to each other; for a longitudinal wave they're the same line.",
      },
    ],
    whyItMatters:
      "Whether a wave is transverse or longitudinal changes what it can travel through and how. Sound is longitudinal, which is why it needs a medium like air to compress and expand — sound can't cross a vacuum. Light behaves as a transverse wave and, unlike sound, can travel through empty space, which is exactly how sunlight reaches Earth across millions of miles of vacuum. Seismologists use this same distinction to read earthquakes: longitudinal P-waves and transverse S-waves travel through rock at different speeds and in different ways, which is how a single seismograph station can help pinpoint how far away a quake struck.",
    keyTerms: [
      { term: "Transverse wave", definition: "A wave whose particles oscillate perpendicular to the direction of wave travel." },
      { term: "Longitudinal wave", definition: "A wave whose particles oscillate parallel to the direction of wave travel." },
      { term: "Compression", definition: "A region of a longitudinal wave where particles are bunched relatively close together." },
      { term: "Rarefaction", definition: "A region of a longitudinal wave where particles are spread relatively farther apart." },
      { term: "Propagation direction", definition: "The direction the wave pattern itself is traveling." },
    ],
    visualAids: [
      {
        id: "transverse-sketch",
        caption: "In a transverse wave, a tracked particle moves up and down (↕) while the pattern itself travels sideways (→).",
        visual: transverseSketch,
      },
      {
        id: "longitudinal-sketch",
        caption: "In a longitudinal wave, particles bunch into compressions and spread into rarefactions along the same line the wave travels.",
        visual: longitudinalSketch,
      },
    ],
    misconceptions: [
      {
        id: "misconception-both-waves-move-up-down",
        misconception: "All waves make particles move up and down, the same way water waves visibly do.",
        correction:
          "That's only true of transverse waves. In a longitudinal wave — like sound — particles move back and forth along the same direction the wave travels, not up and down at all. Switch modes in the lab below and track a particle in each to see the difference directly.",
      },
      {
        id: "misconception-compression-is-a-place-not-motion",
        misconception: "A compression is a special particle that stays compressed forever, sitting in one place.",
        correction:
          "A compression is a *momentary* region, not a fixed particle — as the wave travels, each particle in turn passes through a compressed state and then a rarefied state as the disturbance moves past it, exactly like how a specific particle is only briefly at a crest in a transverse wave.",
      },
      {
        id: "misconception-propagation-direction-equals-particle-direction",
        misconception: "The direction particles move must be the same as the direction the wave travels, for any wave.",
        correction:
          "That's true for longitudinal waves but false for transverse waves, where particle motion is perpendicular to (at a right angle from) the wave's direction of travel. Confusing the two directions is one of the most common mistakes when first learning wave types — the direction indicators in the lab below are there specifically to keep them separate.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT — what should I predict?
  // -------------------------------------------------------------
  predict: {
    intro:
      "Commit to a prediction before you touch the controls below — check your answer against the simulation once you've locked it in.",
    scenarios: [
      {
        id: "physics-transverse-longitudinal-predict-001",
        scenario: "Switch to Transverse mode, turn on \"Watch one particle,\" and let the wave play.",
        question: "Which direction does the tracked particle actually move?",
        options: [
          { id: "perpendicular", label: "Up and down — perpendicular to the wave's travel direction" },
          { id: "parallel", label: "Left and right — the same direction the wave travels" },
          { id: "diagonal", label: "In a diagonal line" },
          { id: "stationary", label: "It doesn't move at all" },
        ],
        actualResultOptionId: "perpendicular",
        explanation:
          "In transverse mode, every particle oscillates perpendicular to the wave's direction of travel — up and down, while the pattern itself moves sideways across the screen.",
        hint: "\"Transverse\" is related to the word \"traverse\" — think crosswise, not along.",
      },
      {
        id: "physics-transverse-longitudinal-predict-002",
        scenario: "Now switch to Longitudinal mode, keep \"Watch one particle\" on, and let it play again.",
        question: "Which direction does the tracked particle move this time?",
        options: [
          { id: "parallel", label: "Back and forth — the same direction the wave travels" },
          { id: "perpendicular", label: "Up and down — perpendicular to the wave's travel direction" },
          { id: "circular", label: "In a small circle" },
          { id: "stationary", label: "It doesn't move at all" },
        ],
        actualResultOptionId: "parallel",
        explanation:
          "In longitudinal mode, particles oscillate parallel to the wave's direction of travel — back and forth along the same line, which is what creates the bunched-up compressions and spread-out rarefactions.",
        hint: "\"Longitudinal\" is related to \"length\" or \"long axis\" — think along the line of travel, not across it.",
      },
      {
        id: "physics-transverse-longitudinal-predict-003",
        scenario: "Look at the Longitudinal mode display and find a spot where particles appear bunched noticeably closer together than their neighbors.",
        question: "What is that bunched-up region called?",
        options: [
          { id: "compression", label: "A compression" },
          { id: "rarefaction", label: "A rarefaction" },
          { id: "crest", label: "A crest" },
          { id: "equilibrium", label: "An equilibrium point" },
        ],
        actualResultOptionId: "compression",
        explanation:
          "A region where longitudinal-wave particles are packed closer together than usual is a compression — the longitudinal equivalent of a crest in a transverse wave.",
        hint: "Think of the everyday meaning of \"compress\" — to squeeze together.",
      },
      {
        id: "physics-transverse-longitudinal-predict-004",
        scenario: "Toggle back to Transverse mode and picture a wave traveling to the right across a rope.",
        question: "As the wave moves to the right, does any single point on the rope also drift to the right along with it?",
        options: [
          { id: "no-drift", label: "No — it only moves up and down at roughly the same horizontal spot" },
          { id: "yes-drift", label: "Yes — it slowly drifts rightward along with the wave" },
          { id: "left-drift", label: "It drifts left, opposite the wave" },
          { id: "depends", label: "It depends on the amplitude" },
        ],
        actualResultOptionId: "no-drift",
        explanation:
          "Just like in Basic Wave Motion, the medium's particles don't travel with the wave — only the disturbance pattern does. A rope particle only oscillates up and down at its own fixed horizontal position as the wave passes.",
        hint: "This is the same particle-vs-pattern idea from the previous topic — it applies to both wave types.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE — the guided experiment
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Start in Transverse mode and watch the wave play — notice the direction indicators showing propagation versus particle motion.",
      "Turn on \"Watch one particle\" and track it; confirm it only moves perpendicular to the wave's travel direction.",
      "Switch to Longitudinal mode and watch particles bunch into compressions and spread into rarefactions.",
      "Turn on \"Watch one particle\" again in this mode; confirm it now moves parallel to the wave's travel direction instead.",
      "Open the comparison panel and check both wave types' particle-motion direction, propagation direction, and whether each has compressions/rarefactions.",
    ],
    tryThis: [
      "Pause each mode and, in one sentence, describe which direction the tracked particle is moving relative to the wave itself.",
      "Predict whether sound could travel through outer space, using what you now know about longitudinal waves needing a medium.",
      "Try to name one more real-world example of a transverse wave and one more of a longitudinal wave, beyond the ones already listed.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN — why does this happen?
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "physics-transverse-longitudinal-explain-001",
        question: "Why does a transverse wave's particle motion look perpendicular to its direction of travel, while a longitudinal wave's looks parallel?",
        answer:
          "This perpendicular-versus-parallel relationship is simply the definition that separates the two wave types — it's not derived from anything else, it's the defining feature. A transverse wave is, by definition, one where the disturbance displaces the medium sideways to the direction of travel; a longitudinal wave is one where the disturbance displaces the medium along that same direction.",
      },
      {
        id: "physics-transverse-longitudinal-explain-002",
        question: "Why do compressions and rarefactions only appear in longitudinal waves, and not transverse ones?",
        answer:
          "Compressions and rarefactions are regions of locally higher or lower particle density along the direction of travel — and that kind of bunching-and-spreading only happens when particles move parallel to that same direction, which is exactly what defines a longitudinal wave. In a transverse wave, particles only ever move sideways to the direction of travel, so their spacing along that direction of travel never actually changes.",
      },
      {
        id: "physics-transverse-longitudinal-explain-003",
        question: "Why can light (transverse) cross the vacuum of space, while sound (longitudinal) cannot?",
        answer:
          "Sound is a longitudinal wave that works by physically compressing and expanding a medium's particles — with no particles present, as in a vacuum, there's nothing there to compress or expand, so sound simply has nothing to travel through. Light doesn't rely on compressing a material medium the way sound does, which is why the presence or absence of matter doesn't stop it the same way.",
      },
      {
        id: "physics-transverse-longitudinal-explain-004",
        question: "Why is it useful to track both the propagation direction and the particle-motion direction separately, instead of just one?",
        answer:
          "Those two directions are exactly what distinguishes the two wave types from each other — a wave's propagation direction alone tells you nothing about whether it's transverse or longitudinal, but comparing it against the particle-motion direction does. Tracking both together is also what makes it possible to correctly identify compressions/rarefactions versus crests/troughs on sight.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE — can I solve a problem using this?
  // -------------------------------------------------------------
  practice: {
    // Foreign key into the quiz-engine registry — all questions live in
    // @/features/quiz-engine/data/physics-transverse-longitudinal-waves-quiz.ts, none duplicated here.
    quizId: "physics-transverse-longitudinal-waves",
  },

  // -------------------------------------------------------------
  // CHALLENGE — realistic problems
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. Some use reasoning alone; others ask you to use the simulation above to check your answer. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "physics-transverse-longitudinal-challenge-001",
        title: "Identify the Wave Type from Particle Motion",
        scenario: "You're shown an animation where a tracked particle repeatedly moves left and right, exactly along the same line the wave pattern is traveling.",
        objective: "Determine which wave type this is.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Longitudinal" },
            { id: "b", label: "Transverse" },
            { id: "c", label: "Neither — this isn't possible for a wave" },
            { id: "d", label: "It could be either type" },
          ],
          correctOptionId: "a",
        },
        explanation: "Particle motion along the same line as the wave's direction of travel is, by definition, longitudinal — matching what you saw when tracking a particle in Longitudinal mode.",
        hints: ["\"Same line as travel\" is the defining trait of one specific wave type.", "Recall which mode's tracked particle moved parallel to the wave."],
      },
      {
        id: "physics-transverse-longitudinal-challenge-002",
        title: "Identify Particle-Motion Direction",
        scenario: "A wave is traveling due east. Its particles are observed oscillating straight up and down.",
        objective: "Determine whether this wave's particle motion is perpendicular or parallel to its propagation direction, and name the wave type.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Perpendicular — this is a transverse wave" },
            { id: "b", label: "Parallel — this is a longitudinal wave" },
            { id: "c", label: "Perpendicular — this is a longitudinal wave" },
            { id: "d", label: "Neither direction can be determined" },
          ],
          correctOptionId: "a",
        },
        explanation: "Up-and-down motion is at a right angle to \"due east\" (a horizontal direction), so the particle motion is perpendicular to propagation — the defining trait of a transverse wave.",
        hints: ["Picture \"due east\" as a horizontal arrow and \"up and down\" as a vertical arrow — are they parallel or perpendicular?", "Perpendicular particle motion is one wave type's defining feature."],
      },
      {
        id: "physics-transverse-longitudinal-challenge-003",
        title: "Identify Propagation Direction",
        scenario: "In Longitudinal mode, you spot a compression near the left edge of the display. A few moments later, that same compression has moved toward the right edge.",
        objective: "Use the lab to confirm which direction the wave in Longitudinal mode is propagating.",
        tools: [{ id: "mode-toggle", label: "Transverse / Longitudinal mode toggle" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Left to right" },
            { id: "b", label: "Right to left" },
            { id: "c", label: "It doesn't propagate in a fixed direction" },
            { id: "d", label: "Straight up" },
          ],
          correctOptionId: "a",
        },
        explanation: "A compression that shifts from the left edge toward the right edge over time is direct evidence the wave pattern itself is propagating left to right — matching the direction arrows shown by the simulation's direction indicators.",
        hints: ["Track where the same compression is at two different moments.", "The direction it moves between those two moments is the propagation direction."],
      },
      {
        id: "physics-transverse-longitudinal-challenge-004",
        title: "Locate Compression and Rarefaction",
        scenario: "Switch to Longitudinal mode in the lab and pause the animation at any moment.",
        objective: "Correctly point out one region of compression and one region of rarefaction on the current frame.",
        tools: [{ id: "pause", label: "Pause / Play control" }],
        answer: { mode: "interactive", instructions: "Pause the simulation in Longitudinal mode, then identify a bunched-together region (compression) and a spread-out region (rarefaction).", verifyLabel: "Check my identification" },
        explanation: "A compression is wherever particles are visibly closer together than their neighbors; a rarefaction is wherever they're visibly farther apart. Both appear repeatedly along the wave, roughly half a wavelength apart from each other.",
        hints: ["Look for particles crowded unusually close together — that's a compression.", "Look for particles spread unusually far apart — that's a rarefaction."],
      },
      {
        id: "physics-transverse-longitudinal-challenge-005",
        title: "Match a Wave to Its Description",
        scenario: "A textbook describes 'a wave in which the medium's particles vibrate parallel to the wave's direction of travel, producing alternating regions of higher and lower particle density.'",
        objective: "Identify which wave type this description matches.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Longitudinal wave" },
            { id: "b", label: "Transverse wave" },
            { id: "c", label: "Neither type matches this description" },
            { id: "d", label: "Both types match equally well" },
          ],
          correctOptionId: "a",
        },
        explanation: "Parallel particle motion plus alternating regions of higher/lower density (compressions and rarefactions) is precisely the definition of a longitudinal wave.",
        hints: ["\"Parallel to travel direction\" is the giveaway phrase.", "Only one wave type produces compressions and rarefactions at all."],
      },
      {
        id: "physics-transverse-longitudinal-challenge-006",
        title: "Correct a Deliberately Wrong Interpretation",
        scenario: "A classmate writes in their notes: 'Longitudinal waves are just transverse waves that are moving faster.'",
        objective: "Explain what's wrong with this statement and give the correct distinction between the two wave types.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Speed has nothing to do with it — the two types differ in the direction particles oscillate relative to propagation" },
            { id: "b", label: "The statement is correct as written" },
            { id: "c", label: "Longitudinal waves are transverse waves with larger amplitude" },
            { id: "d", label: "Longitudinal waves are transverse waves with shorter wavelength" },
          ],
          correctOptionId: "a",
        },
        explanation: "Whether a wave is transverse or longitudinal is entirely about the *direction* particles move relative to the direction of propagation (perpendicular vs. parallel) — it has nothing to do with speed, amplitude, or wavelength, any of which could independently be large or small for either wave type.",
        hints: ["Ask yourself: does changing a wave's speed ever change which way its particles oscillate?", "The distinguishing feature is a direction, not a size or a rate."],
      },
      {
        id: "physics-transverse-longitudinal-challenge-007",
        title: "Real-World Mission: Why Sound Needs Air",
        scenario: "An astronaut on a spacewalk taps a wrench directly against a metal handrail while another astronaut, not touching the rail, watches from a meter away in the vacuum of space.",
        objective: "Determine whether the watching astronaut could hear the tapping sound travel to them through the vacuum, and explain why, using what you know about longitudinal waves.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "No — sound is longitudinal and needs particles to compress and expand, and a vacuum has none" },
            { id: "b", label: "Yes — sound travels through vacuum just as easily as through air" },
            { id: "c", label: "No — sound is transverse and needs a magnetic field, which space lacks" },
            { id: "d", label: "Yes, but only if the tapping is loud enough" },
          ],
          correctOptionId: "a",
        },
        explanation: "Sound is a longitudinal wave that propagates by compressing and expanding the particles of a medium. A vacuum has no particles to compress, so there's no way for that compression-and-expansion pattern to form or travel — which is exactly why space is silent, no matter how hard the wrench taps.",
        hints: ["Think back to what a longitudinal wave physically needs in order to exist at all.", "A vacuum, by definition, has essentially no particles present."],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "physics",
      topicSlug: "basic-wave-motion",
      label: "Basic Wave Motion",
      href: "/dashboard/physics/basic-wave-motion",
      reason: "Revisit the crest, trough, amplitude, and wavelength vocabulary this topic builds on.",
    },
  ],
};

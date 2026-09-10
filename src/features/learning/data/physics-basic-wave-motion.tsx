import type { TopicContent } from "../types";

/**
 * Basic Wave Motion — Physics Batch 2 (Wave Motion Foundations, topic
 * 1 of 2). Reuses the existing `BasicWaveMotion` simulation
 * (`@/features/subjects/physics/basic-wave-motion`) exactly as-is:
 * it already labels crest, trough, equilibrium, amplitude, and
 * wavelength directly on the animated wave, already supports
 * independent amplitude/wavelength control, an optional particle
 * overlay, and its own point-and-click mini challenge — so no
 * simulation code changes were needed to bring it into the Golden
 * Learning Experience. This topic deliberately stops short of
 * frequency/period and v = fλ (those belong to Frequency & Period and
 * Wave Speed, later in this same Wave Motion group) — frequency is
 * only ever mentioned conceptually here, never given a control or a
 * formula.
 */

const waveAnatomySketch = (
  <svg viewBox="0 0 260 140" className="mx-auto h-32 w-full max-w-xs" role="img" aria-labelledby="wave-anatomy-title">
    <title id="wave-anatomy-title">
      A wave with the equilibrium line, crest, trough, amplitude, and wavelength labeled.
    </title>
    <line x1="10" y1="70" x2="250" y2="70" strokeWidth="1.5" strokeDasharray="6 5" className="stroke-ink/30 dark:stroke-bone/30" />
    <path
      d="M10 70 C 35 20, 55 20, 75 70 C 95 120, 115 120, 135 70 C 155 20, 175 20, 195 70 C 215 120, 235 120, 250 95"
      fill="none"
      strokeWidth="2.5"
      className="stroke-subject-physics"
    />
    <circle cx="55" cy="19" r="3.5" className="fill-subject-physics" />
    <text x="55" y="12" textAnchor="middle" className="fill-ink font-mono text-[9px] font-semibold dark:fill-bone">crest</text>
    <circle cx="115" cy="121" r="3.5" className="fill-subject-physics" />
    <text x="115" y="134" textAnchor="middle" className="fill-ink font-mono text-[9px] font-semibold dark:fill-bone">trough</text>
    <line x1="55" y1="70" x2="55" y2="22" strokeWidth="1.5" className="stroke-amber-500" />
    <text x="61" y="46" className="fill-amber-600 font-mono text-[9px] font-medium dark:fill-amber-400">A</text>
    <line x1="55" y1="8" x2="135" y2="8" strokeWidth="1.5" className="stroke-violet-500" />
    <line x1="55" y1="4" x2="55" y2="12" strokeWidth="1.5" className="stroke-violet-500" />
    <line x1="135" y1="4" x2="135" y2="12" strokeWidth="1.5" className="stroke-violet-500" />
    <text x="95" y="6" textAnchor="middle" className="fill-violet-600 font-mono text-[9px] font-medium dark:fill-violet-400">λ</text>
    <text x="6" y="66" className="fill-ink-soft font-mono text-[8px] dark:fill-bone-soft">equilibrium</text>
  </svg>
);

const particlesVsPatternSketch = (
  <svg viewBox="0 0 260 120" className="mx-auto h-28 w-full max-w-xs" role="img" aria-labelledby="particle-pattern-title">
    <title id="particle-pattern-title">
      Individual particles only move up and down, while the wave pattern itself moves sideways.
    </title>
    <line x1="10" y1="60" x2="250" y2="60" strokeWidth="1.5" strokeDasharray="6 5" className="stroke-ink/25 dark:stroke-bone/25" />
    <path
      d="M10 60 C 30 25, 50 25, 70 60 C 90 95, 110 95, 130 60 C 150 25, 170 25, 190 60 C 210 95, 230 95, 250 60"
      fill="none"
      strokeWidth="2"
      className="stroke-subject-physics/50"
    />
    <circle cx="70" cy="60" r="4" className="fill-ink dark:fill-bone" />
    <line x1="70" y1="80" x2="70" y2="98" strokeWidth="1.5" className="stroke-ink/60 dark:stroke-bone/60" />
    <text x="70" y="112" textAnchor="middle" className="fill-ink-soft font-mono text-[8px] dark:fill-bone-soft">particle: only up/down</text>
    <line x1="30" y1="14" x2="60" y2="14" strokeWidth="2" className="stroke-subject-physics" markerEnd="url(#arrowRight)" />
    <text x="45" y="8" textAnchor="middle" className="fill-subject-physics font-mono text-[8px] font-semibold">wave pattern: travels →</text>
    <defs>
      <marker id="arrowRight" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" className="fill-subject-physics" />
      </marker>
    </defs>
  </svg>
);

export const physicsBasicWaveMotionContent: TopicContent = {
  subjectSlug: "physics",
  topicSlug: "basic-wave-motion",
  title: "Basic Wave Motion",
  subjectLabel: "Physics",
  topicLabel: "Wave Motion",
  colorToken: "physics",
  simulationHref: "/dashboard/physics/basic-wave-motion",

  // -------------------------------------------------------------
  // LEARN — what am I learning?
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Define a wave as a disturbance that transfers energy without the medium traveling along with it over long distances.",
      "Identify the crest, trough, and equilibrium position on a wave.",
      "Define amplitude as the maximum displacement from equilibrium, and wavelength as the distance between corresponding points.",
      "Distinguish the wave pattern moving forward from the medium itself, which only oscillates in place.",
      "Predict how a wave's appearance changes when its amplitude or wavelength is changed.",
    ],
    concepts: [
      {
        term: "What is a wave?",
        explanation:
          "A wave is a disturbance that carries energy from one place to another without the medium itself making that whole journey. A ripple crosses a pond, but a leaf floating on the surface mostly just bobs up and down near where it started — the disturbance travels much farther than any single bit of water does.",
      },
      {
        term: "Crest and trough",
        explanation:
          "The crest is the highest point the wave reaches above its resting position; the trough is the lowest point it reaches below it. A wave alternates between the two as it repeats.",
      },
      {
        term: "Equilibrium position",
        explanation:
          "The flat line the medium would sit at if there were no wave at all — the rest position every point on the wave oscillates above and below as the wave passes through.",
      },
      {
        term: "Amplitude",
        explanation:
          "The maximum displacement of the wave from its equilibrium position — how far the crest sits above the resting line, or the trough below it. Amplitude is a distance, not a measure of how far the wave has traveled.",
        formula: "A = |y_{\\text{max}}|",
        formulaCaption: "Amplitude is the size of the largest displacement from equilibrium",
      },
      {
        term: "Wavelength",
        explanation:
          "The distance between two corresponding points on consecutive repeats of the wave — crest to the next crest, or trough to the next trough. It's a length measured along the direction the wave travels, written with the symbol λ (lambda).",
        formula: "\\lambda",
        formulaCaption: "Symbol for wavelength",
      },
      {
        term: "The pattern travels; the medium oscillates",
        explanation:
          "Watch one particle in the medium instead of the wave shape as a whole: that single particle only ever moves up and down around its own equilibrium position. It's the pattern — the specific sequence of crests and troughs — that moves steadily forward. This is the single most important (and most often confused) idea in wave motion.",
      },
      {
        term: "Frequency and period, briefly",
        explanation:
          "How fast the wave pattern moves also depends on how often each point in the medium completes a full up-and-down cycle — its frequency. That relationship, and the formula connecting speed, frequency, and wavelength, is the subject of the next two topics in this Wave Motion sequence; here, it's enough to know the idea exists without a control or a formula for it yet.",
      },
    ],
    whyItMatters:
      "Every wave you can name — sound reaching your ears, light reaching your eyes, ripples on a pond, the vibration in a guitar string, even the shaking of an earthquake — can be described using this exact same vocabulary: amplitude, wavelength, crest, and trough. Once you can read these features off a wave, you're equipped to understand how loud a sound is, how bright a light is, or how much energy a wave is carrying, because all of those trace back to a wave's amplitude and wavelength.",
    keyTerms: [
      { term: "Wave", definition: "A disturbance that transfers energy from one place to another without the medium traveling with it." },
      { term: "Crest", definition: "The highest point of a wave, above the equilibrium position." },
      { term: "Trough", definition: "The lowest point of a wave, below the equilibrium position." },
      { term: "Equilibrium position", definition: "The rest position the medium sits at with no wave present." },
      { term: "Amplitude", definition: "The maximum displacement of the wave from equilibrium." },
      { term: "Wavelength", definition: "The distance between two corresponding points on consecutive repeats of the wave." },
    ],
    visualAids: [
      {
        id: "wave-anatomy-sketch",
        caption: "Every feature you'll be asked to identify below, labeled on one wave: equilibrium, crest, trough, amplitude (A), and wavelength (λ).",
        visual: waveAnatomySketch,
      },
      {
        id: "particle-vs-pattern-sketch",
        caption: "A single particle only moves up and down at its own fixed position — it's the wave pattern, not the particle, that travels forward.",
        visual: particlesVsPatternSketch,
      },
    ],
    misconceptions: [
      {
        id: "misconception-wave-moves-matter",
        misconception: "A wave carries the medium itself from one place to another, the way a conveyor belt moves boxes.",
        correction:
          "A wave moves energy and a disturbance pattern, not the medium. Turn on \"Show particles\" in the lab below and watch any single particle: it only oscillates up and down at its own fixed horizontal position — it never drifts sideways along with the wave.",
      },
      {
        id: "misconception-amplitude-is-distance-traveled",
        misconception: "Amplitude means how far the wave has traveled, or how far along the screen it has moved.",
        correction:
          "Amplitude has nothing to do with horizontal travel — it's the maximum vertical displacement from the equilibrium line. A wave with a huge amplitude can travel the exact same horizontal distance as one with a tiny amplitude; only its height above and below the resting line differs.",
      },
      {
        id: "misconception-wavelength-is-wave-count",
        misconception: "Wavelength means how many waves there are, or how long the whole wave train is.",
        correction:
          "Wavelength is the distance for exactly one repeat of the pattern — crest to the next crest. A long wave train made of many repeats and a short one made of just a couple can still share the exact same wavelength, since wavelength describes one repeat, not the whole train.",
      },
      {
        id: "misconception-crest-moves-with-the-wave",
        misconception: "The actual bit of medium sitting at the crest keeps riding at the very top as the wave moves forward.",
        correction:
          "The crest is a position in the pattern, not a fixed particle. As the wave advances, a *different* particle becomes the new crest a moment later, while the particle that was previously at the crest is already on its way back down toward equilibrium.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT — what should I predict?
  // -------------------------------------------------------------
  predict: {
    intro:
      "Commit to a prediction before you touch the controls below — check your answer against the wave once you've locked it in.",
    scenarios: [
      {
        id: "physics-basic-wave-motion-predict-001",
        scenario: "On the lab below, increase the Amplitude control while leaving Wavelength untouched.",
        question: "What happens to the wave?",
        options: [
          { id: "taller", label: "It gets taller — the crests rise higher and the troughs dip lower" },
          { id: "faster", label: "It moves faster across the screen" },
          { id: "closer", label: "The crests get closer together" },
          { id: "nothing", label: "Nothing visible changes" },
        ],
        actualResultOptionId: "taller",
        explanation:
          "Amplitude only controls how far the wave displaces from equilibrium — how tall the crests and how deep the troughs are. It has no effect on how closely spaced the crests are (that's wavelength) or on how fast the pattern moves.",
        hint: "Amplitude is a vertical measurement, not a horizontal or speed one.",
      },
      {
        id: "physics-basic-wave-motion-predict-002",
        scenario: "Now reset amplitude and instead increase the Wavelength control.",
        question: "What happens to the wave?",
        options: [
          { id: "spread-out", label: "The crests spread farther apart" },
          { id: "taller-shorter", label: "The crests get taller or shorter" },
          { id: "closer", label: "The crests get closer together" },
          { id: "particles-drift", label: "The particles start drifting sideways" },
        ],
        actualResultOptionId: "spread-out",
        explanation:
          "Wavelength is the distance between corresponding points, like crest to crest. Increasing it stretches that distance out — the crests spread farther apart — without changing how tall any single crest is.",
        hint: "Wavelength describes distance along the wave, not height above the equilibrium line.",
      },
      {
        id: "physics-basic-wave-motion-predict-003",
        scenario: "Turn on \"Show particles,\" then watch one single particle (not the whole wave shape) as the wave keeps playing.",
        question: "What does that one particle actually do?",
        options: [
          { id: "up-down-only", label: "It only oscillates up and down at its own fixed horizontal position" },
          { id: "travels-with-wave", label: "It travels sideways along with the wave, the same speed the pattern moves" },
          { id: "stays-still", label: "It stays perfectly still — only the drawn curve moves" },
          { id: "moves-in-circle", label: "It moves in a full circle" },
        ],
        actualResultOptionId: "up-down-only",
        explanation:
          "Each particle in the medium is anchored at its own horizontal position and only moves vertically, tracing the wave's height at that spot over time. It's the pattern — which particle currently happens to be at a crest — that shifts along, not any individual particle's location.",
        hint: "Follow the position of just one dot with your eyes, ignoring the curve around it.",
      },
      {
        id: "physics-basic-wave-motion-predict-004",
        scenario: "Picture two waves side by side: Wave X has a bigger amplitude than Wave Y, but the same wavelength.",
        question: "Which wave's crest sits farther from the equilibrium line?",
        options: [
          { id: "wave-x", label: "Wave X — the one with the bigger amplitude" },
          { id: "wave-y", label: "Wave Y — the one with the smaller amplitude" },
          { id: "same", label: "They're the same distance from equilibrium" },
          { id: "cant-tell", label: "It can't be determined from amplitude alone" },
        ],
        actualResultOptionId: "wave-x",
        explanation:
          "Amplitude is defined as exactly that distance — how far the crest (or trough) sits from the equilibrium line. A bigger amplitude means, by definition, a crest farther from equilibrium.",
        hint: "Amplitude and \"distance of the crest from equilibrium\" are the same thing, just described in two different ways.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE — the guided experiment
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Press Play and watch the wave travel across the screen — notice the labels for crest, trough, equilibrium, amplitude (A), and wavelength (λ) update as it moves.",
      "Increase the Amplitude control and watch only the height of the crests and troughs change.",
      "Reset amplitude, then increase the Wavelength control and watch the crests spread farther apart.",
      "Turn on \"Show particles\" and track a single particle with your eyes — confirm it only moves up and down, never sideways.",
      "Try the mini challenge below the controls: click the crest, then the trough, when prompted.",
    ],
    tryThis: [
      "Predict what a wave with double the amplitude would look like before adjusting the setting, then check yourself.",
      "Count how many full wavelengths you can fit on the screen at once at the smallest wavelength setting versus the largest.",
      "Pause the wave and try pointing out the crest, trough, and equilibrium line before pressing play again.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN — why does this happen?
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "physics-basic-wave-motion-explain-001",
        question: "Why does increasing amplitude make the wave taller without changing how close together the crests are?",
        answer:
          "Amplitude and wavelength are two independent measurements of the wave: amplitude is a vertical distance (how far the wave displaces from equilibrium), while wavelength is a horizontal distance (the spacing between repeats). Changing one doesn't require the other to change.",
      },
      {
        id: "physics-basic-wave-motion-explain-002",
        question: "Why does a single tracked particle only move up and down, even while the wave pattern clearly travels sideways?",
        answer:
          "The particle is part of the medium, and the medium doesn't travel with the wave — only the disturbance does. Each particle is anchored at its own horizontal position and simply rises and falls as the wave's height at that exact spot changes over time; a moment later, a different particle happens to be at the crest, which is what makes the pattern look like it's sliding forward.",
      },
      {
        id: "physics-basic-wave-motion-explain-003",
        question: "Why is a wave described as carrying energy rather than carrying matter?",
        answer:
          "Since the medium's own particles stay near their starting positions (oscillating, not traveling), nothing about the medium has actually relocated over the long distance the wave crossed. What did make that trip is the disturbance itself and the energy it carries — which is exactly why a wave can deliver energy far from its source without physically transporting the medium there.",
      },
      {
        id: "physics-basic-wave-motion-explain-004",
        question: "Why does a bigger amplitude usually mean a wave is carrying more energy?",
        answer:
          "A bigger amplitude means each particle in the medium has to swing farther from equilibrium and back on every cycle, which takes more energy to sustain. That's why a small ripple barely disturbs a floating leaf while a large ocean wave can knock a swimmer over — the larger amplitude reflects a much larger amount of energy being carried.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE — can I solve a problem using this?
  // -------------------------------------------------------------
  practice: {
    // Foreign key into the quiz-engine registry — all questions live in
    // @/features/quiz-engine/data/physics-basic-wave-motion-quiz.ts, none duplicated here.
    quizId: "physics-basic-wave-motion",
  },

  // -------------------------------------------------------------
  // CHALLENGE — realistic problems
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. Some use reasoning alone; others ask you to use the lab above to check your answer. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "physics-basic-wave-motion-challenge-001",
        title: "Match the Target Amplitude",
        scenario: "A lab notebook describes a wave whose crest sits noticeably higher above equilibrium than the default setting — roughly the tallest the simulation allows.",
        objective: "Set the Amplitude control to its maximum value and confirm the crest sits at that height above equilibrium.",
        tools: [{ id: "amplitude", label: "Amplitude stepper control" }],
        answer: { mode: "numeric", target: 90, tolerance: 0, unit: "px (Amplitude control units)" },
        explanation: "The Amplitude control's maximum setting is 90 — moving it there produces the tallest crest (and deepest trough) the simulation supports, with wavelength completely unaffected.",
        hints: ["Amplitude is the vertical stepper, not the horizontal one.", "Keep pressing the increase arrow on Amplitude until it stops climbing."],
      },
      {
        id: "physics-basic-wave-motion-challenge-002",
        title: "Match the Target Wavelength",
        scenario: "A second notebook entry describes a wave with the widest spacing between crests the simulation can produce.",
        objective: "Set the Wavelength control to its maximum value.",
        tools: [{ id: "wavelength", label: "Wavelength stepper control" }],
        answer: { mode: "numeric", target: 320, tolerance: 0, unit: "px (Wavelength control units)" },
        explanation: "320 is the Wavelength control's maximum — at that setting, consecutive crests are as far apart as this simulation allows.",
        hints: ["Wavelength is the horizontal-spacing stepper.", "Keep increasing Wavelength until the value stops climbing."],
      },
      {
        id: "physics-basic-wave-motion-challenge-003",
        title: "Identify the Feature",
        scenario: "Your instructor pauses the wave and points to the flat dashed line running straight across the middle of the display, which the wave rises above and dips below.",
        objective: "Name the feature being pointed to.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "The equilibrium position" },
            { id: "b", label: "The amplitude" },
            { id: "c", label: "The wavelength" },
            { id: "d", label: "A trough" },
          ],
          correctOptionId: "a",
        },
        explanation: "A flat, dashed reference line running through the middle of the wave — the level it would sit at with no disturbance — is the equilibrium (rest) position.",
        hints: ["It's the one flat, unmoving line the wave crosses back and forth over.", "It's not a peak, a dip, or a distance — it's a position."],
      },
      {
        id: "physics-basic-wave-motion-challenge-004",
        title: "Which Wave Has the Greater Amplitude?",
        scenario: "Two waves are shown on paper: Wave P's crest sits 3 cm above its equilibrium line; Wave Q's crest sits 5 cm above its equilibrium line. Both share the same wavelength.",
        objective: "Determine which wave has the greater amplitude.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Wave P" },
            { id: "b", label: "Wave Q" },
            { id: "c", label: "They have equal amplitude" },
            { id: "d", label: "Amplitude cannot be compared between different waves" },
          ],
          correctOptionId: "b",
        },
        explanation: "Amplitude is the distance from equilibrium to the crest. Wave Q's crest (5 cm) sits farther from equilibrium than Wave P's (3 cm), so Wave Q has the greater amplitude — wavelength being equal is irrelevant to this comparison.",
        hints: ["Amplitude only cares about the crest's height above equilibrium.", "Compare the two given distances directly."],
      },
      {
        id: "physics-basic-wave-motion-challenge-005",
        title: "Which Wave Has the Greater Wavelength?",
        scenario: "Wave R repeats its pattern every 4 m along its direction of travel; Wave S repeats every 6 m.",
        objective: "Determine which wave has the greater wavelength.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Wave R" },
            { id: "b", label: "Wave S" },
            { id: "c", label: "They have equal wavelength" },
            { id: "d", label: "Wavelength cannot be determined from a repeat distance" },
          ],
          correctOptionId: "b",
        },
        explanation: "Wavelength is exactly the distance over which the pattern repeats. Wave S repeats every 6 m, which is farther than Wave R's 4 m, so Wave S has the greater wavelength.",
        hints: ["\"Repeats every ___ meters\" is a direct statement of wavelength.", "Compare 4 m to 6 m directly."],
      },
      {
        id: "physics-basic-wave-motion-challenge-006",
        title: "Describe the Particle's Motion",
        scenario: "A classmate insists that as the wave passes a floating buoy, the buoy should slowly drift in the direction the wave is traveling.",
        objective: "Use the lab's particle view to determine whether the classmate is correct, and explain what the buoy actually does.",
        tools: [{ id: "show-particles", label: "\"Show particles\" toggle" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Incorrect — the buoy only oscillates up and down at roughly the same horizontal spot" },
            { id: "b", label: "Correct — the buoy drifts steadily in the wave's direction of travel" },
            { id: "c", label: "Incorrect — the buoy stays perfectly motionless" },
            { id: "d", label: "Correct, but only while the amplitude is large" },
          ],
          correctOptionId: "a",
        },
        explanation: "Turning on \"Show particles\" and watching any one particle shows it only ever moves vertically at its own fixed horizontal position — matching a real floating buoy, which bobs up and down as ripples pass under it rather than drifting off with them.",
        hints: ["Turn on particles and track just one dot with your eyes.", "The wave carries energy forward — not the medium itself."],
      },
      {
        id: "physics-basic-wave-motion-challenge-007",
        title: "Design Check: Same Height, Different Spacing",
        scenario: "You need to configure two waves in the lab, one after another, that have identical crest heights but visibly different spacing between crests.",
        objective: "Set the Amplitude control to any fixed value and produce that same wave at two different Wavelength settings, confirming the crest height stays identical both times.",
        constraints: [{ id: "c1", label: "Amplitude must stay unchanged between the two configurations." }],
        tools: [
          { id: "amplitude", label: "Amplitude stepper control" },
          { id: "wavelength", label: "Wavelength stepper control" },
        ],
        answer: { mode: "interactive", instructions: "Pick any Amplitude value, then change only the Wavelength control between two different settings.", verifyLabel: "Check my configuration" },
        explanation: "Because amplitude and wavelength are independent controls, holding amplitude fixed while changing wavelength keeps every crest exactly as tall while spacing them differently — proof that the two properties don't affect each other.",
        hints: ["Set amplitude once and don't touch it again.", "Only move the Wavelength stepper between your two configurations."],
      },
      {
        id: "physics-basic-wave-motion-challenge-008",
        title: "Real-World Mission: Reading a Seismograph",
        scenario: "A geologist shows you a simplified seismograph trace and says the earthquake with the taller peaks released more energy at the recording station than one with shorter peaks, all else being equal.",
        objective: "Explain, using what you've learned about amplitude, why a taller peak on the trace corresponds to more energy reaching that station.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Taller peaks mean a bigger amplitude, and a bigger amplitude carries more energy" },
            { id: "b", label: "Taller peaks mean the wave traveled a longer distance" },
            { id: "c", label: "Taller peaks mean the wavelength is shorter" },
            { id: "d", label: "Peak height has no connection to the wave's energy" },
          ],
          correctOptionId: "a",
        },
        explanation: "A seismograph trace's peak height is its amplitude. Just like the wave in the lab, a larger amplitude means the ground (the medium) is displaced farther from its rest position on each swing, which takes — and therefore reflects — more energy in the wave.",
        hints: ["Peak height on a trace is exactly what \"amplitude\" measures.", "You already saw larger amplitude linked to more energy earlier in this topic."],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "physics",
      topicSlug: "transverse-longitudinal-waves",
      label: "Transverse vs Longitudinal Waves",
      href: "/dashboard/physics/transverse-longitudinal-waves",
      reason: "Take the same crest/trough/amplitude/wavelength vocabulary and see the two fundamentally different ways particles can oscillate relative to a wave's direction of travel.",
    },
  ],
};

import type { TopicContent } from "../types";

/**
 * Simple Energy — brought up from Learn + Explore only to the full
 * Golden Learning Experience standard (Learn, Predict, Explore,
 * Explain, Practice, Challenge), matching Simple Forces (see that
 * file's comment for the parallel history). `learn` and `explore`
 * below are carried over verbatim from the original content; only
 * Predict, Explain, Practice, and Challenge are new.
 *
 * All new content is grounded in the `SimpleEnergy` lab's real
 * controls: a single height slider (2–10 m) and Release/Reset. The
 * lab deliberately doesn't expose mass or a real velocity number —
 * everything the ball's height, potential energy, and kinetic energy
 * bars show is one shared 0–1 fraction of the tallest possible hill
 * (see `energy-model.ts`'s `heightFraction`/`energyFractions`), with
 * no friction, so PE and KE always add back up to the starting
 * fraction. Predict, Explain, and Challenge below stay strictly
 * within that fraction-based model — comparing starting heights and
 * energy splits — rather than inventing a mass or an m/s speed number
 * the simulation never computes. Gets its own new, dedicated
 * 30-question bank (`physics-simple-energy` in
 * `@/features/quiz-engine`), since the shared
 * `physics-newtonian-mechanics` bank was only ever a stand-in for
 * this topic and Simple Forces together, not a dedicated bank for
 * either.
 */

/** A simple hill sketch with a ball at height and the same ball at
 *  the bottom — the one visual this topic's Learn step needs before
 *  the student ever touches the height slider. */
const hillSketch = (
  <svg viewBox="0 0 260 140" className="mx-auto h-32 w-full max-w-xs" role="img" aria-labelledby="simple-energy-hill-title">
    <title id="simple-energy-hill-title">
      A ball held high on a hill has potential energy. As it rolls down, that potential energy turns into kinetic energy.
    </title>
    <line x1="10" y1="120" x2="20" y2="30" strokeWidth="3" className="stroke-ink/40 dark:stroke-bone/40" />
    <line x1="20" y1="30" x2="250" y2="120" strokeWidth="3" className="stroke-ink/40 dark:stroke-bone/40" />
    <circle cx="24" cy="24" r="10" className="fill-subject-physics-soft stroke-subject-physics dark:fill-subject-physics/20" strokeWidth="2" />
    <text x="24" y="8" textAnchor="middle" className="fill-ink-soft font-mono text-[9px] dark:fill-bone-soft">High PE</text>
    <circle cx="235" cy="112" r="10" className="fill-[#3D5AFE]/25 stroke-[#3D5AFE] dark:fill-[#3D5AFE]/20" strokeWidth="2" />
    <text x="235" y="134" textAnchor="middle" className="fill-ink-soft font-mono text-[9px] dark:fill-bone-soft">High KE</text>
  </svg>
);

export const physicsSimpleEnergyContent: TopicContent = {
  subjectSlug: "physics",
  topicSlug: "simple-energy",
  title: "Simple Energy",
  subjectLabel: "Physics",
  topicLabel: "Newtonian Mechanics",
  colorToken: "physics",
  simulationHref: "/dashboard/physics/simple-energy",

  // -------------------------------------------------------------
  // LEARN — what am I learning?
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Distinguish between potential energy and kinetic energy.",
      "Explain how height above the ground relates to stored energy.",
      "Describe the law of conservation of energy in your own words.",
      "Predict how a ball's speed changes as it rolls down a hill.",
    ],
    concepts: [
      {
        term: "Potential energy (PE)",
        explanation:
          "Stored energy an object has because of its position. A ball held up high has more potential energy than the same ball sitting on the ground.",
        formula: "PE = mgh",
        formulaCaption: "mass × gravity × height",
      },
      {
        term: "Kinetic energy (KE)",
        explanation:
          "The energy an object has because it's moving. The faster something moves, the more kinetic energy it has — and speed matters a lot, since it's squared in the formula.",
        formula: "KE = \\tfrac{1}{2}mv^2",
        formulaCaption: "½ × mass × velocity²",
      },
      {
        term: "Conservation of energy",
        explanation:
          "Energy isn't created or destroyed, only converted from one form to another. As the ball rolls downhill, the potential energy it loses turns into kinetic energy — ignoring friction, the total stays the same.",
        formula: "PE_i + KE_i = PE_f + KE_f",
        formulaCaption: "Total mechanical energy is conserved",
      },
    ],
    whyItMatters:
      "This trade-off between stored and moving energy is what makes roller coasters work, what lets hydroelectric dams generate electricity from falling water, and what determines how far a skier accelerates down a slope. Once you can spot potential energy turning into kinetic energy, you'll start seeing it in nearly every moving system around you.",
    keyTerms: [
      { term: "Potential energy", definition: "Stored energy due to position — height above the ground, in this lab's case." },
      { term: "Kinetic energy", definition: "Energy an object has because it's moving." },
      { term: "Conservation of energy", definition: "The principle that total mechanical energy stays constant when no friction or other loss is present — it only changes form." },
      { term: "Frictionless", definition: "This lab's hill has no friction, so none of the ball's starting energy is lost to heat as it rolls — everything that leaves potential energy arrives as kinetic energy." },
    ],
    visualAids: [
      {
        id: "simple-energy-hill",
        caption:
          "At the top of the hill, the ball is all potential energy and no kinetic energy. At the bottom, it's the reverse — all kinetic, no potential. The total never changes.",
        visual: hillSketch,
      },
    ],
    misconceptions: [
      {
        id: "misconception-energy-disappears",
        misconception: "As the ball rolls down and loses potential energy, that energy simply disappears.",
        correction:
          "The energy doesn't vanish — it converts into kinetic energy. With no friction, whatever potential energy the ball loses shows up exactly as a gain in kinetic energy, so the total stays the same the whole way down.",
      },
      {
        id: "misconception-height-and-energy-unrelated",
        misconception: "A ball's starting height doesn't really affect how it behaves at the bottom, only how long it takes to get there.",
        correction:
          "Starting height directly sets how much potential energy the ball begins with — a higher starting point means more potential energy, and therefore more kinetic energy (and a higher speed) once it's all converted at the bottom.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT — what should I predict?
  // -------------------------------------------------------------
  predict: {
    intro:
      "Commit to a prediction before you touch the height slider below — then set up the matching height in the lab and press Release to check your answer.",
    scenarios: [
      {
        id: "physics-simple-energy-predict-001",
        scenario: "You set the height slider to the maximum (10 m) and press Release.",
        question: "What does the ball's potential energy bar do as it rolls to the bottom?",
        options: [
          { id: "falls-to-zero", label: "It starts full and falls to zero" },
          { id: "stays-full", label: "It stays full the whole way down" },
          { id: "rises", label: "It rises as the ball speeds up" },
          { id: "flat-then-drops", label: "It stays flat until halfway, then suddenly drops to zero" },
        ],
        actualResultOptionId: "falls-to-zero",
        explanation:
          "Potential energy depends on the ball's current height, which continuously decreases from the starting fraction to zero as it rolls down — so the PE bar smoothly falls to zero exactly as the ball reaches the bottom of the hill.",
        hint: "Potential energy comes from height. What happens to height as the ball rolls down?",
      },
      {
        id: "physics-simple-energy-predict-002",
        scenario: "You compare two runs: one starting at 4 m, one starting at 10 m.",
        question: "At the very top of each hill (before release), how do their potential energy bars compare?",
        options: [
          { id: "ten-higher", label: "The 10 m run starts with a higher potential energy bar" },
          { id: "equal", label: "They start equal, since both are \"at the top\" of their own run" },
          { id: "four-higher", label: "The 4 m run starts higher, since it has less far to fall" },
          { id: "cannot-tell", label: "It's impossible to compare without knowing the ball's mass" },
        ],
        actualResultOptionId: "ten-higher",
        explanation:
          "Potential energy in this lab scales directly with the chosen starting height as a fraction of the tallest possible hill — a 10 m start has a larger height fraction than a 4 m start, so it begins with more potential energy.",
        hint: "Potential energy fraction is the starting height divided by the tallest possible height. Which starting height is larger?",
      },
      {
        id: "physics-simple-energy-predict-003",
        scenario: "You set the height slider to 6 m, press Release, and pause the ball exactly halfway down the hill.",
        question: "At that halfway point, what do you expect to see?",
        options: [
          { id: "both-nonzero", label: "Both potential and kinetic energy bars show a nonzero amount" },
          { id: "only-pe", label: "Only the potential energy bar shows anything" },
          { id: "only-ke", label: "Only the kinetic energy bar shows anything" },
          { id: "both-zero", label: "Both bars are empty at the halfway point" },
        ],
        actualResultOptionId: "both-nonzero",
        explanation:
          "Partway down the hill, the ball has already lost some height (some potential energy converted away) but hasn't reached the bottom yet (so it isn't all kinetic either) — both bars show a nonzero share of the total, and together they still add up to the starting amount.",
        hint: "The ball is between the top and the bottom, not at either end. What would that mean for each energy bar?",
      },
      {
        id: "physics-simple-energy-predict-004",
        scenario: "You release the ball from any height and let it reach the very bottom of the hill.",
        question: "What is true about potential and kinetic energy at that exact moment?",
        options: [
          { id: "ke-equals-start-pe", label: "Kinetic energy equals whatever potential energy the ball started with" },
          { id: "both-zero-bottom", label: "Both potential and kinetic energy are zero at the bottom" },
          { id: "pe-still-half", label: "Potential energy is still half of its starting value" },
          { id: "ke-less-than-start", label: "Kinetic energy is always less than the starting potential energy" },
        ],
        actualResultOptionId: "ke-equals-start-pe",
        explanation:
          "With no friction, energy is conserved: whatever potential energy the ball had at the top has, by the bottom, fully converted into kinetic energy — the ending kinetic energy exactly matches the starting potential energy, no more, no less.",
        hint: "This lab has no friction. What does conservation of energy say happens to the starting potential energy by the time the ball reaches the bottom?",
      },
      {
        id: "physics-simple-energy-predict-005",
        scenario: "You run the simulation once at 8 m and once at 4 m (exactly half the height), and compare the ball's speed at the very bottom of each run.",
        question: "How do the two bottom-of-hill outcomes compare?",
        options: [
          { id: "eight-faster", label: "The 8 m run produces a faster ball at the bottom" },
          { id: "equal-speed", label: "Both balls reach the same speed, since they both start from rest" },
          { id: "four-faster", label: "The 4 m run produces a faster ball" },
          { id: "cannot-tell", label: "You can't tell without knowing the ball's mass" },
        ],
        actualResultOptionId: "eight-faster",
        explanation:
          "A higher starting height means more starting potential energy, which converts into more kinetic energy at the bottom — so the 8 m run always produces a faster ball than the 4 m run, even though the lab doesn't display an exact speed number.",
        hint: "More starting height means more starting potential energy. Where does that energy end up by the bottom?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE — hands-on with the simulation
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Set how high the ball starts on the hill using the height control.",
      "Press Release and watch the ball roll down.",
      "Track the potential and kinetic energy readouts as the ball moves — one falls while the other rises.",
      "Try a few different starting heights and compare how fast the ball is moving at the bottom.",
    ],
    tryThis: [
      "Double the starting height. Does the ball's speed at the bottom also double? Test your prediction.",
      "Pause the ball partway down and compare its potential and kinetic energy at that instant — do they add up to the starting total?",
      "Predict which starting height will produce the fastest ball at the bottom, then check it.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN — why does this happen?
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "physics-simple-energy-explain-001",
        question: "Why does potential energy decrease as the ball rolls down the hill?",
        answer:
          "Potential energy in this lab is tied directly to the ball's current height above the bottom of the hill. As the ball rolls down, its height continuously decreases, so the potential energy tied to that height decreases right along with it, reaching zero exactly when the ball reaches the bottom.",
      },
      {
        id: "physics-simple-energy-explain-002",
        question: "Why does kinetic energy rise by exactly as much as potential energy falls?",
        answer:
          "With no friction in this lab, energy has nowhere else to go — conservation of energy requires the total (potential plus kinetic) to stay constant at every instant. Since the total can't change, any amount lost from potential energy has to show up as an equal gain in kinetic energy.",
      },
      {
        id: "physics-simple-energy-explain-003",
        question: "Why does a higher starting height lead to a faster ball at the bottom?",
        answer:
          "A higher starting height means the ball begins with more potential energy (PE = mgh scales directly with h). Since all of that starting potential energy converts into kinetic energy by the bottom, more starting potential energy means more kinetic energy at the bottom — and because KE = ½mv², more kinetic energy means a higher speed.",
      },
      {
        id: "physics-simple-energy-explain-004",
        question: "Why do both energy bars show a nonzero value partway down the hill?",
        answer:
          "Partway down, the ball still has some height left above the bottom (so some potential energy remains) but has already fallen some distance and picked up speed (so it already has some kinetic energy too). Only at the very top and very bottom does one of the two bars actually hit zero.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE — can I solve a problem using this?
  // -------------------------------------------------------------
  practice: {
    // Foreign key into the quiz-engine registry — all questions live
    // in @/features/quiz-engine/data/physics-simple-energy-quiz.ts,
    // none duplicated here.
    quizId: "physics-simple-energy",
  },

  // -------------------------------------------------------------
  // CHALLENGE — realistic problems, including the real-world mission
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. Each one asks you to reason about how starting height, potential energy, and kinetic energy relate, using the lab's height slider to check your work. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "physics-simple-energy-challenge-001",
        title: "Halfway Down",
        scenario:
          "A ball is released from 8 m and reaches the exact halfway point of its roll down the hill.",
        objective: "Using the height fraction shown in the lab, determine what fraction of the total energy is potential energy at that halfway point (as a percentage).",
        requiresExperiment: true,
        constraints: [{ id: "c1", label: "Assume the ball's height decreases evenly with progress down the hill, as the lab shows." }],
        tools: [
          { id: "height-slider", label: "Height slider (2–10 m)" },
          { id: "energy-bars", label: "Live potential/kinetic energy bars" },
        ],
        answer: { mode: "numeric", unit: "%", target: 50, tolerance: 5 },
        explanation:
          "At the exact halfway point of the roll, the ball has lost half of its starting height, so it has half of its starting potential energy remaining — 50%. The other 50% has already converted into kinetic energy, matching what the lab's bars show at that instant.",
        hints: [
          "\"Halfway down\" means half the starting height has already been lost.",
          "If half the height is gone, what fraction of the starting potential energy is left?",
          "The two bars should always add up to 100% of the starting total.",
        ],
      },
      {
        id: "physics-simple-energy-challenge-002",
        title: "Doubling the Drop",
        scenario:
          "A ball released from 3 m has a certain kinetic energy at the bottom. You then release an identical ball from 6 m instead — exactly double the height.",
        objective: "Determine how the kinetic energy at the bottom of the 6 m run compares to the 3 m run, expressed as a multiple.",
        requiresExperiment: false,
        answer: { mode: "numeric", unit: "×", target: 2, tolerance: 0.2 },
        explanation:
          "Kinetic energy at the bottom exactly equals the starting potential energy (no friction), and potential energy scales directly with height (PE = mgh) — not with height squared. Doubling the starting height doubles the starting potential energy, and therefore doubles the kinetic energy at the bottom too.",
        hints: [
          "Kinetic energy at the bottom equals the starting potential energy.",
          "Potential energy is PE = mgh — how does it scale when height doubles?",
          "If PE scales directly with height, doubling height does what to PE, and therefore to the final KE?",
        ],
      },
      {
        id: "physics-simple-energy-challenge-003",
        title: "Real-World Mission: Set Up a Museum Demo",
        scenario:
          "A science museum wants a hands-on hill demo where a visitor releases the ball and it arrives at the bottom with a clearly visible, but not overwhelming, amount of kinetic energy — roughly 70% of the lab's maximum possible starting potential energy.",
        objective: "Choose a starting height (as a percentage of the maximum 10 m) that gives the ball about 70% of the maximum possible energy at the bottom.",
        constraints: [{ id: "c1", label: "Land within 10 percentage points of a 70% height fraction." }],
        tools: [{ id: "height-slider", label: "Height slider (2–10 m, shown as a percentage of the 10 m maximum)" }],
        answer: { mode: "numeric", unit: "%", target: 70, tolerance: 10 },
        explanation:
          "Since all of the starting potential energy converts into kinetic energy at the bottom (no friction), the height fraction chosen is exactly the energy fraction the ball arrives with. Setting the height slider to about 70% of its 10 m maximum — around 7 m — gives a bottom-of-hill kinetic energy of about 70% of the maximum, matching the museum's target.",
        hints: [
          "The ball's kinetic energy at the bottom equals its starting potential energy fraction.",
          "The height slider's percentage of its 10 m maximum is exactly that starting fraction.",
          "70% of 10 m is 7 m — try setting the slider close to there.",
        ],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "physics",
      topicSlug: "work-energy-power",
      label: "Work, Energy & Power",
      href: "/dashboard/physics/work-energy-power",
      reason: "Work, Energy & Power puts real numbers (mass, force, distance) behind the same potential/kinetic energy trade-off introduced here.",
    },
  ],
};

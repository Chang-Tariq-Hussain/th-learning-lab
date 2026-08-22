import type { TopicContent } from "../types";

/**
 * Acceleration — the third stop in the Motion -> Velocity -> Acceleration
 * kinematics sequence (see `@/features/learning-path/data/physics-foundations`).
 * Reuses the existing Newton's Laws Lab simulation (`NewtonsLaws`) as its
 * Explore experience: the Law 2 (F = ma) tab already has a live
 * acceleration readout, a "Net force ÷ mass = acceleration" live
 * calculation, and dedicated Force-vs-Acceleration, Mass-vs-Acceleration,
 * and Acceleration-vs-time graphs — exactly what this topic needs. No new
 * simulation component or pattern is introduced, only new authored
 * content flowing through the same `TopicLearningExperience` that Simple
 * Motion (the reference implementation) already uses.
 */

/** A small "cover the one you want to find" formula triangle for
 *  F = ma — the same visual-mnemonic pattern Simple Motion uses for
 *  d = v × t, applied to this topic's own formula. */
const forceMassAccelerationTriangle = (
  <svg viewBox="0 0 200 160" className="mx-auto h-36 w-36" role="img" aria-labelledby="fma-triangle-title">
    <title id="fma-triangle-title">
      Formula triangle: F is on top, m and a share the bottom row — cover the one you want to find.
    </title>
    <polygon points="100,10 10,150 190,150" fill="none" strokeWidth="2" className="stroke-ink/25 dark:stroke-bone/25" />
    <line x1="10" y1="80" x2="190" y2="80" strokeWidth="2" className="stroke-ink/25 dark:stroke-bone/25" />
    <line x1="100" y1="80" x2="100" y2="150" strokeWidth="2" className="stroke-ink/25 dark:stroke-bone/25" />
    <text x="100" y="58" textAnchor="middle" className="fill-ink font-display text-xl font-semibold dark:fill-bone">
      F
    </text>
    <text x="55" y="122" textAnchor="middle" className="fill-ink font-display text-xl font-semibold dark:fill-bone">
      m
    </text>
    <text x="145" y="122" textAnchor="middle" className="fill-ink font-display text-xl font-semibold dark:fill-bone">
      a
    </text>
  </svg>
);

export const physicsAccelerationContent: TopicContent = {
  subjectSlug: "physics",
  topicSlug: "acceleration",
  title: "Acceleration",
  subjectLabel: "Physics",
  topicLabel: "Kinematics",
  colorToken: "physics",
  simulationHref: "/dashboard/physics/acceleration",

  // -------------------------------------------------------------
  // LEARN — what am I learning?
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Define acceleration as the rate at which velocity changes over time.",
      "State Newton's Second Law, F = ma, and rearrange it to solve for force, mass, or acceleration.",
      "Predict how doubling force, or doubling mass, changes an object's acceleration.",
      "Read a velocity-time graph's slope as the object's acceleration.",
      "Distinguish acceleration (a changing velocity) from velocity itself (the value that's changing).",
    ],
    concepts: [
      {
        term: "Acceleration",
        explanation:
          "How quickly velocity is changing — not how fast something is moving, but how fast its speed (or direction) is changing. A car can be moving fast with zero acceleration (steady highway speed) or moving slowly with large acceleration (just pulling away from a stop sign).",
        formula: "a = \\dfrac{F_{\\text{net}}}{m}",
        formulaCaption: "a = acceleration, F = net force, m = mass",
      },
      {
        term: "Newton's Second Law",
        explanation:
          "Net force equals mass times acceleration. Rearranged, acceleration equals net force divided by mass — so for a fixed force, a heavier object accelerates less, and for a fixed mass, a bigger force accelerates it more.",
        formula: "F = m a",
      },
      {
        term: "Net force, not just applied force",
        explanation:
          "The 'F' in F = ma is the net (total) force — applied force minus whatever opposes it, like friction. Push with 10 N against 4 N of friction and the cart accelerates as if only a 6 N force were acting, not the full 10 N.",
        formula: "F_{\\text{net}} = F_{\\text{applied}} - F_{\\text{friction}}",
      },
      {
        term: "Reading acceleration off a graph",
        explanation:
          "On a velocity-time graph, acceleration is the slope — how steeply the line rises or falls. A steep upward slope means velocity is climbing quickly (large positive acceleration); a flat line means zero acceleration, even if velocity itself is large.",
      },
    ],
    whyItMatters:
      "Acceleration is what a rocket launch, a car's 0-to-60 time, and the free fall of a dropped ball all have in common — and F = ma is the single relationship that predicts every one of them from just force and mass. It's also the formula that explains why a loaded truck brakes so much more slowly than an empty one, and why astronauts train specifically for the acceleration of liftoff, not just its eventual speed.",
    keyTerms: [
      { term: "Acceleration", definition: "The rate at which velocity changes over time, measured in m/s²." },
      { term: "Net force", definition: "The combined effect of every force acting on an object, after opposing forces cancel." },
      { term: "Deceleration", definition: "A common name for acceleration that points opposite to the direction of motion, slowing an object down." },
      { term: "m/s²", definition: "Meters per second, per second — how many m/s of velocity is gained (or lost) each second." },
    ],
    visualAids: [
      {
        id: "fma-triangle",
        caption: "Cover the quantity you want to find. What's left shows how to calculate it: F over m gives a, m times a gives F, F over a gives m.",
        visual: forceMassAccelerationTriangle,
      },
    ],
    misconceptions: [
      {
        id: "misconception-fast-means-accelerating",
        misconception: "An object moving fast must be accelerating.",
        correction:
          "Speed and acceleration are independent — a car cruising at a constant 100 km/h has zero acceleration despite its high speed, while a car just pulling away from a red light at 5 km/h can have a large acceleration. Acceleration is about how velocity is changing, not how large it currently is.",
      },
      {
        id: "misconception-double-force-double-velocity",
        misconception: "Doubling the applied force instantly doubles the object's velocity.",
        correction:
          "Doubling the net force doubles the acceleration — the rate at which velocity climbs — not the velocity itself. Velocity still has to build up over time at that faster rate; it doesn't jump immediately, and how much it changes also depends on how long the force acts.",
      },
      {
        id: "misconception-mass-doesnt-matter",
        misconception: "Two objects pushed by the exact same force will speed up at the same rate, regardless of mass.",
        correction:
          "Mass is in the denominator of a = F/m for a reason: the same net force produces less acceleration on a heavier object and more on a lighter one. Pushing an empty shopping cart and a fully loaded one with equal force very obviously does not speed them up equally — the loaded cart accelerates far more slowly.",
      },
      {
        id: "misconception-acceleration-only-speeding-up",
        misconception: "Acceleration only means 'speeding up' — an object that's slowing down isn't accelerating.",
        correction:
          "Slowing down is also acceleration — specifically, acceleration pointing opposite to the direction of motion (often called deceleration). Any change in velocity at all, faster, slower, or a different direction, counts as acceleration; F = ma applies exactly the same way whether the net force is speeding an object up or slowing it down.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT — what should I predict?
  // -------------------------------------------------------------
  predict: {
    intro:
      "Commit to a prediction before you touch the sliders below — you'll only be able to run the experiment after locking in an answer for each scenario.",
    scenarios: [
      {
        id: "physics-acceleration-predict-001",
        scenario:
          "On the Law 2 (F = ma) tab, set mass to a fixed value and note the acceleration produced by a given applied force (friction off).",
        question: "If you then double the applied force, keeping mass the same, what happens to the acceleration?",
        options: [
          { id: "doubles", label: "It doubles" },
          { id: "same", label: "It stays the same" },
          { id: "halves", label: "It's cut in half" },
          { id: "quadruples", label: "It quadruples" },
        ],
        actualResultOptionId: "doubles",
        explanation:
          "a = F / m. With mass fixed, acceleration is directly proportional to force — doubling F doubles a. The Force-vs-Acceleration graph on this tab is a straight line for exactly this reason.",
        hint: "Start from a = F / m — with m held fixed, what does doubling F do to a?",
      },
      {
        id: "physics-acceleration-predict-002",
        scenario: "Reset to the same applied force as before, but this time double the cart's mass instead of the force.",
        question: "What happens to the acceleration this time?",
        options: [
          { id: "doubles", label: "It doubles" },
          { id: "same", label: "It stays the same" },
          { id: "halves", label: "It's cut in half" },
          { id: "quarters", label: "It's cut to a quarter" },
        ],
        actualResultOptionId: "halves",
        explanation:
          "a = F / m. With force fixed, acceleration is inversely proportional to mass — doubling m halves a. This is the hyperbolic curve the Mass-vs-Acceleration graph traces: heavier means less acceleration, but never in a straight-line way.",
        hint: "Same formula, a = F / m — this time m is the one changing. Is a proportional or inversely proportional to m?",
      },
      {
        id: "physics-acceleration-predict-003",
        scenario: "Turn friction on and apply a force that's smaller than the maximum friction force shown in the Live data panel.",
        question: "What will the acceleration be once the cart is already moving at a steady speed under that force?",
        options: [
          { id: "large", label: "Large and positive" },
          { id: "zero", label: "Zero" },
          { id: "negative", label: "Negative (slowing down)" },
          { id: "increasing", label: "Steadily increasing" },
        ],
        actualResultOptionId: "zero",
        explanation:
          "Once applied force and friction force are equal in magnitude, the net force is zero, and a = F_net / m = 0. Zero acceleration doesn't mean the cart stops — it means the cart's already-steady velocity simply stops changing, which is exactly Newton's First Law showing up inside the F = ma formula.",
        hint: "What is the net force once applied force and friction force are equal? What does that make a?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE — the guided experiment
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Open the Law 2 — F = ma tab and switch friction off so the only force acting is the one you apply.",
      "Set a mass and an applied force, then apply the force and watch the Acceleration readout and the live 'Net force ÷ mass = acceleration' calculation.",
      "Hold the force fixed and raise the mass slider — watch acceleration drop, and watch the Mass-vs-Acceleration graph's curve.",
      "Hold the mass fixed and raise the force slider instead — watch acceleration climb, and watch the Force-vs-Acceleration graph's straight line.",
      "Turn friction back on and slowly raise the applied force from zero — watch the Acceleration readout stay at zero until the applied force finally exceeds friction.",
    ],
    tryThis: [
      "Find a force and friction combination that produces exactly zero acceleration on a moving cart, then explain in your own words why the cart doesn't stop.",
      "Compare the shape of the Force-vs-Acceleration graph to the Mass-vs-Acceleration graph. Why is one straight and the other curved?",
      "Watch the Acceleration-vs-time graph while toggling the applied force on and off repeatedly. What does a 'square wave' shape on that graph tell you about the force being applied?",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN — why does this happen?
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "physics-acceleration-explain-001",
        question: "Why does raising the mass slider (force fixed) make the Acceleration readout drop rather than stay the same?",
        answer:
          "a = F / m means mass sits in the denominator: for the same net force, a larger mass produces a smaller acceleration. Physically, a heavier object has more inertia — more resistance to having its velocity changed — so the identical push changes its velocity more slowly.",
      },
      {
        id: "physics-acceleration-explain-002",
        question: "Why is the Force-vs-Acceleration graph a straight line, while the Mass-vs-Acceleration graph curves?",
        answer:
          "Acceleration is directly proportional to force (a = F/m with m fixed), and a direct proportion always graphs as a straight line through the origin. But acceleration is inversely proportional to mass (a = F/m with F fixed) — as mass grows, acceleration shrinks toward, but never reaches, zero, which draws the curved (hyperbolic) shape instead of a straight one.",
      },
      {
        id: "physics-acceleration-explain-003",
        question: "Why does the Acceleration readout hit exactly zero once applied force equals friction force, even though the cart is still moving?",
        answer:
          "F = ma uses the net force, and once applied force and friction force are equal in magnitude and opposite in direction, they cancel completely — net force is zero, so a = 0 / m = 0 no matter what m is. Zero acceleration describes the velocity (it's not changing), not the position (the cart keeps moving at whatever velocity it already had).",
      },
      {
        id: "physics-acceleration-explain-004",
        question: "Why does the live calculation panel show 'Net force ÷ mass = acceleration' instead of 'Applied force ÷ mass'?",
        answer:
          "F = ma has always referred to net force, and showing applied force alone would give the wrong acceleration whenever friction (or any other opposing force) is present. Displaying the actual net force keeps the live calculation honest and matches exactly what the simulation's physics engine uses to move the cart.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE — can I solve a problem using this?
  // -------------------------------------------------------------
  practice: {
    // Foreign key into the quiz-engine registry — all questions live in
    // @/features/quiz-engine/data/physics-acceleration-quiz.ts, none duplicated here.
    quizId: "physics-acceleration",
  },

  // -------------------------------------------------------------
  // CHALLENGE — realistic problems, some folding in the real-world mission
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. Some are worked out from reasoning alone; others ask you to use the lab above to find a configuration that meets a goal. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "physics-acceleration-challenge-001",
        title: "Loading Dock Math",
        scenario: "A forklift applies a net force of 900 N to a 300 kg pallet on a frictionless dolly.",
        objective: "Determine the pallet's acceleration in m/s².",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "0.33 m/s²" },
            { id: "b", label: "3 m/s²" },
            { id: "c", label: "270,000 m/s²" },
            { id: "d", label: "600 m/s²" },
          ],
          correctOptionId: "b",
        },
        explanation: "a = F / m = 900 N ÷ 300 kg = 3 m/s².",
        hints: ["Start from a = F / m, the same relationship from the simulation.", "Divide 900 by 300 directly — both are already in N and kg."],
      },
      {
        id: "physics-acceleration-challenge-002",
        title: "Rocket Sled Test",
        scenario: "Engineers need a 500 kg test sled to reach an acceleration of 12 m/s² on a frictionless track.",
        objective: "Find the net force, in newtons, required to achieve that.",
        requiresExperiment: false,
        tools: [
          { id: "t1", label: "Known mass: 500 kg" },
          { id: "t2", label: "Target acceleration: 12 m/s²" },
        ],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "41.7 N" },
            { id: "b", label: "512 N" },
            { id: "c", label: "6,000 N" },
            { id: "d", label: "500 N" },
          ],
          correctOptionId: "c",
        },
        explanation: "F = m a = 500 kg × 12 m/s² = 6,000 N.",
        hints: ["Rearrange a = F/m to F = m × a.", "Multiply mass by the target acceleration directly."],
      },
      {
        id: "physics-acceleration-challenge-003",
        title: "Two Crates, One Push",
        scenario: "A 50 N net force is applied to Crate A (10 kg) and separately, an identical 50 N net force is applied to Crate B (25 kg).",
        objective: "Determine how many times larger Crate A's acceleration is compared to Crate B's.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "1.5 times larger" },
            { id: "b", label: "2 times larger" },
            { id: "c", label: "2.5 times larger" },
            { id: "d", label: "5 times larger" },
          ],
          correctOptionId: "c",
        },
        explanation:
          "Crate A: a = 50 ÷ 10 = 5 m/s². Crate B: a = 50 ÷ 25 = 2 m/s². 5 ÷ 2 = 2.5 — Crate A accelerates 2.5 times faster than Crate B under the same force.",
        hints: ["Calculate each crate's acceleration separately with a = F / m.", "The question asks for a ratio between the two accelerations, not either value alone."],
      },
      {
        id: "physics-acceleration-challenge-004",
        title: "Will the Friction Beat the Push?",
        scenario:
          "A 20 kg crate sits on a surface where friction can produce up to 60 N of opposing force. A worker wants to accelerate it at 1.5 m/s² by pushing.",
        objective: "Use the Law 2 tab above to find the minimum applied force, in newtons, needed to hit 1.5 m/s² once friction is fighting back at 60 N.",
        constraints: [
          { id: "c1", label: "Set mass to 20 kg." },
          { id: "c2", label: "Turn friction on and adjust settings until the friction force reads about 60 N." },
        ],
        tools: [
          { id: "mass", label: "Mass slider — set to 20 kg" },
          { id: "force", label: "Applied force slider" },
          { id: "friction", label: "Friction toggle + surface dropdown" },
        ],
        answer: { mode: "numeric", unit: "N", target: 90, tolerance: 4 },
        explanation:
          "Required net force = m × a = 20 kg × 1.5 m/s² = 30 N. Since friction removes 60 N from whatever is applied, the applied force must be 60 N (to cancel friction) + 30 N (to actually accelerate the crate) = 90 N.",
        hints: [
          "First find the net force needed with F_net = m × a.",
          "Then add back the 60 N friction is going to subtract: applied force = net force + friction force.",
        ],
      },
      {
        id: "physics-acceleration-challenge-005",
        title: "Real-World Mission: Match the Target Acceleration",
        scenario:
          "A physics teacher wants a classroom demo where the cart above accelerates at exactly 2.0 m/s² with friction off, using a cart mass of 10 kg.",
        objective: "Use the Law 2 tab above (friction off, mass set to 10 kg) to find the applied force that produces an acceleration of 2.0 m/s².",
        constraints: [
          { id: "c1", label: "Friction must stay off for this demo." },
          { id: "c2", label: "Mass must be set to 10 kg." },
        ],
        tools: [
          { id: "mass", label: "Mass slider (set to 10 kg)" },
          { id: "force", label: "Applied force slider (1–200 N)" },
          { id: "readout", label: "Live Acceleration readout" },
        ],
        answer: { mode: "numeric", unit: "N", target: 20, tolerance: 1 },
        explanation:
          "F = m a = 10 kg × 2.0 m/s² = 20 N. With friction off, that 20 N is also the net force, so setting the applied force slider to 20 N should show the Acceleration readout land right on 2.0 m/s².",
        hints: [
          "This is F = m × a directly, with both m and a already given.",
          "With friction off, applied force and net force are the same number — set the force slider to your calculated value and check the readout.",
        ],
      },
    ],
  },

  relatedTopics: [],
};

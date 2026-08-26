import type { TopicContent } from "../types";

/**
 * Circular Motion — Batch 3's second topic, built to the same full
 * standard (Learn, Predict, Explore, Explain, Practice, Challenge) as
 * Momentum, Newton's Laws, Projectile Motion, and Work, Energy &
 * Power. Its Explore experience is the new `CircularMotion` lab
 * (`@/features/subjects/physics/circular-motion`) — inspecting the
 * codebase first (per this batch's instructions) turned up no
 * existing circular-motion simulation or rig anywhere to reuse, so
 * this is a dedicated new lab, built directly on the same shared
 * simulation framework Projectile Motion and Newton's Laws use rather
 * than a bespoke one. All content below is grounded in that lab's
 * real controls: Radius (0.5–5 m), Speed (0.5–15 m/s), Mass
 * (0.5–20 kg), and Direction (clockwise/counterclockwise).
 */

/** A small diagram of an object on a circular path, with its velocity
 *  vector drawn tangent to the circle and its acceleration vector
 *  drawn pointing to the center — the one image this topic's Learn
 *  step needs to make "constant speed but still accelerating" click
 *  visually rather than staying an abstract claim. */
const circularMotionSketch = (
  <svg viewBox="0 0 260 200" className="mx-auto h-48 w-full max-w-xs" role="img" aria-labelledby="circular-motion-sketch-title">
    <title id="circular-motion-sketch-title">
      An object on a circular path. Its velocity vector points tangent to the circle, in the direction of travel. Its acceleration vector points from the object straight toward the circle&apos;s center — perpendicular to velocity.
    </title>
    <circle cx="130" cy="105" r="70" fill="none" strokeDasharray="4 5" strokeWidth="1.5" className="stroke-ink/25 dark:stroke-bone/25" />
    <circle cx="130" cy="105" r="2.5" className="fill-ink/50 dark:fill-bone/50" />

    {/* Object at the top-right of the circle (45°) */}
    <circle cx="179.5" cy="55.5" r="7" className="fill-subject-physics stroke-subject-physics" strokeWidth="1.5" />

    {/* Radius line, dashed, from center to object */}
    <line x1="130" y1="105" x2="179.5" y2="55.5" strokeWidth="1" strokeDasharray="3 4" className="stroke-ink/20 dark:stroke-bone/20" />

    {/* Velocity vector: tangent, pointing "up and left" along the direction of travel */}
    <line x1="179.5" y1="55.5" x2="149" y2="30" strokeWidth="2.5" className="stroke-[#3D5AFE]" markerEnd="url(#circular-motion-arrow-v)" />
    <text x="140" y="22" textAnchor="middle" className="fill-[#3D5AFE] font-mono text-[10px] font-semibold">v</text>

    {/* Acceleration vector: from object toward center */}
    <line x1="179.5" y1="55.5" x2="153" y2="82" strokeWidth="2.5" className="stroke-[#E0524F]" markerEnd="url(#circular-motion-arrow-a)" />
    <text x="163" y="78" textAnchor="middle" className="fill-[#E0524F] font-mono text-[10px] font-semibold">a_c</text>

    <text x="10" y="16" className="fill-ink-soft font-mono text-[10px] uppercase tracking-wide dark:fill-bone-soft">
      Speed is constant — direction isn&apos;t
    </text>

    <defs>
      <marker id="circular-motion-arrow-v" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 Z" className="fill-[#3D5AFE]" />
      </marker>
      <marker id="circular-motion-arrow-a" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 Z" className="fill-[#E0524F]" />
      </marker>
    </defs>
  </svg>
);

export const physicsCircularMotionContent: TopicContent = {
  subjectSlug: "physics",
  topicSlug: "circular-motion",
  title: "Circular Motion",
  subjectLabel: "Physics",
  topicLabel: "Circular Motion & Gravitation",
  colorToken: "physics",
  simulationHref: "/dashboard/physics/circular-motion",

  // -------------------------------------------------------------
  // LEARN — what am I learning?
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Explain what it means for an object to move in a circle, and describe its motion using angular position, angular velocity, period, and frequency.",
      "Explain why an object moving at constant speed around a circle is still accelerating, because its velocity's direction keeps changing.",
      "State the relationships v = 2πr/T, a_c = v²/r, and F_c = mv²/r, and use them to calculate unknown quantities.",
      "Predict how centripetal acceleration and force change when speed, radius, or mass change.",
      "Explain why centripetal force isn't a distinct new force, but a role played by tension, gravity, friction, or another real force.",
    ],
    concepts: [
      {
        term: "Circular motion",
        explanation:
          "Circular motion is movement along a circular path around a fixed center point. An object in circular motion is constantly changing direction, even when it isn't speeding up or slowing down — which is the idea this whole topic is built around.",
      },
      {
        term: "Angular position and angular velocity",
        explanation:
          "Angular position is how far around the circle an object has traveled, measured as an angle (in radians) from a reference direction. Angular velocity (ω) is how fast that angle changes over time — the rotational equivalent of ordinary velocity.",
        formula: "\\omega = \\dfrac{v}{r}",
        formulaCaption: "angular velocity = tangential speed ÷ radius",
      },
      {
        term: "Period and frequency",
        explanation:
          "Period (T) is the time for one complete trip around the circle. Frequency (f) is how many complete trips happen per second. They're reciprocals of each other — a short period means a high frequency, and vice versa.",
        formula: "f = \\dfrac{1}{T}",
        formulaCaption: "frequency = 1 ÷ period",
      },
      {
        term: "Tangential velocity",
        explanation:
          "At any instant, an object moving in a circle has a velocity that points tangent to the circle — perpendicular to the radius, in the direction of travel. Its magnitude relates to how far the object travels (the circle's circumference) each period.",
        formula: "v = \\dfrac{2\\pi r}{T}",
        formulaCaption: "tangential speed = circumference ÷ period",
      },
      {
        term: "Constant speed, changing velocity",
        explanation:
          "Speed (how fast) and velocity (how fast, in what direction) aren't the same thing. An object can move around a circle at a perfectly constant speed while its velocity is changing every instant, simply because the direction keeps turning. Since acceleration is any change in velocity, this object is accelerating the entire time — even though a speedometer on it would never move.",
      },
      {
        term: "Centripetal acceleration",
        explanation:
          "Centripetal acceleration is the acceleration responsible for continuously turning an object's velocity so it follows a circular path. It always points from the object's current position straight toward the center of the circle — \"centripetal\" literally means \"center-seeking.\"",
        formula: "a_c = \\dfrac{v^2}{r}",
        formulaCaption: "centripetal acceleration = speed squared ÷ radius",
      },
      {
        term: "Centripetal force",
        explanation:
          "By Newton's Second Law, an acceleration requires a net force in the same direction. Centripetal force is that net inward force, and it equals mass times centripetal acceleration. Critically, centripetal force isn't a new, separate force of nature — it's a label for whatever real force (a string's tension, gravity on an orbiting object, friction on a car's tires, a track's normal force) happens to be supplying the inward pull in a given situation.",
        formula: "F_c = \\dfrac{mv^2}{r}",
        formulaCaption: "centripetal force = mass × speed squared ÷ radius",
      },
    ],
    whyItMatters:
      "Circular motion explains why a car can skid off an icy curve, why astronauts in orbit feel weightless even though gravity is very much still acting on them, why a spinning amusement park ride pushes riders outward against their seats, and why satellites can circle the Earth without needing an engine. Once you can see \"still accelerating\" in something moving at constant speed, you'll recognize centripetal force at work in everything from a swung bucket of water to a spacecraft's orbit.",
    keyTerms: [
      { term: "Angular velocity (ω)", definition: "How fast an object's angular position changes, in radians per second — equals tangential speed divided by radius." },
      { term: "Period (T)", definition: "The time required for one complete revolution around the circle, in seconds." },
      { term: "Frequency (f)", definition: "The number of complete revolutions per second, in hertz (Hz) — the reciprocal of the period." },
      { term: "Tangential velocity", definition: "The object's instantaneous velocity, always directed tangent to the circle (perpendicular to the radius), in the direction of travel." },
      { term: "Centripetal acceleration", definition: "The acceleration that continuously turns an object's velocity to keep it on a circular path — always directed toward the center." },
      { term: "Centripetal force", definition: "The net inward force (from tension, gravity, friction, or another source) required to produce centripetal acceleration — F_c = mv²/r." },
    ],
    visualAids: [
      {
        id: "circular-motion-sketch",
        caption:
          "An object on a circular path: its velocity vector (blue) points tangent to the circle, in the direction of travel, while its acceleration vector (red) points from the object straight toward the center — perpendicular to velocity, at every point on the circle.",
        visual: circularMotionSketch,
      },
    ],
    misconceptions: [
      {
        id: "misconception-constant-speed-no-acceleration",
        misconception: "An object moving at constant speed in a circle isn't accelerating, since acceleration means speeding up or slowing down.",
        correction:
          "Acceleration means any change in velocity — and velocity includes direction, not just speed. An object moving at constant speed around a circle has a velocity direction that's constantly changing, so it's continuously accelerating, even though its speedometer reading never moves.",
      },
      {
        id: "misconception-centripetal-force-is-extra-force",
        misconception: "Centripetal force is a separate, additional force that appears on top of whatever other forces are already acting on an object in circular motion.",
        correction:
          "\"Centripetal\" describes a direction and role, not a new kind of force. It's whichever existing force (tension, gravity, friction, a normal force) happens to point toward the center and keep the object on its circular path — not something extra added to a free-body diagram.",
      },
      {
        id: "misconception-doubling-speed-doubles-acceleration",
        misconception: "Doubling an object's speed doubles its centripetal acceleration.",
        correction:
          "Centripetal acceleration depends on speed squared (a_c = v²/r), not speed to the first power. Doubling speed while keeping radius fixed actually quadruples centripetal acceleration, not doubles it.",
      },
      {
        id: "misconception-mass-affects-acceleration",
        misconception: "A heavier object moving in a circle experiences a different (larger) centripetal acceleration than a lighter object at the same speed and radius.",
        correction:
          "Centripetal acceleration, a_c = v²/r, has no mass term at all — heavier and lighter objects accelerate identically at the same speed and radius. Mass only affects the centripetal force required (F_c = mv²/r), not the acceleration itself.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT — what should I predict?
  // -------------------------------------------------------------
  predict: {
    intro:
      "Commit to a prediction before you touch the controls below — then run the matching setup in the lab and check your answer.",
    scenarios: [
      {
        id: "physics-circular-motion-predict-001",
        scenario: "A ball moves around a circle at a perfectly constant speed — the speedometer reading never changes.",
        question: "Is the ball accelerating?",
        options: [
          { id: "yes-direction", label: "Yes — its velocity's direction is constantly changing" },
          { id: "no-constant-speed", label: "No — acceleration requires speed to change, and speed is constant" },
          { id: "only-at-turns", label: "Only at specific points where the path curves sharply" },
          { id: "cannot-tell", label: "It's impossible to tell without knowing the radius" },
        ],
        actualResultOptionId: "yes-direction",
        explanation:
          "Velocity is a vector — it has direction as well as magnitude. Even though speed never changes, the ball's direction of travel is turning at every instant, which means velocity is changing, which is exactly what acceleration means.",
        hint: "Think about what velocity actually is — is it only about speed, or does direction count too?",
      },
      {
        id: "physics-circular-motion-predict-002",
        scenario: "On the lab, you increase Speed while keeping Radius fixed.",
        question: "What happens to centripetal acceleration?",
        options: [
          { id: "increases-fast", label: "It increases, and faster than speed increases — because a_c depends on v²" },
          { id: "increases-proportionally", label: "It increases in exact proportion to speed" },
          { id: "stays-same", label: "It stays the same, since acceleration doesn't depend on speed" },
          { id: "decreases", label: "It decreases" },
        ],
        actualResultOptionId: "increases-fast",
        explanation:
          "a_c = v²/r means centripetal acceleration scales with speed squared. Doubling speed doesn't just double a_c — it quadruples it, since v is squared in the formula.",
        hint: "Look at the formula a_c = v²/r. Is v raised to the first power, or squared?",
      },
      {
        id: "physics-circular-motion-predict-003",
        scenario: "On the lab, you increase Radius while keeping Speed fixed.",
        question: "What happens to centripetal acceleration?",
        options: [
          { id: "decreases", label: "It decreases — a gentler, larger curve needs less inward acceleration at the same speed" },
          { id: "increases", label: "It increases, since a bigger circle needs more acceleration" },
          { id: "stays-same", label: "It stays exactly the same" },
          { id: "becomes-zero", label: "It becomes zero once the radius is large enough" },
        ],
        actualResultOptionId: "decreases",
        explanation:
          "a_c = v²/r has radius in the denominator. With speed held fixed, a larger radius means a gentler curve, which needs less centripetal acceleration to keep the object on the path — not more.",
        hint: "Radius sits on the bottom of the a_c = v²/r fraction. What does increasing the denominator do to the whole fraction?",
      },
      {
        id: "physics-circular-motion-predict-004",
        scenario: "An object travels counterclockwise around a circle.",
        question: "At the topmost point of the circle, which direction does its centripetal acceleration point?",
        options: [
          { id: "down-toward-center", label: "Straight down, toward the center" },
          { id: "up-away", label: "Straight up, away from the center" },
          { id: "horizontal", label: "Horizontally, tangent to the circle" },
          { id: "zero", label: "It's zero at the top of the circle" },
        ],
        actualResultOptionId: "down-toward-center",
        explanation:
          "Centripetal acceleration always points from the object's current position straight toward the center of the circle, no matter where on the circle it is or which direction it's traveling. At the top of the circle, the center is below, so acceleration points straight down.",
        hint: "Centripetal acceleration always points toward one specific place. Where is that, relative to the object at the top of the circle?",
      },
      {
        id: "physics-circular-motion-predict-005",
        scenario: "On the lab, you increase Mass while keeping Radius and Speed exactly the same.",
        question: "What happens to centripetal acceleration and centripetal force?",
        options: [
          { id: "force-up-accel-same", label: "Centripetal force increases; centripetal acceleration stays the same" },
          { id: "both-increase", label: "Both centripetal force and centripetal acceleration increase" },
          { id: "neither-changes", label: "Neither changes — mass has no effect on circular motion" },
          { id: "accel-up-force-same", label: "Centripetal acceleration increases; centripetal force stays the same" },
        ],
        actualResultOptionId: "force-up-accel-same",
        explanation:
          "Centripetal acceleration, a_c = v²/r, has no mass term — it depends only on speed and radius. Centripetal force, F_c = m × a_c, scales directly with mass, so increasing mass (with a_c unchanged) increases the force needed proportionally.",
        hint: "Check both formulas: does a_c = v²/r have a mass term in it anywhere? Does F_c = mv²/r?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE — hands-on with the simulation
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Press Play to send the object around the circle — watch the blue tangential-velocity arrow and the red centripetal-acceleration arrow update every instant as it travels.",
      "Adjust Radius and Speed with the sliders and watch the live readouts (period, frequency, angular velocity, centripetal acceleration, centripetal force) respond immediately.",
      "Switch Direction between clockwise and counterclockwise and notice which readouts change (the vectors' directions) and which don't (every scalar quantity).",
      "Adjust Mass and compare what changes (centripetal force) against what doesn't (centripetal acceleration, period, frequency, and the path itself).",
    ],
    tryThis: [
      "Double the speed while keeping the radius fixed, and check that centripetal acceleration goes up by a factor of 4, not 2.",
      "Double the radius while keeping the speed fixed, and check that centripetal acceleration is cut in half.",
      "Find two different radius/speed combinations that produce the same centripetal acceleration — is there more than one way to do it?",
      "Watch the velocity vector as the object goes all the way around once — confirm it always stays tangent to the circle and its length (speed) never changes.",
      "Watch the acceleration vector at several different points on the circle and confirm it always points toward the center, never anywhere else.",
      "Change only the Mass slider and confirm the object's motion (speed, path, period) doesn't visibly change at all, even though the centripetal force readout does.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN — why does this happen?
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "physics-circular-motion-explain-001",
        question: "Why does the object accelerate if its speed stays constant?",
        answer:
          "Acceleration is any change in velocity, and velocity is a vector with both magnitude (speed) and direction. Even with speed locked constant, the object's direction of travel is turning at every instant as it goes around the circle — so its velocity is changing continuously, which is exactly what acceleration means.",
      },
      {
        id: "physics-circular-motion-explain-002",
        question: "Why does acceleration point toward the center?",
        answer:
          "Acceleration points in whatever direction velocity is currently changing toward. For an object moving in a circle, the velocity vector is always rotating — turning slightly inward, toward the center, at every instant, to keep tracing out the circular path rather than flying off in a straight line. The acceleration producing that constant inward turn therefore always points toward the center too.",
      },
      {
        id: "physics-circular-motion-explain-003",
        question: "Why does doubling speed have such a large effect on centripetal acceleration?",
        answer:
          "Because a_c = v²/r has speed squared, not speed to the first power. Doubling v multiplies a_c by 2² = 4. This squared relationship is the same reason kinetic energy quadruples when speed doubles — whenever a formula squares a variable, doubling that variable quadruples the result.",
      },
      {
        id: "physics-circular-motion-explain-004",
        question: "Why does a larger radius change the required centripetal acceleration?",
        answer:
          "Radius sits in the denominator of a_c = v²/r. A larger radius means a gentler curve — the object's direction changes more gradually per meter traveled — so less acceleration is needed to keep it on the path at the same speed. A tight, small-radius curve requires much more centripetal acceleration than a wide, gentle one at the same speed.",
      },
      {
        id: "physics-circular-motion-explain-005",
        question: "Why does changing mass affect centripetal force but not centripetal acceleration?",
        answer:
          "Centripetal acceleration, a_c = v²/r, comes purely from the geometry and speed of the motion — mass doesn't appear anywhere in that formula. Centripetal force is what Newton's Second Law says is required to produce that acceleration: F_c = m × a_c. Since a_c stays fixed for a given speed and radius, increasing mass increases only the force needed, proportionally, while the acceleration itself is untouched.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE — can I solve a problem using this?
  // -------------------------------------------------------------
  practice: {
    // Foreign key into the quiz-engine registry — all questions live
    // in @/features/quiz-engine/data/physics-circular-motion-quiz.ts,
    // none duplicated here.
    quizId: "physics-circular-motion",
  },

  // -------------------------------------------------------------
  // CHALLENGE — realistic problems, including the real-world mission
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. The first two ask you to reason from the formulas directly; the last two — including the Circular Motion Designer — use the lab's live readouts to design a configuration that meets a target condition. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "physics-circular-motion-challenge-001",
        title: "Find the Missing Speed",
        scenario:
          "An engineer measures a rotating platform's centripetal acceleration at 32 m/s², at a radius of 2 m.",
        objective: "Determine the platform's tangential speed at that radius.",
        requiresExperiment: false,
        constraints: [{ id: "c1", label: "Use a_c = v²/r, rearranged to solve for v." }],
        answer: { mode: "numeric", unit: "m/s", target: 8, tolerance: 0.3 },
        explanation:
          "From a_c = v²/r: v² = a_c × r = 32 × 2 = 64, so v = 8 m/s. Rearranging a formula to solve for a different variable is a skill this topic's numeric Practice questions build toward directly.",
        hints: [
          "Start from a_c = v²/r and solve for v² first.",
          "v² = a_c × r — plug in the numbers before taking the square root.",
          "32 × 2 = 64. What's the square root of 64?",
        ],
      },
      {
        id: "physics-circular-motion-challenge-002",
        title: "Design the Force Budget",
        scenario:
          "A 3 kg object needs to move around a circle of radius 4 m using no more than 27 N of centripetal force.",
        objective: "Determine the maximum tangential speed the object can have without exceeding that force budget.",
        requiresExperiment: false,
        constraints: [{ id: "c1", label: "F_c must not exceed 27 N." }],
        answer: { mode: "numeric", unit: "m/s", target: 6, tolerance: 0.3 },
        explanation:
          "From F_c = mv²/r: v² = (F_c × r) / m = (27 × 4) / 3 = 108/3 = 36, so v = 6 m/s. Any speed at or below 6 m/s keeps the object within the 27 N force budget at this radius and mass.",
        hints: [
          "Start from F_c = mv²/r and rearrange to solve for v².",
          "v² = (F_c × r) / m — plug in F_c = 27, r = 4, m = 3.",
          "(27 × 4) / 3 = 36. What's the square root of 36?",
        ],
      },
      {
        id: "physics-circular-motion-challenge-003",
        title: "Circular Motion Designer",
        scenario:
          "A physics demonstration needs an object's centripetal acceleration to land close to a specific target value, using only the lab's Radius and Speed controls.",
        objective: "Use the Radius and Speed sliders to bring the live centripetal acceleration readout within 2 m/s² of 27 m/s².",
        constraints: [{ id: "c1", label: "Land within 2 m/s² of a 27 m/s² target for centripetal acceleration." }],
        tools: [
          { id: "radius-slider", label: "Radius slider (0.5–5 m)" },
          { id: "speed-slider", label: "Speed slider (0.5–15 m/s)" },
          { id: "accel-readout", label: "Live centripetal acceleration readout" },
        ],
        answer: { mode: "numeric", unit: "m/s²", target: 27, tolerance: 2 },
        explanation:
          "Centripetal acceleration is a_c = v²/r, so any radius/speed pair whose v²/r comes out near 27 works — for example, radius 3 m and speed 9 m/s gives a_c = 81/3 = 27 m/s² exactly. There's no single correct combination; the relationship between v, r, and a_c is what matters, and there's more than one way to hit the same target.",
        hints: [
          "Centripetal acceleration is a_c = v²/r — you need speed squared divided by radius to land near 27.",
          "Try a speed around 9 m/s with a radius around 3 m: 9² ÷ 3 = 81 ÷ 3 = 27.",
          "If that combination is out of a comfortable slider range, look for another pair whose v²/r comes out close to 27 — there are many.",
        ],
      },
      {
        id: "physics-circular-motion-challenge-004",
        title: "Real-World Mission: Design a Safe Ride",
        scenario:
          "You're designing a spinning carnival ride. The support arm holding each car can safely handle a certain amount of centripetal force before it's over-stressed — and that force depends on the car-plus-riders' mass as well as how fast and how tight the ride spins.",
        objective:
          "Use the lab's Radius, Speed, and Mass controls together to bring the live centripetal force readout within 10 N of a 60 N safety target for the support arm.",
        constraints: [{ id: "c1", label: "Land within 10 N of a 60 N target for centripetal force." }],
        tools: [
          { id: "radius-slider", label: "Radius slider (0.5–5 m)" },
          { id: "speed-slider", label: "Speed slider (0.5–15 m/s)" },
          { id: "mass-slider", label: "Mass slider (0.5–20 kg)" },
          { id: "force-readout", label: "Live centripetal force readout" },
        ],
        answer: { mode: "numeric", unit: "N", target: 60, tolerance: 10 },
        explanation:
          "Centripetal force is F_c = mv²/r, so this mission has three dials instead of two — for example, a 5 kg car at 6 m/s on a 3 m arm gives a_c = 6²/3 = 12 m/s² and F_c = 5 × 12 = 60 N exactly. Unlike the Circular Motion Designer (which only targets acceleration), a real ride's engineering also has to account for how much mass is spinning, since a heavier car needs either a slower speed or a longer arm to stay within the same force budget.",
        hints: [
          "Centripetal force is F_c = mv²/r — three variables to balance this time, not two.",
          "Pick a mass and radius first (e.g. 5 kg and 3 m), then solve for the speed that lands F_c near 60 N.",
          "Try mass 5 kg, radius 3 m, speed 6 m/s: a_c = 36/3 = 12 m/s², F_c = 5 × 12 = 60 N.",
        ],
      },
    ],
  },

  relatedTopics: [],
};

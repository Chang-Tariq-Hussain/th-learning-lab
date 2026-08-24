import type { TopicContent } from "../types";

/**
 * Work, Energy & Power — Batch 2's fifth topic, brought up to the
 * same full standard (Learn, Predict, Explore, Explain, Practice,
 * Challenge) as Newton's Laws and Projectile Motion. Uses the new
 * `WorkEnergyPower` lab (`@/features/subjects/physics/work-energy-power`)
 * as its Explore experience — three tabs (Work / Energy / Power),
 * each with real numeric readouts, unlike the deliberately numberless
 * `SimpleEnergy` sim this topic sits next to in the Newtonian
 * Mechanics group.
 *
 * All content below is grounded in the lab's real controls: Work tab
 * (force 0–100 N, displacement 0–20 m, angle 0–180°), Energy tab
 * (mass 1–50 kg, velocity 0–20 m/s for KE; mass 1–50 kg, height
 * 0–20 m for PE, using g = 9.8 m/s²), and Power tab (shared work
 * 100–2000 J, independent time 1–20 s per machine).
 */

/** A simple bar-and-arrow sketch of a force applied at an angle to a
 *  box's displacement — the one diagram this topic's Learn step needs
 *  to make "F d cos(theta)" feel geometric rather than abstract. */
const workAngleSketch = (
  <svg viewBox="0 0 260 130" className="mx-auto h-32 w-full max-w-xs" role="img" aria-labelledby="work-angle-sketch-title">
    <title id="work-angle-sketch-title">
      A force applied at an angle theta above a box&apos;s horizontal displacement, with only the horizontal component doing work.
    </title>
    <line x1="20" y1="100" x2="240" y2="100" strokeWidth="2" className="stroke-ink/25 dark:stroke-bone/25" />
    <rect x="40" y="76" width="34" height="24" rx="4" className="fill-subject-physics-soft stroke-subject-physics dark:fill-subject-physics/20" strokeWidth="2" />
    <line x1="57" y1="88" x2="150" y2="30" strokeWidth="2.5" className="stroke-[#E0524F]" markerEnd="url(#sketch-arrowhead)" />
    <defs>
      <marker id="sketch-arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 Z" className="fill-[#E0524F]" />
      </marker>
    </defs>
    <path d="M 85 88 A 28 28 0 0 0 100 68" fill="none" strokeWidth="1.5" className="stroke-ink/40 dark:stroke-bone/40" />
    <text x="92" y="82" className="fill-ink-soft font-mono text-[10px] dark:fill-bone-soft">θ</text>
    <line x1="57" y1="100" x2="200" y2="100" strokeWidth="2" strokeDasharray="4,4" className="stroke-ink/40 dark:stroke-bone/40" />
    <text x="128" y="118" textAnchor="middle" className="fill-ink-soft font-mono text-[10px] dark:fill-bone-soft">displacement, d</text>
    <text x="155" y="26" className="fill-[#E0524F] font-mono text-[10px] font-semibold">F</text>
  </svg>
);

export const physicsWorkEnergyPowerContent: TopicContent = {
  subjectSlug: "physics",
  topicSlug: "work-energy-power",
  title: "Work, Energy & Power",
  subjectLabel: "Physics",
  topicLabel: "Newtonian Mechanics",
  colorToken: "physics",
  simulationHref: "/dashboard/physics/work-energy-power",

  // -------------------------------------------------------------
  // LEARN — what am I learning?
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Explain what mechanical work means and identify when a force does zero work.",
      "Calculate work done using W = Fd cos(theta), including cases with negative work.",
      "Distinguish kinetic energy from gravitational potential energy and calculate each.",
      "Apply the conservation of energy to describe how PE converts to KE.",
      "Calculate power as the rate of doing work, and compare two machines doing the same work in different times.",
    ],
    concepts: [
      {
        term: "Work",
        explanation:
          "Work is done on an object only when a force causes it to move some distance in the direction of the force. A force with no resulting displacement — or a displacement with no force along it — does zero work, no matter how hard you push.",
        formula: "W = Fd\\cos(\\theta)",
        formulaCaption: "force × displacement × cos(angle between them)",
      },
      {
        term: "Positive, negative, and zero work",
        explanation:
          "When a force pushes in roughly the same direction as the motion (theta < 90°), the work is positive — energy is added. When it opposes the motion (theta > 90°, like friction or braking), the work is negative — energy is removed. At exactly 90°, cos(theta) is zero and no work is done at all, even if the force and displacement are both large.",
      },
      {
        term: "Kinetic energy (KE)",
        explanation:
          "The energy an object has because it's moving. Because velocity is squared in the formula, doubling speed doesn't double kinetic energy — it quadruples it.",
        formula: "KE = \\tfrac{1}{2}mv^2",
        formulaCaption: "½ × mass × velocity²",
      },
      {
        term: "Gravitational potential energy (PE)",
        explanation:
          "Stored energy an object has because of its height above a reference point, like the ground. It grows in direct proportion to both mass and height.",
        formula: "PE = mgh",
        formulaCaption: "mass × gravity (9.8 m/s²) × height",
      },
      {
        term: "Conservation of energy",
        explanation:
          "Energy isn't created or destroyed, only converted between forms. As an object falls, the potential energy it loses is converted into kinetic energy — ignoring friction and air resistance, the total mechanical energy stays constant.",
        formula: "PE_i + KE_i = PE_f + KE_f",
        formulaCaption: "Total mechanical energy is conserved",
      },
      {
        term: "Power",
        explanation:
          "Power measures how quickly work gets done — not how much work, but how fast. Two machines can do the exact same amount of work and still have very different power, if one takes longer than the other.",
        formula: "P = \\dfrac{W}{t}",
        formulaCaption: "work ÷ time",
      },
    ],
    whyItMatters:
      "Work, energy, and power tie together almost everything else in mechanics: it's why a roller coaster doesn't need an engine after the first hill, why a slower-but-steady motor can outlast a powerful-but-brief one on the same job, and why engineers rate machines in watts or horsepower instead of just describing the work they can do. Once you can read a situation as 'force acting through a distance' and 'energy changing form over time,' you'll recognize the same three ideas in everything from car engines to your own body climbing a flight of stairs.",
    keyTerms: [
      { term: "Joule (J)", definition: "The SI unit of work and energy — one joule is one newton of force acting through one meter of displacement." },
      { term: "Watt (W)", definition: "The SI unit of power — one watt is one joule of work done per second." },
      { term: "Mechanical work", definition: "Work done by a force that results in displacement, as opposed to, say, holding something still (which does zero work no matter how tiring it feels)." },
      { term: "Energy transfer", definition: "Work is the process by which energy moves into or out of an object — doing positive work on something adds energy to it." },
      { term: "System", definition: "The object or set of objects whose energy you're tracking — conservation of energy only holds within a system that isn't losing energy to friction, drag, or sound outside it." },
    ],
    visualAids: [
      {
        id: "work-angle-sketch",
        caption:
          "Only the component of force along the direction of displacement does work. As theta grows toward 90°, cos(theta) shrinks toward zero and less of the force 'counts' toward the work done.",
        visual: workAngleSketch,
      },
    ],
    misconceptions: [
      {
        id: "misconception-effort-is-work",
        misconception: "If I push hard against a wall and get tired, I'm doing a lot of work on the wall.",
        correction:
          "Physics work requires displacement in the direction of the force. Pushing on a wall that doesn't move produces zero displacement, so the mechanical work done on the wall is exactly zero — no matter how much muscular effort or fatigue is involved. Effort and work are related in everyday language, but they're not the same thing in physics.",
      },
      {
        id: "misconception-holding-is-work",
        misconception: "Holding a heavy box still above your head means you're doing work on the box.",
        correction:
          "As long as the box isn't moving, its displacement is zero, so W = Fd cos(theta) comes out to zero regardless of how much force you're exerting to support it. You're doing biological work inside your muscles (which does cost energy), but you're doing zero mechanical work on the box itself.",
      },
      {
        id: "misconception-double-speed-double-ke",
        misconception: "Doubling an object's speed doubles its kinetic energy.",
        correction:
          "Kinetic energy depends on velocity squared (KE = ½mv²), not velocity directly. Doubling speed multiplies v² by four, so kinetic energy roughly quadruples — this is exactly why crash severity increases so sharply with speed.",
      },
      {
        id: "misconception-power-equals-energy",
        misconception: "A more powerful machine always does more total work than a less powerful one.",
        correction:
          "Power is the rate of doing work, not the total amount. A high-power machine finishes a fixed amount of work faster than a low-power one, but if it runs for a shorter time, both machines can end up doing the exact same total work — power and total work are related through time, not interchangeable.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT — what should I predict?
  // -------------------------------------------------------------
  predict: {
    intro:
      "Commit to a prediction before you touch the controls below — then switch to the matching tab in the lab and check your answer.",
    scenarios: [
      {
        id: "physics-work-energy-power-predict-001",
        scenario: "On the Work tab, set force to 50 N and displacement to 0 m — the box doesn't move at all.",
        question: "How much mechanical work is done on the box?",
        options: [
          { id: "zero", label: "Exactly 0 J" },
          { id: "small", label: "A small but nonzero amount" },
          { id: "equal-force", label: "50 J, equal to the force" },
          { id: "depends-time", label: "It depends on how long the force is applied" },
        ],
        actualResultOptionId: "zero",
        explanation:
          "W = Fd cos(theta), and with d = 0, the whole expression is 0 no matter how large the force is. Work requires displacement — force alone never does work by itself.",
        hint: "Look at the formula: what happens to W = Fd cos(theta) when d is exactly zero?",
      },
      {
        id: "physics-work-energy-power-predict-002",
        scenario:
          "On the Work tab, keep force at 40 N and displacement at 10 m, but change the angle from 0° to 90°.",
        question: "What happens to the work done as the angle increases to 90°?",
        options: [
          { id: "shrinks-to-zero", label: "It shrinks steadily down to exactly 0 J" },
          { id: "stays-same", label: "It stays the same the whole time" },
          { id: "grows", label: "It grows larger" },
          { id: "flips-negative", label: "It immediately becomes negative" },
        ],
        actualResultOptionId: "shrinks-to-zero",
        explanation:
          "cos(theta) decreases from 1 at 0° to 0 at 90°, so work shrinks proportionally and hits exactly zero at 90° — a force acting perpendicular to displacement never does any work, however large it is.",
        hint: "Work depends on cos(theta). What does cos(90°) equal?",
      },
      {
        id: "physics-work-energy-power-predict-003",
        scenario: "On the Energy tab, note the kinetic energy at 10 kg and 4 m/s, then double the velocity to 8 m/s.",
        question: "How does the new kinetic energy compare to the original?",
        options: [
          { id: "quadruples", label: "It's about 4 times as large" },
          { id: "doubles", label: "It's about 2 times as large" },
          { id: "same", label: "It stays the same" },
          { id: "triples", label: "It's about 3 times as large" },
        ],
        actualResultOptionId: "quadruples",
        explanation:
          "KE = ½mv² depends on velocity squared. Doubling v multiplies v² by four, so kinetic energy roughly quadruples rather than doubling — the same relationship that makes range quadruple when launch speed doubles in Projectile Motion.",
        hint: "KE depends on v², not v — what happens to a squared term when the thing being squared doubles?",
      },
      {
        id: "physics-work-energy-power-predict-004",
        scenario: "On the Energy tab, note the potential energy of a 5 kg object at 4 m, then raise it to 12 m (mass unchanged).",
        question: "What happens to its gravitational potential energy?",
        options: [
          { id: "triples", label: "It roughly triples" },
          { id: "doubles", label: "It roughly doubles" },
          { id: "same", label: "It stays the same" },
          { id: "unpredictable", label: "It's impossible to say without knowing velocity" },
        ],
        actualResultOptionId: "triples",
        explanation:
          "PE = mgh is directly proportional to height (a linear relationship, not squared like kinetic energy). Height going from 4 m to 12 m is a factor of 3, so potential energy also scales by exactly a factor of 3.",
        hint: "PE = mgh — height appears to the first power, not squared. What does that mean for tripling the height?",
      },
      {
        id: "physics-work-energy-power-predict-005",
        scenario:
          "On the Power tab, set work to 1000 J for both machines. Machine A finishes in 10 seconds; Machine B finishes in 5 seconds.",
        question: "Which machine has greater power?",
        options: [
          { id: "machine-b", label: "Machine B — it finished the same work faster" },
          { id: "machine-a", label: "Machine A — it took longer, so it worked harder" },
          { id: "equal", label: "They're equal, since the work is the same" },
          { id: "cannot-tell", label: "There's no way to tell without knowing the force" },
        ],
        actualResultOptionId: "machine-b",
        explanation:
          "P = W/t, so with equal work, less time means more power. Machine B does 1000 J in 5 s (200 W) versus Machine A's 1000 J in 10 s (100 W) — B is twice as powerful despite doing the identical amount of work.",
        hint: "P = W/t. With the same W on top, what does a smaller t in the denominator do to the result?",
      },
      {
        id: "physics-work-energy-power-predict-006",
        scenario:
          "On the Work tab, set the angle to 150° (force pointing mostly backward relative to the displacement) with a nonzero force and displacement.",
        question: "What sign will the work done have?",
        options: [
          { id: "negative", label: "Negative" },
          { id: "positive", label: "Positive" },
          { id: "zero", label: "Exactly zero" },
          { id: "undefined", label: "Undefined — work can't be calculated past 90°" },
        ],
        actualResultOptionId: "negative",
        explanation:
          "cos(theta) is negative for any angle between 90° and 180°, and cos(150°) ≈ -0.87. A negative cosine makes the whole work expression negative — the force is mostly opposing the motion, so it removes energy rather than adding it, like friction slowing down a sliding box.",
        hint: "Is cos(theta) positive or negative for angles between 90° and 180°?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE — hands-on with the simulation
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Switch between the Work, Energy, and Power tabs at the top of the lab.",
      "On the Work tab, adjust force, displacement, and angle, and watch the signed Work readout and diagram respond.",
      "On the Energy tab, adjust mass and velocity for kinetic energy, and mass and height for potential energy, side by side.",
      "On the Power tab, set a shared amount of work and different times for Machine A and Machine B, then press Run and watch them race.",
      "Read the substitution line under each readout to see exactly which numbers were plugged into the formula.",
    ],
    tryThis: [
      "Find two different force/displacement/angle combinations that produce the same work.",
      "Double the displacement while keeping force and angle constant. Does work double too?",
      "Double the velocity on the Energy tab and observe how much kinetic energy changes.",
      "Set the angle past 90° on the Work tab and find the exact angle where work becomes negative.",
      "On the Power tab, find a pair of times for Machine A and B where B is exactly twice as powerful as A.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN — why does this happen?
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "physics-work-energy-power-explain-001",
        question: "Why isn't every force associated with mechanical work?",
        answer:
          "Work requires displacement in the direction of the force — a force with no resulting motion, or a force acting entirely perpendicular to the motion, contributes zero work. Holding a heavy bag still, or a satellite's gravity constantly pulling it sideways into a circular orbit, are both real forces doing zero work because the displacement condition isn't met.",
      },
      {
        id: "physics-work-energy-power-explain-002",
        question: "Why does displacement matter so much to the definition of work?",
        answer:
          "Work is the mechanism by which a force actually transfers energy into or out of an object, and that transfer only happens while the object is moving under the force's influence. No displacement means the force never gets the chance to speed the object up, slow it down, or change its height — so no energy is transferred, and by definition, no work is done.",
      },
      {
        id: "physics-work-energy-power-explain-003",
        question: "Why does doubling velocity increase kinetic energy by more than double?",
        answer:
          "Kinetic energy's formula (KE = ½mv²) has velocity squared in it, not velocity by itself. Squaring a doubled quantity multiplies it by four (2² = 4), so kinetic energy quadruples rather than just doubling — this squared relationship is why small increases in speed matter so much for things like stopping distance and collision energy.",
      },
      {
        id: "physics-work-energy-power-explain-004",
        question: "Why does lifting an object higher increase its gravitational potential energy?",
        answer:
          "Gravitational potential energy represents the work gravity would do on the object if it fell back down, and that depends directly on how far it has to fall. A greater height means gravity has more distance to act through on the way down, so more energy is 'stored' by lifting it there in the first place — this relationship is linear (PE = mgh), unlike kinetic energy's squared relationship with velocity.",
      },
      {
        id: "physics-work-energy-power-explain-005",
        question: "Why does completing the same work faster mean greater power, rather than more total energy?",
        answer:
          "Power (P = W/t) measures a rate, not a total. Two machines can transfer the exact same total energy — the same W — while one does it in far less time. Dividing the same numerator by a smaller time gives a larger result, so the faster machine is more powerful even though neither machine did more work than the other.",
      },
      {
        id: "physics-work-energy-power-explain-006",
        question: "Where does energy go when friction is present?",
        answer:
          "Friction does negative work on a moving object, removing mechanical energy from it — but that energy doesn't vanish. It converts into thermal energy (heat) in the surfaces sliding against each other, and often a bit of sound. Mechanical energy (KE + PE) alone isn't conserved when friction acts, but the total energy, including the heat generated, still is.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE — can I solve a problem using this?
  // -------------------------------------------------------------
  practice: {
    // Foreign key into the quiz-engine registry — all questions live
    // in @/features/quiz-engine/data/physics-work-energy-power-quiz.ts,
    // none duplicated here.
    quizId: "physics-work-energy-power",
  },

  // -------------------------------------------------------------
  // CHALLENGE — realistic problems, including the real-world mission
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. The first two ask you to reason from the formulas directly; the last two use the lab's live readouts to design a configuration that hits a target. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "physics-work-energy-power-challenge-001",
        title: "The Perpendicular Pull",
        scenario:
          "A child pulls a wagon using a rope angled 90° above the direction the wagon actually rolls (straight up, while the wagon moves horizontally), applying a genuinely large force the whole time.",
        objective: "Determine how much mechanical work is done on the wagon by this pull.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Exactly 0 J, regardless of the force's size" },
            { id: "b", label: "A small positive amount" },
            { id: "c", label: "A large positive amount, since the force is large" },
            { id: "d", label: "It's negative, since the rope is angled awkwardly" },
          ],
          correctOptionId: "a",
        },
        explanation:
          "At exactly 90° between force and displacement, cos(90°) = 0, which zeroes out the entire work calculation regardless of how large the force is. This is a direct, real-world instance of the 'perpendicular force does no work' idea — the same reasoning that explains why a satellite's centripetal gravity does no work on it in a circular orbit.",
        hints: [
          "Use W = Fd cos(theta). What does cos(90°) equal?",
          "A force can be arbitrarily large and still do zero work if the angle is exactly 90° to the motion.",
        ],
      },
      {
        id: "physics-work-energy-power-challenge-002",
        title: "Trading Height for Speed",
        scenario:
          "A 2 kg ball is released from rest at a height of 5 m and allowed to fall freely, with no air resistance, converting all of its potential energy into kinetic energy by the time it reaches the ground.",
        objective: "Determine the ball's speed just before it hits the ground.",
        requiresExperiment: false,
        constraints: [{ id: "c1", label: "Use g = 9.8 m/s² and assume no energy is lost to air resistance." }],
        answer: { mode: "numeric", unit: "m/s", target: 9.9, tolerance: 0.3 },
        explanation:
          "Conservation of energy means all of the initial PE converts to KE: mgh = ½mv². The mass cancels out of both sides, leaving v = √(2gh) = √(2 × 9.8 × 5) = √98 ≈ 9.9 m/s. Notice the mass never mattered — any mass falling from the same height reaches the same speed, just like projectiles falling under gravity alone.",
        hints: [
          "Set PE at the top equal to KE at the bottom: mgh = ½mv². What cancels out?",
          "Solve for v: v = √(2gh). Plug in g = 9.8 and h = 5.",
        ],
      },
      {
        id: "physics-work-energy-power-challenge-003",
        title: "Hit 400 Joules of Work",
        scenario:
          "A warehouse robot needs to push a crate with a specific, precise amount of mechanical work — not too much, not too little — to slide it exactly the right distance without overshooting.",
        objective: "Use the Work tab's force, displacement, and angle controls to produce work within 15 J of 400 J.",
        constraints: [{ id: "c1", label: "Land within 15 J of 400 J." }],
        tools: [
          { id: "force-slider", label: "Force slider (0–100 N)" },
          { id: "displacement-slider", label: "Displacement slider (0–20 m)" },
          { id: "angle-slider", label: "Angle slider (0–180°)" },
          { id: "work-readout", label: "Live Work readout" },
        ],
        answer: { mode: "numeric", unit: "J", target: 400, tolerance: 15 },
        explanation:
          "The most direct route is to keep the angle at 0° (so cos(theta) = 1, the maximum possible) and pick force and displacement whose product is close to 400 — for example, 40 N over 10 m, or 50 N over 8 m. Any nonzero angle reduces the work below the simple F × d product, so it takes a larger force or displacement to compensate.",
        hints: [
          "Start with the angle at 0° — that's when cos(theta) is at its maximum, so the work equals simply F × d.",
          "Pick a force and displacement whose product is close to 400 — for example, 40 × 10 or 50 × 8.",
        ],
      },
      {
        id: "physics-work-energy-power-challenge-004",
        title: "Real-World Mission: Design the Faster Machine",
        scenario:
          "A factory is comparing two conveyor-lift machines that will both be assigned the exact same lifting job. The engineering team wants Machine B configured to be as close as possible to exactly twice as powerful as Machine A, so it can be marketed as the express option.",
        objective:
          "Use the Power tab: with a fixed shared Work value, set Machine A's and Machine B's times so that Machine B's power comes out within 5 W of exactly double Machine A's power.",
        constraints: [{ id: "c1", label: "Machine B's power should be within 5 W of exactly 2× Machine A's power." }],
        tools: [
          { id: "work-slider", label: "Shared Work slider (100–2000 J)" },
          { id: "time-a-slider", label: "Machine A time slider (1–20 s)" },
          { id: "time-b-slider", label: "Machine B time slider (1–20 s)" },
          { id: "power-readouts", label: "Live Power readouts for both machines" },
        ],
        answer: { mode: "numeric", unit: "W", target: 100, tolerance: 5 },
        explanation:
          "Since both machines share the same work, P = W/t means power is inversely proportional to time — halving the time exactly doubles the power. Setting Machine B's time to exactly half of Machine A's time (for example, A at 10 s and B at 5 s, both at 1000 J) gives Machine A 100 W and Machine B 200 W, a clean 2× ratio. This mirrors the lab's own Predict scenario about the same two machines, so your answer there should match.",
        hints: [
          "With equal work, power and time are inversely related — halving time doubles power.",
          "Try setting Machine B's time to exactly half of Machine A's time and check the readouts.",
        ],
      },
    ],
  },

  relatedTopics: [],
};

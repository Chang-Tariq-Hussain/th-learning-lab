import type { TopicContent } from "../types";

/**
 * Momentum — Batch 3's first topic, built to the same full standard
 * (Learn, Predict, Explore, Explain, Practice, Challenge) as Newton's
 * Laws, Projectile Motion, and Work, Energy & Power.
 *
 * Its Explore experience is the `Momentum` lab
 * (`@/features/subjects/physics/momentum`), which is itself a thin
 * wrapper around Newton's Laws' existing "Law 3" rig — see that
 * component's doc comment for why reusing it, rather than building a
 * new momentum/collision physics engine, was the right call after
 * inspecting what already existed. All content below is grounded in
 * that lab's real controls: the Collision scenario (Mass A/B 1–120 kg,
 * Ball A launch speed 0.5–10 m/s, Restitution 0–1) and the Skaters
 * scenario (Mass A/B 1–120 kg, Push apart).
 */

/** A simple before/after sketch of two carts colliding and sticking
 *  together — the one diagram this topic's Learn step needs to make
 *  "momentum is conserved even when kinetic energy isn't" feel
 *  concrete rather than abstract. */
const collisionSketch = (
  <svg viewBox="0 0 260 140" className="mx-auto h-36 w-full max-w-xs" role="img" aria-labelledby="momentum-collision-sketch-title">
    <title id="momentum-collision-sketch-title">
      Before: two carts approach each other. After: they move together at one shared velocity, with total momentum unchanged.
    </title>
    <text x="10" y="16" className="fill-ink-soft font-mono text-[10px] uppercase tracking-wide dark:fill-bone-soft">Before</text>
    <line x1="10" y1="40" x2="250" y2="40" strokeWidth="1.5" className="stroke-ink/20 dark:stroke-bone/20" />
    <rect x="20" y="26" width="30" height="24" rx="4" className="fill-subject-physics-soft stroke-subject-physics dark:fill-subject-physics/20" strokeWidth="2" />
    <line x1="52" y1="38" x2="80" y2="38" strokeWidth="2.5" className="stroke-[#3D5AFE]" markerEnd="url(#momentum-arrow-a)" />
    <rect x="200" y="26" width="20" height="24" rx="4" className="fill-[#E0524F]/20 stroke-[#E0524F] dark:fill-[#E0524F]/25" strokeWidth="2" />
    <line x1="200" y1="38" x2="182" y2="38" strokeWidth="2" className="stroke-[#E0524F]" markerEnd="url(#momentum-arrow-b)" />
    <text x="35" y="66" textAnchor="middle" className="fill-ink-soft font-mono text-[9px] dark:fill-bone-soft">A</text>
    <text x="210" y="66" textAnchor="middle" className="fill-ink-soft font-mono text-[9px] dark:fill-bone-soft">B</text>

    <text x="10" y="96" className="fill-ink-soft font-mono text-[10px] uppercase tracking-wide dark:fill-bone-soft">After (inelastic)</text>
    <line x1="10" y1="120" x2="250" y2="120" strokeWidth="1.5" className="stroke-ink/20 dark:stroke-bone/20" />
    <rect x="110" y="106" width="46" height="24" rx="4" className="fill-subject-physics-soft stroke-subject-physics dark:fill-subject-physics/20" strokeWidth="2" />
    <line x1="156" y1="118" x2="180" y2="118" strokeWidth="2.5" className="stroke-[#7C4FE0]" markerEnd="url(#momentum-arrow-c)" />
    <text x="133" y="146" textAnchor="middle" className="fill-ink-soft font-mono text-[9px] dark:fill-bone-soft">A + B, moving together</text>

    <defs>
      <marker id="momentum-arrow-a" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 Z" className="fill-[#3D5AFE]" />
      </marker>
      <marker id="momentum-arrow-b" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 Z" className="fill-[#E0524F]" />
      </marker>
      <marker id="momentum-arrow-c" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 Z" className="fill-[#7C4FE0]" />
      </marker>
    </defs>
  </svg>
);

export const physicsMomentumContent: TopicContent = {
  subjectSlug: "physics",
  topicSlug: "momentum",
  title: "Momentum",
  subjectLabel: "Physics",
  topicLabel: "Newtonian Mechanics",
  colorToken: "physics",
  simulationHref: "/dashboard/physics/momentum",

  // -------------------------------------------------------------
  // LEARN — what am I learning?
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Define momentum as an object's mass times its velocity, and explain why it's called \"quantity of motion.\"",
      "Explain why momentum is a vector, and why direction (or sign) matters just as much as size.",
      "Predict how momentum changes when mass or velocity changes, and compare two objects' momenta.",
      "State conservation of momentum for an isolated system, and apply it to pushes and collisions.",
      "Distinguish elastic from inelastic collisions, and explain what impulse means.",
    ],
    concepts: [
      {
        term: "Momentum",
        explanation:
          "Momentum is a measure of \"quantity of motion\" — how much mass is moving, and how fast. A loaded truck rolling slowly and a small car speeding along can have comparable momentum, because momentum weighs mass and velocity equally.",
        formula: "p = mv",
        formulaCaption: "momentum = mass × velocity",
      },
      {
        term: "Momentum is a vector",
        explanation:
          "Because velocity has a direction, momentum does too. Two objects can have the exact same mass and the exact same speed and still have different momentum, if one is moving right and the other left — their momenta even have opposite signs along the same line.",
      },
      {
        term: "Mass and momentum",
        explanation:
          "With velocity held constant, momentum scales directly with mass — double the mass, double the momentum. This is a simple, linear relationship, not a squared one.",
      },
      {
        term: "Velocity and momentum",
        explanation:
          "With mass held constant, momentum scales directly with velocity too — double the velocity, double the momentum. Unlike kinetic energy (which depends on v²), doubling speed only doubles momentum, not quadruples it.",
      },
      {
        term: "Conservation of momentum",
        explanation:
          "In an isolated system — no external forces — total momentum never changes, even while individual objects' momenta change a great deal. Whatever momentum one object gains, another loses exactly as much, because the forces objects exert on each other are always equal and opposite.",
        formula: "p_{total,before} = p_{total,after}",
        formulaCaption: "Total momentum before an interaction equals total momentum after",
      },
      {
        term: "Elastic vs. inelastic collisions",
        explanation:
          "Momentum is conserved in every collision in an isolated system, elastic or not. What makes a collision elastic is that kinetic energy is conserved too — nothing is lost to heat, sound, or deformation. A perfectly inelastic collision is the opposite extreme: the objects stick together afterward, and the maximum possible kinetic energy is lost, while momentum still balances exactly.",
      },
      {
        term: "Impulse",
        explanation:
          "Impulse is the change in an object's momentum, and it equals the net force applied multiplied by how long that force acts. A small force applied for a long time can produce the same impulse — the same change in momentum — as a large force applied briefly, which is exactly why airbags and crumple zones work.",
        formula: "J = \\Delta p = F \\Delta t",
        formulaCaption: "impulse = change in momentum = force × time",
      },
    ],
    whyItMatters:
      "Momentum is the concept behind why a slow-moving truck can be just as dangerous as a fast-moving car, why rockets can accelerate in the vacuum of space with nothing to push against but their own exhaust, and why a boxer's glove or a car's crumple zone can make the same stop survivable by stretching it out over more time. Once you can read a situation as \"how much motion is here, and where is it going,\" you'll recognize conservation of momentum in everything from billiard balls to spacecraft docking maneuvers.",
    keyTerms: [
      { term: "kg·m/s", definition: "The SI unit of momentum — mass in kilograms times velocity in meters per second. It has no special named unit of its own." },
      { term: "Isolated system", definition: "A set of objects with no external forces acting on them (or where external forces cancel) — the condition under which total momentum is guaranteed to stay constant." },
      { term: "Elastic collision", definition: "A collision in which both momentum and kinetic energy are conserved — objects bounce apart with no energy lost to heat, sound, or deformation." },
      { term: "Perfectly inelastic collision", definition: "A collision in which the objects stick together afterward and move with one shared final velocity — momentum is still conserved, but kinetic energy is not." },
      { term: "Impulse", definition: "The change in momentum an object experiences, equal to the net force applied times the time it acts (J = FΔt)." },
    ],
    visualAids: [
      {
        id: "momentum-collision-sketch",
        caption:
          "Before a collision, two carts approach with their own momenta. After a perfectly inelastic collision, they move together at one shared velocity — but add up the momentum before and after, and the total is exactly the same.",
        visual: collisionSketch,
      },
    ],
    misconceptions: [
      {
        id: "misconception-heavier-always-more-momentum",
        misconception: "A heavier object always has more momentum than a lighter one.",
        correction:
          "Momentum depends on both mass and velocity (p = mv), not mass alone. A light object moving fast enough can have more momentum than a heavy object moving slowly — a 2 kg object at 6 m/s (12 kg·m/s) has more momentum than a 10 kg object at 1 m/s (10 kg·m/s).",
      },
      {
        id: "misconception-momentum-equals-ke",
        misconception: "Momentum and kinetic energy are basically the same thing, and both are always conserved in a collision.",
        correction:
          "They're different quantities with different formulas (p = mv vs. KE = ½mv²), and only momentum is guaranteed to be conserved in every collision. Kinetic energy is conserved only in the special case of an elastic collision — in an inelastic collision, kinetic energy is lost (to heat, sound, deformation) even though momentum still balances exactly.",
      },
      {
        id: "misconception-momentum-cant-be-negative",
        misconception: "Momentum being negative means something has gone wrong in the calculation.",
        correction:
          "A negative momentum value simply means the object is moving in whichever direction was chosen as negative — it's a completely normal result of momentum being a vector, not an error. Sign is how direction shows up in a one-dimensional problem.",
      },
      {
        id: "misconception-doubling-velocity-quadruples-momentum",
        misconception: "Doubling an object's velocity quadruples its momentum, the same way it quadruples kinetic energy.",
        correction:
          "Momentum depends on velocity to the first power (p = mv), not velocity squared. Doubling velocity doubles momentum — it's kinetic energy (KE = ½mv²) that quadruples when velocity doubles, because that formula squares velocity.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT — what should I predict?
  // -------------------------------------------------------------
  predict: {
    intro:
      "Commit to a prediction before you touch the controls below — then switch to the matching scenario in the lab and check your answer.",
    scenarios: [
      {
        id: "physics-momentum-predict-001",
        scenario: "Two objects move at the same velocity. Object A has a mass of 2 kg, Object B has a mass of 5 kg.",
        question: "Which object has greater momentum?",
        options: [
          { id: "object-b", label: "Object B, since it has more mass at the same velocity" },
          { id: "object-a", label: "Object A, since it's lighter" },
          { id: "equal", label: "They're equal, since the velocity is the same" },
          { id: "cannot-tell", label: "It's impossible to tell without knowing the exact velocity" },
        ],
        actualResultOptionId: "object-b",
        explanation:
          "With velocity held equal, momentum scales directly with mass — p = mv means the object with more mass simply has more momentum, by exactly the same ratio as the mass difference.",
        hint: "Momentum is p = mv. If v is the same for both, what does more mass do to p?",
      },
      {
        id: "physics-momentum-predict-002",
        scenario: "An object's velocity doubles while its mass stays exactly the same.",
        question: "What happens to its momentum?",
        options: [
          { id: "doubles", label: "It doubles" },
          { id: "quadruples", label: "It quadruples, since velocity is effectively squared" },
          { id: "same", label: "It stays the same" },
          { id: "half", label: "It's cut in half" },
        ],
        actualResultOptionId: "doubles",
        explanation:
          "Momentum depends on velocity to the first power, p = mv — not v² like kinetic energy. Doubling velocity simply doubles momentum, with no squaring involved.",
        hint: "Look at the formula p = mv — is v raised to a power other than 1?",
      },
      {
        id: "physics-momentum-predict-003",
        scenario: "On the Collision scenario, two carts move toward each other and collide.",
        question: "What do you predict happens to the total momentum of the system during the collision?",
        options: [
          { id: "conserved", label: "It stays exactly the same before and after" },
          { id: "increases", label: "It increases, since a collision adds energy" },
          { id: "decreases", label: "It decreases, since some is always lost" },
          { id: "depends", label: "It depends entirely on how hard they hit" },
        ],
        actualResultOptionId: "conserved",
        explanation:
          "With no external forces on the two-cart system, the forces the carts exert on each other during contact are equal and opposite (Newton's Third Law) — they cancel out of the total, so momentum is conserved regardless of restitution.",
        hint: "The two carts only push on each other — no outside forces are involved. What does that mean for their combined momentum?",
      },
      {
        id: "physics-momentum-predict-004",
        scenario: "Object A (mass 10 kg) moves slowly at 1 m/s. Object B (mass 2 kg) moves quickly at 6 m/s.",
        question: "Which one has greater momentum?",
        options: [
          { id: "object-b", label: "Object B — its higher speed outweighs having less mass" },
          { id: "object-a", label: "Object A, since it's heavier" },
          { id: "equal", label: "They're exactly equal" },
          { id: "cannot-tell", label: "Momentum can't be compared between different masses" },
        ],
        actualResultOptionId: "object-b",
        explanation:
          "p_A = 10 × 1 = 10 kg·m/s, p_B = 2 × 6 = 12 kg·m/s. Being heavier doesn't automatically mean more momentum — a big enough velocity advantage can outweigh a mass disadvantage.",
        hint: "Calculate p = mv for each object separately, then compare the two numbers.",
      },
      {
        id: "physics-momentum-predict-005",
        scenario: "On the Collision scenario, you set Restitution to 0 (perfectly inelastic) instead of 1 (perfectly elastic), keeping masses and launch speed the same.",
        question: "What changes between the two runs?",
        options: [
          { id: "ke-not-momentum", label: "Kinetic energy lost is different, but total momentum is conserved either way" },
          { id: "momentum-different", label: "Total momentum is different between the two runs" },
          { id: "nothing-changes", label: "Nothing changes — restitution has no physical effect" },
          { id: "momentum-not-conserved", label: "Momentum is only conserved in the elastic run" },
        ],
        actualResultOptionId: "ke-not-momentum",
        explanation:
          "Restitution controls how much kinetic energy survives the collision — at 0, the carts stick together and lose the maximum possible kinetic energy; at 1, none is lost. But total momentum is conserved at any restitution value, since it's set entirely by the isolated system having no external forces, independent of what happens to kinetic energy.",
        hint: "Restitution changes how \"bouncy\" the collision is — but does that have anything to do with whether outside forces act on the system?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE — hands-on with the simulation
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "The lab opens on the Collision scenario — set Mass A, Mass B, Ball A's launch speed, and Restitution, then press Launch.",
      "Watch the live momentum readouts for Ball A, Ball B, and the total, and compare the \"Before\" and \"After\" values once they collide.",
      "Switch to the Skaters scenario to see conservation of momentum from rest: set each skater's mass, then press Push apart.",
      "Try the Rocket, Balloon, and Spring launch scenarios too — each one shows the same equal-and-opposite idea driving a conserved total momentum, in a different everyday setting.",
    ],
    tryThis: [
      "Make one object's momentum exactly twice as large as it was, by changing only its velocity.",
      "Keep momentum the same while changing mass and velocity — find two different combinations of mass and velocity that produce the same momentum.",
      "Compare two objects with very different masses — find a velocity for the lighter one that gives it more momentum than the heavier one.",
      "On the Collision scenario, run the same masses and launch speed at Restitution 1, then at Restitution 0 — does the total momentum change? Does anything else?",
      "On the Skaters scenario, make one skater much heavier than the other, then push apart — which one ends up moving faster, and does that match what you'd predict from conservation of momentum?",
      "Reverse Ball A's direction (by comparing runs) and observe how the sign of its momentum flips while its magnitude stays the same.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN — why does this happen?
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "physics-momentum-explain-001",
        question: "Why does direction matter for momentum?",
        answer:
          "Momentum is p = mv, and velocity is a vector — it has a direction as well as a size. Since mass is always positive, momentum inherits velocity's direction entirely, which is why two objects with identical mass and speed can still have different (even opposite-signed) momentum if they're moving different ways.",
      },
      {
        id: "physics-momentum-explain-002",
        question: "Why does a heavier object have more momentum than a lighter one at the same velocity?",
        answer:
          "Momentum scales directly with mass when velocity is fixed — p = mv means doubling the mass doubles p exactly, with velocity contributing nothing extra to that comparison. More mass moving at the same speed simply is more \"quantity of motion.\"",
      },
      {
        id: "physics-momentum-explain-003",
        question: "Why can a fast-moving light object have significant momentum?",
        answer:
          "Because p = mv weighs mass and velocity equally — neither one dominates the formula. A small mass multiplied by a large velocity can produce the same, or a larger, product than a large mass multiplied by a small velocity, which is exactly what lets a fast light object outperform a slow heavy one in momentum terms.",
      },
      {
        id: "physics-momentum-explain-004",
        question: "Why is total momentum conserved during a collision?",
        answer:
          "In an isolated system, the only forces acting are the objects on each other — and by Newton's Third Law, those forces are always equal in magnitude and opposite in direction. Equal-and-opposite forces produce equal-and-opposite impulses over the same contact time, so whatever momentum one object gains, the other loses exactly as much, leaving the total unchanged.",
      },
      {
        id: "physics-momentum-explain-005",
        question: "Why can kinetic energy change while momentum stays conserved?",
        answer:
          "Momentum and kinetic energy are governed by different physical principles. Momentum conservation follows directly from Newton's Third Law and holds in any isolated-system collision. Kinetic energy conservation is a much stronger, additional condition that only holds if no energy converts to heat, sound, or deformation during the impact — which is true in an elastic collision but not an inelastic one, even though momentum balances exactly either way.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE — can I solve a problem using this?
  // -------------------------------------------------------------
  practice: {
    // Foreign key into the quiz-engine registry — all questions live
    // in @/features/quiz-engine/data/physics-momentum-quiz.ts, none
    // duplicated here.
    quizId: "physics-momentum",
  },

  // -------------------------------------------------------------
  // CHALLENGE — realistic problems, including the real-world mission
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. The first two ask you to reason from conservation of momentum directly; the last two use the lab's live readouts to design a collision that meets a target condition. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "physics-momentum-challenge-001",
        title: "The Push-Apart Puzzle",
        scenario:
          "Two skaters, initially at rest and facing each other, push apart. The 60 kg skater ends up moving away at 2 m/s.",
        objective: "Determine the velocity of the other skater, whose mass is 40 kg.",
        requiresExperiment: false,
        constraints: [{ id: "c1", label: "Total momentum before the push is 0 (both skaters start at rest)." }],
        answer: { mode: "numeric", unit: "m/s", target: 3, tolerance: 0.2 },
        explanation:
          "Total momentum starts at 0 and must stay at 0 (isolated system): 60 × 2 = 40 × v, so v = 120 ÷ 40 = 3 m/s in the opposite direction. The lighter skater always ends up faster — the same equal-and-opposite impulse produces a bigger velocity change on a smaller mass.",
        hints: [
          "Think about total momentum before and after the push — it starts at 0.",
          "Write each skater's momentum: 60 × 2 for one, 40 × v for the other, with opposite signs.",
          "Set total initial momentum (0) equal to total final momentum, and solve for v.",
        ],
      },
      {
        id: "physics-momentum-challenge-002",
        title: "Sticking Together",
        scenario:
          "A 3 kg cart moving at 5 m/s collides with a stationary 2 kg cart, and — because the collision is perfectly inelastic — they stick together afterward.",
        objective: "Determine the combined final velocity of the two carts.",
        requiresExperiment: false,
        answer: { mode: "numeric", unit: "m/s", target: 3, tolerance: 0.2 },
        explanation:
          "Total momentum before: (3 × 5) + (2 × 0) = 15 kg·m/s. After sticking, the combined mass is 5 kg, so v = 15 ÷ 5 = 3 m/s. Notice kinetic energy is not conserved here (½×3×5² = 37.5 J before vs. ½×5×3² = 22.5 J after) even though momentum balances exactly.",
        hints: [
          "Think about total momentum before and after the collision.",
          "Write the momentum of each cart: 3 × 5 for the moving one, 2 × 0 for the stationary one.",
          "Set total initial momentum equal to total final momentum, then divide by the combined mass (5 kg).",
        ],
      },
      {
        id: "physics-momentum-challenge-003",
        title: "Match the Target Momentum",
        scenario:
          "An engineer needs Ball A's momentum, just before it launches on the Collision scenario, to land within a tight tolerance of a specific target value for a demonstration.",
        objective: "Use the Collision scenario's Mass A and Ball A launch speed controls to produce a momentum for Ball A within 5 kg·m/s of 40 kg·m/s.",
        constraints: [{ id: "c1", label: "Land within 5 kg·m/s of 40 kg·m/s for Ball A alone, before the collision." }],
        tools: [
          { id: "mass-a-slider", label: "Mass A slider (1–120 kg)" },
          { id: "speed-a-slider", label: "Ball A launch speed slider (0.5–10 m/s)" },
          { id: "momentum-readout", label: "Live momentum A readout" },
        ],
        answer: { mode: "numeric", unit: "kg·m/s", target: 40, tolerance: 5 },
        explanation:
          "Momentum is p = mv, so any mass/speed pair whose product is close to 40 works — for example, 8 kg at 5 m/s, or 4 kg at 10 m/s. There's no single right answer; the relationship is what matters.",
        hints: [
          "Momentum is p = mv — you need Mass A × launch speed to come out near 40.",
          "Try a mass and speed whose product is close to 40, e.g. 8 × 5 or 4 × 10.",
        ],
      },
      {
        id: "physics-momentum-challenge-004",
        title: "Real-World Mission: Design a Safe Collision",
        scenario:
          "You're designing a collision demonstration for a science exhibit. Two carts approach each other on the Collision scenario, and the exhibit's goal is for the resulting motion after the collision to be gentle and controlled — the combined system should end up moving no faster than a small target speed, regardless of restitution.",
        objective:
          "Use the Collision scenario's Mass A, Mass B, and Ball A launch speed to keep the total momentum's magnitude (and therefore any resulting shared velocity if they stick) within a safe target.",
        constraints: [{ id: "c1", label: "Keep total momentum's magnitude within 8 kg·m/s of a 24 kg·m/s target." }],
        tools: [
          { id: "mass-a-slider", label: "Mass A slider (1–120 kg)" },
          { id: "mass-b-slider", label: "Mass B slider (1–120 kg)" },
          { id: "speed-a-slider", label: "Ball A launch speed slider (0.5–10 m/s)" },
          { id: "restitution-slider", label: "Restitution slider (0–1)" },
          { id: "total-momentum-readout", label: "Live total momentum readout" },
        ],
        answer: { mode: "numeric", unit: "kg·m/s", target: 24, tolerance: 8 },
        explanation:
          "Since Ball B starts at rest in this scenario, total momentum before the collision is entirely Mass A × Ball A's launch speed — restitution doesn't affect that total at all, only how much kinetic energy survives the impact. A safe design keeps Mass A × speed close to the 24 kg·m/s target, for example 6 kg at 4 m/s, or 4 kg at 6 m/s.",
        hints: [
          "Total momentum before the collision comes entirely from Ball A, since Ball B starts at rest — Mass A × launch speed.",
          "Restitution controls energy loss during the collision, not the total momentum, so you don't need to worry about it for this target.",
          "Pick a Mass A and launch speed whose product is close to 24, e.g. 6 × 4 or 4 × 6.",
        ],
      },
    ],
  },

  relatedTopics: [],
};

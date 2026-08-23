import type { TopicContent } from "../types";

/**
 * Newton's Laws — the third stop in the Physics Foundations sequence
 * (Motion -> Velocity -> Acceleration -> Forces -> Newton's Laws ->
 * Energy), and the first "Newtonian Mechanics" topic to reach the
 * full Golden Learning Experience (Learn, Predict, Explore, Explain,
 * Practice, Challenge). Uses the same `NewtonsLaws` simulation
 * (`Newton's Laws Lab`) as its Explore experience, and now owns a
 * dedicated question bank (`physics-newtons-laws-quiz.ts`) instead of
 * sharing `physics-newtonian-mechanics-quiz.ts` with Simple Forces
 * and Simple Energy — those two topics still point at the shared
 * quiz via `QuizCta` on their own pages until they're upgraded.
 *
 * All Predict/Explain/Challenge content below is grounded in the
 * lab's real controls: Law 1/2 share a cart rig (mass, max push
 * force, friction on/off, surface presets ice/wood/rubber, object
 * presets box/crate/sled, live readouts for force/acceleration/
 * velocity/momentum); Law 3 has five scenarios (skaters, rocket,
 * balloon, collision, spring launch), each an isolated
 * action-reaction demonstration built on the shared 2D physics
 * engine.
 */

/** Two blocks with equal-length, opposite-direction force arrows —
 *  the single idea every Law 3 scenario in the lab demonstrates:
 *  action and reaction are equal in size, opposite in direction, and
 *  act on two different objects (so they never cancel each other). */
const actionReactionSketch = (
  <svg viewBox="0 0 260 140" className="mx-auto h-32 w-full max-w-xs" role="img" aria-labelledby="action-reaction-title">
    <title id="action-reaction-title">
      Two blocks pushing apart: the force each exerts on the other is equal in size and opposite in direction.
    </title>
    <rect x="30" y="55" width="46" height="34" rx="4" className="fill-subject-physics/25 stroke-subject-physics" strokeWidth="1.5" />
    <rect x="184" y="55" width="46" height="34" rx="4" className="fill-ink/15 stroke-ink/50 dark:fill-bone/15 dark:stroke-bone/50" strokeWidth="1.5" />
    <text x="53" y="76" textAnchor="middle" className="fill-ink font-mono text-[10px] font-semibold dark:fill-bone">A</text>
    <text x="207" y="76" textAnchor="middle" className="fill-ink font-mono text-[10px] font-semibold dark:fill-bone">B</text>
    <line x1="118" y1="72" x2="80" y2="72" strokeWidth="2.5" className="stroke-subject-physics" markerEnd="url(#arrowLeft)" />
    <line x1="142" y1="72" x2="180" y2="72" strokeWidth="2.5" className="stroke-ink/70 dark:stroke-bone/70" markerEnd="url(#arrowRight)" />
    <text x="130" y="40" textAnchor="middle" className="fill-ink-soft font-mono text-[10px] dark:fill-bone-soft">equal size</text>
    <text x="130" y="112" textAnchor="middle" className="fill-ink-soft font-mono text-[10px] dark:fill-bone-soft">opposite direction</text>
    <defs>
      <marker id="arrowLeft" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
        <path d="M8,0 L0,4 L8,8 Z" className="fill-subject-physics" />
      </marker>
      <marker id="arrowRight" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 Z" className="fill-ink/70 dark:fill-bone/70" />
      </marker>
    </defs>
  </svg>
);

export const physicsNewtonsLawsContent: TopicContent = {
  subjectSlug: "physics",
  topicSlug: "newtons-laws",
  title: "Newton's Laws of Motion",
  subjectLabel: "Physics",
  topicLabel: "Newtonian Mechanics",
  colorToken: "physics",
  simulationHref: "/dashboard/physics/newtons-laws",

  // -------------------------------------------------------------
  // LEARN — what am I learning?
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "State Newton's three laws of motion in your own words.",
      "Explain why an object at rest stays at rest unless a force acts on it.",
      "Use F = ma to relate force, mass, and acceleration.",
      "Recognize action-reaction pairs and explain why they don't cancel each other out.",
      "Distinguish static friction (resists motion starting) from kinetic friction (opposes motion already happening).",
    ],
    concepts: [
      {
        term: "Newton's First Law — Inertia",
        explanation:
          "An object at rest stays at rest, and an object in motion stays in motion at a constant velocity, unless acted on by a net force. This resistance to a change in motion is called inertia.",
      },
      {
        term: "Newton's Second Law",
        explanation:
          "The acceleration of an object is directly proportional to the net force acting on it, and inversely proportional to its mass.",
        formula: "F = ma",
        formulaCaption: "F = net force, m = mass, a = acceleration",
      },
      {
        term: "Newton's Third Law — Action-Reaction",
        explanation:
          "For every action force, there's a reaction force equal in size and opposite in direction, acting on a different object. They don't cancel out because they act on two separate things.",
      },
      {
        term: "Mass vs. weight",
        explanation:
          "Mass is how much matter an object has and stays constant everywhere. Weight is the force of gravity on that mass, and changes depending on where the object is.",
      },
      {
        term: "Static vs. kinetic friction",
        explanation:
          "Static friction resists a force trying to start an object moving, growing to match the push up to a maximum. Kinetic friction takes over once the object is actually sliding, opposing its motion at a roughly constant strength. That's why a gentle push on a heavy crate can produce nothing at all — static friction is matching it exactly, right up until the push finally exceeds its limit.",
      },
    ],
    whyItMatters:
      "Newton's laws aren't just physics-class trivia — they're the reason seatbelts exist (inertia keeps your body moving forward in a crash), why a loaded truck accelerates slower than an empty one at the same engine power (F = ma), and how rockets can push themselves forward in the vacuum of space with nothing to push against but their own exhaust (action-reaction). These three laws are the foundation nearly all of classical mechanics — and modern engineering — is built on.",
    keyTerms: [
      { term: "Inertia", definition: "An object's resistance to a change in its velocity — bigger mass means more inertia." },
      { term: "Net force", definition: "The overall push or pull left over after every individual force on an object is combined." },
      { term: "Momentum", definition: "An object's mass times its velocity — what an action-reaction pair of forces exchanges between two objects." },
      { term: "Action-reaction pair", definition: "Two equal-and-opposite forces, one on each of two different objects, that always occur together." },
      { term: "Free-body diagram", definition: "A simplified sketch of one object showing every force acting on it as an arrow, with nothing else drawn." },
    ],
    visualAids: [
      {
        id: "action-reaction-sketch",
        caption:
          "Whenever object A pushes on object B, B pushes back on A with the same size force in the opposite direction — always on two different objects, never cancelling.",
        visual: actionReactionSketch,
      },
    ],
    misconceptions: [
      {
        id: "misconception-action-reaction-cancels",
        misconception: "Action and reaction forces cancel each other out, so nothing should ever move.",
        correction:
          "They can't cancel — they act on two different objects. A force only cancels another force that acts on the same object. In the Skaters scenario below, the push on Skater A and the push on Skater B are equal and opposite, but each skater only feels the one force acting on them, which is exactly what sends both of them moving.",
      },
      {
        id: "misconception-constant-force-constant-velocity",
        misconception: "A constant force keeps an object moving at a constant velocity.",
        correction:
          "A constant net force produces a constant acceleration, not a constant velocity — the velocity keeps climbing the entire time the force is applied, as F = ma predicts. A constant velocity is exactly what happens when the net force is zero (Law 1), the opposite situation.",
      },
      {
        id: "misconception-bigger-object-hits-harder",
        misconception: "In a collision, the bigger or faster object exerts more force on the smaller one than the smaller one exerts back.",
        correction:
          "Newton's Third Law says the two forces in any interaction are always exactly equal in size, regardless of size, speed, or mass — a truck and a bicycle exert the same-sized force on each other in a collision. What differs is the resulting acceleration: F = ma means the same force produces a much larger acceleration on the lighter object.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT — what should I predict?
  // -------------------------------------------------------------
  predict: {
    intro:
      "Commit to a prediction before you touch the controls below — you'll only be able to run each experiment after locking in an answer for each scenario.",
    scenarios: [
      {
        id: "physics-newtons-laws-predict-001",
        scenario:
          "On the Law 1 tab, set the surface to Rubber mat (high friction) and the object to Steel sled (heavy), then apply only a very gentle push.",
        question: "What happens to the sled?",
        options: [
          { id: "moves-slowly", label: "It starts creeping forward slowly" },
          { id: "stays-still", label: "It doesn't move at all" },
          { id: "moves-then-stops", label: "It jumps forward, then stops" },
          { id: "moves-full-speed", label: "It accelerates as if there were no friction" },
        ],
        actualResultOptionId: "stays-still",
        explanation:
          "Static friction resists a force trying to start motion, matching it up to a maximum determined by the surface and the object's weight. A gentle push on a heavy sled with a high-friction surface stays well under that maximum, so static friction cancels it exactly and the sled doesn't move at all — until the push finally exceeds the limit.",
        hint: "Static friction doesn't just slow a push down — up to its maximum, it can match a push completely.",
      },
      {
        id: "physics-newtons-laws-predict-002",
        scenario:
          "On the Law 2 tab, apply a force to the cart and note the acceleration. Now double the applied force while keeping the mass the same.",
        question: "What happens to the acceleration?",
        options: [
          { id: "doubles", label: "It doubles" },
          { id: "halves", label: "It halves" },
          { id: "stays-same", label: "It stays the same" },
          { id: "quadruples", label: "It quadruples" },
        ],
        actualResultOptionId: "doubles",
        explanation:
          "F = ma means acceleration is directly proportional to net force when mass is fixed — doubling the force with the same mass exactly doubles the acceleration, no more and no less.",
        hint: "F = ma — with mass held fixed, how does acceleration scale with force?",
      },
      {
        id: "physics-newtons-laws-predict-003",
        scenario:
          "On the Law 3 tab, select the Skaters scenario, set Mass A and Mass B to the same value, and push them apart from rest.",
        question: "How do their resulting speeds compare?",
        options: [
          { id: "equal-speeds", label: "Exactly equal speeds, opposite directions" },
          { id: "a-faster", label: "Skater A moves faster" },
          { id: "b-faster", label: "Skater B moves faster" },
          { id: "no-motion", label: "Neither one moves" },
        ],
        actualResultOptionId: "equal-speeds",
        explanation:
          "The push applies equal-and-opposite momentum to each skater. With equal masses, equal momentum means equal speed — so they drift apart at exactly the same speed, just in opposite directions. (Try it again with very different masses to see this symmetry break.)",
        hint: "The push gives both skaters equal and opposite momentum, not equal and opposite speed — what does that mean when their masses are equal?",
      },
      {
        id: "physics-newtons-laws-predict-004",
        scenario:
          "On the Law 3 tab, select the Rocket scenario, turn friction as low as it will go, and switch thrust on continuously.",
        question: "What happens to the rocket's velocity while the thrust stays on?",
        options: [
          { id: "keeps-rising", label: "It keeps rising the entire time thrust is on" },
          { id: "reaches-max-then-flat", label: "It rises, then levels off at a maximum speed" },
          { id: "stays-constant", label: "It jumps to a constant speed immediately" },
          { id: "needs-air", label: "It doesn't move — rockets need air to push against" },
        ],
        actualResultOptionId: "keeps-rising",
        explanation:
          "With friction essentially eliminated, thrust is the only unbalanced force acting on the rocket — a constant force means a constant acceleration, so velocity keeps climbing for as long as thrust is applied, with no maximum. The rocket doesn't push against air or the ground at all; by Newton's Third Law it pushes against its own exhaust, and the exhaust pushes back.",
        hint: "With friction almost gone, what's left to stop a constant thrust from producing a constant acceleration?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE — the guided experiment
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Pick a Law tab — Law 1, Law 2, or Law 3 — each uses its own setup to isolate that law.",
      "For Law 1/2, drag either person toward the box to push it, and watch the live readouts (net force, acceleration, velocity) update.",
      "For Law 3, choose a scenario from the five available, set the sliders, then run the scenario's action.",
      'Try Learning Mode for guided "why does this happen?" walkthroughs.',
      "Try Challenge Mode to test your intuition before seeing the result.",
    ],
    tryThis: [
      "In Law 1, try applying a very small force to a heavy object on the Rubber mat surface — does it move right away, or does static friction resist it completely?",
      "In Law 2, double the mass while keeping the force the same. What happens to the acceleration?",
      "In Law 3, run the Skaters scenario with two very different masses. Do they end up moving at the same speed?",
      "In Law 3, compare the Collision scenario at restitution = 1 (elastic) versus restitution = 0 (inelastic) — momentum is conserved either way, but what changes?",
      "In Law 3, try the Spring launch scenario at low versus high compression — how does that change the size of the reaction force?",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN — why does this happen?
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "physics-newtons-laws-explain-001",
        question: "Why did a gentle push produce no motion at all on the high-friction surface, rather than just slow motion?",
        answer:
          "Static friction isn't a fixed drag — it grows to match whatever force is trying to start the object moving, up to a maximum set by the surface and the object's weight. A gentle push stays under that maximum, so static friction cancels it exactly, holding the object perfectly still rather than letting it creep. Only once the push exceeds the maximum does the object break free and kinetic friction take over.",
      },
      {
        id: "physics-newtons-laws-explain-002",
        question: "Why does doubling the force double the acceleration, but doubling the mass halves it?",
        answer:
          "F = ma rearranges to a = F / m: acceleration is directly proportional to force (double the force, double the top of the fraction, double the result) and inversely proportional to mass (double the mass, double the bottom of the fraction, halve the result). Force and acceleration move together; mass and acceleration move opposite each other.",
      },
      {
        id: "physics-newtons-laws-explain-003",
        question: "Why do equal-mass skaters end up moving at equal speeds, but unequal-mass skaters don't?",
        answer:
          "The push always applies equal-and-opposite momentum to the two skaters — that part never changes. But momentum is mass times velocity, so with unequal masses, the same momentum split translates into unequal speeds: the lighter skater has to move faster to carry the same amount of momentum the heavier skater carries at a slower speed. Equal masses is just the one special case where equal momentum happens to mean equal speed too.",
      },
      {
        id: "physics-newtons-laws-explain-004",
        question: "Why can a rocket accelerate in the vacuum of space, where there's no air or ground to push against?",
        answer:
          "A rocket doesn't need anything external to push against — by Newton's Third Law, it pushes its exhaust gas backward, and the exhaust pushes the rocket forward with an equal and opposite force. That action-reaction pair happens entirely between the rocket and its own exhaust, which is exactly why rockets work in the vacuum of space, where propellers and wheels (which do need something external to push against) don't.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE — can I solve a problem using this?
  // -------------------------------------------------------------
  practice: {
    // Foreign key into the quiz-engine registry — all questions live in
    // @/features/quiz-engine/data/physics-newtons-laws-quiz.ts, none
    // duplicated here. This topic now owns a dedicated bank rather
    // than sharing `physics-newtonian-mechanics` with Simple Forces
    // and Simple Energy (those two still link out via `QuizCta` until
    // they're upgraded to the full architecture).
    quizId: "physics-newtons-laws",
  },

  // -------------------------------------------------------------
  // CHALLENGE — realistic problems, some folding in the real-world mission
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. Some are worked out from reasoning alone; others ask you to use the lab above to check your answer. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "physics-newtons-laws-challenge-001",
        title: "Tug-of-War Stalemate",
        scenario:
          "Two evenly matched teams are locked in a tug-of-war. A referee notices the rope's center marker hasn't moved an inch in over a minute, even though both teams are clearly straining hard.",
        objective: "Determine what the referee can conclude about the net force on the rope.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "The net force on the rope is zero" },
            { id: "b", label: "One team must be pulling harder than the other" },
            { id: "c", label: "The net force is large but constant" },
            { id: "d", label: "No conclusion is possible without knowing each team's mass" },
          ],
          correctOptionId: "a",
        },
        explanation:
          "The marker staying perfectly still — no motion in either direction — is exactly Newton's First Law's signature of zero net force. Both teams can be pulling extremely hard; what matters is that their two forces are equal in size and opposite in direction, so they cancel to a net force of zero on the rope, the same rig as Law 1's balanced-force cart.",
        hints: [
          "A stalemate isn't 'no forces' — it's balanced forces.",
          "What net force value keeps something from moving at all, no matter how hard the individual forces pulling on it are?",
        ],
      },
      {
        id: "physics-newtons-laws-challenge-002",
        title: "Twice the Mass, Same Push",
        scenario:
          "On the Law 2 tab, a 4 kg cart is measured accelerating at 6 m/s² under a particular net force.",
        objective: "If the mass is doubled to 8 kg while the net force stays exactly the same, find the new acceleration.",
        requiresExperiment: true,
        tools: [
          { id: "mass-slider", label: "Mass slider (1–30 kg)" },
          { id: "accel-readout", label: "Live Acceleration readout" },
        ],
        answer: { mode: "numeric", unit: "m/s²", target: 3, tolerance: 0.3 },
        explanation:
          "F = ma rearranges to a = F/m. The net force didn't change, only the mass doubled, so the acceleration is cut exactly in half: 6 m/s² becomes 3 m/s². Try setting the mass slider to roughly double its starting value while holding your push steady on the Law 2 tab to see the acceleration readout drop by about half.",
        hints: [
          "Force stayed the same — only mass changed. What does F = ma say happens to acceleration when mass alone doubles?",
          "Acceleration and mass are inversely proportional: double one, halve the other.",
        ],
      },
      {
        id: "physics-newtons-laws-challenge-003",
        title: "Unequal Skaters",
        scenario:
          "On the Law 3 tab's Skaters scenario, Skater A is set much heavier than Skater B (for example, 100 kg versus 40 kg), and they push off from rest.",
        objective: "Use the lab to determine which skater ends up moving faster.",
        constraints: [
          { id: "c1", label: "Set Mass A noticeably higher than Mass B before pushing." },
        ],
        tools: [
          { id: "mass-a", label: "Mass A slider" },
          { id: "mass-b", label: "Mass B slider" },
          { id: "push", label: "Push button" },
        ],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Skater A (the heavier one) moves faster" },
            { id: "b", label: "Skater B (the lighter one) moves faster" },
            { id: "c", label: "They always move at exactly the same speed regardless of mass" },
            { id: "d", label: "Neither one moves — unequal masses cancel the push" },
          ],
          correctOptionId: "b",
        },
        explanation:
          "The push gives both skaters equal and opposite momentum, not equal and opposite speed. Since momentum is mass times velocity, the lighter skater (B) has to reach a higher speed than the heavier skater (A) to carry that same amount of momentum — the same action-reaction push, split unevenly by mass.",
        hints: [
          "The push is an equal-and-opposite momentum exchange, not an equal-and-opposite speed exchange.",
          "Momentum = mass × velocity. If momentum has to match but mass doesn't, what has to give?",
        ],
      },
      {
        id: "physics-newtons-laws-challenge-004",
        title: "Real-World Mission: Model Rocket Acceleration Test",
        scenario:
          "A model-rocketry club wants to estimate how quickly their 2 kg test rocket accelerates off the pad under a given thrust, before committing to a launch.",
        objective:
          "Use the Law 3 tab's Rocket scenario to set the Thrust slider to 30 N, switch thrust on, and read off the acceleration once it settles.",
        constraints: [
          { id: "c1", label: "Set Thrust to exactly 30 N before switching thrust on." },
        ],
        tools: [
          { id: "thrust-slider", label: "Thrust slider (1–50 N)" },
          { id: "accel-readout", label: "Rocket's live acceleration/velocity readout" },
        ],
        answer: { mode: "numeric", unit: "m/s²", target: 15, tolerance: 2 },
        explanation:
          "The rocket's mass is fixed at 2 kg with only a small amount of friction resisting it. With 30 N of thrust and only a fraction of a newton of opposing friction, the net force is close to 30 N, so F = ma gives an acceleration close to 30 N ÷ 2 kg = 15 m/s² — matching what the live readout shows once the burn is underway.",
        hints: [
          "The rocket's mass is fixed at 2 kg — this is a direct F = ma calculation once you know the (nearly unopposed) thrust.",
          "a = F/m. With F ≈ 30 N and m = 2 kg, what does that give you?",
        ],
      },
    ],
  },

  relatedTopics: [],
};

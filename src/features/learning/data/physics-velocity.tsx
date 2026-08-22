import type { TopicContent } from "../types";

/**
 * Velocity — the second stop in the Motion -> Velocity -> Acceleration
 * kinematics sequence (see `@/features/learning-path/data/physics-foundations`).
 * Reuses the existing Newton's Laws Lab simulation (`NewtonsLaws`) as its
 * Explore experience rather than introducing a new one: that lab's Law 1
 * (Inertia) tab is, mechanically, exactly a "keep velocity constant unless
 * a net force acts" demonstration, complete with a live velocity readout —
 * everything this topic needs already exists there. No new simulation
 * component or pattern is introduced; only new authored content flowing
 * through the same generic `TopicLearningExperience` that Simple Motion
 * (the reference implementation) already uses.
 */

/** A small velocity-time sketch contrasting a flat line (constant
 *  velocity, force balanced or absent) with a rising line (changing
 *  velocity, a net force present) — the single idea this topic's
 *  Explore step asks students to go find on the Law 1 and Law 2 tabs. */
const velocityTimeSketch = (
  <svg viewBox="0 0 260 160" className="mx-auto h-36 w-full max-w-xs" role="img" aria-labelledby="v-t-sketch-title">
    <title id="v-t-sketch-title">
      A velocity-time graph: a flat line means constant velocity, a rising line means velocity is changing.
    </title>
    <line x1="30" y1="140" x2="250" y2="140" strokeWidth="2" className="stroke-ink/25 dark:stroke-bone/25" />
    <line x1="30" y1="140" x2="30" y2="15" strokeWidth="2" className="stroke-ink/25 dark:stroke-bone/25" />
    <polyline points="30,90 250,90" fill="none" strokeWidth="2.5" className="stroke-subject-physics" />
    <polyline points="30,140 250,35" fill="none" strokeWidth="2.5" strokeDasharray="5,4" className="stroke-ink/60 dark:stroke-bone/60" />
    <text x="255" y="93" className="fill-ink font-mono text-[10px] dark:fill-bone">
      constant v
    </text>
    <text x="150" y="55" className="fill-ink font-mono text-[10px] dark:fill-bone">
      changing v
    </text>
    <text x="8" y="80" textAnchor="middle" className="fill-ink-soft font-mono text-[10px] dark:fill-bone-soft">
      v
    </text>
    <text x="140" y="155" textAnchor="middle" className="fill-ink-soft font-mono text-[10px] dark:fill-bone-soft">
      t
    </text>
  </svg>
);

export const physicsVelocityContent: TopicContent = {
  subjectSlug: "physics",
  topicSlug: "velocity",
  title: "Velocity",
  subjectLabel: "Physics",
  topicLabel: "Kinematics",
  colorToken: "physics",
  simulationHref: "/dashboard/physics/velocity",

  // -------------------------------------------------------------
  // LEARN — what am I learning?
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Define velocity as a rate of change of position, and explain how it differs from speed.",
      "State Newton's First Law in terms of velocity: an object in motion keeps that same velocity unless a net force acts on it.",
      "Predict whether an object's velocity will stay constant, increase, or decrease from the forces acting on it.",
      "Read a velocity-time graph and identify a flat line as constant velocity and a sloped line as changing velocity.",
      "Explain why friction, not the absence of force, is usually what brings a coasting object to a stop.",
    ],
    concepts: [
      {
        term: "Velocity",
        explanation:
          "How fast an object's position is changing, and in which direction. It's a close cousin of speed — the number on a speedometer — but velocity specifically tracks direction too, which is what lets two objects have the same speed but different velocities if they're moving different ways.",
      },
      {
        term: "Constant velocity needs zero net force",
        explanation:
          "Newton's First Law: when the forces on an object are balanced (or absent entirely), its velocity doesn't change at all — not slower, not faster, not a different direction. This is the default behavior of moving objects; it's a change in velocity that requires an explanation, not the other way around.",
        formula: "\\sum F = 0 \\implies v = \\text{constant}",
        formulaCaption: "Zero net force means unchanging velocity",
      },
      {
        term: "What actually changes velocity",
        explanation:
          "Any unbalanced (net) force changes velocity — speeding an object up, slowing it down, or turning it. In the lab below, an applied force pushes the cart's velocity up; friction, once the push stops, is itself an unbalanced force that pushes velocity back down toward zero.",
      },
      {
        term: "Reading a velocity-time graph",
        explanation:
          "A flat horizontal line means the object's velocity isn't changing — it's moving at a steady rate. A line that slopes upward means velocity is increasing over time; a line sloping back down toward zero means it's decreasing. The steepness of that slope is the object's acceleration, which is where this topic leads next.",
      },
    ],
    whyItMatters:
      "Velocity is the quantity cruise control holds steady, the number a speed limit actually caps (with an implied direction — 'the wrong way' on a one-way street is still 'speeding' in a sense the speed limit alone doesn't capture), and the thing that has to change before a car, a ball, or a planet's orbit can be described as accelerating at all. Understanding that velocity stays constant by default, and only changes when something pushes on it, is the entire content of Newton's First Law — one of the most quoted and least deeply understood ideas in physics.",
    keyTerms: [
      { term: "Velocity", definition: "The rate at which an object's position changes, including its direction." },
      { term: "Speed", definition: "How fast something is moving — the size of velocity, without direction." },
      { term: "Net force", definition: "The overall push or pull left over after every individual force on an object is combined." },
      { term: "Coasting", definition: "Moving with no applied force — velocity is then governed only by whatever forces (like friction) remain." },
    ],
    visualAids: [
      {
        id: "velocity-time-sketch",
        caption:
          "A flat line on a velocity-time graph means velocity isn't changing; a sloped line means it is. Watch for both shapes as you push and release the cart below.",
        visual: velocityTimeSketch,
      },
    ],
    misconceptions: [
      {
        id: "misconception-force-needed-to-keep-moving",
        misconception: "An object needs a constant push to keep moving — without one, it should slow down and stop.",
        correction:
          "That's true on a real, frictional surface, but friction is doing the stopping, not the absence of a push. With friction switched off in the lab below, a cart given one push keeps that exact velocity forever with no force applied at all — matching Newton's First Law, not everyday intuition built from friction-heavy experience.",
      },
      {
        id: "misconception-velocity-is-speed",
        misconception: "Velocity and speed mean the same thing.",
        correction:
          "Speed is just the size of velocity — how fast, with no direction attached. Velocity additionally tracks which way the object is moving. Two cars both traveling 60 km/h but in opposite directions have the same speed but different (in fact opposite) velocities.",
      },
      {
        id: "misconception-balanced-forces-mean-no-forces",
        misconception: "If an object's velocity isn't changing, no forces are acting on it at all.",
        correction:
          "Constant velocity means the forces are balanced, not absent. A cart coasting at a steady speed with friction on and a matching applied force still has both the applied force and friction acting on it — they just cancel out to a net force of zero, which is exactly what keeps the velocity constant.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT — what should I predict?
  // -------------------------------------------------------------
  predict: {
    intro:
      "Commit to a prediction before you touch the controls below — you'll only be able to run the cart after locking in an answer for each scenario.",
    scenarios: [
      {
        id: "physics-velocity-predict-001",
        scenario:
          "On the Law 1 (Inertia) tab, switch friction off, apply a force until the cart is moving, then remove the force.",
        question: "What happens to the cart's velocity after the force is removed?",
        options: [
          { id: "stays-same", label: "It stays exactly the same, forever" },
          { id: "slowly-drops", label: "It slowly drops back to zero" },
          { id: "instantly-zero", label: "It drops to zero instantly" },
          { id: "keeps-rising", label: "It keeps rising on its own" },
        ],
        actualResultOptionId: "stays-same",
        explanation:
          "With friction off, there's no force left acting on the cart once the applied force is removed. Newton's First Law says zero net force means unchanging velocity — so the cart coasts on forever at whatever velocity it had the instant the force stopped.",
        hint: "With friction off, what forces are left acting on the cart once the push stops?",
      },
      {
        id: "physics-velocity-predict-002",
        scenario: "Now switch friction back on, apply a force until the cart is moving at a steady speed, then remove the force.",
        question: "What happens to the cart's velocity this time?",
        options: [
          { id: "stays-same", label: "It stays exactly the same, forever" },
          { id: "gradually-slows", label: "It gradually slows down toward zero" },
          { id: "instantly-stops", label: "It stops the instant the force is removed" },
          { id: "reverses", label: "It reverses direction" },
        ],
        actualResultOptionId: "gradually-slows",
        explanation:
          "With friction on, removing the applied force leaves friction as the one remaining (unbalanced) force, and friction always opposes motion. That net force gradually reduces the cart's velocity, bringing it smoothly to a stop rather than instantly — a real coasting-to-a-stop, not a teleport to zero.",
        hint: "Friction doesn't disappear just because the applied force did — what does friction do to a moving object?",
      },
      {
        id: "physics-velocity-predict-003",
        scenario: "On the Law 2 (F = ma) tab, apply a constant force to the cart and watch the live Velocity graph as it plays out.",
        question: "While that constant force is applied, what shape does the velocity-time graph trace?",
        options: [
          { id: "flat", label: "A flat horizontal line" },
          { id: "straight-rising", label: "A straight line, rising steadily" },
          { id: "curving-rising", label: "A line that curves upward faster and faster" },
          { id: "spike-then-flat", label: "A sudden spike, then flat" },
        ],
        actualResultOptionId: "straight-rising",
        explanation:
          "A constant net force produces a constant acceleration, and a constant acceleration means velocity climbs by the same amount every second — a straight, steadily rising line, not a curve. (A flat line would mean the velocity isn't changing at all, which only happens when the net force is zero.)",
        hint: "A constant force produces a constant acceleration — what does a constant rate of change look like on a graph?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE — the guided experiment
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Open the Law 1 — Inertia tab and turn friction off, then apply a force until the cart is moving.",
      "Remove the force and watch the Live data panel's Velocity readout — it should hold perfectly steady.",
      "Turn friction back on, repeat the push, then remove the force again and watch velocity fall smoothly to zero instead.",
      "Switch to the Law 2 — F = ma tab, apply a constant force, and watch the Velocity graph trace a straight rising line while the force is on.",
      "Toggle the force on and off a few times and watch the Velocity graph's slope change — flat while the net force is zero, sloped while it isn't.",
    ],
    tryThis: [
      "With friction off, try a small push versus a large push. Does either one cause the velocity to keep changing on its own once you let go?",
      "Predict, before checking, whether a heavier cart coasts (friction off, no force) at the same steady velocity as a lighter one. Then test it.",
      "Find a friction setting where the applied force and friction force are equal — what does the Velocity graph do at that exact setting?",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN — why does this happen?
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "physics-velocity-explain-001",
        question: "Why does the cart coast forever at a constant velocity once friction is switched off and the force is removed?",
        answer:
          "With friction off and no applied force, the net force on the cart is exactly zero. Newton's First Law says an object's velocity doesn't change unless a net force acts on it — so with nothing left to change it, the cart's velocity simply stays whatever it was the instant the push ended.",
      },
      {
        id: "physics-velocity-explain-002",
        question: "Why does the cart slow down gradually, instead of stopping instantly, once friction is back on and the force is removed?",
        answer:
          "Friction is a force, and forces don't act instantaneously to erase velocity — they change it gradually, over time, the same way the applied force built the velocity up gradually in the first place. Friction just points the opposite way, so it steadily removes velocity instead of adding it, bringing the cart to a smooth stop rather than a sudden one.",
      },
      {
        id: "physics-velocity-explain-003",
        question: "Why does a constant applied force produce a straight rising line on the Velocity graph, rather than a curve?",
        answer:
          "A constant force (with friction fixed too) produces a constant acceleration — the same amount of speeding-up every second. Adding the same amount every second is exactly what draws a straight line; a curve would mean the rate of speeding-up was itself changing, which only happens if the net force changes.",
      },
      {
        id: "physics-velocity-explain-004",
        question: "Why is 'balanced forces' a more accurate description of constant velocity than 'no forces'?",
        answer:
          "A cart coasting at a steady speed with an applied force exactly matching friction has two real forces acting on it the whole time — they just add up to zero. Calling that state 'no forces' hides what's actually happening and makes it harder to predict what occurs if either force changes even slightly.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE — can I solve a problem using this?
  // -------------------------------------------------------------
  practice: {
    // Foreign key into the quiz-engine registry — all questions live in
    // @/features/quiz-engine/data/physics-velocity-quiz.ts, none duplicated here.
    quizId: "physics-velocity",
  },

  // -------------------------------------------------------------
  // CHALLENGE — realistic problems, some folding in the real-world mission
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. Some are worked out from reasoning alone; others ask you to use the lab above to check your answer. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "physics-velocity-challenge-001",
        title: "Elevator Cable Inspection",
        scenario:
          "A building inspector notes that a freight elevator moves between floors at a perfectly steady 1.5 m/s for the entire trip, except for a brief moment of speeding up at the very start and slowing down at the very end.",
        objective: "Determine what the inspector can conclude about the net force on the elevator during the steady 1.5 m/s portion of the trip.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "The net force is zero during that portion" },
            { id: "b", label: "The net force must equal the elevator's weight" },
            { id: "c", label: "The net force is constant but not zero" },
            { id: "d", label: "No conclusion about force is possible from speed alone" },
          ],
          correctOptionId: "a",
        },
        explanation:
          "A perfectly steady velocity — no speeding up, no slowing down — is exactly what Newton's First Law predicts when the net force is zero. The cable's pulling force during that portion must exactly balance gravity and any friction, not eliminate them.",
        hints: [
          "Constant velocity is the signature of one specific net-force value.",
          "Which net force value keeps velocity from changing at all?",
        ],
      },
      {
        id: "physics-velocity-challenge-002",
        title: "Diagnosing a Drifting Drone",
        scenario:
          "A delivery drone is supposed to hover in place (zero velocity) above a rooftop pad, but a technician notices it's slowly drifting sideways at a constant rate instead.",
        objective: "Determine what the constant sideways drift tells the technician about the forces on the drone.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "The sideways forces on the drone are balanced, just not at zero velocity" },
            { id: "b", label: "There must be no sideways forces on the drone at all" },
            { id: "c", label: "The drone's engines are malfunctioning and applying random forces" },
            { id: "d", label: "The drift proves the drone is accelerating sideways" },
          ],
          correctOptionId: "a",
        },
        explanation:
          "A constant drift velocity, even a nonzero one, still means the sideways forces are balanced — a steady crosswind, say, exactly matched by the drone's own sideways thrust. If the sideways forces were unbalanced, the drift speed would keep changing (accelerating), not stay constant.",
        hints: [
          "The key clue is that the drift is constant, not that it exists at all.",
          "What does Newton's First Law say happens to velocity when forces are balanced — even if that velocity isn't zero?",
        ],
      },
      {
        id: "physics-velocity-challenge-003",
        title: "Design the No-Force Coast",
        scenario:
          "For a physics demo, you need to show a cart holding a perfectly constant velocity of 4 m/s for a full 8 seconds with the applied force completely switched off the entire time.",
        objective: "Use the Law 1 tab above to find a friction setting that lets a coasting cart (force off) hold its velocity for that long, and read off the friction toggle state that made it work.",
        constraints: [
          { id: "c1", label: "The applied force must stay off for the whole 8 seconds." },
          { id: "c2", label: "Push the cart up to roughly 4 m/s first, before removing the force." },
        ],
        tools: [
          { id: "force-toggle", label: "Apply force / Remove force buttons" },
          { id: "friction-toggle", label: "Friction toggle (on/off)" },
        ],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Friction on" },
            { id: "b", label: "Friction off" },
          ],
          correctOptionId: "b",
        },
        explanation:
          "Only with friction off is the net force on a coasting (force-removed) cart truly zero — any friction at all is an unbalanced force that will erode the velocity over those 8 seconds, however slowly. This is the same result the Predict scenarios above already demonstrated, now applied as a design requirement.",
        hints: [
          "Think back to the very first Predict scenario in this topic — which setting kept velocity from ever changing?",
          "Friction is a force. Any force left acting alone on a coasting cart will change its velocity eventually.",
        ],
      },
      {
        id: "physics-velocity-challenge-004",
        title: "Real-World Mission: Stopping-Distance Budget",
        scenario:
          "A warehouse safety officer wants a conveyor cart, coasting at 3 m/s with the applied force removed and friction on, to travel at least 6 meters before it fully stops — enough room for a worker to step clear.",
        objective:
          "Use the lab's Law 1 tab to find a friction setting (try the surface dropdown) that lets a cart coasting from 3 m/s travel at least 6 meters before stopping, then read off which surface achieved it.",
        constraints: [
          { id: "c1", label: "Start the coast at roughly 3 m/s, with the applied force off." },
          { id: "c2", label: "Compare at least two different surface settings before deciding." },
        ],
        tools: [
          { id: "surface", label: "Surface dropdown (e.g. wood, ice, rubber)" },
          { id: "distance-readout", label: "Live data panel's Distance readout" },
        ],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "A low-friction surface (e.g. ice)" },
            { id: "b", label: "A high-friction surface (e.g. rubber)" },
            { id: "c", label: "Surface choice makes no difference to stopping distance" },
            { id: "d", label: "A heavier cart always stops in less distance regardless of surface" },
          ],
          correctOptionId: "a",
        },
        explanation:
          "Lower friction means a smaller unbalanced force acting on the coasting cart, which erodes its velocity more slowly and lets it travel farther before reaching zero — exactly the extra stopping room the safety officer needs. A high-friction surface would bring the cart to a stop over a much shorter distance, which is the opposite of the goal here.",
        hints: [
          "Friction is what removes velocity from a coasting object — how does more or less of it change how far that takes?",
          "Compare the Distance readout for the same starting speed on a low-friction versus high-friction surface.",
        ],
      },
    ],
  },

  relatedTopics: [],
};

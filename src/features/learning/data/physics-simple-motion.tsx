import type { TopicContent } from "../types";

/**
 * The reference implementation. This is the topic every other topic
 * should be brought up to match — every optional section the
 * architecture supports (Predict, Explain, Practice, Challenge) is
 * filled in here, on top of the required Learn and Explore. Nothing below is Simple-Motion-specific *machinery* — it's
 * all just data flowing through the same generic
 * `TopicLearningExperience` and section components every other topic
 * uses. `practice.quizId` points at the dedicated 35-question bank in
 * `@/features/quiz-engine/data/physics-simple-motion-quiz.ts`.
 */

/** A small "cover the one you want to find" formula triangle — the
 *  classic visual mnemonic for d = v × t. Built as plain inline SVG
 *  using the app's existing color tokens, so `LearnSection` (which
 *  only knows how to lay out a caption below a `ReactNode`) can stay
 *  completely generic while this stays fully self-contained. */
const speedDistanceTimeTriangle = (
  <svg viewBox="0 0 200 160" className="mx-auto h-36 w-36" role="img" aria-labelledby="dst-triangle-title">
    <title id="dst-triangle-title">
      Formula triangle: d is on top, v and t share the bottom row — cover the one you want to find.
    </title>
    <polygon points="100,10 10,150 190,150" fill="none" strokeWidth="2" className="stroke-ink/25 dark:stroke-bone/25" />
    <line x1="10" y1="80" x2="190" y2="80" strokeWidth="2" className="stroke-ink/25 dark:stroke-bone/25" />
    <line x1="100" y1="80" x2="100" y2="150" strokeWidth="2" className="stroke-ink/25 dark:stroke-bone/25" />
    <text x="100" y="58" textAnchor="middle" className="fill-ink font-display text-xl font-semibold dark:fill-bone">
      d
    </text>
    <text x="55" y="122" textAnchor="middle" className="fill-ink font-display text-xl font-semibold dark:fill-bone">
      v
    </text>
    <text x="145" y="122" textAnchor="middle" className="fill-ink font-display text-xl font-semibold dark:fill-bone">
      t
    </text>
  </svg>
);

export const physicsSimpleMotionContent: TopicContent = {
  subjectSlug: "physics",
  topicSlug: "simple-motion",
  title: "Simple Motion",
  subjectLabel: "Physics",
  topicLabel: "Kinematics",
  colorToken: "physics",
  simulationHref: "/dashboard/physics/simple-motion",

  // -------------------------------------------------------------
  // LEARN — what am I learning?
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "State the relationship between speed, distance, and time.",
      "Rearrange the speed formula to solve for distance or time instead.",
      "Predict how changing speed affects how long a fixed-distance trip takes.",
      "Read and interpret the units meters per second (m/s).",
      "Recognize when v = d/t does — and doesn't — apply to a real situation.",
    ],
    concepts: [
      {
        term: "Speed",
        explanation: "How fast an object covers distance — the distance traveled divided by the time it took.",
        formula: "v = \\dfrac{d}{t}",
        formulaCaption: "v = speed, d = distance, t = time",
      },
      {
        term: "Distance",
        explanation: "Rearranging the speed formula lets you find distance if you know speed and time instead.",
        formula: "d = v \\times t",
      },
      {
        term: "Time",
        explanation: "Or find time, if you know the distance and the speed.",
        formula: "t = \\dfrac{d}{v}",
      },
      {
        term: "Constant speed",
        explanation:
          "This simulation keeps speed steady throughout the trip — no speeding up or slowing down — which is what makes a single formula enough to describe the whole motion.",
      },
    ],
    whyItMatters:
      "This one relationship — speed equals distance over time — is behind everything from estimating your commute to calculating how long a road trip will take to figuring out a rocket's velocity. It's also the foundation every more advanced motion topic builds on: once an object's speed can change over time, that rate of change is acceleration, which is where kinematics goes next.",
    keyTerms: [
      { term: "Speed", definition: "A rate: how much distance is covered per unit of time." },
      { term: "Distance", definition: "A total amount: the full length of the path traveled." },
      { term: "Time", definition: "How long the motion lasted, from start to finish." },
      {
        term: "Average speed",
        definition:
          "Total distance divided by total time for a trip — not the same as averaging two different speeds directly.",
      },
    ],
    visualAids: [
      {
        id: "dst-triangle",
        caption: "Cover the quantity you want to find. What's left shows how to calculate it: d over v gives t, v times t gives d, d over t gives v.",
        visual: speedDistanceTimeTriangle,
      },
    ],
    misconceptions: [
      {
        id: "misconception-faster-always-less-time",
        misconception: "A faster speed always means less time, no matter what.",
        correction:
          "That's only true when distance stays fixed. If the distance also grows — say, a faster car also drives farther — the time could stay the same or even increase. The inverse relationship only holds when you're comparing trips over the same distance.",
      },
      {
        id: "misconception-speed-is-distance",
        misconception: "Speed and distance are basically the same thing, just measured differently.",
        correction:
          "They answer different questions. Distance answers 'how far?' — a fixed total. Speed answers 'how fast is that distance building up?' — a rate. Two trips can cover the same distance at completely different speeds.",
      },
      {
        id: "misconception-average-two-speeds",
        misconception: "To find average speed over a trip, just add the speeds used and divide by how many there were.",
        correction:
          "That trick only works if each speed was held for an equal amount of time. If a trip spends more time at one speed than another (which is common — slower speeds take longer to cover the same distance), simply averaging the speed values gives the wrong answer. The correct way is always total distance ÷ total time.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT — what should I predict?
  // -------------------------------------------------------------
  predict: {
    intro:
      "Before you touch the sliders, commit to an answer for each scenario below — you'll only be able to run the experiment after you've locked in a prediction.",
    scenarios: [
      {
        id: "physics-simple-motion-predict-001",
        scenario: "Set the simulation to Distance = 60 m, with Time as the unknown, and Speed at 5 m/s.",
        question: "If you then double the speed to 10 m/s, keeping distance at 60 m, what happens to the trip time?",
        options: [
          { id: "doubles", label: "It doubles" },
          { id: "same", label: "It stays the same" },
          { id: "halved", label: "It's cut in half" },
          { id: "quartered", label: "It's cut to a quarter" },
        ],
        actualResultOptionId: "halved",
        explanation:
          "Time = distance / speed. Doubling speed while distance stays fixed halves the time — the two are inversely proportional when distance is constant.",
        hint: "Start from t = d / v — which of the two, d or v, is changing here?",
      },
      {
        id: "physics-simple-motion-predict-002",
        scenario: "Set the simulation to Distance as the unknown, with Speed at 4 m/s and Time at 20 s.",
        question: "What distance will the simulation compute once the trip finishes?",
        options: [
          { id: "16", label: "16 m" },
          { id: "24", label: "24 m" },
          { id: "80", label: "80 m" },
          { id: "100", label: "100 m" },
        ],
        actualResultOptionId: "80",
        explanation: "d = v × t = 4 m/s × 20 s = 80 m.",
        hint: "Use d = v × t directly with the two numbers given.",
      },
      {
        id: "physics-simple-motion-predict-003",
        scenario: "Set the simulation to Speed as the unknown, with Distance = 40 m and Time fixed at 8 s.",
        question: "If you then increase the distance to 80 m, keeping time at 8 s, what happens to the required speed?",
        options: [
          { id: "doubles", label: "It doubles" },
          { id: "same", label: "It stays the same" },
          { id: "halved", label: "It's cut in half" },
          { id: "quartered", label: "It's cut to a quarter" },
        ],
        actualResultOptionId: "doubles",
        explanation:
          "With time fixed, v = d / t — doubling the distance while time stays the same means speed must also double to cover that distance in the same window.",
        hint: "This time it's distance changing, not speed — start from v = d / t.",
      },
      {
        id: "physics-simple-motion-predict-004",
        scenario:
          "Set up two runs on the simulation, both with Distance = 50 m and Time as the unknown: Run A at 10 m/s, Run B at 5 m/s.",
        question: "Which run finishes its trip first?",
        options: [
          { id: "a", label: "Run A" },
          { id: "b", label: "Run B" },
          { id: "same", label: "They finish at the same time" },
          { id: "unknown", label: "Cannot be determined" },
        ],
        actualResultOptionId: "a",
        explanation:
          "Same distance, higher speed — Run A covers the 50 m in 5 s, while Run B takes 10 s. A higher speed always means less time for the same distance.",
        hint: "Try solving t = d / v for each run separately, then compare.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE — what should I investigate?
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Choose which quantity is unknown — Speed, Distance, or Time — using the tabs above the simulation.",
      "Adjust the sliders for the two quantities that are still known.",
      "Watch the unknown value update live, solved from the other two.",
      "Press start and watch the car move — the trip should take exactly the time shown, and the unknown value 'fills in' as the car travels.",
    ],
    tryThis: [
      "Set Time as the unknown, then double the speed while keeping distance fixed — does the time also double, or does it do something else? Compare to your Predict answer above.",
      "Set Distance as the unknown, then double both speed and time together — what happens to the distance?",
      "Set Speed as the unknown, distance to 60 m and time to 10 s — press start, then check the reading against what a quick d/t calculation gives you.",
      "Pause the car halfway through a trip, wait a moment, then resume — does the final trip time change?",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN — why did this happen?
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "physics-simple-motion-explain-001",
        question: "Why does time go down when speed goes up, for the same distance?",
        answer:
          "Speed measures how much distance is covered per second. If each second now covers more ground, fewer seconds are needed to cover the same total distance — that's exactly what 'inversely proportional' means here.",
      },
      {
        id: "physics-simple-motion-explain-002",
        question: "Why does this simulation only work because the speed is constant?",
        answer:
          "v = d / t assumes one fixed speed for the whole trip. If the car sped up or slowed down partway through, a single speed value wouldn't describe the whole journey anymore — you'd need calculus (or an average speed, which hides the detail) to describe it instead.",
      },
      {
        id: "physics-simple-motion-explain-003",
        question: "Why does the unknown value stay hidden (shown as a dash or '?') until the car actually starts moving?",
        answer:
          "The simulation doesn't just hand you the solved answer up front — the unknown value is 'earned' as the trip plays out, growing in step with the car's progress and reaching the true number exactly when the car finishes. This mirrors how you'd actually measure motion in real life: you can't know how far something traveled in 10 seconds until those 10 seconds have actually passed.",
      },
      {
        id: "physics-simple-motion-explain-004",
        question: "Why doesn't pausing and resuming the simulation change the final distance or time reading?",
        answer:
          "The formula only cares about time spent actually moving at that constant speed — not real-world clock time. Pausing freezes the car without erasing any of the motion it already completed, so resuming just continues from where it left off, and the total still comes out the same.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE — can I solve a problem using this? (recall + reasoning)
  // -------------------------------------------------------------
  practice: {
    // Foreign key into the quiz-engine registry — see
    // `@/features/quiz-engine/data/physics-simple-motion-quiz.ts`.
    // All 35 questions live there; none are duplicated here.
    quizId: "physics-simple-motion",
  },

  // -------------------------------------------------------------
  // CHALLENGE — realistic problems, harder than Practice, some
  // requiring the simulation ("design a configuration that achieves a
  // target range" — this is where that spec example lives)
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice — some are worked out with reasoning alone, others ask you to use the simulation above to find a configuration that meets a goal. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "physics-simple-motion-challenge-001",
        title: "Race Day Pace Check",
        scenario:
          "A cyclist's coach recorded 45 km covered in 1.5 hours during a training ride and wants the average speed added to the training log.",
        objective: "Determine the cyclist's average speed in km/h.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "20 km/h" },
            { id: "b", label: "30 km/h" },
            { id: "c", label: "45 km/h" },
            { id: "d", label: "67.5 km/h" },
          ],
          correctOptionId: "b",
        },
        explanation: "v = d / t = 45 km / 1.5 h = 30 km/h.",
        hints: [
          "Start from v = d / t, the same formula from the simulation.",
          "Divide 45 by 1.5 directly — no unit conversion needed since both are already km and hours.",
        ],
      },
      {
        id: "physics-simple-motion-challenge-002",
        title: "Supply Drone Run",
        scenario: "A delivery drone travels at a constant 25 m/s. Dispatch needs to know how long a 1 km (1000 m) supply run will take.",
        objective: "Find the total flight time in seconds.",
        requiresExperiment: false,
        tools: [
          { id: "t1", label: "Known speed: 25 m/s" },
          { id: "t2", label: "Known distance: 1000 m (1 km)" },
        ],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "25 s" },
            { id: "b", label: "40 s" },
            { id: "c", label: "400 s" },
            { id: "d", label: "4 s" },
          ],
          correctOptionId: "b",
        },
        explanation: "t = d / v = 1000 m / 25 m/s = 40 s.",
        hints: [
          "Rearrange v = d / t to solve for t.",
          "Make sure both distance and speed are in meters/seconds before dividing — 1 km = 1000 m.",
        ],
      },
      {
        id: "physics-simple-motion-challenge-003",
        title: "Convoy Gap Check",
        scenario:
          "Two delivery vans leave the same warehouse at the same moment, heading in the same direction: Van A at 15 m/s, Van B at 25 m/s.",
        objective: "Determine how far apart the vans are after 10 seconds.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "10 m" },
            { id: "b", label: "100 m" },
            { id: "c", label: "150 m" },
            { id: "d", label: "250 m" },
          ],
          correctOptionId: "b",
        },
        explanation:
          "Each van's distance is v × t: 150 m and 250 m. The gap between them is the difference, 250 − 150 = 100 m.",
        hints: [
          "Find each van's distance separately using d = v × t.",
          "The question asks for the gap between them, not either van's own distance.",
        ],
      },
      {
        id: "physics-simple-motion-challenge-004",
        title: "Warehouse Robot: Will It Make It?",
        scenario:
          "A warehouse robot must travel 60 m down an aisle to reach a fallen package before a safety alarm resets in 10 seconds. Its motor is currently set to a constant 5 m/s.",
        objective: "Use the simulation above to find how long the robot's current 60 m trip actually takes, in seconds.",
        constraints: [{ id: "c1", label: "Keep the robot's speed at 5 m/s while checking this — don't change it yet." }],
        tools: [
          { id: "dist", label: "Distance slider (10–100 m) — set to 60" },
          { id: "speed", label: "Speed slider (1–10 m/s) — set to 5" },
          { id: "unknown", label: "Unknown selector — set to Time" },
        ],
        answer: { mode: "numeric", unit: "s", target: 12, tolerance: 0.5 },
        explanation:
          "t = d / v = 60 m ÷ 5 m/s = 12 s — two seconds past the 10-second window, so at 5 m/s the robot won't make it in time.",
        hints: [
          "This is t = d / v, the same relationship from the simulation.",
          "Set the simulation's distance to 60 m and speed to 5 m/s, with Time as the unknown, to read the answer directly.",
        ],
      },
      {
        id: "physics-simple-motion-challenge-005",
        title: "Design a Configuration That Makes the Deadline",
        scenario:
          "The robot from the previous challenge is too slow. Facilities wants to know the minimum constant speed that would get it to the package within the 10-second alarm window.",
        objective: "Find the minimum constant speed, in m/s, that covers 60 m within 10 seconds.",
        constraints: [
          { id: "c1", label: "Distance stays fixed at 60 m." },
          { id: "c2", label: "Trip time must be at most 10 s." },
          { id: "c3", label: "Speed must stay within the simulation's 1–10 m/s range." },
        ],
        tools: [
          { id: "dist", label: "Distance slider (10–100 m) — set to 60" },
          { id: "time", label: "Time slider (1–20 s) — set to 10" },
          { id: "unknown", label: "Unknown selector — set to Speed" },
        ],
        answer: { mode: "numeric", unit: "m/s", target: 6, tolerance: 0.3 },
        explanation:
          "v = d / t = 60 m ÷ 10 s = 6 m/s — the robot needs at least 6 m/s, an upgrade from its current 5 m/s, to reach the package before the alarm resets.",
        hints: [
          "This time you know distance and the target time, and need speed — use v = d / t.",
          "Set the simulation's distance to 60 m and time to 10 s, with Speed as the unknown, to check your answer directly.",
        ],
      },
    ],
  },

  relatedTopics: [],
};

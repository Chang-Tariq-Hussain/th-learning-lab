import type { TopicContent } from "../types";

/**
 * Projectile Motion — a "challenge topic" in the Physics Foundations
 * path (see `@/features/learning-path/data/physics-foundations`),
 * applying motion and forces together to a launched object. Uses the
 * existing `ProjectileMotion` simulation as its Explore experience —
 * the same lab whose own Explore/Learn/Challenge mode tabs and
 * built-in target challenges (`hit-50m`, `airtime-8s`,
 * `hit-target-100m`) this file's Predict and Challenge content is
 * deliberately built to match, so a student moving between this
 * page's Challenge section and the simulation's own Challenge mode
 * sees the same numbers, not two competing target lists.
 *
 * All content below is grounded in the lab's real physics
 * (`idealX`/`idealY`/`idealRange`/`idealMaxHeight`/`idealTimeOfFlight`
 * in `physics.ts`) and real controls (launch velocity 0–100 m/s,
 * launch angle 0–90°, four gravity presets, air resistance on/off,
 * mass 0.1–20 kg affecting only the energy readouts).
 */

/** A parabola sketch contrasting the symmetric ideal (no-drag) arc
 *  with a shorter, steeper-descending real (drag) arc — the single
 *  shape difference this topic's Explore step asks students to go
 *  find by toggling air resistance on and off. */
const trajectorySketch = (
  <svg viewBox="0 0 260 150" className="mx-auto h-36 w-full max-w-xs" role="img" aria-labelledby="trajectory-sketch-title">
    <title id="trajectory-sketch-title">
      Two arcs from the same launch point: a symmetric ideal parabola without air resistance, and a shorter, steeper-falling real arc with it.
    </title>
    <line x1="20" y1="130" x2="250" y2="130" strokeWidth="2" className="stroke-ink/25 dark:stroke-bone/25" />
    <path d="M 25 130 Q 135 20 245 130" fill="none" strokeWidth="2.5" strokeDasharray="5,4" className="stroke-ink/60 dark:stroke-bone/60" />
    <path d="M 25 130 Q 110 35 165 130" fill="none" strokeWidth="2.5" className="stroke-subject-physics" />
    <text x="245" y="120" textAnchor="end" className="fill-ink-soft font-mono text-[10px] dark:fill-bone-soft">ideal (no drag)</text>
    <text x="167" y="120" className="fill-ink font-mono text-[10px] dark:fill-bone">with drag</text>
  </svg>
);

export const physicsProjectileMotionContent: TopicContent = {
  subjectSlug: "physics",
  topicSlug: "projectile-motion",
  title: "Projectile Motion",
  subjectLabel: "Physics",
  topicLabel: "Kinematics",
  colorToken: "physics",
  simulationHref: "/dashboard/physics/projectile-motion",

  // -------------------------------------------------------------
  // LEARN — what am I learning?
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Explain why horizontal and vertical motion can be analyzed completely independently.",
      "Predict how changing launch angle and speed affects range, height, and time of flight.",
      "Calculate range, maximum height, and time of flight for an ideal (no-drag) projectile.",
      "Identify which launch angle maximizes range for a given speed, and why complementary angles share a range.",
      "Explain why air resistance shortens range and makes the descending half of the path steeper than the ascending half.",
    ],
    concepts: [
      {
        term: "Independence of horizontal and vertical motion",
        explanation:
          "Gravity only ever acts vertically. That means horizontal velocity stays constant throughout the flight, while vertical velocity changes at a constant rate — the two directions never affect each other.",
      },
      {
        term: "Range",
        explanation: "How far the projectile travels horizontally before landing back at launch height.",
        formula: "R = \\dfrac{v^2 \\sin(2\\theta)}{g}",
        formulaCaption: "v = launch speed, θ = launch angle, g = gravity",
      },
      {
        term: "Maximum height",
        explanation: "The highest point the projectile reaches, determined entirely by the vertical component of its launch velocity.",
        formula: "h_{max} = \\dfrac{v^2 \\sin^2(\\theta)}{2g}",
      },
      {
        term: "Time of flight",
        explanation: "How long the projectile stays in the air before returning to launch height.",
        formula: "t = \\dfrac{2 v \\sin(\\theta)}{g}",
      },
      {
        term: "Air resistance",
        explanation:
          "Real projectiles lose energy to drag, which shortens range, lowers the peak, and makes the descending half of the path steeper than the ascending half — unlike the perfectly symmetric ideal parabola.",
      },
    ],
    whyItMatters:
      "Projectile motion isn't just a textbook idea — it's how engineers design everything from basketball shots to artillery trajectories to the arc of water from a fountain. The key insight, that horizontal and vertical motion can be split apart and solved separately, is one of the most reused problem-solving techniques in all of physics, showing up again later in orbital mechanics and even electromagnetism.",
    keyTerms: [
      { term: "Trajectory", definition: "The curved path a projectile traces through the air from launch to landing." },
      { term: "Launch angle", definition: "The angle above the horizontal at which a projectile is launched." },
      { term: "Complementary angles", definition: "Two angles that add up to 90° (like 30° and 60°) — for the same speed, they produce the same range." },
      { term: "Apex", definition: "The highest point of a projectile's trajectory, where its vertical velocity is momentarily zero." },
      { term: "Drag", definition: "Air resistance opposing a projectile's motion, growing with the square of its speed in this lab's model." },
    ],
    visualAids: [
      {
        id: "trajectory-sketch",
        caption:
          "Without air resistance, the rise and fall are mirror images of each other. With it, the projectile falls short and drops more steeply on the way down than it climbed on the way up.",
        visual: trajectorySketch,
      },
    ],
    misconceptions: [
      {
        id: "misconception-zero-velocity-at-apex",
        misconception: "A projectile's velocity is zero at the highest point of its arc.",
        correction:
          "Only the vertical component of velocity is zero at the apex — that's what makes it the highest point. The horizontal component keeps its launch value the whole flight (gravity never touches it), so the projectile is still moving horizontally, just not rising or falling, for an instant.",
      },
      {
        id: "misconception-mass-affects-trajectory",
        misconception: "A heavier projectile falls faster and lands sooner than a lighter one launched the same way.",
        correction:
          "With air resistance off, mass cancels out of the equations of motion entirely — gravity accelerates every mass identically, so two projectiles launched with the same speed and angle follow the exact same trajectory regardless of mass. Mass only matters here for the energy readouts, not the flight path.",
      },
      {
        id: "misconception-45-always-best",
        misconception: "A 45° launch angle always gives the longest range, no matter what.",
        correction:
          "45° maximizes range only when launch and landing height are equal, which is what this lab's ideal formulas assume. It's also not the only angle that reaches a given range — any pair of complementary angles (like 30° and 60°) that add up to 90° share the exact same range at a fixed speed, just with very different flight times and heights.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT — what should I predict?
  // -------------------------------------------------------------
  predict: {
    intro:
      "Commit to a prediction before you touch the controls below — you'll only be able to launch after locking in an answer for each scenario.",
    scenarios: [
      {
        id: "physics-projectile-motion-predict-001",
        scenario: "Launch at 40 m/s and 30°, note the range, then launch again at 40 m/s and 60°.",
        question: "How does the 60° range compare to the 30° range?",
        options: [
          { id: "same", label: "It's the same range" },
          { id: "farther", label: "It's noticeably farther" },
          { id: "shorter", label: "It's noticeably shorter" },
          { id: "zero", label: "It barely leaves the ground" },
        ],
        actualResultOptionId: "same",
        explanation:
          "30° and 60° are complementary angles (they add up to 90°), and R = v²sin(2θ)/g gives the same value for any pair of complementary angles at a fixed speed — sin(60°) and sin(120°) are equal. The two trajectories look very different (one low and flat, one high and arcing) but land in the same spot.",
        hint: "R = v²sin(2θ)/g — what do sin(60°) and sin(120°) have in common?",
      },
      {
        id: "physics-projectile-motion-predict-002",
        scenario: "Launch at 25 m/s and 45°, note the range, then double the launch velocity to 50 m/s at the same 45° angle.",
        question: "How does the new range compare to the original?",
        options: [
          { id: "quadruples", label: "It's about 4 times as far" },
          { id: "doubles", label: "It's about 2 times as far" },
          { id: "same", label: "It stays the same" },
          { id: "triples", label: "It's about 3 times as far" },
        ],
        actualResultOptionId: "quadruples",
        explanation:
          "Range depends on velocity squared (R = v²sin(2θ)/g), not velocity directly. Doubling v multiplies v² by four, so the range roughly quadruples rather than just doubling.",
        hint: "Range depends on v², not v — what happens to a squared term when you double the thing being squared?",
      },
      {
        id: "physics-projectile-motion-predict-003",
        scenario: "Launch at 25 m/s and 45° on Earth gravity, note the height and range, then switch gravity to the Moon preset with the same speed and angle.",
        question: "What happens to the maximum height and range on the Moon?",
        options: [
          { id: "both-increase", label: "Both increase substantially" },
          { id: "both-decrease", label: "Both decrease substantially" },
          { id: "height-only", label: "Height increases, range stays the same" },
          { id: "no-change", label: "Neither changes — gravity doesn't affect trajectory shape" },
        ],
        actualResultOptionId: "both-increase",
        explanation:
          "Moon gravity is about 1/6th of Earth's, and both h_max = v²sin²(θ)/2g and R = v²sin(2θ)/g have gravity in the denominator — a smaller g means a larger height and a larger range, roughly six times each for the same launch conditions.",
        hint: "Gravity is in the denominator of both the height and range formulas — what happens to a fraction when its denominator shrinks?",
      },
      {
        id: "physics-projectile-motion-predict-004",
        scenario: "Launch at 40 m/s and 45° with air resistance off, note the trajectory shape, then launch the same way with air resistance on.",
        question: "How does turning air resistance on change the trajectory?",
        options: [
          { id: "shorter-steeper", label: "Shorter range, and the descent is steeper than the climb" },
          { id: "longer", label: "Longer range than the ideal case" },
          { id: "identical", label: "The trajectory looks identical either way" },
          { id: "symmetric-shorter", label: "Shorter range, but still a perfectly symmetric arc" },
        ],
        actualResultOptionId: "shorter-steeper",
        explanation:
          "Drag continuously removes energy from the projectile throughout the flight, so it never quite reaches the ideal (no-drag) height or distance. It also breaks the ideal case's up-down symmetry: by the time the projectile is falling, it's lost speed to drag on the way up, so the descending half of the path is steeper and quicker than the climb.",
        hint: "Drag removes energy the whole flight, not just at one instant — how would that change the up-half versus the down-half of the arc?",
      },
      {
        id: "physics-projectile-motion-predict-005",
        scenario:
          "Launch at 30 m/s and 15°, note the time of flight, then launch again at 30 m/s and 75° — the complementary angle, which you already know lands at the same range.",
        question: "How does the 75° time of flight compare to the 15° time of flight?",
        options: [
          { id: "much-longer", label: "It's much longer, even though the range is identical" },
          { id: "same", label: "It's exactly the same, since the range is identical" },
          { id: "shorter", label: "It's shorter" },
          { id: "zero", label: "The projectile never lands" },
        ],
        actualResultOptionId: "much-longer",
        explanation:
          "Range only depends on sin(2θ), so complementary angles share it — but time of flight depends on sin(θ) alone (t = 2v·sinθ/g), which is very different for 15° and 75°. The high, arcing 75° shot spends far longer in the air than the low, flat 15° shot, even though gravity, speed, and landing spot are all identical. (This is the same relationship a launch height would change, too — anything that stretches the vertical part of the flight stretches time of flight, independent of range.)",
        hint: "Range and time of flight depend on different things — range uses sin(2θ), time of flight uses sin(θ) alone. Complementary angles matching one doesn't mean they match the other.",
      },
      {
        id: "physics-projectile-motion-predict-006",
        scenario: "Launch at any speed and angle, and watch the live Vertical velocity readout as the projectile passes through the highest point of its arc.",
        question: "What does the vertical velocity readout show at that exact instant?",
        options: [
          { id: "zero", label: "0 m/s" },
          { id: "max", label: "Its maximum value for the whole flight" },
          { id: "equal-horizontal", label: "Exactly equal to the horizontal velocity" },
          { id: "negative-max", label: "Its most negative value" },
        ],
        actualResultOptionId: "zero",
        explanation:
          "The highest point of the trajectory is defined by the vertical velocity crossing from positive (still rising) to negative (starting to fall) — the one instant in between is exactly 0 m/s. The horizontal velocity readout, meanwhile, doesn't change at all through this moment — it's the same before, during, and after the apex.",
        hint: "The apex is the moment the projectile stops rising and starts falling — what value does vertical velocity have to pass through to switch from positive to negative?",
      },
    ],
  },
  explore: {
    howToUse: [
      "Set a launch speed and angle on the Explore tab, then fire the projectile and watch the path trace out.",
      "Toggle the ideal (no-drag) trajectory on to compare it against the real one.",
      "Try 30°, 45°, and 60° at the same speed — watch how range and height trade off.",
      "Turn on air resistance and see how the path changes shape.",
      "Switch to the Learn tab for guided what-if questions, or the Challenge tab to try hitting a target.",
      "Read the range, max height, and time-of-flight readouts after each launch.",
    ],
    tryThis: [
      "Find the launch angle that gives the maximum range at a fixed speed. Is it what you expected?",
      "Compare 30° and 60° at the same speed — their ranges should be identical. Can you see why from the formula?",
      "Turn on air resistance and launch at 45°. Does the projectile land short of, or beyond, where the ideal parabola predicts?",
      "Switch gravity to the Moon preset and relaunch the same speed and angle — how much farther and higher does it go?",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN — why does this happen?
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "physics-projectile-motion-explain-000a",
        question: "Why is a projectile's trajectory curved instead of a straight line?",
        answer:
          "Horizontal motion continues at a steady pace with nothing acting to change it, while gravity continuously accelerates the projectile downward the entire flight. A straight line would need both directions to behave the same way — instead, one stays constant and the other keeps bending downward faster and faster, and the combination of 'steady sideways drift' with 'accelerating downward pull' is exactly what traces out a curve rather than a line.",
      },
      {
        id: "physics-projectile-motion-explain-000b",
        question: "Why does the projectile keep moving horizontally the whole flight, instead of slowing down like it does vertically?",
        answer:
          "Gravity is a purely vertical force — it never has any horizontal component to push against horizontal motion. With nothing opposing it (no air resistance in the ideal case), horizontal velocity has no reason to change at all, so it holds its launch value from the first instant to the last.",
      },
      {
        id: "physics-projectile-motion-explain-000c",
        question: "Why does the projectile reach a maximum height at all, instead of continuing to rise?",
        answer:
          "Gravity is constantly working against the upward part of the launch velocity, shrinking it a little more every instant. Eventually that vertical velocity is worn all the way down to zero — the instant it does, the projectile has stopped rising and is about to start falling, which is exactly what 'maximum height' means. After that instant, gravity keeps acting the same way it always has, just now building speed in the downward direction instead.",
      },
      {
        id: "physics-projectile-motion-explain-000d",
        question: "Why does changing the launch angle affect the trajectory at all, if the launch speed stays the same?",
        answer:
          "A single launch speed splits into a horizontal share and a vertical share depending on the angle — a low angle puts most of the speed into the horizontal direction, a high angle puts most of it into the vertical direction. Since range comes from the horizontal share and height comes from the vertical share, changing the angle without changing the total speed just trades one for the other, reshaping the whole arc.",
      },
      {
        id: "physics-projectile-motion-explain-001",
        question: "Why do 30° and 60° launches at the same speed land at the same distance, even though they look completely different in the air?",
        answer:
          "Range depends on sin(2θ), and sin(2×30°) = sin(60°) equals sin(2×60°) = sin(120°) — two different angles can produce the same sine value. The 30° launch is fast and flat with a short flight time, while the 60° launch is slower-covering-ground but stays airborne much longer and reaches greater height; those differences exactly offset, leaving the range identical.",
      },
      {
        id: "physics-projectile-motion-explain-002",
        question: "Why does doubling the launch velocity roughly quadruple the range instead of just doubling it?",
        answer:
          "Range's formula has velocity squared in it (R = v²sin(2θ)/g), not velocity by itself. Squaring a doubled quantity multiplies it by four (2² = 4), which is exactly what shows up in the range — this is why velocity has such an outsized effect on range compared to angle.",
      },
      {
        id: "physics-projectile-motion-explain-003",
        question: "Why does lower gravity (like on the Moon) increase both the maximum height and the range for the same launch?",
        answer:
          "Gravity sits in the denominator of both the height and range formulas — it's the thing constantly pulling the projectile back down and cutting its flight short. A weaker gravity means a weaker pull, so the projectile keeps climbing longer before gravity turns it around, and keeps traveling longer before gravity brings it back to the ground — both height and range grow as a result.",
      },
      {
        id: "physics-projectile-motion-explain-004",
        question: "Why does air resistance make the descending half of the trajectory steeper than the ascending half, instead of just shortening the whole arc evenly?",
        answer:
          "Drag continuously removes kinetic energy for the entire flight, not just at one point — so by the time the projectile reaches its peak, it's already slower (and has traveled less far) than the ideal case predicts. On the way down, it keeps losing horizontal speed to drag while gravity keeps adding vertical speed, so the fall becomes steeper and more vertical than the climb was, breaking the ideal parabola's mirror symmetry.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE — can I solve a problem using this?
  // -------------------------------------------------------------
  practice: {
    // Foreign key into the quiz-engine registry — all questions live
    // in @/features/quiz-engine/data/physics-projectile-motion-quiz.ts,
    // none duplicated here.
    quizId: "physics-projectile-motion",
  },

  // -------------------------------------------------------------
  // CHALLENGE — realistic problems, some folding in the real-world mission
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice — the first three match the targets built into the simulation's own Challenge tab, so you can cross-check your answer there. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "physics-projectile-motion-challenge-001",
        title: "Complementary Angle Pairs",
        scenario:
          "An artillery instructor tells a trainee that a shell fired at 25° will land in the same spot as one fired at a different, specific angle, using the exact same launch speed.",
        objective: "Determine which other launch angle lands at the same range as 25°.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "65°" },
            { id: "b", label: "45°" },
            { id: "c", label: "50°" },
            { id: "d", label: "75°" },
          ],
          correctOptionId: "a",
        },
        explanation:
          "Complementary angles — pairs that add up to 90° — always share the same range at a fixed speed, since R = v²sin(2θ)/g gives the same value for θ and (90° − θ). 25° and 65° add up to exactly 90°, so they land at the same distance despite very different flight paths.",
        hints: [
          "Range depends on sin(2θ). Which other angle gives the same sin(2θ) as 25°?",
          "Look for the angle that adds up to 90° with 25°.",
        ],
      },
      {
        id: "physics-projectile-motion-challenge-002",
        title: "Reach Exactly 50 m",
        scenario: "A field-goal kicking coach wants a ball to land as close to 50 meters downfield as possible.",
        objective: "Use the Challenge tab's launch velocity and angle controls to land the projectile within 2 m of a 50 m range.",
        constraints: [{ id: "c1", label: "Land within 2 meters of the 50 m mark." }],
        tools: [
          { id: "velocity-slider", label: "Launch velocity slider (0–100 m/s)" },
          { id: "angle-slider", label: "Launch angle slider (0–90°)" },
          { id: "range-readout", label: "Live Range readout" },
        ],
        answer: { mode: "numeric", unit: "m", target: 50, tolerance: 2 },
        explanation:
          "45° is the most efficient angle to try first since it maximizes range for a given speed — from there, fine-tune the velocity up or down until the Range readout lands within 2 m of 50. This mirrors the simulation's own 'Reach exactly 50 m' Challenge-tab target exactly, so your answer there should match.",
        hints: [
          "Start near 45° — it gets the most range out of whatever speed you pick.",
          "Range grows with the square of velocity, so small velocity nudges move the landing point more than you'd expect.",
        ],
      },
      {
        id: "physics-projectile-motion-challenge-003",
        title: "Stay Airborne for 8 Seconds",
        scenario: "A skydiving demonstration team wants a practice projectile to stay in the air for as close to 8 seconds as possible before the real jump.",
        objective: "Use the Challenge tab's controls (velocity, angle, and gravity) to find a combination that keeps the projectile airborne for about 8 seconds.",
        constraints: [{ id: "c1", label: "Time of flight should land within about 0.3 s of 8 seconds." }],
        tools: [
          { id: "velocity-slider", label: "Launch velocity slider" },
          { id: "angle-slider", label: "Launch angle slider" },
          { id: "gravity-select", label: "Gravity preset (or Custom)" },
          { id: "time-readout", label: "Live Time of flight readout" },
        ],
        answer: { mode: "numeric", unit: "s", target: 8, tolerance: 0.3 },
        explanation:
          "Time of flight depends on vertical velocity and gravity (t = 2v sin θ / g), not on horizontal motion at all — so a high angle (to maximize the vertical velocity component) combined with a lower gravity preset (like the Moon) stretches the flight time out the most. This matches the simulation's own 'Stay airborne for 8 seconds' Challenge-tab target.",
        hints: [
          "Time of flight only depends on the vertical component of velocity and gravity — angle and gravity matter more here than raw speed.",
          "A higher angle and a weaker gravity preset both stretch out the flight time.",
        ],
      },
      {
        id: "physics-projectile-motion-challenge-004",
        title: "Real-World Mission: Hit a Target at 100 m",
        scenario: "A water-cannon operator at a summer festival needs to soak a target standing exactly 100 meters away, without overshooting into the crowd beyond it.",
        objective: "Use the Challenge tab to land the projectile within 3 m of a 100 m range, using whatever combination of velocity and angle gets you there.",
        constraints: [{ id: "c1", label: "Land within 3 meters of the 100 m mark." }],
        tools: [
          { id: "velocity-slider", label: "Launch velocity slider" },
          { id: "angle-slider", label: "Launch angle slider" },
          { id: "range-readout", label: "Live Range readout" },
        ],
        answer: { mode: "numeric", unit: "m", target: 100, tolerance: 3 },
        explanation:
          "100 m requires noticeably more velocity than the lab's default settings provide at 45° — since range grows with the square of velocity, increasing speed is a far more efficient way to add distance than fine-tuning the angle once you're already near 45°. This matches the simulation's own 'Hit a target at 100 m' Challenge-tab mission.",
        hints: [
          "Try increasing launch velocity before touching the angle — 45° is already close to optimal.",
          "Because range scales with v², a moderate speed increase can add a lot more distance than you'd expect.",
        ],
      },
    ],
  },

  relatedTopics: [],
};

import type { TopicContent } from "../types";

/**
 * Simple Forces — brought up from Learn + Explore only to the full
 * Golden Learning Experience standard (Learn, Predict, Explore,
 * Explain, Practice, Challenge), matching Newton's Laws, Projectile
 * Motion, Work Energy & Power, and Momentum. The `learn` and
 * `explore` sections below are carried over verbatim from the
 * original content (see the previous file comment); only Predict,
 * Explain, Practice, and Challenge are new.
 *
 * All new content is grounded in the `SimpleForces` lab's real
 * controls: a left-force slider and a right-force slider, each 0–10 N
 * in 1 N steps, plus Start/Reset. The box's displacement is driven by
 * `netForce = rightForce - leftForce` (see `forces-model.ts`) — a
 * deliberately simple "bigger net force, bigger slide" stand-in for
 * real acceleration, not a full kinematic simulation. Predict,
 * Explain, and Challenge below stay strictly within what that model
 * actually shows: which way net force points and whether it's zero,
 * never an acceleration or velocity number the lab doesn't compute.
 * Gets its own new, dedicated 30-question bank
 * (`physics-simple-forces` in `@/features/quiz-engine`), since the
 * shared `physics-newtonian-mechanics` bank was only ever a stand-in
 * for this topic and Simple Energy together, not a dedicated bank for
 * either.
 */

/** A simple tug-of-war sketch — the one visual this topic's Learn
 *  step needs to make "equal forces, no motion" feel concrete before
 *  the student ever touches the simulation. */
const tugOfWarSketch = (
  <svg viewBox="0 0 260 120" className="mx-auto h-28 w-full max-w-xs" role="img" aria-labelledby="simple-forces-tug-title">
    <title id="simple-forces-tug-title">
      A box with a rope pulled from both sides. Equal pulls leave it still; a bigger pull on one side moves it that way.
    </title>
    <rect x="105" y="40" width="50" height="36" rx="6" className="fill-subject-physics-soft stroke-subject-physics dark:fill-subject-physics/20" strokeWidth="2" />
    <line x1="20" y1="58" x2="103" y2="58" strokeWidth="2.5" className="stroke-[#E0524F]" markerStart="url(#simple-forces-arrow-left)" />
    <line x1="157" y1="58" x2="240" y2="58" strokeWidth="2.5" className="stroke-[#3D5AFE]" markerEnd="url(#simple-forces-arrow-right)" />
    <text x="35" y="46" textAnchor="middle" className="fill-ink-soft font-mono text-[9px] dark:fill-bone-soft">Left pull</text>
    <text x="225" y="46" textAnchor="middle" className="fill-ink-soft font-mono text-[9px] dark:fill-bone-soft">Right pull</text>
    <defs>
      <marker id="simple-forces-arrow-left" markerWidth="8" markerHeight="8" refX="2" refY="4" orient="auto">
        <path d="M8,0 L0,4 L8,8 Z" className="fill-[#E0524F]" />
      </marker>
      <marker id="simple-forces-arrow-right" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 Z" className="fill-[#3D5AFE]" />
      </marker>
    </defs>
  </svg>
);

export const physicsSimpleForcesContent: TopicContent = {
  subjectSlug: "physics",
  topicSlug: "simple-forces",
  title: "Simple Forces",
  subjectLabel: "Physics",
  topicLabel: "Newtonian Mechanics",
  colorToken: "physics",
  simulationHref: "/dashboard/physics/simple-forces",

  // -------------------------------------------------------------
  // LEARN — what am I learning?
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Explain what net force means when two forces act in opposite directions.",
      "Predict which way an object moves given two opposing forces.",
      "Identify when forces are balanced versus unbalanced.",
      "Recognize that balanced forces produce no motion.",
    ],
    concepts: [
      {
        term: "Net force",
        explanation:
          "When two forces pull or push in opposite directions, what actually determines the object's motion is the difference between them.",
        formula: "F_{net} = F_{right} - F_{left}",
      },
      {
        term: "Balanced forces",
        explanation:
          "When the two opposing forces are equal, the net force is zero — the box stays still, even though two real forces are still being applied to it.",
      },
      {
        term: "Unbalanced forces",
        explanation:
          "When one force is larger than the other, there's a nonzero net force, and the box moves in the direction of the stronger force.",
      },
    ],
    whyItMatters:
      "A tug-of-war is the clearest everyday example of this idea: as long as both teams pull with equal force, nobody moves, no matter how hard they're pulling. The moment one side pulls harder, the whole rope shifts that way. This same idea of balanced versus unbalanced forces is the starting point for everything in mechanics — it's exactly what Newton's First Law describes, just with the numbers made concrete.",
    keyTerms: [
      { term: "Net force", definition: "The single combined force left over once every individual force on an object is added together — for two opposing forces, simply their difference." },
      { term: "Balanced forces", definition: "Opposing forces of equal size. Their net force is zero, so they produce no change in motion." },
      { term: "Unbalanced forces", definition: "Opposing forces of unequal size. Their net force is nonzero, so the object moves in the direction of the stronger force." },
      { term: "Newton (N)", definition: "The SI unit of force. The lab's sliders each range from 0 to 10 N." },
    ],
    visualAids: [
      {
        id: "simple-forces-tug-of-war",
        caption:
          "A tug-of-war: if both sides pull equally hard, the box (or rope) doesn't move. The instant one side pulls harder, everything shifts toward that side.",
        visual: tugOfWarSketch,
      },
    ],
    misconceptions: [
      {
        id: "misconception-no-motion-means-no-force",
        misconception: "If a box isn't moving, no forces are acting on it.",
        correction:
          "A box can have two real forces acting on it — a push from the left and a push from the right — and still not move at all, as long as those two forces are equal. \"Not moving\" means the net force is zero, not that no forces exist.",
      },
      {
        id: "misconception-bigger-force-always-wins-by-a-lot",
        misconception: "Whichever side has the bigger force always moves the box a huge distance, regardless of how much bigger.",
        correction:
          "In this model, the size of the net force (the difference between the two sides) controls how far the box slides — a small difference produces a small slide, and a large difference produces a large one. It isn't a fixed, all-or-nothing outcome.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT — what should I predict?
  // -------------------------------------------------------------
  predict: {
    intro:
      "Commit to a prediction before you touch the sliders below — then set up the matching force pair in the lab and press Start to check your answer.",
    scenarios: [
      {
        id: "physics-simple-forces-predict-001",
        scenario: "You set the left force to 5 N and the right force to 5 N, then press Start.",
        question: "What happens to the box?",
        options: [
          { id: "stays-still", label: "It stays exactly where it is" },
          { id: "moves-right", label: "It moves right, since 5 N is a real force" },
          { id: "moves-left", label: "It moves left" },
          { id: "moves-both", label: "It shakes back and forth between both sides" },
        ],
        actualResultOptionId: "stays-still",
        explanation:
          "Net force is F_right − F_left = 5 − 5 = 0 N. With the two forces balanced, the box has no net push in either direction, so it doesn't move at all — even though two real 5 N forces are still being applied.",
        hint: "Net force is F_right minus F_left. What is 5 minus 5?",
      },
      {
        id: "physics-simple-forces-predict-002",
        scenario: "You set the left force to 2 N and the right force to 8 N, then press Start.",
        question: "Which way does the box move, and roughly how far compared to a smaller force gap?",
        options: [
          { id: "right-far", label: "Right, and fairly far — the net force (6 N) is large" },
          { id: "left-far", label: "Left, and fairly far" },
          { id: "right-small", label: "Right, but only a tiny amount" },
          { id: "no-move", label: "It doesn't move, since both sides are pushing" },
        ],
        actualResultOptionId: "right-far",
        explanation:
          "Net force is 8 − 2 = 6 N to the right — a large net force compared to the lab's 0–10 N range, so the box slides a large distance to the right. The direction always follows whichever side is stronger.",
        hint: "Find the net force: F_right − F_left. Which side is bigger, and by how much?",
      },
      {
        id: "physics-simple-forces-predict-003",
        scenario: "You set the left force to 4 N and the right force to 6 N (net = 2 N right), then run it. Next, you reset and set left to 0 N and right to 2 N (net = 2 N right again).",
        question: "How do the two resulting slides compare?",
        options: [
          { id: "same-distance", label: "The box slides the same distance right both times" },
          { id: "second-farther", label: "The second run slides farther, since one side is completely off" },
          { id: "first-farther", label: "The first run slides farther, since bigger numbers were involved" },
          { id: "opposite-directions", label: "The two runs move in opposite directions" },
        ],
        actualResultOptionId: "same-distance",
        explanation:
          "This model's displacement depends only on the net force (F_right − F_left), not on the individual force values that produced it. Both pairs give a net force of 2 N to the right, so both produce the exact same slide — only the difference matters, not the raw numbers.",
        hint: "Calculate the net force for each pair. Are they the same number?",
      },
      {
        id: "physics-simple-forces-predict-004",
        scenario: "You set the left force to 10 N (the maximum) and the right force to 0 N, then press Start.",
        question: "What do you predict?",
        options: [
          { id: "max-left-slide", label: "The box slides all the way to the left — the largest possible net force" },
          { id: "no-move", label: "The box doesn't move, since one side is at zero" },
          { id: "small-left-slide", label: "The box slides only slightly to the left" },
          { id: "right-slide", label: "The box slides to the right instead" },
        ],
        actualResultOptionId: "max-left-slide",
        explanation:
          "Net force is 0 − 10 = −10 N — the largest possible unbalanced force the lab allows, entirely to the left. That produces the maximum slide distance to the left the model can show.",
        hint: "This uses the biggest possible force difference the sliders allow. Which direction, and how far?",
      },
      {
        id: "physics-simple-forces-predict-005",
        scenario: "You want to find a force pair, other than 0 and 0, where the box doesn't move at all.",
        question: "Which of these pairs would also leave the box balanced?",
        options: [
          { id: "seven-seven", label: "Left = 7 N, Right = 7 N" },
          { id: "seven-eight", label: "Left = 7 N, Right = 8 N" },
          { id: "three-six", label: "Left = 3 N, Right = 6 N" },
          { id: "zero-one", label: "Left = 0 N, Right = 1 N" },
        ],
        actualResultOptionId: "seven-seven",
        explanation:
          "Any pair where the left and right forces are equal gives a net force of zero, regardless of how large the equal values are — 7 N and 7 N balance exactly the same way 3 N and 3 N would.",
        hint: "Balanced just means the two numbers are equal to each other — it doesn't matter what that shared value is.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE — hands-on with the simulation
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Set a force value on the left side and a force value on the right side.",
      "Press Start and watch which way the box moves.",
      "Try to find a combination where the box doesn't move at all.",
      "Watch the balanced/unbalanced label update as you change either slider.",
    ],
    tryThis: [
      "Set both forces to the same value. What happens to the box, and why, even though force is still being applied?",
      "Set the left force to the maximum and the right force to the minimum. Predict the outcome before pressing Start.",
      "Find two different force pairs that both result in the box staying still.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN — why does this happen?
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "physics-simple-forces-explain-001",
        question: "Why doesn't the box move when the left and right forces are equal?",
        answer:
          "Motion in this model is driven by net force, F_right − F_left. When the two forces are equal, that subtraction gives zero — there's no leftover push in either direction, so the box has nothing to move it, even though it's still being pushed from both sides.",
      },
      {
        id: "physics-simple-forces-explain-002",
        question: "Why does the box move toward the stronger side rather than the weaker one?",
        answer:
          "The net force always points in the direction of whichever force is larger — subtracting a smaller number from a larger one leaves a positive result in the larger force's direction. The stronger side effectively \"wins\" the difference, and the box follows that leftover force.",
      },
      {
        id: "physics-simple-forces-explain-003",
        question: "Why do two very different force pairs (like 4 N/6 N and 0 N/2 N) produce the exact same motion?",
        answer:
          "This model only cares about the net force, F_right − F_left, not the two individual numbers that created it. Since 6 − 4 and 2 − 0 both equal 2, both pairs produce identical net forces and therefore identical slides — the individual force values are irrelevant once you know their difference.",
      },
      {
        id: "physics-simple-forces-explain-004",
        question: "Why can a box have real forces on it and still be classified as \"balanced\"?",
        answer:
          "\"Balanced\" describes the relationship between two forces, not their existence — it means they're equal in size and opposite in direction, so they cancel each other out. Both forces are still genuinely acting on the box; it's their combined effect, the net force, that comes out to zero.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE — can I solve a problem using this?
  // -------------------------------------------------------------
  practice: {
    // Foreign key into the quiz-engine registry — all questions live
    // in @/features/quiz-engine/data/physics-simple-forces-quiz.ts,
    // none duplicated here.
    quizId: "physics-simple-forces",
  },

  // -------------------------------------------------------------
  // CHALLENGE — realistic problems, including the real-world mission
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. Each one asks you to reason about net force and balance, using the lab's two sliders to check your work. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "physics-simple-forces-challenge-001",
        title: "Find the Balance Point",
        scenario:
          "The lab's left force is fixed at 6 N. You need the box to stay perfectly still.",
        objective: "Use the right force slider to make the net force exactly zero.",
        constraints: [{ id: "c1", label: "Left force is fixed at 6 N — only the right slider is yours to set." }],
        tools: [{ id: "right-slider", label: "Right force slider (0–10 N)" }],
        answer: { mode: "numeric", unit: "N", target: 6, tolerance: 0 },
        explanation:
          "Balanced forces require the right force to equal the left force exactly: F_net = F_right − F_left = 0 means F_right = F_left = 6 N. Any other value leaves an unbalanced net force and the box moves.",
        hints: [
          "Balanced means the net force is zero — F_right − F_left = 0.",
          "That means F_right has to equal F_left exactly.",
          "Left is fixed at 6 N, so set the right slider to match it.",
        ],
      },
      {
        id: "physics-simple-forces-challenge-002",
        title: "Match a Target Net Force",
        scenario:
          "An engineer wants to demonstrate a net force of exactly 5 N pushing the box to the right, using the lab's two sliders.",
        objective: "Find a left/right force pair whose net force equals 5 N to the right.",
        tools: [
          { id: "left-slider", label: "Left force slider (0–10 N)" },
          { id: "right-slider", label: "Right force slider (0–10 N)" },
          { id: "balance-label", label: "Balanced / unbalanced label" },
        ],
        answer: { mode: "numeric", unit: "N", target: 5, tolerance: 0.5 },
        explanation:
          "Net force is F_right − F_left, so any pair whose difference is 5 works — for example, Left = 0 N and Right = 5 N, or Left = 3 N and Right = 8 N. There's no single right pair; the difference is what matters.",
        hints: [
          "Net force is F_right minus F_left — you need that difference to equal 5.",
          "Try the simplest case first: what if the left slider stayed at 0?",
          "For example, 0 N and 5 N, or 3 N and 8 N, both give a net force of 5 N right.",
        ],
      },
      {
        id: "physics-simple-forces-challenge-003",
        title: "Real-World Mission: Design a Gentle Nudge",
        scenario:
          "You're setting up a classroom demonstration where the box should move a very small, barely-visible amount to the left — enough to show unbalanced forces exist, without a dramatic slide.",
        objective: "Use the two sliders to produce a small net force to the left, close to 1 N in magnitude.",
        constraints: [{ id: "c1", label: "The net force should point left and stay close to 1 N — not zero, and not a large value." }],
        tools: [
          { id: "left-slider", label: "Left force slider (0–10 N)" },
          { id: "right-slider", label: "Right force slider (0–10 N)" },
        ],
        answer: { mode: "numeric", unit: "N", target: -1, tolerance: 0.5 },
        explanation:
          "A small leftward net force means F_right − F_left should be a small negative number, close to −1 N — for example, Left = 5 N and Right = 4 N, or Left = 8 N and Right = 7 N. Keeping the two forces close together, with the left side just slightly ahead, produces exactly the gentle, barely-visible slide the demonstration calls for.",
        hints: [
          "You want the net force to be negative (leftward) but small in size — around −1 N.",
          "Keep the two sliders close to each other, with the left one just a bit higher.",
          "For example, 5 N left and 4 N right gives a net force of −1 N.",
        ],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "physics",
      topicSlug: "newtons-laws",
      label: "Newton's Laws",
      href: "/dashboard/physics/newtons-laws",
      reason: "Balanced and unbalanced forces here are exactly what Newton's First and Second Laws formalize with real numbers.",
    },
  ],
};

import type { QuizMeta, QuizQuestion } from "../types";

/**
 * Simple Motion's dedicated question bank — scoped exactly to what
 * that topic teaches (v = d/t for one object at constant speed; no
 * displacement, vectors, or projectile motion, which belong to other
 * topics/simulations). Kept separate from `physics-motion-quiz.ts`
 * (which spans both Simple Motion and Projectile Motion) so students
 * are only ever quizzed on what this specific topic's Learn section
 * actually covers.
 *
 * 35 questions across seven kinds of understanding, in this order:
 * 001-006 recall (definitions, units, formula rearrangements),
 * 007-012 conceptual (why the relationships hold, not just what they are),
 * 013-017 application (picking the right approach for a word problem),
 * 018-022 prediction (reasoning about a change before calculating it),
 * 023-026 interpretation (reading a scenario/description and extracting the right values),
 * 027-031 numerical (direct v = d/t calculations, increasing in difficulty),
 * 032-035 misconception (directly confronting common wrong mental models).
 */
const questions: QuizQuestion[] = [
  // --- Recall -----------------------------------------------------
  {
    id: "physics-simple-motion-quiz-001",
    type: "multiple-choice",
    question: "What is the standard SI unit for speed?",
    options: ["Meters per second (m/s)", "Meters (m)", "Seconds (s)", "Kilograms (kg)"],
    correctAnswer: "Meters per second (m/s)",
    explanation:
      "Speed combines a distance unit divided by a time unit — in SI that's meters divided by seconds, written m/s.",
    difficulty: "easy",
    subject: "physics",
    topic: "simple-motion",
    concept: "Units",
  },
  {
    id: "physics-simple-motion-quiz-002",
    type: "multiple-choice",
    question: "Which formula correctly defines speed?",
    options: ["v = d / t", "v = t / d", "v = d × t", "v = d + t"],
    correctAnswer: "v = d / t",
    explanation: "Speed is distance divided by time — how much distance is covered for each second that passes.",
    difficulty: "easy",
    subject: "physics",
    topic: "simple-motion",
    concept: "Formula",
  },
  {
    id: "physics-simple-motion-quiz-003",
    type: "multiple-choice",
    question: "Starting from v = d / t, which rearrangement correctly solves for distance?",
    options: ["d = v × t", "d = v / t", "d = t / v", "d = v + t"],
    correctAnswer: "d = v × t",
    explanation: "Multiplying both sides of v = d/t by t isolates d, giving d = v × t.",
    difficulty: "easy",
    subject: "physics",
    topic: "simple-motion",
    concept: "Formula Rearrangement",
  },
  {
    id: "physics-simple-motion-quiz-004",
    type: "multiple-choice",
    question: "Starting from v = d / t, which rearrangement correctly solves for time?",
    options: ["t = d / v", "t = v / d", "t = d × v", "t = v − d"],
    correctAnswer: "t = d / v",
    explanation: "Dividing both sides of d = v × t by v isolates t, giving t = d / v.",
    difficulty: "easy",
    subject: "physics",
    topic: "simple-motion",
    concept: "Formula Rearrangement",
  },
  {
    id: "physics-simple-motion-quiz-005",
    type: "multiple-choice",
    question: "In the context of this simulation, what does 'distance' represent?",
    options: [
      "How far the object travels along the track",
      "How long the trip takes",
      "How fast the object is moving",
      "The object's starting position only",
    ],
    correctAnswer: "How far the object travels along the track",
    explanation: "Distance is the length of the path covered — the simulation's track length from start to finish.",
    difficulty: "easy",
    subject: "physics",
    topic: "simple-motion",
    concept: "Distance",
  },
  {
    id: "physics-simple-motion-quiz-006",
    type: "multiple-choice",
    question: "What does it mean for an object to move at a 'constant speed'?",
    options: [
      "It covers equal distances in equal time intervals",
      "It stops and starts repeatedly",
      "It speeds up throughout the trip",
      "It changes direction regularly",
    ],
    correctAnswer: "It covers equal distances in equal time intervals",
    explanation:
      "Constant speed means the rate of covering distance never changes — every second contributes the same amount of distance.",
    difficulty: "easy",
    subject: "physics",
    topic: "simple-motion",
    concept: "Constant Speed",
  },

  // --- Conceptual ---------------------------------------------------
  {
    id: "physics-simple-motion-quiz-007",
    type: "multiple-choice",
    question: "Why is a single formula (v = d/t) enough to describe the whole trip in this simulation?",
    options: [
      "Because the speed never changes during the trip",
      "Because the distance is always 100 m",
      "Because time always equals 10 seconds",
      "Because the object doesn't actually move",
    ],
    correctAnswer: "Because the speed never changes during the trip",
    explanation:
      "One constant speed value describes the entire journey only because that speed doesn't vary — if it did, you'd need more than one number to describe the motion.",
    difficulty: "medium",
    subject: "physics",
    topic: "simple-motion",
    concept: "Constant Speed",
  },
  {
    id: "physics-simple-motion-quiz-008",
    type: "multiple-choice",
    question: "For a fixed distance, why does increasing speed always decrease the time taken?",
    options: [
      "Because more distance is covered every second, so fewer seconds are needed",
      "Because the distance shrinks as speed increases",
      "Because time and speed are unrelated",
      "Because the object skips part of the track",
    ],
    correctAnswer: "Because more distance is covered every second, so fewer seconds are needed",
    explanation:
      "Speed measures distance covered per second — a higher rate means the same total distance gets used up in fewer seconds.",
    difficulty: "medium",
    subject: "physics",
    topic: "simple-motion",
    concept: "Speed",
  },
  {
    id: "physics-simple-motion-quiz-009",
    type: "multiple-choice",
    question: "For a fixed amount of time, what happens to distance covered if speed increases?",
    options: [
      "Distance increases proportionally",
      "Distance decreases proportionally",
      "Distance stays exactly the same",
      "Distance becomes negative",
    ],
    correctAnswer: "Distance increases proportionally",
    explanation:
      "With time fixed, d = v × t means distance scales directly with speed — double the speed, double the distance covered in that same time.",
    difficulty: "medium",
    subject: "physics",
    topic: "simple-motion",
    concept: "Distance",
  },
  {
    id: "physics-simple-motion-quiz-010",
    type: "multiple-choice",
    question: "Which best describes the difference between 'distance' and 'speed'?",
    options: [
      "Distance is how far something travels; speed is how fast it covers that distance",
      "Distance and speed always have the same numeric value",
      "Speed measures direction, distance measures time",
      "Distance is only used for very long trips",
    ],
    correctAnswer: "Distance is how far something travels; speed is how fast it covers that distance",
    explanation:
      "They describe different things: distance is a total amount covered, while speed is a rate — how quickly that amount builds up.",
    difficulty: "easy",
    subject: "physics",
    topic: "simple-motion",
    concept: "Speed",
  },
  {
    id: "physics-simple-motion-quiz-011",
    type: "multiple-choice",
    question: "In this simulation, why can only one of speed, distance, or time be the 'unknown' at a time?",
    options: [
      "Because v = d/t has exactly three quantities, and knowing any two always determines the third",
      "Because the simulation can only track one number",
      "Because speed, distance, and time are unrelated to each other",
      "Because only one slider works at a time",
    ],
    correctAnswer: "Because v = d/t has exactly three quantities, and knowing any two always determines the third",
    explanation:
      "With one equation linking three quantities, fixing any two mathematically fixes the third — that's why the interface only ever needs one quantity to be 'solved for.'",
    difficulty: "medium",
    subject: "physics",
    topic: "simple-motion",
    concept: "Formula",
  },
  {
    id: "physics-simple-motion-quiz-012",
    type: "multiple-choice",
    question: "Why doesn't the formula v = d/t work well for describing a car trip through city traffic?",
    options: [
      "Because the car's speed constantly changes, so no single speed value describes the whole trip",
      "Because cars can't be measured in meters",
      "Because city trips have no distance",
      "Because traffic lights remove the concept of time",
    ],
    correctAnswer: "Because the car's speed constantly changes, so no single speed value describes the whole trip",
    explanation:
      "v = d/t assumes one constant rate. Stop-and-go traffic means the actual speed is different from moment to moment, so v = d/t only gives an average speed for that trip, not the true speed at any instant.",
    difficulty: "medium",
    subject: "physics",
    topic: "simple-motion",
    concept: "Constant Speed",
  },

  // --- Application --------------------------------------------------
  {
    id: "physics-simple-motion-quiz-013",
    type: "multiple-choice",
    question: "A cyclist's distance and average speed are known, but not the time. Which formula finds the time?",
    options: ["t = d / v", "t = v / d", "t = d × v", "t = v − d"],
    correctAnswer: "t = d / v",
    explanation: "Time is unknown here, and t = d/v is the rearrangement of v = d/t that isolates time.",
    difficulty: "easy",
    subject: "physics",
    topic: "simple-motion",
    concept: "Formula Rearrangement",
  },
  {
    id: "physics-simple-motion-quiz-014",
    type: "multiple-choice",
    question: "A runner's speed and race time are known, but not the distance. Which formula finds the distance?",
    options: ["d = v × t", "d = v / t", "d = t / v", "d = v + t"],
    correctAnswer: "d = v × t",
    explanation: "Distance is unknown here, and d = v × t is the rearrangement of v = d/t that isolates distance.",
    difficulty: "easy",
    subject: "physics",
    topic: "simple-motion",
    concept: "Formula Rearrangement",
  },
  {
    id: "physics-simple-motion-quiz-015",
    type: "multiple-choice",
    question:
      "Before using v = d/t, why is it important to make sure distance is in meters and time is in seconds (not, say, kilometers and hours)?",
    options: [
      "Because the formula only gives a correct result when the units on both sides are consistent",
      "Because meters and seconds are the only units that exist",
      "Because kilometers can't be measured accurately",
      "Because the simulation breaks if other units are used",
    ],
    correctAnswer: "Because the formula only gives a correct result when the units on both sides are consistent",
    explanation:
      "v = d/t works with any consistent pair of units — the key is consistency, so mixing km with seconds (without converting) gives a meaningless number.",
    difficulty: "medium",
    subject: "physics",
    topic: "simple-motion",
    hints: [
      "Think about what happens if you divide kilometers by seconds without converting either one.",
      "The formula doesn't care which units you use, only that distance and time use compatible ones.",
    ],
    concept: "Units",
  },
  {
    id: "physics-simple-motion-quiz-016",
    type: "multiple-choice",
    question:
      "Two drivers leave for the same destination. Driver A takes the highway at a higher constant speed than Driver B, who takes local roads, but both travel the same distance. Who arrives first?",
    options: [
      "Driver A, because a higher speed covers the same distance in less time",
      "Driver B, because local roads are always shorter",
      "They arrive at the same time regardless of speed",
      "It can't be determined without knowing the exact distance",
    ],
    correctAnswer: "Driver A, because a higher speed covers the same distance in less time",
    explanation:
      "For the same distance, a higher constant speed always means less time — this is exactly the inverse relationship v = d/t describes.",
    difficulty: "medium",
    subject: "physics",
    topic: "simple-motion",
    concept: "Speed",
  },
  {
    id: "physics-simple-motion-quiz-017",
    type: "multiple-choice",
    question:
      "A problem states: 'A boat can travel at a steady 8 m/s. How long will it take to cross a 240 m channel?' What is being asked for?",
    options: ["Time", "Distance", "Speed", "None of these — the problem is unsolvable"],
    correctAnswer: "Time",
    explanation:
      "Both speed (8 m/s) and distance (240 m) are given; the question asks how long the crossing takes, which is time.",
    difficulty: "easy",
    subject: "physics",
    topic: "simple-motion",
    concept: "Time",
  },

  // --- Prediction -----------------------------------------------------
  {
    id: "physics-simple-motion-quiz-018",
    type: "multiple-choice",
    question:
      "You pause the simulation halfway through the trip, wait a few seconds, then press play again. What happens to the total trip time shown once it finishes?",
    options: [
      "It stays exactly the same as before pausing",
      "It increases by however long the pause lasted",
      "It resets back to zero",
      "It becomes impossible to calculate",
    ],
    correctAnswer: "It stays exactly the same as before pausing",
    explanation:
      "The 'trip time' the formula describes is the time the object spends actually moving, not real-world clock time — pausing doesn't add motion, so it doesn't add to the trip's time.",
    difficulty: "medium",
    subject: "physics",
    topic: "simple-motion",
    concept: "Time",
  },
  {
    id: "physics-simple-motion-quiz-019",
    type: "multiple-choice",
    question: "If you halve the distance while keeping speed the same, what should happen to the time?",
    options: ["It's cut in half", "It doubles", "It stays the same", "It becomes zero"],
    correctAnswer: "It's cut in half",
    explanation: "With speed fixed, t = d/v — halving distance halves the time needed to cover it.",
    difficulty: "easy",
    subject: "physics",
    topic: "simple-motion",
    concept: "Distance",
  },
  {
    id: "physics-simple-motion-quiz-020",
    type: "multiple-choice",
    question:
      "If you keep distance fixed but the trip now needs to take three times as long, what should happen to the required speed?",
    options: ["It's cut to a third", "It triples", "It stays the same", "It becomes negative"],
    correctAnswer: "It's cut to a third",
    explanation:
      "With distance fixed, v = d/t — tripling the time means each second now needs to cover a third as much distance, so speed drops to a third.",
    difficulty: "medium",
    subject: "physics",
    topic: "simple-motion",
    concept: "Speed",
  },
  {
    id: "physics-simple-motion-quiz-021",
    type: "multiple-choice",
    question: "Setup A: 60 m at 6 m/s. Setup B: 60 m at 3 m/s. Which setup finishes its trip first?",
    options: ["Setup A", "Setup B", "They finish at the same time", "Not enough information"],
    correctAnswer: "Setup A",
    explanation: "Setup A's higher speed covers the same 60 m distance in less time — 10 s versus 20 s for Setup B.",
    difficulty: "easy",
    subject: "physics",
    topic: "simple-motion",
    concept: "Speed",
  },
  {
    id: "physics-simple-motion-quiz-022",
    type: "multiple-choice",
    question:
      "Two objects both move at 5 m/s, but Object X travels 50 m and Object Y travels 100 m. Which statement is true?",
    options: [
      "Object Y takes twice as long as Object X",
      "Object X takes twice as long as Object Y",
      "They take the same amount of time",
      "Speed doesn't affect either object's time",
    ],
    correctAnswer: "Object Y takes twice as long as Object X",
    explanation:
      "With the same speed, time scales directly with distance — twice the distance at the same rate takes twice the time (10 s vs 20 s).",
    difficulty: "medium",
    subject: "physics",
    topic: "simple-motion",
    concept: "Time",
  },

  // --- Interpretation -------------------------------------------------
  {
    id: "physics-simple-motion-quiz-023",
    type: "multiple-choice",
    question: "A cheetah runs 100 m in 4 seconds. A greyhound runs 100 m in 6 seconds. Which animal has the greater speed?",
    options: ["The cheetah", "The greyhound", "They have equal speed", "Cannot be determined"],
    correctAnswer: "The cheetah",
    explanation:
      "Same distance, less time means a higher speed — the cheetah's 100 m ÷ 4 s = 25 m/s beats the greyhound's 100 m ÷ 6 s ≈ 16.7 m/s.",
    difficulty: "medium",
    subject: "physics",
    topic: "simple-motion",
    concept: "Speed",
  },
  {
    id: "physics-simple-motion-quiz-024",
    type: "multiple-choice",
    question:
      "Three delivery drones each fly 40 m. Drone 1 takes 8 s, Drone 2 takes 5 s, Drone 3 takes 10 s. Which drone is the slowest?",
    options: ["Drone 3", "Drone 1", "Drone 2", "All three are equally fast"],
    correctAnswer: "Drone 3",
    explanation:
      "For the same distance, the drone that takes the longest — Drone 3 at 10 s — is moving at the lowest speed (40 m ÷ 10 s = 4 m/s, the smallest of the three).",
    difficulty: "medium",
    subject: "physics",
    topic: "simple-motion",
    concept: "Speed",
  },
  {
    id: "physics-simple-motion-quiz-025",
    type: "multiple-choice",
    question:
      "'A train travels at a constant 25 m/s and completes its journey in 300 seconds. How far did it travel?' — What are the known values here?",
    options: ["Speed and time", "Distance and time", "Speed and distance", "None of the values are known"],
    correctAnswer: "Speed and time",
    explanation: "The problem states the speed (25 m/s) and the time (300 s) directly — distance is what needs to be found.",
    difficulty: "easy",
    subject: "physics",
    topic: "simple-motion",
    concept: "Formula",
  },
  {
    id: "physics-simple-motion-quiz-026",
    type: "multiple-choice",
    question:
      "While the simulation's car is only 25% of the way along its trip, the unknown distance readout shows a quarter of the final distance value. Why?",
    options: [
      "Because the readout grows in step with how much of the trip has actually played out, not shown all at once",
      "Because the simulation recalculates the wrong formula partway through",
      "Because distance is unrelated to how far the car has moved",
      "Because the readout is a random placeholder value",
    ],
    correctAnswer: "Because the readout grows in step with how much of the trip has actually played out, not shown all at once",
    explanation:
      "The unknown value is 'earned' as the trip plays out — at 25% progress, only 25% of the final distance is shown, reaching the true value exactly when the car finishes.",
    difficulty: "medium",
    subject: "physics",
    topic: "simple-motion",
    concept: "Distance",
  },

  // --- Numerical --------------------------------------------------
  {
    id: "physics-simple-motion-quiz-027",
    type: "multiple-choice",
    question: "An object travels 200 m in 25 s at a constant speed. What is its speed?",
    options: ["8 m/s", "5 m/s", "225 m/s", "175 m/s"],
    correctAnswer: "8 m/s",
    explanation: "v = d/t = 200 m ÷ 25 s = 8 m/s.",
    difficulty: "easy",
    subject: "physics",
    topic: "simple-motion",
    concept: "Speed",
  },
  {
    id: "physics-simple-motion-quiz-028",
    type: "multiple-choice",
    question: "An object moves at a constant 6 m/s for 15 s. How far does it travel?",
    options: ["90 m", "21 m", "9 m", "2.5 m"],
    correctAnswer: "90 m",
    explanation: "d = v × t = 6 m/s × 15 s = 90 m.",
    difficulty: "easy",
    subject: "physics",
    topic: "simple-motion",
    concept: "Distance",
  },
  {
    id: "physics-simple-motion-quiz-029",
    type: "multiple-choice",
    question: "A cyclist covers 72 m at a constant 9 m/s. How long does the trip take?",
    options: ["8 s", "63 s", "81 s", "9 s"],
    correctAnswer: "8 s",
    explanation: "t = d/v = 72 m ÷ 9 m/s = 8 s.",
    difficulty: "easy",
    subject: "physics",
    topic: "simple-motion",
    concept: "Time",
  },
  {
    id: "physics-simple-motion-quiz-030",
    type: "multiple-choice",
    question: "A snail moves at a constant 0.5 m/s. How far does it travel in 40 s?",
    options: ["20 m", "80 m", "0.0125 m", "40.5 m"],
    correctAnswer: "20 m",
    explanation: "d = v × t = 0.5 m/s × 40 s = 20 m.",
    difficulty: "medium",
    subject: "physics",
    topic: "simple-motion",
    concept: "Distance",
  },
  {
    id: "physics-simple-motion-quiz-031",
    type: "multiple-choice",
    question:
      "A car needs to cover 150 m and complete the trip in under 12 s to beat its previous record. What is the minimum constant speed (to the nearest whole m/s) required?",
    options: ["13 m/s", "12 m/s", "150 m/s", "1800 m/s"],
    correctAnswer: "13 m/s",
    explanation:
      "150 m ÷ 12 s = 12.5 m/s exactly at the limit — since the trip must take under 12 s, the speed needs to round up to the next whole number, 13 m/s.",
    difficulty: "hard",
    subject: "physics",
    topic: "simple-motion",
    hints: [
      "First find the exact speed needed to cover 150 m in exactly 12 s.",
      "Since the trip must take under 12 s, any speed at that exact value isn't quite enough — round up.",
    ],
    concept: "Speed",
  },

  // --- Misconception --------------------------------------------------
  {
    id: "physics-simple-motion-quiz-032",
    type: "multiple-choice",
    question:
      "A cyclist rides the first half of a distance at 10 m/s and the second half at 20 m/s. Is their average speed for the whole trip exactly (10 + 20) / 2 = 15 m/s?",
    options: [
      "No — the two halves took different amounts of time, so a simple average of speeds isn't the true average speed",
      "Yes — averaging two speeds always gives the correct overall average speed",
      "Yes, but only if the distances are measured in meters",
      "No — speed can't be averaged under any circumstances",
    ],
    correctAnswer:
      "No — the two halves took different amounts of time, so a simple average of speeds isn't the true average speed",
    explanation:
      "The cyclist spends more time at the slower 10 m/s than at 20 m/s, since covering the same distance takes longer when moving slower — so the true average speed (total distance ÷ total time) comes out lower than the simple 15 m/s average of the two speeds.",
    difficulty: "hard",
    subject: "physics",
    topic: "simple-motion",
    hints: [
      "Try assuming a distance for each half and work out how long each half actually takes at its speed.",
      "The half ridden at 10 m/s takes longer than the half ridden at 20 m/s — time, not speed, is what should be averaged evenly.",
    ],
    concept: "Average Speed",
    misconceptionTag: "average-of-speeds",
  },
  {
    id: "physics-simple-motion-quiz-033",
    type: "multiple-choice",
    question: "Someone says: 'The object with the higher speed number always travels farther.' Is this true?",
    options: [
      "No — a higher speed only means more distance if it also travels for the same or longer time",
      "Yes — higher speed always means farther distance no matter what",
      "Yes, but only for objects moving in a straight line",
      "No — speed and distance are never related",
    ],
    correctAnswer: "No — a higher speed only means more distance if it also travels for the same or longer time",
    explanation:
      "Distance depends on both speed and time (d = v × t) — a fast object that only moves for a moment can travel less distance than a slower object moving for much longer.",
    difficulty: "medium",
    subject: "physics",
    topic: "simple-motion",
    concept: "Distance",
    misconceptionTag: "speed-implies-distance",
  },
  {
    id: "physics-simple-motion-quiz-034",
    type: "multiple-choice",
    question: "Someone says: 'If two objects have the same speed, they must have traveled the same distance.' Is this true?",
    options: [
      "No — distance also depends on how long each object traveled for",
      "Yes — equal speed always means equal distance",
      "Yes, but only if they started at the same location",
      "No — speed has nothing to do with distance",
    ],
    correctAnswer: "No — distance also depends on how long each object traveled for",
    explanation:
      "Two objects can share the same speed but travel for different amounts of time, ending up with completely different distances — speed alone doesn't determine distance.",
    difficulty: "medium",
    subject: "physics",
    topic: "simple-motion",
    concept: "Distance",
    misconceptionTag: "same-speed-same-distance",
  },
  {
    id: "physics-simple-motion-quiz-035",
    type: "multiple-choice",
    question:
      "A student calculates speed by dividing 5 kilometers by 30 seconds, getting '0.167,' and calls that the speed in m/s. What went wrong?",
    options: [
      "The distance should have been converted to meters before dividing by seconds",
      "Nothing — the calculation is already correct as m/s",
      "Time should have been converted to hours instead",
      "Division was the wrong operation to use",
    ],
    correctAnswer: "The distance should have been converted to meters before dividing by seconds",
    explanation:
      "Mixing kilometers with seconds without converting produces a number that isn't meaningfully in either km/h or m/s — 5 km should first become 5000 m, giving 5000 ÷ 30 ≈ 166.7 m/s.",
    difficulty: "hard",
    subject: "physics",
    topic: "simple-motion",
    hints: [
      "5 kilometers needs to become meters before dividing by seconds.",
      "1 km = 1000 m, so 5 km = 5000 m.",
    ],
    concept: "Units",
    misconceptionTag: "unit-mixing",
  },
];

export const physicsSimpleMotionQuiz: QuizMeta = {
  id: "physics-simple-motion",
  title: "Simple Motion Practice",
  subjectSlug: "physics",
  subjectLabel: "Physics",
  topicLabel: "Simple Motion",
  colorToken: "physics",
  backHref: "/dashboard/physics/simple-motion",
  description:
    "Recall, reasoning, prediction, and calculation questions covering the speed-distance-time relationship taught in Simple Motion.",
  difficulty: "medium",
  estimatedTime: 20,
  questions,
};

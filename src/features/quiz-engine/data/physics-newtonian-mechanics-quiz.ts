import type { QuizMeta, QuizQuestion } from "../types";

/**
 * Newtonian Mechanics topic question bank, matching the Newton's Laws
 * Lab (inertia, F = ma, action-reaction, mass vs. weight), Simple
 * Forces (net force, balanced/unbalanced forces), and Simple Energy
 * (potential energy, kinetic energy, conservation of energy)
 * simulations. Covers all three sub-areas across easy/medium/hard,
 * including numerical F = ma and energy-conservation problems and
 * common misconceptions (balanced forces vs. absent forces, equal
 * force vs. equal acceleration, mass-independence of falling speed).
 */
const questions: QuizQuestion[] = [
  {
    id: "physics-newtonian-mechanics-001",
    type: "multiple-choice",
    question: "What does Newton's First Law say about an object at rest?",
    options: ["It stays at rest unless a net force acts on it", "It will eventually start moving on its own", "It requires a constant force just to stay still", "It always has zero mass"],
    correctAnswer: "It stays at rest unless a net force acts on it",
    explanation:
      "Newton's First Law (the law of inertia) says an object at rest stays at rest, and an object in motion stays in motion at constant velocity, unless a net force acts on it.",
    difficulty: "easy",
    subject: "physics",
    topic: "newtonian-mechanics",
  },
  {
    id: "physics-newtonian-mechanics-002",
    type: "multiple-choice",
    question: "What does the equation F = ma relate?",
    options: ["Net force, mass, and acceleration", "Force, distance, and time", "Mass, height, and speed", "Potential energy and kinetic energy"],
    correctAnswer: "Net force, mass, and acceleration",
    explanation:
      "F = ma is Newton's Second Law: the net force on an object equals its mass multiplied by its acceleration.",
    difficulty: "easy",
    subject: "physics",
    topic: "newtonian-mechanics",
  },
  {
    id: "physics-newtonian-mechanics-003",
    type: "multiple-choice",
    question: "According to Newton's Third Law, what happens whenever one object exerts a force on another?",
    options: ["The second object exerts an equal and opposite force back on the first", "The second object always stays perfectly still", "Only the larger object experiences any force at all", "The force disappears once it reaches the second object"],
    correctAnswer: "The second object exerts an equal and opposite force back on the first",
    explanation:
      "Newton's Third Law says forces always come in pairs: for every action force, there's a reaction force of equal size acting in the opposite direction on a different object.",
    difficulty: "easy",
    subject: "physics",
    topic: "newtonian-mechanics",
  },
  {
    id: "physics-newtonian-mechanics-004",
    type: "multiple-choice",
    question: "What is the key difference between mass and weight?",
    options: ["Mass is how much matter an object has and stays constant; weight is the force of gravity on it and can change", "Mass and weight are just two different names for exactly the same thing", "Weight is constant everywhere; mass changes depending on location", "Mass is measured in newtons and weight is measured in kilograms"],
    correctAnswer: "Mass is how much matter an object has and stays constant; weight is the force of gravity on it and can change",
    explanation:
      "Mass measures the amount of matter in an object and doesn't change with location. Weight is the force gravity exerts on that mass, so it changes depending on where the object is (for example, weaker gravity would mean less weight for the same mass).",
    difficulty: "easy",
    subject: "physics",
    topic: "newtonian-mechanics",
  },
  {
    id: "physics-newtonian-mechanics-005",
    type: "multiple-choice",
    question: "When two forces push on a box from opposite sides, what determines how the box actually moves?",
    options: ["The net force — the difference between the two opposing forces", "Only the larger of the two forces, with the smaller one ignored entirely", "The sum of the two forces, regardless of direction", "The box always stays still whenever two forces act on it"],
    correctAnswer: "The net force — the difference between the two opposing forces",
    explanation:
      "When forces act in opposite directions, it's the net force — what's left over after the smaller force partially cancels the larger one — that determines the box's motion, not either force alone.",
    difficulty: "easy",
    subject: "physics",
    topic: "newtonian-mechanics",
  },
  {
    id: "physics-newtonian-mechanics-006",
    type: "multiple-choice",
    question: "What does it mean for two opposing forces on an object to be 'balanced'?",
    options: ["They are equal in size, so the net force is zero", "They are both pointing in the same direction", "One of the forces is exactly zero", "The object is moving at a constant high speed"],
    correctAnswer: "They are equal in size, so the net force is zero",
    explanation:
      "Balanced forces are equal in magnitude and opposite in direction, so they cancel out to a net force of zero — even though two real forces are still acting on the object.",
    difficulty: "easy",
    subject: "physics",
    topic: "newtonian-mechanics",
  },
  {
    id: "physics-newtonian-mechanics-007",
    type: "multiple-choice",
    question: "If the forces pushing a box from opposite sides are unbalanced, what happens?",
    options: ["The box moves in the direction of the stronger force", "The box stays perfectly still", "The box moves in the direction of the weaker force", "The box moves in a circle"],
    correctAnswer: "The box moves in the direction of the stronger force",
    explanation:
      "Unbalanced forces produce a nonzero net force, and the object moves (accelerates) in the direction of that net force — which points the same way as whichever original force was larger.",
    difficulty: "easy",
    subject: "physics",
    topic: "newtonian-mechanics",
  },
  {
    id: "physics-newtonian-mechanics-008",
    type: "multiple-choice",
    question: "What is potential energy?",
    options: ["Stored energy an object has because of its position, such as its height", "The energy an object has only while it's moving", "The total energy lost to friction", "A measure of how much force an object can exert"],
    correctAnswer: "Stored energy an object has because of its position, such as its height",
    explanation:
      "Potential energy is stored energy due to an object's position — a ball held high above the ground has more potential energy than the same ball resting on the ground.",
    difficulty: "easy",
    subject: "physics",
    topic: "newtonian-mechanics",
  },
  {
    id: "physics-newtonian-mechanics-009",
    type: "multiple-choice",
    question: "What is kinetic energy?",
    options: ["The energy an object has because it is moving", "The energy an object has because of its height", "The total force acting on an object", "The energy an object loses when it speeds up"],
    correctAnswer: "The energy an object has because it is moving",
    explanation:
      "Kinetic energy is the energy of motion — the faster an object moves, the more kinetic energy it has.",
    difficulty: "easy",
    subject: "physics",
    topic: "newtonian-mechanics",
  },
  {
    id: "physics-newtonian-mechanics-010",
    type: "multiple-choice",
    question: "What does the law of conservation of energy say, in simple terms?",
    options: ["Energy isn't created or destroyed, only converted from one form to another", "Energy always increases over time in any system", "Kinetic energy and potential energy are always equal to each other", "Energy disappears once an object stops moving"],
    correctAnswer: "Energy isn't created or destroyed, only converted from one form to another",
    explanation:
      "Conservation of energy means the total amount of energy in a closed system stays the same — it just changes form, such as potential energy converting into kinetic energy as a ball rolls downhill.",
    difficulty: "easy",
    subject: "physics",
    topic: "newtonian-mechanics",
  },
  {
    id: "physics-newtonian-mechanics-011",
    type: "multiple-choice",
    question: "A net force of 20 N acts on a 5 kg object. What is its acceleration?",
    options: ["4 m/s²", "100 m/s²", "0.25 m/s²", "25 m/s²"],
    correctAnswer: "4 m/s²",
    explanation:
      "Rearranging F = ma for acceleration gives a = F/m = 20 \\div 5 = 4 \\text{ m/s}^2.",
    difficulty: "medium",
    subject: "physics",
    topic: "newtonian-mechanics",
  },
  {
    id: "physics-newtonian-mechanics-012",
    type: "multiple-choice",
    question: "A net force of 15 N gives an object an acceleration of 3 m/s². What is the object's mass?",
    options: ["5 kg", "45 kg", "0.2 kg", "18 kg"],
    correctAnswer: "5 kg",
    explanation:
      "Rearranging F = ma for mass gives m = F/a = 15 \\div 3 = 5 \\text{ kg}.",
    difficulty: "medium",
    subject: "physics",
    topic: "newtonian-mechanics",
  },
  {
    id: "physics-newtonian-mechanics-013",
    type: "multiple-choice",
    question: "Newton's Third Law says action-reaction pairs are equal and opposite. Why don't they simply cancel each other out?",
    options: ["Because they act on two different objects, not the same object", "They actually do cancel out, which is why nothing ever moves", "Because the reaction force is always slightly smaller than the action force", "Because the reaction force happens a moment later, not at the same time"],
    correctAnswer: "Because they act on two different objects, not the same object",
    explanation:
      "Action-reaction pairs only cancel if they act on the same object — but they never do. Each force in the pair acts on a different object, so each object independently responds to the one force acting on it.",
    difficulty: "medium",
    subject: "physics",
    topic: "newtonian-mechanics",
  },
  {
    id: "physics-newtonian-mechanics-014",
    type: "multiple-choice",
    question: "Between a bowling ball and a tennis ball, which has more inertia?",
    options: ["The bowling ball, because it has more mass", "The tennis ball, because it's easier to move", "They have exactly the same inertia, since both are balls", "Neither object has any inertia unless it's moving"],
    correctAnswer: "The bowling ball, because it has more mass",
    explanation:
      "Inertia is an object's resistance to a change in motion, and it depends directly on mass — a more massive object (like a bowling ball) has more inertia and is harder to start moving or stop than a less massive one.",
    difficulty: "medium",
    subject: "physics",
    topic: "newtonian-mechanics",
  },
  {
    id: "physics-newtonian-mechanics-015",
    type: "multiple-choice",
    question: "A box has a 50 N force pushing it to the right and a 30 N force pushing it to the left. What is the net force on the box?",
    options: ["20 N to the right", "80 N to the right", "20 N to the left", "0 N — the forces cancel"],
    correctAnswer: "20 N to the right",
    explanation:
      "Net force is the difference between the two opposing forces: 50 \\text{ N} - 30 \\text{ N} = 20 \\text{ N}, in the direction of the larger force (right).",
    difficulty: "medium",
    subject: "physics",
    topic: "newtonian-mechanics",
  },
  {
    id: "physics-newtonian-mechanics-016",
    type: "multiple-choice",
    question: "A box has a 25 N force pushing it to the right and a 60 N force pushing it to the left. Which way does it move, and what is the net force?",
    options: ["Left, with a net force of 35 N", "Right, with a net force of 35 N", "Left, with a net force of 85 N", "It stays still, since both forces are acting"],
    correctAnswer: "Left, with a net force of 35 N",
    explanation:
      "The leftward force is larger, so the net force points left: 60 \\text{ N} - 25 \\text{ N} = 35 \\text{ N} to the left, and the box moves that way.",
    difficulty: "medium",
    subject: "physics",
    topic: "newtonian-mechanics",
  },
  {
    id: "physics-newtonian-mechanics-017",
    type: "multiple-choice",
    question: "A ball is placed twice as high up the hill as before, with its mass unchanged. What happens to its potential energy?",
    options: ["It doubles", "It stays the same", "It quadruples", "It's cut in half"],
    correctAnswer: "It doubles",
    explanation:
      "Potential energy is PE = mgh. With mass and gravity fixed, PE is directly proportional to height, so doubling the height doubles the potential energy.",
    difficulty: "medium",
    subject: "physics",
    topic: "newtonian-mechanics",
  },
  {
    id: "physics-newtonian-mechanics-018",
    type: "multiple-choice",
    question: "Which set of units is consistent with the equation F = ma?",
    options: ["newtons = kilograms × (meters per second squared)", "newtons = kilograms ÷ (meters per second squared)", "newtons = kilograms × (meters per second)", "newtons = (kilograms × meters) squared"],
    correctAnswer: "newtons = kilograms × (meters per second squared)",
    explanation:
      "Since F = ma, the unit of force (newtons) must equal the unit of mass (kg) multiplied by the unit of acceleration (m/s²): N = kg·m/s².",
    difficulty: "medium",
    subject: "physics",
    topic: "newtonian-mechanics",
  },
  {
    id: "physics-newtonian-mechanics-019",
    type: "multiple-choice",
    question: "As a ball rolls down a hill from a height, which energy transformation is taking place?",
    options: ["Potential energy is converting into kinetic energy", "Kinetic energy is converting into potential energy", "Potential energy is being destroyed entirely", "No transformation happens until the ball reaches the bottom"],
    correctAnswer: "Potential energy is converting into kinetic energy",
    explanation:
      "As height decreases going down the hill, potential energy (which depends on height) decreases while kinetic energy (which depends on speed) increases — potential energy is being converted into kinetic energy.",
    difficulty: "medium",
    subject: "physics",
    topic: "newtonian-mechanics",
  },
  {
    id: "physics-newtonian-mechanics-020",
    type: "multiple-choice",
    question: "A ball is released from rest at the top of a hill and rolls to the bottom with no friction. How does its potential energy at the top compare to its kinetic energy at the bottom?",
    options: ["They are equal", "The potential energy at the top is always larger", "The kinetic energy at the bottom is always larger", "There's no relationship between the two"],
    correctAnswer: "They are equal",
    explanation:
      "Since the ball starts with zero kinetic energy and ends with zero potential energy (at the bottom), conservation of energy (PE_i + KE_i = PE_f + KE_f) means all of the initial potential energy converts into kinetic energy: PE_i = KE_f.",
    difficulty: "medium",
    subject: "physics",
    topic: "newtonian-mechanics",
  },
  {
    id: "physics-newtonian-mechanics-021",
    type: "multiple-choice",
    question: "A constant net force acts on an object. If the object's mass is doubled while the force stays the same, what happens to its acceleration?",
    options: ["It is cut in half", "It doubles", "It stays exactly the same", "It quadruples"],
    correctAnswer: "It is cut in half",
    explanation:
      "From a = F/m, acceleration is inversely proportional to mass when force is constant. Doubling the mass halves the acceleration.",
    difficulty: "hard",
    subject: "physics",
    topic: "newtonian-mechanics",
  },
  {
    id: "physics-newtonian-mechanics-022",
    type: "multiple-choice",
    question: "A net force accelerates a 2 kg object at 6 m/s². If that exact same force is instead applied to a 6 kg object, what will its acceleration be?",
    options: ["2 m/s²", "18 m/s²", "4 m/s²", "12 m/s²"],
    correctAnswer: "2 m/s²",
    explanation:
      "First find the force from the original scenario: F = ma = 2 \\times 6 = 12 \\text{ N}. Applying that same 12 N to the 6 kg object gives a = F/m = 12 \\div 6 = 2 \\text{ m/s}^2.",
    difficulty: "hard",
    subject: "physics",
    topic: "newtonian-mechanics",
  },
  {
    id: "physics-newtonian-mechanics-023",
    type: "multiple-choice",
    question: "A moving object's speed doubles, while its mass stays the same. What happens to its kinetic energy?",
    options: ["It becomes 4 times as large", "It becomes 2 times as large", "It stays the same", "It becomes half as large"],
    correctAnswer: "It becomes 4 times as large",
    explanation:
      "Kinetic energy is KE = \\tfrac{1}{2}mv^2. Because it depends on velocity squared, doubling the speed multiplies the kinetic energy by 2^2 = 4, not just 2 — this is a common trap since it doesn't scale the same way as, for example, potential energy does with height.",
    difficulty: "hard",
    subject: "physics",
    topic: "newtonian-mechanics",
  },
  {
    id: "physics-newtonian-mechanics-024",
    type: "multiple-choice",
    question: "A 2 kg ball sits 5 m above the ground. Using g ≈ 10 m/s², what is its potential energy?",
    options: ["100 J", "20 J", "50 J", "1000 J"],
    correctAnswer: "100 J",
    explanation:
      "PE = mgh = 2 \\text{ kg} \\times 10 \\text{ m/s}^2 \\times 5 \\text{ m} = 100 \\text{ J}.",
    difficulty: "hard",
    subject: "physics",
    topic: "newtonian-mechanics",
  },
  {
    id: "physics-newtonian-mechanics-025",
    type: "multiple-choice",
    question: "A ball is released from rest at a height of 5 m and rolls down with no friction. Using g ≈ 10 m/s², what is its speed just before it reaches the bottom?",
    options: ["10 m/s", "50 m/s", "100 m/s", "5 m/s"],
    correctAnswer: "10 m/s",
    explanation:
      "By conservation of energy, all potential energy converts to kinetic energy: mgh = \\tfrac{1}{2}mv^2. The mass cancels, leaving v = \\sqrt{2gh} = \\sqrt{2 \\times 10 \\times 5} = \\sqrt{100} = 10 \\text{ m/s}.",
    difficulty: "hard",
    subject: "physics",
    topic: "newtonian-mechanics",
  },
  {
    id: "physics-newtonian-mechanics-026",
    type: "multiple-choice",
    question: "In a tug-of-war, the rope isn't moving because both teams are pulling with equal force. Does this mean no force is being applied to the rope at all?",
    options: ["No — two real, often very large forces are being applied; they just happen to be balanced, giving a net force of zero", "Yes — if the rope isn't moving, neither team can actually be pulling on it", "No — but only one of the two teams is applying an actual force", "Yes, and the rope will begin moving the instant either team stops pulling as hard"],
    correctAnswer: "No — two real, often very large forces are being applied; they just happen to be balanced, giving a net force of zero",
    explanation:
      "Balanced forces doesn't mean absent forces. Both teams can be pulling extremely hard; as long as their forces are equal and opposite, the net force is zero and the rope stays still, even though real force is being applied by both sides.",
    difficulty: "hard",
    subject: "physics",
    topic: "newtonian-mechanics",
  },
  {
    id: "physics-newtonian-mechanics-027",
    type: "multiple-choice",
    question: "Two skaters of very different mass push off from each other on frictionless ice. By Newton's Third Law, the force each skater feels is equal and opposite. Why don't they end up moving at the same speed?",
    options: ["Equal force doesn't mean equal acceleration — the lighter skater accelerates more, since a = F/m", "They actually do always end up moving at exactly the same speed", "The heavier skater secretly experiences a smaller force than the lighter one", "Only the skater who pushes first experiences any force at all"],
    correctAnswer: "Equal force doesn't mean equal acceleration — the lighter skater accelerates more, since a = F/m",
    explanation:
      "The push gives both skaters equal-sized forces, but F = ma means the resulting acceleration depends on mass too. The lighter skater, having less mass, accelerates more from the same force and ends up moving away faster than the heavier skater.",
    difficulty: "hard",
    subject: "physics",
    topic: "newtonian-mechanics",
  },
  {
    id: "physics-newtonian-mechanics-028",
    type: "multiple-choice",
    question: "Can two forces acting on an object be 'balanced' (net force of zero) even if each individual force is very large?",
    options: ["Yes — balance depends only on the forces being equal and opposite, not on how large they individually are", "No — balanced forces must always be small in size", "No — balance only happens when both forces happen to equal exactly zero", "Yes, but only if the object is also very massive"],
    correctAnswer: "Yes — balance depends only on the forces being equal and opposite, not on how large they individually are",
    explanation:
      "Whether forces are balanced depends purely on whether they're equal in magnitude and opposite in direction — two enormous but equal opposing forces are just as balanced as two tiny equal opposing forces, both producing zero net force.",
    difficulty: "hard",
    subject: "physics",
    topic: "newtonian-mechanics",
  },
  {
    id: "physics-newtonian-mechanics-029",
    type: "multiple-choice",
    question: "Two balls of different mass are released from rest at the same height on a hill, with friction ignored. Which one reaches the bottom moving faster?",
    options: ["They reach the bottom at the same speed", "The heavier ball is moving faster at the bottom", "The lighter ball is moving faster at the bottom", "It depends on what the balls are made of"],
    correctAnswer: "They reach the bottom at the same speed",
    explanation:
      "Setting mgh = \\tfrac{1}{2}mv^2 and solving for speed gives v = \\sqrt{2gh} — the mass cancels out completely, so every mass reaches the same speed at the bottom, given the same starting height and no friction.",
    difficulty: "hard",
    subject: "physics",
    topic: "newtonian-mechanics",
  },
  {
    id: "physics-newtonian-mechanics-030",
    type: "multiple-choice",
    question: "A 3 kg object has a 10 N force pushing it to the right and a 4 N force pushing it to the left. What is its acceleration?",
    options: ["2 m/s² to the right", "3.33 m/s² to the right", "4.67 m/s² to the right", "2 m/s² to the left"],
    correctAnswer: "2 m/s² to the right",
    explanation:
      "First find the net force: 10 \\text{ N} - 4 \\text{ N} = 6 \\text{ N} to the right. Then apply F = ma to find acceleration: a = F/m = 6 \\div 3 = 2 \\text{ m/s}^2 to the right.",
    difficulty: "hard",
    subject: "physics",
    topic: "newtonian-mechanics",
  },
];

export const physicsNewtonianMechanicsQuiz: QuizMeta = {
  id: "physics-newtonian-mechanics",
  title: "Newtonian Mechanics Quiz",
  subjectSlug: "physics",
  subjectLabel: "Physics",
  topicLabel: "Newtonian Mechanics",
  colorToken: "physics",
  backHref: "/dashboard/physics/newtons-laws",
  description:
    "Test your understanding of Newton's three laws, net force, balanced and unbalanced forces, and potential and kinetic energy.",
  difficulty: "medium",
  estimatedTime: 15,
  questions,
};

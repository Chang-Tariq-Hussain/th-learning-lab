import type { QuizMeta, QuizQuestion } from "../types";

/**
 * Electromagnetism topic question bank, matching the Interactive
 * Magnet Explorer (bar magnets, poles, attraction/repulsion, field
 * lines) and Interactive Compass Explorer (a compass as a small
 * magnet, following the local field, Earth's field) simulations.
 * Deliberately stays at the level those two simulations actually
 * teach — bar magnets and compasses — and does not introduce
 * electromagnets, coils, or current-carrying wires, which aren't part
 * of either simulation.
 */
const questions: QuizQuestion[] = [
  {
    id: "physics-electromagnetism-001",
    type: "multiple-choice",
    question: "What happens when you bring two like magnetic poles (N–N or S–S) together?",
    options: ["They attract", "They repel", "Nothing happens", "They cancel each other's field"],
    correctAnswer: "They repel",
    explanation:
      "Like poles repel and opposite poles (N–S) attract — the basic rule of magnetic interaction.",
    difficulty: "easy",
    subject: "physics",
    topic: "electromagnetism",
  },
  {
    id: "physics-electromagnetism-002",
    type: "multiple-choice",
    question: "Outside a bar magnet, magnetic field lines point:",
    options: ["From the north pole to the south pole", "From the south pole to the north pole", "In random directions", "Only along the magnet's length"],
    correctAnswer: "From the north pole to the south pole",
    explanation:
      "By convention, field lines emerge from the north pole and curve around to enter the south pole outside the magnet.",
    difficulty: "easy",
    subject: "physics",
    topic: "electromagnetism",
  },
  {
    id: "physics-electromagnetism-003",
    type: "multiple-choice",
    question: "How many magnetic poles does every magnet have, no matter how small it is?",
    options: ["Two — a north and a south", "Only one — either north or south", "It depends on the magnet's size", "Zero — poles only exist in electromagnets"],
    correctAnswer: "Two — a north and a south",
    explanation:
      "Every magnet, however small, has both a north pole and a south pole together — you can never isolate a single pole on its own.",
    difficulty: "easy",
    subject: "physics",
    topic: "electromagnetism",
  },
  {
    id: "physics-electromagnetism-004",
    type: "multiple-choice",
    question: "What happens when you bring a magnet's north pole close to another magnet's south pole?",
    options: ["They attract", "They repel", "Nothing happens", "They both flip orientation"],
    correctAnswer: "They attract",
    explanation:
      "Opposite poles attract — a north pole and a south pole pull toward each other, the opposite behavior of two like poles.",
    difficulty: "easy",
    subject: "physics",
    topic: "electromagnetism",
  },
  {
    id: "physics-electromagnetism-005",
    type: "multiple-choice",
    question: "What is a compass needle, physically?",
    options: ["A small, lightweight magnet, free to rotate", "A piece of plain iron with no magnetism of its own", "A tiny battery that generates its own field", "A coil of wire wound around a core"],
    correctAnswer: "A small, lightweight magnet, free to rotate",
    explanation:
      "A compass needle is itself a small magnet with its own north and south pole — it's just light and free enough to spin easily in response to outside magnetic fields.",
    difficulty: "easy",
    subject: "physics",
    topic: "electromagnetism",
  },
  {
    id: "physics-electromagnetism-006",
    type: "multiple-choice",
    question: "What is a magnetic field?",
    options: ["The region of space around a magnet where its force can be felt", "The metal core inside a magnet", "The exact point where the north and south poles meet", "A type of electric current"],
    correctAnswer: "The region of space around a magnet where its force can be felt",
    explanation:
      "A magnetic field is the invisible region surrounding a magnet in which its magnetic force acts on other magnets or magnetic materials.",
    difficulty: "easy",
    subject: "physics",
    topic: "electromagnetism",
  },
  {
    id: "physics-electromagnetism-007",
    type: "multiple-choice",
    question: "If you cut a bar magnet exactly in half, what do you get?",
    options: ["Two smaller magnets, each with its own north and south pole", "One piece with only a north pole and one with only a south pole", "Two pieces that are no longer magnetic at all", "One larger magnet, since the two halves recombine their fields"],
    correctAnswer: "Two smaller magnets, each with its own north and south pole",
    explanation:
      "Cutting a magnet never isolates a single pole — each new piece forms its own complete magnet with both a north and a south pole.",
    difficulty: "easy",
    subject: "physics",
    topic: "electromagnetism",
  },
  {
    id: "physics-electromagnetism-008",
    type: "multiple-choice",
    question: "A compass needle's north end lines up with what, at its current position?",
    options: ["The direction of the local magnetic field", "The nearest wall or object, regardless of field", "Whichever direction it was last pointing", "The direction of Earth's rotation"],
    correctAnswer: "The direction of the local magnetic field",
    explanation:
      "A compass needle rotates until it lines up with whatever magnetic field surrounds it — its north pole points along the field's direction at that spot.",
    difficulty: "easy",
    subject: "physics",
    topic: "electromagnetism",
  },
  {
    id: "physics-electromagnetism-009",
    type: "multiple-choice",
    question: "What does a magnetic field line diagram show?",
    options: ["The direction of the magnetic force, and roughly how strong it is, at different points", "The exact temperature of the magnet", "The chemical composition of the magnet", "Only the location of the magnet's center of mass"],
    correctAnswer: "The direction of the magnetic force, and roughly how strong it is, at different points",
    explanation:
      "Field lines show the direction a compass needle would point at each location, and how closely spaced they are shows where the field is stronger or weaker.",
    difficulty: "easy",
    subject: "physics",
    topic: "electromagnetism",
  },
  {
    id: "physics-electromagnetism-010",
    type: "multiple-choice",
    question: "For the purposes of a compass, how does Earth behave?",
    options: ["Like a giant magnet with its own magnetic field", "Like a magnet only at the exact geographic poles", "Earth has no magnetic field of its own", "Like a giant compass needle with no field of its own"],
    correctAnswer: "Like a giant magnet with its own magnetic field",
    explanation:
      "Earth behaves like an enormous magnet buried inside the planet, and it's Earth's own magnetic field that every compass on the surface responds to.",
    difficulty: "easy",
    subject: "physics",
    topic: "electromagnetism",
  },
  {
    id: "physics-electromagnetism-011",
    type: "multiple-choice",
    question: "Two bar magnets are currently attracting each other, facing north-to-south. If you flip one magnet around so its south pole now faces the other magnet's south pole, what happens?",
    options: ["The interaction changes from attraction to repulsion", "The interaction stays exactly the same", "The magnets stop being magnetic", "The field lines disappear entirely"],
    correctAnswer: "The interaction changes from attraction to repulsion",
    explanation:
      "Flipping one magnet turns a north-facing-south pairing (attract) into a south-facing-south pairing — like poles now face each other, so they repel instead.",
    difficulty: "medium",
    subject: "physics",
    topic: "electromagnetism",
  },
  {
    id: "physics-electromagnetism-012",
    type: "multiple-choice",
    question: "Looking at a magnetic field line diagram, where is the magnetic field strongest?",
    options: ["Where the field lines are closest together", "Where the field lines are farthest apart", "Exactly halfway between the two poles", "Field line spacing has no relationship to strength"],
    correctAnswer: "Where the field lines are closest together",
    explanation:
      "Field line density represents field strength — the closer together the lines are drawn, the stronger the magnetic force at that location, typically right near the poles.",
    difficulty: "medium",
    subject: "physics",
    topic: "electromagnetism",
  },
  {
    id: "physics-electromagnetism-013",
    type: "multiple-choice",
    question: "A compass is carried all the way around a single bar magnet, close to its surface. What happens to the needle's direction along the way?",
    options: ["It keeps changing, since the field's direction is different at different points around the magnet", "It stays pointing the same way the entire time", "It only changes when passing the exact poles", "It stops responding once it's more than a few centimeters away"],
    correctAnswer: "It keeps changing, since the field's direction is different at different points around the magnet",
    explanation:
      "Field lines curve through space, so their direction is different at every position around the magnet — the needle continuously re-aligns as the compass moves.",
    difficulty: "medium",
    subject: "physics",
    topic: "electromagnetism",
  },
  {
    id: "physics-electromagnetism-014",
    type: "multiple-choice",
    question: "You want two bar magnets to attract each other. How should you orient them?",
    options: ["So opposite poles face each other (north facing south)", "So like poles face each other (north facing north, or south facing south)", "Orientation doesn't matter — magnets always attract", "They should be placed at a right angle to each other"],
    correctAnswer: "So opposite poles face each other (north facing south)",
    explanation:
      "Attraction happens between opposite poles, so lining up one magnet's north pole with the other's south pole is what produces an attractive interaction.",
    difficulty: "medium",
    subject: "physics",
    topic: "electromagnetism",
  },
  {
    id: "physics-electromagnetism-015",
    type: "multiple-choice",
    question: "A compass needle is deflected slightly by a magnet 20 cm away. If the compass is moved to just 5 cm from the same magnet, what would you expect?",
    options: ["A noticeably stronger deflection, since the field is much stronger at close range", "A weaker deflection, since the needle is now too close to respond", "The exact same deflection as before", "The needle stops responding altogether at close range"],
    correctAnswer: "A noticeably stronger deflection, since the field is much stronger at close range",
    explanation:
      "Magnetic field strength increases sharply the closer you get to a magnet, so a compass much closer to the magnet feels a much stronger pull on its needle.",
    difficulty: "medium",
    subject: "physics",
    topic: "electromagnetism",
  },
  {
    id: "physics-electromagnetism-016",
    type: "multiple-choice",
    question: "Is it possible to make a bar magnet that has only a north pole and no south pole at all?",
    options: ["No — every magnet has both a north and a south pole together", "Yes, if the magnet is made from a special metal", "Yes, if the magnet is cut thin enough", "Yes, but only for electromagnets, not bar magnets"],
    correctAnswer: "No — every magnet has both a north and a south pole together",
    explanation:
      "A single isolated magnetic pole (a 'monopole') has never been observed — every magnet, of any size or shape, always has a north and a south pole together.",
    difficulty: "medium",
    subject: "physics",
    topic: "electromagnetism",
  },
  {
    id: "physics-electromagnetism-017",
    type: "multiple-choice",
    question: "A compass is placed right beside a bar magnet's north pole. Which way does the compass needle's own north end point?",
    options: ["Away from the magnet's north pole, following the field lines outward", "Directly toward the magnet's north pole", "It spins continuously and never settles", "It points straight up, out of the plane of the magnet"],
    correctAnswer: "Away from the magnet's north pole, following the field lines outward",
    explanation:
      "Field lines emerge outward from a magnet's north pole, and a compass needle's north end aligns with the local field direction — so right beside the north pole, it points away from it.",
    difficulty: "medium",
    subject: "physics",
    topic: "electromagnetism",
  },
  {
    id: "physics-electromagnetism-018",
    type: "multiple-choice",
    question: "Two bar magnets are pushed toward each other with like poles facing, so they repel. What single change would make them attract instead?",
    options: ["Turn one magnet around so opposite poles now face each other", "Push them together harder", "Move them farther apart", "Nothing can be changed — like magnets can never attract"],
    correctAnswer: "Turn one magnet around so opposite poles now face each other",
    explanation:
      "Whether magnets attract or repel depends entirely on which poles are facing each other — flipping one magnet swaps a like-pole pairing for an opposite-pole pairing, turning repulsion into attraction.",
    difficulty: "medium",
    subject: "physics",
    topic: "electromagnetism",
  },
  {
    id: "physics-electromagnetism-019",
    type: "multiple-choice",
    question: "How far does a magnet's magnetic field actually extend?",
    options: ["Into the surrounding space in every direction, gradually growing weaker with distance", "Only to points that are physically touching the magnet's surface", "Exactly one magnet-length away, then it stops completely", "Only along the line directly between the north and south poles"],
    correctAnswer: "Into the surrounding space in every direction, gradually growing weaker with distance",
    explanation:
      "A magnetic field fills the space around a magnet in every direction, not just at its surface — it simply gets weaker (not zero) the farther away you measure it.",
    difficulty: "medium",
    subject: "physics",
    topic: "electromagnetism",
  },
  {
    id: "physics-electromagnetism-020",
    type: "multiple-choice",
    question: "A student relabels a magnet's poles, calling the north pole 'red' and the south pole 'blue' instead. Does this change which poles attract or repel?",
    options: ["No — the labels are just names; the underlying pole types and their behavior are unchanged", "Yes — 'red' poles would now repel other 'red' poles differently than norths did", "Yes — relabeling reverses the direction of the field lines", "It depends on which magnet was relabeled first"],
    correctAnswer: "No — the labels are just names; the underlying pole types and their behavior are unchanged",
    explanation:
      "North and south are just conventional names for the two physically distinct pole types. Renaming them doesn't change the physics — like poles (however labeled) still repel, and opposite poles still attract.",
    difficulty: "medium",
    subject: "physics",
    topic: "electromagnetism",
  },
  {
    id: "physics-electromagnetism-021",
    type: "multiple-choice",
    question: "If you cut a bar magnet exactly at its center, why do you get two complete magnets instead of one isolated north pole and one isolated south pole?",
    options: ["Because magnetism comes from countless tiny atomic-scale magnetic regions, and cutting the magnet just regroups them into two smaller complete magnets", "Because the cut magically creates a brand-new pole out of nothing", "Because magnetism only exists at the very tips of a bar magnet, not throughout it", "Because cutting a magnet destroys its magnetism entirely, and the new poles are just leftover static charge"],
    correctAnswer: "Because magnetism comes from countless tiny atomic-scale magnetic regions, and cutting the magnet just regroups them into two smaller complete magnets",
    explanation:
      "A bar magnet's magnetism comes from many tiny aligned magnetic domains throughout the material, not from something located only at the tips. Cutting it simply divides those domains into two groups, each of which still has its own north and south end.",
    difficulty: "hard",
    subject: "physics",
    topic: "electromagnetism",
  },
  {
    id: "physics-electromagnetism-022",
    type: "multiple-choice",
    question: "A compass is placed right beside a bar magnet's south pole. Which way does the compass needle's own north end point?",
    options: ["Toward the magnet's south pole, since that's the direction the field lines curve as they enter it", "Away from the magnet's south pole", "Perpendicular to the magnet, regardless of which pole is nearer", "It cannot be determined without knowing the magnet's strength"],
    correctAnswer: "Toward the magnet's south pole, since that's the direction the field lines curve as they enter it",
    explanation:
      "Field lines curve inward and enter a magnet at its south pole. A compass needle's north end aligns with the local field direction, so right beside the south pole it points toward it — the mirror image of the behavior near a north pole.",
    difficulty: "hard",
    subject: "physics",
    topic: "electromagnetism",
  },
  {
    id: "physics-electromagnetism-023",
    type: "multiple-choice",
    question: "Two bar magnets are oriented to attract each other, some distance apart. If that distance is doubled, what happens to the strength of the attractive force between them?",
    options: ["It decreases, since magnetic field strength falls off rapidly with distance", "It stays exactly the same, since force doesn't depend on distance", "It increases, since the magnets have more room to align their fields", "It becomes exactly zero the instant the distance changes at all"],
    correctAnswer: "It decreases, since magnetic field strength falls off rapidly with distance",
    explanation:
      "Magnetic force weakens quickly as the distance between magnets grows — doubling the separation significantly reduces the strength of the interaction, whether it's attraction or repulsion.",
    difficulty: "hard",
    subject: "physics",
    topic: "electromagnetism",
  },
  {
    id: "physics-electromagnetism-024",
    type: "multiple-choice",
    question: "Two bar magnets are arranged so their north poles face each other (repelling), with a compass placed exactly at the midpoint between them. What would you expect to observe?",
    options: ["The needle may point unpredictably or barely deflect, since the two magnets' fields oppose each other right at that spot", "The needle points confidently toward one of the two north poles", "The needle spins at a constant, steady rate forever", "The compass stops working permanently after being placed there"],
    correctAnswer: "The needle may point unpredictably or barely deflect, since the two magnets' fields oppose each other right at that spot",
    explanation:
      "At the midpoint between two repelling north poles, the field contribution from each magnet points roughly opposite the other, so they can largely cancel — leaving the needle without a strong, consistent direction to settle into.",
    difficulty: "hard",
    subject: "physics",
    topic: "electromagnetism",
  },
  {
    id: "physics-electromagnetism-025",
    type: "multiple-choice",
    question: "Why do magnets always come with two poles, never just one?",
    options: ["Because magnetism arises from many tiny aligned magnetic regions inside the material, and every one of those regions already has its own north and south end", "Because a single pole would violate the law of conservation of energy", "Because magnetic poles are created only by electric current, and current always flows in a complete loop", "Because manufacturers choose to always produce magnets in pairs of poles"],
    correctAnswer: "Because magnetism arises from many tiny aligned magnetic regions inside the material, and every one of those regions already has its own north and south end",
    explanation:
      "At the smallest scale, magnetism comes from countless aligned magnetic domains, each already having both a north and south end. However a magnet is made or divided, those paired ends persist — a single isolated pole has never been observed.",
    difficulty: "hard",
    subject: "physics",
    topic: "electromagnetism",
  },
  {
    id: "physics-electromagnetism-026",
    type: "multiple-choice",
    question: "A ship's compass swings to point in an unexpected direction whenever it's placed right next to a large iron structure on board, but points normally far away from any structures. What does this most likely suggest?",
    options: ["The iron structure has become magnetized and creates its own field that competes with Earth's field at short range", "The compass is broken and needs to be replaced", "Iron always blocks magnetic fields completely, so the compass should show nothing at all", "Earth's magnetic field only exists on land, not on ships"],
    correctAnswer: "The iron structure has become magnetized and creates its own field that competes with Earth's field at short range",
    explanation:
      "A compass always follows the local magnetic field, not necessarily Earth's alone. A nearby magnetized iron structure creates its own field, which can dominate close up even though Earth's much weaker but far more extensive field wins out farther away.",
    difficulty: "hard",
    subject: "physics",
    topic: "electromagnetism",
  },
  {
    id: "physics-electromagnetism-027",
    type: "multiple-choice",
    question: "If you place a compass at many positions in a circle around a single bar magnet and mark the direction its needle points each time, what do those marks trace out?",
    options: ["The magnet's magnetic field lines", "A perfect circle, regardless of the magnet's field", "The magnet's physical outline", "Nothing meaningful — the directions would be random"],
    correctAnswer: "The magnet's magnetic field lines",
    explanation:
      "Since a compass needle always aligns with the local field direction, tracking how it points at many surrounding positions and connecting those directions is exactly how magnetic field lines are mapped out in the first place.",
    difficulty: "hard",
    subject: "physics",
    topic: "electromagnetism",
  },
  {
    id: "physics-electromagnetism-028",
    type: "multiple-choice",
    question: "A student says, \"a compass's north end points toward Earth's geographic North Pole because that's where the strongest magnetism is created.\" What's the more accurate explanation?",
    options: ["Earth behaves like a giant magnet, and the region near the geographic North Pole acts like a magnetic south pole — which is exactly why it attracts a compass's north end", "The student is correct — Earth's geographic North Pole is where all of Earth's magnetism originates", "Compasses don't actually respond to Earth's magnetism at all, only to nearby objects", "The compass's north end is repelled by, not attracted to, the geographic North Pole"],
    correctAnswer: "Earth behaves like a giant magnet, and the region near the geographic North Pole acts like a magnetic south pole — which is exactly why it attracts a compass's north end",
    explanation:
      "Since opposite poles attract, a compass needle's north end being pulled toward Earth's geographic north means that region must behave like a magnetic south pole — a subtle but well-established point about how Earth's magnetic field is oriented.",
    difficulty: "hard",
    subject: "physics",
    topic: "electromagnetism",
  },
  {
    id: "physics-electromagnetism-029",
    type: "multiple-choice",
    question: "Which of the following would NOT increase the strength of the magnetic interaction between two bar magnets?",
    options: ["Increasing the distance between them", "Bringing them closer together", "Using stronger magnets", "Aligning them so opposite poles directly face each other"],
    correctAnswer: "Increasing the distance between them",
    explanation:
      "Every listed change except increasing distance would strengthen the interaction — moving magnets farther apart weakens the field they experience from each other, since magnetic force falls off with distance rather than growing.",
    difficulty: "hard",
    subject: "physics",
    topic: "electromagnetism",
  },
  {
    id: "physics-electromagnetism-030",
    type: "multiple-choice",
    question: "A bar magnet is snapped into three separate pieces instead of two. In total, how many magnetic poles do the three resulting pieces have altogether?",
    options: ["Six — each of the three pieces becomes its own complete magnet with one north and one south pole", "Two — the original magnet's poles are simply shared among the three pieces", "Three — one pole per piece", "It's impossible to say without knowing exactly where the cuts were made"],
    correctAnswer: "Six — each of the three pieces becomes its own complete magnet with one north and one south pole",
    explanation:
      "Every piece of a broken magnet becomes a complete magnet with both a north and a south pole, regardless of how many pieces it's broken into. Three pieces means three complete magnets, and 3 \\times 2 = 6 poles in total.",
    difficulty: "hard",
    subject: "physics",
    topic: "electromagnetism",
  },
];

export const physicsElectromagnetismQuiz: QuizMeta = {
  id: "physics-electromagnetism",
  title: "Electromagnetism Quiz",
  subjectSlug: "physics",
  subjectLabel: "Physics",
  topicLabel: "Electromagnetism",
  colorToken: "physics",
  backHref: "/dashboard/physics/magnet-explorer",
  description:
    "Test your understanding of magnetic poles, attraction and repulsion, magnetic fields, and how a compass follows them.",
  difficulty: "medium",
  estimatedTime: 15,
  questions,
};

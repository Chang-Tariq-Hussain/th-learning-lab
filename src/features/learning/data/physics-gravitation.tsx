import type { TopicContent } from "../types";

/**
 * Gravitation — Batch 3's third and final topic, built to the same
 * full standard (Learn, Predict, Explore, Explain, Practice,
 * Challenge) as Momentum and Circular Motion before it. Its Explore
 * experience is the new `Gravitation` lab
 * (`@/features/subjects/physics/gravitation`) — inspecting the
 * codebase first (per this batch's instructions) found no existing
 * Gravitation simulation, but did find the shared physics engine's
 * `NewtonianGravity` force generator already written, unused, with an
 * orbital-motion scene explicitly in mind in its own doc comments. The
 * Orbit panel reuses it directly rather than writing a new physics
 * engine. All content below is grounded in that lab's real two
 * panels: Force Lab (Mass 1/2 in ×10²⁴ kg, Distance in ×10⁶ m, plus a
 * Weight & Worlds comparison) and Orbit (Central mass, Satellite mass,
 * Initial distance, Initial speed, in idealized units).
 */

/** A small diagram of an orbit: gravity's inward force continuously
 *  turning a fast sideways velocity into a curved path — the one
 *  image this topic's Learn step needs to make "orbit ≠ just falling
 *  down" click visually, the same role Circular Motion's sketch
 *  played for "constant speed but still accelerating." */
const orbitSketch = (
  <svg viewBox="0 0 260 200" className="mx-auto h-48 w-full max-w-xs" role="img" aria-labelledby="orbit-sketch-title">
    <title id="orbit-sketch-title">
      A satellite on an orbital path around a central body. Its velocity vector points tangent to the path, in the direction of travel. Its acceleration vector, caused by gravity, points from the satellite straight toward the central body — continuously turning the velocity to keep it on a curved path instead of a straight line.
    </title>
    <ellipse cx="130" cy="105" rx="85" ry="55" fill="none" strokeDasharray="4 5" strokeWidth="1.5" className="stroke-ink/25 dark:stroke-bone/25" />
    <circle cx="130" cy="105" r="10" className="fill-[#E0524F]" />
    <text x="130" y="128" textAnchor="middle" className="fill-ink-soft font-mono text-[9px] dark:fill-bone-soft">
      central body
    </text>

    <circle cx="205" cy="65" r="6" className="fill-[#2E9E5B] stroke-[#2E9E5B]" strokeWidth="1.5" />

    <line x1="205" y1="65" x2="188" y2="33" strokeWidth="2.5" className="stroke-[#3D5AFE]" markerEnd="url(#orbit-arrow-v)" />
    <text x="180" y="24" textAnchor="middle" className="fill-[#3D5AFE] font-mono text-[10px] font-semibold">v</text>

    <line x1="205" y1="65" x2="162" y2="90" strokeWidth="2.5" className="stroke-[#E0524F]" markerEnd="url(#orbit-arrow-a)" />
    <text x="176" y="83" textAnchor="middle" className="fill-[#E0524F] font-mono text-[10px] font-semibold">g</text>

    <text x="10" y="16" className="fill-ink-soft font-mono text-[10px] uppercase tracking-wide dark:fill-bone-soft">
      Gravity keeps turning velocity inward
    </text>

    <defs>
      <marker id="orbit-arrow-v" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 Z" className="fill-[#3D5AFE]" />
      </marker>
      <marker id="orbit-arrow-a" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 Z" className="fill-[#E0524F]" />
      </marker>
    </defs>
  </svg>
);

export const physicsGravitationContent: TopicContent = {
  subjectSlug: "physics",
  topicSlug: "gravitation",
  title: "Gravitation",
  subjectLabel: "Physics",
  topicLabel: "Circular Motion & Gravitation",
  colorToken: "physics",
  simulationHref: "/dashboard/physics/gravitation",

  learn: {
    objectives: [
      "State Newton's law of universal gravitation, F = Gm₁m₂/r², and explain what each part means.",
      "Explain how gravitational force depends on mass (directly) and distance (inverse-square), and predict how changes to each affect the force.",
      "Explain the difference between mass and weight, and calculate weight using W = mg.",
      "Explain why gravitational acceleration near Earth's surface is approximately the same for every ordinary object, and why gravitational acceleration itself varies by location.",
      "Explain, at an introductory level, how gravity produces orbital motion by continuously changing an object's velocity direction.",
    ],
    concepts: [
      {
        term: "Gravity",
        explanation:
          "Gravity is the attractive force every object with mass exerts on every other object with mass. It's the weakest of the four fundamental forces, but because it always attracts (never repels) and has unlimited range, it's the force that shapes planets, stars, and galaxies at the largest scales.",
      },
      {
        term: "Universal gravitation",
        explanation:
          "Every mass in the universe attracts every other mass — not just planets and stars. You and the person next to you attract each other gravitationally too; the force is simply far too small, given your masses, to ever notice.",
        formula: "F = \\dfrac{G m_1 m_2}{r^2}",
        formulaCaption: "gravitational force = G × mass 1 × mass 2 ÷ distance²",
      },
      {
        term: "Mass and gravitational force",
        explanation:
          "Gravitational force is directly proportional to each object's mass. Doubling either mass doubles the force between the two objects; doubling both masses at once quadruples it.",
      },
      {
        term: "Distance and gravitational force — the inverse-square relationship",
        explanation:
          "Gravitational force falls off with the square of the distance between two objects' centers, not distance itself. Doubling the distance doesn't halve the force — it cuts it to a quarter. Tripling the distance cuts it to a ninth. This inverse-square relationship means gravity weakens very quickly as objects move apart, even though it technically never reaches exactly zero.",
      },
      {
        term: "Mass vs. weight",
        explanation:
          "Mass is the amount of matter an object contains, and its resistance to acceleration — an intrinsic property that doesn't depend on location. Weight is the gravitational force acting on that mass, and it does depend on location, since it depends on the local gravitational acceleration. An astronaut's mass is identical on Earth, the Moon, and in deep space; their weight is not.",
        formula: "W = mg",
        formulaCaption: "weight = mass × local gravitational acceleration",
      },
      {
        term: "Gravitational acceleration",
        explanation:
          "Gravitational acceleration, g = GM/r², is how fast a (comparatively small) object accelerates toward a mass M at distance r. Crucially, the falling object's own mass doesn't appear in this formula — it cancels out, which is why ordinary objects near Earth's surface all accelerate at approximately the same rate regardless of their own mass. But g itself is not a universal constant: it depends on which mass you're near and how far away you are, so it's genuinely different on the Moon, on Mars, at high altitude, or anywhere else the local M and r differ.",
      },
      {
        term: "Orbits",
        explanation:
          "An orbit isn't simply \"gravity pulling an object downward.\" An orbiting object is moving sideways fast enough that as gravity continuously pulls it toward the central body, its path curves — the object keeps \"falling\" toward the center but also keeps moving forward fast enough to keep missing it, tracing out a closed path instead of hitting the ground or flying off in a straight line.",
      },
    ],
    whyItMatters:
      "Gravitation explains why every planet, moon, and star is round, why the Moon orbits Earth and Earth orbits the Sun, why astronauts appear to float even though gravity is still very much acting on them, why your weight on a bathroom scale would read differently on Mars, and how engineers calculate the exact speed a satellite needs to stay in orbit instead of falling back to Earth or drifting off into space.",
    keyTerms: [
      { term: "Gravitational constant (G)", definition: "The fixed constant of proportionality in F = Gm₁m₂/r², equal to about 6.674×10⁻¹¹ N·m²/kg² — the same everywhere in the universe." },
      { term: "Gravitational force", definition: "The attractive force between two masses, F = Gm₁m₂/r² — proportional to both masses, inversely proportional to distance squared." },
      { term: "Inverse-square relationship", definition: "A quantity that falls off in proportion to 1/r² — doubling distance cuts the quantity to a quarter, not a half." },
      { term: "Mass", definition: "The amount of matter in an object, and its resistance to acceleration — an intrinsic property, unaffected by location." },
      { term: "Weight", definition: "The gravitational force acting on an object's mass, W = mg — dependent on the local gravitational acceleration, and therefore on location." },
      { term: "Gravitational acceleration (g)", definition: "How fast a small object accelerates toward a larger mass M at distance r: g = GM/r² — independent of the small object's own mass, but dependent on location." },
      { term: "Orbit", definition: "A closed path traced by an object whose sideways velocity, continuously redirected by gravity, keeps curving around a central body instead of colliding with it or escaping." },
    ],
    visualAids: [
      {
        id: "orbit-sketch",
        caption:
          "A satellite on an orbital path: its velocity vector (blue) points tangent to the path, in the direction of travel, while gravity's acceleration (red) points from the satellite straight toward the central body — continuously turning the velocity to keep the path curving rather than flying off in a straight line.",
        visual: orbitSketch,
      },
    ],
    misconceptions: [
      {
        id: "misconception-no-gravity-in-space",
        misconception: "There's no gravity in space, which is why astronauts float around inside orbiting spacecraft.",
        correction:
          "Gravity is still very much present at orbital altitudes — at the International Space Station's altitude, Earth's gravity is only about 10% weaker than at the surface. Astronauts float because they and their spacecraft are both in continuous free fall around Earth together, not because gravity has switched off.",
      },
      {
        id: "misconception-mass-changes-by-planet",
        misconception: "An object's mass changes depending on which planet it's on.",
        correction:
          "Mass is intrinsic to an object — how much matter it contains — and stays exactly the same wherever it goes. It's weight, the gravitational force acting on that mass, that changes from world to world, since different worlds have different surface gravitational accelerations.",
      },
      {
        id: "misconception-gravity-is-constant-everywhere",
        misconception: "Gravity (specifically, gravitational acceleration) is the same strength everywhere in the universe.",
        correction:
          "The gravitational constant G truly is the same everywhere, but gravitational acceleration, g = GM/r², depends on the mass you're near and your distance from it — so it's genuinely different on the Moon, on Mars, on Jupiter, and even varies slightly with altitude on Earth itself.",
      },
      {
        id: "misconception-orbit-is-just-falling-down",
        misconception: "An orbit is just an object continuously falling straight down toward a planet.",
        correction:
          "An orbiting object is falling toward the central body, but it's also moving sideways fast enough that the ground (or the central body) keeps curving away beneath it at the same rate gravity pulls it in — so instead of landing, it keeps missing, tracing out a closed path around the central body instead of a straight drop.",
      },
    ],
  },

  predict: {
    intro:
      "Commit to a prediction before you touch the controls below — then run the matching setup in the lab and check your answer.",
    scenarios: [
      {
        id: "physics-gravitation-predict-001",
        scenario: "On the Force Lab tab, you increase Mass 1 while keeping Mass 2 and Distance fixed.",
        question: "What happens to the gravitational force between the two objects?",
        options: [
          { id: "increases-proportionally", label: "It increases, in direct proportion to Mass 1" },
          { id: "increases-squared", label: "It increases with the square of Mass 1" },
          { id: "stays-same", label: "It stays the same, since force doesn't depend on individual masses" },
          { id: "decreases", label: "It decreases" },
        ],
        actualResultOptionId: "increases-proportionally",
        explanation:
          "F = Gm₁m₂/r² has m₁ in the numerator to the first power, so force increases in direct, linear proportion to Mass 1 — doubling Mass 1 doubles the force, not more and not less.",
        hint: "Look at where m₁ sits in the formula F = Gm₁m₂/r² — is it raised to any power other than 1?",
      },
      {
        id: "physics-gravitation-predict-002",
        scenario: "On the Force Lab tab, you double the Distance between the two objects, keeping both masses fixed.",
        question: "What happens to the gravitational force between them?",
        options: [
          { id: "quarter", label: "It's cut to a quarter of its original value" },
          { id: "half", label: "It's cut in half" },
          { id: "same", label: "It stays exactly the same" },
          { id: "double", label: "It doubles" },
        ],
        actualResultOptionId: "quarter",
        explanation:
          "Distance appears squared in the denominator of F = Gm₁m₂/r², so doubling it divides the whole force by 2² = 4 — the inverse-square relationship, not a simple halving.",
        hint: "Distance is squared before being divided into the formula. What does squaring 2 give you?",
      },
      {
        id: "physics-gravitation-predict-003",
        scenario: "You move a satellite farther away from Earth, increasing its distance from Earth's center.",
        question: "What happens to the gravitational attraction between the satellite and Earth?",
        options: [
          { id: "decreases-fast", label: "It decreases, and quickly — inverse-square means even a modest distance increase weakens it a lot" },
          { id: "increases", label: "It increases, since there's more space for gravity to act across" },
          { id: "stays-same", label: "It stays exactly the same at any distance" },
          { id: "vanishes-immediately", label: "It drops to exactly zero the moment the satellite leaves the atmosphere" },
        ],
        actualResultOptionId: "decreases-fast",
        explanation:
          "Gravitational attraction falls off as 1/r² — it decreases quickly as distance grows, though it technically never reaches exactly zero at any finite distance, no matter how far away the satellite gets.",
        hint: "Which relationship governs how gravitational force changes with distance? Is it a gentle decrease, or a steep one?",
      },
      {
        id: "physics-gravitation-predict-004",
        scenario: "On the Weight & Worlds panel, you compare the same 70 kg person's mass and weight across several different worlds.",
        question: "Does the person's mass change from world to world?",
        options: [
          { id: "mass-same-weight-differs", label: "No — mass stays exactly 70 kg everywhere; only weight changes, since it depends on each world's gravity" },
          { id: "both-change", label: "Yes — both mass and weight change together on every world" },
          { id: "mass-changes-weight-same", label: "Yes — mass changes, but weight stays the same everywhere" },
          { id: "neither-changes", label: "No — neither mass nor weight changes anywhere" },
        ],
        actualResultOptionId: "mass-same-weight-differs",
        explanation:
          "Mass is intrinsic to the person and doesn't depend on location — it stays 70 kg on Earth, the Moon, or anywhere else. Weight, the gravitational force on that mass, does change, since it depends on each world's own surface gravity (g).",
        hint: "Which of mass and weight is a property of the object itself, and which depends on where the object currently is?",
      },
      {
        id: "physics-gravitation-predict-005",
        scenario: "On the Orbit tab, you set Initial speed to 0 and press Play.",
        question: "What will the satellite do?",
        options: [
          { id: "falls-straight-in", label: "It falls straight toward the central body, since there's no sideways motion for gravity to curve into an orbit" },
          { id: "stays-still", label: "It stays exactly still, since gravity needs motion to act on an object" },
          { id: "orbits-immediately", label: "It immediately settles into a circular orbit" },
          { id: "flies-away", label: "It flies away from the central body" },
        ],
        actualResultOptionId: "falls-straight-in",
        explanation:
          "With zero initial sideways velocity, gravity has nothing to curve into a path — it simply pulls the satellite straight in along a direct line toward the central body, the same way an object dropped with no horizontal velocity falls straight down.",
        hint: "An orbit needs gravity to curve some existing sideways motion. What happens if there's no sideways motion to begin with?",
      },
    ],
  },

  explore: {
    howToUse: [
      "On the Force Lab tab, adjust Mass 1, Mass 2, and Distance and watch the gravitational force readout respond immediately — try to predict the direction of each change before it happens.",
      "Scroll down on Force Lab to Weight & Worlds — adjust Your mass and watch weight (not mass) change across every world in the table at once.",
      "Switch to the Orbit tab, set Initial speed and Initial distance, then press Play to watch a real, physics-driven trajectory unfold — not a scripted animation.",
      "Compare the live \"Circular orbital speed at this distance\" and \"Escape speed at this distance\" readouts against your chosen Initial speed to predict what kind of path you'll get before pressing Play.",
    ],
    tryThis: [
      "Double Mass 1 on Force Lab and confirm the force readout exactly doubles.",
      "Double Distance on Force Lab and confirm the force readout drops to a quarter, not a half.",
      "Find two different mass/distance combinations on Force Lab that give approximately the same gravitational force — there's more than one way.",
      "On Weight & Worlds, keep Your mass fixed and compare weight across all six worlds — which has the smallest g, and which the largest?",
      "On Orbit, set Initial speed to 0 and watch the satellite fall straight in — then reset and try matching the circular orbital speed readout to trace a steady circle instead.",
      "On Orbit, push Initial speed above the escape speed readout and watch the satellite leave and never return.",
      "On Orbit, change Satellite mass only and confirm the orbital path is completely unaffected — only Central mass and distance shape the motion.",
    ],
  },

  explain: {
    questions: [
      {
        id: "physics-gravitation-explain-001",
        question: "Why does increasing mass increase gravitational attraction?",
        answer:
          "F = Gm₁m₂/r² has each mass in the numerator, to the first power — force scales directly (linearly) with each mass. A more massive object exerts, and experiences, proportionally more gravitational force, all else held equal.",
      },
      {
        id: "physics-gravitation-explain-002",
        question: "Why does increasing distance reduce gravitational force?",
        answer:
          "Distance appears squared in the denominator of F = Gm₁m₂/r², so as objects move apart, the force drops off — and it drops off faster than distance itself grows, because of the squaring. Force never technically reaches exactly zero at any finite distance, but it becomes vanishingly small very quickly.",
      },
      {
        id: "physics-gravitation-explain-003",
        question: "Why is the distance relationship squared?",
        answer:
          "This comes from how gravity spreads out from a mass in three-dimensional space: at twice the distance, the same \"amount\" of gravitational influence is spread over four times the area (since area scales with the square of distance), diluting its effect by that same factor of four. That's the geometric root of the inverse-square relationship, and it shows up in other phenomena that spread out from a point source too, like light intensity from a lamp.",
      },
      {
        id: "physics-gravitation-explain-004",
        question: "Why doesn't an object's mass change when it moves to another planet?",
        answer:
          "Mass measures the amount of matter an object is made of, and its resistance to acceleration — properties that belong to the object itself, not to wherever it happens to be standing. Moving to a different planet doesn't add or remove any matter from the object, so its mass stays exactly the same.",
      },
      {
        id: "physics-gravitation-explain-005",
        question: "Why does an object's weight change when it moves to another planet?",
        answer:
          "Weight is the gravitational force acting on an object's mass, W = mg — and g (gravitational acceleration) depends on the mass and radius of whatever world the object is near. Since different planets have different masses and radii, they have different g values, and the same fixed mass multiplied by a different g gives a different weight.",
      },
      {
        id: "physics-gravitation-explain-006",
        question: "Why can gravity keep an object in orbit?",
        answer:
          "Gravity provides a continuous force pointed toward the central body, which constantly changes the direction (not necessarily the speed) of the orbiting object's velocity. If the object is moving sideways fast enough, this continuous inward turning bends its path into a closed loop that keeps circling the central body instead of crashing into it or flying off in a straight line — the same idea Circular Motion covers for any object moving at constant speed on a curved path, with gravity now supplying the centripetal force.",
      },
    ],
  },

  practice: {
    quizId: "physics-gravitation",
  },

  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. The first two ask you to reason from the formulas directly; the last two — Gravity Lab and Orbit Designer — use the lab's live readouts to design a configuration that meets a target condition. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "physics-gravitation-challenge-001",
        title: "Find the Missing Mass",
        scenario:
          "Two objects, one of them 4×10²⁴ kg, are 1×10⁷ m apart, and the gravitational force between them is measured at about 1.07×10²⁵ N. (Use G ≈ 6.674×10⁻¹¹ N·m²/kg².)",
        objective: "Determine the second object's mass, in units of 10²⁴ kg.",
        requiresExperiment: false,
        constraints: [{ id: "c1", label: "Use F = Gm₁m₂/r², rearranged to solve for the unknown mass." }],
        answer: { mode: "numeric", unit: "×10²⁴ kg", target: 4, tolerance: 0.5 },
        explanation:
          "From F = Gm₁m₂/r²: m₂ = Fr²/(Gm₁) = (1.07×10²⁵ × (1×10⁷)²) / (6.674×10⁻¹¹ × 4×10²⁴) = (1.07×10³⁹) / (2.6696×10¹⁴) ≈ 4.0×10²⁴ kg. Rearranging a formula to isolate an unknown quantity is exactly the skill this topic's harder numeric Practice questions build toward.",
        hints: [
          "Start from F = Gm₁m₂/r² and rearrange to solve for m₂.",
          "m₂ = Fr² / (Gm₁) — plug in the given force, distance, G, and m₁ before simplifying.",
          "Keep careful track of powers of ten as you multiply and divide — group all the ×10ⁿ parts together separately from the plain numbers.",
        ],
      },
      {
        id: "physics-gravitation-challenge-002",
        title: "Weight Across Worlds",
        scenario:
          "An object weighs 300 N on a world with surface gravity 7.5 m/s².",
        objective: "Determine what that same object would weigh on a different world with surface gravity 2.5 m/s².",
        requiresExperiment: false,
        constraints: [{ id: "c1", label: "The object's mass is the same on both worlds — only g differs." }],
        answer: { mode: "numeric", unit: "N", target: 100, tolerance: 5 },
        explanation:
          "First find the mass from the first world: m = W/g = 300/7.5 = 40 kg. Mass doesn't change between worlds, so on the second world: W = mg = 40 × 2.5 = 100 N.",
        hints: [
          "First use W = mg on the first world to find the object's mass — mass is what stays constant here.",
          "m = 300 / 7.5. What's that?",
          "Once you have the mass, apply W = mg again with the second world's gravity (2.5 m/s²).",
        ],
      },
      {
        id: "physics-gravitation-challenge-003",
        title: "Gravity Lab",
        scenario:
          "On the Force Lab tab, Mass 1 and Mass 2 are both set to 6 (×10²⁴ kg). The gravitational force between them needs to land close to a target of 2.40×10²⁵ N.",
        objective: "Determine what Distance (in ×10⁶ m) achieves that target force, then confirm it on the live readout.",
        constraints: [{ id: "c1", label: "With Mass 1 = Mass 2 = 6 (×10²⁴ kg), land within 1 (×10⁶ m) of the correct Distance for a 2.40×10²⁵ N target force." }],
        tools: [
          { id: "mass1-slider", label: "Mass 1 slider (0.1–20 ×10²⁴ kg) — set to 6" },
          { id: "mass2-slider", label: "Mass 2 slider (0.1–20 ×10²⁴ kg) — set to 6" },
          { id: "distance-slider", label: "Distance slider (1–50 ×10⁶ m)" },
          { id: "force-readout", label: "Live gravitational force readout" },
        ],
        answer: { mode: "numeric", unit: "×10⁶ m", target: 10, tolerance: 1 },
        explanation:
          "Rearranging F = Gm₁m₂/r² to solve for r: r = √(Gm₁m₂/F) = √((6.674×10⁻¹¹ × 6×10²⁴ × 6×10²⁴) / 2.40×10²⁵) = √((2.4026×10¹⁵) / (2.40×10²⁵))... working through the powers of ten gives r ≈ 10×10⁶ m. Setting Distance to 10 on the slider and checking the live readout should land very close to the 2.40×10²⁵ N target — a real, physically accurate force between two Earth-scale-ish masses at a real, planetary-scale distance, not a fudged number.",
        hints: [
          "Rearrange F = Gm₁m₂/r² to solve for r instead: r = √(Gm₁m₂/F).",
          "With Mass 1 = Mass 2 = 6, try Distance values on the slider and watch how quickly the force readout changes — distance has the strongest (squared) effect.",
          "Distance around 10 (×10⁶ m) should land close to the 2.40×10²⁵ N target.",
        ],
      },
      {
        id: "physics-gravitation-challenge-004",
        title: "Real-World Mission: Orbit Designer",
        scenario:
          "You're a mission planner tasked with placing a satellite into a stable circular orbit around a given central body, at a given distance, using the Orbit lab's real physics.",
        objective:
          "With Central mass and Initial distance set to your choice, set Initial speed to match the live \"Circular orbital speed at this distance\" readout, then reset and press Play to confirm the satellite traces a steady circular path rather than falling in or flying away.",
        constraints: [{ id: "c1", label: "Land Initial speed within 0.5 units/s of the circular orbital speed readout for your chosen Central mass and Initial distance." }],
        tools: [
          { id: "central-mass-slider", label: "Central mass slider (10–200 units)" },
          { id: "initial-radius-slider", label: "Initial distance slider (2–8 units)" },
          { id: "initial-speed-slider", label: "Initial speed slider (0–12 units/s)" },
          { id: "circular-speed-readout", label: "Live \"Circular orbital speed at this distance\" readout" },
        ],
        answer: { mode: "numeric", unit: "units/s", target: 3.54, tolerance: 2 },
        explanation:
          "At the lab's default settings — Central mass 50, Initial distance 4 — the circular orbital speed is v = √(GM/r) = √(50/4) ≈ 3.54 units/s (with the lab's idealized G = 1). Setting Initial speed to that value and resetting should trace a near-circular path; setting it noticeably lower makes the orbit fall inward into an ellipse, and setting it noticeably higher stretches the ellipse outward — exactly what a real mission planner has to get right to place a satellite in the orbit it's designed for, since even a modest speed error changes the entire shape of the resulting path.",
        hints: [
          "Read the \"Circular orbital speed at this distance\" readout for your current Central mass and Initial distance before pressing Play.",
          "Set Initial speed to match that readout as closely as the slider allows, then press Reset so the new initial condition takes effect.",
          "At the lab's defaults (Central mass 50, Initial distance 4), v = √(GM/r) = √(50/4) ≈ 3.54.",
        ],
      },
    ],
  },

  relatedTopics: [],
};

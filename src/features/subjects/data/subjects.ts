import type { Subject, Topic } from "../types";

/**
 * Central subject registry — now three levels deep (Subject → Topic →
 * Visualization) instead of Subject → flat topic list. This is the
 * single file that changes as the platform grows:
 *
 * - A brand new visualization page → add one object to its topic's
 *   `visualizations` array. No other file needs to change; the topic
 *   card's activity count, the subject's total, and the topic page's
 *   grid all read straight from this array.
 * - A brand new topic → add one object to the subject's `topics`
 *   array (an empty `visualizations: []` is fine — it renders as a
 *   "Coming soon" topic card automatically).
 * - A brand new subject → add one object here, a glyph in
 *   `glyphs.tsx`, and the matching `subject.<name>` color tokens in
 *   `tailwind.config.ts` (see that file's own comment).
 */
export const subjects: Subject[] = [
  {
    slug: "physics",
    code: "PHY·01",
    name: "Physics",
    tagline: "Forces, fields & motion",
    description:
      "Explore mechanics, electromagnetism, and waves through hands-on interactive models.",
    colorToken: "physics",
    notation: "F = ma",
    topics: [
      {
        slug: "kinematics",
        name: "Kinematics",
        visualizations: [
          {
            slug: "simple-motion",
            title: "Simple Motion",
            description:
              "Set a speed and watch a car move — see how distance, time, and speed connect.",
            href: "/dashboard/physics/simple-motion",
          },
          {
            slug: "projectile-motion",
            title: "Projectile Motion",
            description:
              "Launch a projectile and see how angle and speed shape its arc.",
            href: "/dashboard/physics/projectile-motion",
          },
          {
            slug: "velocity",
            title: "Velocity",
            description:
              "Push, coast, and stop a cart to see what keeps velocity constant — and what changes it.",
            href: "/dashboard/physics/velocity",
          },
          {
            slug: "acceleration",
            title: "Acceleration",
            description:
              "Apply a force and watch acceleration respond to F = ma in real time, live on a velocity-time graph.",
            href: "/dashboard/physics/acceleration",
          },
        ],
      },
      {
        slug: "newtonian-mechanics",
        name: "Newtonian Mechanics",
        visualizations: [
          {
            slug: "newtons-laws",
            title: "Newton's Laws Lab",
            description:
              "Push, drop, and collide objects to feel all three laws of motion.",
            href: "/dashboard/physics/newtons-laws",
          },
          {
            slug: "momentum",
            title: "Momentum",
            description:
              "Push skaters apart or collide two carts — watch mass times velocity add up to a quantity that's always conserved.",
            href: "/dashboard/physics/momentum",
          },
          {
            slug: "simple-forces",
            title: "Simple Forces",
            description:
              "Push and pull a box from either side and see which force wins.",
            href: "/dashboard/physics/simple-forces",
          },
          {
            slug: "simple-energy",
            title: "Simple Energy",
            description:
              "Release a ball down a hill and watch potential energy turn into kinetic energy.",
            href: "/dashboard/physics/simple-energy",
          },
          {
            slug: "work-energy-power",
            title: "Work, Energy & Power",
            description:
              "Push, lift, and race machines — see work, kinetic and potential energy, and power as real, calculated numbers.",
            href: "/dashboard/physics/work-energy-power",
          },
        ],
      },
      {
        slug: "circular-motion-and-gravitation",
        name: "Circular Motion & Gravitation",
        visualizations: [
          {
            slug: "circular-motion",
            title: "Circular Motion",
            description:
              "Send an object around a circle at constant speed and watch it accelerate anyway — velocity and centripetal force vectors included.",
            href: "/dashboard/physics/circular-motion",
          },
          {
            slug: "gravitation",
            title: "Gravitation",
            description:
              "Explore Newton's law of universal gravitation, compare weight across worlds, and launch a satellite into a real, physics-driven orbit.",
            href: "/dashboard/physics/gravitation",
          },
        ],
      },
      {
        slug: "electromagnetism",
        name: "Electromagnetism",
        visualizations: [
          {
            slug: "magnet-explorer",
            title: "Interactive Magnet Explorer",
            description:
              "Drag and rotate two bar magnets to discover how poles attract and repel.",
            href: "/dashboard/physics/magnet-explorer",
          },
          {
            slug: "compass-explorer",
            title: "Interactive Compass Explorer",
            description:
              "Drag a magnet and a compass around the playground to see the needle follow the field.",
            href: "/dashboard/physics/compass-explorer",
          },
        ],
      },
      {
        slug: "wave-motion",
        name: "Wave Motion",
        visualizations: [
          {
            slug: "basic-wave-motion",
            title: "Basic Wave Motion",
            description:
              "Watch a transverse wave travel and discover crest, trough, amplitude, wavelength, and equilibrium by interacting with it.",
            href: "/dashboard/physics/basic-wave-motion",
          },
          {
            slug: "transverse-longitudinal-waves",
            title: "Transverse vs Longitudinal Waves",
            description:
              "Toggle between wave types and watch particle motion to see perpendicular vs parallel oscillation, plus compression and rarefaction.",
            href: "/dashboard/physics/transverse-longitudinal-waves",
          },
          {
            slug: "frequency-period",
            title: "Frequency & Period",
            description:
              "Watch a reference particle oscillate and adjust frequency to see how frequency and period relate through T = 1/f.",
            href: "/dashboard/physics/frequency-period",
          },
          {
            slug: "wave-speed",
            title: "Wave Speed — v = fλ",
            description:
              "Change frequency and wavelength independently and watch wave speed respond, building intuition for v = fλ.",
            href: "/dashboard/physics/wave-speed",
          },
        ],
      },
    ],
  },
  {
    slug: "chemistry",
    code: "CHM·02",
    name: "Chemistry",
    tagline: "Reactions & molecular structure",
    description:
      "Visualize chemical bonding, reaction kinetics, and the periodic table in motion.",
    colorToken: "chemistry",
    notation: "H₂O",
    topics: [
      {
        slug: "atomic-structure",
        name: "Atomic Structure",
        visualizations: [
          {
            slug: "build-an-atom",
            title: "Build an Atom",
            description:
              "Add protons, neutrons, and electrons to build any element you like.",
            href: "/dashboard/chemistry/build-an-atom",
          },
        ],
      },
      {
        slug: "periodic-trends",
        name: "Periodic Trends",
        visualizations: [
          {
            slug: "periodic-trends",
            title: "Periodic Trends",
            description:
              "Pick a trend and watch atomic radius, ionization energy, electronegativity, and metallic character light up across the table.",
            href: "/dashboard/chemistry/periodic-trends",
          },
        ],
      },
      {
        slug: "chemical-bonding",
        name: "Chemical Bonding",
        visualizations: [
          {
            slug: "bond-builder",
            title: "Bond Builder",
            description:
              "Bring atoms together and watch ionic and covalent bonds form.",
            href: "/dashboard/chemistry/bond-builder",
          },
          {
            slug: "molecule-builder",
            title: "Molecule Builder",
            description: "Join atoms step by step to build H₂, H₂O, and CO₂.",
            href: "/dashboard/chemistry/molecule-builder",
          },
        ],
      },
      {
        slug: "chemical-reactions",
        name: "Chemical Reactions",
        visualizations: [
          {
            slug: "reaction-builder",
            title: "Chemical Reaction Builder",
            description:
              "Step through reactions like 2H₂ + O₂ → 2H₂O and see how atoms rearrange without being created or destroyed.",
            href: "/dashboard/chemistry/reaction-builder",
          },
        ],
      },
      {
        slug: "reaction-kinetics",
        name: "Reaction Kinetics",
        visualizations: [
          {
            slug: "reaction-kinetics",
            title: "Reaction Kinetics — Understanding Reaction Rates",
            description:
              "Watch reactant particles collide and see how concentration, temperature, surface area, and catalysts each change how fast a reaction runs.",
            href: "/dashboard/chemistry/reaction-kinetics",
          },
        ],
      },
      {
        slug: "acids-bases",
        name: "Acids & Bases",
        visualizations: [
          {
            slug: "acids-bases-basics",
            title: "Acids & Bases — The Basics",
            description:
              "Explore everyday substances on the pH scale and build intuition for acidic, neutral, and basic solutions.",
            href: "/dashboard/chemistry/acids-bases-basics",
          },
          {
            slug: "arrhenius-theory",
            title: "Arrhenius Theory",
            description:
              "See HCl and NaOH dissolve in water and watch how an Arrhenius acid and base differ.",
            href: "/dashboard/chemistry/arrhenius-theory",
          },
          {
            slug: "bronsted-lowry",
            title: "Brønsted–Lowry Theory",
            description:
              "Watch a proton move from acid to base and see why Brønsted–Lowry defines acids by what they donate.",
            href: "/dashboard/chemistry/bronsted-lowry",
          },
          {
            slug: "conjugate-acid-base-pairs",
            title: "Conjugate Acid–Base Pairs",
            description:
              "Pick a molecule and see its conjugate partner — every pair differs by exactly one proton.",
            href: "/dashboard/chemistry/conjugate-acid-base-pairs",
          },
          {
            slug: "lewis-acid-base",
            title: "Lewis Acid–Base Theory",
            description:
              "Watch an electron pair move from a Lewis base to a Lewis acid and see how a coordinate bond forms.",
            href: "/dashboard/chemistry/lewis-acid-base",
          },
          {
            slug: "strong-weak-acids-bases",
            title: "Strong vs Weak Acids and Bases",
            description:
              "Compare how strong and weak acids and bases ionize in water, and see why strength isn't the same as concentration.",
            href: "/dashboard/chemistry/strong-weak-acids-bases",
          },
        ],
      },
    ],
  },
  {
    slug: "biology",
    code: "BIO·03",
    name: "Biology",
    tagline: "Cells, systems & genetics",
    description:
      "Study living systems from the molecular level up through ecosystems and inheritance.",
    colorToken: "biology",
    notation: "5'→3'",
    topics: [
      {
        slug: "cell-structure",
        name: "Cell Structure",
        visualizations: [
          {
            slug: "cell-explorer",
            title: "Interactive Cell Explorer",
            description:
              "Click around an animal or plant cell to learn what each organelle does.",
            href: "/dashboard/biology/cell-explorer",
          },
          {
            slug: "membrane-transport",
            title: "Cell Membrane & Transport",
            description:
              "Watch particles diffuse and water move by osmosis across a simplified cell membrane.",
            href: "/dashboard/biology/membrane-transport",
          },
          {
            slug: "cellular-respiration",
            title: "Cellular Respiration",
            description:
              "Watch a cell use glucose and oxygen to release energy, carbon dioxide, and water.",
            href: "/dashboard/biology/cellular-respiration",
          },
          {
            slug: "mitosis",
            title: "Mitosis",
            description:
              "Watch one parent cell divide into two daughter cells through the stages of mitosis.",
            href: "/dashboard/biology/mitosis",
          },
          {
            slug: "dna-structure",
            title: "DNA Structure & Base Pairing",
            description:
              "Explore the DNA double helix and learn how bases pair: A with T, and C with G.",
            href: "/dashboard/biology/dna-structure",
          },
        ],
      },
      {
        slug: "genetics",
        name: "Genetics",
        visualizations: [
          {
            slug: "meiosis",
            title: "Meiosis",
            description:
              "Watch one diploid cell divide through meiosis into four haploid cells used in sexual reproduction.",
            href: "/dashboard/biology/meiosis",
          },
        ],
      },
      {
        slug: "plant-biology",
        name: "Plant Biology",
        visualizations: [
          {
            slug: "photosynthesis",
            title: "Photosynthesis",
            description:
              "Watch light, water, and carbon dioxide reach the leaf and turn into glucose and oxygen.",
            href: "/dashboard/biology/photosynthesis",
          },
        ],
      },
      {
        slug: "human-physiology",
        name: "Human Physiology",
        visualizations: [
          {
            slug: "blood-circulation",
            title: "Blood Circulation",
            description:
              "Watch blood flow between the body, heart, and lungs, and explore pulmonary vs systemic circulation and the four heart chambers.",
            href: "/dashboard/biology/blood-circulation",
          },
          {
            slug: "respiratory-system",
            title: "Respiratory System — Breathing & Gas Exchange",
            description:
              "Breathe the lungs in and out, follow the air from nose to alveoli, and watch oxygen and carbon dioxide exchange with the blood.",
            href: "/dashboard/biology/respiratory-system",
          },
          {
            slug: "digestive-system",
            title: "Digestive System — Journey of Food & Nutrient Absorption",
            description:
              "Follow a bite of food from mouth to rectum, explore each organ's role, and see how villi in the small intestine absorb nutrients into the blood.",
            href: "/dashboard/biology/digestive-system",
          },
          {
            slug: "nervous-system",
            title: "Nervous System — From Neuron to Signal Transmission",
            description:
              "Explore the parts of a neuron, fire an action potential, step through synaptic transmission, and see how the nervous system is organized.",
            href: "/dashboard/biology/nervous-system",
          },
        ],
      },
      {
        slug: "ecosystems",
        name: "Ecology & Ecosystems",
        visualizations: [
          {
            slug: "ecosystem-explorer",
            title: "Ecosystem Explorer",
            description:
              "Explore a small pond and forest ecosystem, discover biotic and abiotic components, and see how producers, consumers, and decomposers depend on each other.",
            href: "/dashboard/biology/ecosystem-explorer",
          },
          {
            slug: "food-chain-web",
            title: "Food Chain & Food Web",
            description:
              "Follow energy from the Sun through a grassland food chain, then switch to a food web to see how several food chains connect.",
            href: "/dashboard/biology/food-chain-web",
          },
        ],
      },
    ],
  },
  {
    slug: "mathematics",
    code: "MTH·04",
    name: "Mathematics",
    tagline: "Functions, proof & structure",
    description:
      "Build intuition for algebra, calculus, and geometry with visual, manipulable models.",
    colorToken: "math",
    notation: "Σ(n)",
    topics: [
      {
        slug: "number-sense",
        name: "Number Sense",
        visualizations: [
          {
            slug: "number-line",
            title: "Interactive Number Line",
            description:
              "Drag a marker to feel positive, negative, and zero by hand.",
            href: "/dashboard/mathematics/number-line",
          },
          {
            slug: "even-odd-explorer",
            title: "Even & Odd Explorer",
            description: "Build expressions and watch the leftover dot decide even or odd.",
            href: "/dashboard/mathematics/even-odd-explorer",
          },
          {
            slug: "factor-finder",
            title: "Factor Finder",
            description: "Tap out factor pairs and multiples to build a feel for both.",
            href: "/dashboard/mathematics/factor-finder",
          },
        ],
      },
      {
        slug: "fractions",
        name: "Fractions",
        visualizations: [
          {
            slug: "fraction-pizza",
            title: "Fraction Pizza",
            description: "Slice a pizza to see fractions as pieces of a whole.",
            href: "/dashboard/mathematics/fraction-pizza",
          },
          {
            slug: "fraction-operations",
            title: "Fraction Operations Lab",
            description: "Add, subtract, multiply, and divide fractions with a visual for each.",
            href: "/dashboard/mathematics/fraction-operations",
          },
        ],
      },
      {
        slug: "algebra",
        name: "Algebra",
        visualizations: [
          {
            slug: "equation-playground",
            title: "Equation Playground",
            description: "Learn equations by solving interactive puzzles.",
            href: "/dashboard/mathematics/equation-playground",
          },
        ],
      },
      {
        slug: "calculus",
        name: "Calculus",
        visualizations: [
          {
            slug: "calculus-foundations",
            title: "Calculus Foundations — Functions, Graphs & Limits",
            description:
              "Build intuition for functions, graphs, approaching a value, limits, and continuity before ever seeing a derivative.",
            href: "/dashboard/mathematics/calculus-foundations",
          },
          {
            slug: "derivative-explorer",
            title:
              "Derivative Explorer — Tangent Line & Instantaneous Rate of Change",
            description:
              "Watch a secant line rotate into a tangent line and see why its slope is called the derivative.",
            href: "/dashboard/mathematics/derivative-explorer",
          },
          {
            slug: "derivative-rules",
            title: "Derivative Rules — Learn Differentiation Step by Step",
            description:
              "Learn the constant, power, constant multiple, sum, difference, product, and quotient rules for differentiation, one visual step at a time.",
            href: "/dashboard/mathematics/derivative-rules",
          },
          {
            slug: "chain-rule-explorer",
            title: "Chain Rule Explorer — Differentiating Composite Functions",
            description:
              "Build intuition for the Chain Rule with a function composition machine, inner/outer highlighting, step-by-step differentiation, and Chain Rule vs Power Rule practice.",
            href: "/dashboard/mathematics/chain-rule-explorer",
          },
          {
            slug: "applications-of-derivatives",
            title:
              "Applications of Derivatives — Increasing, Decreasing, Maxima & Minima",
            description:
              "See why derivatives are useful: increasing/decreasing regions, derivative sign, critical points, local maxima and minima, a sign chart, and interactive practice.",
            href: "/dashboard/mathematics/applications-of-derivatives",
          },
        ],
      },
      {
        slug: "statistics",
        name: "Statistics",
        visualizations: [
          {
            slug: "statistics-foundations",
            title: "Statistics Foundations — Data, Variables & Sampling",
            description:
              "Explore a real dataset, tell variables apart, and see how population, sample, and sampling method shape what a survey can tell you.",
            href: "/dashboard/mathematics/statistics-foundations",
          },
          {
            slug: "data-collection",
            title: "Data Collection & Representation",
            description:
              "Collect survey observations one at a time and watch the same data become a raw list, a frequency table, and a bar graph.",
            href: "/dashboard/mathematics/data-collection",
          },
          {
            slug: "central-tendency",
            title: "Measures of Central Tendency — Mean, Median, Mode & Range",
            description:
              "Edit a dataset and watch mean, median, mode, and range respond, then see why an outlier can shift the mean far more than the median.",
            href: "/dashboard/mathematics/central-tendency",
          },
          {
            slug: "measures-of-dispersion",
            title: "Measures of Dispersion — Variance & Standard Deviation",
            description:
              "See why two datasets with the same mean can have very different spread, then build up variance and standard deviation step by step.",
            href: "/dashboard/mathematics/measures-of-dispersion",
          },
        ],
      },
      {
        slug: "ratios",
        name: "Ratios",
        visualizations: [
          {
            slug: "ratio-explorer",
            title: "Ratio Explorer",
            description:
              "Add blue and red circles to discover what a ratio means and how it simplifies.",
            href: "/dashboard/mathematics/ratio-explorer",
          },
          {
            slug: "ratio-comparison",
            title: "Ratio Comparison",
            description:
              "Drag sliders on two ratios and see instantly whether they're equivalent — and why.",
            href: "/dashboard/mathematics/ratio-comparison",
          },
          {
            slug: "proportion-builder",
            title: "Proportion Builder",
            description:
              "Drag a slider to find the missing value in a : b = c : d, and see why both sides stay equal.",
            href: "/dashboard/mathematics/proportion-builder",
          },
          {
            slug: "cross-multiplication-explorer",
            title: "Cross Multiplication Explorer",
            description:
              "Watch the two diagonal multiplications animate to see why 2/3 = 4/6, then test fractions of your own.",
            href: "/dashboard/mathematics/cross-multiplication-explorer",
          },
          {
            slug: "real-life-ratios",
            title: "Real-Life Ratios",
            description:
              "Solve illustrated ratio problems — paint mixing, recipes, marbles, trees, and more — with a new scenario every round.",
            href: "/dashboard/mathematics/real-life-ratios",
          },
          {
            slug: "ratio-challenge",
            title: "Ratio Challenge",
            description:
              "Random challenges — missing values, simplifying, equivalent ratios, and word problems — with difficulty that adapts to your streak.",
            href: "/dashboard/mathematics/ratio-challenge",
          },
        ],
      },
      {
        slug: "geometry",
        name: "Geometry",
        visualizations: [
          {
            slug: "angle-spinner",
            title: "Angle Spinner",
            description:
              "Spin a wheel to build a feel for degrees and angle types.",
            href: "/dashboard/mathematics/angle-spinner",
          },
        ],
      },
      {
        slug: "symmetry",
        name: "Symmetry",
        visualizations: [
          {
            slug: "symmetry-mirror",
            title: "Symmetry Mirror",
            description:
              "Draw on one side and watch the mirror image complete the shape.",
            href: "/dashboard/mathematics/symmetry-mirror",
          },
        ],
      },
      {
        slug: "measurement",
        name: "Measurement",
        visualizations: [
          {
            slug: "measurement-explorer",
            title: "Measurement Explorer — Length, Distance & Rulers",
            description:
              "Drag a virtual ruler to measure real objects, see why the zero point matters, move between mm/cm/m/km, and estimate before you measure.",
            href: "/dashboard/mathematics/measurement-explorer",
          },
          {
            slug: "perimeter-area-explorer",
            title: "Perimeter & Area Explorer — Measuring 2D Shapes",
            description:
              "Discover perimeter and area visually — count around a boundary, count unit squares, resize a rectangle live, and see why the same perimeter can enclose very different areas.",
            href: "/dashboard/mathematics/perimeter-area-explorer",
          },
        ],
      },
      {
        slug: "coordinate-geometry",
        name: "Coordinate Geometry",
        visualizations: [
          {
            slug: "coordinate-plane-explorer",
            title: "Coordinate Plane Explorer",
            description:
              "Drag a point around an interactive grid to learn the axes, origin, coordinates, and the four quadrants.",
            href: "/dashboard/mathematics/coordinate-plane-explorer",
          },
          {
            slug: "plot-a-point",
            title: "Plot a Point",
            description:
              "Given a coordinate, tap or click to place it on the grid — with feedback that guides you to the right spot.",
            href: "/dashboard/mathematics/plot-a-point",
          },
          {
            slug: "distance-between-two-points",
            title: "Distance Between Two Points",
            description:
              "Drag two points and watch Δx, Δy, and the right triangle between them build the distance formula.",
            href: "/dashboard/mathematics/distance-between-two-points",
          },
          {
            slug: "midpoint-of-a-line-segment",
            title: "Midpoint of a Line Segment",
            description:
              "Drag two points and watch the midpoint stay exactly halfway between them, with equal distances on either side.",
            href: "/dashboard/mathematics/midpoint-of-a-line-segment",
          },
          {
            slug: "slope-of-a-line",
            title: "Slope of a Line",
            description:
              "Drag two points and watch rise, run, and the right triangle between them build the slope of the line.",
            href: "/dashboard/mathematics/slope-of-a-line",
          },
          {
            slug: "line-designer",
            title: "Line Designer",
            description:
              "Move slope and y-intercept sliders and watch the line — and the equation y = mx + b — update together.",
            href: "/dashboard/mathematics/line-designer",
          },
        ],
      },
    ],
  },
];

export function getSubjectBySlug(slug: string): Subject | undefined {
  return subjects.find((subject) => subject.slug === slug);
}

export function getTopicBySlug(
  subject: Subject,
  topicSlug: string,
): Topic | undefined {
  return subject.topics.find((topic) => topic.slug === topicSlug);
}

/** Total visualizations across every topic — always derived, never hand-maintained. */
export function getSubjectActivityCount(subject: Subject): number {
  return subject.topics.reduce(
    (total, topic) => total + topic.visualizations.length,
    0,
  );
}

/**
 * Platform-wide counts used on the marketing homepage (subjects,
 * topics, live simulations). Always derived from the registry above
 * so the homepage can never drift out of sync with what's actually
 * shipped — no hand-maintained numbers to remember to update.
 */
export function getPlatformStats() {
  const topicCount = subjects.reduce(
    (total, subject) => total + subject.topics.length,
    0,
  );
  const simulationCount = subjects.reduce(
    (total, subject) => total + getSubjectActivityCount(subject),
    0,
  );
  return {
    subjectCount: subjects.length,
    topicCount,
    simulationCount,
  };
}

/**
 * Given a visualization's own route (e.g. "/dashboard/biology/cell-explorer"),
 * finds which subject and topic it belongs to by scanning the registry —
 * so a simulation page's "Back to {topic}" link is always correct and
 * never a second, hand-maintained copy of the hierarchy.
 */
export function getVisualizationParent(
  href: string,
): { subject: Subject; topic: Topic } | undefined {
  for (const subject of subjects) {
    for (const topic of subject.topics) {
      if (
        topic.visualizations.some(
          (visualization) => visualization.href === href,
        )
      ) {
        return { subject, topic };
      }
    }
  }
  return undefined;
}

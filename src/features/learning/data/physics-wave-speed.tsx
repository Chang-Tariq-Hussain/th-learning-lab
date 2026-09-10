import type { TopicContent } from "../types";

/**
 * Wave Speed — v = fλ — Physics Batch 2 (Wave Motion, topic 4 of 4,
 * final topic in this branch). Reuses the existing `WaveSpeed`
 * simulation (`@/features/subjects/physics/wave-speed`) exactly
 * as-is: it already shows a wavelength measurement bracket directly
 * on the animated wave, live speed/frequency/wavelength readouts tied
 * together by v = fλ, a two-panel "change one variable at a time"
 * experiment, a rearranged-equation explorer (solve for speed,
 * frequency, or wavelength), and its own 3-question concept check —
 * so no simulation code changes were needed. Builds directly on the
 * frequency/period vocabulary from the previous topic and reintroduces
 * wavelength from Basic Wave Motion as the third variable in the
 * relationship, completing the Wave Motion branch.
 */

const equationSketch = (
  <svg viewBox="0 0 260 130" className="mx-auto h-28 w-full max-w-xs" role="img" aria-labelledby="v-f-lambda-sketch-title">
    <title id="v-f-lambda-sketch-title">A wave with one wavelength bracketed and labeled, alongside the equation v equals f times lambda.</title>
    <line x1="10" y1="70" x2="250" y2="70" strokeWidth="1" strokeDasharray="6 5" className="stroke-ink/20 dark:stroke-bone/20" />
    <path
      d="M10 70 C 34 35, 58 35, 82 70 C 106 105, 130 105, 154 70 C 178 35, 202 35, 226 70"
      fill="none"
      strokeWidth="2.5"
      className="stroke-subject-physics"
    />
    <line x1="10" y1="20" x2="82" y2="20" strokeWidth="1.5" className="stroke-amber-500" />
    <line x1="10" y1="15" x2="10" y2="25" strokeWidth="1.5" className="stroke-amber-500" />
    <line x1="82" y1="15" x2="82" y2="25" strokeWidth="1.5" className="stroke-amber-500" />
    <text x="46" y="14" textAnchor="middle" className="fill-amber-600 font-mono text-[9px] font-semibold dark:fill-amber-400">wavelength, λ</text>
    <text x="130" y="125" textAnchor="middle" className="fill-subject-physics font-display text-[13px] font-semibold">v = f × λ</text>
  </svg>
);

const tradeOffSketch = (
  <svg viewBox="0 0 260 140" className="mx-auto h-32 w-full max-w-xs" role="img" aria-labelledby="tradeoff-sketch-title">
    <title id="tradeoff-sketch-title">Two waves with the same speed: one with high frequency and short wavelength, one with low frequency and long wavelength.</title>
    <text x="130" y="14" textAnchor="middle" className="fill-ink-soft font-mono text-[8px] uppercase tracking-wide dark:fill-bone-soft">Same speed, different f and λ</text>
    <line x1="10" y1="45" x2="250" y2="45" strokeWidth="1" strokeDasharray="5 4" className="stroke-ink/15 dark:stroke-bone/15" />
    <path
      d="M10 45 C 20 30, 30 30, 40 45 C 50 60, 60 60, 70 45 C 80 30, 90 30, 100 45 C 110 60, 120 60, 130 45 C 140 30, 150 30, 160 45 C 170 60, 180 60, 190 45 C 200 30, 210 30, 220 45 C 230 60, 240 60, 250 45"
      fill="none"
      strokeWidth="2"
      className="stroke-subject-physics"
    />
    <text x="250" y="38" textAnchor="end" className="fill-ink-soft font-mono text-[8px] dark:fill-bone-soft">high f, short λ</text>
    <line x1="10" y1="105" x2="250" y2="105" strokeWidth="1" strokeDasharray="5 4" className="stroke-ink/15 dark:stroke-bone/15" />
    <path
      d="M10 105 C 40 75, 70 75, 100 105 C 130 135, 160 135, 190 105 C 205 90, 220 90, 250 105"
      fill="none"
      strokeWidth="2"
      className="stroke-pine-500"
    />
    <text x="250" y="98" textAnchor="end" className="fill-pine-600 font-mono text-[8px] dark:fill-pine-300">low f, long λ</text>
  </svg>
);

export const physicsWaveSpeedContent: TopicContent = {
  subjectSlug: "physics",
  topicSlug: "wave-speed",
  title: "Wave Speed — v = fλ",
  subjectLabel: "Physics",
  topicLabel: "Wave Motion",
  colorToken: "physics",
  simulationHref: "/dashboard/physics/wave-speed",

  // -------------------------------------------------------------
  // LEARN — what am I learning?
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Define wave speed, wavelength, and frequency, and identify each one's unit.",
      "State the relationship v = fλ and rearrange it to solve for f or λ.",
      "Predict how wavelength changes when frequency changes, with wave speed held constant.",
      "Predict how frequency changes when wavelength changes, with wave speed held constant.",
      "Explain why a wave's speed depends on both frequency and wavelength together, not either alone.",
      "Use v = fλ to solve for any one of the three quantities, given the other two.",
    ],
    concepts: [
      {
        term: "Wave speed (v)",
        explanation:
          "How quickly the wave pattern itself travels through a medium, measured in meters per second (m/s). This is the speed of the disturbance traveling through space, not the speed of any single particle oscillating up and down.",
      },
      {
        term: "Wavelength (λ)",
        explanation:
          "The distance between two corresponding points on consecutive waves — crest to crest, or trough to trough — measured in meters (m). A longer wavelength means the wave pattern is more stretched out in space.",
      },
      {
        term: "Frequency (f)",
        explanation:
          "How many complete wave cycles pass a fixed point every second, measured in hertz (Hz) — the same frequency concept from the previous topic, now paired with wavelength.",
      },
      {
        term: "The equation: v = fλ",
        explanation:
          "Wave speed equals frequency multiplied by wavelength. This single equation ties all three quantities together: once any two are known, the third is completely determined.",
        formula: "v = f\\lambda",
        formulaCaption: "speed = frequency × wavelength",
      },
      {
        term: "Rearranging the equation",
        explanation:
          "The same relationship can be solved for whichever quantity is unknown: divide both sides by λ to get frequency, or divide both sides by f to get wavelength.",
        formula: "f = \\dfrac{v}{\\lambda} \\quad\\quad \\lambda = \\dfrac{v}{f}",
        formulaCaption: "frequency = speed ÷ wavelength, and wavelength = speed ÷ frequency",
      },
      {
        term: "The frequency/wavelength trade-off at constant speed",
        explanation:
          "For a wave moving through one particular medium, speed is usually set by the medium's own properties and stays fixed. That means if frequency goes up, wavelength must come down to compensate (and vice versa) so that v = fλ still balances — exactly like a see-saw where the product of the two sides always lands on the same value.",
      },
    ],
    whyItMatters:
      "v = fλ explains a huge range of everyday wave behavior. A radio station's broadcast frequency is fixed by law, and because radio waves all travel at the speed of light in air, that fixed frequency automatically determines a fixed wavelength — which is exactly why antennas are built to a specific length for a specific station. Visible light works the same way: red light and blue light travel through empty space at the exact same speed, but red light has a longer wavelength and lower frequency than blue light, which is what makes them look like different colors. Sound obeys the same rule in a different medium — a low-pitched (low-frequency) note and a high-pitched (high-frequency) note both travel through air at roughly the same speed, so the low note necessarily has the longer wavelength. Once frequency, wavelength, and speed click together as one relationship instead of three separate facts, radio, optics, and acoustics all start looking like the same underlying pattern.",
    keyTerms: [
      { term: "Wave speed", definition: "How fast the wave pattern travels through a medium, measured in meters per second (m/s)." },
      { term: "Wavelength", definition: "The distance between two corresponding points on consecutive waves, measured in meters (m)." },
      { term: "Frequency", definition: "The number of complete wave cycles passing a point each second, measured in hertz (Hz)." },
      { term: "v = fλ", definition: "The equation linking wave speed, frequency, and wavelength — speed equals frequency times wavelength." },
    ],
    visualAids: [
      {
        id: "equation-sketch",
        caption: "Wavelength is measured directly on the wave — the distance from one crest to the very next crest.",
        visual: equationSketch,
      },
      {
        id: "tradeoff-sketch",
        caption: "Two waves with the exact same speed can still look completely different: one trades a high frequency for a short wavelength, the other a low frequency for a long wavelength.",
        visual: tradeOffSketch,
      },
    ],
    misconceptions: [
      {
        id: "misconception-higher-frequency-always-faster",
        misconception: "A wave with a higher frequency is always traveling faster through space than one with a lower frequency.",
        correction:
          "Not necessarily — wave speed depends on frequency *and* wavelength together (v = fλ). A high-frequency wave with a short enough wavelength can have the exact same speed as a low-frequency wave with a long wavelength. Try the lab below: keep wavelength fixed and raise frequency, and you'll see speed increase — but that's only because wavelength was held constant, not because frequency alone determines speed.",
      },
      {
        id: "misconception-v-f-lambda-are-independent",
        misconception: "Speed, frequency, and wavelength are three separate settings that can each be picked completely independently.",
        correction:
          "They're linked by one equation, v = fλ — once you know any two of them, the third is fixed and can't be chosen freely. In the lab below, changing frequency while wave speed is meant to stay fixed automatically forces wavelength to change too; they aren't three independent dials.",
      },
      {
        id: "misconception-short-wavelength-means-slow",
        misconception: "A short wavelength always means a slow-moving wave, since 'short' sounds like it should mean 'less.'",
        correction:
          "A short wavelength paired with a high enough frequency can still add up to a large wave speed — speed is the *product* fλ, not the wavelength alone. Blue light, for instance, has a shorter wavelength than red light, yet both travel through a vacuum at exactly the same (very fast) speed, because blue light's higher frequency makes up the difference.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT — what should I predict?
  // -------------------------------------------------------------
  predict: {
    intro:
      "Commit to a prediction before you touch the controls below — check your answer against the simulation and the equation explorer once you've locked it in.",
    scenarios: [
      {
        id: "physics-wave-speed-predict-001",
        scenario: "The simulation starts with f = 2 Hz and λ = 2 m.",
        question: "What is the resulting wave speed?",
        options: [
          { id: "four", label: "4 m/s" },
          { id: "two", label: "2 m/s" },
          { id: "one", label: "1 m/s" },
          { id: "eight", label: "8 m/s" },
        ],
        actualResultOptionId: "four",
        explanation: "v = fλ = 2 × 2 = 4 m/s — exactly what the Readouts panel shows at the default settings.",
        hint: "Multiply frequency by wavelength.",
      },
      {
        id: "physics-wave-speed-predict-002",
        scenario: "In the \"Change the Frequency\" experiment, wavelength stays fixed at 2 m while you try increasing frequency from 1 Hz up to 4 Hz.",
        question: "What happens to the wave speed as frequency increases, with wavelength held constant?",
        options: [
          { id: "speed-increases", label: "Wave speed increases" },
          { id: "speed-decreases", label: "Wave speed decreases" },
          { id: "speed-constant", label: "Wave speed stays exactly the same" },
          { id: "speed-undefined", label: "Speed becomes impossible to calculate" },
        ],
        actualResultOptionId: "speed-increases",
        explanation: "With λ fixed, v = fλ means speed rises directly with frequency: at 1 Hz, v = 2 m/s; at 4 Hz, v = 8 m/s.",
        hint: "If one factor in a multiplication grows and the other stays fixed, what happens to the product?",
      },
      {
        id: "physics-wave-speed-predict-003",
        scenario: "In the \"Change the Wavelength\" experiment, frequency stays fixed at 2 Hz while you try increasing wavelength from 1 m up to 4 m.",
        question: "What happens to the wave speed as wavelength increases, with frequency held constant?",
        options: [
          { id: "speed-increases", label: "Wave speed increases" },
          { id: "speed-decreases", label: "Wave speed decreases" },
          { id: "speed-constant", label: "Wave speed stays exactly the same" },
          { id: "speed-zero", label: "Wave speed drops to zero" },
        ],
        actualResultOptionId: "speed-increases",
        explanation: "With f fixed, v = fλ means speed also rises directly with wavelength: at 1 m, v = 2 m/s; at 4 m, v = 8 m/s.",
        hint: "Same idea as the frequency experiment, just with the other factor fixed this time.",
      },
      {
        id: "physics-wave-speed-predict-004",
        scenario: "Now imagine wave speed itself is held fixed at 6 m/s (as it would be for a real wave in one medium), and you raise the frequency.",
        question: "What must happen to the wavelength to keep v = fλ = 6 m/s true?",
        options: [
          { id: "wavelength-shrinks", label: "Wavelength must shrink" },
          { id: "wavelength-grows", label: "Wavelength must grow" },
          { id: "wavelength-fixed", label: "Wavelength can stay exactly the same" },
          { id: "impossible", label: "It's impossible to keep speed fixed while changing frequency" },
        ],
        actualResultOptionId: "wavelength-shrinks",
        explanation: "If v is fixed and f goes up, λ = v/f must come down to keep the product fλ equal to the same fixed speed — this is the frequency/wavelength trade-off that happens for a real wave traveling through one medium.",
        hint: "This is different from the two experiments above, where speed was allowed to change — here, speed is the one thing held fixed.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE — the guided experiment
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Watch the wavelength bracket drawn directly on the wave, and read the live Wave Speed, Frequency, and Wavelength readouts beneath it.",
      "Confirm the Formula readout: v = f × λ always matches the two values you've set.",
      "Open \"Experiment: Change the Frequency\" and step through each frequency value — wavelength stays fixed at 2 m, so watch wave speed rise as frequency rises.",
      "Open \"Experiment: Change the Wavelength\" and step through each wavelength value — frequency stays fixed at 2 Hz, so watch wave speed rise as wavelength rises.",
      "Use the Equation Explorer to switch between solving for speed, frequency, or wavelength, and see the same relationship rearranged three different ways.",
      "Set your own frequency and wavelength values directly with the two steppers and predict the resulting speed before checking the readout.",
    ],
    tryThis: [
      "Find two different (frequency, wavelength) pairs that both produce a wave speed of exactly 8 m/s.",
      "Set frequency to 3 Hz and predict what wavelength would be needed for a speed of 6 m/s, then set the wavelength stepper to check.",
      "Using only the Equation Explorer's \"Find Wavelength\" example, explain in your own words why the result is 3 m.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN — why does this happen?
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "physics-wave-speed-explain-001",
        question: "Why does wave speed depend on both frequency and wavelength, instead of just one of them?",
        answer:
          "Wave speed measures how far the pattern travels per second — and that distance is built from two pieces: how far one wavelength stretches (λ) and how many of those wavelengths pass by each second (f). Multiplying them together, v = fλ, is literally computing \"distance per cycle\" times \"cycles per second,\" which is exactly what a speed (distance per second) is.",
      },
      {
        id: "physics-wave-speed-explain-002",
        question: "Why does increasing frequency while wavelength is fixed increase wave speed, but increasing frequency while speed is fixed decreases wavelength instead?",
        answer:
          "Those are two different experiments holding two different things constant. In the first (wavelength fixed), the only thing free to change in v = fλ is speed, so raising f raises v. In the second (speed fixed, as happens for a real wave in a single medium), the equation still has to balance, so if f goes up, λ must come down to keep the product v the same. Which variable moves depends entirely on which one you're holding fixed — that's why the lab's two experiments and the trade-off scenario each show a different pair of variables changing together.",
      },
      {
        id: "physics-wave-speed-explain-003",
        question: "Why can two waves with completely different frequencies and wavelengths still travel at the same speed?",
        answer:
          "Speed is the product fλ, not either quantity by itself — so a high frequency paired with a proportionally short wavelength can produce the exact same product as a low frequency paired with a proportionally long wavelength. This is exactly how red light and blue light both travel at light speed despite having different frequencies and wavelengths, and how a low musical note and a high musical note both travel through air at roughly the same speed of sound.",
      },
      {
        id: "physics-wave-speed-explain-004",
        question: "Why does rearranging v = fλ into f = v/λ or λ = v/f still describe the same underlying relationship?",
        answer:
          "All three forms — v = fλ, f = v/λ, and λ = v/f — are the same single equation, just solved for a different unknown using ordinary algebra (dividing both sides by whichever quantity you want isolated). None of them is a separate physical law; they're three views of one relationship, which is why the Equation Explorer's three tabs always show numbers that are consistent with each other.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE — can I solve a problem using this?
  // -------------------------------------------------------------
  practice: {
    // Foreign key into the quiz-engine registry — all questions live in
    // @/features/quiz-engine/data/physics-wave-speed-quiz.ts, none duplicated here.
    quizId: "physics-wave-speed",
  },

  // -------------------------------------------------------------
  // CHALLENGE — realistic problems
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. Some use reasoning alone; others ask you to use the simulation above to check your answer. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "physics-wave-speed-challenge-001",
        title: "Find the Speed",
        scenario: "A wave has a frequency of 3 Hz and a wavelength of 5 m.",
        objective: "Calculate the wave speed, in m/s.",
        requiresExperiment: false,
        hints: ["Use v = fλ.", "3 multiplied by 5."],
        answer: { mode: "numeric", unit: "m/s", target: 15, tolerance: 0.2 },
        explanation: "v = fλ = 3 × 5 = 15 m/s.",
      },
      {
        id: "physics-wave-speed-challenge-002",
        title: "Find the Frequency",
        scenario: "A wave travels at 18 m/s and has a wavelength of 3 m.",
        objective: "Calculate the frequency of this wave, in Hz.",
        requiresExperiment: false,
        hints: ["Use f = v / λ.", "18 divided by 3."],
        answer: { mode: "numeric", unit: "Hz", target: 6, tolerance: 0.1 },
        explanation: "f = v / λ = 18 / 3 = 6 Hz.",
      },
      {
        id: "physics-wave-speed-challenge-003",
        title: "Find the Wavelength",
        scenario: "A wave travels at 8 m/s with a frequency of 4 Hz.",
        objective: "Calculate the wavelength of this wave, in meters.",
        requiresExperiment: false,
        hints: ["Use λ = v / f.", "8 divided by 4."],
        answer: { mode: "numeric", unit: "m", target: 2, tolerance: 0.1 },
        explanation: "λ = v / f = 8 / 4 = 2 m.",
      },
      {
        id: "physics-wave-speed-challenge-004",
        title: "Match the Simulation to a Target Speed",
        scenario: "Use the frequency and wavelength steppers in the lab above.",
        objective: "Find a frequency and wavelength combination that produces a wave speed of exactly 8 m/s, then report the wavelength you used.",
        tools: [{ id: "frequency-stepper", label: "Frequency stepper (1–4 Hz)" }, { id: "wavelength-stepper", label: "Wavelength stepper (1–4 m)" }],
        hints: ["Try frequency = 2 Hz first, and work out what wavelength would give v = 8 m/s.", "λ = v / f = 8 / 2."],
        answer: { mode: "numeric", unit: "m", target: 4, tolerance: 0.1 },
        explanation: "With f = 2 Hz, λ = v/f = 8/2 = 4 m gives v = 2 × 4 = 8 m/s. (f = 4 Hz and λ = 2 m also works, since 4 × 2 = 8 as well.)",
      },
      {
        id: "physics-wave-speed-challenge-005",
        title: "Compare Two Waves' Speeds",
        scenario: "Wave A has f = 5 Hz and λ = 2 m. Wave B has f = 2 Hz and λ = 6 m.",
        objective: "Determine which wave has the greater speed.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Wave B — its speed (12 m/s) is greater than Wave A's (10 m/s)" },
            { id: "b", label: "Wave A — its higher frequency automatically means a higher speed" },
            { id: "c", label: "They must be equal since both are waves" },
            { id: "d", label: "Speed cannot be compared without knowing the medium" },
          ],
          correctOptionId: "a",
        },
        explanation: "Wave A: v = 5 × 2 = 10 m/s. Wave B: v = 2 × 6 = 12 m/s. Wave B is faster, even though it has the lower frequency — because speed depends on the product fλ, not frequency alone.",
        hints: ["Calculate v = fλ for each wave separately before comparing.", "Higher frequency does not automatically mean higher speed — check the actual product."],
      },
      {
        id: "physics-wave-speed-challenge-006",
        title: "Correct a Deliberately Wrong Claim",
        scenario: "A classmate says: 'Since v = fλ, and this simulation lets me set frequency and wavelength completely independently, wave speed in the real world must also be totally free to set however I like.'",
        objective: "Explain what's misleading about this claim.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "In the simulation, speed is whatever f and λ produce — but for a real wave in a fixed medium, speed is usually set by the medium, so frequency and wavelength adjust to match it instead" },
            { id: "b", label: "The classmate is completely correct — real wave speed can always be set freely" },
            { id: "c", label: "v = fλ only applies to the simulation, not to real waves" },
            { id: "d", label: "Frequency and wavelength are never actually related to speed" },
          ],
          correctOptionId: "a",
        },
        explanation: "The simulation is built to let you freely explore all three variables so you can see how the equation behaves — but for a real wave traveling through one particular medium, the medium's physical properties usually fix the speed, and frequency/wavelength trade off against each other to satisfy v = fλ, rather than speed being freely chosen.",
        hints: ["Think back to the trade-off scenario from Predict, where speed was held fixed instead of free to change.", "What's true in an exploratory simulation isn't always true for a real, physical wave."],
      },
      {
        id: "physics-wave-speed-challenge-007",
        title: "Multi-Step: From Period to Speed",
        scenario: "A wave has a period of 0.5 s and a wavelength of 4 m.",
        objective: "Calculate the wave's speed, in m/s. (Hint: you'll need to find frequency first.)",
        requiresExperiment: false,
        maxAttempts: 3,
        hints: ["First convert period to frequency using f = 1/T.", "Then apply v = fλ using that frequency."],
        answer: { mode: "numeric", unit: "m/s", target: 8, tolerance: 0.2 },
        explanation: "f = 1/T = 1/0.5 = 2 Hz. Then v = fλ = 2 × 4 = 8 m/s.",
      },
      {
        id: "physics-wave-speed-challenge-008",
        title: "Real-World Mission: Sound Wavelength",
        scenario: "Sound travels through air at approximately 340 m/s. A tuning fork produces a tone at 425 Hz.",
        objective: "Calculate the wavelength of the sound wave this tuning fork produces, in meters.",
        requiresExperiment: false,
        maxAttempts: 3,
        hints: ["Use λ = v / f with v = 340 m/s.", "340 divided by 425."],
        answer: { mode: "numeric", unit: "m", target: 0.8, tolerance: 0.05 },
        explanation: "λ = v / f = 340 / 425 = 0.8 m — showing how v = fλ applies just as directly to real sound waves as it does to the lab's simplified wave.",
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "physics",
      topicSlug: "frequency-period",
      label: "Frequency & Period",
      href: "/dashboard/physics/frequency-period",
      reason: "Revisit the frequency/period relationship that this topic's f in v = fλ builds directly on.",
    },
    {
      subjectSlug: "physics",
      topicSlug: "basic-wave-motion",
      label: "Basic Wave Motion",
      href: "/dashboard/physics/basic-wave-motion",
      reason: "Revisit the crest, trough, amplitude, and wavelength vocabulary this topic builds on.",
    },
  ],
};

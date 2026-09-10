import type { TopicContent } from "../types";

/**
 * Frequency & Period — Physics Batch 2 (Wave Motion, topic 3 of 4).
 * Reuses the existing `FrequencyPeriod` simulation
 * (`@/features/subjects/physics/frequency-period`) exactly as-is: it
 * already animates a reference particle with a rotating "cycle
 * clock," shows a fixed one-second window with the exact number of
 * cycles drawn across it, displays live frequency/period readouts
 * tied together by T = 1/f, offers a low-vs-high frequency comparison
 * panel, a small "make it complete 3 cycles per second" experiment,
 * and its own 2-question concept check — so no simulation code
 * changes were needed. Builds on the crest/trough/wavelength
 * vocabulary from Basic Wave Motion without re-teaching it, and
 * deliberately keeps wavelength out of the lesson (the simulation's
 * wavelength is fixed) so students master the frequency/period
 * relationship in isolation before Wave Speed introduces wavelength
 * as a third variable.
 */

const oneSecondSketch = (
  <svg viewBox="0 0 260 110" className="mx-auto h-24 w-full max-w-xs" role="img" aria-labelledby="one-second-sketch-title">
    <title id="one-second-sketch-title">A one-second window showing three complete wave cycles, meaning the frequency is 3 Hz.</title>
    <line x1="10" y1="55" x2="250" y2="55" strokeWidth="1" strokeDasharray="6 5" className="stroke-ink/20 dark:stroke-bone/20" />
    <path
      d="M10 55 C 22 30, 34 30, 46 55 C 58 80, 70 80, 82 55 C 94 30, 106 30, 118 55 C 130 80, 142 80, 154 55 C 166 30, 178 30, 190 55 C 202 80, 214 80, 226 55 C 238 30, 250 30, 250 55"
    fill="none"
      strokeWidth="2.5"
      className="stroke-subject-physics"
    />
    <line x1="10" y1="10" x2="10" y2="100" strokeWidth="1.5" className="stroke-ink/40 dark:stroke-bone/40" />
    <line x1="250" y1="10" x2="250" y2="100" strokeWidth="1.5" className="stroke-ink/40 dark:stroke-bone/40" />
    <text x="10" y="8" textAnchor="middle" className="fill-ink-soft font-mono text-[8px] dark:fill-bone-soft">0 s</text>
    <text x="250" y="8" textAnchor="middle" className="fill-ink-soft font-mono text-[8px] dark:fill-bone-soft">1 s</text>
    <text x="130" y="100" textAnchor="middle" className="fill-subject-physics font-mono text-[9px] font-semibold">3 cycles in 1 second = 3 Hz</text>
  </svg>
);

const periodSketch = (
  <svg viewBox="0 0 260 110" className="mx-auto h-24 w-full max-w-xs" role="img" aria-labelledby="period-sketch-title">
    <title id="period-sketch-title">One complete cycle marked from start back to start, labeled with its duration T.</title>
    <line x1="10" y1="55" x2="250" y2="55" strokeWidth="1" strokeDasharray="6 5" className="stroke-ink/20 dark:stroke-bone/20" />
    <path
      d="M10 55 C 34 20, 58 20, 82 55 C 106 90, 130 90, 154 55"
      fill="none"
      strokeWidth="2.5"
      className="stroke-subject-physics"
    />
    <path d="M154 55 C 178 20, 202 20, 226 55" fill="none" strokeWidth="2" strokeDasharray="4 4" className="stroke-ink/30 dark:stroke-bone/30" />
    <circle cx="10" cy="55" r="4" className="fill-amber-500" />
    <circle cx="154" cy="55" r="4" className="fill-amber-500" />
    <line x1="10" y1="70" x2="154" y2="70" strokeWidth="1.5" className="stroke-amber-500" />
    <line x1="10" y1="65" x2="10" y2="75" strokeWidth="1.5" className="stroke-amber-500" />
    <line x1="154" y1="65" x2="154" y2="75" strokeWidth="1.5" className="stroke-amber-500" />
    <text x="82" y="88" textAnchor="middle" className="fill-amber-600 font-mono text-[9px] font-semibold dark:fill-amber-400">one period, T</text>
  </svg>
);

export const physicsFrequencyPeriodContent: TopicContent = {
  subjectSlug: "physics",
  topicSlug: "frequency-period",
  title: "Frequency & Period",
  subjectLabel: "Physics",
  topicLabel: "Wave Motion",
  colorToken: "physics",
  simulationHref: "/dashboard/physics/frequency-period",

  // -------------------------------------------------------------
  // LEARN — what am I learning?
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Define frequency as the number of complete cycles that happen every second.",
      "Define period as the time it takes to complete one full cycle.",
      "Identify the units of frequency (hertz, Hz) and period (seconds, s).",
      "Convert between frequency and period using T = 1/f and f = 1/T.",
      "Explain why a higher frequency always means a shorter period, and vice versa.",
      "Count how many cycles occur in a given amount of time, and work backward from a cycle count to a frequency.",
    ],
    concepts: [
      {
        term: "Frequency (f)",
        explanation:
          "How many complete oscillations, or cycles, happen every second. A higher frequency means the motion repeats more often in the same amount of time.",
      },
      {
        term: "Period (T)",
        explanation:
          "The time it takes to complete exactly one full cycle — from a starting position, through the whole motion, back to that same position moving the same way. A shorter period means each cycle finishes faster.",
      },
      {
        term: "One complete cycle",
        explanation:
          "A full repetition of the oscillation: for the reference particle in the simulation, that means starting at equilibrium, swinging up to its peak, back down through equilibrium, down to its lowest point, and back to where it started.",
      },
      {
        term: "The inverse relationship: T = 1/f",
        explanation:
          "Frequency and period describe exactly the same motion from two different angles: frequency counts cycles per second, period measures seconds per cycle. Because of that, one is always the mathematical reciprocal of the other — increase one and the other automatically decreases.",
        formula: "T = \\dfrac{1}{f} \\quad\\quad f = \\dfrac{1}{T}",
        formulaCaption: "period = 1 ÷ frequency, and frequency = 1 ÷ period",
      },
    ],
    whyItMatters:
      "Frequency and period show up anywhere something repeats on a regular schedule. Musicians describe pitch in terms of frequency — a note vibrating at 440 Hz is the 'A' string on a guitar, and doubling that frequency raises the note by exactly one octave. Doctors read a pulse as a frequency (beats per minute) and could just as easily describe it by its period (the time between beats). Electrical engineers care about both: household AC power in many countries alternates at 50 or 60 Hz, meaning it completes 50 or 60 full cycles every second, with a period of about 0.017-0.02 seconds. Once you can flip fluently between frequency and period, you can read specs in music, medicine, and electronics with the same two equations.",
    keyTerms: [
      { term: "Frequency", definition: "The number of complete cycles that occur every second, measured in hertz (Hz)." },
      { term: "Period", definition: "The time required to complete one full cycle, measured in seconds (s)." },
      { term: "Hertz (Hz)", definition: "The unit of frequency; 1 Hz means exactly one complete cycle per second." },
      { term: "Cycle", definition: "One full repetition of an oscillation, returning to the same position and direction of motion." },
    ],
    visualAids: [
      {
        id: "one-second-sketch",
        caption: "Counting exactly how many complete cycles fit into one second is what frequency, in Hz, directly measures.",
        visual: oneSecondSketch,
      },
      {
        id: "period-sketch",
        caption: "The time from one starting point back to the same point again — a single complete cycle — is the period, T.",
        visual: periodSketch,
      },
    ],
    misconceptions: [
      {
        id: "misconception-frequency-is-speed",
        misconception: "A higher frequency means the wave is physically moving faster through space.",
        correction:
          "Frequency describes how often the motion repeats, not how fast the wave pattern travels. A wave can have a very high frequency while its propagation speed stays completely unchanged — the two are related but not the same quantity. Watch the reference particle in the lab below: raising frequency makes it oscillate faster in place, which is a different thing from the wave pattern's travel speed.",
      },
      {
        id: "misconception-period-and-frequency-move-same-way",
        misconception: "If frequency increases, period increases too, since they're both just 'how fast something is.'",
        correction:
          "Frequency and period move in opposite directions from each other — that's the whole point of T = 1/f. A higher frequency (more cycles per second) always means a shorter period (less time per cycle), never a longer one.",
      },
      {
        id: "misconception-hz-is-a-rate-of-anything",
        misconception: "Hertz can describe any kind of 'per second' rate, the same way miles-per-hour does for speed.",
        correction:
          "Hertz specifically means complete cycles per second of a repeating motion — it's reserved for oscillations and waves, not a general-purpose rate unit. 5 Hz always means '5 complete cycles every second,' nothing else.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT — what should I predict?
  // -------------------------------------------------------------
  predict: {
    intro:
      "Commit to a prediction before you touch the frequency control below — check your answer against the simulation once you've locked it in.",
    scenarios: [
      {
        id: "physics-frequency-period-predict-001",
        scenario: "The simulation starts at its default frequency of 2 Hz.",
        question: "About how long does the reference particle take to complete one full cycle at 2 Hz?",
        options: [
          { id: "half-second", label: "0.5 seconds" },
          { id: "two-seconds", label: "2 seconds" },
          { id: "one-second", label: "1 second" },
          { id: "four-seconds", label: "4 seconds" },
        ],
        actualResultOptionId: "half-second",
        explanation: "T = 1/f = 1/2 = 0.5 s. Watch the cycle ring and the one-second window — you should see exactly two complete loops finish within that one-second span.",
        hint: "Use T = 1/f with f = 2 Hz.",
      },
      {
        id: "physics-frequency-period-predict-002",
        scenario: "You raise the frequency control from 2 Hz to 4 Hz.",
        question: "What happens to the period as frequency increases?",
        options: [
          { id: "period-shorter", label: "The period gets shorter" },
          { id: "period-longer", label: "The period gets longer" },
          { id: "period-same", label: "The period stays exactly the same" },
          { id: "period-undefined", label: "Period no longer applies at higher frequencies" },
        ],
        actualResultOptionId: "period-shorter",
        explanation: "Frequency and period are inversely related. Raising the frequency to 4 Hz shortens the period to T = 1/4 = 0.25 s — each cycle now finishes in half the time it did at 2 Hz.",
        hint: "Frequency and period always move in opposite directions.",
      },
      {
        id: "physics-frequency-period-predict-003",
        scenario: "Set the frequency to 3 Hz and click \"Watch 1 second.\"",
        question: "How many complete cycles will you see happen within that highlighted one-second window?",
        options: [
          { id: "three-cycles", label: "3 complete cycles" },
          { id: "one-cycle", label: "1 complete cycle" },
          { id: "six-cycles", label: "6 complete cycles" },
          { id: "half-cycle", label: "Half of one cycle" },
        ],
        actualResultOptionId: "three-cycles",
        explanation: "A frequency of 3 Hz means, by definition, 3 complete cycles occur every second — which is exactly what the one-second window is built to show you directly.",
        hint: "Frequency in Hz literally means \"cycles per second.\"",
      },
      {
        id: "physics-frequency-period-predict-004",
        scenario: "Compare the Low Frequency (2 Hz) and High Frequency (4 Hz) mini-waves in the comparison panel.",
        question: "Besides oscillating faster, what else changes about the high-frequency wave compared to the low-frequency one?",
        options: [
          { id: "nothing-else", label: "Nothing else — same wavelength and amplitude, only the oscillation rate differs" },
          { id: "bigger-amplitude", label: "The high-frequency wave has a larger amplitude" },
          { id: "different-wavelength", label: "The high-frequency wave has a shorter wavelength" },
          { id: "changes-color", label: "The wave visually changes color" },
        ],
        actualResultOptionId: "nothing-else",
        explanation: "In this simulation, wavelength and amplitude are held fixed on purpose — the only variable changing is how fast the pattern oscillates in time, which isolates the frequency/period relationship from wavelength (that comes later, in Wave Speed).",
        hint: "This simulation is designed to change exactly one thing at a time.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE — the guided experiment
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Watch the reference particle (highlighted in amber) oscillate, and follow the small rotating \"cycle clock\" next to it — one full turn of the dot is exactly one complete cycle.",
      "Read the live Frequency and Period readouts below the wave, and check that T = 1/f matches what's shown.",
      "Click \"Watch 1 second\" to highlight a fixed one-second window and count the complete cycles drawn across it — that count is the frequency.",
      "Use the frequency stepper to raise and lower the frequency, and watch how the period readout (and the one-second window's cycle count) respond.",
      "Open the Low vs High Frequency comparison panel and watch both mini-waves animate side by side at their own fixed frequencies.",
      "Try the built-in experiment: adjust the frequency control until the wave completes exactly 3 cycles in one second.",
    ],
    tryThis: [
      "Set the frequency to 1 Hz and predict the period before checking the readout — then try 5 Hz and do the same.",
      "Watch a single cycle of the reference particle and time it against the period readout — do they match?",
      "Try to find two different frequency settings whose periods add up to exactly 1 second.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN — why does this happen?
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "physics-frequency-period-explain-001",
        question: "Why are frequency and period always reciprocals of each other, rather than just loosely related?",
        answer:
          "Frequency counts cycles per second, and period measures seconds per cycle — those are literally the same underlying quantity (how fast the motion repeats) expressed as two different ratios that are flipped versions of one another. That's not a coincidence that needs separate proof; it falls directly out of what each word means, which is why T = 1/f holds exactly, not just approximately.",
      },
      {
        id: "physics-frequency-period-explain-002",
        question: "Why does raising the frequency always shorten the period, with no exceptions?",
        answer:
          "If more cycles have to fit into the same one second (higher frequency), each individual cycle necessarily has less time available to it — there's no way to pack more repetitions into a fixed interval without each one taking less time. That's exactly what the inverse relationship in T = 1/f captures.",
      },
      {
        id: "physics-frequency-period-explain-003",
        question: "Why does the one-second window always show exactly the frequency value's worth of cycles?",
        answer:
          "That's the definition of hertz: 1 Hz is defined as one complete cycle occurring in one second. So a frequency of 3 Hz means, by definition and not by coincidence, that 3 full cycles must fit inside any one-second window — the simulation's one-second view is simply drawing that definition directly.",
      },
      {
        id: "physics-frequency-period-explain-004",
        question: "Why does changing frequency in this simulation not change the wave's wavelength or amplitude?",
        answer:
          "This simulation deliberately holds wavelength and amplitude fixed and only lets frequency (and therefore how fast the phase advances in time) change, so that the frequency/period relationship can be studied in isolation, without wavelength as a confounding third variable. Wavelength becomes a live variable in the next topic, Wave Speed, once frequency and period are already solid.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE — can I solve a problem using this?
  // -------------------------------------------------------------
  practice: {
    // Foreign key into the quiz-engine registry — all questions live in
    // @/features/quiz-engine/data/physics-frequency-period-quiz.ts, none duplicated here.
    quizId: "physics-frequency-period",
  },

  // -------------------------------------------------------------
  // CHALLENGE — realistic problems
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. Some use reasoning alone; others ask you to use the simulation above to check your answer. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "physics-frequency-period-challenge-001",
        title: "Read the Period from a Frequency",
        scenario: "A vibrating guitar string oscillates at a frequency of 4 Hz in a simplified classroom model.",
        objective: "Calculate the period of this oscillation, in seconds.",
        requiresExperiment: false,
        hints: ["Use T = 1/f.", "1 divided by 4 is a familiar decimal."],
        answer: { mode: "numeric", unit: "s", target: 0.25, tolerance: 0.01 },
        explanation: "T = 1/f = 1/4 = 0.25 s.",
      },
      {
        id: "physics-frequency-period-challenge-002",
        title: "Read the Frequency from a Period",
        scenario: "A pendulum in a physics demo completes one full swing (there and back) every 0.5 seconds.",
        objective: "Calculate the frequency of this pendulum's oscillation, in Hz.",
        requiresExperiment: false,
        hints: ["Use f = 1/T.", "1 divided by 0.5 is a whole number."],
        answer: { mode: "numeric", unit: "Hz", target: 2, tolerance: 0.05 },
        explanation: "f = 1/T = 1/0.5 = 2 Hz.",
      },
      {
        id: "physics-frequency-period-challenge-003",
        title: "Tune the Simulation to a Target Frequency",
        scenario: "Use the frequency control in the lab above.",
        objective: "Set the simulation's frequency so that its period is exactly 0.2 seconds, then read off the frequency you needed.",
        tools: [{ id: "frequency-stepper", label: "Frequency stepper (0.5–5 Hz)" }],
        hints: ["First work out f = 1/T for T = 0.2 s.", "1 divided by 0.2 is a whole number."],
        answer: { mode: "numeric", unit: "Hz", target: 5, tolerance: 0.1 },
        explanation: "f = 1/T = 1/0.2 = 5 Hz — the maximum setting on this simulation's frequency control.",
      },
      {
        id: "physics-frequency-period-challenge-004",
        title: "Count Cycles Over a Longer Interval",
        scenario: "A wave oscillates at a steady 2.5 Hz.",
        objective: "Determine how many complete cycles occur in 4 seconds.",
        requiresExperiment: false,
        hints: ["Cycles = frequency × time.", "2.5 multiplied by 4."],
        answer: { mode: "numeric", target: 10, tolerance: 0.1 },
        explanation: "Cycles = f × t = 2.5 Hz × 4 s = 10 complete cycles.",
      },
      {
        id: "physics-frequency-period-challenge-005",
        title: "Work Backward from a Cycle Count",
        scenario: "A student counts exactly 9 complete cycles of a wave occurring over 3 seconds.",
        objective: "Determine the frequency of this wave, in Hz.",
        requiresExperiment: false,
        hints: ["Frequency = cycles ÷ time.", "9 divided by 3."],
        answer: { mode: "numeric", unit: "Hz", target: 3, tolerance: 0.1 },
        explanation: "f = cycles ÷ time = 9 ÷ 3 = 3 Hz.",
      },
      {
        id: "physics-frequency-period-challenge-006",
        title: "Compare Two Waves",
        scenario: "Wave A has a period of 0.4 s. Wave B has a period of 0.1 s.",
        objective: "Determine which wave has the higher frequency, and explain your reasoning.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Wave B — its shorter period means more cycles fit into each second" },
            { id: "b", label: "Wave A — its longer period means a higher frequency" },
            { id: "c", label: "They must have equal frequency since both are periods" },
            { id: "d", label: "Frequency cannot be compared using period alone" },
          ],
          correctOptionId: "a",
        },
        explanation: "Wave A: f = 1/0.4 = 2.5 Hz. Wave B: f = 1/0.1 = 10 Hz. The shorter period always corresponds to the higher frequency.",
        hints: ["Convert both periods to frequencies using f = 1/T, then compare.", "A shorter period always means a higher frequency."],
      },
      {
        id: "physics-frequency-period-challenge-007",
        title: "Correct a Deliberately Wrong Claim",
        scenario: "A classmate insists: 'If I double the frequency of a wave, the period also doubles, since they're both just describing how the wave repeats.'",
        objective: "Explain what's wrong with this reasoning and state the correct relationship.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Frequency and period are inversely related — doubling frequency halves the period, it never doubles it" },
            { id: "b", label: "The classmate is correct — doubling frequency does double the period" },
            { id: "c", label: "Frequency and period are unrelated quantities" },
            { id: "d", label: "Doubling frequency quadruples the period" },
          ],
          correctOptionId: "a",
        },
        explanation: "T = 1/f means period and frequency move in opposite directions. If f doubles, T = 1/f is cut in half, not doubled — the classmate has the direction of the relationship backward.",
        hints: ["Try it with real numbers: if f goes from 2 Hz to 4 Hz, what happens to T = 1/f?", "Frequency and period are reciprocals, which always move opposite ways."],
      },
      {
        id: "physics-frequency-period-challenge-008",
        title: "Real-World Mission: Reading a Metronome",
        scenario: "A metronome used for music practice is set to 90 beats per minute.",
        objective: "Convert this rate into a frequency in Hz, then determine the period between beats in seconds.",
        requiresExperiment: false,
        maxAttempts: 3,
        hints: ["First convert beats per minute into beats per second by dividing by 60.", "Once you have the frequency in Hz, use T = 1/f for the period."],
        answer: { mode: "numeric", unit: "Hz", target: 1.5, tolerance: 0.05 },
        explanation: "90 beats per minute ÷ 60 seconds = 1.5 Hz. The period between beats is T = 1/1.5 ≈ 0.67 s.",
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "physics",
      topicSlug: "wave-speed",
      label: "Wave Speed — v = fλ",
      href: "/dashboard/physics/wave-speed",
      reason: "Bring wavelength back into the picture and see how it combines with frequency to determine wave speed.",
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

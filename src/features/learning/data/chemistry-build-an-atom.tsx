import type { TopicContent } from "../types";

/**
 * Atomic Structure — Chemistry Batch 1's first topic, built to the
 * same full standard (Learn, Predict, Explore, Explain, Practice,
 * Challenge) as the strongest Physics/Mathematics reference
 * implementations (see `physics-gravitation.tsx`). Its Explore
 * experience is the existing `Build an Atom` lab
 * (`@/features/subjects/chemistry/build-an-atom`) — inspection found
 * a complete, working simulation (drag-and-drop or +/- particle
 * controls, live Info Panel showing Atomic number / Mass number /
 * Protons / Neutrons / Electrons / charge, particle click-to-inspect,
 * zoom, high-contrast/large-text toggles) covering the first 20
 * elements (hydrogen–calcium) with simplified 2-8-8 Bohr-model
 * shells. No new simulation or 3D upgrade was built: the existing 2D
 * shell diagram already makes electron arrangement, isotopes, and
 * ions directly visible and interactive, and a 3D orbital model would
 * risk implying electrons literally travel on fixed circular paths —
 * scientifically misleading for this level. All content below is
 * grounded in that lab's real controls and readouts.
 */
const shellDiagram = (
  <svg viewBox="0 0 260 200" className="mx-auto h-48 w-full max-w-xs" role="img" aria-labelledby="atom-shell-title">
    <title id="atom-shell-title">
      A simplified atom diagram: a central nucleus made of protons and neutrons, surrounded by electrons arranged in shells — 2 electrons in the first shell, up to 8 in the second, up to 8 in the third.
    </title>
    <circle cx="130" cy="100" r="18" className="fill-none stroke-ink/20 dark:stroke-bone/20" strokeWidth="1" />
    <circle cx="130" cy="100" r="48" className="fill-none stroke-ink/20 dark:stroke-bone/20" strokeWidth="1" />
    <circle cx="130" cy="100" r="78" className="fill-none stroke-ink/20 dark:stroke-bone/20" strokeWidth="1" />
    <circle cx="130" cy="100" r="10" className="fill-[#E0524F]" />
    <circle cx="122" cy="94" r="4" className="fill-[#3D5AFE] stroke-white" strokeWidth="1" />
    <circle cx="137" cy="106" r="4" className="fill-[#3D5AFE] stroke-white" strokeWidth="1" />
    <circle cx="130" cy="82" r="4" className="fill-[#2E9E5B]" />
    <circle cx="130" cy="118" r="4" className="fill-[#2E9E5B]" />
    <circle cx="82" cy="100" r="4" className="fill-[#2E9E5B]" />
    <circle cx="178" cy="100" r="4" className="fill-[#2E9E5B]" />
    <circle cx="104" cy="53" r="4" className="fill-[#2E9E5B]" />
    <circle cx="52" cy="100" r="4" className="fill-[#2E9E5B]" />
    <text x="130" y="10" textAnchor="middle" className="fill-ink-soft font-mono text-[9px] uppercase tracking-wide dark:fill-bone-soft">
      nucleus + electron shells
    </text>
  </svg>
);

export const chemistryBuildAnAtomContent: TopicContent = {
  subjectSlug: "chemistry",
  topicSlug: "build-an-atom",
  title: "Build an Atom",
  subjectLabel: "Chemistry",
  topicLabel: "Atomic Structure",
  colorToken: "chemistry",
  simulationHref: "/dashboard/chemistry/build-an-atom",

  learn: {
    objectives: [
      "Identify the three subatomic particles in an atom, their charges, and where each one lives.",
      "Explain how the number of protons alone determines which element an atom is.",
      "Calculate an atom's mass number and net charge from its particle counts.",
      "Distinguish an isotope (same element, different neutron count) from an ion (same element, different electron count).",
    ],
    concepts: [
      {
        term: "Protons, neutrons, and electrons",
        explanation:
          "Protons (positive charge) and neutrons (no charge) sit together in the nucleus, the atom's dense center. Electrons (negative charge) occupy the much larger space around it, arranged in shells. Protons and neutrons have roughly the same mass; an electron is about 1,800 times lighter than either.",
      },
      {
        term: "Atomic number (Z)",
        explanation:
          "The number of protons in an atom's nucleus. It's what defines an element — every carbon atom in the universe has exactly 6 protons, and any atom with 6 protons is carbon, no matter how many neutrons or electrons it has.",
      },
      {
        term: "Mass number (A)",
        explanation: "The total count of protons and neutrons in the nucleus — the particles that make up almost all of the atom's mass.",
        formula: "A = Z + N",
        formulaCaption: "Z = protons, N = neutrons",
      },
      {
        term: "Net charge",
        explanation:
          "An atom with equal numbers of protons and electrons is electrically neutral. Add or remove electrons without changing the proton count, and the atom becomes a charged ion instead.",
        formula: "\\text{charge} = \\text{protons} - \\text{electrons}",
      },
      {
        term: "Isotopes vs. ions",
        explanation:
          "An isotope changes the neutron count only — same element, same charge, different mass. An ion changes the electron count only — same element, same mass, different charge. Changing the proton count does neither of these; it makes a different element entirely.",
      },
    ],
    whyItMatters:
      "Every material you interact with — the air you breathe, the screen you're reading this on, your own body — is built from about 90 naturally occurring elements, and the only thing that tells them apart is proton count. Isotopes like carbon-14 are used to date fossils and ancient artifacts. Ions like the sodium and potassium in your cells are what let your nerves fire and your heart beat. Understanding this one number — protons — unlocks most of the periodic table.",
    keyTerms: [
      { term: "Nucleus", definition: "The small, dense center of an atom, containing its protons and neutrons." },
      { term: "Proton", definition: "A positively charged particle in the nucleus. Its count defines the element." },
      { term: "Neutron", definition: "An uncharged particle in the nucleus, adding mass without adding charge." },
      { term: "Electron", definition: "A negatively charged particle occupying the shells around the nucleus." },
      { term: "Atomic number (Z)", definition: "The number of protons in an atom — unique to each element." },
      { term: "Mass number (A)", definition: "The total number of protons and neutrons: A = Z + N." },
      { term: "Isotope", definition: "An atom of the same element with a different number of neutrons." },
      { term: "Ion", definition: "An atom (or group of atoms) with an overall charge, from an unequal number of protons and electrons." },
    ],
    visualAids: [
      {
        id: "shell-diagram",
        caption:
          "A simplified atom: the nucleus (protons in red, neutrons in blue) sits at the center, with electrons (green) arranged in shells around it — the same 2-8-8 arrangement the Build an Atom lab uses.",
        visual: shellDiagram,
      },
    ],
    misconceptions: [
      {
        id: "misconception-neutrons-change-element",
        misconception: "Adding or removing a neutron changes what element an atom is.",
        correction:
          "Only the proton count defines the element. Changing neutrons while keeping protons the same just creates a different isotope of the exact same element — carbon-12 and carbon-14 are both carbon, both with 6 protons.",
      },
      {
        id: "misconception-electrons-change-mass",
        misconception: "Adding or removing an electron noticeably changes an atom's mass.",
        correction:
          "Electrons are about 1,800 times lighter than protons or neutrons, so mass number (A = Z + N) doesn't even count them. Gaining or losing electrons changes an atom's charge, turning it into an ion — not its mass.",
      },
      {
        id: "misconception-ions-are-different-elements",
        misconception: "A charged ion is a different element from its neutral form.",
        correction:
          "An ion is still the same element — its proton count, and therefore its atomic number, hasn't changed. Only the electron count (and so the charge) is different. Na and Na⁺ are both sodium.",
      },
    ],
  },

  predict: {
    intro:
      "Commit to a prediction before you touch the particle controls below — then build the matching atom in the lab and check your answer.",
    scenarios: [
      {
        id: "chemistry-atom-predict-001",
        scenario: "You start with a neutral carbon atom (6 protons, 6 neutrons, 6 electrons) and add one more proton.",
        question: "What happens to the atom?",
        options: [
          { id: "becomes-nitrogen", label: "It becomes a nitrogen atom — a different element entirely" },
          { id: "becomes-isotope", label: "It stays carbon, just a heavier isotope" },
          { id: "becomes-ion", label: "It stays carbon, but becomes a positive ion" },
          { id: "no-change", label: "Nothing changes — protons don't affect identity" },
        ],
        actualResultOptionId: "becomes-nitrogen",
        explanation:
          "The atomic number — the proton count — is what defines an element. Going from 6 to 7 protons turns carbon into nitrogen, a completely different element, not a variant of carbon.",
        hint: "Which particle count is the one that determines which element an atom is?",
      },
      {
        id: "chemistry-atom-predict-002",
        scenario: "You start with a neutral oxygen atom (8 protons, 8 neutrons, 8 electrons) and remove one neutron.",
        question: "What happens to the atom?",
        options: [
          { id: "isotope", label: "It stays oxygen — now a lighter isotope with a smaller mass number" },
          { id: "different-element", label: "It becomes a different element" },
          { id: "ion", label: "It becomes a charged ion" },
          { id: "unstable", label: "It stops being an atom" },
        ],
        actualResultOptionId: "isotope",
        explanation:
          "Removing a neutron doesn't touch the proton count, so the element identity (oxygen, Z = 8) is unchanged. The mass number drops by one, since A = Z + N — this is simply a lighter isotope of oxygen.",
        hint: "Neutrons contribute to mass number, not atomic number. Does the element depend on mass number or atomic number?",
      },
      {
        id: "chemistry-atom-predict-003",
        scenario: "You start with a neutral sodium atom (11 protons, 12 neutrons, 11 electrons) and remove one electron.",
        question: "What is the resulting particle?",
        options: [
          { id: "sodium-cation", label: "A sodium ion with a +1 charge (Na⁺)" },
          { id: "sodium-anion", label: "A sodium ion with a −1 charge (Na⁻)" },
          { id: "neon-atom", label: "A neutral neon atom" },
          { id: "still-neutral", label: "Still a neutral sodium atom" },
        ],
        actualResultOptionId: "sodium-cation",
        explanation:
          "Charge = protons − electrons. With 11 protons and only 10 electrons left, charge = 11 − 10 = +1. Removing an electron always leaves more positive charge behind, producing a cation.",
        hint: "Use charge = protons − electrons with the new electron count. Is the result positive or negative?",
      },
      {
        id: "chemistry-atom-predict-004",
        scenario: "You build an atom with 17 protons, 18 neutrons, and 18 electrons.",
        question: "What is this atom's net charge?",
        options: [
          { id: "negative-one", label: "−1 (an anion)" },
          { id: "positive-one", label: "+1 (a cation)" },
          { id: "neutral", label: "0 (neutral)" },
          { id: "negative-eighteen", label: "−18" },
        ],
        actualResultOptionId: "negative-one",
        explanation:
          "Charge = protons − electrons = 17 − 18 = −1. With one more electron than protons, this atom (chlorine) is a −1 anion — Cl⁻, the ion found in table salt.",
        hint: "Charge only compares protons to electrons — neutrons don't factor into it at all.",
      },
    ],
  },

  explore: {
    howToUse: [
      "Drag protons, neutrons, and electrons from the tray onto the atom, or use the +/− controls in the side panel.",
      "Watch the element name and symbol in the Info Panel update the instant the proton count changes — nothing else changes it.",
      "Add or remove neutrons without touching protons to build an isotope, and watch the mass number change while the element name doesn't.",
      "Add or remove electrons without touching protons to turn the atom into a positive or negative ion, and watch the charge readout flip.",
      "Click any particle in the nucleus or shells for a short explanation of what it does.",
    ],
    tryThis: [
      "Build carbon (6 protons). Now add 2 neutrons — you've made carbon-14, the isotope used in radiocarbon dating.",
      "Build a neutral sodium atom, then remove one electron. What ion have you made, and what does the Info Panel say its charge is?",
      "Try to change the element shown in the Info Panel without changing the proton count. Confirm it can't be done.",
      "Build an atom with 8 protons and compare it to one with 8 protons and 10 neutrons — same element, different mass number.",
    ],
  },

  explain: {
    questions: [
      {
        id: "chemistry-atom-explain-001",
        question: "Why does changing the proton count change the element, but changing neutrons or electrons doesn't?",
        answer:
          "The identity of an element is defined, by convention and by chemistry itself, entirely by its atomic number — its proton count. Neutrons and electrons can vary within the same element (as isotopes and ions respectively) without the atom ever becoming a different element.",
      },
      {
        id: "chemistry-atom-explain-002",
        question: "Why doesn't electron count appear in the mass number formula?",
        answer:
          "Mass number, A = Z + N, only totals protons and neutrons because those two particles carry essentially all of an atom's mass — electrons are roughly 1,800 times lighter, contributing a negligible amount that's conventionally ignored.",
      },
      {
        id: "chemistry-atom-explain-003",
        question: "Why does removing an electron leave an atom positively charged?",
        answer:
          "A neutral atom has exactly as many electrons as protons, so their charges cancel out. Removing an electron leaves one proton's worth of positive charge with nothing to balance it, so the atom becomes a +1 cation — charge = protons − electrons.",
      },
      {
        id: "chemistry-atom-explain-004",
        question: "Why are two isotopes of the same element chemically almost identical?",
        answer:
          "Chemical behavior — how an atom bonds and reacts — is governed almost entirely by its electrons, especially the outermost ones, which in turn depend on the proton count (electron count in a neutral atom). Since isotopes share the same proton and electron counts and differ only in neutrons (which sit in the nucleus and don't participate in bonding), they behave almost identically in chemical reactions, even though their masses differ.",
      },
    ],
  },

  practice: {
    quizId: "chemistry-atom",
  },

  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. Each one asks you to build a specific atom, ion, or isotope in the lab and read the result off the live Info Panel.",
    scenarios: [
      {
        id: "chemistry-atom-challenge-001",
        title: "Build Fluorine",
        scenario: "You need an atom with an atomic number of 9 and a mass number of 19, that is electrically neutral.",
        objective: "Determine how many neutrons this atom needs, then build it in the lab and confirm the Info Panel matches.",
        constraints: [
          { id: "c1", label: "Mass number = protons + neutrons." },
          { id: "c2", label: "Neutral means protons = electrons." },
        ],
        tools: [
          { id: "proton-controls", label: "Proton +/− controls" },
          { id: "neutron-controls", label: "Neutron +/− controls" },
          { id: "electron-controls", label: "Electron +/− controls" },
          { id: "info-panel", label: "Live Info Panel (Atomic number, Mass number, charge)" },
        ],
        answer: { mode: "numeric", unit: "neutrons", target: 10, tolerance: 0 },
        explanation:
          "Mass number = protons + neutrons, so neutrons = 19 − 9 = 10. Building 9 protons, 10 neutrons, and 9 electrons (equal to protons, for neutral) gives fluorine-19, and the Info Panel should read Atomic number 9, Mass number 19, and Neutral.",
        hints: [
          "Rearrange A = Z + N to solve for N: neutrons = mass number − atomic number.",
          "19 − 9 = ?",
          "Set protons to 9 first — that fixes the element as fluorine — then add neutrons and match electrons to protons for a neutral atom.",
        ],
      },
      {
        id: "chemistry-atom-challenge-002",
        title: "Make a −2 Ion",
        scenario: "Starting from a neutral oxygen atom (8 protons, 8 neutrons, 8 electrons), you need to produce an ion with a net charge of −2.",
        objective: "Determine what to change and build the resulting ion in the lab, confirming the charge readout.",
        constraints: [{ id: "c1", label: "Do not change the proton or neutron count — only electrons." }],
        tools: [
          { id: "electron-controls", label: "Electron +/− controls" },
          { id: "info-panel", label: "Live Info Panel charge readout" },
        ],
        answer: { mode: "numeric", unit: "electrons", target: 10, tolerance: 0 },
        explanation:
          "Charge = protons − electrons. For a charge of −2 with 8 protons: −2 = 8 − electrons, so electrons = 10. Adding 2 electrons to the neutral 8-electron atom gives O²⁻, the oxide ion — the Info Panel should now read a −2 charge.",
        hints: [
          "Use charge = protons − electrons, solved for electrons: electrons = protons − charge.",
          "protons = 8, charge = −2. What is 8 − (−2)?",
          "Add electrons (don't touch protons or neutrons) until the electron count reaches 10.",
        ],
      },
      {
        id: "chemistry-atom-challenge-003",
        title: "Real-World Mission: Carbon-14",
        scenario:
          "Archaeologists use carbon-14, a radioactive isotope of carbon, to date organic material. Regular carbon-12 has 6 protons and 6 neutrons.",
        objective: "Build a neutral atom of carbon-14 in the lab and confirm its mass number on the Info Panel.",
        constraints: [
          { id: "c1", label: "Must remain carbon (6 protons) and electrically neutral." },
          { id: "c2", label: "Mass number must read 14." },
        ],
        tools: [
          { id: "neutron-controls", label: "Neutron +/− controls" },
          { id: "info-panel", label: "Live Info Panel (Mass number, charge)" },
        ],
        answer: { mode: "numeric", unit: "neutrons", target: 8, tolerance: 0 },
        explanation:
          "Carbon always has 6 protons. For mass number 14: neutrons = 14 − 6 = 8, two more than carbon-12's usual 6. Keep electrons at 6 to stay neutral. This carbon-14 atom is unstable and decays at a known, steady rate — the basis for radiocarbon dating.",
        hints: [
          "Carbon's proton count never changes — it's fixed at 6.",
          "Use neutrons = mass number − protons = 14 − 6.",
          "Keep electrons equal to protons (6) so the atom stays neutral while you add neutrons.",
        ],
        maxAttempts: 4,
      },
    ],
  },

  relatedTopics: [],
};

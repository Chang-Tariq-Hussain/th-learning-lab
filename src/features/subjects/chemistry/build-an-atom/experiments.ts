import type { AtomState } from "./atom-model";
import { massNumber, netCharge } from "./atom-model";
import { getElement } from "./elements";

export type ExperimentId = "A" | "B" | "C" | "D" | "E";

export interface ExperimentTask {
  id: string;
  prompt: string;
  hint: string;
  /** Pure check against the live atom; tasks complete themselves as the learner builds. */
  done: (atom: AtomState) => boolean;
  /** Short explanation shown once the task is complete. */
  why: string;
}

export interface Experiment {
  id: ExperimentId;
  title: string;
  summary: string;
  tasks: ExperimentTask[];
}

const el = (z: number) => getElement(z);

export const EXPERIMENTS: Experiment[] = [
  {
    id: "A",
    title: "Build an element",
    summary: "The number of protons decides which element an atom is. Set it to match each target.",
    tasks: [
      {
        id: "a-n",
        prompt: `Build nitrogen (${el(7).symbol}). Set the proton count to its atomic number.`,
        hint: "Nitrogen is element number 7. Use the proton + and − buttons until the info panel says Nitrogen.",
        done: (a) => a.protons === 7,
        why: "Atomic number 7 means 7 protons. Nitrogen is the only element with 7 protons.",
      },
      {
        id: "a-na",
        prompt: "Now build sodium (Na).",
        hint: "Sodium is element number 11. Check the element name in the info panel.",
        done: (a) => a.protons === 11,
        why: "Changing the proton count changed the element. Neutrons and electrons did not decide it.",
      },
      {
        id: "a-ca",
        prompt: "Finally, build calcium (Ca).",
        hint: "Calcium is element number 20. You can also pick it in the periodic selector.",
        done: (a) => a.protons === 20,
        why: "Each element has its own atomic number, so it has its own proton count.",
      },
    ],
  },
  {
    id: "B",
    title: "Create an isotope",
    summary: "Keep the proton count the same and change only the neutrons. The element stays the same; the mass number changes.",
    tasks: [
      {
        id: "b-c",
        prompt: "Start with a neutral carbon atom: 6 protons.",
        hint: "Load the preset 'Carbon-12' or set the protons to 6.",
        done: (a) => a.protons === 6,
        why: "Carbon always has 6 protons.",
      },
      {
        id: "b-13",
        prompt: "Make carbon-13 by changing only the neutrons (6 protons, 7 neutrons).",
        hint: "Add one neutron. Do not touch the protons.",
        done: (a) => a.protons === 6 && massNumber(a) === 13,
        why: "Mass number = 6 + 7 = 13. It is still carbon, because the protons did not change.",
      },
      {
        id: "b-14",
        prompt: "Make carbon-14 (8 neutrons). It is radioactive, used in radiocarbon dating.",
        hint: "Add one more neutron to reach a mass number of 14.",
        done: (a) => a.protons === 6 && massNumber(a) === 14,
        why: "Isotopes of one element have the same number of protons and different numbers of neutrons.",
      },
    ],
  },
  {
    id: "C",
    title: "Create an ion",
    summary: "Add or remove electrons while the protons stay put. The charge changes, but the element does not.",
    tasks: [
      {
        id: "c-na",
        prompt: "Build a neutral sodium atom (11 protons, 11 electrons).",
        hint: "Load the preset 'Sodium-23', or set protons and electrons to 11.",
        done: (a) => a.protons === 11 && netCharge(a) === 0,
        why: "A neutral atom has equal numbers of protons and electrons.",
      },
      {
        id: "c-na+",
        prompt: "Remove one electron to make a sodium ion with charge +1.",
        hint: "Take away one electron. Fewer electrons than protons means a positive charge.",
        done: (a) => a.protons === 11 && netCharge(a) === 1,
        why: "11 protons − 10 electrons = +1. Losing electrons makes a positive ion (cation).",
      },
      {
        id: "c-o2-",
        prompt: "Now build an oxide ion: oxygen (8 protons) with charge −2.",
        hint: "Oxygen has 8 protons. Add electrons until there are 2 more electrons than protons.",
        done: (a) => a.protons === 8 && netCharge(a) === -2,
        why: "8 protons − 10 electrons = −2. Gaining electrons makes a negative ion (anion).",
      },
    ],
  },
];

export interface Challenge {
  id: string;
  prompt: string;
  /** Which properties must match. Properties not listed are free. */
  target: Partial<AtomState>;
  hints: [string, string, string];
}

/** Experiment E: each challenge names a target; the learner can build it any way that works. */
export const CHALLENGES: Challenge[] = [
  {
    id: "mg2+",
    prompt: "Create a magnesium ion with a +2 charge.",
    target: { protons: 12, electrons: 10 },
    hints: [
      "Magnesium's atomic number tells you the protons.",
      "A +2 charge means 2 more protons than electrons.",
      "Magnesium has 12 protons, so it needs 10 electrons.",
    ],
  },
  {
    id: "o2-",
    prompt: "Create an oxide ion with a −2 charge.",
    target: { protons: 8, electrons: 10 },
    hints: [
      "Which element is oxide made from, and how many protons does it have?",
      "A −2 charge means 2 more electrons than protons.",
      "Oxygen has 8 protons, so it needs 10 electrons.",
    ],
  },
  {
    id: "c14",
    prompt: "Create a neutral carbon-14 atom.",
    target: { protons: 6, neutrons: 8, electrons: 6 },
    hints: [
      "Neutral means the electrons equal the protons.",
      "The mass number is protons + neutrons. Carbon-14 has a mass number of 14.",
      "Carbon has 6 protons, so it needs 8 neutrons and 6 electrons.",
    ],
  },
  {
    id: "al3+",
    prompt: "Create an aluminium ion with a +3 charge.",
    target: { protons: 13, electrons: 10 },
    hints: [
      "Find aluminium's atomic number in the periodic selector.",
      "+3 means 3 more protons than electrons.",
      "Aluminium has 13 protons, so it needs 10 electrons.",
    ],
  },
  {
    id: "cl-37",
    prompt: "Create a chloride ion (−1) of the isotope chlorine-37.",
    target: { protons: 17, neutrons: 20, electrons: 18 },
    hints: [
      "Chlorine has 17 protons. The isotope number 37 is the mass number.",
      "Neutrons = mass number − protons. A −1 charge means one extra electron.",
      "Chlorine-37 has 17 protons and 20 neutrons; with a −1 charge it has 18 electrons.",
    ],
  },
  {
    id: "h+",
    prompt: "Create a hydrogen ion (+1) of the most common hydrogen isotope.",
    target: { protons: 1, neutrons: 0, electrons: 0 },
    hints: [
      "The most common hydrogen isotope has no neutrons.",
      "A +1 charge on 1 proton means 0 electrons.",
      "H⁺ is just a lone proton: 1 proton, 0 neutrons, 0 electrons.",
    ],
  },
];

export interface ChallengeResult {
  ok: boolean;
  /** Specific feedback about what is still wrong, without giving the answer away. */
  messages: string[];
}

export function checkChallenge(atom: AtomState, challenge: Challenge): ChallengeResult {
  const t = challenge.target;
  const messages: string[] = [];
  if (t.protons !== undefined && atom.protons !== t.protons) {
    messages.push(`The element is ${getElement(atom.protons).name}, which is not the one this challenge needs. Check the proton count.`);
  }
  if (t.neutrons !== undefined && atom.neutrons !== t.neutrons) {
    messages.push(`The mass number is ${massNumber(atom)}. That is not the isotope asked for. Check the neutron count.`);
  }
  if (t.electrons !== undefined && atom.electrons !== t.electrons) {
    messages.push(`The net charge is ${netCharge(atom)}. That is not the charge asked for. Check the electron count.`);
  }
  return { ok: messages.length === 0, messages };
}

/**
 * Electron-shell model used by this lab. Shells are a simplified, introductory
 * way of describing how electrons are arranged around a nucleus; in a real atom
 * electrons are described by orbitals (probability clouds), not circular paths.
 *
 * Two documented models are offered:
 *
 * - "intro"  (default) — capacities 2, 8, 8, 2. For neutral atoms and common
 *   ions of elements 1–20 (hydrogen to calcium) this reproduces the electron
 *   arrangements taught at this level (e.g. Na 2,8,1; K 2,8,8,1; Ca 2,8,8,2).
 *   It is NOT valid beyond 20 electrons: there the lab switches to the 2n² rule
 *   and says so on screen.
 * - "max" — the maximum number of electrons a shell can hold is 2n²
 *   (2, 8, 18, 32, 50, 72), filled strictly in order. This is a capacity rule,
 *   not a filling rule: it does not match real configurations from potassium
 *   onward (it would put potassium's 19th electron in shell 3).
 */
export type ShellModelId = "intro" | "max";

export interface ShellModel {
  id: ShellModelId;
  label: string;
  short: string;
  capacities: number[];
  description: string;
}

export const SHELL_MODELS: Record<ShellModelId, ShellModel> = {
  intro: {
    id: "intro",
    label: "Introductory: 2, 8, 8, 2 (elements 1–20)",
    short: "2-8-8-2",
    capacities: [2, 8, 8, 2],
    description:
      "Shells hold 2, 8, 8 and then 2 electrons. This matches the arrangement of the first 20 elements. Beyond 20 electrons it is no longer valid, so the lab switches to the 2n² rule.",
  },
  max: {
    id: "max",
    label: "Maximum capacity: 2n² (2, 8, 18, 32…)",
    short: "2n²",
    capacities: [2, 8, 18, 32, 50, 72],
    description:
      "Shell n can hold at most 2n² electrons. Electrons fill shells in order. This is a simple capacity rule: it does not reproduce real configurations from potassium onward.",
  },
};

/** Largest electron count the introductory model can describe. */
export const INTRO_MODEL_LIMIT = SHELL_MODELS.intro.capacities.reduce((a, b) => a + b, 0);

/** Original capacity list, kept for callers that only want the default numbers. */
export const SHELL_CAPACITIES = SHELL_MODELS.intro.capacities;

const SHELL_LETTERS = ["K", "L", "M", "N", "O", "P", "Q"];

export interface ShellInfo {
  /** Principal quantum number n (1 = innermost). */
  n: number;
  /** Spectroscopic letter: K, L, M… */
  letter: string;
  count: number;
  capacity: number;
  full: boolean;
}

export interface ShellDistribution {
  shells: ShellInfo[];
  /** The model actually used; differs from the requested one when the intro model cannot describe this many electrons. */
  modelUsed: ShellModelId;
  /** True when the requested introductory model was replaced by 2n² because it does not apply. */
  fellBack: boolean;
}

export function shellLabel(n: number): string {
  return `Shell ${n} (${SHELL_LETTERS[n - 1] ?? n})`;
}

/** Splits a total electron count into per-shell counts for the chosen model, filling inner shells first. */
export function distribute(totalElectrons: number, requested: ShellModelId = "intro"): ShellDistribution {
  const total = Math.max(0, Math.floor(totalElectrons));
  const fellBack = requested === "intro" && total > INTRO_MODEL_LIMIT;
  const modelUsed: ShellModelId = fellBack ? "max" : requested;
  const capacities = SHELL_MODELS[modelUsed].capacities;
  const shells: ShellInfo[] = [];
  let remaining = total;
  for (let i = 0; i < capacities.length && remaining > 0; i++) {
    const capacity = capacities[i]!;
    const count = Math.min(capacity, remaining);
    shells.push({ n: i + 1, letter: SHELL_LETTERS[i] ?? String(i + 1), count, capacity, full: count === capacity });
    remaining -= count;
  }
  return { shells, modelUsed, fellBack };
}

/** Per-shell counts only; the original helper the 2D scene used. */
export function distributeElectrons(totalElectrons: number, model: ShellModelId = "intro"): number[] {
  return distribute(totalElectrons, model).shells.map((s) => s.count);
}

/** Plain-language feedback after an electron is added or removed, including when a shell fills or empties. */
export function shellFeedback(before: number, after: number, model: ShellModelId): string | null {
  if (before === after) return null;
  const a = distribute(before, model);
  const b = distribute(after, model);
  const added = after > before;
  const hadShell = (d: ShellDistribution, n: number) => d.shells.find((s) => s.n === n);
  if (added) {
    const target = b.shells[b.shells.length - 1]!;
    const prevTarget = hadShell(a, target.n);
    if (!prevTarget) return `${shellLabel(target.n)} is now in use: the inner shells were full, so the new electron starts it.`;
    if (target.full) {
      const next = SHELL_MODELS[b.modelUsed].capacities[target.n];
      return next
        ? `${shellLabel(target.n)} is full (${target.count}/${target.capacity}). The next electron will start shell ${target.n + 1}.`
        : `${shellLabel(target.n)} is full (${target.count}/${target.capacity}). This model has no further shell.`;
    }
    return `Electron added to ${shellLabel(target.n)} (${target.count}/${target.capacity}).`;
  }
  const last = a.shells[a.shells.length - 1]!;
  const nowThere = hadShell(b, last.n);
  if (!nowThere) return `${shellLabel(last.n)} is now empty. Electrons are removed from the outermost shell first.`;
  return `Electron removed from the outermost shell, ${shellLabel(last.n)} (${nowThere.count}/${nowThere.capacity}).`;
}

/** Notes shown with the shell panel for the current state. */
export function shellNotes(totalElectrons: number, requested: ShellModelId): string[] {
  const d = distribute(totalElectrons, requested);
  const notes: string[] = [];
  if (d.fellBack) {
    notes.push(
      `With more than ${INTRO_MODEL_LIMIT} electrons the introductory 2-8-8-2 pattern no longer applies, so the 2n² capacity rule is used. Real atoms this size fill shells in a more complicated order, so treat this arrangement as an approximation.`,
    );
  }
  if (d.modelUsed === "max" && totalElectrons >= 19 && !d.fellBack) {
    notes.push("The 2n² rule is only a capacity limit. Real potassium and calcium start their 4th shell before filling the 3rd past 8 electrons, so this view differs from the real arrangement.");
  }
  const outer = d.shells[d.shells.length - 1];
  if (d.modelUsed === "intro" && outer && outer.full && [2, 10, 18].includes(totalElectrons)) {
    notes.push("The outer shell is full: this is the same electron arrangement as a noble gas (He, Ne or Ar), a very stable arrangement.");
  }
  return notes;
}

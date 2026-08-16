/** The only slice counts a real pizza cutter (and this activity) supports. */
export const SLICE_COUNTS = [1, 2, 3, 4, 6, 8, 12] as const;

export function nextSliceCount(current: number): number {
  const index = SLICE_COUNTS.indexOf(current as (typeof SLICE_COUNTS)[number]);
  return SLICE_COUNTS[Math.min(SLICE_COUNTS.length - 1, index + 1)]!;
}

export function previousSliceCount(current: number): number {
  const index = SLICE_COUNTS.indexOf(current as (typeof SLICE_COUNTS)[number]);
  return SLICE_COUNTS[Math.max(0, index - 1)]!;
}

export interface Challenge {
  id: number;
  /** Slices to select. */
  selected: number;
  /** Slices the pizza must be cut into first. */
  total: number;
  prompt: string;
}

let idCounter = 0;

/** Deliberately left un-simplified where the brief writes them that way (e.g. "2/6", not "1/3"). */
const TARGETS: { selected: number; total: number }[] = [
  { selected: 1, total: 2 },
  { selected: 1, total: 3 },
  { selected: 2, total: 3 },
  { selected: 1, total: 4 },
  { selected: 3, total: 4 },
  { selected: 1, total: 6 },
  { selected: 2, total: 6 },
  { selected: 5, total: 6 },
  { selected: 3, total: 8 },
  { selected: 5, total: 8 },
  { selected: 7, total: 8 },
  { selected: 5, total: 12 },
  { selected: 7, total: 12 },
];

export function nextChallenge(excludeId?: number): Challenge {
  let target = TARGETS[Math.floor(Math.random() * TARGETS.length)]!;
  let attempts = 0;
  while (
    excludeId !== undefined &&
    challengeKey(target) === excludeId &&
    attempts < 6
  ) {
    target = TARGETS[Math.floor(Math.random() * TARGETS.length)]!;
    attempts++;
  }
  return {
    id: ++idCounter,
    ...target,
    prompt: `Select ${target.selected}/${target.total}`,
  };
}

/** A stable identity for a target (selected*100 + total) — used to avoid immediately repeating the same challenge. */
export function challengeKey(
  challenge: Pick<Challenge, "selected" | "total">,
): number {
  return challenge.selected * 100 + challenge.total;
}

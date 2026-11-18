/** Generic multiple-choice round used by every Challenge / Predict / Identify activity in the three energy labs. */
export interface Q {
  id: string;
  prompt: string;
  options: { id: string; label: string }[];
  correct: string;
  why: string;
  hint?: string;
}

export interface RoundState {
  seed: number;
  order: number[];
  index: number;
  picked: string | null;
  score: number;
  answered: number;
  done: boolean;
}

function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function shuffleIdx(n: number, seed: number): number[] {
  const r = rng(seed);
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export function newRound(bankSize: number, size: number, seed: number): RoundState {
  return { seed, order: shuffleIdx(bankSize, seed).slice(0, Math.min(size, bankSize)), index: 0, picked: null, score: 0, answered: 0, done: false };
}

export type RoundAction = { type: "pick"; option: string; correct: string } | { type: "next" } | { type: "restart"; bankSize: number; size: number; seed: number };

export function roundReducer(s: RoundState, a: RoundAction): RoundState {
  switch (a.type) {
    case "pick":
      if (s.picked !== null || s.done) return s;
      return { ...s, picked: a.option, answered: s.answered + 1, score: s.score + (a.option === a.correct ? 1 : 0) };
    case "next":
      if (s.picked === null) return s;
      return s.index + 1 >= s.order.length ? { ...s, done: true } : { ...s, index: s.index + 1, picked: null };
    case "restart":
      return newRound(a.bankSize, a.size, a.seed);
  }
}

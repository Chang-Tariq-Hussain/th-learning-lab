/** Practice mode: picks questions by subject / topic / difficulty / past paper / mixed, preferring questions this device has seen least. */
import { apportion, hashString, mulberry32 } from "./random";
import type { PracticeSpec } from "./tests";
import type { ExamConfig, TeacherQuestion, TeacherSubject } from "./types";
import { resolveSectionSubject } from "./generator";

export interface LedgerEntry {
  timesUsed: number;
  /** epoch ms of the last practice session that used the question */
  lastUsed: number;
  mockIds: string[];
}
export type Ledger = Record<string, LedgerEntry>;

export function practicePool(cfg: ExamConfig, bank: TeacherQuestion[], spec: PracticeSpec): TeacherQuestion[] {
  const motherTongue: TeacherSubject = cfg.motherTongue === "sd" ? "Sindhi" : "Urdu";
  const inScope = (q: TeacherQuestion) => (q.subject === "Sindhi" || q.subject === "Urdu" ? q.subject === motherTongue || spec.subject === q.subject : true);
  switch (spec.mode) {
    case "subject":
      return bank.filter((q) => q.subject === spec.subject);
    case "topic":
      return bank.filter((q) => q.subject === spec.subject && q.topic === spec.topic);
    case "difficulty":
      return bank.filter((q) => q.difficulty === spec.difficulty && inScope(q));
    case "past-paper":
      return bank.filter((q) => q.sourceType === "verified_past_paper" && q.verified && inScope(q));
    default:
      return bank.filter(inScope);
  }
}

function lessThan(a: number[], b: number[]): boolean {
  for (let i = 0; i < a.length; i++) {
    const d = (a[i] ?? 0) - (b[i] ?? 0);
    if (d !== 0) return d < 0;
  }
  return false;
}

function greedy(cands: TeacherQuestion[], n: number, ledger: Ledger, rank: Map<string, number>): TeacherQuestion[] {
  const chosen: TeacherQuestion[] = [];
  const taken = new Set<string>();
  const topicCount = new Map<string, number>();
  for (let k = 0; k < n; k++) {
    let best: TeacherQuestion | null = null;
    let bestKey: number[] = [];
    for (const q of cands) {
      if (taken.has(q.id)) continue;
      const e = ledger[q.id];
      const key = [e?.timesUsed ?? 0, e?.lastUsed ?? 0, topicCount.get(q.topic) ?? 0, rank.get(q.id) ?? 0];
      if (!best || lessThan(key, bestKey)) {
        best = q;
        bestKey = key;
      }
    }
    if (!best) break;
    taken.add(best.id);
    chosen.push(best);
    topicCount.set(best.topic, (topicCount.get(best.topic) ?? 0) + 1);
  }
  return chosen;
}

/** Returns the questions for one practice session, grouped by subject (needed for the section table). */
export function selectPractice(cfg: ExamConfig, bank: TeacherQuestion[], spec: PracticeSpec, ledger: Ledger, seed: string): TeacherQuestion[] {
  const pool = practicePool(cfg, bank, spec);
  const n = Math.min(spec.count, pool.length);
  const rnd = mulberry32(hashString(seed));
  const rank = new Map(pool.map((q) => [q.id, rnd()] as const));
  let picked: TeacherQuestion[];
  if (spec.mode === "mixed") {
    const subjects = cfg.mock.sections.map((s) => resolveSectionSubject(s, cfg));
    const uniq = subjects.filter((s, i) => subjects.indexOf(s) === i);
    const weights = uniq.map((s) => cfg.mock.sections.filter((x) => resolveSectionSubject(x, cfg) === s).reduce((a, x) => a + x.count, 0));
    const targets = apportion(n, weights);
    picked = [];
    uniq.forEach((s, i) => picked.push(...greedy(pool.filter((q) => q.subject === s), targets[i] ?? 0, ledger, rank)));
    if (picked.length < n) {
      const have = new Set(picked.map((q) => q.id));
      picked.push(...greedy(pool.filter((q) => !have.has(q.id)), n - picked.length, ledger, rank));
    }
  } else {
    picked = greedy(pool, n, ledger, rank);
  }
  const order: TeacherSubject[] = [];
  for (const q of picked) if (!order.includes(q.subject)) order.push(q.subject);
  const shuffled = picked.slice().sort((a, b) => (rank.get(a.id) ?? 0) - (rank.get(b.id) ?? 0));
  return order.flatMap((s) => shuffled.filter((q) => q.subject === s));
}

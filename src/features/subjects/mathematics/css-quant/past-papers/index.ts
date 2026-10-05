import { ALL_GENERATORS } from "../generators";
import type { Difficulty, ModuleId, Question, Rng } from "../types";
import { PAST_PAPER_BANK } from "./bank";
import type { PastPaperItem } from "./types";

export type { PastPaperItem } from "./types";

/** True for the official-source kinds that earn the green "Verified past paper" badge. */
export const isOfficialEvidence = (e: PastPaperItem["ref"]["evidence"]) => e === "fpsc-website" || e === "official-paper-copy";

/** Reasons an entry is rejected; an empty list means the entry may be shown with the Verified badge. */
export function validatePastPaperItem(item: PastPaperItem, now = new Date()): string[] {
  const errs: string[] = [];
  const topics = new Set(ALL_GENERATORS.map((g) => `${g.topic.module}:${g.topic.id}`));
  if (!item.id.trim()) errs.push("id is empty");
  if (!topics.has(`${item.module}:${item.topic}`) && item.topic !== `${item.module}-other`) errs.push(`unknown topic ${item.module}:${item.topic}`);
  if (!item.prompt.trim()) errs.push("prompt is empty");
  if (item.options.length !== 4) errs.push("needs exactly 4 options");
  if (item.options.some((o) => !o.trim()) || new Set(item.options.map((o) => o.trim())).size !== item.options.length) errs.push("options must be non-empty and distinct");
  if (!Number.isInteger(item.correct) || item.correct < 0 || item.correct >= item.options.length) errs.push("correct index out of range");
  if (item.steps.length === 0 || item.steps.some((s) => !s.trim())) errs.push("needs a worked solution");
  if (!item.trick.trim()) errs.push("trick is empty");

  const r = item.ref;
  if (!Number.isInteger(r.year) || r.year < 1990 || r.year > now.getFullYear()) errs.push("year out of range");
  if (!r.exam.trim()) errs.push("exam is empty");
  if (r.questionNo !== undefined && (!Number.isInteger(r.questionNo) || r.questionNo < 1)) errs.push("questionNo must be a positive integer");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(r.verifiedOn) || Number.isNaN(Date.parse(r.verifiedOn))) errs.push("verifiedOn must be YYYY-MM-DD");
  if (!r.verifiedBy.trim()) errs.push("verifiedBy is empty");
  try {
    const u = new URL(r.sourceUrl);
    if (u.protocol !== "https:") errs.push("sourceUrl must be https");
    if (r.evidence === "fpsc-website" && !(u.hostname === "fpsc.gov.pk" || u.hostname.endsWith(".fpsc.gov.pk"))) errs.push("fpsc-website evidence needs an fpsc.gov.pk URL");
  } catch {
    errs.push("sourceUrl is not a valid URL");
  }
  if (r.evidence !== "fpsc-website" && r.evidence !== "official-paper-copy" && r.evidence !== "third-party-compilation") errs.push("unknown evidence kind");
  if (r.evidence === "third-party-compilation" && !r.sourceName?.trim()) errs.push("third-party-compilation needs sourceName");
  return errs;
}

/** The entries that pass validation. Anything else is dropped (and reported once in development). */
export function usableBank(bank: readonly PastPaperItem[] = PAST_PAPER_BANK): PastPaperItem[] {
  const seen = new Set<string>();
  const ok: PastPaperItem[] = [];
  for (const item of bank) {
    const errs = validatePastPaperItem(item);
    if (seen.has(item.id)) errs.push("duplicate id");
    if (errs.length) {
      if (process.env.NODE_ENV !== "production") console.warn(`[css-quant] past-paper entry "${item.id}" ignored: ${errs.join("; ")}`);
      continue;
    }
    seen.add(item.id);
    ok.push(item);
  }
  return ok;
}

const USABLE = usableBank();

export function pastPaperItemsFor(module: ModuleId, topicId: string | null = null, bank: readonly PastPaperItem[] = USABLE): PastPaperItem[] {
  return bank.filter((i) => (module === "mixed" || i.module === module) && (!topicId || i.topic === topicId));
}

/** Number of verified past-paper questions per topic id for a module (drives which filters are enabled). */
export function pastPaperCounts(module: ModuleId, bank: readonly PastPaperItem[] = USABLE): Record<string, number> {
  const out: Record<string, number> = {};
  for (const i of pastPaperItemsFor(module, null, bank)) out[i.topic] = (out[i.topic] ?? 0) + 1;
  return out;
}

const TOPIC_LABEL = new Map<string, string>([...ALL_GENERATORS.map((g) => [g.topic.id, g.topic.label] as const), ["ratio-other", "Other arithmetic"], ["geometry-other", "Other geometry"], ["trigonometry-other", "Other trigonometry"]]);
const DIFFICULTY: Difficulty = 2;

let nextId = 1_000_000;

export function buildPastPaperQuestion(item: PastPaperItem, id: number = nextId++): Question {
  return {
    id,
    module: item.module,
    topic: item.topic,
    topicLabel: TOPIC_LABEL.get(item.topic) ?? item.topic,
    difficulty: DIFFICULTY,
    prompt: item.prompt,
    figure: item.figure,
    options: [...item.options],
    correct: item.correct,
    steps: [...item.steps],
    trick: item.trick,
    trap: item.trap,
    pastPaper: { itemId: item.id, ...item.ref },
  };
}

/** Pick a past-paper question, preferring ones not yet seen this session. Returns null when none match. */
export function pickPastPaper(module: ModuleId, topicId: string | null, seen: ReadonlySet<string>, rng: Rng, bank: readonly PastPaperItem[] = USABLE): Question | null {
  const all = pastPaperItemsFor(module, topicId, bank);
  if (all.length === 0) return null;
  const fresh = all.filter((i) => !seen.has(i.id));
  const pool = fresh.length ? fresh : all;
  return buildPastPaperQuestion(pool[Math.floor(rng() * pool.length)]!);
}

/** Device-local storage for teacher-test practice records and exposure. Every access is wrapped: storage may be unavailable. */
import type { ExamType } from "./types";
import type { PracticeSpec } from "./tests";
import type { Ledger } from "./practice";

export interface PracticeRecord {
  id: string;
  exam: ExamType;
  spec: PracticeSpec;
  questionIds: string[];
  createdAt: number;
}

const RECORD_PREFIX = "th-teacher-practice-v1:";
const INDEX_PREFIX = "th-teacher-practice-index-v1:";
const LEDGER_PREFIX = "th-teacher-exposure-v1:";
const MAX_INDEX = 30;

function isRecord(x: unknown): x is PracticeRecord {
  if (!x || typeof x !== "object") return false;
  const r = x as Partial<PracticeRecord>;
  return typeof r.id === "string" && typeof r.exam === "string" && !!r.spec && Array.isArray(r.questionIds) && r.questionIds.every((q) => typeof q === "string");
}

export function loadPracticeRecord(id: string): PracticeRecord | null {
  try {
    const raw = window.localStorage.getItem(RECORD_PREFIX + id);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function savePracticeRecord(rec: PracticeRecord): boolean {
  try {
    window.localStorage.setItem(RECORD_PREFIX + rec.id, JSON.stringify(rec));
    const idx = loadPracticeIndex(rec.exam).filter((i) => i !== rec.id);
    const next = [rec.id, ...idx];
    for (const dropped of next.slice(MAX_INDEX)) window.localStorage.removeItem(RECORD_PREFIX + dropped);
    window.localStorage.setItem(INDEX_PREFIX + rec.exam, JSON.stringify(next.slice(0, MAX_INDEX)));
    return true;
  } catch {
    return false;
  }
}

export function loadPracticeIndex(exam: ExamType): string[] {
  try {
    const raw = window.localStorage.getItem(INDEX_PREFIX + exam);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function loadLedger(exam: ExamType): Ledger {
  try {
    const raw = window.localStorage.getItem(LEDGER_PREFIX + exam);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as Ledger) : {};
  } catch {
    return {};
  }
}

export function recordUse(exam: ExamType, ids: string[], testId: string, now: number = Date.now()): void {
  try {
    const ledger = loadLedger(exam);
    for (const id of ids) {
      const e = ledger[id] ?? { timesUsed: 0, lastUsed: 0, mockIds: [] };
      ledger[id] = { timesUsed: e.timesUsed + 1, lastUsed: now, mockIds: [...e.mockIds, testId].slice(-10) };
    }
    window.localStorage.setItem(LEDGER_PREFIX + exam, JSON.stringify(ledger));
  } catch {
    /* ignore: exposure control is a convenience */
  }
}

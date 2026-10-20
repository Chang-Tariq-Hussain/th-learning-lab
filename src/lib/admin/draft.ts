import { cookies } from "next/headers";

/**
 * Failed saves must not throw the admin's typing away. The server actions redirect after a failure (so the page
 * shows the error), which would reload the form from the database; instead we park the submitted values in a
 * short-lived, HttpOnly cookie scoped to /admin and the form pre-fills from it. Best effort: browsers cap a cookie
 * at ~4 KB, so a very large draft is not kept (and the error message says so).
 */
const NAME = "th_qdraft";
const MAX_ENCODED = 3600;
const TTL_SECONDS = 600;

export const DRAFT_FIELDS = [
  "stem", "passage", "option_0", "option_1", "option_2", "option_3", "option_4", "option_5", "correct", "fixed_order", "explanation", "hints",
  "topic", "concept", "misconception_tag", "difficulty", "language", "needs_review",
  "source_system", "subject_slug", "bank_slug", "exam_subject", "exam_slug", "exam_topic", "exam_difficulty", "section_code",
  "source_type", "source_year", "source_exam", "source_reference", "source_note", "answer_check", "verified_note", "reason",
] as const;

export type Draft = Record<string, string>;

/** Returns true when the draft was stored. `scope` is the question id, `<id>:prov`, or "new". */
export function rememberDraft(scope: string, fd: FormData): boolean {
  const f: Draft = {};
  for (const k of DRAFT_FIELDS) {
    const v = fd.get(k);
    if (typeof v === "string" && v !== "") f[k] = v;
  }
  const value = JSON.stringify({ s: scope, f });
  if (encodeURIComponent(value).length > MAX_ENCODED) { forgetDraft(); return false; }
  cookies().set(NAME, value, { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/admin", maxAge: TTL_SECONDS });
  return true;
}

export function readDraft(scope: string): Draft | null {
  try {
    const raw = cookies().get(NAME)?.value;
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { s?: unknown; f?: unknown };
    if (parsed.s !== scope || typeof parsed.f !== "object" || parsed.f === null) return null;
    const f: Draft = {};
    for (const k of DRAFT_FIELDS) { const v = (parsed.f as Record<string, unknown>)[k]; if (typeof v === "string") f[k] = v; }
    return f;
  } catch { return null; }
}

export function forgetDraft(): void {
  cookies().set(NAME, "", { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/admin", maxAge: 0 });
}

/** Form values → the defaults the shared content fields expect (option slots keep their positions). */
export function draftToDefaults(f: Draft): import("@/components/admin/question-fields").ContentDefaults {
  const options = Array.from({ length: 6 }, (_, i) => f[`option_${i}`] ?? "");
  while (options.length > 2 && options[options.length - 1] === "") options.pop();
  const correct = Number.parseInt(f["correct"] ?? "0", 10);
  return {
    stem: f["stem"] ?? "", passage: f["passage"] ?? "", options, correct_index: Number.isInteger(correct) ? correct : 0,
    fixed_order: f["fixed_order"] === "on", explanation: f["explanation"] ?? "", hints: f["hints"] ? f["hints"].split("\n") : null,
    topic: f["topic"] ?? "", concept: f["concept"] ?? "", misconception_tag: f["misconception_tag"] ?? "", difficulty: f["difficulty"] ?? "",
    language: f["language"] ?? "", needs_review: f["needs_review"] === "on",
  };
}

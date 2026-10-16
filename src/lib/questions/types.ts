/** Shapes and labels for the Question Bank admin. Mirrors public.questions (supabase/migrations). */
export const SOURCE_TYPES = ["verified_past_paper", "existing_bank", "generated", "platform_authored"] as const;
export type SourceType = (typeof SOURCE_TYPES)[number];
export const ANSWER_CHECKS = ["unchecked", "self_checked", "recomputed", "independently_checked"] as const;
export type AnswerCheck = (typeof ANSWER_CHECKS)[number];
export const STATUSES = ["draft", "in_review", "published", "archived"] as const;
export type QuestionStatus = (typeof STATUSES)[number];
export const SYSTEMS = ["quiz", "mpt", "teacher"] as const;
export type QuestionSystem = (typeof SYSTEMS)[number];
export const DIFFICULTIES = ["easy", "medium", "hard"] as const;
export const LANGUAGES = ["en", "ur", "sd"] as const;
export const EXAM_SLUGS = ["css-mpt", "pst", "jest", "jst"] as const;
export const SUBJECT_SLUGS = ["physics", "chemistry", "biology", "mathematics", "information-technology"] as const;
export const MAX_OPTIONS = 6;

export const SOURCE_LABEL: Record<SourceType, string> = {
  verified_past_paper: "Verified past paper",
  existing_bank: "Existing bank",
  generated: "Generated",
  platform_authored: "Platform-authored",
};
export const CHECK_LABEL: Record<AnswerCheck, string> = {
  unchecked: "Unchecked",
  self_checked: "Self-checked",
  recomputed: "Recomputed",
  independently_checked: "Independently checked",
};
export const STATUS_LABEL: Record<QuestionStatus, string> = { draft: "Draft", in_review: "In review", published: "Published", archived: "Archived" };
export const SYSTEM_LABEL: Record<QuestionSystem, string> = { quiz: "Quiz / practice", mpt: "CSS MPT", teacher: "Teacher tests" };
export const EXAM_LABEL: Record<string, string> = { "css-mpt": "CSS MPT", pst: "PST", jest: "JEST", jst: "JST" };

export interface QuestionListRow {
  id: string;
  legacy_id: string;
  source_system: QuestionSystem;
  exam_subject: string | null;
  stem: string;
  source_type: SourceType;
  answer_check: AnswerCheck;
  status: QuestionStatus;
  needs_review: boolean;
  updated_at: string;
  content_hash: string;
  source_hash: string | null;
  subjects: { slug: string } | null;
}

export const isOneOf = <T extends string>(list: readonly T[], x: unknown): x is T => typeof x === "string" && (list as readonly string[]).includes(x);

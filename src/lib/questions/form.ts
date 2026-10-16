import { DIFFICULTIES, EXAM_SLUGS, LANGUAGES, MAX_OPTIONS, SOURCE_TYPES, SUBJECT_SLUGS, SYSTEMS, isOneOf } from "./types";

export interface Parsed { fields: Record<string, unknown>; errors: string[] }

const str = (fd: FormData, k: string): string => String(fd.get(k) ?? "").replace(/\r\n/g, "\n").trim();
const flag = (fd: FormData, k: string): boolean => fd.get(k) === "on" || fd.get(k) === "true";

/**
 * The editable content of a question, from the edit/create form. Pure and strict: the database
 * re-validates everything, but errors caught here are shown next to the form, in plain words.
 * Options come from option_0…option_5 (blanks are dropped); `correct` is the SLOT of the right answer.
 */
export function parseQuestionContent(fd: FormData): Parsed {
  const errors: string[] = [];
  const stem = str(fd, "stem");
  if (!stem) errors.push("The question text is required.");

  const slots: { slot: number; text: string }[] = [];
  for (let i = 0; i < MAX_OPTIONS; i++) {
    const text = str(fd, `option_${i}`);
    if (text) slots.push({ slot: i, text });
  }
  if (slots.length < 2) errors.push("Give at least two answer options.");
  const lowered = slots.map((o) => o.text.toLowerCase());
  if (new Set(lowered).size !== lowered.length) errors.push("Two options are identical — each option must be different.");

  const correctSlot = Number.parseInt(str(fd, "correct"), 10);
  const correctIndex = slots.findIndex((o) => o.slot === correctSlot);
  if (slots.length >= 2 && correctIndex < 0) errors.push("Mark which option is correct (and make sure it isn't blank).");

  const difficulty = str(fd, "difficulty");
  if (difficulty && !isOneOf(DIFFICULTIES, difficulty)) errors.push("Difficulty must be easy, medium or hard.");
  const language = str(fd, "language");
  if (language && !isOneOf(LANGUAGES, language)) errors.push("Language must be English, Urdu or Sindhi.");

  const hints = str(fd, "hints").split("\n").map((l) => l.trim()).filter(Boolean);

  return {
    errors,
    fields: {
      stem,
      passage: str(fd, "passage"),
      options: slots.map((o) => o.text),
      correct_index: Math.max(correctIndex, 0),
      fixed_order: flag(fd, "fixed_order"),
      explanation: str(fd, "explanation"),
      hints: hints.length ? hints : null,
      concept: str(fd, "concept"),
      topic: str(fd, "topic"),
      difficulty,
      misconception_tag: str(fd, "misconception_tag"),
      language,
      needs_review: flag(fd, "needs_review"),
    },
  };
}

/** A brand-new question: content + where it belongs + where it came from. New questions are always drafts. */
export function parseNewQuestion(fd: FormData): Parsed {
  const content = parseQuestionContent(fd);
  const errors = [...content.errors];
  const system = str(fd, "source_system");
  if (!isOneOf(SYSTEMS, system)) errors.push("Choose where this question is used.");
  const fields: Record<string, unknown> = { ...content.fields, source_system: system };

  if (system === "quiz") {
    const subject = str(fd, "subject_slug");
    if (!isOneOf(SUBJECT_SLUGS, subject)) errors.push("Choose a subject.");
    fields["subject_slug"] = subject;
  } else if (system === "mpt" || system === "teacher") {
    const examSubject = str(fd, "exam_subject");
    if (!examSubject) errors.push("Enter the exam subject (e.g. Mathematics).");
    fields["exam_subject"] = examSubject;
    const exam = str(fd, "exam_slug");
    if (!isOneOf(EXAM_SLUGS, exam)) errors.push("Choose the exam this question belongs to.");
    else fields["exams"] = [{ exam_slug: exam, topic: str(fd, "exam_topic"), difficulty: str(fd, "exam_difficulty"), section_code: str(fd, "section_code") }];
  }

  const source = str(fd, "source_type") || "platform_authored";
  if (!isOneOf(SOURCE_TYPES, source)) errors.push("Choose a source.");
  fields["source_type"] = source;
  const year = str(fd, "source_year");
  if (year) {
    const y = Number.parseInt(year, 10);
    if (!Number.isInteger(y) || y < 1950 || y > new Date().getFullYear() + 1) errors.push("Source year looks wrong.");
    else fields["source_year"] = y;
  }
  fields["source_reference"] = str(fd, "source_reference");
  fields["source_note"] = str(fd, "source_note");
  if (source === "verified_past_paper" && (!fields["source_year"] || !(fields["source_reference"] || fields["source_note"]))) {
    errors.push("A verified past paper needs a source year and a source reference or note.");
  }
  return { fields, errors };
}

/** Provenance edit: only the fields on the provenance form, plus a mandatory reason. */
export function parseProvenance(fd: FormData): Parsed & { reason: string } {
  const errors: string[] = [];
  const fields: Record<string, unknown> = {};
  const source = str(fd, "source_type");
  if (!isOneOf(SOURCE_TYPES, source)) errors.push("Choose a source.");
  fields["source_type"] = source;
  const year = str(fd, "source_year");
  fields["source_year"] = year ? Number.parseInt(year, 10) : null;
  if (year && !Number.isInteger(fields["source_year"])) errors.push("Source year must be a number.");
  for (const k of ["source_exam", "source_reference", "source_note", "verified_note"]) fields[k] = str(fd, k);
  fields["answer_check"] = str(fd, "answer_check");
  const reason = str(fd, "reason");
  if (reason.length < 10) errors.push("Explain the change in at least 10 characters — it is recorded in the audit log.");
  return { fields, errors, reason };
}

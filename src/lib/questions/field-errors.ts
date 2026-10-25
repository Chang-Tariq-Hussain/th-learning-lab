/**
 * Server validation answers with plain sentences (see form.ts and the admin actions). The forms redirect back with
 * that text, so to show each problem next to the field it is about (aria-invalid + aria-describedby) we map the known
 * sentences to field ids. Anything not recognised stays in the message at the top of the page; nothing is dropped.
 */
const RULES: [needle: string, field: string][] = [
  ["The question text is required.", "stem"],
  ["Give at least two answer options.", "option_0"],
  ["Two options are identical", "option_0"],
  ["Exam questions need exactly", "option_0"],
  ["Mark which option is correct", "correct"],
  ["Difficulty must be", "difficulty"],
  ["Language must be", "language"],
  ["Choose where this question is used.", "source_system"],
  ["Choose a subject.", "subject_slug"],
  ["Choose a bank from the list.", "bank_slug"],
  ["Enter the exam subject", "exam_subject"],
  ["Choose the exam this question belongs to", "exam_slug"],
  ["A CSS MPT question needs a section", "section_code"],
  ["Choose a source.", "source_type"],
  ["Source year looks wrong.", "source_year"],
  ["Source year must be a number.", "source_year"],
  ["A verified past paper needs a source year", "source_year"],
  ["Explain the change in at least 10 characters", "reason"],
  ["Choose a JSON file or paste JSON.", "json"],
  ["That is not valid JSON.", "json"],
  ["Expected a JSON array", "json"],
  ["File is too large", "file"],
  ["Enter a valid email address.", "grant-email"],
  ["Choose a role.", "grant-role"],
];

/** Sentence-level split so each field gets only its own message. */
export function fieldErrorsFor(message: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!message) return out;
  const sentences = message.match(/[^.!?]+[.!?]+(?:\s|$)/g) ?? [message];
  for (const raw of sentences) {
    const sentence = raw.trim();
    const hit = RULES.find(([needle]) => sentence.includes(needle));
    if (hit && !out[hit[1]]) out[hit[1]] = sentence;
  }
  return out;
}

/** The props that tie an input to its message. */
export function describe(id: string, errors: Record<string, string>): { "aria-invalid"?: true; "aria-describedby"?: string } {
  return errors[id] ? { "aria-invalid": true, "aria-describedby": `${id}-error` } : {};
}

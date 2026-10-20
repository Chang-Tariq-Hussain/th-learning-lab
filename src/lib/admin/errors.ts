/**
 * Turns a database/network error into a message that is safe and useful to show an admin. Our own functions raise
 * plain-English messages (kept as they are); raw Postgres constraint text, permission errors and network failures are
 * rewritten so internal names never reach the browser.
 */
const CONSTRAINTS: [RegExp, string][] = [
  [/questions_correct_in_range/, "The correct answer must be one of the options."],
  [/questions_options_shape/, "A question needs between 2 and 6 answer options."],
  [/questions_exam_four_options/, "Exam questions must have exactly 4 answer options."],
  [/questions_published_complete/, "A published question needs question text and an explanation."],
  [/questions_generated_never_verified/, "A generated question cannot be marked as independently checked."],
  [/questions_past_paper_has_year/, "A verified past paper needs a source year."],
  [/questions_difficulty_check/, "Difficulty must be easy, medium or hard."],
  [/questions_language_check/, "Language must be English, Urdu or Sindhi."],
];

export function friendlyError(error: { message?: string; code?: string } | null | undefined): string {
  const m = String(error?.message ?? "");
  for (const [re, text] of CONSTRAINTS) if (re.test(m)) return text;
  if (error?.code === "42501" || /permission denied|forbidden|row-level security/i.test(m)) return "You do not have permission to do that.";
  if (/fetch failed|network|ECONN|ETIMEDOUT|timeout|TypeError/i.test(m)) return "Could not reach the database. Nothing was saved — please try again.";
  if (/violates|duplicate key|relation "|syntax error|function public\./i.test(m)) return "The database refused this change. Check the values and try again.";
  return m || "Something went wrong. Nothing was saved.";
}

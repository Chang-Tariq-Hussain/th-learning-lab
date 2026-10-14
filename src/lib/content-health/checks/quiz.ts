import { finding, type CheckDefinition, type CheckFn, type Finding } from "../types";
import { routeExists } from "../registry-index";

export const quizChecks: CheckDefinition[] = [
  { id: "quiz.answer-not-in-options", area: "quiz", severity: "critical", description: "A question's correct answer is not one of its options, so it can never be answered correctly." },
  { id: "quiz.duplicate-quiz-id", area: "quiz", severity: "critical", description: "Two quiz banks share an id." },
  { id: "quiz.duplicate-question-id", area: "quiz", severity: "critical", description: "A question id is used more than once across all banks." },
  { id: "quiz.too-few-options", area: "quiz", severity: "high", description: "A question has fewer than two options." },
  { id: "quiz.duplicate-options", area: "quiz", severity: "high", description: "A question lists the same option text twice." },
  { id: "quiz.missing-explanation", area: "quiz", severity: "high", description: "A question has no explanation." },
  { id: "quiz.empty-bank", area: "quiz", severity: "high", description: "A quiz bank has no questions." },
  { id: "quiz.backhref-missing", area: "quiz", severity: "medium", description: "A quiz bank's 'back' link points at a route that does not exist." },
  { id: "quiz.subject-mismatch", area: "quiz", severity: "medium", description: "A question's subject differs from its bank's subject." },
  { id: "quiz.duplicate-text", area: "quiz", severity: "medium", description: "The same question text appears in more than one place (Practice 'All topics' can show it twice)." },
  { id: "quiz.untagged-concept", area: "quiz", severity: "low", description: "Questions without a concept tag fall into 'General' in mastery and filtering." },
  { id: "quiz.unreferenced-bank", area: "quiz", severity: "low", description: "A bank is not used by any learning experience's Practice step (still reachable via Practice Mode)." },
];

const norm = (s: string): string => s.replace(/\s+/g, " ").trim().toLowerCase();

export const checkQuiz: CheckFn = (ctx) => {
  const out: Finding[] = [];
  const bankIds = new Map<string, number>();
  const questionIds = new Map<string, string[]>();
  const texts = new Map<string, string[]>();
  const referenced = new Set(ctx.gle.map((t) => t.practice?.quizId).filter((x): x is string => !!x));

  for (const quiz of ctx.quizzes) {
    bankIds.set(quiz.id, (bankIds.get(quiz.id) ?? 0) + 1);
    const file = `src/features/quiz-engine/data/${quiz.id}-quiz.ts`;
    if (quiz.questions.length === 0) {
      out.push(finding({ check: "quiz.empty-bank", area: "quiz", severity: "high", subject: quiz.subjectSlug, entity: quiz.id, title: `Quiz bank "${quiz.id}" has no questions.` }));
    }
    if (ctx.routes && !routeExists(quiz.backHref, ctx.routes)) {
      out.push(finding({ check: "quiz.backhref-missing", area: "quiz", severity: "medium", subject: quiz.subjectSlug, entity: quiz.id,
        title: `Quiz "${quiz.id}" links back to ${quiz.backHref}, which has no page.`, href: quiz.backHref }));
    }
    let untagged = 0;
    for (const q of quiz.questions) {
      (questionIds.get(q.id) ?? questionIds.set(q.id, []).get(q.id)!).push(quiz.id);
      const t = norm(q.question);
      (texts.get(t) ?? texts.set(t, []).get(t)!).push(`${quiz.id}:${q.id}`);
      if (q.options.length < 2) out.push(finding({ check: "quiz.too-few-options", area: "quiz", severity: "high", subject: quiz.subjectSlug, entity: q.id, title: `Question ${q.id} has ${q.options.length} option(s).` }));
      if (!q.options.includes(q.correctAnswer)) {
        out.push(finding({ check: "quiz.answer-not-in-options", area: "quiz", severity: "critical", subject: quiz.subjectSlug, entity: q.id,
          title: `Question ${q.id}: the correct answer does not match any option.`,
          detail: `Bank: ${quiz.id}. Correct answer text must equal one option exactly.`, href: quiz.backHref, file }));
      }
      if (new Set(q.options.map(norm)).size !== q.options.length) {
        out.push(finding({ check: "quiz.duplicate-options", area: "quiz", severity: "high", subject: quiz.subjectSlug, entity: q.id, title: `Question ${q.id} repeats an option.`, detail: `Bank: ${quiz.id}`, file }));
      }
      if (!q.explanation || q.explanation.trim() === "") {
        out.push(finding({ check: "quiz.missing-explanation", area: "quiz", severity: "high", subject: quiz.subjectSlug, entity: q.id, title: `Question ${q.id} has no explanation.`, detail: `Bank: ${quiz.id}`, file }));
      }
      if (q.subject !== quiz.subjectSlug) {
        out.push(finding({ check: "quiz.subject-mismatch", area: "quiz", severity: "medium", subject: quiz.subjectSlug, entity: q.id,
          title: `Question ${q.id} is tagged "${q.subject}" inside a "${quiz.subjectSlug}" bank.`, detail: `Bank: ${quiz.id}`, file }));
      }
      if (!q.concept) untagged += 1;
    }
    if (untagged > 0) {
      out.push(finding({ check: "quiz.untagged-concept", area: "quiz", severity: "low", subject: quiz.subjectSlug, entity: quiz.id,
        title: `${untagged} of ${quiz.questions.length} questions in "${quiz.id}" have no concept tag.`, file }));
    }
    if (quiz.questions.length > 0 && !referenced.has(quiz.id)) {
      out.push(finding({ check: "quiz.unreferenced-bank", area: "quiz", severity: "low", subject: quiz.subjectSlug, entity: quiz.id,
        title: `Bank "${quiz.id}" is not referenced by any learning experience.`, detail: "It is still part of Practice Mode and any standalone quiz page.", file }));
    }
  }
  for (const [id, n] of bankIds) {
    if (n > 1) out.push(finding({ check: "quiz.duplicate-quiz-id", area: "quiz", severity: "critical", entity: id, title: `Quiz id "${id}" is registered ${n} times.`, file: "src/features/quiz-engine/registry.ts" }));
  }
  for (const [id, banks] of questionIds) {
    if (banks.length > 1) out.push(finding({ check: "quiz.duplicate-question-id", area: "quiz", severity: "critical", entity: id, title: `Question id "${id}" appears ${banks.length} times.`, detail: `Banks: ${[...new Set(banks)].join(", ")}` }));
  }
  // "-practice" and "-gle" banks are deliberate companions of a main bank and reuse its questions.
  const family = (entry: string): string => entry.split(":")[0]!.replace(/-(practice|gle)$/, "");
  for (const [text, where] of texts) {
    if (where.length > 1 && text.length > 0 && new Set(where.map(family)).size > 1) {
      const preview = text.length > 90 ? `${text.slice(0, 90)}…` : text;
      out.push(finding({ check: "quiz.duplicate-text", area: "quiz", severity: "medium", subject: where[0]!.split(":")[0]!.split("-")[0], entity: where.join(" | ").slice(0, 160),
        title: `Same question text appears ${where.length} times: "${preview}"`, detail: where.slice(0, 6).join(", ") }));
    }
  }
  return out;
};

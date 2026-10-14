import { finding, type CheckDefinition, type CheckFn, type Finding } from "../types";

export const mptChecks: CheckDefinition[] = [
  { id: "mpt.mock-total-mismatch", area: "mpt", severity: "critical", description: "A mock's section counts or question list don't add up to its stated total." },
  { id: "mpt.mock-missing-question", area: "mpt", severity: "critical", description: "A mock references a question id that is not in the bank." },
  { id: "mpt.mock-duplicate-question", area: "mpt", severity: "critical", description: "A mock lists the same question twice." },
  { id: "mpt.section-subject-mismatch", area: "mpt", severity: "high", description: "A section contains questions from a different subject than the section declares." },
  { id: "mpt.duplicate-id", area: "mpt", severity: "critical", description: "A question id appears twice in the bank." },
  { id: "mpt.invalid-answer", area: "mpt", severity: "critical", description: "A question's correct answer is not one of its A–D options." },
  { id: "mpt.missing-explanation", area: "mpt", severity: "high", description: "A question has no explanation." },
  { id: "mpt.verified-not-past-paper", area: "mpt", severity: "critical", description: "A generated / non-past-paper question is flagged as verified." },
  { id: "mpt.past-paper-incomplete", area: "mpt", severity: "high", description: "A 'Verified Past Paper' question lacks a source year or is not flagged verified." },
  { id: "mpt.exact-duplicate", area: "mpt", severity: "medium", description: "Two questions have identical text and options." },
];

const norm = (s: string): string => s.replace(/\s+/g, " ").trim().toLowerCase();

export const checkMpt: CheckFn = (ctx) => {
  const out: Finding[] = [];
  const { bank, mocks } = ctx.mpt;
  const byId = new Map(bank.map((q) => [q.id, q]));
  const file = "src/features/mpt-mock/data/mpt-mock-data.ts";

  const ids = new Map<string, number>();
  const exact = new Map<string, string[]>();
  let flagged = 0;
  const flaggedIds: string[] = [];
  for (const q of bank) {
    ids.set(q.id, (ids.get(q.id) ?? 0) + 1);
    if (!(["A", "B", "C", "D"] as const).includes(q.correctAnswer) || !q.options[q.correctAnswer]) {
      out.push(finding({ check: "mpt.invalid-answer", area: "mpt", severity: "critical", entity: q.id, title: `MPT question ${q.id} has an invalid correct answer.`, file }));
    }
    if (!q.explanation || q.explanation.trim() === "") out.push(finding({ check: "mpt.missing-explanation", area: "mpt", severity: "high", entity: q.id, title: `MPT question ${q.id} has no explanation.`, file }));
    if (q.sourceType !== "Verified Past Paper" && q.verified) { flagged += 1; if (flaggedIds.length < 8) flaggedIds.push(q.id); }
    if (q.sourceType === "Verified Past Paper" && (!q.verified || !q.sourceYear)) {
      out.push(finding({ check: "mpt.past-paper-incomplete", area: "mpt", severity: "high", entity: q.id, title: `Past-paper question ${q.id} is missing ${!q.sourceYear ? "a source year" : "its verified flag"}.`, file }));
    }
    const key = `${norm(q.question)}|${(["A", "B", "C", "D"] as const).map((l) => norm(q.options[l] ?? "")).sort().join("|")}`;
    (exact.get(key) ?? exact.set(key, []).get(key)!).push(q.id);
  }
  if (flagged > 0) {
    out.push(finding({ check: "mpt.verified-not-past-paper", area: "mpt", severity: "critical", entity: "bank",
      title: `${flagged} generated or compiled MPT question(s) are flagged verified.`,
      detail: `Only genuine past-paper questions may carry verified=true. Examples: ${flaggedIds.join(", ")}. Fix in tools/mpt and regenerate.`, file }));
  }
  for (const [id, n] of ids) if (n > 1) out.push(finding({ check: "mpt.duplicate-id", area: "mpt", severity: "critical", entity: id, title: `MPT question id ${id} appears ${n} times.`, file }));
  for (const [, list] of exact) if (list.length > 1) out.push(finding({ check: "mpt.exact-duplicate", area: "mpt", severity: "medium", entity: list.join(","), title: `MPT questions ${list.join(", ")} are identical.`, file }));

  for (const m of mocks) {
    const sectionSum = m.sections.reduce((a, s) => a + s.count, 0);
    if (sectionSum !== m.totalQuestions || m.questionIds.length !== m.totalQuestions) {
      out.push(finding({ check: "mpt.mock-total-mismatch", area: "mpt", severity: "critical", entity: m.id,
        title: `Mock "${m.id}": total ${m.totalQuestions}, sections sum to ${sectionSum}, ${m.questionIds.length} questions listed.`, file }));
    }
    const seen = new Set<string>();
    let offset = 0;
    for (const id of m.questionIds) {
      if (seen.has(id)) out.push(finding({ check: "mpt.mock-duplicate-question", area: "mpt", severity: "critical", entity: `${m.id}/${id}`, title: `Mock "${m.id}" lists ${id} twice.`, file }));
      seen.add(id);
      if (!byId.has(id)) out.push(finding({ check: "mpt.mock-missing-question", area: "mpt", severity: "critical", entity: `${m.id}/${id}`, title: `Mock "${m.id}" references missing question ${id}.`, file }));
    }
    for (const sec of m.sections) {
      const slice = m.questionIds.slice(offset, offset + sec.count).map((id) => byId.get(id)).filter((q): q is NonNullable<typeof q> => !!q);
      const wrong = slice.filter((q) => q.subjectCode !== sec.code).length;
      if (wrong > 0) out.push(finding({ check: "mpt.section-subject-mismatch", area: "mpt", severity: "high", entity: `${m.id}/${sec.code}`, title: `Mock "${m.id}" section ${sec.code} contains ${wrong} question(s) from another subject.`, file }));
      offset += sec.count;
    }
  }
  return out;
};

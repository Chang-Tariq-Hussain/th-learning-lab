// Dev-only sanity check for the Mathematics question bank: run with `npx tsx scripts/verify-question-bank.ts`.
// Not wired into npm scripts or CI — a lightweight manual tool for verifying question
// counts, difficulty distribution, ID uniqueness, and Practice Mode wiring after edits.
import { quizzes } from "../src/features/quiz-engine/registry";
import { validateQuizQuestions } from "../src/features/quiz-engine/utils/validate-quiz";
import { getPracticeSubjects, countAvailableQuestions, selectPracticeQuestions } from "../src/features/practice-mode/question-bank";

const mathQuizzes = quizzes.filter(q => q.subjectSlug === "mathematics");
console.log("=== Mathematics quizzes ===");
for (const q of mathQuizzes) {
  const issues = validateQuizQuestions(q.questions);
  const easy = q.questions.filter(x => x.difficulty === "easy").length;
  const medium = q.questions.filter(x => x.difficulty === "medium").length;
  const hard = q.questions.filter(x => x.difficulty === "hard").length;
  const ids = new Set(q.questions.map(x => x.id));
  console.log(`${q.id}: total=${q.questions.length} easy=${easy} medium=${medium} hard=${hard} uniqueIds=${ids.size === q.questions.length} validationIssues=${issues.length}`);
  for (const question of q.questions) {
    if (!question.options.includes(question.correctAnswer)) {
      console.log(`  MISMATCH: ${question.id}`);
    }
    const optSet = new Set(question.options);
    if (optSet.size !== question.options.length) {
      console.log(`  DUP OPTIONS: ${question.id}`);
    }
  }
}

const physicsQuizzes = quizzes.filter(q => q.subjectSlug === "physics");
console.log("\n=== Physics quizzes ===");
for (const q of physicsQuizzes) {
  const issues = validateQuizQuestions(q.questions);
  const easy = q.questions.filter(x => x.difficulty === "easy").length;
  const medium = q.questions.filter(x => x.difficulty === "medium").length;
  const hard = q.questions.filter(x => x.difficulty === "hard").length;
  const ids = new Set(q.questions.map(x => x.id));
  console.log(`${q.id}: total=${q.questions.length} easy=${easy} medium=${medium} hard=${hard} uniqueIds=${ids.size === q.questions.length} validationIssues=${issues.length}`);
  for (const question of q.questions) {
    if (!question.options.includes(question.correctAnswer)) {
      console.log(`  MISMATCH: ${question.id}`);
    }
    const optSet = new Set(question.options);
    if (optSet.size !== question.options.length) {
      console.log(`  DUP OPTIONS: ${question.id}`);
    }
  }
}

// Cross-quiz duplicate ID / duplicate question text check (whole bank)
const allIds = quizzes.flatMap(q => q.questions.map(x => x.id));
const idCounts = new Map<string, number>();
for (const id of allIds) idCounts.set(id, (idCounts.get(id) ?? 0) + 1);
const dupeIds = [...idCounts.entries()].filter(([, c]) => c > 1);
console.log("\nGlobal duplicate IDs across all quizzes:", dupeIds.length === 0 ? "none" : dupeIds);

const allQuestionTexts = quizzes.flatMap(q => q.questions.map(x => `${q.subjectSlug}:${x.topic}:${x.question}`));
const textCounts = new Map<string, number>();
for (const t of allQuestionTexts) textCounts.set(t, (textCounts.get(t) ?? 0) + 1);
const dupeTexts = [...textCounts.entries()].filter(([, c]) => c > 1);
console.log("Duplicate question text within the same topic:", dupeTexts.length === 0 ? "none" : dupeTexts);

console.log("\n=== Practice Mode wiring ===");
const subjects = getPracticeSubjects();
const math = subjects.find(s => s.slug === "mathematics")!;
console.log("Mathematics topics in Practice Mode:", math.topics.map(t => `${t.slug}(${t.questionCount})`).join(", "));
console.log("Total mathematics questions:", math.questionCount);

const physics = subjects.find(s => s.slug === "physics")!;
console.log("Physics topics in Practice Mode:", physics.topics.map(t => `${t.slug}(${t.questionCount})`).join(", "));
console.log("Total physics questions:", physics.questionCount);

for (const topic of math.topics) {
  for (const diff of ["easy", "medium", "hard", "mixed"] as const) {
    const count = countAvailableQuestions("mathematics", topic.slug, diff);
    if (diff !== "mixed" && count < 10) console.log(`  LOW COUNT: mathematics/${topic.slug} ${diff} = ${count}`);
  }
}

for (const topic of physics.topics) {
  for (const diff of ["easy", "medium", "hard", "mixed"] as const) {
    const count = countAvailableQuestions("physics", topic.slug, diff);
    if (diff !== "mixed" && count < 10) console.log(`  LOW COUNT: physics/${topic.slug} ${diff} = ${count}`);
  }
}

const pool = selectPracticeQuestions({ subjectSlug: "mathematics", topicSlug: "coordinate-geometry", difficulty: "mixed", requestedCount: 10 });
const pool2 = selectPracticeQuestions({ subjectSlug: "mathematics", topicSlug: "coordinate-geometry", difficulty: "mixed", requestedCount: 10 });
const sameOrder = JSON.stringify(pool.questions.map(q=>q.id)) === JSON.stringify(pool2.questions.map(q=>q.id));
console.log("\ncoordinate-geometry: availableCount=", pool.availableCount, "selected=", pool.questions.length, "identical two draws?", sameOrder);

for (const topicSlug of ["motion", "newtonian-mechanics", "electromagnetism", "wave-motion"]) {
  const a = selectPracticeQuestions({ subjectSlug: "physics", topicSlug, difficulty: "mixed", requestedCount: 10 });
  const b = selectPracticeQuestions({ subjectSlug: "physics", topicSlug, difficulty: "mixed", requestedCount: 10 });
  const identical = JSON.stringify(a.questions.map(q=>q.id)) === JSON.stringify(b.questions.map(q=>q.id));
  console.log(`${topicSlug}: availableCount=`, a.availableCount, "selected=", a.questions.length, "identical two draws?", identical);

  for (const diff of ["easy", "medium", "hard"] as const) {
    const r = selectPracticeQuestions({ subjectSlug: "physics", topicSlug, difficulty: diff, requestedCount: 10 });
    const allMatchDiff = r.questions.every(q => q.difficulty === diff);
    console.log(`  ${topicSlug}/${diff}: selected=${r.questions.length} allMatchDifficulty=${allMatchDiff}`);
  }
}

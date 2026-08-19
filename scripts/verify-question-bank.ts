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

console.log("\n=== Practice Mode wiring ===");
const subjects = getPracticeSubjects();
const math = subjects.find(s => s.slug === "mathematics")!;
console.log("Mathematics topics in Practice Mode:", math.topics.map(t => `${t.slug}(${t.questionCount})`).join(", "));
console.log("Total mathematics questions:", math.questionCount);

for (const topic of math.topics) {
  for (const diff of ["easy", "medium", "hard", "mixed"] as const) {
    const count = countAvailableQuestions("mathematics", topic.slug, diff);
    if (diff !== "mixed" && count < 10) console.log(`  LOW COUNT: ${topic.slug} ${diff} = ${count}`);
  }
}

const pool = selectPracticeQuestions({ subjectSlug: "mathematics", topicSlug: "coordinate-geometry", difficulty: "mixed", requestedCount: 10 });
const pool2 = selectPracticeQuestions({ subjectSlug: "mathematics", topicSlug: "coordinate-geometry", difficulty: "mixed", requestedCount: 10 });
const sameOrder = JSON.stringify(pool.questions.map(q=>q.id)) === JSON.stringify(pool2.questions.map(q=>q.id));
console.log("coordinate-geometry: availableCount=", pool.availableCount, "selected=", pool.questions.length, "identical two draws?", sameOrder);

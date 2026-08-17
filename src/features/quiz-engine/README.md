# Quiz Engine

A reusable, subject-agnostic quiz-taking system. It knows how to run
a multiple-choice quiz end to end — question → check answer →
feedback → next question → results — and nothing about Physics vs.
Chemistry vs. Biology vs. Maths specifically. Each subject supplies
its own question data against the same shapes.

## Structure

```
quiz-engine/
  types.ts              Question, answer, and result shapes
  registry.ts            Array of every registered QuizMeta + getters
  hooks/use-quiz.ts      Quiz-taking state (current question, score, phase)
  utils/shuffle.ts        Question/option shuffling (safe by construction)
  utils/validate-quiz.ts  Catches empty/invalid question data
  components/             Presentational pieces (progress bar, question
                           card, feedback banner, results screen, the
                           "unavailable" fallback)
  quiz.tsx                <Quiz /> — orchestrates the above
  index.ts                Code-split export (ssr:false + SimulationSkeleton),
                           same convention every simulation uses
  data/                   One file per quiz's question set
```

## Adding another quiz

1. Create `data/<subject>-<topic>-quiz.ts` with a `QuizQuestion[]` and
   a `QuizMeta` object (see `physics-motion-quiz.ts`).
2. Add that `QuizMeta` to the array in `registry.ts`.
3. Add a route, e.g. `src/app/dashboard/<subject>/<topic>-quiz/page.tsx`,
   that calls `getQuizById(...)` and renders `<Quiz />` with the
   result — copy `physics/motion-quiz/page.tsx`.

No changes to the engine itself are needed for a new subject, a new
topic, or more questions.

## Design notes

- **Correct answers are stored by value, not index** (`correctAnswer:
  string`, matched against one entry of `options`). That's what makes
  `shuffleQuestionOptions` safe — there's no index to desync.
- **State is local `useState`, not Zustand.** The project doesn't use
  Zustand anywhere, and nothing about taking a quiz needs to be read
  outside the `<Quiz />` tree. If a future feature needs to resume an
  in-progress quiz across navigations, that's the point to reconsider.
- **`onComplete` is the seam for persistence.** `<Quiz />` already
  builds a `QuizCompletionResult` (`quizId`, `score`,
  `totalQuestions`, `percentage`, `completedAt`, `answers`) when a
  student finishes — a future progress-tracking feature just needs to
  pass an `onComplete` handler that saves it, no engine changes.

## Not built yet (by design)

Practice Mode, Exam Mode, a progress dashboard, teacher assignments,
and premium gating are all out of scope for this first version. The
question/answer/result shapes above were written with those in mind
(e.g. `difficulty` is on every question even though no quiz has a
difficulty selector yet) so they shouldn't need to change shape later
— but none of that behavior exists yet.

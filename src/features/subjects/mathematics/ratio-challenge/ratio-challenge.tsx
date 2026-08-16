"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressHeader } from "./components/progress-header";
import { QuestionCard } from "./components/question-card";
import { FillBlankQuestion } from "./components/fill-blank-question";
import { MultipleChoiceQuestion } from "./components/multiple-choice-question";
import { DragDropQuestionView } from "./components/drag-drop-question";
import { FeedbackBanner } from "./components/feedback-banner";
import { generateQuestion } from "./question-bank";
import { useChime } from "./use-chime";
import { MAX_DIFFICULTY, MIN_DIFFICULTY, type Difficulty, type Question } from "./types";

const LEVEL_UP_STREAK = 3;
const START_DIFFICULTY: Difficulty = 1;

function pointsFor(difficulty: Difficulty): number {
  return difficulty * 10;
}

export function RatioChallenge() {
  const [difficulty, setDifficulty] = useState<Difficulty>(START_DIFFICULTY);
  const [question, setQuestion] = useState<Question>(() => generateQuestion(START_DIFFICULTY));
  const [locked, setLocked] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [confettiKey, setConfettiKey] = useState(0);
  const playChime = useChime();

  const handleSubmit = (correct: boolean) => {
    setLocked(true);
    setLastCorrect(correct);

    if (correct) {
      playChime();
      setConfettiKey((k) => k + 1);
      setScore((s) => s + pointsFor(question.difficulty));

      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setBestStreak((b) => Math.max(b, nextStreak));

      if (nextStreak % LEVEL_UP_STREAK === 0 && difficulty < MAX_DIFFICULTY) {
        setDifficulty((difficulty + 1) as Difficulty);
      }
    } else {
      setStreak(0);
      if (difficulty > MIN_DIFFICULTY) {
        setDifficulty((difficulty - 1) as Difficulty);
      }
    }
  };

  const handleNext = () => {
    setQuestion(generateQuestion(difficulty, question.kind));
    setLocked(false);
    setLastCorrect(null);
  };

  const handleRestart = () => {
    setDifficulty(START_DIFFICULTY);
    setQuestion(generateQuestion(START_DIFFICULTY));
    setLocked(false);
    setLastCorrect(null);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
  };

  const levelProgress = (streak % LEVEL_UP_STREAK) / LEVEL_UP_STREAK;

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <ProgressHeader
        score={score}
        streak={streak}
        bestStreak={bestStreak}
        difficulty={difficulty}
        levelProgress={levelProgress}
      />

      <div className="w-full max-w-2xl">
        <QuestionCard question={question} confettiKey={confettiKey}>
          {(question.kind === "simplify" || question.kind === "missing-value") && (
            <FillBlankQuestion
              key={question.id}
              question={question}
              locked={locked}
              correct={locked ? lastCorrect : null}
              onSubmit={handleSubmit}
            />
          )}

          {(question.kind === "equivalent-mc" || question.kind === "word-problem") && (
            <MultipleChoiceQuestion key={question.id} question={question} locked={locked} onSubmit={handleSubmit} />
          )}

          {question.kind === "equivalent-dragdrop" && (
            <DragDropQuestionView key={question.id} question={question} locked={locked} onSubmit={handleSubmit} />
          )}
        </QuestionCard>
      </div>

      <div className="w-full max-w-2xl">
        {locked && lastCorrect !== null && (
          <FeedbackBanner correct={lastCorrect} explanation={question.explanation} onNext={handleNext} />
        )}
      </div>

      <Button size="lg" variant="ghost" onClick={handleRestart}>
        <RotateCcw className="h-4 w-4" strokeWidth={2} />
        Restart
      </Button>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { PlotPlane } from "./components/plot-plane";
import { TargetCard } from "./components/target-card";
import { FeedbackBanner } from "./components/feedback-banner";
import { ProgressBar } from "./components/progress-bar";
import { IntroPanel } from "./components/intro-panel";
import { CompletePanel } from "./components/complete-panel";
import { LEVEL_QUESTIONS, FINAL_CHALLENGE, buildFeedback, type Level } from "./model";

type Phase = "intro" | "playing" | "complete";
type Status = "idle" | "correct" | "incorrect";

const ADVANCE_DELAY_MS = 1400;

export function PlotAPoint() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [level, setLevel] = useState<Level>(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [guess, setGuess] = useState<{ x: number; y: number } | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);

  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    };
  }, []);

  const questions = LEVEL_QUESTIONS[level];
  const isFinal = level === 3 && questionIndex >= questions.length;
  const target = isFinal ? FINAL_CHALLENGE : questions[questionIndex]!;
  const showHint = !isFinal && target.hint === true;

  const goToQuestion = (newLevel: Level, newIndex: number) => {
    setLevel(newLevel);
    setQuestionIndex(newIndex);
    setGuess(null);
    setStatus("idle");
    setScore((s) => ({ ...s, total: s.total + 1 }));
  };

  const handleStart = () => {
    setScore({ correct: 0, total: 1 });
    setPhase("playing");
  };

  const handleLevelChange = (newLevel: Level) => {
    if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    setPhase("playing");
    setStreak(0);
    goToQuestion(newLevel, 0);
  };

  const advance = () => {
    if (isFinal) {
      setPhase("complete");
      return;
    }
    if (questionIndex + 1 < questions.length) {
      goToQuestion(level, questionIndex + 1);
    } else if (level < 3) {
      goToQuestion((level + 1) as Level, 0);
    } else {
      goToQuestion(level, questions.length);
    }
  };

  const handlePlace = (x: number, y: number) => {
    if (status === "correct") return;
    setGuess({ x, y });

    if (x === target.x && y === target.y) {
      setStatus("correct");
      setScore((s) => ({ ...s, correct: s.correct + 1 }));
      setStreak((s) => s + 1);
      advanceTimeoutRef.current = setTimeout(advance, ADVANCE_DELAY_MS);
    } else {
      setStatus("incorrect");
      setStreak(0);
    }
  };

  const handleReset = () => {
    if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    setLevel(1);
    setQuestionIndex(0);
    setGuess(null);
    setStatus("idle");
    setStreak(0);
    setScore({ correct: 0, total: 1 });
    setPhase("playing");
  };

  if (phase === "intro") {
    return <IntroPanel onStart={handleStart} />;
  }

  if (phase === "complete") {
    return <CompletePanel finalTarget={FINAL_CHALLENGE} correct={score.correct} total={score.total} onReset={handleReset} />;
  }

  const feedbackMessage = status === "incorrect" ? buildFeedback(target, guess!) : "";

  return (
    <div className="flex flex-col gap-4">
      <ProgressBar level={level} onLevelChange={handleLevelChange} correct={score.correct} total={score.total} streak={streak} />

      <TargetCard target={target} showHint={showHint} isFinal={isFinal} />

      <div className="mx-auto aspect-square w-full max-w-[560px] rounded-[1.75rem] border border-line bg-white/70 p-3 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04] sm:p-5">
        <PlotPlane guess={guess} status={status} onPlace={handlePlace} />
      </div>

      <FeedbackBanner status={status} message={feedbackMessage} guess={guess} target={target} />

      <div className="flex justify-center">
        <Button variant="ghost" size="md" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
          Reset
        </Button>
      </div>
    </div>
  );
}

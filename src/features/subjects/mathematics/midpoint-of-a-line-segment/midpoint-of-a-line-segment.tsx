"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MidpointPlane, type Highlight } from "./components/midpoint-plane";
import { CoordinateReadout } from "./components/coordinate-readout";
import { StepCalculation } from "./components/step-calculation";
import { ModeToggle, type Mode } from "./components/mode-toggle";
import { SpecialCasePanel } from "./components/special-case-panel";
import { CalculateChallenge } from "./components/calculate-challenge";
import { LearningPanel } from "./components/learning-panel";
import { DEFAULT_A, DEFAULT_B, CALCULATE_QUESTIONS, type MidPoint } from "./model";

export function MidpointOfALineSegment() {
  const [mode, setMode] = useState<Mode>("explore");

  // Explore mode state
  const [a, setA] = useState<MidPoint>(DEFAULT_A);
  const [b, setB] = useState<MidPoint>(DEFAULT_B);
  const [highlight, setHighlight] = useState<Highlight>("none");

  // Calculate mode state
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answered, setAnswered] = useState<MidPoint | null>(null);

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setHighlight("none");
    if (newMode === "calculate") {
      setQuestionIndex(0);
      setAnswered(null);
    }
  };

  const handleLoadSpecialCase = (newA: MidPoint, newB: MidPoint) => {
    setA(newA);
    setB(newB);
    setHighlight("none");
  };

  const handleReset = () => {
    setA(DEFAULT_A);
    setB(DEFAULT_B);
    setHighlight("none");
    setQuestionIndex(0);
    setAnswered(null);
  };

  const handleAnswer = (value: MidPoint) => {
    setAnswered(value);
  };

  const handleNext = () => {
    setQuestionIndex((i) => i + 1);
    setAnswered(null);
  };

  const activeQuestion = CALCULATE_QUESTIONS[questionIndex] ?? CALCULATE_QUESTIONS[CALCULATE_QUESTIONS.length - 1]!;
  const questionSolved = !!answered && answered.x === activeQuestion.correct.x && answered.y === activeQuestion.correct.y;
  const challengeDone = questionIndex >= CALCULATE_QUESTIONS.length;

  return (
    <div className="flex flex-col gap-4">
      <ModeToggle mode={mode} onChange={handleModeChange} />

      {mode === "explore" ? (
        <>
          <CoordinateReadout a={a} b={b} />

          <div className="mx-auto aspect-square w-full max-w-[560px] rounded-[1.75rem] border border-line bg-white/70 p-3 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04] sm:p-5">
            <MidpointPlane a={a} b={b} onChangeA={(x, y) => setA({ x, y })} onChangeB={(x, y) => setB({ x, y })} highlight={highlight} draggable />
          </div>

          <p className="text-center text-sm text-ink-soft dark:text-bone-soft">Drag the points and discover the midpoint.</p>

          <StepCalculation a={a} b={b} selected={highlight} onSelect={setHighlight} />

          <SpecialCasePanel onLoad={handleLoadSpecialCase} />

          <div className="flex justify-center">
            <Button variant="ghost" size="md" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
              Reset
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="mx-auto aspect-square w-full max-w-[560px] rounded-[1.75rem] border border-line bg-white/70 p-3 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04] sm:p-5">
            <MidpointPlane a={activeQuestion.a} b={activeQuestion.b} draggable={false} revealMidpoint={challengeDone || questionSolved} />
          </div>

          <CalculateChallenge questionIndex={questionIndex} answered={answered} onAnswer={handleAnswer} onNext={handleNext} />

          {challengeDone ? (
            <div className="flex justify-center">
              <Button variant="ghost" size="md" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
                Restart Challenge
              </Button>
            </div>
          ) : null}
        </>
      )}

      <LearningPanel />
    </div>
  );
}

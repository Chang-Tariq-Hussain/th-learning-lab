"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimulationLayout, SimulationReadouts } from "@/features/simulation";
import { MidpointPlane, type Highlight } from "./components/midpoint-plane";
import { StepCalculation } from "./components/step-calculation";
import { ModeToggle, type Mode } from "./components/mode-toggle";
import { SpecialCasePanel } from "./components/special-case-panel";
import { CalculateChallenge } from "./components/calculate-challenge";
import { LearningPanel } from "./components/learning-panel";
import { DEFAULT_A, DEFAULT_B, CALCULATE_QUESTIONS, formatPoint, midpoint, type MidPoint } from "./model";

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
    <div className="flex flex-col gap-4 py-4">
      <ModeToggle mode={mode} onChange={handleModeChange} />

      {mode === "explore" ? (
        <SimulationLayout
          stageLabel="Midpoint of a line segment"
          aspect={1}
          stageCap="30rem"
          stage={<MidpointPlane a={a} b={b} onChangeA={(x, y) => setA({ x, y })} onChangeB={(x, y) => setB({ x, y })} highlight={highlight} draggable />}
          readouts={
            <SimulationReadouts
              label="Points"
              items={[
                { id: "a", label: "Point A", value: `(${a.x}, ${a.y})` },
                { id: "b", label: "Point B", value: `(${b.x}, ${b.y})` },
                { id: "m", label: "Midpoint M", value: formatPoint(midpoint(a, b)) },
              ]}
            />
          }
          actions={
            <Button variant="ghost" size="md" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
              Reset
            </Button>
          }
          controls={
            <div className="flex min-w-0 flex-col gap-4">
              <p className="text-center text-sm text-ink-soft dark:text-bone-soft">Drag the points and discover the midpoint.</p>
              <StepCalculation a={a} b={b} selected={highlight} onSelect={setHighlight} />
              <SpecialCasePanel onLoad={handleLoadSpecialCase} />
            </div>
          }
        />
      ) : (
        <SimulationLayout
          stageLabel="Midpoint of a line segment, calculate challenge"
          aspect={1}
          stageCap="30rem"
          stage={<MidpointPlane a={activeQuestion.a} b={activeQuestion.b} draggable={false} revealMidpoint={challengeDone || questionSolved} />}
          actions={
            challengeDone ? (
              <Button variant="ghost" size="md" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
                Restart Challenge
              </Button>
            ) : undefined
          }
          controls={<CalculateChallenge questionIndex={questionIndex} answered={answered} onAnswer={handleAnswer} onNext={handleNext} />}
        />
      )}

      <LearningPanel />
    </div>
  );
}

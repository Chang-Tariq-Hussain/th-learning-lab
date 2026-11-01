"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimulationLayout, SimulationReadouts } from "@/features/simulation";
import { SlopePlane, type Highlight } from "./components/slope-plane";
import { StepCalculation } from "./components/step-calculation";
import { ModeToggle, type Mode } from "./components/mode-toggle";
import { SlopeTypeSelector } from "./components/slope-type-selector";
import { SlopeMessage } from "./components/slope-message";
import { CalculateChallenge } from "./components/calculate-challenge";
import { LearningPanel } from "./components/learning-panel";
import { DEFAULT_A, DEFAULT_B, CALCULATE_QUESTIONS, SLOPE_PRESETS, formatSlope, rise, run, slope, slopeType, type SlopePoint, type SlopeType } from "./model";

export function SlopeOfALine() {
  const [mode, setMode] = useState<Mode>("explore");

  // Explore mode state
  const [a, setA] = useState<SlopePoint>(DEFAULT_A);
  const [b, setB] = useState<SlopePoint>(DEFAULT_B);
  const [highlight, setHighlight] = useState<Highlight>("none");

  // Calculate mode state
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setHighlight("none");
    if (newMode === "calculate") {
      setQuestionIndex(0);
      setAnswered(null);
    }
  };

  const handleSelectType = (type: SlopeType) => {
    const preset = SLOPE_PRESETS[type];
    setA(preset.a);
    setB(preset.b);
    setHighlight("none");
  };

  const handleReset = () => {
    setA(DEFAULT_A);
    setB(DEFAULT_B);
    setHighlight("none");
    setQuestionIndex(0);
    setAnswered(null);
  };

  const handleAnswer = (value: number) => {
    setAnswered(value);
  };

  const handleNext = () => {
    setQuestionIndex((i) => i + 1);
    setAnswered(null);
  };

  const activeQuestion = CALCULATE_QUESTIONS[questionIndex] ?? CALCULATE_QUESTIONS[CALCULATE_QUESTIONS.length - 1]!;
  const questionSolved = answered === activeQuestion.correct;
  const challengeDone = questionIndex >= CALCULATE_QUESTIONS.length;
  const activeType = slopeType(a, b);

  return (
    <div className="flex flex-col gap-4 py-4">
      <ModeToggle mode={mode} onChange={handleModeChange} />

      {mode === "explore" ? (
        <SimulationLayout
          stageLabel="Slope of a line"
          aspect={1}
          stageCap="30rem"
          stage={<SlopePlane a={a} b={b} onChangeA={(x, y) => setA({ x, y })} onChangeB={(x, y) => setB({ x, y })} highlight={highlight} draggable />}
          readouts={
            <SimulationReadouts
              label="Points and slope"
              items={[
                { id: "a", label: "Point A", value: `(${a.x}, ${a.y})` },
                { id: "b", label: "Point B", value: `(${b.x}, ${b.y})` },
                { id: "rr", label: "Rise/Run", value: `${rise(a, b)}/${run(a, b)}` },
                { id: "m", label: "Slope m", value: formatSlope(slope(a, b)) },
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
              <SlopeMessage a={a} b={b} />
              <StepCalculation a={a} b={b} selected={highlight} onSelect={setHighlight} />
              <SlopeTypeSelector active={activeType} onSelect={handleSelectType} />
            </div>
          }
        />
      ) : (
        <SimulationLayout
          stageLabel="Slope of a line, calculate challenge"
          aspect={1}
          stageCap="30rem"
          stage={<SlopePlane a={activeQuestion.a} b={activeQuestion.b} draggable={false} revealSlope={challengeDone || questionSolved} />}
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

"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinePlane } from "./components/line-plane";
import { LineSlider } from "./components/line-slider";
import { ModeToggle, type Mode } from "./components/mode-toggle";
import { MatchChallenge } from "./components/match-challenge";
import { LearningPanel } from "./components/learning-panel";
import { formatEquation, DEFAULT_M, DEFAULT_B, M_MIN, M_MAX, B_MIN, B_MAX, MATCH_QUESTIONS } from "./model";

export function LineDesigner() {
  const [mode, setMode] = useState<Mode>("design");

  // Design mode state
  const [m, setM] = useState(DEFAULT_M);
  const [b, setB] = useState(DEFAULT_B);

  // Match mode state — reuses the same m/b sliders against a target.
  const [questionIndex, setQuestionIndex] = useState(0);
  const [matchM, setMatchM] = useState(0);
  const [matchB, setMatchB] = useState(0);

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    if (newMode === "match") {
      setQuestionIndex(0);
      setMatchM(0);
      setMatchB(0);
    }
  };

  const handleReset = () => {
    setM(DEFAULT_M);
    setB(DEFAULT_B);
    setQuestionIndex(0);
    setMatchM(0);
    setMatchB(0);
  };

  const activeQuestion = MATCH_QUESTIONS[questionIndex] ?? MATCH_QUESTIONS[MATCH_QUESTIONS.length - 1]!;
  const challengeDone = questionIndex >= MATCH_QUESTIONS.length;
  const solved = !challengeDone && matchM === activeQuestion.targetM && matchB === activeQuestion.targetB;

  const handleNext = () => {
    setQuestionIndex((i) => i + 1);
    setMatchM(0);
    setMatchB(0);
  };

  return (
    <div className="flex flex-col gap-4">
      <ModeToggle mode={mode} onChange={handleModeChange} />

      {mode === "design" ? (
        <>
          <p className="text-center font-display text-2xl font-medium text-ink dark:text-bone">{formatEquation(m, b)}</p>

          <div className="mx-auto aspect-square w-full max-w-[560px] rounded-[1.75rem] border border-line bg-white/70 p-3 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04] sm:p-5">
            <LinePlane m={m} b={b} />
          </div>

          <div className="mx-auto flex w-full max-w-[560px] flex-col gap-4 sm:flex-row sm:justify-center sm:gap-8">
            <LineSlider id="slope-slider" label="m" value={m} onChange={setM} min={M_MIN} max={M_MAX} />
            <LineSlider id="intercept-slider" label="b" value={b} onChange={setB} min={B_MIN} max={B_MAX} />
          </div>

          <p className="text-center text-sm text-ink-soft dark:text-bone-soft">
            Move the sliders and watch the line, and the equation, update together.
          </p>

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
            <LinePlane
              m={matchM}
              b={matchB}
              revealEquation={solved || challengeDone}
              targetM={challengeDone ? undefined : activeQuestion.targetM}
              targetB={challengeDone ? undefined : activeQuestion.targetB}
            />
          </div>

          {!challengeDone ? (
            <div className="mx-auto flex w-full max-w-[560px] flex-col gap-4 sm:flex-row sm:justify-center sm:gap-8">
              <LineSlider id="match-slope-slider" label="m" value={matchM} onChange={setMatchM} min={M_MIN} max={M_MAX} />
              <LineSlider id="match-intercept-slider" label="b" value={matchB} onChange={setMatchB} min={B_MIN} max={B_MAX} />
            </div>
          ) : null}

          <MatchChallenge questionIndex={questionIndex} solved={solved} onNext={handleNext} />

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

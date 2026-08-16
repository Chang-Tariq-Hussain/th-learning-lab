"use client";

import { useState } from "react";
import { ActionButtons } from "./components/action-buttons";
import { EquationDisplay, type CheckStatus } from "./components/equation-display";
import { FeedbackBanner } from "./components/feedback-banner";
import { ValueSlider } from "./components/value-slider";
import { challengeKey, explainAnswer, nextChallenge, type EquationChallenge } from "./equations";
import { useChime } from "./use-chime";

/**
 * An educational toy, not a calculator — nothing here ever solves the
 * equation for the student. The slider just fills the box with
 * whatever number it's currently on; Check only ever compares that
 * number to the answer and reports true/false. Built outside the
 * Simulation Framework, same reasoning as every other toy in
 * `mathematics/`: one equation, one slider, two buttons — no toolbar,
 * no formula panel fits "nothing else."
 */
export function EquationPlayground() {
  const [challenge, setChallenge] = useState<EquationChallenge>(() => nextChallenge());
  const [sliderValue, setSliderValue] = useState(0);
  const [status, setStatus] = useState<CheckStatus>("idle");
  const [confettiKey, setConfettiKey] = useState(0);
  const playChime = useChime();

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    // Adjusting the guess after a Check clears old feedback immediately
    // — no penalty for trying again, so nothing should look "stuck."
    if (status !== "idle") setStatus("idle");
  };

  const handleCheck = () => {
    if (sliderValue === challenge.answer) {
      setStatus("correct");
      setConfettiKey((k) => k + 1);
      playChime();
    } else {
      setStatus("incorrect");
    }
  };

  const handleNewQuestion = () => {
    setChallenge((prev) => nextChallenge(challengeKey(prev)));
    setStatus("idle");
    setSliderValue(0);
  };

  return (
    <div className="flex w-full flex-col items-center gap-8 py-4">
      <EquationDisplay
        challenge={challenge}
        sliderValue={sliderValue}
        status={status}
        confettiKey={confettiKey}
      />

      <ValueSlider value={sliderValue} onChange={handleSliderChange} />

      <ActionButtons onCheck={handleCheck} onNewQuestion={handleNewQuestion} />

      <FeedbackBanner status={status} explanation={explainAnswer(challenge)} />
    </div>
  );
}

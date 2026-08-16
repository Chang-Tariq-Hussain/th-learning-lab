"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnswerStepper } from "./answer-stepper";
import { IconGroup } from "./icon-group";
import { KeyRatioCard } from "./key-ratio-card";
import { ConfettiBurst } from "./confetti-burst";
import {
  askGroupSize,
  askUnit,
  givenGroupSize,
  givenUnit,
  givenValue,
  type Challenge,
} from "../scenarios";

export interface ScenarioSceneProps {
  challenge: Challenge;
  guess: number;
  onGuess: (value: number) => void;
  solved: boolean;
  confettiKey: number;
}

export function ScenarioScene({ challenge, guess, onGuess, solved, confettiKey }: ScenarioSceneProps) {
  const given = givenUnit(challenge);
  const ask = askUnit(challenge);
  const given_ = givenValue(challenge);

  return (
    <div
      className={cn(
        "relative flex flex-col gap-6 rounded-[1.75rem] border bg-white/70 p-6 shadow-card backdrop-blur transition-colors duration-300 dark:bg-white/[0.04] sm:p-8",
        solved ? "border-subject-chemistry/50" : "border-line dark:border-line-dark",
      )}
    >
      <ConfettiBurst triggerKey={confettiKey} />

      <div className="flex flex-col items-center gap-1 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">{challenge.scenario.title}</p>
        <KeyRatioCard scenario={challenge.scenario} ratioA={challenge.ratioA} ratioB={challenge.ratioB} />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Given side */}
        <div className="flex flex-col gap-2.5">
          <SideLabel hex={given.hex} text={`${given.label} · ${given_}`} />
          <IconGroup hex={given.hex} icon={given.icon} count={given_} groupSize={givenGroupSize(challenge)} size="lg" />
        </div>

        {/* Ask side */}
        <div className="flex flex-col gap-2.5">
          <SideLabel hex={ask.hex} text={`${ask.label} · ?`} />
          <IconGroup
            hex={ask.hex}
            icon={ask.icon}
            count={guess}
            groupSize={askGroupSize(challenge)}
            size="lg"
            emptyLabel="Use the stepper below"
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 border-t border-line pt-6 dark:border-line-dark">
        <p className="text-center text-sm text-ink-soft dark:text-bone-soft">
          Keep the ratio the same — how many {ask.label.toLowerCase()}?
        </p>
        <AnswerStepper value={guess} onChange={onGuess} hex={ask.hex} label={ask.label} disabled={solved} />
      </div>

      {solved && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center font-display text-lg font-medium text-subject-chemistry"
        >
          That keeps the ratio — nice work!
        </motion.p>
      )}
    </div>
  );
}

function SideLabel({ hex, text }: { hex: string; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: hex }} />
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft dark:text-bone-soft">{text}</span>
    </div>
  );
}

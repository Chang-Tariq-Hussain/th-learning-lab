"use client";

import { motion } from "framer-motion";
import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimulationLayout } from "@/features/simulation";
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
  onNewScenario: () => void;
}

export function ScenarioScene({ challenge, guess, onGuess, solved, confettiKey, onNewScenario }: ScenarioSceneProps) {
  const given = givenUnit(challenge);
  const ask = askUnit(challenge);
  const given_ = givenValue(challenge);

  return (
    <SimulationLayout
      stageLabel={`Ratio scenario: ${challenge.scenario.title}`}
      aspect={1.5}
      stageCap="20rem"
      stage={
        <div className="relative h-full w-full overflow-y-auto p-2">
          <ConfettiBurst triggerKey={confettiKey} />
          <div className="grid grid-cols-2 gap-3">
            <div className="flex min-w-0 flex-col gap-2">
              <SideLabel hex={given.hex} text={`${given.label} · ${given_}`} />
              <IconGroup hex={given.hex} icon={given.icon} count={given_} groupSize={givenGroupSize(challenge)} size="sm" />
            </div>
            <div className="flex min-w-0 flex-col gap-2">
              <SideLabel hex={ask.hex} text={`${ask.label} · ?`} />
              <IconGroup
                hex={ask.hex}
                icon={ask.icon}
                count={guess}
                groupSize={askGroupSize(challenge)}
                size="sm"
                emptyLabel="Use the stepper"
              />
            </div>
          </div>
        </div>
      }
      readouts={
        solved ? (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center font-display text-base font-medium text-subject-chemistry"
          >
            That keeps the ratio — nice work!
          </motion.p>
        ) : (
          <p className="text-center text-sm text-ink-soft dark:text-bone-soft">
            Keep the ratio the same — how many {ask.label.toLowerCase()}?
          </p>
        )
      }
      actions={
        <>
          <AnswerStepper value={guess} onChange={onGuess} hex={ask.hex} label={ask.label} disabled={solved} />
          <Button size="md" variant="ghost" onClick={onNewScenario}>
            <Shuffle className="h-4 w-4" strokeWidth={2} />
            New scenario
          </Button>
        </>
      }
      controls={
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="font-mono text-label uppercase tracking-[0.2em] text-subject-math">{challenge.scenario.title}</p>
          <KeyRatioCard scenario={challenge.scenario} ratioA={challenge.ratioA} ratioB={challenge.ratioB} />
        </div>
      }
    />
  );
}

function SideLabel({ hex, text }: { hex: string; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: hex }} />
      <span className="font-mono text-label uppercase tracking-[0.18em] text-ink-soft dark:text-bone-soft">{text}</span>
    </div>
  );
}

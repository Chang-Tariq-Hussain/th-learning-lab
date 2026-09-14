"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { INITIAL_REGISTERS, INSTRUCTION_EXECUTIONS, type ComponentId, type ExecutionStage, type FlowStep } from "../model";
import { useStepPlayer } from "../hooks/use-step-player";
import { SystemDiagram } from "./system-diagram";
import { PlaybackControls } from "./playback-controls";
import { ExplanationPanel } from "./explanation-panel";
import { InspectPanel } from "./inspect-panel";

const STAGES: ExecutionStage[] = ["fetch", "decode", "execute"];
const STAGE_LABEL: Record<ExecutionStage, string> = { fetch: "FETCH", decode: "DECODE", execute: "EXECUTE" };

interface TaggedStep extends FlowStep {
  stage: ExecutionStage;
}

export function InstructionExecutionMode() {
  const [instructionIndex, setInstructionIndex] = useState(0);
  const [inspected, setInspected] = useState<ComponentId | null>(null);
  const instruction = INSTRUCTION_EXECUTIONS[instructionIndex]!;

  const steps: TaggedStep[] = useMemo(
    () => STAGES.flatMap((stage) => instruction.steps[stage].map((s) => ({ ...s, stage }))),
    [instruction]
  );

  const player = useStepPlayer(steps);
  const step = player.step as TaggedStep | undefined;
  const registers = step?.registers ? { ...INITIAL_REGISTERS, ...step.registers } : undefined;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Instruction to execute">
        {INSTRUCTION_EXECUTIONS.map((ins, i) => (
          <button
            key={ins.address}
            role="tab"
            aria-selected={i === instructionIndex}
            onClick={() => {
              setInstructionIndex(i);
              setInspected(null);
            }}
            className={cn(
              "rounded-full border px-4 py-2 font-mono text-sm font-medium transition-colors",
              i === instructionIndex
                ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30"
            )}
          >
            [{ins.address}] {ins.mnemonic}
          </button>
        ))}
      </div>

      <p className="text-sm text-ink-soft dark:text-bone-soft">{instruction.summary}</p>

      {/* stage progress */}
      <div className="flex items-center gap-2" aria-hidden="true">
        {STAGES.map((stage, i) => {
          const isCurrentOrPast = step ? STAGES.indexOf(step.stage) >= i : false;
          const isCurrent = step?.stage === stage;
          return (
            <div key={stage} className="flex flex-1 items-center gap-2">
              <div
                className={cn(
                  "flex-1 rounded-full border px-3 py-1.5 text-center font-mono text-[11px] uppercase tracking-wide",
                  isCurrent
                    ? "border-subject-it bg-subject-it text-paper"
                    : isCurrentOrPast
                      ? "border-subject-it/40 bg-subject-it-soft text-subject-it dark:bg-subject-it/15"
                      : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft"
                )}
              >
                {STAGE_LABEL[stage]}
              </div>
              {i < STAGES.length - 1 && <span className="text-ink-soft/40 dark:text-bone-soft/40">→</span>}
            </div>
          );
        })}
      </div>

      <div className="rounded-card border border-line bg-paper p-2 dark:border-line-dark dark:bg-chalkboard sm:p-4">
        <SystemDiagram
          activeComponents={step?.activeComponents ?? []}
          from={step?.from}
          to={step?.to}
          packetLabel={step?.packetLabel}
          busSignal={step?.busSignal}
          stepKey={step?.id ?? "idle"}
          registers={registers}
          inspectedId={inspected}
          onInspect={setInspected}
        />
        <div className="mt-3">
          <ExplanationPanel
            activeLabel={step ? `${STAGE_LABEL[step.stage]} · Step ${player.stepIndex + 1} of ${steps.length}` : undefined}
            explanation={step?.explanation}
            idleText="Press Start to watch this instruction fetch, decode, and execute — one micro-step at a time. Click any component to read what it does."
          />
        </div>
      </div>

      <PlaybackControls player={player} />
      <InspectPanel id={inspected} />
    </div>
  );
}

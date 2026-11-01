"use client";

import { useState } from "react";
import { FULL_SYSTEM_SCENARIO, INITIAL_REGISTERS, type ComponentId } from "../model";
import { useStepPlayer } from "../hooks/use-step-player";
import { FlowLayout, FlowPlaybackActions, FlowSpeed, runStateOf } from "./flow-layout";
import { InspectPanel } from "./inspect-panel";

export function FullSystemMode() {
  const [inspected, setInspected] = useState<ComponentId | null>(null);
  const player = useStepPlayer(FULL_SYSTEM_SCENARIO);
  const step = player.step;
  const registers = step?.registers ? { ...INITIAL_REGISTERS, ...step.registers } : undefined;

  return (
    <div className="flex flex-col gap-6">
      <FlowLayout
        stageLabel="CPU, cache, RAM and storage diagram"
        runState={runStateOf(player)}
        statusDetail={step ? `Step ${player.stepIndex + 1} of ${FULL_SYSTEM_SCENARIO.length}` : undefined}
        diagram={{
          activeComponents: step?.activeComponents ?? [],
          from: step?.from,
          to: step?.to,
          packetLabel: step?.packetLabel,
          busSignal: step?.busSignal,
          stepKey: step?.id ?? "idle",
          registers,
          inspectedId: inspected,
          onInspect: setInspected,
        }}
        actions={<FlowPlaybackActions player={player} />}
        explanation={{
          activeLabel: step ? `Step ${player.stepIndex + 1} of ${FULL_SYSTEM_SCENARIO.length}` : undefined,
          text: step?.explanation,
          idleText: "Press Start to follow the full journey a program takes, from storage to a finished, saved result. Click any component at any time.",
        }}
        controls={
          <div className="flex flex-col gap-4">
            <p className="text-sm text-ink-soft dark:text-bone-soft">
              A complete, guided run of the same 3-instruction program used in Instruction Execution mode — from storage, into
              RAM, through the cache hierarchy and registers, out through the ALU, and finally back to storage when the result
              is saved.
            </p>
            <FlowSpeed player={player} />
          </div>
        }
        below={<InspectPanel id={inspected} />}
      />
    </div>
  );
}

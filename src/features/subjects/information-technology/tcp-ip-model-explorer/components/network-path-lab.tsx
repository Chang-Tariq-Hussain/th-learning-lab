"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useStepPlayer } from "@/features/subjects/information-technology/osi-model-explorer/hooks/use-step-player";
import { Callout, Panel, SectionHeading } from "@/features/subjects/information-technology/osi-model-explorer/components/ui";
import {
  PACKET_JOURNEY_NODES,
  PATH_NOTE,
  PATH_PARTICIPATION,
  PATH_REASONING,
  PATH_STEPS,
  TCPIP_LAYERS,
  type DetailLevel,
} from "../model";
import { PlayerControls } from "./player-controls";

const KIND_LABEL = { host: "End host", switch: "Switch", router: "Router" } as const;

/**
 * Computer A → Switch → Router → Computer B, using the OSI simulation's
 * fixed journey topology. Each device shows which TCP/IP layers it
 * participates in; the ones doing work at the current step light up.
 * No routing algorithm and no address assignment.
 */
export function NetworkPathLab({ level }: { level: DetailLevel }) {
  const player = useStepPlayer(PATH_STEPS.length);
  const step = player.stepIndex >= 0 ? PATH_STEPS[player.stepIndex]! : null;
  const [showAnswer, setShowAnswer] = useState(false);

  const nodes = PACKET_JOURNEY_NODES;

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="Network path">
        Follow data along Computer A → Switch → Router → Computer B and see which TCP/IP layers each device uses.
      </SectionHeading>

      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-start sm:gap-0">
        {nodes.map((node, i) => {
          const participates = PATH_PARTICIPATION[node.kind];
          const isActive = step?.node === i;
          const linkActive = step?.linkFrom === i;
          return (
            <div key={node.id} className="flex flex-1 flex-col items-stretch sm:flex-row sm:items-start">
              <div
                className={cn(
                  "flex-1 rounded-card border p-3 transition-colors",
                  isActive ? "border-subject-it bg-subject-it-soft/40 dark:bg-subject-it/10" : "border-line dark:border-line-dark",
                )}
              >
                <p className="text-sm font-medium text-ink dark:text-bone">{node.label}</p>
                <p className="mb-2 text-[11px] text-ink-soft dark:text-bone-soft">{KIND_LABEL[node.kind]}</p>
                <div className="flex flex-col gap-1">
                  {TCPIP_LAYERS.map((l) => {
                    const uses = participates.includes(l.id);
                    const working = isActive && step!.activeLayers.includes(l.id);
                    return (
                      <div
                        key={l.id}
                        className={cn(
                          "rounded-md border px-2 py-1 text-[11px] transition-all",
                          working ? "font-semibold text-white" : uses ? "text-ink dark:text-bone" : "border-dashed text-ink-soft/50 dark:text-bone-soft/50",
                          !working && "border-line dark:border-line-dark",
                        )}
                        style={working ? { backgroundColor: l.accent, borderColor: l.accent } : uses ? { boxShadow: `inset 4px 0 0 0 ${l.accent}` } : undefined}
                      >
                        {l.shortName}
                      </div>
                    );
                  })}
                </div>
              </div>

              {i < nodes.length - 1 && (
                <div className="flex items-center justify-center py-1 sm:w-16 sm:shrink-0 sm:py-0 sm:pt-10" aria-hidden>
                  <div className="flex flex-col items-center sm:w-full">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold transition-opacity",
                        linkActive ? "bg-subject-it text-paper opacity-100" : "opacity-0",
                      )}
                    >
                      {step?.pduName}
                    </span>
                    <span className={cn("text-lg sm:hidden", linkActive ? "text-subject-it" : "text-ink-soft dark:text-bone-soft")}>↓</span>
                    <span className={cn("hidden text-lg sm:block", linkActive ? "text-subject-it" : "text-ink-soft dark:text-bone-soft")}>→</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Panel title={step ? (step.node !== null ? `At: ${nodes[step.node]!.label}` : "In transit") : "Tip"}>
        <p className="text-sm leading-relaxed text-ink dark:text-bone" aria-live="polite">
          {step ? step.text : "Press Play or Step. Devices show every layer they take part in; the ones working right now light up."}
        </p>
        {step && step.node !== null && (
          <p className="mt-2 font-mono text-xs text-subject-it">Data unit: {step.pduName}</p>
        )}
      </Panel>

      <PlayerControls player={player} total={PATH_STEPS.length} />

      {level === "technical" && (
        <Panel title="Path reasoning">
          <p className="text-sm text-ink dark:text-bone">{PATH_REASONING.question}</p>
          <button
            onClick={() => setShowAnswer((s) => !s)}
            className="mt-3 rounded-full border border-subject-it bg-subject-it-soft px-3 py-1.5 text-xs font-medium text-subject-it dark:bg-subject-it/20"
          >
            {showAnswer ? "Hide answer" : "Show answer"}
          </button>
          {showAnswer && <p className="mt-3 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{PATH_REASONING.answer}</p>}
        </Panel>
      )}

      <Callout tone="neutral" title="Conceptual, not literal">
        {PATH_NOTE}
      </Callout>
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";
import { useStepPlayer } from "@/features/subjects/information-technology/osi-model-explorer/hooks/use-step-player";
import { Callout, Panel, SectionHeading } from "@/features/subjects/information-technology/osi-model-explorer/components/ui";
import { JOURNEY_NOTE, JOURNEY_STEPS, TCPIP_LAYERS, type JourneyStep } from "../model";
import { PlayerControls } from "./player-controls";

function Stack({ title, side, step }: { title: string; side: "client" | "server"; step: JourneyStep | null }) {
  const isHere = step?.where === side;
  return (
    <div className={cn("rounded-card border p-3 transition-colors", isHere ? "border-subject-it" : "border-line dark:border-line-dark")}>
      <p className="mb-2 text-center font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">{title}</p>
      <div className="flex flex-col gap-1.5">
        {TCPIP_LAYERS.map((l) => {
          const active = isHere && step?.layer === l.id;
          return (
            <div
              key={l.id}
              className={cn(
                "flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm transition-all",
                active ? "text-white shadow-md" : "border-line text-ink-soft opacity-70 dark:border-line-dark dark:text-bone-soft",
              )}
              style={active ? { backgroundColor: l.accent, borderColor: l.accent } : { boxShadow: `inset 4px 0 0 0 ${l.accent}` }}
            >
              <span className="font-medium">{l.shortName}</span>
              {active && <span className="font-mono text-[10px]">{step?.pduName}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Conceptual client → server → client journey. Steps are driven by the
 * shared `useStepPlayer`; the request moves down the client stack,
 * across the network, and up the server stack, then the response
 * reverses the trip. No real HTTP/DNS/TCP is performed.
 */
export function RequestResponseLab() {
  const player = useStepPlayer(JOURNEY_STEPS.length);
  const step = player.stepIndex >= 0 ? JOURNEY_STEPS[player.stepIndex]! : null;
  const isRequest = step?.direction === "request";
  const arrow = step ? (step.direction === "request" ? "Request →" : "← Response") : "Ready";

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="Request → response journey">
        A client asks a server for a web page. Watch the request travel down the client&apos;s TCP/IP stack, across the
        network, and up the server&apos;s stack — then the response makes the return trip.
      </SectionHeading>

      <div className="grid gap-3 sm:grid-cols-[1fr,auto,1fr] sm:items-stretch">
        <Stack title="Client" side="client" step={step} />

        <div
          className={cn(
            "flex flex-row items-center justify-center gap-2 rounded-card border px-3 py-3 text-center transition-colors sm:min-w-[120px] sm:flex-col",
            step?.where === "network" ? "border-subject-it bg-subject-it-soft dark:bg-subject-it/20" : "border-dashed border-line dark:border-line-dark",
          )}
        >
          <span className="font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Network</span>
          <span
            className={cn(
              "rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold",
              step ? (isRequest ? "bg-subject-it text-paper" : "bg-amber-500 text-white") : "bg-ink/10 text-ink-soft dark:bg-bone/10 dark:text-bone-soft",
            )}
          >
            {arrow}
          </span>
        </div>

        <Stack title="Server" side="server" step={step} />
      </div>

      <Panel title={step ? `${step.direction === "request" ? "Request" : "Response"} · ${step.where === "network" ? "Across the network" : step.where === "client" ? "Client" : "Server"}` : "Tip"}>
        <p className="text-sm leading-relaxed text-ink dark:text-bone" aria-live="polite">
          {step ? step.text : "Press Play (or Step) to send the request. Down the client's stack, across the network, up the server's stack — then back again."}
        </p>
      </Panel>

      <PlayerControls player={player} total={JOURNEY_STEPS.length} />

      <Callout tone="neutral" title="Educational simulation">
        {JOURNEY_NOTE}
      </Callout>
    </div>
  );
}

"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CACHE_DEMOS, CACHE_LEVELS, LOCALITY_NOTES, type ComponentId } from "../model";
import { useStepPlayer } from "../hooks/use-step-player";
import { SystemDiagram } from "./system-diagram";
import { PlaybackControls } from "./playback-controls";
import { ExplanationPanel } from "./explanation-panel";
import { InspectPanel } from "./inspect-panel";

type Demo = "cold" | "warm";

export function CacheMode() {
  const [demo, setDemo] = useState<Demo>("cold");
  const [inspected, setInspected] = useState<ComponentId | null>(null);
  const [showLocality, setShowLocality] = useState(false);

  const steps = CACHE_DEMOS[demo];
  const player = useStepPlayer(steps);
  const step = player.step;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-3 sm:grid-cols-3">
        {CACHE_LEVELS.map((level) => (
          <div key={level.id} className="rounded-card border border-line p-3 dark:border-line-dark">
            <p className="font-mono text-xs uppercase tracking-wide text-subject-it">{level.name}</p>
            <p className="mt-1 text-sm text-ink dark:text-bone">Size: {level.relativeSize}</p>
            <p className="text-sm text-ink dark:text-bone">Speed: {level.relativeSpeed}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Cache demo">
        <button
          role="tab"
          aria-selected={demo === "cold"}
          onClick={() => setDemo("cold")}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            demo === "cold"
              ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
              : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30"
          )}
        >
          First access (cache miss)
        </button>
        <button
          role="tab"
          aria-selected={demo === "warm"}
          onClick={() => setDemo("warm")}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            demo === "warm"
              ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
              : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30"
          )}
        >
          Repeated access (cache hit)
        </button>
      </div>

      <div className="rounded-card border border-line bg-paper p-2 dark:border-line-dark dark:bg-chalkboard sm:p-4">
        <SystemDiagram
          activeComponents={step?.activeComponents ?? []}
          from={step?.from}
          to={step?.to}
          packetLabel={step?.packetLabel}
          busSignal={step?.busSignal}
          stepKey={step?.id ?? "idle"}
          inspectedId={inspected}
          onInspect={setInspected}
        />
        <div className="mt-3">
          <ExplanationPanel
            activeLabel={step ? `Step ${player.stepIndex + 1} of ${steps.length}` : undefined}
            explanation={step?.explanation}
            idleText={demo === "cold" ? "Press Start to request data the cache has never seen before." : "Press Start to request the same data again, right after."}
          />
        </div>
      </div>

      <PlaybackControls player={player} />
      <InspectPanel id={inspected} />

      <div className="rounded-card border border-dashed border-line p-4 dark:border-line-dark">
        <button
          onClick={() => setShowLocality((s) => !s)}
          className="font-mono text-xs uppercase tracking-wide text-subject-it"
        >
          {showLocality ? "Hide" : "Show"} advanced: why caches work (locality)
        </button>
        {showLocality && (
          <div className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-ink dark:text-bone">
            <p>{LOCALITY_NOTES.temporal}</p>
            <p>{LOCALITY_NOTES.spatial}</p>
          </div>
        )}
      </div>
    </div>
  );
}

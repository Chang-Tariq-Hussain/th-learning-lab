"use client";

import type { ComponentProps, ReactNode } from "react";
import { Play, Pause, RotateCcw, StepForward } from "lucide-react";
import { SimulationLayout, type SimulationRunState } from "@/features/simulation";
import { cn } from "@/lib/utils";
import type { PlaySpeed, StepPlayer } from "../hooks/use-step-player";
import { SystemDiagram, SYSTEM_DIAGRAM_ASPECT } from "./system-diagram";
import { ExplanationPanel } from "./explanation-panel";

const SPEEDS: PlaySpeed[] = [0.5, 1, 1.5, 2];

const BTN =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium disabled:opacity-40";
const BTN_OUTLINE = "border border-line text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40";

/** Start / Step / Reset, sized to sit inside the sticky stage block. */
export function FlowPlaybackActions({ player }: { player: StepPlayer }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <button onClick={player.playPause} className={cn(BTN, "bg-subject-it text-paper hover:opacity-90")}>
        {player.isPlaying ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
        {player.playLabel}
      </button>
      <button onClick={player.stepForward} disabled={player.isFinished} className={cn(BTN, BTN_OUTLINE)}>
        <StepForward className="h-4 w-4" aria-hidden="true" />
        Step
      </button>
      <button onClick={player.reset} className={cn(BTN, BTN_OUTLINE)}>
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        Reset
      </button>
    </div>
  );
}

export function FlowSpeed({ player }: { player: StepPlayer }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-label text-ink-soft dark:text-bone-soft">Speed</span>
      <div className="flex items-center gap-1 rounded-full border border-line p-1 dark:border-line-dark" role="group" aria-label="Playback speed">
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => player.setSpeed(s)}
            aria-pressed={player.speed === s}
            className={cn(
              "min-h-11 min-w-11 rounded-full px-3 text-sm font-medium transition-colors",
              player.speed === s ? "bg-subject-it text-paper" : "text-ink-soft hover:bg-ink/5 dark:text-bone-soft dark:hover:bg-bone/10"
            )}
          >
            {s}×
          </button>
        ))}
      </div>
    </div>
  );
}

type DiagramProps = ComponentProps<typeof SystemDiagram>;

interface FlowLayoutProps {
  diagram: DiagramProps;
  stageLabel: string;
  runState: SimulationRunState;
  statusDetail?: string;
  actions: ReactNode;
  explanation: { activeLabel?: string; text?: string; idleText: string };
  controls?: ReactNode;
  below?: ReactNode;
}

/** One SimulationLayout for every diagram-plus-playback mode of the data-flow simulation. */
export function FlowLayout({ diagram, stageLabel, runState, statusDetail, actions, explanation, controls, below }: FlowLayoutProps) {
  return (
    <SimulationLayout
      stageLabel={stageLabel}
      stage={<SystemDiagram {...diagram} />}
      aspect={SYSTEM_DIAGRAM_ASPECT}
      stageCap="56rem"
      className="lg:[grid-template-columns:minmax(0,1.7fr)_minmax(0,1fr)]"
      runState={runState}
      statusDetail={statusDetail}
      actions={actions}
      controls={controls}
      explanation={
        <div className="flex flex-col gap-4">
          <ExplanationPanel activeLabel={explanation.activeLabel} explanation={explanation.text} idleText={explanation.idleText} />
          {below}
        </div>
      }
    />
  );
}

export function runStateOf(player: StepPlayer): SimulationRunState {
  if (player.stepIndex === -1) return "idle";
  if (player.isFinished && !player.isPlaying) return "finished";
  return player.isPlaying ? "running" : "paused";
}

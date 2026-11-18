"use client";

import type { BeatClock } from "../../meiosis/hooks/use-beat-timeline";
import { useClockPos } from "../../meiosis/hooks/use-beat-timeline";
import { BEAT_STAGE, STAGES, STAGE_FIRST_BEAT } from "../model";
import { CitricScene, EtcScene, GlycolysisScene, PyruvateScene, SynthaseScene, SH, SW } from "./scenes";
import { CellLayer, MitoLayer, type Tracer } from "./world";

export type Level = "cell" | "mito" | "molecular";

export interface RespirationStageProps {
  clock: BeatClock;
  level: Level;
  reduced: boolean;
  showLabels: boolean;
  tracer: Tracer;
  onLevel: (l: Level) => void;
  onStage: (s: number) => void;
  node: string | null;
  onNode: (id: string) => void;
  perGlucose: boolean;
  live: boolean;
  chemi: { rot: number; gradient: number; atp: number; flow: number };
}

function Molecular({ clock, showLabels, node, onNode, perGlucose, live, chemi }: Pick<RespirationStageProps, "clock" | "showLabels" | "node" | "onNode" | "perGlucose" | "live" | "chemi">) {
  const pos = useClockPos(clock);
  const beat = Math.round(pos);
  const stage = BEAT_STAGE[Math.min(beat, BEAT_STAGE.length - 1)]!;
  const lp = pos - STAGE_FIRST_BEAT[stage]!;
  if (stage === 0) return <GlycolysisScene lp={lp} showLabels={showLabels} />;
  if (stage === 1) return <PyruvateScene lp={lp} showLabels={showLabels} />;
  if (stage === 2) return <CitricScene lp={lp} showLabels={showLabels} selected={node} onSelect={onNode} perGlucose={perGlucose} />;
  if (stage === 3) return <EtcScene lp={lp} showLabels={showLabels} />;
  return <SynthaseScene lp={lp} showLabels={showLabels} live={live} rot={chemi.rot} gradient={chemi.gradient} atp={chemi.atp} flow={chemi.flow} />;
}

/**
 * The respiration laboratory: three nested views of one drawing — whole cell, mitochondrion and molecular level —
 * that zoom into one another with a CSS transform + fade (no transition under reduced motion). Each stage badge on
 * the mitochondrion jumps to the molecular scene for that stage.
 */
export function RespirationStage(p: RespirationStageProps) {
  const pos = useClockPos(p.clock);
  const stage = BEAT_STAGE[Math.min(Math.round(pos), BEAT_STAGE.length - 1)]!;
  const loc = STAGES[stage]!.location;
  const wrap = (active: boolean, hiddenScale: number) => ({
    transform: `scale(${active ? 1 : hiddenScale})`,
    transformOrigin: `${SW / 2}px ${SH / 2}px`,
    opacity: active ? 1 : 0,
    visibility: (active ? "visible" : "hidden") as "visible" | "hidden",
    pointerEvents: (active ? "auto" : "none") as "auto" | "none",
    transition: p.reduced ? "none" : `transform .7s ease, opacity .7s ease, visibility 0s linear ${active ? 0 : 0.7}s`,
  });
  return (
    <svg viewBox={`0 0 ${SW} ${SH}`} className="h-full w-full" role="group" aria-label={`Cellular respiration laboratory, ${p.level} view. ${STAGES[stage]!.name} takes place in the ${STAGES[stage]!.locationLabel}.`} data-testid="respiration-svg" data-level={p.level}>
      <g style={wrap(p.level === "cell", 3)} aria-hidden={p.level !== "cell"}>
        <CellLayer loc={loc} tracer={p.tracer} showLabels={p.showLabels} onZoom={() => p.onLevel("mito")} />
      </g>
      <g style={wrap(p.level === "mito", p.level === "cell" ? 0.3 : 2.6)} aria-hidden={p.level !== "mito"}>
        <MitoLayer stage={stage} tracer={p.tracer} showLabels={p.showLabels} onStage={(s) => (p.onStage(s), p.onLevel("molecular"))} />
      </g>
      <g style={wrap(p.level === "molecular", 0.35)} aria-hidden={p.level !== "molecular"}>
        <Molecular clock={p.clock} showLabels={p.showLabels} node={p.node} onNode={p.onNode} perGlucose={p.perGlucose} live={p.live} chemi={p.chemi} />
      </g>
    </svg>
  );
}

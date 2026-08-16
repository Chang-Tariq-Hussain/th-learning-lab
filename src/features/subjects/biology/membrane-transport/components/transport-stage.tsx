import { MembraneBand } from "./membrane-band";
import { ParticleDot } from "./particle-dot";
import type { Mode, Particle, Phase } from "../types";
import { TRANSITION_MS } from "../model";

export interface TransportStageProps {
  mode: Mode;
  phase: Phase;
  diffusionParticles: Particle[];
  waterParticles: Particle[];
  soluteParticles: Particle[];
  waterLevels: { low: number; high: number };
}

const leftLabel: Record<Mode, string> = {
  diffusion: "High Concentration",
  osmosis: "Low Solute",
};
const rightLabel: Record<Mode, string> = {
  diffusion: "Low Concentration",
  osmosis: "High Solute",
};

export function TransportStage({
  mode,
  phase,
  diffusionParticles,
  waterParticles,
  soluteParticles,
  waterLevels,
}: TransportStageProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full items-center justify-between px-2 text-xs font-medium text-ink-soft dark:text-bone-soft sm:text-sm">
        <span>Outside Cell · {leftLabel[mode]}</span>
        <span>Inside Cell · {rightLabel[mode]}</span>
      </div>

      <div className="relative h-[260px] w-full overflow-hidden rounded-[1.75rem] border border-line bg-white/70 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04] sm:h-[300px]">
        {mode === "osmosis" ? (
          <>
            <div
              className="absolute bottom-0 left-0 w-[44%] rounded-tr-sm bg-sky-200/50 dark:bg-sky-400/15"
              style={{ height: `${waterLevels.low}%`, transition: `height ${TRANSITION_MS}ms ease-in-out` }}
            />
            <div
              className="absolute bottom-0 right-0 w-[44%] rounded-tl-sm bg-sky-200/50 dark:bg-sky-400/15"
              style={{ height: `${waterLevels.high}%`, transition: `height ${TRANSITION_MS}ms ease-in-out` }}
            />
          </>
        ) : null}

        <div className="absolute left-1/2 top-0 h-full w-10 -translate-x-1/2">
          <MembraneBand vertical className="h-full w-full" />
        </div>

        {mode === "diffusion"
          ? diffusionParticles.map((particle) => (
              <ParticleDot key={particle.id} xPercent={particle.xPercent} yPercent={particle.yPercent} colorClassName="bg-sky-600" title="Particle" />
            ))
          : null}

        {mode === "osmosis" ? (
          <>
            {soluteParticles.map((particle) => (
              <ParticleDot
                key={particle.id}
                xPercent={particle.xPercent}
                yPercent={particle.yPercent}
                colorClassName="bg-amber-500"
                sizeClassName="h-3.5 w-3.5"
                title="Solute"
              />
            ))}
            {waterParticles.map((particle) => (
              <ParticleDot key={particle.id} xPercent={particle.xPercent} yPercent={particle.yPercent} colorClassName="bg-sky-500" title="Water" />
            ))}
          </>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 px-2 text-xs text-ink-soft dark:text-bone-soft">
        {mode === "diffusion" ? (
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-600" /> Particle
          </span>
        ) : (
          <>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-sky-500" /> Water
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Solute
            </span>
          </>
        )}
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-1.5 rounded-full bg-subject-biology" /> Cell Membrane
        </span>
      </div>
    </div>
  );
}

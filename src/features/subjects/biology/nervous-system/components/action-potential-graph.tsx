"use client";

import { membranePotentialAt } from "../nervous-model";
import type { PotentialPhaseInfo } from "../types";

interface ActionPotentialGraphProps {
  progress: number;
  phase: PotentialPhaseInfo;
  running: boolean;
}

const W = 320;
const H = 170;
const PAD_L = 34;
const PAD_R = 12;
const PAD_T = 12;
const PAD_B = 24;
const MV_MIN = -90;
const MV_MAX = 45;

function xFor(t: number): number {
  return PAD_L + t * (W - PAD_L - PAD_R);
}
function yFor(mv: number): number {
  const t = (mv - MV_MIN) / (MV_MAX - MV_MIN);
  return H - PAD_B - t * (H - PAD_T - PAD_B);
}

const SAMPLES = 80;
const CURVE_PATH = Array.from({ length: SAMPLES + 1 }, (_, i) => {
  const t = i / SAMPLES;
  const mv = membranePotentialAt(t);
  return `${i === 0 ? "M" : "L"} ${xFor(t).toFixed(1)} ${yFor(mv).toFixed(1)}`;
}).join(" ");

export function ActionPotentialGraph({ progress, phase, running }: ActionPotentialGraphProps) {
  const currentMv = membranePotentialAt(progress);
  const px = xFor(progress);
  const py = yFor(currentMv);
  const ionFlow = phase.ionFlow;

  return (
    <div className="mx-auto mt-3 w-full max-w-md">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-40 w-full"
        role="img"
        aria-label="A graph of membrane potential over time during an action potential, with a moving playhead"
      >
        {/* Gridlines: resting (-70mV) and 0mV */}
        <line x1={PAD_L} x2={W - PAD_R} y1={yFor(-70)} y2={yFor(-70)} className="stroke-ink/10 dark:stroke-bone/10" strokeWidth={1} strokeDasharray="3 3" />
        <line x1={PAD_L} x2={W - PAD_R} y1={yFor(0)} y2={yFor(0)} className="stroke-ink/10 dark:stroke-bone/10" strokeWidth={1} strokeDasharray="3 3" />
        <text x={PAD_L - 4} y={yFor(-70) + 3} textAnchor="end" className="fill-ink/50 dark:fill-bone/50 font-mono text-[7px]">
          −70
        </text>
        <text x={PAD_L - 4} y={yFor(0) + 3} textAnchor="end" className="fill-ink/50 dark:fill-bone/50 font-mono text-[7px]">
          0
        </text>

        {/* Axes */}
        <line x1={PAD_L} x2={PAD_L} y1={PAD_T} y2={H - PAD_B} className="stroke-ink/25 dark:stroke-bone/25" strokeWidth={1} />
        <line x1={PAD_L} x2={W - PAD_R} y1={H - PAD_B} y2={H - PAD_B} className="stroke-ink/25 dark:stroke-bone/25" strokeWidth={1} />
        <text x={PAD_L - 26} y={PAD_T + 4} className="fill-ink/50 dark:fill-bone/50 font-mono text-[7px] uppercase tracking-wide">
          mV
        </text>
        <text x={W - PAD_R} y={H - PAD_B + 14} textAnchor="end" className="fill-ink/50 dark:fill-bone/50 font-mono text-[7px] uppercase tracking-wide">
          Time
        </text>

        {/* Curve */}
        <path d={CURVE_PATH} fill="none" className="stroke-subject-biology" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" />

        {/* Playhead */}
        {running || progress > 0 ? (
          <>
            <line x1={px} x2={px} y1={PAD_T} y2={H - PAD_B} className="stroke-amber-500/60 dark:stroke-amber-300/50" strokeWidth={1} strokeDasharray="2 2" />
            <circle cx={px} cy={py} r={4.5} className="fill-amber-500 stroke-amber-700 dark:fill-amber-300 dark:stroke-amber-600" strokeWidth={1.25} />
          </>
        ) : null}
      </svg>

      {/* Ion channel inset */}
      <div className="mt-2 flex items-center justify-center gap-3 rounded-lg border border-line bg-white/50 px-3 py-2 dark:border-line-dark dark:bg-white/[0.03]">
        <svg viewBox="0 0 90 40" className="h-9 w-24" role="img" aria-label="Ion channels in the neuron membrane">
          <rect x={0} y={16} width={90} height={8} className="fill-ink/15 dark:fill-bone/15" />
          <rect x={22} y={8} width={10} height={24} rx={3} className="fill-white stroke-ink/40 dark:fill-chalkboard dark:stroke-bone/40" strokeWidth={1.25} />
          <rect x={58} y={8} width={10} height={24} rx={3} className="fill-white stroke-ink/40 dark:fill-chalkboard dark:stroke-bone/40" strokeWidth={1.25} />
          {ionFlow === "na-in" ? (
            <>
              <circle cx={27} cy={4} r={3} className="fill-sky-500 dark:fill-sky-400" />
              <path d="M 27 8 L 27 30" className="stroke-sky-500 dark:stroke-sky-400" strokeWidth={1.5} markerEnd="url(#ns-arrow-blue)" />
            </>
          ) : null}
          {ionFlow === "k-out" ? (
            <>
              <circle cx={63} cy={36} r={3} className="fill-rose-500 dark:fill-rose-400" />
              <path d="M 63 30 L 63 8" className="stroke-rose-500 dark:stroke-rose-400" strokeWidth={1.5} markerEnd="url(#ns-arrow-rose)" />
            </>
          ) : null}
          <defs>
            <marker id="ns-arrow-blue" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" className="fill-sky-500 dark:fill-sky-400" />
            </marker>
            <marker id="ns-arrow-rose" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" className="fill-rose-500 dark:fill-rose-400" />
            </marker>
          </defs>
        </svg>
        <p className="text-[11px] leading-tight text-ink-soft dark:text-bone-soft">
          {ionFlow === "na-in"
            ? "Na⁺ flows in"
            : ionFlow === "k-out"
              ? "K⁺ flows out"
              : "Channels closed"}
        </p>
      </div>
    </div>
  );
}

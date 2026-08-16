"use client";

import type { SynapseStepId } from "../types";

interface SynapseSceneProps {
  step: SynapseStepId;
}

const STEP_INDEX: Record<SynapseStepId, number> = {
  arrival: 0,
  release: 1,
  binding: 2,
  signal: 3,
  reuptake: 4,
};

const GAP_LEFT = 150;
const GAP_RIGHT = 190;
const VESICLE_Y = [70, 92, 114];

export function SynapseScene({ step }: SynapseSceneProps) {
  const idx = STEP_INDEX[step];
  const showAxonGlow = idx === 0;
  const showRelease = idx === 1;
  const showDiffusing = idx === 1 || idx === 2;
  const showBound = idx >= 2;
  const showSignal = idx === 3;
  const showReuptake = idx === 4;

  return (
    <svg
      viewBox="0 0 340 200"
      className="h-full w-full"
      role="img"
      aria-label="A diagram of a synapse, showing neurotransmitter release, binding, and reuptake between two neurons"
    >
      <defs>
        <linearGradient id="ns-terminal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9FD8CE" />
          <stop offset="100%" stopColor="#0D9488" />
        </linearGradient>
      </defs>

      {/* Presynaptic terminal (sending neuron) */}
      <path
        d={`M 20 60 L ${GAP_LEFT - 6} 40 C ${GAP_LEFT + 10} 40, ${GAP_LEFT + 18} 60, ${GAP_LEFT + 4} 90 C ${GAP_LEFT + 18} 118, ${GAP_LEFT + 10} 140, ${GAP_LEFT - 6} 140 L 20 120 Z`}
        fill="url(#ns-terminal)"
        className={`stroke-subject-biology/70 dark:stroke-subject-biology/60 transition-opacity duration-300 ${showAxonGlow ? "opacity-100" : "opacity-90"}`}
        strokeWidth={2}
      />
      <text x={60} y={30} className="fill-ink/60 dark:fill-bone/60 font-mono text-[8px] uppercase tracking-wide">
        Presynaptic neuron
      </text>

      {/* Vesicles */}
      {VESICLE_Y.map((y, i) => {
        const released = showRelease && i === 0;
        return (
          <circle
            key={i}
            cx={released ? GAP_LEFT + 20 : 110 + i * 6}
            cy={released ? y + 8 : y}
            r={5}
            className={`fill-amber-400 stroke-amber-600 dark:fill-amber-300 dark:stroke-amber-500 transition-all duration-500 ${
              idx > 1 && i === 0 ? "opacity-0" : "opacity-100"
            }`}
            strokeWidth={1.25}
          />
        );
      })}

      {/* Synaptic gap */}
      <rect x={GAP_LEFT} y={40} width={GAP_RIGHT - GAP_LEFT} height={100} className="fill-ink/[0.03] dark:fill-bone/[0.04]" />
      <text x={(GAP_LEFT + GAP_RIGHT) / 2} y={30} textAnchor="middle" className="fill-ink/60 dark:fill-bone/60 font-mono text-[8px] uppercase tracking-wide">
        Synaptic gap
      </text>

      {/* Diffusing neurotransmitter dots */}
      {showDiffusing
        ? [0, 1, 2].map((i) => (
            <circle
              key={i}
              cx={showBound ? GAP_RIGHT + 4 : GAP_LEFT + 20 + i * 10}
              cy={78 + i * 12}
              r={3.5}
              className="fill-rose-400 stroke-rose-600 dark:fill-rose-300 dark:stroke-rose-500 transition-all duration-500"
              strokeWidth={1}
            />
          ))
        : null}

      {/* Postsynaptic neuron (receiving) */}
      <path
        d={`M ${GAP_RIGHT + 10} 40 C ${GAP_RIGHT - 4} 40, ${GAP_RIGHT - 12} 60, ${GAP_RIGHT + 2} 90 C ${GAP_RIGHT - 12} 118, ${GAP_RIGHT - 4} 140, ${GAP_RIGHT + 10} 140 L 320 120 L 320 60 Z`}
        className={`fill-subject-biology-soft stroke-subject-biology/60 dark:fill-subject-biology/15 dark:stroke-subject-biology/45 transition-all duration-300 ${
          showSignal ? "opacity-100" : "opacity-90"
        }`}
        strokeWidth={2}
      />
      <text x={250} y={30} className="fill-ink/60 dark:fill-bone/60 font-mono text-[8px] uppercase tracking-wide">
        Postsynaptic neuron
      </text>

      {/* Receptors */}
      {[70, 90, 110].map((y, i) => (
        <rect
          key={i}
          x={GAP_RIGHT - 3}
          y={y - 4}
          width={8}
          height={8}
          rx={2}
          className={`stroke-ink/40 dark:stroke-bone/40 transition-colors duration-300 ${
            showBound && i === 0 ? "fill-rose-400 dark:fill-rose-300" : "fill-white dark:fill-chalkboard"
          }`}
          strokeWidth={1}
        />
      ))}

      {/* New signal pulse on postsynaptic membrane */}
      {showSignal ? (
        <path
          d="M 200 90 L 340 90"
          className="stroke-pine-500 dark:stroke-pine-300"
          strokeWidth={2.5}
          strokeDasharray="4 4"
          strokeLinecap="round"
        />
      ) : null}

      {/* Reuptake arrow */}
      {showReuptake ? (
        <path
          d={`M ${GAP_RIGHT - 4} 78 C ${GAP_LEFT + 30} 65, ${GAP_LEFT + 25} 60, ${GAP_LEFT + 15} 55`}
          fill="none"
          className="stroke-amber-500 dark:stroke-amber-300"
          strokeWidth={1.5}
          strokeDasharray="3 3"
          markerEnd="url(#ns-reuptake-arrow)"
        />
      ) : null}
      <defs>
        <marker id="ns-reuptake-arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" className="fill-amber-500 dark:fill-amber-300" />
        </marker>
      </defs>
    </svg>
  );
}

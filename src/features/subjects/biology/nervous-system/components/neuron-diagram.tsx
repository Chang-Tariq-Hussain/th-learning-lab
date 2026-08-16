"use client";

import type { NeuronPartId } from "../types";

interface NeuronDiagramProps {
  highlight: NeuronPartId | null;
}

function opacityFor(id: NeuronPartId, highlight: NeuronPartId | null): number {
  if (!highlight) return 1;
  return highlight === id ? 1 : 0.25;
}

const MYELIN_SEGMENTS = [
  { x: 130 },
  { x: 168 },
  { x: 206 },
  { x: 244 },
];
const SEGMENT_WIDTH = 26;
const NODE_GAP = 6;

export function NeuronDiagram({ highlight }: NeuronDiagramProps) {
  return (
    <svg
      viewBox="0 0 400 200"
      className="h-full w-full"
      role="img"
      aria-label="A labeled diagram of a neuron, showing dendrites, cell body, nucleus, axon with myelin sheath and nodes of Ranvier, and axon terminals"
    >
      <defs>
        <radialGradient id="ns-soma" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#EAF2EF" />
          <stop offset="100%" stopColor="#7AA99A" />
        </radialGradient>
        <linearGradient id="ns-myelin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DFF5F2" />
          <stop offset="100%" stopColor="#9FD8CE" />
        </linearGradient>
      </defs>

      {/* Dendrites */}
      <g opacity={opacityFor("dendrites", highlight)} className="transition-opacity duration-300">
        {[
          "M 62 100 C 40 88, 24 78, 12 66",
          "M 62 100 C 38 96, 20 92, 6 90",
          "M 62 100 C 40 110, 24 118, 10 128",
          "M 70 84 C 56 66, 48 52, 40 36",
          "M 78 84 C 74 62, 74 48, 76 30",
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            className="stroke-subject-biology/70 dark:stroke-subject-biology/60"
            strokeWidth={3}
            strokeLinecap="round"
          />
        ))}
        <text x={35} y={20} textAnchor="middle" className="fill-ink/60 dark:fill-bone/60 font-mono text-[9px] uppercase tracking-wide">
          Dendrites
        </text>
      </g>

      {/* Cell body (soma) */}
      <g opacity={opacityFor("cell-body", highlight)} className="transition-opacity duration-300">
        <circle cx={90} cy={100} r={34} fill="url(#ns-soma)" className="stroke-subject-biology dark:stroke-subject-biology/80" strokeWidth={2} />
        <text x={90} y={148} textAnchor="middle" className="fill-ink/60 dark:fill-bone/60 font-mono text-[9px] uppercase tracking-wide">
          Cell Body
        </text>
      </g>

      {/* Nucleus */}
      <g opacity={opacityFor("nucleus", highlight)} className="transition-opacity duration-300">
        <circle cx={88} cy={98} r={13} className="fill-pine-700 stroke-pine-900 dark:fill-pine-500 dark:stroke-pine-700" strokeWidth={1.5} />
      </g>

      {/* Axon (base line) */}
      <g opacity={opacityFor("axon", highlight)} className="transition-opacity duration-300">
        <line x1={118} y1={100} x2={320} y2={100} className="stroke-ink/30 dark:stroke-bone/30" strokeWidth={5} strokeLinecap="round" />
        <text x={200} y={82} textAnchor="middle" className="fill-ink/60 dark:fill-bone/60 font-mono text-[9px] uppercase tracking-wide">
          Axon
        </text>
      </g>

      {/* Myelin sheath segments */}
      <g opacity={opacityFor("myelin-sheath", highlight)} className="transition-opacity duration-300">
        {MYELIN_SEGMENTS.map((seg, i) => (
          <rect
            key={i}
            x={seg.x}
            y={88}
            width={SEGMENT_WIDTH}
            height={24}
            rx={11}
            fill="url(#ns-myelin)"
            className="stroke-subject-biology/60 dark:stroke-subject-biology/50"
            strokeWidth={1.5}
          />
        ))}
        <text x={200} y={132} textAnchor="middle" className="fill-ink/60 dark:fill-bone/60 font-mono text-[9px] uppercase tracking-wide">
          Myelin Sheath
        </text>
      </g>

      {/* Nodes of Ranvier (gaps between myelin segments) */}
      <g opacity={opacityFor("node-of-ranvier", highlight)} className="transition-opacity duration-300">
        {MYELIN_SEGMENTS.slice(0, -1).map((seg, i) => {
          const gapX = seg.x + SEGMENT_WIDTH + NODE_GAP / 2;
          return (
            <circle
              key={i}
              cx={gapX}
              cy={100}
              r={4}
              className="fill-amber-400 stroke-amber-600 dark:fill-amber-300 dark:stroke-amber-500"
              strokeWidth={1.25}
            />
          );
        })}
        <text x={200} y={68} textAnchor="middle" className="fill-ink/60 dark:fill-bone/60 font-mono text-[8px] uppercase tracking-wide">
          Nodes of Ranvier
        </text>
      </g>

      {/* Axon terminals */}
      <g opacity={opacityFor("axon-terminals", highlight)} className="transition-opacity duration-300">
        {[
          "M 320 100 C 340 90, 356 82, 372 74",
          "M 320 100 C 344 100, 360 100, 378 100",
          "M 320 100 C 340 110, 356 118, 372 128",
        ].map((d, i) => (
          <path key={i} d={d} fill="none" className="stroke-subject-biology/70 dark:stroke-subject-biology/60" strokeWidth={3} strokeLinecap="round" />
        ))}
        {[
          { x: 374, y: 72 },
          { x: 380, y: 100 },
          { x: 374, y: 130 },
        ].map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={5} className="fill-subject-biology stroke-subject-biology/80 dark:fill-subject-biology/80" strokeWidth={1} />
        ))}
        <text x={350} y={20} textAnchor="middle" className="fill-ink/60 dark:fill-bone/60 font-mono text-[8px] uppercase tracking-wide">
          Axon Terminals
        </text>
      </g>
    </svg>
  );
}

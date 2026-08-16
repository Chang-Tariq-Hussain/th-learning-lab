"use client";

import { motion } from "framer-motion";
import {
  EQUILIBRIUM_Y,
  PARTICLE_COUNT,
  REFERENCE_PARTICLE_INDEX,
  VIEW_HEIGHT,
  VIEW_WIDTH,
  buildWavePath,
  particlePositions,
  waveY,
} from "../wave-model";

interface WaveSceneProps {
  phase: number;
}

export function WaveScene({ phase }: WaveSceneProps) {
  const particles = particlePositions(PARTICLE_COUNT);
  const refX = particles[REFERENCE_PARTICLE_INDEX];
  const refY = refX !== undefined ? EQUILIBRIUM_Y - waveY(refX, phase) : EQUILIBRIUM_Y;

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      className="h-full w-full text-subject-physics"
      role="img"
      aria-label="An animated transverse wave with a highlighted reference particle"
    >
      <defs>
        <linearGradient id="fp-glow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="currentColor" stopOpacity={0.12} />
          <stop offset="50%" stopColor="currentColor" stopOpacity={0.5} />
          <stop offset="100%" stopColor="currentColor" stopOpacity={0.12} />
        </linearGradient>
      </defs>

      {/* Equilibrium line */}
      <line
        x1={0}
        y1={EQUILIBRIUM_Y}
        x2={VIEW_WIDTH}
        y2={EQUILIBRIUM_Y}
        strokeWidth={1.5}
        strokeDasharray="10 8"
        className="stroke-ink/15 dark:stroke-bone/15"
      />

      {/* Soft glow + wave curve */}
      <path d={buildWavePath(phase)} fill="none" stroke="url(#fp-glow)" strokeWidth={14} opacity={0.5} />
      <path d={buildWavePath(phase)} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />

      {/* Vertical guide + trail for the reference particle */}
      {refX !== undefined ? (
        <line
          x1={refX}
          y1={EQUILIBRIUM_Y - 46}
          x2={refX}
          y2={EQUILIBRIUM_Y + 46}
          strokeWidth={1}
          strokeDasharray="3 4"
          className="stroke-amber-500/40"
        />
      ) : null}

      {/* Particles */}
      {particles.map((x, i) => {
        const y = EQUILIBRIUM_Y - waveY(x, phase);
        const isReference = i === REFERENCE_PARTICLE_INDEX;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={isReference ? 8 : 4.5}
            className={isReference ? "fill-amber-500" : "fill-ink/70 dark:fill-bone/70"}
          />
        );
      })}

      {refX !== undefined ? (
        <motion.g animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <text
            x={refX}
            y={refY - 18}
            textAnchor="middle"
            className="fill-amber-600 dark:fill-amber-400 font-mono text-[10px] font-semibold uppercase tracking-wide"
          >
            Watch this particle
          </text>
        </motion.g>
      ) : null}
    </svg>
  );
}

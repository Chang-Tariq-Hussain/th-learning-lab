"use client";

import { motion } from "framer-motion";
import {
  AMPLITUDE_PX,
  EQUILIBRIUM_Y,
  PARTICLE_COUNT,
  REFERENCE_PARTICLE_INDEX,
  VIEW_HEIGHT,
  VIEW_WIDTH,
  buildWavePath,
  nearestCrestX,
  particlePositions,
  wavelengthPx,
  waveY,
} from "../wave-model";

interface WaveSceneProps {
  phase: number;
  wavelength: number;
}

const CREST_ANCHOR = 170;

export function WaveScene({ phase, wavelength }: WaveSceneProps) {
  const particles = particlePositions(PARTICLE_COUNT);
  const refX = particles[REFERENCE_PARTICLE_INDEX];
  const refY = refX !== undefined ? EQUILIBRIUM_Y - waveY(refX, phase, wavelength) : EQUILIBRIUM_Y;

  const crest1 = nearestCrestX(phase, wavelength, CREST_ANCHOR);
  const crest2 = crest1 + wavelengthPx(wavelength);
  const crestY = EQUILIBRIUM_Y - AMPLITUDE_PX;
  const bracketY = crestY - 22;

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      className="h-full w-full text-subject-physics"
      role="img"
      aria-label="An animated transverse wave with wavelength marked between two crests"
    >
      <defs>
        <linearGradient id="ws-glow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="currentColor" stopOpacity={0.12} />
          <stop offset="50%" stopColor="currentColor" stopOpacity={0.5} />
          <stop offset="100%" stopColor="currentColor" stopOpacity={0.12} />
        </linearGradient>
      </defs>

      {/* Wave-direction indicator */}
      <g opacity={0.85}>
        <text
          x={VIEW_WIDTH - 16}
          y={22}
          textAnchor="end"
          className="fill-ink-soft dark:fill-bone-soft font-mono text-[11px] uppercase tracking-wide"
        >
          Wave direction
        </text>
        {[0, 1, 2].map((i) => (
          <motion.path
            key={i}
            d={`M${VIEW_WIDTH - 70 + i * 16} 8 l10 8 l-10 8`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ opacity: [0.15, 1, 0.15] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
          />
        ))}
      </g>

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
      <path d={buildWavePath(phase, wavelength)} fill="none" stroke="url(#ws-glow)" strokeWidth={14} opacity={0.5} />
      <path d={buildWavePath(phase, wavelength)} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />

      {/* Wavelength measurement bracket between two consecutive crests */}
      <g className="text-amber-500">
        <line x1={crest1} y1={bracketY} x2={crest2} y2={bracketY} strokeWidth={1.5} stroke="currentColor" />
        <line x1={crest1} y1={bracketY - 6} x2={crest1} y2={bracketY + 6} strokeWidth={1.5} stroke="currentColor" />
        <line x1={crest2} y1={bracketY - 6} x2={crest2} y2={bracketY + 6} strokeWidth={1.5} stroke="currentColor" />
        <text
          x={(crest1 + crest2) / 2}
          y={bracketY - 10}
          textAnchor="middle"
          className="fill-amber-600 dark:fill-amber-400 font-mono text-[11px] font-semibold"
        >
          λ = {wavelength} m
        </text>
        <circle cx={crest1} cy={crestY} r={3.5} fill="currentColor" />
        <circle cx={crest2} cy={crestY} r={3.5} fill="currentColor" />
      </g>

      {/* Particles */}
      {particles.map((x, i) => {
        const y = EQUILIBRIUM_Y - waveY(x, phase, wavelength);
        const isReference = i === REFERENCE_PARTICLE_INDEX;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={isReference ? 7 : 4}
            className={isReference ? "fill-pine-500 dark:fill-pine-300" : "fill-ink/70 dark:fill-bone/70"}
          />
        );
      })}

      {refX !== undefined ? (
        <text
          x={refX}
          y={refY - 16}
          textAnchor="middle"
          className="fill-pine-600 dark:fill-pine-300 font-mono text-[10px] font-semibold uppercase tracking-wide"
        >
          Reference particle
        </text>
      ) : null}
    </svg>
  );
}

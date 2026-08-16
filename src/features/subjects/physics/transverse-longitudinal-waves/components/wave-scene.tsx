"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  EQUILIBRIUM_Y,
  LONGITUDINAL_DISPLACEMENT_PX,
  LONGITUDINAL_PARTICLE_COUNT,
  TRANSVERSE_AMPLITUDE_PX,
  TRANSVERSE_PARTICLE_COUNT,
  VIEW_HEIGHT,
  VIEW_WIDTH,
  buildTransversePath,
  longitudinalOffset,
  nearestCompressionX,
  nearestRarefactionX,
  particlePositions,
  transverseOffset,
  type WaveMode,
} from "../wave-model";

interface WaveSceneProps {
  mode: WaveMode;
  phase: number;
  showParticlePaths: boolean;
  watchedIndex: number | null;
}

const BAND_WIDTH = 46;

export function WaveScene({ mode, phase, showParticlePaths, watchedIndex }: WaveSceneProps) {
  const isTransverse = mode === "transverse";
  const particles = particlePositions(isTransverse ? TRANSVERSE_PARTICLE_COUNT : LONGITUDINAL_PARTICLE_COUNT);

  const compressionX = !isTransverse ? nearestCompressionX(phase) : null;
  const rarefactionX = !isTransverse ? nearestRarefactionX(phase) : null;

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      className="h-full w-full text-subject-physics"
      role="img"
      aria-label={isTransverse ? "An animated transverse wave" : "An animated longitudinal wave"}
    >
      <defs>
        <linearGradient id="tlw-glow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="currentColor" stopOpacity={0.12} />
          <stop offset="50%" stopColor="currentColor" stopOpacity={0.5} />
          <stop offset="100%" stopColor="currentColor" stopOpacity={0.12} />
        </linearGradient>
      </defs>

      {/* Wave-direction indicator */}
      <g opacity={0.85}>
        <text
          x={VIEW_WIDTH - 16}
          y={24}
          textAnchor="end"
          className="fill-ink-soft dark:fill-bone-soft font-mono text-[11px] uppercase tracking-wide"
        >
          Wave travels
        </text>
        {[0, 1, 2].map((i) => (
          <motion.path
            key={i}
            d={`M${VIEW_WIDTH - 70 + i * 16} 10 l10 8 l-10 8`}
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

      {isTransverse ? (
        <>
          {/* Equilibrium line */}
          <line
            x1={0}
            y1={EQUILIBRIUM_Y}
            x2={VIEW_WIDTH}
            y2={EQUILIBRIUM_Y}
            strokeWidth={1.5}
            strokeDasharray="10 8"
            className="stroke-ink/20 dark:stroke-bone/20"
          />

          {/* Soft glow + wave curve */}
          <path
            d={buildTransversePath(phase)}
            fill="none"
            stroke="url(#tlw-glow)"
            strokeWidth={14}
            opacity={0.5}
          />
          <path d={buildTransversePath(phase)} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />

          {/* Per-particle vertical path tracks */}
          {showParticlePaths &&
            particles.map((x0, i) => (
              <line
                key={`path-${i}`}
                x1={x0}
                y1={EQUILIBRIUM_Y - TRANSVERSE_AMPLITUDE_PX}
                x2={x0}
                y2={EQUILIBRIUM_Y + TRANSVERSE_AMPLITUDE_PX}
                strokeWidth={1}
                strokeDasharray="3 4"
                className={cn(
                  watchedIndex === i ? "stroke-amber-500" : "stroke-ink/15 dark:stroke-bone/15"
                )}
              />
            ))}

          {/* Particles */}
          {particles.map((x0, i) => {
            const y = EQUILIBRIUM_Y - transverseOffset(x0, phase);
            const watched = watchedIndex === i;
            return (
              <circle
                key={i}
                cx={x0}
                cy={y}
                r={watched ? 8 : 4.5}
                className={watched ? "fill-amber-500" : "fill-ink/70 dark:fill-bone/70"}
              />
            );
          })}

          {watchedIndex !== null && particles[watchedIndex] !== undefined ? (
            <>
              <text
                x={particles[watchedIndex]}
                y={EQUILIBRIUM_Y - TRANSVERSE_AMPLITUDE_PX - 12}
                textAnchor="middle"
                className="fill-amber-600 dark:fill-amber-400 font-mono text-[10px] font-semibold uppercase tracking-wide"
              >
                Up
              </text>
              <text
                x={particles[watchedIndex]}
                y={EQUILIBRIUM_Y + TRANSVERSE_AMPLITUDE_PX + 20}
                textAnchor="middle"
                className="fill-amber-600 dark:fill-amber-400 font-mono text-[10px] font-semibold uppercase tracking-wide"
              >
                Down
              </text>
            </>
          ) : null}
        </>
      ) : (
        <>
          {/* Resting baseline */}
          <line
            x1={0}
            y1={EQUILIBRIUM_Y}
            x2={VIEW_WIDTH}
            y2={EQUILIBRIUM_Y}
            strokeWidth={1.5}
            strokeDasharray="10 8"
            className="stroke-ink/15 dark:stroke-bone/15"
          />

          {/* Compression / rarefaction bands */}
          {compressionX !== null ? (
            <g>
              <rect
                x={compressionX - BAND_WIDTH / 2}
                y={EQUILIBRIUM_Y - 60}
                width={BAND_WIDTH}
                height={120}
                rx={10}
                className="fill-pine-500/10 dark:fill-pine-300/10"
              />
              <text
                x={compressionX}
                y={EQUILIBRIUM_Y - 72}
                textAnchor="middle"
                className="fill-pine-600 dark:fill-pine-300 font-mono text-[10px] font-semibold uppercase tracking-wide"
              >
                Compression
              </text>
            </g>
          ) : null}
          {rarefactionX !== null ? (
            <g>
              <rect
                x={rarefactionX - BAND_WIDTH / 2}
                y={EQUILIBRIUM_Y - 60}
                width={BAND_WIDTH}
                height={120}
                rx={10}
                className="fill-violet-500/10 dark:fill-violet-300/10"
              />
              <text
                x={rarefactionX}
                y={EQUILIBRIUM_Y + 84}
                textAnchor="middle"
                className="fill-violet-600 dark:fill-violet-400 font-mono text-[10px] font-semibold uppercase tracking-wide"
              >
                Rarefaction
              </text>
            </g>
          ) : null}

          {/* Per-particle horizontal path tracks */}
          {showParticlePaths &&
            particles.map((x0, i) => (
              <line
                key={`path-${i}`}
                x1={x0 - LONGITUDINAL_DISPLACEMENT_PX}
                y1={EQUILIBRIUM_Y}
                x2={x0 + LONGITUDINAL_DISPLACEMENT_PX}
                y2={EQUILIBRIUM_Y}
                strokeWidth={1}
                strokeDasharray="3 4"
                className={cn(
                  watchedIndex === i ? "stroke-amber-500" : "stroke-ink/15 dark:stroke-bone/15"
                )}
              />
            ))}

          {/* Particles */}
          {particles.map((x0, i) => {
            const x = x0 + longitudinalOffset(x0, phase);
            const watched = watchedIndex === i;
            return (
              <circle
                key={i}
                cx={x}
                cy={EQUILIBRIUM_Y}
                r={watched ? 8 : 4.5}
                className={watched ? "fill-amber-500" : "fill-ink/70 dark:fill-bone/70"}
              />
            );
          })}

          {watchedIndex !== null && particles[watchedIndex] !== undefined ? (
            <>
              <text
                x={particles[watchedIndex] - LONGITUDINAL_DISPLACEMENT_PX - 4}
                y={EQUILIBRIUM_Y - 16}
                textAnchor="middle"
                className="fill-amber-600 dark:fill-amber-400 font-mono text-[10px] font-semibold uppercase tracking-wide"
              >
                Left
              </text>
              <text
                x={particles[watchedIndex] + LONGITUDINAL_DISPLACEMENT_PX + 4}
                y={EQUILIBRIUM_Y - 16}
                textAnchor="middle"
                className="fill-amber-600 dark:fill-amber-400 font-mono text-[10px] font-semibold uppercase tracking-wide"
              >
                Right
              </text>
            </>
          ) : null}
        </>
      )}
    </svg>
  );
}

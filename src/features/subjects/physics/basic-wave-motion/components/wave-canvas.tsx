"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  EQUILIBRIUM_Y,
  VIEW_HEIGHT,
  VIEW_WIDTH,
  buildWavePath,
  nearestCrestX,
  nearestTroughX,
  particlePositions,
  waveY,
  type ExploreItem,
} from "../wave-model";

interface WaveCanvasProps {
  phase: number;
  amplitudePx: number;
  wavelengthPx: number;
  showParticles: boolean;
  /** Which labeled feature (if any) is currently emphasized, from Explore mode. */
  highlighted: ExploreItem | null;
  /** Mini-challenge hit targets — when set, clicking near that point reports a result. */
  challengeTarget?: "crest" | "trough" | null;
  onChallengeHit?: (hit: "crest" | "trough", correct: boolean) => void;
}

const DIM_OPACITY = 0.32;

export function WaveCanvas({
  phase,
  amplitudePx,
  wavelengthPx,
  showParticles,
  highlighted,
  challengeTarget,
  onChallengeHit,
}: WaveCanvasProps) {
  const path = buildWavePath(phase, amplitudePx, wavelengthPx);
  const crestX = nearestCrestX(phase, wavelengthPx);
  const troughX = nearestTroughX(phase, wavelengthPx);
  const crestY = EQUILIBRIUM_Y - amplitudePx;
  const troughY = EQUILIBRIUM_Y + amplitudePx;
  const nextCrestX = crestX + wavelengthPx;

  const dim = (item: ExploreItem) => (highlighted && highlighted !== item ? DIM_OPACITY : 1);

  const particles = showParticles ? particlePositions() : [];

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!challengeTarget || !onChallengeHit) return;
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const scaleX = VIEW_WIDTH / rect.width;
    const scaleY = VIEW_HEIGHT / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const distToCrest = Math.hypot(x - crestX, y - crestY);
    const distToTrough = Math.hypot(x - troughX, y - troughY);
    const hitRadius = 46;

    if (distToCrest <= hitRadius && distToCrest <= distToTrough) {
      onChallengeHit("crest", challengeTarget === "crest");
    } else if (distToTrough <= hitRadius) {
      onChallengeHit("trough", challengeTarget === "trough");
    }
  };

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      className={cn("h-full w-full text-subject-physics", challengeTarget && "cursor-pointer")}
      role="img"
      aria-label="An animated transverse wave"
      onClick={handleClick}
    >
      <defs>
        <linearGradient id="wave-glow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="currentColor" stopOpacity={0.15} />
          <stop offset="50%" stopColor="currentColor" stopOpacity={0.55} />
          <stop offset="100%" stopColor="currentColor" stopOpacity={0.15} />
        </linearGradient>
        <filter id="wave-blur" x="-20%" y="-100%" width="140%" height="300%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* Direction arrow */}
      <g opacity={0.85}>
        <text
          x={VIEW_WIDTH - 16}
          y={26}
          textAnchor="end"
          className="fill-ink-soft dark:fill-bone-soft font-mono text-[11px] uppercase tracking-wide"
        >
          Wave travels
        </text>
        {[0, 1, 2].map((i) => (
          <motion.path
            key={i}
            d={`M${VIEW_WIDTH - 70 + i * 16} 12 l10 8 l-10 8`}
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
      <g opacity={dim("equilibrium")} style={{ transition: "opacity 200ms" }}>
        <line
          x1={0}
          y1={EQUILIBRIUM_Y}
          x2={VIEW_WIDTH}
          y2={EQUILIBRIUM_Y}
          strokeWidth={highlighted === "equilibrium" ? 2.5 : 1.5}
          strokeDasharray="10 8"
          className={cn(
            "transition-all",
            highlighted === "equilibrium" ? "stroke-subject-physics" : "stroke-ink/25 dark:stroke-bone/25"
          )}
        />
        <text
          x={8}
          y={EQUILIBRIUM_Y - 8}
          className="fill-ink-soft dark:fill-bone-soft font-mono text-[10px] uppercase tracking-wide"
        >
          Equilibrium / rest position
        </text>
      </g>

      {/* Soft glow behind the wave */}
      <path d={path} fill="none" stroke="url(#wave-glow)" strokeWidth={14} filter="url(#wave-blur)" opacity={0.5} />

      {/* The wave itself */}
      <path d={path} fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" />

      {/* Amplitude indicator */}
      <g opacity={dim("amplitude")} style={{ transition: "opacity 200ms" }}>
        <line
          x1={crestX}
          y1={EQUILIBRIUM_Y}
          x2={crestX}
          y2={crestY}
          strokeWidth={highlighted === "amplitude" ? 2.5 : 1.5}
          className={cn(highlighted === "amplitude" ? "stroke-amber-500" : "stroke-ink/40 dark:stroke-bone/40")}
        />
        <text
          x={crestX + 8}
          y={(EQUILIBRIUM_Y + crestY) / 2}
          className={cn(
            "font-mono text-[11px] font-medium",
            highlighted === "amplitude" ? "fill-amber-600 dark:fill-amber-400" : "fill-ink-soft dark:fill-bone-soft"
          )}
        >
          A
        </text>
      </g>

      {/* Wavelength indicator */}
      <g opacity={dim("wavelength")} style={{ transition: "opacity 200ms" }}>
        <line
          x1={crestX}
          y1={22}
          x2={nextCrestX}
          y2={22}
          strokeWidth={highlighted === "wavelength" ? 2.5 : 1.5}
          className={cn(highlighted === "wavelength" ? "stroke-violet-500" : "stroke-ink/40 dark:stroke-bone/40")}
        />
        <line x1={crestX} y1={16} x2={crestX} y2={28} strokeWidth={1.5} className="stroke-ink/40 dark:stroke-bone/40" />
        <line
          x1={nextCrestX}
          y1={16}
          x2={nextCrestX}
          y2={28}
          strokeWidth={1.5}
          className="stroke-ink/40 dark:stroke-bone/40"
        />
        <text
          x={(crestX + nextCrestX) / 2}
          y={14}
          textAnchor="middle"
          className={cn(
            "font-mono text-[11px] font-medium",
            highlighted === "wavelength" ? "fill-violet-600 dark:fill-violet-400" : "fill-ink-soft dark:fill-bone-soft"
          )}
        >
          λ
        </text>
      </g>

      {/* Crest marker */}
      <g opacity={dim("crest")} style={{ transition: "opacity 200ms" }}>
        <circle
          cx={crestX}
          cy={crestY}
          r={highlighted === "crest" ? 7 : 5}
          className={cn(highlighted === "crest" ? "fill-pine-600 dark:fill-pine-300" : "fill-subject-physics")}
        />
        <text
          x={crestX}
          y={crestY - 14}
          textAnchor="middle"
          className={cn(
            "font-mono text-[10px] font-semibold uppercase tracking-wide",
            highlighted === "crest" ? "fill-pine-600 dark:fill-pine-300" : "fill-ink-soft dark:fill-bone-soft"
          )}
        >
          Crest
        </text>
      </g>

      {/* Trough marker */}
      <g opacity={dim("trough")} style={{ transition: "opacity 200ms" }}>
        <circle
          cx={troughX}
          cy={troughY}
          r={highlighted === "trough" ? 7 : 5}
          className={cn(highlighted === "trough" ? "fill-pine-600 dark:fill-pine-300" : "fill-subject-physics")}
        />
        <text
          x={troughX}
          y={troughY + 22}
          textAnchor="middle"
          className={cn(
            "font-mono text-[10px] font-semibold uppercase tracking-wide",
            highlighted === "trough" ? "fill-pine-600 dark:fill-pine-300" : "fill-ink-soft dark:fill-bone-soft"
          )}
        >
          Trough
        </text>
      </g>

      {/* Particles — each oscillates only vertically at its own fixed x */}
      {particles.map((x, i) => {
        const y = EQUILIBRIUM_Y - waveY(x, phase, amplitudePx, wavelengthPx);
        return <circle key={i} cx={x} cy={y} r={4.5} className="fill-ink/70 dark:fill-bone/70" />;
      })}

      {/* Larger, invisible hit-areas for the mini challenge */}
      {challengeTarget ? (
        <>
          <circle cx={crestX} cy={crestY} r={30} fill="transparent" />
          <circle cx={troughX} cy={troughY} r={30} fill="transparent" />
        </>
      ) : null}
    </svg>
  );
}

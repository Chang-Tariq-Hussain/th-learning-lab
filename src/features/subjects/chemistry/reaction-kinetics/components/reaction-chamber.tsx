"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReactionChamber } from "../hooks/use-reaction-chamber";
import { COLOR_FAIL, DEFAULT_CHAMBER_HEIGHT, DEFAULT_CHAMBER_WIDTH, PARTICLE_RADIUS } from "../model";
import type { ChamberStats } from "../types";

export interface ReactionChamberProps {
  numA: number;
  numB: number;
  tempC: number;
  catalyst?: boolean;
  width?: number;
  height?: number;
  label?: string;
  autoStart?: boolean;
  showControls?: boolean;
  className?: string;
  onStats?: (stats: ChamberStats) => void;
}

/**
 * The reusable particle chamber behind every level of this simulation.
 * Reactant "A" and "B" particles drift, occasionally collide, and — with
 * some probability driven by temperature and catalyst state — combine
 * into product "AB" particles. Purely conceptual; not a numerical model.
 */
export function ReactionChamber({
  numA,
  numB,
  tempC,
  catalyst = false,
  width = DEFAULT_CHAMBER_WIDTH,
  height = DEFAULT_CHAMBER_HEIGHT,
  label,
  autoStart = true,
  showControls = true,
  className,
  onStats,
}: ReactionChamberProps) {
  const [running, setRunning] = useState(autoStart);
  const { registerParticleEl, stats, sparks, reset } = useReactionChamber({
    numA,
    numB,
    tempC,
    catalyst,
    running,
    width,
    height,
  });

  useEffect(() => {
    onStats?.(stats);
  }, [stats, onStats]);

  const particleCount = numA + numB;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label ? (
        <div className="flex items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">{label}</p>
          {showControls ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setRunning((v) => !v)}
                aria-label={running ? "Pause" : "Play"}
                className="rounded-full p-1.5 text-ink-soft transition-colors hover:bg-ink/[0.06] dark:text-bone-soft dark:hover:bg-bone/[0.08]"
              >
                {running ? <Pause className="h-3.5 w-3.5" strokeWidth={1.75} /> : <Play className="h-3.5 w-3.5" strokeWidth={1.75} />}
              </button>
              <button
                type="button"
                onClick={reset}
                aria-label="Reset chamber"
                className="rounded-full p-1.5 text-ink-soft transition-colors hover:bg-ink/[0.06] dark:text-bone-soft dark:hover:bg-bone/[0.08]"
              >
                <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="relative overflow-hidden rounded-card border border-line bg-white/50 dark:border-line-dark dark:bg-white/[0.02]">
        <svg viewBox={`0 0 ${width} ${height}`} className="block w-full" style={{ height: "auto" }}>
          {Array.from({ length: particleCount }).map((_, i) => (
            <g key={i} ref={registerParticleEl(i)} transform="translate(0,0)">
              <circle r={PARTICLE_RADIUS} fill="var(--kinetics-color, #999)" />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                className="select-none font-mono font-semibold"
                fontSize={PARTICLE_RADIUS * 0.95}
                fill="white"
              >
                A
              </text>
            </g>
          ))}

          <AnimatePresence>
            {sparks.map((s) => (
              <motion.g
                key={s.id}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.3 }}
                transition={{ duration: 0.3 }}
                transform={`translate(${s.x}, ${s.y})`}
              >
                {s.kind === "success" ? (
                  <g stroke="#2E9E5B" strokeWidth={2.5} strokeLinecap="round" fill="none">
                    <path d="M -6 0 L -2 5 L 7 -6" />
                  </g>
                ) : (
                  <g stroke={COLOR_FAIL} strokeWidth={2.5} strokeLinecap="round">
                    <path d="M -5 -5 L 5 5" />
                    <path d="M 5 -5 L -5 5" />
                  </g>
                )}
              </motion.g>
            ))}
          </AnimatePresence>
        </svg>

        {!running ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/30 dark:bg-chalkboard/30">
            <span className="rounded-full bg-ink/80 px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-paper dark:bg-bone/80 dark:text-chalkboard">
              Paused
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

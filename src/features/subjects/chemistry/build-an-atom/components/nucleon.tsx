"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { ParticleKind } from "../particle-info";
import { PopBurst } from "./pop-burst";

interface NucleonProps {
  kind: "proton" | "neutron";
  x: number;
  y: number;
  onSelect: (kind: ParticleKind) => void;
}

const RADIUS = 7;

/**
 * A single proton or neutron inside the nucleus. Three animation layers,
 * each independent so they never fight over the same transform:
 * 1. A `PopBurst` ring, purely decorative, behind the particle.
 * 2. This component's own mount spring — an overshooting "boing" rather
 *    than a plain fade, for a satisfying pop.
 * 3. A continuous, tiny, randomized wobble (`animate` with `repeat:
 *    Infinity`) suggesting the nucleus has some energy to it, rather
 *    than sitting dead still — subtle enough not to look like jitter.
 * The nucleus's own gentle rotation (applied by the parent group) is a
 * fourth, separate layer on top of all this.
 */
export function Nucleon({ kind, x, y, onSelect }: NucleonProps) {
  const isProton = kind === "proton";
  const gradientId = isProton ? "url(#proton-gradient)" : "url(#neutron-gradient)";
  const glowColor = isProton ? "#E0524F" : "#8B95A1";

  // A stable per-particle random phase/duration so nucleons don't all wobble in lockstep.
  const wobble = useMemo(
    () => ({
      duration: 1.8 + Math.random() * 1.4,
      dx: 0.6 + Math.random() * 0.5,
      dy: 0.6 + Math.random() * 0.5,
      delay: Math.random() * 1.5,
    }),
    []
  );

  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 14 }}
      style={{ cursor: "pointer" }}
      onClick={() => onSelect(kind)}
      tabIndex={0}
      role="button"
      aria-label={isProton ? "Proton: positive charge, in the nucleus" : "Neutron: no charge, in the nucleus"}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect(kind);
      }}
    >
      <g transform={`translate(${x} ${y})`}>
        <PopBurst color={glowColor} size={RADIUS * 1.3} />
        <motion.g
          animate={{ x: [0, wobble.dx, -wobble.dx, 0], y: [0, -wobble.dy, wobble.dy, 0] }}
          transition={{ duration: wobble.duration, delay: wobble.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle r={RADIUS} fill={gradientId} stroke="rgba(0,0,0,0.18)" strokeWidth={0.5} filter="url(#glow-soft)" />
          <text textAnchor="middle" dominantBaseline="central" fontSize={8} fontWeight={700} fill="white" pointerEvents="none">
            {isProton ? "+" : ""}
          </text>
        </motion.g>
      </g>
    </motion.g>
  );
}

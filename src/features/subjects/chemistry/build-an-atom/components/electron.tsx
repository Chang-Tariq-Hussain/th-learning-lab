"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { ParticleKind } from "../particle-info";
import { PopBurst } from "./pop-burst";

interface ElectronProps {
  x: number;
  y: number;
  onSelect: (kind: ParticleKind) => void;
}

const RADIUS = 5;

/**
 * A single electron. The entrance is a curved swoop rather than a
 * straight line from the nucleus — `animate`'s array keyframes pass
 * through a control point offset to one side of the direct path, which
 * reads as "flying into orbit" rather than "sliding into place". The
 * continuous orbiting motion itself comes from the parent shell group's
 * rAF-driven rotation, not from this component, so this entrance
 * animation and that per-frame rotation never fight over the same
 * transform — this component only ever animates *relative to* its
 * resting spot on the shell.
 */
export function Electron({ x, y, onSelect }: ElectronProps) {
  // A control point off to one side of the straight nucleus→shell line,
  // so the flight path arcs instead of cutting straight across the atom.
  const control = useMemo(() => {
    const midX = x * 0.55;
    const midY = y * 0.55;
    const perpX = -y;
    const perpY = x;
    const perpLength = Math.hypot(perpX, perpY) || 1;
    const swoop = 26 * (Math.random() < 0.5 ? 1 : -1);
    return {
      x: midX + (perpX / perpLength) * swoop,
      y: midY + (perpY / perpLength) * swoop,
    };
  }, [x, y]);

  return (
    <motion.g
      initial={{ x: 0, y: 0, opacity: 0, scale: 0.2 }}
      animate={{ x: [0, control.x, x], y: [0, control.y, y], opacity: [0, 1, 1], scale: [0.2, 1.3, 1] }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.6, times: [0, 0.55, 1], ease: "easeOut" }}
      style={{ cursor: "pointer" }}
      onClick={() => onSelect("electron")}
      tabIndex={0}
      role="button"
      aria-label="Electron: negative charge, orbits the nucleus"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect("electron");
      }}
    >
      <PopBurst color="#3D5AFE" size={RADIUS * 2.2} />
      <circle r={RADIUS} fill="url(#electron-gradient)" stroke="rgba(255,255,255,0.7)" strokeWidth={1} filter="url(#glow-strong)" />
      <text textAnchor="middle" dominantBaseline="central" fontSize={7} fontWeight={700} fill="white" pointerEvents="none">
        −
      </text>
    </motion.g>
  );
}

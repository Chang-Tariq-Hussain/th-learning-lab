"use client";

import { motion } from "framer-motion";

interface ValenceElectronProps {
  x: number;
  y: number;
  /** Extra transition delay (seconds) so electrons visibly move after the atoms have mostly arrived. */
  delay?: number;
}

const RADIUS = 8;

/**
 * A single valence electron dot, positioned in absolute scene
 * coordinates (not nested inside an atom's own transform) so it can
 * travel independently across the gap between atoms — for the ionic
 * transfer and the covalent shared pair alike. The atom orbs animate
 * their own `x`/`y`; this animates its own `x`/`y` on the same spring,
 * just with an optional delay, so it reads as "leaving after the atoms
 * have started closing the distance" rather than fighting for the same
 * transform.
 */
export function ValenceElectron({ x, y, delay = 0 }: ValenceElectronProps) {
  return (
    <motion.g
      initial={{ x, y }}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 90, damping: 16, delay }}
      style={{ pointerEvents: "none" }}
    >
      <circle
        r={RADIUS}
        fill="url(#bond-electron-gradient)"
        stroke="rgba(255,255,255,0.8)"
        strokeWidth={1}
        filter="url(#bond-glow-strong)"
      />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={11}
        fontWeight={700}
        fill="white"
      >
        −
      </text>
    </motion.g>
  );
}

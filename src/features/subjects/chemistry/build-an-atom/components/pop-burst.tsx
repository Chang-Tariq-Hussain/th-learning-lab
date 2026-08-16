"use client";

import { motion } from "framer-motion";

interface PopBurstProps {
  color: string;
  size?: number;
}

/** A one-shot expanding, fading ring — layered behind a particle on mount for a satisfying "pop" without any extra state or timers; it simply animates once and stays at its final (invisible) state. */
export function PopBurst({ color, size = 22 }: PopBurstProps) {
  return (
    <motion.circle
      r={size}
      fill="none"
      stroke={color}
      strokeWidth={2}
      initial={{ scale: 0.2, opacity: 0.9 }}
      animate={{ scale: 1.6, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ pointerEvents: "none" }}
    />
  );
}

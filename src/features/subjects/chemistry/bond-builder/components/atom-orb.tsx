"use client";

import { motion } from "framer-motion";
import type { BondAtomInfo } from "../bond-model";

interface AtomOrbProps {
  atom: BondAtomInfo;
  gradientId: string;
  x: number;
  y: number;
  radius?: number;
  /** e.g. "+", "−", "2+", or "2−" once the atom has become an ion; omitted while neutral. */
  charge?: string | null;
}

/**
 * One large atom sphere: gradient-filled circle, element symbol, and an
 * optional ionic-charge badge. Position is driven entirely by the `x`/`y`
 * props (animated by the parent via framer-motion's `animate`), so this
 * component stays a plain, stateless renderer.
 */
export function AtomOrb({
  atom,
  gradientId,
  x,
  y,
  radius = 58,
  charge = null,
}: AtomOrbProps) {
  return (
    <motion.g
      initial={{ x, y }}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 90, damping: 16 }}
      aria-label={`${atom.name} atom${charge ? `, now charged ${charge}` : ""}`}
    >
      <circle
        r={radius}
        fill={`url(#${gradientId})`}
        stroke="rgba(0,0,0,0.15)"
        strokeWidth={1}
        filter="url(#bond-glow-soft)"
      />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={28}
        fontWeight={700}
        fill="white"
        pointerEvents="none"
      >
        {atom.symbol}
      </text>

      {charge ? (
        <motion.g
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 16 }}
        >
          <circle
            cx={radius * 0.72}
            cy={-radius * 0.72}
            r={15}
            fill={charge?.endsWith("+") ? "#3D5AFE" : "#0D9488"}
            stroke="white"
            strokeWidth={2}
          />
          <text
            x={radius * 0.72}
            y={-radius * 0.72}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={16}
            fontWeight={700}
            fill="white"
            pointerEvents="none"
          >
            {charge}
          </text>
        </motion.g>
      ) : null}
    </motion.g>
  );
}

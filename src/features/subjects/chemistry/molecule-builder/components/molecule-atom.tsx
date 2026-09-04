"use client";

import { motion } from "framer-motion";
import type { BondAtomInfo } from "../../bond-builder/bond-model";

interface MoleculeAtomProps {
  atom: BondAtomInfo;
  gradientId: string;
  x: number;
  y: number;
  radius: number;
  selected: boolean;
  onSelect: () => void;
}

/**
 * One atom sphere in `MoleculeStage`'s flat build animation — same
 * "gradient-filled circle + symbol" recipe as Bond Builder's `AtomOrb`,
 * with a click target and selection ring added so a student can tap an
 * atom mid-build the same way they can in the 3D lab (see
 * `AtomDetailPanel`). Position is driven by the `x`/`y` props (animated
 * via framer-motion) so this stays a plain, stateless renderer.
 */
export function MoleculeAtom({
  atom,
  gradientId,
  x,
  y,
  radius,
  selected,
  onSelect,
}: MoleculeAtomProps) {
  return (
    <motion.g
      initial={{ x, y }}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 90, damping: 16 }}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
      aria-label={`${atom.name} atom${selected ? ", selected" : ""}`}
      className="cursor-pointer outline-none"
    >
      {selected ? (
        <circle
          r={radius + 6}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          className="text-subject-chemistry"
        />
      ) : null}
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
    </motion.g>
  );
}

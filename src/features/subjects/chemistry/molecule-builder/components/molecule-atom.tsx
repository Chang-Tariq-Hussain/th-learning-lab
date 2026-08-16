"use client";

import { motion } from "framer-motion";
import type { BondAtomInfo } from "../../bond-builder/bond-model";
import { AtomOrb } from "../../bond-builder/components/atom-orb";

interface MoleculeAtomProps {
  atom: BondAtomInfo;
  gradientId: string;
  x: number;
  y: number;
  radius?: number;
  selected?: boolean;
  onSelect: () => void;
}

const SPRING = { type: "spring" as const, stiffness: 90, damping: 16 };

/**
 * Reuses Bond Builder's `AtomOrb` untouched for the actual sphere/label
 * rendering, then layers a transparent click target on top that's
 * driven by the exact same `x`/`y`/spring so it always tracks the orb
 * precisely, even mid-animation — done this way rather than editing
 * `AtomOrb` itself, since Bond Builder isn't part of this feature.
 */
export function MoleculeAtom({
  atom,
  gradientId,
  x,
  y,
  radius = 52,
  selected = false,
  onSelect,
}: MoleculeAtomProps) {
  return (
    <>
      <AtomOrb
        atom={atom}
        gradientId={gradientId}
        x={x}
        y={y}
        radius={radius}
      />
      <motion.g
        initial={{ x, y }}
        animate={{ x, y }}
        transition={SPRING}
        style={{ cursor: "pointer" }}
        onClick={onSelect}
        tabIndex={0}
        role="button"
        aria-label={`Show details for ${atom.name}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onSelect();
        }}
      >
        <circle r={radius} fill="transparent" />
        {selected ? (
          <circle
            r={radius + 6}
            fill="none"
            stroke="currentColor"
            className="text-pine-500 dark:text-pine-300"
            strokeWidth={2}
            strokeDasharray="4 4"
          />
        ) : null}
      </motion.g>
    </>
  );
}

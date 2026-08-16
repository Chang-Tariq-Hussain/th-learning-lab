"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { motion } from "framer-motion";

export interface OrganelleHotspotProps {
  id: string;
  label: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  children: ReactNode;
}

/**
 * TASK 4 SCOPE ONLY — click/keyboard interactivity and the
 * glow + zoom "selected" feedback, wrapped around an organelle's
 * *existing* shape without changing it. `transform-box: fill-box`
 * means the zoom scales from that shape's own visual center, correct
 * regardless of where on the cell it sits. No hover state, no
 * description lookup — this task only needs to know an organelle was
 * clicked and what to call it in the info panel.
 */
export function OrganelleHotspot({ id, label, isSelected, onSelect, children }: OrganelleHotspotProps) {
  const handleKeyDown = (e: KeyboardEvent<SVGGElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(id);
    }
  };

  return (
    <motion.g
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={isSelected}
      style={{
        transformBox: "fill-box",
        transformOrigin: "50% 50%",
        cursor: "pointer",
        filter: isSelected ? "drop-shadow(0 0 5px rgba(255,255,255,0.9)) drop-shadow(0 0 13px rgba(13,148,136,0.7))" : "none",
      }}
      animate={{ scale: isSelected ? 1.08 : 1 }}
      transition={{ type: "spring", stiffness: 340, damping: 22 }}
      onClick={() => onSelect(id)}
      onKeyDown={handleKeyDown}
    >
      {children}
    </motion.g>
  );
}

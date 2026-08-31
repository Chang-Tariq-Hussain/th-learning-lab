"use client";

import { type KeyboardEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export interface OrganelleHotspotProps {
  id: string;
  label: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  children: ReactNode;
}

/** Extra room (in the shared 400×400 viewBox's own units) between the
 *  organelle's tight geometric bounding box and the boundary ring drawn
 *  around it, so the ring reads as a highlight around the shape rather
 *  than hugging its outline. */
const BOUNDARY_PADDING = 6;

/**
 * TASK 4 SCOPE ONLY — click/keyboard interactivity and the
 * glow + zoom "selected" feedback, wrapped around an organelle's
 * *existing* shape without changing it. `transform-box: fill-box`
 * means the zoom scales from that shape's own visual center, correct
 * regardless of where on the cell it sits. No hover state, no
 * description lookup — this task only needs to know an organelle was
 * clicked and what to call it in the info panel.
 *
 * TASK 7 SCOPE ADDS: a hover state — a thin outline distinct from the
 * selected glow, matching the style guide's "hover = thin outline
 * only, no glow" rule. Gated behind `(hover: hover) and (pointer:
 * fine)` rather than plain CSS `:hover`/mouse events unconditionally,
 * because touch browsers can otherwise leave a hover state "stuck" on
 * after a tap with nothing to move the pointer away and clear it.
 * When the organelle is already selected, the hover outline is
 * skipped — the glow is already the stronger signal, and stacking
 * both reads as visual noise rather than added information. Visible
 * keyboard-focus styling is a separate, later accessibility pass (see
 * the dev plan) and isn't added here.
 *
 * BUGFIX/ENHANCEMENT — selected organelles previously relied on a
 * `drop-shadow` glow alone, which is a soft, low-contrast cue and can
 * be hard to see against busier parts of the illustration or on some
 * displays. Adds a crisp dashed boundary ring around whichever
 * organelle is currently selected, in addition to the existing glow.
 * Rather than every call site (there are ~25 across the animal and
 * plant cell files, several with per-instance sizes) having to supply
 * its own bounding geometry, this measures the *actual rendered
 * shape* with `SVGGraphicsElement.getBBox()` once it becomes
 * selected — which works correctly for every organelle shape (blobs,
 * beans, wavy ER tubes, ribosome clusters, ...) with no per-shape
 * configuration, and stays correct if any shape's geometry changes
 * later. `getBBox()` is a browser-only API, so this only runs in a
 * `useEffect` (never during server rendering).
 */
export function OrganelleHotspot({ id, label, isSelected, onSelect, children }: OrganelleHotspotProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [supportsHover, setSupportsHover] = useState(false);
  const shapeRef = useRef<SVGGElement>(null);
  const [boundaryBox, setBoundaryBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    setSupportsHover(query.matches);
    const handleChange = (e: MediaQueryListEvent) => setSupportsHover(e.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!isSelected) {
      setBoundaryBox(null);
      return;
    }
    const node = shapeRef.current;
    if (!node) return;
    try {
      const box = node.getBBox();
      if (box.width > 0 && box.height > 0) {
        setBoundaryBox({ x: box.x, y: box.y, width: box.width, height: box.height });
      }
    } catch {
      // getBBox can throw if the node isn't rendered yet (e.g. display:none
      // during a cell-kind transition) — just skip the boundary that frame.
      setBoundaryBox(null);
    }
  }, [isSelected]);

  const handleKeyDown = (e: KeyboardEvent<SVGGElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(id);
    }
  };

  const filter = isSelected
    ? "drop-shadow(0 0 5px rgba(255,255,255,0.9)) drop-shadow(0 0 13px rgba(13,148,136,0.7))"
    : isHovered && supportsHover
      ? "drop-shadow(0 0 1.5px rgba(76,46,134,0.75)) drop-shadow(0 0 2.5px rgba(76,46,134,0.4))"
      : "none";

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
        filter,
      }}
      animate={{ scale: isSelected ? 1.08 : 1 }}
      transition={{ type: "spring", stiffness: 340, damping: 22 }}
      onClick={() => onSelect(id)}
      onKeyDown={handleKeyDown}
      onMouseEnter={supportsHover ? () => setIsHovered(true) : undefined}
      onMouseLeave={supportsHover ? () => setIsHovered(false) : undefined}
    >
      <g ref={shapeRef}>{children}</g>
      {isSelected && boundaryBox ? (
        <rect
          x={boundaryBox.x - BOUNDARY_PADDING}
          y={boundaryBox.y - BOUNDARY_PADDING}
          width={boundaryBox.width + BOUNDARY_PADDING * 2}
          height={boundaryBox.height + BOUNDARY_PADDING * 2}
          rx={10}
          fill="none"
          stroke="#0D9488"
          strokeWidth={2}
          strokeDasharray="5 4"
          pointerEvents="none"
          aria-hidden="true"
        />
      ) : null}
    </motion.g>
  );
}

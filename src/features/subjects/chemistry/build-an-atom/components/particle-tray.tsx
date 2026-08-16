"use client";

import { motion } from "framer-motion";
import type { ParticleKind } from "../particle-info";

interface ParticleTrayProps {
  onDropParticle: (kind: ParticleKind, event: MouseEvent | TouchEvent | PointerEvent) => void;
  onDragStateChange: (dragging: boolean) => void;
}

const chips: { kind: ParticleKind; label: string; color: string; symbol: string }[] = [
  { kind: "proton", label: "Proton", color: "#E0524F", symbol: "+" },
  { kind: "neutron", label: "Neutron", color: "#8B95A1", symbol: "" },
  { kind: "electron", label: "Electron", color: "#3D5AFE", symbol: "−" },
];

/**
 * A box of three draggable particle chips, one per type, color-coded the
 * same as the atom itself (protons red, neutrons gray, electrons blue)
 * so the tray and the visualization read as the same visual language.
 * Each chip always springs back to its spot in the tray after a drag
 * (`dragSnapToOrigin`) — dropping it "onto the atom" is detected by the
 * parent comparing the drop point against the visualization's bounding
 * box, not by anything leaving the tray permanently, so the tray is an
 * infinite, reusable source rather than a fixed supply of particles.
 */
export function ParticleTray({ onDropParticle, onDragStateChange }: ParticleTrayProps) {
  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
        Drag a particle onto the atom
      </p>
      <div className="flex items-center justify-around gap-4">
        {chips.map((chip) => (
          <motion.div
            key={chip.kind}
            drag
            dragSnapToOrigin
            dragElastic={0.15}
            whileDrag={{ scale: 1.2, zIndex: 50 }}
            whileHover={{ scale: 1.05 }}
            onDragStart={() => onDragStateChange(true)}
            onDragEnd={(event) => {
              onDragStateChange(false);
              onDropParticle(chip.kind, event as MouseEvent | TouchEvent | PointerEvent);
            }}
            className="flex cursor-grab flex-col items-center gap-1.5 active:cursor-grabbing"
            style={{ touchAction: "none" }}
            role="button"
            tabIndex={0}
            aria-label={`Drag a ${chip.label.toLowerCase()} onto the atom, or use the + ${chip.label} button below`}
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white shadow-md"
              style={{ backgroundColor: chip.color }}
            >
              {chip.symbol}
            </div>
            <span className="text-xs font-medium text-ink-soft dark:text-bone-soft">{chip.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { ACID_COLOR, BASE_COLOR, TOTAL_PARTICLES, type StrengthExample } from "../model";
import type { Species } from "../types";

interface ParticleSceneProps {
  species: Species;
  example: StrengthExample;
  ionized: boolean;
}

/**
 * A simple "particle soup" — deliberately conceptual, not a real
 * simulation. Before ionizing, every particle is the neutral
 * molecule. After ionizing, a fixed fraction (fixed per example,
 * not per concentration) splits into an ion pair — visually showing
 * "extensive" vs "partial" ionization.
 */
export function ParticleScene({ species, example, ionized }: ParticleSceneProps) {
  const color = species === "acid" ? ACID_COLOR : BASE_COLOR;
  const ionizedCount = ionized ? Math.round(TOTAL_PARTICLES * example.ionizedFraction) : 0;

  const particles: { label: string; isIon: boolean }[] = [];
  for (let i = 0; i < ionizedCount; i++) {
    particles.push({ label: example.keyIon, isIon: true });
    particles.push({ label: example.partnerIon, isIon: true });
  }
  const remainingMolecules = TOTAL_PARTICLES - ionizedCount;
  for (let i = 0; i < remainingMolecules; i++) {
    particles.push({ label: example.formula, isIon: false });
  }

  return (
    <div className="relative h-32 w-full overflow-hidden rounded-card border border-line bg-white/40 dark:border-line-dark dark:bg-white/[0.02] sm:h-36">
      {particles.map((particle, i) => {
        const left = 8 + ((i * 29) % 86);
        const top = 12 + ((i * 41) % 74);
        const duration = 2.4 + (i % 3) * 0.4;
        return (
          <motion.span
            key={`${particle.label}-${i}`}
            className="absolute flex h-6 min-w-6 items-center justify-center whitespace-nowrap rounded-full px-1.5 font-mono text-[10px] font-medium text-paper"
            style={{ left: `${left}%`, top: `${top}%`, background: particle.isIon ? color : `${color}bb` }}
            animate={{ y: [0, -5, 0, 5, 0], x: [0, 3, 0, -3, 0] }}
            transition={{ duration, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
          >
            {particle.label}
          </motion.span>
        );
      })}
    </div>
  );
}

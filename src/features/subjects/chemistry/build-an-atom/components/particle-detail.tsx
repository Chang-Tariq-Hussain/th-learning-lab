"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { PARTICLE_INFO, type ParticleKind } from "../particle-info";

interface ParticleDetailProps {
  selected: ParticleKind | null;
  onClose: () => void;
}

export function ParticleDetail({ selected, onClose }: ParticleDetailProps) {
  return (
    <AnimatePresence>
      {selected ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <div
            className="flex items-start gap-3 rounded-card border p-4"
            style={{ borderColor: `${PARTICLE_INFO[selected].color}55`, backgroundColor: `${PARTICLE_INFO[selected].color}12` }}
          >
            <div className="flex-1">
              <p className="font-display text-base font-medium" style={{ color: PARTICLE_INFO[selected].color }}>
                {PARTICLE_INFO[selected].title}
              </p>
              <ul className="mt-1.5 flex flex-col gap-1">
                {PARTICLE_INFO[selected].facts.map((fact) => (
                  <li key={fact} className="text-sm text-ink-soft dark:text-bone-soft">
                    • {fact}
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close particle details"
              className="rounded-full p-1 text-ink-soft hover:bg-ink/5 hover:text-ink dark:text-bone-soft dark:hover:bg-bone/10 dark:hover:text-bone"
            >
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

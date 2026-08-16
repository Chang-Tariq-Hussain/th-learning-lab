"use client";

import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { ION_COLOR, ION_LABEL, type IonKind } from "../arrhenius-model";

interface IonCloudProps {
  /** One "spectator" ion (Cl⁻ or Na⁺) plus `dose` of the featured ion (H⁺ or OH⁻). */
  featuredIon: IonKind;
  spectatorLabel: string;
  dose: number;
}

/** Same "floating labeled chip" visual language as Simulation 1's ParticleView, rebuilt here so each simulation stays self-contained. Not a real molecular simulation — just enough motion to read as "more of this ion." */
export function IonCloud({ featuredIon, spectatorLabel, dose }: IonCloudProps) {
  const featured = Array.from({ length: dose }, (_, i) => ({ id: `f-${i}`, label: ION_LABEL[featuredIon], color: ION_COLOR[featuredIon] }));
  const spectators = Array.from({ length: dose }, (_, i) => ({ id: `s-${i}`, label: spectatorLabel, color: ION_COLOR.spectator }));
  const ions = [...featured, ...spectators];

  return (
    <div className="relative h-28 w-full overflow-hidden rounded-card border border-line bg-white/40 dark:border-line-dark dark:bg-white/[0.02]">
      <AnimatePresence>
        {ions.map((ion, i) => {
          const left = 8 + ((i * 29) % 82);
          const top = 12 + ((i * 41) % 68);
          const duration = 2.2 + (i % 3) * 0.4;
          return (
            <motion.span
              key={ion.id}
              className="absolute flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 font-mono text-[10px] font-medium text-paper"
              style={{ left: `${left}%`, top: `${top}%`, background: ion.color }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1, y: [0, -6, 0, 6, 0], x: [0, 4, 0, -4, 0] }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 },
                y: { duration, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 },
                x: { duration, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 },
              }}
            >
              {ion.label}
            </motion.span>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

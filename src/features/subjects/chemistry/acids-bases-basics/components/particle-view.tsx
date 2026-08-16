"use client";

import { motion } from "framer-motion";
import { CLASSIFICATION_COLOR, particleCount, type Substance } from "../acids-bases-model";

interface ParticleViewProps {
  substance: Substance;
}

const ION_LABEL: Record<Substance["classification"], string> = {
  acidic: "H⁺",
  basic: "OH⁻",
  neutral: "H⁺ / OH⁻",
};

/** A very simple, non-scientific "particle soup" — just enough motion to signal "this solution has more of this ion", not a real simulation. */
export function ParticleView({ substance }: ParticleViewProps) {
  const color = CLASSIFICATION_COLOR[substance.classification];
  const count = particleCount(substance);

  const ions: { label: string }[] =
    substance.classification === "neutral"
      ? [...Array(2)].flatMap(() => [{ label: "H⁺" }, { label: "OH⁻" }])
      : [...Array(count)].map(() => ({ label: ION_LABEL[substance.classification] }));

  return (
    <div className="relative h-24 w-full overflow-hidden rounded-card border border-line bg-white/40 dark:border-line-dark dark:bg-white/[0.02]">
      {ions.map((ion, i) => {
        const left = 10 + ((i * 37) % 80);
        const top = 15 + ((i * 53) % 60);
        const duration = 2.4 + (i % 3) * 0.4;
        return (
          <motion.span
            key={`${ion.label}-${i}`}
            className="absolute flex h-6 min-w-6 items-center justify-center rounded-full px-1 font-mono text-[10px] font-medium text-paper"
            style={{ left: `${left}%`, top: `${top}%`, background: ion.label === "OH⁻" ? CLASSIFICATION_COLOR.basic : color }}
            animate={{ y: [0, -6, 0, 6, 0], x: [0, 4, 0, -4, 0] }}
            transition={{ duration, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
          >
            {ion.label}
          </motion.span>
        );
      })}
    </div>
  );
}

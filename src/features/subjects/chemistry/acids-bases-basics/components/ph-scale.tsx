"use client";

import { motion } from "framer-motion";
import { CLASSIFICATION_COLOR, phToPercent, type Substance } from "../acids-bases-model";

interface Marker {
  substance: Substance;
  label: string;
}

interface PhScaleProps {
  markers: Marker[];
}

/** A single 0–14 pH scale. Supports one marker (single-select) or two (compare mode). */
export function PhScale({ markers }: PhScaleProps) {
  return (
    <div className="w-full">
      <div className="relative mt-8 h-4 w-full overflow-visible rounded-full bg-gradient-to-r from-[#E0663D] via-[#5A9E6F] to-[#3D6FE0]">
        {/* tick marks */}
        {[0, 7, 14].map((tick) => (
          <div
            key={tick}
            className="absolute top-0 h-4 w-px bg-white/70 dark:bg-chalkboard/50"
            style={{ left: `${phToPercent(tick)}%` }}
          />
        ))}

        {markers.map(({ substance, label }) => (
          <motion.div
            key={substance.slug}
            className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
            initial={{ left: `${phToPercent(substance.approxPH)}%`, opacity: 0 }}
            animate={{ left: `${phToPercent(substance.approxPH)}%`, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            style={{ top: "-30px" }}
          >
            <span
              className="whitespace-nowrap rounded-full border border-ink/10 bg-paper px-2 py-0.5 font-mono text-[10px] font-medium text-ink shadow-sm dark:border-bone/15 dark:bg-chalkboard dark:text-bone"
              style={{ color: CLASSIFICATION_COLOR[substance.classification] }}
            >
              {label}
            </span>
            <span
              aria-hidden
              className="mt-0.5 h-3 w-3 rounded-full border-2 border-paper shadow dark:border-chalkboard"
              style={{ background: CLASSIFICATION_COLOR[substance.classification] }}
            />
          </motion.div>
        ))}
      </div>

      <div className="mt-2 flex justify-between font-mono text-[11px] text-ink-soft dark:text-bone-soft">
        <span>0</span>
        <span>7</span>
        <span>14</span>
      </div>
      <div className="mt-1 flex justify-between text-xs font-medium text-ink-soft dark:text-bone-soft">
        <span style={{ color: CLASSIFICATION_COLOR.acidic }}>Acid</span>
        <span style={{ color: CLASSIFICATION_COLOR.neutral }}>Neutral</span>
        <span style={{ color: CLASSIFICATION_COLOR.basic }}>Base</span>
      </div>
    </div>
  );
}

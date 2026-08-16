"use client";

import { motion, AnimatePresence } from "framer-motion";
import { classifyAngle, ANGLE_TYPES } from "../angle-model";

export function InfoCard({ angle }: { angle: number }) {
  const type = classifyAngle(angle);
  const info = type ? ANGLE_TYPES[type] : null;

  return (
    <div className="flex flex-col items-center gap-2 rounded-card border border-line bg-white/60 px-6 py-4 text-center dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-display text-4xl font-semibold tabular-nums text-ink dark:text-bone">
        {Math.round(angle)}°
      </p>
      <AnimatePresence mode="wait">
        <motion.span
          key={info?.label ?? "none"}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.18 }}
          className="rounded-full px-3 py-1 text-sm font-semibold"
          style={{
            backgroundColor: info?.softColor ?? "#F1F2F0",
            color: info?.color ?? "#8B95A1",
          }}
        >
          {info?.label ?? "Drag the arm"}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

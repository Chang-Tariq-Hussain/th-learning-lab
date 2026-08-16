"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { DIFFERENT_HEX, EQUIVALENT_HEX } from "../colors";

export interface ResultBannerProps {
  productFirst: number;
  productSecond: number;
  visible: boolean;
}

export function ResultBanner({ productFirst, productSecond, visible }: ResultBannerProps) {
  const equal = productFirst === productSecond;
  const color = equal ? EQUIVALENT_HEX : DIFFERENT_HEX;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 340, damping: 22 }}
          className="flex flex-col items-center gap-1.5 rounded-2xl border px-6 py-4 text-center"
          style={{ borderColor: `${color}55`, backgroundColor: `${color}14` }}
        >
          <div className="flex items-center gap-2 font-mono text-base tabular-nums" style={{ color }}>
            <span>{productFirst}</span>
            <span>{equal ? "=" : "≠"}</span>
            <span>{productSecond}</span>
          </div>
          <div className="flex items-center gap-1.5 font-display text-lg font-medium" style={{ color }}>
            {equal ? <Check className="h-5 w-5" strokeWidth={2.5} /> : <X className="h-5 w-5" strokeWidth={2.5} />}
            {equal ? "Equivalent fractions" : "Not equivalent"}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

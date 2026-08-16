"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function SymmetryBanner({ visible, pulseKey }: { visible: boolean; pulseKey: number }) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key={pulseKey}
          initial={{ opacity: 0, scale: 0.85, y: -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: -6 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="flex items-center gap-2 rounded-full bg-subject-math px-4 py-2 text-sm font-semibold text-white shadow-md"
        >
          <Sparkles className="h-4 w-4" strokeWidth={2} />
          Perfect Symmetry!
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

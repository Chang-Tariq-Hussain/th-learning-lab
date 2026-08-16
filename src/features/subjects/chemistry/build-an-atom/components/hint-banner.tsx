"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface HintBannerProps {
  hint: string | null;
}

export function HintBanner({ hint }: HintBannerProps) {
  return (
    <AnimatePresence mode="wait">
      {hint ? (
        <motion.div
          key={hint}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="flex items-start gap-2 rounded-lg border border-dashed border-pine-500/40 bg-pine-50 px-3 py-2.5 text-sm text-pine-900 dark:border-pine-300/25 dark:bg-pine-900/20 dark:text-pine-50"
        >
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
          {hint}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { CheckStatus } from "./equation-display";

export interface FeedbackBannerProps {
  status: CheckStatus;
  explanation: string;
}

/** Reserves its own height (via the wrapper's min-height) even when idle, so nothing else on the page shifts when feedback appears. */
export function FeedbackBanner({ status, explanation }: FeedbackBannerProps) {
  return (
    <div className="flex min-h-[3.5rem] w-full max-w-md flex-col items-center justify-center text-center">
      <AnimatePresence mode="wait">
        {status === "correct" ? (
          <motion.div
            key="correct"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="flex flex-col items-center gap-1"
          >
            <span className="text-xl font-semibold text-[#1F7A4C] dark:text-[#7FD9A8]">
              &#9989; Correct!
            </span>
            <span className="text-sm text-ink-soft dark:text-bone-soft">{explanation}</span>
          </motion.div>
        ) : status === "incorrect" ? (
          <motion.div
            key="incorrect"
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="text-xl font-semibold text-[#C23B38] dark:text-[#F0918F]"
          >
            &#10060; Try Again
          </motion.div>
        ) : (
          <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
        )}
      </AnimatePresence>
    </div>
  );
}

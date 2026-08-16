"use client";

import { AnimatePresence, motion } from "framer-motion";
import { TRENDS, type TrendId } from "../periodic-trends-model";

interface TrendExplanationProps {
  trend: TrendId;
}

/** Direction legend + short "why" text for the active trend — the visual arrows plus a couple of student-friendly sentences. */
export function TrendExplanation({ trend }: TrendExplanationProps) {
  const meta = TRENDS[trend];

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <AnimatePresence mode="wait">
        <motion.div
          key={trend}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{meta.question}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide"
              style={{ borderColor: `${meta.color}55`, color: meta.color }}
            >
              <span className="text-sm leading-none">{meta.acrossArrow}</span>
              {meta.acrossLabel}
            </span>
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide"
              style={{ borderColor: `${meta.color}55`, color: meta.color }}
            >
              <span className="text-sm leading-none">{meta.downArrow}</span>
              {meta.downLabel}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2 text-[11px] font-mono uppercase tracking-wide text-ink-soft dark:text-bone-soft">
            <span>Low</span>
            <span
              className="h-2 flex-1 rounded-full"
              style={{ background: `linear-gradient(to right, ${meta.color}1f, ${meta.color})` }}
            />
            <span>High</span>
          </div>

          <ul className="mt-3 space-y-1.5">
            {meta.why.map((line) => (
              <li key={line} className="flex gap-2 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
                <span aria-hidden className="mt-1 h-1 w-1 shrink-0 rounded-full bg-ink/30 dark:bg-bone/30" />
                {line}
              </li>
            ))}
          </ul>

          {trend === "electronegativity" ? (
            <p className="mt-3 rounded-full border border-line px-3 py-1.5 text-center text-xs font-medium text-ink-soft dark:border-line-dark dark:text-bone-soft">
              Fluorine (F) has the highest electronegativity of any element.
            </p>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

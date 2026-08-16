"use client";

import { useState } from "react";
import { Check, Lightbulb } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CHALLENGE_QUESTIONS } from "../model";

function ChallengeCard({ index }: { index: number }) {
  const item = CHALLENGE_QUESTIONS[index]!;
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03] sm:p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">Question {index + 1}</p>
      <p className="mt-2 font-display text-base font-medium leading-relaxed text-ink dark:text-bone">{item.question}</p>

      {!revealed ? (
        <Button variant="secondary" size="sm" className="mt-3" onClick={() => setRevealed(true)}>
          <Lightbulb className="h-4 w-4" strokeWidth={1.75} />
          Show Answer
        </Button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 flex items-start gap-2 text-sm"
          >
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#5A9E6F]" strokeWidth={2} />
            <p className="leading-relaxed text-ink-soft dark:text-bone-soft">{item.answer}</p>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

/** Level 11 — five reveal-style recap questions, immediate feedback, no scoring. */
export function Level11Challenge() {
  return (
    <div className="flex flex-col gap-5">
      <p className="max-w-2xl text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        A quick recap. Think through each question, then reveal the answer to check yourself.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CHALLENGE_QUESTIONS.map((q, i) => (
          <ChallengeCard key={q.id} index={i} />
        ))}
      </div>
    </div>
  );
}

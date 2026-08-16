"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EXAMPLES, ION_COLOR, type ArrheniusExample } from "../arrhenius-model";

interface ExamplePickerProps {
  selected: string | null;
  onSelect: (example: ArrheniusExample) => void;
}

const ROLE_COLOR: Record<ArrheniusExample["role"], string> = {
  acid: ION_COLOR["h-plus"],
  base: ION_COLOR["oh-minus"],
  "neutral-reference": ION_COLOR.spectator,
};

export function ExamplePicker({ selected, onSelect }: ExamplePickerProps) {
  const active = EXAMPLES.find((e) => e.slug === selected) ?? null;

  return (
    <div className="flex flex-col gap-3">
      <div role="group" aria-label="Choose an example" className="flex flex-wrap gap-2">
        {EXAMPLES.map((example) => {
          const isSelected = example.slug === selected;
          const color = ROLE_COLOR[example.role];
          return (
            <button
              key={example.slug}
              type="button"
              onClick={() => onSelect(example)}
              aria-pressed={isSelected}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-sm font-medium transition-colors",
                "border-line dark:border-line-dark",
                isSelected
                  ? "border-transparent bg-white dark:bg-white/[0.06]"
                  : "bg-white/40 hover:border-ink/25 dark:bg-white/[0.02] dark:hover:border-bone/25",
              )}
              style={isSelected ? { boxShadow: `0 0 0 2px ${color}` } : undefined}
            >
              <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: color }} />
              {example.formula}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {active ? (
          <motion.div
            key={active.slug}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="rounded-card border border-line bg-white/60 p-3 text-sm dark:border-line-dark dark:bg-white/[0.03]"
          >
            <p className="font-medium text-ink dark:text-bone">
              {active.formula} &rarr; <span style={{ color: ROLE_COLOR[active.role] }}>{active.classificationLabel}</span>
            </p>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">{active.blurb}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

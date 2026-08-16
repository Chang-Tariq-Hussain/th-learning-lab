"use client";

import { FAMILIAR_OBJECTS } from "../measurement-model";
import { OBJECT_ICONS } from "./object-icons";

/** Level 1 — What is Measurement? A short, concrete intro: measurement compares an object with a standard unit. */
export function WhatIsMeasurementPanel() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6">
      <p className="text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Look around and you&apos;ll see objects everywhere — how long is each one?
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        {FAMILIAR_OBJECTS.map((obj) => {
          const Icon = OBJECT_ICONS[obj.icon];
          return (
            <div
              key={obj.id}
              className="flex flex-col items-center gap-2 rounded-card border border-line bg-white/60 px-4 py-4 dark:border-line-dark dark:bg-white/[0.03]"
            >
              <Icon className="h-7 w-7 text-subject-math" strokeWidth={1.5} />
              <span className="font-mono text-xs text-ink dark:text-bone">{obj.name}</span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-sm text-ink dark:text-bone">
        <span className="rounded-full border border-line px-3 py-1.5 dark:border-line-dark">Object</span>
        <span className="text-ink-soft dark:text-bone-soft">+</span>
        <span className="rounded-full border border-line px-3 py-1.5 dark:border-line-dark">Unit</span>
        <span className="text-ink-soft dark:text-bone-soft">=</span>
        <span className="rounded-full border border-subject-math bg-subject-math-soft px-3 py-1.5 text-subject-math dark:bg-subject-math/15">
          Measurement
        </span>
      </div>

      <p className="rounded-card border border-line px-4 py-3 text-center text-sm leading-relaxed text-ink-soft dark:border-line-dark dark:text-bone-soft">
        Measurement compares an object with a standard unit — that&apos;s what lets everyone agree on how long
        something is, no matter who measures it.
      </p>
    </div>
  );
}

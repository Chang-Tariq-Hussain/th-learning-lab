"use client";

import { RulerTrack } from "./ruler-track";
import { RULER_INTRO_MAX_CM, RULER_INTRO_OBJECT_CM } from "../measurement-model";

/**
 * Level 2 — The Ruler. One object (a pencil) starting exactly at the
 * ruler's zero mark — the simplest possible reading, and the
 * foundation the next levels build on.
 */
export function RulerIntroPanel() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
      <p className="text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Drag the pencil along the ruler. Notice it starts at the zero mark — that&apos;s the reference point every
        measurement begins from.
      </p>
      <RulerTrack maxCm={RULER_INTRO_MAX_CM} objectLengthCm={RULER_INTRO_OBJECT_CM} objectLabel="Pencil" />
    </div>
  );
}

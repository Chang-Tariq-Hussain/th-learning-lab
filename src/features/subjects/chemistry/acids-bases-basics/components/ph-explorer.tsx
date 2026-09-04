"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  CLASSIFICATION_COLOR,
  classificationLabel,
  ionBarsForPH,
  substanceFromPH,
} from "../acids-bases-model";
import { PhScale } from "./ph-scale";
import { ParticleView } from "./particle-view";

/** Interactive pH mode: drag anywhere from 0 to 14 and watch the
 *  classification, ion balance, and particle view respond live. */
export function PhExplorer() {
  const [ph, setPh] = useState(7);
  const solution = substanceFromPH(ph);
  const color = CLASSIFICATION_COLOR[solution.classification];
  const { hBars, ohBars } = ionBarsForPH(ph);

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-card border border-line bg-white/40 p-4 dark:border-line-dark dark:bg-white/[0.02] sm:p-6">
        <PhScale markers={[{ substance: solution, label: `pH ${solution.approxPH}` }]} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="ph-slider" className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">
          Drag to set pH
        </label>
        <input
          id="ph-slider"
          type="range"
          min={0}
          max={14}
          step={0.5}
          value={ph}
          onChange={(e) => setPh(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-[#E0663D] via-[#5A9E6F] to-[#3D6FE0] accent-ink dark:accent-bone"
          aria-valuenow={ph}
          aria-valuemin={0}
          aria-valuemax={14}
        />
      </div>

      <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-display text-lg font-medium text-ink dark:text-bone">pH {solution.approxPH}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{solution.blurb}</p>
          </div>
          <span
            className="shrink-0 rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide"
            style={{ background: `${color}1f`, color }}
          >
            {classificationLabel(solution.classification)}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">H⁺</p>
            <div className="mt-1 flex h-3 gap-0.5">
              {[...Array(6)].map((_, i) => (
                <span
                  key={i}
                  className={cn("flex-1 rounded-sm", i >= hBars && "bg-ink/10 dark:bg-bone/10")}
                  style={i < hBars ? { background: CLASSIFICATION_COLOR.acidic } : undefined}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">OH⁻</p>
            <div className="mt-1 flex h-3 gap-0.5">
              {[...Array(6)].map((_, i) => (
                <span
                  key={i}
                  className={cn("flex-1 rounded-sm", i >= ohBars && "bg-ink/10 dark:bg-bone/10")}
                  style={i < ohBars ? { background: CLASSIFICATION_COLOR.basic } : undefined}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <ParticleView substance={solution} />
        </div>
      </div>
    </div>
  );
}

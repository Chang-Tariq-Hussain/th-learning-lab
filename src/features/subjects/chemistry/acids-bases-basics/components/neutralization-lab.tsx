"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CLASSIFICATION_COLOR, SUBSTANCES, classificationLabel, computeNeutralization } from "../acids-bases-model";

const ACIDS = SUBSTANCES.filter((s) => s.classification === "acidic");
const BASES = SUBSTANCES.filter((s) => s.classification === "basic");

/** A simple, deliberately non-rigorous "add base to acid, watch it
 *  neutralize" experience: H⁺ and OH⁻ combine one-for-one into water
 *  until one side runs out, and whichever side has leftover ions
 *  determines whether the mixture ends up acidic, basic, or neutral. */
export function NeutralizationLab() {
  const [acidSlug, setAcidSlug] = useState(ACIDS[0]!.slug);
  const [baseSlug, setBaseSlug] = useState(BASES[0]!.slug);
  const [percentAdded, setPercentAdded] = useState(0);

  const acid = ACIDS.find((s) => s.slug === acidSlug) ?? ACIDS[0]!;
  const base = BASES.find((s) => s.slug === baseSlug) ?? BASES[0]!;

  const result = useMemo(() => computeNeutralization(acid, base, percentAdded), [acid, base, percentAdded]);
  const color = CLASSIFICATION_COLOR[result.classification];

  const hIons = [...Array(result.leftoverH)];
  const ohIons = [...Array(result.leftoverOH)];
  const waterMolecules = [...Array(result.waterFormed)];

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">Acid</label>
          <select
            value={acidSlug}
            onChange={(e) => {
              setAcidSlug(e.target.value);
              setPercentAdded(0);
            }}
            className="mt-1 w-full rounded-card border border-line bg-white/60 px-3 py-2 text-sm text-ink dark:border-line-dark dark:bg-white/[0.03] dark:text-bone"
          >
            {ACIDS.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name} (pH ≈ {s.approxPH})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">Base</label>
          <select
            value={baseSlug}
            onChange={(e) => {
              setBaseSlug(e.target.value);
              setPercentAdded(0);
            }}
            className="mt-1 w-full rounded-card border border-line bg-white/60 px-3 py-2 text-sm text-ink dark:border-line-dark dark:bg-white/[0.03] dark:text-bone"
          >
            {BASES.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name} (pH ≈ {s.approxPH})
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-center font-mono text-sm text-ink-soft dark:text-bone-soft">
        {acid.name} + {base.name} → salt + water
      </p>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="base-slider" className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">
            Add base
          </label>
          <span className="font-mono text-xs text-ink-soft dark:text-bone-soft">{percentAdded}%</span>
        </div>
        <input
          id="base-slider"
          type="range"
          min={0}
          max={150}
          step={5}
          value={percentAdded}
          onChange={(e) => setPercentAdded(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-ink/10 accent-ink dark:bg-bone/10 dark:accent-bone"
        />
        <div className="flex justify-between font-mono text-[10px] text-ink-soft/70 dark:text-bone-soft/70">
          <span>None added</span>
          <span>Exact match (100%)</span>
          <span>Excess base</span>
        </div>
      </div>

      <div className="rounded-card border border-line bg-white/40 p-4 dark:border-line-dark dark:bg-white/[0.02]">
        <div className="relative flex h-28 flex-wrap items-center justify-center gap-2 overflow-hidden">
          {hIons.map((_, i) => (
            <motion.span
              key={`h-${i}`}
              layout
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex h-7 w-7 items-center justify-center rounded-full font-mono text-[10px] font-medium text-paper"
              style={{ background: CLASSIFICATION_COLOR.acidic }}
            >
              H⁺
            </motion.span>
          ))}
          {ohIons.map((_, i) => (
            <motion.span
              key={`oh-${i}`}
              layout
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex h-7 w-7 items-center justify-center rounded-full font-mono text-[10px] font-medium text-paper"
              style={{ background: CLASSIFICATION_COLOR.basic }}
            >
              OH⁻
            </motion.span>
          ))}
          {waterMolecules.map((_, i) => (
            <motion.span
              key={`w-${i}`}
              layout
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.7 }}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-ink/15 font-mono text-[9px] text-ink-soft dark:border-bone/20 dark:text-bone-soft"
            >
              H₂O
            </motion.span>
          ))}
          {result.acidUnits === 0 ? null : hIons.length === 0 && ohIons.length === 0 && waterMolecules.length === 0 ? (
            <p className="text-xs text-ink-soft dark:text-bone-soft">Slide &ldquo;Add base&rdquo; to begin mixing.</p>
          ) : null}
        </div>
      </div>

      <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-display text-base font-medium text-ink dark:text-bone">
              Result: pH ≈ {result.approxPH.toFixed(1)}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
              {result.waterFormed} H⁺/OH⁻ pair{result.waterFormed === 1 ? "" : "s"} combined into water.{" "}
              {result.leftoverH > 0
                ? `${result.leftoverH} H⁺ left over — still acidic.`
                : result.leftoverOH > 0
                  ? `${result.leftoverOH} OH⁻ left over — now basic.`
                  : "No ions left over — fully neutralized."}
            </p>
          </div>
          <span
            className={cn("shrink-0 rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide")}
            style={{ background: `${color}1f`, color }}
          >
            {classificationLabel(result.classification)}
          </span>
        </div>
      </div>
    </div>
  );
}

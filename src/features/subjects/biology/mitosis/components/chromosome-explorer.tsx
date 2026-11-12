"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { HOMOLOG_COLOR, HOMOLOG_NAME } from "../../meiosis/engine/palette";
import type { ChromatidState } from "../engine/beats";
import { chromosomeTag, homologOf, pairOf, sideOf, type MitosisPlan } from "../engine/plan";
import { kinetochorePoint, widthOf } from "../engine/shapes";
import { ChromatidView, STAGE_STYLE } from "./lab-stage";

type Mode = "single" | "dup";
const S = 2.6;
const OX = 320;
const OY = 186;

const noop = () => undefined;

function Helix({ x, color, label }: { x: number; color: string; label: string }) {
  const pts = (ph: number) =>
    Array.from({ length: 41 }, (_, i) => {
      const y = i * 4;
      return `${i === 0 ? "M" : "L"}${(x + 16 * Math.sin(i * 0.5 + ph)).toFixed(1)} ${(20 + y).toFixed(1)}`;
    }).join(" ");
  return (
    <g aria-label={label}>
      <path d={pts(0)} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" />
      <path d={pts(Math.PI)} fill="none" stroke="var(--m-ink)" strokeOpacity={0.55} strokeWidth={4} strokeLinecap="round" />
      {Array.from({ length: 20 }, (_, i) => {
        const a = 16 * Math.sin(i * 2 * 0.5);
        const b = 16 * Math.sin(i * 2 * 0.5 + Math.PI);
        return <line key={i} x1={x + a} x2={x + b} y1={20 + i * 8} y2={20 + i * 8} stroke="var(--m-ink)" strokeOpacity={0.25} strokeWidth={1.5} />;
      })}
    </g>
  );
}

export interface ChromosomeExplorerProps {
  plan: MitosisPlan;
  selectedK: number;
  onSelectK: (k: number) => void;
}

/**
 * Chromosome explorer: one chromosome drawn large. Move the slider to watch the sister chromatids of a duplicated
 * chromosome separate as in anaphase; the counts underneath show that one chromosome becomes two.
 */
export function ChromosomeExplorer({ plan, selectedK, onSelectK }: ChromosomeExplorerProps) {
  const [mode, setMode] = useState<Mode>("dup");
  const [t, setT] = useState(0);
  const k = Math.min(selectedK, plan.n - 1);
  const dup = mode === "dup";
  const split = dup && t > 0.02;
  const color = HOMOLOG_COLOR[homologOf(k)];
  const delta = widthOf(1) / 2 + 1.4;

  const stateFor = (s: 0 | 1): ChromatidState => {
    const side = sideOf(plan, { k, s });
    if (!dup) return { x: 0, y: 0, rot: 0, fold: 0, splay: 0, op: s === 0 ? 1 : 0, cond: 1, kin: 0, fib: 0 };
    return { x: side * (delta + 92 * t), y: 0, rot: side * 90 * t, fold: t, splay: 6 * (1 - t), op: 1, cond: 1, kin: 1, fib: 1 };
  };
  const st0 = stateFor(0);
  const st1 = stateFor(1);
  const sideL = sideOf(plan, { k, s: 0 }) === -1 ? 0 : 1;
  const left = sideL === 0 ? st0 : st1;
  const right = sideL === 0 ? st1 : st0;
  const g = (x: number, y: number): [number, number] => [OX + x * S, OY + y * S];
  const spec = plan.specs[pairOf(k)]!;
  const top = -spec.centromere * spec.length;

  const chromosomes = dup ? (split ? 2 : 1) : 1;
  const chromatids = dup ? 2 : 1;
  const stats = [
    ["Chromosomes (centromeres)", chromosomes, "chromosomes"],
    ["Chromatids (DNA molecules)", chromatids, "chromatids"],
    ["Centromeres", chromosomes, "centromeres"],
    ["Kinetochores", dup ? 2 : 0, "kinetochores"],
  ] as const;

  const Label = ({ x, y, tx, ty, text, anchor = "middle" }: { x: number; y: number; tx: number; ty: number; text: string; anchor?: "start" | "middle" | "end" }) => (
    <g pointerEvents="none">
      <line x1={x} y1={y} x2={tx} y2={ty + (ty < y ? 4 : -12)} stroke="var(--m-ink)" strokeOpacity={0.6} strokeWidth={1.4} />
      <circle cx={x} cy={y} r={3.2} fill="var(--m-ink)" />
      <text x={tx} y={ty} textAnchor={anchor} fontSize={14} fontWeight={600} fill="var(--m-ink)" stroke="var(--m-halo)" strokeWidth={4} paintOrder="stroke">
        {text}
      </text>
    </g>
  );

  const [kx, ky] = kinetochorePoint(left, -1);
  const [cx0, cy0] = g(0, 0);
  const [lkx, lky] = g(kx, ky);
  const [lx, ly] = g(left.x, top * 0.55 + (dup ? 0 : 0));

  return (
    <section aria-label="Chromosome explorer" className="mito-root flex flex-col gap-5" data-testid="chromosome-explorer">
      <style>{STAGE_STYLE}</style>
      <div>
        <h2 className="font-display text-xl font-medium text-ink dark:text-bone">Chromosome explorer: one chromosome, two chromatids, one DNA molecule each</h2>
        <p className="mt-1 max-w-3xl text-sm text-ink-soft dark:text-bone-soft">
          Pick a chromosome, then switch between its states. Drag the slider to separate the sister chromatids the way anaphase does, and watch what the counts do.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="min-w-0 flex flex-col gap-2">
          <div role="radiogroup" aria-label="Chromosome" className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium text-ink-soft dark:text-bone-soft">Chromosome</span>
            {Array.from({ length: plan.n }, (_, i) => (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={k === i}
                data-explorer-chrom={i}
                onClick={() => onSelectK(i)}
                className={cn("flex min-h-9 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink dark:focus-visible:outline-bone", k === i ? "border-subject-biology bg-subject-biology-soft text-subject-biology dark:bg-subject-biology/15" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft")}
              >
                <span className="inline-block h-3 w-3 rounded-sm" style={{ background: HOMOLOG_COLOR[homologOf(i)] }} aria-hidden="true" />
                {chromosomeTag(i)}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-line dark:border-line-dark">
            <svg viewBox="0 0 640 380" className="h-auto w-full rounded-2xl" role="img" aria-label={`Chromosome ${chromosomeTag(k)}: ${dup ? (split ? "two separated chromosomes, each one chromatid" : "one chromosome of two sister chromatids joined at the centromere") : "one chromosome of a single chromatid"}`} data-testid="explorer-diagram" data-chromosomes={chromosomes} data-chromatids={chromatids}>
              <defs>
                <radialGradient id="mito-ex-field" cx="50%" cy="45%" r="75%">
                  <stop offset="0%" style={{ stopColor: "var(--m-field-a)" }} />
                  <stop offset="100%" style={{ stopColor: "var(--m-field-b)" }} />
                </radialGradient>
              </defs>
              <rect width={640} height={380} fill="url(#mito-ex-field)" />
              {dup && t < 0.98 ? (
                <g stroke="var(--m-fiber)" strokeWidth={2} opacity={0.6 * (1 - t)}>
                  <line x1={20} y1={OY} x2={g(left.x, 0)[0] + (kx - left.x) * S} y2={OY + ky * S} />
                  <line x1={620} y1={OY} x2={g(right.x, 0)[0] + (kinetochorePoint(right, 1)[0] - right.x) * S} y2={OY + kinetochorePoint(right, 1)[1] * S} />
                </g>
              ) : null}
              <g transform={`translate(${OX} ${OY}) scale(${S}) translate(${-0} ${-0})`}>
                {([0, 1] as const).map((s) => (
                  <ChromatidView key={s} plan={plan} id={{ k, s }} st={s === 0 ? st0 : st1} level="normal" tag={null} fontSize={5} interactive={false} structInteractive={false} onPick={noop} />
                ))}
              </g>
              {dup && !split ? (
                <>
                  <Label x={cx0} y={cy0} tx={cx0 + 120} ty={OY + 100 + 60} text="Centromere (sisters joined)" anchor="start" />
                  <Label x={lkx} y={lky} tx={60} ty={OY + 150} text="Kinetochore" anchor="start" />
                  <Label x={lx} y={ly} tx={70} ty={50} text="Sister chromatid" anchor="start" />
                  <Label x={g(right.x, top * 0.55)[0]} y={g(0, top * 0.55)[1]} tx={570} ty={50} text="Sister chromatid" anchor="end" />
                  <text x={OX} y={26} textAnchor="middle" fontSize={16} fontWeight={700} fill="var(--m-ink)">
                    1 chromosome = 2 sister chromatids
                  </text>
                </>
              ) : null}
              {!dup ? (
                <text x={OX} y={26} textAnchor="middle" fontSize={16} fontWeight={700} fill="var(--m-ink)">
                  1 chromosome = 1 chromatid (before DNA replication)
                </text>
              ) : null}
              {split ? (
                <>
                  <text x={g(left.x, 0)[0]} y={OY - 128} textAnchor="middle" fontSize={15} fontWeight={700} fill="var(--m-ink)" stroke="var(--m-halo)" strokeWidth={4} paintOrder="stroke">
                    Chromosome
                  </text>
                  <text x={g(right.x, 0)[0]} y={OY - 128} textAnchor="middle" fontSize={15} fontWeight={700} fill="var(--m-ink)" stroke="var(--m-halo)" strokeWidth={4} paintOrder="stroke">
                    Chromosome
                  </text>
                  <text x={OX} y={26} textAnchor="middle" fontSize={16} fontWeight={700} fill="var(--m-ink)">
                    {t > 0.98 ? "2 chromosomes, 1 chromatid each" : "The centromere has split: 2 chromosomes"}
                  </text>
                </>
              ) : null}
            </svg>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div role="radiogroup" aria-label="State of the chromosome" className="flex flex-wrap gap-1.5">
              {(
                [
                  ["single", "Before DNA replication"],
                  ["dup", "After replication"],
                ] as const
              ).map(([v, label]) => (
                <button key={v} type="button" role="radio" aria-checked={mode === v} data-explorer-mode={v} onClick={() => { setMode(v); setT(0); }} className={cn("min-h-9 rounded-full border px-3 text-xs font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink dark:focus-visible:outline-bone", mode === v ? "border-subject-biology bg-subject-biology text-white dark:text-chalkboard" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft")}>
                  {label}
                </button>
              ))}
            </div>
            <label className="flex min-w-48 flex-1 items-center gap-2 text-xs font-medium text-ink-soft dark:text-bone-soft">
              <span className="whitespace-nowrap">Anaphase: separate sisters</span>
              <input type="range" min={0} max={100} step={1} value={Math.round(t * 100)} disabled={!dup} onChange={(e) => setT(Number(e.target.value) / 100)} className="h-2 w-full accent-[#0E8F80]" data-testid="explorer-slider" aria-valuetext={t === 0 ? "sister chromatids joined" : t > 0.98 ? "fully separated" : "separating"} />
            </label>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <dl className="grid grid-cols-2 gap-2" data-testid="explorer-stats">
            {stats.map(([label, v, id]) => (
              <div key={id} className="rounded-xl border border-line bg-white/70 px-3 py-2 dark:border-line-dark dark:bg-white/[0.04]">
                <dt className="text-[11px] text-ink-soft dark:text-bone-soft">{label}</dt>
                <dd className="font-display text-xl font-semibold text-ink dark:text-bone" data-stat={id}>
                  {v}
                </dd>
              </div>
            ))}
          </dl>
          <p className="text-sm leading-snug text-ink dark:text-bone" data-testid="explorer-note">
            {!dup
              ? `Chromosome ${chromosomeTag(k)} (the ${HOMOLOG_NAME[homologOf(k)]} chromosome of pair ${pairOf(k) + 1}) is one long DNA molecule packed with proteins. One DNA molecule = one chromatid = one chromosome.`
              : !split
                ? "After DNA replication the chromosome holds two identical DNA molecules, the sister chromatids, joined at the centromere. It is still ONE chromosome: chromosomes are counted by their centromeres."
                : t < 0.98
                  ? "The cohesion at the centromere has been cut. Now there are two centromeres, so there are two chromosomes, each one chromatid, being pulled toward opposite poles."
                  : "Two separate chromosomes, each with one chromatid (one DNA molecule). They are identical copies and will go into different daughter cells."}
          </p>
          <figure className="rounded-2xl border border-line p-3 dark:border-line-dark">
            <figcaption className="mb-1 text-sm font-medium text-ink dark:text-bone">Zoom in: the DNA</figcaption>
            <svg viewBox="0 0 300 190" className="h-auto w-full" role="img" aria-label={`${chromatids} DNA double helix${chromatids > 1 ? "es" : ""}: one per chromatid`}>
              <g transform="scale(1 0.9)">
                {chromatids === 1 ? <Helix x={150} color={color} label="DNA double helix" /> : (<><Helix x={105} color={color} label="DNA double helix of sister chromatid 1" /><Helix x={195} color={color} label="DNA double helix of sister chromatid 2" /></>)}
              </g>
              {chromatids === 2 ? <text x={150} y={182} textAnchor="middle" fontSize={11} fill="var(--m-ink)">two identical copies</text> : null}
            </svg>
            <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">Each chromatid is one very long DNA double helix, wound around proteins and coiled up. Replication makes a second, identical molecule: it does not make a new chromosome.</p>
          </figure>
          <div className="rounded-xl border border-subject-biology/40 bg-subject-biology-soft/60 p-3 text-sm leading-snug text-ink dark:bg-subject-biology/10 dark:text-bone">
            <strong>Key idea:</strong> a duplicated chromosome (two sister chromatids joined at one centromere) counts as one chromosome. After the centromere splits, each chromatid is a chromosome of its own.
          </div>
        </div>
      </div>
    </section>
  );
}

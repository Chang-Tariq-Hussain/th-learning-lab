"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Play, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimulationLayout, usePrefersReducedMotion } from "@/features/simulation";
import { cn } from "@/lib/utils";
import { LANE, ease } from "../engine/beats";
import { HOMOLOG_COLOR, HOMOLOG_NAME } from "../engine/palette";
import { LOCI, allelesOf, chromatidKey, isRecombinant, tetradLanes, type Bit, type ChromatidId, type MeiosisPlan } from "../engine/plan";
import type { StagePick } from "../types";
import { AssortmentExplorer } from "./assortment";
import { ChromatidView, STAGE_STYLE } from "./lab-stage";

const K = 1.7;
const SP = LANE * 1.8;
const CXL = 380;
const CYL = 262;

export interface CrossoverLabProps {
  plan: MeiosisPlan;
  showLabels: boolean;
}

function avoidCentromere(at: number, c: number): number {
  return Math.abs(at - c) < 0.09 ? (at < c ? c - 0.09 : c + 0.09) : at;
}

export function CrossoverLab({ plan, showLabels }: CrossoverLabProps) {
  const reduced = usePrefersReducedMotion();
  const [pair, setPair] = useState(0);
  const [mSis, setMSis] = useState<Bit>(1);
  const [pSis, setPSis] = useState<Bit>(0);
  const [at, setAt] = useState(0.62);
  const [enabled, setEnabled] = useState(true);
  const [t, setT] = useState(0);
  const [first, setFirst] = useState<ChromatidId | null>(null);
  const [msg, setMsg] = useState("Choose which two non-sister chromatids exchange DNA, then press Play exchange.");
  const raf = useRef(0);

  const spec = plan.specs[pair]!;
  const safeAt = avoidCentromere(at, spec.centromere);

  const labPlan = useMemo<MeiosisPlan>(
    () => ({
      ...plan,
      cross: plan.cross.map((_, i) => (i === pair && enabled ? { mSister: mSis, pSister: pSis, at: safeAt } : null)),
      leftHomolog: plan.leftHomolog.map(() => 0 as Bit),
    }),
    [plan, pair, enabled, mSis, pSis, safeAt],
  );
  const lanes = useMemo(() => tetradLanes(labPlan, pair), [labPlan, pair]);

  const stop = useCallback(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = 0;
  }, []);
  useEffect(() => stop, [stop]);

  const play = () => {
    stop();
    if (!enabled) return;
    if (reduced) {
      setT(1);
      return;
    }
    const start = performance.now();
    const dur = 4200;
    const tick = (now: number) => {
      const v = Math.min(1, (now - start) / dur);
      setT(v);
      raf.current = v < 1 ? requestAnimationFrame(tick) : 0;
    };
    setT(0);
    raf.current = requestAnimationFrame(tick);
  };

  const chiOf = (v: number) => (v < 0.5 ? ease(v / 0.5) : 1 - ease((v - 0.5) / 0.5));
  const swapOf = (v: number) => Math.min(1, Math.max(0, (v - 0.45) / 0.15));

  const states = lanes.map((id, k) => {
    const crossing = enabled && ((id.homolog === 0 && id.sister === mSis) || (id.homolog === 1 && id.sister === pSis));
    const sign = k === 1 ? 1 : -1;
    return {
      x: (k - 1.5) * SP,
      y: -(0.5 - spec.centromere) * spec.length,
      rot: 0,
      lead: 0,
      op: 1,
      cond: 1,
      chi: crossing ? chiOf(t) * sign * SP : 0,
      swap: crossing ? swapOf(t) : 0,
    };
  });

  const reset = (msgText?: string) => {
    stop();
    setT(0);
    setFirst(null);
    if (msgText) setMsg(msgText);
  };

  const handlePick = (p: StagePick) => {
    if (p.kind !== "chromatid" || p.id.pair !== pair) return;
    const id = p.id;
    if (!first) {
      setFirst(id);
      setMsg(`Selected the ${HOMOLOG_NAME[id.homolog]} chromatid. Now click a chromatid from the OTHER chromosome (the other colour).`);
      return;
    }
    if (first.homolog === id.homolog) {
      setFirst(id.sister === first.sister ? first : id);
      setMsg("Those are sister chromatids of the same chromosome. Crossing over happens between NON-sister chromatids, so pick one from the other colour.");
      return;
    }
    const m = first.homolog === 0 ? first : id;
    const pp = first.homolog === 1 ? first : id;
    setMSis(m.sister);
    setPSis(pp.sister);
    reset("Non-sister chromatids selected. Press Play exchange, or drag the slider to step through it.");
  };

  const randomise = () => {
    setPair(Math.floor(Math.random() * plan.pairs));
    setMSis(Math.random() < 0.5 ? 0 : 1);
    setPSis(Math.random() < 0.5 ? 0 : 1);
    setAt(Math.round((0.08 + Math.random() * 0.84) * 100) / 100);
    setEnabled(Math.random() < 0.9);
    reset("A random crossover was chosen. Press Play exchange.");
  };

  const highlight = new Set<string>();
  if (enabled) {
    lanes.forEach((id) => {
      if ((id.homolog === 0 && id.sister === mSis) || (id.homolog === 1 && id.sister === pSis)) highlight.add(chromatidKey(id));
    });
  }
  if (first) highlight.add(chromatidKey(first));

  const between = safeAt > LOCI[0] && safeAt < LOCI[1];
  const after = lanes.map((id) => ({ id, before: [id.homolog === 0 ? spec.genes[0] : spec.genes[0].toLowerCase(), id.homolog === 0 ? spec.genes[1] : spec.genes[1].toLowerCase()], after: allelesOf(labPlan, id), recomb: isRecombinant(labPlan, id) }));
  const nRecomb = after.filter((a) => a.recomb).length;
  const phase = t < 0.05 ? "Before crossing over: a tetrad of four chromatids" : t < 0.45 ? "Chiasma forming: non-sister chromatids cross" : t < 0.6 ? "DNA beyond the crossing point is exchanged" : t < 0.97 ? "Exchange complete: chromatids straighten" : "After crossing over: two recombinant chromatids";

  const outcome = !enabled
    ? "No crossover on this pair in this meiosis. This really happens: the four chromatids stay parental, so this pair can only give the combinations " + spec.genes[0] + spec.genes[1] + " or " + spec.genes[0].toLowerCase() + spec.genes[1].toLowerCase() + "."
    : between
      ? `The crossover lands between gene ${spec.genes[0]} and gene ${spec.genes[1]}, so the two chromatids that took part now carry NEW combinations (${spec.genes[0]}${spec.genes[1].toLowerCase()} and ${spec.genes[0].toLowerCase()}${spec.genes[1]}). The two chromatids that did not take part keep the parental combinations.`
      : `The crossover lands outside the two genes. DNA was exchanged, but gene ${spec.genes[0]} and gene ${spec.genes[1]} stay on the same side of it, so their allele combinations do NOT change. Where a crossover lands matters.`;

  return (
    <SimulationLayout
      size="wide"
      stageLabel="Crossing over lab"
      aspect={760 / 540}
      stageCap="62rem"
      stage={
        <div className="meio-root h-full w-full" data-testid="crossover-stage" data-t={t.toFixed(2)}>
          <style>{STAGE_STYLE}</style>
          <svg viewBox="0 0 760 540" className="h-full w-full" role="img" aria-label={`Crossing over lab. ${phase}.`}>
            <defs>
              <radialGradient id="xo-field" cx="50%" cy="45%" r="75%">
                <stop offset="0%" style={{ stopColor: "var(--m-field-a)" }} />
                <stop offset="100%" style={{ stopColor: "var(--m-field-b)" }} />
              </radialGradient>
            </defs>
            <rect width={760} height={540} rx={18} fill="url(#xo-field)" />
            <g transform={`translate(${CXL} ${CYL}) scale(${K})`}>
              {/* gene guides */}
              {LOCI.map((s, k) => {
                const y = (s - 0.5) * spec.length;
                return (
                  <g key={k} pointerEvents="none">
                    <line x1={-SP * 2.3} x2={SP * 2.3} y1={y} y2={y} stroke="var(--m-ink)" strokeOpacity={0.25} strokeDasharray="3 5" />
                    <text x={-SP * 2.35} y={y + 4} textAnchor="end" fontSize={11} fontWeight={700} fill="var(--m-ink)">
                      Gene {spec.genes[k]}
                    </text>
                  </g>
                );
              })}
              {enabled ? (
                <g pointerEvents="none">
                  <line x1={-SP * 2.3} x2={SP * 2.3} y1={(safeAt - 0.5) * spec.length} y2={(safeAt - 0.5) * spec.length} stroke="var(--m-plate)" strokeWidth={1.5} strokeDasharray="6 4" />
                  <text x={SP * 2.35} y={(safeAt - 0.5) * spec.length + 4} fontSize={11} fontWeight={700} fill="var(--m-plate)">
                    crossover point
                  </text>
                </g>
              ) : null}
              {lanes.map((id, k) => (
                <ChromatidView
                  key={chromatidKey(id)}
                  plan={labPlan}
                  id={id}
                  st={states[k]!}
                  level={highlight.has(chromatidKey(id)) ? "selected" : first ? "dim" : "normal"}
                  letters
                  fontSize={12}
                  tag={false}
                  interactive
                  onPick={handlePick}
                />
              ))}
            </g>
            {lanes.map((id, k) => (
              <text key={k} x={CXL + (k - 1.5) * SP * K} y={CYL + (spec.length * K) / 2 + 40} textAnchor="middle" fontSize={showLabels ? 15 : 14} fontWeight={600} fill="var(--m-ink)">
                {HOMOLOG_NAME[id.homolog]} {id.sister + 1}
              </text>
            ))}
            <text x={CXL} y={34} textAnchor="middle" fontSize={17} fontWeight={700} fill="var(--m-ink)" data-testid="xo-phase">
              {phase}
            </text>
          </svg>
        </div>
      }
      readouts={
        <p className="text-center text-sm text-ink dark:text-bone" role="status" aria-live="polite" data-testid="xo-message">
          {msg}
        </p>
      }
      actions={
        <>
          <Button onClick={play} disabled={!enabled} data-testid="xo-play">
            <Play className="h-4 w-4" aria-hidden="true" />
            Play exchange
          </Button>
          <Button variant="secondary" onClick={() => reset("Back to the tetrad before crossing over.")} data-testid="xo-reset">
            Before
          </Button>
          <Button variant="secondary" onClick={() => { stop(); setT(1); }} data-testid="xo-after" disabled={!enabled}>
            After
          </Button>
          <Button variant="ghost" onClick={randomise}>
            <Shuffle className="h-4 w-4" aria-hidden="true" />
            Random crossover
          </Button>
        </>
      }
      controls={
        <div className="flex flex-col gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-bone-soft">1. Homologous pair</p>
            <div role="radiogroup" aria-label="Homologous pair" className="flex flex-wrap gap-1.5">
              {plan.specs.map((s) => (
                <button key={s.index} type="button" role="radio" aria-checked={pair === s.index} data-pair={s.index} onClick={() => { setPair(s.index); reset(); }} className={cn("min-h-10 rounded-full border px-3 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink dark:focus-visible:outline-bone", pair === s.index ? "border-subject-biology bg-subject-biology text-white dark:text-chalkboard" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft")}>
                  Pair {s.index + 1} ({s.genes.join(", ")})
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-bone-soft">2. Which non-sister chromatids?</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {([0, 1] as const).map((h) => (
                <fieldset key={h} className="rounded-xl border border-line p-2 dark:border-line-dark">
                  <legend className="px-1 text-xs font-medium" style={{ color: HOMOLOG_COLOR[h] }}>
                    {HOMOLOG_NAME[h]} chromosome
                  </legend>
                  {([0, 1] as const).map((s) => {
                    const on = (h === 0 ? mSis : pSis) === s;
                    return (
                      <label key={s} className="flex min-h-9 cursor-pointer items-center gap-2">
                        <input type="radio" name={`xo-${h}`} checked={on} onChange={() => { h === 0 ? setMSis(s) : setPSis(s); reset(); }} data-chromatid-choice={`${h}-${s}`} />
                        Chromatid {s + 1}
                      </label>
                    );
                  })}
                </fieldset>
              ))}
            </div>
            <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">You can also click two chromatids of different colours in the picture. A sister chromatid is never the partner: it is an identical copy.</p>
          </div>
          <div>
            <label htmlFor="xo-at" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-bone-soft">
              3. Where does it cross? <span className="font-normal normal-case">{Math.round(safeAt * 100)}% down the chromatid</span>
            </label>
            <input id="xo-at" type="range" min={0.06} max={0.94} step={0.01} value={at} disabled={!enabled} onChange={(e) => { setAt(Number(e.target.value)); reset(); }} className="w-full" data-testid="xo-position" aria-describedby="xo-at-help" />
            <p id="xo-at-help" className="text-xs text-ink-soft dark:text-bone-soft">Crossovers happen at different places each time, but not at the centromere here. Try placing it outside the genes.</p>
          </div>
          <label className="flex min-h-10 cursor-pointer items-center gap-2 text-sm text-ink dark:text-bone">
            <input type="checkbox" checked={enabled} onChange={(e) => { setEnabled(e.target.checked); reset(); }} data-testid="xo-enabled" />
            Crossing over happens on this pair (it does not have to)
          </label>
          <div>
            <label htmlFor="xo-scrub" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-bone-soft">
              Before → After
            </label>
            <input id="xo-scrub" type="range" min={0} max={1} step={0.01} value={t} disabled={!enabled} onChange={(e) => { stop(); setT(Number(e.target.value)); }} className="w-full" data-testid="xo-scrub" aria-valuetext={phase} />
          </div>
        </div>
      }
      explanation={
        <div className="flex flex-col gap-4">
          <section className="rounded-2xl border border-line bg-white/70 p-4 dark:border-line-dark dark:bg-white/[0.04]" aria-label="Before and after" data-testid="xo-table">
            <h3 className="font-display text-lg font-medium text-ink dark:text-bone">Before and after</h3>
            <table className="mt-2 w-full text-sm">
              <caption className="sr-only">Allele combinations on each chromatid before and after crossing over</caption>
              <thead>
                <tr className="text-left text-xs text-ink-soft dark:text-bone-soft">
                  <th scope="col" className="py-1">Chromatid</th>
                  <th scope="col">Before</th>
                  <th scope="col">After</th>
                  <th scope="col">Type</th>
                </tr>
              </thead>
              <tbody>
                {after.map((a, i) => (
                  <tr key={i} className="border-t border-line dark:border-line-dark">
                    <th scope="row" className="py-1 text-left font-medium">
                      <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ background: HOMOLOG_COLOR[a.id.homolog] }} aria-hidden="true" />
                      {HOMOLOG_NAME[a.id.homolog]} {a.id.sister + 1}
                    </th>
                    <td className="font-mono">{a.before.join(" ")}</td>
                    <td className="font-mono font-semibold">{t > 0.97 || !enabled ? a.after.join(" ") : "…"}</td>
                    <td className={cn("text-xs", a.recomb && t > 0.97 ? "font-semibold text-subject-biology" : "text-ink-soft dark:text-bone-soft")}>{t > 0.97 || !enabled ? (a.recomb ? "recombinant" : "parental") : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-sm leading-snug text-ink-soft dark:text-bone-soft" data-testid="xo-outcome">
              {outcome}
            </p>
            {enabled && between ? (
              <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft" data-testid="xo-recomb-count">
                {nRecomb} of the 4 chromatids are recombinant. After meiosis II each chromatid goes to a different gamete, so about half the gametes carry a new combination of these two genes when a crossover falls between them.
              </p>
            ) : null}
          </section>
          <section className="rounded-2xl border border-line bg-white/70 p-4 text-sm leading-relaxed text-ink-soft dark:border-line-dark dark:bg-white/[0.04] dark:text-bone-soft" aria-label="How variation arises">
            <h3 className="font-display text-lg font-medium text-ink dark:text-bone">How meiosis creates variation</h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>
                <strong className="text-ink dark:text-bone">Crossing over</strong> (prophase I) swaps matching DNA segments between non-sister chromatids, making chromatids with new allele combinations. It happens only at a few places, and differs every time.
              </li>
              <li>
                <strong className="text-ink dark:text-bone">Independent assortment</strong> (metaphase I) lets each pair face the poles at random, so maternal and paternal chromosomes are shuffled into the two cells.
              </li>
              <li>Together they mean the four cells from one meiosis differ from each other and from the parent cell. Random fertilization then adds even more variety.</li>
            </ul>
          </section>
          <AssortmentExplorer pairs={plan.pairs} />
        </div>
      }
    />
  );
}

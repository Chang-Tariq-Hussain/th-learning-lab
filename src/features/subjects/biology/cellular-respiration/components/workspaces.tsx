"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { card, eyebrow } from "../../cellular-energy-shared/style";
import { Chip, Label } from "../../cellular-energy-shared/svg-bits";
import {
  ANAEROBIC_RESPIRATION_NOTE,
  ATOM_FLOW,
  CITRIC_PER_GLUCOSE,
  ENERGY_NOTE,
  EQUATION,
  EQUATION_ATOMS,
  FERMENTATION,
  H_PER_ATP_ROUNDED,
  H_PER_FADH2,
  H_PER_NADH,
  TOTAL_FADH2,
  TOTAL_NADH,
  YIELD,
  atpYield,
  carbonLedger,
  carbonTotal,
  type ConditionOptions,
  type FermentationType,
} from "../model";

const chip = (on: boolean) =>
  cn(
    "min-h-10 rounded-full border px-3 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink dark:focus-visible:outline-bone",
    on ? "border-subject-biology bg-subject-biology text-white dark:text-chalkboard" : "border-line text-ink-soft hover:text-ink dark:border-line-dark dark:text-bone-soft dark:hover:text-bone",
  );

/* ================================================================================================ ATP yield explorer */
export function YieldExplorer() {
  const [o, setO] = useState<ConditionOptions>({ shuttle: "malate-aspartate", ratios: "modern", leak: 0 });
  const y = atpYield(o);
  const seg = [
    { k: "Glycolysis (substrate-level)", v: y.glycolysis, c: "var(--ce-adp)" },
    { k: "Pyruvate oxidation", v: y.pyruvate, c: "var(--ce-fuel)" },
    { k: "Citric acid cycle (substrate-level)", v: y.citric, c: "var(--ce-work)" },
    { k: "Oxidative phosphorylation", v: y.oxidative, c: "var(--ce-atp)" },
  ];
  const max = 40;
  const totalH = TOTAL_NADH * H_PER_NADH + TOTAL_FADH2 * H_PER_FADH2;
  return (
    <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-[1.1fr_1fr]" data-testid="yield-explorer">
      <div className={card}>
        <p className={eyebrow}>ATP yield per glucose (estimate)</p>
        <p className="mt-2 text-4xl font-semibold tabular-nums text-ink dark:text-bone" data-testid="yield-total" aria-live="polite">≈ {y.total.toFixed(y.total % 1 === 0 ? 0 : 1)} <span className="text-lg font-normal text-ink-soft dark:text-bone-soft">ATP per glucose</span></p>
        <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">A commonly taught estimate for many eukaryotic cells is <strong>30–32 ATP per glucose</strong>. It is an estimate, not a universal constant: it depends on cell type, shuttle systems, proton leak and the cost of moving ADP, Pi and ATP.</p>
        <div className="mt-3 flex h-8 overflow-hidden rounded-full border border-line dark:border-line-dark" role="img" aria-label={`Stacked bar: ${seg.map((s) => `${s.k} ${s.v.toFixed(1)}`).join(", ")}`}>
          {seg.map((s) => <div key={s.k} style={{ width: `${(s.v / max) * 100}%`, background: s.c }} className="transition-[width] duration-300" />)}
        </div>
        <ul className="mt-2 grid gap-1 text-sm text-ink dark:text-bone">
          {seg.map((s) => (
            <li key={s.k} className="flex items-center gap-2" data-seg={s.k}>
              <span className="h-3 w-3 rounded-sm" style={{ background: s.c }} aria-hidden="true" />
              <span className="flex-1">{s.k}</span>
              <span className="tabular-nums font-semibold">{s.v.toFixed(s.v % 1 === 0 ? 0 : 1)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">Substrate-level ATP: 2 (glycolysis, net) + 2 (citric acid cycle) = 4. Everything else comes from NADH and FADH₂ through oxidative phosphorylation.</p>
      </div>
      <div className="flex flex-col gap-3">
        <div className={card}>
          <p className={eyebrow}>Change the conditions</p>
          <fieldset className="mt-2">
            <legend className="text-xs font-semibold text-ink-soft dark:text-bone-soft">NADH from glycolysis enters mitochondria by</legend>
            <div className="mt-1 flex flex-wrap gap-1.5" role="radiogroup" aria-label="Shuttle system">
              {([["malate-aspartate", "Malate–aspartate shuttle (≈2.5 ATP each)"], ["glycerol-phosphate", "Glycerol-phosphate shuttle (≈1.5 each)"]] as const).map(([id, l]) => (
                <button key={id} type="button" role="radio" aria-checked={o.shuttle === id} className={chip(o.shuttle === id)} onClick={() => setO({ ...o, shuttle: id })} data-shuttle={id}>{l}</button>
              ))}
            </div>
          </fieldset>
          <fieldset className="mt-3">
            <legend className="text-xs font-semibold text-ink-soft dark:text-bone-soft">ATP per NADH / FADH₂</legend>
            <div className="mt-1 flex flex-wrap gap-1.5" role="radiogroup" aria-label="ATP per carrier">
              {([["modern", "Current estimate: 2.5 / 1.5"], ["classic", "Older textbooks: 3 / 2 (gives 36–38)"]] as const).map(([id, l]) => (
                <button key={id} type="button" role="radio" aria-checked={o.ratios === id} className={chip(o.ratios === id)} onClick={() => setO({ ...o, ratios: id })} data-ratios={id}>{l}</button>
              ))}
            </div>
          </fieldset>
          <label className="mt-3 flex items-center justify-between gap-3 text-sm text-ink dark:text-bone">
            <span>Proton leak / losses</span>
            <input type="range" min={0} max={30} step={5} value={Math.round(o.leak * 100)} onChange={(e) => setO({ ...o, leak: Number(e.target.value) / 100 })} className="w-40 accent-[var(--ce-atp)]" aria-label="Percent of oxidative phosphorylation lost to proton leak" data-testid="leak-slider" />
            <span className="w-10 text-right tabular-nums">{Math.round(o.leak * 100)}%</span>
          </label>
        </div>
        <div className={card}>
          <p className={eyebrow}>How NADH and FADH₂ make ATP indirectly</p>
          <table className="mt-2 w-full text-sm" data-testid="carrier-table">
            <caption className="sr-only">Carriers, protons pumped and ATP</caption>
            <thead><tr className="text-left text-xs text-ink-soft dark:text-bone-soft"><th scope="col" className="font-medium">Carrier</th><th scope="col" className="font-medium">Number</th><th scope="col" className="font-medium">H⁺ each</th><th scope="col" className="font-medium">H⁺ total</th></tr></thead>
            <tbody className="text-ink dark:text-bone tabular-nums">
              <tr><th scope="row" className="py-0.5 text-left font-normal">NADH</th><td>{TOTAL_NADH}</td><td>{H_PER_NADH}</td><td>{TOTAL_NADH * H_PER_NADH}</td></tr>
              <tr><th scope="row" className="py-0.5 text-left font-normal">FADH₂</th><td>{TOTAL_FADH2}</td><td>{H_PER_FADH2}</td><td>{TOTAL_FADH2 * H_PER_FADH2}</td></tr>
            </tbody>
          </table>
          <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">{totalH} H⁺ ÷ about {H_PER_ATP_ROUNDED} H⁺ per ATP ≈ {totalH / H_PER_ATP_ROUNDED} ATP (if all NADH enters at Complex I). Carriers are counted per glucose: {TOTAL_NADH} NADH = {YIELD.glycolysis.nadh} (glycolysis) + {YIELD.pyruvate.nadh} (pyruvate oxidation) + {CITRIC_PER_GLUCOSE.nadh} (citric acid cycle); {TOTAL_FADH2} FADH₂ from the cycle.</p>
        </div>
      </div>
    </div>
  );
}

/* ================================================================================================ equation */
export function EquationPanel() {
  const [el, setEl] = useState<"C" | "H" | "O">("C");
  const rows = [-1, 0, 1, 2].map((s) => ({ s, rows: carbonLedger(s) }));
  const names = ["Start: glucose", "After glycolysis", "After pyruvate oxidation", "After citric acid cycle"];
  return (
    <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-2" data-testid="equation-panel">
      <div className={card}>
        <p className={eyebrow}>Overall equation (simplified)</p>
        <p className="mt-2 text-2xl font-semibold text-ink dark:text-bone" data-testid="equation">{EQUATION}</p>
        <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">This is a summary, not a single reaction: it does not describe any of the many intermediate steps. Some of the energy is captured in ATP; the rest is released as heat. {ENERGY_NOTE}</p>
        <table className="mt-3 w-full text-sm">
          <caption className="sr-only">Atom balance</caption>
          <thead><tr className="text-left text-xs text-ink-soft dark:text-bone-soft"><th scope="col" className="font-medium">Atom</th><th scope="col" className="font-medium">Reactants</th><th scope="col" className="font-medium">Products</th></tr></thead>
          <tbody className="tabular-nums text-ink dark:text-bone">
            {(["C", "H", "O"] as const).map((a) => <tr key={a}><th scope="row" className="py-0.5 text-left font-normal">{a}</th><td>{EQUATION_ATOMS.left[a]}</td><td>{EQUATION_ATOMS.right[a]}</td></tr>)}
          </tbody>
        </table>
        <p className="mt-3 text-xs font-semibold text-ink-soft dark:text-bone-soft">Follow an element</p>
        <div className="mt-1 flex gap-1.5" role="radiogroup" aria-label="Element to follow">
          {(["C", "H", "O"] as const).map((a) => <button key={a} type="button" role="radio" aria-checked={el === a} className={chip(el === a)} onClick={() => setEl(a)} data-el={a}>{a === "C" ? "Carbon" : a === "H" ? "Hydrogen" : "Oxygen"}</button>)}
        </div>
        <p className="mt-2 text-sm text-ink dark:text-bone" data-testid="atom-text"><strong>{ATOM_FLOW[el].title}.</strong> {ATOM_FLOW[el].text}</p>
      </div>
      <div className="flex flex-col gap-3">
        <div className={card} data-testid="carbon-accounting">
          <p className={eyebrow}>Carbon accounting (per glucose)</p>
          <ul className="mt-2 flex flex-col gap-1.5 text-sm text-ink dark:text-bone">
            {rows.map(({ s, rows: r }, i) => (
              <li key={s}><strong>{names[i]}:</strong> {r.map((x) => `${x.count} × ${x.molecule} (${x.carbonsEach} C)`).join(" + ")} = <strong>{carbonTotal(r)} C</strong></li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">The 6 carbons are always accounted for: 2 CO₂ leave in pyruvate oxidation and 4 CO₂ in the citric acid cycle.</p>
        </div>
        <div className={card}>
          <p className={eyebrow}>Check the units</p>
          <table className="mt-2 w-full text-sm">
            <caption className="sr-only">Quantities and what they are per</caption>
            <thead><tr className="text-left text-xs text-ink-soft dark:text-bone-soft"><th scope="col" className="font-medium">Step</th><th scope="col" className="font-medium">Per pyruvate / turn</th><th scope="col" className="font-medium">Per glucose</th></tr></thead>
            <tbody className="align-top text-ink dark:text-bone">
              <tr><th scope="row" className="py-0.5 pr-1 text-left font-normal">Glycolysis</th><td>—</td><td>2 pyruvate, net 2 ATP, 2 NADH</td></tr>
              <tr><th scope="row" className="py-0.5 pr-1 text-left font-normal">Pyruvate oxidation</th><td>1 CO₂, 1 NADH, 1 acetyl-CoA (per pyruvate)</td><td>2 CO₂, 2 NADH, 2 acetyl-CoA</td></tr>
              <tr><th scope="row" className="py-0.5 pr-1 text-left font-normal">Citric acid cycle</th><td>2 CO₂, 3 NADH, 1 FADH₂, 1 ATP (per turn)</td><td>4 CO₂, 6 NADH, 2 FADH₂, 2 ATP</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ================================================================================================ aerobic vs fermentation */
export function AerobicPanel() {
  const [o2, setO2] = useState(true);
  const [ferm, setFerm] = useState<FermentationType>("lactic");
  const f = FERMENTATION[ferm];
  const op = (on: boolean) => (on ? 1 : 0.28);
  return (
    <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-[1.3fr_1fr]" data-testid="aerobic-panel">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Oxygen availability">
          <button type="button" role="radio" aria-checked={o2} className={chip(o2)} onClick={() => setO2(true)} data-o2="yes">Oxygen available</button>
          <button type="button" role="radio" aria-checked={!o2} className={chip(!o2)} onClick={() => setO2(false)} data-o2="no">No oxygen</button>
          {!o2 ? (
            <div className="flex gap-1.5" role="radiogroup" aria-label="Fermentation type">
              {(["lactic", "alcoholic"] as FermentationType[]).map((t) => <button key={t} type="button" role="radio" aria-checked={ferm === t} className={chip(ferm === t)} onClick={() => setFerm(t)} data-ferm={t}>{t === "lactic" ? "Lactic acid" : "Alcoholic"}</button>)}
            </div>
          ) : null}
        </div>
        <svg viewBox="0 0 760 420" className="h-auto w-full rounded-2xl border border-line bg-[var(--ce-field-a)] dark:border-line-dark ce-root" role="img" aria-label={o2 ? "With oxygen: glycolysis, pyruvate oxidation, citric acid cycle and the electron transport chain, about 30 to 32 ATP." : `Without oxygen: glycolysis continues, and ${f.name.toLowerCase()} regenerates NAD+, giving 2 ATP.`} data-testid="aerobic-svg">
          <defs><marker id="ce-ae-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="var(--ce-ink)" /></marker></defs>
          <g>
            <rect x={20} y={150} width={140} height={70} rx={14} fill="var(--ce-fuel)" fillOpacity={0.3} stroke="var(--ce-line)" strokeWidth={2.5} />
            <Label x={90} y={180} size={16} weight={800}>Glycolysis</Label>
            <Label x={90} y={202} size={12} weight={500}>2 ATP net · 2 NADH</Label>
            <path d="M 160 185 H 215" stroke="var(--ce-ink)" strokeWidth={4} markerEnd="url(#ce-ae-arrow)" />
            <Label x={190} y={170} size={12} weight={500}>pyruvate</Label>
          </g>
          <g opacity={op(o2)}>
            <rect x={220} y={30} width={520} height={150} rx={16} fill="var(--ce-mito-a)" stroke="var(--ce-membrane)" strokeWidth={3} />
            <Label x={480} y={56} size={14} weight={800}>Mitochondrion (aerobic respiration)</Label>
            <Label x={300} y={110} size={13}>Pyruvate oxidation</Label>
            <Label x={420} y={110} size={13}>Citric acid cycle</Label>
            <Label x={580} y={110} size={13}>ETC + ATP synthase</Label>
            <path d="M 345 105 H 365 M 480 105 H 500" stroke="var(--ce-ink)" strokeWidth={3} markerEnd="url(#ce-ae-arrow)" />
            <Chip x={690} y={110} r={22} color="var(--ce-o2)" text="O₂" fs={13} />
            <Label x={480} y={160} size={14} weight={800}>≈ 30–32 ATP per glucose in total · products CO₂ + H₂O</Label>
            <path d="M 215 185 C 230 170, 230 130, 250 112" stroke="var(--ce-ink)" strokeWidth={3} fill="none" markerEnd="url(#ce-ae-arrow)" />
          </g>
          <g opacity={op(!o2)}>
            <rect x={220} y={250} width={520} height={130} rx={16} fill="var(--ce-adp)" fillOpacity={0.2} stroke="var(--ce-adp)" strokeWidth={3} />
            <Label x={480} y={278} size={14} weight={800}>{f.name}</Label>
            <Label x={480} y={308} size={13} weight={500}>{f.steps}</Label>
            <Label x={480} y={338} size={13}>Products: {f.products}</Label>
            <Label x={480} y={366} size={14} weight={800}>2 ATP per glucose (from glycolysis only)</Label>
            <path d="M 215 205 C 225 230, 230 255, 250 262" stroke="var(--ce-ink)" strokeWidth={3} fill="none" markerEnd="url(#ce-ae-arrow)" />
            <path d="M 300 380 C 200 410, 60 410, 70 232" stroke="var(--ce-nadh)" strokeWidth={4} fill="none" markerEnd="url(#ce-ae-arrow)" className={!o2 ? "ce-flow" : undefined} />
            <Label x={160} y={405} size={13}>NAD⁺ regenerated → glycolysis continues</Label>
          </g>
        </svg>
      </div>
      <div className="flex flex-col gap-3">
        <div className={card} data-testid="aerobic-text">
          {o2 ? (
            <>
              <p className={eyebrow}>Aerobic respiration</p>
              <p className="mt-1 text-sm text-ink dark:text-bone">Oxygen is the final electron acceptor of the electron transport chain. The chain keeps NADH and FADH₂ recycling to NAD⁺ and FAD, supports oxidative phosphorylation, and the citric acid cycle can run.</p>
            </>
          ) : (
            <>
              <p className={eyebrow}>When oxygen is unavailable</p>
              <p className="mt-1 text-sm text-ink dark:text-bone">The chain stalls, NADH is not recycled, and NAD⁺ runs short. Glycolysis needs NAD⁺, so the cell regenerates it by <strong>fermentation</strong>. This keeps glycolysis (2 ATP) going but captures far less energy. {f.name} occurs in: {f.where}.</p>
            </>
          )}
        </div>
        <div className={card}>
          <p className={eyebrow}>Do not confuse</p>
          <p className="mt-1 text-sm text-ink dark:text-bone">{ANAEROBIC_RESPIRATION_NOTE}</p>
        </div>
        <div className={card}>
          <table className="w-full text-sm" data-testid="aero-table">
            <caption className="sr-only">Aerobic respiration compared with fermentation</caption>
            <thead><tr className="text-left text-xs text-ink-soft dark:text-bone-soft"><th scope="col" className="font-medium">&nbsp;</th><th scope="col" className="font-medium">Aerobic</th><th scope="col" className="font-medium">Fermentation</th></tr></thead>
            <tbody className="align-top text-ink dark:text-bone">
              <tr><th scope="row" className="py-0.5 pr-1 text-left text-xs font-semibold">O₂ needed</th><td>Yes</td><td>No</td></tr>
              <tr><th scope="row" className="py-0.5 pr-1 text-left text-xs font-semibold">Electron transport chain</th><td>Yes</td><td>No</td></tr>
              <tr><th scope="row" className="py-0.5 pr-1 text-left text-xs font-semibold">ATP per glucose</th><td>≈ 30–32</td><td>2</td></tr>
              <tr><th scope="row" className="py-0.5 pr-1 text-left text-xs font-semibold">NAD⁺ regenerated by</th><td>ETC (O₂)</td><td>Pyruvate/acetaldehyde reduction</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

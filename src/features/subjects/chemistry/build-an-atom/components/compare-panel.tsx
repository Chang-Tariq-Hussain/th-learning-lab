"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { AtomState } from "../atom-model";
import { chargeSuffix, massNumber, netCharge } from "../atom-model";
import { getElement } from "../elements";
import { compareAtoms } from "../explain";
import { isotopeName } from "../isotopes";
import { PRESETS } from "../presets";
import { AtomVisualization } from "./atom-visualization";
import type { ShellModelId } from "../shells";

const noop = () => {};

function Column({ title, atom, model }: { title: string; atom: AtomState; model: ShellModelId }) {
  return (
    <div className="min-w-0 rounded-lg border border-line p-2 dark:border-line-dark">
      <p className="text-center font-mono text-label uppercase tracking-wide text-ink-soft dark:text-bone-soft">{title}</p>
      <p className="text-center text-sm font-medium text-ink dark:text-bone">{isotopeName(atom)}{netCharge(atom) !== 0 ? ` (${chargeSuffix(netCharge(atom))})` : ""}</p>
      <div className="mx-auto mt-1 aspect-square w-full max-w-[11rem]" aria-hidden="true">
        <AtomVisualization atom={atom} onSelectParticle={noop} shellModel={model} showShellLabels={false} />
      </div>
    </div>
  );
}

/** Experiment D: atom A (a preset or a copy of your atom) next to your live atom B, with a table of what matches. */
export function ComparePanel({ atom, shellModel }: { atom: AtomState; shellModel: ShellModelId }) {
  const [presetId, setPresetId] = useState("c12");
  const [custom, setCustom] = useState<AtomState | null>(null);
  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0]!;
  const a: AtomState = custom ?? preset.atom;
  const b = atom;
  const cmp = compareAtoms(a, b);

  const rows: { label: string; a: string; b: string; same: boolean }[] = [
    { label: "Element", a: getElement(a.protons).name, b: getElement(b.protons).name, same: a.protons === b.protons },
    { label: "Protons", a: String(a.protons), b: String(b.protons), same: a.protons === b.protons },
    { label: "Neutrons", a: String(a.neutrons), b: String(b.neutrons), same: a.neutrons === b.neutrons },
    { label: "Electrons", a: String(a.electrons), b: String(b.electrons), same: a.electrons === b.electrons },
    { label: "Mass number", a: String(massNumber(a)), b: String(massNumber(b)), same: massNumber(a) === massNumber(b) },
    { label: "Net charge", a: netCharge(a) === 0 ? "0" : chargeSuffix(netCharge(a)), b: netCharge(b) === 0 ? "0" : chargeSuffix(netCharge(b)), same: netCharge(a) === netCharge(b) },
  ];

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-ink-soft dark:text-bone-soft">
        Atom B is the atom you are building above. Choose atom A, then change atom B and watch which properties stay the same. Try carbon-12 against carbon-14 for isotopes, or sodium against Na⁺ for ions.
      </p>
      <div className="flex flex-wrap items-end gap-2">
        <label className="flex min-w-0 flex-1 flex-col gap-1 text-label text-ink-soft dark:text-bone-soft">
          Atom A
          <select
            value={custom ? "custom" : presetId}
            onChange={(e) => {
              setCustom(null);
              setPresetId(e.target.value);
            }}
            className="min-h-11 rounded-md border border-line bg-paper px-2 text-base text-ink dark:border-line-dark dark:bg-chalkboard dark:text-bone"
          >
            {custom ? <option value="custom">Copy of my atom</option> : null}
            {PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={() => setCustom({ ...atom })} className="min-h-11 rounded-full border border-line px-4 text-sm font-medium text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone">
          Copy my atom into A
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Column title="Atom A" atom={a} model={shellModel} />
        <Column title="Atom B (yours)" atom={b} model={shellModel} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <caption className="sr-only">Comparison of atom A and atom B</caption>
          <thead>
            <tr className="text-left font-mono text-label uppercase text-ink-soft dark:text-bone-soft">
              <th scope="col" className="py-1 pr-2 font-normal">Property</th>
              <th scope="col" className="py-1 pr-2 font-normal">A</th>
              <th scope="col" className="py-1 pr-2 font-normal">B</th>
              <th scope="col" className="py-1 font-normal">Same?</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-t border-line dark:border-line-dark">
                <th scope="row" className="py-1.5 pr-2 text-left font-medium text-ink dark:text-bone">{r.label}</th>
                <td className="py-1.5 pr-2 font-mono text-ink dark:text-bone">{r.a}</td>
                <td className="py-1.5 pr-2 font-mono text-ink dark:text-bone">{r.b}</td>
                <td className={cn("py-1.5 font-medium", r.same ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300")}>{r.same ? "✓ same" : "✕ differs"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p role="status" aria-live="polite" className="rounded-lg bg-pine-50 px-3 py-2 text-sm font-medium text-pine-900 dark:bg-pine-900/20 dark:text-pine-50">
        {cmp.verdict}
      </p>
    </div>
  );
}

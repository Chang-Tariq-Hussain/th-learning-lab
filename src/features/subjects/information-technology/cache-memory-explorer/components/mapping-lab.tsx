"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { DEFAULT_CONFIG, MAPPING_LABELS, formatPercent, runPattern, summarize, type Mapping } from "../model";
import { Callout, LABEL_CLASS, Panel, SelectField, TONE } from "./ui-bits";

const CACHE_LINES = 8;
const MEMORY_BLOCKS = 32;
const MAPPINGS: Mapping[] = ["direct", "set2", "full"];

function allowedLines(mapping: Mapping, block: number): number[] {
  if (mapping === "direct") return [block % CACHE_LINES];
  if (mapping === "set2") {
    const set = block % (CACHE_LINES / 2);
    return [set * 2, set * 2 + 1];
  }
  return Array.from({ length: CACHE_LINES }, (_, i) => i);
}

function explain(mapping: Mapping, block: number): string {
  if (mapping === "direct") return `Block ${block} → line ${block % CACHE_LINES} only (${block} mod ${CACHE_LINES} = ${block % CACHE_LINES}). One choice, so it is simple and fast to check — but it also means no choice when two blocks want the same line.`;
  if (mapping === "set2") {
    const set = block % (CACHE_LINES / 2);
    return `Block ${block} → set ${set} (${block} mod ${CACHE_LINES / 2} = ${set}), then either of that set’s 2 lines. A little flexibility for a little extra checking.`;
  }
  return `Block ${block} → any of the ${CACHE_LINES} lines. Maximum flexibility, but every line has to be checked to find a block.`;
}

function MappingDiagram({ mapping, block }: { mapping: Mapping; block: number }) {
  const lit = new Set(allowedLines(mapping, block));
  const line = (i: number) => (
    <li
      key={i}
      className={cn(
        "flex h-11 items-center justify-center rounded-md border-2 font-mono text-xs transition-colors",
        lit.has(i)
          ? "border-subject-it bg-subject-it-soft font-semibold text-amber-800 dark:text-amber-300 dark:bg-subject-it/20"
          : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
      )}
    >
      {i}
    </li>
  );
  return (
    <div>
      <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-medium text-ink dark:text-bone">{MAPPING_LABELS[mapping]}</p>
        <p className="font-mono text-[11px] text-amber-800 dark:text-amber-300">
          Memory block {block} ↓ {mapping === "direct" ? "1 possible line" : mapping === "set2" ? "1 set · 2 lines" : `${CACHE_LINES} possible lines`}
        </p>
      </div>
      {mapping === "set2" ? (
        <ul className="grid grid-cols-4 gap-2" aria-label="Cache lines grouped in sets">
          {Array.from({ length: CACHE_LINES / 2 }, (_, s) => (
            <li key={s}>
              <ul className={cn("grid grid-cols-2 gap-1 rounded-lg p-1", lit.has(s * 2) ? "bg-subject-it/10" : "")}>{[s * 2, s * 2 + 1].map(line)}</ul>
              <p className="mt-0.5 text-center text-[10px] text-ink-soft dark:text-bone-soft">set {s}</p>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="grid grid-cols-8 gap-1" aria-label="Cache lines">
          {Array.from({ length: CACHE_LINES }, (_, i) => line(i))}
        </ul>
      )}
      <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">{explain(mapping, block)}</p>
    </div>
  );
}

export function MappingLab() {
  const [block, setBlock] = useState(13);
  const [x, setX] = useState(0);
  const [y, setY] = useState(8);

  const conflict = useMemo(
    () =>
      MAPPINGS.map((mapping) => {
        const addresses = [x, y, x, y, x, y, x, y];
        const run = runPattern({ ...DEFAULT_CONFIG, l1Lines: CACHE_LINES, lineSize: 1, mapping, policy: "lru" }, addresses);
        return { mapping, s: summarize(run.final.stats), steps: run.steps };
      }),
    [x, y],
  );
  const options = Array.from({ length: MEMORY_BLOCKS }, (_, i) => ({ value: i, label: `Block ${i}` }));
  const sameDirectLine = x % CACHE_LINES === y % CACHE_LINES;

  return (
    <div className="flex flex-col gap-5">
      <Callout title="Cache mapping (advanced)">
        Mapping decides which cache line(s) a memory block is allowed to occupy. Fewer choices are cheaper to search; more choices avoid unnecessary evictions. Real caches are usually set-associative, with associativity that varies by design.
      </Callout>

      <Panel title="Where can a block go?" aside={<span className={LABEL_CLASS}>8-line cache · 32 memory blocks</span>}>
        <p className={cn(LABEL_CLASS, "mb-1.5")}>Pick a memory block</p>
        <ul className="mb-4 grid grid-cols-8 gap-1" aria-label="Memory blocks">
          {Array.from({ length: MEMORY_BLOCKS }, (_, i) => {
            const selected = i === block;
            const shares = !selected && i % CACHE_LINES === block % CACHE_LINES;
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setBlock(i)}
                  aria-pressed={selected}
                  aria-label={`Memory block ${i}`}
                  className={cn(
                    "flex h-10 w-full items-center justify-center rounded-md border font-mono text-xs transition-colors",
                    selected ? "border-subject-it bg-subject-it text-white" : shares ? "border-subject-it/60 text-amber-800 dark:text-amber-300" : "border-line text-ink dark:border-line-dark dark:text-bone",
                  )}
                >
                  {i}
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mb-4 text-[11px] text-ink-soft dark:text-bone-soft">Outlined blocks compete for the same line as your pick in a direct-mapped cache.</p>
        <div className="flex flex-col gap-6">
          {MAPPINGS.map((m) => (
            <MappingDiagram key={m} mapping={m} block={block} />
          ))}
        </div>
      </Panel>

      <Panel title="Conflict demo: two blocks, taking turns">
        <div className="flex flex-wrap items-end gap-3">
          <SelectField label="Block X" value={x} options={options} onChange={(v) => setX(Number(v))} />
          <SelectField label="Block Y" value={y} options={options} onChange={(v) => setY(Number(v))} />
          <p className="pb-2 font-mono text-xs text-ink-soft dark:text-bone-soft">X Y X Y X Y X Y</p>
        </div>
        <div className="relative mt-3 overflow-x-auto">
          <table className="w-full min-w-[360px] text-left text-xs">
            <thead>
              <tr className="border-b border-line dark:border-line-dark">
                {["Mapping", "Hits", "Misses", "Hit rate", "Outcomes"].map((h) => (
                  <th key={h} scope="col" className="px-2 py-2 font-mono text-[10px] font-medium uppercase tracking-wide text-ink-soft dark:text-bone-soft">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {conflict.map(({ mapping, s, steps }) => (
                <tr key={mapping} className="border-b border-line/70 last:border-b-0 dark:border-line-dark/70">
                  <th scope="row" className="px-2 py-2 font-medium text-ink dark:text-bone">
                    {MAPPING_LABELS[mapping]}
                  </th>
                  <td className="px-2 py-2 font-mono tabular-nums">{s.hits}</td>
                  <td className="px-2 py-2 font-mono tabular-nums">{s.misses}</td>
                  <td className="px-2 py-2 font-mono tabular-nums">{formatPercent(s.hitRate)}</td>
                  <td className="px-2 py-2">
                    <span className="flex gap-0.5 font-mono">
                      {steps.map((st, i) => (
                        <span key={i} className={cn("rounded px-1 text-[10px]", st.result.hit ? TONE.hit : TONE.miss)}>
                          {st.result.hit ? "✓" : "✕"}
                          <span className="sr-only">{st.result.hit ? "hit" : "miss"}</span>
                        </span>
                      ))}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-ink dark:text-bone">
          {x === y
            ? "X and Y are the same block, so this is just reuse — every mapping hits after the first miss."
            : sameDirectLine
              ? `Blocks ${x} and ${y} map to the same line in a direct-mapped cache (${x} mod 8 = ${y} mod 8 = ${x % CACHE_LINES}), so each evicts the other every time while the other 7 lines sit empty. That is a conflict miss. A 2-way set-associative cache gives them two lines in the set to share, and a fully associative cache can put them anywhere.`
              : `Blocks ${x} and ${y} map to different lines, so no mapping makes them fight. Try X = 0 and Y = 8 to see a conflict.`}
        </p>
      </Panel>
    </div>
  );
}

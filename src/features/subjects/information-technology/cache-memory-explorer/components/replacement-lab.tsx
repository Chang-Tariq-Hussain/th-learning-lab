"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  DEFAULT_CONFIG,
  POLICY_DESCRIPTIONS,
  POLICY_LABELS,
  formatPercent,
  parseSequence,
  runPattern,
  summarize,
  type Policy,
} from "../model";
import { makeBlockLabel } from "./pattern-runner";
import { Callout, LABEL_CLASS, Panel, SelectField, TONE } from "./ui-bits";

const POLICIES: Policy[] = ["fifo", "lru", "random"];
const PRESETS = ["A B C A B D A", "A B C D A B E A B C D E", "A B A C A D A E"];

export function ReplacementLab() {
  const [pattern, setPattern] = useState(PRESETS[0]!);
  const [lines, setLines] = useState(3);
  const parsed = useMemo(() => parseSequence(pattern), [pattern]);
  const label = useMemo(() => makeBlockLabel(parsed.tokens, 1), [parsed.tokens]);

  const runs = useMemo(
    () =>
      POLICIES.map((policy) => ({
        policy,
        run: runPattern({ ...DEFAULT_CONFIG, l1Lines: lines, lineSize: 1, policy, mapping: "full" }, parsed.tokens.map((t) => t.address)),
      })),
    [lines, parsed.tokens],
  );

  const hitsOf = (p: Policy) => runs.find((r) => r.policy === p)?.run.final.stats.hits ?? 0;
  const fifo = hitsOf("fifo");
  const lru = hitsOf("lru");
  const verdict =
    parsed.tokens.length === 0
      ? ""
      : lru === fifo
        ? `FIFO and LRU tie with ${fifo} hit${fifo === 1 ? "" : "s"} on this pattern — a reminder that a policy which reasons better isn’t guaranteed to win every time.`
        : lru > fifo
          ? `LRU scores ${lru - fifo} more hit${lru - fifo === 1 ? "" : "s"} than FIFO here (${lru} vs ${fifo}), because it keeps recently used blocks. That isn’t guaranteed on every pattern.`
          : `FIFO scores ${fifo - lru} more hit${fifo - lru === 1 ? "" : "s"} than LRU here (${fifo} vs ${lru}). LRU doesn’t win on every pattern — try another one.`;

  return (
    <div className="flex flex-col gap-5">
      <Callout title="Replacement policies">
        When a full cache needs room, the policy picks a victim. Real caches use many policies, often cheap approximations of LRU. This lab compares three simple ones on the same accesses.
      </Callout>

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">
          <span className={LABEL_CLASS}>Access pattern (letters A–H or numbers)</span>
          <input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="h-11 w-72 max-w-full rounded-lg border border-line bg-transparent px-3 font-mono text-sm text-ink dark:border-line-dark dark:text-bone"
          />
        </label>
        <SelectField label="Cache size" value={lines} options={[2, 3, 4].map((n) => ({ value: n, label: `${n} lines` }))} onChange={(v) => setLines(Number(v))} />
      </div>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPattern(p)}
            className={cn(
              "min-h-[40px] rounded-full border px-3 py-1 font-mono text-xs",
              pattern === p ? TONE.info : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
            )}
          >
            {p}
          </button>
        ))}
      </div>
      {parsed.error ? <p className="text-xs text-rose-700 dark:text-rose-300">{parsed.error}</p> : null}

      {!parsed.error && parsed.tokens.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {runs.map(({ policy, run }) => {
              const s = summarize(run.final.stats);
              return (
                <Panel key={policy} title={POLICY_LABELS[policy]}>
                  <p className="mb-3 text-xs text-ink-soft dark:text-bone-soft">{POLICY_DESCRIPTIONS[policy]}</p>
                  <p className="mb-3 font-mono text-sm text-ink dark:text-bone">
                    {s.hits} hits · {s.misses} misses · {formatPercent(s.hitRate)}
                  </p>
                  <div className="overflow-x-auto rounded-lg border border-line dark:border-line-dark">
                    <table className="w-full min-w-[280px] text-left text-xs">
                      <thead>
                        <tr className="border-b border-line bg-ink/[0.03] dark:border-line-dark dark:bg-bone/[0.04]">
                          {["Access", "Result", "Cache after", "Evicted"].map((h) => (
                            <th key={h} scope="col" className="px-2 py-1.5 font-mono text-[10px] font-medium uppercase tracking-wide text-ink-soft dark:text-bone-soft">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {run.steps.map((step, i) => {
                          const ways = step.after.levels[0]?.sets[0] ?? [];
                          const victim = step.result.fills[0]?.evictedBlock ?? null;
                          return (
                            <tr key={i} className={cn("border-b border-line/70 last:border-b-0 dark:border-line-dark/70", victim !== null && "bg-rose-50/60 dark:bg-rose-500/5")}>
                              <td className="px-2 py-1.5 font-mono font-semibold text-ink dark:text-bone">{parsed.tokens[i]?.label}</td>
                              <td className="px-2 py-1.5">
                                <span className={step.result.hit ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}>
                                  {step.result.hit ? "✓ Hit" : "✕ Miss"}
                                </span>
                              </td>
                              <td className="px-2 py-1.5 font-mono tracking-wide text-ink dark:text-bone">{ways.map((l) => (l ? label(l.block) : "·")).join(" ")}</td>
                              <td className="px-2 py-1.5 font-mono text-rose-700 dark:text-rose-300">{victim !== null ? label(victim) : "—"}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Panel>
              );
            })}
          </div>
          <Callout tone="neutral" title="What to notice">
            {verdict} Random is seeded, so it gives the same answer every time you run it.
          </Callout>
        </>
      ) : null}
    </div>
  );
}

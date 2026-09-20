"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  DETAIL_LEVEL_LABELS,
  MAPPING_LABELS,
  POLICY_LABELS,
  atLeast,
  formatPercent,
  formatUnits,
  parseSequence,
  runPattern,
  summarize,
  type DetailLevel,
  type Mapping,
  type Policy,
} from "../model";
import { CUSTOM_EXPERIMENT, EXPERIMENTS, MODEL_DISCLAIMER, type ExperimentDef, type RunSpec } from "../content";
import { PatternRunner, effectiveRunConfig } from "./pattern-runner";
import { Callout, LABEL_CLASS, Panel, SelectField, TONE } from "./ui-bits";

const LINES_OPTIONS = [2, 3, 4, 6, 8, 16].map((n) => ({ value: n, label: `${n} lines` }));
const LINE_SIZE_OPTIONS = [1, 2, 4, 8].map((n) => ({ value: n, label: n === 1 ? "1 word" : `${n} words` }));
const POLICY_OPTIONS = (Object.keys(POLICY_LABELS) as Policy[]).map((p) => ({ value: p, label: POLICY_LABELS[p] }));
const MAPPING_OPTIONS = (Object.keys(MAPPING_LABELS) as Mapping[]).map((m) => ({ value: m, label: MAPPING_LABELS[m] }));

function RunCard({
  spec,
  index,
  level,
  onChange,
}: {
  spec: RunSpec;
  index: number;
  level: DetailLevel;
  onChange: (patch: Partial<RunSpec>) => void;
}) {
  const parsed = useMemo(() => parseSequence(spec.pattern), [spec.pattern]);
  const config = useMemo(() => effectiveRunConfig(spec, level), [spec, level]);
  const run = useMemo(() => runPattern(config, parsed.tokens.map((t) => t.address)), [config, parsed.tokens]);

  return (
    <Panel title={spec.label} aside={<span className={LABEL_CLASS}>Run {String.fromCharCode(65 + index)}</span>}>
      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className={LABEL_CLASS}>Access pattern (numbers 0–1023 or letters A–H)</span>
          <input
            type="text"
            value={spec.pattern}
            onChange={(e) => onChange({ pattern: e.target.value })}
            aria-invalid={parsed.error !== null}
            className="h-11 rounded-lg border border-line bg-transparent px-3 font-mono text-sm text-ink dark:border-line-dark dark:text-bone"
          />
        </label>
        {parsed.error ? <p className="text-xs text-rose-700 dark:text-rose-300">{parsed.error}</p> : null}

        <div className="grid grid-cols-2 gap-2">
          <SelectField label="Cache size" value={spec.lines} options={LINES_OPTIONS} onChange={(v) => onChange({ lines: Number(v) })} />
          {atLeast(level, "intermediate") ? (
            <SelectField label="Line size" value={spec.lineSize} options={LINE_SIZE_OPTIONS} onChange={(v) => onChange({ lineSize: Number(v) })} />
          ) : null}
          {atLeast(level, "technical") ? (
            <>
              <SelectField label="Replacement" value={spec.policy} options={POLICY_OPTIONS} onChange={(v) => onChange({ policy: v as Policy })} />
              <SelectField label="Mapping" value={spec.mapping} options={MAPPING_OPTIONS} onChange={(v) => onChange({ mapping: v as Mapping })} />
            </>
          ) : null}
        </div>

        {parsed.error ? null : parsed.tokens.length === 0 ? (
          <p className="text-sm text-ink-soft dark:text-bone-soft">Enter at least one address.</p>
        ) : (
          <PatternRunner
            key={JSON.stringify([spec, level])}
            tokens={parsed.tokens}
            run={run}
            showEvictions={atLeast(level, "intermediate")}
          />
        )}
      </div>
    </Panel>
  );
}

export function ExperimentsLab({
  level,
  onRequireLevel,
}: {
  level: DetailLevel;
  /** Raises the detail level when a chosen experiment needs controls the student can't see yet. */
  onRequireLevel: (level: DetailLevel) => void;
}) {
  const [experiment, setExperiment] = useState<ExperimentDef>(EXPERIMENTS[0]!);
  const [runs, setRuns] = useState<RunSpec[]>(() => EXPERIMENTS[0]!.runs.map((r) => ({ ...r })));
  const [notice, setNotice] = useState<string | null>(null);

  const choose = (exp: ExperimentDef) => {
    setExperiment(exp);
    setRuns(exp.runs.map((r) => ({ ...r })));
    if (!atLeast(level, exp.minLevel)) {
      onRequireLevel(exp.minLevel);
      setNotice(`Switched to ${DETAIL_LEVEL_LABELS[exp.minLevel]} level — this experiment needs controls that level unlocks.`);
    } else {
      setNotice(null);
    }
  };

  const summaries = useMemo(
    () =>
      runs.map((spec) => {
        const parsed = parseSequence(spec.pattern);
        if (parsed.error || parsed.tokens.length === 0) return null;
        const run = runPattern(effectiveRunConfig(spec, level), parsed.tokens.map((t) => t.address));
        return summarize(run.final.stats);
      }),
    [runs, level],
  );

  const all = [...EXPERIMENTS, CUSTOM_EXPERIMENT];
  const edited = JSON.stringify(runs) !== JSON.stringify(experiment.runs);

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-ink-soft dark:text-bone-soft">
        Pick an experiment, read its runs side by side, and step through them. Every field is editable — change a pattern or the cache and compare again.
      </p>

      <div role="radiogroup" aria-label="Choose an experiment" className="flex flex-wrap gap-2">
        {all.map((exp) => {
          const selected = exp.id === experiment.id;
          const locked = !atLeast(level, exp.minLevel);
          return (
            <button
              key={exp.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => choose(exp)}
              className={cn(
                "min-h-[44px] rounded-full border px-3 py-1.5 text-left text-xs font-medium transition-colors",
                selected ? TONE.info : "border-line text-ink-soft hover:border-ink/40 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/40",
              )}
            >
              {exp.number > 0 ? `${exp.number}. ` : ""}
              {exp.title}
              {locked ? <span className="ml-1.5 font-mono text-[10px] opacity-70">· {DETAIL_LEVEL_LABELS[exp.minLevel]}</span> : null}
            </button>
          );
        })}
      </div>

      {notice ? <Callout tone="neutral">{notice}</Callout> : null}

      <Panel title={experiment.number > 0 ? `Experiment ${experiment.number} — ${experiment.title}` : experiment.title}>
        <p className="text-sm text-ink dark:text-bone">
          <span className="font-medium">Goal:</span> {experiment.goal}
        </p>
        {edited ? (
          <button type="button" onClick={() => setRuns(experiment.runs.map((r) => ({ ...r })))} className="mt-2 text-xs font-medium text-amber-800 dark:text-amber-300 underline underline-offset-2">
            Reset runs to the preset
          </button>
        ) : null}
      </Panel>

      <div className={cn("grid grid-cols-1 gap-4", runs.length === 2 && "lg:grid-cols-2", runs.length >= 3 && "lg:grid-cols-3")}>
        {runs.map((spec, i) => (
          <RunCard
            key={`${experiment.id}-${i}`}
            spec={spec}
            index={i}
            level={level}
            onChange={(patch) => setRuns((prev) => prev.map((r, j) => (j === i ? { ...r, ...patch } : r)))}
          />
        ))}
      </div>

      {runs.length > 1 ? (
        <Panel title="Side by side (full run)">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-xs">
              <thead>
                <tr className="border-b border-line dark:border-line-dark">
                  {["Run", "Hits", "Misses", "Hit rate", "Evictions", "Avg. time"].map((h) => (
                    <th key={h} scope="col" className="px-2 py-2 font-mono text-[10px] font-medium uppercase tracking-wide text-ink-soft dark:text-bone-soft">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {runs.map((spec, i) => {
                  const s = summaries[i];
                  return (
                    <tr key={i} className="border-b border-line/70 last:border-b-0 dark:border-line-dark/70">
                      <th scope="row" className="px-2 py-2 font-medium text-ink dark:text-bone">
                        {spec.label}
                      </th>
                      {s ? (
                        <>
                          <td className="px-2 py-2 font-mono tabular-nums">{s.hits}</td>
                          <td className="px-2 py-2 font-mono tabular-nums">{s.misses}</td>
                          <td className="px-2 py-2 font-mono tabular-nums">{formatPercent(s.hitRate)}</td>
                          <td className="px-2 py-2 font-mono tabular-nums">{atLeast(level, "intermediate") ? s.evictions : "—"}</td>
                          <td className="px-2 py-2 font-mono tabular-nums">{formatUnits(Number(s.averageTime.toFixed(2)))}</td>
                        </>
                      ) : (
                        <td colSpan={5} className="px-2 py-2 text-ink-soft dark:text-bone-soft">
                          Fix the pattern to compare.
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[11px] text-ink-soft dark:text-bone-soft">Average time is in simulated units per access. {MODEL_DISCLAIMER}</p>
        </Panel>
      ) : null}

      <Callout title="What to notice">{experiment.observe}</Callout>
    </div>
  );
}

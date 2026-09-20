"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, ListRestart, SkipForward } from "lucide-react";
import {
  DEFAULT_CONFIG,
  atLeast,
  blockOf,
  formatRange,
  summarize,
  type AccessResult,
  type CacheConfig,
  type DetailLevel,
  type Mapping,
  type PatternRun,
  type Policy,
  type SequenceToken,
  type SystemState,
} from "../model";
import { CacheTable, NO_FOCUS, focusFor } from "./cache-table";
import { StatsPanel } from "./stats-panel";
import { ActionButton, ChipStrip } from "./ui-bits";

export interface RunSettings {
  lines: number;
  lineSize: number;
  policy: Policy;
  mapping: Mapping;
}

/**
 * Turns a run's settings into an engine config for the current detail
 * level. The labs use one cache in front of RAM (the two-level model)
 * so every access is a clean hit or a clean miss. Settings the student
 * can't see yet at this level fall back to the simple defaults.
 */
export function effectiveRunConfig(settings: RunSettings, level: DetailLevel): CacheConfig {
  return {
    ...DEFAULT_CONFIG,
    levelCount: 1,
    l1Lines: settings.lines,
    lineSize: atLeast(level, "intermediate") ? settings.lineSize : 1,
    policy: atLeast(level, "technical") ? settings.policy : "lru",
    mapping: atLeast(level, "technical") ? settings.mapping : "full",
  };
}

/** Maps a block back to the letter the student typed (if they used letters). */
export function makeBlockLabel(tokens: SequenceToken[], lineSize: number): (block: number) => string {
  const byBlock = new Map<number, string>();
  for (const t of tokens) {
    if (/^[A-H]$/.test(t.label)) {
      const block = blockOf(t.address, lineSize);
      if (!byBlock.has(block)) byBlock.set(block, t.label);
    }
  }
  return (block) => byBlock.get(block) ?? formatRange(block, lineSize);
}

export interface RunnerContext {
  /** How many accesses have been revealed (0…n). */
  count: number;
  state: SystemState;
  result: AccessResult | undefined;
}

export function PatternRunner({
  tokens,
  run,
  showCache = true,
  showEvictions = true,
  renderExtra,
  cacheTitle = "Cache",
}: {
  tokens: SequenceToken[];
  run: PatternRun;
  showCache?: boolean;
  showEvictions?: boolean;
  renderExtra?: (ctx: RunnerContext) => ReactNode;
  cacheTitle?: string;
}) {
  const n = run.steps.length;
  const [revealed, setRevealed] = useState<number | null>(null);
  const count = revealed === null ? n : Math.min(revealed, n);

  const step = count > 0 ? run.steps[count - 1] : undefined;
  const state = step ? step.after : run.initial;
  const summary = useMemo(() => summarize(state.stats), [state]);
  const blockLabel = useMemo(() => makeBlockLabel(tokens, run.initial.config.lineSize), [tokens, run.initial.config.lineSize]);
  const level = state.levels[0];

  return (
    <div className="flex flex-col gap-3">
      {renderExtra ? renderExtra({ count, state, result: step?.result }) : null}

      <div className="flex flex-wrap gap-2">
        <ActionButton variant="ghost" className="min-h-[40px] px-3" disabled={count === 0} onClick={() => setRevealed(0)}>
          <ListRestart className="h-4 w-4" aria-hidden="true" /> Restart
        </ActionButton>
        <ActionButton variant="ghost" className="min-h-[40px] px-3" disabled={count === 0} onClick={() => setRevealed(Math.max(0, count - 1))}>
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Back
        </ActionButton>
        <ActionButton className="min-h-[40px] px-3" disabled={count >= n} onClick={() => setRevealed(Math.min(n, count + 1))}>
          Step <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </ActionButton>
        <ActionButton variant="ghost" className="min-h-[40px] px-3" disabled={count >= n} onClick={() => setRevealed(null)}>
          <SkipForward className="h-4 w-4" aria-hidden="true" /> Show all
        </ActionButton>
        <span className="self-center font-mono text-[11px] text-ink-soft dark:text-bone-soft">
          {count} of {n} accesses
        </span>
      </div>

      <ChipStrip
        items={run.steps.slice(0, count).map((s, i) => ({ label: tokens[i]?.label ?? String(s.result.address), hit: s.result.hit }))}
        emptyText="Press Step to run the first access."
      />

      <StatsPanel summary={summary} levelCount={1} showEvictions={showEvictions} />

      {showCache && level ? (
        <CacheTable
          level={level}
          lineSize={run.initial.config.lineSize}
          title={cacheTitle}
          focus={step ? focusFor(step.result, "l1") : NO_FOCUS}
          variant={level.lines > 8 ? "grid" : "table"}
          blockLabel={blockLabel}
        />
      ) : null}
    </div>
  );
}

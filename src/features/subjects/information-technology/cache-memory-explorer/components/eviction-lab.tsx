"use client";

import { useMemo, useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DEFAULT_CONFIG,
  POLICY_DESCRIPTIONS,
  POLICY_LABELS,
  atLeast,
  letterAddress,
  summarize,
  type CacheConfig,
  type DetailLevel,
  type Policy,
} from "../model";
import { useLocalMachine } from "../hooks/use-local-machine";
import { CacheTable, NO_FOCUS, focusFor } from "./cache-table";
import { StatsPanel } from "./stats-panel";
import { ActionButton, Callout, ChipStrip, LABEL_CLASS, OutcomeBadge, Panel, Segmented } from "./ui-bits";

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const blockLetter = (block: number) => (block % 16 === 0 && block >= 16 && block <= 128 ? String.fromCharCode(64 + block / 16) : String(block));

function EvictionDemo({ lines, policy }: { lines: number; policy: Policy }) {
  const config: CacheConfig = useMemo(() => ({ ...DEFAULT_CONFIG, l1Lines: lines, lineSize: 1, policy }), [lines, policy]);
  const { system, history, last, access, reset } = useLocalMachine(config);
  const level = system.levels[0]!;
  const summary = summarize(system.stats);

  const filled = level.sets.reduce((n, set) => n + set.filter(Boolean).length, 0);
  const isFull = filled === level.lines;
  const cached = new Set<number>();
  level.sets.forEach((s) => s.forEach((l) => l && cached.add(l.block)));

  const fill = last?.fills[0];
  const evicted = fill && fill.evictedBlock !== null ? fill.evictedBlock : null;

  const fillCache = () => {
    reset();
    LETTERS.slice(0, lines).forEach((l) => access(letterAddress(l)));
  };
  const addOneMore = () => {
    const next = LETTERS.find((l) => !cached.has(letterAddress(l))) ?? "A";
    access(letterAddress(next));
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className={cn(LABEL_CLASS, "mb-1.5")}>Blocks in RAM — tap one for the CPU to request</p>
        <div className="flex flex-wrap gap-2">
          {LETTERS.map((l) => {
            const inCache = cached.has(letterAddress(l));
            return (
              <button
                key={l}
                type="button"
                onClick={() => access(letterAddress(l))}
                aria-label={`Request block ${l}${inCache ? " (in cache)" : ""}`}
                className={cn(
                  "flex h-12 w-12 flex-col items-center justify-center rounded-lg border-2 font-mono text-base font-semibold transition-colors",
                  inCache ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300" : "border-line text-ink dark:border-line-dark dark:text-bone",
                )}
              >
                {l}
                <span className="text-[8px] font-medium uppercase tracking-wide">{inCache ? "cached" : "RAM"}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <ActionButton variant="ghost" className="min-h-[40px] px-3" onClick={fillCache}>
            Fill the cache
          </ActionButton>
          <ActionButton variant="ghost" className="min-h-[40px] px-3" onClick={addOneMore}>
            Add one more block
          </ActionButton>
          <ActionButton variant="ghost" className="min-h-[40px] px-3" onClick={reset}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset
          </ActionButton>
        </div>
      </div>

      <div className="rounded-lg border border-line p-3 dark:border-line-dark" aria-live="polite">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className={LABEL_CLASS}>Capacity</span>
          <span className="font-mono text-sm text-ink dark:text-bone">
            {filled} / {level.lines} lines used
          </span>
          {isFull ? <span className="rounded-full border border-rose-500/60 bg-rose-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-rose-800 dark:bg-rose-500/10 dark:text-rose-300">CACHE FULL</span> : null}
        </div>
        {!last ? (
          <p className="text-sm text-ink-soft dark:text-bone-soft">Request blocks until the cache is full, then request one that isn’t in it.</p>
        ) : last.hit ? (
          <div className="flex flex-wrap items-center gap-2 text-sm text-ink dark:text-bone">
            <OutcomeBadge hit /> Block {blockLetter(last.block)} was already cached — nothing needs to move.
          </div>
        ) : evicted !== null ? (
          <div className="cme-slide flex flex-col gap-2 text-sm text-ink dark:text-bone">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-rose-500/60 bg-rose-50 px-2 py-1 font-medium text-rose-800 dark:bg-rose-500/10 dark:text-rose-300">Cache full</span>
              <ArrowRight className="h-4 w-4 text-ink-soft dark:text-bone-soft" aria-hidden="true" />
              <span className="rounded-md border border-emerald-500/60 bg-emerald-50 px-2 py-1 font-medium text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">
                New block {blockLetter(last.block)} arrives
              </span>
              <ArrowRight className="h-4 w-4 text-ink-soft dark:text-bone-soft" aria-hidden="true" />
              <span className="rounded-md border border-rose-500/60 bg-rose-50 px-2 py-1 font-medium text-rose-800 dark:bg-rose-500/10 dark:text-rose-300">
                Block {blockLetter(evicted)} is replaced
              </span>
            </div>
            <p className="text-ink-soft dark:text-bone-soft">
              {POLICY_LABELS[policy]} chose block {blockLetter(evicted)} as the victim. Which block goes depends on the cache’s organization and replacement policy.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2 text-sm text-ink dark:text-bone">
            <OutcomeBadge hit={false} /> Block {blockLetter(last.block)} was fetched from RAM into a free line — no eviction needed yet.
          </div>
        )}
      </div>

      <StatsPanel summary={summary} levelCount={1} showTime={false} />
      <CacheTable level={level} lineSize={1} title="Cache" focus={last ? focusFor(last, "l1") : NO_FOCUS} blockLabel={blockLetter} />
      <ChipStrip items={history.slice(-40).map((r) => ({ label: blockLetter(r.block), hit: r.hit }))} emptyText="Requests will appear here." />
    </div>
  );
}

export function EvictionLab({ level }: { level: DetailLevel }) {
  const [lines, setLines] = useState(4);
  const [policy, setPolicy] = useState<Policy>("lru");
  const effectivePolicy = atLeast(level, "technical") ? policy : "lru";

  return (
    <div className="flex flex-col gap-5">
      <Callout title="Why a cache must evict">
        A cache is small on purpose. When every line is in use and a new block arrives, something has to be replaced. Which one goes is the job of the replacement policy.
      </Callout>
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        <Segmented label="Cache capacity" options={[2, 4, 8].map((n) => ({ value: n, label: `${n} lines` }))} value={lines} onChange={setLines} />
        {atLeast(level, "technical") ? (
          <Segmented
            label="Replacement policy"
            options={(Object.keys(POLICY_LABELS) as Policy[]).map((p) => ({ value: p, label: POLICY_LABELS[p], hint: POLICY_DESCRIPTIONS[p] }))}
            value={policy}
            onChange={setPolicy}
          />
        ) : (
          <p className="self-end text-xs text-ink-soft dark:text-bone-soft">This cache replaces the least recently used line. Technical level lets you choose.</p>
        )}
      </div>
      <Panel>
        <EvictionDemo key={`${lines}-${effectivePolicy}`} lines={lines} policy={effectivePolicy} />
      </Panel>
    </div>
  );
}

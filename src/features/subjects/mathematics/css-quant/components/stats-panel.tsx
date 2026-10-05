"use client";

import { Panel } from "./panel";
import { accuracyPct, avgSeconds, bestStreak, currentStreak, topicStats, type Result } from "../session";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line px-3 py-2 dark:border-line-dark">
      <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">{label}</p>
      <p className="font-display text-xl text-ink dark:text-bone">{value}</p>
    </div>
  );
}

export function TopicBars({ results }: { results: Result[] }) {
  const stats = topicStats(results);
  if (stats.length === 0) return <p className="text-xs text-ink-soft dark:text-bone-soft">Answer a question to see how each topic is going.</p>;
  return (
    <ul className="flex flex-col gap-2">
      {stats.map((t) => {
        const pct = Math.round((t.correct / t.total) * 100);
        return (
          <li key={t.topic} className="text-xs">
            <div className="flex items-baseline justify-between gap-2">
              <span className="min-w-0 truncate text-ink dark:text-bone">{t.label}</span>
              <span className="shrink-0 font-mono text-ink-soft dark:text-bone-soft">
                {t.correct}/{t.total} · {pct}%
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink/10 dark:bg-bone/10" role="progressbar" aria-label={`${t.label} accuracy`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
              <div className={pct >= 70 ? "h-full bg-emerald-500" : pct >= 40 ? "h-full bg-amber-500" : "h-full bg-red-500"} style={{ width: `${pct}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** Live session numbers. Held in memory only: refreshing the page starts a fresh session. */
export function StatsPanel({ results }: { results: Result[] }) {
  return (
    <div className="flex flex-col gap-4">
      <Panel title="This session">
        <div className="grid grid-cols-2 gap-2">
          <Stat label="Answered" value={String(results.length)} />
          <Stat label="Accuracy" value={results.length ? `${accuracyPct(results)}%` : "—"} />
          <Stat label="Streak" value={String(currentStreak(results))} />
          <Stat label="Avg time" value={results.length ? `${avgSeconds(results).toFixed(0)}s` : "—"} />
        </div>
        <p className="mt-2 text-[11px] text-ink-soft dark:text-bone-soft">Best streak: {bestStreak(results)}. Weakest topics are listed first below.</p>
      </Panel>
      <Panel title="By topic">
        <TopicBars results={results} />
      </Panel>
    </div>
  );
}

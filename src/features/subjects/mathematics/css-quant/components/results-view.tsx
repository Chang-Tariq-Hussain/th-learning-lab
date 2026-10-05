"use client";

import { RotateCcw, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { accuracyPct, avgSeconds, bestStreak, type Result } from "../session";
import { SolutionPanel } from "./question-card";
import { Panel } from "./panel";
import { TopicBars } from "./stats-panel";

const LETTERS = ["A", "B", "C", "D"];
const BTN = "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border px-5 py-2 text-sm font-medium transition-colors";

export function ResultsView({ results, secPerQ, onRetry, onSetup }: { results: Result[]; secPerQ: number; onRetry: () => void; onSetup: () => void }) {
  const correct = results.filter((r) => r.correct).length;
  const pct = accuracyPct(results);
  const missed = results.filter((r) => !r.correct);
  const timedOut = results.filter((r) => r.picked === null).length;
  const tone = pct >= 80 ? "text-emerald-700 dark:text-emerald-300" : pct >= 60 ? "text-amber-700 dark:text-amber-300" : "text-red-700 dark:text-red-300";

  return (
    <div className="flex flex-col gap-5">
      <Panel>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Drill complete</p>
            <p className="font-display text-4xl text-ink dark:text-bone">
              {correct}
              <span className="text-2xl text-ink-soft dark:text-bone-soft"> / {results.length}</span>
            </p>
            <p className={cn("mt-1 font-mono text-lg font-semibold", tone)}>{pct}% accuracy</p>
          </div>
          <dl className="grid grid-cols-3 gap-3 text-center">
            <div>
              <dt className="font-mono text-[10px] uppercase text-ink-soft dark:text-bone-soft">Avg time</dt>
              <dd className="font-display text-xl text-ink dark:text-bone">{avgSeconds(results).toFixed(0)}s</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase text-ink-soft dark:text-bone-soft">Best streak</dt>
              <dd className="font-display text-xl text-ink dark:text-bone">{bestStreak(results)}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase text-ink-soft dark:text-bone-soft">Timed out</dt>
              <dd className="font-display text-xl text-ink dark:text-bone">{secPerQ ? timedOut : "—"}</dd>
            </div>
          </dl>
        </div>
        <p className="mt-3 text-xs text-ink-soft dark:text-bone-soft">
          A useful target while practising is 80% accuracy at a steady pace. Re-drill your weakest topics below until they match your best ones.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={onRetry} className={cn(BTN, "border-subject-math bg-subject-math text-paper hover:opacity-90")}>
            <RotateCcw className="h-4 w-4" strokeWidth={1.75} /> New drill, same settings
          </button>
          <button type="button" onClick={onSetup} className={cn(BTN, "border-line text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40")}>
            <Settings2 className="h-4 w-4" strokeWidth={1.75} /> Change settings
          </button>
        </div>
      </Panel>

      <Panel title="Accuracy by topic (weakest first)">
        <TopicBars results={results} />
      </Panel>

      <Panel title={missed.length ? `Review ${missed.length} missed question${missed.length === 1 ? "" : "s"}` : "Review"}>
        {missed.length === 0 ? (
          <p className="text-sm text-ink dark:text-bone">No mistakes — every answer was correct. Try a harder level or a longer drill.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {missed.map((r, i) => (
              <li key={`${r.q.id}-${i}`}>
                <details className="group rounded-xl border border-line px-3 py-2 dark:border-line-dark">
                  <summary className="cursor-pointer list-none text-sm text-ink dark:text-bone [&::-webkit-details-marker]:hidden">
                    <span className="mr-2 rounded-full bg-subject-math-soft px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-subject-math dark:bg-subject-math/20">{r.q.topicLabel}</span>
                    {r.q.prompt}
                  </summary>
                  <div className="mt-3 flex flex-col gap-3">
                    <p className="text-xs text-ink-soft dark:text-bone-soft">
                      {r.picked === null ? "You ran out of time." : `You chose ${LETTERS[r.picked]}: ${r.q.options[r.picked]}.`} Correct: {LETTERS[r.q.correct]}: {r.q.options[r.q.correct]}.
                    </p>
                    <SolutionPanel q={r.q} correct={false} timedOut={r.picked === null} />
                  </div>
                </details>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

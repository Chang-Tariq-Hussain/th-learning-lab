"use client";

import { useCallback, useEffect, useMemo, useReducer } from "react";
import { ArrowRight, Play, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateQuestion, topicsFor } from "./generators";
import { Panel } from "./components/panel";
import { QuestionCard, SolutionPanel } from "./components/question-card";
import { ResultsView } from "./components/results-view";
import { StatsPanel } from "./components/stats-panel";
import { TrigExplorer } from "./components/trig-explorer";
import { DRILL_COUNTS, TIMER_OPTIONS, initialSession, isTimed, sessionReducer, type DiffSetting, type Mode, type SessionState } from "./session";
import { DIFFICULTY_LABEL, type Difficulty, type ModuleId, type Question } from "./types";

const MODULE_NAME: Record<ModuleId, string> = { ratio: "Ratio, Proportion & Percentage", geometry: "Geometry & Mensuration", trigonometry: "Trigonometry", mixed: "Mixed" };
const DIFF_OPTIONS: Array<{ value: DiffSetting; label: string }> = [
  { value: 1, label: DIFFICULTY_LABEL[1] },
  { value: 2, label: DIFFICULTY_LABEL[2] },
  { value: 3, label: DIFFICULTY_LABEL[3] },
  { value: "mixed", label: "Mixed" },
];

const BTN = "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border px-5 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40";
const BTN_PRIMARY = "border-subject-math bg-subject-math text-paper hover:opacity-90";

function Chip({ active, onClick, children, label }: { active: boolean; onClick: () => void; children: React.ReactNode; label?: string }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      aria-label={label}
      onClick={onClick}
      className={cn("min-h-[40px] rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors", active ? "border-subject-math bg-subject-math text-paper" : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30")}
    >
      {children}
    </button>
  );
}

function pickDifficulty(setting: DiffSetting): Difficulty {
  if (setting !== "mixed") return setting;
  const r = Math.random();
  return r < 0.3 ? 1 : r < 0.75 ? 2 : 3;
}

function make(module: ModuleId, s: Pick<SessionState, "diff" | "topicId">, avoid: string | null): Question {
  return generateQuestion(module, pickDifficulty(s.diff), Math.random, { topicId: s.topicId, avoid });
}

/**
 * CSS-level quantitative ability trainer. One component serves the three subject modules and the mixed drill:
 * generated multiple-choice questions with worked solutions, a fast exam method and the usual trap for each, plus a
 * timed drill with a results review. All state is in memory — nothing is stored, and a refresh starts a fresh session.
 */
export function CssQuantTrainer({ module }: { module: ModuleId }) {
  const [s, dispatch] = useReducer(sessionReducer, module, (m): SessionState => {
    const base = initialSession();
    return m === "mixed" ? { ...base, mode: "drill" } : sessionReducer(base, { type: "start", mode: "practice", question: make(m, base, null), now: Date.now() });
  });
  const topics = useMemo(() => topicsFor(module), [module]);
  const timed = isTimed(s);
  const lastTopic = s.question?.topic ?? null;
  const answered = s.phase === "answered";
  const isLastDrillQuestion = s.mode === "drill" && s.results.length >= s.drillCount;

  const changeMode = (mode: Mode) => {
    if (mode === s.mode) return;
    if (mode === "drill") dispatch({ type: "to-setup", mode });
    else dispatch({ type: "start", mode, question: make(module, s, null), now: Date.now() });
  };

  const patchAndRefresh = (patch: Partial<Pick<SessionState, "diff" | "topicId">>) => {
    dispatch({ type: "settings", patch });
    if (s.mode === "practice") dispatch({ type: "show", question: make(module, { ...s, ...patch }, null), now: Date.now() });
  };

  const startDrill = () => dispatch({ type: "start", mode: "drill", question: make(module, s, null), now: Date.now() });

  const next = useCallback(() => {
    if (s.phase !== "answered") return;
    if (s.mode === "drill" && s.results.length >= s.drillCount) dispatch({ type: "finish" });
    else dispatch({ type: "show", question: make(module, s, lastTopic), now: Date.now() });
  }, [module, s, lastTopic]);

  const pick = useCallback((index: number) => dispatch({ type: "pick", index, now: Date.now() }), []);

  // Countdown: one interval, only while a timed drill question is open. Cleared on every phase change and on unmount.
  useEffect(() => {
    if (!timed || s.phase !== "question") return;
    const id = window.setInterval(() => {
      const now = Date.now();
      if (now - s.startedAt >= s.secPerQ * 1000) dispatch({ type: "timeout", now });
      else dispatch({ type: "tick", now });
    }, 250);
    return () => window.clearInterval(id);
  }, [timed, s.phase, s.startedAt, s.secPerQ]);

  // Keyboard: 1–4 / A–D answer, Enter (or N) moves on.
  useEffect(() => {
    if (s.phase !== "question" && s.phase !== "answered") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const tag = (e.target as HTMLElement | null)?.tagName ?? "";
      if (["INPUT", "SELECT", "TEXTAREA"].includes(tag)) return;
      if (s.phase === "question") {
        const idx = "1234".indexOf(e.key) >= 0 && e.key.length === 1 ? Number(e.key) - 1 : "abcd".indexOf(e.key.toLowerCase());
        if (e.key.length === 1 && idx >= 0 && idx < 4) pick(idx);
      } else if ((e.key === "Enter" && !["BUTTON", "A", "SUMMARY"].includes(tag)) || e.key.toLowerCase() === "n") {
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [s.phase, pick, next]);

  const showSettings = s.mode === "practice" || s.phase === "setup";
  const q = s.question;
  const lastResult = s.results[s.results.length - 1];

  return (
    <div className="flex flex-col gap-5">
      {/* Mode + settings */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Mode">
          <Chip active={s.mode === "practice"} onClick={() => changeMode("practice")}>Practice (untimed, instant solutions)</Chip>
          <Chip active={s.mode === "drill"} onClick={() => changeMode("drill")}>
            <span className="inline-flex items-center gap-1.5">
              <Timer className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden /> Timed drill
            </span>
          </Chip>
        </div>

        {showSettings && (
          <div className="flex flex-col gap-3 rounded-card border border-line p-3 dark:border-line-dark sm:flex-row sm:flex-wrap sm:items-end sm:gap-5">
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Difficulty</span>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Difficulty">
                {DIFF_OPTIONS.map((o) => (
                  <Chip key={String(o.value)} active={s.diff === o.value} onClick={() => patchAndRefresh({ diff: o.value })}>
                    {o.label}
                  </Chip>
                ))}
              </div>
            </div>
            <label className="flex min-w-[220px] flex-1 flex-col gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Topic</span>
              <select
                value={s.topicId ?? ""}
                onChange={(e) => patchAndRefresh({ topicId: e.target.value || null })}
                className="min-h-[44px] rounded-xl border border-line bg-paper px-3 text-sm text-ink dark:border-line-dark dark:bg-chalkboard dark:text-bone"
              >
                <option value="">{module === "mixed" ? "All topics (mixed)" : `All ${MODULE_NAME[module]} topics`}</option>
                {module === "mixed"
                  ? (["ratio", "geometry", "trigonometry"] as const).map((m) => (
                      <optgroup key={m} label={MODULE_NAME[m]}>
                        {topics.filter((t) => t.module === m).map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.label}
                          </option>
                        ))}
                      </optgroup>
                    ))
                  : topics.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
              </select>
            </label>
          </div>
        )}
      </div>

      {module === "trigonometry" && (
        <details className="group rounded-card border border-line px-4 py-3 dark:border-line-dark">
          <summary className="cursor-pointer list-none text-sm font-medium text-ink dark:text-bone [&::-webkit-details-marker]:hidden">Open the trig explorer — drag an angle and watch sin, cos and tan</summary>
          <div className="mt-3">
            <TrigExplorer />
          </div>
        </details>
      )}

      <div className={cn("grid gap-5", s.phase !== "setup" && s.phase !== "finished" && "lg:grid-cols-[minmax(0,1fr)_320px]")}>
        <div className="min-w-0">
          {/* Drill setup */}
          {s.phase === "setup" && s.mode === "drill" && (
            <Panel title="Timed drill">
              <div className="flex flex-col gap-4">
                <p className="text-sm text-ink-soft dark:text-bone-soft">A fixed set of questions against the clock — like the MCQ screening paper, where speed matters as much as accuracy. You see a full worked solution after every answer, and a review of every miss at the end.</p>
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Number of questions</span>
                  <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Number of questions">
                    {DRILL_COUNTS.map((n) => (
                      <Chip key={n} active={s.drillCount === n} onClick={() => dispatch({ type: "settings", patch: { drillCount: n } })}>
                        {n}
                      </Chip>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Time per question</span>
                  <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Time per question">
                    {TIMER_OPTIONS.map((n) => (
                      <Chip key={n} active={s.secPerQ === n} onClick={() => dispatch({ type: "settings", patch: { secPerQ: n } })}>
                        {n === 0 ? "No limit" : `${n}s`}
                      </Chip>
                    ))}
                  </div>
                  <p className="text-xs text-ink-soft dark:text-bone-soft">Around 60 s per question is a realistic pace; 45 s is a stretch target.</p>
                </div>
                <div>
                  <button type="button" onClick={startDrill} className={cn(BTN, BTN_PRIMARY)}>
                    <Play className="h-4 w-4" strokeWidth={1.75} /> Start {s.drillCount}-question drill
                  </button>
                </div>
              </div>
            </Panel>
          )}

          {/* Question */}
          {(s.phase === "question" || s.phase === "answered") && q && (
            <Panel>
              <div className="flex flex-col gap-5">
                <QuestionCard
                  q={q}
                  number={answered ? s.results.length : s.results.length + 1}
                  total={s.mode === "drill" ? s.drillCount : null}
                  picked={s.picked}
                  answered={answered}
                  onPick={pick}
                  timer={timed ? { remainingMs: s.remainingMs, totalSec: s.secPerQ } : null}
                />
                {answered && lastResult && (
                  <>
                    <SolutionPanel q={q} correct={lastResult.correct} timedOut={lastResult.picked === null} />
                    <div>
                      <button type="button" onClick={next} className={cn(BTN, BTN_PRIMARY)}>
                        {isLastDrillQuestion ? "See results" : "Next question"} <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </Panel>
          )}

          {s.phase === "finished" && <ResultsView results={s.results} secPerQ={s.secPerQ} onRetry={startDrill} onSetup={() => dispatch({ type: "to-setup", mode: "drill" })} />}
        </div>

        {(s.phase === "question" || s.phase === "answered") && <StatsPanel results={s.results} />}
      </div>

      <p className="text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
        Every question is generated fresh from templates, so you will not see the same one twice in a row. Where π is needed the question says to use 22/7, the usual convention in CSS-style papers. This is independent practice material, not affiliated with the FPSC: always check the current official syllabus and past papers for what is tested.
      </p>
    </div>
  );
}

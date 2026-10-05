"use client";

import { AlertTriangle, Check, Clock, Lightbulb, ShieldCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DIFFICULTY_LABEL, type PastPaperRef, type Question } from "../types";
import { FigureView } from "./figure";

const LETTERS = ["A", "B", "C", "D"];

/** Badge wording. Official sources get "Verified past paper"; compilations are labelled for what they are. */
export function pastPaperBadgeText(r: PastPaperRef): string {
  return r.evidence === "third-party-compilation" ? `Past paper · ${r.year} · answer verified` : `Verified past paper · ${r.year}`;
}

/** Shown only on questions that came from the past-paper bank (never on generated ones). */
export function VerifiedBadge({ info: r }: { info: PastPaperRef }) {
  const official = r.evidence !== "third-party-compilation";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono font-semibold",
        official ? "border-emerald-600/50 bg-emerald-50 text-emerald-800 dark:border-emerald-400/40 dark:bg-emerald-500/10 dark:text-emerald-200" : "border-subject-math/50 bg-subject-math-soft/50 text-subject-math dark:bg-subject-math/10",
      )}
      title={
        official
          ? `Appeared in the ${r.exam}, ${r.year}${r.questionNo ? `, question ${r.questionNo}` : ""}. Checked against an official source on ${r.verifiedOn}.`
          : `From a published compilation of the ${r.exam}, ${r.year}${r.questionNo ? `, question ${r.questionNo}` : ""}. FPSC does not release MPT booklets, so this is not checked against an official copy; the answer was independently re-solved on ${r.verifiedOn}.`
      }
    >
      <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
      {pastPaperBadgeText(r)}
    </span>
  );
}

export function TimerBar({ remainingMs, totalSec }: { remainingMs: number; totalSec: number }) {
  const frac = Math.max(0, Math.min(1, remainingMs / (totalSec * 1000)));
  const secs = Math.ceil(remainingMs / 1000);
  const low = frac <= 0.25;
  return (
    <div className="flex items-center gap-3" role="timer" aria-label={`${secs} seconds left`}>
      <Clock className={cn("h-4 w-4 shrink-0", low ? "text-red-600 dark:text-red-300" : "text-ink-soft dark:text-bone-soft")} strokeWidth={1.75} aria-hidden />
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink/10 dark:bg-bone/10">
        <div className={cn("h-full rounded-full transition-[width] duration-200 ease-linear motion-reduce:transition-none", low ? "bg-red-500" : "bg-subject-math")} style={{ width: `${frac * 100}%` }} />
      </div>
      <span className={cn("w-10 text-right font-mono text-sm tabular-nums", low ? "font-semibold text-red-600 dark:text-red-300" : "text-ink dark:text-bone")}>{secs}s</span>
    </div>
  );
}

export function SolutionPanel({ q, correct, timedOut }: { q: Question; correct: boolean; timedOut: boolean }) {
  return (
    <div className="flex flex-col gap-3">
      <div
        role="status"
        className={cn(
          "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold",
          correct ? "border-emerald-500/60 bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200" : "border-red-400/60 bg-red-50 text-red-800 dark:bg-red-500/10 dark:text-red-200",
        )}
      >
        {correct ? <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden /> : <X className="h-4 w-4" strokeWidth={2.5} aria-hidden />}
        {correct ? "Correct" : timedOut ? `Time's up — the answer is ${LETTERS[q.correct]}: ${q.options[q.correct]}` : `Not quite — the answer is ${LETTERS[q.correct]}: ${q.options[q.correct]}`}
      </div>

      <div className="rounded-xl border border-line p-3 dark:border-line-dark">
        <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Worked solution</p>
        <ol className="mt-1.5 list-decimal space-y-1 pl-5 text-sm text-ink dark:text-bone">
          {q.steps.map((s, i) => (
            <li key={i} className="break-words">
              {s}
            </li>
          ))}
        </ol>
      </div>

      {q.pastPaper && (
        <p className="rounded-xl border border-line px-3 py-2 text-xs leading-relaxed text-ink-soft dark:border-line-dark dark:text-bone-soft">
          <span className="font-semibold text-ink dark:text-bone">Source:</span> {q.pastPaper.exam}, {q.pastPaper.year}
          {q.pastPaper.questionNo ? `, question ${q.pastPaper.questionNo}` : ""}.{" "}
          {q.pastPaper.evidence === "third-party-compilation"
            ? `Taken from the ${q.pastPaper.sourceName ?? "published"} compilation. FPSC does not release MPT booklets, so this is not checked against an official copy; the correct answer was re-solved independently on ${q.pastPaper.verifiedOn} by ${q.pastPaper.verifiedBy}.`
            : `Checked against ${q.pastPaper.evidence === "fpsc-website" ? "the FPSC website" : "an official paper copy"} on ${q.pastPaper.verifiedOn} by ${q.pastPaper.verifiedBy}.`}{" "}
          <a href={q.pastPaper.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-subject-math underline underline-offset-2">
            View source
          </a>
          . The worked solution above is our own.
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-subject-math/40 bg-subject-math-soft/50 p-3 dark:bg-subject-math/10">
          <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide text-subject-math">
            <Lightbulb className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden /> Fast method for the exam
          </p>
          <p className="mt-1 text-sm text-ink dark:text-bone">{q.trick}</p>
        </div>
        {q.trap && (
          <div className="rounded-xl border border-amber-400/60 bg-amber-50 p-3 dark:border-amber-500/40 dark:bg-amber-500/10">
            <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide text-amber-700 dark:text-amber-300">
              <AlertTriangle className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden /> Trap to avoid
            </p>
            <p className="mt-1 text-sm text-ink dark:text-bone">{q.trap}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function QuestionCard({
  q,
  number,
  total,
  picked,
  answered,
  onPick,
  timer,
}: {
  q: Question;
  number: number;
  total: number | null;
  picked: number | null;
  answered: boolean;
  onPick: (i: number) => void;
  timer?: { remainingMs: number; totalSec: number } | null;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-subject-math-soft px-2.5 py-1 font-mono font-semibold uppercase tracking-wide text-subject-math dark:bg-subject-math/20">{q.topicLabel}</span>
        {q.pastPaper ? <VerifiedBadge info={q.pastPaper} /> : <span className="rounded-full border border-line px-2.5 py-1 font-mono text-ink-soft dark:border-line-dark dark:text-bone-soft">{DIFFICULTY_LABEL[q.difficulty]}</span>}
        <span className="ml-auto font-mono text-ink-soft dark:text-bone-soft">{total ? `Question ${number} of ${total}` : `Question ${number}`}</span>
      </div>

      {timer && <TimerBar remainingMs={timer.remainingMs} totalSec={timer.totalSec} />}

      <div className={cn("grid gap-4", q.figure && "md:grid-cols-[minmax(0,1fr)_minmax(0,260px)] md:items-center")}>
        <p className="text-base leading-relaxed text-ink dark:text-bone sm:text-lg">{q.prompt}</p>
        {q.figure && (
          <div className="rounded-xl border border-line bg-white/60 p-2 dark:border-line-dark dark:bg-white/[0.03]">
            <FigureView figure={q.figure} />
          </div>
        )}
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2" role="group" aria-label="Answer options">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correct;
          const isPicked = i === picked;
          return (
            <button
              key={`${q.id}-${i}`}
              type="button"
              disabled={answered}
              onClick={() => onPick(i)}
              aria-label={`Option ${LETTERS[i]}: ${opt}`}
              className={cn(
                "flex min-h-[52px] items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors disabled:cursor-default",
                !answered && "border-line hover:border-subject-math hover:bg-subject-math-soft/40 dark:border-line-dark dark:hover:bg-subject-math/10",
                answered && isCorrect && "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10",
                answered && isPicked && !isCorrect && "border-red-400 bg-red-50 dark:bg-red-500/10",
                answered && !isCorrect && !isPicked && "border-line opacity-60 dark:border-line-dark",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-semibold",
                  answered && isCorrect ? "border-emerald-500 bg-emerald-500 text-white" : answered && isPicked ? "border-red-400 bg-red-400 text-white" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
                )}
                aria-hidden
              >
                {answered && isCorrect ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : answered && isPicked ? <X className="h-3.5 w-3.5" strokeWidth={3} /> : LETTERS[i]}
              </span>
              <span className="min-w-0 break-words font-mono text-sm text-ink dark:text-bone sm:text-base">{opt}</span>
            </button>
          );
        })}
      </div>
      {!answered && <p className="hidden text-xs text-ink-soft dark:text-bone-soft sm:block">Keyboard: press 1–4 or A–D to answer, then Enter for the next question.</p>}
    </div>
  );
}

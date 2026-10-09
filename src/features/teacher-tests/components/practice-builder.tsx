"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { loadHistory } from "@/features/mpt-mock/storage";
import { BANK_STATS } from "../data/bank-stats";
import { loadBank } from "../bank-loader";
import { teacherExamConfig, TEACHER_BASE } from "../config";
import { selectPractice } from "../practice";
import { loadLedger, loadPracticeIndex, loadPracticeRecord, recordUse, savePracticeRecord } from "../storage";
import type { PracticeMode, PracticeSpec } from "../tests";
import { DIFFICULTY_LABELS, practiceTitle } from "../tests";
import { DIFFICULTIES } from "../types";
import type { ExamType, TeacherDifficulty, TeacherSubject } from "../types";

const MODE_LABELS: Record<PracticeMode, string> = {
  subject: "By subject",
  topic: "By topic",
  difficulty: "By difficulty",
  "past-paper": "Past papers",
  mixed: "Mixed (exam-like)",
};
const MODES: PracticeMode[] = ["subject", "topic", "difficulty", "past-paper", "mixed"];

const fieldCls =
  "h-11 w-full rounded-md border border-ink/20 bg-paper px-3 text-sm text-ink dark:border-bone/25 dark:bg-chalkboard dark:text-bone";

export function PracticeBuilder({ exam }: { exam: ExamType }) {
  const router = useRouter();
  const cfg = teacherExamConfig[exam];
  const stats = BANK_STATS[exam];
  const subjects = Object.keys(stats.bySubject) as TeacherSubject[];
  const pastCount = stats.bySource["verified_past_paper"] ?? 0;

  const [mode, setMode] = useState<PracticeMode>("mixed");
  const [subject, setSubject] = useState<TeacherSubject>(subjects[0] ?? "English");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<TeacherDifficulty>("moderate");
  const [count, setCount] = useState(cfg.practice.defaultCount);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [recent, setRecent] = useState<{ id: string; title: string; done: boolean }[]>([]);

  const topics = Object.keys(stats.topics[subject] ?? {}).sort();
  const effectiveTopic = topics.includes(topic) ? topic : (topics[0] ?? "");

  useEffect(() => {
    const items = loadPracticeIndex(exam)
      .map((id) => {
        const r = loadPracticeRecord(id);
        return r ? { id, title: practiceTitle(cfg, r.spec), done: loadHistory(id).length > 0 } : null;
      })
      .filter((x): x is { id: string; title: string; done: boolean } => x !== null);
    setRecent(items.slice(0, 10));
  }, [exam, cfg]);

  async function start() {
    setBusy(true);
    setError("");
    try {
      const n = Math.max(5, Math.min(cfg.practice.maxCount, Math.floor(count) || cfg.practice.defaultCount));
      const spec: PracticeSpec = { mode, count: n };
      if (mode === "subject" || mode === "topic") spec.subject = subject;
      if (mode === "topic") spec.topic = effectiveTopic;
      if (mode === "difficulty") spec.difficulty = difficulty;
      const id = `${exam}-p-${Date.now().toString(36)}`;
      const bank = await loadBank(exam);
      const questions = selectPractice(cfg, bank, spec, loadLedger(exam), id);
      if (questions.length === 0) {
        setError("No questions match that selection.");
        setBusy(false);
        return;
      }
      const saved = savePracticeRecord({ id, exam, spec: { ...spec, count: questions.length }, questionIds: questions.map((q) => q.id), createdAt: Date.now() });
      if (!saved) {
        setError("Could not save the practice set: browser storage is unavailable.");
        setBusy(false);
        return;
      }
      recordUse(exam, questions.map((q) => q.id), id);
      router.push(`${TEACHER_BASE}/${exam}/practice/run?t=${id}`);
    } catch {
      setError("Could not build the practice set. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <form
        className="space-y-5 rounded-lg border border-ink/10 p-5 dark:border-bone/15"
        onSubmit={(e) => {
          e.preventDefault();
          void start();
        }}
      >
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-ink dark:text-bone">Practice mode</legend>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {MODES.map((m) => {
              const disabled = m === "past-paper" && pastCount === 0;
              return (
                <label key={m} className={`flex items-start gap-2 rounded-md border p-3 text-sm ${mode === m ? "border-pine-600" : "border-ink/15 dark:border-bone/20"} ${disabled ? "opacity-50" : "cursor-pointer"}`}>
                  <input type="radio" name="mode" className="mt-1" checked={mode === m} disabled={disabled} onChange={() => setMode(m)} />
                  <span>
                    {MODE_LABELS[m]}
                    {disabled ? <span className="block text-xs text-ink/60 dark:text-bone/60">No verified past papers in the bank yet.</span> : null}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          {mode === "subject" || mode === "topic" ? (
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Subject</span>
              <select className={fieldCls} value={subject} onChange={(e) => setSubject(e.target.value as TeacherSubject)}>
                {subjects.map((s) => (
                  <option key={s} value={s}>{s} ({stats.bySubject[s]})</option>
                ))}
              </select>
            </label>
          ) : null}
          {mode === "topic" ? (
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Topic</span>
              <select className={fieldCls} value={effectiveTopic} onChange={(e) => setTopic(e.target.value)}>
                {topics.map((t) => (
                  <option key={t} value={t}>{t} ({stats.topics[subject]?.[t]})</option>
                ))}
              </select>
            </label>
          ) : null}
          {mode === "difficulty" ? (
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Difficulty</span>
              <select className={fieldCls} value={difficulty} onChange={(e) => setDifficulty(e.target.value as TeacherDifficulty)}>
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>{DIFFICULTY_LABELS[d]} ({stats.byDifficulty[d] ?? 0})</option>
                ))}
              </select>
            </label>
          ) : null}
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Number of questions (5–{cfg.practice.maxCount})</span>
            <input className={fieldCls} type="number" inputMode="numeric" min={5} max={cfg.practice.maxCount} value={count} onChange={(e) => setCount(Number(e.target.value))} />
          </label>
        </div>

        <p className="text-sm text-ink/70 dark:text-bone/70">
          Timed at about {cfg.practice.minutesPerQuestion} min per question. Questions you have seen least on this device are preferred.
        </p>
        {error ? <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
        <Button type="submit" disabled={busy}>{busy ? "Preparing…" : "Start practice"}</Button>
      </form>

      <section aria-labelledby="recent">
        <h2 id="recent" className="font-display text-xl text-ink dark:text-bone">Recent practice sets</h2>
        {recent.length === 0 ? (
          <p className="mt-2 text-sm text-ink/70 dark:text-bone/70">None yet on this device.</p>
        ) : (
          <ul className="mt-3 divide-y divide-ink/10 dark:divide-bone/15">
            {recent.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span>{r.title}{r.done ? " · finished" : ""}</span>
                <Button size="sm" variant="secondary" href={`${TEACHER_BASE}/${exam}/practice/run?t=${r.id}`}>{r.done ? "Review" : "Open"}</Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

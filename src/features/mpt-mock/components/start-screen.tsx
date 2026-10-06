"use client";

import { Button } from "@/components/ui/button";
import type { MptMockDefinition, MptQuestion } from "../data/mpt-mock-data";
import { formatClock } from "../engine";

export function StartScreen({ mock, questions, onStart }: { mock: MptMockDefinition; questions: MptQuestion[]; onStart: () => void }) {
  const past = questions.filter((q) => q.sourceType === "Verified Past Paper").length;
  const bank = questions.filter((q) => q.sourceType === "Existing Question Bank").length;
  const gen = questions.filter((q) => q.sourceType === "Generated Practice").length;
  return (
    <div className="mx-auto max-w-3xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">CSS · MCQ-Based Preliminary Test</p>
      <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">{mock.title}</h1>
      <p className="mt-2 text-base text-ink-soft dark:text-bone-soft">
        A full-length mock in the real paper order: Islamic Studies, Urdu, English, General Abilities, then General Knowledge, Current Affairs and Pakistan Affairs.
      </p>
      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Questions", String(mock.totalQuestions)],
          ["Time", `${mock.timeMinutes} min (${formatClock(mock.timeMinutes * 60)})`],
          ["Passing", `${mock.passMarks} / ${mock.totalQuestions}`],
          ["Negative marking", "None"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-lg border border-line p-3 dark:border-line-dark">
            <dt className="font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">{k}</dt>
            <dd className="mt-1 text-sm font-medium text-ink dark:text-bone">{v}</dd>
          </div>
        ))}
      </dl>
      <table className="mt-6 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line text-ink-soft dark:border-line-dark dark:text-bone-soft">
            <th className="py-2 font-medium">Section</th>
            <th className="py-2 text-right font-medium">Questions</th>
          </tr>
        </thead>
        <tbody className="text-ink dark:text-bone">
          {mock.sections.map((s) => (
            <tr key={s.code} className="border-b border-line/60 dark:border-line-dark/60">
              <td className="py-2">{s.subject}</td>
              <td className="py-2 text-right">{s.count}</td>
            </tr>
          ))}
          <tr className="font-medium">
            <td className="py-2">Total</td>
            <td className="py-2 text-right">{mock.totalQuestions}</td>
          </tr>
        </tbody>
      </table>
      <ul className="mt-6 list-disc space-y-1.5 pl-5 text-sm text-ink-soft dark:text-bone-soft">
        <li>The timer starts when you press Start and keeps running when you move between questions or refresh the page.</li>
        <li>When it reaches 00:00:00 the test is submitted automatically and answering stops.</li>
        <li>Shortcuts: A–D choose an option, ← → move between questions, M marks for review.</li>
        <li>
          Sources in this mock: {past} from past-paper reproductions, {bank} from the existing bank, {gen} generated practice. Source labels are shown in review.
        </li>
      </ul>
      <div className="mt-8">
        <Button size="lg" onClick={onStart}>Start mock test</Button>
      </div>
    </div>
  );
}

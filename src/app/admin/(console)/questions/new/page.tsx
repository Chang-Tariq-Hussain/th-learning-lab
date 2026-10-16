import Link from "next/link";
import type { Metadata } from "next";
import { Flash } from "@/components/admin/flash";
import { QuestionContentFields, inputCls, labelCls } from "@/components/admin/question-fields";
import { requirePermission } from "@/lib/admin/auth";
import { EXAM_LABEL, EXAM_SLUGS, SOURCE_LABEL, SOURCE_TYPES, SUBJECT_SLUGS, SYSTEMS, SYSTEM_LABEL } from "@/lib/questions/types";
import { createQuestionAction } from "../actions";

export const metadata: Metadata = { title: "New question" };

export default async function NewQuestionPage({ searchParams }: { searchParams: { ok?: string; error?: string } }) {
  const session = await requirePermission("questions.edit");
  if (session.mode !== "accounts") return <p className="text-sm">Creating questions needs Supabase accounts.</p>;
  return (
    <div className="space-y-5">
      <p className="text-sm"><Link href="/admin/questions" className="text-pine-700 underline dark:text-pine-300">← Question bank</Link></p>
      <div>
        <h1 className="font-display text-2xl font-medium">New question</h1>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">Created as a draft, unchecked. Publish it from its page once it is ready.</p>
      </div>
      <Flash ok={searchParams.ok} error={searchParams.error} />
      <form action={createQuestionAction} className="space-y-6">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Where it belongs">
          <div><label htmlFor="source_system" className={labelCls}>Used in</label>
            <select id="source_system" name="source_system" required defaultValue="quiz" className={inputCls}>{SYSTEMS.map((s) => <option key={s} value={s}>{SYSTEM_LABEL[s]}</option>)}</select></div>
          <div><label htmlFor="subject_slug" className={labelCls}>Subject (quiz questions)</label>
            <select id="subject_slug" name="subject_slug" defaultValue="" className={inputCls}><option value="">—</option>{SUBJECT_SLUGS.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
          <div><label htmlFor="exam_subject" className={labelCls}>Exam subject (exam questions)</label><input id="exam_subject" name="exam_subject" placeholder="e.g. Mathematics" className={inputCls} /></div>
          <div><label htmlFor="exam_slug" className={labelCls}>Exam (exam questions)</label>
            <select id="exam_slug" name="exam_slug" defaultValue="" className={inputCls}><option value="">—</option>{EXAM_SLUGS.map((s) => <option key={s} value={s}>{EXAM_LABEL[s]}</option>)}</select></div>
          <div><label htmlFor="exam_topic" className={labelCls}>Exam topic</label><input id="exam_topic" name="exam_topic" className={inputCls} /></div>
          <div><label htmlFor="exam_difficulty" className={labelCls}>Exam difficulty</label>
            <select id="exam_difficulty" name="exam_difficulty" defaultValue="" className={inputCls}><option value="">—</option><option value="easy">easy</option><option value="medium">medium</option><option value="hard">hard</option></select></div>
          <div><label htmlFor="section_code" className={labelCls}>Section code (e.g. EN)</label><input id="section_code" name="section_code" className={inputCls} /></div>
        </section>
        <QuestionContentFields d={{}} />
        <section className="space-y-3 rounded-xl border border-ink/10 p-4 dark:border-bone/15" aria-label="Source">
          <p className="text-xs text-ink-soft dark:text-bone-soft">Be accurate about the source. Only mark “Verified past paper” if it really is one — it then needs a year and a reference. Generated or self-written questions must not claim to be past papers.</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div><label htmlFor="source_type" className={labelCls}>Source</label>
              <select id="source_type" name="source_type" defaultValue="platform_authored" className={inputCls}>{SOURCE_TYPES.map((s) => <option key={s} value={s}>{SOURCE_LABEL[s]}</option>)}</select></div>
            <div><label htmlFor="source_year" className={labelCls}>Source year</label><input id="source_year" name="source_year" type="number" className={inputCls} /></div>
            <div><label htmlFor="source_reference" className={labelCls}>Source reference</label><input id="source_reference" name="source_reference" className={inputCls} /></div>
            <div><label htmlFor="source_note" className={labelCls}>Source note</label><input id="source_note" name="source_note" className={inputCls} /></div>
          </div>
        </section>
        <button type="submit" className="rounded-lg bg-pine-600 px-4 py-2 text-sm font-medium text-paper hover:bg-pine-700 dark:bg-pine-500 dark:text-chalkboard">Create draft</button>
      </form>
    </div>
  );
}

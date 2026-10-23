import { SubmitButton } from "@/components/admin/submit-button";
import Link from "next/link";
import type { Metadata } from "next";
import { Flash } from "@/components/admin/flash";
import { QuestionContentFields, inputCls, labelCls } from "@/components/admin/question-fields";
import { requirePermission } from "@/lib/admin/auth";
import { DraftBanner } from "@/components/admin/draft-banner";
import { draftToDefaults, readDraft } from "@/lib/admin/draft";
import { EXAM_LABEL, EXAM_SLUGS, SOURCE_LABEL, SOURCE_TYPES, SUBJECT_SLUGS, SYSTEMS, SYSTEM_LABEL } from "@/lib/questions/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createQuestionAction } from "../actions";

export const metadata: Metadata = { title: "New Question" };

export default async function NewQuestionPage({ searchParams }: { searchParams: { ok?: string; info?: string; warn?: string; error?: string } }) {
  const session = await requirePermission("questions.edit");
  if (session.mode !== "accounts") return <p className="text-sm">Creating questions needs Supabase accounts.</p>;
  const { data: bankData } = await createSupabaseServerClient().from("question_banks").select("slug, title, subjects(slug)").eq("status", "published").order("slug");
  const draft = readDraft("new");
  const v = (k: string, dflt = ""): string => draft?.[k] ?? dflt;
  const banks = (bankData ?? []) as unknown as { slug: string; title: string; subjects: { slug: string } | null }[];
  return (
    <div className="space-y-5">
      <p className="text-sm"><Link href="/admin/questions" className="text-pine-700 underline dark:text-pine-300">← Question bank</Link></p>
      <div>
        <h1 className="font-display text-2xl font-medium">New question</h1>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">Created as a draft, unchecked. Exam questions need exactly 4 options. A quiz question reaches learners only once it is in a bank, published, and the content is published.</p>
      </div>
      <Flash ok={searchParams.ok} info={searchParams.info} warn={searchParams.warn} error={searchParams.error} />
      <form action={createQuestionAction} className="space-y-6">
        {draft ? <DraftBanner returnTo="/admin/questions/new" /> : null}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Where it belongs">
          <div><label htmlFor="source_system" className={labelCls}>Used in</label>
            <select id="source_system" name="source_system" required defaultValue={v("source_system", "quiz")} className={inputCls}>{SYSTEMS.map((s) => <option key={s} value={s}>{SYSTEM_LABEL[s]}</option>)}</select></div>
          <div><label htmlFor="subject_slug" className={labelCls}>Subject (quiz questions)</label>
            <select id="subject_slug" name="subject_slug" defaultValue={v("subject_slug")} className={inputCls}><option value="">—</option>{SUBJECT_SLUGS.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
          <div><label htmlFor="bank_slug" className={labelCls}>Add to bank (quiz questions)</label>
            <select id="bank_slug" name="bank_slug" defaultValue={v("bank_slug")} className={inputCls}><option value="">— none yet —</option>{banks.map((b) => <option key={b.slug} value={b.slug}>{b.subjects?.slug ?? ""} · {b.title}</option>)}</select></div>
          <div><label htmlFor="exam_subject" className={labelCls}>Exam subject (exam questions)</label><input id="exam_subject" name="exam_subject" defaultValue={v("exam_subject")} placeholder="e.g. Mathematics" className={inputCls} /></div>
          <div><label htmlFor="exam_slug" className={labelCls}>Exam (teacher tests; CSS MPT is automatic)</label>
            <select id="exam_slug" name="exam_slug" defaultValue={v("exam_slug")} className={inputCls}><option value="">—</option>{EXAM_SLUGS.filter((s) => s !== "css-mpt").map((s) => <option key={s} value={s}>{EXAM_LABEL[s]}</option>)}</select></div>
          <div><label htmlFor="exam_topic" className={labelCls}>Exam topic</label><input id="exam_topic" name="exam_topic" defaultValue={v("exam_topic")} className={inputCls} /></div>
          <div><label htmlFor="exam_difficulty" className={labelCls}>Exam difficulty</label>
            <select id="exam_difficulty" name="exam_difficulty" defaultValue={v("exam_difficulty")} className={inputCls}><option value="">—</option><option value="easy">easy</option><option value="medium">medium</option><option value="hard">hard</option></select></div>
          <div><label htmlFor="section_code" className={labelCls}>Section (CSS MPT: IS, UR, EN, GA or GK)</label><input id="section_code" name="section_code" defaultValue={v("section_code")} className={inputCls} /></div>
        </section>
        <QuestionContentFields d={draft ? draftToDefaults(draft) : {}} />
        <section className="space-y-3 rounded-xl border border-ink/10 p-4 dark:border-bone/15" aria-label="Source">
          <p className="text-helper text-ink-soft dark:text-bone-soft">Be accurate about the source. Only mark “Verified past paper” if it really is one — it then needs a year and a reference. Generated or self-written questions must not claim to be past papers.</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div><label htmlFor="source_type" className={labelCls}>Source</label>
              <select id="source_type" name="source_type" defaultValue={v("source_type", "platform_authored")} className={inputCls}>{SOURCE_TYPES.map((s) => <option key={s} value={s}>{SOURCE_LABEL[s]}</option>)}</select></div>
            <div><label htmlFor="source_year" className={labelCls}>Source year</label><input id="source_year" name="source_year" type="number" defaultValue={v("source_year")} className={inputCls} /></div>
            <div><label htmlFor="source_reference" className={labelCls}>Source reference</label><input id="source_reference" name="source_reference" defaultValue={v("source_reference")} className={inputCls} /></div>
            <div><label htmlFor="source_note" className={labelCls}>Source note</label><input id="source_note" name="source_note" defaultValue={v("source_note")} className={inputCls} /></div>
          </div>
        </section>
        <SubmitButton variant="primary" pendingLabel="Creating…">Create draft</SubmitButton>
      </form>
    </div>
  );
}

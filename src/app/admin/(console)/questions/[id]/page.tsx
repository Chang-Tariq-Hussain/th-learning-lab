import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Flash } from "@/components/admin/flash";
import { CheckText, SourceBadge, StatusPill } from "@/components/admin/question-badges";
import { QuestionContentFields, inputCls, labelCls } from "@/components/admin/question-fields";
import { requirePermission } from "@/lib/admin/auth";
import { DraftBanner } from "@/components/admin/draft-banner";
import { draftToDefaults, readDraft } from "@/lib/admin/draft";
import { can } from "@/lib/admin/permissions";
import { ANSWER_CHECKS, CHECK_LABEL, SOURCE_LABEL, SOURCE_TYPES, SYSTEM_LABEL, EXAM_LABEL, type AnswerCheck, type QuestionStatus, type SourceType } from "@/lib/questions/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { publishState } from "@/lib/admin/publishing";
import { bankAddAction, bankRemoveAction, provenanceAction, saveQuestionAction, statusAction } from "../actions";

export const metadata: Metadata = { title: "Question" };

interface Detail {
  id: string; subject_id: string | null; legacy_id: string; source_system: keyof typeof SYSTEM_LABEL; exam_subject: string | null; topic: string | null; concept: string | null; difficulty: string | null;
  stem: string; passage: string | null; options: string[]; correct_index: number; fixed_order: boolean; explanation: string; hints: string[] | null;
  misconception_tag: string | null; language: string | null; source_type: SourceType; source_detail: string | null; source_exam: string | null; source_year: number | null;
  source_reference: string | null; source_note: string | null; answer_check: AnswerCheck; verified_note: string | null; needs_review: boolean; status: QuestionStatus;
  content_hash: string; source_hash: string | null; updated_at: string;
  subjects: { slug: string; name: string } | null;
  question_exams: { topic: string | null; subtopic: string | null; difficulty: string | null; section_code: string | null; exam_types: { slug: string; name: string } | null }[];
  question_bank_items: { position: number; question_banks: { slug: string; title: string } | null }[];
  exam_questions: { position: number; section_code: string; exams: { slug: string; title: string } | null }[];
}
interface HistoryRow { at: string; actor_email: string | null; actor_role: string | null; action: string; before: unknown; after: unknown; meta: { reason?: string } | null }

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const btn = "rounded-lg border border-ink/15 px-3 py-1.5 text-sm hover:border-pine-500 dark:border-bone/20";

export default async function QuestionDetailPage({ params, searchParams }: { params: { id: string }; searchParams: { ok?: string; error?: string } }) {
  const session = await requirePermission("questions.view");
  if (session.mode !== "accounts" || !UUID.test(params.id)) notFound();
  const editor = can(session.role, "questions.edit");
  const supabase = createSupabaseServerClient();

  const { data } = await supabase
    .from("questions")
    .select("*, subjects(slug, name), question_exams(topic, subtopic, difficulty, section_code, exam_types(slug, name)), question_bank_items(position, question_banks(slug, title)), exam_questions(position, section_code, exams(slug, title))")
    .eq("id", params.id)
    .maybeSingle();
  if (!data) notFound();
  const q = data as unknown as Detail;
  const { data: hist } = await supabase.rpc("question_history", { p_id: q.id });
  const history = (hist ?? []) as HistoryRow[];
  const quizSystem = q.source_system === "quiz";
  const pub = publishState(q.source_system, q.legacy_id, q.status, q.content_hash);
  const inBanks = new Set(q.question_bank_items.map((b) => b.question_banks?.slug));
  const { data: bankData } = quizSystem && q.subject_id ? await supabase.from("question_banks").select("slug, title").eq("subject_id", q.subject_id).eq("status", "published").order("slug") : { data: [] };
  const availableBanks = ((bankData ?? []) as { slug: string; title: string }[]).filter((b) => !inBanks.has(b.slug));
  const draft = editor ? readDraft(q.id) : null;
  const provDraft = editor ? readDraft(`${q.id}:prov`) : null;
  const edited = q.source_hash ? q.content_hash !== q.source_hash : null;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm"><Link href="/admin/questions" className="text-pine-700 underline dark:text-pine-300">← Question bank</Link></p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <h1 className="font-display text-2xl font-medium">{q.legacy_id}</h1>
          <StatusPill status={q.status} /><SourceBadge source={q.source_type} /><CheckText check={q.answer_check} />
        </div>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">
          {SYSTEM_LABEL[q.source_system]} · {q.subjects?.name ?? q.exam_subject ?? "—"}
          {pub === "pending" ? " · changed since the last publish — learners do not see this yet" : pub === "synced" ? " · matches what learners see" : ""}
          {edited === true ? " · edited in admin since it was imported from the code registries" : edited === false ? " · unchanged since import" : " · created in admin"}
        </p>
      </div>
      <Flash ok={searchParams.ok} error={searchParams.error} />

      <section aria-labelledby="h-content" className="space-y-3">
        <h2 id="h-content" className="font-display text-lg font-medium">Content</h2>
        {editor ? (
          <form action={saveQuestionAction} className="space-y-4">
            {draft ? <DraftBanner returnTo={`/admin/questions/${q.id}`} stale /> : null}
            <input type="hidden" name="id" value={q.id} />
            <input type="hidden" name="expected_hash" value={q.content_hash} />
            <QuestionContentFields showDifficulty={quizSystem} d={draft ? draftToDefaults(draft) : q} />
            {!quizSystem ? <p className="text-xs text-ink-soft dark:text-bone-soft">Exam questions must keep exactly 4 options.</p> : null}
            <button type="submit" className="rounded-lg bg-pine-600 px-4 py-2 text-sm font-medium text-paper hover:bg-pine-700 dark:bg-pine-500 dark:text-chalkboard">Save changes</button>
            {q.answer_check === "independently_checked" ? <p className="text-xs text-ink-soft dark:text-bone-soft">This answer is marked independently checked. Changing the question, passage, options or correct answer resets that check to Unchecked.</p> : null}
          </form>
        ) : (
          <div className="space-y-2 text-sm">
            <p className="whitespace-pre-wrap">{q.stem}</p>
            <ol className="list-decimal pl-5">{q.options.map((o, i) => <li key={i} className={i === q.correct_index ? "font-medium text-emerald-700 dark:text-emerald-300" : ""}>{o}{i === q.correct_index ? " ✓" : ""}</li>)}</ol>
            <p className="text-ink-soft dark:text-bone-soft">{q.explanation}</p>
            <p className="text-xs text-ink-soft dark:text-bone-soft">You have read-only access.</p>
          </div>
        )}
      </section>

      <section aria-labelledby="h-status" className="space-y-3">
        <h2 id="h-status" className="font-display text-lg font-medium">Status</h2>
        {editor ? (
          <div className="flex flex-wrap gap-3">
            {q.status !== "in_review" ? <form action={statusAction}><input type="hidden" name="id" value={q.id} /><input type="hidden" name="status" value="in_review" /><button className={btn}>Send to review</button></form> : null}
            {q.status !== "published" ? <form action={statusAction}><input type="hidden" name="id" value={q.id} /><input type="hidden" name="status" value="published" /><button className={btn}>Publish</button></form> : null}
            {q.status === "published" || q.status === "in_review" ? (
              <form action={statusAction} className="flex items-center gap-2"><input type="hidden" name="id" value={q.id} /><input type="hidden" name="status" value="draft" />
                <input name="reason" required minLength={5} placeholder="Reason to unpublish" aria-label="Reason to unpublish" className={`${inputCls} w-56`} /><button className={btn}>Unpublish</button></form>
            ) : null}
            {q.status !== "archived" ? (
              <form action={statusAction} className="flex items-center gap-2"><input type="hidden" name="id" value={q.id} /><input type="hidden" name="status" value="archived" />
                <input name="reason" required minLength={5} placeholder="Reason to archive" aria-label="Reason to archive" className={`${inputCls} w-56`} /><button className={`${btn} text-red-700 dark:text-red-300`}>Archive</button></form>
            ) : null}
          </div>
        ) : null}
        <p className="text-xs text-ink-soft dark:text-bone-soft">Publishing requires a question text and an explanation, and the “needs review” flag cleared. Questions are never deleted — archiving removes them from use and keeps the record.</p>
      </section>

      <section aria-labelledby="h-prov" className="space-y-3">
        <h2 id="h-prov" className="font-display text-lg font-medium">Provenance &amp; answer check</h2>
        <p className="text-xs text-ink-soft dark:text-bone-soft">Where the question came from is separate from how far its answer has been checked. A generated question can never be relabelled as a verified past paper; a past paper needs a source year and reference.</p>
        {editor ? (
          <form action={provenanceAction} className="space-y-3 rounded-xl border border-ink/10 p-4 dark:border-bone/15">
            {provDraft ? <DraftBanner returnTo={`/admin/questions/${q.id}`} stale /> : null}
            <input type="hidden" name="id" value={q.id} /><input type="hidden" name="expected_hash" value={q.content_hash} />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div><label htmlFor="source_type" className={labelCls}>Source</label>
                <select id="source_type" name="source_type" defaultValue={provDraft?.["source_type"] ?? q.source_type} className={inputCls}>{SOURCE_TYPES.map((s) => <option key={s} value={s}>{SOURCE_LABEL[s]}</option>)}</select></div>
              <div><label htmlFor="source_year" className={labelCls}>Source year</label><input id="source_year" name="source_year" type="number" defaultValue={provDraft?.["source_year"] ?? q.source_year ?? ""} className={inputCls} /></div>
              <div><label htmlFor="source_exam" className={labelCls}>Source exam</label><input id="source_exam" name="source_exam" defaultValue={provDraft?.["source_exam"] ?? q.source_exam ?? ""} className={inputCls} /></div>
              <div><label htmlFor="source_reference" className={labelCls}>Source reference</label><input id="source_reference" name="source_reference" defaultValue={provDraft?.["source_reference"] ?? q.source_reference ?? ""} className={inputCls} /></div>
              <div><label htmlFor="source_note" className={labelCls}>Source note</label><input id="source_note" name="source_note" defaultValue={provDraft?.["source_note"] ?? q.source_note ?? ""} className={inputCls} /></div>
              <div><label htmlFor="answer_check" className={labelCls}>Answer check</label>
                <select id="answer_check" name="answer_check" defaultValue={provDraft?.["answer_check"] ?? q.answer_check} className={inputCls}>{ANSWER_CHECKS.map((s) => <option key={s} value={s}>{CHECK_LABEL[s]}</option>)}</select></div>
            </div>
            <div><label htmlFor="verified_note" className={labelCls}>How the answer was checked</label><input id="verified_note" name="verified_note" defaultValue={provDraft?.["verified_note"] ?? q.verified_note ?? ""} className={inputCls} /></div>
            <div><label htmlFor="reason" className={labelCls}>Reason for this change (required — recorded in the audit log)</label><input id="reason" name="reason" required minLength={10} defaultValue={provDraft?.["reason"] ?? ""} className={inputCls} /></div>
            <button type="submit" className={btn}>Update provenance</button>
          </form>
        ) : (
          <dl className="grid gap-1 text-sm sm:grid-cols-2">
            <div><dt className="inline font-medium">Source: </dt><dd className="inline">{SOURCE_LABEL[q.source_type]}{q.source_year ? ` (${q.source_year})` : ""}</dd></div>
            <div><dt className="inline font-medium">Answer check: </dt><dd className="inline">{CHECK_LABEL[q.answer_check]}</dd></div>
            {q.source_reference ? <div><dt className="inline font-medium">Reference: </dt><dd className="inline">{q.source_reference}</dd></div> : null}
            {q.verified_note ? <div><dt className="inline font-medium">Checked: </dt><dd className="inline">{q.verified_note}</dd></div> : null}
          </dl>
        )}
      </section>

      <section aria-labelledby="h-usage" className="space-y-2">
        <h2 id="h-usage" className="font-display text-lg font-medium">Where it is used</h2>
        <ul className="list-disc pl-5 text-sm">
          {q.question_bank_items.map((b, i) => <li key={`b${i}`}>Quiz bank: {b.question_banks?.title ?? b.question_banks?.slug} (#{b.position + 1})</li>)}
          {q.exam_questions.map((e, i) => <li key={`m${i}`}>Mock: {e.exams?.title ?? e.exams?.slug} — section {e.section_code}, question {e.position + 1}</li>)}
          {q.question_exams.map((e, i) => <li key={`x${i}`}>{EXAM_LABEL[e.exam_types?.slug ?? ""] ?? e.exam_types?.name} bank{e.section_code ? ` — section ${e.section_code}` : ""}{e.topic ? ` · ${e.topic}` : ""}{e.difficulty ? ` · ${e.difficulty}` : ""}</li>)}
          {q.question_bank_items.length + q.exam_questions.length + q.question_exams.length === 0 ? <li className="list-none text-ink-soft dark:text-bone-soft">Not used anywhere yet.</li> : null}
        </ul>
      </section>

      {quizSystem ? (
        <section aria-labelledby="h-banks" className="space-y-2">
          <h2 id="h-banks" className="font-display text-lg font-medium">Quiz banks</h2>
          <p className="text-xs text-ink-soft dark:text-bone-soft">A quiz question reaches learners through the banks it belongs to. A bank always keeps at least one published question.</p>
          {editor ? (
            <>
              <ul className="space-y-2 text-sm">
                {q.question_bank_items.map((b, i) => (
                  <li key={i} className="flex flex-wrap items-center gap-3">
                    <span>{b.question_banks?.title ?? b.question_banks?.slug} <span className="text-xs text-ink-soft dark:text-bone-soft">(#{b.position + 1})</span></span>
                    <details className="inline-block"><summary className="cursor-pointer text-xs text-red-700 underline dark:text-red-300">Remove…</summary>
                      <form action={bankRemoveAction} className="mt-1 flex items-center gap-2"><input type="hidden" name="id" value={q.id} /><input type="hidden" name="bank" value={b.question_banks?.slug ?? ""} />
                        <input name="reason" required minLength={5} placeholder="Reason" aria-label="Reason" className={`${inputCls} w-56`} /><button className={btn}>Confirm remove</button></form></details>
                  </li>
                ))}
                {q.question_bank_items.length === 0 ? <li className="text-ink-soft dark:text-bone-soft">Not in any bank — learners can’t see it until it is added to one.</li> : null}
              </ul>
              {availableBanks.length ? (
                <form action={bankAddAction} className="flex flex-wrap items-center gap-2"><input type="hidden" name="id" value={q.id} />
                  <select name="bank" required defaultValue="" aria-label="Add to bank" className={`${inputCls} w-72`}><option value="" disabled>Add to a bank…</option>{availableBanks.map((b) => <option key={b.slug} value={b.slug}>{b.title}</option>)}</select>
                  <button className={btn}>Add</button></form>
              ) : null}
            </>
          ) : (
            <ul className="list-disc pl-5 text-sm">{q.question_bank_items.map((b, i) => <li key={i}>{b.question_banks?.title ?? b.question_banks?.slug}</li>)}</ul>
          )}
        </section>
      ) : q.source_system === "mpt" ? (
        <p className="rounded-lg border border-ink/10 p-3 text-sm text-ink-soft dark:border-bone/15 dark:text-bone-soft">CSS MPT questions reach learners only through the stored mocks. Edits to a question already in a mock are published; a new MPT question appears to learners once a mock includes it.</p>
      ) : null}

      <section aria-labelledby="h-hist" className="space-y-2">
        <h2 id="h-hist" className="font-display text-lg font-medium">History</h2>
        {history.length === 0 ? <p className="text-sm text-ink-soft dark:text-bone-soft">No admin changes yet.</p> : (
          <ul className="space-y-2 text-sm">
            {history.map((h, i) => (
              <li key={i} className="rounded-lg border border-ink/10 p-3 dark:border-bone/15">
                <p><span className="font-mono text-xs">{h.action}</span> · {h.actor_email ?? "—"} <span className="text-xs text-ink-soft dark:text-bone-soft">({h.actor_role}) · {new Date(h.at).toLocaleString("en-GB")}</span></p>
                {h.meta?.reason ? <p className="text-ink-soft dark:text-bone-soft">Reason: {h.meta.reason}</p> : null}
                {h.before || h.after ? <details><summary className="cursor-pointer text-xs text-pine-700 underline dark:text-pine-300">Changes</summary>
                  <pre className="mt-1 max-h-48 overflow-auto rounded bg-ink/[0.04] p-2 font-mono text-[11px] dark:bg-bone/[0.06]">{JSON.stringify({ before: h.before, after: h.after }, null, 2)}</pre></details> : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

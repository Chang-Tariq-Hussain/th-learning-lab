import { SubmitButton } from "@/components/admin/submit-button";
import Link from "next/link";
import type { Metadata } from "next";
import { Flash } from "@/components/admin/flash";
import { inputCls, labelCls } from "@/components/admin/question-fields";
import { requirePermission } from "@/lib/admin/auth";
import { importQuestionsAction } from "../actions";

export const metadata: Metadata = { title: "Import Questions" };

const EXAMPLE = `[
  {
    "source_system": "quiz",
    "subject_slug": "physics",
    "topic": "simple-motion",
    "difficulty": "easy",
    "stem": "What is speed?",
    "options": ["Distance travelled per unit time", "Mass per unit volume"],
    "correct_index": 0,
    "explanation": "Speed is distance divided by time.",
    "source_type": "platform_authored"
  }
]`;

export default async function ImportQuestionsPage({ searchParams }: { searchParams: { ok?: string; info?: string; warn?: string; error?: string; err?: string | string[] } }) {
  const session = await requirePermission("questions.edit");
  if (session.mode !== "accounts") return <p className="text-sm">Importing questions needs Supabase accounts.</p>;
  const errs = ([] as string[]).concat(searchParams.err ?? []);
  return (
    <div className="space-y-5">
      <p className="text-sm"><Link href="/admin/questions" className="text-pine-700 underline dark:text-pine-300">← Question bank</Link></p>
      <div>
        <h1 className="font-display text-2xl font-medium">Import questions</h1>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">Upload JSON to add many questions at once. Everything is created as an <strong>unchecked draft</strong>. It is all-or-nothing: if any row is invalid, nothing is imported and every problem is listed. Start with “Validate only”.</p>
      </div>
      <Flash ok={searchParams.ok} info={searchParams.info} warn={searchParams.warn} error={searchParams.error} />
      {errs.length ? <ul className="list-disc space-y-1 pl-5 text-sm text-red-700 dark:text-red-300">{errs.map((e, i) => <li key={i}>{e}</li>)}</ul> : null}
      <form action={importQuestionsAction} className="space-y-4" encType="multipart/form-data">
        <div><label htmlFor="file" className={labelCls}>JSON file (max 2 MB, 500 questions)</label><input id="file" name="file" type="file" accept=".json,application/json" className="text-sm" /></div>
        <div><label htmlFor="json" className={labelCls}>…or paste JSON</label><textarea id="json" name="json" rows={8} className={`${inputCls} font-mono text-xs`} /></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="validate_only" defaultChecked /> Validate only (nothing is saved)</label>
        <SubmitButton variant="primary" pendingLabel={(f) => (f?.get("validate_only") === "on" ? "Validating…" : "Importing…")}>Check / import</SubmitButton>
      </form>
      <section aria-labelledby="h-fmt" className="space-y-2">
        <h2 id="h-fmt" className="font-display text-lg font-medium">Format</h2>
        <p className="text-sm text-ink-soft dark:text-bone-soft">
          An array of objects. Required: <code className="font-mono">source_system</code> (quiz | mpt | teacher), <code className="font-mono">stem</code>, <code className="font-mono">options</code> (2–6), <code className="font-mono">correct_index</code> (0-based), plus <code className="font-mono">subject_slug</code> (and optionally <code className="font-mono">bank_slug</code>) for quiz, or <code className="font-mono">exam_subject</code> and an <code className="font-mono">exams</code> entry for exam questions — which need exactly 4 options (CSS MPT: exam_slug css-mpt with a section_code of IS/UR/EN/GA/GK; teacher tests: pst, jest or jst). Optional: explanation, hints, topic, concept, difficulty, language, source_type, source_year, source_reference, source_note, and for exam questions an <code className="font-mono">exams</code> array of {"{exam_slug, topic, difficulty, section_code}"}. A <code className="font-mono">verified_past_paper</code> needs <code className="font-mono">source_year</code> and a reference or note. Unknown fields are rejected, and rows cannot be pre-marked as independently checked.
        </p>
        <pre className="overflow-auto rounded-lg bg-ink/[0.04] p-3 font-mono text-xs dark:bg-bone/[0.06]">{EXAMPLE}</pre>
      </section>
    </div>
  );
}

import Link from "next/link";
import { friendlyError } from "@/lib/admin/errors";
import type { Metadata } from "next";
import { Flash } from "@/components/admin/flash";
import { FilterBar } from "@/components/admin/filter-bar";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Pagination, buildQuery } from "@/components/admin/pagination";
import { CheckText, SourceBadge, StatusPill } from "@/components/admin/question-badges";
import { requirePermission } from "@/lib/admin/auth";
import { publishState } from "@/lib/admin/publishing";
import { can } from "@/lib/admin/permissions";
import { PAGE_SIZE, applyFilters, filterParams, listSelect, parseFilters } from "@/lib/questions/query";
import {
  ANSWER_CHECKS, CHECK_LABEL, EXAM_LABEL, EXAM_SLUGS, SOURCE_LABEL, SOURCE_TYPES, STATUSES, STATUS_LABEL, SUBJECT_SLUGS, SYSTEMS, SYSTEM_LABEL,
  type QuestionListRow,
} from "@/lib/questions/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { bulkStatusAction } from "./actions";

export const metadata: Metadata = { title: "Question bank" };

const field = "h-9 rounded-lg border border-ink/15 bg-paper px-2 text-sm text-ink dark:border-bone/20 dark:bg-chalkboard dark:text-bone";

export default async function QuestionBankPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const session = await requirePermission("questions.view");
  if (session.mode !== "accounts") {
    return (
      <div className="space-y-3">
        <h1 className="font-display text-2xl font-medium">Question bank</h1>
        <p className="text-sm text-ink-soft dark:text-bone-soft">The question bank lives in the database and needs Supabase accounts. Configure it (see <code className="font-mono">.env.example</code>) and run <code className="font-mono">npm run db:import</code>.</p>
      </div>
    );
  }
  const editor = can(session.role, "questions.edit");
  const f = parseFilters(searchParams);

  const supabase = createSupabaseServerClient();
  const from = (f.page - 1) * PAGE_SIZE;
  const { data, count, error } = await applyFilters(supabase.from("questions").select(listSelect(f), { count: "exact" }), f).range(from, from + PAGE_SIZE - 1);
  const total = count ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(f.page, pageCount);
  const rows = (data ?? []) as unknown as QuestionListRow[];
  const params = filterParams(f);
  const here = buildQuery("/admin/questions", { ...params, page: page > 1 ? String(page) : undefined });
  const sortLink = (sort: string): string => buildQuery("/admin/questions", { ...params, sort: sort === "updated" ? undefined : sort, dir: f.sort === sort && f.dir === "desc" ? "asc" : undefined });

  const columns: Column<QuestionListRow>[] = [
    ...(editor ? [{ key: "sel", header: "", className: "w-8", cell: (r: QuestionListRow) => <input type="checkbox" name="ids" value={r.id} form="bulk" aria-label={`Select ${r.legacy_id}`} /> }] : []),
    { key: "id", header: "ID", className: "w-28 font-mono text-xs", cell: (r) => <Link href={`/admin/questions/${r.id}`} className="text-pine-700 underline dark:text-pine-300">{r.legacy_id}</Link> },
    {
      key: "stem", header: "Question",
      cell: (r) => (
        <div>
          <Link href={`/admin/questions/${r.id}`} className="hover:underline">{r.stem.length > 120 ? `${r.stem.slice(0, 120)}…` : r.stem}</Link>
          <p className="mt-0.5 text-xs text-ink-soft dark:text-bone-soft">
            {SYSTEM_LABEL[r.source_system]} · {r.subjects?.slug ?? r.exam_subject ?? "—"}
            {r.content_hash !== r.source_hash ? (r.source_hash ? " · edited in admin" : " · created in admin") : ""}
            {r.needs_review ? " · needs review" : ""}
            {publishState(r.source_system, r.legacy_id, r.status, r.content_hash) === "pending" ? " · not yet published to learners" : ""}
          </p>
        </div>
      ),
    },
    { key: "src", header: "Source", className: "w-40", cell: (r) => <SourceBadge source={r.source_type} /> },
    { key: "chk", header: "Answer check", className: "w-36", cell: (r) => <CheckText check={r.answer_check} /> },
    { key: "st", header: "Status", className: "w-28", cell: (r) => <StatusPill status={r.status} /> },
    { key: "upd", header: "Updated", className: "w-28 whitespace-nowrap text-xs", cell: (r) => new Date(r.updated_at).toLocaleDateString("en-GB") },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-medium">Question bank</h1>
          <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">Quiz, CSS MPT and teacher-test questions in one place. Every change is audited; questions are archived, never deleted.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <a href={buildQuery("/admin/questions/export", { ...params, format: "csv" })} className="rounded-lg border border-ink/15 px-3 py-1.5 hover:border-pine-500 dark:border-bone/20">Export CSV</a>
          <a href={buildQuery("/admin/questions/export", { ...params, format: "json" })} className="rounded-lg border border-ink/15 px-3 py-1.5 hover:border-pine-500 dark:border-bone/20">Export JSON</a>
          {editor ? <Link href="/admin/questions/import" className="rounded-lg border border-ink/15 px-3 py-1.5 hover:border-pine-500 dark:border-bone/20">Import</Link> : null}
          {editor ? <Link href="/admin/questions/new" className="rounded-lg bg-pine-600 px-3 py-1.5 font-medium text-paper hover:bg-pine-700 dark:bg-pine-500 dark:text-chalkboard">New question</Link> : null}
        </div>
      </div>

      <Flash ok={searchParams["ok"]} error={searchParams["error"]} />

      <FilterBar
        action="/admin/questions" q={f.q} qLabel="Search" qPlaceholder="Question text or ID…"
        fields={[
          { name: "system", label: "Used in", value: f.system, options: SYSTEMS.map((s) => ({ value: s, label: SYSTEM_LABEL[s] })) },
          { name: "source", label: "Source", value: f.source, options: SOURCE_TYPES.map((s) => ({ value: s, label: SOURCE_LABEL[s] })) },
          { name: "status", label: "Status", value: f.status, options: STATUSES.map((s) => ({ value: s, label: STATUS_LABEL[s] })) },
          { name: "check", label: "Answer check", value: f.check, options: ANSWER_CHECKS.map((s) => ({ value: s, label: CHECK_LABEL[s] })) },
          { name: "exam", label: "Exam", value: f.exam, options: EXAM_SLUGS.map((s) => ({ value: s, label: EXAM_LABEL[s] ?? s })) },
          { name: "subject", label: "Subject", value: f.subject, options: SUBJECT_SLUGS.map((s) => ({ value: s, label: s })) },
          { name: "review", label: "Needs review", value: f.review, options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }] },
        ]}
      />
      <p className="text-xs text-ink-soft dark:text-bone-soft">
        Sort: <Link className="underline" href={sortLink("updated")}>updated</Link> · <Link className="underline" href={sortLink("legacy")}>ID</Link> · <Link className="underline" href={sortLink("system")}>system</Link>
      </p>

      {error ? <p role="alert" className="text-sm text-red-700 dark:text-red-300">Could not load questions: {friendlyError(error)}</p> : null}
      <DataTable caption="Questions" columns={columns} rows={rows} rowKey={(r) => r.id} empty="No questions match these filters." />

      {editor ? (
        <form id="bulk" action={bulkStatusAction} className="flex flex-wrap items-end gap-3 rounded-xl border border-ink/10 p-3 dark:border-bone/15">
          <input type="hidden" name="back" value={here} />
          <div>
            <label htmlFor="bulk-status" className="mb-1 block font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">For the selected questions</label>
            <select id="bulk-status" name="status" required defaultValue="" className={field}>
              <option value="" disabled>Choose an action…</option>
              <option value="in_review">Send to review</option>
              <option value="published">Publish</option>
              <option value="draft">Unpublish (back to draft)</option>
              <option value="archived">Archive</option>
            </select>
          </div>
          <div className="min-w-[200px] flex-1">
            <label htmlFor="bulk-reason" className="mb-1 block font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Reason (required to archive / unpublish)</label>
            <input id="bulk-reason" name="reason" maxLength={300} className={`${field} w-full`} />
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="confirm" /> I understand this takes questions out of use</label>
          <button type="submit" className="h-9 rounded-lg border border-ink/15 px-4 text-sm font-medium hover:border-pine-500 dark:border-bone/20">Apply to selected</button>
          <p className="basis-full text-xs text-ink-soft dark:text-bone-soft">Selection is per page (max 100 at a time). Questions flagged “needs review” or missing an explanation are skipped when publishing, and you’ll be told why.</p>
        </form>
      ) : null}

      <Pagination base="/admin/questions" params={params} page={page} pageCount={pageCount} total={total} pageSize={PAGE_SIZE} />
    </div>
  );
}

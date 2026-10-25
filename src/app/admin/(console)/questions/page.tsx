import { SubmitButton } from "@/components/admin/submit-button";
import { checkLabelCls, fieldCls as field, labelCls, linkBtnCls, linkBtnPrimaryCls, textLinkCls } from "@/components/admin/form-styles";
import Link from "next/link";
import { friendlyError } from "@/lib/admin/errors";
import type { Metadata } from "next";
import { Flash } from "@/components/admin/flash";
import { FilterBar } from "@/components/admin/filter-bar";
import { DataTable, EmptyState, type Column } from "@/components/admin/data-table";
import { ListError, ListNav, NavLink, Results } from "@/components/admin/list-nav";
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

export const metadata: Metadata = { title: "Question Bank" };


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

  const updated = (r: QuestionListRow): string => new Date(r.updated_at).toLocaleDateString("en-GB");
  const columns: Column<QuestionListRow>[] = [
    ...(editor
      ? [{
          key: "sel", header: "Select", hideLabel: true, width: "md:w-16",
          cell: (r: QuestionListRow) => (
            <label className="flex min-h-11 min-w-11 cursor-pointer items-center gap-3 lg:justify-center">
              <input type="checkbox" name="ids" value={r.id} form="bulk" className="h-5 w-5 shrink-0" />
              <span className="text-sm md:sr-only">Select {r.legacy_id}</span>
            </label>
          ),
        }]
      : []),
    { key: "id", header: "ID", width: "md:w-28", className: "font-mono text-helper", cell: (r) => <Link href={`/admin/questions/${r.id}`} className={textLinkCls}>{r.legacy_id}</Link> },
    {
      key: "stem", header: "Question", hideLabel: true,
      cell: (r) => (
        <div>
          {/* The whole question is in the page; it is only visually clamped. The link opens the full detail view. */}
          <Link href={`/admin/questions/${r.id}`} className="-my-1 block min-h-11 py-1 line-clamp-4 break-words text-base leading-snug hover:underline md:line-clamp-3 md:text-sm lg:min-h-0">{r.stem}</Link>
          <p className="mt-1 text-helper text-ink-soft dark:text-bone-soft">
            {SYSTEM_LABEL[r.source_system]} · {r.subjects?.slug ?? r.exam_subject ?? "—"}
            {r.content_hash !== r.source_hash ? (r.source_hash ? " · edited in admin" : " · created in admin") : ""}
            {r.needs_review ? " · needs review" : ""}
            {publishState(r.source_system, r.legacy_id, r.status, r.content_hash) === "pending" ? " · not yet published to learners" : ""}
          </p>
          {/* Columns that don't fit between tablet and desktop widths move here instead of being dropped. */}
          <div className="mt-1.5 hidden flex-wrap items-center gap-x-3 gap-y-1 md:flex xl:hidden">
            <SourceBadge source={r.source_type} />
            <span className="lg:hidden"><CheckText check={r.answer_check} /></span>
            <span className="text-helper text-ink-soft dark:text-bone-soft">Updated {updated(r)}</span>
          </div>
        </div>
      ),
    },
    { key: "src", header: "Source", width: "md:w-40", hideBelow: "xl", cell: (r) => <SourceBadge source={r.source_type} /> },
    { key: "chk", header: "Answer check", width: "md:w-36", hideBelow: "lg", cell: (r) => <CheckText check={r.answer_check} /> },
    { key: "st", header: "Status", width: "md:w-28", cell: (r) => <StatusPill status={r.status} /> },
    { key: "upd", header: "Updated", width: "md:w-28", nowrap: true, hideBelow: "xl", className: "text-helper", cell: updated },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-medium">Question bank</h1>
          <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">Quiz, CSS MPT and teacher-test questions in one place. Every change is audited; questions are archived, never deleted.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <a href={buildQuery("/admin/questions/export", { ...params, format: "csv" })} className={linkBtnCls}>Export CSV</a>
          <a href={buildQuery("/admin/questions/export", { ...params, format: "json" })} className={linkBtnCls}>Export JSON</a>
          {editor ? <Link href="/admin/questions/import" className={linkBtnCls}>Import</Link> : null}
          {editor ? <Link href="/admin/questions/new" className={linkBtnPrimaryCls}>New question</Link> : null}
        </div>
      </div>

      <Flash ok={searchParams["ok"]} info={searchParams["info"]} warn={searchParams["warn"]} error={searchParams["error"]} />

      <ListNav>
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
      <nav aria-label="Sort questions" className="flex flex-wrap items-center gap-x-1 text-helper text-ink-soft dark:text-bone-soft">
        Sort:
        {[["updated", "updated"], ["legacy", "ID"], ["system", "system"]].map(([key, label]) => (
          <NavLink key={key} href={sortLink(key!)} aria-current={f.sort === key ? "true" : undefined} className="inline-flex min-h-11 items-center rounded px-2 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 aria-[current=true]:font-medium aria-[current=true]:text-ink lg:min-h-0 lg:px-1 dark:aria-[current=true]:text-bone">{label}</NavLink>
        ))}
      </nav>

      <Results>
      {error ? <ListError message={`Could not load questions: ${friendlyError(error)}`} /> : null}
      {error ? null : <DataTable caption="Questions" columns={columns} rows={rows} rowKey={(r) => r.id} empty={<EmptyState title="No questions match these filters." hint="Try a shorter search or fewer filters." action={Object.keys(params).length ? <NavLink href="/admin/questions" className={linkBtnCls}>Clear filters</NavLink> : undefined} />} />}

      {editor ? (
        <form id="bulk" action={bulkStatusAction} className="flex flex-wrap items-end gap-3 rounded-xl border border-ink/10 p-3 dark:border-bone/15">
          <input type="hidden" name="back" value={here} />
          <div>
            <label htmlFor="bulk-status" className={labelCls}>For the selected questions</label>
            <select id="bulk-status" name="status" required defaultValue="" className={field}>
              <option value="" disabled>Choose an action…</option>
              <option value="in_review">Send to review</option>
              <option value="published">Publish</option>
              <option value="draft">Unpublish (back to draft)</option>
              <option value="archived">Archive</option>
            </select>
          </div>
          <div className="min-w-[200px] flex-1">
            <label htmlFor="bulk-reason" className={labelCls}>Reason (required to archive / unpublish)</label>
            <input id="bulk-reason" name="reason" maxLength={300} className={`${field} w-full`} />
          </div>
          <label className={checkLabelCls}><input type="checkbox" name="confirm" className="h-5 w-5" /> I understand this takes questions out of use</label>
          <SubmitButton pendingLabel={{ field: "status", labels: { published: "Publishing…", draft: "Unpublishing…", archived: "Archiving…", in_review: "Sending…" }, fallback: "Applying…" }}>Apply to selected</SubmitButton>
          <p className="basis-full text-helper text-ink-soft dark:text-bone-soft">Selection is per page (max 100 at a time). Questions flagged “needs review” or missing an explanation are skipped when publishing, and you’ll be told why.</p>
        </form>
      ) : null}

      <Pagination base="/admin/questions" params={params} page={page} pageCount={pageCount} total={total} pageSize={PAGE_SIZE} />
      </Results>
      </ListNav>
    </div>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import { DataTable, type Column } from "@/components/admin/data-table";
import { FilterBar } from "@/components/admin/filter-bar";
import { Pagination, buildQuery } from "@/components/admin/pagination";
import { SeverityBadge } from "@/components/admin/severity-badge";
import { requireAdmin } from "@/lib/admin/auth";
import { getHealthSnapshot } from "@/lib/admin/health-data";
import { AREA_LABEL, SEVERITIES, SEVERITY_LABEL, type Area, type Finding } from "@/lib/content-health";

export const metadata: Metadata = { title: "Content Health" };

const PAGE_SIZE = 25;
type Params = { severity?: string; area?: string; check?: string; subject?: string; q?: string; page?: string };

export default async function ContentHealthPage({ searchParams }: { searchParams: Params }) {
  await requireAdmin();
  const { report } = await getHealthSnapshot();

  const severity = SEVERITIES.find((s) => s === searchParams.severity) ?? "";
  const area = (Object.keys(AREA_LABEL) as Area[]).find((a) => a === searchParams.area) ?? "";
  const checks = [...new Set(report.findings.map((f) => f.check))].sort();
  const check = checks.find((c) => c === searchParams.check) ?? "";
  const subjects = [...new Set(report.findings.map((f) => f.subject).filter((s): s is string => !!s))].sort();
  const subject = subjects.find((s) => s === searchParams.subject) ?? "";
  const q = (searchParams.q ?? "").trim().slice(0, 100);
  const needle = q.toLowerCase();

  const filtered = report.findings.filter(
    (f) =>
      (!severity || f.severity === severity) &&
      (!area || f.area === area) &&
      (!check || f.check === check) &&
      (!subject || f.subject === subject) &&
      (!needle || `${f.title} ${f.detail ?? ""} ${f.entity} ${f.check}`.toLowerCase().includes(needle)),
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number.parseInt(searchParams.page ?? "1", 10) || 1), pageCount);
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const params = { severity: severity || undefined, area: area || undefined, check: check || undefined, subject: subject || undefined, q: q || undefined };

  const columns: Column<Finding>[] = [
    { key: "sev", header: "Severity", className: "w-24", cell: (f) => <SeverityBadge severity={f.severity} /> },
    {
      key: "finding", header: "Finding",
      cell: (f) => (
        <div>
          <p>{f.title}</p>
          {f.detail ? <p className="mt-0.5 text-xs text-ink-soft dark:text-bone-soft">{f.detail}</p> : null}
        </div>
      ),
    },
    {
      key: "where", header: "Where", className: "w-64",
      cell: (f) => (
        <div className="space-y-0.5 text-xs">
          <p className="font-mono text-ink-soft dark:text-bone-soft">{f.check}</p>
          {f.file ? <p className="break-all font-mono">{f.file}</p> : null}
          {f.href ? <Link href={f.href} className="text-pine-700 underline dark:text-pine-300" target="_blank" rel="noreferrer">Open page</Link> : null}
        </div>
      ),
    },
    { key: "area", header: "Area", className: "w-40 text-xs", cell: (f) => AREA_LABEL[f.area] },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-medium">Content health</h1>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">
          Cross-checks the subject registry, learning experiences, quizzes, learning paths, CSS MPT and teacher tests against each other. Read-only.
        </p>
      </div>

      <ul className="flex flex-wrap gap-2" aria-label="Findings by severity">
        {SEVERITIES.map((s) => (
          <li key={s}>
            <Link href={buildQuery("/admin/health", { ...params, severity: s })} className="flex items-center gap-2 rounded-lg border border-ink/10 px-3 py-1.5 text-sm hover:border-pine-500 dark:border-bone/15">
              <SeverityBadge severity={s} /> <span className="tabular-nums">{report.counts[s]}</span>
            </Link>
          </li>
        ))}
      </ul>

      {!report.routeChecksRan ? (
        <p className="text-sm text-amber-700 dark:text-amber-300">Route checks were skipped (app source not readable here). Run <code className="font-mono">npm run health</code> for the full set.</p>
      ) : null}

      <FilterBar
        action="/admin/health"
        q={q}
        qLabel="Search"
        qPlaceholder="Question id, route, text…"
        fields={[
          { name: "severity", label: "Severity", value: severity, options: SEVERITIES.map((s) => ({ value: s, label: SEVERITY_LABEL[s] })) },
          { name: "area", label: "Area", value: area, options: (Object.keys(AREA_LABEL) as Area[]).map((a) => ({ value: a, label: AREA_LABEL[a] })) },
          { name: "subject", label: "Subject / exam", value: subject, options: subjects.map((s) => ({ value: s, label: s })) },
          { name: "check", label: "Check", value: check, options: checks.map((c) => ({ value: c, label: c })) },
        ]}
      />

      <DataTable caption="Content health findings" columns={columns} rows={rows} rowKey={(f) => f.id} empty="No findings match these filters." />
      <Pagination base="/admin/health" params={params} page={page} pageCount={pageCount} total={filtered.length} pageSize={PAGE_SIZE} />
    </div>
  );
}

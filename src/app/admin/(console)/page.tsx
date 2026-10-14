import { DataTable, type Column } from "@/components/admin/data-table";
import { StatCard } from "@/components/admin/stat-card";
import { requireAdmin } from "@/lib/admin/auth";
import { getHealthSnapshot } from "@/lib/admin/health-data";
import { SEVERITY_LABEL, SEVERITIES } from "@/lib/content-health";
import type { Inventory } from "@/lib/content-health";

type SubjectRow = Inventory["subjects"][number];
type TeacherRow = Inventory["teacher"][number];

const n = (x: number): string => x.toLocaleString("en-US");
const SOURCE_LABEL: Record<string, string> = {
  verified_past_paper: "Verified past paper",
  existing_question: "Existing bank",
  generated_similar: "Generated (similar)",
  generated_syllabus: "Generated (syllabus)",
};

export default async function AdminOverviewPage() {
  await requireAdmin();
  const { report, inventory: inv } = await getHealthSnapshot();
  const t = inv.totals;

  const subjectCols: Column<SubjectRow>[] = [
    { key: "name", header: "Subject", cell: (r) => <span className="font-medium">{r.name}</span> },
    { key: "topics", header: "Topics", className: "text-right tabular-nums", cell: (r) => r.topics },
    { key: "sims", header: "Simulations", className: "text-right tabular-nums", cell: (r) => r.simulations },
    { key: "gle", header: "With GLE", className: "text-right tabular-nums", cell: (r) => `${r.gle} / ${r.simulations}` },
    { key: "banks", header: "Quiz banks", className: "text-right tabular-nums", cell: (r) => r.quizBanks },
    { key: "q", header: "Questions", className: "text-right tabular-nums", cell: (r) => n(r.questions) },
    { key: "paths", header: "Paths", className: "text-right tabular-nums", cell: (r) => r.paths },
  ];
  const teacherCols: Column<TeacherRow>[] = [
    { key: "exam", header: "Exam", cell: (r) => <span className="font-medium">{r.label}</span> },
    { key: "rows", header: "Questions", className: "text-right tabular-nums", cell: (r) => n(r.questions) },
    { key: "past", header: "Verified past paper", className: "text-right tabular-nums", cell: (r) => r.bySource["verified_past_paper"] ?? 0 },
    { key: "existing", header: "Existing bank", className: "text-right tabular-nums", cell: (r) => r.bySource["existing_question"] ?? 0 },
    { key: "gen", header: "Generated", className: "text-right tabular-nums", cell: (r) => (r.bySource["generated_syllabus"] ?? 0) + (r.bySource["generated_similar"] ?? 0) },
    { key: "ver", header: "Flagged verified", className: "text-right tabular-nums", cell: (r) => r.verified },
    { key: "rev", header: "Needs review", className: "text-right tabular-nums", cell: (r) => r.needsReview },
    { key: "mocks", header: "Mocks", className: "text-right tabular-nums", cell: (r) => r.mocks },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-medium">Overview</h1>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">
          Every number below is read live from the platform&apos;s registries. Scanned {new Date(report.generatedAt).toLocaleString("en-GB")} in {report.durationMs} ms.
        </p>
      </div>

      <section aria-labelledby="h-health">
        <h2 id="h-health" className="mb-3 font-display text-lg font-medium">Content health</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {SEVERITIES.map((s) => (
            <StatCard key={s} label={SEVERITY_LABEL[s]} value={report.counts[s]} href={`/admin/health?severity=${s}`} tone={s === "critical" && report.counts[s] > 0 ? "alert" : undefined} />
          ))}
        </div>
        {!report.routeChecksRan ? (
          <p className="mt-3 text-sm text-amber-700 dark:text-amber-300">Route checks were skipped because the app source isn&apos;t readable in this environment. Run <code className="font-mono">npm run health</code> locally or in CI for the full set.</p>
        ) : null}
      </section>

      <section aria-labelledby="h-content">
        <h2 id="h-content" className="mb-3 font-display text-lg font-medium">Learning content</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Subjects" value={t.subjects} hint={`${t.topics} topics`} />
          <StatCard label="Simulations" value={t.simulations} />
          <StatCard label="Learning experiences" value={t.gle} hint={`${n(t.gleChallenges)} challenge scenarios`} />
          <StatCard label="Learning paths" value={t.paths} hint={`${t.pathNodes} nodes`} />
          <StatCard label="Quiz banks" value={t.quizBanks} />
          <StatCard label="Quiz questions" value={n(t.quizQuestions)} />
          <StatCard label="Cross-subject links" value={t.connections} />
        </div>
        <div className="mt-4">
          <DataTable caption="Content by subject" columns={subjectCols} rows={inv.subjects} rowKey={(r) => r.slug} empty="No subjects." />
        </div>
      </section>

      <section aria-labelledby="h-exams">
        <h2 id="h-exams" className="mb-3 font-display text-lg font-medium">Exams</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="CSS MPT questions" value={n(inv.mpt.questions)} hint={`${inv.mpt.mocks} full mocks`} />
          <StatCard label="MPT verified past paper" value={inv.mpt.bySource["Verified Past Paper"] ?? 0} hint={`${inv.mpt.verified} flagged verified`} />
          <StatCard label="MPT existing bank" value={inv.mpt.bySource["Existing Question Bank"] ?? 0} />
          <StatCard label="MPT generated" value={inv.mpt.bySource["Generated Practice"] ?? 0} />
        </div>
        <h3 className="mb-2 mt-5 font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Teacher tests · question provenance</h3>
        <DataTable caption="Teacher test banks by provenance" columns={teacherCols} rows={inv.teacher} rowKey={(r) => r.exam} empty="No teacher banks." />
        <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">
          Provenance labels: {Object.values(SOURCE_LABEL).join(" · ")}. Only genuine past-paper questions may be flagged verified; Content Health fails if anything else is.
        </p>
      </section>

      <p className="rounded-xl border border-ink/10 p-4 text-sm text-ink-soft dark:border-bone/15 dark:text-bone-soft">
        Users, learner progress and usage analytics are not shown because this version stores no learner data on a server — progress lives only in each learner&apos;s own browser. Those screens arrive once accounts exist.
      </p>
    </div>
  );
}

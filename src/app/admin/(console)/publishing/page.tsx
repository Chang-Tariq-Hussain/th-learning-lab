import type { Metadata } from "next";
import { friendlyError } from "@/lib/admin/errors";
import Link from "next/link";
import { StatCard } from "@/components/admin/stat-card";
import { requirePermission } from "@/lib/admin/auth";
import { manifest, publishedOverlay } from "@/lib/admin/publishing";
import { overlayIsEmpty } from "@/lib/content-overlay/apply";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Publishing" };

interface State { source_system: string; legacy_id: string; status: string; content_hash: string }
interface Latest { at: string; actor: string | null; meta: { overlay_changed?: boolean } | null }

async function databaseState(): Promise<{ rows: State[]; error?: string }> {
  const supabase = createSupabaseServerClient();
  const rows: State[] = [];
  for (let from = 0; from < 20_000; from += 1000) {
    const { data, error } = await supabase.from("questions").select("source_system, legacy_id, status, content_hash").order("id").range(from, from + 999);
    if (error) return { rows, error: friendlyError(error) };
    rows.push(...((data ?? []) as State[]));
    if ((data ?? []).length < 1000) break;
  }
  return { rows };
}

export default async function PublishingPage() {
  const session = await requirePermission("questions.view");
  if (session.mode !== "accounts") {
    return (
      <div className="space-y-3">
        <h1 className="font-display text-2xl font-medium">Publishing</h1>
        <p className="text-sm text-ink-soft dark:text-bone-soft">Publishing compares the database with what learners see, so it needs Supabase accounts. Configure them (see <code className="font-mono">.env.example</code>).</p>
      </div>
    );
  }
  const supabase = createSupabaseServerClient();
  const [{ rows, error }, latestRes] = await Promise.all([databaseState(), supabase.rpc("latest_publish")]);
  const latest = (latestRes.data ?? null) as Latest | null;

  const published = manifest.generatedAt !== null;
  let changed = 0, added = 0, wentLive = 0, wentOffline = 0;
  if (published) {
    for (const r of rows) {
      const was = manifest.questions[`${r.source_system}:${r.legacy_id}`];
      if (was === undefined) { added += 1; continue; }
      if (was === `${r.status}|${r.content_hash}`) continue;
      const wasStatus = was.split("|")[0];
      if (wasStatus !== "published" && r.status === "published") wentLive += 1;
      else if (wasStatus === "published" && r.status !== "published") wentOffline += 1;
      else changed += 1;
    }
  }
  const pending = changed + added + wentLive + wentOffline;
  const o = publishedOverlay;
  const quizBanks = Object.keys(o.quiz).length;
  const quizEdits = Object.values(o.quiz).reduce((n, b) => n + Object.keys(b.replace ?? {}).length, 0);
  const quizRemoved = Object.values(o.quiz).reduce((n, b) => n + (b.remove?.length ?? 0), 0);
  const quizAdded = Object.values(o.quiz).reduce((n, b) => n + (b.add?.length ?? 0), 0);
  const mptEdits = Object.keys(o.mpt.replace ?? {}).length;
  const teacher = (["pst", "jest", "jst"] as const).map((e) => ({ e, r: Object.keys(o.teacher[e]?.replace ?? {}).length, x: o.teacher[e]?.remove?.length ?? 0, a: o.teacher[e]?.add?.length ?? 0 }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-medium">Publishing</h1>
        <p className="mt-1 max-w-3xl text-sm text-ink-soft dark:text-bone-soft">
          Learners never read the database. They see the code, plus a small <em>content overlay</em> of the questions you have edited, added or withdrawn here. Edits are <strong>not live</strong> until that overlay is published and the site is deployed.
        </p>
      </div>
      {error ? <p role="alert" className="text-sm text-red-700 dark:text-red-300">Could not read the database: {error}</p> : null}

      <section aria-labelledby="h-pend" className="space-y-3">
        <h2 id="h-pend" className="font-display text-lg font-medium">Waiting to be published</h2>
        {!published ? (
          <p className="rounded-lg border border-ink/10 p-3 text-sm text-ink-soft dark:border-bone/15 dark:text-bone-soft">Nothing has been published yet, so learners see the questions exactly as written in code. After you edit questions here, run the publish step below.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="Edited" value={changed} tone={changed ? "alert" : undefined} />
              <StatCard label="New in the database" value={added} />
              <StatCard label="Went live" value={wentLive} />
              <StatCard label="Taken offline" value={wentOffline} />
            </div>
            <p className="text-sm">{pending === 0 ? "Everything in the database that learners can see has been published." : `${pending} question(s) changed since the last publish. Some may not affect learners (for example drafts).`}</p>
          </>
        )}
      </section>

      <section aria-labelledby="h-live" className="space-y-3">
        <h2 id="h-live" className="font-display text-lg font-medium">What the last publish contains</h2>
        {overlayIsEmpty(o) ? (
          <p className="text-sm text-ink-soft dark:text-bone-soft">An empty overlay: learners see the code exactly as written.</p>
        ) : (
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>Quiz: {quizEdits} edited, {quizRemoved} removed, {quizAdded} added, across {quizBanks} bank(s)</li>
            <li>CSS MPT: {mptEdits} edited</li>
            {teacher.map((t) => <li key={t.e}>{t.e.toUpperCase()}: {t.r} edited, {t.x} removed, {t.a} added</li>)}
          </ul>
        )}
        <p className="text-xs text-ink-soft dark:text-bone-soft">
          Generated {published ? new Date(manifest.generatedAt!).toLocaleString("en-GB") : "never"}
          {latest ? ` · last publish recorded ${new Date(latest.at).toLocaleString("en-GB")} by ${latest.actor ?? "unknown"}` : ""}
        </p>
      </section>

      <section aria-labelledby="h-how" className="space-y-2 rounded-xl border border-ink/10 p-4 dark:border-bone/15">
        <h2 id="h-how" className="font-display text-lg font-medium">How to publish</h2>
        <ol className="list-decimal space-y-1 pl-5 text-sm">
          <li>On a machine with the project and <code className="font-mono">DATABASE_URL</code> set: <code className="font-mono">npm run content:publish -- --dry-run</code> to preview.</li>
          <li><code className="font-mono">npm run content:publish</code> writes <code className="font-mono">src/content/overlay.json</code> and <code className="font-mono">manifest.json</code>. It refuses, and writes nothing, if publishing could break learners (a mock losing a question, an emptied bank, a question missing from the database).</li>
          <li>Review <code className="font-mono">git diff src/content</code>, commit, and deploy. Learners see the change after the deploy.</li>
          <li>To undo: revert that commit and redeploy — the previous overlay returns exactly.</li>
        </ol>
        <p className="text-xs text-ink-soft dark:text-bone-soft">Why not live? A deploy-time publish means learner pages never depend on the database being up, are fast, and every change is reviewable and reversible in git. See <Link href="/admin/health" className="underline">Content Health</Link> for checks on what is served.</p>
      </section>
    </div>
  );
}

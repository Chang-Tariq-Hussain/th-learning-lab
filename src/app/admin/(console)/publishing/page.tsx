import { SubmitButton } from "@/components/admin/submit-button";
import type { Metadata } from "next";
import { friendlyError } from "@/lib/admin/errors";
import Link from "next/link";
import { StatCard } from "@/components/admin/stat-card";
import { Flash } from "@/components/admin/flash";
import { requirePermission } from "@/lib/admin/auth";
import { can } from "@/lib/admin/permissions";
import { latestRun, publishConfig } from "@/lib/admin/github";
import { publishContentAction } from "./actions";
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

export default async function PublishingPage({ searchParams }: { searchParams: { ok?: string; info?: string; warn?: string; error?: string } }) {
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
  const canPublish = can(session.role, "content.publish");
  const cfg = publishConfig();
  const run = cfg ? await latestRun(cfg) : null;
  const active = !!run && "run" in run && !!run.run && run.run.status !== "completed";
  // A healthy publish takes a few minutes. Past 15 minutes it is stuck: say so and let the person start again.
  const stuck = active && !!run && "run" in run && !!run.run && Date.now() - new Date(run.run.startedAt).getTime() > 15 * 60_000;
  const running = active && !stuck;

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
      <Flash ok={searchParams.ok} info={searchParams.info} warn={searchParams.warn} error={searchParams.error} />
      {error ? <p role="alert" className="text-sm text-red-700 dark:text-red-300">Could not read the database: {error}</p> : null}

      <section aria-labelledby="h-stages" className="space-y-2">
        <h2 id="h-stages" className="font-display text-lg font-medium">Where a change is</h2>
        <ol className="grid gap-2 text-sm sm:grid-cols-3">
          <li className="rounded-lg border border-ink/10 p-3 dark:border-bone/15"><strong>1. Saved</strong><br />In the database. Only admins see it.</li>
          <li className="rounded-lg border border-ink/10 p-3 dark:border-bone/15"><strong>2. Waiting to be published</strong><br />Counted below. Learners do not see it yet.</li>
          <li className="rounded-lg border border-ink/10 p-3 dark:border-bone/15"><strong>3. Live</strong><br />Published and the site redeployed. Learners see it.</li>
        </ol>
      </section>

      <section aria-labelledby="h-go" className="space-y-3 rounded-xl border border-pine-500/40 p-4">
        <h2 id="h-go" className="font-display text-lg font-medium">Publish to learners</h2>
        {!canPublish ? (
          <p className="text-sm text-ink-soft dark:text-bone-soft">Your role can see this page but cannot publish. Ask a question manager or super admin.</p>
        ) : !cfg ? (
          <p className="text-sm text-ink-soft dark:text-bone-soft">One-click publishing is not set up yet. Ask your developer to add the GitHub publishing settings (<code className="font-mono">GITHUB_PUBLISH_TOKEN</code> and <code className="font-mono">GITHUB_PUBLISH_REPO</code>). Until then, use the command-line steps below.</p>
        ) : (
          <>
            <p className="max-w-3xl text-sm">Makes every published question, edit and withdrawal available to learners. It checks for problems first and stops without changing anything if publishing could break a quiz or mock test. It takes a few minutes.</p>
            <form action={publishContentAction}>
              <SubmitButton variant="primary" disabled={running} pendingLabel="Starting publish…">{running ? "Publishing in progress…" : "Publish to learners"}</SubmitButton>
            </form>
            {stuck && run && "run" in run && run.run ? <p role="alert" className="text-sm text-red-700 dark:text-red-300">The last publish has been running for over 15 minutes, which is not normal — it looks stuck. <a href={run.run.url} className="underline" target="_blank" rel="noreferrer">Open it on GitHub</a> (needs GitHub access) to see why, then you can start again.</p> : null}
            {run && "error" in run ? <p className="text-helper text-ink-soft dark:text-bone-soft">{run.error}</p> : null}
            {run && "run" in run ? (
              run.run ? (
                <p className="text-sm" role="status">
                  Last publish: <strong>{stuck ? "stuck" : run.run.status !== "completed" ? "running" : run.run.conclusion === "success" ? "finished (the site is redeploying or already live)" : "FAILED — nothing was changed for learners"}</strong>
                  {" · "}started {new Date(run.run.startedAt).toLocaleString("en-GB")}
                  {run.run.status === "completed" && run.run.conclusion !== "success" ? <> · <a href={run.run.url} className="underline" target="_blank" rel="noreferrer">see why (needs GitHub access)</a></> : null}
                </p>
              ) : <p className="text-sm text-ink-soft dark:text-bone-soft">No publish has been started from here yet.</p>
            ) : null}
          </>
        )}
      </section>

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
        <p className="text-helper text-ink-soft dark:text-bone-soft">
          Generated {published ? new Date(manifest.generatedAt!).toLocaleString("en-GB") : "never"}
          {latest ? ` · last publish recorded ${new Date(latest.at).toLocaleString("en-GB")} by ${latest.actor ?? "unknown"}` : ""}
        </p>
      </section>

      <details className="space-y-2 rounded-xl border border-ink/10 p-4 dark:border-bone/15">
        <summary id="h-how" className="min-h-11 cursor-pointer py-2.5 font-display text-lg font-medium">Advanced: publish from the command line (developers)</summary>
        <ol className="list-decimal space-y-1 pl-5 text-sm">
          <li>On a machine with the project and <code className="font-mono">DATABASE_URL</code> set: <code className="font-mono">npm run content:publish -- --dry-run</code> to preview.</li>
          <li><code className="font-mono">npm run content:publish</code> writes <code className="font-mono">src/content/overlay.json</code> and <code className="font-mono">manifest.json</code>. It refuses, and writes nothing, if publishing could break learners (a mock losing a question, an emptied bank, a question missing from the database).</li>
          <li>Review <code className="font-mono">git diff src/content</code>, commit, and deploy. Learners see the change after the deploy.</li>
          <li>To undo: revert that commit and redeploy — the previous overlay returns exactly.</li>
        </ol>
        <p className="text-helper text-ink-soft dark:text-bone-soft">Why not live? A deploy-time publish means learner pages never depend on the database being up, are fast, and every change is reviewable and reversible in git. See <Link href="/admin/health" className="underline">Content Health</Link> for checks on what is served.</p>
      </details>
    </div>
  );
}

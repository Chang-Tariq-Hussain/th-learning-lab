/**
 * Publish the database's PUBLISHED questions to learners.
 *
 *   npm run content:publish -- --dry-run   show what would change; write nothing
 *   npm run content:publish                write src/content/overlay.json + manifest.json (then commit + deploy)
 *   npm run content:publish -- --check     exit 1 if the committed files are out of date (CI / pre-deploy guard)
 *
 * The learner app never talks to the database: it reads the committed overlay (the differences from the code
 * registries), so a publish is reviewable in git and goes live with a normal deploy. Refuses — and writes
 * nothing — if publishing could harm learners (see lib/content-overlay/publish.ts).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { hashOf } from "../../src/lib/db-seed/hash";
import { buildOverlay, canonicalManifest, canonicalOverlay } from "../../src/lib/content-overlay/publish";
import type { ContentOverlay, Manifest } from "../../src/lib/content-overlay/types";
import { loadBaseline } from "./baseline";
import { connect } from "./env";

// CONTENT_DIR lets tests publish somewhere other than the committed files.
const DIR = process.env.CONTENT_DIR ?? resolve(process.cwd(), "src/content");
const OVERLAY_FILE = resolve(DIR, "overlay.json");
const MANIFEST_FILE = resolve(DIR, "manifest.json");
const read = <T>(file: string): T => JSON.parse(readFileSync(file, "utf8")) as T;

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const check = args.includes("--check");
  const dry = args.includes("--dry-run");
  const client = await connect();
  try {
    const result = await buildOverlay(client, await loadBaseline());
    if (result.problems.length) {
      console.error("\nNOT PUBLISHED — fix these first:\n");
      for (const p of result.problems) console.error(`  ✗ ${p}`);
      process.exit(1);
    }
    const currentOverlay = read<ContentOverlay>(OVERLAY_FILE);
    const currentManifest = read<Manifest & { report?: unknown }>(MANIFEST_FILE);
    const overlayChanged = canonicalOverlay(result.overlay) !== canonicalOverlay(currentOverlay);
    const manifestChanged = canonicalManifest(result.manifest) !== canonicalManifest(currentManifest);

    const r = result.report;
    console.log(`\nWhat learners will see, compared with the code registries:`);
    console.log(`  quiz     ${r.quiz.replaced} edited · ${r.quiz.removed} removed · ${r.quiz.added} added   (${r.quiz.banksTouched} banks affected)`);
    console.log(`  CSS MPT  ${r.mpt.replaced} edited${r.mpt.dbOnly ? `   (${r.mpt.dbOnly} database-only question(s) are not in any stored mock, so learners won't see them)` : ""}`);
    for (const e of ["pst", "jest", "jst"] as const) console.log(`  ${e.toUpperCase().padEnd(8)} ${r.teacher[e].replaced} edited · ${r.teacher[e].removed} removed · ${r.teacher[e].added} added`);
    console.log(`  (${r.questionsInDatabase} questions in the database)\n`);

    if (!overlayChanged && !manifestChanged) { console.log("Nothing to publish: the committed overlay already matches the database."); return; }
    if (check) { console.error("UNPUBLISHED CHANGES: src/content is out of date. Run `npm run content:publish`, commit, and deploy."); process.exit(1); }
    if (dry) { console.log(`DRY RUN — would update:${overlayChanged ? " overlay.json" : ""}${manifestChanged ? " manifest.json" : ""}. Nothing written.`); return; }

    writeFileSync(OVERLAY_FILE, JSON.stringify(result.overlay, null, 2) + "\n");
    writeFileSync(MANIFEST_FILE, JSON.stringify({ ...result.manifest, report: result.report }, null, 1) + "\n");
    await client.query(
      "insert into public.audit_log (actor_email, actor_role, action, entity, meta) values ($1, 'operator-script', 'content.published', 'content', $2::jsonb)",
      [process.env.USER ?? "cli", JSON.stringify({ report: result.report, overlay_hash: hashOf(canonicalOverlay(result.overlay)), overlay_changed: overlayChanged })]);
    console.log("Published. Updated src/content/" + (overlayChanged ? "overlay.json " : "") + "manifest.json");
    console.log("Next: review `git diff src/content`, commit, and deploy — learners see the change after the deploy.");
  } finally {
    await client.end();
  }
}
main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });

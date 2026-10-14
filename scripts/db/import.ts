/**
 * Import the code registries into Postgres.
 *
 *   npm run db:import              DRY RUN: does everything, prints the outcome, rolls back
 *   npm run db:import -- --apply   commit (writes an audit_log entry)
 *
 * Idempotent and non-destructive: never deletes, and never overwrites a row an
 * admin has edited since it was imported. Safe to re-run after registry changes.
 */
import { loadHealthContext } from "../../src/lib/content-health";
import { applyBundle, buildSeedBundle } from "../../src/lib/db-seed";
import { connect } from "./env";

async function main(): Promise<void> {
  const apply = process.argv.includes("--apply");
  const bundle = buildSeedBundle(await loadHealthContext(null));
  const client = await connect();
  try {
    const r = await applyBundle(client, bundle, { apply, actor: process.env.USER ?? "cli" });
    console.log(`\n${apply ? "APPLIED" : "DRY RUN (rolled back)"}\n`);
    console.log("table".padEnd(18), "new".padStart(6), "changed".padStart(8), "unchanged/protected".padStart(21));
    for (const [t, x] of Object.entries(r.tables)) console.log(t.padEnd(18), String(x.inserted).padStart(6), String(x.updated).padStart(8), String(x.skipped).padStart(21));
    if (Object.keys(r.childRowsWritten).length) console.log("\nchild rows written:", JSON.stringify(r.childRowsWritten));
    const edited = Object.entries(r.editedInAdmin).filter(([, n]) => n > 0);
    if (edited.length) console.log("\nedited in admin (left untouched):", edited.map(([t, n]) => `${t}=${n}`).join(", "));
    if (!apply) console.log("\nRe-run with --apply to commit.");
  } finally {
    await client.end();
  }
}
main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });

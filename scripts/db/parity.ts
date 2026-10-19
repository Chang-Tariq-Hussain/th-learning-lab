/** `npm run db:parity` — does the database still mirror the code registries? Exit 1 if not. */
import { loadHealthContext } from "../../src/lib/content-health";
import { buildSeedBundle, computeParity } from "../../src/lib/db-seed";
import { connect } from "./env";

async function main(): Promise<void> {
  const bundle = buildSeedBundle(await loadHealthContext(null, { raw: true }));
  const client = await connect();
  try {
    const p = await computeParity(client, bundle);
    console.log(`Parity: ${p.percent}% ${p.ok ? "— database mirrors the registries" : "— DRIFT DETECTED"}\n`);
    console.log("table".padEnd(16), "expected".padStart(9), "match".padStart(7), "missing".padStart(8), "stale".padStart(6), "edited".padStart(7), "extra".padStart(6));
    for (const t of p.tables) console.log(t.table.padEnd(16), String(t.expected).padStart(9), String(t.matching).padStart(7), String(t.missingCount).padStart(8), String(t.stale).padStart(6), String(t.editedInAdmin).padStart(7), String(t.extra).padStart(6));
    console.log("");
    for (const c of p.children) console.log(`${c.ok ? "✓" : "✗"} ${c.name}: ${c.actual}/${c.expected}`);
    for (const x of p.problems) console.log(`✗ ${x}`);
    for (const t of p.tables.filter((x) => x.missingCount)) console.log(`\nmissing in ${t.table} (first ${t.missing.length}): ${t.missing.join(", ")}`);
    console.log("\nstale = registry changed since import (run db:import). edited = changed in admin (kept). extra = in DB only (kept).");
    process.exit(p.ok ? 0 : 1);
  } finally {
    await client.end();
  }
}
main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(2); });

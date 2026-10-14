/**
 * Content Health CLI.
 *
 *   npm run health                       summary + all findings at or above "low"
 *   npm run health -- --all              include "info" findings
 *   npm run health -- --json             machine-readable report on stdout
 *   npm run health -- --fail-on=high     exit 1 if anything at/above that severity (default: critical)
 *   npm run health -- --no-routes        skip filesystem route checks
 *
 * Reads the platform's own registries; changes nothing.
 */
import { resolve } from "node:path";
import {
  AREA_LABEL, SEVERITIES, SEVERITY_LABEL, SEVERITY_RANK,
  exceeds, isSeverity, loadHealthContext, runHealth, scanRoutes,
  type Severity,
} from "../src/lib/content-health";

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const flag = (name: string): string | undefined => args.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
  const json = !!flag("json");
  const showAll = !!flag("all");
  const noRoutes = !!flag("no-routes");
  const failArg = flag("fail-on")?.split("=")[1] ?? "critical";
  if (!isSeverity(failArg)) {
    console.error(`--fail-on must be one of: ${SEVERITIES.join(", ")}`);
    process.exit(2);
  }
  const failOn: Severity = failArg;

  const routes = noRoutes ? null : scanRoutes(resolve(process.cwd(), "src/app"));
  const ctx = await loadHealthContext(routes);
  const report = runHealth(ctx);

  if (json) {
    process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  } else {
    console.log(`Content Health — ${report.findings.length} finding(s) in ${report.durationMs} ms${report.routeChecksRan ? "" : " (route checks skipped)"}`);
    console.log(SEVERITIES.map((s) => `${SEVERITY_LABEL[s]}: ${report.counts[s]}`).join("   "));
    console.log("");
    const minRank = showAll ? SEVERITY_RANK.info : SEVERITY_RANK.low;
    let lastGroup = "";
    for (const f of report.findings) {
      if (SEVERITY_RANK[f.severity] > minRank) continue;
      const group = `${SEVERITY_LABEL[f.severity].toUpperCase()} · ${AREA_LABEL[f.area]}`;
      if (group !== lastGroup) { console.log(`\n## ${group}`); lastGroup = group; }
      console.log(`- [${f.check}] ${f.title}${f.detail ? `\n    ${f.detail}` : ""}${f.file ? `\n    file: ${f.file}` : ""}`);
    }
    console.log("");
  }
  if (exceeds(report, failOn)) {
    if (!json) console.error(`FAILED: findings at or above "${failOn}" exist.`);
    process.exit(1);
  }
}

main().catch((e) => { console.error(e); process.exit(2); });

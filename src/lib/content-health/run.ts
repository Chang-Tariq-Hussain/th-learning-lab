import { checkOverlay, overlayChecks } from "./checks/overlay";
import { checkConnections, connectionChecks } from "./checks/connections";
import { checkGle, gleChecks } from "./checks/gle";
import { checkMpt, mptChecks } from "./checks/mpt";
import { checkPaths, pathChecks } from "./checks/paths";
import { checkQuiz, quizChecks } from "./checks/quiz";
import { checkRegistry, registryChecks } from "./checks/registry";
import { checkTeacher, teacherChecks } from "./checks/teacher";
import {
  SEVERITIES, SEVERITY_RANK,
  type Area, type CheckDefinition, type CheckFn, type Finding, type HealthContext, type HealthReport, type Severity,
} from "./types";

const CHECKS: { fn: CheckFn; defs: CheckDefinition[] }[] = [
  { fn: checkOverlay, defs: overlayChecks },
  { fn: checkRegistry, defs: registryChecks },
  { fn: checkGle, defs: gleChecks },
  { fn: checkQuiz, defs: quizChecks },
  { fn: checkPaths, defs: pathChecks },
  { fn: checkConnections, defs: connectionChecks },
  { fn: checkMpt, defs: mptChecks },
  { fn: checkTeacher, defs: teacherChecks },
];

export const ALL_CHECKS: CheckDefinition[] = CHECKS.flatMap((c) => c.defs);

const emptyCounts = (): Record<Severity, number> => ({ critical: 0, high: 0, medium: 0, low: 0, info: 0 });

export function runHealth(ctx: HealthContext): HealthReport {
  const started = Date.now();
  const findings: Finding[] = [];
  for (const c of CHECKS) findings.push(...c.fn(ctx));

  // Ids must be unique (they are used as React keys and for future "ignore" records).
  const seen = new Map<string, number>();
  for (const f of findings) {
    const n = (seen.get(f.id) ?? 0) + 1;
    seen.set(f.id, n);
    if (n > 1) f.id = `${f.id}#${n}`;
  }

  findings.sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity] || a.check.localeCompare(b.check) || a.entity.localeCompare(b.entity));

  const counts = emptyCounts();
  const byArea = {} as Record<Area, Record<Severity, number>>;
  for (const f of findings) {
    counts[f.severity] += 1;
    (byArea[f.area] ??= emptyCounts())[f.severity] += 1;
  }
  return {
    generatedAt: new Date().toISOString(),
    durationMs: Date.now() - started,
    routeChecksRan: ctx.routes !== null,
    findings,
    counts,
    byArea,
    checksRun: ALL_CHECKS.filter((d) => ctx.routes !== null || !d.id.startsWith("routes.")),
  };
}

/** True when any finding is at or above `threshold` severity. */
export function exceeds(report: HealthReport, threshold: Severity): boolean {
  return report.findings.some((f) => SEVERITY_RANK[f.severity] <= SEVERITY_RANK[threshold]);
}

export function isSeverity(x: string): x is Severity {
  return (SEVERITIES as string[]).includes(x);
}

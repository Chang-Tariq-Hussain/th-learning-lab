import { finding, type CheckDefinition, type CheckFn, type Finding } from "../types";

export const overlayChecks: CheckDefinition[] = [
  { id: "overlay.ignored-item", area: "overlay", severity: "high", description: "An item in the published content overlay is invalid, stale or unknown, so learners are NOT seeing it." },
  { id: "overlay.active", area: "overlay", severity: "info", description: "Learners are served database edits on top of the code (overlay in use)." },
];

export const checkOverlay: CheckFn = (ctx) => {
  const out: Finding[] = ctx.overlay.ignored.map((s) =>
    finding({ check: "overlay.ignored-item", area: "overlay", severity: "high", entity: `${s.scope}/${s.id}`,
      title: `Published overlay item ignored (${s.scope} ${s.id}): ${s.why}`, detail: "Learners keep the code version. Fix the question in the Question Bank and publish again.", file: "src/content/overlay.json" }));
  if (!ctx.overlay.empty) out.push(finding({ check: "overlay.active", area: "overlay", severity: "info", entity: "overlay", title: `Learners are served published database edits (overlay generated ${ctx.overlay.generatedAt ?? "unknown"}).`, file: "src/content/overlay.json" }));
  return out;
};

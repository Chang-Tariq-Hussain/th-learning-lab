import { finding, type CheckDefinition, type CheckFn, type Finding } from "../types";
import { simsByHref } from "../registry-index";

export const connectionChecks: CheckDefinition[] = [
  { id: "connections.href-not-in-registry", area: "connections", severity: "high", description: "A cross-subject connection links to a route that is not in the subject registry." },
  { id: "connections.duplicate-id", area: "connections", severity: "high", description: "Two connections share an id." },
];

export const checkConnections: CheckFn = (ctx) => {
  const out: Finding[] = [];
  const sims = simsByHref(ctx);
  const ids = new Map<string, number>();
  for (const c of ctx.connections) {
    ids.set(c.id, (ids.get(c.id) ?? 0) + 1);
    for (const [role, node] of [["source", c.source], ["destination", c.destination], ["prerequisite", c.prerequisite]] as const) {
      if (node?.href && !sims.has(node.href)) {
        out.push(finding({ check: "connections.href-not-in-registry", area: "connections", severity: "high", entity: `${c.id}/${role}`,
          title: `Connection "${c.id}" ${role} links to ${node.href}, which is not in the subject registry.`, href: node.href,
          file: "src/features/cross-subject-connections/data/connections.ts" }));
      }
    }
  }
  for (const [id, n] of ids) if (n > 1) out.push(finding({ check: "connections.duplicate-id", area: "connections", severity: "high", entity: id, title: `Connection id "${id}" is used ${n} times.` }));
  return out;
};

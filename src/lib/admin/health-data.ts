import { resolve } from "node:path";
import { computeInventory, loadHealthContext, runHealth, scanRoutes, type HealthReport, type Inventory } from "@/lib/content-health";

export interface HealthSnapshot {
  report: HealthReport;
  inventory: Inventory;
}

const TTL_MS = process.env.NODE_ENV === "production" ? 60_000 : 0;
let cached: { at: number; snap: HealthSnapshot } | null = null;

/** Runs (or reuses, for up to a minute in production) the content-health scan. Server-only. */
export async function getHealthSnapshot(): Promise<HealthSnapshot> {
  if (cached && Date.now() - cached.at < TTL_MS) return cached.snap;
  const routes = scanRoutes(resolve(process.cwd(), "src/app"));
  const ctx = await loadHealthContext(routes);
  const snap = { report: runHealth(ctx), inventory: computeInventory(ctx) };
  cached = { at: Date.now(), snap };
  return snap;
}

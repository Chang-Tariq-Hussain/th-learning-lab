import manifestJson from "@/content/manifest.json";
import overlayJson from "@/content/overlay.json";
import type { ContentOverlay, Manifest } from "@/lib/content-overlay/types";

export const manifest = manifestJson as unknown as Manifest;
export const publishedOverlay = overlayJson as unknown as ContentOverlay;

export type PublishState = "never" | "synced" | "pending";

/**
 * Whether a question's current database state is what the last publish captured. "never" = nothing has been
 * published yet (learners see the code as written), so no per-question claim is made.
 */
export function publishState(system: string, legacyId: string, status: string, contentHash: string): PublishState {
  if (!manifest.generatedAt) return "never";
  return manifest.questions[`${system}:${legacyId}`] === `${status}|${contentHash}` ? "synced" : "pending";
}

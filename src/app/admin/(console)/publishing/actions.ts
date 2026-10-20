"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/admin/auth";
import { latestRun, publishConfig, startPublish } from "@/lib/admin/github";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const to = (kind: "ok" | "error", msg: string): never => redirect(`/admin/publishing?${kind}=${encodeURIComponent(msg.slice(0, 300))}`);

/** "Publish to learners": starts the publish workflow. Role-checked here; the audit entry names the person who clicked. */
export async function publishContentAction(): Promise<void> {
  const session = await requirePermission("content.publish");
  if (session.mode !== "accounts") redirect("/admin/publishing");
  const cfg = publishConfig();
  if (!cfg) to("error", "One-click publishing is not set up yet. Ask your developer to add the GitHub publishing settings (see docs/admin-phase-4.md).");
  const c = cfg!;

  const last = await latestRun(c);
  if ("run" in last && last.run && last.run.status !== "completed" && Date.now() - new Date(last.run.startedAt).getTime() < 15 * 60_000) to("error", "A publish is already running. Wait for it to finish, then check this page.");

  const started = await startPublish(c, session.email ?? "admin");
  if (!started.ok) to("error", started.message);

  // Best effort: the publish is already running, so a failed audit write must not report failure.
  await createSupabaseServerClient().rpc("write_audit", { p_action: "content.publish_requested", p_entity: "content", p_meta: { via: "admin-button" } });
  revalidatePath("/admin/publishing");
  to("ok", "Publishing started. It takes a few minutes: the content is generated, saved, and the site is redeployed. Refresh this page to follow progress.");
}

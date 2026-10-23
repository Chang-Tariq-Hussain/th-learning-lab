"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/admin/auth";
import { flashRedirect, guardAction, type FlashKind } from "@/lib/admin/flash";
import { latestRun, publishConfig, startPublish } from "@/lib/admin/github";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const to = (kind: FlashKind, msg: string): never => flashRedirect("/admin/publishing", kind, msg);

/** "Publish to learners": starts the publish workflow. Role-checked here; the audit entry names the person who clicked. */
export async function publishContentAction(): Promise<void> {
  await guardAction("/admin/publishing", async () => {
    const session = await requirePermission("content.publish");
    if (session.mode !== "accounts") redirect("/admin/publishing");
    const cfg = publishConfig();
    if (!cfg) to("error", "One-click publishing is not set up yet. Ask your developer to add the GitHub publishing settings (see docs/admin-phase-4.md).");
    const c = cfg!;

    const last = await latestRun(c);
    if ("run" in last && last.run && last.run.status !== "completed" && Date.now() - new Date(last.run.startedAt).getTime() < 15 * 60_000) to("info", "A publish is already running. Wait for it to finish, then check this page.");

    const started = await startPublish(c, session.email ?? "admin");
    if (!started.ok) to("error", `Publishing could not be started. No changes were published. ${started.message}`);

    // Best effort: the publish is already running, so a failed audit write must not report failure.
    await createSupabaseServerClient().rpc("write_audit", { p_action: "content.publish_requested", p_entity: "content", p_meta: { via: "admin-button" } });
    revalidatePath("/admin/publishing");
    // Only the START is confirmed here. The work continues in the background, so this is never reported as "published".
    to("info", "Publishing started. It takes a few minutes: the content is generated, saved, and the site is redeployed. Refresh this page to follow progress.");
  });
}

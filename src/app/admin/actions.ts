"use server";

import { redirect } from "next/navigation";
import { endAdminSession, startAdminSession } from "@/lib/admin/auth";
import { getAdminConfig, passwordMatches, safeNextPath } from "@/lib/admin/session";

export async function loginAction(formData: FormData): Promise<void> {
  const next = safeNextPath(String(formData.get("next") ?? ""));
  const cfg = getAdminConfig();
  if (!cfg) redirect("/admin/login?error=config");

  // Slow every attempt down. (In-memory counters don't survive serverless instances; real
  // rate limiting and MFA arrive with accounts in Phase 2.)
  await new Promise((r) => setTimeout(r, 700));
  const ok = await passwordMatches(String(formData.get("password") ?? ""), cfg.password);
  if (!ok) redirect(`/admin/login?error=1&next=${encodeURIComponent(next)}`);

  await startAdminSession();
  redirect(next);
}

export async function logoutAction(): Promise<void> {
  endAdminSession();
  redirect("/admin/login");
}

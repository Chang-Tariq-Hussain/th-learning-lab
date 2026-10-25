"use server";

import { redirect } from "next/navigation";
import { endPasswordSession, startPasswordSession } from "@/lib/admin/auth";
import { getAdminMode } from "@/lib/admin/mode";
import { isAdminRole } from "@/lib/admin/permissions";
import { getAdminConfig, passwordMatches, safeNextPath } from "@/lib/admin/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const FAIL_DELAY_MS = 700;
const wait = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));
const failUrl = (error: string, next: string): string => `/admin/login?error=${error}&next=${encodeURIComponent(next)}`;

export async function loginAction(formData: FormData): Promise<void> {
  const next = safeNextPath(String(formData.get("next") ?? ""));
  const mode = getAdminMode();
  if (mode === "off") redirect("/admin/login?error=config");

  if (mode === "password") {
    const cfg = getAdminConfig()!;
    await wait(FAIL_DELAY_MS);
    if (!(await passwordMatches(String(formData.get("password") ?? ""), cfg.password))) redirect(failUrl("1", next));
    await startPasswordSession();
    redirect(next);
  }

  // accounts mode: Supabase Auth, then require an admin role.
  const email = String(formData.get("email") ?? "").trim().toLowerCase().slice(0, 254);
  const password = String(formData.get("password") ?? "").slice(0, 1024);
  if (!email || !password) redirect(failUrl("1", next));

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    await wait(FAIL_DELAY_MS);
    redirect(failUrl("1", next));
  }
  const { data: row, error: roleError } = await supabase.from("admin_roles").select("role").eq("user_id", data.user.id).maybeSingle();
  if (roleError) {
    await supabase.auth.signOut();
    redirect(failUrl("unavailable", next));
  }
  if (!row || !isAdminRole(row.role)) {
    await supabase.auth.signOut();
    await wait(FAIL_DELAY_MS);
    redirect(failUrl("noaccess", next));
  }
  await supabase.rpc("write_audit", { p_action: "admin.login", p_entity: "session", p_entity_id: data.user.id });
  redirect(next);
}

export async function logoutAction(): Promise<void> {
  if (getAdminMode() === "accounts") await createSupabaseServerClient().auth.signOut();
  else endPasswordSession();
  redirect("/admin/login");
}

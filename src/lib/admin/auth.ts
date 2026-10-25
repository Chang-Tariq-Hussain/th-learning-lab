import { cache } from "react";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAdminMode, type AdminMode } from "./mode";
import { can, isAdminRole, type AdminRole, type Permission } from "./permissions";
import { ADMIN_COOKIE, SESSION_TTL_SECONDS, createSessionToken, getAdminConfig, verifySessionToken } from "./session";

export interface AdminSession {
  mode: Exclude<AdminMode, "off">;
  userId: string | null;
  email: string | null;
  role: AdminRole;
}

/**
 * Resolves the current admin, or null. In accounts mode a user is an admin ONLY if
 * they have a row in admin_roles — a signed-in account without one (e.g. a learner)
 * gets nothing. Cached per request, so layout + page cost one lookup.
 * Server-side and authoritative: call it (via requireAdmin/requirePermission) in
 * every admin page and server action.
 */
export const getAdminSession = cache(async (): Promise<AdminSession | null> => {
  const mode = getAdminMode();
  if (mode === "off") return null;

  if (mode === "password") {
    const cfg = getAdminConfig();
    const token = cookies().get(ADMIN_COOKIE)?.value;
    if (!cfg || !token || !(await verifySessionToken(token, cfg.secret))) return null;
    return { mode, userId: null, email: null, role: "super_admin" };
  }

  try {
    const supabase = createSupabaseServerClient();
    const { data: userData, error } = await supabase.auth.getUser();
    if (error || !userData.user) return null;
    const { data: row, error: roleError } = await supabase.from("admin_roles").select("role, email").eq("user_id", userData.user.id).maybeSingle();
    if (roleError) { console.error("[admin] could not read admin_roles:", roleError.message); return null; }
    if (!row || !isAdminRole(row.role)) return null;
    return { mode, userId: userData.user.id, email: userData.user.email ?? (row.email as string | null), role: row.role };
  } catch (e) {
    console.error("[admin] session lookup failed:", e instanceof Error ? e.message : e);
    return null;
  }
});

/** Signed in with a valid account that has no admin role (accounts mode only). */
export async function getSignedInWithoutAccess(): Promise<{ email: string | null; unavailable: boolean } | null> {
  if (getAdminMode() !== "accounts") return null;
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;
    // Tell "has no role" apart from "the database could not be reached", so an outage is not reported as missing access.
    // Access is still denied either way (getAdminSession returns null); only the message differs.
    let unavailable = false;
    try {
      const { error } = await supabase.from("admin_roles").select("role").eq("user_id", data.user.id).maybeSingle();
      unavailable = !!error;
    } catch {
      unavailable = true;
    }
    return { email: data.user.email ?? null, unavailable };
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

/** Any admin may reach a page, but only roles holding `permission` may see this one (others get a 404). */
export async function requirePermission(permission: Permission): Promise<AdminSession> {
  const session = await requireAdmin();
  if (!can(session.role, permission)) notFound();
  return session;
}

// --- Phase 1 shared-password session (fallback mode only) ---------------------
export async function startPasswordSession(): Promise<boolean> {
  const cfg = getAdminConfig();
  if (!cfg) return false;
  cookies().set(ADMIN_COOKIE, await createSessionToken(cfg.secret), {
    httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/admin", maxAge: SESSION_TTL_SECONDS,
  });
  return true;
}

export function endPasswordSession(): void {
  cookies().set(ADMIN_COOKIE, "", { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/admin", maxAge: 0 });
}

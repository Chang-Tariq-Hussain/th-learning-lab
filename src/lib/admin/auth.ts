import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, SESSION_TTL_SECONDS, createSessionToken, getAdminConfig, verifySessionToken } from "./session";

/**
 * Server-side admin gate. Call at the top of every admin page and server
 * action — the middleware is a convenience redirect, NOT the security boundary,
 * and a layout alone does not protect pages that render independently.
 */
export async function isAdminSession(): Promise<boolean> {
  const cfg = getAdminConfig();
  if (!cfg) return false;
  const token = cookies().get(ADMIN_COOKIE)?.value;
  return !!token && (await verifySessionToken(token, cfg.secret));
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdminSession())) redirect("/admin/login");
}

export async function startAdminSession(): Promise<boolean> {
  const cfg = getAdminConfig();
  if (!cfg) return false;
  cookies().set(ADMIN_COOKIE, await createSessionToken(cfg.secret), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: SESSION_TTL_SECONDS,
  });
  return true;
}

export function endAdminSession(): void {
  cookies().set(ADMIN_COOKIE, "", { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/admin", maxAge: 0 });
}

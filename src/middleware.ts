import { NextResponse, type NextRequest } from "next/server";
import { getAdminMode } from "@/lib/admin/mode";
import { can, isAdminRole, permissionForPath } from "@/lib/admin/permissions";
import { ADMIN_COOKIE, getAdminConfig, verifySessionToken } from "@/lib/admin/session";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Gate for /admin/** only; learner routes are untouched. This is a convenience
 * redirect and session refresher — NOT the security boundary. Every admin page and
 * server action re-checks the session and role server-side (lib/admin/auth.ts), and
 * the database enforces roles with row-level security.
 */
export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname, search } = req.nextUrl;
  const isLogin = pathname === "/admin/login";
  const mode = getAdminMode();

  let res: NextResponse;
  let signedIn = false;
  let role: string | null = null;

  if (mode === "accounts") {
    const s = await updateSession(req); // refreshes the Supabase cookie
    res = s.response;
    signedIn = s.signedIn;
    role = s.role;
  } else {
    const cfg = getAdminConfig();
    const token = req.cookies.get(ADMIN_COOKIE)?.value;
    signedIn = mode === "password" && !!cfg && !!token && (await verifySessionToken(token, cfg.secret));
    res = NextResponse.next();
  }

  const redirectTo = (path: string, search = ""): NextResponse => {
    const url = req.nextUrl.clone();
    url.pathname = path;
    url.search = search;
    const r = NextResponse.redirect(url);
    for (const c of res.cookies.getAll()) r.cookies.set(c); // keep any refreshed session cookies
    return r;
  };

  if (!signedIn && !isLogin) {
    res = redirectTo("/admin/login", `?next=${encodeURIComponent(pathname + search)}`);
  } else if (signedIn && mode === "password" && isLogin) {
    res = redirectTo("/admin");
  } else if (mode === "accounts" && signedIn && !isLogin) {
    if (!isAdminRole(role)) {
      // Signed in but no admin role: the login page explains it (and never bounces back here).
      res = redirectTo("/admin/login");
    } else {
      const needed = permissionForPath(pathname);
      if (needed && !can(role, needed)) res = redirectTo("/admin");
    }
  }

  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export const config = { matcher: ["/admin/:path*"] };

import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, getAdminConfig, verifySessionToken } from "@/lib/admin/session";

/**
 * Phase 1 admin gate (temporary — replaced by account-based roles in Phase 2).
 * Only /admin/** is matched; learner routes are untouched. Pages and server
 * actions ALSO re-check the session server-side (see lib/admin/auth.ts).
 */
export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname, search } = req.nextUrl;
  const isLogin = pathname === "/admin/login";

  const cfg = getAdminConfig();
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const authed = !!cfg && !!token && (await verifySessionToken(token, cfg.secret));

  let res: NextResponse;
  if (!authed && !isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    res = NextResponse.redirect(url);
  } else if (authed && isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    res = NextResponse.redirect(url);
  } else {
    res = NextResponse.next();
  }
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export const config = { matcher: ["/admin/:path*"] };

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseConfig } from "@/lib/admin/mode";

/** Refreshes the Supabase session cookie and reports whether a valid user is signed in. */
export async function updateSession(request: NextRequest): Promise<{ response: NextResponse; signedIn: boolean; role: string | null }> {
  const cfg = supabaseConfig();
  let response = NextResponse.next({ request });
  if (!cfg) return { response, signedIn: false, role: null };

  const supabase = createServerClient(cfg.url, cfg.anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        for (const { name, value } of list) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of list) response.cookies.set(name, value, options);
      },
    },
  });
  try {
    // getUser() re-validates the token with Supabase Auth (getSession() would trust the cookie).
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return { response, signedIn: false, role: null };
    // The caller's own role row (readable by RLS). Used only for HTTP-level redirects; pages re-check.
    const { data: row } = await supabase.from("admin_roles").select("role").eq("user_id", data.user.id).maybeSingle();
    return { response, signedIn: true, role: typeof row?.role === "string" ? row.role : null };
  } catch {
    return { response, signedIn: false, role: null };
  }
}

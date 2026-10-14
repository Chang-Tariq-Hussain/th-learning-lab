import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseConfig } from "@/lib/admin/mode";

/**
 * Supabase client acting AS THE SIGNED-IN USER (anon key + their session cookie),
 * so row-level security applies to every query. The service-role key is never
 * used by the web app.
 */
export function createSupabaseServerClient() {
  const cfg = supabaseConfig();
  if (!cfg) throw new Error("Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).");
  const store = cookies();
  return createServerClient(cfg.url, cfg.anonKey, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) store.set(name, value, options);
        } catch {
          // Called from a Server Component, where cookies are read-only. The middleware refreshes the session.
        }
      },
    },
  });
}

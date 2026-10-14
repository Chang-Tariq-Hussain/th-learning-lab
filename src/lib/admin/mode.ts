import { getAdminConfig } from "./session";

/**
 * How admins sign in.
 *   accounts — Supabase Auth + roles in the database (Phase 2, the real thing)
 *   password — one shared password (Phase 1, kept ONLY as a fallback until Supabase is configured)
 *   off      — nothing configured: /admin is switched off
 * Supabase wins whenever its public URL + anon key are present, so the shared password
 * can never be used as a second way in once accounts are on.
 */
export type AdminMode = "accounts" | "password" | "off";

export function supabaseConfig(): { url: string; anonKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return url && anonKey ? { url, anonKey } : null;
}

export function getAdminMode(): AdminMode {
  if (supabaseConfig()) return "accounts";
  if (getAdminConfig()) return "password";
  return "off";
}

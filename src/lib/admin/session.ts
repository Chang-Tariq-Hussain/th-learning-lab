/**
 * Admin session tokens — Phase 1 temporary access control.
 *
 * There is no user database yet, so the admin area is gated by ONE shared
 * secret (ADMIN_PASSWORD) and a signed, expiring, HttpOnly cookie. This is
 * replaced by real accounts + roles in Phase 2. Everything here uses only Web
 * Crypto so it runs in both the Edge middleware and the Node runtime.
 *
 * Fails closed: if the env vars are missing or too weak, nobody can sign in.
 */

export const ADMIN_COOKIE = "th_admin";
export const SESSION_TTL_SECONDS = 8 * 60 * 60;
const MIN_SECRET_LENGTH = 32;

export interface AdminConfig {
  password: string;
  secret: string;
}

export function getAdminConfig(): AdminConfig | null {
  const password = process.env.ADMIN_PASSWORD ?? "";
  const secret = process.env.ADMIN_SESSION_SECRET ?? "";
  if (password.length < 12 || secret.length < MIN_SECRET_LENGTH) return null;
  return { password, secret };
}

const enc = new TextEncoder();

function toBase64Url(bytes: ArrayBuffer): string {
  let s = "";
  for (const b of new Uint8Array(bytes)) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toBase64Url(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

/** Length-independent, constant-time string comparison. */
function safeEqual(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < len; i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

export async function createSessionToken(secret: string, nowMs: number = Date.now()): Promise<string> {
  const expires = Math.floor(nowMs / 1000) + SESSION_TTL_SECONDS;
  const payload = `v1.${expires}`;
  return `${payload}.${await sign(secret, payload)}`;
}

export async function verifySessionToken(token: string, secret: string, nowMs: number = Date.now()): Promise<boolean> {
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return false;
  const expires = Number(parts[1]);
  if (!Number.isFinite(expires) || expires * 1000 < nowMs) return false;
  const expected = await sign(secret, `${parts[0]}.${parts[1]}`);
  return safeEqual(parts[2]!, expected);
}

/** Compares SHA-256 digests so neither length nor content leaks through timing. */
export async function passwordMatches(input: string, expected: string): Promise<boolean> {
  const [a, b] = await Promise.all([crypto.subtle.digest("SHA-256", enc.encode(input)), crypto.subtle.digest("SHA-256", enc.encode(expected))]);
  return safeEqual(toBase64Url(a), toBase64Url(b));
}

/** Only allow post-login redirects that stay inside /admin. */
export function safeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/admin") || next.startsWith("//") || next.includes("\\")) return "/admin";
  if (next.startsWith("/admin/login")) return "/admin";
  return next;
}

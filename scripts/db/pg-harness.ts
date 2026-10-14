/**
 * Test harness: a real PostgreSQL (PGlite, WASM) with just enough of Supabase's
 * surface stubbed — the anon/authenticated/service_role roles, auth.users,
 * auth.uid() and a minimal storage schema — to run the project's migrations.
 * It proves the SQL (constraints, RLS, RPCs); it does NOT prove Supabase's own
 * services (Auth, Storage API), which only a real project can.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { PGlite } from "@electric-sql/pglite";

export const MIGRATIONS_DIR = resolve(process.cwd(), "supabase/migrations");

export const SUPABASE_STUBS = `
  create role anon nologin;
  create role authenticated nologin;
  create role service_role nologin bypassrls;
  create schema auth;
  create table auth.users (id uuid primary key default gen_random_uuid(), email text unique);
  create function auth.uid() returns uuid language sql stable as
    $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  grant usage on schema auth to authenticated, anon;
  create schema storage;
  create table storage.buckets (id text primary key, name text not null, public boolean not null default false);
  create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text);
  alter table storage.objects enable row level security;
  grant usage on schema public to anon, authenticated, service_role;
  grant usage on schema storage to authenticated;
  grant select, insert, update, delete on storage.objects to authenticated;
`;

export async function newDatabase(): Promise<PGlite> {
  const db = new PGlite();
  await db.exec(SUPABASE_STUBS);
  const files = readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".sql")).sort();
  for (const f of files) await db.exec(readFileSync(join(MIGRATIONS_DIR, f), "utf8"));
  return db;
}

/** Run `fn` as a signed-in user (or anonymous when userId is null), then restore the owner role. */
export async function asUser<T>(db: PGlite, userId: string | null, fn: () => Promise<T>): Promise<T> {
  await db.exec(`set role ${userId ? "authenticated" : "anon"}; select set_config('request.jwt.claim.sub', '${userId ?? ""}', false);`);
  try {
    return await fn();
  } finally {
    await db.exec(`reset role; select set_config('request.jwt.claim.sub', '', false);`);
  }
}

export async function expectFail(label: string, fn: () => Promise<unknown>, match?: RegExp): Promise<string> {
  try {
    await fn();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (match && !match.test(msg)) throw new Error(`${label}: failed, but with the wrong error: ${msg}`);
    return msg;
  }
  throw new Error(`${label}: expected the statement to FAIL but it succeeded`);
}

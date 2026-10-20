import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Client } from "pg";

/** Tiny .env.local reader so operator scripts work without extra tooling. Existing env vars win. */
export function loadEnvLocal(): void {
  const file = resolve(process.cwd(), ".env.local");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);
    if (!m || line.trimStart().startsWith("#")) continue;
    const value = m[2]!.replace(/^(['"])(.*)\1$/, "$2");
    if (process.env[m[1]!] === undefined) process.env[m[1]!] = value;
  }
}

export async function connect(): Promise<Client> {
  loadEnvLocal();
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set. Use the DIRECT Postgres connection string from Supabase (Project settings → Database), in the environment or .env.local.");
    process.exit(2);
  }
  // Fail within 20 s instead of hanging when the host is unreachable (e.g. the IPv6-only direct host from GitHub Actions).
  const client = new Client({ connectionString: url, connectionTimeoutMillis: 20_000 });
  try {
    await client.connect();
  } catch (e) {
    console.error(`Could not connect to the database: ${e instanceof Error ? e.message : String(e)}\nIf this runs on GitHub Actions, use Supabase's SESSION POOLER connection string (not the direct one) for PUBLISH_DATABASE_URL.`);
    process.exit(2);
  }
  return client;
}

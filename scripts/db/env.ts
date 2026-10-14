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
  const client = new Client({ connectionString: url });
  await client.connect();
  return client;
}

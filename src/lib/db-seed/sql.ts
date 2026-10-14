/** Minimal driver-agnostic SQL surface: both `pg` clients and PGlite satisfy it. */
export interface SqlClient {
  query(text: string, params?: unknown[]): Promise<{ rows: Record<string, unknown>[] }>;
}

export interface Col {
  name: string;
  /** Wraps the positional placeholder, e.g. (p) => `${p}::jsonb`. */
  expr?: (placeholder: string) => string;
}

export const jsonb = (name: string): Col => ({ name, expr: (p) => `${p}::jsonb` });
export const cast = (name: string, type: string): Col => ({ name, expr: (p) => `${p}::${type}` });
export const textArray = (name: string): Col => ({
  name,
  expr: (p) => `coalesce((select array_agg(x) from jsonb_array_elements_text(${p}::jsonb) x), '{}'::text[])`,
});

export const asJson = (v: unknown): string => JSON.stringify(v);

const MAX_PARAMS = 30000;

export interface UpsertResult {
  inserted: number;
  updated: number;
  skipped: number;
  /** Rows that were inserted or changed by this statement, keyed by `returning` columns. */
  changed: Record<string, unknown>[];
}

/**
 * Multi-row INSERT … ON CONFLICT DO UPDATE for hash-tracked entity tables.
 * An existing row is overwritten ONLY if it is still exactly as last imported
 * (content_hash = source_hash) and the registry version differs. Rows an admin
 * has edited, and rows already up to date, are left untouched ("skipped").
 */
export async function upsertEntities(
  client: SqlClient, table: string, cols: Col[], rows: unknown[][], conflict: string[], returning: string[],
): Promise<UpsertResult> {
  const result: UpsertResult = { inserted: 0, updated: 0, skipped: 0, changed: [] };
  if (rows.length === 0) return result;
  const perChunk = Math.max(1, Math.floor(MAX_PARAMS / cols.length));
  const names = cols.map((c) => c.name);
  const updateSet = names.filter((n) => !conflict.includes(n)).map((n) => `${n} = excluded.${n}`).join(", ");

  for (let i = 0; i < rows.length; i += perChunk) {
    const chunk = rows.slice(i, i + perChunk);
    const params: unknown[] = [];
    const tuples = chunk.map((row) => {
      const ph = cols.map((c, ci) => {
        params.push(row[ci] ?? null);
        const p = `$${params.length}`;
        return c.expr ? c.expr(p) : p;
      });
      return `(${ph.join(", ")})`;
    });
    const sql =
      `insert into public.${table} as t (${names.join(", ")}) values ${tuples.join(", ")} ` +
      `on conflict (${conflict.join(", ")}) do update set ${updateSet} ` +
      `where t.content_hash = t.source_hash and t.source_hash is distinct from excluded.source_hash ` +
      `returning (xmax = 0) as _inserted, ${returning.join(", ")}`;
    const res = await client.query(sql, params);
    for (const r of res.rows) {
      if (r["_inserted"]) result.inserted += 1; else result.updated += 1;
      const { _inserted, ...rest } = r;
      void _inserted;
      result.changed.push(rest);
    }
    result.skipped += chunk.length - res.rows.length;
  }
  return result;
}

/** Plain multi-row INSERT for child/link tables (no conflict handling). */
export async function insertRows(client: SqlClient, table: string, cols: Col[], rows: unknown[][]): Promise<void> {
  if (rows.length === 0) return;
  const perChunk = Math.max(1, Math.floor(MAX_PARAMS / cols.length));
  const names = cols.map((c) => c.name);
  for (let i = 0; i < rows.length; i += perChunk) {
    const chunk = rows.slice(i, i + perChunk);
    const params: unknown[] = [];
    const tuples = chunk.map((row) => {
      const ph = cols.map((c, ci) => {
        params.push(row[ci] ?? null);
        const p = `$${params.length}`;
        return c.expr ? c.expr(p) : p;
      });
      return `(${ph.join(", ")})`;
    });
    await client.query(`insert into public.${table} (${names.join(", ")}) values ${tuples.join(", ")}`, params);
  }
}

export async function selectMap(client: SqlClient, sql: string, keyCols: string[]): Promise<Map<string, string>> {
  const res = await client.query(sql);
  return new Map(res.rows.map((r) => [keyCols.map((k) => String(r[k])).join(":"), String(r["id"])]));
}

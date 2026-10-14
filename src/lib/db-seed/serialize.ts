/**
 * Turns registry content into plain JSON. GLE content is TSX: it contains React
 * elements (inline diagrams) and functions (interactive verifiers) that cannot be
 * stored. Those are dropped and their JSON paths returned, so nothing is lost
 * silently and a future reader knows exactly what still lives in code.
 */
export interface Serialized {
  value: unknown;
  dropped: string[];
}

const isReactElement = (v: object): boolean => "$$typeof" in v;

export function toSerializable(input: unknown): Serialized {
  const dropped: string[] = [];
  const walk = (v: unknown, path: string): unknown => {
    if (v === undefined) return undefined;
    if (v === null) return null;
    const t = typeof v;
    if (t === "string" || t === "boolean") return v;
    if (t === "number") return Number.isFinite(v as number) ? v : (dropped.push(path), undefined);
    if (t === "function" || t === "symbol" || t === "bigint") { dropped.push(path); return undefined; }
    if (Array.isArray(v)) {
      const out: unknown[] = [];
      v.forEach((item, i) => {
        const r = walk(item, `${path}[${i}]`);
        if (r !== undefined) out.push(r);
      });
      return out;
    }
    const obj = v as object;
    if (isReactElement(obj)) { dropped.push(path); return undefined; }
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(obj)) {
      const r = walk(val, path ? `${path}.${k}` : k);
      if (r !== undefined) out[k] = r;
    }
    return out;
  };
  return { value: walk(input, "") ?? null, dropped };
}

/**
 * Scans `src/app` for `page.tsx` files. Node-only (uses fs); returns null when the
 * app directory isn't readable, e.g. in a serverless runtime where sources aren't shipped.
 */
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import type { RouteIndex } from "./types";

export function scanRoutes(appDir: string): RouteIndex | null {
  try {
    if (!existsSync(appDir)) return null;
    const staticPages = new Set<string>();
    const dynamicPages: string[] = [];

    const walk = (dir: string, segs: string[]): void => {
      for (const name of readdirSync(dir)) {
        const full = join(dir, name);
        if (statSync(full).isDirectory()) {
          // Route groups "(x)" don't appear in the URL; private folders "_x" aren't routes.
          if (name.startsWith("_")) continue;
          const isGroup = name.startsWith("(") && name.endsWith(")");
          walk(full, isGroup ? segs : [...segs, name]);
        } else if (/^page\.(t|j)sx?$/.test(name)) {
          const url = "/" + segs.join("/");
          if (segs.some((s) => s.startsWith("["))) dynamicPages.push(url);
          else staticPages.add(url);
        }
      }
    };
    walk(appDir, []);
    return { staticPages, dynamicPages };
  } catch {
    return null;
  }
}

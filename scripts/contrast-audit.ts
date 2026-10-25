/**
 * WCAG contrast audit across every theme. Reads the real theme variables from src/app/globals.css and the brand
 * colours from tailwind.config.ts, blends translucent backgrounds the way the browser does, and checks the pairs
 * the UI actually uses (body, muted text, placeholders, links, nav states, toasts, badges, status pills, buttons,
 * subject accents). Text must reach 4.5:1 (AA); the few non-text pairs listed as "ui" need 3:1.
 *
 *   npm run verify:contrast            exit 1 if anything fails
 *   npm run verify:contrast -- --all   print every ratio
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const css = readFileSync(join(root, "src/app/globals.css"), "utf8");
const themesSrc = readFileSync(join(root, "src/config/themes.ts"), "utf8");
const twSrc = readFileSync(join(root, "tailwind.config.ts"), "utf8");

type RGB = [number, number, number];
const hex = (h: string): RGB => { const n = h.replace("#", ""); return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16)) as RGB; };

// ---- themes: id + type from the registry
const themes = [...themesSrc.matchAll(/\{ id: "([\w-]+)", name: "[^"]+", type: "(light|dark)"/g)].map((m) => ({ id: m[1]!, type: m[2] as "light" | "dark" }));

// ---- CSS variables per theme
function blockVars(selector: string): Record<string, RGB> {
  // Merge every rule that names this selector (alone or in a ".a, .b {" list), in file order, like the cascade.
  const esc = selector.replace(".", "\\.");
  const re = new RegExp(`((?:[.:\\w-]+\\s*,\\s*)*${esc}(?:\\s*,\\s*[.:\\w-]+)*)\\s*\\{([^}]*)\\}`, "g");
  const out: Record<string, RGB> = {};
  for (const m of css.matchAll(re)) {
    for (const v of m[2]!.matchAll(/--color-([\w-]+):\s*(\d+)\s+(\d+)\s+(\d+)/g)) out[v[1]!] = [+v[2]!, +v[3]!, +v[4]!];
  }
  return out;
}
const base = blockVars(":root");
function themeVars(id: string): Record<string, RGB> {
  // multi-selector blocks (".midnight, .dracula, ...") only set subject accents; the per-theme block follows.
  const own = id === "light" ? {} : blockVars("." + id);
  const sharedDark = ["dark", "midnight", "dracula", "nord", "monokai", "one-dark"].includes(id) ? blockVars(".dark") : {};
  return { ...base, ...sharedDark, ...own };
}

// ---- Tailwind palette values used by the UI
const pine: Record<string, string> = Object.fromEntries([...twSrc.matchAll(/(\d{2,3}): "(#[0-9A-Fa-f]{6})"/g)].map((m) => [m[1]!, m[2]!]));
const sub = (name: string): string | undefined => twSrc.match(new RegExp(`\\b${name}: "(#[0-9A-Fa-f]{6})"`))?.[1];
const P: Record<string, string> = {
  red300: "#FCA5A5", red400: "#F87171", red600: "#DC2626", red700: "#B91C1C", red800: "#991B1B",
  amber300: "#FCD34D", amber700: "#B45309", amber800: "#92400E", amber900: "#78350F", amber200: "#FDE68A",
  blue300: "#93C5FD", blue700: "#1D4ED8", emerald300: "#6EE7B7", emerald700: "#047857", emerald800: "#065F46",
  sky300: "#7DD3FC", sky700: "#0369A1", violet300: "#C4B5FD", violet700: "#6D28D9", orange300: "#FDBA74", orange700: "#C2410C",
  rose700: "#BE123C", rose800: "#9F1239", white: "#FFFFFF",
  amber800b: "#92400E", orange800: "#9A3412", sky800: "#075985", violet800: "#5B21B6",
  chemistry: sub("chemistry") ?? "#2E9E5B", biology: sub("biology") ?? "#0D9488", it: sub("it") ?? "#B45309",
};

const lin = (c: number) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
const lum = ([r, g, b]: RGB) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a: RGB, b: RGB) => { const [x, y] = [lum(a), lum(b)]; return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const over = (fg: RGB, alpha: number, bg: RGB): RGB => fg.map((c, i) => Math.round(c * alpha + bg[i]! * (1 - alpha))) as RGB;

interface Row { theme: string; name: string; fg: string; ratio: number; min: number }
const rows: Row[] = [];
const fmt = (c: RGB) => "#" + c.map((x) => x.toString(16).padStart(2, "0")).join("");

for (const t of themes) {
  const v = themeVars(t.id);
  const L = t.type === "light";
  const surface = L ? v["paper"]! : v["chalkboard"]!;
  const text = L ? v["ink"]! : v["bone"]!;
  const muted = L ? v["ink-soft"]! : v["bone-soft"]!;
  const physics = v["subject-physics"]!, math = v["subject-math"]!;
  const check = (name: string, fg: RGB, bg: RGB, min = 4.5) => rows.push({ theme: t.id, name, fg: `${fmt(fg)} on ${fmt(bg)}`, ratio: ratio(fg, bg), min });
  const h = (k: string) => hex(P[k]!);
  const accent = (l: string, d: string) => (L ? h(l) : h(d));

  check("body text", text, surface);
  check("muted text / placeholder / nav inactive", muted, surface);
  const pineLink = L ? hex(pine["700"]!) : hex(pine["300"]!);
  check("link (pine)", pineLink, surface);
  const navBg = L ? over(hex(pine["600"]!), 0.12, surface) : over(hex(pine["500"]!), 0.2, surface);
  check("nav item active", L ? hex(pine["900"]!) : hex(pine["100"]!), navBg);
  check("muted on hover tint", muted, over(text, 0.06, surface));
  check("primary button (src/components/ui/button-styles.ts)", surface, L ? hex(pine["600"]!) : hex(pine["300"]!)); // paper on pine-600 / chalkboard on pine-300
  check("danger button (white on red-600)", h("white"), h("red600"));
  check("destructive-confirm button", h("white"), h("red700"));
  check("toast success icon", L ? hex(pine["700"]!) : hex(pine["300"]!), surface, 3);
  check("toast error icon", accent("red700", "red300"), surface, 3);
  check("toast warning icon", accent("amber700", "amber300"), surface, 3);
  check("toast info icon", accent("blue700", "blue300"), surface, 3);
  check("inline error text", accent("red800", "red300"), over(h("red600"), 0.1, surface));
  check("inline warning text", accent("amber900", "amber200"), over(h("amber700"), 0.1, surface));
  const pill = (name: string, l: string, d: string, tintL: string, tintD: string) => check(name, accent(l, d), over(L ? h(tintL) : h(tintD), 0.1, surface));
  check("status pill: published", L ? hex(pine["700"]!) : hex(pine["100"]!), over(hex(pine["500"]!), 0.1, surface));
  pill("status pill: in review", "violet800", "violet300", "violet700", "violet300");
  pill("badge: source existing", "sky800", "sky300", "sky700", "sky300");
  pill("badge: source generated / severity medium", "amber800b", "amber300", "amber700", "amber300");
  pill("badge: verified / emerald", "emerald800", "emerald300", "emerald700", "emerald300");
  pill("severity: critical", "red800", "red300", "red700", "red300");
  pill("severity: high", "orange800", "orange300", "orange700", "orange300");
  const softs: Record<string, string> = { physics: "#E8EBFF", math: "#EFE7FB", chemistry: "#E5F6EC", biology: "#DFF5F2", it: "#FBEBD6" };
  for (const [k, label] of [["physics", "physics"], ["math", "mathematics"], ["chemistry", "chemistry"], ["biology", "biology"], ["it", "information technology"]] as const) {
    const c = v[`subject-${k}-text`]!;
    check(`subject accent text: ${label}`, c, surface);
    if (L) check(`subject accent text on its soft tint: ${label}`, c, hex(softs[k]!));
  }
}

const all = process.argv.includes("--all");
const failing = rows.filter((r) => r.ratio < r.min);
const byName = new Map<string, Row[]>();
for (const r of rows) byName.set(r.name, [...(byName.get(r.name) ?? []), r]);
console.log(`themes: ${themes.map((t) => t.id).join(", ")}\n`);
for (const [name, list] of byName) {
  const worst = list.reduce((a, b) => (a.ratio < b.ratio ? a : b));
  const best = list.reduce((a, b) => (a.ratio > b.ratio ? a : b));
  const bad = list.filter((r) => r.ratio < r.min);
  console.log(`${bad.length ? "FAIL" : " ok "}  ${name.padEnd(46)} min ${list[0]!.min}:1   worst ${worst.ratio.toFixed(2)} (${worst.theme})   best ${best.ratio.toFixed(2)}`);
  if (all) for (const r of list) console.log(`        ${r.theme.padEnd(16)} ${r.ratio.toFixed(2).padStart(5)}  ${r.fg}`);
}
if (failing.length) {
  console.log(`\n${failing.length} failing combination(s):`);
  for (const r of failing) console.log(`  ${r.theme.padEnd(16)} ${r.name.padEnd(46)} ${r.ratio.toFixed(2)} < ${r.min}   ${r.fg}`);
  process.exit(1);
}
console.log(`\nAll ${rows.length} combinations pass.`);

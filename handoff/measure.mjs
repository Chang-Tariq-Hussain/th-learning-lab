// Step 1/6 measurement harness. Usage: node measure.mjs <phase> [simFilter]
import { chromium } from "/home/claude/repo/work/node_modules/playwright-core/index.mjs";
import fs from "node:fs";
const PHASE = process.argv[2] ?? "before";
const FILTER = process.argv[3];
const BASE = process.env.BASE ?? "http://localhost:3122";
const OUT = `/home/claude/scratch/results-${PHASE}.jsonl`;
const SHOTS = `/home/claude/scratch/shots-${PHASE}`;
fs.mkdirSync(SHOTS, { recursive: true });

const IMG = "main [role=img]";
const SIMS = {
  "simple-motion": { stage: "main svg[role=img]", ctrl: { btn: /^Start$/ } },
  "simple-forces": { stage: "main svg[role=img]", ctrl: { btn: /^Start$/ } },
  "simple-energy": { stage: "main svg[role=img]", ctrl: { btn: /^Release$/ } },
  "velocity": { stage: "main div[role=img]", ctrl: { aria: "Play simulation" } },
  "acceleration": { stage: "main div[role=img]", ctrl: { aria: "Play simulation" } },
  "newtons-laws": { stage: "main div[role=img]", ctrl: { aria: "Play simulation" } },
  "projectile-motion": { stage: "main div[role=img]", ctrl: { aria: "Play simulation" } },
  "momentum": { stage: "main div[role=img]", ctrl: { aria: "Play simulation" } },
  "circular-motion": { stage: "main div[role=img]", ctrl: { aria: "Play simulation" } },
  "work-energy-power": { stage: "main svg[role=img]", ctrl: { range: 0 } },
  "gravitation": { stage: "main svg[role=img]", ctrl: { range: 0 } },
  "basic-wave-motion": { stage: "main svg[role=img]", ctrl: { btn: /^(Pause|Play)$/ } },
  "transverse-longitudinal-waves": { stage: "main svg[role=img]", ctrl: { btn: /^(Pause|Play)$/ } },
  "wave-speed": { stage: "main svg[role=img]", ctrl: { btn: /^(Pause|Play)$/ } },
  "frequency-period": { stage: "main svg[role=img]", ctrl: { btn: /^(Pause|Play)$/ } },
  "magnet-explorer": { stage: "main [role=application]", ctrl: { stage: true } },
  "compass-explorer": { stage: "main [role=application]", ctrl: { stage: true } },
};
const VPS = [[320,640],[375,700],[430,900],[768,1024],[1024,768],[1280,800],[1440,900],[1366,680],[844,390]];

const launch = () => chromium.launch({ executablePath: "/tmp/chromium", args: ["--no-sandbox","--disable-gpu"], headless: true });

// Runs inside the page. Returns geometry for the stage + control.
const geom = ({ stageSel, ctrlSpec }) => {
  const hdr = document.querySelector("header");
  const headerBottom = hdr ? Math.max(0, hdr.getBoundingClientRect().bottom) : 0;
  const vh = window.innerHeight, vw = window.innerWidth;
  const pickStage = () => {
    const all = [...document.querySelectorAll(stageSel)].filter(e => { const r = e.getBoundingClientRect(); return r.width > 120 && r.height > 60; });
    return all[0] ?? null;
  };
  const stage = pickStage();
  const r = (e) => e ? (({x,y,width,height,top,bottom,left,right}) => ({top,bottom,left,right,width,height}))(e.getBoundingClientRect()) : null;
  return { vh, vw, headerBottom, stage: r(stage), docOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
};

const visibleIn = (rect, vh, headerBottom, vw) => !!rect && rect.top >= headerBottom - 1 && rect.bottom <= vh + 1 && rect.left >= -1 && rect.right <= vw + 1;

async function findCtrl(page, spec) {
  if (spec.btn) return page.locator("main button").filter({ hasText: spec.btn }).first();
  if (spec.aria) return page.locator(`main button[aria-label="${spec.aria}"]`).first();
  if (spec.range !== undefined) return page.locator("main input[type=range]").nth(spec.range);
  return null;
}

const done = new Set(fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8").split("\n").filter(Boolean).map(l => { const r = JSON.parse(l); return r.slug + "|" + r.vp; }) : []);
for (const [w, h] of VPS) {
  const browser = await launch();
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: w < 1024, isMobile: false });
  await ctx.addInitScript(() => { localStorage.setItem("theme","light"); localStorage.setItem("learning-platform-username","Tester"); });
  for (const [slug, conf] of Object.entries(SIMS)) {
    if (FILTER && !slug.includes(FILTER)) continue;
    if (done.has(`${slug}|${w}x${h}`)) continue;
    const page = await ctx.newPage();
    const row = { phase: PHASE, slug, vp: `${w}x${h}` };
    try {
      await page.goto(`${BASE}/dashboard/physics/${slug}`, { waitUntil: "load" });
      await page.waitForFunction((s) => [...document.querySelectorAll(s)].some(e => { const r = e.getBoundingClientRect(); return r.width > 120 && r.height > 60; }), conf.stage, { timeout: 25000 }).catch(() => {});
      await page.waitForTimeout(500);
      const sel = { stageSel: conf.stage };
      let g0 = await page.evaluate(geom, sel);
      row.stageFound = !!g0.stage;
      row.stageH = g0.stage ? Math.round(g0.stage.height) : null;
      row.stageHvh = g0.stage ? +(g0.stage.height / g0.vh).toFixed(2) : null;
      row.stageTallerThanVp = g0.stage ? g0.stage.height > g0.vh - g0.headerBottom : null;
      row.docOverflowPx = g0.docOverflow;
      // (a) bring the primary control into view the way a user would (centered), then ask: is the stage fully visible?
      const ctrl = conf.ctrl.stage ? null : await findCtrl(page, conf.ctrl);
      let ctrlBox = null;
      if (ctrl) {
        await ctrl.scrollIntoViewIfNeeded().catch(()=>{});
        await ctrl.evaluate(el => el.scrollIntoView({ block: "center", inline: "nearest" })).catch(()=>{});
        await page.waitForTimeout(250);
        ctrlBox = await ctrl.boundingBox();
      } else if (g0.stage) {
        await page.evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: "center" }), conf.stage);
        await page.waitForTimeout(250);
      }
      const g1 = await page.evaluate(geom, sel);
      row.ctrlFound = conf.ctrl.stage ? "stage-is-control" : !!ctrlBox;
      row.ctrlInView = conf.ctrl.stage ? true : (ctrlBox ? (ctrlBox.y >= g1.headerBottom - 1 && ctrlBox.y + ctrlBox.height <= g1.vh + 1) : false);
      row.a_stageVisibleWithCtrl = visibleIn(g1.stage, g1.vh, g1.headerBottom, g1.vw);
      row.a_stagePartlyVisible = g1.stage ? Math.max(0, Math.min(g1.stage.bottom, g1.vh) - Math.max(g1.stage.top, g1.headerBottom)) / g1.stage.height : 0;
      row.a_stagePartlyVisible = +row.a_stagePartlyVisible.toFixed(2);
      // union span test: could both fit at once at all?
      if (g1.stage && ctrlBox) {
        const top = Math.min(g1.stage.top, ctrlBox.y), bot = Math.max(g1.stage.bottom, ctrlBox.y + ctrlBox.height);
        row.a_unionFitsViewport = (bot - top) <= (g1.vh - g1.headerBottom);
      }
      // (b) press Start / interact, wait for motion, re-measure at the same scroll position
      let clickErr = null;
      if (ctrl) {
        try {
          if (conf.ctrl.range !== undefined) { await ctrl.focus(); await page.keyboard.press("ArrowRight"); await page.keyboard.press("ArrowRight"); }
          else await ctrl.click({ timeout: 4000 });
        } catch (e) { clickErr = String(e.message).split("\n")[0].slice(0,120); }
      }
      await page.waitForTimeout(900);
      const g2 = await page.evaluate(geom, sel);
      row.clickErr = clickErr;
      row.b_stageVisibleAfterStart = visibleIn(g2.stage, g2.vh, g2.headerBottom, g2.vw);
      row.b_stagePartlyVisible = g2.stage ? +(Math.max(0, Math.min(g2.stage.bottom, g2.vh) - Math.max(g2.stage.top, g2.headerBottom)) / g2.stage.height).toFixed(2) : 0;
      // (d) text overlapping the stage box (non-descendant, non-ancestor, visible text)
      row.d_overlaps = await page.evaluate(({ stageSel }) => {
        const st = [...document.querySelectorAll(stageSel)].find(e => { const r = e.getBoundingClientRect(); return r.width > 120 && r.height > 60; });
        if (!st) return [];
        const sr = st.getBoundingClientRect();
        const out = [];
        const root = st.closest("[role=application]") ?? st.closest("main");
        for (const el of root.querySelectorAll("p,span,h1,h2,h3,h4,li,label,button,output,dd,dt")) {
          if (st.contains(el) || el.contains(st)) continue;
          const t = (el.textContent ?? "").trim(); if (!t) continue;
          const cs = getComputedStyle(el); if (cs.visibility === "hidden" || cs.display === "none") continue;
          const r = el.getBoundingClientRect(); if (r.width === 0 || r.height === 0) continue;
          const ix = Math.min(r.right, sr.right) - Math.max(r.left, sr.left), iy = Math.min(r.bottom, sr.bottom) - Math.max(r.top, sr.top);
          if (ix > 4 && iy > 4) out.push(`${el.tagName.toLowerCase()}:${t.slice(0,24)}`);
          if (out.length >= 3) break;
        }
        // text clipped inside the sim region
        const clipped = [];
        for (const el of root.querySelectorAll("p,span,h2,h3,li,label,button,output")) {
          if (el.closest(".katex, .katex-display")) continue;
          if (el.scrollWidth > el.clientWidth + 2 && /(hidden|clip)/.test(getComputedStyle(el).overflowX)) clipped.push(`clip:${(el.textContent ?? "").trim().slice(0,20)}`);
          if (clipped.length >= 2) break;
        }
        return [...out, ...clipped];
      }, sel);
      await page.screenshot({ path: `${SHOTS}/${slug}__${w}x${h}.jpg`, type: "jpeg", quality: 55 });
    } catch (e) {
      row.error = String(e.message).split("\n")[0].slice(0, 160);
    }
    fs.appendFileSync(OUT, JSON.stringify(row) + "\n");
    await page.close();
  }
  await ctx.close();
  await browser.close();
  console.log("done viewport", w, h);
}

import { chromium } from "/home/claude/repo/work/node_modules/playwright-core/index.mjs";
import fs from "node:fs";
const routes = fs.readFileSync("/home/claude/scratch/other-routes.txt","utf8").split("\n").filter(Boolean);
const OUT="/home/claude/scratch/audit-bio2.jsonl";
const done=new Set(fs.existsSync(OUT)?fs.readFileSync(OUT,"utf8").split("\n").filter(Boolean).map(l=>JSON.parse(l).route):[]);
const b = await chromium.launch({ executablePath: "/tmp/chromium", args: ["--no-sandbox","--disable-gpu"], headless: true });
const ctx = await b.newContext({ viewport:{width:375,height:700}, hasTouch:true });
await ctx.addInitScript(()=>{localStorage.setItem("theme","light");localStorage.setItem("learning-platform-username","Tester");});
for (const route of routes) {
  if (done.has(route)) continue;
  const page = await ctx.newPage(); const row={route};
  try {
    await page.goto("http://localhost:3122"+route,{waitUntil:"load"});
    await page.waitForTimeout(2200);
    const r = await page.evaluate(()=>{
      const vis=(e)=>{const r=e.getBoundingClientRect();return r.width>150&&r.height>80};
      const stages=[...document.querySelectorAll("main svg[role=img], main canvas, main [role=img]")].filter(vis);
      const stage=stages[0]||null;
      const ctl=[...document.querySelectorAll("main button")].find(b=>/^\s*(start|play|run|release|launch|simulate|animate|fire|drop|begin|step|pause|next step)\b/i.test((b.getAttribute("aria-label")||b.textContent||"").trim()));
      const sl=document.querySelector("main input[type=range]");
      return {stage:!!stage, ctl:!!ctl, sliders:document.querySelectorAll("main input[type=range]").length, layout:!!document.querySelector("[data-sim-layout]")};
    });
    Object.assign(row,r);
    if (r.stage && (r.ctl||r.sliders)) {
      const res = await page.evaluate(()=>{
        const vis=(e)=>{const r=e.getBoundingClientRect();return r.width>150&&r.height>80};
        const stage=[...document.querySelectorAll("main svg[role=img], main canvas, main [role=img]")].filter(vis)[0];
        const ctl=[...document.querySelectorAll("main button")].find(b=>/^\s*(start|play|run|release|launch|simulate|animate|fire|drop|begin|step|pause|next step)\b/i.test((b.getAttribute("aria-label")||b.textContent||"").trim())) || document.querySelector("main input[type=range]");
        ctl.scrollIntoView({block:"center"});
        const hb=document.querySelector("header").getBoundingClientRect().bottom;
        const s=stage.getBoundingClientRect(); const c=ctl.getBoundingClientRect();
        return {stageH:Math.round(s.height), stageFullyVisibleWithCtl: s.top>=hb-1 && s.bottom<=innerHeight+1, gapPx: Math.round(Math.abs((s.top+s.bottom)/2-(c.top+c.bottom)/2))};
      });
      Object.assign(row,res);
    }
  } catch(e){ row.error=String(e.message).split("\n")[0].slice(0,100); }
  fs.appendFileSync(OUT,JSON.stringify(row)+"\n"); await page.close();
}
await b.close(); console.log("audit done");

import { chromium } from "/home/claude/repo/work/node_modules/playwright-core/index.mjs";
const routes = process.argv.slice(2);
const b = await chromium.launch({ executablePath: "/tmp/chromium", args: ["--no-sandbox","--disable-gpu"], headless: true });
for (const [w,h] of [[375,700],[1366,680]]) {
  const c = await b.newContext({ viewport:{width:w,height:h}, hasTouch:w<1024 });
  await c.addInitScript(()=>{localStorage.setItem("theme","light");localStorage.setItem("learning-platform-username","Tester");});
  for (const r of routes) {
    const p = await c.newPage();
    await p.goto("http://localhost:3122/dashboard/biology/"+r,{waitUntil:"load"});
    await p.waitForSelector("[data-sim-layout]",{timeout:25000}); await p.waitForTimeout(600);
    // scroll so the layout's top sits just under the header (what a learner does to reach the simulation)
    await p.evaluate(()=>{const e=document.querySelector("[data-sim-layout]");window.scrollTo(0,e.getBoundingClientRect().top+scrollY-(document.querySelector("header").getBoundingClientRect().bottom+8));});
    await p.waitForTimeout(300);
    const geo=()=>p.evaluate(()=>{const hb=document.querySelector("header").getBoundingClientRect().bottom;const g=s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return r.top>=hb-1&&r.bottom<=innerHeight+1&&r.right<=innerWidth+1};const sb=document.querySelector("[data-sim-stage]").getBoundingClientRect();return {stage:g("[data-sim-stage]"),actions:g("[data-sim-actions]"),status:document.querySelector("[data-sim-status]")?.dataset.state}});
    const before=await geo();
    await p.locator("[data-sim-actions] button").filter({hasText:/^(Play|Start)$/}).first().click({timeout:4000}).catch(()=>{});
    await p.waitForTimeout(900);
    const after=await geo();
    console.log(w+"x"+h,r.padEnd(24),JSON.stringify(before),"->",JSON.stringify(after));
    await p.close();
  }
  await c.close();
}
await b.close();

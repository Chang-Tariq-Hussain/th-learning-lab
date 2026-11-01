import { expect, test, type Page } from "@playwright/test";
import { expectNoPageOverflow, seed } from "./helpers";

/**
 * Biology, chemistry, mathematics and IT simulations share SimulationLayout too (see simulation-layout.spec.ts for
 * physics). For each page: with a control in view, the whole stage and the Start/Reset actions must be on screen,
 * before and after pressing the first action. These measure geometry, so they fail on the old stacked layout.
 */
interface Page_ {
  path: string;
  /** Tab to open before measuring (pages whose simulations live behind mode tabs). */
  tab?: RegExp;
  /** Button text to click first (collapsed explorers). */
  open?: string;
  /** Pages with no Start button: the first action is not pressed. */
  noStart?: boolean;
}

const PAGES: Page_[] = [
  { path: "biology/blood-circulation" },
  { path: "biology/digestive-system" },
  { path: "biology/food-chain-web" },
  { path: "biology/nervous-system" },
  { path: "biology/respiratory-system" },
  { path: "chemistry/reaction-builder" },
  { path: "mathematics/applications-of-derivatives" },
  { path: "mathematics/css-trigonometry", open: "Open the trig explorer", noStart: true },
  { path: "mathematics/derivative-explorer" },
  { path: "mathematics/distance-between-two-points" },
  { path: "mathematics/line-designer" },
  { path: "mathematics/slope-of-a-line" },
  { path: "information-technology/arp-simulator" },
  { path: "information-technology/computer-boot-process" },
  { path: "information-technology/cpu-ram-storage-data-flow", tab: /Execute/ },
  { path: "information-technology/cpu-ram-storage-data-flow", tab: /Memory/ },
  { path: "information-technology/cpu-ram-storage-data-flow", tab: /Cache/ },
  { path: "information-technology/cpu-ram-storage-data-flow", tab: /Run a Program/ },
  { path: "information-technology/dhcp-simulator" },
  { path: "information-technology/dns-simulator" },
  { path: "information-technology/routing-simulator" },
  { path: "information-technology/switch-mac-table-simulator" },
  { path: "biology/cell-explorer" },
  { path: "biology/cell-organelles" },
  { path: "biology/cell-structure-organization" },
  { path: "biology/plant-vs-animal-cells" },
  { path: "biology/what-is-a-cell" },
  { path: "biology/dna-structure" },
  { path: "biology/ecosystem-explorer" },
  { path: "chemistry/bond-builder" },
  { path: "chemistry/build-an-atom" },
  { path: "chemistry/molecule-builder" },
  { path: "chemistry/molecule-builder", tab: /Build/ },
  { path: "chemistry/reaction-kinetics" },
  { path: "mathematics/angle-spinner" },
  { path: "mathematics/coordinate-plane-explorer" },
  { path: "mathematics/cross-multiplication-explorer" },
  { path: "mathematics/derivative-rules" },
  { path: "mathematics/fraction-pizza" },
  { path: "mathematics/midpoint-of-a-line-segment" },
  { path: "mathematics/real-life-ratios" },
  { path: "mathematics/triangle-explorer" },
];

const VIEWPORTS = [
  { name: "375x700", width: 375, height: 700 },
  { name: "1366x680", width: 1366, height: 680 },
];

async function open(page: Page, p: Page_) {
  await page.goto(`/dashboard/${p.path}`);
  await page.locator("[data-sim-layout]").first().waitFor({ state: "attached", timeout: 8_000 }).catch(() => {});
  await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
  if (p.open) await page.getByText(p.open).first().click();
  if (p.tab) await page.getByRole("tab", { name: p.tab }).first().click();
  await page.waitForTimeout(1500); // lazy-loaded simulation content settles before we measure
}

/** Scrolls a control from the layout's controls into view (centre, bottom edge, layout top) and reports whether stage and actions are fully visible. */
async function visibleWithControl(page: Page) {
  return page.evaluate(() => {
    const header = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
    // Pages without SimulationLayout (the old stacked layout) are measured the same way, on their largest visual and the
    // controls around it, so this test shows the geometry bug and not just a missing attribute.
    const main = document.querySelector("main") ?? document.body;
    const layout = document.querySelector("[data-sim-layout]") ?? main;
    const visuals = [...main.querySelectorAll("canvas, svg, [role=img]")].filter((e) => {
      const r = e.getBoundingClientRect();
      return r.width >= 200 && r.height >= 100 && !e.closest("button, nav, header, a, summary");
    });
    const area = (e: Element) => e.getBoundingClientRect().width * e.getBoundingClientRect().height;
    const stage = layout.querySelector("[data-sim-stage]") ?? visuals.sort((a, b) => area(b) - area(a))[0]!;
    const actions = layout.querySelector("[data-sim-actions]");
    const scope = layout.querySelector("[data-sim-controls]") ?? layout;
    const controls = [...scope.querySelectorAll("button, input, select, [role=tab]")].filter(
      (e) => e.getBoundingClientRect().width > 8 && !stage.contains(e) && !e.closest("header, nav"),
    );
    const targets = controls.length ? [controls[0]!, controls[Math.floor(controls.length / 2)]!, controls[controls.length - 1]!] : [layout];
    const inside = (el: Element) => {
      const r = el.getBoundingClientRect();
      return r.top >= header - 1 && r.bottom <= innerHeight + 1 && r.left >= -1 && r.right <= innerWidth + 1;
    };
    // For each of the first, middle and last control: centre it, as a learner adjusting it would, or put it at the bottom
    // edge (a control at the very end of the layout, where the sticky stage has run out of room). A control near the top
    // of the layout may instead be reached with the layout's top just under the header. Pages without SimulationLayout get
    // only the first two, so the old stacked layout cannot pass by being scrolled to its top.
    const fits = !!document.querySelector("[data-sim-layout]");
    const result = { stage: true, actions: true, control: true, hasControls: controls.length > 0 };
    for (const target of targets) {
      let ok = { stage: false, actions: false, control: false };
      for (const block of fits ? (["center", "end", "layout"] as const) : (["center", "end"] as const)) {
        if (block === "layout") {
          layout.scrollIntoView({ block: "start", behavior: "instant" });
          window.scrollBy(0, -(header + 8));
        } else target.scrollIntoView({ block, behavior: "instant" });
        ok = { stage: inside(stage), actions: actions ? inside(actions) : true, control: inside(target) };
        if (ok.stage && ok.actions && ok.control) break;
      }
      result.stage &&= ok.stage;
      result.actions &&= ok.actions;
      result.control &&= ok.control;
    }
    return result;
  });
}

for (const vp of VIEWPORTS) {
  test.describe(`stage stays in view at ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height }, hasTouch: vp.width < 1024 });

    for (const p of PAGES) {
      test(`${p.path}${p.tab ? ` (${p.tab.source})` : ""}`, async ({ page, context }) => {
        await seed(context);
        await open(page, p);
        let r = await visibleWithControl(page);
        expect.soft(r.stage, "stage fully visible with a control on screen (before Start)").toBe(true);
        expect.soft(r.actions, "actions fully visible (before Start)").toBe(true);
        if (!p.noStart && (await page.locator("[data-sim-actions] button:enabled").count())) {
          await page.locator("[data-sim-actions] button:enabled").first().click();
          await page.waitForTimeout(700);
          r = await visibleWithControl(page);
          expect.soft(r.stage, "stage fully visible after pressing the first action").toBe(true);
          expect.soft(r.actions, "actions fully visible after pressing the first action").toBe(true);
        }
      });
    }
  });
}

test.describe("320px", () => {
  test.use({ viewport: { width: 320, height: 640 }, hasTouch: true });
  test("no page-level horizontal overflow on the migrated simulations", async ({ page, context }) => {
    test.setTimeout(900_000);
    await seed(context);
    for (const p of PAGES) {
      await open(page, p);
      await expectNoPageOverflow(page, `/dashboard/${p.path}`);
    }
  });
});

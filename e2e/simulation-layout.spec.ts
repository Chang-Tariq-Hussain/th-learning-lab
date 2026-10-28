import { expect, test, type Page } from "@playwright/test";
import { expectNoPageOverflow, seed } from "./helpers";

/**
 * Physics simulations share SimulationLayout: the stage (status, visual, readouts, Start/Reset) must stay fully
 * on screen while the learner uses the controls, before and after pressing Start. See src/features/simulation
 * /components/layout and the `.sim-*` rules in globals.css. These specs fail on the old stacked layout.
 */

/** Every physics simulation page. `play` is the action that starts it (a button name), when it has one. */
const SIMS: { slug: string; play?: RegExp; runs?: boolean }[] = [
  { slug: "simple-motion", play: /^Start$/, runs: true },
  { slug: "simple-forces", play: /^Start$/, runs: true },
  { slug: "simple-energy", play: /^Release$/, runs: true },
  { slug: "velocity", play: /^Play simulation$/ },
  { slug: "acceleration", play: /^Play simulation$/ },
  { slug: "newtons-laws", play: /^Play simulation$/ },
  { slug: "projectile-motion", play: /^Play simulation$/ },
  { slug: "momentum", play: /^Play simulation$/ },
  { slug: "circular-motion", play: /^Play simulation$/ },
  { slug: "gravitation" },
  { slug: "work-energy-power" },
  { slug: "basic-wave-motion", play: /^(Pause|Play)$/ },
  { slug: "transverse-longitudinal-waves", play: /^(Pause|Play)$/ },
  { slug: "wave-speed", play: /^(Pause|Play)$/ },
  { slug: "frequency-period", play: /^(Pause|Play)$/ },
  { slug: "magnet-explorer" },
  { slug: "compass-explorer" },
];

const VIEWPORTS = [
  { name: "375x700", width: 375, height: 700 },
  { name: "1366x680", width: 1366, height: 680 },
];

async function open(page: Page, slug: string) {
  await page.goto(`/dashboard/physics/${slug}`);
  await page.locator("[data-sim-layout]").first().waitFor({ state: "attached", timeout: 30_000 });
  await page.waitForTimeout(500); // lazy-loaded content above/inside the simulation settles before we measure
}

/** Header bottom, stage box and actions box, all in viewport coordinates. */
async function geometry(page: Page) {
  return page.evaluate(() => {
    const box = (sel: string) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, left: r.left, right: r.right };
    };
    return {
      vh: window.innerHeight,
      vw: window.innerWidth,
      header: box("header"),
      stage: box("[data-sim-stage]"),
      actions: box("[data-sim-actions]"),
    };
  });
}

function expectInside(label: string, b: { top: number; bottom: number; left: number; right: number } | null, g: Awaited<ReturnType<typeof geometry>>) {
  expect(b, `${label} exists`).not.toBeNull();
  const headerBottom = g.header?.bottom ?? 0;
  expect.soft(b!.top, `${label} top is below the header`).toBeGreaterThanOrEqual(headerBottom - 1);
  expect.soft(b!.bottom, `${label} bottom is inside the viewport`).toBeLessThanOrEqual(g.vh + 1);
  expect.soft(b!.left, `${label} left`).toBeGreaterThanOrEqual(-1);
  expect.soft(b!.right, `${label} right`).toBeLessThanOrEqual(g.vw + 1);
}

for (const vp of VIEWPORTS) {
  test.describe(`stage stays in view at ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height }, hasTouch: vp.width < 1024 });

    for (const sim of SIMS) {
      test(sim.slug, async ({ page, context }) => {
        await seed(context);
        await open(page, sim.slug);
        const layout = page.locator("[data-sim-layout]").first();

        // Scroll to the middle of the controls, as a learner adjusting sliders would be.
        await layout.scrollIntoViewIfNeeded();
        await page.evaluate(() => {
          const side = document.querySelector("[data-sim-controls]") ?? document.querySelector("[data-sim-layout]");
          side?.scrollIntoView({ block: "center" });
        });
        let g = await geometry(page);
        expectInside("stage (before Start)", g.stage, g);
        if (g.actions) expectInside("actions (before Start)", g.actions, g);

        if (sim.play) {
          await page.locator("[data-sim-actions] button").filter({ hasText: sim.play }).or(page.locator(`[data-sim-actions] button[aria-label="Play simulation"]`)).first().click();
          await page.waitForTimeout(700);
          g = await geometry(page);
          expectInside("stage (after Start)", g.stage, g);
          expectInside("actions (after Start)", g.actions, g);
        }
      });
    }
  });
}

test.describe("stage is sticky under the header", () => {
  for (const vp of VIEWPORTS) {
    test(`simple-motion at ${vp.name}: stage top meets the header`, async ({ page, context }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await seed(context);
      await open(page, "simple-motion");
      await page.waitForLoadState("load");
      await page.waitForTimeout(500); // lazy-loaded simulation content settles
      // Scroll the explanation (below the controls) to mid-screen: the stage block must have stuck under the header.
      await page.evaluate(() => document.querySelector("[data-sim-explanation]")!.scrollIntoView({ block: "center" }));
      await page.waitForTimeout(300);
      const g = await page.evaluate(() => {
        const col = document.querySelector("[data-sim-stage-col]")!.getBoundingClientRect();
        const header = document.querySelector("header")!.getBoundingClientRect();
        return { colTop: col.top, headerBottom: header.bottom };
      });
      expect(g.colTop).toBeGreaterThanOrEqual(g.headerBottom - 1);
      expect(g.colTop).toBeLessThanOrEqual(g.headerBottom + 14);
    });
  }
});

test.describe("320px", () => {
  test.use({ viewport: { width: 320, height: 640 }, hasTouch: true });
  test("no page-level horizontal overflow on any physics simulation", async ({ page, context }) => {
    await seed(context);
    for (const sim of SIMS) {
      await open(page, sim.slug);
      await expectNoPageOverflow(page, `/dashboard/physics/${sim.slug}`);
    }
  });
});

test.describe("reduced motion", () => {
  test.use({ viewport: { width: 375, height: 700 }, hasTouch: true, reducedMotion: "reduce" });

  for (const sim of SIMS.filter((s) => s.runs)) {
    test(`${sim.slug}: Start finishes straight away, no animation loop`, async ({ page, context }) => {
      await seed(context);
      await open(page, sim.slug);
      await page.locator("[data-sim-actions] button").filter({ hasText: sim.play! }).first().click();
      await expect(page.locator("[data-sim-status]")).toHaveAttribute("data-state", "finished", { timeout: 1500 });
      // Count requestAnimationFrame callbacks over a short window: a finished one-shot run must schedule none.
      const frames = await page.evaluate(
        () =>
          new Promise<number>((resolve) => {
            let n = 0;
            const orig = window.requestAnimationFrame.bind(window);
            window.requestAnimationFrame = (cb) => {
              n += 1;
              return orig(cb);
            };
            setTimeout(() => resolve(n), 600);
          }),
      );
      expect(frames).toBeLessThanOrEqual(2);
    });
  }

  test("wave simulations do not auto-play", async ({ page, context }) => {
    await seed(context);
    await open(page, "basic-wave-motion");
    await expect(page.locator("[data-sim-status]")).toHaveAttribute("data-state", "paused");
  });
});

test.describe("status announcements", () => {
  test.use({ viewport: { width: 1366, height: 680 } });

  test("simple-motion: polite live region says running, then finished", async ({ page, context }) => {
    await seed(context);
    await open(page, "simple-motion");
    const status = page.locator("[data-sim-status]");
    await expect(status).toHaveAttribute("aria-live", "polite");
    await expect(status).toHaveAttribute("role", "status");
    await expect(status).toHaveText(/Ready/);
    await page.getByRole("button", { name: /^Start$/ }).click();
    await expect(status).toHaveText(/Running/);
    await expect(status).toHaveText(/Finished/, { timeout: 20_000 });
  });
});

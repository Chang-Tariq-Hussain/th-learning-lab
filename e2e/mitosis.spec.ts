import { expect, test, type Page } from "@playwright/test";
import { expectNoPageOverflow, seed } from "./helpers";

/**
 * Mitosis lab: seven stages, playback controls, chromatid counts in the picture, zoom, labels/spindle toggles,
 * the counting lab, explorer, comparison link, activities, animal/plant switch, keyboard, reduced motion and layout.
 */
const PATH = "/dashboard/biology/mitosis";
const STAGES = ["Interphase", "Prophase", "Prometaphase", "Metaphase", "Anaphase", "Telophase", "Cytokinesis"];

async function open(page: Page) {
  await page.goto(PATH);
  await page.locator('[data-testid="mitosis-stage"]').waitFor({ timeout: 30_000 });
  await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
}
const stage = (page: Page) => page.getByTestId("mitosis-stage");
async function atBeat(page: Page, n: number) {
  await expect.poll(async () => Number(await stage(page).getAttribute("data-pos")), { timeout: 15_000 }).toBeCloseTo(n, 1);
}
const visibleChromatids = (page: Page) =>
  page.locator('[data-testid="mitosis-stage"] [data-chromatid]').evaluateAll((els) => els.filter((e) => Number(e.getAttribute("data-op")) > 0.5).length);
const tab = (page: Page, name: string) => page.getByRole("tab", { name: new RegExp(name, "i") }).first();

test.describe("mitosis lab", () => {
  test.beforeEach(async ({ context }) => seed(context));

  test("seven stage chips show the right stage", async ({ page }) => {
    await open(page);
    await page.locator('[data-speed="2"]').click();
    for (let i = 0; i < 7; i++) {
      await page.locator(`[data-stage-chip="${i}"]`).click();
      await expect(page.getByTestId("stage-name")).toContainText(STAGES[i]!);
      await expect(page.getByTestId("stage-count")).toHaveText(`Stage ${i + 1} of 7`);
    }
  });

  test("chromatid counts: n unreplicated, then 2n chromatids through metaphase and after", async ({ page }) => {
    await open(page);
    await page.locator('[data-speed="2"]').click();
    await page.locator('[data-pairs-top="3"]').click();
    await page.locator('[data-stage-chip="0"]').click();
    await atBeat(page, 0);
    expect(await visibleChromatids(page)).toBe(6); // 2n = 6, one chromatid each
    let cur = 0;
    for (const beat of [1, 6, 9, 14]) {
      while (cur < beat) {
        await page.getByTestId("step-forward").click();
        cur += 1;
        await atBeat(page, cur);
      }
      expect(await visibleChromatids(page)).toBe(12);
    }
  });

  test("play, pause and restart", async ({ page }) => {
    await open(page);
    await page.locator('[data-speed="2"]').click();
    await page.getByTestId("play-pause").click();
    await expect(page.locator("[data-sim-status]")).toContainText("Running");
    await page.getByTestId("play-pause").click();
    await expect(page.locator("[data-sim-status]")).toContainText("Paused");
    await page.getByTestId("play-pause").click();
    await expect(page.locator("[data-sim-status]")).toContainText("Finished", { timeout: 90_000 });
    await page.getByTestId("restart").click();
    await atBeat(page, 0);
    await expect(page.getByTestId("stage-name")).toContainText("Interphase");
  });

  test("zoom, labels and spindle toggles", async ({ page }) => {
    await open(page);
    await page.getByTestId("zoom-in").click();
    await expect(stage(page)).not.toHaveAttribute("data-zoom", "1.00");
    await page.getByTestId("zoom-reset").click();
    await expect(stage(page)).toHaveAttribute("data-zoom", "1.00");
    await expect(page.getByTestId("labels-toggle")).toHaveAttribute("aria-pressed", /true|false/);
    await page.getByTestId("labels-toggle").click();
    await page.getByTestId("spindle-toggle").click();
  });

  test("animal and plant cells and the starting chromosome number", async ({ page }) => {
    await open(page);
    await page.locator('[data-pairs-top="4"]').click();
    await page.locator('[data-stage-chip="0"]').click();
    await atBeat(page, 0);
    expect(await visibleChromatids(page)).toBe(8);
    await page.locator('[data-cell-type="plant"]').click();
    await expect(stage(page)).toHaveAttribute("data-cell", "plant");
  });

  test("counting lab, explorer and comparison", async ({ page }) => {
    await open(page);
    await tab(page, "Counting").click();
    await expect(page.getByTestId("counting-lab")).toBeVisible();
    await expect(page.getByTestId("count-stats")).toBeVisible();
    await tab(page, "Chromosome explorer").click();
    await expect(page.getByTestId("chromosome-explorer")).toBeVisible();
    await tab(page, "Mitosis vs meiosis").click();
    await expect(page.getByTestId("compare-panel")).toBeVisible();
    await expect(page.getByTestId("open-meiosis")).toHaveAttribute("href", /\/biology\/meiosis/);
  });

  test("practice: arrange and challenge are available", async ({ page }) => {
    await open(page);
    await tab(page, "Practice").click();
    await expect(page.getByText(/Arrange the stages/i).first()).toBeVisible();
    await page.getByRole("tab", { name: /Mitosis challenge/i }).click();
    await expect(page.getByTestId("challenge-panel")).toBeVisible();
  });

  test("keyboard: arrows step the animation", async ({ page }) => {
    await open(page);
    await page.locator('[data-speed="2"]').click();
    await page.getByTestId("labels-toggle").focus();
    await page.keyboard.press("ArrowRight");
    await atBeat(page, 1);
    await page.keyboard.press("Shift+ArrowRight");
    await expect.poll(async () => Number(await stage(page).getAttribute("data-pos"))).toBeGreaterThan(1.5);
    await page.keyboard.press("r");
    await atBeat(page, 0);
  });

  test("reduced motion still reaches the end", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await open(page);
    await page.locator('[data-stage-chip="6"]').click();
    await expect(page.getByTestId("stage-name")).toContainText("Cytokinesis");
  });

  for (const [name, w, h] of [["phone", 360, 740], ["tablet", 820, 1100], ["desktop", 1366, 800]] as const) {
    for (const scheme of ["light", "dark"] as const) {
      test(`${name} ${scheme}: no horizontal overflow`, async ({ page }) => {
        await page.setViewportSize({ width: w, height: h });
        await page.emulateMedia({ colorScheme: scheme });
        await open(page);
        await expectNoPageOverflow(page, `${name}/${scheme}/sim`);
        await tab(page, "Counting").click();
        await expectNoPageOverflow(page, `${name}/${scheme}/counting`);
        await tab(page, "Mitosis vs meiosis").click();
        await expectNoPageOverflow(page, `${name}/${scheme}/compare`);
      });
    }
  }
});

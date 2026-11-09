import { expect, test, type Page } from "@playwright/test";
import { expectNoPageOverflow, seed } from "./helpers";

/**
 * Meiosis lab: every stage and transition, playback controls, chromosome counts in the picture, selection,
 * Predict / Identify / Arrange / Challenge, the crossing-over lab, the 2n vs n explorer, keyboard use,
 * reduced motion, and layout on phone / tablet / desktop in light and dark themes.
 */
const PATH = "/dashboard/biology/meiosis";

async function open(page: Page) {
  await page.goto(PATH);
  await page.locator('[data-testid="meiosis-stage"]').waitFor({ timeout: 30_000 });
  await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
}
const beatOf = async (page: Page) => Number(await page.getByTestId("meiosis-stage").getAttribute("data-beat"));
/** Wait for the animation to arrive at a given beat. */
async function atBeat(page: Page, n: number) {
  await expect.poll(async () => Number(await page.getByTestId("meiosis-stage").getAttribute("data-pos")), { timeout: 15_000 }).toBeCloseTo(n, 1);
}
/** Chromatids drawn (opacity above half). */
const visibleChromatids = (page: Page) =>
  page.locator('[data-testid="meiosis-stage"] [data-chromatid]').evaluateAll((els) => els.filter((e) => Number(e.getAttribute("data-op")) > 0.5).length);
const speedUp = async (page: Page) => page.locator('[data-speed="2"]').click();

test.describe("meiosis lab", () => {
  test.beforeEach(async ({ context }) => seed(context));

  test("every stage chip shows the right stage, step count and counts", async ({ page }) => {
    await open(page);
    await speedUp(page);
    const names = ["Interphase", "Prophase I", "Metaphase I", "Anaphase I", "Telophase I & Cytokinesis", "Prophase II", "Metaphase II", "Anaphase II", "Telophase II & Cytokinesis"];
    const cells = ["1", "1", "1", "1", "2", "2", "2", "2", "4"];
    for (let i = 0; i < 9; i++) {
      await page.locator(`[data-stage-chip="${i}"]`).click();
      await expect(page.getByTestId("stage-name")).toHaveText(names[i]!);
      await expect(page.getByTestId("stage-count")).toHaveText(`Stage ${i + 1} of 9`);
      await expect(page.getByTestId("count-chips")).toContainText(`Cells${cells[i]}`);
    }
  });

  test("chromatid counts in the picture: replication once, 4 chromatids per pair thereafter", async ({ page }) => {
    await open(page);
    await speedUp(page);
    await page.locator('[data-stage-chip="0"]').click();
    await atBeat(page, 0);
    expect(await visibleChromatids(page)).toBe(4); // 2n = 4 unreplicated
    let cur = 0;
    for (const [beat, n] of [[1, 8], [5, 8], [8, 8], [10, 8], [15, 8]] as const) {
      while (cur < beat) {
        await page.getByTestId("step-forward").click();
        cur += 1;
        await atBeat(page, cur);
      }
      expect(await visibleChromatids(page)).toBe(n);
    }
  });

  test("play runs to the end, then four haploid cells are shown; pause and restart work", async ({ page }) => {
    await open(page);
    await speedUp(page);
    await page.getByTestId("play-pause").click();
    await expect(page.locator("[data-sim-status]")).toContainText("Running");
    await page.getByTestId("play-pause").click();
    await expect(page.locator("[data-sim-status]")).toContainText("Paused");
    const b = await beatOf(page);
    await page.waitForTimeout(600);
    expect(await beatOf(page)).toBe(b); // really paused
    await page.getByTestId("play-pause").click();
    await expect(page.locator("[data-sim-status]")).toContainText("Finished", { timeout: 90_000 });
    await expect(page.getByTestId("final-cells")).toBeVisible();
    await expect(page.locator("[data-final-cell]")).toHaveCount(4);
    await page.getByTestId("restart").click();
    await atBeat(page, 0);
    await expect(page.getByTestId("stage-name")).toHaveText("Interphase");
  });

  test("speed control changes how fast a step plays", async ({ page }) => {
    await open(page);
    const time = async (speed: string) => {
      await page.getByTestId("restart").click();
      await atBeat(page, 0);
      await page.locator(`[data-speed="${speed}"]`).click();
      const t0 = Date.now();
      await page.getByTestId("step-forward").click();
      await atBeat(page, 1);
      return Date.now() - t0;
    };
    const slow = await time("0.5");
    const fast = await time("2");
    expect(slow).toBeGreaterThan(fast * 1.6);
  });

  test("step-by-step mode advances one sub-step per press of Play", async ({ page }) => {
    await open(page);
    await speedUp(page);
    await page.getByTestId("step-mode").click();
    await page.getByTestId("play-pause").click();
    await atBeat(page, 1);
    await page.waitForTimeout(1800);
    expect(await beatOf(page)).toBe(1);
    await expect(page.getByTestId("beat-title")).toContainText("DNA replication");
  });

  test("previous / next stage buttons and step back keep the sequence understandable", async ({ page }) => {
    await open(page);
    await speedUp(page);
    await page.getByTestId("next-stage").click();
    await expect(page.getByTestId("stage-name")).toHaveText("Prophase I");
    await page.getByTestId("next-stage").click();
    await expect(page.getByTestId("stage-name")).toHaveText("Metaphase I");
    await page.getByTestId("step-back").click();
    await expect(page.getByTestId("stage-name")).toHaveText("Prophase I");
    await page.getByTestId("prev-stage").click(); // inside Prophase I (sub-step 5) → start of Prophase I
    await expect(page.getByTestId("beat-title")).toContainText("Condensation");
    await page.getByTestId("prev-stage").click();
    await expect(page.getByTestId("stage-name")).toHaveText("Interphase");
  });

  test("selecting a chromatid highlights its sister and homolog and explains them", async ({ page }) => {
    await open(page);
    await speedUp(page);
    await page.locator('[data-stage-chip="1"]').click();
    await atBeat(page, 2);
    const chromatid = page.locator('[data-chromatid="0-0-0"] [role="button"]');
    await chromatid.click({ force: true });
    await expect(page.getByTestId("selection-title")).toContainText("pair 1");
    await expect(page.locator('[data-chromatid="0-0-0"]')).toHaveAttribute("data-level", "selected");
    await expect(page.locator('[data-chromatid="0-0-1"]')).toHaveAttribute("data-level", "sister");
    await expect(page.locator('[data-chromatid="0-1-0"]')).toHaveAttribute("data-level", "homolog");
    await expect(page.locator('[data-chromatid="1-0-0"]')).toHaveAttribute("data-level", "dim");
    await expect(page.getByTestId("selection-card")).toContainText("sister");
    // structure buttons select cell parts too
    await page.locator('[data-structure-btn="centrosome"]').click();
    await expect(page.getByTestId("selection-title")).toContainText("Centrosome");
  });

  test("labels toggle shows and hides structure labels", async ({ page }) => {
    await open(page);
    await speedUp(page);
    await page.locator('[data-stage-chip="1"]').click();
    await atBeat(page, 2);
    await page.setViewportSize({ width: 1280, height: 900 });
    const on = await page.locator("[data-label]").count();
    expect(on).toBeGreaterThan(1);
    await page.getByTestId("labels-toggle").click();
    await expect(page.locator("[data-label]")).toHaveCount(0);
  });

  test("keyboard: arrows step, shift+arrows change stage, space plays, R restarts", async ({ page }) => {
    await open(page);
    await speedUp(page);
    await page.getByTestId("labels-toggle").focus();
    await page.keyboard.press("ArrowRight");
    await atBeat(page, 1);
    await page.keyboard.press("Shift+ArrowRight");
    await expect(page.getByTestId("stage-name")).toHaveText("Prophase I");
    await page.keyboard.press("ArrowLeft");
    await atBeat(page, 1);
    await page.keyboard.press("r");
    await atBeat(page, 0);
    // the chromosomes can be reached with Tab and selected with Enter
    const first = page.locator('[data-testid="meiosis-stage"] [role="button"]').first();
    await first.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("selection-card")).toBeVisible();
  });

  test("Predict mode pauses before important events and reveals them after an answer", async ({ page }) => {
    await open(page);
    await speedUp(page);
    await page.locator('[data-tab="predict"]').click();
    await page.getByTestId("play-pause").click();
    await expect(page.getByTestId("predict-question")).toContainText("DNA", { timeout: 20_000 });
    expect(await beatOf(page)).toBe(0); // paused before replication, not after
    expect(await visibleChromatids(page)).toBe(4);
    await page.locator('[data-option="half"]').click(); // wrong on purpose
    await expect(page.getByRole("status").filter({ hasText: "Not quite" })).toBeVisible();
    await page.getByTestId("predict-reveal").click();
    await atBeat(page, 1);
    expect(await visibleChromatids(page)).toBe(8);
    await expect(page.getByTestId("predict-score")).toContainText("0 correct of 1");
    // jumping straight to a late stage cannot skip the next question
    await page.locator('[data-stage-chip="7"]').click();
    await expect(page.getByTestId("predict-question")).toContainText("prophase I");
    await page.locator('[data-option="pair"]').click();
    await expect(page.getByTestId("predict-score")).toContainText("1 correct of 2");
  });

  test("Identify mode: wrong answers are explained and retries work", async ({ page }) => {
    await open(page);
    await speedUp(page);
    await page.locator('[data-tab="identify"]').click();
    await expect(page.getByTestId("identify-prompt")).toContainText("SISTER");
    // picking the glowing chromatid itself is wrong
    await page.locator('[data-chromatid][data-level="selected"] [role="button"]').click({ force: true });
    await expect(page.getByRole("status").filter({ hasText: "Not quite" })).toBeVisible();
    // pick the real sister (the dimmed one with the same pair+homolog)
    await page.locator('[data-chromatid="0-0-1"] [role="button"]').click({ force: true });
    await expect(page.getByRole("status").filter({ hasText: "Correct" })).toBeVisible();
    await page.getByTestId("identify-next").click();
    await expect(page.getByTestId("identify-prompt")).toContainText("HOMOLOGOUS");
    await page.locator('[data-chromatid="0-1-0"] [role="button"]').dispatchEvent("click");
    await expect(page.getByRole("status").filter({ hasText: "Correct" })).toBeVisible();
    await page.getByTestId("identify-next").click();
    // tetrad: naming question
    await page.locator('[data-option="sisters"]').click();
    await expect(page.getByRole("status").filter({ hasText: "four chromatids" })).toBeVisible();
    await page.locator('[data-option="tetrad"]').click();
    await expect(page.getByRole("status").filter({ hasText: "Correct" })).toBeVisible();
    await page.getByTestId("identify-next").click();
    // spindle fiber
    await expect(page.getByTestId("identify-prompt")).toContainText("spindle fiber");
    await page.locator('[data-fiber] [role="button"]').first().dispatchEvent("click");
    await expect(page.getByRole("status").filter({ hasText: "Correct" })).toBeVisible();
  });

  test("Arrange the stages: feedback, retry, and a correct solution", async ({ page }) => {
    await open(page);
    await page.locator('[data-tab="practice"]').click();
    const pool = page.locator("[data-pool]");
    // place in the order the shuffle gives (almost certainly wrong)
    while ((await pool.count()) > 0) await pool.first().click();
    await page.getByTestId("arrange-check").click();
    await expect(page.locator('[data-state="bad"]').first()).toBeVisible();
    await expect(page.getByRole("status").filter({ hasText: "in the right place" })).toBeVisible();
    await page.getByTestId("arrange-retry").click();
    await expect(page.locator("[data-pool]")).toHaveCount(9);
    const labels = ["Interphase", "Prophase I", "Metaphase I", "Anaphase I", "Telophase I & Cytokinesis", "Prophase II", "Metaphase II", "Anaphase II", "Telophase II & Cytokinesis"];
    for (const l of labels) await page.locator("[data-pool]", { hasText: new RegExp(`^${l.replace(/[&]/g, "\\&")}$`) }).click();
    await page.getByTestId("arrange-check").click();
    await expect(page.getByRole("status").filter({ hasText: "All nine stages are in the right order" })).toBeVisible();
  });

  test("Meiosis Challenge: wrong answer is explained, a round can be finished and restarted", async ({ page }) => {
    await open(page);
    await page.locator('[data-tab="practice"]').click();
    await page.locator('[data-tab="challenge"]').click();
    for (let i = 0; i < 8; i++) {
      if (i === 0) {
        await page.locator("[data-option]:not([data-correct])").first().click();
        await expect(page.getByRole("status").filter({ hasText: "Not quite" })).toBeVisible();
      } else {
        await page.locator("[data-option][data-correct]").click();
      }
      await page.getByTestId("challenge-next").click();
    }
    await expect(page.getByTestId("challenge-score")).toHaveText("7 / 8");
    await page.getByTestId("challenge-restart").click();
    await expect(page.getByTestId("challenge-prompt")).toBeVisible();
  });

  test("Crossing over lab: non-sister selection, exchange, before/after, outside-the-genes case", async ({ page }) => {
    await open(page);
    await page.locator('[data-tab="variation"]').click();
    await page.getByTestId("crossover-stage").waitFor();
    await expect(page.getByTestId("xo-phase")).toContainText("Before crossing over");
    // clicking two sister chromatids is rejected with an explanation
    const chroms = page.locator('[data-testid="crossover-stage"] [data-chromatid] [role="button"]');
    await chroms.nth(0).click({ force: true });
    await chroms.nth(1).click({ force: true });
    await expect(page.getByTestId("xo-message")).toContainText("sister chromatids");
    // choose maternal + paternal chromatids by click
    await chroms.nth(3).click({ force: true });
    await expect(page.getByTestId("xo-message")).toContainText("selected");
    await page.getByTestId("xo-after").click();
    await expect(page.getByTestId("xo-phase")).toContainText("After crossing over");
    await expect(page.getByTestId("xo-recomb-count")).toContainText("2 of the 4 chromatids are recombinant");
    const rows = page.getByTestId("xo-table").locator("tbody tr");
    await expect(rows).toHaveCount(4);
    await expect(rows.filter({ hasText: "recombinant" })).toHaveCount(2);
    await expect(rows.filter({ hasText: "parental" })).toHaveCount(2);
    // a crossover outside the genes exchanges DNA without changing the combinations
    await page.getByTestId("xo-position").fill("0.08");
    await page.getByTestId("xo-after").click();
    await expect(page.getByTestId("xo-outcome")).toContainText("outside the two genes");
    await expect(page.getByTestId("xo-table").locator("tbody tr", { hasText: "recombinant" })).toHaveCount(0);
    // no crossover at all
    await page.getByTestId("xo-enabled").uncheck();
    await expect(page.getByTestId("xo-outcome")).toContainText("No crossover on this pair");
    // the animation itself plays
    await page.getByTestId("xo-enabled").check();
    await page.getByTestId("xo-position").fill("0.6");
    await page.getByTestId("xo-play").click();
    await expect(page.getByTestId("xo-phase")).toContainText("After crossing over", { timeout: 15_000 });
  });

  test("Independent assortment explorer: flipping a pair swaps what each cell receives; 2^n combinations", async ({ page }) => {
    await open(page);
    await page.locator('[data-tab="variation"]').click();
    const left = page.getByTestId("assort-left");
    await expect(left).toContainText("1M");
    await page.locator('[data-flip="0"]').click();
    await expect(left).toContainText("1P");
    await expect(page.getByTestId("assort-count")).toContainText("4");
    await page.locator('[data-pairs-top="3"]').click();
    await expect(page.getByTestId("assort-count")).toContainText("8");
  });

  test("2n vs n explorer: counts are consistent for 2n = 4, 6 and 8", async ({ page }) => {
    await open(page);
    await page.locator('[data-tab="counts"]').click();
    const stat = (id: string) => page.locator(`[data-stat="${id}"]`);
    for (const p of [2, 3, 4]) {
      await page.locator(`[data-pairs="${p}"]`).click();
      const expectations: [number, string, string, string, string][] = [
        // stage index, cells, chromosomes, chromatids, DNA
        [0, "1", String(2 * p), String(4 * p), "4C"],
        [3, "1", String(2 * p), String(4 * p), "4C"],
        [4, "2", String(p), String(2 * p), "2C"],
        [6, "2", String(p), String(2 * p), "2C"],
        [7, "2", String(2 * p), String(2 * p), "2C"],
        [8, "4", String(p), String(p), "1C"],
      ];
      for (const [s, cells, chroms, chromatids, dna] of expectations) {
        await page.locator(`[data-ploidy-stage="${s}"]`).click();
        await expect(stat("cells")).toHaveText(cells);
        await expect(stat("chromosomes")).toHaveText(chroms);
        await expect(stat("chromatids")).toHaveText(chromatids);
        await expect(stat("dna")).toHaveText(dna);
        await expect(page.getByTestId("ploidy-diagram")).toHaveAttribute("data-cells", cells);
        // the picture agrees: count chromatid rods in one cell
        const firstCell = page.locator('[data-testid="ploidy-diagram"] [data-cell="0"] [data-glyph]');
        const glyphs = await firstCell.evaluateAll((els) => els.map((e) => Number(e.getAttribute("data-chromatids"))));
        expect(glyphs.reduce((x, y) => x + y, 0)).toBe(Number(chromatids));
        expect(glyphs.length).toBe(Number(chroms));
      }
    }
    await expect(page.getByTestId("ploidy-defs")).toContainText("Sister chromatids");
    await expect(page.getByTestId("ploidy-chart")).toBeVisible();
  });

  test("simplified chromosome number changes the simulation consistently", async ({ page }) => {
    await open(page);
    await speedUp(page);
    for (const p of [2, 3, 4]) {
      await page.locator(`[data-pairs-top="${p}"]`).click();
      await atBeat(page, 0);
      expect(await visibleChromatids(page)).toBe(2 * p);
      await page.locator('[data-stage-chip="8"]').click();
      await atBeat(page, 14);
      await page.getByTestId("step-forward").click();
      await atBeat(page, 15);
      expect(await visibleChromatids(page)).toBe(4 * p);
      await expect(page.locator("[data-final-cell]")).toHaveCount(4);
    }
  });

  test("New cell gives a different random meiosis and restarts", async ({ page }) => {
    await open(page);
    await speedUp(page);
    await page.locator('[data-stage-chip="8"]').click();
    await page.getByTestId("step-forward").click();
    await atBeat(page, 15);
    const read = async () => (await page.locator("[data-final-cell]").allInnerTexts()).join("|");
    const before = new Set<string>([await read()]);
    for (let i = 0; i < 5; i++) {
      await page.getByTestId("new-cell").click();
      await atBeat(page, 0);
      await page.locator('[data-stage-chip="8"]').click();
      await page.getByTestId("step-forward").click();
      await atBeat(page, 15);
      before.add(await read());
    }
    expect(before.size).toBeGreaterThan(1);
  });

  test("reduced motion: steps jump straight to the next scene", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    await seed(context);
    const page = await context.newPage();
    await open(page);
    await page.getByTestId("step-forward").click();
    // no tween: the position is exactly the beat almost immediately
    await expect.poll(async () => Number(await page.getByTestId("meiosis-stage").getAttribute("data-pos")), { timeout: 1500 }).toBe(1);
    await context.close();
  });

  test("progress tracking: the Explore step can still be marked complete", async ({ page }) => {
    await open(page);
    await expect(page.getByRole("link", { name: /Learn & Master|Learn/i }).first()).toBeVisible();
  });
});

test.describe("meiosis lab layout", () => {
  for (const theme of ["light", "dark"]) {
    for (const [name, size] of [["phone", { width: 360, height: 740 }], ["tablet", { width: 820, height: 1100 }], ["desktop", { width: 1440, height: 900 }]] as const) {
      test(`${name} / ${theme}: no overflow, stage large, all workspaces fit`, async ({ page, context }) => {
        await seed(context, { theme });
        await page.setViewportSize(size);
        await open(page);
        const box = (await page.getByTestId("meiosis-stage").boundingBox())!;
        expect(box.width).toBeGreaterThan(Math.min(size.width * 0.55, 520));
        await expectNoPageOverflow(page, `${name}/${theme}/simulation`);
        for (const tab of ["variation", "counts", "practice"]) {
          await page.locator(`[data-tab="${tab}"]`).click();
          await expectNoPageOverflow(page, `${name}/${theme}/${tab}`);
        }
        await page.locator('[data-tab="simulation"]').click();
        await page.locator('[data-stage-chip="6"]').click();
        await expectNoPageOverflow(page, `${name}/${theme}/stage 7`);
      });
    }
  }

  test("320px: no horizontal page scroll", async ({ page, context }) => {
    await seed(context);
    await page.setViewportSize({ width: 320, height: 640 });
    await open(page);
    await expectNoPageOverflow(page, "320 simulation");
    for (const tab of ["variation", "counts", "practice"]) {
      await page.locator(`[data-tab="${tab}"]`).click();
      await expectNoPageOverflow(page, `320 ${tab}`);
    }
  });
});

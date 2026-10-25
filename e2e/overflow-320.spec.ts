import { test } from "@playwright/test";
import { ACCOUNTS, adminLogin, expectNoPageOverflow, firstQuestionId, seed } from "./helpers";

/** No page may scroll sideways at the narrowest supported phone width (inner scroll boxes are fine). */
test.use({ viewport: { width: 320, height: 640 }, hasTouch: true });

const LEARNER = ["/", "/dashboard", "/dashboard/physics", "/dashboard/physics/kinematics", "/dashboard/physics/simple-motion", "/dashboard/practice", "/dashboard/mock-tests", "/dashboard/mock-tests/css-mpt", "/dashboard/mock-tests/sindh-teacher/pst"];
const ADMIN_ANY = ["/admin", "/admin/health"];
const ADMIN_ACCOUNTS = ["/admin/questions", "/admin/questions/new", "/admin/questions/import", "/admin/publishing", "/admin/audit", "/admin/admins"];

test.describe("320px: no page-level horizontal scroll", () => {
  for (const theme of ["light", "dark"]) {
    test(`learner pages (${theme})`, async ({ page, context }) => {
      await seed(context, { theme });
      for (const url of LEARNER) {
        await page.goto(url);
        await page.waitForLoadState("load");
        await expectNoPageOverflow(page, url);
      }
    });
  }

  test("admin sign-in page", async ({ page, context }) => {
    await seed(context);
    await page.goto("/admin/login");
    await expectNoPageOverflow(page, "/admin/login");
  });

  for (const theme of ["light", "dark"]) {
    test(`admin pages (${theme})`, async ({ page, context }) => {
      await seed(context, { theme });
      await adminLogin(page);
      const urls = [...ADMIN_ANY, ...(ACCOUNTS ? ADMIN_ACCOUNTS : [])];
      for (const url of urls) {
        await page.goto(url);
        await expectNoPageOverflow(page, url);
      }
      if (ACCOUNTS) {
        const id = await firstQuestionId(page);
        await expectNoPageOverflow(page, `/admin/questions/${id}`);
      }
    });
  }
});

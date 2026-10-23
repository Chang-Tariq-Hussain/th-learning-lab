/**
 * Checks the active-route matcher and that the navigation configs only use known icons.
 * Run with: npm run verify:nav
 */
import assert from "node:assert/strict";
import { isNavActive } from "../src/lib/nav";
import { mainNav } from "../src/config/site";
import { NAV_ICONS } from "../src/components/layout/nav-icons";

const cases: [string, string, boolean | undefined, boolean][] = [
  // [pathname, href, exact, expected]
  ["/dashboard", "/dashboard", true, true],
  ["/dashboard/physics", "/dashboard", true, false],
  ["/dashboard/physics/velocity", "/dashboard/physics", undefined, true],
  ["/dashboard/physics", "/dashboard/physics", undefined, true],
  ["/dashboard/physics/", "/dashboard/physics", undefined, true],
  ["/dashboard/physics?x=1", "/dashboard/physics", undefined, true],
  ["/dashboard/physicsx", "/dashboard/physics", undefined, false], // no substring matches
  ["/dashboard/chemistry/acids", "/dashboard/physics", undefined, false],
  ["/dashboard/mock-tests/css-mpt/mock1", "/dashboard/mock-tests", undefined, true],
  ["/dashboard/practice", "/dashboard/mock-tests", undefined, false],
  ["/admin", "/admin", true, true],
  ["/admin/questions", "/admin", true, false],
  ["/admin/questions/abc-123", "/admin/questions", undefined, true],
  ["/admin/questions/new", "/admin/questions", undefined, true],
  ["/admin/questions/abc-123", "/admin/audit", undefined, false],
  ["/admin/questions/import", "/admin/publishing", undefined, false],
];
for (const [path, href, exact, expected] of cases) {
  assert.equal(isNavActive(path, href, exact), expected, `isNavActive(${path}, ${href}, ${String(exact)}) should be ${expected}`);
}
assert.equal(isNavActive(null, "/dashboard"), false);
assert.equal(isNavActive(undefined, "/dashboard"), false);

// Exactly one learner nav item is active on any real learner page.
for (const path of ["/dashboard", "/dashboard/practice", "/dashboard/mock-tests/css-mpt", "/dashboard/physics/velocity", "/dashboard/information-technology/x/y"]) {
  const active = mainNav.filter((i) => isNavActive(path, i.href, i.exact));
  assert.equal(active.length, 1, `${path} should activate exactly one item, got ${active.map((a) => a.label).join(", ") || "none"}`);
}
for (const item of mainNav) assert.ok(item.icon in NAV_ICONS, `unknown icon ${item.icon}`);

console.log(`verify-nav: ${cases.length} matcher cases + learner nav checks passed`);

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { KEY_ROUTES } from "./routes";

// 8 representative pages (v2-launch §6.5): the key routes minus the second category.
for (const route of KEY_ROUTES.filter((r) => r !== "/c/motion")) {
  test(`axe has no serious/critical issues: ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "load" });
    await page.waitForTimeout(800);
    const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    const bad = violations
      .filter((v) => v.impact === "serious" || v.impact === "critical")
      .map((v) => `${v.impact} ${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`);
    expect(bad).toEqual([]);
  });
}

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { allRoutes } from "./routes";

// quality-loop G7/G11 at full scale: every demo stage, light and dark, serious/critical = 0.
for (const route of allRoutes().filter((r) => r.startsWith("/p/"))) {
  test(`stage is accessible in both themes: ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "load" });
    // Theme changes animate colours; measure the settled state only.
    await page.addStyleTag({ content: "*,*::before,*::after{transition:none!important}" });
    await page.waitForTimeout(700);
    const bad: string[] = [];
    for (const theme of ["dark", "light"] as const) {
      if (theme === "light") {
        await page.getByRole("button", { name: "ステージをライトにする" }).first().click();
        await page.locator('[data-stage="light"]').first().waitFor();
        await page.waitForTimeout(400);
      }
      const { violations } = await new AxeBuilder({ page }).include("[data-stage]").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      for (const v of violations)
        if (v.impact === "serious" || v.impact === "critical") bad.push(`${theme} ${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`);
    }
    expect(bad).toEqual([]);
  });
}

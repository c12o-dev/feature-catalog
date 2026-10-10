import { waitReady } from "./routes";
import { expect, test, type Page } from "@playwright/test";

/** Press Tab until the focused element matches, failing after `max` presses. */
async function tabTo(page: Page, matches: (el: Element) => boolean, max = 40) {
  for (let i = 0; i < max; i++) {
    await page.keyboard.press("Tab");
    if (await page.evaluate((fn) => !!document.activeElement && new Function("el", `return (${fn})(el)`)(document.activeElement), matches.toString())) return;
  }
  throw new Error("focus target not reached by Tab");
}

// quality-loop G8: home → ⌘K → pattern page → stage theme → back, keyboard only.
test("Tab-only journey through search, pattern page and stage toggle", async ({ page }) => {
  await page.goto("/");
  await waitReady(page);
  await tabTo(page, (el) => el.tagName === "BUTTON" && !!el.textContent?.includes("検索"));
  await page.keyboard.press("Enter");
  const input = page.getByPlaceholder("パターン名・カテゴリ・目的で検索…");
  await expect(input).toBeFocused();
  await page.keyboard.type("command palette");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/p\/command-palette$/);
  await waitReady(page);

  const stage = page.locator("[data-stage]").first();
  await expect(stage).toHaveAttribute("data-stage", "dark");
  await tabTo(page, (el) => el.getAttribute("aria-label") === "ステージをライトにする", 60);
  await page.keyboard.press("Enter");
  await expect(stage).toHaveAttribute("data-stage", "light");

  // Browser-chrome shortcuts (Alt+←) are not dispatchable from Playwright; history back is the same action.
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
});

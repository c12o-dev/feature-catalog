import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

/*
 * e2e runs against the static export in out/ (run `pnpm run build` first), served with the
 * production headers. Projects:
 *   smoke    every route once, console error/warning = 0        (quality-loop G3)
 *   a11y     axe on representative pages, serious/critical = 0  (G7)
 *   stages   axe on every demo stage, light and dark             (G7, G11)
 *   keyboard Tab-only journey                                   (G8)
 *   mobile   390px: no page overflow, demos fit their stage       (G10)
 *   shots    screenshots for the quality loop; run explicitly via `pnpm run shots`
 */
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  workers: process.env.CI ? 4 : 8,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  timeout: 60_000,
  use: { baseURL: `http://localhost:${PORT}`, ...devices["Desktop Chrome"] },
  webServer: { command: `node scripts/serve-out.mjs ${PORT}`, port: PORT, reuseExistingServer: !process.env.CI },
  projects: [
    { name: "smoke", testMatch: "routes.spec.ts" },
    { name: "a11y", testMatch: "a11y.spec.ts" },
    { name: "stages", testMatch: "stages.spec.ts" },
    { name: "keyboard", testMatch: "keyboard.spec.ts" },
    { name: "mobile", testMatch: "mobile.spec.ts" },
    { name: "shots", testMatch: "shots.spec.ts", fullyParallel: false },
  ],
});

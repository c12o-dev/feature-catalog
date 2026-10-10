/* Measures each demo's rendered height at 390 and 1440 — in the hero stage (/p pages: sm, lg) and
   in place in the category cards (/c pages: csm, clg) — and writes
   src/data/demo-sizes.generated.json, which the Stage uses to reserve the height before the demo
   chunk arrives (no layout shift on swap). Re-run after changing demos:
     pnpm run build && pnpm run measure && pnpm run build
   Usage: node scripts/measure-demos.mjs   (serves out/ on :3300 by itself) */
import { spawn } from "node:child_process";
import fs from "node:fs";
import { chromium } from "@playwright/test";

const PORT = 3300;
const server = spawn("node", ["scripts/serve-out.mjs", String(PORT)], { stdio: "ignore" });
await new Promise((r) => setTimeout(r, 800));

const xml = fs.readFileSync("out/sitemap.xml", "utf8");
const routes = [...xml.matchAll(/<loc>https?:\/\/[^/]+(\/p\/[^<]*)<\/loc>/g)].map((m) => m[1]);
const prev = fs.existsSync("src/data/demo-sizes.generated.json") ? JSON.parse(fs.readFileSync("src/data/demo-sizes.generated.json", "utf8")) : {};
const sizes = {};
const browser = await chromium.launch();

async function measure(ctx, route) {
  const page = await ctx.newPage();
  await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: "load" });
  await page.waitForFunction(() => !document.querySelector("[data-page-loader]"), null, { timeout: 15000 });
  const stage = page.locator("[data-stage]").first();
  if (!(await stage.count())) return null;
  // wait for the lazy demo chunk to replace the skeleton
  await page.waitForFunction(() => !document.querySelector("[data-stage] [data-demo-root] .animate-pulse"), null, { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(400);
  const r = await page.evaluate(() => {
    const s = document.querySelector("[data-stage]");
    const root = s?.querySelector("[data-demo-root]");
    return s && root ? { key: s.getAttribute("data-demo"), h: Math.round(root.getBoundingClientRect().height) } : null;
  });
  await page.close();
  return r;
}

let i = 0;
async function worker() {
  const lg = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const sm = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  while (i < routes.length) {
    const route = routes[i++];
    const a = await measure(lg, route);
    const b = await measure(sm, route);
    if (a && b && a.key) sizes[a.key] = { sm: b.h, lg: a.h };
  }
  await lg.close();
  await sm.close();
}
await Promise.all(Array.from({ length: 6 }, worker));

// Card stages on category pages: measured in place at phone width and in the two-column layout.
const catRoutes = [...xml.matchAll(/<loc>https?:\/\/[^/]+(\/c\/[^<]*)<\/loc>/g)].map((m) => m[1]);
async function measureCards(ctx, route, field) {
  const page = await ctx.newPage();
  await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: "load" });
  await page.waitForFunction(() => !document.querySelector("[data-page-loader]"), null, { timeout: 15000 });
  await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
  // walk down so every stage comes near the viewport and mounts its demo
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 500) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(60);
  }
  await page.waitForFunction(() => !document.querySelector('[data-size="card"] [data-demo-root] .animate-pulse'), null, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(500);
  const rows = await page.evaluate(() =>
    [...document.querySelectorAll('[data-stage][data-size="card"]')].map((s) => {
      const root = s.querySelector("[data-demo-root]");
      // measure the demo itself, not the reserved min-height
      const prev = root.style.minHeight;
      root.style.minHeight = "0px";
      root.classList.add("!min-h-0");
      const h = Math.round(root.getBoundingClientRect().height);
      root.classList.remove("!min-h-0");
      root.style.minHeight = prev;
      return [s.getAttribute("data-demo"), h];
    }),
  );
  await page.close();
  for (const [key, h] of rows) if (key && sizes[key]) sizes[key][field] = Math.max(sizes[key][field] ?? 0, h);
}
const lgCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const smCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
for (const r of catRoutes) {
  await measureCards(lgCtx, r, "clg");
  await measureCards(smCtx, r, "csm");
}
await lgCtx.close();
await smCtx.close();
await browser.close();
server.kill();

const keys = Object.keys(sizes).sort();
const out = Object.fromEntries(keys.map((k) => [k, sizes[k]]));
fs.writeFileSync("src/data/demo-sizes.generated.json", JSON.stringify(out, null, 0) + "\n");
const changed = keys.filter((k) => JSON.stringify(prev[k]) !== JSON.stringify(out[k])).length;
console.log(`[measure] ${keys.length} demos, ${changed} changed`);

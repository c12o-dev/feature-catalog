// 台本（clips/scenarios/<slug>.json）どおりにデモを操作しながら録画し、
// tmp/clips/raw/<slug>.webm と <slug>.json（テロップ時刻・切り出し範囲）を出す。
// 使い方: node clips/record.mjs <slug> [slug ...]
// 前提: pnpm run build 済みで、node scripts/serve-out.mjs 3100 が動いていること。
import { rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";
import { RAW, ensureDirs, loadScenario, validateScenario } from "./lib.mjs";

const BASE = process.env.CLIPS_BASE ?? "http://localhost:3100";
// 録画はビューポート 1:1 の画素でしか取れない（deviceScaleFactor は効かない）ので、
// 大きいビューポートに CSS zoom でページを拡大して描画し、実質の解像度を上げる。
const ZOOM = Number(process.env.CLIPS_ZOOM ?? 1.5);
const W = Math.round(1280 * ZOOM);
const H = Math.round(720 * ZOOM);

// ヘッドレスはマウスカーソルを描かないので、疑似カーソルを DOM に載せる
const CURSOR = `(() => {
  const mk = () => {
    const c = document.createElement("div");
    c.id = "__clip_cursor";
    Object.assign(c.style, { position: "fixed", left: "-100px", top: "-100px", width: "26px", height: "26px",
      zIndex: 2147483647, pointerEvents: "none", transition: "transform 120ms ease", filter: "drop-shadow(0 1px 2px rgba(0,0,0,.6))" });
    c.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26"><path d="M5 3l14 8.5-6.2 1.6L9.5 20 5 3z" fill="#fff" stroke="#000" stroke-width="1.4" stroke-linejoin="round"/></svg>';
    document.documentElement.appendChild(c);
    document.addEventListener("mousemove", (e) => { c.style.left = e.clientX + "px"; c.style.top = e.clientY + "px"; }, true);
    document.addEventListener("mousedown", () => { c.style.transform = "scale(.8)"; }, true);
    document.addEventListener("mouseup", () => { c.style.transform = "scale(1)"; }, true);
  };
  if (document.readyState !== "loading") mk(); else document.addEventListener("DOMContentLoaded", mk);
})();`;

/** 台本の対象指定 → Playwright locator。scope は demo（既定）か page */
function resolve(page, demo, target) {
  const base = target.scope === "page" ? page : demo;
  const name = target.name && /^\/.*\/$/.test(target.name) ? new RegExp(target.name.slice(1, -1)) : target.name;
  if (target.role) return base.getByRole(target.role, name ? { name } : {}).first();
  if (target.label) return base.getByLabel(target.label).first();
  if (target.text) return base.getByText(target.text).first();
  return base.locator(target.selector).first();
}

export async function recordOne(browser, sc) {
  const errors = validateScenario(sc);
  if (errors.length) throw new Error(`台本が不正 (${sc.slug}):\n- ${errors.join("\n- ")}`);
  const context = await browser.newContext({
    viewport: { width: W, height: H },
    deviceScaleFactor: 1,
    colorScheme: "dark",
    locale: "ja-JP",
    recordVideo: { dir: RAW, size: { width: W, height: H } },
  });
  await context.addInitScript(CURSOR);
  const page = await context.newPage();
  const t0 = Date.now(); // 録画はページ生成から始まる
  const now = () => (Date.now() - t0) / 1000;
  const marks = [];

  await page.goto(`${BASE}/p/${sc.slug}`, { waitUntil: "load" });
  await page.waitForFunction(() => !document.querySelector("[data-page-loader]"), null, { timeout: 15000 });
  if (ZOOM !== 1) {
    await page.evaluate((z) => {
      document.documentElement.style.zoom = String(z);
    }, ZOOM);
    await page.waitForTimeout(300);
  }
  const root = page.locator("[data-demo-root]").first();
  await root.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => !document.querySelector("[data-demo-root] .animate-pulse"), null, { timeout: 15000 }).catch(() => {});
  // デモを画面中央に。以後スクロールしない
  await root.evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
  await page.waitForTimeout(700);
  const rootBox = await root.boundingBox();
  // content: 実際に何かが描かれている要素（文字・入力・画像・ボタン）の外接矩形。
  // 幅いっぱいの入れ物（flex の中央寄せ等）に引きずられて余白だらけにならないように
  const contentBox =
    (await root.evaluate((el) => {
      const r0 = el.getBoundingClientRect();
      let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
      const leafy = (n) =>
        ["INPUT", "BUTTON", "IMG", "SVG", "CANVAS", "VIDEO", "TEXTAREA", "SELECT"].includes(n.tagName) ||
        (n.children.length === 0 && n.textContent.trim().length > 0) ||
        (getComputedStyle(n).backgroundColor !== "rgba(0, 0, 0, 0)" && n.getBoundingClientRect().width < r0.width * 0.98);
      for (const n of el.querySelectorAll("*")) {
        if (!leafy(n)) continue;
        const r = n.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        x1 = Math.min(x1, r.left); y1 = Math.min(y1, r.top); x2 = Math.max(x2, r.right); y2 = Math.max(y2, r.bottom);
      }
      if (!Number.isFinite(x1)) return null;
      // 親要素の枠内に収める
      x1 = Math.max(x1, r0.left); y1 = Math.max(y1, r0.top); x2 = Math.min(x2, r0.right); y2 = Math.min(y2, r0.bottom);
      return { x: x1, y: y1, width: x2 - x1, height: y2 - y1 };
    })) ?? rootBox;
  const box = sc.crop === "content" ? contentBox : rootBox;
  // 画面下端に固定のトースト（sonner）をデモの直下へ寄せる
  if (sc.toaster === "near-demo") {
    const bottom = Math.round((H - (box.y + box.height)) / ZOOM) - 120;
    await page.addStyleTag({ content: `[data-sonner-toaster]{bottom:${bottom}px !important}` });
  }
  const title = (await page.locator("h1").first().textContent())?.trim() ?? sc.slug;
  await page.mouse.move(W - 40, H - 40);
  await page.waitForTimeout(300);
  const ready = now();

  const click = async (target, hoverOnly = false) => {
    const b = await resolve(page, root, target).boundingBox();
    if (!b) throw new Error(`要素が見つからない: ${JSON.stringify(target)}`);
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 28 });
    await page.waitForTimeout(180);
    if (hoverOnly) return;
    await page.mouse.down();
    await page.waitForTimeout(90);
    await page.mouse.up();
  };
  for (const st of sc.steps) {
    if ("mark" in st) marks.push({ t: now(), caption: st.mark });
    else if ("click" in st) await click(st.click);
    else if ("hover" in st) await click(st.hover, true);
    else if ("type" in st) await page.keyboard.type(st.type, { delay: st.delay ?? 140 });
    else if ("press" in st) await page.keyboard.press(st.press);
    else if ("wait" in st) await page.waitForTimeout(st.wait);
    else if ("scroll" in st) await page.mouse.wheel(0, st.scroll);
    // 操作の直後は少し間を置く（テロップ切替と重ならないように）
    if (!("wait" in st) && !("mark" in st)) await page.waitForTimeout(st.after ?? 350);
  }
  await page.waitForTimeout(800);
  const end = now();
  await page.waitForTimeout(300);
  const video = page.video();
  await context.close();
  const out = path.join(RAW, `${sc.slug}.webm`);
  await rename(await video.path(), out);

  const pad = sc.pad ?? 28;
  let crop;
  if (sc.crop === "viewport") crop = { x: 0, y: 0, w: W, h: H };
  else {
    crop = {
      x: Math.max(0, Math.floor(box.x - pad)),
      y: Math.max(0, Math.floor(box.y - pad)),
      w: Math.ceil(box.width + pad * 2),
      h: Math.ceil(box.height + pad * 2),
    };
    if (sc.extend) {
      crop.x = Math.max(0, crop.x - (sc.extend.left ?? 0));
      crop.y = Math.max(0, crop.y - (sc.extend.top ?? 0));
      crop.w += (sc.extend.left ?? 0) + (sc.extend.right ?? 0);
      crop.h += (sc.extend.top ?? 0) + (sc.extend.bottom ?? 0);
    }
  }
  crop.w = Math.min(crop.w, W - crop.x);
  crop.h = Math.min(crop.h, H - crop.y);
  const meta = { slug: sc.slug, title, video: out, ready, end, crop, marks, size: { w: W, h: H } };
  await writeFile(path.join(RAW, `${sc.slug}.json`), JSON.stringify(meta, null, 2));
  console.log(`record ${sc.slug}: ${title} / ${(end - ready).toFixed(1)}s / crop ${crop.w}x${crop.h} / ${marks.length} captions`);
  return meta;
}

export async function recordMany(slugs) {
  await ensureDirs();
  const browser = await chromium.launch();
  const results = [];
  try {
    for (const slug of slugs) {
      try {
        results.push({ slug, ok: true, meta: await recordOne(browser, await loadScenario(slug)) });
      } catch (e) {
        console.error(`record ${slug}: 失敗 — ${e.message}`);
        results.push({ slug, ok: false, error: e.message });
      }
    }
  } finally {
    await browser.close();
  }
  return results;
}

if (process.argv[1] && path.resolve(process.argv[1]) === new URL(import.meta.url).pathname) {
  const slugs = process.argv.slice(2);
  if (!slugs.length) {
    console.error("使い方: node clips/record.mjs <slug> [slug ...]");
    process.exit(1);
  }
  const r = await recordMany(slugs);
  if (r.some((x) => !x.ok)) process.exit(1);
}

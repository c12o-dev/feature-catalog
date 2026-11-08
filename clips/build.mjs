// 一気通貫: 台本が無ければ下書き → 録画 → 書き出し → 確認用シート。
// 使い方: node clips/build.mjs <slug> [slug ...]   /   node clips/build.mjs --all [--limit N] [--skip-existing]
// 前提: pnpm run build 済み。配信サーバーは無ければ自分で立てる。
import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import path from "node:path";
import { OUT, ROOT, loadCatalog } from "./lib.mjs";
import { draftOne } from "./draft.mjs";
import { recordMany } from "./record.mjs";
import { renderOne } from "./render.mjs";
import { sheetOne } from "./sheet.mjs";

const PORT = 3100;
const BASE = process.env.CLIPS_BASE ?? `http://localhost:${PORT}`;

async function serverUp() {
  try {
    const r = await fetch(`${BASE}/`, { signal: AbortSignal.timeout(1500) });
    return r.ok;
  } catch {
    return false;
  }
}

async function ensureServer() {
  if (await serverUp()) return null;
  await access(path.join(ROOT, "out", "404.html")).catch(() => {
    throw new Error("out/ が無い。先に pnpm run build を実行してください");
  });
  const child = spawn("node", ["scripts/serve-out.mjs", String(PORT)], { cwd: ROOT, stdio: "ignore" });
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 250));
    if (await serverUp()) return child;
  }
  child.kill();
  throw new Error("配信サーバーが起動しない");
}

const args = process.argv.slice(2);
const all = args.includes("--all");
const skipExisting = args.includes("--skip-existing");
const limitIdx = args.indexOf("--limit");
const limit = limitIdx >= 0 ? Number(args[limitIdx + 1]) : Number.POSITIVE_INFINITY;
let slugs = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--limit");
// aliasOf 付きは別 slug で同じデモを指す（number-roll → counter-tick 等）ので、--all では元の方だけ作る
if (all) slugs = [...(await loadCatalog()).values()].filter((p) => !p.aliasOf).map((p) => p.slug);
if (skipExisting) {
  const kept = [];
  for (const s of slugs) {
    const exists = await access(path.join(OUT, `${s}.mp4`)).then(() => true, () => false);
    if (!exists) kept.push(s);
  }
  slugs = kept;
}
slugs = slugs.slice(0, limit);
if (!slugs.length) {
  console.error("対象が無い。使い方: node clips/build.mjs <slug> ... | --all [--limit N] [--skip-existing]");
  process.exit(1);
}

const server = await ensureServer();
const summary = [];
try {
  const ready = [];
  for (const s of slugs) {
    try {
      await draftOne(s);
      ready.push(s);
    } catch (e) {
      summary.push({ slug: s, stage: "draft", ok: false, error: e.message.split("\n")[0] });
    }
  }
  const rec = await recordMany(ready);
  for (const r of rec) {
    if (!r.ok) {
      summary.push({ slug: r.slug, stage: "record", ok: false, error: r.error.split("\n")[0] });
      continue;
    }
    try {
      await renderOne(r.slug);
      await sheetOne(r.slug);
      summary.push({ slug: r.slug, stage: "done", ok: true });
    } catch (e) {
      summary.push({ slug: r.slug, stage: "render", ok: false, error: e.message.split("\n")[0] });
    }
  }
} finally {
  server?.kill();
}
console.log("\n=== まとめ ===");
for (const s of summary) console.log(`${s.ok ? "ok  " : "NG  "} ${s.slug}${s.ok ? "" : ` (${s.stage}: ${s.error})`}`);
if (summary.some((s) => !s.ok)) process.exit(1);

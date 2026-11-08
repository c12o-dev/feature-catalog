// clips 共通: パス、台本の読み書き、カタログ（slug → 名前・デモ・メモ）の参照。
// src/data の TS は Node 22 の型剥がし（type stripping）で直接 import する。
// 正規表現で読むと手書きの categories.ts が折り返されたときに無言で脱落するため。
import { realpathSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const SCENARIOS = path.join(ROOT, "clips", "scenarios");
export const TMP = path.join(ROOT, "tmp", "clips");
export const RAW = path.join(TMP, "raw");
export const OUT = path.join(TMP, "out");
export const REVIEW = path.join(TMP, "review");

/**
 * `node clips/x.mjs` として直接実行されたか（import されただけなら false）。
 * import.meta.url は realpath 済みなので argv[1] も realpath にそろえる（symlink 経由でも効く）。空白・非 ASCII も可
 */
export const isMain = (importMetaUrl) => {
  if (!process.argv[1]) return false;
  let argv;
  try {
    argv = realpathSync(path.resolve(process.argv[1]));
  } catch {
    return false;
  }
  return argv === fileURLToPath(importMetaUrl);
};

export async function ensureDirs() {
  for (const d of [SCENARIOS, RAW, OUT, REVIEW]) await mkdir(d, { recursive: true });
}

// src/data/package.json の "type": "module" で、.ts を直接 import しても
// MODULE_TYPELESS_PACKAGE_JSON の警告が出ないようにしてある（プロセス全体の警告処理には触らない）
let dataCache;
async function data() {
  if (!dataCache) {
    const [c, n, d] = await Promise.all([
      import("../src/data/categories.ts"),
      import("../src/data/pattern-notes.ts"),
      import("../src/data/demo-meta.generated.ts"),
    ]);
    dataCache = { categories: c.categories, patternNotes: n.patternNotes, demoMeta: d.demoMeta };
  }
  return dataCache;
}

/** slug → { slug, name, description, demo, aliasOf? }。aliasOf 付きは別 slug の同じデモ */
export async function loadCatalog() {
  const { categories } = await data();
  const map = new Map();
  for (const c of categories) for (const p of c.patterns) map.set(p.slug, { slug: p.slug, name: p.name, description: p.description, demo: p.demo, aliasOf: p.aliasOf });
  return map;
}

/** コンポーネント名 → ファイル */
export async function loadDemoFiles() {
  const { demoMeta } = await data();
  return new Map(Object.entries(demoMeta).map(([k, v]) => [k, v.file]));
}

/** slug → { notes, when } */
export async function loadNotes() {
  const { patternNotes } = await data();
  return new Map(Object.entries(patternNotes).map(([k, v]) => [k, { notes: v.notes, when: v.when ?? "" }]));
}

/** slug の素材一式（名前・説明・デモのソース・メモ） */
export async function patternContext(slug) {
  const [catalog, files, notes] = await Promise.all([loadCatalog(), loadDemoFiles(), loadNotes()]);
  const entry = catalog.get(slug);
  if (!entry) throw new Error(`カタログに無い slug: ${slug}`);
  const file = files.get(entry.demo);
  if (!file) throw new Error(`デモのファイルが見つからない: ${entry.demo}`);
  const source = await readFile(path.join(ROOT, file), "utf8");
  return { ...entry, file, source, ...(notes.get(slug) ?? { notes: "", when: "" }) };
}

export async function listScenarioSlugs() {
  const files = await readdir(SCENARIOS).catch(() => []);
  return files.filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""));
}

export async function loadScenario(slug) {
  return JSON.parse(await readFile(path.join(SCENARIOS, `${slug}.json`), "utf8"));
}

export async function saveScenario(sc) {
  await writeFile(path.join(SCENARIOS, `${sc.slug}.json`), `${JSON.stringify(sc, null, 2)}\n`);
}

const ACTIONS = ["mark", "click", "hover", "type", "press", "wait", "scroll"];
const TOP_KEYS = ["slug", "crop", "pad", "extend", "toaster", "steps", "post"];
const isNum = (v) => typeof v === "number" && Number.isFinite(v);

/** 台本の検証。record.mjs が読むキーと一対一で対応させる（ここに無いキーは record.mjs も見ない） */
export function validateScenario(sc) {
  const errors = [];
  if (typeof sc.slug !== "string") errors.push("slug が無い");
  if (!["demo", "content", "viewport"].includes(sc.crop)) errors.push(`crop が不正: ${sc.crop}`);
  for (const k of Object.keys(sc)) if (!TOP_KEYS.includes(k)) errors.push(`未知のキー: ${k}`);
  if (sc.pad !== undefined && !isNum(sc.pad)) errors.push("pad は数値");
  if (sc.toaster !== undefined && sc.toaster !== "near-demo") errors.push(`toaster は "near-demo" だけ: ${sc.toaster}`);
  if (sc.extend !== undefined) {
    if (typeof sc.extend !== "object" || sc.extend === null) errors.push("extend はオブジェクト");
    else for (const [k, v] of Object.entries(sc.extend)) if (!["left", "right", "top", "bottom"].includes(k) || !isNum(v)) errors.push(`extend.${k} が不正`);
  }
  if (!Array.isArray(sc.steps) || sc.steps.length === 0) errors.push("steps が空");
  let marks = 0;
  for (const [i, st] of (sc.steps ?? []).entries()) {
    const keys = Object.keys(st).filter((k) => !["delay", "after"].includes(k));
    if (keys.length !== 1) errors.push(`steps[${i}] は 1 操作だけ: ${JSON.stringify(st)}`);
    const k = keys[0];
    if (!ACTIONS.includes(k)) errors.push(`steps[${i}] 未知の操作 ${k}`);
    if (st.delay !== undefined && !isNum(st.delay)) errors.push(`steps[${i}] delay は数値`);
    if (st.after !== undefined && !isNum(st.after)) errors.push(`steps[${i}] after は数値`);
    if (k === "mark") {
      marks += 1;
      if (typeof st.mark !== "string" || st.mark.length === 0 || st.mark.length > 24) errors.push(`steps[${i}] テロップは 1〜24 文字: ${st.mark}`);
    }
    if (k === "click" || k === "hover") {
      const t = st[k];
      if (typeof t !== "object" || t === null || !(t.role || t.text || t.label || t.selector)) errors.push(`steps[${i}] ${k} の対象指定が無い（role / text / label / selector）`);
      else if (t.scope !== undefined && !["demo", "page"].includes(t.scope)) errors.push(`steps[${i}] scope は demo か page`);
    }
    if (k === "type" && typeof st.type !== "string") errors.push(`steps[${i}] type は文字列`);
    if (k === "press" && typeof st.press !== "string") errors.push(`steps[${i}] press は文字列`);
    if ((k === "wait" || k === "scroll") && !isNum(st[k])) errors.push(`steps[${i}] ${k} は数値`);
  }
  if (marks < 1 || marks > 4) errors.push(`テロップは 1〜4 本（今 ${marks}）`);
  if (sc.post !== undefined) {
    if (typeof sc.post !== "object" || sc.post === null) errors.push("post はオブジェクト");
    else if (typeof sc.post.ja !== "string" || sc.post.ja.length > 140) errors.push("post.ja は 140 文字以内の文字列");
  }
  return errors;
}

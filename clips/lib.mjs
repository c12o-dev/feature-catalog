// clips 共通: パス、台本の読み書き、カタログ（slug → 名前・デモ・メモ）の参照。
// src/data の TS は実行せず正規表現で読む（生成ファイルなので形が安定している）。
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const SCENARIOS = path.join(ROOT, "clips", "scenarios");
export const TMP = path.join(ROOT, "tmp", "clips");
export const RAW = path.join(TMP, "raw");
export const OUT = path.join(TMP, "out");
export const REVIEW = path.join(TMP, "review");

export async function ensureDirs() {
  for (const d of [SCENARIOS, RAW, OUT, REVIEW]) await mkdir(d, { recursive: true });
}

/** categories.ts の { slug, name, description, demo } 行を全部拾う */
export async function loadCatalog() {
  const src = await readFile(path.join(ROOT, "src/data/categories.ts"), "utf8");
  // 1 行 1 パターン。example: { ... } が間に挟まるので項目ごとに拾う
  const map = new Map();
  for (const line of src.split("\n")) {
    const slug = line.match(/\bslug:\s*"([^"]+)"/)?.[1];
    const demo = line.match(/\bdemo:\s*"([^"]+)"/)?.[1];
    if (!slug || !demo) continue;
    const name = line.match(/\bname:\s*"((?:[^"\\]|\\.)*)"/)?.[1] ?? slug;
    const description = line.match(/\bdescription:\s*"((?:[^"\\]|\\.)*)"/)?.[1] ?? "";
    map.set(slug, { slug, name, description, demo });
  }
  return map;
}

/** demo-meta.generated.ts: コンポーネント名 → ファイル */
export async function loadDemoFiles() {
  const src = await readFile(path.join(ROOT, "src/data/demo-meta.generated.ts"), "utf8");
  const re = /"([A-Za-z0-9]+)":\s*\{\s*"file":\s*"([^"]+)"/g;
  const map = new Map();
  for (const m of src.matchAll(re)) map.set(m[1], m[2]);
  return map;
}

/** pattern-notes.ts: slug → { notes, when } */
export async function loadNotes() {
  const src = await readFile(path.join(ROOT, "src/data/pattern-notes.ts"), "utf8");
  const re = /"([a-z0-9-]+)":\s*\{\s*"notes":\s*"((?:[^"\\]|\\.)*)"(?:,\s*"when":\s*"((?:[^"\\]|\\.)*)")?/g;
  const map = new Map();
  for (const m of src.matchAll(re)) map.set(m[1], { notes: m[2], when: m[3] ?? "" });
  return map;
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

/** 台本の最低限の検証。壊れた台本で録画に入らないため */
export function validateScenario(sc) {
  const errors = [];
  if (typeof sc.slug !== "string") errors.push("slug が無い");
  if (!["demo", "content", "viewport"].includes(sc.crop)) errors.push(`crop が不正: ${sc.crop}`);
  if (!Array.isArray(sc.steps) || sc.steps.length === 0) errors.push("steps が空");
  let marks = 0;
  for (const [i, st] of (sc.steps ?? []).entries()) {
    const keys = Object.keys(st).filter((k) => !["delay", "scope"].includes(k));
    if (keys.length !== 1) errors.push(`steps[${i}] は 1 操作だけ: ${JSON.stringify(st)}`);
    const k = keys[0];
    if (!["mark", "click", "hover", "type", "press", "wait", "scroll"].includes(k)) errors.push(`steps[${i}] 未知の操作 ${k}`);
    if (k === "mark") {
      marks += 1;
      if (typeof st.mark !== "string" || st.mark.length === 0 || st.mark.length > 24) errors.push(`steps[${i}] テロップは 1〜24 文字: ${st.mark}`);
    }
    if ((k === "click" || k === "hover") && !(st[k].role || st[k].text || st[k].label || st[k].selector)) errors.push(`steps[${i}] ${k} の対象指定が無い`);
  }
  if (marks < 1 || marks > 4) errors.push(`テロップは 1〜4 本（今 ${marks}）`);
  if (sc.post && (typeof sc.post.ja !== "string" || sc.post.ja.length > 140)) errors.push("post.ja は 140 文字以内");
  return errors;
}

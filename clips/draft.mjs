// デモのソースとカタログの説明から、台本 JSON の下書きを claude -p で作る。
// 使い方: node clips/draft.mjs <slug> [slug ...] [--force]
// 既にある台本は --force が無い限り上書きしない（人が直した台本を守る）。
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ROOT, SCENARIOS, ensureDirs, isMain, listScenarioSlugs, loadScenario, patternContext, saveScenario, validateScenario } from "./lib.mjs";

const SPEC = await readFile(path.join(ROOT, "clips", "PROMPT.md"), "utf8");
const EXAMPLES = ["command-palette", "toast", "otp-input"];

async function examples() {
  const have = new Set(await listScenarioSlugs());
  const parts = [];
  for (const s of EXAMPLES) if (have.has(s)) parts.push(JSON.stringify(await loadScenario(s), null, 2));
  return parts;
}

function extractJson(text) {
  const t = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start < 0 || end < 0) throw new Error("JSON が見つからない");
  return JSON.parse(t.slice(start, end + 1));
}

export async function draftOne(slug, { force = false } = {}) {
  await ensureDirs();
  const have = new Set(await listScenarioSlugs());
  if (have.has(slug) && !force) {
    console.log(`draft ${slug}: 既にある（--force で上書き）`);
    return loadScenario(slug);
  }
  const ctx = await patternContext(slug);
  const ex = await examples();
  const prompt = [
    SPEC,
    "",
    "## 手本（人が確認済みの台本）",
    ...ex.map((e) => `\`\`\`json\n${e}\n\`\`\``),
    "",
    "## 今回のパターン",
    `slug: ${ctx.slug}`,
    `名前: ${ctx.name}`,
    `説明: ${ctx.description}`,
    ctx.when ? `使いどころ: ${ctx.when}` : "",
    ctx.notes ? `実装のポイント: ${ctx.notes}` : "",
    "",
    `## デモのソース (${ctx.file})`,
    "```tsx",
    ctx.source,
    "```",
    "",
    "この 1 パターンの台本 JSON だけを出力してください。",
  ].join("\n");

  // 入れ子の Claude Code セッション判定を外して非対話で呼ぶ。必要な素材は全部プロンプトに入れてあるので
  // ツールは渡さない（速く、出力が揺れにくく、リポを読み回らない）。--bare はログイン情報も読まなくなるので使わない
  const env = { ...process.env };
  delete env.CLAUDECODE;
  let stdout;
  try {
    stdout = execFileSync("claude", ["-p", "--tools", "", "--output-format", "text"], { env, input: prompt, encoding: "utf8", maxBuffer: 8 * 1024 * 1024, timeout: 240_000 });
  } catch (e) {
    throw new Error(`claude -p が失敗: ${(e.stderr || e.message).toString().slice(0, 400)}`);
  }
  const sc = extractJson(stdout);
  sc.slug = slug;
  const errors = validateScenario(sc);
  if (errors.length) throw new Error(`下書きが仕様外:\n- ${errors.join("\n- ")}\n--- 出力 ---\n${stdout.slice(0, 1500)}`);
  await saveScenario(sc);
  console.log(`draft ${slug}: ${path.relative(process.cwd(), path.join(SCENARIOS, `${slug}.json`))} (${sc.steps.length} steps)`);
  return sc;
}

if (isMain(import.meta.url)) {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const slugs = args.filter((a) => !a.startsWith("--"));
  if (!slugs.length) {
    console.error("使い方: node clips/draft.mjs <slug> [slug ...] [--force]");
    process.exit(1);
  }
  let failed = 0;
  for (const s of slugs) {
    try {
      await draftOne(s, { force });
    } catch (e) {
      failed += 1;
      console.error(`draft ${s}: 失敗 — ${e.message}`);
    }
  }
  if (failed) process.exit(1);
}

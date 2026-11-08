// 確認用: 各クリップから 4 コマ抜いて横に並べた PNG を tmp/clips/review/<slug>.png に出す。
// 使い方: node clips/sheet.mjs <slug> [slug ...]
import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";
import { OUT, REVIEW, ensureDirs, isMain } from "./lib.mjs";

const run = promisify(execFile);

export async function sheetOne(slug) {
  await ensureDirs();
  const mp4 = path.join(OUT, `${slug}.mp4`);
  const { stdout } = await run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp4]);
  const dur = Number(stdout.trim());
  const points = [0.12, 0.4, 0.68, 0.94];
  const inputs = [];
  for (const p of points) inputs.push("-ss", (dur * p).toFixed(2), "-i", mp4);
  const out = path.join(REVIEW, `${slug}.png`);
  await run("ffmpeg", [
    "-y", "-hide_banner", "-loglevel", "error",
    ...inputs,
    "-filter_complex", `${points.map((_, i) => `[${i}:v]scale=480:480[s${i}]`).join(";")};${points.map((_, i) => `[s${i}]`).join("")}hstack=${points.length}`,
    "-frames:v", "1", out,
  ]);
  console.log(`sheet ${slug}: ${path.relative(process.cwd(), out)}`);
  return out;
}

if (isMain(import.meta.url)) {
  for (const s of process.argv.slice(2)) await sheetOne(s);
}

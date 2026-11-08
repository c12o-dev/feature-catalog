// tmp/clips/raw/<slug>.webm + .json → tmp/clips/out/<slug>.mp4（1080x1080、テロップ焼き込み、無音トラック付き）
// 使い方: node clips/render.mjs <slug> [slug ...]
import { execFile } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { OUT, RAW, ensureDirs } from "./lib.mjs";

const run = promisify(execFile);
const SIZE = 1080;
const FONT = process.env.CLIPS_FONT ?? "IPAPGothic";
const CREDIT = "feature-catalog.c12o.net";

const esc = (s) => s.replace(/\\/g, "\\\\").replace(/\{/g, "(").replace(/\}/g, ")");
const ts = (sec) => {
  const s = Math.max(0, sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = (s % 60).toFixed(2).padStart(5, "0");
  return `${h}:${String(m).padStart(2, "0")}:${r}`;
};

function buildAss(meta, dur) {
  const lines = [
    "[Script Info]",
    "ScriptType: v4.00+",
    `PlayResX: ${SIZE}`,
    `PlayResY: ${SIZE}`,
    "WrapStyle: 0",
    "ScaledBorderAndShadow: yes",
    "",
    "[V4+ Styles]",
    "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
    // 上: パターン名、上右: クレジット、下: テロップ（縁取り）
    `Style: Title,${FONT},46,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,0,0,8,40,40,52,1`,
    `Style: Credit,${FONT},26,&H00A0A0A0,&H00A0A0A0,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,9,40,40,110,1`,
    `Style: Cap,${FONT},50,&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,3,0,2,60,60,64,1`,
    "",
    "[Events]",
    "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text",
    `Dialogue: 0,${ts(0)},${ts(dur)},Title,,0,0,0,,${esc(meta.title)}`,
    `Dialogue: 0,${ts(0)},${ts(dur)},Credit,,0,0,0,,${CREDIT}`,
  ];
  const marks = meta.marks.map((m) => ({ ...m, t: m.t - meta.ready }));
  marks.forEach((m, i) => {
    const start = Math.max(0, m.t);
    const end = i + 1 < marks.length ? marks[i + 1].t : dur;
    lines.push(`Dialogue: 1,${ts(start)},${ts(end)},Cap,,0,0,0,,{\\fad(140,140)}${esc(m.caption)}`);
  });
  return `${lines.join("\n")}\n`;
}

export async function renderOne(slug) {
  await ensureDirs();
  const meta = JSON.parse(await readFile(path.join(RAW, `${slug}.json`), "utf8"));
  const dur = meta.end - meta.ready + 0.4;
  const ass = path.join(RAW, `${slug}.ass`);
  await writeFile(ass, buildAss(meta, dur));
  const { crop } = meta;
  // 切り出し → 幅 1000・高さ 820 に収める → 1080 角の暗い背景に中央配置 → テロップ
  const vf = [
    `crop=${crop.w}:${crop.h}:${crop.x}:${crop.y}`,
    "scale=w=1000:h=820:force_original_aspect_ratio=decrease:flags=lanczos",
    "pad=1080:1080:(ow-iw)/2:(oh-ih)/2+10:color=#0b0b0c",
    "format=yuv420p",
    `ass=${ass.replace(/:/g, "\\:")}`,
  ].join(",");
  const out = path.join(OUT, `${slug}.mp4`);
  await run("ffmpeg", [
    "-y", "-hide_banner", "-loglevel", "error",
    "-ss", meta.ready.toFixed(2), "-i", meta.video,
    "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
    "-t", dur.toFixed(2),
    "-vf", vf, "-r", "30",
    "-c:v", "libx264", "-preset", "slow", "-crf", "19", "-profile:v", "high", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "64k", "-shortest", "-movflags", "+faststart",
    out,
  ]);
  const { stdout } = await run("ffprobe", ["-v", "error", "-show_entries", "format=duration,size", "-of", "csv=p=0", out]);
  const [d, size] = stdout.trim().split(",");
  console.log(`render ${slug}: ${path.relative(process.cwd(), out)} ${Number(d).toFixed(1)}s ${(Number(size) / 1024 / 1024).toFixed(2)}MB`);
  return { out, duration: Number(d) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === new URL(import.meta.url).pathname) {
  const slugs = process.argv.slice(2);
  if (!slugs.length) {
    console.error("使い方: node clips/render.mjs <slug> [slug ...]");
    process.exit(1);
  }
  for (const s of slugs) await renderOne(s);
}

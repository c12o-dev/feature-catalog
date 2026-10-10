import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/*
 * Build-time Open Graph images. Satori cannot read woff2, so we load Fontsource's .woff
 * unicode-range slices — only the ones that cover the glyphs this image actually uses.
 */

export const OG_SIZE = { width: 1200, height: 630 };

type Face = { name: string; weight: 400 | 700; css: string };
const FACES: Face[] = [
  { name: "Shippori", weight: 700, css: "node_modules/@fontsource/shippori-mincho-b1/700.css" },
  { name: "Zen", weight: 400, css: "node_modules/@fontsource/zen-kaku-gothic-new/400.css" },
];

type Slice = { file: string; ranges: [number, number][] };
const sliceCache = new Map<string, Slice[]>();

async function slices(face: Face): Promise<Slice[]> {
  const hit = sliceCache.get(face.css);
  if (hit) return hit;
  const css = await readFile(join(/*turbopackIgnore: true*/ process.cwd(), face.css), "utf8");
  const dir = join(/*turbopackIgnore: true*/ process.cwd(), face.css, "..", "files");
  const out: Slice[] = [];
  for (const block of css.split("@font-face").slice(1)) {
    const woff = block.match(/url\(\.\/files\/([^)]+\.woff)\)/)?.[1];
    const range = block.match(/unicode-range:\s*([^;]+);/)?.[1];
    if (!woff || !range) continue;
    const ranges = range.split(",").map((r) => {
      const [a, b] = r.trim().replace(/^U\+/i, "").split("-");
      const lo = parseInt(a, 16);
      return [lo, b ? parseInt(b, 16) : lo] as [number, number];
    });
    out.push({ file: join(dir, woff), ranges });
  }
  sliceCache.set(face.css, out);
  return out;
}

async function fontsFor(text: string) {
  const cps = new Set(Array.from(text).map((c) => c.codePointAt(0)!));
  const fonts: { name: string; data: ArrayBuffer; weight: 400 | 700; style: "normal" }[] = [];
  for (const face of FACES) {
    for (const s of await slices(face)) {
      if (![...cps].some((cp) => s.ranges.some(([lo, hi]) => cp >= lo && cp <= hi))) continue;
      const buf = await readFile(s.file);
      fonts.push({ name: face.name, data: buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer, weight: face.weight, style: "normal" });
    }
  }
  return fonts;
}

/** Replaces glyphs the bundled slices can't draw, which Satori would otherwise try to fetch over the network.
    Geometric shapes and symbols (U+25A0–27BF, e.g. ● ★) fall inside a slice's unicode-range but have no glyph in these faces. */
async function coveredText(text: string) {
  const all = (await Promise.all(FACES.map(slices))).flat();
  const covered = (cp: number) => all.some((s) => s.ranges.some(([lo, hi]) => cp >= lo && cp <= hi));
  return Array.from(text)
    .map((ch) => {
      const cp = ch.codePointAt(0)!;
      return /\s/.test(ch) || (covered(cp) && !(cp >= 0x25a0 && cp <= 0x27bf)) ? ch : "・";
    })
    .join("");
}

/** OKLCH → sRGB hex (Satori has no oklch()). */
export function oklchHex(l: number, c: number, h: number) {
  const hr = (h * Math.PI) / 180;
  const a = c * Math.cos(hr), b = c * Math.sin(hr);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const lin = [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];
  return (
    "#" +
    lin
      .map((v) => {
        const x = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
        return Math.round(Math.min(1, Math.max(0, x)) * 255).toString(16).padStart(2, "0");
      })
      .join("")
  );
}

export async function renderOg(input: { eyebrow: string; title: string; sub?: string; hue?: number }) {
  const { hue = 75 } = input;
  const eyebrow = await coveredText(input.eyebrow);
  const title = await coveredText(input.title);
  const sub = input.sub && (await coveredText(input.sub));
  const accent = oklchHex(0.8, 0.13, hue);
  const glow = oklchHex(0.45, 0.12, hue);
  const footer = "features.c12o.net";
  const fonts = await fontsFor(`${eyebrow}${title}${sub ?? ""}${footer}§0123456789·-—`);
  const size = title.length > 26 ? 64 : title.length > 14 ? 80 : 104;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0b0b0c",
          backgroundImage: `radial-gradient(circle at 92% 0%, ${glow}, transparent 55%)`,
          color: "#f4f3ef",
          fontFamily: "Zen",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 26, color: accent, letterSpacing: 2 }}>
          <div style={{ width: 48, height: 2, background: accent }} />
          {eyebrow}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ fontFamily: "Shippori", fontSize: size, lineHeight: 1.15, letterSpacing: -1, display: "flex", flexWrap: "wrap" }}>{title}</div>
          {sub && <div style={{ fontSize: 30, color: "rgba(244,243,239,0.6)", lineHeight: 1.5, display: "flex" }}>{sub}</div>}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 24, color: "rgba(244,243,239,0.45)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontFamily: "Shippori", fontSize: 44, color: "#e8b458" }}>§</span>
            <span style={{ fontFamily: "Shippori", color: "#f4f3ef" }}>Feature Catalog</span>
          </div>
          <span>{footer}</span>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}

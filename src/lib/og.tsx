import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/*
 * Build-time Open Graph images. Satori reads woff (not woff2) and works best with one font per
 * family, so scripts/fonts/subset.py writes a single subset of each face holding every character
 * the catalog can put on a card (assets/fonts/og/). tests/fonts.test.ts guards the coverage.
 */

export const OG_SIZE = { width: 1200, height: 630 };

type OgFont = { name: string; data: ArrayBuffer; weight: 400 | 700; style: "normal" };
let cached: Promise<{ fonts: OgFont[]; glyphs: Set<number> }> | null = null;

async function loadFonts() {
  const read = async (file: string) => {
    const buf = await readFile(join(/*turbopackIgnore: true*/ process.cwd(), "assets/fonts/og", file));
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
  };
  const charset = JSON.parse(await readFile(join(/*turbopackIgnore: true*/ process.cwd(), "assets/fonts/og/charset.json"), "utf8")) as string;
  return {
    fonts: [
      { name: "Shippori", data: await read("shippori-700.woff"), weight: 700, style: "normal" },
      { name: "Zen", data: await read("zen-400.woff"), weight: 400, style: "normal" },
    ] as OgFont[],
    glyphs: new Set(Array.from(charset).map((c) => c.codePointAt(0)!)),
  };
}

/** Replaces characters the OG subsets can't draw, which Satori would otherwise try to fetch over the network. */
function coveredText(text: string, glyphs: Set<number>) {
  return Array.from(text)
    .map((ch) => (/\s/.test(ch) || glyphs.has(ch.codePointAt(0)!) ? ch : "・"))
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
  cached ??= loadFonts();
  const { fonts, glyphs } = await cached;
  const eyebrow = coveredText(input.eyebrow, glyphs);
  const title = coveredText(input.title, glyphs);
  const sub = input.sub && coveredText(input.sub, glyphs);
  const accent = oklchHex(0.8, 0.13, hue);
  const glow = oklchHex(0.45, 0.12, hue);
  const footer = "feature-catalog.c12o.net";
  // "\n" in a title is a deliberate break; size by the longest line
  const lines = title.split("\n");
  const longest = Math.max(...lines.map((l) => l.length));
  const size = longest > 26 ? 64 : longest > 14 ? 80 : 104;
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
          <div style={{ fontFamily: "Shippori", fontWeight: 700, fontSize: size, lineHeight: 1.15, letterSpacing: -1, display: "flex", flexDirection: "column" }}>
            {lines.map((l, i) => (
              <div key={i} style={{ display: "flex", flexWrap: "wrap" }}>{l}</div>
            ))}
          </div>
          {sub && <div style={{ fontSize: 30, color: "rgba(244,243,239,0.6)", lineHeight: 1.5, display: "flex" }}>{sub}</div>}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 24, color: "rgba(244,243,239,0.45)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontFamily: "Shippori", fontWeight: 700, fontSize: 44, color: "#e8b458" }}>§</span>
            <span style={{ fontFamily: "Shippori", fontWeight: 700, color: "#f4f3ef" }}>Feature Catalog</span>
          </div>
          <span>{footer}</span>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}

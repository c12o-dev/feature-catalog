import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { categories } from "@/data/categories";
import { themes } from "@/data/goals";

/*
 * The self-hosted heading font is a subset cut around the site's own text (scripts/fonts/subset.py).
 * When copy changes, characters can fall outside them and silently render in a fallback face.
 * Regenerate: pnpm run build && node scripts/fonts/collect-glyphs.mjs && python3 scripts/fonts/subset.py
 */
const charset: Record<string, string> = JSON.parse(readFileSync("assets/fonts/charset.json", "utf8"));
// Symbols the faces themselves have no glyph for; they always render in a fallback.
const NOT_IN_FACE = new Set("π✓");
const missing = (face: string, text: string) => {
  const have = new Set(charset[face]);
  return [...new Set(text)].filter((ch) => ch.codePointAt(0)! > 0x7e && !/\s/.test(ch) && !have.has(ch) && !NOT_IN_FACE.has(ch)).join("");
};

describe("font subsets", () => {
  it("cover headings (pattern, category, theme and goal names) in Shippori Mincho B1", () => {
    const text = [
      ...categories.flatMap((c) => [c.name, ...c.patterns.map((p) => p.name)]),
      ...themes.flatMap((t) => [t.name, ...t.goals.map((g) => g.title)]),
    ].join("");
    expect(missing("mincho-700", text)).toBe("");
  });
});

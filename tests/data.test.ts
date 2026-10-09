import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { categories } from "@/data/categories";
import { themes } from "@/data/goals";
import { TAGS, patternNotes } from "@/data/pattern-notes";
import { demoMeta } from "@/data/demo-meta.generated";
import { LIVING_WALL, XRAY_SLUGS, entries, stats } from "@/lib/catalog";

const patterns = categories.flatMap((c) => c.patterns);
const slugs = new Set(patterns.map((p) => p.slug));

describe("catalog data", () => {
  it("has unique, url-safe pattern slugs", () => {
    expect(slugs.size).toBe(patterns.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("has unique category ids and slugs", () => {
    expect(new Set(categories.map((c) => c.id)).size).toBe(categories.length);
    expect(new Set(categories.map((c) => c.slug)).size).toBe(categories.length);
  });

  it("has unique pattern names", () => {
    expect(new Set(patterns.map((p) => p.name)).size).toBe(patterns.length);
  });

  it("points every demo at a generated registry entry", () => {
    for (const p of patterns) if (p.demo) expect(demoMeta, p.slug).toHaveProperty(p.demo);
  });

  it("uses every demo file at least once", () => {
    const used = new Set(patterns.map((p) => p.demo));
    for (const key of Object.keys(demoMeta)) expect(used.has(key), key).toBe(true);
  });

  it("keeps the generated registry in sync with the demo files", () => {
    const files = readdirSync("src/components/demos").filter((f) => f.endsWith(".tsx") && f !== "registry.tsx" && !f.startsWith("_"));
    expect(Object.keys(demoMeta).length).toBe(files.length);
    const registry = readFileSync("src/components/demos/registry.tsx", "utf8");
    for (const key of Object.keys(demoMeta)) expect(registry).toContain(`${key}: d(`);
  });

  it("resolves aliasOf to a pattern that shares the same demo", () => {
    for (const p of patterns.filter((p) => p.aliasOf)) {
      const target = patterns.find((x) => x.slug === p.aliasOf);
      expect(target, p.slug).toBeDefined();
      expect(target!.demo).toBe(p.demo);
      expect(target!.aliasOf).toBeUndefined();
    }
  });

  it("resolves every goal reference", () => {
    const ids = new Set(categories.map((c) => c.id));
    for (const t of themes)
      for (const g of t.goals) {
        for (const s of g.patterns) expect(slugs.has(s), `${g.title} → ${s}`).toBe(true);
        for (const id of g.categoryRefs) expect(ids.has(id), `${g.title} → §${id}`).toBe(true);
      }
  });

  it("has notes and valid tags for every pattern", () => {
    for (const p of patterns) {
      const n = patternNotes[p.slug];
      expect(n, p.slug).toBeDefined();
      expect(n.notes.length, p.slug).toBeGreaterThanOrEqual(30);
      expect(n.tags.length, p.slug).toBeGreaterThanOrEqual(1);
      for (const t of n.tags) expect(TAGS).toContain(t);
    }
    for (const s of Object.keys(patternNotes)) expect(slugs.has(s), s).toBe(true);
  });

  it("never marks an empty example as verified", () => {
    for (const p of patterns) if (p.example?.verified) expect(p.example.text.trim()).not.toBe("");
  });

  it("only labels patterns that exist", () => {
    for (const s of [...XRAY_SLUGS, ...LIVING_WALL]) expect(slugs.has(s), s).toBe(true);
  });

  it("derives the headline numbers from data", () => {
    expect(stats.patterns).toBe(entries.length);
    expect(stats.uniqueDemos).toBe(entries.filter((e) => e.demo && !e.aliasOf).length);
  });
});

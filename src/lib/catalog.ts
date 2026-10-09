import { categories, type Category, type Pattern } from "@/data/categories";
import { themes, type Goal, type Theme } from "@/data/goals";
import { patternNotes, type Tag } from "@/data/pattern-notes";
import { demoMeta, type DemoMeta } from "@/data/demo-meta.generated";

export const SITE = {
  name: "Feature Catalog",
  url: "https://features.c12o.net",
  repo: "https://github.com/c12o-dev/feature-catalog",
  author: "Seu (c12o)",
  portal: "https://c12o.net",
  blog: "https://blog.c12o.net",
  description:
    "草チャート、コマンドパレット、AI ストリーミング表示。モダン Web の「ユーザーから見える機能」341 パターンを、動くデモ付きで索引化したカタログ。",
} as const;

/** OKLCH hue per category, grouped into 8 families (v2-launch §3.2). */
const HUES: Record<string, number> = {
  "data-visualization": 250, maps: 250, media: 250,
  "search-nav": 200, layout: 200, mobile: 200,
  forms: 150, auth: 150, security: 150,
  onboarding: 110, collaboration: 110, content: 110, "perf-feedback": 110, motion: 110, a11y: 110,
  "ai-integration": 290, personalization: 290,
  commerce: 340, trust: 340,
  engagement: 25, social: 25, notifications: 25,
  meta: 75, "dev-features": 75, help: 75,
};

/** Short English labels used as display type next to the Japanese names. */
const EN: Record<string, string> = {
  "data-visualization": "Data Visualization", onboarding: "Onboarding", "ai-integration": "AI",
  auth: "Auth", "search-nav": "Search & Navigation", collaboration: "Collaboration",
  notifications: "Notifications", content: "Content", forms: "Forms", layout: "Layout",
  trust: "Trust", engagement: "Engagement", personalization: "Personalization", commerce: "Commerce",
  "perf-feedback": "Perceived Performance", motion: "Motion", mobile: "Mobile", a11y: "Accessibility",
  maps: "Maps", media: "Media", social: "Social", security: "Security", help: "Help & Support",
  "dev-features": "Developer", meta: "Meta",
};

const pad = (n: number | string) => String(n).padStart(2, "0");

export type CategoryInfo = Category & { hue: number; en: string; code: string; demoCount: number };
export type Entry = Pattern & {
  category: CategoryInfo;
  /** position inside its category, 0-based */
  index: number;
  /** §01-03 */
  code: string;
  notes?: string;
  tags: Tag[];
  meta?: DemoMeta;
};

export const categoryList: CategoryInfo[] = categories.map((c) => ({
  ...c,
  hue: HUES[c.slug] ?? 75,
  en: EN[c.slug] ?? c.slug,
  code: `§${pad(c.id)}`,
  demoCount: c.patterns.filter((p) => p.demo).length,
}));

export const entries: Entry[] = categoryList.flatMap((c) =>
  c.patterns.map((p, i) => ({
    ...p,
    category: c,
    index: i,
    code: `§${pad(c.id)}-${pad(i + 1)}`,
    notes: patternNotes[p.slug]?.notes,
    tags: patternNotes[p.slug]?.tags ?? [],
    meta: p.demo ? demoMeta[p.demo] : undefined,
  })),
);

const bySlug = new Map(entries.map((e) => [e.slug, e]));

export const getEntry = (slug: string) => bySlug.get(slug);
export const getCategory = (slug: string) => categoryList.find((c) => c.slug === slug);
export const getTheme = (slug: string) => themes.find((t) => t.slug === slug);
export { themes };
export type { Goal, Theme };

export function neighbours<T>(list: T[], item: T) {
  const i = list.indexOf(item);
  return { prev: i > 0 ? list[i - 1] : undefined, next: i < list.length - 1 ? list[i + 1] : undefined };
}

export function goalsFor(slug: string) {
  return themes.flatMap((t) => t.goals.map((g, i) => ({ theme: t, goal: g, index: i })).filter((x) => x.goal.patterns.includes(slug)));
}

export function aliasesOf(slug: string) {
  return entries.filter((e) => e.aliasOf === slug);
}

export const stats = {
  categories: categoryList.length,
  patterns: entries.length,
  /** demos not shared with another pattern */
  uniqueDemos: entries.filter((e) => e.demo && !e.aliasOf).length,
  goals: themes.reduce((s, t) => s + t.goals.length, 0),
  themes: themes.length,
};

export function sourceUrl(e: Entry) {
  return e.meta ? `${SITE.repo}/blob/main/${e.meta.file}` : undefined;
}

/** Deterministic "pattern of the day" (UTC date seed). */
export function patternOfTheDay(date = new Date()) {
  const key = Number(`${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}`);
  const withDemo = entries.filter((e) => e.demo && !e.aliasOf);
  return withDemo[(key * 2654435761) % withDemo.length];
}

/** Compact index shipped to the client for ⌘K and the 404 search. */
export type SearchItem = { s: string; n: string; d: string; c: string; h: number; k?: string; cat: string };
export const searchIndex: SearchItem[] = entries.map((e) => ({
  s: e.slug,
  n: e.name,
  d: e.description,
  c: e.code,
  h: e.category.hue,
  k: e.demo,
  cat: e.category.name,
}));

/** Shell pieces labelled by X-ray mode, plus the Living Wall tiles (v2-launch §4.7). */
export const LIVING_WALL = [
  "contribution-heatmap", "streaming-text", "progress-ring", "sparkline",
  "live-badge", "toggle-switch", "emoji-reactions", "skeleton-fade",
  "sortable-list", "waveform", "gauge", "number-roll",
] as const;

export const XRAY_SLUGS = [
  "sticky-shrink", "command-palette", "version-footer", "skip-link", "cursor-follower", "ambient-orb",
  "counter-tick", "anchor-toc", "view-transition", "empty-state", "scroll-driven", "hover-micro",
  "focus-ring", "theme-toggle", "skeleton-loader", "breadcrumb", "progress-bar", "recently-viewed",
  "prefetch-on-hover", "typeahead-search", "reduced-motion", ...LIVING_WALL,
];

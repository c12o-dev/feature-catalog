import { readFileSync } from "node:fs";

/** Every route in the built sitemap, plus a miss for the 404 page. */
export function allRoutes(): string[] {
  const xml = readFileSync("out/sitemap.xml", "utf8");
  const paths = [...xml.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map((m) => m[1] || "/");
  return [...paths, "/does-not-exist"];
}

/** Fixed set used for screenshots and axe (quality-loop §2.1). */
export const KEY_ROUTES = [
  "/",
  "/categories",
  "/c/data-visualization",
  "/c/motion",
  "/p/contribution-heatmap",
  "/p/command-palette",
  "/goals",
  "/g/experience",
  "/does-not-exist",
];

export const IGNORED_CONSOLE = /Download the React DevTools/;

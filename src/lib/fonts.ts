/*
 * The heading face is served per page group (scripts/fonts/subset.py): a shared common slice
 * under the base family, plus one file per group under its own family name. A page sets
 * `--font-serif` to its group's family first so the browser needs exactly those files.
 * The matching <link rel="preload"> tags are written into the static HTML after the build
 * (scripts/inject-font-preloads.mjs) rather than rendered here: anything React renders or hints
 * is also applied when a linked page is merely prefetched, which pulled every linked page's fonts.
 */
const MINCHO = "Shippori Mincho B1";

export type FontGroup = "home" | "hub" | `c-${string}` | `g-${string}`;

/** The `--font-serif` value for a page in `group`. */
export function headingFonts(group: FontGroup) {
  return { "--font-serif": `"${MINCHO} ${group}", "${MINCHO}", "${MINCHO} Fallback", "Hiragino Mincho ProN", "Yu Mincho", serif` } as React.CSSProperties;
}

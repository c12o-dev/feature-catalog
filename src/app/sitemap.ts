import type { MetadataRoute } from "next";
import { SITE, categoryList, entries, themes } from "@/lib/catalog";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${SITE.url}${p}`;
  return [
    { url: u("/"), priority: 1 },
    { url: u("/categories"), priority: 0.8 },
    { url: u("/goals"), priority: 0.8 },
    ...categoryList.map((c) => ({ url: u(`/c/${c.slug}`), priority: 0.7 })),
    ...themes.map((t) => ({ url: u(`/g/${t.slug}`), priority: 0.6 })),
    ...entries.map((e) => ({ url: u(`/p/${e.slug}`), priority: 0.5 })),
  ];
}

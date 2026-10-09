import { OG_SIZE, renderOg } from "@/lib/og";
import { stats } from "@/lib/catalog";

export const alt = "Feature Catalog — ユーザーから見える機能の語彙";
export const size = OG_SIZE;
export const dynamic = "force-static";
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: `${stats.categories} categories · ${stats.patterns} patterns`,
    title: `ユーザーから見える機能の、${stats.patterns} の語彙。`,
    sub: "モダン Web の機能パターンを、動くデモ付きで索引化。",
  });
}

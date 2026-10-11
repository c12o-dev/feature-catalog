import { OG_SIZE, renderOg } from "@/lib/og";
import { stats } from "@/lib/catalog";

export const alt = "Feature Catalog — UI パターンの、動くカタログ";
export const size = OG_SIZE;
export const dynamic = "force-static";
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: `${stats.categories} categories · ${stats.patterns} patterns`,
    title: "UI パターンの、\n動くカタログ。",
    sub: `草チャートから AI ストリーミングまで、${stats.patterns} パターンをデモで。`,
  });
}

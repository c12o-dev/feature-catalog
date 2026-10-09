import { OG_SIZE, renderOg } from "@/lib/og";
import { categoryList, getCategory } from "@/lib/catalog";

export const alt = "カテゴリの概要";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return categoryList.map((c) => ({ slug: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const c = getCategory((await params).slug)!;
  return renderOg({ eyebrow: `${c.code} · ${c.en}`, title: c.name, sub: `${c.patterns.length} パターン`, hue: c.hue });
}

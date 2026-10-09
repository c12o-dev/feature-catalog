import { OG_SIZE, renderOg } from "@/lib/og";
import { entries, getEntry } from "@/lib/catalog";

export const alt = "パターンの概要";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return entries.map((e) => ({ slug: e.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const e = getEntry((await params).slug)!;
  return renderOg({ eyebrow: `${e.code} · ${e.category.en}`, title: e.name, sub: e.description, hue: e.category.hue });
}

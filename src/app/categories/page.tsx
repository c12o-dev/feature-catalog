import type { Metadata } from "next";
import { CategoryIndex } from "@/components/catalog/category-index";
import { Breadcrumb } from "@/components/catalog/breadcrumb";
import { categoryList, stats } from "@/lib/catalog";
import { headingFonts } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "カテゴリ",
  description: `UI のかたちで分けた ${stats.categories} カテゴリ・${stats.patterns} パターンの索引。`,
  alternates: { canonical: "/categories" },
};

export default function CategoriesPage() {
  const fonts = headingFonts("hub");
  const samples = Object.fromEntries(categoryList.map((c) => [c.slug, c.patterns.slice(0, 4).map((p) => p.name)]));
  return (
    <div className="mx-auto max-w-[1440px] px-4 pt-10 sm:px-8 sm:pt-16" style={fonts}>
      <Breadcrumb items={[{ label: "カテゴリ" }]} />
      <header className="mt-10 mb-14 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
        <h1 className="fade-up text-[length:var(--fs-display)] leading-[1] tracking-[-0.02em] text-fg-1">カテゴリ</h1>
        <p className="fade-up max-w-md text-sm leading-relaxed text-fg-3 lg:justify-self-end" style={{ animationDelay: "120ms" }}>
          UI のかたちで {stats.categories} に分けました。可視化、フォーム、認証、モーション。似た見た目の機能が同じ棚に並びます。
        </p>
      </header>
      <CategoryIndex categories={categoryList} samples={samples} />
    </div>
  );
}

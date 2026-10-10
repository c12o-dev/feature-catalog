import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PatternCard } from "@/components/catalog/pattern-card";
import { Toc } from "@/components/catalog/toc";
import { Breadcrumb } from "@/components/catalog/breadcrumb";
import { categoryList, entries, getCategory, neighbours } from "@/lib/catalog";
import { headingFonts } from "@/lib/fonts";
import { TintHue } from "@/components/shell/tint-hue";
import { PageLoader } from "@/components/shell/page-loader";

export const dynamicParams = false;

export function generateStaticParams() {
  return categoryList.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/c/[slug]">): Promise<Metadata> {
  const c = getCategory((await params).slug);
  if (!c) return {};
  const names = c.patterns.slice(0, 4).map((p) => p.name).join("、");
  return {
    title: `${c.name}（${c.en}）`,
    description: `${c.name}のパターン ${c.patterns.length} 件を動くデモ付きで。${names} など。`,
    alternates: { canonical: `/c/${c.slug}` },
  };
}

/** Cards shown before the fold-out (§4.3). */
const FIRST = 8;

export default async function CategoryPage({ params }: PageProps<"/c/[slug]">) {
  const category = getCategory((await params).slug);
  if (!category) notFound();
  const fonts = headingFonts(`c-${category.slug}`);
  const list = entries.filter((e) => e.category.slug === category.slug);
  const { prev, next } = neighbours(categoryList, category);

  return (
    <div data-hue={category.hue} style={{ "--cat-hue": category.hue, ...fonts } as React.CSSProperties}>
      <PageLoader />
      <TintHue hue={category.hue} />
      <header className="mx-auto max-w-[1440px] px-4 pt-10 pb-12 sm:px-8 sm:pt-16 sm:pb-20">
        <Breadcrumb items={[{ href: "/categories", label: "カテゴリ" }, { label: category.name }]} />
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="idx fade-up mb-4 text-sm text-cat">{category.code}</p>
            <h1 className="fade-up text-[length:var(--fs-display)] leading-[1] tracking-[-0.02em] text-fg-1" style={{ animationDelay: "80ms" }}>
              {category.name}
            </h1>
            <p className="fade-up mt-4 font-serif text-2xl text-fg-3 italic sm:text-3xl" style={{ animationDelay: "160ms" }}>
              {category.en}
            </p>
          </div>
          <dl className="fade-up flex gap-10 font-mono text-sm" style={{ animationDelay: "240ms" }}>
            <div>
              <dt className="text-[10px] tracking-[0.16em] text-fg-3 uppercase">Patterns</dt>
              <dd className="mt-1 text-3xl text-fg-1">{list.length}</dd>
            </div>
            <div>
              <dt className="text-[10px] tracking-[0.16em] text-fg-3 uppercase">Demos</dt>
              <dd className="mt-1 text-3xl text-fg-1">{list.filter((e) => e.demo).length}</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 pt-10 sm:px-8 lg:pt-0 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
        <aside>
          <Toc items={list.map((e) => ({ slug: e.slug, name: e.name, code: e.code }))} />
        </aside>
        <div>
          {list.slice(0, FIRST).map((e) => (
            // No Suspense boundary here: in the static HTML it is written as a pending boundary and
            // swapped in at the end of the document, which paints the cards twice (CLS).
            <PatternCard key={e.slug} entry={e} preload />
          ))}
          {list.length > FIRST && (
            // The rest is folded so long categories don't scroll for 20,000px. A TOC link (#slug) or
            // find-in-page opens it: browsers reveal a closed <details> that holds the target.
            <details className="group/more">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 border-t border-line-1 py-8 text-fg-2 transition-colors hover:text-fg-1 [&::-webkit-details-marker]:hidden">
                <span className="text-lg">残り {list.length - FIRST} 件のパターン</span>
                <span className="font-mono text-xs text-fg-3 group-open/more:hidden">{list.slice(FIRST, FIRST + 3).map((e) => e.name).join(" / ")} …</span>
              </summary>
              {list.slice(FIRST).map((e) => (
                <PatternCard key={e.slug} entry={e} />
              ))}
            </details>
          )}
        </div>
      </div>

      <nav aria-label="前後のカテゴリ" className="mx-auto mt-16 grid max-w-[1440px] gap-px border-y border-line-1 bg-line-1 px-0 sm:grid-cols-2 sm:px-8">
        {prev ? (
          <Link href={`/c/${prev.slug}`} data-hue={prev.hue} className="group flex flex-col gap-2 bg-bg-0 px-4 py-8 transition-colors hover:bg-bg-1 sm:px-6">
            <span className="flex items-center gap-2 text-xs text-fg-3"><ArrowLeft className="size-3.5" /> 前のカテゴリ</span>
            <span className="text-2xl text-fg-1">{prev.name}</span>
          </Link>
        ) : <span className="bg-bg-0" />}
        {next ? (
          <Link href={`/c/${next.slug}`} data-hue={next.hue} className="group flex flex-col items-end gap-2 bg-bg-0 px-4 py-8 text-right transition-colors hover:bg-bg-1 sm:px-6">
            <span className="flex items-center gap-2 text-xs text-fg-3">次のカテゴリ <ArrowRight className="size-3.5" /></span>
            <span className="text-2xl text-fg-1">{next.name}</span>
          </Link>
        ) : <span className="bg-bg-0" />}
      </nav>
    </div>
  );
}

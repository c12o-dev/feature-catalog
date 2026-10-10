import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Breadcrumb } from "@/components/catalog/breadcrumb";
import { Stage } from "@/components/stage/stage";
import { categoryList, getCategory, getEntry, getTheme, neighbours, themes } from "@/lib/catalog";
import { headingFonts } from "@/lib/fonts";

export const dynamicParams = false;

export function generateStaticParams() {
  return themes.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/g/[slug]">): Promise<Metadata> {
  const t = getTheme((await params).slug);
  if (!t) return {};
  return {
    title: `${t.name} — 目的から探す`,
    description: t.goals.map((g) => g.title).join("、"),
    alternates: { canonical: `/g/${t.slug}` },
  };
}

export default async function ThemePage({ params }: PageProps<"/g/[slug]">) {
  const theme = getTheme((await params).slug);
  if (!theme) notFound();
  const fonts = headingFonts(`g-${theme.slug}`);
  const { prev, next } = neighbours(themes, theme);

  return (
    <div className="mx-auto max-w-[1180px] px-4 pt-10 sm:px-8 sm:pt-16" style={fonts}>
      <Breadcrumb items={[{ href: "/goals", label: "目的" }, { label: theme.name }]} />
      <h1 className="fade-up mt-10 mb-12 text-[length:var(--fs-h2)] leading-[1.1] text-fg-2">{theme.name}</h1>
      <div className="space-y-24">
        {theme.goals.map((g, i) => {
          const list = g.patterns.map((s) => getEntry(s)).filter((e) => !!e);
          return (
            <section key={g.title} id={`g${i}`} aria-labelledby={`g${i}-h`} className="scroll-mt-24">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line-1 pb-6">
                <h2 id={`g${i}-h`} className="max-w-4xl text-[length:var(--fs-h1)] leading-[1.2] text-fg-1">{g.title}</h2>
                <div className="flex flex-wrap gap-2">
                  {g.categoryRefs.map((id) => {
                    const c = getCategory(themesCategorySlug(id));
                    return c ? (
                      <Link key={id} href={`/c/${c.slug}`} data-hue={c.hue} style={{ "--cat-hue": c.hue } as React.CSSProperties} className="rounded-full border border-line-2 px-3 py-1 text-xs text-fg-2 transition-colors hover:border-cat hover:text-fg-1">
                        <span className="idx mr-1.5 text-cat">{c.code}</span>{c.name}
                      </Link>
                    ) : null;
                  })}
                </div>
              </div>
              {/* one row per pattern: name + description on the left, the demo on the right (§4.5) */}
              <ul className="divide-y divide-line-1">
                {list.map((e) => (
                  <li key={e.slug} data-hue={e.category.hue} style={{ "--cat-hue": e.category.hue } as React.CSSProperties} className="grid gap-4 py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:gap-10">
                    <div className="flex flex-col gap-3 md:justify-center">
                      <Link href={`/p/${e.slug}`} className="group">
                        <span className="idx mr-2 text-[11px] text-cat">{e.code}</span>
                        <span className="text-xl text-fg-1 decoration-cat/60 underline-offset-4 group-hover:underline">{e.name}</span>
                      </Link>
                      <p className="text-sm text-fg-2">{e.description}</p>
                      {e.notes && <p className="border-l border-cat/40 pl-4 text-sm leading-relaxed text-fg-3">{e.notes}</p>}
                      <span className="text-[11px] text-fg-3">{e.category.name}</span>
                    </div>
                    {e.demo && <Stage demo={e.demo} label={e.name} href={`/p/${e.slug}`} size="mini" />}
                  </li>
                ))}
              </ul>
              {g.external && (
                <p className="mt-8 font-mono text-xs text-fg-3">
                  参考:{" "}
                  {/^[\w.-]+\.[a-z]{2,}(\/\S*)?$/i.test(g.external) ? (
                    <a href={`https://${g.external}`} target="_blank" rel="noreferrer" className="text-fg-2 underline decoration-line-2 underline-offset-4 hover:text-fg-1">
                      {g.external}
                    </a>
                  ) : (
                    g.external
                  )}
                </p>
              )}
            </section>
          );
        })}
      </div>
      <nav aria-label="前後のテーマ" className="mt-24 flex justify-between gap-4 border-t border-line-1 pt-8 text-sm">
        {prev ? <Link href={`/g/${prev.slug}`} className="text-fg-2 hover:text-fg-1">← {prev.name}</Link> : <span />}
        {next ? <Link href={`/g/${next.slug}`} className="inline-flex items-center gap-1 text-fg-2 hover:text-fg-1">{next.name} <ArrowRight className="size-3.5" /></Link> : <span />}
      </nav>
    </div>
  );
}

function themesCategorySlug(id: string) {
  return categoryList.find((c) => c.id === id)?.slug ?? "";
}
